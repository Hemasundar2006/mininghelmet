import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="logo-icon" aria-hidden>🪖</span>
            <span className="logo-text">Miner's Guard</span>
            <p className="tagline">Real-time safety and monitoring for mining.</p>
          </div>
          <div className="footer-links">
            <h4>Sitemap</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Contact</h4>
            <p>Email: support@minersguard.example</p>
            <p>Phone: +1 (555) 000-0000</p>
          </div>
          <div className="footer-social">
            <h4>Follow</h4>
            <div className="social-links">
              <a href="#" aria-label="Twitter">Twitter</a>
              <a href="#" aria-label="LinkedIn">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Miner's Guard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
