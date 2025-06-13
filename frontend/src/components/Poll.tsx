import type { Poll } from '../types'
import CopyButton from './CopyButton'
import DeleteButton from './DeleteButton'
import PollBarChart from './PollBarChart'
import ShareButton from './ShareButton'

type Props = {
  poll: Poll
  onDelete: (id: string) => void
}

const PollComponent = ({ poll, onDelete }: Props) => {
  return (
    <div className="bg-white rounded-lg min-w-lg max-w-2xl mt-5 p-3">
      <div className="flex justify-between">
        <p className="text-2xl font-semibold">{poll.question}</p>
        <div className="flex gap-2">
          <ShareButton pollId={poll.id} />
          <CopyButton pollId={poll.id} />
          <DeleteButton pollId={poll.id} onDelete={onDelete} />
        </div>
      </div>
      <PollBarChart poll={poll} />
    </div>
  )
}
export default PollComponent
