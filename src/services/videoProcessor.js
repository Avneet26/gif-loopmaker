import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpegInstance = null;
let isLoaded = false;
let currentAbortController = null;

/**
 * Initializes FFmpeg instance and loads the core
 * @returns {Promise<FFmpeg>} Initialized FFmpeg instance
 */
async function loadFFmpeg() {
  if (isLoaded && ffmpegInstance) {
    return ffmpegInstance;
  }

  const ffmpeg = new FFmpeg();
  ffmpegInstance = ffmpeg;

  // Set up logging
  ffmpeg.on('log', ({ message }) => {
    console.log('FFmpeg:', message);
  });

  // Set up progress tracking
  ffmpeg.on('progress', ({ progress, time }) => {
    if (progress !== undefined) {
      console.log(`FFmpeg progress: ${(progress * 100).toFixed(2)}%`);
    }
  });

  try {
    // Load FFmpeg core
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';

    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
    } catch (loadError) {
      console.error('Error loading FFmpeg core files:', loadError);

      // Check for specific error types
      if (loadError.message && loadError.message.includes('fetch')) {
        throw new Error('Failed to download FFmpeg files. Please check your internet connection and try again.');
      } else if (loadError.message && loadError.message.includes('SharedArrayBuffer')) {
        throw new Error('Your browser does not support SharedArrayBuffer. Please use a modern browser like Chrome, Firefox, or Edge.');
      } else {
        throw new Error('Failed to load FFmpeg. Please refresh the page and try again.');
      }
    }

    isLoaded = true;
    console.log('FFmpeg loaded successfully');
    return ffmpeg;
  } catch (error) {
    console.error('Error loading FFmpeg:', error);
    // Re-throw with user-friendly message if it's already our custom error
    if (error.message && error.message.startsWith('Failed to')) {
      throw error;
    }
    throw new Error('Something went wrong while loading FFmpeg. Please refresh the page and try again.');
  }
}

/**
 * Creates a new AbortController for the current processing operation
 * @returns {AbortController} The abort controller for cancellation
 */
export function createAbortController() {
  currentAbortController = new AbortController();
  return currentAbortController;
}

/**
 * Cancels the current video processing operation
 */
export function cancelProcessing() {
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;
  }
  // Terminate FFmpeg if it's running
  if (ffmpegInstance) {
    try {
      ffmpegInstance.terminate();
      ffmpegInstance = null;
      isLoaded = false;
    } catch (e) {
      console.warn('Error terminating FFmpeg:', e);
    }
  }
}

/**
 * Processes video by combining image/GIF with audio using FFmpeg.wasm
 * @param {File} imageFile - The image or GIF file
 * @param {File} audioFile - The MP3 audio file
 * @param {string} quality - Quality preset: 'fast', 'balanced', or 'high'
 * @param {Function} onProgress - Optional progress callback (progress: number 0-1)
 * @param {AbortSignal} signal - Optional abort signal for cancellation
 * @returns {Promise<Blob>} - Blob of the processed video
 */
