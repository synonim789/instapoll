import type { RequestHandler } from 'express'
import { io } from '../app.js'
import type { PollBody, VoteBody } from '../schemas/poll.js'
import { db } from '../utils/db.js'

export const getPoll: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params

    const poll = await db.poll.findUnique({
      where: { id },
      include: {
        votes: {
          select: {
            option: true,
          },
        },
      },
    })

    if (!poll) {
      res.status(404).json({ message: 'Poll not found' })
      return
    }

    const voteCounts = Array(poll.options.length).fill(0)

    poll.votes.forEach((vote) => {
      if (typeof vote.option === 'number' && vote.option < voteCounts.length) {
        voteCounts[vote.option]++
      }
    })

    const totalVotes = voteCounts.reduce((sum, count) => sum + count, 0)

    res.status(200).json({
      id: poll.id,
      question: poll.question,
      options: poll.options.map((text, index) => ({
        text,
        votes: voteCounts[index],
      })),
      createdAt: poll.createdAt,
      totalVotes,
    })
  } catch (error) {
    res.status(500).json({ message: 'There was an error' })
  }
}

export const voteInPoll: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
      res.status(500).json({ message: 'There was an error' })
      return
    }
    const { option } = req.body as VoteBody

    await db.vote.create({
      data: {
        pollId: id,
        option,
      },
    })

    const poll = await db.poll.findUnique({
      where: { id },
      select: {
        options: true,
        votes: {
          select: {
            option: true,
          },
        },
      },
    })

    if (!poll) {
      res.status(404).json({ message: 'Poll not found' })
      return
    }
    const results = Array(poll.options.length).fill(0)
    poll.votes.forEach((vote) => {
      if (vote.option >= 0 && vote.option < results.length) {
        results[vote.option]++
      }
    })

    io.emit('voteUpdate', {
      pollId: id,
      results,
      totalVotes: poll.votes.length,
    })

    res.status(200).json({ message: 'Vote recorded' })
  } catch (error) {
    res.status(500).json({ message: 'There was an error' })
  }
}

export const getPollResults: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params
    const poll = await db.poll.findUnique({
      where: { id },
      select: {
        question: true,
        options: true,
        votes: {
          select: { option: true },
        },
      },
    })

    if (!poll) {
      res.status(404).json({ message: 'Poll not found' })
      return
    }

    const results = Array(poll.options.length).fill(0)
    poll.votes.forEach((vote) => {
      if (vote.option >= 0 && vote.option < results.length) {
        results[vote.option]++
      }
    })

    res.status(200).json({
      question: poll.question,
      options: poll.options,
      results,
      totalVotes: poll.votes.length,
    })
  } catch (error) {
    res.status(500).json({ message: 'There was an error' })
  }
}

export const getUserPolls: RequestHandler = async (req, res) => {
  try {
    const userId = req.userId

    const polls = await db.poll.findMany({
      where: {
        userId,
      },
      include: {
        votes: {
          select: {
            option: true,
          },
        },
      },
    })

    const formatedPolls = polls.map((poll) => {
      const voteCounts = Array(poll.options.length).fill(0)

      poll.votes.forEach((vote) => {
        if (
          typeof vote.option === 'number' &&
          vote.option < voteCounts.length
        ) {
          voteCounts[vote.option]++
        }
      })

      const totalVotes = voteCounts.reduce((sum, count) => sum + count, 0)

      return {
        id: poll.id,
        question: poll.question,
        options: poll.options.map((text, index) => ({
          text,
          votes: voteCounts[index],
        })),
        createdAt: poll.createdAt,
        totalVotes,
      }
    })

    res.status(200).json(formatedPolls)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'There was an error' })
  }
}

export const addPoll: RequestHandler = async (req, res) => {
  try {
    const { options, question } = req.body as PollBody
    const userId = req.userId

    const poll = await db.poll.create({
      data: {
        question,
        options,
        userId,
      },
    })

    res.status(200).json(poll)
  } catch (error) {
    res.status(500).json({ message: 'There was an error' })
  }
}

export const deletePoll: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId

    const poll = await db.poll.findUnique({
      where: {
        id,
      },
    })

    if (!poll) {
      res.status(404).json({ message: 'Poll not found' })
      return
    }

    if (poll.userId !== userId) {
      res.status(400).json({ message: "You can't delete this poll" })
      return
    }

    await db.vote.deleteMany({
      where: {
        pollId: poll.id,
      },
    })

    await db.poll.delete({
      where: { id },
    })

    res.status(200).json({ message: 'Poll deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'There was an error' })
    console.log(error)
  }
}
