import { useState } from 'react'
import { Link } from 'react-router-dom'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    setSubmitted(true)
  }

  return (
    <main className="forgot-page">
      <div className="forgot-container">

        {!submitted ? (
          <>
            <div className="forgot-heading">
              <span className="section-label">
                Password Recovery
              </span>

              <h1>Forgot Your Password?</h1>

              <p>
                Enter the email address connected to your HireAI
                account and we'll help you reset your password.
              </p>
            </div>

            <form
              className="forgot-form"
              onSubmit={handleSubmit}
            >
              <div className="forgot-field">
                <label htmlFor="reset-email">
                  Email Address
                </label>

                <input
                  id="reset-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="forgot-submit-btn"
              >
                Send Reset Link
              </button>
            </form>

            <p className="forgot-back-text">
              Remember your password?{' '}

              <Link to="/login">
                Back to Login
              </Link>
            </p>
          </>
        ) : (
          <div className="forgot-success">

            <div className="forgot-success-icon">
              ✓
            </div>

            <h1>Check Your Email</h1>

            <p>
              If an account exists for <strong>{email}</strong>,
              password reset instructions will be sent to that
              email address.
            </p>

            <button
              type="button"
              className="forgot-resend-btn"
              onClick={() => setSubmitted(false)}
            >
              Try Another Email
            </button>

            <Link
              to="/login"
              className="forgot-login-btn"
            >
              Back to Login
            </Link>

          </div>
        )}

      </div>
    </main>
  )
}

export default ForgotPassword