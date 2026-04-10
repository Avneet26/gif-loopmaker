import './Footer.css';

function Footer() {
    return (
        <footer className="footer" role="contentinfo">
            <p className="footer-author">
                Made with <span className="heart" aria-hidden="true">❤️</span> by{' '}
                <a
                    href="https://github.com/Avneet26"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="author-link"
                    aria-label="Visit Avneet Virdi's GitHub profile"
                >
                    Avneet Virdi
                </a>
            </p>
            <p className="footer-tech">Built with React + FFmpeg.wasm | Multi-threaded WASM V2.0</p>
            <p className="footer-copyright">© {new Date().getFullYear()} LooperVid. All rights reserved.</p>
        </footer>
    );
}

export default Footer;
