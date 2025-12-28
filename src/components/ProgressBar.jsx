import './ProgressBar.css';

function ProgressBar({ progress, progressPercent, isProcessing, isCancelling, onCancel }) {
    if (!progress && !isProcessing) return null;

    return (
        <div className="progress-message">
            <div className="progress-header">
                <p>⏳ {progress || 'Processing...'}</p>
                {isProcessing && !isCancelling && (
                    <button
                        className="cancel-btn"
                        onClick={onCancel}
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
    );
}

export default ProgressBar;
