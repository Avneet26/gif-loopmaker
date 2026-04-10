import './AdvancedSettings.css';

function AdvancedSettings({ settings, setSettings, disabled }) {
    const handleVideoChange = (e) => {
        setSettings({ ...settings, videoResolution: e.target.value });
    };

    const handleAudioChange = (e) => {
        setSettings({ ...settings, audioBitrate: e.target.value });
    };

    const showWarning = settings.videoResolution === '2k' || settings.videoResolution === '4k';

    return (
        <div className="advanced-settings-panel glass-card">
            <h3 className="settings-title">⚙️ Export Settings</h3>

            <div className="settings-grid">
                <div className="settings-group">
                    <label htmlFor="video-resolution">Video Resolution:</label>
                    <select
                        id="video-resolution"
                        value={settings.videoResolution}
                        onChange={handleVideoChange}
                        disabled={disabled}
                        className="settings-select"
                    >
                        <option value="720p">720p (HD)</option>
                        <option value="1080p">1080p (Full HD)</option>
                        <option value="2k">1440p (2K)</option>
                        <option value="4k">2160p (4K)</option>
                    </select>
                </div>

                <div className="settings-group">
                    <label htmlFor="audio-bitrate">Audio Bitrate:</label>
                    <select
                        id="audio-bitrate"
                        value={settings.audioBitrate}
                        onChange={handleAudioChange}
                        disabled={disabled}
                        className="settings-select"
                    >
                        <option value="128k">128 kbps (Standard)</option>
                        <option value="192k">192 kbps (High)</option>
                        <option value="256k">256 kbps (Premium)</option>
                        <option value="320k">320 kbps (Maximum)</option>
                    </select>
                </div>
            </div>

            {showWarning && (
                <div className="settings-warning">
                    ⚠️ Warning: Exporting at 2K or 4K resolution can take a very long time depending on your device, and may consume significant memory.
                </div>
            )}
        </div>
    );
}

export default AdvancedSettings;
