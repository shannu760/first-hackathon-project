import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Building,
  DollarSign
} from 'lucide-react';

export default function InternshipsPage({ onOpenAiAssistant }) {
  const { lang, t } = useLanguage();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [workMode, setWorkMode] = useState('all');

  useEffect(() => {
    loadInternships();
  }, [workMode]);

  const loadInternships = async () => {
    setLoading(true);
    try {
      const res = await api.getInternships({
        work_mode: workMode,
        search,
      });
      if (res.success) setInternships(res.internships || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadInternships();
  };

  return (
    <div className="flex min-h-screen bg-midnight-950 text-slate-100">
      <Sidebar onOpenAiAssistant={onOpenAiAssistant} />

      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="pb-6 border-b border-midnight-800">
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-4 h-4 text-coral-400" />
              <span className="text-xs font-mono uppercase text-coral-400 font-semibold tracking-wider">
                VERIFIED CORPORATE & STARTUP LISTINGS
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              Student Internship & Career Fit Explorer
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Real listings from verified sources with mathematical skill-fit evaluation.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <form onSubmit={handleSearchSubmit} className="flex-1 w-full sm:w-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by role title, tech stack, or company..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-coral-400"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-midnight-900 hover:bg-midnight-800 text-xs font-semibold text-slate-200 border border-midnight-700"
              >
                Search
              </button>
            </form>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-xs text-slate-300"
              >
                <option value="all">All Modes</option>
                <option value="remote">Remote Only</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On-Site</option>
              </select>
            </div>
          </div>

          {/* Internships List */}
          <div className="space-y-4">
            {internships.map(it => {
              const fit = it.fit;

              return (
                <div
                  key={it.id}
                  className="glass-panel p-6 rounded-3xl border border-midnight-700 hover:border-wine-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-wine-900 text-coral-300 border border-wine-500/40 font-mono">
                        Fit Score: {fit?.fit_score ?? it.fit_score ?? 70}%
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-coral-400" />
                        {it.location} ({it.work_mode})
                      </span>
                      <span className="text-[10px] text-emerald font-semibold">
                        • {it.stipend_text || 'Disclosed on interview'}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-white">{it.title}</h3>
                    <p className="text-xs text-slate-400 font-semibold">{it.company} • Duration: {it.duration_months} Months</p>

                    {/* Actionable recommendation */}
                    {(fit?.recommended_action || it.recommended_action) && (
                      <p className="text-[11px] text-slate-300 bg-midnight-900/60 p-2.5 rounded-xl border border-midnight-800 leading-snug italic">
                        {fit?.recommended_action || it.recommended_action}
                      </p>
                    )}

                    {/* Required Skills Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(it.required_skills || []).map((sk, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg bg-midnight-900 text-slate-300 text-[10px] font-mono border border-midnight-700">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                    <Link
                      to={`/internships/${it.id}`}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-midnight-600 hover:bg-midnight-800 text-xs font-semibold text-slate-200 text-center"
                    >
                      Skill Fit Breakdown
                    </Link>
                    <a
                      href={it.official_url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-wine-600 to-coral-500 text-white font-bold text-xs shadow-glow-wine flex items-center justify-center gap-1.5"
                    >
                      <span>Apply Official</span>
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

