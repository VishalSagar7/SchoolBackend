import express from 'express';
import dotenv from 'dotenv';
import studentRegistrationRoute from './routes/student-registerRoute.js';
import studentLoginRoute from './routes/student-loginRoute.js';
import adminLoginRoute from './routes/admin-loginRoute.js'
import cors from 'cors'
import mongoose from 'mongoose';
import authenticateJWT from './authonticateJwt.js';
import authorizeRoles from './authorizeRoles.js';
import cookieParser from 'cookie-parser';
import authenticateJWTforAdmin from './authonticateJwtforAdmin.js';
import studentMarksModel from './models/studentMarksModel.js';
import allStudentListRoute from './routes/allStudent-list.js'
import allStudentsResult from './routes/allStudentResultsRoute.js'
import announcementRoute from './routes/announcementRoute.js'
import AnnouncementModel from './models/announcementModel.js';
import StudentModel from './models/studentModel.js';

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173',  
    credentials: true,  
};

app.use(cors(corsOptions));


app.use('/api/register', studentRegistrationRoute);  
app.use('/api/login', studentLoginRoute);  
app.use('/api/login', adminLoginRoute);
app.use('/api', allStudentListRoute);
app.use('/api', allStudentsResult);
app.use('/api', announcementRoute);


app.post('/student/dashboard', authenticateJWT, (req, res) => {
    
    res.status(200).json({ success: true, message: 'Welcome to the student dashboard', user: req.user });
})

app.post('/teacher-dashboard', authenticateJWT,authorizeRoles('teacher'), (req, res) => {
    res.status(200).json({ success: true, message: 'Welcome, Teacher! This route is restricted.',user : req.user });
});


app.post('/post-student-marks', authenticateJWT, authorizeRoles('teacher'), async (req, res) => {
    try {
        // console.log(req.body);
        console.log(req.body);
        

        const { semister, studentName, standard, marks, year, seatno } = req.body;
        // console.log(semister);
        

        // Validate that all required fields are present
 
        
        if (!semister || !studentName || !standard || !marks || !seatno || !year) {
            return res.status(400).json({ message: 'All fields are required.' });
        }


        const exhistedUser = await studentMarksModel.findOne({ seatnumber: seatno });

        // console.log(exhistedUser);
        
        if (exhistedUser) {
            return res.status(500).json({ message: 'seat number already taken' });
        }



        // Ensure marks is an array of objects with subject and score
        const formattedMarks = Object.entries(marks).map(([subject, score]) => ({
            subject,
            score: parseInt(score, 10)  // Ensure score is an integer
        }));

        // Calculate total obtained marks and percentage
        const totalObtainedMarks = formattedMarks.reduce((total, mark) => total + mark.score, 0);
        const totalMarks = formattedMarks.length * 100;  // Assuming each subject is out of 100
        const percentage = (totalObtainedMarks / totalMarks) * 100;

        // Create a new instance of the studentMarksModel with the formatted marks array and percentage
        const newStudentMarks = new studentMarksModel({
            semister :semister,
            studentName,
            standard,
            year,
            seatnumber : seatno,
            marks: formattedMarks,
            percentage: percentage.toFixed(2),  // Store percentage up to 2 decimal places
            result: percentage >= 35 ? 'P' : 'F',
        });

        // Save the document to the database
        const savedStudentMarks = await newStudentMarks.save();

        // Return a success response
        res.status(201).json({
            success:true,
            message: 'Student marks saved successfully!',
            data: savedStudentMarks,
        });
    } catch (error) {
        console.error('Error saving student marks:', error);
        res.status(500).json({ message: 'Failed to save student marks.' });
    }
});


app.post('/getmarksby-seatno', async (req, res) => {

    const { seatnumber } = req.body
    // console.log(seatnumber);
    

    const user = await studentMarksModel.findOne({ seatnumber: seatnumber });
    // console.log(user);

    if (!user) {
        return res.status(400).json({ success: false, message: "incorrect seat number" })
    }
    
    res.status(200).json({ success: true, message: "students document found", user })
    
    
    
});


app.post('/student/logout', async (req, res) => {
    try {
     
        res.cookie('token', '', {
            httpOnly: true,      // Ensures the cookie is not accessible via JavaScript
            secure: false,       // Set to true in production (requires HTTPS)
            sameSite: 'strict',  // Helps prevent CSRF attacks
            expires: new Date(0) // Forces the cookie to expire immediately
        });


        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ success: false, error: error.message });
    }
});


app.get('/api/announcements', async (req, res) => {
    try {
        
        const allAnouncements = await AnnouncementModel.find({}).sort({ createdAt: -1 });

        res.status(200).json({ success: true, allAnouncements });
    }
    catch (error) {
        console.error("Error fetching announcements:", error);
        res.status(500).json({ success: false, message: "Failed to fetch announcements" });
    }
});

app.get('/admin-panelinfo', async (req, res) => {

    const studentsArray = await StudentModel.find({});

    
    res.json({ status: "ok",studentsArray });
    
})


app.get('/', (req, res) => {
    res.send('<h1>Hello, this is me</h1>');
});


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB Atlas");

        // Start the server only after successful connection
        const port = process.env.PORT || 3001;
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });


//SIvWUArUaHD7JHWY
