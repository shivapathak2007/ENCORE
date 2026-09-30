import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { Upload, FileText, Activity, Layers, Clock, Search, MoreVertical, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/common/PageTransition';

export const Dashboard = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await api.getDocuments();
      if (res.data.success) {
        setDocuments(res.data.data.documents);
      }
    } catch (error) {
      console.error('Failed to fetch documents', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) return;
    
    try {
      const res = await api.deleteDocument(id);
      if (res.data.success) {
        setDocuments(documents.filter(doc => doc.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete document', error);
      alert('Failed to delete document');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Processing': return 'bg-blue-100 text-blue-700 animate-pulse';
      case 'Failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[var(--color-background)] pt-20 pb-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-primary-text)]">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-[var(--color-secondary-text)] mt-1">Here is what's happening with your knowledge base.</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
              <Search className="w-4 h-4 mr-2" />
              Search
            </button>
            <Link to="/dashboard/upload" className="flex items-center px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard icon={<FileText className="w-6 h-6 text-blue-500" />} title="Total Documents" value={documents.length} />
          <StatCard icon={<Layers className="w-6 h-6 text-purple-500" />} title="Knowledge Maps" value="0" />
          <StatCard icon={<Activity className="w-6 h-6 text-green-500" />} title="Quizzes Taken" value="0" />
          <StatCard icon={<Clock className="w-6 h-6 text-orange-500" />} title="Study Hours" value="0h" />
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-[var(--color-primary-text)] mb-6">Recent Documents</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
            </div>
          ) : documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <Link to={`/workspace/${doc.id}`} key={doc.id} className="group p-5 border border-gray-100 rounded-2xl hover:shadow-lg transition-all duration-300 hover:border-indigo-100 relative bg-white block">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <button 
                      onClick={(e) => handleDelete(e, doc.id)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 z-10"
                      title="Delete Document"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <h3 className="font-bold text-[var(--color-primary-text)] truncate mb-1">{doc.title}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-[var(--color-secondary-text)] font-medium">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-primary-text)]">No documents yet</h3>
              <p className="text-[var(--color-secondary-text)] mt-1 mb-6">Upload your first document and turn it into clear, useful knowledge.</p>
              <Link to="/dashboard/upload" className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white rounded-full hover:bg-indigo-700 transition-colors shadow-md">
                <Upload className="w-5 h-5 mr-2" />
                Upload Document
              </Link>
            </div>
          )}
        </div>
        </div>
      </div>
    </PageTransition>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
    <div className="p-3 bg-gray-50 rounded-xl">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-[var(--color-secondary-text)]">{title}</p>
      <h4 className="text-2xl font-bold text-[var(--color-primary-text)]">{value}</h4>
    </div>
  </div>
);
