import './VideoPreview.css';

function VideoPreview({ videoUrl }) {
    if (!videoUrl) return null;

    return (
        <div className="video-preview">
            <h3>Preview</h3>
            <video controls src={videoUrl} className="output-video">
                Your browser does not support the video tag.
            </video>
        </div>
    );
}

export default VideoPreview;
