import { Link } from 'react-router-dom'

function JobCard({
  id,
  title,
  company,
  location,
  type,
  salary,
  skills,
}) {
  return (
    <div className="job-card">
      <h3>{title}</h3>

      <p className="job-company">{company}</p>
      <p className="job-info">{location}</p>
      <p className="job-info">{type}</p>
      <p className="job-info">{salary}</p>

      <div className="job-skills">
        {skills.map((skill) => (
          <span key={skill} className="job-skill">
            {skill}
          </span>
        ))}
      </div>

      <Link to={`/jobs/${id}`} className="job-details-button">
        View Details
      </Link>
    </div>
  )
}

export default JobCard