import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import routes from './routes/routes.js'


const app = express()
const port = 8082

app.use(express.json())
app.use(cors())

app.use('/', routes)
app.listen(port, '0.0.0.0', () => console.log(`Listening on port ${port}`))