import express from 'express'
import { registerUser, loginUser, refreshUser } from '../controllers/auth-controller.js'

import bodyValidation from '../middleware/body-validation.js'
import { registerValidator, loginValidator, refreshValidator } from '../validators/auth-validators.js'

const authRouter = express.Router()

authRouter.post('/auth/register', bodyValidation(registerValidator), registerUser)
authRouter.post('/auth/login', bodyValidation(loginValidator), loginUser)
authRouter.post('/auth/refresh', bodyValidation(refreshValidator), refreshUser)

export default authRouter
