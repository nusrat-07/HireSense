import { useState } from 'react'
import {
  Link,
  useNavigate,
} from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  const [accountType, setAccountType] =
    useState('candidate')

  const [formData, setFormData] =
    useState({
      name: '',
      email: '',
      company: '',
      password: '',
      confirmPassword: '',
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
    const { name, value } =
      e.target

    setFormData(
      (current) => ({
        ...current,
        [name]: value,
      })
    )

    setError('')
  }

  /*
    --------------------------------
    ACCOUNT TYPE
    --------------------------------
  */

  const changeAccountType = (
    type
  ) => {
    setAccountType(type)
    setError('')

    if (type === 'candidate') {
      setFormData(
        (current) => ({
          ...current,
          company: '',
        })
      )
    }
  }

  /*
    --------------------------------
    LOAD USERS
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
    REGISTER
    --------------------------------
  */

  const handleSubmit = (e) => {
    e.preventDefault()

    if (isSubmitting) {
      return
    }

    setError('')

    const name =
      formData.name.trim()

    const email =
      formData.email
        .trim()
        .toLowerCase()

    const company =
      formData.company.trim()

    const password =
      formData.password

    const confirmPassword =
      formData.confirmPassword

    /*
      VALIDATION
    */

    if (name.length < 2) {
      setError(
        'Please enter your full name.'
      )
      return
    }

    if (
      accountType ===
        'recruiter' &&
      !company
    ) {
      setError(
        'Please enter your company name.'
      )
      return
    }

    if (password.length < 6) {
      setError(
        'Password must contain at least 6 characters.'
      )
      return
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        'Passwords do not match.'
      )
      return
    }

    setIsSubmitting(true)

    try {
      const users =
        getUsers()

      /*
        Prevent duplicate email.
      */

      const existingUser =
        users.find(
          (user) =>
            user.email
              ?.trim()
              .toLowerCase() ===
            email
        )

      if (existingUser) {
        setError(
          'An account with this email address already exists.'
        )

        setIsSubmitting(false)
        return
      }

      /*
        FRONTEND-ONLY USER.

        Password storage here is only
        temporary until backend auth
        is implemented.
      */

      const newUser = {
        id: Date.now(),

        name,

        email,

        password,

        accountType,

        company:
          accountType ===
          'recruiter'
            ? company
            : '',

        createdAt:
          new Date()
            .toISOString(),
      }

      const updatedUsers = [
        ...users,
        newUser,
      ]

      localStorage.setItem(
        'hireai_users',
        JSON.stringify(
          updatedUsers
        )
      )

      alert(
        'Account created successfully! You can now log in.'
      )

      navigate('/login')
    } catch (error) {
      console.error(
        'Registration error:',
        error
      )

      setError(
        'Something went wrong while creating your account.'
      )

      setIsSubmitting(false)
    }
  }

  return (
    <main className="register-page">

      <div className="register-container">

        {/* HEADING */}

        <div className="register-heading">

          <span className="section-label">
            Get Started
          </span>

          <h1>
            Create Your HireAI Account
          </h1>

          <p>
            Join HireAI and start your
            smarter recruitment journey.
          </p>

        </div>

        {/* ACCOUNT TYPE */}

        <div className="account-type-selector">

          <button
            type="button"
            className={
              accountType ===
              'candidate'
                ? 'active'
                : ''
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
              accountType ===
              'recruiter'
                ? 'active'
                : ''
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

        {/* FORM */}

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >

          {error && (
            <div
              style={{
                padding:
                  '12px 14px',
                marginBottom:
                  '16px',
                borderRadius:
                  '10px',
                background:
                  '#fff1f1',
                border:
                  '1px solid #ffd1d1',
                color:
                  '#b42318',
                fontSize:
                  '14px',
              }}
            >
              {error}
            </div>
          )}

          {/* NAME */}

          <div className="register-field">

            <label htmlFor="register-name">
              Full Name
            </label>

            <input
              id="register-name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={
                formData.name
              }
              onChange={
                handleChange
              }
              autoComplete="name"
              required
            />

          </div>

          {/* EMAIL */}

          <div className="register-field">

            <label htmlFor="register-email">
              Email Address
            </label>

            <input
              id="register-email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              autoComplete="email"
              required
            />

          </div>

          {/* COMPANY */}

          {accountType ===
            'recruiter' && (

            <div className="register-field">

              <label htmlFor="register-company">
                Company Name
              </label>

              <input
                id="register-company"
                name="company"
                type="text"
                placeholder="Enter company name"
                value={
                  formData.company
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

          )}

          {/* PASSWORD */}

          <div className="register-field">

            <label htmlFor="register-password">
              Password
            </label>

            <input
              id="register-password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              autoComplete="new-password"
              minLength="6"
              required
            />

          </div>

          {/* CONFIRM PASSWORD */}

          <div className="register-field">

            <label htmlFor="register-confirm-password">
              Confirm Password
            </label>

            <input
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={
                formData.confirmPassword
              }
              onChange={
                handleChange
              }
              autoComplete="new-password"
              minLength="6"
              required
            />

          </div>

          <button
            type="submit"
            className="register-submit-btn"
            disabled={
              isSubmitting
            }
          >
            {isSubmitting
              ? 'Creating Account...'
              : 'Create Account'}
          </button>

        </form>

        <div className="login-divider">
          <span>OR</span>
        </div>

        <p className="register-login-text">

          Already have an account?{' '}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </main>
  )
}

export default Register