//Importações
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const res = require('express/lib/response')

const app = express()

//Cofiguração JSON response (sem isso o JSON não é lido)
app.use(express.json())

//Models (Importação do componente model)
const User = require('./models/User')

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

    if (!email) {
        return res.status(422).json({ msg: "O email é obrigatório" })
    }

    if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatória" })
    }

    if (password !== confirmpassword) {
        return res.status(422).json({ msg: "As senhas não conferem!" })
    }

    // Checa email existente
    const userExists = await User.findOne({ email: email });

    if (userExists) {
        return res.status(422).json({ msg: "Por favor, utilize outro e-mail!" });
    }

    // Cria Senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Cria Usuário
    const user = new User({
        name,
        email,
        password: passwordHash,
    });

    try {
        await user.save()

        res.status(201).json({ msg: "Usuário criado com sucesso!" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Aconteceu um erro, tente novamente mais tarde" })
    }
})

//Login de Usuário

app.post('/auth/login', async (req, res) => {

    const { email, password } = req.body

    //Validação

    if (!email) {
        return res.status(422).json({ msg: "O email é obrigatório" })
    }

    if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatória" })
    }

    // Checa usuário existente
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    //Checar senha está correta
    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
        return res.status(422).json({ msg: "Senha invalida!" });
    }

    try {

        const secret = process.env.SECRET

        const token = jwt.sign(
            {
                id: user.id,
            },
            secret,
        )

        res.status(200).json({ msg: "Autencitação ralizada com sucesso", token })

    } catch (error) {
        console.log(error);

        res.status(500).json({ msg: "Aconteceu um erro, tente novamente mais tarde" })
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