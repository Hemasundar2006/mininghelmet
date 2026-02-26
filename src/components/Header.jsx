import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const nav = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/contact', label: 'Contact' },
  ]

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo" aria-label="Miner's Guard Home">
          <span className="logo-icon" aria-hidden>🪖</span>
          <span className="logo-text">Miner's Guard</span>
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="hamburger" />
          <span className="hamburger" />
          <span className="hamburger" />
        </button>
        <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
          <ul>
            {nav.map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={location.pathname === path ? 'active' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/dashboard"
            className="cta-button"
            onClick={() => setMenuOpen(false)}
          >
            View Live Dashboard
          </Link>
        </nav>
      </div>
    </header>
  )
}
