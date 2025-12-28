import { useState, useRef } from 'react';
import FileUploader from './components/FileUploader';
import { processVideo, downloadFile, createVideoURL, createAbortController, cancelProcessing } from './services/videoProcessor';
import './App.css';

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [progress, setProgress] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [quality, setQuality] = useState('balanced'); // 'fast', 'balanced', 'high'
  const [isCancelling, setIsCancelling] = useState(false);
  const videoUrlRef = useRef(null);
  const abortControllerRef = useRef(null);

  const handleImageSelect = (file) => {
    setImageFile(file);
    setError(null);
    setVideoUrl(null);
  };

  const handleAudioSelect = (file) => {
    setAudioFile(file);
    setError(null);
    setVideoUrl(null);
  };

  const handleProcess = async () => {
    if (!imageFile || !audioFile) {
      setError('Please select both an image/GIF and an audio file');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgressPercent(0);

    // Clean up previous video URL if exists
    if (videoUrlRef.current) {
      URL.revokeObjectURL(videoUrlRef.current);
      videoUrlRef.current = null;
    }
    setVideoUrl(null);
    setVideoBlob(null);
    setProgress('Loading FFmpeg...');
    setProgressPercent(5); // Show initial progress

    // Create abort controller for this processing session
    abortControllerRef.current = createAbortController();
    const signal = abortControllerRef.current.signal;

    try {
      // Update progress for file loading
      setProgress('Loading files...');
      setProgressPercent(10);

      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));

      setProgress('Processing video (this may take a minute)...');
      setProgressPercent(15);

      const blob = await processVideo(imageFile, audioFile, quality, (progressValue) => {
        // Map FFmpeg progress (0-1) to 15-90% range (since we start at 15%)
        const mappedProgress = 15 + (progressValue * 75);
        setProgressPercent(Math.round(mappedProgress));
      }, signal);

      setProgress('Finalizing video...');
      setProgressPercent(90);

      setVideoBlob(blob);
      const url = createVideoURL(blob);
      videoUrlRef.current = url;
      setVideoUrl(url);

      setProgress('Video processed successfully!');
      setProgressPercent(100);

      // Clear progress message after 3 seconds
      setTimeout(() => {
        setProgress('');
        setProgressPercent(0);
      }, 3000);
    } catch (err) {
      console.error('Processing error:', err);

      // Check if this was a cancellation - don't show error for cancellation
      const wasCancelled = err.message?.includes('cancelled') ||
        err.message?.includes('Cancelled') ||
        err.message?.includes('terminated') ||
        abortControllerRef.current?.signal?.aborted;

      if (wasCancelled) {
        // Gracefully handle cancellation - no error message
        setProgress('Processing cancelled.');
        setProgressPercent(0);
        // Clear the cancelled message after a moment
        setTimeout(() => {
          setProgress('');
        }, 2000);
      } else {
        let errorMessage = 'Something went wrong while processing the video.';

        if (err.message) {
          errorMessage = err.message;
        } else if (err.name) {
          // Handle specific error types
          switch (err.name) {
            case 'NetworkError':
            case 'TypeError':
              errorMessage = 'Network error occurred. Please check your internet connection and try again.';
              break;
            case 'QuotaExceededError':
              errorMessage = 'Browser storage limit exceeded. Please clear some space and try again.';
              break;
            default:
              errorMessage = 'An unexpected error occurred. Please try again.';
          }
        }

        setError(errorMessage);
        setProgress('');
        setProgressPercent(0);
      }
    } finally {
      setIsProcessing(false);
      setIsCancelling(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      setIsCancelling(true);
      setProgress('Cancelling...');
      cancelProcessing();
    }
  };

  const handleDownload = () => {
    if (videoBlob) {
      const filename = `video_${Date.now()}.mp4`;
      downloadFile(videoBlob, filename);
    }
  };

  const handleReset = () => {
    // Clean up video URL
    if (videoUrlRef.current) {
      URL.revokeObjectURL(videoUrlRef.current);
      videoUrlRef.current = null;
    }

    setImageFile(null);
    setAudioFile(null);
    setVideoUrl(null);
    setVideoBlob(null);
    setError(null);
    setProgress('');
    setProgressPercent(0);
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>GIF/Image + MP3 Video Maker</h1>
          <p className="subtitle">Upload an image/GIF and MP3 audio to create a video</p>
        </header>

        <main className="main-content">
          <FileUploader
            onImageSelect={handleImageSelect}
            onAudioSelect={handleAudioSelect}
            imageFile={imageFile}
            audioFile={audioFile}
          />

          {error && (
            <div className="error-message">
              <div className="error-content">
                <p>⚠️ {error}</p>
                <button
                  className="error-dismiss"
                  onClick={() => setError(null)}
                  aria-label="Dismiss error"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="quality-selector">
            <label htmlFor="quality-select">Processing Quality:</label>
            <select
              id="quality-select"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              disabled={isProcessing}
              className="quality-select"
            >
              <option value="fast">Fast (Lower Quality, Fastest)</option>
              <option value="balanced">Balanced (Good Quality, Fast)</option>
              <option value="high">High Quality (Best Quality, Slower)</option>
            </select>
            <p className="quality-hint">
              {quality === 'fast' && '⚡ Fastest processing, acceptable quality'}
              {quality === 'balanced' && '⚖️ Good balance of speed and quality'}
              {quality === 'high' && '✨ Best quality, slower processing'}
            </p>
          </div>

          {(progress || isProcessing) && (
            <div className="progress-message">
              <div className="progress-header">
                <p>⏳ {progress || 'Processing...'}</p>
                {isProcessing && !isCancelling && (
                  <button
                    className="cancel-btn"
                    onClick={handleCancel}
                    aria-label="Cancel processing"
                  >
                    ✕ Cancel
                  </button>
                )}
              </div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{ width: `${progressPercent}%` }}
                ></div>
                <span className="progress-text">
                  {progressPercent > 0 ? `${progressPercent}%` : 'Loading...'}
                </span>
              </div>
            </div>
          )}

          <div className="actions">
            <button
              onClick={handleProcess}
              disabled={isProcessing || !imageFile || !audioFile}
              className="process-btn"
            >
              {isProcessing ? 'Processing...' : 'Process Video'}
            </button>

            {videoUrl && (
              <>
                <button onClick={handleDownload} className="download-btn">
                  Download Video
                </button>
                <button onClick={handleReset} className="reset-btn">
                  Create Another
                </button>
              </>
            )}
          </div>

          {videoUrl && (
            <div className="video-preview">
              <h3>Preview</h3>
              <video controls src={videoUrl} className="output-video">
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </main>

        <footer className="footer">
          <p>Made with React + FFmpeg.wasm</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
