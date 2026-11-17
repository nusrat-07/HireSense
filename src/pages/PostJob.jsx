import { useState } from 'react'
import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

function PostJob() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const editId = searchParams.get('edit')
  const isEditMode = Boolean(editId)

  /*
    --------------------------------
    LOAD SAVED JOBS
    --------------------------------
  */

  const getSavedJobs = () => {
    try {
      const savedJobs =
        localStorage.getItem('hireai_jobs')

      if (!savedJobs) {
        return []
      }

      const parsedJobs =
        JSON.parse(savedJobs)

      return Array.isArray(parsedJobs)
        ? parsedJobs
        : []
    } catch (error) {
      console.error(
        'Could not load saved jobs:',
        error
      )

      return []
    }
  }

  /*
    --------------------------------
    FIND JOB FOR EDITING
    --------------------------------
  */

  const getJobForEditing = () => {
    if (!editId) {
      return null
    }

    const jobs = getSavedJobs()

    return (
      jobs.find(
        (job) =>
          String(job.id) ===
          String(editId)
      ) || null
    )
  }

  const jobToEdit =
    getJobForEditing()

  /*
    --------------------------------
    FORM DATA
    --------------------------------
  */

  const [formData, setFormData] =
    useState(() => {
      if (jobToEdit) {
        return {
          title:
            jobToEdit.title || '',

          company:
            jobToEdit.company || '',

          location:
            jobToEdit.location || '',

          jobType:
            jobToEdit.jobType ||
            'Full-time',

          workMode:
            jobToEdit.workMode ||
            'On-site',

          experience:
            jobToEdit.experience ||
            'Entry Level',

          salaryMin:
            jobToEdit.salaryMin || '',

          salaryMax:
            jobToEdit.salaryMax || '',

          deadline:
            jobToEdit.deadline || '',

          skills:
            Array.isArray(
              jobToEdit.skills
            )
              ? jobToEdit.skills.join(', ')
              : jobToEdit.skills || '',

          description:
            jobToEdit.description || '',
        }
      }

      return {
        title: '',
        company: '',
        location: '',
        jobType: 'Full-time',
        workMode: 'On-site',
        experience: 'Entry Level',
        salaryMin: '',
        salaryMax: '',
        deadline: '',
        skills: '',
        description: '',
      }
    })

  /*
    --------------------------------
    HANDLE INPUT CHANGE
    --------------------------------
  */

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData(
      (currentData) => ({
        ...currentData,
        [name]: value,
      })
    )
  }

  /*
    --------------------------------
    SUBMIT JOB
    --------------------------------
  */

  const handleSubmit = (e) => {
    e.preventDefault()

    /*
      Salary validation
    */

    if (
      formData.salaryMin &&
      formData.salaryMax &&
      Number(formData.salaryMin) >
        Number(formData.salaryMax)
    ) {
      alert(
        'Maximum salary must be greater than or equal to minimum salary.'
      )

      return
    }

    /*
      Convert skills text into array
    */

    const skillsArray =
      formData.skills
        .split(',')
        .map(
          (skill) =>
            skill.trim()
        )
        .filter(
          (skill) =>
            skill !== ''
        )

    const existingJobs =
      getSavedJobs()

    /*
      --------------------------------
      EDIT EXISTING JOB
      --------------------------------
    */

    if (
      isEditMode &&
      jobToEdit
    ) {
      const updatedJob = {
        ...jobToEdit,

        title:
          formData.title,

        company:
          formData.company,

        location:
          formData.location,

        jobType:
          formData.jobType,

        workMode:
          formData.workMode,

        experience:
          formData.experience,

        salaryMin:
          formData.salaryMin,

        salaryMax:
          formData.salaryMax,

        deadline:
          formData.deadline,

        skills:
          skillsArray,

        description:
          formData.description,

        updatedAt:
          new Date().toISOString(),
      }

      const updatedJobs =
        existingJobs.map(
          (job) =>
            String(job.id) ===
            String(editId)
              ? updatedJob
              : job
        )

      localStorage.setItem(
        'hireai_jobs',
        JSON.stringify(updatedJobs)
      )

      alert(
        `"${formData.title}" updated successfully!`
      )

      navigate('/manage-jobs')

      return
    }

    /*
      --------------------------------
      CREATE NEW JOB
      --------------------------------
    */

    const newJob = {
      id: Date.now(),

      title:
        formData.title,

      company:
        formData.company,

      location:
        formData.location,

      jobType:
        formData.jobType,

      workMode:
        formData.workMode,

      experience:
        formData.experience,

      salaryMin:
        formData.salaryMin,

      salaryMax:
        formData.salaryMax,

      deadline:
        formData.deadline,

      skills:
        skillsArray,

      description:
        formData.description,

      status: 'Active',

      applicants: 0,

      shortlisted: 0,

      createdAt:
        new Date().toISOString(),
    }

    const updatedJobs = [
      ...existingJobs,
      newJob,
    ]

    localStorage.setItem(
      'hireai_jobs',
      JSON.stringify(updatedJobs)
    )

    alert(
      `"${formData.title}" published successfully!`
    )

    navigate('/manage-jobs')
  }

  /*
    --------------------------------
    INVALID EDIT ID
    --------------------------------
  */

  if (
    isEditMode &&
    !jobToEdit
  ) {
    return (
      <main className="post-job-page">

        <section className="post-job-card">

          <span className="section-label">
            Job Management
          </span>

          <h2>
            Job Not Found
          </h2>

          <p>
            This job could not be found
            or may have been deleted.
          </p>

          <Link
            to="/manage-jobs"
            className="dashboard-secondary-btn"
          >
            Back to Manage Jobs
          </Link>

        </section>

      </main>
    )
  }

  return (
    <main className="post-job-page">

      {/* HEADER */}

      <div className="post-job-header">

        <div>

          <span className="section-label">
            Job Management
          </span>

          <h1>
            {isEditMode
              ? 'Edit Job'
              : 'Post a New Job'}
          </h1>

          <p>
            {isEditMode
              ? 'Update the job information, requirements and application details.'
              : 'Create a job listing and start finding the right candidates with HireAI.'}
          </p>

        </div>

        <Link
          to="/manage-jobs"
          className="dashboard-secondary-btn"
        >
          Back to Manage Jobs
        </Link>

      </div>

      {/* FORM */}

      <form
        className="post-job-form"
        onSubmit={handleSubmit}
      >

        {/* JOB INFORMATION */}

        <section className="post-job-card">

          <div className="post-job-section-heading">

            <h2>
              Job Information
            </h2>

            <p>
              Enter the basic information
              about the position.
            </p>

          </div>

          <div className="post-job-grid">

            <div className="post-job-field full-width">

              <label>
                Job Title
              </label>

              <input
                type="text"
                name="title"
                placeholder="e.g. Frontend Developer"
                value={formData.title}
                onChange={handleChange}
                required
              />

            </div>

            <div className="post-job-field">

              <label>
                Company Name
              </label>

              <input
                type="text"
                name="company"
                placeholder="Enter company name"
                value={formData.company}
                onChange={handleChange}
                required
              />

            </div>

            <div className="post-job-field">

              <label>
                Location
              </label>

              <input
                type="text"
                name="location"
                placeholder="e.g. New York, NY"
                value={formData.location}
                onChange={handleChange}
                required
              />

            </div>

            <div className="post-job-field">

              <label>
                Job Type
              </label>

              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
              >
                <option>
                  Full-time
                </option>

                <option>
                  Part-time
                </option>

                <option>
                  Contract
                </option>

                <option>
                  Internship
                </option>

                <option>
                  Temporary
                </option>
              </select>

            </div>

            <div className="post-job-field">

              <label>
                Work Mode
              </label>

              <select
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
              >
                <option>
                  On-site
                </option>

                <option>
                  Remote
                </option>

                <option>
                  Hybrid
                </option>
              </select>

            </div>

            <div className="post-job-field">

              <label>
                Experience Level
              </label>

              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
              >
                <option>
                  Entry Level
                </option>

                <option>
                  Mid Level
                </option>

                <option>
                  Senior Level
                </option>

                <option>
                  Lead / Manager
                </option>
              </select>

            </div>

            <div className="post-job-field">

              <label>
                Application Deadline
              </label>

              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
              />

            </div>

          </div>

        </section>

        {/* SALARY */}

        <section className="post-job-card">

          <div className="post-job-section-heading">

            <h2>
              Salary Information
            </h2>

            <p>
              Add an estimated salary
              range for this position.
            </p>

          </div>

          <div className="post-job-grid">

            <div className="post-job-field">

              <label>
                Minimum Salary
              </label>

              <input
                type="number"
                name="salaryMin"
                placeholder="e.g. 50000"
                value={formData.salaryMin}
                onChange={handleChange}
                min="0"
              />

            </div>

            <div className="post-job-field">

              <label>
                Maximum Salary
              </label>

              <input
                type="number"
                name="salaryMax"
                placeholder="e.g. 75000"
                value={formData.salaryMax}
                onChange={handleChange}
                min="0"
              />

            </div>

          </div>

        </section>

        {/* SKILLS & DESCRIPTION */}

        <section className="post-job-card">

          <div className="post-job-section-heading">

            <h2>
              Skills & Description
            </h2>

            <p>
              Describe what you are
              looking for in a candidate.
            </p>

          </div>

          <div className="post-job-field">

            <label>
              Required Skills
            </label>

            <input
              type="text"
              name="skills"
              placeholder="e.g. React, JavaScript, HTML, CSS"
              value={formData.skills}
              onChange={handleChange}
              required
            />

            <small>
              Separate multiple skills
              with commas.
            </small>

          </div>

          <div className="post-job-field">

            <label>
              Job Description
            </label>

            <textarea
              name="description"
              rows="8"
              placeholder="Describe the role, responsibilities, requirements and benefits..."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>

          </div>

        </section>

        {/* ACTIONS */}

        <div className="post-job-actions">

          <Link
            to="/manage-jobs"
            className="post-job-cancel-btn"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="post-job-submit-btn"
          >
            {isEditMode
              ? 'Update Job'
              : 'Publish Job'}
          </button>

        </div>

      </form>

    </main>
  )
}

export default PostJob