import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Download,
  Play,
  Pause,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Briefcase,
  BookOpen,
  Target,
  ArrowRight,
  Code,
  DollarSign,
  Layers,
  FileText,
  Clock,
  Compass,
  Home,
  Check,
  X,
  ExternalLink,
  Cpu
} from 'lucide-react';

const SLIDES_COUNT = 10;

export default function PresentationDeckPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  // Slide 4 interactive simulation state
  const [simIncomeCert, setSimIncomeCert] = useState(false);
  const [simCasteCert, setSimCasteCert] = useState(true);

  // Slide 6 interactive skill gap state
  const [hasPyTorch, setHasPyTorch] = useState(false);
  const [hasPandas, setHasPandas] = useState(false);

  const containerRef = useRef(null);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setShowNotes((prev) => !prev);
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, isFullscreen]);

  // Auto-play interval
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentSlide((prev) => (prev < SLIDES_COUNT - 1 ? prev + 1 : 0));
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const nextSlide = () => {
    if (currentSlide < SLIDES_COUNT - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Simulated score for slide 4
  const simulatedScore = simIncomeCert && simCasteCert ? 100 : 48;
  const simulatedStatus = simIncomeCert && simCasteCert ? 'likely_eligible' : 'conditionally_eligible';

  // Speaker notes per slide
  const speakerNotes = [
    "Slide 1: Welcome judges. Introduce Saarathi as India's first deterministic AI companion taking students from scholarship eligibility to employment. Over 40 million students in higher education lack an integrated navigator.",
    "Slide 2: Emphasize the problem. Over ₹2,500 Cr in grants go unclaimed due to fragmented portals and opaque rejection fine-print. Unrealistic internship matches waste weeks, and curricula don't match industry skills.",
    "Slide 3: Present our core architecture: 4 Integrated Pillars. Deterministic Engine provides trust; Live Ingestion provides freshness; Skill-Gap provides direction; OpenRouter AI provides 24/7 copilot guidance.",
    "Slide 4: Show the mathematical formula and demonstrate the interactive conditionality toggle. Missing documents cap scores strictly between 35%-58%, completely eliminating false hopes and hallucinations.",
    "Slide 5: Highlight our live scrapers. 13 verified scholarships harvested from Buddy4Study and 35 active tech internships loaded from Unstop directly in our local SQLite database.",
    "Slide 6: Explain our Skill-Gap Radar. We map missing skills directly to 100% free SWAYAM and NPTEL courses sequenced step-by-step, respecting the student's language (Telugu/English) and budget.",
    "Slide 7: Showcase real-time streaming with OpenRouter. Features: Model Fallback Chain, 100% Offline Demo Mode, Zero PII sent to LLM, and anti-hallucination verification against SQLite.",
    "Slide 8: Highlight closing the loop: ATS Heuristic Resume review, 1-click PDFKit vector PDF generation, and Kanban application tracker with proactive Deadline Radar.",
    "Slide 9: Walk through the business model: Free tier for mass adoption, ₹99/mo Student Pro micro-subscription, and institutional B2B college analytics for NAAC/NIRF reporting.",
    "Slide 10: Conclude with the vision: Empowering 40M+ Indian scholars. Invite the judges to test the live demo and ask questions."
  ];

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-midnight-950 text-slate-100 flex flex-col justify-between overflow-hidden select-none"
      style={{
        backgroundImage:
          'radial-gradient(circle at 15% 20%, rgba(138, 28, 48, 0.25) 0%, transparent 40%), radial-gradient(circle at 85% 80%, rgba(250, 148, 126, 0.15) 0%, transparent 40%)'
      }}
    >
      {/* Top Header & Controls */}
      <header className="relative z-20 px-6 sm:px-10 py-4 flex items-center justify-between border-b border-midnight-800/80 bg-midnight-950/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-coral-300 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-wider text-coral-400 uppercase">
              SAARATHI KEYNOTE DECK
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-wine-900/80 text-coral-200 border border-wine-500/40 font-mono">
              AY 2026-27
            </span>
          </div>
        </div>

        {/* Slide Counter & Download CTA */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-slate-400">
            Slide <strong className="text-white font-bold">{currentSlide + 1}</strong> of {SLIDES_COUNT}
          </span>
          <a
            href="/api/v1/presentation/download"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-wine-600 to-coral-500 hover:brightness-110 text-white font-semibold text-xs shadow-glow-wine transition-all"
            download
            title="Download native PowerPoint PPTX file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download .PPTX</span>
          </a>
        </div>
      </header>

      {/* Top Slide Progress Bar */}
      <div className="w-full bg-midnight-900 h-1 relative z-20">
        <div
          className="bg-gradient-to-r from-wine-500 via-coral-400 to-emerald h-full transition-all duration-500 ease-out"
          style={{ width: `${((currentSlide + 1) / SLIDES_COUNT) * 100}%` }}
        />
      </div>

      {/* Central Slide Stage with Modern Layouts & Internet Photos */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10 relative z-10 overflow-hidden">
        
        {/* ======================================================== */}
        {/* SLIDE 1: Title & Hero Vision */}
        {/* ======================================================== */}
        {currentSlide === 0 && (
          <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fadeIn">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-wine-950/80 border border-wine-500/40 text-xs font-mono font-semibold text-coral-300">
                <Sparkles className="w-3.5 h-3.5 text-coral-400 animate-pulse" />
                <span>STUDENT CAREER & SCHOLARSHIP INTELLIGENCE • AY 2026-27</span>
              </div>

              <div className="space-y-2">
                <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
                  SAARATHI <span className="text-coral-400 font-normal font-sans">(సారథి)</span>
                </h1>
                <p className="font-heading text-xl sm:text-3xl font-semibold bg-gradient-to-r from-coral-300 via-white to-slate-200 bg-clip-text text-transparent">
                  From Eligibility to Employment
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                India’s first production-grade deterministic AI student career companion. Predicts scholarship eligibility with explainable logic, bridges skill gaps with accredited courses, and copilots students from day one to their first job offer.
              </p>

              {/* 3 Quick Pillar Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-midnight-900/90 border border-midnight-700/80">
                  <div className="text-emerald font-bold text-xs">✓ 100% Deterministic</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Zero AI legal hallucination</div>
                </div>
                <div className="p-3 rounded-xl bg-midnight-900/90 border border-midnight-700/80">
                  <div className="text-coral-400 font-bold text-xs">✓ Live Multi-Source Ingestion</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Buddy4Study & Unstop feeds</div>
                </div>
                <div className="p-3 rounded-xl bg-midnight-900/90 border border-midnight-700/80">
                  <div className="text-sky-400 font-bold text-xs">✓ OpenRouter AI Copilot</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Streaming SSE & Offline Mode</div>
                </div>
              </div>
            </div>

            {/* Right: High-Res Internet Photo */}
            <div className="lg:col-span-5 relative group">
              <div className="relative rounded-2xl overflow-hidden border border-wine-500/30 shadow-2xl bg-midnight-900">
                <img
                  src="/images/presentation/hero_students.jpg"
                  alt="Students Collaborating in Tech Lab"
                  className="w-full h-80 sm:h-96 object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-midnight-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-midnight-950/80 backdrop-blur-md border border-midnight-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Empowering 40M+ Students</div>
                    <div className="text-[10px] text-slate-400">Classroom to Career Roadmap</div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald/20 text-emerald border border-emerald/30 font-semibold">
                    LIVE MVP
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SLIDE 2: The Core Problem */}
        {/* ======================================================== */}
        {currentSlide === 1 && (
          <div className="max-w-6xl w-full mx-auto space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-mono font-bold text-coral-400 uppercase tracking-widest">
                THE CRISIS IN HIGHER EDUCATION
              </span>
              <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-white mt-1">
                Students Do Not Lack Ambition. They Lack Clarity.
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Photo */}
              <div className="lg:col-span-4 relative rounded-2xl overflow-hidden border border-red-500/30 shadow-2xl bg-midnight-900 flex flex-col">
                <img
                  src="/images/presentation/problem_confusion.jpg"
                  alt="Overwhelmed student with paperwork"
                  className="w-full h-56 sm:h-64 object-cover"
                />
                <div className="p-4 bg-midnight-900/90 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-red-400">₹2,500+ Cr Unclaimed Annually</div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Lapsed government & corporate scholarship funds due to obscure eligibility fine-print and fragmented portals.
                    </p>
                  </div>
                  <div className="mt-3 text-[10px] font-mono text-slate-500">Source: UGC & MHRD Reports</div>
                </div>
              </div>

              {/* Right: 3 Problem Cards */}
              <div className="lg:col-span-8 flex flex-col justify-between gap-4">
                <div className="p-5 rounded-2xl bg-midnight-900/80 border border-midnight-700/80 flex items-start gap-4 hover:border-red-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-sm shrink-0">
                    01
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">Fragmented & Opaque Schemes</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-red-900/40 text-red-300 font-mono">
                        Information Asymmetry
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Over 250+ central & state schemes exist in siloed PDFs with complex eligibility formulas. Students get rejected simply because of 1 missing document or income ceiling calculation error.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-midnight-900/80 border border-midnight-700/80 flex items-start gap-4 hover:border-amber-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
                    02
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">Superficial Internship Matching</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 font-mono">
                        Wasted Applications
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Mainstream job boards present vanity match scores without verifying CGPA, backlogs, branch relevance, or distinguishing required vs. preferred technical skills.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-midnight-900/80 border border-midnight-700/80 flex items-start gap-4 hover:border-sky-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-sm shrink-0">
                    03
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">Unstructured Skill Gap Delta</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-sky-900/40 text-sky-300 font-mono">
                        Curriculum Mismatch
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Students know what role they aspire to (e.g. AI/ML, Data Analyst), but have no actionable, accredited learning roadmap tailored to their daily time, budget, and language.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SLIDE 3: The Solution Architecture */}
        {/* ======================================================== */}
        {currentSlide === 2 && (
          <div className="max-w-6xl w-full mx-auto space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-mono font-bold text-coral-400 uppercase tracking-widest">
                THE SAARATHI SOLUTION
              </span>
              <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-white mt-1">
                One Unified Ecosystem: 4 Integrated Pillars
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Pillar 1 */}
              <div className="p-5 rounded-2xl bg-midnight-900/90 border border-emerald/40 flex flex-col justify-between hover:border-emerald transition-all shadow-lg">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald/10 border border-emerald/30 flex items-center justify-center text-emerald">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald/10 text-emerald font-bold">
                      PILLAR 01
                    </span>
                    <h3 className="text-base font-bold text-white mt-2">Deterministic Eligibility</h3>
                    <p className="text-xs text-coral-400 font-medium">Mathematical Rule Engine</p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Multi-factor scoring (Academics 25%, Income 25%, Education 25%, Category 15%, State 10%). Strict gatekeeping blocks false guarantees.
                  </p>
                </div>
                <div className="pt-4 border-t border-midnight-800 text-[11px] font-mono text-emerald font-semibold">
                  Zero Hallucination
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-5 rounded-2xl bg-midnight-900/90 border border-coral-400/40 flex flex-col justify-between hover:border-coral-400 transition-all shadow-lg">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-coral-400/10 border border-coral-400/30 flex items-center justify-center text-coral-400">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-coral-400/10 text-coral-400 font-bold">
                      PILLAR 02
                    </span>
                    <h3 className="text-base font-bold text-white mt-2">Live Ingestion Radar</h3>
                    <p className="text-xs text-coral-400 font-medium">Automated Web Scraping</p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Subagents scrape & normalize live feeds from Buddy4Study, Unstop, AICTE, and NSP. Timestamped provenance and stale-link detection.
                  </p>
                </div>
                <div className="pt-4 border-t border-midnight-800 text-[11px] font-mono text-coral-400 font-semibold">
                  Live Verified Data
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="p-5 rounded-2xl bg-midnight-900/90 border border-sky-400/40 flex flex-col justify-between hover:border-sky-400 transition-all shadow-lg">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-400/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-400/10 text-sky-400 font-bold">
                      PILLAR 03
                    </span>
                    <h3 className="text-base font-bold text-white mt-2">Skill-Gap & Courses</h3>
                    <p className="text-xs text-coral-400 font-medium">NPTEL & FreeCodeCamp</p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Analyzes target role requirements vs. student profile. Maps precise missing skills into sequenced free accredited courses in Telugu & English.
                  </p>
                </div>
                <div className="pt-4 border-t border-midnight-800 text-[11px] font-mono text-sky-400 font-semibold">
                  Free Accredited Paths
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="p-5 rounded-2xl bg-midnight-900/90 border border-purple-400/40 flex flex-col justify-between hover:border-purple-400 transition-all shadow-lg">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/30 flex items-center justify-center text-purple-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-400/10 text-purple-400 font-bold">
                      PILLAR 04
                    </span>
                    <h3 className="text-base font-bold text-white mt-2">OpenRouter AI Copilot</h3>
                    <p className="text-xs text-coral-400 font-medium">Streaming Assistant & Tutor</p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Fast streaming explanations, ATS resume heuristic review, and 7/30/90-day action plans. Features 100% offline deterministic demo mode.
                  </p>
                </div>
                <div className="pt-4 border-t border-midnight-800 text-[11px] font-mono text-purple-400 font-semibold">
                  Resilient AI Architecture
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SLIDE 4: Deterministic Eligibility Engine (Interactive) */}
        {/* ======================================================== */}
        {currentSlide === 3 && (
          <div className="max-w-6xl w-full mx-auto space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-mono font-bold text-coral-400 uppercase tracking-widest">
                CORE ALGORITHMIC RIGOR
              </span>
              <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-white mt-1">
                Deterministic Scoring: Why AI Never Evaluates Eligibility
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Formula & Weighting Card */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-midnight-900/90 border border-midnight-700/80 space-y-4">
                <h3 className="text-base font-bold text-coral-300">
                  Mathematical Scoring Matrix (100 Point Scale)
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-midnight-950/80 border border-midnight-800 text-xs">
                    <span className="font-medium text-slate-200">Academic Marks / CGPA Cutoff</span>
                    <span className="font-mono font-bold text-emerald">25% (Mandatory)</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-midnight-950/80 border border-midnight-800 text-xs">
                    <span className="font-medium text-slate-200">Annual Family Income Ceiling</span>
                    <span className="font-mono font-bold text-emerald">25% (Mandatory)</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-midnight-950/80 border border-midnight-800 text-xs">
                    <span className="font-medium text-slate-200">Education Level & Study Year</span>
                    <span className="font-mono font-bold text-emerald">25% (Mandatory)</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-midnight-950/80 border border-midnight-800 text-xs">
                    <span className="font-medium text-slate-200">Category / Reservation Rules</span>
                    <span className="font-mono font-bold text-sky-400">15% (Conditional)</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-midnight-950/80 border border-midnight-800 text-xs">
                    <span className="font-medium text-slate-200">State / Domicile Location Match</span>
                    <span className="font-mono font-bold text-sky-400">10% (Conditional)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-wine-950/60 border border-wine-500/30 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-coral-300">Strict Gatekeeper Invariant:</strong> If any mandatory criterion fails (e.g. family income exceeds ₹2.5L), the status is hard-locked to <code className="text-red-400 bg-red-950 px-1 py-0.5 rounded">likely_ineligible</code> regardless of overall score.
                </div>
              </div>

              {/* Interactive Simulation Widget */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-midnight-900/90 border border-coral-400/40 space-y-4 flex flex-col justify-between shadow-glow-wine">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-coral-400 uppercase">
                      LIVE INTERACTIVE SIMULATION
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-midnight-800 text-slate-300 font-mono">
                      PM-USP Scheme
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">
                    Document Readiness Impact
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Toggle document verification status to observe strict conditionality capping:
                  </p>
                </div>

                {/* Toggles */}
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-midnight-950 border border-midnight-800 cursor-pointer hover:border-slate-700 transition-colors">
                    <span className="text-xs font-medium text-slate-200">Income Certificate Verified</span>
                    <input
                      type="checkbox"
                      checked={simIncomeCert}
                      onChange={(e) => setSimIncomeCert(e.target.checked)}
                      className="w-4 h-4 accent-wine-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-midnight-950 border border-midnight-800 cursor-pointer hover:border-slate-700 transition-colors">
                    <span className="text-xs font-medium text-slate-200">Category Certificate Verified</span>
                    <input
                      type="checkbox"
                      checked={simCasteCert}
                      onChange={(e) => setSimCasteCert(e.target.checked)}
                      className="w-4 h-4 accent-wine-600 rounded"
                    />
                  </label>
                </div>

                {/* Result Display */}
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  simulatedScore === 100
                    ? 'bg-emerald/10 border-emerald/40 text-emerald'
                    : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                }`}>
                  <div>
                    <div className="text-[10px] font-mono uppercase font-bold">Computed Eligibility</div>
                    <div className="text-lg font-bold font-heading">{simulatedStatus.replace('_', ' ').toUpperCase()}</div>
                  </div>
                  <div className="text-3xl font-extrabold font-heading">
                    {simulatedScore}%
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 italic text-center">
                  {simulatedScore === 100
                    ? '✓ All documents verified. Full pass rate granted.'
                    : '⚠️ Capped at 48% (Never 80%+) because income document is pending!'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SLIDE 5: Live Ingestion Pipeline & Scrapers */}
        {/* ======================================================== */}
        {currentSlide === 4 && (
          <div className="max-w-6xl w-full mx-auto space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-mono font-bold text-coral-400 uppercase tracking-widest">
                REAL-TIME OPPORTUNITY RADAR
              </span>
              <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-white mt-1">
                Autonomous Multi-Source Ingestion & Verification
              </h2>
            </div>

            {/* Pipeline Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-midnight-900/90 border border-midnight-700/80">
                <span className="text-xl font-heading font-extrabold text-coral-400">01</span>
                <h4 className="text-sm font-bold text-white mt-1">Targeted Scrapers</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Subagents harvest live feeds from Buddy4Study, Unstop, AICTE & NSP with automated rate-limiting.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-midnight-900/90 border border-midnight-700/80">
                <span className="text-xl font-heading font-extrabold text-coral-400">02</span>
                <h4 className="text-sm font-bold text-white mt-1">Schema Normalizer</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Extracts deadlines, CGPA cutoffs, stipends, and document checklists into structured JSON schemas.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-midnight-900/90 border border-midnight-700/80">
                <span className="text-xl font-heading font-extrabold text-coral-400">03</span>
                <h4 className="text-sm font-bold text-white mt-1">Freshness & De-dup</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Detects updated deadlines, merges duplicates, flags dead links, and maintains ISO fetch timestamps.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-midnight-900/90 border border-midnight-700/80">
                <span className="text-xl font-heading font-extrabold text-coral-400">04</span>
                <h4 className="text-sm font-bold text-white mt-1">Targeted Recalc</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Queued events trigger recomputation only for affected student profiles, keeping cache instant.
                </p>
              </div>
            </div>

            {/* Live Database Metrics Card */}
            <div className="p-6 rounded-2xl bg-midnight-900/90 border border-wine-500/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-coral-300 uppercase">
                  PRODUCTION DATABASE INTEGRITY (LOCAL SQLITE STORE)
                </span>
                <span className="text-xs font-mono text-emerald flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald animate-ping" />
                  PERSISTENT & SEEDED
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2">
                <div>
                  <div className="text-3xl sm:text-4xl font-heading font-extrabold text-white">13</div>
                  <div className="text-xs font-semibold text-coral-300 mt-1">Verified Schemes</div>
                  <div className="text-[10px] text-slate-400">PM-USP, AICTE Swanath, Post-Matric</div>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-heading font-extrabold text-white">35</div>
                  <div className="text-xs font-semibold text-coral-300 mt-1">Active Internships</div>
                  <div className="text-[10px] text-slate-400">AI/ML, Data Analyst, Web, Cloud</div>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-heading font-extrabold text-white">42</div>
                  <div className="text-xs font-semibold text-coral-300 mt-1">Accredited Courses</div>
                  <div className="text-[10px] text-slate-400">SWAYAM, NPTEL, freeCodeCamp</div>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-heading font-extrabold text-emerald">100%</div>
                  <div className="text-xs font-semibold text-emerald mt-1">Data Provenance</div>
                  <div className="text-[10px] text-slate-400">Authoritative URLs & Last-verified</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SLIDE 6: Skill-Gap Analyzer & Learning Paths */}
        {/* ======================================================== */}
        {currentSlide === 5 && (
          <div className="max-w-6xl w-full mx-auto space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-mono font-bold text-coral-400 uppercase tracking-widest">
                CLOSING THE EMPLOYABILITY DELTA
              </span>
              <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-white mt-1">
                Skill-Gap Analyzer & Accredited Learning Pathways
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left: Internet Photo of student coding */}
              <div className="lg:col-span-4 relative rounded-2xl overflow-hidden border border-sky-500/30 shadow-2xl bg-midnight-900 flex flex-col">
                <img
                  src="/images/presentation/student_coding.jpg"
                  alt="Student coding and learning"
                  className="w-full h-56 sm:h-64 object-cover"
                />
                <div className="p-4 bg-midnight-900/90 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-sky-400">Personalized Learning Radar</div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Sequenced learning paths matching daily hours (5h/wk), language preference (Telugu & English), and ₹0 budget.
                    </p>
                  </div>
                  <div className="mt-3 text-[10px] font-mono text-emerald">100% Free Accredited Providers</div>
                </div>
              </div>

              {/* Right: Concrete Case Study & Interactive Skill Toggle */}
              <div className="lg:col-span-8 p-6 rounded-2xl bg-midnight-900/90 border border-midnight-700/80 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-coral-400 uppercase">
                      CASE STUDY: AI / MACHINE LEARNING INTERN
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-midnight-800 text-slate-300 font-mono">
                      Google / ISRO Target Role
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">
                    Role Requirement Decomposition & Gaps
                  </h3>
                </div>

                {/* Matched vs Missing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-emerald/10 border border-emerald/30">
                    <div className="text-xs font-bold text-emerald">VERIFIED MATCHED SKILLS (40%)</div>
                    <ul className="text-xs text-slate-300 mt-1.5 space-y-1">
                      <li>• Python Programming (Intermediate)</li>
                      <li>• Git & GitHub Versioning</li>
                      <li>• Basic Linear Algebra</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30">
                    <div className="text-xs font-bold text-red-300">IDENTIFIED SKILL GAPS (60%)</div>
                    <ul className="text-xs text-slate-300 mt-1.5 space-y-1">
                      <li>• Pandas / NumPy Data Wrangling</li>
                      <li>• Deep Learning with PyTorch</li>
                      <li>• Model Deployment (FastAPI / Render)</li>
                    </ul>
                  </div>
                </div>

                {/* 3 Step Pathway */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-coral-300">Curated 3-Step Bridging Pathway:</div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-midnight-950 border border-midnight-800 text-xs">
                    <div>
                      <strong className="text-white">Step 1: Python for Data Science</strong>
                      <span className="text-slate-400 block text-[11px]">NPTEL / Swayam • 3 weeks • Free Verified</span>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] rounded bg-emerald/10 text-emerald font-mono font-bold">
                      ACCREDITED
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-midnight-950 border border-midnight-800 text-xs">
                    <div>
                      <strong className="text-white">Step 2: Deep Learning with PyTorch</strong>
                      <span className="text-slate-400 block text-[11px]">freeCodeCamp • 4 weeks • Hands-on Projects</span>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] rounded bg-sky-400/10 text-sky-400 font-mono font-bold">
                      HANDS-ON
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-midnight-950 border border-midnight-800 text-xs">
                    <div>
                      <strong className="text-white">Step 3: Capstone Model Deployment</strong>
                      <span className="text-slate-400 block text-[11px]">FastAPI + Render • 1 week • Portfolio Asset</span>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] rounded bg-purple-400/10 text-purple-400 font-mono font-bold">
                      PROOF OF WORK
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SLIDE 7: OpenRouter AI Copilot & Resilient Architecture */}
        {/* ======================================================== */}
        {currentSlide === 6 && (
          <div className="max-w-6xl w-full mx-auto space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-mono font-bold text-coral-400 uppercase tracking-widest">
                HACKATHON-READY AI ARCHITECTURE
              </span>
              <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-white mt-1">
                Production OpenRouter AI with Deterministic Fallbacks
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Photo */}
              <div className="lg:col-span-4 relative rounded-2xl overflow-hidden border border-purple-500/30 shadow-2xl bg-midnight-900 flex flex-col">
                <img
                  src="/images/presentation/copilot_mentor.jpg"
                  alt="AI Mentorship & Career Guidance"
                  className="w-full h-56 sm:h-64 object-cover"
                />
                <div className="p-4 bg-midnight-900/90 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-purple-400">Bilingual: Telugu & English</div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Explains eligibility nuances in natural conversational Telugu or English, acting as a personal guidance counselor.
                    </p>
                  </div>
                  <div className="mt-3 text-[10px] font-mono text-coral-400">Streaming SSE Sub-50ms</div>
                </div>
              </div>

              {/* Right: 4 AI Resiliency Features */}
              <div className="lg:col-span-8 flex flex-col justify-between gap-3">
                <div className="p-4 rounded-xl bg-midnight-900/80 border border-midnight-700/80 flex items-start gap-4 hover:border-sky-500/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-sky-950 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">OpenRouter Model Fallback Chain</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-sky-900/40 text-sky-300 font-mono">
                        High Availability
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Calls OpenAI-compatible OpenRouter API. If the primary model encounters rate limits or quota exhaustion, it falls back seamlessly to secondary configured models.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-midnight-900/80 border border-midnight-700/80 flex items-start gap-4 hover:border-emerald/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-emerald/10 border border-emerald/30 flex items-center justify-center text-emerald shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">100% Offline Demo Mode (AI_DEMO_MODE=true)</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald/10 text-emerald font-mono">
                        Stage Reliability
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Guarantees the pitch will never fail even if Wi-Fi drops. 5 pre-validated golden prompts answer seamlessly with zero external API calls.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-midnight-900/80 border border-midnight-700/80 flex items-start gap-4 hover:border-amber-500/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">Zero PII Leakage Privacy Guard</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 font-mono">
                        Student Privacy
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      No student names, emails, phone numbers, or exact financial figures are ever passed into LLM prompts. Only anonymized academic and skill tags are transmitted.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-midnight-900/80 border border-midnight-700/80 flex items-start gap-4 hover:border-coral-400/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-wine-950 border border-wine-500/30 flex items-center justify-center text-coral-400 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">Anti-Hallucination Verification Layer</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-wine-900/40 text-coral-300 font-mono">
                        Truth Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      All dates, scheme names, and financial amounts generated in AI explanations are verified against authoritative database records before rendering.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SLIDE 8: ATS Resume Builder & Application Tracker */}
        {/* ======================================================== */}
        {currentSlide === 7 && (
          <div className="max-w-6xl w-full mx-auto space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-mono font-bold text-coral-400 uppercase tracking-widest">
                COMPLETING THE CAREER CYCLE
              </span>
              <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-white mt-1">
                ATS Resume Builder & Kanban Application Tracker
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* ATS Resume Builder Card */}
              <div className="p-6 rounded-2xl bg-midnight-900/90 border border-midnight-700/80 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-coral-400">
                    <FileText className="w-5 h-5" />
                    <h3 className="text-base font-bold text-white">ATS Heuristic Resume Engine</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Evaluates resume compatibility against industry standards before submission:
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-midnight-950 border border-midnight-800">
                    <div className="text-xs font-bold text-white">Role-Specific Keyword Analysis</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Compares student projects and coursework against targeted internship JD requirements.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-midnight-950 border border-midnight-800">
                    <div className="text-xs font-bold text-white">Formatting & Length Checks</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Warns against tables, multi-column layouts, and unreadable graphics that trip ATS parsers.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-midnight-950 border border-midnight-800">
                    <div className="text-xs font-bold text-white">Production PDFKit Export</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Generates clean, selectable, single-page vector PDFs directly from database profile with 1 click.
                    </p>
                  </div>
                </div>

                <div className="pt-2 text-[11px] font-mono text-emerald flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  Export directly at <code className="bg-midnight-800 px-1 py-0.5 rounded text-white">/resume</code>
                </div>
              </div>

              {/* Kanban Application Tracker Card */}
              <div className="p-6 rounded-2xl bg-midnight-900/90 border border-midnight-700/80 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sky-400">
                    <Layers className="w-5 h-5" />
                    <h3 className="text-base font-bold text-white">Application Radar & Kanban Tracker</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    End-to-end status tracking from discovery to offer:
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-midnight-950 border border-slate-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-300">To Apply (3)</span>
                      <span className="text-[11px] text-slate-500 block">AICTE Swanath, Google STEP</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">Pending</span>
                  </div>

                  <div className="p-3 rounded-xl bg-midnight-950 border border-sky-500/40 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-sky-400">Applied (4)</span>
                      <span className="text-[11px] text-slate-400 block">TCS Research Intern, Post-Matric</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-sky-400">Active</span>
                  </div>

                  <div className="p-3 rounded-xl bg-midnight-950 border border-amber-500/40 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-amber-400">Under Review / Interview (2)</span>
                      <span className="text-[11px] text-slate-400 block">ISRO Fellowship, Razorpay</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400">Next Round</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald/10 border border-emerald/40 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald">Offer Extended (1)</span>
                      <span className="text-[11px] text-slate-300 block">Accenture Cloud Intern (₹30k/mo)</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald">Placed 🎉</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] font-mono text-sky-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Proactive Deadline Radar countdowns
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SLIDE 9: Business Model & Scalability */}
        {/* ======================================================== */}
        {currentSlide === 8 && (
          <div className="max-w-6xl w-full mx-auto space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-mono font-bold text-coral-400 uppercase tracking-widest">
                SUSTAINABILITY & REVENUE MODEL
              </span>
              <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-white mt-1">
                Freemium B2C & Institutional B2B Monetization
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {/* Free Tier */}
              <div className="p-6 rounded-2xl bg-midnight-900/80 border border-midnight-700/80 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase font-mono">Free Forever</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-heading font-extrabold text-white">₹0</span>
                    <span className="text-xs text-slate-400">/ forever</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Democratizing opportunity discovery for all underprivileged students.
                  </p>

                  <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">✓ Basic student profile</li>
                    <li className="flex items-center gap-2">✓ 5 scheme predictions / month</li>
                    <li className="flex items-center gap-2">✓ 5 internship match reports</li>
                    <li className="flex items-center gap-2">✓ Basic skill-gap analysis</li>
                    <li className="flex items-center gap-2">✓ Community forums</li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-midnight-800 text-[11px] font-mono text-slate-400 text-center">
                  Always accessible to all
                </div>
              </div>

              {/* Student Pro */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-wine-950/80 via-midnight-900/90 to-midnight-900 border-2 border-coral-400/80 flex flex-col justify-between shadow-glow-wine relative transform sm:-translate-y-2">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-wine-600 to-coral-500 text-[10px] font-mono font-bold text-white uppercase shadow-md">
                  MOST POPULAR
                </div>

                <div>
                  <h3 className="text-sm font-bold text-coral-400 uppercase font-mono">Student Pro</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-heading font-extrabold text-white">₹99</span>
                    <span className="text-xs text-slate-300">/ month (or ₹999/yr)</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2">
                    Pocket-money pricing tuned specifically for Indian college students.
                  </p>

                  <ul className="mt-6 space-y-2.5 text-xs text-white">
                    <li className="flex items-center gap-2 text-coral-300">✓ Unlimited scheme predictions</li>
                    <li className="flex items-center gap-2 text-coral-300">✓ Unlimited internship fit scores</li>
                    <li className="flex items-center gap-2 text-coral-300">✓ OpenRouter AI bilingual copilot</li>
                    <li className="flex items-center gap-2 text-coral-300">✓ ATS resume builder & PDF export</li>
                    <li className="flex items-center gap-2 text-coral-300">✓ Priority deadline radar alerts</li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-wine-500/30 text-[11px] font-mono text-coral-300 text-center font-bold">
                  Less than the price of a notebook
                </div>
              </div>

              {/* College Enterprise */}
              <div className="p-6 rounded-2xl bg-midnight-900/80 border border-midnight-700/80 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-sky-400 uppercase font-mono">College Enterprise</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-heading font-extrabold text-white">Custom</span>
                    <span className="text-xs text-slate-400">/ college / year</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Institutional SaaS for engineering and diploma universities.
                  </p>

                  <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">✓ Centralized placement dashboard</li>
                    <li className="flex items-center gap-2">✓ NAAC / NIRF accreditation data</li>
                    <li className="flex items-center gap-2">✓ Bulk student cohort onboarding</li>
                    <li className="flex items-center gap-2">✓ Custom department skill analytics</li>
                    <li className="flex items-center gap-2">✓ Dedicated account manager</li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-midnight-800 text-[11px] font-mono text-sky-400 text-center">
                  High-ACV B2B revenue driver
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SLIDE 10: Roadmap, Impact & Closing Vision */}
        {/* ======================================================== */}
        {currentSlide === 9 && (
          <div className="max-w-6xl w-full mx-auto space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-mono font-bold text-coral-400 uppercase tracking-widest">
                FUTURE ROADMAP & SOCIAL IMPACT
              </span>
              <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-white mt-1">
                Empowering 40 Million Indian Higher Education Students
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left: Internet Photo of success/employment */}
              <div className="lg:col-span-4 relative rounded-2xl overflow-hidden border border-emerald/30 shadow-2xl bg-midnight-900 flex flex-col">
                <img
                  src="/images/presentation/success_employment.jpg"
                  alt="Student Graduation and Employment Success"
                  className="w-full h-56 sm:h-64 object-cover"
                />
                <div className="p-4 bg-midnight-900/90 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-emerald">From Classroom to Career</div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Transforming higher education with transparent guidance, equal access, and career mobility for every deserving student.
                    </p>
                  </div>
                  <div className="mt-3 text-[10px] font-mono text-slate-400">Social Mobility • Scalable SaaS</div>
                </div>
              </div>

              {/* Right: 3 Roadmap Horizons */}
              <div className="lg:col-span-8 flex flex-col justify-between gap-4">
                <div className="p-5 rounded-2xl bg-midnight-900/90 border border-emerald/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald/10 text-emerald font-bold">
                      PHASE 1 (COMPLETED - MVP)
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Present</span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">Full-Stack Foundation & Deterministic Engine</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Production SQLite database, 13 verified schemes, 35 internships, OpenRouter AI streaming, bilingual Telugu/English support, ATS PDF resume builder.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-midnight-900/90 border border-midnight-700/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-coral-400/10 text-coral-400 font-bold">
                      PHASE 2 (Q2 2026 - SCALING)
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Next Quarter</span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">WhatsApp Deadline Radar & DigiLocker Verification</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Proactive SMS/WhatsApp reminders 48 hours before scheme deadlines. Instant 1-click document authentication via National DigiLocker API.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-midnight-900/90 border border-midnight-700/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-400/10 text-sky-400 font-bold">
                      PHASE 3 (Q3-Q4 2026 - ECOSYSTEM)
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Pan-India</span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">Direct Recruiter Portal & Pan-India State Expansion</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Verified candidate matching for corporate hiring partners. Automated ingestion of all 28 state scholarship portals and university placement cells.
                  </p>
                </div>
              </div>
            </div>

            {/* Closing CTA Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-wine-900/60 via-midnight-900 to-midnight-900 border border-wine-500/40 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Experience Saarathi Live Today</h4>
                <p className="text-xs text-slate-400">Explore the interactive dashboard, test our deterministic engine, and try the AI assistant.</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-wine-600 to-coral-500 hover:brightness-110 text-white font-semibold text-xs shadow-glow-wine transition-all flex items-center gap-1.5"
                >
                  <span>Launch Live App</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Presenter Speaker Notes Drawer (Toggled by 'N' key or button) */}
      {showNotes && (
        <div className="relative z-30 bg-midnight-900/95 border-t border-midnight-700/80 p-4 px-6 sm:px-10 animate-slideUp">
          <div className="max-w-6xl mx-auto flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-coral-400" />
                <span className="text-xs font-mono font-bold text-coral-400 uppercase">
                  PRESENTER TALKING POINTS (SLIDE {currentSlide + 1})
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  • Suggested Pace: 60-90 seconds
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-body">
                {speakerNotes[currentSlide]}
              </p>
            </div>
            <button
              onClick={() => setShowNotes(false)}
              className="p-1 rounded-lg hover:bg-midnight-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Floating Control Bar */}
      <footer className="relative z-20 px-6 sm:px-10 py-4 flex items-center justify-between border-t border-midnight-800/80 bg-midnight-950/70 backdrop-blur-md">
        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="p-2.5 rounded-xl border border-midnight-700 bg-midnight-900/60 hover:bg-midnight-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 transition-all"
            title="Previous slide (Left Arrow)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentSlide === SLIDES_COUNT - 1}
            className="p-2.5 rounded-xl border border-midnight-700 bg-midnight-900/60 hover:bg-midnight-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 transition-all"
            title="Next slide (Right Arrow or Space)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Center: Slide indicator pills */}
        <div className="hidden sm:flex items-center gap-1.5">
          {Array.from({ length: SLIDES_COUNT }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide
                  ? 'w-7 bg-coral-400 shadow-glow-wine'
                  : 'w-2 bg-midnight-700 hover:bg-slate-500'
              }`}
              title={`Jump to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Right Tools: Play/Pause, Speaker Notes, Fullscreen */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2.5 rounded-xl border border-midnight-700 text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
              isPlaying
                ? 'bg-wine-900 text-coral-200 border-wine-500/50 shadow-glow-wine'
                : 'bg-midnight-900/60 hover:bg-midnight-800 text-slate-300'
            }`}
            title="Toggle slideshow autoplay"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="hidden md:inline">{isPlaying ? 'Playing' : 'Autoplay'}</span>
          </button>

          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`p-2.5 rounded-xl border border-midnight-700 text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
              showNotes
                ? 'bg-wine-900 text-coral-200 border-wine-500/50'
                : 'bg-midnight-900/60 hover:bg-midnight-800 text-slate-300'
            }`}
            title="Toggle Speaker Notes (N)"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden md:inline">Notes</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl border border-midnight-700 bg-midnight-900/60 hover:bg-midnight-800 text-slate-300 transition-all"
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </footer>
    </div>
  );
}
