import { useState } from 'react'
import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

function ScheduleInterview() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const candidateFromUrl =
    searchParams.get('candidate') || ''

  const positionFromUrl =
    searchParams.get('position') || ''

  const editId =
    searchParams.get('edit')

  const isEditMode = Boolean(editId)

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
        'Could not load interviews:',
        error
      )

      return []
    }
  }

  const getInterviewForEditing = () => {
    if (!editId) {
      return null
    }

    const interviews =
      getSavedInterviews()

    return (
      interviews.find(
        (interview) =>
          String(interview.id) ===
          String(editId)
      ) || null
    )
  }

  const interviewToEdit =
    getInterviewForEditing()

  const [formData, setFormData] =
    useState(() => {
      if (interviewToEdit) {
        return {
          candidate:
            interviewToEdit.candidate || '',

          position:
            interviewToEdit.position || '',

          date:
            interviewToEdit.date || '',

          time:
            interviewToEdit.time || '',

          duration:
            interviewToEdit.duration ||
            '30 Minutes',

          interviewType:
            interviewToEdit.type ||
            'Video Interview',

          interviewer:
            interviewToEdit.interviewer || '',

          meetingLink:
            interviewToEdit.meetingLink || '',

          location:
            interviewToEdit.location || '',

          notes:
            interviewToEdit.notes || '',
        }
      }

      return {
        candidate:
          candidateFromUrl,

        position:
          positionFromUrl,

        date: '',

        time: '',

        duration:
          '30 Minutes',

        interviewType:
          'Video Interview',

        interviewer: '',

        meetingLink: '',

        location: '',

        notes: '',
      }
    })

  const handleChange = (e) => {
    const { name, value } =
      e.target

    setFormData(
      (currentData) => ({
        ...currentData,
        [name]: value,
      })
    )
  }

  const getCandidateId = (
    candidateName
  ) => {
    const candidateIds = {
      'Sarah Johnson': 1,
      'Michael Chen': 2,
      'Emily Davis': 3,
      'Daniel Wilson': 4,
      'Sophia Martinez': 5,
    }

    return (
      candidateIds[candidateName] ||
      null
    )
  }

  const getCandidateInitials = (
    candidateName
  ) => {
    if (!candidateName) {
      return ''
    }

    return candidateName
      .split(' ')
      .map((name) =>
        name.charAt(0)
      )
      .join('')
      .toUpperCase()
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const interviews =
      getSavedInterviews()

    /*
      EDIT EXISTING INTERVIEW
    */

    if (
      isEditMode &&
      interviewToEdit
    ) {
      const updatedInterview = {
        ...interviewToEdit,

        candidateId:
          getCandidateId(
            formData.candidate
          ),

        candidate:
          formData.candidate,

        initials:
          getCandidateInitials(
            formData.candidate
          ),

        position:
          formData.position,

        date:
          formData.date,

        time:
          formData.time,

        duration:
          formData.duration,

        type:
          formData.interviewType,

        interviewer:
          formData.interviewer,

        meetingLink:
          formData.interviewType ===
          'Video Interview'
            ? formData.meetingLink
            : '',

        location:
          formData.interviewType ===
          'In-Person Interview'
            ? formData.location
            : '',

        notes:
          formData.notes,

        status:
          'Scheduled',

        updatedAt:
          new Date().toISOString(),
      }

      const updatedInterviews =
        interviews.map(
          (interview) =>
            String(interview.id) ===
            String(editId)
              ? updatedInterview
              : interview
        )

      localStorage.setItem(
        'hireai_interviews',
        JSON.stringify(
          updatedInterviews
        )
      )

      alert(
        `Interview updated successfully!

Candidate: ${formData.candidate}
Position: ${formData.position}
Date: ${formData.date}
Time: ${formData.time}`
      )

      navigate('/interviews')

      return
    }

    /*
      CREATE NEW INTERVIEW
    */

    const newInterview = {
      id: Date.now(),

      candidateId:
        getCandidateId(
          formData.candidate
        ),

      candidate:
        formData.candidate,

      initials:
        getCandidateInitials(
          formData.candidate
        ),

      position:
        formData.position,

      date:
        formData.date,

      time:
        formData.time,

      duration:
        formData.duration,

      type:
        formData.interviewType,

      interviewer:
        formData.interviewer,

      meetingLink:
        formData.interviewType ===
        'Video Interview'
          ? formData.meetingLink
          : '',

      location:
        formData.interviewType ===
        'In-Person Interview'
          ? formData.location
          : '',

      notes:
        formData.notes,

      status:
        'Scheduled',

      createdAt:
        new Date().toISOString(),
    }

    const updatedInterviews = [
      ...interviews,
      newInterview,
    ]

    localStorage.setItem(
      'hireai_interviews',
      JSON.stringify(
        updatedInterviews
      )
    )

    alert(
      `Interview scheduled successfully!

Candidate: ${formData.candidate}
Position: ${formData.position}
Date: ${formData.date}
Time: ${formData.time}
Type: ${formData.interviewType}`
    )

    navigate('/interviews')
  }

  /*
    INVALID EDIT ID
  */

  if (
    isEditMode &&
    !interviewToEdit
  ) {
    return (
      <main className="schedule-interview-page">

        <div className="schedule-interview-card">

          <span className="section-label">
            Recruitment
          </span>

          <h2>
            Interview Not Found
          </h2>

          <p>
            This interview could not
            be found or may have been
            removed.
          </p>

          <Link
            to="/interviews"
            className="dashboard-secondary-btn"
          >
            Back to Interviews
          </Link>

        </div>

      </main>
    )
  }

  return (
    <main className="schedule-interview-page">

      {/* HEADER */}

      <div className="schedule-interview-header">

        <div>

          <span className="section-label">
            Recruitment
          </span>

          <h1>
            {isEditMode
              ? 'Reschedule Interview'
              : 'Schedule Interview'}
          </h1>

          <p>
            {isEditMode
              ? 'Update the candidate interview date, time and interview details.'
              : 'Schedule an interview with a shortlisted candidate and add all necessary interview details.'}
          </p>

        </div>

        <Link
          to="/interviews"
          className="dashboard-secondary-btn"
        >
          Back to Interviews
        </Link>

      </div>

      <form
        className="schedule-interview-form"
        onSubmit={handleSubmit}
      >

        {/* CANDIDATE */}

        <section className="schedule-interview-card">

          <div className="schedule-section-heading">

            <h2>
              Candidate Information
            </h2>

            <p>
              Select the candidate and
              position for this interview.
            </p>

          </div>

          <div className="schedule-form-grid">

            <div className="schedule-field">

              <label>
                Candidate
              </label>

              <select
                name="candidate"
                value={
                  formData.candidate
                }
                onChange={
                  handleChange
                }
                required
              >

                <option value="">
                  Select candidate
                </option>

                <option value="Sarah Johnson">
                  Sarah Johnson
                </option>

                <option value="Michael Chen">
                  Michael Chen
                </option>

                <option value="Emily Davis">
                  Emily Davis
                </option>

                <option value="Daniel Wilson">
                  Daniel Wilson
                </option>

                <option value="Sophia Martinez">
                  Sophia Martinez
                </option>

              </select>

            </div>

            <div className="schedule-field">

              <label>
                Job Position
              </label>

              <select
                name="position"
                value={
                  formData.position
                }
                onChange={
                  handleChange
                }
                required
              >

                <option value="">
                  Select position
                </option>

                <option value="Frontend Developer">
                  Frontend Developer
                </option>

                <option value="React Developer">
                  React Developer
                </option>

                <option value="UI/UX Designer">
                  UI/UX Designer
                </option>

                <option value="Backend Developer">
                  Backend Developer
                </option>

                <option value="Junior Web Developer">
                  Junior Web Developer
                </option>

              </select>

            </div>

          </div>

        </section>

        {/* SCHEDULE */}

        <section className="schedule-interview-card">

          <div className="schedule-section-heading">

            <h2>
              Interview Schedule
            </h2>

            <p>
              Choose the date, time and
              interview duration.
            </p>

          </div>

          <div className="schedule-form-grid">

            <div className="schedule-field">

              <label>
                Interview Date
              </label>

              <input
                type="date"
                name="date"
                value={
                  formData.date
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            <div className="schedule-field">

              <label>
                Interview Time
              </label>

              <input
                type="time"
                name="time"
                value={
                  formData.time
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            <div className="schedule-field">

              <label>
                Duration
              </label>

              <select
                name="duration"
                value={
                  formData.duration
                }
                onChange={
                  handleChange
                }
              >

                <option>
                  15 Minutes
                </option>

                <option>
                  30 Minutes
                </option>

                <option>
                  45 Minutes
                </option>

                <option>
                  60 Minutes
                </option>

                <option>
                  90 Minutes
                </option>

              </select>

            </div>

            <div className="schedule-field">

              <label>
                Interview Type
              </label>

              <select
                name="interviewType"
                value={
                  formData.interviewType
                }
                onChange={
                  handleChange
                }
              >

                <option>
                  Video Interview
                </option>

                <option>
                  In-Person Interview
                </option>

                <option>
                  Phone Interview
                </option>

              </select>

            </div>

          </div>

        </section>

        {/* DETAILS */}

        <section className="schedule-interview-card">

          <div className="schedule-section-heading">

            <h2>
              Interview Details
            </h2>

            <p>
              Add the interviewer and
              meeting information.
            </p>

          </div>

          <div className="schedule-form-grid">

            <div className="schedule-field full-width">

              <label>
                Interviewer Name
              </label>

              <input
                type="text"
                name="interviewer"
                placeholder="Enter interviewer name"
                value={
                  formData.interviewer
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            {formData.interviewType ===
              'Video Interview' && (

              <div className="schedule-field full-width">

                <label>
                  Meeting Link
                </label>

                <input
                  type="url"
                  name="meetingLink"
                  placeholder="https://meet.example.com/interview"
                  value={
                    formData.meetingLink
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

            )}

            {formData.interviewType ===
              'In-Person Interview' && (

              <div className="schedule-field full-width">

                <label>
                  Interview Location
                </label>

                <input
                  type="text"
                  name="location"
                  placeholder="Enter office address or meeting room"
                  value={
                    formData.location
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

            )}

            <div className="schedule-field full-width">

              <label>
                Interview Notes
              </label>

              <textarea
                name="notes"
                rows="6"
                placeholder="Add instructions, topics to discuss, or other notes..."
                value={
                  formData.notes
                }
                onChange={
                  handleChange
                }
              ></textarea>

            </div>

          </div>

        </section>

        {/* ACTIONS */}

        <div className="schedule-interview-actions">

          <Link
            to="/interviews"
            className="schedule-cancel-btn"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="schedule-submit-btn"
          >
            {isEditMode
              ? 'Update Interview'
              : 'Schedule Interview'}
          </button>

        </div>

      </form>

    </main>
  )
}

export default ScheduleInterview