import toast from 'react-hot-toast'
import { FaCopy } from 'react-icons/fa'

type Props = {
  pollId: string
}

const CopyButton = ({ pollId }: Props) => {
  const copyUrl = `${window.location.origin}/poll/${pollId}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyUrl)
      toast.success('Copied!')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="bg-purple-400 p-2 rounded text-white cursor-pointer hover:bg-purple-500"
    >
      <FaCopy />
    </button>
  )
}
export default CopyButton
