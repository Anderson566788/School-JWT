import { pool } from '../config/database.js'

export const createEnrollMatter = async (req, res) => {
    const { role, id: studentId } = req.user
    const { matterId } = req.body

    if (role !== 'aluno') return res.status(403).json({ message: 'Apenas alunos podem se matricular em uma matéria' })

    try {
        const [matters] = await pool.query(`SELECT * FROM matters WHERE id = ?`, [matterId])
        if (matters.length === 0) return res.status(404).json({ message: 'Matéria não encontrada' })

        await pool.query(`INSERT INTO enrollments (student_id, matter_id) VALUES (?,?)`, [studentId, matterId])
        res.status(201).json({ message: 'Matrícula realizada com sucesso!' })

    } catch (error) {
        if (error.code === 'ERR_DUP_ENTRY') return res.status(400).json({ message: 'Você já está matriculado nessa matéria' })

        res.status(500).json({ message: 'Erro ao se matricular na matéria', error: error.message })
    }
}

export const viewEnrolledMatter = async (req, res) => {
    const { id: student_id, role } = req.user

    if (role !== 'aluno') return res.status(403).json({ message: 'Apenas alunos podem visualizar as suas matrículas' })

    try {
        const [rows] = await pool.query(`
                SELECT m.* FROM enrollments e JOIN matters m ON e.matter_id = m.id WHERE e.student_id = ?
                `, [student_id])

        res.json({ matter: rows })

    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar matérias', error: error.message })
    }
}

export const getStudentsByProfessor = async (req, res) => {
    const { id: professorId, role } = req.user

    if (role !== 'professor') return res.status(403).json({ message: 'Apenas professores podem acessar essa informação' })

    try {
        const [rows] = await pool.query(`
            SELECT 
                m.name AS materia,
                u.name AS aluno,
                u.email
            FROM enrollments e
            JOIN matters m ON e.matter_id = m.id
            JOIN users u ON e.student_id = u.id
            WHERE m.professor_id = ?
            ORDER BY m.name, u.name
            `, [professorId])

        res.json({ alunosMatriculados: rows })


    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar os alunos matriculados', error: error.message })
    }
}

export const getMattersByProfessor = async (req, res) => {
    const { professorId } = req.params

    try {
        const [users] = await pool.query(`SELECT * FROM users WHERE id = ? AND role = 'professor'`, [professorId])
        if (users.length === 0) return res.status(404).json({ message: 'Professor não encontrado' })

        const [matters] = await pool.query(`SELECT * FROM matters WHERE professor_id = ?`, [professorId])
        res.json({ professor: users[0].name, materias: matters })

    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar matérias do professor', error: error.message })
    }
}