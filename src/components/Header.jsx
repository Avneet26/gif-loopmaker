import './Header.css';

function Header() {
    return (
        <header className="header glass-card" role="banner">
            <div className="badge" aria-label="Version badge">
                <span className="badge-dot" aria-hidden="true"></span>
                V2.0 Engine Live ⚡️
            </div>
            <h1>Looper<span className="text-gradient">Vid</span></h1>
            <p className="subtitle">
                Transform your GIFs into seamless, high-quality looping videos with synchronized audio.
                <br />
                <span style={{ color: 'var(--color-success)', fontWeight: '500', fontSize: '0.95em', marginTop: '0.5rem', display: 'inline-block' }}>
                    Now processing up to 15x faster with multi-threaded WASM!
                </span>
            </p>
        </header>
    );
}

export default Header;
