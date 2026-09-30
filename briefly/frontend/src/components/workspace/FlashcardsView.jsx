import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Loader, Sparkles, ChevronRight, ChevronLeft, RefreshCcw, Layers } from 'lucide-react';

export const FlashcardsView = ({ documentId }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    fetchFlashcards();
  }, [documentId]);

  const fetchFlashcards = async () => {
    try {
      const res = await api.getFlashcards(documentId);
      if (res.data.success) {
        setFlashcards(res.data.data.flashcards);
      }
    } catch (err) {
      setError('Failed to load flashcards');
    } finally {
      setLoading(false);
    }
  };

  const generateFlashcards = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await api.generateFlashcards(documentId, 6);
      if (res.data.success) {
        setFlashcards(res.data.data.flashcards);
        setCurrentIndex(0);
        setIsFlipped(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate flashcards');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1));
    }, 150);
  };

  if (loading) {
    return <div className="p-10 flex justify-center"><Loader className="w-8 h-8 text-[var(--color-primary)] animate-spin" /></div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col min-h-[80vh]">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-primary-text)]">Flashcards</h2>
          <p className="text-[var(--color-secondary-text)] mt-1">Active recall training generated from your document.</p>
        </div>
        <button 
          onClick={generateFlashcards}
          disabled={isGenerating}
          className="px-4 py-2 bg-[var(--color-primary)] text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 flex items-center"
        >
          {isGenerating ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
          Generate New Set
        </button>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl">{error}</div>}

      {flashcards.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed flex-1 flex flex-col justify-center items-center">
          <Layers className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No flashcards generated</h3>
          <p className="text-gray-500 mt-1">Generate a set to start studying.</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl">
            {/* Flashcard Component */}
            <div 
              className="relative w-full aspect-[3/2] cursor-pointer perspective-1000"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className={`w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                {/* Front (Question) */}
                <div className="absolute w-full h-full backface-hidden bg-white border-2 border-indigo-100 rounded-3xl shadow-lg p-10 flex flex-col items-center justify-center text-center">
                  <span className="absolute top-6 left-6 text-indigo-300 font-bold tracking-widest uppercase text-sm">Question</span>
                  <span className="absolute top-6 right-6 text-gray-400 text-sm font-medium">{currentIndex + 1} / {flashcards.length}</span>
                  <h3 className="text-3xl font-bold text-gray-800 leading-tight">{flashcards[currentIndex]?.front || flashcards[currentIndex]?.question || 'No question found'}</h3>
                  <div className="absolute bottom-6 flex items-center text-indigo-400 text-sm font-medium">
                    <RefreshCcw className="w-4 h-4 mr-2" /> Click to reveal answer
                  </div>
                </div>

                {/* Back (Answer) */}
                <div className="absolute w-full h-full backface-hidden bg-[var(--color-primary)] border-2 border-[var(--color-primary)] rounded-3xl shadow-lg p-10 flex flex-col items-center justify-center text-center rotate-y-180">
                  <span className="absolute top-6 left-6 text-indigo-200 font-bold tracking-widest uppercase text-sm">Answer</span>
                  <h3 className="text-2xl font-medium text-white leading-relaxed">{flashcards[currentIndex]?.back || flashcards[currentIndex]?.answer || 'No answer found'}</h3>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center mt-10 px-4">
              <button onClick={handlePrev} className="p-4 bg-white rounded-full shadow-md text-gray-600 hover:text-[var(--color-primary)] hover:scale-110 transition-all">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex space-x-2">
                {flashcards.map((_, i) => (
                  <div key={i} className={`h-2 rounded-full transition-all ${i === currentIndex ? 'w-6 bg-[var(--color-primary)]' : 'w-2 bg-gray-300'}`} />
                ))}
              </div>
              <button onClick={handleNext} className="p-4 bg-white rounded-full shadow-md text-gray-600 hover:text-[var(--color-primary)] hover:scale-110 transition-all">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
