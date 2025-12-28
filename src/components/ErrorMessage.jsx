import './ErrorMessage.css';

function ErrorMessage({ message, onDismiss }) {
    if (!message) return null;

    return (
        <div className="error-message">
            <div className="error-content">
                <p>⚠️ {message}</p>
                <button
                    className="error-dismiss"
                    onClick={onDismiss}
                    aria-label="Dismiss error"
                >
                    ×
                </button>
            </div>
        </div>
    );
}

export default ErrorMessage;
