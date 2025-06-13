import { Router } from 'express'
import {
  addPoll,
  deletePoll,
  getPoll,
  getUserPolls,
  voteInPoll,
} from '../controllers/poll.js'
import { verifyToken } from '../utils/verifyToken.js'

const router = Router()

router.get('/:id', getPoll)
router.post('/:id/vote', voteInPoll)
router.post('/', verifyToken, addPoll)
router.get('/', verifyToken, getUserPolls)
router.delete('/:id', verifyToken, deletePoll)

export default router
