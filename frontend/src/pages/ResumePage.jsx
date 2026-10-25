import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  FileText,
  Download,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Save,
  Plus,
  Trash2,
  ExternalLink
} from 'lucide-react';

export default function ResumePage({ onOpenAiAssistant }) {
  const { lang, t } = useLanguage();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiReview, setAiReview] = useState(null);
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    try {
      const res = await api.getResume();
      if (res.success && res.resume) setResume(res.resume);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updateResume(resume);
      if (res.success) {
        setResume(prev => ({ ...prev, ats_score: res.ats_score, ats_feedback: res.ats_feedback }));
        alert('Resume saved and ATS heuristic score recalculated!');
      }
    } catch (err) {
      alert('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAiReview = async () => {
    if (!resume) return;
    setReviewing(true);
    try {
      const resumeContent = `${resume.full_name}\n${resume.summary}\nSkills: ${(resume.skills || []).join(', ')}`;
      const res = await api.reviewResume({ resume_text: resumeContent, target_role: resume.target_role });
      if (res.success) setAiReview(res.review);
    } catch (err) {
      alert('AI review failed: ' + err.message);
    } finally {
      setReviewing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-midnight-950 text-slate-100">
        <Sidebar onOpenAiAssistant={onOpenAiAssistant} />
        <div className="flex-1 flex items-center justify-center">Loading resume builder...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-midnight-950 text-slate-100">
      <Sidebar onOpenAiAssistant={onOpenAiAssistant} />

      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="pb-6 border-b border-midnight-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-coral-400" />
                <span className="text-xs font-mono uppercase text-coral-400 font-semibold tracking-wider">
                  ATS COMPATIBILITY ENGINE
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                Applicant Tracking System (ATS) Resume Builder
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Heuristic keyword scanner evaluating target role alignment with server-rendered PDF export.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAiReview}
                disabled={reviewing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-midnight-900 border border-wine-500/40 hover:bg-wine-900 text-coral-300 text-xs font-semibold"
              >
                <Sparkles className="w-4 h-4 text-coral-400" />
                <span>{reviewing ? 'Analyzing...' : 'AI Keyword Audit'}</span>
              </button>

              <a
                href={api.getPdfUrl()}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-wine-600 to-coral-500 hover:brightness-110 text-white font-bold text-xs shadow-glow-wine"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>

          {/* ATS Score & AI Review Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-3xl space-y-2">
              <span className="text-xs font-mono uppercase text-slate-400">ATS Keyword Score</span>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-4xl font-extrabold text-white">
                  {resume?.ats_score || 80}/100
                </span>
                <span className="text-xs text-emerald font-semibold">Heuristic Estimate</span>
              </div>
              <div className="w-full bg-midnight-900 h-2 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-gradient-to-r from-wine-500 to-coral-400 h-full rounded-full"
                  style={{ width: `${resume?.ats_score || 80}%` }}
                />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl md:col-span-2 space-y-2">
              <span className="text-xs font-mono uppercase text-coral-400 font-bold block">
                ATS Audit Recommendations
              </span>
              <div className="space-y-1 text-xs text-slate-300">
                {(resume?.ats_feedback || ['Standard ATS readability rules satisfied.']).map((f, i) => (
                  <p key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald shrink-0" />
                    <span>{f}</span>
                  </p>
                ))}
                {aiReview?.improvements?.map((imp, i) => (
                  <p key={i} className="flex items-center gap-1.5 text-coral-300">
                    <Sparkles className="w-3.5 h-3.5 text-coral-400 shrink-0" />
                    <span>AI Tip: {imp}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Resume Form */}
          <form onSubmit={handleSave} className="space-y-6 text-xs">
            
            {/* Contact Information */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
              <h3 className="font-heading text-base font-bold text-white">Personal & Contact Header</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resume?.full_name || ''}
                    onChange={e => setResume({ ...resume, full_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={resume?.email || ''}
                    onChange={e => setResume({ ...resume, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={resume?.phone || ''}
                    onChange={e => setResume({ ...resume, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={resume?.location || ''}
                    onChange={e => setResume({ ...resume, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Role Headline</label>
                <input
                  type="text"
                  value={resume?.target_role || ''}
                  onChange={e => setResume({ ...resume, target_role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Professional Summary</label>
                <textarea
                  rows={3}
                  value={resume?.summary || ''}
                  onChange={e => setResume({ ...resume, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white leading-relaxed"
                />
              </div>
            </div>

            {/* Skills Array */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
              <h3 className="font-heading text-base font-bold text-white">Technical Skills</h3>
              <p className="text-slate-400">Comma-separated list of programming languages, libraries, and tools:</p>
              <input
                type="text"
                value={(resume?.skills || []).join(', ')}
                onChange={e => setResume({
                  ...resume,
                  skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white font-mono"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-wine-600 to-coral-500 text-white font-bold text-xs shadow-glow-wine flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save & Refresh ATS Score'}</span>
              </button>
            </div>

          </form>

        </div>
      </main>
    </div>
  );
}

