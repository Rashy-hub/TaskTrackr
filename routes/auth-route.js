import express from 'express'
import { registerUser, loginUser, refreshUser, logoutUser } from '../controllers/auth-controller.js'

import bodyValidation from '../middleware/body-validation.js'
import { registerValidator, loginValidator, refreshValidator } from '../validators/auth-validators.js'
import authenticateToken from '../middleware/authenticate-token.js'

const authRouter = express.Router()

authRouter.post('/auth/register', bodyValidation(registerValidator), registerUser)
authRouter.post('/auth/login', bodyValidation(loginValidator), loginUser)
authRouter.post('/auth/refresh', authenticateToken, refreshUser)
authRouter.post('/auth/logout', logoutUser)

export default authRouter
