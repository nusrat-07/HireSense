import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function MyProfile() {
  const [currentUser, setCurrentUser] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    jobTitle: '',
    bio: '',
    skills: '',
    experience: '',
    education: '',
  })

  const [cvName, setCvName] = useState('')
  const [message, setMessage] = useState('')

  /*
    --------------------------------
    LOAD CURRENT USER
    --------------------------------
  */

  useEffect(() => {
    try {
      const savedUser =
        localStorage.getItem('hireai_current_user') ||
        sessionStorage.getItem('hireai_current_user')

      if (!savedUser) {
        return
      }

      const user = JSON.parse(savedUser)

      setCurrentUser(user)

      /*
        Profile is stored separately
        from authentication data.
      */

      const savedProfiles =
        localStorage.getItem('hireai_candidate_profiles')

      const profiles = savedProfiles
        ? JSON.parse(savedProfiles)
        : []

      const existingProfile =
        Array.isArray(profiles)
          ? profiles.find(
              (profile) =>
                String(profile.userId) ===
                String(user.id)
            )
          : null

      if (existingProfile) {
        setFormData({
          name: existingProfile.name || user.name || '',
          email: user.email || '',
          phone: existingProfile.phone || '',
          location: existingProfile.location || '',
          jobTitle: existingProfile.jobTitle || '',
          bio: existingProfile.bio || '',
          skills: existingProfile.skills || '',
          experience: existingProfile.experience || '',
          education: existingProfile.education || '',
        })

        setCvName(existingProfile.cvName || '')
      } else {
        setFormData((current) => ({
          ...current,
          name: user.name || '',
          email: user.email || '',
        }))
      }
    } catch (error) {
      console.error(
        'Could not load candidate profile:',
        error
      )
    }
  }, [])

  /*
    --------------------------------
    INPUT
    --------------------------------
  */

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    setMessage('')
  }

  /*
    --------------------------------
    CV
    --------------------------------
  */

  const handleCvChange = (e) => {
    const file = e.target.files[0]

    if (!file) {
      return
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    if (
      file.type &&
      !allowedTypes.includes(file.type)
    ) {
      alert(
        'Please upload a PDF, DOC or DOCX file.'
      )

      e.target.value = ''
      return
    }

    const maxSize = 5 * 1024 * 1024

    if (file.size > maxSize) {
      alert(
        'CV file must be 5 MB or smaller.'
      )

      e.target.value = ''
      return
    }

    /*
      Frontend prototype:
      only the filename is stored.

      Backend storage comes later.
    */

    setCvName(file.name)
    setMessage('')
  }

  /*
    --------------------------------
    SAVE PROFILE
    --------------------------------
  */

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!currentUser) {
      return
    }

    try {
      const saved =
        localStorage.getItem(
          'hireai_candidate_profiles'
        )

      const parsed = saved
        ? JSON.parse(saved)
        : []

      const profiles =
        Array.isArray(parsed)
          ? parsed
          : []

      const profile = {
        userId: currentUser.id,

        name: formData.name.trim(),

        email: currentUser.email,

        phone: formData.phone.trim(),

        location:
          formData.location.trim(),

        jobTitle:
          formData.jobTitle.trim(),

        bio: formData.bio.trim(),

        skills: formData.skills.trim(),

        experience:
          formData.experience.trim(),

        education:
          formData.education.trim(),

        cvName,

        updatedAt:
          new Date().toISOString(),
      }

      const existingIndex =
        profiles.findIndex(
          (item) =>
            String(item.userId) ===
            String(currentUser.id)
        )

      let updatedProfiles

      if (existingIndex >= 0) {
        updatedProfiles = [
          ...profiles,
        ]

        updatedProfiles[
          existingIndex
        ] = profile
      } else {
        updatedProfiles = [
          ...profiles,
          profile,
        ]
      }

      localStorage.setItem(
        'hireai_candidate_profiles',
        JSON.stringify(
          updatedProfiles
        )
      )

      /*
        Keep displayed user name
        synchronized with session.
      */

      const updatedUser = {
        ...currentUser,
        name: profile.name,
      }

      if (
        localStorage.getItem(
          'hireai_current_user'
        )
      ) {
        localStorage.setItem(
          'hireai_current_user',
          JSON.stringify(
            updatedUser
          )
        )
      }

      if (
        sessionStorage.getItem(
          'hireai_current_user'
        )
      ) {
        sessionStorage.setItem(
          'hireai_current_user',
          JSON.stringify(
            updatedUser
          )
        )
      }

      setCurrentUser(updatedUser)

      window.dispatchEvent(
        new Event(
          'hireai-auth-change'
        )
      )

      setMessage(
        'Profile saved successfully.'
      )
    } catch (error) {
      console.error(
        'Could not save profile:',
        error
      )

      setMessage(
        'Could not save your profile.'
      )
    }
  }

  /*
    --------------------------------
    PROFILE COMPLETION
    --------------------------------
  */

  const completionFields = [
    formData.name,
    formData.phone,
    formData.location,
    formData.jobTitle,
    formData.bio,
    formData.skills,
    formData.experience,
    formData.education,
    cvName,
  ]

  const completedFields =
    completionFields.filter(
      (value) =>
        String(value || '').trim()
    ).length

  const completion =
    Math.round(
      (completedFields /
        completionFields.length) *
        100
    )

  return (
    <main className="candidate-dashboard">

      <div className="dashboard-header">

        <div>
          <span className="section-label">
            Candidate Profile
          </span>

          <h1>My Profile</h1>

          <p>
            Keep your professional
            information and CV up to date.
          </p>
        </div>

        <Link
          to="/candidate-dashboard"
          className="dashboard-secondary-btn"
        >
          Back to Dashboard
        </Link>

      </div>

      <section className="dashboard-stats">

        <div className="dashboard-stat-card">
          <span>
            Profile Completion
          </span>

          <h2>
            {completion}%
          </h2>

          <p>
            Complete your candidate
            profile
          </p>
        </div>

        <div className="dashboard-stat-card">
          <span>CV</span>

          <h2>
            {cvName ? '✓' : '—'}
          </h2>

          <p>
            {cvName
              ? 'CV uploaded'
              : 'No CV uploaded'}
          </p>
        </div>

      </section>

      <section className="dashboard-panel">

        <div className="dashboard-panel-header">

          <div>
            <span className="section-label">
              Information
            </span>

            <h2>
              Professional Profile
            </h2>
          </div>

          <strong>
            {completion}% Complete
          </strong>

        </div>

        {message && (
          <div
            style={{
              marginBottom: '20px',
              padding: '12px 14px',
              borderRadius: '10px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
            }}
          >
            {message}
          </div>
        )}

        <form
          className="application-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label htmlFor="profile-name">
              Full Name
            </label>

            <input
              id="profile-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              value={formData.email}
              disabled
            />

          </div>

          <div className="form-group">

            <label htmlFor="profile-phone">
              Phone Number
            </label>

            <input
              id="profile-phone"
              name="phone"
              type="tel"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label htmlFor="profile-location">
              Location
            </label>

            <input
              id="profile-location"
              name="location"
              type="text"
              placeholder="Example: New York, NY"
              value={formData.location}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label htmlFor="profile-title">
              Professional Title
            </label>

            <input
              id="profile-title"
              name="jobTitle"
              type="text"
              placeholder="Example: Frontend Developer"
              value={formData.jobTitle}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label htmlFor="profile-skills">
              Skills
            </label>

            <input
              id="profile-skills"
              name="skills"
              type="text"
              placeholder="React, JavaScript, CSS, Figma..."
              value={formData.skills}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label htmlFor="profile-bio">
              Professional Summary
            </label>

            <textarea
              id="profile-bio"
              name="bio"
              rows="5"
              placeholder="Write a short professional summary..."
              value={formData.bio}
              onChange={handleChange}
            ></textarea>

          </div>

          <div className="form-group">

            <label htmlFor="profile-experience">
              Work Experience
            </label>

            <textarea
              id="profile-experience"
              name="experience"
              rows="5"
              placeholder="Describe your work experience..."
              value={formData.experience}
              onChange={handleChange}
            ></textarea>

          </div>

          <div className="form-group">

            <label htmlFor="profile-education">
              Education
            </label>

            <textarea
              id="profile-education"
              name="education"
              rows="4"
              placeholder="Add your education..."
              value={formData.education}
              onChange={handleChange}
            ></textarea>

          </div>

          <div className="form-group">

            <label htmlFor="profile-cv">
              CV / Resume
            </label>

            <input
              id="profile-cv"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleCvChange}
            />

            {cvName && (
              <small
                className="selected-cv-name"
                style={{
                  display: 'block',
                  marginTop: '8px',
                }}
              >
                Current CV: {cvName}
              </small>
            )}

          </div>

          <button
            type="submit"
            className="submit-application-btn"
          >
            Save Profile
          </button>

        </form>

      </section>

    </main>
  )
}

export default MyProfile