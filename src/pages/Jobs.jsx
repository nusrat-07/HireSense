import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

function Jobs() {
  const [searchTerm, setSearchTerm] = useState('')
  const [jobTypeFilter, setJobTypeFilter] = useState('All')

  const sampleJobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'TechNova Inc.',
      location: 'New York, NY',
      jobType: 'Full Time',
      workMode: 'On-site',
      salaryMin: 80000,
      salaryMax: 100000,
      skills: ['React', 'JavaScript', 'CSS'],
      description:
        'Build modern, responsive and user-friendly web applications as part of a collaborative product team.',
      status: 'Active',
      source: 'sample',
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      company: 'CreativeLabs',
      location: 'Remote',
      jobType: 'Full Time',
      workMode: 'Remote',
      salaryMin: 70000,
      salaryMax: 90000,
      skills: ['Figma', 'UI Design', 'Prototyping'],
      description:
        'Create clean, intuitive and engaging digital experiences while working closely with product and engineering teams.',
      status: 'Active',
      source: 'sample',
    },
    {
      id: 3,
      title: 'Backend Developer',
      company: 'CloudCore',
      location: 'Boston, MA',
      jobType: 'Full Time',
      workMode: 'Hybrid',
      salaryMin: 90000,
      salaryMax: 115000,
      skills: ['Node.js', 'Express', 'MongoDB'],
      description:
        'Build secure, scalable and reliable server-side applications and APIs for modern web products.',
      status: 'Active',
      source: 'sample',
    },
  ]

  const recruiterJobs = useMemo(() => {
    try {
      const saved = localStorage.getItem('hireai_jobs')

      if (!saved) {
        return []
      }

      const parsed = JSON.parse(saved)

      if (!Array.isArray(parsed)) {
        return []
      }

      return parsed
        .filter((job) => job.status === 'Active')
        .map((job) => ({
          ...job,
          source: 'recruiter',
        }))
    } catch (error) {
      console.error(
        'Could not load recruiter jobs:',
        error
      )

      return []
    }
  }, [])

  const allJobs = [
    ...recruiterJobs,
    ...sampleJobs,
  ]

  const filteredJobs = allJobs.filter((job) => {
    const search = searchTerm.trim().toLowerCase()

    const title = (job.title || '').toLowerCase()
    const company = (job.company || '').toLowerCase()
    const location = (job.location || '').toLowerCase()

    const matchesSearch =
      title.includes(search) ||
      company.includes(search) ||
      location.includes(search) ||
      (job.skills || []).some((skill) =>
        String(skill).toLowerCase().includes(search)
      )

    const normalizedJobType = (
      job.jobType ||
      job.type ||
      ''
    )
      .replace('-', ' ')
      .toLowerCase()

    const normalizedFilter = jobTypeFilter
      .replace('-', ' ')
      .toLowerCase()

    const matchesType =
      jobTypeFilter === 'All' ||
      normalizedJobType === normalizedFilter

    return matchesSearch && matchesType
  })

  const formatSalary = (minimum, maximum) => {
    if (!minimum && !maximum) {
      return 'Salary not specified'
    }

    const formatNumber = (number) =>
      `$${Number(number).toLocaleString('en-US')}`

    if (minimum && maximum) {
      return `${formatNumber(minimum)} – ${formatNumber(
        maximum
      )}`
    }

    if (minimum) {
      return `From ${formatNumber(minimum)}`
    }

    return `Up to ${formatNumber(maximum)}`
  }

  const clearFilters = () => {
    setSearchTerm('')
    setJobTypeFilter('All')
  }

  return (
    <main className="jobs-page">
      <section className="jobs-header">
        <span className="section-label">
          Find Your Opportunity
        </span>

        <h1>Explore Jobs</h1>

        <p>
          Discover opportunities that match your skills,
          experience and career goals.
        </p>
      </section>

      <section className="jobs-search-section">
        <div className="jobs-search-field">
          <span className="jobs-search-icon">⌕</span>

          <input
            type="text"
            aria-label="Search jobs"
            placeholder="Search by job title, company, location or skill..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        <select
          className="jobs-type-select"
          aria-label="Filter by job type"
          value={jobTypeFilter}
          onChange={(e) =>
            setJobTypeFilter(e.target.value)
          }
        >
          <option value="All">
            All Job Types
          </option>

          <option value="Full Time">
            Full Time
          </option>

          <option value="Part Time">
            Part Time
          </option>

          <option value="Contract">
            Contract
          </option>

          <option value="Internship">
            Internship
          </option>

          <option value="Temporary">
            Temporary
          </option>
        </select>
      </section>

      <div className="jobs-result-heading">
        <div>
          <h2>Available Positions</h2>

          <p>
            {filteredJobs.length}{' '}
            {filteredJobs.length === 1
              ? 'job'
              : 'jobs'}{' '}
            available
          </p>
        </div>

        {(searchTerm || jobTypeFilter !== 'All') && (
          <button
            type="button"
            className="jobs-clear-btn"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>

      <section className="jobs-grid">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <article
              className="job-card"
              key={`${job.source}-${job.id}`}
            >
              <div className="job-card-top">
                <div className="job-card-heading">
                  <div className="job-company-logo">
                    {(job.company || 'C')
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="job-heading-content">
                    <div className="job-title-line">
                      <h3>{job.title}</h3>

                      {job.source === 'recruiter' && (
                        <span className="job-new-badge">
                          New
                        </span>
                      )}
                    </div>

                    <p className="job-company">
                      {job.company}
                    </p>
                  </div>
                </div>
              </div>

              <div className="job-meta">
                <span>
                  <b>Location</b>
                  {job.location || 'Not specified'}
                </span>

                <span>
                  <b>Type</b>
                  {job.jobType ||
                    job.type ||
                    'Not specified'}
                </span>

                <span>
                  <b>Work mode</b>
                  {job.workMode || 'Not specified'}
                </span>
              </div>

              <p className="job-card-description">
                {job.description ||
                  'View this position to learn more about the role and requirements.'}
              </p>

              {(job.skills || []).length > 0 && (
                <div className="job-skills">
                  {(job.skills || [])
                    .slice(0, 4)
                    .map((skill) => (
                      <span key={skill}>
                        {skill}
                      </span>
                    ))}
                </div>
              )}

              <div className="job-card-bottom">
                <div className="job-salary-area">
                  <span>Salary range</span>

                  <strong className="job-salary">
                    {formatSalary(
                      job.salaryMin,
                      job.salaryMax
                    )}
                  </strong>
                </div>

                <Link
                  to={`/jobs/${job.id}?source=${job.source}`}
                  className="view-job-btn"
                >
                  View Job
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))
        ) : (
          <div className="jobs-empty-state">
            <div className="jobs-empty-icon">
              ⌕
            </div>

            <h3>No matching jobs found</h3>

            <p>
              We couldn't find a position matching your
              current search. Try another keyword or job
              type.
            </p>

            <button
              type="button"
              className="jobs-empty-clear"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

export default Jobs