import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email(),
  passwordRaw: z.string().min(1),
  username: z.string().min(1),
})

export const loginSchema = z.object({
  email: z.string().email(),
  passwordRaw: z.string().min(1),
})

export type RegisterBody = z.infer<typeof registerSchema>
export type LoginBody = z.infer<typeof loginSchema>
