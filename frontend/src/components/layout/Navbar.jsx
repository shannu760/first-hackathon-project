import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Compass, Sparkles, Globe, Menu, X, ArrowRight, UserCheck } from 'lucide-react';

export default function Navbar({ onOpenAiAssistant }) {
  const { user, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-midnight-950/85 backdrop-blur-md border-b border-midnight-700/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-wine-600 via-wine-800 to-midnight-900 border border-coral-400/30 flex items-center justify-center p-2 shadow-glow-wine transition-transform group-hover:scale-105">
              <img src="/logo.svg" alt="Saarathi Logo" className="w-full h-full" />
            </div>
            <div>
              <span className="font-heading text-2xl font-bold tracking-wider text-white group-hover:text-coral-300 transition-colors">
                SAARATHI
              </span>
              <p className="text-[10px] tracking-widest uppercase text-coral-400 font-medium font-body -mt-1">
                {lang === 'te' ? 'అర్హత నుండి ఉపాధి వరకు' : 'Eligibility to Employment'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/#features" className="text-sm font-medium text-slate-300 hover:text-coral-300 transition-colors">
              {t('nav_features')}
            </a>
            <a href="/#how-it-works" className="text-sm font-medium text-slate-300 hover:text-coral-300 transition-colors">
              {t('nav_how_it_works')}
            </a>
            <Link to="/schemes" className="text-sm font-medium text-slate-300 hover:text-coral-300 transition-colors">
              {t('nav_schemes')}
            </Link>
            <Link to="/internships" className="text-sm font-medium text-slate-300 hover:text-coral-300 transition-colors">
              {t('nav_internships')}
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-slate-300 hover:text-coral-300 transition-colors">
              {t('nav_pricing')}
            </Link>
            <Link to="/presentation" className="text-sm font-medium text-coral-400 hover:text-coral-300 transition-colors flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-coral-400" />
              <span>Pitch Deck</span>
            </Link>
          </div>

          {/* Action Area: Language Toggle, AI Assistant, User Auth */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-midnight-600 bg-midnight-900/60 hover:bg-midnight-800 text-xs font-semibold text-slate-200 transition-colors"
              title="Switch Language / భాషను మార్చండి"
            >
              <Globe className="w-3.5 h-3.5 text-coral-400" />
              <span>{lang === 'en' ? 'తెలుగు' : 'English'}</span>
            </button>

            {/* AI Assistant Pill */}
            {onOpenAiAssistant && (
              <button
                onClick={onOpenAiAssistant}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-wine-900/70 border border-wine-500/40 hover:bg-wine-800 text-xs font-semibold text-coral-200 shadow-sm transition-all hover:shadow-glow-wine"
              >
                <Sparkles className="w-3.5 h-3.5 text-coral-400 animate-pulse" />
                <span>Saarathi AI</span>
              </button>
            )}

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-wine-600 to-wine-700 hover:from-wine-500 hover:to-wine-600 text-white font-medium text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{t('nav_dashboard')}</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white transition-colors"
                >
                  {t('nav_login')}
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-wine-600 via-wine-500 to-coral-500 hover:from-wine-500 hover:to-coral-400 text-white font-semibold text-sm shadow-glow-wine transition-all flex items-center gap-1.5 group"
                >
                  <span>{t('cta_primary')}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 text-xs border border-midnight-600 rounded bg-midnight-900 text-coral-400 font-semibold"
            >
              {lang === 'en' ? 'తెలుగు' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-midnight-950 border-b border-midnight-700 px-6 py-5 space-y-4">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 font-medium">Home</Link>
          <Link to="/schemes" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 font-medium">{t('nav_schemes')}</Link>
          <Link to="/internships" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 font-medium">{t('nav_internships')}</Link>
          <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 font-medium">{t('nav_pricing')}</Link>
          <Link to="/presentation" onClick={() => setMobileMenuOpen(false)} className="block text-coral-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-coral-400" />
            <span>Keynote Pitch Deck</span>
          </Link>
          <div className="pt-4 border-t border-midnight-800 flex flex-col gap-3">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-wine-600 text-white font-semibold"
              >
                {t('nav_dashboard')}
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg border border-midnight-700 text-slate-200 font-semibold"
                >
                  {t('nav_login')}
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-gradient-to-r from-wine-600 to-coral-500 text-white font-semibold"
                >
                  {t('cta_primary')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
