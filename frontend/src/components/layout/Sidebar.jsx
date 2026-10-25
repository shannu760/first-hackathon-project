import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  UserCheck,
  Compass,
  GraduationCap,
  Briefcase,
  Target,
  BookOpen,
  CalendarCheck,
  FileText,
  Kanban,
  Bell,
  LogOut,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ onOpenAiAssistant }) {
  const { user, profile, logout } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
    { to: '/profile', label: t('nav_profile'), icon: UserCheck, badge: 'Pin 2' },
    { to: '/recommendations', label: t('nav_recommendations'), icon: Compass },
    { to: '/schemes', label: t('nav_schemes'), icon: GraduationCap },
    { to: '/internships', label: t('nav_internships'), icon: Briefcase },
    { to: '/skills', label: t('nav_skills'), icon: Target },
    { to: '/courses', label: t('nav_courses'), icon: BookOpen },
    { to: '/copilot', label: t('nav_copilot'), icon: CalendarCheck },
    { to: '/resume', label: t('nav_resume'), icon: FileText },
    { to: '/applications', label: t('nav_applications'), icon: Kanban },
    { to: '/notifications', label: 'Deadline Radar', icon: Bell },
    { to: '/presentation', label: 'Presentation Deck', icon: Sparkles, badge: 'Deck' },
  ];

  return (
    <aside className="w-64 bg-midnight-950 border-r border-midnight-800 flex flex-col justify-between h-screen sticky top-0 shrink-0">
      
      {/* Top Header */}
      <div className="p-5 border-b border-midnight-800 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-wine-700/60 p-1.5 border border-coral-400/30">
            <img src="/logo.svg" alt="Saarathi" className="w-full h-full" />
          </div>
          <div>
            <span className="font-heading text-lg font-bold tracking-wider text-white">SAARATHI</span>
            <span className="block text-[9px] tracking-widest text-coral-400 font-semibold uppercase">STUDENT PORTAL</span>
          </div>
        </NavLink>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-wine-700/80 to-wine-900/60 text-white border border-wine-500/30 shadow-glow-wine font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-midnight-900/70'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-coral-400" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] bg-wine-900/90 text-coral-300 px-1.5 py-0.5 rounded border border-wine-500/40">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        {/* Floating AI Companion Trigger */}
        {onOpenAiAssistant && (
          <div className="pt-3">
            <button
              onClick={onOpenAiAssistant}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-wine-900 via-wine-800 to-midnight-800 border border-coral-400/30 text-coral-200 text-xs font-semibold shadow-glow-wine hover:brightness-110 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-coral-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Saarathi AI Chat</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-coral-400" />
            </button>
          </div>
        )}
      </div>

      {/* User Footer Card */}
      <div className="p-4 border-t border-midnight-800 bg-midnight-900/40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-wine-600/60 border border-coral-400/40 flex items-center justify-center font-bold text-xs text-white uppercase shrink-0">
              {user?.full_name?.charAt(0) || 'S'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.full_name || 'Student'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg border border-midnight-700 hover:bg-midnight-800 text-[11px] font-medium text-slate-300 hover:text-white transition-colors"
        >
          <LogOut className="w-3.5 h-3.5 text-coral-400" />
          <span>{t('btn_logout')}</span>
        </button>
      </div>

    </aside>
  );
}
