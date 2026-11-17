import { useMemo } from 'react'
import { Link } from 'react-router-dom'

function RecruiterDashboard() {
  /*
    --------------------------------
    TOP CANDIDATES
    --------------------------------
  */

  const candidates = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Frontend Developer',
      experience: '3 Years',
      match: '94%',
      status: 'Shortlisted',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'React Developer',
      experience: '4 Years',
      match: '91%',
      status: 'Review',
    },
    {
      id: 3,
      name: 'Emily Davis',
      role: 'UI/UX Designer',
      experience: '2 Years',
      match: '88%',
      status: 'Interview',
    },
  ]

  /*
    --------------------------------
    LOAD SAVED JOBS
    --------------------------------
  */

  const jobStats = useMemo(() => {
    let savedJobs = []

    try {
      const saved =
        localStorage.getItem('hireai_jobs')

      if (saved) {
        const parsed =
          JSON.parse(saved)

        if (Array.isArray(parsed)) {
          savedJobs = parsed
        }
      }
    } catch (error) {
      console.error(
        'Could not load jobs:',
        error
      )
    }

    const activeJobs =
      savedJobs.filter(
        (job) =>
          job.status === 'Active'
      )

    const totalApplicants =
      savedJobs.reduce(
        (total, job) =>
          total +
          Number(job.applicants || 0),
        0
      )

    const totalShortlisted =
      savedJobs.reduce(
        (total, job) =>
          total +
          Number(job.shortlisted || 0),
        0
      )

    return {
      allJobs: savedJobs,
      activeJobs,
      activeCount: activeJobs.length,
      totalApplicants,
      totalShortlisted,
    }
  }, [])

  /*
    --------------------------------
    INTERVIEW DATA
    --------------------------------
  */

  const interviewStats = useMemo(() => {
    const sampleInterviews = [
      {
        id: 1,
        status: 'Scheduled',
      },
      {
        id: 2,
        status: 'Scheduled',
      },
      {
        id: 3,
        status: 'Scheduled',
      },
      {
        id: 4,
        status: 'Completed',
      },
    ]

    let savedInterviews = []
    let sampleStatuses = {}

    try {
      const saved =
        localStorage.getItem(
          'hireai_interviews'
        )

      if (saved) {
        const parsed =
          JSON.parse(saved)

        if (Array.isArray(parsed)) {
          savedInterviews = parsed
        }
      }
    } catch (error) {
      console.error(
        'Could not load interviews:',
        error
      )
    }

    try {
      const savedStatuses =
        localStorage.getItem(
          'hireai_sample_interview_statuses'
        )

      if (savedStatuses) {
        sampleStatuses =
          JSON.parse(savedStatuses)
      }
    } catch (error) {
      console.error(
        'Could not load interview statuses:',
        error
      )
    }

    const updatedSamples =
      sampleInterviews.map(
        (interview) => ({
          ...interview,

          status:
            sampleStatuses[
              interview.id
            ] ||
            interview.status,
        })
      )

    const allInterviews = [
      ...savedInterviews,
      ...updatedSamples,
    ]

    const scheduled =
      allInterviews.filter(
        (interview) =>
          interview.status ===
          'Scheduled'
      ).length

    const completed =
      allInterviews.filter(
        (interview) =>
          interview.status ===
          'Completed'
      ).length

    const cancelled =
      allInterviews.filter(
        (interview) =>
          interview.status ===
          'Cancelled'
      ).length

    return {
      total: allInterviews.length,
      scheduled,
      completed,
      cancelled,
    }
  }, [])

  /*
    --------------------------------
    DASHBOARD CALCULATIONS
    --------------------------------
  */

  const applicationsToReview =
    Math.max(
      jobStats.totalApplicants -
        jobStats.totalShortlisted,
      0
    )

  const hiringScore =
    jobStats.activeCount > 0
      ? Math.min(
          100,
          60 +
            jobStats.activeCount * 5 +
            Math.min(
              jobStats.totalApplicants,
              20
            )
        )
      : 0

  return (
    <main className="recruiter-dashboard">

      {/* HEADER */}

      <div className="dashboard-header">

        <div>

          <span className="section-label">
            Recruiter Dashboard
          </span>

          <h1>
            Welcome back!
          </h1>

          <p>
            Manage your job posts, review applicants
            and discover the best candidates with
            AI-powered recruitment.
          </p>

        </div>

        <Link
          to="/post-job"
          className="dashboard-primary-btn"
        >
          + Post a Job
        </Link>

      </div>

      {/* STATISTICS */}

      <section className="dashboard-stats">

        <Link
          to="/manage-jobs"
          className="dashboard-stat-card dashboard-stat-link"
        >

          <span>
            Active Jobs
          </span>

          <h2>
            {jobStats.activeCount}
          </h2>

          <p>
            Currently hiring →
          </p>

        </Link>

        <div className="dashboard-stat-card">

          <span>
            Total Applicants
          </span>

          <h2>
            {jobStats.totalApplicants}
          </h2>

          <p>
            Across all job posts
          </p>

        </div>

        <div className="dashboard-stat-card">

          <span>
            Shortlisted
          </span>

          <h2>
            {jobStats.totalShortlisted}
          </h2>

          <p>
            Qualified candidates
          </p>

        </div>

        <Link
          to="/interviews"
          className="dashboard-stat-card dashboard-stat-link"
        >

          <span>
            Upcoming Interviews
          </span>

          <h2>
            {interviewStats.scheduled}
          </h2>

          <p>
            {interviewStats.total} total interviews →
          </p>

        </Link>

      </section>

      {/* MAIN DASHBOARD GRID */}

      <section className="dashboard-grid">

        {/* HIRING OVERVIEW */}

        <div className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>

              <span className="section-label">
                AI Recruitment
              </span>

              <h2>
                Hiring Overview
              </h2>

            </div>

            <span className="cv-score">
              {hiringScore}%
            </span>

          </div>

          <p className="dashboard-muted">
            {jobStats.activeCount > 0
              ? 'Your active job posts are ready to receive candidate applications. Manage your listings and review applicants from one place.'
              : 'You currently have no active job posts. Create a new job listing to start receiving applications.'}
          </p>

          <div className="cv-progress">

            <div
              className="cv-progress-bar"
              style={{
                width: '100%',
              }}
            >

              <div
                className="cv-progress-fill"
                style={{
                  width: `${hiringScore}%`,
                }}
              ></div>

            </div>

          </div>

          <div className="cv-suggestions">

            <div>

              <span className="suggestion-check">
                ✓
              </span>

              {jobStats.activeCount}{' '}
              active job{' '}
              {jobStats.activeCount === 1
                ? 'listing'
                : 'listings'}

            </div>

            <div>

              <span className="suggestion-check">
                ✓
              </span>

              {jobStats.totalShortlisted}{' '}
              candidate
              {jobStats.totalShortlisted === 1
                ? ''
                : 's'}{' '}
              shortlisted

            </div>

            <div>

              <span className="suggestion-warning">
                !
              </span>

              {applicationsToReview}{' '}
              application
              {applicationsToReview === 1
                ? ''
                : 's'}{' '}
              require review

            </div>

          </div>

          <Link
            to="/manage-jobs"
            className="dashboard-secondary-btn"
          >
            Manage Jobs
          </Link>

        </div>

        {/* QUICK ACTIONS */}

        <div className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>

              <span className="section-label">
                Quick Actions
              </span>

              <h2>
                Recruitment Tools
              </h2>

            </div>

          </div>

          <div className="recruiter-quick-actions">

            <Link
              to="/post-job"
              className="recruiter-action-item"
            >

              <div>

                <strong>
                  Post a New Job
                </strong>

                <span>
                  Create a new job opportunity
                </span>

              </div>

              <span>
                →
              </span>

            </Link>

            <Link
              to="/manage-jobs"
              className="recruiter-action-item"
            >

              <div>

                <strong>
                  Manage Jobs
                </strong>

                <span>
                  Edit, close or manage job posts
                </span>

              </div>

              <span>
                →
              </span>

            </Link>

            <Link
              to="/review-applicants"
              className="recruiter-action-item"
            >

              <div>

                <strong>
                  Review Applicants
                </strong>

                <span>
                  Check recent applications
                </span>

              </div>

              <span>
                →
              </span>

            </Link>

            <Link
              to="/schedule-interview"
              className="recruiter-action-item"
            >

              <div>

                <strong>
                  Schedule Interview
                </strong>

                <span>
                  Schedule a candidate interview
                </span>

              </div>

              <span>
                →
              </span>

            </Link>

            <Link
              to="/interviews"
              className="recruiter-action-item"
            >

              <div>

                <strong>
                  View Interviews
                </strong>

                <span>
                  {interviewStats.scheduled}{' '}
                  upcoming
                  {' '}•{' '}
                  {interviewStats.completed}{' '}
                  completed
                </span>

              </div>

              <span>
                →
              </span>

            </Link>

          </div>

        </div>

      </section>

      {/* TOP CANDIDATES */}

      <section className="dashboard-section">

        <div className="dashboard-section-heading">

          <div>

            <span className="section-label">
              AI Recommended
            </span>

            <h2>
              Top Candidates
            </h2>

          </div>

          <Link
            to="/review-applicants"
            className="dashboard-text-btn"
          >
            View All Candidates
          </Link>

        </div>

        <div className="recruiter-candidate-grid">

          {candidates.map(
            (candidate) => (

              <div
                className="recruiter-candidate-card"
                key={candidate.id}
              >

                <div className="candidate-match">
                  {candidate.match} Match
                </div>

                <div className="candidate-avatar">
                  {candidate.name.charAt(0)}
                </div>

                <h3>
                  {candidate.name}
                </h3>

                <p>
                  {candidate.role}
                </p>

                <span>
                  {candidate.experience}{' '}
                  Experience
                </span>

                <div className="candidate-card-bottom">

                  <span
                    className={`candidate-status ${candidate.status
                      .toLowerCase()}`}
                  >
                    {candidate.status}
                  </span>

                  <Link
                    to={`/candidate-profile/${candidate.id}`}
                    className="candidate-profile-link"
                  >
                    View Profile
                  </Link>

                </div>

              </div>

            )
          )}

        </div>

      </section>

      {/* ACTIVE JOBS */}

      <section className="dashboard-section">

        <div className="dashboard-section-heading">

          <div>

            <span className="section-label">
              Job Management
            </span>

            <h2>
              Active Job Posts
            </h2>

          </div>

          <Link
            to="/manage-jobs"
            className="dashboard-text-btn"
          >
            Manage All Jobs
          </Link>

        </div>

        {jobStats.activeJobs.length > 0 ? (

          <div className="application-table">

            <div className="recruiter-job-table-header">

              <span>
                Job Position
              </span>

              <span>
                Applicants
              </span>

              <span>
                Shortlisted
              </span>

              <span>
                Status
              </span>

            </div>

            {jobStats.activeJobs.map(
              (job) => (

                <div
                  className="recruiter-job-row"
                  key={job.id}
                >

                  <strong>
                    {job.title}
                  </strong>

                  <span>
                    {job.applicants || 0}
                  </span>

                  <span>
                    {job.shortlisted || 0}
                  </span>

                  <span className="job-active-status">
                    {job.status}
                  </span>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="manage-jobs-empty">

            <h3>
              No active jobs
            </h3>

            <p>
              You don't currently have any
              active job listings. Post a new
              job to start receiving
              applications.
            </p>

            <Link
              to="/post-job"
              className="dashboard-primary-btn"
            >
              + Post a Job
            </Link>

          </div>

        )}

      </section>

    </main>
  )
}

export default RecruiterDashboard