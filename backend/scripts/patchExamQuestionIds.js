// Patch all exams in the database to ensure every question has a unique 'id' field
const mongoose = require('mongoose');
const Exam = require('../models/Exam');

// Generate a unique id (same logic as frontend)
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam';

async function patchExamQuestions() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const exams = await Exam.find();
  let updatedCount = 0;

  for (const exam of exams) {
    let changed = false;
    if (Array.isArray(exam.questions)) {
      for (const q of exam.questions) {
        if (!q.id) {
          q.id = generateId();
          changed = true;
        }
      }
    }
    if (changed) {
      await exam.save();
      updatedCount++;
      console.log(`Patched exam: ${exam._id} (${exam.title})`);
    }
  }

  console.log(`Done. Patched ${updatedCount} exams.`);
  await mongoose.disconnect();
}

patchExamQuestions().catch(err => {
  console.error('Error patching exams:', err);
  process.exit(1);
}); 