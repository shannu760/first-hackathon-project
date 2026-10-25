import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  Clock,
  Sparkles
} from 'lucide-react';

export default function CoursesPage({ onOpenAiAssistant }) {
  const { lang, t } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [langFilter, setLangFilter] = useState('all');

  useEffect(() => {
    loadCourses();
  }, [langFilter]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await api.getCourses({ language: langFilter });
      if (res.success) setCourses(res.courses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async (courseId, status) => {
    try {
      await api.updateCourseProgress(courseId, status, status === 'completed' ? 100 : 50);
      loadCourses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-midnight-950 text-slate-100">
      <Sidebar onOpenAiAssistant={onOpenAiAssistant} />

      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="pb-6 border-b border-midnight-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-coral-400" />
                <span className="text-xs font-mono uppercase text-coral-400 font-semibold tracking-wider">
                  NPTEL â€¢ SWAYAM â€¢ OFFICIAL CURRICULA
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                Curated Skill-Bridge Course Roadmap
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Verified high-quality resources to eliminate skill gaps without unnecessary paywalls.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Language:</span>
              <select
                value={langFilter}
                onChange={e => setLangFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-midnight-900 border border-midnight-700 text-slate-200"
              >
                <option value="all">All Languages</option>
                <option value="English">English</option>
                <option value="Both">Bilingual / Telugu Explanations</option>
              </select>
            </div>
          </div>

          {/* Courses List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map(crs => {
              const userStatus = crs.user_progress?.status || 'not_started';

              return (
                <div
                  key={crs.id}
                  className="glass-panel p-6 sm:p-7 rounded-3xl flex flex-col justify-between space-y-4 border border-midnight-700 hover:border-wine-500/50 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald/15 text-emerald border border-emerald/30 font-mono">
                        {crs.is_free ? '100% Free / SWAYAM' : `â‚¹${crs.price_inr}`}
                      </span>
                      <span className="text-[10px] text-coral-300 font-mono">
                        Level: {crs.level} â€¢ {crs.duration_hours}h
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-white">{crs.title}</h3>
                    <p className="text-xs text-slate-400">{crs.provider} â€¢ Language: {crs.language}</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{crs.description}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(crs.skills || []).map((sk, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-midnight-900 border border-midnight-700 text-slate-300 text-[10px] font-mono">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-midnight-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    {/* Status Toggle Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateProgress(crs.id, 'in_progress')}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                          userStatus === 'in_progress' ? 'bg-wine-900 border-wine-500 text-coral-300' : 'border-midnight-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => handleUpdateProgress(crs.id, 'completed')}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                          userStatus === 'completed' ? 'bg-emerald/20 border-emerald text-emerald' : 'border-midnight-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        âœ“ Done
                      </button>
                    </div>

                    <a
                      href={crs.official_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-wine-600 to-coral-500 text-white font-bold text-xs shadow-glow-wine flex items-center justify-center gap-1.5"
                    >
                      <span>Access Course</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>
    </div>
  );
}

