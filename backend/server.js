import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import dbRoutes from './routes/dbRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8848

app.use(cors())
app.use(express.json())


app.use('/', authRoutes)
app.use('/db', dbRoutes )
app.use('/user', userRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
