import bcrypt from 'bcrypt'
import UserModel from '../models/user.js'
import { generateJWT } from '../utils/jwt-utils.js'
import { ConflictErrorResponse, NotFoundErrorResponse, UnauthorizedErrorResponse } from '../utils/error-schemas.js'
import asyncHandler from 'express-async-handler'
import { AuthLoginResponse, AuthRefreshResponse, AuthRegistrationResponse } from '../utils/response-schemas.js'

export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.validatedData
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new UserModel({ username, email, password: hashedPassword })
    const existingUser = await UserModel.findOne({ email })

    if (existingUser) {
        throw new ConflictErrorResponse('Email is already in use', [{ user: existingUser }])
    }
    const savedUser = await newUser.save()

    const token = await generateJWT(savedUser._id)

    // Set token in the cookie
    res.cookie('token', token.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production (HTTPS)
        maxAge: 3600000, // 1 hour in milliseconds
        sameSite: 'strict', // Protect against CSRF attacks
    })

    const response = new AuthRegistrationResponse('User has been registered successfully', {
        user: savedUser,
    })

    res.status(response.status).json(response)
})

export const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.validatedData

    const user = await UserModel.findOne({ email })
    if (!user) {
        next(new UnauthorizedErrorResponse('Invalid credentials, email not found in the database', [{ field: 'email' }]))
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
        next(new UnauthorizedErrorResponse('Invalid credentials, password not matching', [{ field: 'password' }]))
    }
    UnauthorizedErrorResponse
    const token = await generateJWT(user._id)

    // Set token in the cookie
    res.cookie('token', token.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production (HTTPS)
        maxAge: 3600000, // 1 hour in milliseconds
        sameSite: 'strict',
    })

    const response = new AuthLoginResponse('User has been logged in successfully', {
        user: user.username,
        id: user._id,
    })

    res.status(response.status).json(response)
})

export const refreshUser = asyncHandler(async (req, res) => {
    const { email } = req.validatedData

    const user = await UserModel.findOne({ email })
    if (!user) {
        next(new NotFoundErrorResponse('User not found', [{ field: 'email' }]))
    }

    const token = await generateJWT(user._id)

    // Set the new token in the cookie
    res.cookie('token', token.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000, // 1 hour in milliseconds
        sameSite: 'strict',
    })

    const response = new AuthRefreshResponse('Token has been refreshed successfully', {
        token: token.token,
    })

    res.status(response.status).json(response)
})
