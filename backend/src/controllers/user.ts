import type { RequestHandler } from 'express'
import { db } from '../utils/db.js'

export const getUser: RequestHandler = async (req, res) => {
  try {
    const userId = await req.userId

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: 'There was an error' })
  }
}
