import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import pool from './db/dbConfig.js'


const app = express()
const port = 8082



app.use(express.json())
app.use(cors())

app.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('Select * from Contacto')
        return res.send(rows)
    } catch (error) {
        console.log(error)
        return res.status(500).send('Algo ha salido mal')
    }
})

app.post('/', async (req, res) => {
    const { nombre, correo, telefono, mensaje } = req.body
    try {

        const [check] = await pool.query('SELECT * FROM Contacto WHERE Correo = ?', [correo])

        if(check.length > 0){
            return res.status(401).send('You have registered already.')
        }

        const [results] = await pool.query(
            'INSERT INTO Contacto (Nombre, Correo, Telefono, Mensaje, EstadoId) VALUES (?, ?, ?, ?, ?)',
            [nombre, correo, telefono, mensaje, '1'])
        return res.status(201).send({ id: results.insertId, nombre, correo})

    } catch (error) {
        return res.status(500).send({message: 'Something went wrong - 500', error: error})
    }
})


app.listen(port, () => console.log(`Listening on port ${port}`))
