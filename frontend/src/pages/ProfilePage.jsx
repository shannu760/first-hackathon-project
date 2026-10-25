import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { saveLoginInfoToFirebase } from '../services/firebase';
import {
  UserCheck,
  ShieldCheck,
  Award,
  GraduationCap,
  Briefcase,
  FileCheck,
  Download,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin,
  Building,
  Calendar,
  X
} from 'lucide-react';

/**
 * Editorial Profile Page
 * Modelled after Pinterest Pin 2: "A digital design layout featuring a red statue/sculpted figure on a dark background with elegant editorial typography"
 * Colors from Pin 3: Deep Midnight (#0B0F19), Wine (#921B2F, #AA3234), Coral (#FA947E)
 * Typography from Pin 4: Cinzel / Syne / Plus Jakarta Sans
 */
export default function ProfilePage({ onOpenAiAssistant }) {
  const { user, profile, refreshProfile } = useAuth();
  const { lang, t } = useLanguage();

  const [academicRecords, setAcademicRecords] = useState([]);
  const [skills, setSkills] = useState([]);
  const [goals, setGoals] = useState(null);
  const [completionPct, setCompletionPct] = useState(85);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    api.getProfile().then(res => {
      if (res.success) {
        setAcademicRecords(res.academicRecords || []);
        setSkills(res.skills || []);
        setGoals(res.goals || null);
        setCompletionPct(res.completionPct || 85);
        if (res.profile) setEditForm(res.profile);
      }
    }).catch(err => console.error(err));
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const res = await api.updateProfile(editForm);
      await refreshProfile();
      if (user && res.profile) {
        saveLoginInfoToFirebase({ ...user, full_name: editForm.full_name, phone: editForm.phone }, res.profile);
      }
      setIsEditing(false);
    } catch (err) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-midnight-950 text-slate-100">
      <Sidebar onOpenAiAssistant={onOpenAiAssistant} />

      <main className="flex-1 overflow-y-auto">
        
        {/* Editorial Hero Header (Statuesque Bust & Luxury Typography - Pin 2 Reference) */}
        <div className="relative border-b border-midnight-800 bg-gradient-to-b from-midnight-900 via-midnight-950 to-midnight-950 pt-10 pb-12 px-6 sm:px-10 lg:px-12 overflow-hidden">
          
          {/* Ambient Crimson / Coral Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-wine-600/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-72 h-72 bg-coral-500/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="max-w-6xl mx-auto">
            
            {/* Top Navigation Row in Pin 2 style */}
            <div className="flex items-center justify-between pb-8 mb-8 border-b border-midnight-800/80">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono tracking-widest text-coral-400 uppercase font-semibold">
                  STUDENT IDENTITY & ACCREDITATION DOSSIER
                </span>
                <span className="text-slate-600">â€¢</span>
                <span className="text-[11px] text-slate-400 font-mono">VERIFIED 2026</span>
              </div>
              
              <div className="flex items-center gap-3">
                <a
                  href={api.exportData()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-midnight-700 bg-midnight-900/60 hover:bg-midnight-800 text-xs font-medium text-slate-300 transition-colors"
                  title="Export complete student record JSON"
                >
                  <Download className="w-3.5 h-3.5 text-coral-400" />
                  <span>Export JSON</span>
                </a>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-wine-600 to-coral-500 hover:brightness-110 text-xs font-semibold text-white shadow-glow-wine transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* Sculpted Statue Centered Layout (Pin 2 Inspiration) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Big Editorial Monogram / Sculpted Bust Emblem */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
                <div className="relative group">
                  {/* Glowing Ruby Silhouette Card */}
                  <div className="w-52 h-64 rounded-3xl bg-gradient-to-b from-wine-700 via-wine-900 to-midnight-950 p-1 border-2 border-wine-500/50 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
                    
                    {/* Sculptural Bust Background Graphic */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(196,59,67,0.5),rgba(15,23,42,0.95))] opacity-90" />
                    
                    <div className="relative z-10 flex flex-col items-center justify-center p-4">
                      {/* Stylized Classical Emblem / Bust Monogram */}
                      <div className="w-24 h-24 rounded-2xl bg-midnight-950/80 border border-coral-400/50 flex items-center justify-center shadow-glow-wine mb-3">
                        <span className="font-heading text-4xl font-extrabold text-coral-300">
                          {user?.full_name ? user.full_name.charAt(0) : 'S'}
                        </span>
                      </div>
                      <span className="font-heading text-sm font-bold tracking-wider text-white uppercase">
                        {user?.full_name || 'STUDENT'}
                      </span>
                      <span className="text-[10px] text-coral-300 font-mono mt-0.5">
                        {profile?.institution || 'Autonomous Engineering College'}
                      </span>
                      <div className="mt-3 px-3 py-1 rounded-full bg-wine-950/80 border border-wine-500/40 text-[10px] text-emerald font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Profile Complete: {completionPct}%</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Right Column: High Fashion Editorial Profile Typography (Pin 4 fonts) */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <span className="text-xs text-coral-400 font-semibold tracking-widest uppercase font-mono">
                    ACADEMIC ACCREDITATION & TALENT SPECIFICATION
                  </span>
                  <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white mt-1">
                    {profile?.full_name || user?.full_name || 'Scholar Candidate'}
                  </h1>
                  <p className="text-sm text-slate-300 font-light mt-2 max-w-2xl leading-relaxed">
                    {profile?.course || 'B.Tech'} in {profile?.specialization || 'Computer Science and Engineering'} â€¢ Class of {profile?.graduation_year || 2027}. Pursuing {profile?.target_role || 'Software Development Intern'}.
                  </p>
                </div>

                {/* Quick Credentials Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-midnight-800">
                  <div className="glass-panel p-3.5 rounded-xl">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Academics</span>
                    <span className="text-lg font-heading font-bold text-white">
                      {profile?.cgpa ? `${profile.cgpa} CGPA` : `${profile?.percentage || 80}%`}
                    </span>
                    <span className="text-[9px] text-slate-500 block">Scale 10.0</span>
                  </div>

                  <div className="glass-panel p-3.5 rounded-xl">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Annual Income</span>
                    <span className="text-lg font-heading font-bold text-coral-300">
                      â‚¹{profile?.family_income_inr ? profile.family_income_inr.toLocaleString('en-IN') : '3,20,000'}
                    </span>
                    <span className="text-[9px] text-slate-500 block">Income Certificate Verified</span>
                  </div>

                  <div className="glass-panel p-3.5 rounded-xl">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Social Category</span>
                    <span className="text-lg font-heading font-bold text-white">
                      {profile?.category || 'OBC'}
                    </span>
                    <span className="text-[9px] text-slate-500 block">Quota Eligible</span>
                  </div>

                  <div className="glass-panel p-3.5 rounded-xl">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Domicile</span>
                    <span className="text-lg font-heading font-bold text-white">
                      {profile?.state || 'Telangana'}
                    </span>
                    <span className="text-[9px] text-slate-500 block">{profile?.district || 'Hyderabad'}</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Detailed Sections Grid */}
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 py-10 space-y-10">
          
          {/* Section 1: Academic Records & Exam Credentials */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-wine-900/60 border border-wine-500/30 flex items-center justify-center text-coral-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">Academic History & Entrance Ranks</h3>
                  <p className="text-xs text-slate-400">Standardized scores used for scholarship merit calculation</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-midnight-900/70 p-4 rounded-2xl border border-midnight-700/60">
                <span className="text-[10px] font-mono uppercase text-coral-400 block mb-1">Undergraduate Degree</span>
                <p className="text-sm font-bold text-white">{profile?.institution || 'Osmania University'}</p>
                <p className="text-xs text-slate-400 mt-1">{profile?.course} ({profile?.specialization})</p>
                <p className="text-xs text-slate-300 mt-2 font-mono">Current Year: {profile?.current_year || 3} of 4 â€¢ Backlogs: {profile?.backlogs || 0}</p>
              </div>

              <div className="bg-midnight-900/70 p-4 rounded-2xl border border-midnight-700/60">
                <span className="text-[10px] font-mono uppercase text-coral-400 block mb-1">Entrance Examination</span>
                <p className="text-sm font-bold text-white">{profile?.entrance_exam || 'State Engineering CET'}</p>
                <p className="text-xs text-slate-400 mt-1">Merit Rank Quota Applied</p>
                <p className="text-xs text-emerald mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Allotment Order On File
                </p>
              </div>

              <div className="bg-midnight-900/70 p-4 rounded-2xl border border-midnight-700/60">
                <span className="text-[10px] font-mono uppercase text-coral-400 block mb-1">Mandatory Certificates</span>
                <ul className="text-xs space-y-1.5 mt-2">
                  <li className="flex items-center gap-1.5 text-slate-300">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${profile?.has_income_certificate ? 'text-emerald' : 'text-slate-500'}`} />
                    <span>Income Certificate (MeeSeva/Tahsil)</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-slate-300">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${profile?.has_category_certificate ? 'text-emerald' : 'text-slate-500'}`} />
                    <span>Caste / Category Certificate</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-slate-300">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${profile?.has_bank_account ? 'text-emerald' : 'text-slate-500'}`} />
                    <span>Aadhaar-Seeded Bank Passbook</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2: Technical Skills Inventory & Target Role Fit */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-wine-900/60 border border-wine-500/30 flex items-center justify-center text-coral-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">Technical Skills & Career Goals</h3>
                  <p className="text-xs text-slate-400">Target Role: <strong className="text-coral-300">{profile?.target_role || 'Software Development Intern'}</strong></p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {skills.map(s => (
                <div
                  key={s.id || s.skill_name}
                  className="px-3.5 py-1.5 rounded-xl bg-midnight-900 border border-midnight-700 text-xs flex items-center gap-2 text-slate-200"
                >
                  <span className="w-2 h-2 rounded-full bg-coral-400"></span>
                  <span className="font-semibold">{s.skill_name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({s.proficiency})</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-midnight-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Internship Work Mode</span>
                <span className="font-bold text-white capitalize">{goals?.internship_mode || 'Hybrid / Remote'}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Target Locations</span>
                <span className="font-bold text-white">Hyderabad, Bengaluru, Remote</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Minimum Stipend Expectation</span>
                <span className="font-bold text-coral-400">â‚¹{goals?.min_stipend_inr ? goals.min_stipend_inr.toLocaleString('en-IN') : '15,000'}/month</span>
              </div>
            </div>
          </div>

          {/* Section 3: Privacy, Consent & Account Management */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="font-heading text-base font-bold text-white">Data Privacy & Account Controls</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              In accordance with Indian Digital Personal Data Protection (DPDP) compliance, you hold complete ownership of your academic records, questionnaire responses, and AI conversation history.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={api.exportData()}
                className="px-4 py-2 rounded-xl bg-midnight-900 border border-midnight-700 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-coral-400" />
                <span>Export My Complete Data (JSON)</span>
              </a>
              <button
                onClick={async () => {
                  if (confirm('Are you sure you want to permanently delete your account and all records? This action is irreversible.')) {
                    await api.deleteAccount();
                    window.location.href = '/';
                  }
                }}
                className="px-4 py-2 rounded-xl border border-red-500/30 hover:bg-red-950/40 text-xs font-semibold text-red-400 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account & Purge Records</span>
              </button>
            </div>
          </div>

        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-2xl bg-midnight-950 border border-wine-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-midnight-800 mb-6">
                <h3 className="font-heading text-xl font-bold text-white">Edit Academic & Personal Profile</h3>
                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editForm.full_name || ''}
                      onChange={e => setEditForm({ ...editForm, full_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={editForm.phone || ''}
                      onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Education Level</label>
                    <select
                      value={editForm.education_level || 'UG'}
                      onChange={e => setEditForm({ ...editForm, education_level: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                    >
                      <option value="School">School (10th/12th)</option>
                      <option value="Diploma">Diploma</option>
                      <option value="UG">UG (B.Tech / B.Sc / BA)</option>
                      <option value="PG">PG (M.Tech / MCA / MBA)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">CGPA (Scale 10)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.cgpa || ''}
                      onChange={e => setEditForm({ ...editForm, cgpa: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Family Income (â‚¹/yr)</label>
                    <input
                      type="number"
                      value={editForm.family_income_inr || ''}
                      onChange={e => setEditForm({ ...editForm, family_income_inr: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Institution / University</label>
                    <input
                      type="text"
                      value={editForm.institution || ''}
                      onChange={e => setEditForm({ ...editForm, institution: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Target Career Role</label>
                    <input
                      type="text"
                      value={editForm.target_role || ''}
                      onChange={e => setEditForm({ ...editForm, target_role: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">State of Domicile</label>
                    <input
                      type="text"
                      value={editForm.state || ''}
                      onChange={e => setEditForm({ ...editForm, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Social Category</label>
                    <select
                      value={editForm.category || 'General'}
                      onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                    >
                      <option value="General">General / Open</option>
                      <option value="OBC">OBC (Other Backward Classes)</option>
                      <option value="SC">SC (Scheduled Castes)</option>
                      <option value="ST">ST (Scheduled Tribes)</option>
                      <option value="EWS">EWS (Economically Weaker Section)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-midnight-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2 rounded-xl border border-midnight-700 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-wine-600 to-coral-500 text-white font-bold shadow-glow-wine"
                  >
                    {saveLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

