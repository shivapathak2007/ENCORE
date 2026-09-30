const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/authMiddleware');
const { generateQuiz, getQuizzes } = require('../controllers/quizController');

router.use(protect);

router.post('/', generateQuiz);
router.get('/', getQuizzes);

module.exports = router;
