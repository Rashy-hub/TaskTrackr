import dotenvFlow from 'dotenv-flow'
dotenvFlow.config()
import express from 'express'
import cors from 'cors'
import path from 'path'
import mongoose from 'mongoose'
import todoRouter from './routes/todo-route.js'
import authRouter from './routes/auth-route.js'
import logRequest from './middleware/request-logger.js'
import { registratedRoutes, extractRoutes } from './middleware/registrated-routes.js'
import errorHandler from './middleware/errors-Handler.js'
import cookieParser from 'cookie-parser'

const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json()) // To parse the incoming requests with JSON payloads
app.use(cookieParser()) // to parse incoming cookies
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

// Middleware

app.use(logRequest)
app.use(express.urlencoded({ extended: false }))

// Serve static assets from public folder
//app.use(express.static(path.join(__dirname, 'public')))

// Routes
registratedRoutes.push(todoRouter)
registratedRoutes.push(authRouter)
// Register my roots for documentation
app.use('/api', ...registratedRoutes)

// Handle root URL to serve index.html

/* app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
}) */

app.use('*', extractRoutes, (req, res) => {
    const errorMessage = 'Page not found. Available routes on https://todo-list-demo.onrender.com/api/ are :'
    const responseBody = {
        error: errorMessage,
        availableRoutes: req.extractedPaths,
    }

    res.status(404).json(responseBody)
})

//Error centralized middleware :
app.use(errorHandler)
app.listen(port, () => {
    console.log(`Server listening on port ${port} - in ${NODE_ENV} environnement`)
    console.log(`static front served from http://localhost:${port}`)
})
