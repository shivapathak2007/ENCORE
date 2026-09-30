import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { FileText, Map, Layers, CheckSquare, MessageSquare, ChevronLeft, Loader } from 'lucide-react';
import { SummaryView } from '../components/workspace/SummaryView';
import { MindMapView } from '../components/workspace/MindMapView';
import { FlashcardsView } from '../components/workspace/FlashcardsView';
import { QuizView } from '../components/workspace/QuizView';
import { QuizView } from '../components/workspace/QuizView';
import { QAChatView } from '../components/workspace/QAChatView';
import { PageTransition } from '../components/common/PageTransition';

export const DocumentWorkspace = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const res = await api.getDocument(id);
      if (res.data.success) {
        setDocument(res.data.data.document);
      }
    } catch (error) {
      console.error('Failed to fetch document', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-20 flex items-center justify-center bg-[var(--color-background)]">
          <Loader className="w-10 h-10 text-[var(--color-primary)] animate-spin" />
        </div>
      </PageTransition>
    );
  }

  if (!document) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-[var(--color-background)]">
          <h2 className="text-2xl font-bold mb-4">Document not found</h2>
          <Link to="/dashboard" className="text-[var(--color-primary)] hover:underline">Back to Dashboard</Link>
        </div>
      </PageTransition>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'summary': return <SummaryView documentId={id} />;
      case 'mindmap': return <MindMapView documentId={id} />;
      case 'flashcards': return <FlashcardsView documentId={id} />;
      case 'quiz': return <QuizView documentId={id} />;
      case 'chat': return <QAChatView documentId={id} />;
      default: return <SummaryView documentId={id} />;
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[var(--color-background)] pt-16 flex flex-col transition-colors duration-300">
        {/* Workspace Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between z-10">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="p-2 bg-gray-50 rounded-full text-gray-500 hover:text-[var(--color-primary)] transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[var(--color-primary-text)] truncate max-w-md">{document.title}</h1>
            <p className="text-xs text-[var(--color-secondary-text)]">{document.status}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Nav */}
        <div className="w-64 bg-white border-r border-gray-200 p-4 hidden md:flex flex-col space-y-2">
          <TabButton active={activeTab === 'summary'} onClick={() => setActiveTab('summary')} icon={<FileText className="w-5 h-5" />} label="Executive Summary" />
          <TabButton active={activeTab === 'mindmap'} onClick={() => setActiveTab('mindmap')} icon={<Map className="w-5 h-5" />} label="Mind Map" />
          <TabButton active={activeTab === 'flashcards'} onClick={() => setActiveTab('flashcards')} icon={<Layers className="w-5 h-5" />} label="Flashcards" />
          <TabButton active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} icon={<CheckSquare className="w-5 h-5" />} label="Quizzes" />
          <TabButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare className="w-5 h-5" />} label="Ask Document" />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-gray-50/50 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
      </div>
    </PageTransition>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all ${
      active 
        ? 'bg-indigo-50 text-[var(--color-primary)] font-semibold shadow-sm' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);
