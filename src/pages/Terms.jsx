import { Link } from 'react-router-dom'
import '../styles/legal.css'

export default function Terms() {
  return (
    <div className="legal-page">
      <div className="legal-nav">
        <div className="nav-logo"><span className="dot" />TrackPay</div>
        <Link className="back" to="/">← Back to TrackPay</Link>
      </div>
      <div className="legal-content">
        <h1>Terms and Conditions</h1>
        <p className="updated">Last updated: 22 September 2026</p>

        <p>These terms govern your use of TrackPay. By creating an account, you agree to them. If you do not agree, please do not use TrackPay.</p>

        <h2>Who can use TrackPay</h2>
        <p>TrackPay is intended for freelancers and small businesses managing their own client work. You must be at least 18 years old and able to enter into a binding agreement to use TrackPay.</p>

        <h2>Your account</h2>
        <p>You are responsible for keeping your login details secure and for all activity under your account. Let us know immediately at prajwaladaki24@gmail.com if you believe your account has been accessed without your permission.</p>

        <h2>Your data</h2>
        <p>You own the client, project, and time tracking data you add to TrackPay. We store it on your behalf so you can access it, and we do not claim ownership over it.</p>

        <h2>Accuracy of tracked time</h2>
        <p>TrackPay records the hours you start, stop, or enter manually, along with the rate you set. We do not review or judge whether the hours logged are accurate. That responsibility sits with you.</p>

        <h2>Paid plans and billing</h2>
        <p>Some features are available on paid plans. If you subscribe to a paid plan, payments are processed through Razorpay. Charges are billed on a recurring basis until you cancel. You can cancel at any time from your account settings, and cancellation will stop future billing.</p>
        <p>Fees already paid are generally non-refundable, except where required by law.</p>

        <h2>Acceptable use</h2>
        <p>You agree not to use TrackPay to store or share unlawful content, to attempt to access another person's account, or to interfere with the normal operation of the service.</p>

        <h2>Service availability</h2>
        <p>We aim to keep TrackPay available and reliable, but we do not guarantee uninterrupted access. We may need to pause the service for maintenance or updates from time to time.</p>

        <h2>Limitation of liability</h2>
        <p>TrackPay is provided as a tool to help you organise your freelance work. We are not liable for business decisions you make based on the data in TrackPay, including invoicing, tax, or payment decisions.</p>

        <h2>Changes to these terms</h2>
        <p>We may update these terms as TrackPay grows. If we make a material change, we will let you know by email or by a notice inside the app.</p>

        <h2>Contact us</h2>
        <p>Questions about these terms can be sent to prajwaladaki24@gmail.com.</p>
      </div>
    </div>
  )
}
