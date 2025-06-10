import express from 'express'
import authRouter from './routes/auth.js'
const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/auth', authRouter)

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
