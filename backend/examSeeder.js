const mongoose = require('mongoose');
const Exam = require('./models/Exam');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam';

const exams = [
  {
    title: 'Mathematics Basics',
    description: 'Test your fundamental math skills.',
    duration: 30,
    totalQuestions: 5,
    passingScore: 3,
    startDate: new Date(Date.now() - 1000 * 60 * 60),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    questions: [
      {
        type: 'multiple_choice',
        question: 'What is 7 + 5?',
        options: ['10', '11', '12', '13'],
        correctAnswer: 2,
        points: 1
      },
      {
        type: 'multiple_choice',
        question: 'What is the square root of 81?',
        options: ['7', '8', '9', '10'],
        correctAnswer: 2,
        points: 1
      },
      {
        type: 'true_false',
        question: 'Is 17 a prime number?',
        options: [],
        correctAnswer: true,
        points: 1
      },
      {
        type: 'essay',
        question: 'Explain the Pythagorean theorem.',
        options: [],
        correctAnswer: '',
        points: 1
      },
      {
        type: 'essay',
        question: 'Solve for x: 2x + 3 = 11',
        options: [],
        correctAnswer: 'x = 4',
        points: 1
      }
    ]
  },
  {
    title: 'Computer Fundamentals',
    description: 'Basic concepts of computers and IT.',
    duration: 25,
    totalQuestions: 5,
    passingScore: 3,
    startDate: new Date(Date.now() - 1000 * 60 * 60),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    questions: [
      {
        type: 'multiple_choice',
        question: 'What does CPU stand for?',
        options: ['Central Process Unit', 'Central Processing Unit', 'Computer Personal Unit', 'Central Processor Utility'],
        correctAnswer: 1,
        points: 1
      },
      {
        type: 'multiple_choice',
        question: 'Which of the following is NOT an input device?',
        options: ['Keyboard', 'Mouse', 'Monitor', 'Scanner'],
        correctAnswer: 2,
        points: 1
      },
      {
        type: 'true_false',
        question: 'RAM is a type of permanent memory.',
        options: [],
        correctAnswer: false,
        points: 1
      },
      {
        type: 'essay',
        question: 'What is an operating system? Give examples.',
        options: [],
        correctAnswer: '',
        points: 1
      },
      {
        type: 'essay',
        question: 'Explain the difference between hardware and software.',
        options: [],
        correctAnswer: '',
        points: 1
      }
    ]
  },
  {
    title: 'Web Development',
    description: 'Covers HTML, CSS, and JavaScript basics.',
    duration: 30,
    totalQuestions: 5,
    passingScore: 3,
    startDate: new Date(Date.now() - 1000 * 60 * 60),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    questions: [
      {
        type: 'multiple_choice',
        question: 'Which tag is used for the largest heading in HTML?',
        options: ['<h1>', '<h6>', '<head>', '<header>'],
        correctAnswer: 0,
        points: 1
      },
      {
        type: 'multiple_choice',
        question: 'Which property is used to change text color in CSS?',
        options: ['font-color', 'text-color', 'color', 'background-color'],
        correctAnswer: 2,
        points: 1
      },
      {
        type: 'true_false',
        question: 'JavaScript can be used for both frontend and backend development.',
        options: [],
        correctAnswer: true,
        points: 1
      },
      {
        type: 'essay',
        question: 'Write a simple HTML page structure.',
        options: [],
        correctAnswer: '',
        points: 1
      },
      {
        type: 'essay',
        question: 'Explain the difference between class and id in CSS.',
        options: [],
        correctAnswer: '',
        points: 1
      }
    ]
  },
  {
    title: 'Data Structures & Algorithms',
    description: 'Test your knowledge of DSA basics.',
    duration: 35,
    totalQuestions: 5,
    passingScore: 3,
    startDate: new Date(Date.now() - 1000 * 60 * 60),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    questions: [
      {
        type: 'multiple_choice',
        question: 'Which data structure uses FIFO order?',
        options: ['Stack', 'Queue', 'Tree', 'Graph'],
        correctAnswer: 1,
        points: 1
      },
      {
        type: 'multiple_choice',
        question: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'],
        correctAnswer: 1,
        points: 1
      },
      {
        type: 'true_false',
        question: 'A linked list allows random access of elements.',
        options: [],
        correctAnswer: false,
        points: 1
      },
      {
        type: 'essay',
        question: 'Explain the difference between stack and queue.',
        options: [],
        correctAnswer: '',
        points: 1
      },
      {
        type: 'essay',
        question: 'Write a function to reverse a string in any language.',
        options: [],
        correctAnswer: '',
        points: 1
      }
    ]
  },
  {
    title: 'General Knowledge',
    description: 'A mix of questions from various fields.',
    duration: 20,
    totalQuestions: 5,
    passingScore: 3,
    startDate: new Date(Date.now() - 1000 * 60 * 60),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    questions: [
      {
        type: 'multiple_choice',
        question: 'Who is known as the father of computers?',
        options: ['Charles Babbage', 'Alan Turing', 'Bill Gates', 'Steve Jobs'],
        correctAnswer: 0,
        points: 1
      },
      {
        type: 'multiple_choice',
        question: 'Which planet is known as the Red Planet?',
        options: ['Earth', 'Venus', 'Mars', 'Jupiter'],
        correctAnswer: 2,
        points: 1
      },
      {
        type: 'true_false',
        question: 'The Great Wall of China is visible from space.',
        options: [],
        correctAnswer: false,
        points: 1
      },
      {
        type: 'essay',
        question: 'Name any two Nobel Prize categories.',
        options: [],
        correctAnswer: '',
        points: 1
      },
      {
        type: 'essay',
        question: 'Describe the process of photosynthesis.',
        options: [],
        correctAnswer: '',
        points: 1
      }
    ]
  }
];

async function seedExams() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await Exam.deleteMany({});
  await Exam.insertMany(exams);
  console.log('Sample exams inserted!');
  await mongoose.disconnect();
}

seedExams().catch(err => {
  console.error(err);
  process.exit(1);
}); 