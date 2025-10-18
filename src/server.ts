import { env, isDev, isTest } from '../env.ts'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRoutes from './routes/authRoutes.ts'
import habitRoutes from './routes/habitRoutes.ts'
import userRoutes from './routes/userRoutes.ts'
import morgan from 'morgan'
import { notFound } from './middleware/notFound.ts'
import { errorHandler } from './middleware/errorHandler.ts'

const app = express()

app.use(helmet())
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
    morgan('dev', {
        skip: () => isTest(),
    })
)
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Habit Tracker API',
    })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/habits', habitRoutes)
app.use('/api/users', userRoutes)

// 404 handler - MUST come after all valid routes
app.use(notFound)

// Global error handler - MUST be last
app.use(errorHandler)

export { app }

export default app