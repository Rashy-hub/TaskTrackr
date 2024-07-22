require('dotenv-flow').config() // Load environment variables from .env file
const Todo = require('./models/todo')
const express = require('express')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')
const todoRouter = require('./routes/todo-route')
const authRouter = require('./routes/auth-route')
const logRequest = require('./middleware/request-logger')
const { registratedRoutes, extractRoutes } = require('./middleware/registratedRoutes')

const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json()) // To parse the incoming requests with JSON payloads

//extract env variables
const { PORT, NODE_ENV, MONGODB_URI, MONGO_LOCAL } = process.env
const port = PORT
let mongoURI = null
// Connect to MongoDB (replace with your connection string)
if (NODE_ENV === 'development') {
    mongoURI = MONGO_LOCAL
} else {
    mongoURI = MONGODB_URI
}

mongoose
    .connect(mongoURI)
    .then(() => console.log(`Connected to MongoDB - Connection string :  ${mongoURI}`))
    .catch((err) => console.error('Error connecting to MongoDB:', err))
MONGO_LOCAL
// Middleware
app.set('view engine', 'ejs')
app.use(logRequest)
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public'))) // Serve static assets from public folder

// Routes
//router.use('/todo', todoRouter)
//router.use('/auth', authRouter)
//app.use('/', router)

app.get('/todo', async (req, res) => {
    try {
        const todos = await Todo.find()
        res.render('layouts/main', { todos }) // Render only the todo list partial
    } catch (err) {
        console.error(err)
        res.status(500).send('Error retrieving todos')
    }
})
app.get('/', async (req, res) => {
    res.redirect('/todo')
})

//those routes will  be displayed in public when 404 error
registratedRoutes.push(todoRouter)
registratedRoutes.push(authRouter)

app.use('/', ...registratedRoutes)

app.use('*', extractRoutes, (req, res) => {
    const errorMessage = 'Page not found. Available routes:'
    const responseBody = {
        error: errorMessage,
        availableRoutes: req.extractedPaths,
    }

    res.status(404).json(responseBody)
})

app.listen(port, () => {
    console.log(`Server listening on port ${port} - in ${NODE_ENV} environnement`)
})
