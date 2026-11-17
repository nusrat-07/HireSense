import { useState } from 'react'
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'

function Apply() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const source =
    searchParams.get('source') ||
    'sample'

  /*
    --------------------------------
    SAMPLE JOBS
    --------------------------------
  */

  const sampleJobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'TechNova',
      location: 'New York, NY',
      jobType: 'Full Time',
      workMode: 'On-site',
      experience: 'Mid Level',
      salaryMin: 80000,
      salaryMax: 100000,
      skills: [
        'React',
        'JavaScript',
        'CSS',
      ],
    },

    {
      id: 2,
      title: 'UI/UX Designer',
      company: 'CreativeLabs',
      location: 'Remote',
      jobType: 'Full Time',
      workMode: 'Remote',
      experience: 'Mid Level',
      salaryMin: 70000,
      salaryMax: 90000,
      skills: [
        'Figma',
        'UI Design',
        'Prototyping',
      ],
    },

    {
      id: 3,
      title: 'Backend Developer',
      company: 'CloudCore',
      location: 'Boston, MA',
      jobType: 'Full Time',
      workMode: 'Hybrid',
      experience: 'Mid Level',
      salaryMin: 90000,
      salaryMax: 115000,
      skills: [
        'Node.js',
        'Express',
        'MongoDB',
      ],
    },
  ]

  /*
    --------------------------------
    FORM
    --------------------------------
  */

  const [formData, setFormData] =
    useState({
      name: '',
      email: '',
      phone: '',
      coverLetter: '',
    })

  const [cvFile, setCvFile] =
    useState(null)

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false)

  /*
    --------------------------------
    LOAD RECRUITER JOBS
    --------------------------------
  */

  const getSavedJobs = () => {
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

  /*
    --------------------------------
    LOAD APPLICATIONS
    --------------------------------
  */

  const getSavedApplications =
    () => {
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

  /*
    --------------------------------
    FIND JOB
    --------------------------------
  */

  const savedJobs =
    getSavedJobs()

  const recruiterJob =
    savedJobs.find(
      (job) =>
        String(job.id) ===
        String(id)
    ) || null

  const sampleJob =
    sampleJobs.find(
      (job) =>
        String(job.id) ===
        String(id)
    ) || null

  let currentJob = null
  let jobSource = source

  if (source === 'recruiter') {
    currentJob =
      recruiterJob

    jobSource = 'recruiter'
  } else if (source === 'sample') {
    currentJob =
      sampleJob

    jobSource = 'sample'
  } else {
    currentJob =
      recruiterJob ||
      sampleJob

    jobSource =
      recruiterJob
        ? 'recruiter'
        : 'sample'
  }

  /*
    --------------------------------
    INPUT
    --------------------------------
  */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target

    setFormData(
      (currentData) => ({
        ...currentData,
        [name]: value,
      })
    )
  }

  /*
    --------------------------------
    CV
    --------------------------------
  */

  const handleFileChange = (
    e
  ) => {
    const file =
      e.target.files[0]

    if (!file) {
      setCvFile(null)
      return
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    if (
      file.type &&
      !allowedTypes.includes(
        file.type
      )
    ) {
      alert(
        'Please upload a PDF, DOC or DOCX file.'
      )

      e.target.value = ''
      setCvFile(null)

      return
    }

    const maxSize =
      5 * 1024 * 1024

    if (file.size > maxSize) {
      alert(
        'CV file must be 5 MB or smaller.'
      )

      e.target.value = ''
      setCvFile(null)

      return
    }

    setCvFile(file)
  }

  /*
    --------------------------------
    SUBMIT
    --------------------------------
  */

  const handleSubmit = (e) => {
    e.preventDefault()

    if (isSubmitting) {
      return
    }

    if (!currentJob) {
      alert(
        'This job could not be found.'
      )

      return
    }

    if (
      currentJob.status ===
      'Closed'
    ) {
      alert(
        'This job is no longer accepting applications.'
      )

      return
    }

    if (!cvFile) {
      alert(
        'Please upload your CV.'
      )

      return
    }

    setIsSubmitting(true)

    try {
      const applications =
        getSavedApplications()

      const normalizedEmail =
        formData.email
          .trim()
          .toLowerCase()

      /*
        SAME JOB ID CAN EXIST
        IN DIFFERENT SOURCES.

        Therefore both jobId
        and jobSource are checked.
      */

      const duplicate =
        applications.find(
          (application) =>
            String(
              application.jobId
            ) === String(id) &&
            (
              application.jobSource ||
              'recruiter'
            ) === jobSource &&
            (
              application.email ||
              ''
            )
              .trim()
              .toLowerCase() ===
              normalizedEmail
        )

      if (duplicate) {
        alert(
          'You have already applied for this job using this email address.'
        )

        setIsSubmitting(false)
        return
      }

      /*
        CREATE APPLICATION
      */

      const newApplication = {
        id: Date.now(),

        jobId: id,

        jobSource,

        jobTitle:
          currentJob.title,

        company:
          currentJob.company,

        jobLocation:
          currentJob.location ||
          '',

        jobType:
          currentJob.jobType ||
          '',

        workMode:
          currentJob.workMode ||
          '',

        name:
          formData.name.trim(),

        email:
          normalizedEmail,

        phone:
          formData.phone.trim(),

        cvName:
          cvFile.name,

        coverLetter:
          formData.coverLetter.trim(),

        status: 'New',

        matchScore: null,

        appliedAt:
          new Date()
            .toISOString(),
      }

      const updatedApplications =
        [
          ...applications,
          newApplication,
        ]

      localStorage.setItem(
        'hireai_applications',
        JSON.stringify(
          updatedApplications
        )
      )

      /*
        --------------------------------
        UPDATE RECRUITER JOB
        --------------------------------

        Sample jobs don't belong to a
        recruiter, so we only update
        applicant counts for recruiter
        jobs.
      */

      if (
        jobSource ===
          'recruiter' &&
        recruiterJob
      ) {
        const numberOfApplicants =
          updatedApplications.filter(
            (application) =>
              String(
                application.jobId
              ) === String(id) &&
              application.jobSource ===
                'recruiter'
          ).length

        const numberShortlisted =
          updatedApplications.filter(
            (application) =>
              String(
                application.jobId
              ) === String(id) &&
              application.jobSource ===
                'recruiter' &&
              (
                application.status ===
                  'Shortlisted' ||
                application.status ===
                  'Interview'
              )
          ).length

        const updatedJobs =
          savedJobs.map(
            (job) =>
              String(
                job.id
              ) === String(id)
                ? {
                    ...job,

                    applicants:
                      numberOfApplicants,

                    shortlisted:
                      numberShortlisted,
                  }
                : job
          )

        localStorage.setItem(
          'hireai_jobs',
          JSON.stringify(
            updatedJobs
          )
        )
      }

      alert(
        `Application submitted successfully!\n\nPosition: ${currentJob.title}\nCompany: ${currentJob.company}`
      )

      navigate(
        '/candidate-dashboard'
      )
    } catch (error) {
      console.error(
        'Application error:',
        error
      )

      alert(
        'Something went wrong while submitting your application.'
      )

      setIsSubmitting(false)
    }
  }

  /*
    --------------------------------
    JOB NOT FOUND
    --------------------------------
  */

  if (!currentJob) {
    return (
      <div className="apply-page">

        <div className="application-form-container">

          <div className="apply-heading">

            <span className="section-label">
              Application
            </span>

            <h1>
              Job Not Found
            </h1>

            <p>
              This job listing could
              not be found or may no
              longer be available.
            </p>

          </div>

          <Link
            to="/jobs"
            className="dashboard-primary-btn"
          >
            Browse Jobs
          </Link>

        </div>

      </div>
    )
  }

  /*
    --------------------------------
    CLOSED JOB
    --------------------------------
  */

  const isClosed =
    currentJob.status ===
    'Closed'

  return (
    <div className="apply-page">

      <div className="application-form-container">

        {/* BACK */}

        <Link
          to={`/jobs/${id}?source=${jobSource}`}
          className="back-to-jobs"
        >
          ← Back to Job
        </Link>

        {/* HEADING */}

        <div className="apply-heading">

          <span className="section-label">
            Application
          </span>

          <h1>
            Apply for this Position
          </h1>

          <p>
            Apply for{' '}
            <strong>
              {currentJob.title}
            </strong>{' '}
            at{' '}
            {currentJob.company}.
          </p>

        </div>

        {/* JOB SUMMARY */}

        <div className="apply-job-summary">

          <div>

            <span>
              Position
            </span>

            <strong>
              {currentJob.title}
            </strong>

          </div>

          <div>

            <span>
              Company
            </span>

            <strong>
              {currentJob.company}
            </strong>

          </div>

          <div>

            <span>
              Location
            </span>

            <strong>
              {currentJob.location ||
                'Not specified'}
            </strong>

          </div>

          <div>

            <span>
              Work Mode
            </span>

            <strong>
              {currentJob.workMode ||
                'Not specified'}
            </strong>

          </div>

        </div>

        {/* CLOSED */}

        {isClosed ? (

          <div className="no-applicants">

            <h3>
              Applications Closed
            </h3>

            <p>
              This position is no
              longer accepting new
              applications.
            </p>

            <Link
              to="/jobs"
              className="dashboard-primary-btn"
            >
              Browse Other Jobs
            </Link>

          </div>

        ) : (

          /* FORM */

          <form
            className="application-form"
            onSubmit={
              handleSubmit
            }
          >

            <div className="form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

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

              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={
                  formData.phone
                }
                onChange={
                  handleChange
                }
              />

            </div>

            <div className="form-group">

              <label htmlFor="cv">
                Upload CV
              </label>

              <input
                id="cv"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={
                  handleFileChange
                }
                required
              />

              {cvFile && (

                <small className="selected-cv-name">
                  Selected:{' '}
                  {cvFile.name}
                </small>

              )}

              <small
                style={{
                  display:
                    'block',
                  marginTop:
                    '6px',
                  opacity:
                    '0.65',
                }}
              >
                PDF, DOC or DOCX.
                Maximum 5 MB.
              </small>

            </div>

            <div className="form-group">

              <label htmlFor="message">
                Cover Letter
              </label>

              <textarea
                id="message"
                name="coverLetter"
                rows="6"
                placeholder="Tell us why you are a good fit for this position..."
                value={
                  formData.coverLetter
                }
                onChange={
                  handleChange
                }
              ></textarea>

            </div>

            <button
              type="submit"
              className="submit-application-btn"
              disabled={
                isSubmitting
              }
            >
              {isSubmitting
                ? 'Submitting...'
                : 'Submit Application'}
            </button>

          </form>

        )}

      </div>

    </div>
  )
}

export default Apply