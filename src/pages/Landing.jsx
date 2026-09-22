import { useState } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import MarketingNav from '../components/MarketingNav'
import '../styles/marketing.css'

export default function Landing() {
  const [navScrolled, setNavScrolled] = useState(false)

  return (
    <>
      <MarketingNav scrolled={navScrolled} />
      <Hero onNavScrolledChange={setNavScrolled} />

      <main className="marketing">
        <section id="features">
          <div className="section-head">
            <div className="section-tag">Features</div>
            <h2>Everything you need to run your freelance work in one place</h2>
            <p>TrackPay keeps your clients, projects and hours organised, so you always know what you are owed without opening a spreadsheet.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#1F6F4A" strokeWidth="1.6"/><path d="M12 7v5l3.5 2" stroke="#1F6F4A" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </div>
              <h3>Start and stop timers</h3>
              <p>Track time against a client or project as you work, or add hours manually later. No spreadsheets and no guessing.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke="#1F6F4A" strokeWidth="1.6"/><path d="M8 8h8M8 12h8M8 16h5" stroke="#1F6F4A" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </div>
              <h3>Organise clients and projects</h3>
              <p>Keep every client, their details and their projects in one clean list, with a rate set per project.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" stroke="#1F6F4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3>Know what you have earned</h3>
              <p>Every hour is automatically converted into an amount at your set rate, so your total earned is always accurate.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 17l6-6 4 4 8-8" stroke="#1F6F4A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 3v6h-6" stroke="#1F6F4A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3>Client and project rates</h3>
              <p>Set a different hourly rate per client or project, in rupees, and let TrackPay handle the maths.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="14" rx="2" stroke="#1F6F4A" strokeWidth="1.6"/><path d="M3 9h18" stroke="#1F6F4A" strokeWidth="1.6"/></svg>
              </div>
              <h3>GST details on file</h3>
              <p>Store each client's state and GST number now, so your invoices are ready the moment invoicing goes live.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3v18M5 8h9.5a3.5 3.5 0 010 7H6" stroke="#1F6F4A" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </div>
              <h3>A simple dashboard</h3>
              <p>See your hours worked, your total earned this month and your active projects, all on one screen.</p>
            </div>
          </div>
        </section>

        <section id="how-it-works">
          <div className="section-head">
            <div className="section-tag">How it works</div>
            <h2>From your first client to your first earnings, in three steps</h2>
          </div>
          <div className="steps">
            <div className="step">
              <h3>Add a client and project</h3>
              <p>Set up a client once, add a project under them with an hourly rate, and you are ready to start.</p>
            </div>
            <div className="step">
              <h3>Track your hours</h3>
              <p>Start a timer while you work or add time manually at the end of the day. Either way, it is logged against the right project.</p>
            </div>
            <div className="step">
              <h3>See what you earned</h3>
              <p>Mark hours as paid once the client settles up, and watch your dashboard total update on its own.</p>
            </div>
          </div>
        </section>

        <section id="pricing">
          <div className="section-head">
            <div className="section-tag">Pricing</div>
            <h2>Priced for freelancers, not agencies</h2>
            <p>Start free. Upgrade only once TrackPay is actually saving you time every week.</p>
          </div>
          <div className="pricing-grid">
            <div className="price-card">
              <div className="price-plan">Free</div>
              <div className="price-amount">₹0<span>/month</span></div>
              <div className="price-desc">For freelancers just getting started with a couple of clients.</div>
              <ul className="price-features">
                <li>Up to 2 clients</li>
                <li>Unlimited time tracking</li>
                <li>Dashboard and earnings overview</li>
              </ul>
              <Link className="price-btn" to="/signup">Start Free</Link>
            </div>
            <div className="price-card featured">
              <div className="price-plan">Pro</div>
              <div className="price-amount">₹499<span>/month</span></div>
              <div className="price-desc">For freelancers working with several clients every month.</div>
              <ul className="price-features">
                <li>Unlimited clients and projects</li>
                <li>Priority support</li>
                <li>Early access to invoicing when it launches</li>
              </ul>
              <Link className="price-btn" to="/signup">Start Free</Link>
            </div>
            <div className="price-card">
              <div className="price-plan">Team</div>
              <div className="price-amount">₹1,299<span>/month</span></div>
              <div className="price-desc">For small studios with more than one person billing clients.</div>
              <ul className="price-features">
                <li>Everything in Pro</li>
                <li>Up to 5 team members</li>
                <li>Shared client and project data</li>
              </ul>
              <Link className="price-btn" to="/signup">Talk to us</Link>
            </div>
          </div>
        </section>

        <section className="cta-banner">
          <h2>Your next hour of work should count for something.</h2>
          <p>Set up your first client in under two minutes. No card required.</p>
          <Link className="hero-cta" to="/signup">Start Free</Link>
        </section>

        <footer className="site-footer">
          <div className="foot-top">
            <div className="nav-logo"><span className="dot" />TrackPay</div>
            <div className="foot-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms and Conditions</Link>
            </div>
            <div>© 2026 TrackPay. Made for Indian freelancers.</div>
          </div>
          <div className="foot-credit">
            Built by Prajwal Adaki —{' '}
            <a href="https://www.linkedin.com/in/prajwaladaki" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            {' '}·{' '}
            <a href="https://www.instagram.com/prxwlll" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </footer>
      </main>
    </>
  )
}
