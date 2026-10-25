import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroScene3D from '../components/3d/HeroScene3D';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  AlertCircle,
  GraduationCap,
  Briefcase,
  Target,
  BookOpen,
  FileText,
  Clock,
  Layers,
  HelpCircle,
  ChevronDown,
  Quote
} from 'lucide-react';

export default function LandingPage({ onOpenAiAssistant }) {
  const { lang, t } = useLanguage();
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: 'Does Saarathi guarantee that I will receive the scholarship or get hired?',
      a: 'No. Saarathi measures deterministic profile fit against published eligibility rules and role requirements. We never guarantee legal approval, payment, or selection. Official government and employer portals remain the sole authority.'
    },
    {
      q: 'How does Saarathi calculate my eligibility score?',
      a: 'We evaluate every mandatory condition (education level 25%, academic marks 25%, family income 25%, category 15%, state 10%). If any mandatory condition fails, the candidate is flagged as likely ineligible regardless of total points.'
    },
    {
      q: 'Where does Saarathi get its scholarship and internship listings?',
      a: 'All data is attributed to official portals including the National Scholarship Portal (scholarships.gov.in), AICTE, SWAYAM/NPTEL, state portals (ePASS), and verified corporate career links with visible "Last Verified" timestamps.'
    },
    {
      q: 'Is my personal and sensitive data (family income, category) secure?',
      a: 'Yes. We strictly practice data minimization under Indian DPDP guidelines. Your category and income data are stored in encrypted SQL tables and never exposed, sold, or shared with third parties.'
    },
    {
      q: 'Can I use Saarathi in Telugu (తెలుగు)?',
      a: 'Yes! Saarathi was built bilingual from day one. You can switch between English and Telugu anytime using the top globe icon, with full support for explanations, notifications, and AI guidance.'
    },
    {
      q: 'How does the OpenRouter AI integration work?',
      a: 'Saarathi connects via OpenRouter with a multi-model fallback chain. AI explains eligibility and tutors your preparation; deterministic code decides eligibility and scores. When offline, it runs in a 100% reliable demo mode.'
    }
  ];

  return (
    <div className="min-h-screen bg-midnight-950 text-slate-100 flex flex-col">
      <Navbar onOpenAiAssistant={onOpenAiAssistant} />

      {/* Hero Section with Interactive 3D WebGL Canvas (Pin 1 & Pin 2 references) */}
      <section className="relative overflow-hidden pt-8 pb-20 md:pt-16 md:pb-32 border-b border-midnight-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(146,27,47,0.25),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Mission, Typography (Pin 4), CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-midnight-900 border border-wine-500/40 text-coral-300 text-xs font-semibold shadow-glow-wine">
                <ShieldCheck className="w-4 h-4 text-emerald" />
                <span>{t('trust_indicator_1')}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-coral-400"></span>
                <span>{lang === 'te' ? 'పారదర్శక అంచనా' : 'Zero Fake Vacancies'}</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
                {t('hero_title').split(' ').map((word, idx) => (
                  idx % 3 === 2 ? (
                    <span key={idx} className="gradient-heading font-black"> {word} </span>
                  ) : (
                    <span key={idx}> {word}</span>
                  )
                ))}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                {t('hero_sub')}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-wine-600 via-wine-500 to-coral-500 hover:from-wine-500 hover:to-coral-400 text-white font-bold text-base shadow-glow-wine flex items-center justify-center gap-3 group transition-all transform hover:-translate-y-0.5"
                >
                  <span>{t('cta_primary')}</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl glass-panel glass-panel-hover text-slate-200 font-semibold text-base flex items-center justify-center gap-2"
                >
                  <span>{t('cta_secondary')}</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-midnight-800 text-left">
                <div>
                  <p className="text-xl sm:text-2xl font-bold font-heading text-white">100%</p>
                  <p className="text-xs text-slate-400">Attributed Sources</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold font-heading text-coral-400">Zero</p>
                  <p className="text-xs text-slate-400">Invented Deadlines</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold font-heading text-emerald">Bilingual</p>
                  <p className="text-xs text-slate-400">English & తెలుగు</p>
                </div>
              </div>

            </div>

            {/* Right Column: 3D Celestial Astrolabe / Guidance Canvas (Pin 1 & Pin 2) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl glass-panel p-2 shadow-2xl border border-wine-500/30 overflow-hidden">
                <div className="h-[440px] md:h-[500px] w-full">
                  <HeroScene3D />
                </div>

                {/* Floating Live Data Badge (Pin 1 Interactive UI Element) */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-midnight-950/90 border border-wine-400/30 backdrop-blur-md shadow-glow-wine">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-coral-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-coral-400" />
                      Live Companion Radar
                    </span>
                    <span className="text-[10px] bg-emerald/20 text-emerald px-2 py-0.5 rounded-full font-bold">
                      Match: 92%
                    </span>
                  </div>
                  <p className="text-xs font-medium text-white">Central Sector Scheme (PM-USP)</p>
                  <p className="text-[10px] text-slate-400 mt-1">₹12,000/yr • Academic & Income criteria verified</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 bg-midnight-900/50 border-b border-midnight-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold tracking-widest uppercase text-coral-400 font-mono">The Reality for Indian Students</h2>
            <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Students do not lack opportunities. They lack clarity.
            </h3>
            <p className="text-slate-400 text-sm sm:text-base">
              Over ₹1,000 Crore in government scholarships and thousands of verified internships go unclaimed every year because students get overwhelmed by fragmented notices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-wine-900/80 border border-wine-500/40 flex items-center justify-center text-coral-300">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-heading text-xl font-bold text-white">Scattered Information</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Rules live across 40+ state and central portals, university circulars, and PDF gazettes. Students miss deadlines simply because they never saw the notice.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-wine-900/80 border border-wine-500/40 flex items-center justify-center text-coral-300">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-heading text-xl font-bold text-white">Cryptic Eligibility Rules</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Complex income caps, category norms, domicile clauses, and grading scales make it nearly impossible for a student to know if they actually qualify before applying.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-wine-900/80 border border-wine-500/40 flex items-center justify-center text-coral-300">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="font-heading text-xl font-bold text-white">No Skill-Gap Roadmap</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Generic rejection emails never explain why an internship fit failed. Students are left guessing which specific framework or project they need to learn next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 border-b border-midnight-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold tracking-widest uppercase text-coral-400 font-mono">Engineered For Truth</h2>
            <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Seven Pillars of Career Certainty
            </h3>
            <p className="text-slate-400 text-sm sm:text-base">
              Every feature provides deterministic checks, transparent reasoning, and actionable steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="glass-panel p-7 rounded-2xl glass-panel-hover">
              <GraduationCap className="w-8 h-8 text-coral-400 mb-4" />
              <h4 className="font-heading text-lg font-bold text-white mb-2">Scheme Eligibility Predictor</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Scores mandatory criteria (income, marks, domicile) and identifies missing documents like income certificates before you apply.
              </p>
            </div>

            <div className="glass-panel p-7 rounded-2xl glass-panel-hover">
              <Briefcase className="w-8 h-8 text-coral-400 mb-4" />
              <h4 className="font-heading text-lg font-bold text-white mb-2">Internship Fit Radar</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Weighted fit (40% required skills, 25% preferred, 20% academics, 15% role) with clear matched vs missing skills bars.
              </p>
            </div>

            <div className="glass-panel p-7 rounded-2xl glass-panel-hover">
              <Target className="w-8 h-8 text-coral-400 mb-4" />
              <h4 className="font-heading text-lg font-bold text-white mb-2">Skill-Gap Analyzer</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Calculates your readiness % against role taxonomy and prescribes high-impact portfolio projects with GitHub templates.
              </p>
            </div>

            <div className="glass-panel p-7 rounded-2xl glass-panel-hover">
              <BookOpen className="w-8 h-8 text-coral-400 mb-4" />
              <h4 className="font-heading text-lg font-bold text-white mb-2">Curated Course Recommender</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Prioritizes free NPTEL, SWAYAM, and official tutorials matched to your budget and chosen language (English & Telugu).
              </p>
            </div>

            <div className="glass-panel p-7 rounded-2xl glass-panel-hover">
              <Calendar className="w-8 h-8 text-coral-400 mb-4" />
              <h4 className="font-heading text-lg font-bold text-white mb-2">Preparation Copilot</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Custom 7, 30, and 90-day daily schedules with persistent task checklists, aptitude quizzes, and mock interview drills.
              </p>
            </div>

            <div className="glass-panel p-7 rounded-2xl glass-panel-hover">
              <FileText className="w-8 h-8 text-coral-400 mb-4" />
              <h4 className="font-heading text-lg font-bold text-white mb-2">ATS Resume Builder & PDF</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Heuristic keyword scanner evaluating target role alignment and generating clean, employer-ready PDF downloads.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-midnight-900/40 border-b border-midnight-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold tracking-widest uppercase text-coral-400 font-mono">Workflow</h2>
            <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              How Saarathi Guides You
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="relative glass-panel p-6 rounded-2xl space-y-3">
              <span className="font-heading text-4xl font-black text-wine-500/40">01</span>
              <h4 className="font-bold text-white text-base">Create Student Profile</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Enter your academic marks, income bracket, state, and target career interests.</p>
            </div>

            <div className="relative glass-panel p-6 rounded-2xl space-y-3">
              <span className="font-heading text-4xl font-black text-wine-500/40">02</span>
              <h4 className="font-bold text-white text-base">Discover Opportunities</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Saarathi scans attributed government schemes and corporate listings against your profile.</p>
            </div>

            <div className="relative glass-panel p-6 rounded-2xl space-y-3">
              <span className="font-heading text-4xl font-black text-wine-500/40">03</span>
              <h4 className="font-bold text-white text-base">Understand Gaps</h4>
              <p className="text-slate-400 text-xs leading-relaxed">See exact reasons for eligibility and missing skills with plain-language explanations.</p>
            </div>

            <div className="relative glass-panel p-6 rounded-2xl space-y-3">
              <span className="font-heading text-4xl font-black text-wine-500/40">04</span>
              <h4 className="font-bold text-white text-base">Execute Your Roadmap</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Follow daily task plans, build required portfolio projects, and track applications on Kanban.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Illustrative Student Stories (Section 8: Clearly labelled illustrative) */}
      <section className="py-24 border-b border-midnight-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-wine-950 text-coral-300 border border-wine-800">
              Illustrative Student Scenarios
            </span>
            <h3 className="font-heading text-3xl font-extrabold text-white mt-2">
              How Real Students Benefit from Saarathi
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-7 rounded-2xl space-y-4">
              <Quote className="w-8 h-8 text-wine-400" />
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "I assumed government scholarships were only for topper students with 95%+. Saarathi showed me my 8.2 CGPA matched the Central Sector Scheme (PM-USP) and alerted me to get my MeeSeva income certificate in time."
              </p>
              <div className="pt-3 border-t border-midnight-800">
                <p className="text-sm font-bold text-white">Priya V.</p>
                <p className="text-[11px] text-coral-400">B.Tech 3rd Year • Osmania University, Telangana</p>
              </div>
            </div>

            <div className="glass-panel p-7 rounded-2xl space-y-4">
              <Quote className="w-8 h-8 text-wine-400" />
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "Other job boards spam you with unpaid random roles. Saarathi's fit radar showed I had Python and Git but was missing SQL for backend roles. The 7-day copilot roadmap helped me bridge the gap."
              </p>
              <div className="pt-3 border-t border-midnight-800">
                <p className="text-sm font-bold text-white">Rahul K.</p>
                <p className="text-[11px] text-coral-400">Diploma to B.Tech • Visakhapatnam, AP</p>
              </div>
            </div>

            <div className="glass-panel p-7 rounded-2xl space-y-4">
              <Quote className="w-8 h-8 text-wine-400" />
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "Being able to read explanations in Telugu gave my parents confidence that the scheme rules were real. The deadline radar ensured we submitted before the November portal cutoff."
              </p>
              <div className="pt-3 border-t border-midnight-800">
                <p className="text-sm font-bold text-white">Sneha M.</p>
                <p className="text-[11px] text-coral-400">MCA Student • Warangal, Telangana</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Section 22) */}
      <section id="pricing" className="py-24 bg-midnight-900/30 border-b border-midnight-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold tracking-widest uppercase text-coral-400 font-mono">Simple & Accessible</h2>
            <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Empowering Every Indian Student
            </h3>
            <p className="text-slate-400 text-sm">Free access forever for core eligibility. Upgrade for advanced AI tutoring.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Free */}
            <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between">
              <div>
                <h4 className="font-heading text-xl font-bold text-white">Free Student</h4>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-extrabold text-white">₹0</span>
                  <span className="text-slate-400 text-xs"> / forever</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald" /> Full Student Profile & Questionnaire</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald" /> 5 Scheme Eligibility Predictions</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald" /> 5 Internship Fit Calculations</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald" /> Basic Skill-Gap Radar</li>
                </ul>
              </div>
              <Link to="/signup" className="mt-8 block text-center py-3 rounded-xl border border-midnight-600 hover:bg-midnight-800 text-white font-semibold text-xs transition-colors">
                Get Started Free
              </Link>
            </div>

            {/* Student Pro */}
            <div className="glass-wine-card p-8 rounded-3xl flex flex-col justify-between relative shadow-glow-wine border-2 border-wine-500">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-wine-600 to-coral-500 text-white text-[10px] uppercase font-bold tracking-wider px-3.5 py-1 rounded-full shadow-md">
                Most Popular
              </span>
              <div>
                <h4 className="font-heading text-xl font-bold text-white">Student Pro</h4>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-extrabold text-white">₹99</span>
                  <span className="text-slate-300 text-xs"> / month (or ₹999/yr)</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-200">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-coral-400" /> Unlimited Scheme & Internship Match Scores</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-coral-400" /> AI Resume Review & ATS Keyword Scanner</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-coral-400" /> 7, 30, and 90-Day Copilot Roadmaps</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-coral-400" /> Priority WhatsApp & Email Deadline Alerts</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-coral-400" /> AI Mock Technical Interview Drills</li>
                </ul>
              </div>
              <Link to="/signup" className="mt-8 block text-center py-3 rounded-xl bg-gradient-to-r from-wine-600 to-coral-500 hover:brightness-110 text-white font-bold text-xs shadow-glow-wine transition-all">
                Start 7-Day Pro Trial
              </Link>
            </div>

            {/* College / Institution */}
            <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between">
              <div>
                <h4 className="font-heading text-xl font-bold text-white">College Enterprise</h4>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-white">Custom</span>
                  <span className="text-slate-400 text-xs"> / campus</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald" /> Institutional Placement Dashboard</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald" /> Bulk Student Onboarding & Skill Analytics</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald" /> Campus Opportunity Management</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald" /> Dedicated NAAC/NIRF Accreditation Reports</li>
                </ul>
              </div>
              <Link to="/pricing" className="mt-8 block text-center py-3 rounded-xl border border-midnight-600 hover:bg-midnight-800 text-white font-semibold text-xs transition-colors">
                Contact College Partner Team
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-24 border-b border-midnight-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-xs font-bold tracking-widest uppercase text-coral-400 font-mono">Transparency</h2>
            <h3 className="font-heading text-3xl font-extrabold text-white">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-panel rounded-2xl overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-slate-100 hover:text-coral-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-coral-400 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-midnight-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-midnight-950 via-wine-950/40 to-midnight-950 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Take the guesswork out of your career journey.
          </h2>
          <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
            Create your verified student profile in 3 minutes. Unlock accurate scholarship predictions and role fit calculations today.
          </p>
          <div className="pt-4 flex items-center justify-center">
            <Link
              to="/signup"
              className="px-9 py-4 rounded-2xl bg-gradient-to-r from-wine-600 via-wine-500 to-coral-500 hover:from-wine-500 hover:to-coral-400 text-white font-bold text-base shadow-glow-wine flex items-center gap-2 group transition-all"
            >
              <span>{t('cta_primary')}</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
