import { Navigate, useLocation } from 'react-router-dom'

function ProtectedRoute({
  children,
  allowedRole,
}) {
  const location = useLocation()

  let currentUser = null

  try {
    const savedUser =
      localStorage.getItem(
        'hireai_current_user'
      ) ||
      sessionStorage.getItem(
        'hireai_current_user'
      )

    currentUser = savedUser
      ? JSON.parse(savedUser)
      : null
  } catch (error) {
    console.error(
      'Could not read user session:',
      error
    )
  }

  /*
    NOT LOGGED IN
  */

  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname +
            location.search,
        }}
      />
    )
  }

  /*
    WRONG ACCOUNT TYPE
  */

  if (
    allowedRole &&
    currentUser.accountType !==
      allowedRole
  ) {
    const correctDashboard =
      currentUser.accountType ===
      'recruiter'
        ? '/recruiter-dashboard'
        : '/candidate-dashboard'

    return (
      <Navigate
        to={correctDashboard}
        replace
      />
    )
  }

  return children
}

export default ProtectedRoute