import { useState } from 'react';
import './InfoSection.css';

function InfoSection() {
    const [openPanel, setOpenPanel] = useState(null);

    const togglePanel = (panel) => {
        setOpenPanel(openPanel === panel ? null : panel);
    };

    return (
        <section className="info-section glass-card" style={{ padding: '2rem', marginTop: '2rem' }} aria-label="About LooperVid">
            <h2 className="info-section-title" id="about-loopervid">ℹ️ About LooperVid</h2>

            {/* How to Use */}
            <div className="info-panel">
                <button
                    className={`info-panel-header ${openPanel === 'howto' ? 'active' : ''}`}
                    onClick={() => togglePanel('howto')}
                    aria-expanded={openPanel === 'howto'}
                    aria-controls="panel-howto"
                >
                    <span>📖 How to Use</span>
                    <span className="info-panel-icon">{openPanel === 'howto' ? '−' : '+'}</span>
                </button>
                {openPanel === 'howto' && (
                    <div className="info-panel-content" id="panel-howto" role="region" aria-labelledby="howto-heading">
                        <ol>
                            <li><strong>Upload an image or GIF</strong> — Drag & drop or click to browse. Supports GIF, JPG, PNG, and WebP.</li>
                            <li><strong>Upload your audio</strong> — Add your track in MP3, M4A, WAV, or OGG format.</li>
                            <li><strong>Choose export settings</strong> — Pick your <strong>video resolution</strong> (720p, 1080p, 2K, or 4K) and <strong>audio bitrate</strong> (128, 192, 256, or 320 kbps) from the Export Settings panel.</li>
                            <li><strong>Click "Process & Render Video"</strong> — Our multi-threaded WASM engine will process your video with a real-time progress bar and time estimate.</li>
                            <li><strong>Download</strong> — Your high-quality MP4 is ready for YouTube, Instagram, or any platform!</li>
                        </ol>
                        <p className="info-note">
                            <strong>💡 Tip:</strong> For the fastest processing, use 720p with 128 kbps. For YouTube uploads, 1080p with 192 kbps gives excellent results with reasonable processing time.
                        </p>
                    </div>
                )}
            </div>

            {/* Privacy */}
            <div className="info-panel">
                <button
                    className={`info-panel-header ${openPanel === 'privacy' ? 'active' : ''}`}
                    onClick={() => togglePanel('privacy')}
                    aria-expanded={openPanel === 'privacy'}
                    aria-controls="panel-privacy"
                >
                    <span>🔒 Privacy</span>
                    <span className="info-panel-icon">{openPanel === 'privacy' ? '−' : '+'}</span>
                </button>
                {openPanel === 'privacy' && (
                    <div className="info-panel-content" id="panel-privacy" role="region" aria-labelledby="privacy-heading">
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
                    aria-expanded={openPanel === 'troubleshoot'}
                    aria-controls="panel-troubleshoot"
                >
                    <span>🔧 Troubleshooting</span>
                    <span className="info-panel-icon">{openPanel === 'troubleshoot' ? '−' : '+'}</span>
                </button>
                {openPanel === 'troubleshoot' && (
                    <div className="info-panel-content" id="panel-troubleshoot" role="region" aria-labelledby="troubleshoot-heading">
                        <div className="troubleshoot-item">
                            <strong>⚠️ "Failed to load FFmpeg"</strong>
                            <p>Check your internet connection (FFmpeg loads from CDN on first use). Hard-refresh the page (Ctrl+Shift+R / Cmd+Shift+R) and try again.</p>
                        </div>
                        <div className="troubleshoot-item">
                            <strong>🐌 Processing is slow</strong>
                            <p>Try lowering the resolution to 720p and audio bitrate to 128 kbps in the Export Settings panel. Higher resolutions (2K, 4K) require significantly more processing time and memory.</p>
                        </div>
                        <div className="troubleshoot-item">
                            <strong>💥 Browser crashes or freezes</strong>
                            <p>This usually happens with 2K/4K exports or large files. Reduce the resolution to 1080p, use files under 30MB, and close other browser tabs to free up memory.</p>
                        </div>
                        <div className="troubleshoot-item">
                            <strong>📋 File limits</strong>
                            <p>Maximum file size: 50MB per file. For best performance, keep files under 30MB. Audio files longer than 10 minutes at 4K resolution may exceed browser memory limits.</p>
                        </div>
                        <div className="troubleshoot-item">
                            <strong>🎬 Output looks blurry</strong>
                            <p>Increase the video resolution in Export Settings. If your source image is low-resolution, upscaling to 2K or 4K won't improve clarity — match the export resolution to your source image quality.</p>
                        </div>
                        <div className="troubleshoot-item">
                            <strong>🔊 Audio quality is poor</strong>
                            <p>Increase the audio bitrate to 256 or 320 kbps in the Export Settings. For best results, use a high-quality source audio file (MP3 at 320 kbps or WAV).</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default InfoSection;
