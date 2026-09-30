const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/authMiddleware');
const { generateSummary, getSummaries } = require('../controllers/summaryController');

router.use(protect);

// /api/documents/:id/summary
router.post('/', generateSummary);
router.get('/', getSummaries);

module.exports = router;
