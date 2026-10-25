import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  GraduationCap,
  Award,
  Briefcase,
  Target,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export default function OnboardingPage() {
  const { user, refreshProfile } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Form states for sections A - E
  const [formA, setFormA] = useState({
    education_level: 'UG',
    institution: 'Osmania University College of Engineering',
    course: 'B.Tech',
    specialization: 'Computer Science and Engineering',
    current_year: '3',
    graduation_year: '2027',
    cgpa: '8.4',
    percentage: '80',
    backlogs: '0',
    state: 'Telangana',
    district: 'Hyderabad',
  });

  const [formB, setFormB] = useState({
    family_income_inr: '320000',
    category: 'OBC',
    gender: 'Female',
    disability_status: 'None',
    has_income_certificate: true,
    has_category_certificate: true,
    has_bank_account: true,
  });

  const [formC, setFormC] = useState({
    target_roles: ['Software Development Intern'],
    internship_mode: 'hybrid',
    min_stipend_inr: '15000',
    preferred_locations: ['Hyderabad', 'Bengaluru', 'Remote'],
    start_timeline: 'immediately',
  });

  const [formD, setFormD] = useState({
    skills: [
      { name: 'Python', proficiency: 'Intermediate' },
      { name: 'Git', proficiency: 'Intermediate' },
      { name: 'SQL', proficiency: 'Beginner' },
      { name: 'HTML/CSS', proficiency: 'Intermediate' },
    ],
    daily_time_minutes: 90,
    budget_inr: 500,
    learning_language: 'both',
  });

  const handleNext = async () => {
    setSaving(true);
    try {
      // Save locally first so data is never lost
      const draft = { formA, formB, formC, formD, currentStep: step };
      localStorage.setItem('saarathi_onboarding_draft', JSON.stringify(draft));

      if (step === 1) await api.autosaveQuestionnaire('A', formA);
      if (step === 2) await api.autosaveQuestionnaire('B', formB);
      if (step === 3) await api.autosaveQuestionnaire('C', formC);
      if (step === 4) await api.autosaveQuestionnaire('D', formD);
      
      if (step < 5) {
        setStep(prev => prev + 1);
      } else {
        try {
          await refreshProfile();
        } catch (e) {
          console.warn('Profile refresh notice:', e);
        }
        navigate('/dashboard');
      }
    } catch (err) {
      console.warn('Backend sync notice during onboarding:', err);
      // Gracefully advance so user is never blocked or stuck
      if (step < 5) {
        setStep(prev => prev + 1);
      } else {
        navigate('/dashboard');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full space-y-8">
        
        {/* Step Indicator Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-wine-700/60 p-1.5 border border-coral-400/30 inline-flex items-center justify-center">
              <img src="/logo.svg" alt="Saarathi" className="w-full h-full" />
            </span>
            <span className="font-heading text-xl font-bold tracking-wider text-white">SAARATHI</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-white">
            Student Onboarding & Questionnaire
          </h2>
          <p className="text-xs text-slate-400">
            Step {step} of 5: {
              step === 1 ? 'Academic Background' :
              step === 2 ? 'Scholarship & Welfare Credentials' :
              step === 3 ? 'Career Targets & Work Mode' :
              step === 4 ? 'Skills & Learning Preferences' :
              'Review & Calculate Initial Matches'
            }
          </p>

          {/* Stepper Progress Bar */}
          <div className="w-full bg-midnight-900 h-1.5 rounded-full overflow-hidden mt-4">
            <div
              className="bg-gradient-to-r from-wine-500 to-coral-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Card Body */}
        <div className="glass-panel p-8 rounded-3xl border border-wine-500/30 space-y-6">
          
          {/* STEP 1: Academic Background */}
          {step === 1 && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Education Level</label>
                  <select
                    value={formA.education_level}
                    onChange={e => setFormA({ ...formA, education_level: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                  >
                    <option value="School">School (10th/12th)</option>
                    <option value="Diploma">Diploma / Polytechnic</option>
                    <option value="UG">Undergraduate (UG)</option>
                    <option value="PG">Postgraduate (PG)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Current Year</label>
                  <input
                    type="number"
                    value={formA.current_year}
                    onChange={e => setFormA({ ...formA, current_year: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">College / University Name</label>
                <input
                  type="text"
                  value={formA.institution}
                  onChange={e => setFormA({ ...formA, institution: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Degree Course</label>
                  <input
                    type="text"
                    value={formA.course}
                    onChange={e => setFormA({ ...formA, course: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Specialization / Branch</label>
                  <input
                    type="text"
                    value={formA.specialization}
                    onChange={e => setFormA({ ...formA, specialization: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">CGPA (Scale 10)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formA.cgpa}
                    onChange={e => setFormA({ ...formA, cgpa: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">State of Study</label>
                  <input
                    type="text"
                    value={formA.state}
                    onChange={e => setFormA({ ...formA, state: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Scholarship Profile */}
          {step === 2 && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Annual Family Income (â‚¹)</label>
                <input
                  type="number"
                  value={formB.family_income_inr}
                  onChange={e => setFormB({ ...formB, family_income_inr: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Used exclusively to check government scheme income ceilings.</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Social Category</label>
                  <select
                    value={formB.category}
                    onChange={e => setFormB({ ...formB, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                  >
                    <option value="General">General / Open</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Gender</label>
                  <select
                    value={formB.gender}
                    onChange={e => setFormB({ ...formB, gender: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-midnight-800">
                <span className="font-semibold text-slate-300 block">Verification Documents Status:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formB.has_income_certificate}
                    onChange={e => setFormB({ ...formB, has_income_certificate: e.target.checked })}
                    className="rounded bg-midnight-900 border-midnight-700 text-wine-600"
                  />
                  <span>I possess a valid government Income Certificate (MeeSeva/Tahsil)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formB.has_bank_account}
                    onChange={e => setFormB({ ...formB, has_bank_account: e.target.checked })}
                    className="rounded bg-midnight-900 border-midnight-700 text-wine-600"
                  />
                  <span>I have an active, Aadhaar-seeded bank account for scholarship DBT</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Career Goals */}
          {step === 3 && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Primary Target Career Role</label>
                <input
                  type="text"
                  value={formC.target_roles[0]}
                  onChange={e => setFormC({ ...formC, target_roles: [e.target.value] })}
                  className="w-full px-3 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Internship Mode</label>
                  <select
                    value={formC.internship_mode}
                    onChange={e => setFormC({ ...formC, internship_mode: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                  >
                    <option value="hybrid">Hybrid</option>
                    <option value="remote">Remote Only</option>
                    <option value="on-site">On-Site</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Min Desired Stipend (â‚¹/mo)</label>
                  <input
                    type="number"
                    value={formC.min_stipend_inr}
                    onChange={e => setFormC({ ...formC, min_stipend_inr: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Skills & Learning */}
          {step === 4 && (
            <div className="space-y-4 text-xs">
              <span className="font-semibold text-slate-300 block">Current Programming & Technical Skills:</span>
              <div className="flex flex-wrap gap-2">
                {formD.skills.map((s, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl bg-midnight-900 border border-midnight-700 text-coral-300 font-mono">
                    {s.name} ({s.proficiency})
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-midnight-800">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Daily Study Time</label>
                  <select
                    value={formD.daily_time_minutes}
                    onChange={e => setFormD({ ...formD, daily_time_minutes: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                  >
                    <option value={30}>30 Minutes</option>
                    <option value={60}>1 Hour</option>
                    <option value={90}>1.5 Hours</option>
                    <option value={120}>2+ Hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Preferred Language</label>
                  <select
                    value={formD.learning_language}
                    onChange={e => setFormD({ ...formD, learning_language: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                  >
                    <option value="both">English & Telugu (Both)</option>
                    <option value="english">English Only</option>
                    <option value="telugu">Telugu Only</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Final Review & Generate Dashboard */}
          {step === 5 && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-wine-600 to-coral-500 p-3 mx-auto shadow-glow-wine flex items-center justify-center text-white">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white">
                Ready to Launch Your Career Radar
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Saarathi will now evaluate your {formA.course} credentials against our database of verified central scholarships, state ePASS programs, and active internships.
              </p>
              <div className="p-3 bg-midnight-900 rounded-xl border border-midnight-800 text-[11px] text-coral-300 font-mono">
                âœ“ Mathematical Determinism â€¢ Zero Hallucinations â€¢ Attribution Traceable
              </div>
            </div>
          )}

          {/* Wizard Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-midnight-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(prev => prev - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-midnight-700 text-xs font-semibold text-slate-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={handleNext}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-wine-600 to-coral-500 hover:brightness-110 text-white font-bold text-xs shadow-glow-wine"
            >
              <span>{step === 5 ? 'Launch Dashboard' : 'Save & Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

