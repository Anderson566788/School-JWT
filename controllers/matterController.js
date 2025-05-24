import { pool } from '../config/database.js'

export const createMatter = async (req, res) => {
    const { role, id: userId } = req.user
    const { name, code, description, workloud, professor_id } = req.body

    if (role !== 'admin' && role !== 'professor') return res.status(403).json({ message: 'Apenas admin ou professor podem criar matérias' })

    const professorId = role === 'professor' ? userId : professor_id

    try {
        await pool.query(`INSERT INTO matters (name, code, description, workloud, professor_id) VALUES (?, ?, ?, ?, ?)`,
            [name, code, description, workloud, professorId])
        res.status(201).json({ message: 'Matéria criada com sucesso!' })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar matéria', error: error.message })
    }
}

export const viewMatter = async (req, res) => {
    const { role, id } = req.user

    try {
        let matters
        if (role === 'professor') {
            const [rows] = await pool.query(`SELECT * FROM matters WHERE professor_id = ?`, [id])
            matters = rows
        } else {
            const [rows] = await pool.query(`SELECT * FROM matters`)
            matters = rows
        }

        res.json({ matters })

    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar matérias', error: error.message })
    }
}

export const updateMatter = async (req, res) => {
    const { id } = req.params
    const { name, code, description, workloud } = req.body
    const { role, id: userId } = req.user

    try {
        const [rows] = await pool.query(`SELECT * FROM matters WHERE id = ?`, [id])
        if (rows.length === 0) return res.status(404).json({ message: 'Matéria não encontrada' })

        const matter = rows[0]
        if (role !== 'professor' && matter.professor_id !== userId) return res.status(403).json({ message: 'Você não pode editar essa matéria' })

        await pool.query(`UPDATE matters SET name = ?, code = ?, description = ? , workloud = ? WHERE id = ?`,
            [name, code, description, workloud, id]
        )

        res.json({ message: 'Matéria atualizada com sucesso!' })

    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar matéria', error: error.message })
    }
}

export const deleteMatter = async (req, res) => {
    const { role, id: userId } = req.user
    const { id } = req.params

    try {
        const [rows] = await pool.query(`SELECT * FROM matters WHERE id = ?`, [id])
        if (rows.length === 0) return res.status(400).json({ message: 'Matéria não encontrada' })

        const matter = rows[0]
        if (role !== 'admin' && matter.professor_id !== userId) {
            return res.status(403).json({ message: 'Você não tem permissão para deletar essa matéria' })
        }

        await pool.query(`DELETE FROM matters WHERE id = ?`, [id])
        res.json({ message: 'Matéria deletada com sucesso' })

    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar matéria', error: error.message })
    }
}