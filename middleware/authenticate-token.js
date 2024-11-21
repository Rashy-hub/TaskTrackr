import asyncHandler from 'express-async-handler'
import { decodeJWT } from '../utils/jwt-utils.js'
import { BadRequestErrorResponse, UnauthorizedErrorResponse } from '../utils/error-schemas.js'
import mongoose from 'mongoose'

const authenticateToken = asyncHandler(async (req, res, next) => {
    // Récupérer le token depuis la session
    const token = req.session?.token // Vérifie si la session et le token existent
    if (!token) {
        next(new UnauthorizedErrorResponse('Access token missing or invalid'))
    }

    // Vérifier le token et décoder l'utilisateur
    const verifiedUserId = await decodeJWT(token)
    req.user = verifiedUserId // Ajouter les infos de l'utilisateur dans l'objet req

    // Valider le format de l'ID utilisateur (doit être un ObjectId valide de MongoDB)
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
        return next(new BadRequestErrorResponse('Invalid user ID'))
    }

    next()
})

export default authenticateToken
