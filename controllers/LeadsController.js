import pool from '../db/dbConfig.js'
import emailjs from '@emailjs/nodejs'
import 'dotenv/config'


const LeadsController = {

    getLead:  async (req, res) => {
        try {
            const [rows] = await pool.query('Select * from Contacto')
            return res.send(rows)
        } catch (error) {
            console.log(error)
            return res.status(500).send('Algo ha salido mal')
        }
    },

    createLead: async (req, res) => {
        try {
            const { nombre, correo, telefono, mensaje } = req.body
            const [check] = await pool.query('SELECT * FROM Contacto WHERE Correo = ?', [correo])

            if(check.length > 0){
                return res.status(401).send('You have registered already.')
            }

            const [results] = await pool.query(
                'INSERT INTO Contacto (Nombre, Correo, Telefono, Mensaje, EstadoId) VALUES (?, ?, ?, ?, ?)',
                [nombre, correo, telefono, mensaje, '1'])

                const date = new Date()

                const response = await emailjs.send(process.env.EMAILJS_SERVICEID,process.env.EMAILJS_ADMINTEMPLATEID,{
                    Admin: process.env.ADMIN_NAME,
                    leadName: nombre,
                    CurrentTime: date.toLocaleTimeString("es-MX"),
                    leadPhone: telefono,
                    leadEmail: correo,
                    leadMessage: mensaje,
                    adminEmail: process.env.ADMIN_EMAIL,
                    }, { publicKey: process.env.EMAILJS_PUBLICKEY, privateKey: process.env.EMAILJS_PRIVATEKEY });

                console.log(response)    
                return res.status(201).send({ id: results.insertId, nombre, correo})

        } catch (error) {
            console.log(error)
            return res.status(500).send({message: 'Something went wrong - 500', error: error})
        }
    },

    patchLeadStatus: async (req,res) => {
        try {
            const {id} = req.params
            const {estadoId} = req.body 
            const [results] = await pool.query('UPDATE Contacto SET EstadoId = ? WHERE Id = ?', [estadoId, id])

            if(results.affectedRows > 0){
                return res.status(201).send('Cambiado correctamente')
            }
                return res.status(500).send('Huh?')
            
        } catch (error) {
            return res.status(500).send({message: 'Something went wrong - 500', error: error})
        }
    },

    deleteLeadStatus: async (req,res) => {
        try {
            
            const { id } = req.params
            
            const [results] = await pool.query('DELETE FROM Contacto WHERE Id = ?', [id])
            
            if(results.affectedRows > 0){
                return res.status(201).send('Resource deleted')
            }
            return res.status(400).send('Resource not found - Bad request')

        } catch (error) {
            return res.status(500).send({message: 'Something went wrong - 500', error: error})
        }
    }
}

export default LeadsController