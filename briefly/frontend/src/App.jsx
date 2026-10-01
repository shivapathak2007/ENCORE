import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';

const Landing = lazy(() => import('./pages/Landing').then(module => ({ default: module.Landing })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('./pages/Register').then(module => ({ default: module.Register })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Upload = lazy(() => import('./pages/Upload').then(module => ({ default: module.Upload })));
const DocumentWorkspace = lazy(() => import('./pages/DocumentWorkspace').then(module => ({ default: module.DocumentWorkspace })));

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-primary-text)] font-sans">
            <Navbar />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] text-[var(--color-primary)] animate-pulse font-bold text-2xl">Loading ENCORE...</div>}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
                <Route path="/dashboard/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
                <Route path="/workspace/:id" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
