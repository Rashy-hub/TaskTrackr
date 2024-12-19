// openai-config.js

import dotenvFlow from 'dotenv-flow'

import OpenAI from 'openai'

dotenvFlow.config() // Charger les variables d'environnement

// Définir la clé API OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

if (!OPENAI_API_KEY) {
    throw new Error("La clé API OpenAI est manquante dans les variables d'environnement.")
}

// Configuration de l'API OpenAI
export const openAI = new OpenAI({
    apiKey: OPENAI_API_KEY,
})
