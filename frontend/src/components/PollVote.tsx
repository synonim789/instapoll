import ky from 'ky'
import { useState } from 'react'
import { type Poll as PollType } from '../types'
import PollBarChart from './PollBarChart'

type VoteFormProps = {
  poll: PollType
}

export default function VoteForm({ poll }: VoteFormProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [voted, setVoted] = useState(false)

  console.log(poll)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedOption === null) {
      setError('Please select an option.')
      return
    }
    setError('')
    setLoading(true)

    try {
      await ky
        .post(`${import.meta.env.VITE_SERVER_URL}/poll/${poll.id}/vote`, {
          json: { option: selectedOption },
        })
        .json<PollType>()
    } catch (err) {
      setError('Failed to submit vote.')
      console.error(err)
    } finally {
      setVoted(true)
      setLoading(false)
    }
  }

  return !voted ? (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg min-w-lg mt-5 p-3"
    >
      <h2>{poll?.question}</h2>

      {poll?.options.map((opt, idx) => (
        <label key={idx} className="block my-1 cursor-pointer">
          <input
            type="radio"
            name="option"
            value={idx}
            onChange={() => setSelectedOption(idx)}
            disabled={loading}
          />
          <span className="ml-2">{opt.text}</span>
        </label>
      ))}

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 px-4 py-2 bg-purple-500 text-white rounded"
      >
        {loading ? 'Voting...' : 'Vote'}
      </button>
    </form>
  ) : (
    <PollBarChart poll={poll} />
  )
}
