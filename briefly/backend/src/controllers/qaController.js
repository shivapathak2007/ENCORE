const ChunkModel = require('../models/chunkModel');
const aiService = require('../services/aiService');
const supabase = require('../config/db');

const askQuestion = async (req, res, next) => {
  try {
    const documentId = req.params.id;
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }

    const chunks = await ChunkModel.findByDocument(documentId);
    if (!chunks || chunks.length === 0) {
      return res.status(400).json({ success: false, message: 'Document has no content. Process it first.' });
    }

    const combinedText = chunks.map(c => c.content).join('\n\n').substring(0, 100000); 

    const answer = await aiService.answerQuestion(combinedText, question);

    // Optionally save to QA History table (Phase 17 extension)
    await supabase.from('qa_history').insert([{
      document_id: documentId,
      user_id: req.user.id,
      question: question,
      answer: answer
    }]);

    res.status(200).json({
      success: true,
      data: { answer }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  askQuestion
};
