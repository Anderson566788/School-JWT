import { register, login, getAllUSers, deleteUSer, logout } from '../Controllers/userController.js'
import { authenticate, authorizeRole } from '../middlewares/userMiddlewares.js'
import express from 'express'
const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/users', authenticate, authorizeRole('admin'), getAllUSers)
router.delete('/users/:id', authenticate, authorizeRole('admin'), deleteUSer)
router.post('/logout', authenticate, logout)

export default router