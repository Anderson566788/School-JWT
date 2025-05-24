import { pool } from '../config/database.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' })
}

export const register = async (req, res) => {
    const { name, password, email } = req.body

    try {
        const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email])
        if (rows.length > 0) return res.status(500).json({ message: 'Email já registrado' })

        const hasedPassword = await bcrypt.hash(password, 10)
        await pool.query(`INSERT INTO users (name, password, email) VALUES (?, ?, ?)`, [name, hasedPassword, email])
        res.status(201).json({ messsage: 'Usuário registrado com sucesso!' })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao fazer cadastro', error: error.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email])
        if (rows.length === 0) return res.status(400).json({ message: 'Credenciais inválidas' })

        const user = rows[0]
        const match = await bcrypt.compare(password, user.password)
        if (!match) return res.status(400).json({ message: 'Credenciais inválidas' })

        const token = generateToken(user)

        res.json({ token })

    } catch (error) {
        res.status(400).json({ message: 'Erro ao fazer login', error: error.message })
    }
}

export const getAllUSers = async (req, res) => {
    const [users] = await pool.query(`SELECT id, email, role FROM users`)
    res.json(users)
}

export const deleteUSer = async (req, res) => {
    const { id } = req.params

    try {
        const currentUser = req.user
        if (currentUser.role !== 'admin') return res.status(403).json({ message: 'Você não tem permissão para deletar usuários' })

        const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id])
        if (rows.length === 0) res.json(404).json({ message: 'Usuário não encontrado' })

        pool.query(`DELETE FROM users WHERE id = ?`, [id])
        res.json({ message: 'Usuário deletado com sucesso!' })

    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar Usuário', error: error.message })
    }
}

export const logout = async (req, res) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(400).json({ message: 'Token não fornecido' })

    try {
        const decoded = jwt.decode(token)
        const expiresAt = new Date(decoded.exp * 1000)

        await pool.query(`INSERT INTO token_blacklist (token, expires_at) VALUES (?, ?)`, [token, expiresAt])
        res.json({ message: 'Logout realizado com sucesso' })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao fazer logout', error: error.message })
    }
}