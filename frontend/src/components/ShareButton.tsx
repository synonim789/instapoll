import { FiShare2 } from 'react-icons/fi'

type Props = {
  pollId: string
}

const ShareButton = ({ pollId }: Props) => {
  const shareUrl = `${window.location.origin}/poll/${pollId}`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Share Link to Poll',
          url: shareUrl,
        })
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl)
        alert('Link copied to clipboard')
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <button
      onClick={handleShare}
      className="bg-gray-300 border-gray-400 hover:bg-gray-400 border p-2 rounded  cursor-pointer "
    >
      <FiShare2 />
    </button>
  )
}
export default ShareButton
