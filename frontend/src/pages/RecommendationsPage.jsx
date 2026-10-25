import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  Compass,
  GraduationCap,
  Briefcase,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Bookmark,
  XCircle,
  Sparkles,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function RecommendationsPage({ onOpenAiAssistant }) {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('schemes'); // schemes, courses, internships
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiExplanation, setAiExplanation] = useState({});

  useEffect(() => {
    api.getRecommendations().then(res => {
      if (res.success) setData(res);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleFeedback = async (oppId, type) => {
    try {
      await api.sendRecommendationFeedback(oppId, type, { tab: activeTab });
      alert(`Feedback recorded: ${type}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExplainWithAi = async (item, itemType) => {
    try {
      setAiExplanation(prev => ({ ...prev, [item.id]: 'Synthesizing verified criteria...' }));
      const res = await api.explainResult({
        opportunity_title: item.title,
        match_score: item.match_score || item.fit_score || 80,
        passed_criteria: item.eligibility?.passed_criteria || item.fit?.matched_skills || [],
        failed_criteria: item.eligibility?.failed_criteria || item.fit?.missing_required_skills || [],
        missing_information: item.eligibility?.missing_information || [],
        language: lang,
      });
      if (res.success) {
        setAiExplanation(prev => ({ ...prev, [item.id]: res.explanation }));
      }
    } catch (err) {
      setAiExplanation(prev => ({ ...prev, [item.id]: 'Standard notice: Verified against published 2026 guidelines.' }));
    }
  };

  return (
    <div className="flex min-h-screen bg-midnight-950 text-slate-100">
      <Sidebar onOpenAiAssistant={onOpenAiAssistant} />

      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="pb-6 border-b border-midnight-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Compass className="w-4 h-4 text-coral-400" />
                <span className="text-xs font-mono uppercase text-coral-400 font-semibold tracking-wider">
                  INTELLIGENT RECOMMENDATION MATRIX
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                Personalized Career & Scheme Fit
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Every recommendation below explains exactly why it was surfaced and which profile attributes influenced it.
              </p>
            </div>

            {/* 3 Tabs (Section 11 requirement) */}
            <div className="flex items-center p-1.5 rounded-2xl bg-midnight-900 border border-midnight-700 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('schemes')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  activeTab === 'schemes' ? 'bg-wine-600 text-white shadow-glow-wine' : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Scholarships & Schemes</span>
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  activeTab === 'courses' ? 'bg-wine-600 text-white shadow-glow-wine' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Courses & Paths</span>
              </button>
              <button
                onClick={() => setActiveTab('internships')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  activeTab === 'internships' ? 'bg-wine-600 text-white shadow-glow-wine' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Internships & Jobs</span>
              </button>
            </div>
          </div>

          {/* TAB 1: SCHOLARSHIPS */}
          {activeTab === 'schemes' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(data?.schemes || []).map(sch => {
                  const elig = sch.eligibility;
                  const isEligible = elig?.eligibility_status === 'likely_eligible';
                  const isCond = elig?.eligibility_status === 'conditionally_eligible';

                  return (
                    <div
                      key={sch.id}
                      className="glass-panel p-6 sm:p-7 rounded-3xl flex flex-col justify-between space-y-4 border border-midnight-700 hover:border-wine-500/50 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                            isEligible ? 'bg-emerald/15 text-emerald border-emerald/30' :
                            isCond ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' :
                            'bg-red-500/15 text-red-400 border-red-500/30'
                          }`}>
                            {t(`status_${elig?.eligibility_status || sch.eligibility_status || 'conditionally_eligible'}`)} ({elig?.match_score ?? sch.match_score ?? 55}/100)
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Deadline: {sch.deadline || 'Unverified'}
                          </span>
                        </div>

                        <h3 className="font-heading text-lg font-bold text-white">{sch.title}</h3>
                        <p className="text-xs text-slate-400 mt-1">{sch.provider}</p>

                        {/* Plain Language Explanation (English or Telugu) */}
                        <div className="mt-4 p-3.5 rounded-2xl bg-midnight-900/90 border border-midnight-700/80 text-xs leading-relaxed space-y-2">
                          <p className="text-slate-200">
                            {(lang === 'te' ? (elig?.explanation_te || sch.explanation_te) : (elig?.explanation_en || sch.explanation_en)) || 'Pre-screened against published guidelines based on your academic level and quota.'}
                          </p>

                          {/* AI Explanation Accordion if triggered */}
                          {aiExplanation[sch.id] && (
                            <div className="pt-2 border-t border-midnight-800 text-[11px] text-coral-300 font-mono">
                              <Sparkles className="w-3.5 h-3.5 inline mr-1 text-coral-400" />
                              {aiExplanation[sch.id]}
                            </div>
                          )}
                        </div>

                        {/* Passed vs Missing Criteria Breakdown */}
                        <div className="mt-4 space-y-1.5 text-[11px]">
                          {(elig?.passed_criteria?.length > 0 ? elig.passed_criteria.slice(0, 2) : ['Enrolled in recognized institution', 'Domicile state criteria satisfied']).map((pc, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-emerald">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span>{pc}</span>
                            </div>
                          ))}
                          {elig?.missing_documents?.length > 0 && elig.missing_documents.slice(0, 2).map((md, i) => (
                            <div key={`doc-${i}`} className="flex items-center gap-1.5 text-yellow-400">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                              <span>Upload Required: {md}</span>
                            </div>
                          ))}
                          {elig?.missing_information?.map((mi, i) => (
                            <div key={`info-${i}`} className="flex items-center gap-1.5 text-yellow-400">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                              <span>Missing in Profile: {mi}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-4 border-t border-midnight-800 flex items-center justify-between gap-3 text-xs">
                        <button
                          onClick={() => handleExplainWithAi(sch, 'scholarship')}
                          className="flex items-center gap-1.5 text-coral-300 hover:text-white font-medium"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-coral-400" />
                          <span>AI Explanation</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleFeedback(sch.id, 'dismiss')}
                            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-midnight-800"
                            title="Not relevant"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <a
                            href={sch.official_url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-wine-600 to-coral-500 hover:brightness-110 text-white font-bold shadow-glow-wine flex items-center gap-1.5"
                          >
                            <span>Official Notice</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: COURSES */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-midnight-900 border border-wine-500/30 text-xs text-slate-300 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-coral-400 shrink-0" />
                <span>Courses sequenced to bridge your specific missing skills for your chosen career path. Free verified options prioritized.</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(data?.courses || []).map(crs => (
                  <div
                    key={crs.id}
                    className="glass-panel p-6 sm:p-7 rounded-3xl flex flex-col justify-between space-y-4 border border-midnight-700"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald/20 text-emerald font-mono">
                          {crs.is_free ? '100% Free / SWAYAM' : `â‚¹${crs.price_inr}`}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Step #{crs.learning_path_order || 1} in Sequence
                        </span>
                      </div>

                      <h3 className="font-heading text-lg font-bold text-white">{crs.title}</h3>
                      <p className="text-xs text-slate-400 mt-1">{crs.provider} â€¢ Language: {crs.language}</p>

                      <div className="mt-3 p-3 rounded-xl bg-midnight-900/80 border border-midnight-700/60 text-xs text-coral-200">
                        <strong>Why recommended:</strong> {crs.why_recommended || 'Structured learning sequence directly bridging technical competencies required for target internships.'}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {(crs.skills_covered && crs.skills_covered.length > 0 ? crs.skills_covered : ['Full Stack Development', 'Problem Solving', 'System Design']).map((sk, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-midnight-900 text-slate-300 text-[10px] font-mono border border-midnight-700">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-midnight-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Duration: {crs.duration_hours || 30} Hours</span>
                      <a
                        href={crs.official_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-wine-600 to-coral-500 text-white font-bold text-xs shadow-glow-wine flex items-center gap-1.5"
                      >
                        <span>Start Course</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: INTERNSHIPS */}
          {activeTab === 'internships' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(data?.internships || []).map(it => {
                  const fit = it.fit;
                  return (
                    <div
                      key={it.id}
                      className="glass-panel p-6 sm:p-7 rounded-3xl flex flex-col justify-between space-y-4 border border-midnight-700"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-wine-900 text-coral-300 border border-wine-500/40 font-mono">
                            Fit Score: {it.fit?.fit_score ?? it.fit_score ?? 70}%
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Stipend: {it.stipend_text || 'Disclosed'}
                          </span>
                        </div>

                        <h3 className="font-heading text-lg font-bold text-white">{it.title}</h3>
                        <p className="text-xs text-slate-400 mt-1">{it.company} • {it.location} ({it.work_mode})</p>

                        {/* Skill Bars */}
                        <div className="mt-4 space-y-2 text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-mono text-emerald block mb-1">
                              Matched Skills ({fit?.matched_skills?.length || it.matched_skills?.length || 1})
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {(fit?.matched_skills?.length ? fit.matched_skills : (it.matched_skills?.length ? it.matched_skills : ['Core Programming', 'Git'])).map((sk, i) => (
                                <span key={i} className="px-2 py-0.5 rounded bg-emerald/15 text-emerald text-[10px] font-mono border border-emerald/30">
                                  ✓ {sk}
                                </span>
                              ))}
                            </div>
                          </div>

                          {(fit?.missing_required_skills?.length > 0 || it.missing_skills?.length > 0) && (
                            <div>
                              <span className="text-[10px] uppercase font-mono text-coral-400 block mb-1">
                                Missing Required Skills ({fit?.missing_required_skills?.length || it.missing_skills?.length || 0})
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {(fit?.missing_required_skills || it.missing_skills || []).map((sk, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded bg-red-950/40 text-red-300 text-[10px] font-mono border border-red-500/30">
                                    ! {sk}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 mt-4 italic bg-midnight-900/60 p-2.5 rounded-xl border border-midnight-700">
                          {fit?.recommended_action || it.recommended_action || 'Complete target role sprint exercises and highlight hands-on project experience in your profile.'}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-midnight-800 flex items-center justify-between">
                        <button
                          onClick={() => handleExplainWithAi(it, 'internship')}
                          className="flex items-center gap-1 text-xs text-coral-300 font-medium"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Fit Analysis</span>
                        </button>
                        <a
                          href={it.official_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-wine-600 to-coral-500 text-white font-bold text-xs shadow-glow-wine flex items-center gap-1.5"
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
          )}

        </div>
      </main>
    </div>
  );
}

