import express from 'express';
import StudentModel from '../models/studentModel.js';
import bcrypt from 'bcrypt';


const hashedPassword = async (password) => {
    const saltrounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltrounds);
    return hashedPassword;
};

const router = express.Router();

router.post('/student', async (req, res) => {
    const { username, email, password, phone, standard} = req.body;

    // Check if the user already exists
    const user = await StudentModel.findOne({ studentemail: email });

    if (user) {
        console.log(user);
        return res.status(401).json({ success: false, message: "User already exists" });
    }

    // Await the result of the hashedPassword function
    const encryptedPassword = await hashedPassword(password); // Add await here

    const newStudent = new StudentModel({
        studentname: username,
        studentemail: email,
        studentpassword: encryptedPassword,
        studentphone: phone,
        studentstandard: standard,
    });

    try {
        await newStudent.save();
        res.status(201).json({
            success: true,
            message: "Account created successfully",
            newStudent,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error creating account",
            error: error.message,
        });
    }
});

export default router;
 