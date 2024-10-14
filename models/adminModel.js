import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    admincode: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'teacher'],
        default: 'teacher'
    } 
    
}, { Timestamp: true });


const teacherModel = mongoose.model("teacher", adminSchema);

export default teacherModel;