import asyncHandler from 'express-async-handler'
import { decodeJWT } from '../utils/jwt-utils.js'
import { BadRequestErrorResponse, UnauthorizedErrorResponse } from '../utils/error-schemas.js'
import mongoose from 'mongoose'

const authenticateToken = asyncHandler(async (req, res, next) => {
    const token = req.cookies['token'] // Access token from cookies
    if (!token) {
        next(new UnauthorizedErrorResponse('Access token missing or invalid'))
    }

    const verifiedUserId = await decodeJWT(token)
    req.user = verifiedUserId // Add user info to the request object
    // validate the user id format => must be a valid mongoose objectID
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
        return next(new BadRequestErrorResponse('Invalid user ID'))
    }
    next()
})

export default authenticateToken
