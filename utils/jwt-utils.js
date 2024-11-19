import jwt from 'jsonwebtoken'
import { BadRequestErrorResponse, UnauthorizedErrorResponse, InternalServerErrorResponse } from './error-schemas.js'

// Generate JWT with minimal payload (user ID only)
const generateJWT = async (userId) => {
    if (!userId) {
        throw new BadRequestErrorResponse('User ID is required to generate a JWT')
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new InternalServerErrorResponse('JWT secret not defined in environment')
    }

    const options = {
        algorithm: 'HS512',
        audience: process.env.JWT_AUDIENCE || 'default_audience',
        issuer: process.env.JWT_ISSUER || 'default_issuer',
        expiresIn: '1h', // Set the expiration to 1 hour; adjust as needed
    }

    try {
        const token = await jwt.sign({ id: userId }, secret, options)
        return { token, expire: new Date(Date.now() + 3600 * 1000).toISOString() } // 1-hour expiration
    } catch (error) {
        throw new InternalServerErrorResponse(`Token generation error: ${error.message}`)
    }
}

const decodeJWT = async (token) => {
    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new InternalServerErrorResponse('JWT secret not defined in environment')
    }

    try {
        // Decode and verify the JWT
        const data = await jwt.verify(token, secret)
        return { id: data.id }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            // JWT is expired; throw error so the frontend can handle the refresh
            throw new UnauthorizedErrorResponse('JWT expired, please refresh your token')
        } else {
            // Other errors are invalid JWT errors
            throw new UnauthorizedErrorResponse('Invalid JWT')
        }
    }
}

export { generateJWT, decodeJWT }
