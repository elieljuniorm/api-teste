// Importações
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const res = require('express/lib/response')

const app = express()

//Cofiguração JSON response (sem isso o JSON não é lido)
app.use(express.json())

// Open Route - Public Route
app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Bem vindo a API!' })
})

//Registrar usuário

app.post('/auth/register', async (req, res) => {
    const { name, email, password, confirmpassword } = req.body

    //Validação
    if (!name) {
        return res.status(422).json({ msg: "O nome é obrigatório" })
    }
})

//Credenciais

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.pbrb9mh.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(3000)
        console.log("Conectou ao banco")
    })
    .catch((err) => console.log(err))