const supabase = require('../config/db');

class QuizModel {
  static async createQuiz(quizData) {
    const { data, error } = await supabase
      .from('quizzes')
      .insert([quizData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async createQuestions(questionsData) {
    const { data, error } = await supabase
      .from('quiz_questions')
      .insert(questionsData)
      .select();

    if (error) throw error;
    return data;
  }

  static async findByDocument(documentId) {
    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Fetch questions for each quiz
    for (let quiz of quizzes) {
      const { data: questions } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quiz.id);
      quiz.questions = questions || [];
    }

    return quizzes;
  }
}

module.exports = QuizModel;
