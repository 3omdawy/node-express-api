import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.ts'
import { createHabit, deleteHabit, getHabitById, getUserHabits, updateHabit } from '../controllers/habitController.ts'
import { validateBody, validateParams } from '../middleware/validation.ts'
import z from 'zod'

const createHabitSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  frequency: z.string(),
  targetCount: z.int(),
  tagIds: z.array(z.string()).optional(),
})

const updateHabitSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
  targetCount: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
})

const uuidSchema = z.object({
  id: z.string().uuid('Invalid habit ID format'),
})

const router = Router()

// Apply authentication to ALL routes in this router
router.use(authenticateToken)

// Habit-specific routes
router.get('/', getUserHabits)
router.get('/:id', validateParams(uuidSchema), getHabitById)

router.post('/', validateBody(createHabitSchema), createHabit)

router.patch(
  '/:id',
  validateParams(uuidSchema),
  validateBody(updateHabitSchema),
  updateHabit
)

router.delete('/:id', validateParams(uuidSchema), deleteHabit)

// Habit completion routes
router.post('/:id/complete', (req, res) => {
  res.json({ message: `Mark habit ${req.params.id} complete` })
})

router.get('/:id/stats', (req, res) => {
  res.json({ message: `Get stats for habit ${req.params.id}` })
})

export default router