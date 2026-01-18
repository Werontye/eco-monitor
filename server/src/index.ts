import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { weatherRouter } from './routes/weather.js'
import { airQualityRouter } from './routes/airQuality.js'
import { aiRouter } from './routes/ai.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/weather', weatherRouter)
app.use('/api/air-quality', airQualityRouter)
app.use('/api/ai', aiRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
