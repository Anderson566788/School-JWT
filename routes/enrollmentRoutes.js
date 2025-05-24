import { createEnrollMatter, viewEnrolledMatter, getStudentsByProfessor, getMattersByProfessor } from '../controllers/enrollmentController.js'
import { authenticate, authorizeRole } from '../middlewares/userMiddlewares.js'
import express from 'express'
const router = express.Router()

router.post('/matriculas', authenticate, authorizeRole('aluno'), createEnrollMatter)
router.get('/matriculas', authenticate, authorizeRole('aluno'), viewEnrolledMatter)
router.get('/professor/alunos', authenticate, authorizeRole('professor'), getStudentsByProfessor)
router.get('/professor/:professorId/materias', authenticate, getMattersByProfessor)


export default router