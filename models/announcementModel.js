import mongoose from "mongoose";

const announcementSchema = mongoose.Schema({
    announcement: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    }
}, { timestamps: true });


const AnnouncementModel = mongoose.model('announcement', announcementSchema);

export default AnnouncementModel;