const supabase = require('../config/db');

class ChunkModel {
  static async createMultiple(chunks) {
    const { data, error } = await supabase
      .from('document_chunks')
      .insert(chunks)
      .select();

    if (error) throw error;
    return data;
  }

  static async findByDocument(documentId) {
    const { data, error } = await supabase
      .from('document_chunks')
      .select('*')
      .eq('document_id', documentId)
      .order('chunk_index', { ascending: true });

    if (error) throw error;
    return data;
  }
}

module.exports = ChunkModel;
