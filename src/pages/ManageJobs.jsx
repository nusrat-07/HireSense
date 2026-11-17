import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

function ManageJobs() {
  /*
    --------------------------------
    LOAD JOBS
    --------------------------------
  */

  const getSavedJobs = () => {
    try {
      const savedJobs =
        localStorage.getItem(
          'hireai_jobs'
        )

      if (!savedJobs) {
        return []
      }

      const parsedJobs =
        JSON.parse(savedJobs)

      return Array.isArray(
        parsedJobs
      )
        ? parsedJobs
        : []
    } catch (error) {
      console.error(
        'Could not load jobs:',
        error
      )

      return []
    }
  }

  const [jobs, setJobs] =
    useState(getSavedJobs)

  const [searchTerm, setSearchTerm] =
    useState('')

  const [statusFilter, setStatusFilter] =
    useState('All')

  /*
    --------------------------------
    SAVE JOBS
    --------------------------------
  */

  const saveJobs = (
    updatedJobs
  ) => {
    setJobs(updatedJobs)

    localStorage.setItem(
      'hireai_jobs',
      JSON.stringify(
        updatedJobs
      )
    )
  }

  /*
    --------------------------------
    FILTER JOBS
    --------------------------------
  */

  const filteredJobs =
    useMemo(() => {
      return jobs.filter(
        (job) => {
          const search =
            searchTerm
              .toLowerCase()

          const matchesSearch =
            (job.title || '')
              .toLowerCase()
              .includes(search) ||
            (job.company || '')
              .toLowerCase()
              .includes(search) ||
            (job.location || '')
              .toLowerCase()
              .includes(search)

          const matchesStatus =
            statusFilter ===
              'All' ||
            job.status ===
              statusFilter

          return (
            matchesSearch &&
            matchesStatus
          )
        }
      )
    }, [
      jobs,
      searchTerm,
      statusFilter,
    ])

  /*
    --------------------------------
    CLOSE / REOPEN JOB
    --------------------------------
  */

  const toggleJobStatus = (
    job
  ) => {
    const newStatus =
      job.status === 'Active'
        ? 'Closed'
        : 'Active'

    const confirmed =
      window.confirm(
        `${
          newStatus === 'Closed'
            ? 'Close'
            : 'Reopen'
        } "${job.title}"?`
      )

    if (!confirmed) {
      return
    }

    const updatedJobs =
      jobs.map((item) =>
        String(item.id) ===
        String(job.id)
          ? {
              ...item,
              status: newStatus,
            }
          : item
      )

    saveJobs(
      updatedJobs
    )
  }

  /*
    --------------------------------
    DELETE JOB
    --------------------------------
  */

  const deleteJob = (
    job
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${job.title}"?\n\nThis action cannot be undone.`
      )

    if (!confirmed) {
      return
    }

    const updatedJobs =
      jobs.filter(
        (item) =>
          String(item.id) !==
          String(job.id)
      )

    saveJobs(
      updatedJobs
    )
  }

  /*
    --------------------------------
    DATE FORMAT
    --------------------------------
  */

  const formatDate = (
    date
  ) => {
    if (!date) {
      return 'No deadline'
    }

    const parts =
      date.split('-')

    if (
      parts.length !== 3
    ) {
      return date
    }

    const [
      year,
      month,
      day,
    ] = parts

    const localDate =
      new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      )

    return localDate.toLocaleDateString(
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
    SALARY FORMAT
    --------------------------------
  */

  const formatSalary = (
    minimum,
    maximum
  ) => {
    if (
      !minimum &&
      !maximum
    ) {
      return 'Not specified'
    }

    const formatNumber = (
      number
    ) =>
      Number(
        number
      ).toLocaleString(
        'en-US'
      )

    if (
      minimum &&
      maximum
    ) {
      return `$${formatNumber(
        minimum
      )} - $${formatNumber(
        maximum
      )}`
    }

    if (minimum) {
      return `From $${formatNumber(
        minimum
      )}`
    }

    return `Up to $${formatNumber(
      maximum
    )}`
  }

  /*
    --------------------------------
    STATISTICS
    --------------------------------
  */

  const activeCount =
    jobs.filter(
      (job) =>
        job.status === 'Active'
    ).length

  const closedCount =
    jobs.filter(
      (job) =>
        job.status === 'Closed'
    ).length

  const totalApplicants =
    jobs.reduce(
      (total, job) =>
        total +
        Number(
          job.applicants || 0
        ),
      0
    )

  return (
    <main className="manage-jobs-page">

      {/* HEADER */}

      <div className="manage-jobs-header">

        <div>

          <span className="section-label">
            Job Management
          </span>

          <h1>
            Manage Jobs
          </h1>

          <p>
            Manage your job listings,
            monitor applicants and
            control which positions are
            currently accepting
            applications.
          </p>

        </div>

        <div className="manage-jobs-header-actions">

          <Link
            to="/recruiter-dashboard"
            className="dashboard-secondary-btn"
          >
            Back to Dashboard
          </Link>

          <Link
            to="/post-job"
            className="dashboard-primary-btn"
          >
            + Post New Job
          </Link>

        </div>

      </div>

      {/* STATISTICS */}

      <section className="manage-job-stats">

        <div className="manage-job-stat-card">

          <span>
            Total Jobs
          </span>

          <strong>
            {jobs.length}
          </strong>

          <p>
            All job listings
          </p>

        </div>

        <div className="manage-job-stat-card">

          <span>
            Active Jobs
          </span>

          <strong>
            {activeCount}
          </strong>

          <p>
            Accepting applications
          </p>

        </div>

        <div className="manage-job-stat-card">

          <span>
            Closed Jobs
          </span>

          <strong>
            {closedCount}
          </strong>

          <p>
            No longer accepting
          </p>

        </div>

        <div className="manage-job-stat-card">

          <span>
            Total Applicants
          </span>

          <strong>
            {totalApplicants}
          </strong>

          <p>
            Across your jobs
          </p>

        </div>

      </section>

      {/* SEARCH + FILTER */}

      <section className="manage-jobs-toolbar">

        <div className="manage-job-search">

          <input
            type="text"
            placeholder="Search jobs by title, company or location..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />

        </div>

        <select
          className="manage-job-filter"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
        >

          <option value="All">
            All Jobs
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Closed">
            Closed
          </option>

        </select>

      </section>

      {/* JOB LIST */}

      <section className="manage-job-list">

        {filteredJobs.length >
        0 ? (

          filteredJobs.map(
            (job) => (

              <article
                className="manage-job-card"
                key={job.id}
              >

                <div className="manage-job-card-top">

                  <div>

                    <div className="manage-job-title-row">

                      <h2>
                        {job.title}
                      </h2>

                      <span
                        className={`manage-job-status manage-job-status-${(
                          job.status ||
                          'Active'
                        ).toLowerCase()}`}
                      >
                        {job.status ||
                          'Active'}
                      </span>

                    </div>

                    <p className="manage-job-company">
                      {job.company}
                    </p>

                    <div className="manage-job-tags">

                      {job.location && (
                        <span>
                          {
                            job.location
                          }
                        </span>
                      )}

                      {job.jobType && (
                        <span>
                          {
                            job.jobType
                          }
                        </span>
                      )}

                      {job.workMode && (
                        <span>
                          {
                            job.workMode
                          }
                        </span>
                      )}

                      {job.experience && (
                        <span>
                          {
                            job.experience
                          }
                        </span>
                      )}

                    </div>

                  </div>

                </div>

                {/* DETAILS */}

                <div className="manage-job-details">

                  <div>

                    <span>
                      Salary
                    </span>

                    <strong>
                      {formatSalary(
                        job.salaryMin,
                        job.salaryMax
                      )}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Deadline
                    </span>

                    <strong>
                      {formatDate(
                        job.deadline
                      )}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Applicants
                    </span>

                    <strong>
                      {job.applicants ||
                        0}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Shortlisted
                    </span>

                    <strong>
                      {job.shortlisted ||
                        0}
                    </strong>

                  </div>

                </div>

                {/* SKILLS */}

                {Array.isArray(
                  job.skills
                ) &&
                  job.skills.length >
                    0 && (

                  <div className="manage-job-skills">

                    {job.skills.map(
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

                {/* DESCRIPTION */}

                {job.description && (

                  <p className="manage-job-description">
                    {
                      job.description
                    }
                  </p>

                )}

                {/* ACTIONS */}

                <div className="manage-job-actions">

                  <Link
                    to={`/post-job?edit=${job.id}`}
                    className="manage-job-edit-btn"
                  >
                    Edit Job
                  </Link>

                  <Link
                    to={`/review-applicants?job=${job.id}`}
                    className="manage-job-applicants-btn"
                  >
                    View Applicants
                  </Link>

                  <button
                    type="button"
                    className={
                      job.status ===
                      'Active'
                        ? 'manage-job-close-btn'
                        : 'manage-job-reopen-btn'
                    }
                    onClick={() =>
                      toggleJobStatus(
                        job
                      )
                    }
                  >
                    {job.status ===
                    'Active'
                      ? 'Close Job'
                      : 'Reopen Job'}
                  </button>

                  <button
                    type="button"
                    className="manage-job-delete-btn"
                    onClick={() =>
                      deleteJob(
                        job
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </article>

            )
          )

        ) : (

          <div className="manage-jobs-empty">

            <h3>
              {jobs.length === 0
                ? 'No jobs posted yet'
                : 'No jobs found'}
            </h3>

            <p>
              {jobs.length === 0
                ? 'Create your first job listing to start receiving applications.'
                : 'Try changing your search or job status filter.'}
            </p>

            {jobs.length === 0 && (

              <Link
                to="/post-job"
                className="dashboard-primary-btn"
              >
                + Post Your First Job
              </Link>

            )}

          </div>

        )}

      </section>

    </main>
  )
}

export default ManageJobs