import { Outlet } from 'react-router'

const PublicLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Outlet />
    </div>
  )
}

export default PublicLayout
