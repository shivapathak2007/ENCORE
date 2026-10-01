import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Loader, Sparkles, CheckCircle2, XCircle, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const QuizView = ({ documentId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchQuizzes();
  }, [documentId]);

  const fetchQuizzes = async () => {
    try {
      const res = await api.getQuizzes(documentId);
      if (res.data.success) {
        setQuizzes(res.data.data.quizzes);
      }
    } catch (err) {
      setError('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await api.generateQuiz(documentId, 3);
      if (res.data.success) {
        setQuizzes([res.data.data.quiz, ...quizzes]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate quiz');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectAnswer = (questionId, option) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitQuiz = () => {
    let currentScore = 0;
    activeQuiz?.questions?.forEach(q => {
      if (answers[q.id] === q.correct_answer) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setIsSubmitted(true);
  };

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader className="w-8 h-8 text-[var(--color-primary)] animate-spin" /></div>;

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col min-h-[80vh]">
      {!activeQuiz ? (
        <>
          <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-primary-text)]">Quizzes</h2>
              <p className="text-[var(--color-secondary-text)] mt-1">Test your knowledge with AI-generated questions.</p>
            </div>
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl">{error}</div>}

          {quizzes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
              <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No quizzes generated</h3>
              <p className="text-gray-500 mt-1">This document has no quizzes.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizzes.map((quiz, i) => (
                <div key={quiz.id} className="bg-white p-6 rounded-3xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => startQuiz(quiz)}>
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-[var(--color-primary)] mb-4">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-primary-text)] mb-2">{quiz.title}</h3>
                  <p className="text-sm text-[var(--color-secondary-text)]">{quiz.total_questions} Questions • Created {new Date(quiz.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
            <div>
              <button onClick={() => setActiveQuiz(null)} className="text-[var(--color-primary)] text-sm font-semibold hover:underline mb-2 block">
                ← Back to Quizzes
              </button>
              <h2 className="text-2xl font-bold text-[var(--color-primary-text)]">{activeQuiz.title}</h2>
            </div>
            {isSubmitted && (
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="text-right"
              >
                <span className="text-sm text-[var(--color-secondary-text)] uppercase tracking-wider font-bold">Your Score</span>
                <p className={`text-4xl font-extrabold ${score / activeQuiz.total_questions > 0.7 ? 'text-green-500' : 'text-orange-500'}`}>
                  {score} <span className="text-xl text-gray-400">/ {activeQuiz.total_questions}</span>
                </p>
              </motion.div>
            )}
          </div>

          <div className="space-y-10">
            {activeQuiz?.questions?.map((q, index) => (
              <div key={q.id}>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  <span className="text-gray-400 mr-2">{index + 1}.</span> {q.question}
                </h4>
                <div className="space-y-3">
                  {q.options?.map((opt, i) => {
                    const isSelected = answers[q.id] === opt;
                    const isCorrect = opt === q.correct_answer;
                    
                    let optionClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium ";
                    
                    if (!isSubmitted) {
                      optionClass += isSelected 
                        ? "border-[var(--color-primary)] bg-indigo-50 text-[var(--color-primary)]" 
                        : "border-gray-200 bg-white hover:border-indigo-300 text-gray-700";
                    } else {
                      if (isCorrect) {
                        optionClass += "border-green-500 bg-green-50 text-green-700";
                      } else if (isSelected && !isCorrect) {
                        optionClass += "border-red-500 bg-red-50 text-red-700";
                      } else {
                        optionClass += "border-gray-100 bg-gray-50 text-gray-400 opacity-50";
                      }
                    }

                    return (
                      <motion.button 
                        key={i} 
                        whileTap={!isSubmitted ? { scale: 0.98 } : {}}
                        animate={isSubmitted && isCorrect ? { scale: [1, 1.02, 1] } : isSubmitted && isSelected && !isCorrect ? { x: [-5, 5, -5, 5, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        onClick={() => handleSelectAnswer(q.id, opt)}
                        className={optionClass}
                      >
                        <div className="flex justify-between items-center">
                          <span>{opt}</span>
                          {isSubmitted && isCorrect && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 className="w-5 h-5 text-green-500" /></motion.div>}
                          {isSubmitted && isSelected && !isCorrect && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><XCircle className="w-5 h-5 text-red-500" /></motion.div>}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
                {isSubmitted && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 text-sm">
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {!isSubmitted && (
            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
              <button 
                onClick={handleSubmitQuiz}
                disabled={Object.keys(answers).length !== activeQuiz.total_questions}
                className="px-8 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-50"
              >
                Submit Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
