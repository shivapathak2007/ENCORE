const FlashcardModel = require('../models/flashcardModel');
const ChunkModel = require('../models/chunkModel');
const aiService = require('../services/aiService');

const generateFlashcards = async (req, res, next) => {
  try {
    const documentId = req.params.id;
    const { count = 10 } = req.body;

    const chunks = await ChunkModel.findByDocument(documentId);
    if (!chunks || chunks.length === 0) {
      return res.status(400).json({ success: false, message: 'Document has no content. Process it first.' });
    }

    const combinedText = chunks.map(c => c.content).join('\n\n').substring(0, 100000); 

    const aiResult = await aiService.generateFlashcards(combinedText, count);
    
    if (!aiResult.flashcards || !Array.isArray(aiResult.flashcards)) {
      throw new Error('AI returned malformed flashcard data');
    }

    const flashcardsData = aiResult.flashcards.map(fc => ({
      document_id: documentId,
      user_id: req.user.id,
      question: fc.front || fc.question,
      answer: fc.back || fc.answer,
      source_reference: fc.source || null
    }));

    const newFlashcards = await FlashcardModel.createMultiple(flashcardsData);

    res.status(201).json({
      success: true,
      message: 'Flashcards generated successfully',
      data: { flashcards: newFlashcards }
    });
  } catch (error) {
    next(error);
  }
};

const getFlashcards = async (req, res, next) => {
  try {
    const flashcards = await FlashcardModel.findByDocument(req.params.id);
    res.status(200).json({
      success: true,
      data: { flashcards }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateFlashcards,
  getFlashcards
};
