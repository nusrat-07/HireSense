import {
  Link,
  useParams,
  useSearchParams,
} from 'react-router-dom'

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
    skills: [
      'React',
      'JavaScript',
      'CSS',
    ],
    description:
      'We are looking for a Frontend Developer to build modern, responsive, and user-friendly web applications.',
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
    skills: [
      'Figma',
      'UI Design',
      'Prototyping',
    ],
    description:
      'We are looking for a UI/UX Designer to create clean, intuitive, and engaging digital experiences.',
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
    skills: [
      'Node.js',
      'Express',
      'MongoDB',
    ],
    description:
      'We are looking for a Backend Developer to build secure, scalable, and reliable server-side applications.',
  },
]

function JobDetails() {
  const { id } = useParams()
  const [searchParams] =
    useSearchParams()

  const source =
    searchParams.get('source')

  /*
    --------------------------------
    LOAD RECRUITER JOBS
    --------------------------------
  */

  const getRecruiterJobs = () => {
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

  const recruiterJobs =
    getRecruiterJobs()

  /*
    --------------------------------
    FIND JOB
    --------------------------------
  */

  let job = null
  let jobSource = source

  if (source === 'recruiter') {
    job =
      recruiterJobs.find(
        (item) =>
          String(item.id) ===
          String(id)
      ) || null
  } else if (source === 'sample') {
    job =
      sampleJobs.find(
        (item) =>
          String(item.id) ===
          String(id)
      ) || null
  } else {
    /*
      Fallback for old links.
    */

    job =
      recruiterJobs.find(
        (item) =>
          String(item.id) ===
          String(id)
      ) || null

    if (job) {
      jobSource = 'recruiter'
    } else {
      job =
        sampleJobs.find(
          (item) =>
            String(item.id) ===
            String(id)
        ) || null

      if (job) {
        jobSource = 'sample'
      }
    }
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
    if (!minimum && !maximum) {
      return 'Not specified'
    }

    const formatNumber = (number) =>
      `$${Number(
        number
      ).toLocaleString('en-US')}`

    if (minimum && maximum) {
      return `${formatNumber(
        minimum
      )} - ${formatNumber(
        maximum
      )}`
    }

    if (minimum) {
      return `From ${formatNumber(
        minimum
      )}`
    }

    return `Up to ${formatNumber(
      maximum
    )}`
  }

  /*
    --------------------------------
    JOB NOT FOUND
    --------------------------------
  */

  if (!job) {
    return (
      <div className="job-details-page">

        <div className="job-details-card">

          <h1>
            Job Not Found
          </h1>

          <p>
            This job may have been
            removed or is no longer
            available.
          </p>

          <Link to="/jobs">
            ← Back to Jobs
          </Link>

        </div>

      </div>
    )
  }

  const isClosed =
    job.status === 'Closed'

  return (
    <div className="job-details-page">

      <div className="job-details-card">

        <Link
          to="/jobs"
          className="back-to-jobs"
        >
          ← Back to Jobs
        </Link>

        {/* HEADING */}

        <div className="job-details-heading">

          <span className="section-label">
            Job Opportunity
          </span>

          <h1>
            {job.title}
          </h1>

          <h3>
            {job.company}
          </h3>

          {jobSource ===
            'recruiter' && (
            <span className="job-new-badge">
              Recruiter Posted
            </span>
          )}

        </div>

        {/* INFORMATION */}

        <div className="job-info-box">

          <p>
            <strong>
              Location:
            </strong>{' '}
            {job.location}
          </p>

          <p>
            <strong>
              Job Type:
            </strong>{' '}
            {job.jobType ||
              job.type ||
              'Not specified'}
          </p>

          {job.workMode && (
            <p>
              <strong>
                Work Mode:
              </strong>{' '}
              {job.workMode}
            </p>
          )}

          {job.experience && (
            <p>
              <strong>
                Experience:
              </strong>{' '}
              {job.experience}
            </p>
          )}

          <p>
            <strong>
              Salary:
            </strong>{' '}
            {formatSalary(
              job.salaryMin,
              job.salaryMax
            )}
          </p>

          {job.deadline && (
            <p>
              <strong>
                Application Deadline:
              </strong>{' '}
              {job.deadline}
            </p>
          )}

        </div>

        {/* DESCRIPTION */}

        <div className="job-description">

          <h2>
            Job Description
          </h2>

          <p>
            {job.description}
          </p>

        </div>

        {/* SKILLS */}

        <div className="required-skills">

          <h2>
            Required Skills
          </h2>

          <div className="job-skills">

            {(job.skills || []).map(
              (skill) => (
                <span key={skill}>
                  {skill}
                </span>
              )
            )}

          </div>

        </div>

        {/* APPLY */}

        {isClosed ? (

          <button
            type="button"
            className="apply-now-btn"
            disabled
          >
            Applications Closed
          </button>

        ) : (

          <Link
            to={`/apply/${job.id}?source=${jobSource}`}
            className="apply-now-btn"
          >
            Apply Now
          </Link>

        )}

      </div>

    </div>
  )
}

export default JobDetails