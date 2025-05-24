import { createMatter, viewMatter, updateMatter, deleteMatter } from '../controllers/matterController.js'
import { authenticate, authorizeRole } from '../middlewares/userMiddlewares.js'
import express from 'express'
const router = express.Router()

router.post('/materias', authenticate, authorizeRole('admin', 'professor'), createMatter)
router.get('/materias', authenticate, viewMatter)
router.put('/materias/:id', authenticate, authorizeRole('admin', 'professor'), updateMatter)
router.delete('/materias/:id', authenticate, authorizeRole('admin', 'professor'), deleteMatter)

export default router