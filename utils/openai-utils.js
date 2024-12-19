import { openAI } from '../configs/openai-config.js'

// Function to get ChatGPT response as a promise
const getChatGPTResponse = async (prompt) => {
    try {
        const response = await openAI.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
        })

        return response.choices[0].message.content.trim()
    } catch (error) {
        console.error('Error while calling the OpenAI API:', error)
        throw error
    }
}
export default getChatGPTResponse
