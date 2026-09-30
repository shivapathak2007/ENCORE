import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Sparkles, Loader, CheckCircle2 } from 'lucide-react';

export const SummaryView = ({ documentId }) => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSummaries();
  }, [documentId]);

  const fetchSummaries = async () => {
    try {
      const res = await api.getSummaries(documentId);
      if (res.data.success) {
        setSummaries(res.data.data.summaries);
      }
    } catch (err) {
      setError('Failed to load summaries');
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async (type) => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await api.generateSummary(documentId, type);
      if (res.data.success) {
        setSummaries([res.data.data.summary, ...summaries]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate summary');
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return <div className="p-10 flex justify-center"><Loader className="w-8 h-8 text-[var(--color-primary)] animate-spin" /></div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-primary-text)]">Executive Summaries</h2>
          <p className="text-[var(--color-secondary-text)] mt-1">AI-generated distillations of your document.</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => generateSummary('quick')}
            disabled={isGenerating}
            className="px-4 py-2 bg-indigo-50 text-[var(--color-primary)] font-medium rounded-xl hover:bg-indigo-100 transition-colors disabled:opacity-50"
          >
            Quick TL;DR
          </button>
          <button 
            onClick={() => generateSummary('standard')}
            disabled={isGenerating}
            className="px-4 py-2 bg-[var(--color-primary)] text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 flex items-center"
          >
            {isGenerating ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Generate New
          </button>
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl">{error}</div>}

      <div className="space-y-8">
        {summaries.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
            <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No summaries yet</h3>
            <p className="text-gray-500 mt-1">Click "Generate New" to create an AI summary.</p>
          </div>
        ) : (
          summaries.map(summary => {
            const content = summary.content;
            return (
              <div key={summary.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 text-[var(--color-primary)] rounded-full text-xs font-semibold mb-6 uppercase tracking-wider">
                  <span>{summary.summary_type} summary</span>
                  <span className="opacity-50">•</span>
                  <span>{new Date(summary.created_at).toLocaleDateString()}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{content.tldr}</h3>
                
                <div className="mt-8">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Key Takeaways</h4>
                  <ul className="space-y-3">
                    {content.key_takeaways?.map((point, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                        <span className="text-gray-700 leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
                  {content.core_concepts?.map((concept, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
