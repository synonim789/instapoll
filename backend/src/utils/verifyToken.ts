import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

export const verifyToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.sendStatus(401)
    return
  }
  const token = authHeader.split(' ')[1]
  if (!token) {
    res.sendStatus(401)
    return
  }
  const secret = process.env.SECRET
  jwt.verify(token, secret!, (err: unknown, decoded: any) => {
    if (err) return res.sendStatus(403)
    req.userId = decoded.userId
    next()
  })
}
