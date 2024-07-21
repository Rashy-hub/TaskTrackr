//const db = require('../models'); replace with mongoose schema
const bcrypt = require('bcrypt')
const UserModel = require('../models/user')
//replace Op object (sequalize) with mongooose
const { ErrorResponse } = require('../utils/error-schema')
const { generateJWT } = require('../utils/jwt-utils')

const authController = {
    register: async (req, res) => {
        console.log('REGISTER')
        // Recuperation des données
        const { username, email } = req.validatedData

        // Hashage du mot de passe à l'aide de "bcrypt"
        const password = await bcrypt.hash(req.validatedData.password, 10)

        // Création du compte en base de données

        // Create an instance of model SomeModel
        const newuser = new UserModel({ username, email, password })
        //   Génération d'un « Json Web Token »
        const token = await generateJWT({
            id: newuser._id,
            pseudo: newuser.username,
            isAdmin: newuser.isAdmin,
        })
        console.log(token)
        //save data
        await newuser.save(function (err) {
            if (err) {
                return res.status(422).json(new ErrorResponse('Bad credential ' + err, 422))
            }

            token.id = newuser._id
            console.log('test ' + newuser._id)
            // Envoi du token
            res.json(token)
            console.log(username + ' has been registred in database')
            // saved!
        })

        // déja preparer une gallerie favorie
    },

    login: async (req, res) => {
        // Recuperation des données

        const { email, password } = req.validatedData

        // Récuperation du compte "member" à l'aide du pseudo ou de l'email avec mongoose
        //const member = {pseudo:identifier,email:"test@gmail.com"}
        const logeduser = await UserModel.findOne({ email: email })
        // Erreur 422, si le member n'existe pas (pseudo ou email invalide)
        if (!logeduser) {
            return res.status(422).json(new ErrorResponse('Bad credential', 422))
        }

        // Si le member existe: Vérification du password via "bcrypt"
        const isValid = await bcrypt.compare(password, logeduser.password)

        // Erreur 422, si le mot de passe ne correspond pas au hashage
        if (!isValid) {
            return res.status(422).json(new ErrorResponse('Bad credential', 422))
        }

        // console.log(`ici les data login ${isValid} ${logeduser}`)
        // Génération d'un « Json Web Token »
        const token = await generateJWT({
            id: logeduser._id,
            pseudo: logeduser.username,
            isAdmin: logeduser.isAdmin,
        })
        token.id = logeduser._id
        // Envoi du token
        console.log(logeduser.username + ' is logged ')
        res.json(token)
    },

    refresh: async (req, res) => {
        // Recuperation des données
        const { email } = req.validatedData
        console.log('into refresh: ' + email)

        const member = await db.Member.findOne({
            where: {
                // Condition avec un OU en SQL
                email: { [Op.eq]: email.toLowerCase() },
            },
        })
        if (member) {
            // Génération d'un « Json Web Token »
            const token = await generateJWT({
                id: member.id,
                email: member.email,
                isadmin: member.isadmin,
            })
            token.isadmin = member.isadmin
            token.id = member.id

            // Envoi du token
            res.json(token)
        } else {
            res.json(null)
        }
    },
}

module.exports = authController
