const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');

// Exam CRUD routes
router.post('/', examController.createExam);
router.get('/', examController.getAllExams);
router.get('/recent', examController.getRecentExams);
router.get('/:id', examController.getExamById);
router.put('/:id', examController.updateExam);
router.delete('/:id', examController.deleteExam);
router.get('/:id/stats', examController.getExamStats);
router.get('/next/:id', examController.getNextExam);

module.exports = router; 