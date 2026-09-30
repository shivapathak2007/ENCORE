import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, BookOpen, Layers, Zap } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-[var(--color-background)] pt-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 text-[var(--color-primary)] px-4 py-2 rounded-full text-sm font-medium mb-8">
          <SparklesIcon className="w-4 h-4" />
          <span>AI-Powered Knowledge Companion</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[var(--color-primary-text)] mb-6">
          Turn information into <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-purple-600">understanding.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-[var(--color-secondary-text)] mb-10">
          Upload any PDF, DOCX, or text. Briefly analyzes your documents to generate crisp summaries, visual mind maps, flashcards, and quizzes in seconds.
        </p>
          <Link to="/dashboard" className="px-8 py-4 bg-[var(--color-primary)] text-white font-semibold rounded-full hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
            Enter App
          </Link>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<BrainCircuit className="w-8 h-8 text-purple-500" />}
              title="Crisp Summaries"
              description="Get the TL;DR, key takeaways, and core concepts without reading 100 pages."
            />
            <FeatureCard 
              icon={<Layers className="w-8 h-8 text-blue-500" />}
              title="Visual Knowledge"
              description="Automatically generate interactive mind maps and flowcharts from your text."
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-yellow-500" />}
              title="Study Faster"
              description="Instantly create flashcards and multiple-choice quizzes to test your knowledge."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const SparklesIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-8 rounded-3xl bg-[var(--color-background)] border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-[var(--color-primary-text)] mb-3">{title}</h3>
    <p className="text-[var(--color-secondary-text)] leading-relaxed">{description}</p>
  </div>
);
