import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Clock,
  Code,
  Github,
  BookOpen
} from 'lucide-react';

export default function SkillsPage({ onOpenAiAssistant }) {
  const { lang, t } = useLanguage();
  const [skillsData, setSkillsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProf, setNewSkillProf] = useState('Intermediate');

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const res = await api.getSkills();
      if (res.success) setSkillsData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    try {
      await api.addSkill({ skill_name: newSkillName.trim(), proficiency: newSkillProf });
      setNewSkillName('');
      loadSkills();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemoveSkill = async (name) => {
    try {
      await api.removeSkill(name);
      loadSkills();
    } catch (err) {
      console.error(err);
    }
  };

  const analysis = skillsData?.analysis;

  return (
    <div className="flex min-h-screen bg-midnight-950 text-slate-100">
      <Sidebar onOpenAiAssistant={onOpenAiAssistant} />

      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="pb-6 border-b border-midnight-800">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-coral-400" />
              <span className="text-xs font-mono uppercase text-coral-400 font-semibold tracking-wider">
                COMPETENCY TAXONOMY & GAP ESTIMATOR
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              Skill-Gap Analyzer for {skillsData?.target_role || 'Software Intern'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Identify missing competencies before applying to increase your selection probability.
            </p>
          </div>

          {/* Readiness Scoreboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-3xl space-y-2">
              <span className="text-xs font-mono uppercase text-slate-400">Target Role Readiness</span>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-4xl font-extrabold text-white">
                  {analysis?.readiness_score || 75}%
                </span>
                <span className="text-xs text-coral-300 font-semibold">Proficiency Adjusted</span>
              </div>
              <div className="w-full bg-midnight-900 h-2 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-gradient-to-r from-wine-500 to-coral-400 h-full rounded-full"
                  style={{ width: `${analysis?.readiness_score || 75}%` }}
                />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl space-y-2">
              <span className="text-xs font-mono uppercase text-slate-400">Estimated Prep Time</span>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-4xl font-extrabold text-white">
                  {analysis?.estimated_prep_weeks || 3}
                </span>
                <span className="text-xs text-slate-400">Weeks ({analysis?.estimated_prep_hours || 40} Hours)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Based on ~15 hours/week study commitment</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl space-y-2">
              <span className="text-xs font-mono uppercase text-slate-400">Skills Matched</span>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-4xl font-extrabold text-emerald">
                  {analysis?.total_skills_matched || 0}
                </span>
                <span className="text-xs text-slate-400">of {analysis?.total_skills_required || 4} Core Required</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {analysis?.missing_skills?.length || 0} missing competencies to bridge
              </p>
            </div>
          </div>

          {/* Missing Skills vs Matched Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Missing Skills (Prioritized) */}
            <div className="glass-panel p-6 sm:p-7 rounded-3xl space-y-4">
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-coral-400" />
                Missing Competencies to Learn
              </h3>
              <div className="space-y-3">
                {(analysis?.missing_skills || []).map((ms, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-midnight-900 border border-midnight-700 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-xs">{ms.name}</span>
                      <span className="text-[10px] text-coral-300 ml-2 font-mono">Priority: {ms.priority}</span>
                    </div>
                    <span className="text-[10px] bg-red-950/60 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-mono uppercase">
                      Missing {ms.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Student Skills Inventory */}
            <div className="glass-panel p-6 sm:p-7 rounded-3xl space-y-4">
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald" />
                Your Active Skill Profile
              </h3>

              {/* Add Skill Form */}
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={e => setNewSkillName(e.target.value)}
                  placeholder="Add skill (e.g. Docker, React, SQL)..."
                  className="flex-1 px-3 py-2 rounded-xl bg-midnight-900 border border-midnight-700 text-xs text-white placeholder-slate-500"
                />
                <select
                  value={newSkillProf}
                  onChange={e => setNewSkillProf(e.target.value)}
                  className="px-2.5 py-2 rounded-xl bg-midnight-900 border border-midnight-700 text-xs text-slate-300"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-wine-600 hover:bg-wine-500 text-white font-bold text-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              <div className="flex flex-wrap gap-2 pt-2">
                {(skillsData?.skills || []).map(s => (
                  <div
                    key={s.id || s.skill_name}
                    className="px-3 py-1.5 rounded-xl bg-midnight-900 border border-midnight-700 text-xs flex items-center gap-2 text-slate-200"
                  >
                    <span className="font-semibold">{s.skill_name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({s.proficiency})</span>
                    <button
                      onClick={() => handleRemoveSkill(s.skill_name)}
                      className="text-slate-500 hover:text-red-400 ml-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Recommended Capstone Project from Taxonomy */}
          {analysis?.recommended_project && (
            <div className="glass-wine-card p-8 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-coral-300 font-bold">
                <Code className="w-4 h-4 text-coral-400" />
                Prescribed Portfolio Capstone
              </div>
              <h3 className="font-heading text-xl font-bold text-white">
                {analysis.recommended_project.title}
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed max-w-3xl">
                {analysis.recommended_project.description}
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-coral-200">
                {analysis.recommended_project.deliverables.map((d, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-midnight-950/70 border border-wine-500/40">
                    ðŸ“¦ {d}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

