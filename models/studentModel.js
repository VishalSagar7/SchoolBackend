// models/studentModel.js
import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    studentname: {
        type: String,
        required: true,
    },
    studentemail: {
        type: String,
        required: true,
        unique: true, // Ensure email uniqueness
    },
    studentpassword: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'teacher'],
        default: 'student'
    },
    studentphone: {
        type: String,
        required : true
    },
    studentstandard: {
        type: String,
        required : true
    },

}, { timestamps: true });

const StudentModel = mongoose.model('Student', studentSchema);

export default StudentModel;


