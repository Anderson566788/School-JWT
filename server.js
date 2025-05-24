import userRoutes from './routes/userRoutes.js'
import matterRoutes from './routes/matterRoutes.js'
import enrollmentRoutes from './routes/enrollmentRoutes.js' 
import express from 'express'
import env from 'dotenv'
env.config()

const app = express()
app.use(express.json())

app.use(userRoutes)
app.use(matterRoutes)
app.use(enrollmentRoutes)

const port = process.env.PORT

app.listen(port, () => console.log('Rodando na porta: ' + port))