import { useMemo, useState } from 'react'
import {
  Link,
  useSearchParams,
} from 'react-router-dom'

function ReviewApplicants() {
  const [searchParams] = useSearchParams()

  const selectedJobId =
    searchParams.get('job')

  const [searchTerm, setSearchTerm] =
    useState('')

  const [statusFilter, setStatusFilter] =
    useState('All')

  const loadApplications = () => {
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

      return Array.isArray(parsed)
        ? parsed
        : []
    } catch (error) {
      console.error(
        'Could not load applications:',
        error
      )

      return []
    }
  }

  const [applicants, setApplicants] =
    useState(loadApplications)

  const getJobs = () => {
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

      return Array.isArray(parsed)
        ? parsed
        : []
    } catch (error) {
      console.error(
        'Could not load jobs:',
        error
      )

      return []
    }
  }

  const selectedJob = useMemo(() => {
    if (!selectedJobId) {
      return null
    }

    const jobs = getJobs()

    return (
      jobs.find(
        (job) =>
          String(job.id) ===
          String(selectedJobId)
      ) || null
    )
  }, [selectedJobId])

  const getInitials = (name = '') => {
    const words = name
      .trim()
      .split(' ')
      .filter(Boolean)

    if (words.length === 0) {
      return '?'
    }

    if (words.length === 1) {
      return words[0]
        .charAt(0)
        .toUpperCase()
    }

    return (
      words[0].charAt(0) +
      words[
        words.length - 1
      ].charAt(0)
    ).toUpperCase()
  }

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

    return parsedDate.toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }
    )
  }

  const jobApplicants =
    useMemo(() => {
      if (!selectedJobId) {
        return applicants
      }

      return applicants.filter(
        (applicant) =>
          String(
            applicant.jobId
          ) ===
          String(
            selectedJobId
          )
      )
    }, [
      applicants,
      selectedJobId,
    ])

  const filteredApplicants =
    useMemo(() => {
      return jobApplicants.filter(
        (applicant) => {
          const search =
            searchTerm
              .trim()
              .toLowerCase()

          const name =
            applicant.name || ''

          const role =
            applicant.jobTitle ||
            applicant.role ||
            ''

          const company =
            applicant.company || ''

          const skills =
            Array.isArray(
              applicant.skills
            )
              ? applicant.skills
              : []

          const matchesSearch =
            name
              .toLowerCase()
              .includes(search) ||
            role
              .toLowerCase()
              .includes(search) ||
            company
              .toLowerCase()
              .includes(search) ||
            skills.some(
              (skill) =>
                skill
                  .toLowerCase()
                  .includes(search)
            )

          const matchesStatus =
            statusFilter ===
              'All' ||
            applicant.status ===
              statusFilter

          return (
            matchesSearch &&
            matchesStatus
          )
        }
      )
    }, [
      jobApplicants,
      searchTerm,
      statusFilter,
    ])

  const syncJobCounts = (
    updatedApplications
  ) => {
    const jobs = getJobs()

    const updatedJobs =
      jobs.map((job) => {
        const applicationsForJob =
          updatedApplications.filter(
            (application) =>
              String(
                application.jobId
              ) ===
              String(job.id)
          )

        const shortlisted =
          applicationsForJob.filter(
            (application) =>
              application.status ===
                'Shortlisted' ||
              application.status ===
                'Interview'
          ).length

        return {
          ...job,

          applicants:
            applicationsForJob.length,

          shortlisted,
        }
      })

    localStorage.setItem(
      'hireai_jobs',
      JSON.stringify(
        updatedJobs
      )
    )
  }

  const updateStatus = (
    id,
    newStatus
  ) => {
    const updatedApplications =
      applicants.map(
        (applicant) =>
          String(
            applicant.id
          ) === String(id)
            ? {
                ...applicant,
                status:
                  newStatus,
                updatedAt:
                  new Date()
                    .toISOString(),
              }
            : applicant
      )

    setApplicants(
      updatedApplications
    )

    localStorage.setItem(
      'hireai_applications',
      JSON.stringify(
        updatedApplications
      )
    )

    syncJobCounts(
      updatedApplications
    )
  }

  const totalApplicants =
    jobApplicants.length

  const newApplicants =
    jobApplicants.filter(
      (applicant) =>
        applicant.status ===
        'New'
    ).length

  const shortlistedApplicants =
    jobApplicants.filter(
      (applicant) =>
        applicant.status ===
          'Shortlisted' ||
        applicant.status ===
          'Interview'
    ).length

  const interviewApplicants =
    jobApplicants.filter(
      (applicant) =>
        applicant.status ===
        'Interview'
    ).length

  return (
    <main className="review-applicants-page">

      <div className="review-applicants-header">

        <div>

          <span className="section-label">
            Recruitment
          </span>

          <h1>
            Review Applicants
          </h1>

          {selectedJob ? (
            <p>
              Reviewing applications
              for{' '}
              <strong>
                {selectedJob.title}
              </strong>{' '}
              at {selectedJob.company}.
            </p>
          ) : (
            <p>
              Review candidates,
              manage applications and
              move candidates through
              your recruitment process.
            </p>
          )}

        </div>

        <div className="manage-jobs-header-actions">

          {selectedJobId && (
            <Link
              to="/review-applicants"
              className="dashboard-secondary-btn"
            >
              View All Applicants
            </Link>
          )}

          <Link
            to="/recruiter-dashboard"
            className="dashboard-secondary-btn"
          >
            Back to Dashboard
          </Link>

        </div>

      </div>

      <section className="applicant-summary">

        <div className="applicant-summary-card">
          <span>Total Applicants</span>
          <strong>
            {totalApplicants}
          </strong>
        </div>

        <div className="applicant-summary-card">
          <span>New</span>
          <strong>
            {newApplicants}
          </strong>
        </div>

        <div className="applicant-summary-card">
          <span>Shortlisted</span>
          <strong>
            {shortlistedApplicants}
          </strong>
        </div>

        <div className="applicant-summary-card">
          <span>Interviews</span>
          <strong>
            {interviewApplicants}
          </strong>
        </div>

      </section>

      <section className="applicant-toolbar">

        <div className="applicant-search">

          <input
            type="text"
            placeholder="Search by name, position, company or skill..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />

        </div>

        <select
          className="applicant-filter"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
        >
          <option value="All">
            All Applicants
          </option>

          <option value="New">
            New
          </option>

          <option value="Under Review">
            Under Review
          </option>

          <option value="Shortlisted">
            Shortlisted
          </option>

          <option value="Interview">
            Interview
          </option>

          <option value="Rejected">
            Rejected
          </option>
        </select>

      </section>

      <section className="applicant-list">

        {filteredApplicants.length >
        0 ? (

          filteredApplicants.map(
            (applicant) => {
              const applicantRole =
                applicant.jobTitle ||
                applicant.role ||
                'Candidate'

              const applicantSkills =
                Array.isArray(
                  applicant.skills
                )
                  ? applicant.skills
                  : []

              return (
                <article
                  className="applicant-card"
                  key={applicant.id}
                >

                  <div className="applicant-main-info">

                    <div className="applicant-avatar">
                      {getInitials(
                        applicant.name
                      )}
                    </div>

                    <div className="applicant-details">

                      <div className="applicant-name-row">

                        <div>

                          <h2>
                            {
                              applicant.name
                            }
                          </h2>

                          <p>
                            {applicantRole}
                          </p>

                          {applicant.company && (
                            <small>
                              {
                                applicant.company
                              }
                            </small>
                          )}

                        </div>

                        {applicant.matchScore !==
                          null &&
                          applicant.matchScore !==
                            undefined && (

                          <div className="applicant-match-score">

                            <strong>
                              {
                                applicant.matchScore
                              }
                              %
                            </strong>

                            <span>
                              AI Match
                            </span>

                          </div>

                        )}

                      </div>

                      <div className="applicant-meta">

                        {applicant.email && (
                          <span>
                            Email:{' '}
                            {
                              applicant.email
                            }
                          </span>
                        )}

                        {applicant.phone && (
                          <span>
                            Phone:{' '}
                            {
                              applicant.phone
                            }
                          </span>
                        )}

                        <span>
                          Applied:{' '}
                          {formatDate(
                            applicant.appliedAt
                          )}
                        </span>

                      </div>

                      {applicantSkills.length >
                        0 && (

                        <div className="applicant-skills">

                          {applicantSkills.map(
                            (skill) => (
                              <span
                                key={skill}
                              >
                                {skill}
                              </span>
                            )
                          )}

                        </div>

                      )}

                      {applicant.cvName && (

                        <div className="applicant-cv-info">
                          <strong>
                            CV:
                          </strong>{' '}
                          {
                            applicant.cvName
                          }
                        </div>

                      )}

                    </div>

                  </div>

                  <div className="applicant-card-footer">

                    <span
                      className={`applicant-status applicant-status-${(
                        applicant.status ||
                        'New'
                      )
                        .toLowerCase()
                        .replaceAll(
                          ' ',
                          '-'
                        )}`}
                    >
                      {applicant.status ||
                        'New'}
                    </span>

                    <div className="applicant-actions">

                      <Link
                        to={`/candidate-profile/${applicant.id}`}
                        className="applicant-view-btn"
                      >
                        View Profile
                      </Link>

                      <button
                        type="button"
                        className="applicant-shortlist-btn"
                        onClick={() =>
                          updateStatus(
                            applicant.id,
                            'Shortlisted'
                          )
                        }
                      >
                        Shortlist
                      </button>

                      <Link
                        to={`/schedule-interview?candidate=${encodeURIComponent(
                          applicant.name
                        )}&position=${encodeURIComponent(
                          applicantRole
                        )}&application=${encodeURIComponent(
                          applicant.id
                        )}`}
                        className="applicant-interview-btn"
                        onClick={() =>
                          updateStatus(
                            applicant.id,
                            'Interview'
                          )
                        }
                      >
                        Interview
                      </Link>

                      <button
                        type="button"
                        className="applicant-reject-btn"
                        onClick={() =>
                          updateStatus(
                            applicant.id,
                            'Rejected'
                          )
                        }
                      >
                        Reject
                      </button>

                    </div>

                  </div>

                </article>
              )
            }
          )

        ) : (

          <div className="no-applicants">

            <h3>
              {jobApplicants.length ===
              0
                ? 'No applications yet'
                : 'No applicants found'}
            </h3>

            <p>
              {jobApplicants.length ===
              0
                ? selectedJob
                  ? `No candidates have applied for ${selectedJob.title} yet.`
                  : 'Candidate applications will appear here after they apply for your jobs.'
                : 'Try changing your search or applicant status filter.'}
            </p>

          </div>

        )}

      </section>

    </main>
  )
}

export default ReviewApplicants