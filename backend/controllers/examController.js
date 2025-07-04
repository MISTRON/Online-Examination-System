const Exam = require('../models/Exam');
const Result = require('../models/Result');
const User = require('../models/User');

// Create a new exam
exports.createExam = async (req, res) => {
  try {
    const exam = new Exam(req.body);
    await exam.save();
    // Fetch the saved exam to ensure _id and all fields are present
    const savedExam = await Exam.findById(exam._id);
    res.status(201).json({ message: 'Exam created successfully', exam: savedExam });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create exam', error: err.message });
  }
};

// Get all exams
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch exams', error: err.message });
  }
};

// Get exam by ID
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch exam', error: err.message });
  }
};

// Update exam
exports.updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json({ message: 'Exam updated successfully', exam });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update exam', error: err.message });
  }
};

// Delete exam
exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json({ message: 'Exam deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete exam', error: err.message });
  }
};

exports.getExamStats = async (req, res) => {
  try {
    const examId = req.params.id;
    // Get all results for this exam
    const results = await Result.find({ exam: examId });
    // Get total number of students
    const assigned = await User.countDocuments({ role: 'student' });
    const submissions = results.length;
    const passCount = results.filter(r => r.passed).length;
    const avgScore = submissions > 0 ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / submissions) : 0;
    const passRate = submissions > 0 ? Math.round((passCount / submissions) * 100) : 0;
    res.json({ assigned, submissions, passRate, avgScore });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
};

exports.getNextExam = async (req, res) => {
  try {
    const currentExam = await Exam.findById(req.params.id);
    if (!currentExam) return res.status(404).json({ message: 'Current exam not found' });
    // Find the next exam with a startDate after the current exam's startDate
    const nextExam = await Exam.findOne({ startDate: { $gt: currentExam.startDate } }).sort({ startDate: 1 });
    if (!nextExam) return res.status(404).json({ message: 'No next exam found' });
    res.json(nextExam);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch next exam', error: err.message });
  }
};

exports.getRecentExams = async (req, res) => {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    const recentExams = await Exam.find({ createdAt: { $gte: since } }).sort({ createdAt: -1 });
    res.json(recentExams);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recent exams', error: err.message });
  }
}; 