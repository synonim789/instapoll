import { compare, hash } from 'bcrypt'
import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import type { LoginBody, RegisterBody } from '../schemas/auth.js'
import { db } from '../utils/db.js'

export const register: RequestHandler = async (req, res) => {
  try {
    const { email, passwordRaw, username } = req.body as RegisterBody

    const exist = await db.user.findUnique({
      where: { email },
    })

    if (exist) {
      res.status(409).json({ message: 'User with this email already exists' })
      return
    }

    const passwordHash = await hash(passwordRaw, 10)

    const user = await db.user.create({
      data: {
        email,
        username,
        password: passwordHash,
      },
    })

    const secret = process.env.SECRET

    const token = jwt.sign({ userId: user.id }, secret!, { expiresIn: '7d' })
    res.status(200).json({ token })
  } catch (error) {
    res.status(500).json({ message: 'There was an error' })
    console.log(error)
  }
}

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, passwordRaw } = req.body as LoginBody

    const user = await db.user.findUnique({ where: { email } })

    if (!user) {
      res.status(400).json({ message: 'Incorrect email or password' })
      return
    }

    const passwordMatch = await compare(passwordRaw, user.password)
    if (!passwordMatch) {
      res.status(401).json({ message: 'Incorrect email or password' })
      return
    }
    const secret = process.env.SECRET

    const token = await jwt.sign(
      {
        userId: user.id,
      },
      secret!,
      { expiresIn: '7d' }
    )

    res.status(200).json({ token: token })
  } catch (error) {
    res.status(500).json({ message: 'There was an error' })
    console.log(error)
  }
}
