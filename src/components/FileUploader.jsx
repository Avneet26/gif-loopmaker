import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './FileUploader.css';

function FileUploader({ onImageSelect, onAudioSelect, imageFile, audioFile }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);

  // Cleanup preview URLs on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (audioPreview) {
        URL.revokeObjectURL(audioPreview);
      }
    };
  }, [audioPreview]);

  const onImageDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      console.warn('Rejected image files:', rejectedFiles);
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      try {
        onImageSelect(file);
        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result);
        };
        reader.onerror = () => {
          console.error('Error reading image file');
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error processing image file:', error);
      }
    }
  }, [onImageSelect]);

  const onAudioDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      console.warn('Rejected audio files:', rejectedFiles);
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      try {
        onAudioSelect(file);
        // Cleanup previous preview URL
        setAudioPreview((prev) => {
          if (prev) {
            URL.revokeObjectURL(prev);
          }
          return URL.createObjectURL(file);
        });
      } catch (error) {
        console.error('Error processing audio file:', error);
      }
    }
  }, [onAudioSelect]);

  const imageDropzone = useDropzone({
    onDrop: onImageDrop,
    accept: {
      'image/*': ['.gif', '.jpg', '.jpeg', '.png', '.webp'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const audioDropzone = useDropzone({
    onDrop: onAudioDrop,
    accept: {
      'audio/*': ['.mp3', '.m4a', '.wav', '.ogg'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleImageFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        onImageSelect(file);
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result);
        };
        reader.onerror = () => {
          console.error('Error reading image file');
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error processing image file:', error);
      }
    }
  };

  const handleAudioFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        onAudioSelect(file);
        // Cleanup previous preview URL
        setAudioPreview((prev) => {
          if (prev) {
            URL.revokeObjectURL(prev);
          }
          return URL.createObjectURL(file);
        });
      } catch (error) {
        console.error('Error processing audio file:', error);
      }
    }
  };

  return (
    <div className="file-uploader">
      <div className="upload-section">
        <h3>Upload Image or GIF</h3>
        <div
          {...imageDropzone.getRootProps()}
          className={`dropzone ${imageDropzone.isDragActive ? 'active' : ''}`}
        >
          <input {...imageDropzone.getInputProps()} />
          {imagePreview ? (
            <div className="preview-container">
              <img src={imagePreview} alt="Preview" className="preview-image" />
              <p className="file-name">{imageFile?.name}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  imageDropzone.inputRef.current?.click();
                }}
                className="change-file-btn"
              >
                Change File
              </button>
            </div>
          ) : (
            <div className="dropzone-content">
              <p>Drag and drop an image or GIF here, or click to select</p>
              <p className="file-hint">Supports: GIF, JPG, PNG, WebP</p>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageFileSelect}
          ref={imageDropzone.inputRef}
          style={{ display: 'none' }}
        />
      </div>

      <div className="upload-section">
        <h3>Upload Audio Track (MP3)</h3>
        <div
          {...audioDropzone.getRootProps()}
          className={`dropzone ${audioDropzone.isDragActive ? 'active' : ''}`}
        >
          <input {...audioDropzone.getInputProps()} />
          {audioPreview ? (
            <div className="preview-container">
              <audio controls src={audioPreview} className="preview-audio" />
              <p className="file-name">{audioFile?.name}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  audioDropzone.inputRef.current?.click();
                }}
                className="change-file-btn"
              >
                Change File
              </button>
            </div>
          ) : (
            <div className="dropzone-content">
              <p>Drag and drop an audio file here, or click to select</p>
              <p className="file-hint">Supports: MP3, M4A, WAV, OGG</p>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="audio/*"
          onChange={handleAudioFileSelect}
          ref={audioDropzone.inputRef}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}

export default FileUploader;