export async function processVideo(imageFile, audioFile, quality = 'balanced', onProgress, signal) {
  // Validate inputs
  if (!imageFile) {
    throw new Error('Image file is required');
  }
  if (!audioFile) {
    throw new Error('Audio file is required');
  }

  // Validate file types
  const imageTypes = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!imageTypes.includes(imageFile.type)) {
    throw new Error('Invalid image file type. Please upload a GIF, JPG, PNG, or WebP image.');
  }

  const audioTypes = ['audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/wav', 'audio/ogg', 'audio/m4a'];
  if (!audioTypes.includes(audioFile.type)) {
    throw new Error('Invalid audio file type. Please upload an MP3, M4A, WAV, or OGG audio file.');
  }

  // Validate file sizes (30MB limit for client-side processing)
  const maxSize = 30 * 1024 * 1024; // 30MB
  if (imageFile.size > maxSize) {
    throw new Error('Image file is too large. Maximum size is 30MB for client-side processing.');
  }
  if (audioFile.size > maxSize) {
    throw new Error('Audio file is too large. Maximum size is 30MB for client-side processing.');
  }

  try {
    // Check if cancelled
    if (signal?.aborted) {
      throw new Error('Processing was cancelled.');
    }

    // Load FFmpeg if not already loaded
    const ffmpeg = await loadFFmpeg();

    // Check if cancelled after loading
    if (signal?.aborted) {
      throw new Error('Processing was cancelled.');
    }

    // Report initial progress
    if (onProgress) {
      onProgress(0.1); // 10% - FFmpeg loaded
    }

    // Set up progress callback if provided
    if (onProgress) {
      ffmpeg.on('progress', ({ progress: p }) => {
        if (p !== undefined && p !== null) {
          // FFmpeg progress is 0-1, we'll map it appropriately
          onProgress(p);
        }
      });
    }

    // Determine file extensions
    const imageExt = imageFile.name.split('.').pop().toLowerCase();
    const audioExt = audioFile.name.split('.').pop().toLowerCase();
    const imageName = `input.${imageExt}`;
    const audioName = `input.${audioExt}`;
    const outputName = 'output.mp4';
    const isGif = imageFile.type === 'image/gif' || imageExt === 'gif';

    // Check if cancelled before writing files
    if (signal?.aborted) {
      throw new Error('Processing was cancelled.');
    }

    // Write input files to FFmpeg's virtual file system
    console.log('Loading input files...');
    await ffmpeg.writeFile(imageName, await fetchFile(imageFile));
    await ffmpeg.writeFile(audioName, await fetchFile(audioFile));

    // Check if cancelled after writing files
    if (signal?.aborted) {
      throw new Error('Processing was cancelled.');
    }

    console.log(`Processing ${isGif ? 'GIF' : 'image'} with audio using FFmpeg...`);

    // Determine quality settings based on user selection
    let preset, crf, audioBitrate;
    switch (quality) {
      case 'fast':
        preset = 'ultrafast';
        crf = '30';
        audioBitrate = '128k';
        break;
      case 'high':
        preset = 'veryfast';
        crf = '23';
        audioBitrate = '192k';
        break;
      case 'balanced':
      default:
        preset = 'ultrafast';
        crf = '28';
        audioBitrate = '128k';
        break;
    }

    // Build FFmpeg command based on file type
    const ffmpegArgs = [];

    if (isGif) {
      // For GIFs: loop the GIF continuously to match audio length
      ffmpegArgs.push(
        '-i', imageName,
        '-i', audioName,
        '-filter_complex', '[0:v]loop=loop=-1:size=32767:start=0,setpts=N/FRAME_RATE/TB[v]',
        '-map', '[v]',
        '-map', '1:a',
        '-c:v', 'libx264',
        '-preset', preset,
        '-crf', crf,
        '-c:a', 'aac',
        '-b:a', audioBitrate,
        '-pix_fmt', 'yuv420p',
        '-shortest',
        '-movflags', '+faststart'
      );
    } else {
      // For static images: use -loop 1 to loop the image
      ffmpegArgs.push(
        '-loop', '1',
        '-i', imageName,
        '-i', audioName,
        '-c:v', 'libx264',
        '-preset', preset,
        '-crf', crf,
        '-tune', 'stillimage',
        '-c:a', 'aac',
        '-b:a', audioBitrate,
        '-pix_fmt', 'yuv420p',
        '-shortest',
        '-movflags', '+faststart'
      );
    }

    ffmpegArgs.push(outputName);

    await ffmpeg.exec(ffmpegArgs);

    console.log('Video processed. Reading output...');

    // Read the output file
    const data = await ffmpeg.readFile(outputName);

    // Clean up virtual files
    try {
      await ffmpeg.deleteFile(imageName);
      await ffmpeg.deleteFile(audioName);
      await ffmpeg.deleteFile(outputName);
    } catch (cleanupError) {
      console.warn('Error cleaning up virtual files:', cleanupError);
    }

    // Create a blob URL from the output
    const blob = new Blob([data], { type: 'video/mp4' });
    return blob;
  } catch (error) {
    console.error('Error processing video:', error);

    let errorMessage = 'Something went wrong while processing the video.';

    if (error.message) {
      // Use the error message if it's already user-friendly
      if (error.message.includes('Failed to') ||
        error.message.includes('does not support') ||
        error.message.includes('check your') ||
        error.message.includes('refresh the page')) {
        errorMessage = error.message;
      } else if (error.message.includes('Invalid')) {
        errorMessage = error.message;
      } else if (error.name === 'ExitCodeError' || error.message.includes('ExitCode')) {
        // FFmpeg exit code error - provide more helpful message
        const exitCode = error.message.match(/exit code (\d+)/i)?.[1] || 'unknown';
        errorMessage = `Video processing failed (exit code: ${exitCode}). The files may be corrupted, incompatible, or too large. Please try different files.`;
      } else if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        errorMessage = 'Processing took too long. The files may be too large. Please try smaller files.';
      } else if (error.message.includes('memory') || error.message.includes('Memory')) {
        errorMessage = 'Not enough memory to process the video. Please try smaller files or close other browser tabs.';
      } else if (error.message.includes('filter') || error.message.includes('Filter')) {
        errorMessage = 'Error processing the video. The GIF format may not be supported. Please try a different GIF or convert it to a static image.';
      } else {
        // Log the actual error for debugging
        console.error('Unhandled error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        // Generic error with helpful message
        errorMessage = 'Something went wrong while processing the video. Please check your files and try again. If the problem persists, try using a static image instead of a GIF.';
      }
    } else if (error.name === 'ExitCodeError') {
      errorMessage = 'Video processing failed. Please check your files and try again.';
    }

    throw new Error(errorMessage);
  }
}

/**
 * Downloads a file from a Blob
 * @param {Blob} blob - The blob to download
 * @param {string} filename - The filename for the download
 */
export function downloadFile(blob, filename = 'output.mp4') {
  try {
    if (!blob) {
      throw new Error('Blob is required');
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    // Clean up after a short delay
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw new Error('Failed to download video. Please try again.');
  }
}

/**
 * Creates a video URL from a Blob
 * @param {Blob} blob - The blob to create URL from
 * @returns {string} Object URL
 */
export function createVideoURL(blob) {
  if (!blob) {
    throw new Error('Blob is required');
  }
  return URL.createObjectURL(blob);
}
