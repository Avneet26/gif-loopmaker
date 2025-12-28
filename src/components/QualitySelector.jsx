import './QualitySelector.css';

function QualitySelector({ quality, setQuality, disabled }) {
    return (
        <div className="quality-selector">
            <label htmlFor="quality-select">Processing Quality:</label>
            <select
                id="quality-select"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                disabled={disabled}
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
    );
}

export default QualitySelector;
