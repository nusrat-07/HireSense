import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

function Interviews() {
  const sampleInterviews = [
    {
      id: 1,
      candidateId: 1,
      candidate: 'Sarah Johnson',
      initials: 'SJ',
      position: 'Frontend Developer',
      date: 'Sep 28, 2026',
      time: '10:30 AM',
      duration: '30 Minutes',
      type: 'Video Interview',
      interviewer: 'John Smith',
      meetingLink: 'https://meet.example.com/sarah-interview',
      location: '',
      notes: '',
      status: 'Scheduled',
      isSample: true,
    },
    {
      id: 2,
      candidateId: 3,
      candidate: 'Emily Davis',
      initials: 'ED',
      position: 'UI/UX Designer',
      date: 'Sep 29, 2026',
      time: '2:00 PM',
      duration: '45 Minutes',
      type: 'Video Interview',
      interviewer: 'David Miller',
      meetingLink: 'https://meet.example.com/emily-interview',
      location: '',
      notes: '',
      status: 'Scheduled',
      isSample: true,
    },
    {
      id: 3,
      candidateId: 2,
      candidate: 'Michael Chen',
      initials: 'MC',
      position: 'React Developer',
      date: 'Oct 01, 2026',
      time: '11:00 AM',
      duration: '60 Minutes',
      type: 'In-Person Interview',
      interviewer: 'John Smith',
      meetingLink: '',
      location: 'HireAI Office - Meeting Room 2',
      notes: '',
      status: 'Scheduled',
      isSample: true,
    },
    {
      id: 4,
      candidateId: 4,
      candidate: 'Daniel Wilson',
      initials: 'DW',
      position: 'Frontend Developer',
      date: 'Sep 25, 2026',
      time: '3:30 PM',
      duration: '30 Minutes',
      type: 'Phone Interview',
      interviewer: 'Amanda Brown',
      meetingLink: '',
      location: '',
      notes: '',
      status: 'Completed',
      isSample: true,
    },
  ]

  const getSavedInterviews = () => {
    try {
      const saved = localStorage.getItem(
        'hireai_interviews'
      )

      if (!saved) {
        return []
      }

      const parsed = JSON.parse(saved)

      return Array.isArray(parsed)
        ? parsed
        : []
    } catch (error) {
      console.error(
        'Could not load saved interviews:',
        error
      )

      return []
    }
  }

  const getSavedSampleStatuses = () => {
    try {
      const saved = localStorage.getItem(
        'hireai_sample_interview_statuses'
      )

      if (!saved) {
        return {}
      }

      return JSON.parse(saved)
    } catch (error) {
      console.error(
        'Could not load sample interview statuses:',
        error
      )

      return {}
    }
  }

  const [savedInterviews, setSavedInterviews] =
    useState(getSavedInterviews)

  const [sampleStatuses, setSampleStatuses] =
    useState(getSavedSampleStatuses)

  const [statusFilter, setStatusFilter] =
    useState('All')

  const interviews = useMemo(() => {
    const updatedSamples =
      sampleInterviews.map((interview) => ({
        ...interview,
        status:
          sampleStatuses[interview.id] ||
          interview.status,
      }))

    return [
      ...savedInterviews,
      ...updatedSamples,
    ]
  }, [savedInterviews, sampleStatuses])

  const filteredInterviews = useMemo(() => {
    if (statusFilter === 'All') {
      return interviews
    }

    return interviews.filter(
      (interview) =>
        interview.status === statusFilter
    )
  }, [interviews, statusFilter])

  const formatDate = (date) => {
    if (!date) {
      return 'Not set'
    }

    if (
      typeof date === 'string' &&
      date.includes(',')
    ) {
      return date
    }

    const parts = date.split('-')

    if (parts.length !== 3) {
      return date
    }

    const [year, month, day] = parts

    const localDate = new Date(
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

  const formatTime = (time) => {
    if (!time) {
      return 'Not set'
    }

    if (
      time.toLowerCase().includes('am') ||
      time.toLowerCase().includes('pm')
    ) {
      return time
    }

    const [hourString, minuteString] =
      time.split(':')

    const hour = Number(hourString)

    const minute =
      minuteString || '00'

    const period =
      hour >= 12 ? 'PM' : 'AM'

    const displayHour =
      hour % 12 || 12

    return `${displayHour}:${minute} ${period}`
  }

  const updateInterviewStatus = (
    interview,
    newStatus
  ) => {
    if (interview.isSample) {
      const updatedStatuses = {
        ...sampleStatuses,
        [interview.id]: newStatus,
      }

      setSampleStatuses(
        updatedStatuses
      )

      localStorage.setItem(
        'hireai_sample_interview_statuses',
        JSON.stringify(
          updatedStatuses
        )
      )

      return
    }

    const updatedInterviews =
      savedInterviews.map((item) =>
        item.id === interview.id
          ? {
              ...item,
              status: newStatus,
            }
          : item
      )

    setSavedInterviews(
      updatedInterviews
    )

    localStorage.setItem(
      'hireai_interviews',
      JSON.stringify(
        updatedInterviews
      )
    )
  }

  const completeInterview = (
    interview
  ) => {
    const confirmed =
      window.confirm(
        `Mark the interview with ${interview.candidate} as completed?`
      )

    if (!confirmed) {
      return
    }

    updateInterviewStatus(
      interview,
      'Completed'
    )
  }

  const cancelInterview = (
    interview
  ) => {
    const confirmed =
      window.confirm(
        `Cancel the interview with ${interview.candidate}?`
      )

    if (!confirmed) {
      return
    }

    updateInterviewStatus(
      interview,
      'Cancelled'
    )
  }

  const scheduledCount =
    interviews.filter(
      (interview) =>
        interview.status === 'Scheduled'
    ).length

  const completedCount =
    interviews.filter(
      (interview) =>
        interview.status === 'Completed'
    ).length

  const cancelledCount =
    interviews.filter(
      (interview) =>
        interview.status === 'Cancelled'
    ).length

  return (
    <main className="interviews-page">

      {/* HEADER */}

      <div className="interviews-header">

        <div>

          <span className="section-label">
            Recruitment
          </span>

          <h1>
            Interviews
          </h1>

          <p>
            Manage upcoming candidate interviews,
            meeting details and interview status.
          </p>

        </div>

        <div className="interviews-header-actions">

          <Link
            to="/recruiter-dashboard"
            className="dashboard-secondary-btn"
          >
            Back to Dashboard
          </Link>

          <Link
            to="/schedule-interview"
            className="dashboard-primary-btn"
          >
            + Schedule Interview
          </Link>

        </div>

      </div>

      {/* SUMMARY */}

      <section className="interview-summary">

        <div className="interview-summary-card">
          <span>Total Interviews</span>

          <strong>
            {interviews.length}
          </strong>

          <p>All interviews</p>
        </div>

        <div className="interview-summary-card">
          <span>Scheduled</span>

          <strong>
            {scheduledCount}
          </strong>

          <p>Upcoming interviews</p>
        </div>

        <div className="interview-summary-card">
          <span>Completed</span>

          <strong>
            {completedCount}
          </strong>

          <p>Finished interviews</p>
        </div>

        <div className="interview-summary-card">
          <span>Cancelled</span>

          <strong>
            {cancelledCount}
          </strong>

          <p>Cancelled interviews</p>
        </div>

      </section>

      {/* TOOLBAR */}

      <section className="interview-toolbar">

        <div>

          <h2>
            Interview Schedule
          </h2>

          <p>
            Review and manage candidate
            interviews.
          </p>

        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
          className="interview-filter"
        >

          <option value="All">
            All Interviews
          </option>

          <option value="Scheduled">
            Scheduled
          </option>

          <option value="Completed">
            Completed
          </option>

          <option value="Cancelled">
            Cancelled
          </option>

        </select>

      </section>

      {/* INTERVIEW LIST */}

      <section className="interview-list">

        {filteredInterviews.length > 0 ? (

          filteredInterviews.map(
            (interview) => (

              <article
                className="interview-card"
                key={`${
                  interview.isSample
                    ? 'sample'
                    : 'saved'
                }-${interview.id}`}
              >

                <div className="interview-card-main">

                  <div className="interview-avatar">
                    {interview.initials}
                  </div>

                  <div className="interview-candidate-info">

                    <div className="interview-name-row">

                      <div>

                        <h2>
                          {interview.candidate}
                        </h2>

                        <p>
                          {interview.position}
                        </p>

                      </div>

                      <span
                        className={`interview-status interview-status-${interview.status.toLowerCase()}`}
                      >
                        {interview.status}
                      </span>

                    </div>

                    <div className="interview-details-grid">

                      <div>
                        <span>Date</span>

                        <strong>
                          {formatDate(
                            interview.date
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>Time</span>

                        <strong>
                          {formatTime(
                            interview.time
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>Duration</span>

                        <strong>
                          {interview.duration}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Interview Type
                        </span>

                        <strong>
                          {interview.type}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Interviewer
                        </span>

                        <strong>
                          {interview.interviewer}
                        </strong>
                      </div>

                    </div>

                    {interview.type ===
                      'In-Person Interview' &&
                      interview.location && (

                      <div className="interview-extra-info">

                        <span>
                          Location
                        </span>

                        <strong>
                          {interview.location}
                        </strong>

                      </div>

                    )}

                    {interview.notes && (

                      <div className="interview-extra-info">

                        <span>
                          Notes
                        </span>

                        <strong>
                          {interview.notes}
                        </strong>

                      </div>

                    )}

                  </div>

                </div>

                {/* ACTIONS */}

                <div className="interview-card-actions">

                  {interview.candidateId && (

                    <Link
                      to={`/candidate-profile/${interview.candidateId}`}
                      className="interview-profile-btn"
                    >
                      View Candidate
                    </Link>

                  )}

                  {interview.type ===
                    'Video Interview' &&
                    interview.status ===
                      'Scheduled' &&
                    interview.meetingLink && (

                    <a
                      href={
                        interview.meetingLink
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="interview-join-btn"
                    >
                      Join Meeting
                    </a>

                  )}

                  {interview.status ===
                    'Scheduled' &&
                    !interview.isSample && (

                    <Link
                      to={`/schedule-interview?edit=${interview.id}`}
                      className="interview-reschedule-btn"
                    >
                      Reschedule
                    </Link>

                  )}

                  {interview.status ===
                    'Scheduled' &&
                    interview.isSample && (

                    <button
                      type="button"
                      className="interview-reschedule-btn interview-reschedule-disabled"
                      disabled
                    >
                      Reschedule
                    </button>

                  )}

                  {interview.status ===
                    'Scheduled' && (

                    <button
                      type="button"
                      className="interview-complete-btn"
                      onClick={() =>
                        completeInterview(
                          interview
                        )
                      }
                    >
                      Mark Completed
                    </button>

                  )}

                  {interview.status ===
                    'Scheduled' && (

                    <button
                      type="button"
                      className="interview-cancel-btn"
                      onClick={() =>
                        cancelInterview(
                          interview
                        )
                      }
                    >
                      Cancel Interview
                    </button>

                  )}

                </div>

              </article>

            )
          )

        ) : (

          <div className="no-interviews">

            <h3>
              No interviews found
            </h3>

            <p>
              There are no interviews
              matching this status.
            </p>

          </div>

        )}

      </section>

    </main>
  )
}

export default Interviews