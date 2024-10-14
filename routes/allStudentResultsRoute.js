import express from 'express'
import studentMarksModel from '../models/studentMarksModel.js';

const router = express.Router();

router.get('/student-results', async (req, res) => {
    const studentsResultData = await studentMarksModel.find({});

    if (!studentsResultData) {
        return res.status(400).json({ success: false, message: "data not found" });
    }
    res.status(200).json({ success: true, message: 'data fetched successfully', studentsResultData });
});

export default router;