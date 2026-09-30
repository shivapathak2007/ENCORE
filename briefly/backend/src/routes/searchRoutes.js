const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { searchKnowledge } = require('../controllers/searchController');

router.use(protect);

router.get('/', searchKnowledge);

module.exports = router;
