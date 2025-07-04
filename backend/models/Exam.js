const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  duration: Number, // in minutes
  totalQuestions: Number,
  passingScore: Number,
  startDate: Date,
  endDate: Date,
  questions: [
    {
      type: {
        type: String, // e.g., 'multiple_choice', 'true_false', 'essay'
        required: true
      },
      question: { type: String, required: true },
      options: [String], // for MCQs
      correctAnswer: mongoose.Schema.Types.Mixed, // index or value
      points: Number
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exam', examSchema); 