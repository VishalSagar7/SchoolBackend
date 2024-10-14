import express, { json } from 'express';
import StudentModel from '../models/studentModel.js';
import bcrypt from 'bcryptjs'; // Change the import statement
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const secret_key = process.env.JWT_SECRET;

router.post('/student', async (req, res) => {
    const { email, password } = req.body;

    console.log(email, password);

    try {
        // Find the user by email
        const user = await StudentModel.findOne({ studentemail: email }); // Use findOne to get a single user

        // Check if the user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Compare the provided password with the password in the database
        const isMatch = await bcrypt.compare(password, user.studentpassword); // Use bcrypt.compare

        // If the password does not match
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Wrong password"
            });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, email: user.studentemail, name: user.studentname, role: user.role },
            secret_key,
            { expiresIn: '1h' },
        );

        // Set the JWT as an HTTP-only, Secure cookie
        res.cookie('token', token, {
            httpOnly: true,        // Ensure the cookie can't be accessed via JavaScript
            secure: false,         // Set to true in production (requires HTTPS)
            sameSite: 'strict',    // Prevent CSRF
            maxAge: 3600000,       // Set expiration to 1 hour
        });

        // If the login is successful
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: user,
        });

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
