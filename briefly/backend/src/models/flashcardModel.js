const supabase = require('../config/db');

class FlashcardModel {
  static async createMultiple(flashcardsData) {
    const { data, error } = await supabase
      .from('flashcards')
      .insert(flashcardsData)
      .select();

    if (error) throw error;
    return data;
  }

  static async findByDocument(documentId) {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }
}

module.exports = FlashcardModel;
