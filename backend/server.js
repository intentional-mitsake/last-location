import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import dbRoutes from './routes/dbRoutes.js'
import http from 'http'
import { initializeSocketServer } from './services/socketServer.js'
import jwt from 'jsonwebtoken'

dotenv.config()

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 8848

app.use(cors())
app.use(express.json())
const id = "user_02"

const payload = { userId: id }
const token = jwt.sign(payload, process.env.Auth_Key, { expiresIn: '30d' })
console.log("Sample Token : ", token)

app.use('/', authRoutes)
app.use('/db', dbRoutes )

initializeSocketServer(server)
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
