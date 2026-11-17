import { useMemo, useState } from 'react'
import {
  Link,
  useParams,
} from 'react-router-dom'

function CandidateProfile() {
  const { id } = useParams()

  /*
    --------------------------------
    DEMO CANDIDATES
    --------------------------------
  */

  const demoCandidates = [
    {
      id: '1',
      name: 'Sarah Johnson',
      initials: 'SJ',
      role: 'Frontend Developer',
      email: 'sarah.johnson@example.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      experience: '3 Years',
      education: 'B.Sc. in Computer Science',
      university: 'New York University',
      match: 94,
      status: 'Shortlisted',
      applied: 'Sep 24, 2026',
      skills: [
        'React',
        'JavaScript',
        'HTML',
        'CSS',
        'Git',
        'Responsive Design',
      ],
      summary:
        'Frontend developer with experience building responsive and user-friendly web applications using React and modern JavaScript.',
      strengths: [
        'Strong React experience',
        'Good frontend fundamentals',
        'Relevant technical skills',
        'Experience matches the role',
      ],
      isRealApplication: false,
    },

    {
      id: '2',
      name: 'Michael Chen',
      initials: 'MC',
      role: 'React Developer',
      email: 'michael.chen@example.com',
      phone: '+1 (555) 234-5678',
      location: 'New York, NY',
      experience: '4 Years',
      education: 'B.Sc. in Software Engineering',
      university: 'Boston University',
      match: 91,
      status: 'Under Review',
      applied: 'Sep 23, 2026',
      skills: [
        'React',
        'Node.js',
        'TypeScript',
        'JavaScript',
        'REST API',
        'Git',
      ],
      summary:
        'React developer with experience creating scalable web applications and working with modern JavaScript and TypeScript technologies.',
      strengths: [
        'Strong React knowledge',
        'TypeScript experience',
        'Backend integration experience',
        'Good overall technical match',
      ],
      isRealApplication: false,
    },

    {
      id: '3',
      name: 'Emily Davis',
      initials: 'ED',
      role: 'UI/UX Designer',
      email: 'emily.davis@example.com',
      phone: '+1 (555) 345-6789',
      location: 'Brooklyn, NY',
      experience: '2 Years',
      education: 'B.A. in Digital Design',
      university: 'Parsons School of Design',
      match: 88,
      status: 'Interview',
      applied: 'Sep 22, 2026',
      skills: [
        'Figma',
        'UI Design',
        'UX Research',
        'Prototyping',
        'Wireframing',
        'Design Systems',
      ],
      summary:
        'UI/UX designer focused on creating clean, accessible and intuitive digital experiences for web products.',
      strengths: [
        'Strong UI design portfolio',
        'Relevant Figma experience',
        'Good prototyping skills',
        'User-centered design experience',
      ],
      isRealApplication: false,
    },

    {
      id: '4',
      name: 'Daniel Wilson',
      initials: 'DW',
      role: 'Frontend Developer',
      email: 'daniel.wilson@example.com',
      phone: '+1 (555) 456-7890',
      location: 'Queens, NY',
      experience: '2 Years',
      education: 'B.Sc. in Information Technology',
      university: 'City University of New York',
      match: 84,
      status: 'New',
      applied: 'Sep 21, 2026',
      skills: [
        'HTML',
        'CSS',
        'JavaScript',
        'React',
        'Bootstrap',
        'Git',
      ],
      summary:
        'Frontend developer with practical experience creating responsive websites and JavaScript-based user interfaces.',
      strengths: [
        'Good frontend foundation',
        'Responsive design experience',
        'Relevant JavaScript skills',
        'Growing React experience',
      ],
      isRealApplication: false,
    },

    {
      id: '5',
      name: 'Sophia Martinez',
      initials: 'SM',
      role: 'Junior Web Developer',
      email: 'sophia.martinez@example.com',
      phone: '+1 (555) 567-8901',
      location: 'New Jersey',
      experience: '1 Year',
      education: 'B.Sc. in Computer Science',
      university: 'Rutgers University',
      match: 79,
      status: 'New',
      applied: 'Sep 20, 2026',
      skills: [
        'React',
        'Bootstrap',
        'JavaScript',
        'HTML',
        'CSS',
        'Git',
      ],
      summary:
        'Junior web developer with foundational frontend development skills and hands-on experience building responsive web interfaces.',
      strengths: [
        'Good junior-level skill set',
        'React fundamentals',
        'Responsive development experience',
        'Strong learning potential',
      ],
      isRealApplication: false,
    },
  ]

  /*
    --------------------------------
    LOAD APPLICATIONS
    --------------------------------
  */

  const getApplications = () => {
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
    LOAD JOBS
    --------------------------------
  */

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

  const [applications, setApplications] =
    useState(getApplications)

  /*
    --------------------------------
    HELPERS
    --------------------------------
  */

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
      return date
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

  /*
    --------------------------------
    FIND REAL APPLICATION
    --------------------------------
  */

  const realApplication =
    useMemo(() => {
      return (
        applications.find(
          (application) =>
            String(
              application.id
            ) === String(id)
        ) || null
      )
    }, [applications, id])

  /*
    --------------------------------
    FIND DEMO CANDIDATE
    --------------------------------
  */

  const demoCandidate =
    useMemo(() => {
      return (
        demoCandidates.find(
          (candidate) =>
            String(
              candidate.id
            ) === String(id)
        ) || null
      )
    }, [id])

  /*
    --------------------------------
    BUILD REAL CANDIDATE PROFILE
    --------------------------------
  */

  const realCandidate =
    useMemo(() => {
      if (!realApplication) {
        return null
      }

      const jobs = getJobs()

      const relatedJob =
        jobs.find(
          (job) =>
            String(job.id) ===
            String(
              realApplication.jobId
            )
        ) || null

      const jobSkills =
        Array.isArray(
          relatedJob?.skills
        )
          ? relatedJob.skills
          : []

      return {
        id:
          realApplication.id,

        name:
          realApplication.name ||
          'Candidate',

        initials:
          getInitials(
            realApplication.name
          ),

        role:
          realApplication.jobTitle ||
          relatedJob?.title ||
          'Candidate',

        email:
          realApplication.email ||
          'Not provided',

        phone:
          realApplication.phone ||
          'Not provided',

        location:
          realApplication.location ||
          'Not provided',

        experience:
          realApplication.experience ||
          'Not provided',

        education:
          realApplication.education ||
          'Not provided',

        university:
          realApplication.university ||
          'Not provided',

        match:
          realApplication.matchScore,

        status:
          realApplication.status ||
          'New',

        applied:
          formatDate(
            realApplication.appliedAt
          ),

        skills:
          Array.isArray(
            realApplication.skills
          ) &&
          realApplication.skills.length >
            0
            ? realApplication.skills
            : jobSkills,

        summary:
          realApplication.coverLetter ||
          'The candidate has not provided an additional professional summary.',

        strengths: [
          'Application submitted successfully',
          'Candidate information available for recruiter review',
          relatedJob
            ? `Applied for ${relatedJob.title}`
            : 'Application linked to a job position',
        ],

        cvName:
          realApplication.cvName ||
          '',

        coverLetter:
          realApplication.coverLetter ||
          '',

        company:
          realApplication.company ||
          relatedJob?.company ||
          '',

        jobId:
          realApplication.jobId,

        isRealApplication: true,
      }
    }, [realApplication])

  /*
    --------------------------------
    CHOOSE PROFILE
    --------------------------------
  */

  const candidate =
    realCandidate ||
    demoCandidate

  /*
    --------------------------------
    SYNC JOB COUNTS
    --------------------------------
  */

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
              ) === String(job.id)
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

  /*
    --------------------------------
    UPDATE REAL APPLICATION
    --------------------------------
  */

  const updateApplicationStatus = (
    newStatus
  ) => {
    if (
      !candidate ||
      !candidate.isRealApplication
    ) {
      alert(
        `Demo candidate status changed to ${newStatus} for preview only.`
      )
      return
    }

    const updatedApplications =
      applications.map(
        (application) =>
          String(
            application.id
          ) === String(id)
            ? {
                ...application,

                status:
                  newStatus,

                updatedAt:
                  new Date()
                    .toISOString(),
              }
            : application
      )

    setApplications(
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

  /*
    --------------------------------
    NOT FOUND
    --------------------------------
  */

  if (!candidate) {
    return (
      <main className="candidate-profile-page">

        <div className="candidate-profile-topbar">

          <div>

            <span className="section-label">
              Candidate Profile
            </span>

            <h1>
              Candidate Not Found
            </h1>

            <p>
              This candidate profile
              could not be found.
            </p>

          </div>

          <Link
            to="/review-applicants"
            className="dashboard-secondary-btn"
          >
            Back to Applicants
          </Link>

        </div>

      </main>
    )
  }

  const hasMatchScore =
    candidate.match !== null &&
    candidate.match !== undefined

  return (
    <main className="candidate-profile-page">

      {/* TOP BAR */}

      <div className="candidate-profile-topbar">

        <div>

          <span className="section-label">
            Candidate Profile
          </span>

          <h1>
            Applicant Details
          </h1>

          <p>
            Review candidate information,
            application details and
            recruitment status.
          </p>

        </div>

        <Link
          to={
            candidate.jobId
              ? `/review-applicants?job=${candidate.jobId}`
              : '/review-applicants'
          }
          className="dashboard-secondary-btn"
        >
          Back to Applicants
        </Link>

      </div>

      {/* HERO */}

      <section className="candidate-profile-hero">

        <div className="candidate-profile-identity">

          <div className="candidate-profile-avatar">
            {candidate.initials}
          </div>

          <div>

            <h2>
              {candidate.name}
            </h2>

            <p>
              {candidate.role}
            </p>

            <div className="candidate-profile-contact">

              <span>
                {candidate.location}
              </span>

              <span>
                {candidate.email}
              </span>

              <span>
                {candidate.phone}
              </span>

            </div>

          </div>

        </div>

        {hasMatchScore ? (

          <div className="candidate-profile-score">

            <strong>
              {candidate.match}%
            </strong>

            <span>
              AI Match
            </span>

          </div>

        ) : (

          <div className="candidate-profile-score">

            <strong>
              —
            </strong>

            <span>
              AI Pending
            </span>

          </div>

        )}

      </section>

      {/* STATS */}

      <section className="candidate-profile-stats">

        <div>

          <span>
            Experience
          </span>

          <strong>
            {candidate.experience}
          </strong>

        </div>

        <div>

          <span>
            Application Status
          </span>

          <strong>
            {candidate.status}
          </strong>

        </div>

        <div>

          <span>
            Applied
          </span>

          <strong>
            {candidate.applied}
          </strong>

        </div>

        <div>

          <span>
            AI Match
          </span>

          <strong>
            {hasMatchScore
              ? `${candidate.match}%`
              : 'Pending'}
          </strong>

        </div>

      </section>

      <div className="candidate-profile-grid">

        {/* MAIN */}

        <div className="candidate-profile-main">

          {/* OVERVIEW */}

          <section className="candidate-profile-card">

            <span className="section-label">
              Application
            </span>

            <h2>
              Candidate Overview
            </h2>

            <p className="candidate-profile-summary">
              {candidate.summary}
            </p>

          </section>

          {/* APPLICATION DETAILS */}

          {candidate.isRealApplication && (

            <section className="candidate-profile-card">

              <span className="section-label">
                Application Details
              </span>

              <h2>
                Submitted Application
              </h2>

              <div className="candidate-profile-info-row">

                <div>

                  <span>
                    Position
                  </span>

                  <strong>
                    {candidate.role}
                  </strong>

                  <p>
                    {candidate.company ||
                      'Company information unavailable'}
                  </p>

                </div>

                <div>

                  <span>
                    CV
                  </span>

                  <strong>
                    {candidate.cvName ||
                      'No CV filename available'}
                  </strong>

                  <p>
                    CV file information
                    submitted with the
                    application.
                  </p>

                </div>

              </div>

            </section>

          )}

          {/* COVER LETTER */}

          {candidate.isRealApplication &&
            candidate.coverLetter && (

            <section className="candidate-profile-card">

              <span className="section-label">
                Cover Letter
              </span>

              <h2>
                Candidate Message
              </h2>

              <p className="candidate-profile-summary">
                {
                  candidate.coverLetter
                }
              </p>

            </section>

          )}

          {/* SKILLS */}

          <section className="candidate-profile-card">

            <span className="section-label">
              Skills
            </span>

            <h2>
              Technical Skills
            </h2>

            {candidate.skills.length >
            0 ? (

              <div className="candidate-profile-skills">

                {candidate.skills.map(
                  (skill) => (

                    <span key={skill}>
                      {skill}
                    </span>

                  )
                )}

              </div>

            ) : (

              <p className="candidate-profile-summary">
                Skills have not been
                added to this candidate
                profile yet.
              </p>

            )}

          </section>

          {/* BACKGROUND */}

          <section className="candidate-profile-card">

            <span className="section-label">
              Background
            </span>

            <h2>
              Education & Experience
            </h2>

            <div className="candidate-profile-info-row">

              <div>

                <span>
                  Education
                </span>

                <strong>
                  {candidate.education}
                </strong>

                <p>
                  {candidate.university}
                </p>

              </div>

              <div>

                <span>
                  Professional Experience
                </span>

                <strong>
                  {candidate.experience}
                </strong>

                <p>
                  Candidate for{' '}
                  {candidate.role}.
                </p>

              </div>

            </div>

          </section>

        </div>

        {/* SIDEBAR */}

        <aside className="candidate-profile-sidebar">

          {/* AI ANALYSIS */}

          <section className="candidate-profile-card">

            <span className="section-label">
              AI Analysis
            </span>

            <h2>
              Match Analysis
            </h2>

            {hasMatchScore ? (
              <>

                <div className="candidate-large-score">
                  {candidate.match}%
                </div>

                <div className="candidate-profile-progress">

                  <div
                    style={{
                      width: `${candidate.match}%`,
                    }}
                  ></div>

                </div>

                <p>
                  The current AI match
                  score estimates how
                  closely this candidate
                  matches the position.
                </p>

              </>
            ) : (
              <>

                <div className="candidate-large-score">
                  —
                </div>

                <p>
                  AI analysis has not
                  been generated for
                  this application yet.
                </p>

              </>
            )}

          </section>

          {/* HIGHLIGHTS */}

          <section className="candidate-profile-card">

            <span className="section-label">
              Highlights
            </span>

            <h2>
              Candidate Information
            </h2>

            <div className="candidate-strength-list">

              {candidate.strengths.map(
                (strength) => (

                  <div key={strength}>

                    <span>
                      ✓
                    </span>

                    {strength}

                  </div>

                )
              )}

            </div>

          </section>

          {/* ACTIONS */}

          <section className="candidate-profile-card">

            <span className="section-label">
              Recruitment
            </span>

            <h2>
              Candidate Actions
            </h2>

            <div className="candidate-profile-actions">

              <button
                type="button"
                className="profile-shortlist-btn"
                onClick={() =>
                  updateApplicationStatus(
                    'Shortlisted'
                  )
                }
              >
                Shortlist Candidate
              </button>

              <Link
                to={`/schedule-interview?candidate=${encodeURIComponent(
                  candidate.name
                )}&position=${encodeURIComponent(
                  candidate.role
                )}${
                  candidate.isRealApplication
                    ? `&application=${encodeURIComponent(
                        candidate.id
                      )}`
                    : ''
                }`}
                className="profile-interview-btn"
                onClick={() => {
                  if (
                    candidate.isRealApplication
                  ) {
                    updateApplicationStatus(
                      'Interview'
                    )
                  }
                }}
              >
                Schedule Interview
              </Link>

              <button
                type="button"
                className="profile-reject-btn"
                onClick={() =>
                  updateApplicationStatus(
                    'Rejected'
                  )
                }
              >
                Reject Application
              </button>

            </div>

          </section>

        </aside>

      </div>

    </main>
  )
}

export default CandidateProfile