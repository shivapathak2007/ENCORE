import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Upload } from './pages/Upload';
import { DocumentWorkspace } from './pages/DocumentWorkspace';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-primary-text)] font-sans">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
            <Route path="/dashboard/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
            <Route path="/workspace/:id" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
