import { useState, useRef, useEffect } from 'react';
import './MinimalAudioPlayer.css';

const MinimalAudioPlayer = ({ src, fileName }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }, [src]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const dur = audioRef.current.duration;
    setCurrentTime(current);
    if (dur) setProgress((current / dur) * 100);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      if (audioRef.current && audioRef.current.duration) {
          audioRef.current.currentTime = percentage * audioRef.current.duration;
      }
  };

  return (
    <div className="custom-audio-player" onClick={(e) => e.stopPropagation()}>
      <audio 
        ref={audioRef} 
        src={src} 
        onTimeUpdate={handleTimeUpdate} 
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onEnded={() => setIsPlaying(false)} 
      />
      <button className="play-pause-btn" onClick={togglePlay} type="button">
        {isPlaying ? '⏸' : '▶'}
      </button>
      <div className="track-info">
        <span className="track-name">{fileName || 'Audio Track'}</span>
        <div className="progress-wrapper">
            <span className="time-text">{formatTime(currentTime)}</span>
            <div className="progress-container" onClick={handleSeek}>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <span className="time-text">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default MinimalAudioPlayer;
