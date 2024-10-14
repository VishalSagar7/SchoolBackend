import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'


dotenv.config();

const secret_key = process.env.JWT_SECRET
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token

    // console.log(token);
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access Denied, No Token Provided' });
    }

    try {
        const decoded = jwt.verify(token, secret_key); // Verify token with the secret key
        console.log(decoded);
        
        req.user = decoded; // Store user info (id, email, role) in request object
        next(); // Pass control to the next middleware/route handler
    } catch (error) {
        res.status(403).json({ success: false, message: 'Invalid Token' });
    }
};

export default authenticateJWT;
