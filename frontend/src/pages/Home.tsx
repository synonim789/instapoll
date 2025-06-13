import { Link } from 'react-router'
import Navbar from '../components/Navbar'

function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-6">
        <h1 className="text-3xl font-semibold">
          Do you want to create a poll?
        </h1>
        <h2 className="text-xl my-5">You need to have an account</h2>
        <div className="flex gap-5 items-center ">
          <Link
            to="/sign-up"
            className="bg-gray-300 rounded-2xl px-4 py-2 border border-gray-400"
          >
            Sign up
          </Link>
          <Link
            to="/login"
            className="text-white bg-purple-500 px-4 py-2 rounded-2xl"
          >
            Login Now
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
