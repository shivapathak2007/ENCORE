const { SummaryModel } = require('../models/analysisModel');
const ChunkModel = require('../models/chunkModel');
const aiService = require('../services/aiService');

const generateSummary = async (req, res, next) => {
  try {
    const documentId = req.params.id;
    const { type = 'standard' } = req.body; // quick, standard, detailed

    // Fetch document chunks
    const chunks = await ChunkModel.findByDocument(documentId);
    
    if (!chunks || chunks.length === 0) {
      return res.status(400).json({ success: false, message: 'Document has no content to summarize. Please process it first.' });
    }

    // Combine chunk text (for massive documents, we'd need a map-reduce summarization, but we'll concatenate up to model limits for now)
    const combinedText = chunks.map(c => c.content).join('\n\n').substring(0, 100000); // Limit context slightly for safety

    // Generate Summary via AI
    const summaryResult = await aiService.generateSummary(combinedText, type);

    // Save Summary to DB
    const newSummary = await SummaryModel.create({
      document_id: documentId,
      user_id: req.user.id,
      summary_type: type,
      content: summaryResult,
      word_count: JSON.stringify(summaryResult).split(' ').length
    });

    res.status(201).json({
      success: true,
      message: 'Summary generated successfully',
      data: { summary: newSummary }
    });
  } catch (error) {
    next(error);
  }
};

const getSummaries = async (req, res, next) => {
  try {
    const documentId = req.params.id;
    const summaries = await SummaryModel.findByDocument(documentId);
    
    res.status(200).json({
      success: true,
      data: { summaries }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateSummary,
  getSummaries
};
