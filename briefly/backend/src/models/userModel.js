const supabase = require('../config/db');

class UserModel {
  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, account_type, preferred_language, explanation_style, created_at')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  }

  static async create(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select('id, name, email, account_type, preferred_language, explanation_style, created_at')
      .single();
      
    if (error) throw error;
    return data;
  }
}

module.exports = UserModel;
