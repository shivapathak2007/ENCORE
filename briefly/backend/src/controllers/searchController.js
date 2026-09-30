const supabase = require('../config/db');

const searchKnowledge = async (req, res, next) => {
  try {
    const { q } = req.query;
    const userId = req.user.id;

    if (!q) {
      return res.status(400).json({ success: false, message: 'Query parameter q is required' });
    }

    // A simple implementation of searching documents by title.
    // In a full production app, this would use pg_search or a vector DB for semantic search across chunks.
    const { data: documents, error } = await supabase
      .from('documents')
      .select('id, title, status, created_at')
      .eq('user_id', userId)
      .ilike('title', `%${q}%`);

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: {
        documents: documents || []
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchKnowledge
};
