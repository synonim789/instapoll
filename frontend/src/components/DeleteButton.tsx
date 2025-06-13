import ky from 'ky'
import toast from 'react-hot-toast'
import { FaTrash } from 'react-icons/fa'
import { useAuth } from '../auth/AuthContext'

type Props = {
  pollId: string
  onDelete: (id: string) => void
}

const DeleteButton = ({ pollId, onDelete }: Props) => {
  const { token } = useAuth()

  const deletePoll = async () => {
    try {
      await ky.delete(`${import.meta.env.VITE_SERVER_URL}/poll/${pollId}`, {
        headers: { authorization: `Bearer ${token}` },
      })
      toast.success('Poll removed succesfully')
      onDelete(pollId)
    } catch (error) {
      console.log(error)

      toast.error('There was an error ')
    }
  }

  return (
    <button
      onClick={deletePoll}
      className="bg-red-400 p-2 rounded text-white cursor-pointer hover:bg-red-500"
    >
      <FaTrash />
    </button>
  )
}
export default DeleteButton
