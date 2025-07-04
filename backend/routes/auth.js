const express = require('express');
const router = express.Router();
const { register, login, getAllUsers, deleteUser, saveResult, getUserResults, getAllResults } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.post('/results', saveResult);
router.get('/results/user/:userId', getUserResults);
router.get('/results', getAllResults);

module.exports = router; 