import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Upload as UploadIcon, File, X, AlertCircle } from 'lucide-react';

export const Upload = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    setError(null);
    if (!selectedFile) return;

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain', 'text/markdown'];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload a PDF, DOCX, PPTX, or TXT file.');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('File is too large. Maximum size is 50MB.');
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Upload the file
      const uploadRes = await api.uploadDocument(formData);
      const documentId = uploadRes.data.data.document.id;
      
      // 2. Start Processing
      setIsUploading(false);
      setIsProcessing(true);
      await api.processDocument(documentId);

      // 3. Navigate to workspace
      navigate(`/workspace/${documentId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong during upload.');
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] pt-24 px-4 pb-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--color-primary-text)] mb-2">Upload Document</h1>
        <p className="text-[var(--color-secondary-text)] mb-8">Turn your large documents into structured knowledge.</p>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 flex items-start rounded-r-xl">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {!file ? (
            <div 
              className="border-2 border-dashed border-gray-200 rounded-[2rem] p-12 text-center hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <UploadIcon className="w-10 h-10 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-primary-text)] mb-2">Click or drag file to upload</h3>
              <p className="text-[var(--color-secondary-text)]">Supports PDF, DOCX, PPTX, TXT (Max 50MB)</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".pdf,.docx,.pptx,.txt,.md"
              />
            </div>
          ) : (
            <div className="p-8 border border-gray-200 rounded-[2rem] bg-gray-50">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-50 text-[var(--color-primary)] rounded-lg flex items-center justify-center">
                    <File className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-primary-text)] truncate max-w-[200px] sm:max-w-md">{file.name}</p>
                    <p className="text-sm text-[var(--color-secondary-text)]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                {!isUploading && !isProcessing && (
                  <button onClick={() => setFile(null)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {(isUploading || isProcessing) && (
                <div className="mb-6 space-y-3">
                  <div className="flex justify-between text-sm font-medium text-[var(--color-primary-text)]">
                    <span>{isProcessing ? 'Processing document (Extracting text & chunks)...' : 'Uploading to secure storage...'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-[var(--color-primary)] h-2 rounded-full animate-pulse w-full"></div>
                  </div>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={isUploading || isProcessing}
                className="w-full py-4 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-70 flex justify-center items-center"
              >
                {isProcessing ? 'Analyzing...' : isUploading ? 'Uploading...' : 'Upload & Process'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
