import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, LogOut, User as UserIcon } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 top-0 left-0 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-[var(--color-primary)]" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-indigo-400">
              Briefly
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] transition-colors">
                  Dashboard
                </Link>
                <div className="h-8 w-px bg-gray-200 mx-2"></div>
                <div className="flex items-center space-x-2 text-sm text-[var(--color-primary-text)] font-medium">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[var(--color-primary)]">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-[var(--color-secondary-text)] hover:text-red-500 transition-colors rounded-full hover:bg-gray-100"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] transition-colors">
                  Sign in
                </Link>
                <Link to="/register" className="text-sm font-medium px-4 py-2 rounded-full bg-[var(--color-primary)] text-white hover:bg-indigo-700 transition-colors shadow-sm hover:shadow">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
