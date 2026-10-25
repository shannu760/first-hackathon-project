import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import RecommendationsPage from './pages/RecommendationsPage';
import SchemesPage from './pages/SchemesPage';
import SchemeDetailPage from './pages/SchemeDetailPage';
import InternshipsPage from './pages/InternshipsPage';
import InternshipDetailPage from './pages/InternshipDetailPage';
import SkillsPage from './pages/SkillsPage';
import CoursesPage from './pages/CoursesPage';
import CopilotPage from './pages/CopilotPage';
import ResumePage from './pages/ResumePage';
import ApplicationsPage from './pages/ApplicationsPage';
import NotificationsPage from './pages/NotificationsPage';
import OnboardingPage from './pages/OnboardingPage';
import { LoginPage, SignupPage, PricingPage, PrivacyPage, TermsPage } from './pages/AuthPages';
import SaarathiAiAssistant from './components/common/SaarathiAiAssistant';

function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <div className="min-h-screen bg-midnight-950 flex items-center justify-center text-slate-400">Verifying session...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="relative min-h-screen bg-midnight-950 text-slate-100 font-body selection:bg-wine-600 selection:text-white">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage onOpenAiAssistant={() => setAiAssistantOpen(true)} />} />
              <Route path="/login" element={<LoginPage onOpenAiAssistant={() => setAiAssistantOpen(true)} />} />
              <Route path="/signup" element={<SignupPage onOpenAiAssistant={() => setAiAssistantOpen(true)} />} />
              <Route path="/pricing" element={<PricingPage onOpenAiAssistant={() => setAiAssistantOpen(true)} />} />
              <Route path="/privacy" element={<PrivacyPage onOpenAiAssistant={() => setAiAssistantOpen(true)} />} />
              <Route path="/terms" element={<TermsPage onOpenAiAssistant={() => setAiAssistantOpen(true)} />} />
              <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />

              {/* Authenticated Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage onOpenAiAssistant={() => setAiAssistantOpen(true)} /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage onOpenAiAssistant={() => setAiAssistantOpen(true)} /></ProtectedRoute>} />
              <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage onOpenAiAssistant={() => setAiAssistantOpen(true)} /></ProtectedRoute>} />
              <Route path="/schemes" element={<SchemesPage onOpenAiAssistant={() => setAiAssistantOpen(true)} />} />
              <Route path="/schemes/:id" element={<SchemeDetailPage onOpenAiAssistant={() => setAiAssistantOpen(true)} />} />
              <Route path="/internships" element={<InternshipsPage onOpenAiAssistant={() => setAiAssistantOpen(true)} />} />
              <Route path="/internships/:id" element={<InternshipDetailPage onOpenAiAssistant={() => setAiAssistantOpen(true)} />} />
              <Route path="/skills" element={<ProtectedRoute><SkillsPage onOpenAiAssistant={() => setAiAssistantOpen(true)} /></ProtectedRoute>} />
              <Route path="/courses" element={<CoursesPage onOpenAiAssistant={() => setAiAssistantOpen(true)} />} />
              <Route path="/copilot" element={<ProtectedRoute><CopilotPage onOpenAiAssistant={() => setAiAssistantOpen(true)} /></ProtectedRoute>} />
              <Route path="/resume" element={<ProtectedRoute><ResumePage onOpenAiAssistant={() => setAiAssistantOpen(true)} /></ProtectedRoute>} />
              <Route path="/applications" element={<ProtectedRoute><ApplicationsPage onOpenAiAssistant={() => setAiAssistantOpen(true)} /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage onOpenAiAssistant={() => setAiAssistantOpen(true)} /></ProtectedRoute>} />
            </Routes>

            {/* Global AI Assistant Drawer */}
            <SaarathiAiAssistant
              isOpen={aiAssistantOpen}
              onClose={() => setAiAssistantOpen(false)}
            />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
