export type Poll = {
  id: string
  question: string
  options: {
    text: string
    votes: number
  }[]
  createdAt: Date
  totalVotes: number
}
