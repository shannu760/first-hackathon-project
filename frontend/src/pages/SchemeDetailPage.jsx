import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Bookmark,
  ArrowLeft,
  FileText,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export default function SchemeDetailPage({ onOpenAiAssistant }) {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const [scheme, setScheme] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOpportunity(id).then(res => {
      if (res.success && res.opportunity) {
        setScheme(res.opportunity);
        setIsSaved(res.opportunity.is_saved);
      }
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleToggleSave = async () => {
    try {
      const res = await api.toggleSaveOpportunity(id);
      if (res.success) setIsSaved(res.is_saved);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-midnight-950 text-slate-100">
        <Sidebar onOpenAiAssistant={onOpenAiAssistant} />
        <div className="flex-1 flex items-center justify-center">Loading scheme details...</div>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="flex min-h-screen bg-midnight-950 text-slate-100">
        <Sidebar onOpenAiAssistant={onOpenAiAssistant} />
        <div className="flex-1 p-10">Scheme not found.</div>
      </div>
    );
  }

  const elig = scheme.eligibility;

  return (
    <div className="flex min-h-screen bg-midnight-950 text-slate-100">
      <Sidebar onOpenAiAssistant={onOpenAiAssistant} />

      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <Link to="/schemes" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Schemes Explorer</span>
          </Link>

          {/* Title Header Card */}
          <div className="glass-panel p-8 rounded-3xl space-y-4 border border-wine-500/30">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-mono uppercase text-coral-400 font-bold tracking-wider">
                {scheme.provider}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleSave}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    isSaved ? 'bg-wine-900 border-wine-500 text-coral-300' : 'border-midnight-700 bg-midnight-900 text-slate-300'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>
                <a
                  href={scheme.official_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-wine-600 to-coral-500 hover:brightness-110 text-white font-bold text-xs shadow-glow-wine flex items-center gap-1.5"
                >
                  <span>Apply on Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-white">
              {scheme.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {scheme.description}
            </p>

            <div className="pt-4 border-t border-midnight-800 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-coral-400" />
                <span>Deadline: <strong className="text-white">{scheme.deadline || 'Unverified'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald" />
                <span>Last Verified by Saarathi: <strong>{scheme.last_verified_at}</strong></span>
              </div>
            </div>
          </div>

          {/* Eligibility Decision Matrix */}
          {elig && (
            <div className="glass-panel p-8 rounded-3xl space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-coral-400" />
                  Your Profile Eligibility Analysis
                </h3>
                <span className="text-sm font-extrabold px-3 py-1 rounded-full bg-wine-900 text-coral-300 border border-wine-500/40">
                  Match Score: {elig.match_score}/100
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-midnight-900/80 border border-midnight-700 text-xs leading-relaxed text-slate-200">
                <p>{lang === 'te' ? elig.explanation_te : elig.explanation_en}</p>
                <p className="mt-2 text-coral-300 font-semibold font-mono">
                  Recommended Action: {elig.recommended_next_action}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-2">
                  <span className="font-mono uppercase text-emerald font-bold block">Passed Requirements</span>
                  {elig.passed_criteria.map((pc, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald shrink-0" />
                      <span>{pc}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <span className="font-mono uppercase text-coral-400 font-bold block">Unverified or Failed</span>
                  {elig.failed_criteria.map((fc, i) => (
                    <div key={i} className="flex items-center gap-2 text-red-400">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{fc}</span>
                    </div>
                  ))}
                  {elig.missing_information.map((mi, i) => (
                    <div key={i} className="flex items-center gap-2 text-yellow-400">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Missing from Profile: {mi}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Required Documents Checklist */}
          <div className="glass-panel p-8 rounded-3xl space-y-4">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-coral-400" />
              Required Verification Documents
            </h3>
            <p className="text-xs text-slate-400">
              Ensure these original certificates are ready before starting the online application form:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
              {(scheme.required_documents || []).map((doc, idx) => (
                <li key={idx} className="p-3 rounded-xl bg-midnight-900 border border-midnight-700 flex items-center gap-2.5 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-coral-400 shrink-0" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Financial Benefits */}
          <div className="glass-panel p-8 rounded-3xl space-y-3">
            <h3 className="font-heading text-lg font-bold text-white">Disbursement & Financial Benefits</h3>
            <div className="space-y-2 text-xs text-slate-300 pt-2">
              {(scheme.benefits || []).map((b, idx) => (
                <p key={idx} className="p-3 rounded-xl bg-midnight-900/60 border border-midnight-700">
                  ðŸ’° {b}
                </p>
              ))}
            </div>
          </div>

          {/* Official Source Provenance Notice */}
          <div className="p-4 rounded-2xl bg-midnight-900/60 border border-midnight-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Official Gazette / Portal Guideline: <a href={scheme.source_url} target="_blank" rel="noreferrer" className="text-coral-400 hover:underline">{scheme.source_url}</a></span>
            <span className="font-mono text-emerald">Rules Version: {scheme.rules_version || '2026.1'}</span>
          </div>

        </div>
      </main>
    </div>
  );
}

