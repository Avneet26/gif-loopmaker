import { useState } from 'react';
import './InfoSection.css';

function InfoSection() {
    const [openPanel, setOpenPanel] = useState(null);

    const togglePanel = (panel) => {
        setOpenPanel(openPanel === panel ? null : panel);
    };

    return (
        <section className="info-section">
            <h2 className="info-section-title">ℹ️ About LooperVid</h2>

            {/* How to Use */}
            <div className="info-panel">
                <button
                    className={`info-panel-header ${openPanel === 'howto' ? 'active' : ''}`}
                    onClick={() => togglePanel('howto')}
                >
                    <span>📖 How to Use</span>
                    <span className="info-panel-icon">{openPanel === 'howto' ? '−' : '+'}</span>
                </button>
                {openPanel === 'howto' && (
                    <div className="info-panel-content">
                        <ol>
                            <li><strong>Upload an image or GIF</strong> — Drag & drop or click to browse</li>
                            <li><strong>Upload your audio</strong> — MP3, M4A, WAV, or OGG</li>
                            <li><strong>Select quality</strong> — Fast, Balanced, or High</li>
                            <li><strong>Click "Process Video"</strong> — Wait for the magic ✨</li>
                            <li><strong>Download</strong> — Your MP4 is ready for YouTube!</li>
                        </ol>
                        <p className="info-note">
                            <strong>Supported formats:</strong><br />
                            Images: GIF, JPG, PNG, WebP<br />
                            Audio: MP3, M4A, WAV, OGG
                        </p>
                    </div>
                )}
            </div>

            {/* Privacy */}
            <div className="info-panel">
                <button
                    className={`info-panel-header ${openPanel === 'privacy' ? 'active' : ''}`}
                    onClick={() => togglePanel('privacy')}
                >
                    <span>🔒 Privacy</span>
                    <span className="info-panel-icon">{openPanel === 'privacy' ? '−' : '+'}</span>
                </button>
                {openPanel === 'privacy' && (
                    <div className="info-panel-content">
                        <p><strong>Your files stay on YOUR device.</strong></p>
                        <p>
                            LooperVid processes videos entirely in your browser using WebAssembly technology.
                            Nothing is uploaded to any server. Your images, audio, and videos never leave your computer.
                        </p>
                        <ul>
                            <li>✅ No file uploads to servers</li>
                            <li>✅ No user accounts or tracking</li>
                            <li>✅ 100% client-side processing</li>
                            <li>✅ Works offline after first load</li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Troubleshooting */}
            <div className="info-panel">
                <button
                    className={`info-panel-header ${openPanel === 'troubleshoot' ? 'active' : ''}`}
                    onClick={() => togglePanel('troubleshoot')}
                >
                    <span>🔧 Troubleshooting</span>
                    <span className="info-panel-icon">{openPanel === 'troubleshoot' ? '−' : '+'}</span>
                </button>
                {openPanel === 'troubleshoot' && (
                    <div className="info-panel-content">
                        <div className="troubleshoot-item">
                            <strong>⚠️ "Failed to load FFmpeg"</strong>
                            <p>Check your internet connection (FFmpeg loads from CDN on first use). Refresh the page and try again.</p>
                        </div>
                        <div className="troubleshoot-item">
                            <strong>🐌 Processing is slow</strong>
                            <p>This is normal for in-browser processing. Try the "Fast" quality preset or use smaller files.</p>
                        </div>
                        <div className="troubleshoot-item">
                            <strong>💥 Browser crashes or freezes</strong>
                            <p>Use files under 20MB, close other browser tabs, or try on a desktop/laptop instead of mobile.</p>
                        </div>
                        <div className="troubleshoot-item">
                            <strong>📋 File limits</strong>
                            <p>Maximum file size: 30MB per file. For best performance, keep files under 20MB.</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default InfoSection;
