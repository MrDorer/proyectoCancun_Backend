import pool from '../db/dbConfig.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const saltRounds = 10;

const UserController = {

    register: async (req, res) => {
        try {
            const { nombre, correo, telefono, contrasena } = req.body
            const [check] = await pool.query('SELECT * FROM Usuario WHERE Correo = ?', [correo])

            if(check.length > 0){
                return res.status(401).send('You have registered already.')
            }

            const hash = bcrypt.hashSync(contrasena, saltRounds);
            await pool.query('INSERT INTO Usuario (Nombre, Correo, Telefono, HashContrasena) VALUES ( ?, ?, ?, ? )',
                [nombre, correo, telefono, hash]
            )

            return res.status(201).send('User succesfully created')
        } catch (error) {
            return res.status(500).send({message: 'Something went wrong - 500', error: error})
        }
    },

    login: async (req, res) => {
        try {
            const JWT_SECRET = process.env.JWT_SECRET
            console.log(JWT_SECRET)
            const { correo, contrasena } = req.body
            const [check] = await pool.query('SELECT * FROM Usuario WHERE Correo = ?', [correo])

            if(check.length == 0){
                return res.status(401).send('You are not registered yet')
            }
            const hash = check[0].HashContrasena
            const match = bcrypt.compareSync(contrasena, hash);

            if(match == false){
                return res.status(401).send({message: "Unauthorized, credentials don't match - 401"})
            }

            const accessToken = jwt.sign({ correo: correo }, JWT_SECRET, { expiresIn: '60m' })
            return res.json(accessToken)

        } catch (error) {
            return res.status(500).send({message: 'Something went wrong - 500', error: error})
        }
    },
}

export default UserController