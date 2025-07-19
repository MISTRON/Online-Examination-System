const express = require('express');
const router = express.Router();
const { register, login, getAllUsers, deleteUser, saveResult, getUserResults, getAllResults, forgotPassword } = require('../controllers/authController');
const { deleteResult } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.post('/results', saveResult);
router.get('/results/user/:userId', getUserResults);
router.get('/results', getAllResults);
router.delete('/results/:id', deleteResult);

module.exports = router; 