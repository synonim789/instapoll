import { Link } from 'react-router'
import { useAuth } from '../auth/AuthContext'

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth()

  return (
    <div className="w-full border-b-2 border-purple-500 py-3 bg-gray-200 px-4 flex justify-between">
      <Link to="/" className="font-bold text-xl">
        Insta<span className="text-purple-500">Poll</span>
      </Link>
      {isAuthenticated && (
        <div className="flex gap-4 items-center">
          <Link to="/create" className="font-semibold">
            Create Poll
          </Link>
          <button
            onClick={logout}
            className="text-white bg-purple-500 px-2 py-1 rounded-lg cursor-pointer hover:bg-purple-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
export default Navbar
