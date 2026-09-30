const supabase = require('../config/db');

class SummaryModel {
  static async create(summaryData) {
    const { data, error } = await supabase
      .from('summaries')
      .insert([summaryData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findByDocument(documentId) {
    const { data, error } = await supabase
      .from('summaries')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}

class MindMapModel {
  static async create(mindMapData) {
    const { data, error } = await supabase
      .from('mind_maps')
      .insert([mindMapData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findByDocument(documentId) {
    const { data, error } = await supabase
      .from('mind_maps')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}

module.exports = {
  SummaryModel,
  MindMapModel
};
