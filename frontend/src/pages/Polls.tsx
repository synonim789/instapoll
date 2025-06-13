import ky from 'ky'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { io } from 'socket.io-client'
import { useAuth } from '../auth/AuthContext'
import Navbar from '../components/Navbar'
import PollComponent from '../components/Poll'
import { type Poll as PollType } from '../types'

const socket = io(`${import.meta.env.VITE_SERVER_URL}`)

const Polls = () => {
  const [polls, setPolls] = useState<PollType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    // Fetch polls once on mount
    const fetchPolls = async () => {
      try {
        const newPolls = await ky
          .get(`${import.meta.env.VITE_SERVER_URL}/poll`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .json<PollType[]>()
        setPolls(newPolls)
        setIsLoading(false)
      } catch (error) {
        console.error(error)
        setIsLoading(false)
      }
    }
    fetchPolls()

    // Listen for vote updates from backend
    socket.on('voteUpdate', ({ pollId, results, totalVotes }) => {
      setPolls((prevPolls) =>
        prevPolls.map((poll) =>
          poll.id === pollId
            ? {
                ...poll,
                options: poll.options.map((opt, i) => ({
                  ...opt,
                  votes: results[i],
                })),
                totalVotes,
              }
            : poll
        )
      )
    })

    return () => {
      socket.off('voteUpdate')
    }
  }, [token])

  const handleDelete = (id: string) => {
    setPolls((prev) => prev.filter((poll) => poll.id !== id))
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      {isLoading && <p>Loading...</p>}
      {!isLoading && polls.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <p className="font-semibold text-2xl mt-5">No Polls created yet!</p>
          <Link
            to="/create"
            className="text-white bg-purple-500 rounded-2xl px-4 py-2 mt-5"
          >
            Create
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          {polls.map((poll) => (
            <PollComponent poll={poll} key={poll.id} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
export default Polls
