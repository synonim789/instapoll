import { z } from 'zod'

export const pollSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string()),
})

export const voteSchema = z.object({
  option: z.number(),
})

export type PollBody = z.infer<typeof pollSchema>
export type VoteBody = z.infer<typeof voteSchema>
