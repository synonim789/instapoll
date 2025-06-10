import type { RequestHandler } from 'express'

export const register: RequestHandler = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: 'There was an error' })
  }
}

export const login: RequestHandler = async (req, res) => {
  try {
  } catch (error) {}
}
