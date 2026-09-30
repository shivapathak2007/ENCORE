const QuizModel = require('../models/quizModel');
const ChunkModel = require('../models/chunkModel');
const aiService = require('../services/aiService');

const generateQuiz = async (req, res, next) => {
  try {
    const documentId = req.params.id;
    const { count = 5 } = req.body;

    const chunks = await ChunkModel.findByDocument(documentId);
    if (!chunks || chunks.length === 0) {
      return res.status(400).json({ success: false, message: 'Document has no content. Process it first.' });
    }

    const combinedText = chunks.map(c => c.content).join('\n\n').substring(0, 100000); 

    const aiResult = await aiService.generateQuiz(combinedText, count);
    
    if (!aiResult.questions || !Array.isArray(aiResult.questions)) {
      throw new Error('AI returned malformed quiz data');
    }

    // Save Quiz Metadata
    const newQuiz = await QuizModel.createQuiz({
      document_id: documentId,
      user_id: req.user.id,
      title: aiResult.title || 'Generated Quiz',
      total_questions: aiResult.questions.length
    });

    // Save Questions
    const questionsData = aiResult.questions.map(q => ({
      quiz_id: newQuiz.id,
      question: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation || null
    }));

    const savedQuestions = await QuizModel.createQuestions(questionsData);
    newQuiz.questions = savedQuestions;

    res.status(201).json({
      success: true,
      message: 'Quiz generated successfully',
      data: { quiz: newQuiz }
    });
  } catch (error) {
    next(error);
  }
};

const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await QuizModel.findByDocument(req.params.id);
    res.status(200).json({
      success: true,
      data: { quizzes }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateQuiz,
  getQuizzes
};
