import express from 'express';
import AnnouncementModel from '../models/announcementModel.js';

const router = express.Router();

router.post('/announcement', async (req, res) => {
    const { announcement, author } = req.body;

    // Basic validation (you could add more checks as needed)
    if (!announcement || !author) {
        return res.status(400).json({ error: 'Announcement and author are required' });
    }

    try {
        // Create new announcement
        const newAnnouncement = new AnnouncementModel({ announcement, author });

        // Save the announcement to the database
        await newAnnouncement.save();

        // Send success response with the created announcement
        res.status(201).json({ message: 'Announcement created successfully', newAnnouncement });
    } catch (error) {
        // Send error response
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

export default router;
