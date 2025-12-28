import './ActionButtons.css';

function ActionButtons({
    onProcess,
    onDownload,
    onReset,
    isProcessing,
    canProcess,
    hasVideo
}) {
    return (
        <div className="actions">
            <button
                onClick={onProcess}
                disabled={isProcessing || !canProcess}
                className="process-btn"
            >
                {isProcessing ? 'Processing...' : 'Process Video'}
            </button>

            {hasVideo && (
                <>
                    <button onClick={onDownload} className="download-btn">
                        Download Video
                    </button>
                    <button onClick={onReset} className="reset-btn">
                        Create Another
                    </button>
                </>
            )}
        </div>
    );
}

export default ActionButtons;
