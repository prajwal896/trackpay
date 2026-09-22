import { Link } from 'react-router-dom'
import '../styles/legal.css'

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <div className="legal-nav">
        <div className="nav-logo"><span className="dot" />TrackPay</div>
        <Link className="back" to="/">← Back to TrackPay</Link>
      </div>
      <div className="legal-content">
        <h1>Privacy Policy</h1>
        <p className="updated">Last updated: 22 September 2026</p>

        <p>This policy explains what information TrackPay ("we", "us") collects from you, how we use it, and the choices you have. TrackPay is a time tracking and business management tool built for freelancers in India.</p>

        <h2>Information we collect</h2>
        <p>When you create an account, we collect your name, email address, and password. We also store how you heard about TrackPay so we can understand which channels are useful to people like you.</p>
        <p>As you use TrackPay, we store the data you add yourself, including:</p>
        <ul>
          <li>Client details, such as name, company, email, phone, state, and GST number</li>
          <li>Project details, including rates, deadlines, and progress</li>
          <li>Time entries, including dates, durations, and payment status</li>
        </ul>
        <p>If you make a payment for a paid plan, our payment partner Razorpay processes your card or UPI details directly. We do not store your full card number or UPI PIN on our servers.</p>

        <h2>How we use your information</h2>
        <ul>
          <li>To run your account and show you your own data</li>
          <li>To calculate hours, earnings, and dashboard totals</li>
          <li>To respond to you if you contact us for support</li>
          <li>To improve TrackPay based on how it is used</li>
        </ul>
        <p>We do not sell your personal information to anyone.</p>

        <h2>Where your data is stored</h2>
        <p>Your data is stored with Supabase, a database and authentication provider. Access to your data is restricted so that only you can see your own clients, projects, and time entries.</p>

        <h2>Cookies</h2>
        <p>TrackPay uses essential cookies and local storage to keep you logged in and to remember basic preferences. We do not use cookies for advertising.</p>

        <h2>Your choices</h2>
        <p>You can update or delete your clients, projects, and time entries at any time from within the app. If you want your account and all associated data deleted, contact us at prajwaladaki24@gmail.com and we will process your request.</p>

        <h2>Changes to this policy</h2>
        <p>We may update this policy from time to time. If we make a material change, we will let you know by email or by a notice inside the app.</p>

        <h2>Contact us</h2>
        <p>If you have questions about this policy or how your data is handled, write to us at prajwaladaki24@gmail.com.</p>
      </div>
    </div>
  )
}
