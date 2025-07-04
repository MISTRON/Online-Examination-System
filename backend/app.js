const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Example route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const examRoutes = require('./routes/exam');
app.use('/api/exams', examRoutes);

module.exports = app;
