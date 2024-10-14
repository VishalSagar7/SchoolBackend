import mongoose from "mongoose";

// const marksSchema = new mongoose.Schema({
//     Marathi: { type: Number, min: 10, max: 100 },
//     Sanskrit: { type: Number, min: 10, max: 100 },
//     Math: { type: Number, min: 10, max: 100 },
//     English: { type: Number, min: 10, max: 100 },
//     Science: { type: Number, min: 10, max: 100 },
//     History: { type: Number, min: 10, max: 100 },
//     SocialScience: { type: Number, min: 10, max: 100 },
//     Geography: { type: Number, min: 10, max: 100 },
// });

const studentMarksSchema = new mongoose.Schema({
  semister: { type: String, required: true },
  year : { type : Number , required:true},
    studentName: { type: String, required: true },
    standard: { type: String, required: true },
    marks: [
      {
        subject: { type: String, required: true },
        score: { type: Number, required: true, min: 10, max: 100 },
      }
    ],
  percentage: { type: Number, required: true },
  seatnumber: { type: String, required: true },
  result : {type : String, required : true},
    
  });

const studentMarksModel = mongoose.model('Studentmarks', studentMarksSchema);

export default studentMarksModel;
