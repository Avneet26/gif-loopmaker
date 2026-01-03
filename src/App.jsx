import { useState, useRef, useEffect } from 'react';
import { processVideo, downloadFile, createVideoURL, createAbortController, cancelProcessing } from './services/videoProcessor';

// Components
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import QualitySelector from './components/QualitySelector';
import ProgressBar from './components/ProgressBar';
import ErrorMessage from './components/ErrorMessage';
import ActionButtons from './components/ActionButtons';
import VideoPreview from './components/VideoPreview';
import InfoSection from './components/InfoSection';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';

// Analytics
import {
  trackImageUpload,
  trackAudioUpload,
  trackQualityChange,
  trackProcessStart,
  trackProcessComplete,
  trackProcessError,
  trackProcessCancel,
  trackDownload,
  trackReset,
  trackThemeToggle
} from './utils/analytics';

import './App.css';

function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // File state
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [progress, setProgress] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [quality, setQualityState] = useState('balanced');

  // Wrapper to track quality changes
  const setQuality = (newQuality) => {
    setQualityState(newQuality);
    trackQualityChange(newQuality);
  };

  // Output state
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);

  // Refs
  const videoUrlRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Handlers
  const handleImageSelect = (file) => {
    setImageFile(file);
    setError(null);
    setVideoUrl(null);
    // Track image upload
    const fileType = file.type.split('/')[1] || file.name.split('.').pop();
    trackImageUpload(fileType, file.size);
  };

  const handleAudioSelect = (file) => {
    setAudioFile(file);
    setError(null);
    setVideoUrl(null);
    // Track audio upload
    const fileType = file.type.split('/')[1] || file.name.split('.').pop();
    trackAudioUpload(fileType, file.size);
  };

  // Log event to Discord (via serverless function)
  const logEvent = async (event, extraData = {}) => {
    try {
      await fetch('/api/log-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event,
          quality,
          imageType: imageFile?.type?.split('/')[1]?.toUpperCase() || 'Unknown',
          audioType: audioFile?.type?.split('/')[1]?.toUpperCase() || 'Unknown',
          ...extraData
        })
      });
    } catch (err) {
      // Silently fail - don't disrupt user experience
      console.log('Analytics event not sent');
    }
  };

  const handleProcess = async () => {
    if (!imageFile || !audioFile) {
      setError('Please select both an image/GIF and an audio file');
      return;
    }

    const startTime = Date.now(); // Track processing time

    // Track process start
    trackProcessStart({
      quality,
      image_type: imageFile.type.split('/')[1] || 'unknown',
      audio_type: audioFile.type.split('/')[1] || 'unknown',
    });

    setIsProcessing(true);
    setError(null);
    setProgressPercent(0);

    // Clean up previous video URL
    if (videoUrlRef.current) {
      URL.revokeObjectURL(videoUrlRef.current);
      videoUrlRef.current = null;
    }
    setVideoUrl(null);
    setVideoBlob(null);
    setProgress('Loading FFmpeg...');
    setProgressPercent(5);

    // Create abort controller
    abortControllerRef.current = createAbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setProgress('Loading files...');
      setProgressPercent(10);
      await new Promise(resolve => setTimeout(resolve, 300));

      setProgress('Processing video (this may take a minute)...');
      setProgressPercent(15);

      const blob = await processVideo(imageFile, audioFile, quality, (progressValue) => {
        const mappedProgress = 15 + (progressValue * 75);
        setProgressPercent(Math.round(mappedProgress));
      }, signal);

      setProgress('Finalizing video...');
      setProgressPercent(90);

      setVideoBlob(blob);
      const url = createVideoURL(blob);
      videoUrlRef.current = url;
      setVideoUrl(url);

      // Log successful processing
      const processingTime = Math.round((Date.now() - startTime) / 1000);
      logEvent('video_processed', { processingTime });
      trackProcessComplete(processingTime, quality);

      setProgress('Video processed successfully!');
      setProgressPercent(100);

      setTimeout(() => {
        setProgress('');
        setProgressPercent(0);
      }, 3000);
    } catch (err) {
      console.error('Processing error:', err);

      const wasCancelled = err.message?.includes('cancelled') ||
        err.message?.includes('Cancelled') ||
        err.message?.includes('terminated') ||
        abortControllerRef.current?.signal?.aborted;

      if (wasCancelled) {
        setProgress('Processing cancelled.');
        setProgressPercent(0);
        setTimeout(() => setProgress(''), 2000);
      } else {
        const errorMessage = err.message || 'Something went wrong while processing the video.';
        setError(errorMessage);
        setProgress('');
        setProgressPercent(0);
        trackProcessError(errorMessage);
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
      trackProcessCancel();
    }
  };

  const handleDownload = () => {
    if (videoBlob) {
      downloadFile(videoBlob, `loopervid_${Date.now()}.mp4`);
      trackDownload();
    }
  };

  const handleReset = () => {
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
    trackReset();
  };

  return (
    <div className="app">
      <ThemeToggle theme={theme} setTheme={setTheme} />
      <div className="container">
        <Header />

        <main className="main-content">
          <FileUploader
            onImageSelect={handleImageSelect}
            onAudioSelect={handleAudioSelect}
            imageFile={imageFile}
            audioFile={audioFile}
          />

          <ErrorMessage
            message={error}
            onDismiss={() => setError(null)}
          />

          <QualitySelector
            quality={quality}
            setQuality={setQuality}
            disabled={isProcessing}
          />

          <ProgressBar
            progress={progress}
            progressPercent={progressPercent}
            isProcessing={isProcessing}
            isCancelling={isCancelling}
            onCancel={handleCancel}
          />

          <ActionButtons
            onProcess={handleProcess}
            onDownload={handleDownload}
            onReset={handleReset}
            isProcessing={isProcessing}
            canProcess={imageFile && audioFile}
            hasVideo={!!videoUrl}
          />

          <VideoPreview videoUrl={videoUrl} />

          <InfoSection />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
