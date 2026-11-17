import { useState } from 'react'
import { Link } from 'react-router-dom'

function Candidates() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [analysisComplete, setAnalysisComplete] = useState(false)

  const handleFileChange = (event) => {
    const file = event.target.files[0]

    if (file) {
      setSelectedFile(file)
      setAnalysisComplete(false)
    }
  }

  const handleAnalyzeCV = () => {
    if (!selectedFile) {
      alert('Please upload your CV first.')
      return
    }

    setAnalysisComplete(true)
  }

  return (
    <main className="candidates-page">

      {/* HERO SECTION */}
      <section className="candidates-hero">
        <div className="candidates-hero-content">

          <span className="candidates-badge">
            For Candidates
          </span>

          <h1>Build Your Career with AI</h1>

          <p>
            Upload your CV, discover your strongest skills, and find job
            opportunities that match your experience.
          </p>

          <div className="candidates-hero-actions">
            <Link to="/jobs" className="candidate-primary-btn">
              Browse Jobs
            </Link>

            <a href="#cv-analysis" className="candidate-secondary-btn">
              Analyze My CV
            </a>
          </div>

        </div>
      </section>


      {/* MAIN CONTENT */}
      <div className="candidates-container">

        {/* CV ANALYSIS SECTION */}
        <section
          className="candidates-section"
          id="cv-analysis"
        >
          <div className="candidates-section-heading">
            <span className="section-label">
              AI CV Analysis
            </span>

            <h2>Discover Your Potential</h2>

            <p>
              Upload your CV and let HireAI analyze your skills,
              experience, and candidate profile.
            </p>
          </div>


          <div className="candidate-tools-grid">

            {/* CV UPLOAD CARD */}
            <div className="candidate-tool-card">

              <span className="candidate-card-badge">
                CV Upload
              </span>

              <h3>Upload Your CV</h3>

              <p>
                Upload your latest CV in PDF, DOC, or DOCX format.
              </p>

              <div className="cv-upload-box">

                <strong>
                  {selectedFile
                    ? selectedFile.name
                    : 'Choose your CV'}
                </strong>

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />

                <button
                  type="button"
                  className="analyze-cv-btn"
                  onClick={handleAnalyzeCV}
                >
                  Analyze CV
                </button>

              </div>

            </div>


            {/* AI ANALYSIS CARD */}
            <div className="candidate-tool-card">

              <span className="candidate-card-badge">
                Candidate Profile
              </span>

              <h3>AI Analysis</h3>

              <p>
                View your profile strength and detected skills.
              </p>

              {!analysisComplete ? (

                <div className="analysis-placeholder">

                  <div>
                    <h4>
                      Your analysis will appear here
                    </h4>

                    <p>
                      Upload your CV and click Analyze CV
                      to view your candidate profile.
                    </p>
                  </div>

                </div>

              ) : (

                <div>

                  <div className="match-score">
                    92%
                  </div>

                  <h3>
                    Excellent Match
                  </h3>

                  <p>
                    Your profile shows strong potential for
                    frontend development opportunities.
                  </p>

                  <div className="recommended-job-skills">
                    <span>React</span>
                    <span>JavaScript</span>
                    <span>CSS</span>
                    <span>UI/UX</span>
                    <span>Git</span>
                  </div>

                </div>

              )}

            </div>

          </div>

        </section>


        {/* RECOMMENDED JOBS */}
        <section className="candidates-section">

          <div className="candidates-section-heading">

            <span className="section-label">
              Smart Matching
            </span>

            <h2>Recommended Jobs</h2>

            <p>
              Opportunities selected based on your skills
              and experience.
            </p>

          </div>


          <div className="recommended-jobs-grid">

            {/* JOB 1 */}
            <div className="recommended-job-card">

              <span className="match-badge">
                94% Match
              </span>

              <h3>Frontend Developer</h3>

              <p>
                <strong>TechNova Inc.</strong>
              </p>

              <p>New York, NY</p>

              <div className="recommended-job-skills">
                <span>React</span>
                <span>JavaScript</span>
                <span>CSS</span>
              </div>

              <Link
                to="/jobs/1"
                className="view-job-btn"
              >
                View Job
              </Link>

            </div>


            {/* JOB 2 */}
            <div className="recommended-job-card">

              <span className="match-badge">
                89% Match
              </span>

              <h3>UI/UX Designer</h3>

              <p>
                <strong>CreativeLabs</strong>
              </p>

              <p>Remote</p>

              <div className="recommended-job-skills">
                <span>Figma</span>
                <span>UI Design</span>
                <span>Prototyping</span>
              </div>

              <Link
                to="/jobs/2"
                className="view-job-btn"
              >
                View Job
              </Link>

            </div>


            {/* JOB 3 */}
            <div className="recommended-job-card">

              <span className="match-badge">
                82% Match
              </span>

              <h3>Backend Developer</h3>

              <p>
                <strong>CloudCore</strong>
              </p>

              <p>Boston, MA</p>

              <div className="recommended-job-skills">
                <span>Node.js</span>
                <span>Express</span>
                <span>MongoDB</span>
              </div>

              <Link
                to="/jobs/3"
                className="view-job-btn"
              >
                View Job
              </Link>

            </div>

          </div>

        </section>


        {/* APPLICATION TRACKING */}
        <section className="candidates-section">

          <div className="candidates-section-heading">

            <span className="section-label">
              Applications
            </span>

            <h2>Track Your Applications</h2>

            <p>
              Keep track of the jobs you have applied for.
            </p>

          </div>


          <div className="application-list">

            <div className="application-item">

              <div>
                <h3>Frontend Developer</h3>
                <p>TechNova Inc.</p>
              </div>

              <span className="application-status">
                Submitted
              </span>

            </div>

          </div>

        </section>

      </div>

    </main>
  )
}

export default Candidates