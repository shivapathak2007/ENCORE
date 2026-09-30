const { MindMapModel } = require('../models/analysisModel');
const ChunkModel = require('../models/chunkModel');
const aiService = require('../services/aiService');

const generateMindMap = async (req, res, next) => {
  try {
    const documentId = req.params.id;

    // Fetch document chunks
    const chunks = await ChunkModel.findByDocument(documentId);
    
    if (!chunks || chunks.length === 0) {
      return res.status(400).json({ success: false, message: 'Document has no content. Please process it first.' });
    }

    const combinedText = chunks.map(c => c.content).join('\n\n').substring(0, 100000); 

    // Generate Mind Map via AI
    const mindMapResult = await aiService.generateMindMap(combinedText);

    // Save to DB
    const newMindMap = await MindMapModel.create({
      document_id: documentId,
      user_id: req.user.id,
      title: mindMapResult.title || 'Knowledge Map',
      nodes_json: mindMapResult.nodes || [],
      edges_json: mindMapResult.edges || []
    });

    res.status(201).json({
      success: true,
      message: 'Mind map generated successfully',
      data: { mindMap: newMindMap }
    });
  } catch (error) {
    next(error);
  }
};

const getMindMaps = async (req, res, next) => {
  try {
    const documentId = req.params.id;
    const mindMaps = await MindMapModel.findByDocument(documentId);
    
    res.status(200).json({
      success: true,
      data: { mindMaps }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateMindMap,
  getMindMaps
};
