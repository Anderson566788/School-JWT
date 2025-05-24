import jwt from 'jsonwebtoken'
import { pool } from '../config/database.js'

export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ message: 'Token não fornecido' })
    const token = authHeader.split(' ')[1]

    try {
        const [rows] = await pool.query(`SELECT * FROM token_blacklist WHERE token = ?`, [token])
        if (rows.length > 0) return res.status(401).json({ message: 'Token inváido ou expirado' })

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()

    } catch (error) {
        res.status(401).json({ message: 'Token inválido', error: error.message })
    }
}

export const authorizeRole = (...roles) => {
    return (req, res, next) => {
        const userRole = req.user?.role
        if (!roles.includes(userRole)) return res.status(403).json({ message: 'Acesso negado: Permissão imsuficiente' })

        next()
    }
}