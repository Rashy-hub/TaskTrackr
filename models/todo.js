import mongoose from 'mongoose'

const TodoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['DONE', 'IN PROGRESS', 'STANDBY', 'REPORTED'],
        default: 'IN PROGRESS',
        required: true,
    },
    // User Ref
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
})

const Todo = mongoose.model('todos', TodoSchema)

export default Todo
