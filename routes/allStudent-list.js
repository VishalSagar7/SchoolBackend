// import studentMarksModel from "../models/studentMarksModel";
import StudentModel from "../models/studentModel.js";
import express from 'express';

const route = express.Router();

route.get('/all-students-list', async (req, res) => {
    const allStudents = await StudentModel.find({});

    console.log(allStudents);
    res.status(200).json({success:true, message:"got the all students list" ,allStudents})
    
});

export default route;