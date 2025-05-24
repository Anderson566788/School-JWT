import mysql from 'mysql2/promise'
import env from 'dotenv'
env.config()

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env

export const pool = mysql.createPool({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE
})

try {
    pool.query('SELECT 1')
    console.log('Conexão com o MySQL estabelecida com sucesso')
} catch (error) {
    console.log('Erro ao se conectar ao MySQL')
}