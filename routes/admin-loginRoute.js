import express from 'express';
import adminModel from '../models/adminModel.js'; // Assuming you're using the admin model
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secret_key = process.env.JWT_SECRET;
const router = express.Router();

router.post('/admin', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if admin exists
        const admin = await adminModel.findOne({ email: email });
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin does not exist' });
        }

        // Check if the password matches (remove encryption verification)
        if (password !== admin.password) { // Compare plain text password directly
            return res.status(401).json({ success: false, message: 'Wrong password' });
        }

        // If both email and password are correct
        const token = jwt.sign(
            { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
            secret_key,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,        // Ensure the cookie can't be accessed via JavaScript
            secure: true,          // Set to true in production (requires HTTPS)
            sameSite: 'strict',    // Prevent CSRF
            maxAge: 3600000,       // Set expiration to 1 hour
        });

        res.status(200).json({ success: true, message: 'Login successful', admin });

    } catch (error) {
        console.error('Error during login', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
