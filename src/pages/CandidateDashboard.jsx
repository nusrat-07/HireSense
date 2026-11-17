import { useMemo } from 'react'
import { Link } from 'react-router-dom'

function CandidateDashboard() {
  /*
    --------------------------------
    CURRENT USER
    --------------------------------
  */

  const currentUser = useMemo(() => {
    try {
      const saved =
        localStorage.getItem(
          'hireai_current_user'
        ) ||
        sessionStorage.getItem(
          'hireai_current_user'
        )

      return saved
        ? JSON.parse(saved)
        : null
    } catch (error) {
      console.error(
        'Could not load current user:',
        error
      )

      return null
    }
  }, [])

  /*
    --------------------------------
    APPLICATIONS
    --------------------------------
  */

  const applications = useMemo(() => {
    try {
      const saved =
        localStorage.getItem(
          'hireai_applications'
        )

      if (!saved) {
        return []
      }

      const parsed =
        JSON.parse(saved)

      if (!Array.isArray(parsed)) {
        return []
      }

      /*
        Once accounts exist, show only
        applications belonging to the
        logged-in candidate's email.

        Older prototype applications
        still work when appropriate.
      */

      if (!currentUser?.email) {
        return parsed
      }

      const email =
        currentUser.email
          .trim()
          .toLowerCase()

      return parsed.filter(
        (application) =>
          (
            application.email ||
            ''
          )
            .trim()
            .toLowerCase() ===
          email
      )
    } catch (error) {
      console.error(
        'Could not load applications:',
        error
      )

      return []
    }
  }, [currentUser])

  /*
    --------------------------------
    CANDIDATE PROFILE
    --------------------------------
  */

  const profile = useMemo(() => {
    if (!currentUser) {
      return null
    }

    try {
      const saved =
        localStorage.getItem(
          'hireai_candidate_profiles'
        )

      if (!saved) {
        return null
      }

      const parsed =
        JSON.parse(saved)

      if (!Array.isArray(parsed)) {
        return null
      }

      return (
        parsed.find(
          (item) =>
            String(item.userId) ===
            String(currentUser.id)
        ) || null
      )
    } catch (error) {
      console.error(
        'Could not load candidate profile:',
        error
      )

      return null
    }
  }, [currentUser])

  /*
    --------------------------------
    PROFILE COMPLETION
    --------------------------------
  */

  const profileCompletion =
    useMemo(() => {
      if (!profile) {
        return 0
      }

      const fields = [
        profile.name,
        profile.phone,
        profile.location,
        profile.jobTitle,
        profile.bio,
        profile.skills,
        profile.experience,
        profile.education,
        profile.cvName,
      ]

      const completed =
        fields.filter(
          (value) =>
            String(value || '')
              .trim()
        ).length

      return Math.round(
        (completed /
          fields.length) *
          100
      )
    }, [profile])

  /*
    --------------------------------
    RECRUITER JOBS
    --------------------------------
  */

  const recruiterJobs =
    useMemo(() => {
      try {
        const saved =
          localStorage.getItem(
            'hireai_jobs'
          )

        if (!saved) {
          return []
        }

        const parsed =
          JSON.parse(saved)

        if (!Array.isArray(parsed)) {
          return []
        }

        return parsed.filter(
          (job) =>
            job.status === 'Active'
        )
      } catch (error) {
        console.error(
          'Could not load jobs:',
          error
        )

        return []
      }
    }, [])

  /*
    --------------------------------
    SAMPLE JOBS
    --------------------------------
  */

  const sampleJobs = [
    {
      id: 1,
      title:
        'Frontend Developer',
      company:
        'TechNova Inc.',
      location:
        'New York, NY',
      source: 'sample',
    },

    {
      id: 2,
      title:
        'UI/UX Designer',
      company:
        'CreativeLabs',
      location:
        'Remote',
      source: 'sample',
    },

    {
      id: 3,
      title:
        'Backend Developer',
      company:
        'CloudCore',
      location:
        'Boston, MA',
      source: 'sample',
    },
  ]

  /*
    --------------------------------
    RECOMMENDED JOBS
    --------------------------------
  */

  const recommendedJobs =
    useMemo(() => {
      const realJobs =
        recruiterJobs.map(
          (job) => ({
            ...job,
            source:
              'recruiter',
          })
        )

      return [
        ...realJobs,
        ...sampleJobs,
      ].slice(0, 3)
    }, [recruiterJobs])

  /*
    --------------------------------
    APPLICATION STATS
    --------------------------------
  */

  const totalApplications =
    applications.length

  const interviewCount =
    applications.filter(
      (application) =>
        application.status ===
        'Interview'
    ).length

  const shortlistedCount =
    applications.filter(
      (application) =>
        application.status ===
        'Shortlisted'
    ).length

  const underReviewCount =
    applications.filter(
      (application) =>
        [
          'New',
          'Applied',
          'Under Review',
        ].includes(
          application.status
        )
    ).length

  /*
    --------------------------------
    DATE
    --------------------------------
  */

  const formatDate = (date) => {
    if (!date) {
      return 'Unknown'
    }

    const parsedDate =
      new Date(date)

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return 'Unknown'
    }

    return parsedDate
      .toLocaleDateString(
        'en-US',
        {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }
      )
  }

  /*
    --------------------------------
    RECENT APPLICATIONS
    --------------------------------
  */

  const recentApplications =
    useMemo(() => {
      return [...applications]
        .sort(
          (a, b) =>
            new Date(
              b.appliedAt || 0
            ) -
            new Date(
              a.appliedAt || 0
            )
        )
        .slice(0, 5)
    }, [applications])

  /*
    --------------------------------
    NAME
    --------------------------------
  */

  const firstName =
    currentUser?.name
      ?.trim()
      .split(' ')[0] ||
    'Candidate'

  return (
    <main className="candidate-dashboard">

      {/* HEADER */}

      <div className="dashboard-header">

        <div>

          <span className="section-label">
            Candidate Dashboard
          </span>

          <h1>
            Welcome back,{' '}
            {firstName}!
          </h1>

          <p>
            Track your applications,
            manage your profile and
            discover new opportunities.
          </p>

        </div>

        <Link
          to="/jobs"
          className="dashboard-primary-btn"
        >
          Browse Jobs
        </Link>

      </div>

      {/* STATS */}

      <section className="dashboard-stats">

        <div className="dashboard-stat-card">

          <span>
            Applications
          </span>

          <h2>
            {totalApplications}
          </h2>

          <p>
            Total jobs applied
          </p>

        </div>

        <div className="dashboard-stat-card">

          <span>
            Interviews
          </span>

          <h2>
            {interviewCount}
          </h2>

          <p>
            Interview stage
          </p>

        </div>

        <div className="dashboard-stat-card">

          <span>
            Shortlisted
          </span>

          <h2>
            {shortlistedCount}
          </h2>

          <p>
            Applications shortlisted
          </p>

        </div>

        <div className="dashboard-stat-card">

          <span>
            Profile
          </span>

          <h2>
            {profileCompletion}%
          </h2>

          <p>
            Profile completion
          </p>

        </div>

      </section>

      {/* PROFILE + PROGRESS */}

      <section className="dashboard-grid">

        {/* PROFILE */}

        <div className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>

              <span className="section-label">
                Profile
              </span>

              <h2>
                Candidate Profile
              </h2>

            </div>

            <span className="profile-percentage">
              {profileCompletion}%
            </span>

          </div>

          <p className="dashboard-muted">

            {profileCompletion ===
            100
              ? 'Your candidate profile is complete.'
              : 'Complete your professional profile to keep your information ready for job applications.'}

          </p>

          <div className="profile-progress">

            <div
              className="profile-progress-fill"
              style={{
                width: `${profileCompletion}%`,
              }}
            ></div>

          </div>

          <div className="profile-checklist">

            <div>

              <span>
                Personal Information
              </span>

              <strong>
                {profile?.name &&
                profile?.phone
                  ? '✓'
                  : 'Incomplete'}
              </strong>

            </div>

            <div>

              <span>
                CV Uploaded
              </span>

              <strong>
                {profile?.cvName
                  ? '✓'
                  : 'Incomplete'}
              </strong>

            </div>

            <div>

              <span>
                Skills Added
              </span>

              <strong>
                {profile?.skills
                  ? '✓'
                  : 'Incomplete'}
              </strong>

            </div>

            <div>

              <span>
                Work Experience
              </span>

              <strong>
                {profile?.experience
                  ? '✓'
                  : 'Incomplete'}
              </strong>

            </div>

          </div>

          <Link
            to="/my-profile"
            className="dashboard-secondary-btn"
          >
            {profile
              ? 'Edit Profile'
              : 'Complete Profile'}
          </Link>

        </div>

        {/* APPLICATION PROGRESS */}

        <div className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>

              <span className="section-label">
                Progress
              </span>

              <h2>
                Application Progress
              </h2>

            </div>

          </div>

          <p className="dashboard-muted">
            Keep track of your current
            recruitment progress.
          </p>

          <div className="profile-checklist">

            <div>

              <span>
                Total Applications
              </span>

              <strong>
                {totalApplications}
              </strong>

            </div>

            <div>

              <span>
                Under Review
              </span>

              <strong>
                {underReviewCount}
              </strong>

            </div>

            <div>

              <span>
                Shortlisted
              </span>

              <strong>
                {shortlistedCount}
              </strong>

            </div>

            <div>

              <span>
                Interviews
              </span>

              <strong>
                {interviewCount}
              </strong>

            </div>

          </div>

          <Link
            to="/jobs"
            className="dashboard-secondary-btn"
          >
            Find More Jobs
          </Link>

        </div>

      </section>

      {/* CV */}

      <section className="dashboard-section">

        <div className="dashboard-section-heading">

          <div>

            <span className="section-label">
              Resume
            </span>

            <h2>
              My CV
            </h2>

          </div>

          <Link to="/my-profile">
            Manage CV
          </Link>

        </div>

        <div className="dashboard-panel">

          {profile?.cvName ? (
            <>

              <div className="profile-checklist">

                <div>

                  <span>
                    Current CV
                  </span>

                  <strong>
                    {profile.cvName}
                  </strong>

                </div>

                <div>

                  <span>
                    Status
                  </span>

                  <strong>
                    Uploaded
                  </strong>

                </div>

              </div>

              <p className="dashboard-muted">
                AI CV scoring will be
                connected when the
                backend and AI analysis
                service are implemented.
              </p>

            </>
          ) : (
            <>

              <h3>
                No CV uploaded yet
              </h3>

              <p className="dashboard-muted">
                Add your CV to your
                candidate profile so it
                is ready for future job
                applications and AI
                analysis.
              </p>

              <Link
                to="/my-profile"
                className="dashboard-secondary-btn"
              >
                Upload CV
              </Link>

            </>
          )}

        </div>

      </section>

      {/* RECOMMENDED */}

      <section className="dashboard-section">

        <div className="dashboard-section-heading">

          <div>

            <span className="section-label">
              Recommended
            </span>

            <h2>
              Jobs For You
            </h2>

          </div>

          <Link to="/jobs">
            View All Jobs
          </Link>

        </div>

        {recommendedJobs.length >
        0 ? (

          <div className="recommended-job-grid">

            {recommendedJobs.map(
              (job) => (

                <div
                  className="recommended-job-card"
                  key={`${job.source}-${job.id}`}
                >

                  <div className="job-match">

                    {job.source ===
                    'recruiter'
                      ? 'New Job'
                      : 'Recommended'}

                  </div>

                  <h3>
                    {job.title}
                  </h3>

                  <p>
                    {job.company}
                  </p>

                  <span>
                    {job.location}
                  </span>

                  <Link
                    to={`/jobs/${job.id}?source=${job.source}`}
                    className="dashboard-job-btn"
                  >
                    View Job
                  </Link>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="no-applicants">

            <h3>
              No jobs available
            </h3>

            <p>
              New job opportunities
              will appear here.
            </p>

          </div>

        )}

      </section>

      {/* APPLICATIONS */}

      <section className="dashboard-section">

        <div className="dashboard-section-heading">

          <div>

            <span className="section-label">
              Applications
            </span>

            <h2>
              Recent Applications
            </h2>

          </div>

          {applications.length >
            0 && (

            <span>
              {applications.length}{' '}
              total
            </span>

          )}

        </div>

        {recentApplications.length >
        0 ? (

          <div className="application-table">

            <div className="application-table-header">

              <span>
                Position
              </span>

              <span>
                Company
              </span>

              <span>
                Status
              </span>

            </div>

            {recentApplications.map(
              (application) => (

                <div
                  className="application-row"
                  key={
                    application.id
                  }
                >

                  <div>

                    <strong>
                      {application.jobTitle ||
                        'Job Position'}
                    </strong>

                    <small
                      style={{
                        display:
                          'block',
                        marginTop:
                          '4px',
                        opacity:
                          '0.65',
                      }}
                    >
                      Applied{' '}
                      {formatDate(
                        application.appliedAt
                      )}
                    </small>

                  </div>

                  <span>
                    {application.company ||
                      'Company'}
                  </span>

                  <span
                    className={`application-status ${(
                      application.status ||
                      'New'
                    )
                      .toLowerCase()
                      .replaceAll(
                        ' ',
                        '-'
                      )}`}
                  >
                    {application.status ||
                      'New'}
                  </span>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="no-applicants">

            <h3>
              No applications yet
            </h3>

            <p>
              When you apply for a job,
              your application and its
              status will appear here.
            </p>

            <Link
              to="/jobs"
              className="dashboard-primary-btn"
            >
              Browse Jobs
            </Link>

          </div>

        )}

      </section>

    </main>
  )
}

export default CandidateDashboard