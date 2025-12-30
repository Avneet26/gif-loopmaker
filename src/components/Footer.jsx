import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <p className="footer-author">
                Made with <span className="heart">❤️</span> by{' '}
                <a
                    href="https://github.com/Avneet26"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="author-link"
                >
                    Avneet Virdi
                </a>
            </p>
            <p className="footer-tech">Built with React + FFmpeg.wasm</p>
            <p className="footer-copyright">© {new Date().getFullYear()} LooperVid. All rights reserved.</p>
        </footer>
    );
}

export default Footer;
