// Print all exams and their questions, showing id, _id, and question text
const mongoose = require('mongoose');
const Exam = require('../models/Exam');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam';

async function printExamQuestions() {
  await mongoose.connect(MONGO_URI);
  const exams = await Exam.find();
  for (const exam of exams) {
    console.log(`Exam: ${exam._id} | ${exam.title}`);
    if (Array.isArray(exam.questions)) {
      exam.questions.forEach((q, idx) => {
        console.log(`  Q${idx + 1}: id=${q.id} _id=${q._id} text="${q.question}"`);
      });
    }
    console.log('---');
  }
  await mongoose.disconnect();
}

printExamQuestions().catch(err => {
  console.error('Error printing exams:', err);
  process.exit(1);
}); 