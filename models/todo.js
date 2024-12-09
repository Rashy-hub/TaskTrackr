import mongoose from 'mongoose'

const TodoSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            default: '',
        },
        status: {
            type: String,
            enum: ['DONE', 'IN PROGRESS', 'STANDBY', 'REPORTED'],
            default: 'IN PROGRESS',
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        priority: {
            type: String,
            enum: ['CRUCIAL', 'IMPORTANT', 'NORMAL', 'LOW'],
            default: 'NORMAL',
            required: true,
        },
        isArchived: {
            type: Boolean,
            default: false,
        },
        topic: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'topics', // Reference to the User model
            required: [true, 'Topic is required'],
        },
    },
    {
        timestamps: true,
    }
)

const Todo = mongoose.model('todos', TodoSchema)

export default Todo
