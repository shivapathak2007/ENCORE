const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/authMiddleware');
const { generateFlashcards, getFlashcards } = require('../controllers/flashcardController');

router.use(protect);

router.post('/', generateFlashcards);
router.get('/', getFlashcards);

module.exports = router;
