import cors from 'cors'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import authRouter from './routes/auth.js'
import pollRouter from './routes/poll.js'

const app = express()
const port = process.env.PORT

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }))
app.use(express.json())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
  },
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/auth', authRouter)
app.use('/poll', pollRouter)

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})

export { io }
