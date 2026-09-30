const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/authMiddleware');
const { generateMindMap, getMindMaps } = require('../controllers/mindMapController');

router.use(protect);

// /api/documents/:id/mindmap
router.post('/', generateMindMap);
router.get('/', getMindMaps);

module.exports = router;
