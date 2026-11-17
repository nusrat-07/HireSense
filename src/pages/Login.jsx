import {
  useState,
} from 'react'

import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const [formData, setFormData] =
    useState({
      email: '',
      password: '',
      accountType: 'candidate',
      rememberMe: false,
    })

  const [error, setError] =
    useState('')

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false)

  /*
    --------------------------------
    INPUT
    --------------------------------
  */

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target

    setFormData((current) => ({
      ...current,

      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }))

    setError('')
  }

  /*
    --------------------------------
    ACCOUNT TYPE
    --------------------------------
  */

  const changeAccountType = (
    accountType
  ) => {
    setFormData((current) => ({
      ...current,
      accountType,
    }))

    setError('')
  }

  /*
    --------------------------------
    GET USERS
    --------------------------------
  */

  const getUsers = () => {
    try {
      const saved =
        localStorage.getItem(
          'hireai_users'
        )

      if (!saved) {
        return []
      }

      const parsed =
        JSON.parse(saved)

      return Array.isArray(parsed)
        ? parsed
        : []
    } catch (error) {
      console.error(
        'Could not load users:',
        error
      )

      return []
    }
  }

  /*
    --------------------------------
    LOGIN
    --------------------------------
  */

  const handleSubmit = (e) => {
    e.preventDefault()

    setError('')
    setIsSubmitting(true)

    const email =
      formData.email
        .trim()
        .toLowerCase()

    const users = getUsers()

    const user = users.find(
      (item) =>
        (
          item.email || ''
        )
          .trim()
          .toLowerCase() ===
          email &&
        item.password ===
          formData.password &&
        item.accountType ===
          formData.accountType
    )

    if (!user) {
      setError(
        'Invalid email, password or account type.'
      )

      setIsSubmitting(false)
      return
    }

    const currentUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      accountType:
        user.accountType,
      company:
        user.company || '',
      loggedInAt:
        new Date().toISOString(),
    }

    /*
      Remove old session first.
    */

    localStorage.removeItem(
      'hireai_current_user'
    )

    sessionStorage.removeItem(
      'hireai_current_user'
    )

    /*
      SAVE LOGIN
    */

    if (formData.rememberMe) {
      localStorage.setItem(
        'hireai_current_user',
        JSON.stringify(
          currentUser
        )
      )
    } else {
      sessionStorage.setItem(
        'hireai_current_user',
        JSON.stringify(
          currentUser
        )
      )
    }

    window.dispatchEvent(
      new Event(
        'hireai-auth-change'
      )
    )

    /*
      --------------------------------
      SMART REDIRECT
      --------------------------------

      If ProtectedRoute sent the user
      here, return them to the page
      they originally wanted.

      But never allow a candidate into
      recruiter pages or vice versa.
    */

    const requestedPage =
      location.state?.from

    if (requestedPage) {
      const recruiterOnly =
        [
          '/recruiter-dashboard',
          '/post-job',
          '/manage-jobs',
          '/review-applicants',
          '/candidate-profile',
          '/schedule-interview',
          '/interviews',
        ].some((path) =>
          requestedPage.startsWith(
            path
          )
        )

      const candidateOnly =
        [
          '/candidate-dashboard',
          '/my-profile',
          '/apply/',
        ].some((path) =>
          requestedPage.startsWith(
            path
          )
        )

      if (
        currentUser.accountType ===
          'candidate' &&
        !recruiterOnly
      ) {
        navigate(
          requestedPage,
          {
            replace: true,
          }
        )

        return
      }

      if (
        currentUser.accountType ===
          'recruiter' &&
        !candidateOnly
      ) {
        navigate(
          requestedPage,
          {
            replace: true,
          }
        )

        return
      }
    }

    /*
      DEFAULT DASHBOARD
    */

    if (
      currentUser.accountType ===
      'recruiter'
    ) {
      navigate(
        '/recruiter-dashboard',
        {
          replace: true,
        }
      )
    } else {
      navigate(
        '/candidate-dashboard',
        {
          replace: true,
        }
      )
    }
  }

  return (
    <main className="login-page">

      <div className="login-container">

        <div className="login-heading">

          <span className="section-label">
            Welcome Back
          </span>

          <h1>
            Login to HireAI
          </h1>

          <p>
            Access your account and
            continue your recruitment
            journey.
          </p>

        </div>

        {/* ACCOUNT TYPE */}

        <div className="account-type-tabs">

          <button
            type="button"
            className={
              formData.accountType ===
              'candidate'
                ? 'account-tab active'
                : 'account-tab'
            }
            onClick={() =>
              changeAccountType(
                'candidate'
              )
            }
          >
            Candidate
          </button>

          <button
            type="button"
            className={
              formData.accountType ===
              'recruiter'
                ? 'account-tab active'
                : 'account-tab'
            }
            onClick={() =>
              changeAccountType(
                'recruiter'
              )
            }
          >
            Recruiter
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div
            style={{
              padding: '12px 14px',
              marginBottom: '18px',
              borderRadius: '8px',
              background:
                '#fef2f2',
              border:
                '1px solid #fecaca',
              color: '#dc2626',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        {/* FORM */}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              required
            />

          </div>

          <div className="login-options">

            <label className="remember-me">

              <input
                name="rememberMe"
                type="checkbox"
                checked={
                  formData.rememberMe
                }
                onChange={
                  handleChange
                }
              />

              <span>
                Remember me
              </span>

            </label>

            <Link
              to="/forgot-password"
              className="forgot-link"
            >
              Forgot Password?
            </Link>

          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={
              isSubmitting
            }
          >
            {isSubmitting
              ? 'Logging in...'
              : 'Login'}
          </button>

        </form>

        <div className="login-divider">
          <span>OR</span>
        </div>

        <p className="register-login-text">

          Don't have an account?{' '}

          <Link to="/register">
            Create Account
          </Link>

        </p>

      </div>

    </main>
  )
}

export default Login