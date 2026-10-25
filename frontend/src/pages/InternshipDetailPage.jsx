import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  Briefcase,
  MapPin,
  Clock,
  ExternalLink,
  Bookmark,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Building,
  DollarSign
} from 'lucide-react';

export default function InternshipDetailPage({ onOpenAiAssistant }) {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const [internship, setInternship] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getInternship(id).then(res => {
      if (res.success && res.internship) {
        setInternship(res.internship);
        setIsSaved(res.internship.is_saved);
      }
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleToggleSave = async () => {
    try {
      const res = await api.toggleSaveInternship(id);
      if (res.success) setIsSaved(res.is_saved);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-midnight-950 text-slate-100">
        <Sidebar onOpenAiAssistant={onOpenAiAssistant} />
        <div className="flex-1 flex items-center justify-center">Loading internship details...</div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="flex min-h-screen bg-midnight-950 text-slate-100">
        <Sidebar onOpenAiAssistant={onOpenAiAssistant} />
        <div className="flex-1 p-10">Internship not found.</div>
      </div>
    );
  }

  const fit = internship.fit;

  return (
    <div className="flex min-h-screen bg-midnight-950 text-slate-100">
      <Sidebar onOpenAiAssistant={onOpenAiAssistant} />

      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <Link to="/internships" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Internships Explorer</span>
          </Link>

          {/* Title Header Card */}
          <div className="glass-panel p-8 rounded-3xl space-y-4 border border-wine-500/30">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-mono uppercase text-coral-400 font-bold tracking-wider">
                {internship.company}
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
                  href={internship.official_url}
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
              {internship.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 pt-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-coral-400" />
                {internship.location} ({internship.work_mode})
              </span>
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald" />
                Stipend: <strong className="text-white">{internship.stipend_text || 'Disclosed'}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-coral-400" />
                Duration: {internship.duration_months} Months
              </span>
            </div>
          </div>

          {/* Mathematical Fit Breakdown */}
          {fit && (
            <div className="glass-panel p-8 rounded-3xl space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-coral-400" />
                  Skill-Fit Analysis (Weighted 100% Scale)
                </h3>
                <span className="text-sm font-extrabold px-3 py-1 rounded-full bg-wine-900 text-coral-300 border border-wine-500/40">
                  Fit Score: {fit.fit_score}%
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-midnight-900/80 border border-midnight-700 text-xs leading-relaxed text-slate-200">
                <p><strong>Recommendation:</strong> {fit.recommended_action}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div>
                  <span className="font-mono uppercase text-emerald font-bold block mb-2">
                    Matched Skills ({fit.matched_skills.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {fit.matched_skills.map((sk, i) => (
                      <span key={i} className="px-3 py-1 rounded-xl bg-emerald/15 text-emerald font-mono border border-emerald/30">
                        âœ“ {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-mono uppercase text-coral-400 font-bold block mb-2">
                    Missing Required Skills ({fit.missing_required_skills.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {fit.missing_required_skills.map((sk, i) => (
                      <span key={i} className="px-3 py-1 rounded-xl bg-red-950/40 text-red-300 font-mono border border-red-500/30">
                        ! {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-midnight-800 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Academic CGPA Requirement</span>
                  <span className="font-bold text-white">Min {internship.min_cgpa || 'None'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Target Role Alignment</span>
                  <span className="font-bold text-coral-300">{fit.role_alignment?.score || 15}/15 Pts</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Last Verified</span>
                  <span className="font-bold text-slate-200">{internship.last_verified_at}</span>
                </div>
              </div>
            </div>
          )}

          {/* Add to Application Kanban Button */}
          <div className="p-6 rounded-3xl bg-midnight-900 border border-midnight-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-heading font-bold text-sm text-white">Ready to apply?</h4>
              <p className="text-xs text-slate-400">Add this role directly to your Saarathi Kanban application tracker.</p>
            </div>
            <button
              onClick={async () => {
                await api.addApplication({
                  opportunity_id: internship.id,
                  opportunity_type: 'internship',
                  role_title: internship.title,
                  company_or_provider: internship.company,
                  status: 'To Apply',
                  deadline: internship.deadline,
                  official_url: internship.official_url
                });
                alert('Added to your Applications Kanban tracker!');
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-wine-600 to-coral-500 text-white font-bold text-xs shadow-glow-wine"
            >
              Add to Applications Kanban
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

