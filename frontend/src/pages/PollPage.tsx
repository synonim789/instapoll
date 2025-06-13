import ky from 'ky'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { io } from 'socket.io-client'
import Navbar from '../components/Navbar'
import VoteForm from '../components/PollVote'
import { type Poll } from '../types'

const socket = io(`${import.meta.env.VITE_SERVER_URL}`)

const PollPage = () => {
  const { id } = useParams()
  const [poll, setPoll] = useState<Poll>({
    id: '',
    createdAt: new Date(),
    options: [],
    question: '',
    totalVotes: 0,
  })
  const [isLoading, setIsloading] = useState(true)
  useEffect(() => {
    const fetchPoll = async () => {
      const respose = await ky
        .get(`${import.meta.env.VITE_SERVER_URL}/poll/${id}`)
        .json<Poll>()
      setPoll(respose)
      setIsloading(false)
    }

    fetchPoll()
    socket.on('voteUpdate', ({ results, totalVotes }) => {
      setPoll((prevPoll) => ({
        ...prevPoll,
        options: prevPoll.options.map((opt, i) => ({
          ...opt,
          votes: results[i],
        })),
        totalVotes,
      }))
    })

    return () => {
      socket.off('voteUpdate')
    }
  }, [id])

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-6">
        <VoteForm poll={poll} />
      </div>
    </div>
  )
}
export default PollPage
