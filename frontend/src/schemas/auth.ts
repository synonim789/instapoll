import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
})

export const signUpSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1, 'Username is Required'),
  password: z.string().min(1, 'Password is Required'),
})

export type LoginSchemaType = z.infer<typeof loginSchema>
export type SignUpSchemaType = z.infer<typeof signUpSchema>
