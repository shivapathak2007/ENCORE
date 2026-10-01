import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Helmet } from 'react-helmet-async';
import { Upload, FileText, Trash2, Loader, PlayCircle } from 'lucide-react';
import api from '../services/api';
import { SummaryView } from '../components/workspace/SummaryView';
import { MindMapView } from '../components/workspace/MindMapView';
import { FlashcardsView } from '../components/workspace/FlashcardsView';
import { QuizView } from '../components/workspace/QuizView';
import { PageTransition } from '../components/common/PageTransition';


export const Landing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(id || null);
  const [uploading, setUploading] = useState(false);
  const [uploadText, setUploadText] = useState('Processing Document...');
  const [activeTab, setActiveTab] = useState('summary');

  // We bypass auth by automatically authenticating as demo on load
  useEffect(() => {
    const initGuest = async () => {
      try {
        let token = localStorage.getItem('token');
        if (!token) {
          const res = await api.demoLogin();
          token = res.data.data.token;
          localStorage.setItem('token', token);
        }
        fetchDocuments();
      } catch (err) {
        console.error("Guest login failed", err);
      }
    };
    initGuest();
  }, []);

  useEffect(() => {
    if (id && id !== selectedDocId) {
      setSelectedDocId(id);
    }
  }, [id]);

  const fetchDocuments = async () => {
    try {
      const res = await api.getDocuments();
      if (res.data.success) {
        setDocuments(res.data.data.documents);
        if (res.data.data.documents.length > 0 && !selectedDocId) {
          const firstDocId = res.data.data.documents[0].id;
          setSelectedDocId(firstDocId);
          navigate(`/workspace/${firstDocId}`, { replace: true });
        }
      }
    } catch (error) {
      console.error('Failed to fetch docs', error);
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    setUploading(true);
    setUploadText('Uploading file...');
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);

    try {
      const res = await api.uploadDocument(formData);
      if (res.data.success) {
        const newDocId = res.data.data.document.id;
        
        setUploadText('Extracting Text & Processing...');
        await api.processDocument(newDocId);
        
        setUploadText('Generating AI Summary...');
        await api.generateSummary(newDocId, 'Detailed');
        
        setUploadText('Creating Mind Map...');
        await api.generateMindMap(newDocId);
        
        setUploadText('Building Flashcards...');
        await api.generateFlashcards(newDocId, 10);
        
        setUploadText('Crafting Knowledge Quiz...');
        await api.generateQuiz(newDocId, 5);

        await fetchDocuments();
        setSelectedDocId(newDocId);
        setActiveTab('summary');
        navigate(`/workspace/${newDocId}`);
      }
    } catch (err) {
      console.error("Upload failed", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to upload document.";
      alert(`Upload failed: ${errorMsg}`);
    } finally {
      setUploading(false);
      setUploadText('Processing Document...');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
      'audio/webm': ['.weba'],
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm']
    },
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this document forever?')) return;
    try {
      await api.deleteDocument(id);
      setDocuments(docs => docs.filter(d => d.id !== id));
      if (selectedDocId === id) setSelectedDocId(null);
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  const renderWorkspace = () => {
    if (!selectedDocId) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-10 h-full border-2 border-dashed border-[var(--color-border)] rounded-3xl m-6 bg-[var(--color-card)]/30 backdrop-blur-sm">
          <div className="w-20 h-20 bg-[var(--color-background)] rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-[var(--color-border)]">
            <FileText className="w-10 h-10 text-[var(--color-secondary-text)]" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Document Selected</h2>
          <p className="text-[var(--color-secondary-text)] max-w-md">Upload a PDF or select an existing document from the left panel to generate beautiful summaries, mind maps, and interactive video scripts.</p>
        </div>
      );
    }

    const tabs = [
      { id: 'summary', label: 'Summary' },
      { id: 'mindmap', label: 'Mind Map' },
      { id: 'flashcards', label: 'Flashcards' },
      { id: 'quiz', label: 'Quizzes' },
      { id: 'video', label: 'AI Video Script' },
    ];

    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden p-6">
        {/* Futuristic Tab Bar */}
        <div className="flex space-x-2 bg-[var(--color-card)] p-2 rounded-2xl border border-[var(--color-border)] mb-6 overflow-x-auto shadow-sm">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id 
                ? 'bg-[var(--color-primary)] text-white shadow-md' 
                : 'text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] hover:bg-[var(--color-background)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area with AnimatePresence */}
        <div className="flex-1 overflow-y-auto rounded-3xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-xl relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + selectedDocId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {activeTab === 'summary' && <SummaryView documentId={selectedDocId} />}
              {activeTab === 'mindmap' && <MindMapView documentId={selectedDocId} />}
              {activeTab === 'flashcards' && <FlashcardsView documentId={selectedDocId} />}
              {activeTab === 'quiz' && <QuizView documentId={selectedDocId} />}
              {activeTab === 'video' && <VideoSummaryView documentId={selectedDocId} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <PageTransition>
      <Helmet>
        <title>{id ? 'Workspace - ENCORE' : 'Dashboard - ENCORE'}</title>
      </Helmet>
      <div className="min-h-screen pt-16 flex flex-col md:flex-row overflow-hidden bg-[var(--color-background)] transition-colors duration-300">
        
        {/* Left Panel (Like VYRA/Prism) */}
        <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col p-8 md:p-12 border-r border-[var(--color-border)] overflow-y-auto relative z-10">
          
          <div className="inline-flex items-center space-x-2 bg-indigo-50/10 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8 w-max">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span>Instant Document Intelligence</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--color-primary-text)] leading-tight mb-6">
            Summarize <br/>anything in <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">seconds.</span>
          </h1>

          <p className="text-lg text-[var(--color-secondary-text)] mb-10 max-w-md">
            Drop a PDF, DOCX or TXT. Briefly reads it, distills the key points, and hands you a clean summary — ready to copy, download, or watch.
          </p>

          {/* Epic Drag & Drop Zone */}
          <div 
            {...getRootProps()} 
            className={`w-full p-10 rounded-[2rem] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer mb-10 relative overflow-hidden group
              ${isDragActive ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 scale-[1.02]' : 'border-[var(--color-border)] bg-[var(--color-card)]/50 hover:bg-[var(--color-card)] hover:border-indigo-400/50'}
            `}
          >
            <input {...getInputProps()} />
            
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              {uploading ? (
                <Loader className="w-8 h-8 text-white animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-white" />
              )}
            </div>
            
            <h3 className="text-xl font-bold mb-2 transition-all">
              {uploading ? uploadText : 'Drag & drop your file'}
            </h3>
            <p className="text-[var(--color-secondary-text)] text-sm mb-6">PDF, DOCX, TXT, MP3, MP4 — up to 50 MB</p>
            
            {!uploading && (
              <button className="px-6 py-2.5 rounded-full bg-[var(--color-primary-text)] text-[var(--color-background)] font-semibold text-sm hover:scale-105 transition-transform shadow-md">
                Browse files
              </button>
            )}
          </div>

          {/* Recent Files Area */}
          <div className="mt-auto">
            <h4 className="text-sm font-bold text-[var(--color-secondary-text)] uppercase tracking-wider mb-4">Your Library</h4>
            <div className="space-y-3">
              {documents.length === 0 && (
                <p className="text-sm text-[var(--color-secondary-text)] italic">No documents yet.</p>
              )}
              {documents.map(doc => (
                <div 
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocId(doc.id);
                    navigate(`/workspace/${doc.id}`);
                  }}
                  className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${
                    selectedDocId === doc.id 
                    ? 'bg-[var(--color-card)] border-[var(--color-primary)] shadow-md' 
                    : 'bg-[var(--color-card)]/40 border-[var(--color-border)] hover:bg-[var(--color-card)]'
                  }`}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className={`p-2 rounded-lg ${selectedDocId === doc.id ? 'bg-[var(--color-primary)]/10' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      <FileText className={`w-5 h-5 ${selectedDocId === doc.id ? 'text-[var(--color-primary)]' : 'text-gray-500'}`} />
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-sm text-[var(--color-primary-text)] truncate">{doc.title}</p>
                      <p className="text-xs text-[var(--color-secondary-text)]">{doc.status}</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, doc.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors z-20 relative"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Panel (Workspace) */}
        <div className="w-full md:w-[55%] lg:w-[60%] h-[calc(100vh-4rem)] relative">
          {renderWorkspace()}
        </div>

      </div>
    </PageTransition>
  );
};

// Extremely Cool "Video Summary" Component
const VideoSummaryView = ({ documentId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  // Fallback fake generation for pure frontend experience if no backend endpoint exists
  const generateVideoScript = async () => {
    setLoading(true);
    try {
      // Re-use summary endpoint or generate fake script
      const res = await api.getSummaries(documentId);
      if (res.data.success && res.data.data.summaries.length > 0) {
        const text = res.data.data.summaries[0].content;
        // Prompt Engineering format applied locally
        setScript(`Hello! Welcome to your interactive brief. Let's dive in. Here is the main takeaway: ${text.substring(0, 300)}... And that wraps up the core insights. Thanks for watching!`);
      } else {
        setScript("Welcome! I am analyzing your document now. Please generate a summary first so I can read it to you!");
      }
    } catch (err) {
      setScript("Welcome to the video summary! I'm an AI avatar ready to present your document.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateVideoScript();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [documentId]);

  const togglePlay = async () => {
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setLoading(true);
      try {
        const res = await api.generateTTS(documentId || 'demo', script);
        if (res.data.success && res.data.data.audio) {
          const audio = new Audio("data:audio/mp3;base64," + res.data.data.audio);
          audioRef.current = audio;
          audio.onended = () => setIsPlaying(false);
          audio.play();
          setIsPlaying(true);
        }
      } catch (err) {
        console.error("TTS Failed:", err);
        alert("Failed to load real AI voice. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-black/5 rounded-3xl relative overflow-hidden">
      {/* Cool Pulsing Orb Avatar */}
      <div className="relative mb-12 flex justify-center items-center">
        {isPlaying && (
          <>
            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute w-40 h-40 bg-indigo-500 rounded-full blur-xl"></motion.div>
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0, 0.8] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="absolute w-32 h-32 bg-purple-500 rounded-full blur-lg"></motion.div>
          </>
        )}
        <div className={`w-32 h-32 rounded-full z-10 flex items-center justify-center shadow-2xl transition-all duration-300 ${isPlaying ? 'bg-gradient-to-tr from-indigo-500 to-cyan-400 scale-110' : 'bg-gradient-to-tr from-gray-700 to-gray-900'}`}>
           <div className={`w-24 h-24 rounded-full border-4 border-white/20 flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
             <div className="w-8 h-8 bg-white rounded-full shadow-[0_0_20px_white]"></div>
           </div>
        </div>
      </div>

      <h3 className="text-3xl font-extrabold text-[var(--color-primary-text)] mb-4 text-center">AI Video Presenter</h3>
      <p className="text-lg text-[var(--color-secondary-text)] text-center max-w-md mb-8">
        Listen to an interactive, podcast-style presentation of your document's core insights.
      </p>

      <button 
        onClick={togglePlay}
        disabled={loading}
        className={`flex items-center space-x-3 px-8 py-4 rounded-full font-bold text-white transition-all transform hover:scale-105 shadow-xl ${
          isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-[var(--color-primary)] hover:bg-indigo-600'
        }`}
      >
        <PlayCircle className={`w-6 h-6 ${isPlaying ? 'animate-pulse' : ''}`} />
        <span>{loading ? 'Preparing Script...' : isPlaying ? 'Stop Presenting' : 'Play Video Summary'}</span>
      </button>

      {/* Captions Box */}
      {isPlaying && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-8 left-8 right-8 bg-black/80 backdrop-blur-md rounded-2xl p-6 text-white text-center border border-white/10"
        >
          <p className="text-lg font-medium leading-relaxed italic">"{script}"</p>
        </motion.div>
      )}
    </div>
  );
};
