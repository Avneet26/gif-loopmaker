import { useState, useEffect } from 'react';
import './ProgressBar.css';

function ProgressBar({ progress, progressPercent, isProcessing, isCancelling, onCancel, startTime }) {
    const [elapsedStr, setElapsedStr] = useState('00:00');
    const [remainingStr, setRemainingStr] = useState('Calculating...');

    useEffect(() => {
        if (!isProcessing || !startTime || isCancelling) {
            return;
        }

        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - startTime;
            
            // Format elapsed
            const eSec = Math.floor(elapsed / 1000) % 60;
            const eMin = Math.floor(elapsed / 60000);
            setElapsedStr(`${eMin.toString().padStart(2, '0')}:${eSec.toString().padStart(2, '0')}`);

            // Format remaining
            if (progressPercent > 5 && progressPercent < 100) {
                const totalEst = elapsed / (progressPercent / 100);
                const remaining = totalEst - elapsed;
                if (remaining > 0) {
                    const rSec = Math.floor(remaining / 1000) % 60;
                    const rMin = Math.floor(remaining / 60000);
                    setRemainingStr(`${rMin.toString().padStart(2, '0')}:${rSec.toString().padStart(2, '0')}`);
                } else {
                     setRemainingStr('almost done...');
                }
            } else if (progressPercent >= 100) {
                setRemainingStr('00:00');
            } else {
                setRemainingStr('Calculating...');
            }
        }, 1000);

        // Run once immediately
        if (progressPercent >= 100) {
             setRemainingStr('00:00');
        }

        return () => clearInterval(interval);
    }, [isProcessing, startTime, progressPercent, isCancelling]);
    if (!progress && !isProcessing) return null;

    return (
        <div className="progress-message glass-card">
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
            </div>
            <div className="progress-details">
                <div className="progress-timers">
                    <span>Elapsed: {elapsedStr}</span>
                    <span className="dot-separator">•</span>
                    <span>Remaining: {remainingStr}</span>
                </div>
                <div className="progress-numbered">
                    <span className="progress-text-numbered">
                        {progressPercent > 0 ? `${progressPercent}% Complete` : 'Loading...'}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ProgressBar;
