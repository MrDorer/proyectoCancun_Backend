import express from 'express'
import cors from 'cors'
import mysql from 'mysql2'

const app = express()
const port = 8082

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Piciosa0108',
    database: 'prueba12',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Funcionando')
})

app.post('/form', (req, res) => {
    const { nombre, correo, telefono, mensaje } = req.body

    console.log(req.body)

    pool.query(
        'INSERT INTO Contacto (Nombre, Correo, Telefono, Mensaje) VALUES (?, ?, ?, ?)',
        [nombre, correo, telefono, mensaje],
        (err, results) => {
            if (err) {
                console.error(err)
                return res.status(500).send('Algo ha salido mal')
            }

            res.status(201).send({
                id: results.insertId,
                nombre,
                correo
            })
        }
    )
})

app.listen(port, () => console.log(`Listening on port ${port}`))
