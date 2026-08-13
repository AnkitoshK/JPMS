import React from 'react';
import './footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">Developed by Ankitosh Kumar</div>
        <nav className="footer-center">
          <a href="/" className="footer-link">Home</a>
          <a href="/jobs" className="footer-link">Jobs</a>
          <a href="/apply" className="footer-link">Apply</a>
          <a href="/contact" className="footer-link">Contact</a>
        </nav>
        <div className="footer-right">© {new Date().getFullYear()} TPPPL. All rights reserved.</div>
      </div>
    </footer>
  );
}

export default Footer;
