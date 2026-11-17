import { useState } from 'react'
import { Link } from 'react-router-dom'

function Recruiters() {
  const [showJobForm, setShowJobForm] = useState(false)

  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full Time',
    skills: '',
    description: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setJobData({
      ...jobData,
      [name]: value,
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    alert('Job posted successfully!')

    setJobData({
      title: '',
      company: '',
      location: '',
      type: 'Full Time',
      skills: '',
      description: '',
    })

    setShowJobForm(false)
  }

  return (
    <main className="recruiters-page">

      {/* HERO SECTION */}
      <section className="recruiters-hero">

        <div className="recruiters-hero-content">

          <span className="recruiters-badge">
            For Recruiters
          </span>

          <h1>Find the Right Talent Faster</h1>

          <p>
            Post jobs, screen CVs, discover qualified candidates,
            and simplify your hiring process with AI-powered
            recruitment tools.
          </p>

          <div className="recruiters-hero-actions">

            <button
              type="button"
              className="recruiter-primary-btn"
              onClick={() => setShowJobForm(true)}
            >
              Post a Job
            </button>

            <a
              href="#candidates"
              className="recruiter-secondary-btn"
            >
              View Candidates
            </a>

          </div>

        </div>

      </section>


      <div className="recruiters-container">

        {/* RECRUITER TOOLS */}
        <section className="recruiters-section">

          <div className="recruiters-section-heading">

            <span className="section-label">
              Recruitment Tools
            </span>

            <h2>Everything You Need to Hire Smarter</h2>

            <p>
              Manage your recruitment process from one simple dashboard.
            </p>

          </div>


          <div className="recruiter-tools-grid">

            <div className="recruiter-tool-card">

              <div className="recruiter-tool-icon">
                JOB
              </div>

              <h3>Post Jobs</h3>

              <p>
                Create job opportunities and define the skills
                and experience you are looking for.
              </p>

              <button
                type="button"
                onClick={() => setShowJobForm(true)}
              >
                Create Job
              </button>

            </div>


            <div className="recruiter-tool-card">

              <div className="recruiter-tool-icon">
                AI
              </div>

              <h3>AI CV Screening</h3>

              <p>
                Let HireAI analyze candidate CVs and identify
                relevant skills and experience.
              </p>

              <button type="button">
                Screen Candidates
              </button>

            </div>


            <div className="recruiter-tool-card">

              <div className="recruiter-tool-icon">
                %
              </div>

              <h3>Smart Matching</h3>

              <p>
                Compare candidate profiles with job requirements
                and view AI-powered match scores.
              </p>

              <a href="#candidates">
                View Matches
              </a>

            </div>

          </div>

        </section>


        {/* POST JOB FORM */}
        {showJobForm && (

          <section className="recruiters-section">

            <div className="recruiters-section-heading">

              <span className="section-label">
                New Opportunity
              </span>

              <h2>Post a New Job</h2>

              <p>
                Enter the information below to create a new
                job opportunity.
              </p>

            </div>


            <form
              className="recruiter-job-form"
              onSubmit={handleSubmit}
            >

              <div className="recruiter-form-grid">

                <div className="recruiter-form-group">
                  <label>Job Title</label>

                  <input
                    type="text"
                    name="title"
                    value={jobData.title}
                    onChange={handleChange}
                    placeholder="e.g. Frontend Developer"
                    required
                  />
                </div>


                <div className="recruiter-form-group">
                  <label>Company Name</label>

                  <input
                    type="text"
                    name="company"
                    value={jobData.company}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    required
                  />
                </div>


                <div className="recruiter-form-group">
                  <label>Location</label>

                  <input
                    type="text"
                    name="location"
                    value={jobData.location}
                    onChange={handleChange}
                    placeholder="e.g. New York, NY"
                    required
                  />
                </div>


                <div className="recruiter-form-group">
                  <label>Job Type</label>

                  <select
                    name="type"
                    value={jobData.type}
                    onChange={handleChange}
                  >
                    <option>Full Time</option>
                    <option>Part Time</option>
                    <option>Contract</option>
                    <option>Remote</option>
                    <option>Internship</option>
                  </select>
                </div>

              </div>


              <div className="recruiter-form-group">
                <label>Required Skills</label>

                <input
                  type="text"
                  name="skills"
                  value={jobData.skills}
                  onChange={handleChange}
                  placeholder="e.g. React, JavaScript, CSS"
                  required
                />
              </div>


              <div className="recruiter-form-group">
                <label>Job Description</label>

                <textarea
                  name="description"
                  value={jobData.description}
                  onChange={handleChange}
                  placeholder="Describe the position..."
                  rows="6"
                  required
                />
              </div>


              <div className="recruiter-form-actions">

                <button
                  type="button"
                  className="cancel-job-btn"
                  onClick={() => setShowJobForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="publish-job-btn"
                >
                  Publish Job
                </button>

              </div>

            </form>

          </section>

        )}


        {/* CANDIDATES */}
        <section
          className="recruiters-section"
          id="candidates"
        >

          <div className="recruiters-section-heading">

            <span className="section-label">
              AI Matching
            </span>

            <h2>Top Candidates</h2>

            <p>
              Candidate profiles ranked by their match with
              your job requirements.
            </p>

          </div>


          <div className="recruiter-candidates-grid">

            <div className="recruiter-candidate-card">

              <div className="candidate-avatar">
                AR
              </div>

              <span className="recruiter-match-score">
                94% Match
              </span>

              <h3>Alex Rahman</h3>

              <p>Frontend Developer</p>

              <div className="recruiter-skills">
                <span>React</span>
                <span>JavaScript</span>
                <span>CSS</span>
              </div>

              <button type="button">
                View Profile
              </button>

            </div>


            <div className="recruiter-candidate-card">

              <div className="candidate-avatar">
                SM
              </div>

              <span className="recruiter-match-score">
                89% Match
              </span>

              <h3>Sarah Miller</h3>

              <p>UI/UX Designer</p>

              <div className="recruiter-skills">
                <span>Figma</span>
                <span>UI Design</span>
                <span>Prototyping</span>
              </div>

              <button type="button">
                View Profile
              </button>

            </div>


            <div className="recruiter-candidate-card">

              <div className="candidate-avatar">
                DK
              </div>

              <span className="recruiter-match-score">
                85% Match
              </span>

              <h3>David Kim</h3>

              <p>Backend Developer</p>

              <div className="recruiter-skills">
                <span>Node.js</span>
                <span>Express</span>
                <span>MongoDB</span>
              </div>

              <button type="button">
                View Profile
              </button>

            </div>

          </div>

        </section>


        {/* ACTIVE JOBS */}
        <section className="recruiters-section">

          <div className="recruiters-section-heading">

            <span className="section-label">
              Job Management
            </span>

            <h2>Your Active Jobs</h2>

            <p>
              View your current job listings and applicant activity.
            </p>

          </div>


          <div className="recruiter-active-jobs">

            <div className="recruiter-active-job">

              <div>
                <h3>Frontend Developer</h3>
                <p>TechNova Inc. • New York, NY</p>
              </div>

              <div className="active-job-info">
                <span>12 Applicants</span>

                <Link to="/jobs/1">
                  View Job
                </Link>
              </div>

            </div>


            <div className="recruiter-active-job">

              <div>
                <h3>UI/UX Designer</h3>
                <p>CreativeLabs • Remote</p>
              </div>

              <div className="active-job-info">
                <span>8 Applicants</span>

                <Link to="/jobs/2">
                  View Job
                </Link>
              </div>

            </div>

          </div>

        </section>

      </div>

    </main>
  )
}

export default Recruiters