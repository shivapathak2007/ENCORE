const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { 
  uploadDocument, 
  getDocuments, 
  getDocument, 
  deleteDocument,
  processDocument,
  generateTTS
} = require('../controllers/documentController');

const summaryRoutes = require('./summaryRoutes');
const mindMapRoutes = require('./mindMapRoutes');
const flashcardRoutes = require('./flashcardRoutes');
const quizRoutes = require('./quizRoutes');

const { askQuestion } = require('../controllers/qaController');

// Protect all document routes
router.use(protect);

router.post('/', upload.single('file'), uploadDocument);
router.get('/', getDocuments);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);
router.post('/:id/process', processDocument);
router.post('/:id/ask', askQuestion);
router.post('/:id/tts', generateTTS);

// Mount nested routes
router.use('/:id/summary', summaryRoutes);
router.use('/:id/mindmap', mindMapRoutes);
router.use('/:id/flashcards', flashcardRoutes);
router.use('/:id/quiz', quizRoutes);

module.exports = router;
