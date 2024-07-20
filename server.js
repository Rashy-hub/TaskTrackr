require('dotenv').config() // Load environment variables from .env file
const express = require('express')
const cors = require('cors')

const path = require('path')
const mongoose = require('mongoose')
const todoRouter = require('./routes/todo-route')

const app = express()
app.use(cors())

//
const { PORT, NODE_ENV, MONGODB_URI } = process.env
const port = PORT || 3000
let mongoURI = null
// Connect to MongoDB (replace with your connection string)
if (process.env.NODE_ENV === 'development') {
    mongoURI = 'mongodb://localhost:27017/todo-app'
} else {
    mongoURI = process.env.MONGODB_URI
}

mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err))

// Middleware
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public'))) // Serve static assets from public folder

// Routes
app.use('/', todoRouter) // Use the todoRouter for all routes starting with '/'
// Inside server.js, after defining the todoRouter

// Inside server.js, modify the route handler (e.g., for the GET / route)

app.get('/', async (req, res) => {
    try {
        const todos = await Todo.find()
        res.render('layouts/main', { todos }) // Render only the todo list partial
    } catch (err) {
        console.error(err)
        res.status(500).send('Error retrieving todos')
    }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
