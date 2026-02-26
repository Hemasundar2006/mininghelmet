import { useState } from 'react'
import './Contact.css'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const errors = {
    name: form.name.trim() ? '' : 'Name is required',
    email: form.email.trim() ? (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Invalid email') : 'Email is required',
    subject: form.subject.trim() ? '' : 'Subject is required',
    message: form.message.trim() ? '' : 'Message is required',
  }

  const valid = !Object.values(errors).some(Boolean)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!valid) return
    setSubmitted(true)
    setForm({ name: '', email: '', subject: '', message: '' })
    setTouched({})
  }

  return (
    <div className="contact-page">
      <div className="contact-inner">
        <h1>Contact Us</h1>
        <p className="contact-intro">
          Get in touch for demos, support, or partnership.
        </p>

        <div className="contact-grid">
          <section className="contact-form-section" aria-labelledby="form-heading">
            <h2 id="form-heading">Send a message</h2>
            {submitted ? (
              <p className="form-success">Thank you. Your message has been sent.</p>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                <label>
                  <span>Name</span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your name"
                    aria-invalid={touched.name && errors.name}
                  />
                  {touched.name && errors.name && <span className="field-error">{errors.name}</span>}
                </label>
                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="you@example.com"
                    aria-invalid={touched.email && errors.email}
                  />
                  {touched.email && errors.email && <span className="field-error">{errors.email}</span>}
                </label>
                <label>
                  <span>Subject</span>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Subject"
                    aria-invalid={touched.subject && errors.subject}
                  />
                  {touched.subject && errors.subject && <span className="field-error">{errors.subject}</span>}
                </label>
                <label>
                  <span>Message</span>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your message"
                    rows={5}
                    aria-invalid={touched.message && errors.message}
                  />
                  {touched.message && errors.message && <span className="field-error">{errors.message}</span>}
                </label>
                <button type="submit" className="submit-btn" disabled={!valid}>
                  Send message
                </button>
              </form>
            )}
          </section>

          <section className="contact-info-section" aria-labelledby="info-heading">
            <h2 id="info-heading">Contact information</h2>
            <div className="contact-details">
              <p><strong>Email</strong><br />support@minersguard.example</p>
              <p><strong>Phone</strong><br />+1 (555) 000-0000</p>
              <p><strong>Address</strong><br />123 Safety Way, Mining District</p>
            </div>
            <div className="map-embed">
              <iframe
                title="Office location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-0.1%2C51.5%2C0.1%2C51.51&layer=mapnik&marker=51.505%2C-0.09"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
