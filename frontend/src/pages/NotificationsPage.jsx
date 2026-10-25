import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  Bell,
  Clock,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function NotificationsPage({ onOpenAiAssistant }) {
  const { lang, t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await api.getNotifications();
      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unread_count || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-midnight-950 text-slate-100">
      <Sidebar onOpenAiAssistant={onOpenAiAssistant} />

      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="pb-6 border-b border-midnight-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Bell className="w-4 h-4 text-coral-400" />
                <span className="text-xs font-mono uppercase text-coral-400 font-semibold tracking-wider">
                  TIME-CRITICAL RADAR
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                Deadline Radar & Alerts
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Automated alerts on upcoming portal closures, verified scheme openings, and preparation milestones.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="px-4 py-2 rounded-xl bg-midnight-900 border border-midnight-700 hover:bg-midnight-800 text-xs font-semibold text-slate-200"
              >
                Mark all as read ({unreadCount})
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="space-y-3.5">
            {notifications.map(n => (
              <div
                key={n.id}
                onClick={() => !n.is_read && handleMarkRead(n.id)}
                className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                  n.is_read
                    ? 'glass-panel border-midnight-800/80 opacity-75'
                    : 'glass-wine-card border-wine-500/50 shadow-glow-wine'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-midnight-950 border border-wine-500/30 text-coral-400 mt-0.5">
                    {n.type === 'deadline' ? <Clock className="w-5 h-5" /> :
                     n.type === 'scheme_match' ? <GraduationCap className="w-5 h-5" /> :
                     <Briefcase className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono font-bold text-coral-300">
                        {n.type.replace('_', ' ')}
                      </span>
                      {n.deadline && (
                        <span className="text-[10px] text-yellow-400 font-mono">
                          â€¢ Closes: {n.deadline}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white">{n.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                  </div>
                </div>

                {!n.is_read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-coral-400 shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}

