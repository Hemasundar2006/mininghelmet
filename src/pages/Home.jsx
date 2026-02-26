import { Link } from 'react-router-dom'
import './Home.css'

const features = [
  {
    title: 'Real-Time Monitoring',
    description: 'Live sensor data for gas, temperature, humidity, and impact—all in one dashboard.',
    icon: '📊',
  },
  {
    title: 'Instant Alert System',
    description: 'Critical alerts and emergency flags with timestamps so you can act fast.',
    icon: '🔔',
  },
  {
    title: 'Lone Worker Protection',
    description: 'Location tracking and geofencing to keep every worker accounted for.',
    icon: '🛡️',
  },
  {
    title: 'Cloud Connectivity',
    description: 'Data stored securely in the cloud for analysis and compliance.',
    icon: '☁️',
  },
]

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-bg" aria-hidden />
        <div className="hero-content">
          <h1>Revolutionizing Mining Safety</h1>
          <p className="hero-tagline">
            Real-time monitoring and worker well-being at the heart of every shift. 
            Smarter helmets. Safer mines.
          </p>
          <Link to="/dashboard" className="hero-cta">
            View Live Dashboard
          </Link>
        </div>
      </section>
      <section className="features" aria-labelledby="features-heading">
        <h2 id="features-heading" className="section-title">Why Miner's Guard</h2>
        <div className="features-grid">
          {features.map((f) => (
            <article key={f.title} className="feature-card">
              <span className="feature-icon" aria-hidden>{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
