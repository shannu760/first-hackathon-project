import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  GraduationCap,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Bookmark,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function SchemesPage({ onOpenAiAssistant }) {
  const { lang, t } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sort, setSort] = useState('relevance');

  useEffect(() => {
    loadSchemes();
  }, [typeFilter, sort]);

  const loadSchemes = async () => {
    setLoading(true);
    try {
      const res = await api.getOpportunities({
        type: typeFilter,
        search,
        sort,
      });
      if (res.success) setSchemes(res.opportunities || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadSchemes();
  };

  return (
    <div className="flex min-h-screen bg-midnight-950 text-slate-100">
      <Sidebar onOpenAiAssistant={onOpenAiAssistant} />

      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="pb-6 border-b border-midnight-800">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-4 h-4 text-coral-400" />
              <span className="text-xs font-mono uppercase text-coral-400 font-semibold tracking-wider">
                CENTRAL & STATE WELFARE PORTALS
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              Scholarships & Government Schemes Explorer
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic eligibility matching against NSP, AICTE, and State Welfare notifications.
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
                  placeholder="Search by scheme name, provider, or state..."
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
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-xs text-slate-300"
              >
                <option value="">All Types</option>
                <option value="scholarship">Scholarships</option>
                <option value="government_scheme">Government Schemes</option>
                <option value="loan_assistance">Loan Assistance</option>
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-xs text-slate-300"
              >
                <option value="relevance">Sort by Match Score</option>
                <option value="deadline">Sort by Deadline</option>
              </select>
            </div>
          </div>

          {/* Schemes List */}
          <div className="space-y-4">
            {schemes.map(sch => {
              const elig = sch.eligibility;
              const isEligible = elig?.eligibility_status === 'likely_eligible';
              const isCond = elig?.eligibility_status === 'conditionally_eligible';

              return (
                <div
                  key={sch.id}
                  className="glass-panel p-6 rounded-3xl border border-midnight-700 hover:border-wine-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isEligible ? 'bg-emerald/15 text-emerald border-emerald/30' :
                        isCond ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' :
                        'bg-red-500/15 text-red-400 border-red-500/30'
                      }`}>
                        {t(`status_${elig?.eligibility_status || sch.eligibility_status || 'conditionally_eligible'}`)} ({elig?.match_score ?? sch.match_score ?? 55}/100)
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-coral-400" />
                        Deadline: {sch.deadline || 'Unverified'}
                      </span>
                      <span className="text-[10px] text-slate-500">• Last Verified: {sch.last_verified_at || 'Recent'}</span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-white">{sch.title}</h3>
                    <p className="text-xs text-slate-400">{sch.provider}</p>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{sch.description}</p>

                    {/* Plain Language Explanation */}
                    {(elig?.explanation_en || sch.explanation_en) && (
                      <p className="text-[11px] text-slate-300 bg-midnight-900/60 p-2.5 rounded-xl border border-midnight-800 leading-snug">
                        {lang === 'te' ? (elig?.explanation_te || sch.explanation_te || elig?.explanation_en) : (elig?.explanation_en || sch.explanation_en)}
                      </p>
                    )}

                    {/* Benefits Tag */}
                    {sch.benefits && sch.benefits.length > 0 && (
                      <div className="pt-1 text-[11px] text-coral-300 font-medium flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald" />
                        <span>Benefit: {sch.benefits[0]}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                    <Link
                      to={`/schemes/${sch.id}`}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-midnight-600 hover:bg-midnight-800 text-xs font-semibold text-slate-200 text-center"
                    >
                      {t('action_view_detail')}
                    </Link>
                    <a
                      href={sch.official_url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-wine-600 to-coral-500 text-white font-bold text-xs shadow-glow-wine flex items-center justify-center gap-1.5"
                    >
                      <span>{t('action_apply')}</span>
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

