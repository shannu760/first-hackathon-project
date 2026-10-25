import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  Sparkles,
  GraduationCap,
  Briefcase,
  Target,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  FileText,
  AlertTriangle,
  Compass
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function DashboardPage({ onOpenAiAssistant }) {
  const { user, profile } = useAuth();
  const { lang, t } = useLanguage();

  const [recommendations, setRecommendations] = useState(null);
  const [copilotPlan, setCopilotPlan] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [recRes, planRes, appRes] = await Promise.all([
          api.getRecommendations(),
          api.getPlan(),
          api.getApplications()
        ]);
        if (recRes.success) setRecommendations(recRes);
        if (planRes.success) setCopilotPlan(planRes.plan || planRes);
        if (appRes.success) setApplications(appRes.applications || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Demo progress data for Recharts
  const chartData = [
    { day: 'Mon', readiness: 65, tasks: 2 },
    { day: 'Tue', readiness: 68, tasks: 3 },
    { day: 'Wed', readiness: 72, tasks: 4 },
    { day: 'Thu', readiness: 75, tasks: 3 },
    { day: 'Fri', readiness: 79, tasks: 5 },
    { day: 'Sat', readiness: 84, tasks: 4 },
    { day: 'Sun', readiness: 86, tasks: 3 },
  ];

  const readinessScore = recommendations?.skillGap?.readiness_score || 82;
  const topSchemes = (recommendations?.schemes || []).slice(0, 3);
  const topInternships = (recommendations?.internships || []).slice(0, 3);
  const planTasks = copilotPlan?.tasks || copilotPlan?.plan?.tasks || [];
  const todayTasks = planTasks.filter(t => !t.is_completed).slice(0, 2);

  return (
    <div className="flex min-h-screen bg-midnight-950 text-slate-100">
      <Sidebar onOpenAiAssistant={onOpenAiAssistant} />

      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Top Greeting & Status Banner */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-midnight-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono uppercase text-coral-400 font-semibold tracking-wider">
                  STUDENT COMMAND CENTER
                </span>
                <span className="text-slate-600">â€¢</span>
                <span className="text-xs text-slate-400">AY 2026-27</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                Welcome back, {user?.full_name?.split(' ')[0] || 'Scholar'}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Target Role: <strong className="text-slate-200">{profile?.target_role || 'Software Development Intern'}</strong> â€¢ {profile?.institution || 'Autonomous Institution'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/recommendations"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-wine-600 to-coral-500 hover:brightness-110 text-white font-semibold text-xs shadow-glow-wine flex items-center gap-2 transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Recommendations</span>
              </Link>
            </div>
          </div>

          {/* Key KPI Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* KPI 1: Career Readiness Score */}
            <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Career Readiness</span>
                <Target className="w-4 h-4 text-coral-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-3xl font-extrabold text-white">{readinessScore}%</span>
                <span className="text-[10px] text-emerald font-semibold flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +12% this week
                </span>
              </div>
              <div className="w-full bg-midnight-900 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-wine-500 to-coral-400 h-full rounded-full" style={{ width: `${readinessScore}%` }} />
              </div>
            </div>

            {/* KPI 2: Eligible Scholarships */}
            <div className="glass-panel p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Eligible Schemes</span>
                <GraduationCap className="w-4 h-4 text-coral-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-3xl font-extrabold text-white">
                  {topSchemes.filter(s => (s.eligibility?.eligibility_status || s.eligibility_status) === 'likely_eligible').length}
                </span>
                <span className="text-xs text-slate-400">worth ₹48,000/yr</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-3 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald" /> Income & marks criteria verified
              </p>
            </div>

            {/* KPI 3: High-Fit Internships */}
            <div className="glass-panel p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Internship Matches</span>
                <Briefcase className="w-4 h-4 text-coral-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-3xl font-extrabold text-white">
                  {topInternships.filter(i => (i.fit?.fit_score ?? i.fit_score ?? 0) >= 60).length}
                </span>
                <span className="text-xs text-slate-400">above 60% fit</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-3 flex items-center gap-1">
                <Clock className="w-3 h-3 text-coral-400" /> {topInternships.length} applications open
              </p>
            </div>

            {/* KPI 4: Active Tracker Applications */}
            <div className="glass-panel p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Applications Tracker</span>
                <FileText className="w-4 h-4 text-coral-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-3xl font-extrabold text-white">{applications.length}</span>
                <span className="text-xs text-slate-400">active items</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-3">
                1 under review â€¢ 1 applied
              </p>
            </div>

          </div>

          {/* Main 2-Column Dashboard Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 8 Cols: Top Recommended Schemes & Internships */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Scholarships Section */}
              <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-5 h-5 text-coral-400" />
                    <h3 className="font-heading text-lg font-bold text-white">Verified Scholarships Matched to Profile</h3>
                  </div>
                  <Link to="/schemes" className="text-xs text-coral-300 hover:text-white flex items-center gap-1">
                    <span>View all</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3.5">
                  {topSchemes.map(sch => (
                    <div
                      key={sch.id}
                      className="p-4 rounded-2xl bg-midnight-900/80 border border-midnight-700/80 hover:border-wine-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 max-w-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald/15 text-emerald border border-emerald/30">
                            Match: {sch.eligibility?.match_score ?? sch.match_score ?? 75}/100
                          </span>
                          <span className="text-[10px] text-slate-400">Deadline: {sch.deadline || 'Unverified'}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{sch.title}</h4>
                        <p className="text-xs text-slate-400">{sch.provider}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <Link
                          to={`/schemes/${sch.id}`}
                          className="px-3.5 py-1.5 rounded-xl border border-midnight-600 hover:bg-midnight-800 text-xs font-semibold text-slate-200"
                        >
                          Check Criteria
                        </Link>
                        <a
                          href={sch.official_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-wine-600 to-coral-500 hover:brightness-110 text-white text-xs font-semibold shadow-glow-wine"
                        >
                          Apply
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internships Section */}
              <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-5 h-5 text-coral-400" />
                    <h3 className="font-heading text-lg font-bold text-white">Target Role Internship Matches</h3>
                  </div>
                  <Link to="/internships" className="text-xs text-coral-300 hover:text-white flex items-center gap-1">
                    <span>View all</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3.5">
                  {topInternships.map(it => (
                    <div
                      key={it.id}
                      className="p-4 rounded-2xl bg-midnight-900/80 border border-midnight-700/80 hover:border-wine-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 max-w-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-wine-900/80 text-coral-300 border border-wine-500/30">
                            Fit: {it.fit?.fit_score ?? it.fit_score ?? 70}%
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize">{it.work_mode} â€¢ {it.location}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{it.title}</h4>
                        <p className="text-xs text-slate-400">{it.company} â€¢ Stipend: {it.stipend_text || 'Disclosed on interview'}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <Link
                          to={`/internships/${it.id}`}
                          className="px-3.5 py-1.5 rounded-xl border border-midnight-600 hover:bg-midnight-800 text-xs font-semibold text-slate-200"
                        >
                          View Fit Breakdown
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Readiness Trend Chart */}
              <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-4">
                <h3 className="font-heading text-base font-bold text-white">7-Day Skill Readiness Trajectory</h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="readinessGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FA947E" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#921B2F" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" stroke="#54596D" fontSize={11} tickLine={false} />
                      <YAxis stroke="#54596D" fontSize={11} tickLine={false} domain={[50, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#333D56', borderRadius: '12px', fontSize: '11px' }} />
                      <Area type="monotone" dataKey="readiness" stroke="#FA947E" strokeWidth={2.5} fillOpacity={1} fill="url(#readinessGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Right 4 Cols: Today's Tasks, Upcoming Deadlines, Quick Actions */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Today's Preparation Tasks */}
              <div className="glass-panel rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-sm font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-coral-400" />
                    Today's Action Items
                  </span>
                  <Link to="/copilot" className="text-[11px] text-coral-300 hover:underline">Full Plan</Link>
                </div>

                {todayTasks.length > 0 ? (
                  <div className="space-y-2.5">
                    {todayTasks.map(task => (
                      <div key={task.id} className="p-3 rounded-xl bg-midnight-900 border border-midnight-700 text-xs space-y-1">
                        <span className="text-[9px] uppercase font-mono text-coral-400 block">Day {task.day_number} â€¢ {task.category}</span>
                        <p className="font-semibold text-white">{task.title}</p>
                        <p className="text-[11px] text-slate-400 leading-snug">{task.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="p-3 rounded-xl bg-midnight-900 border border-midnight-700 text-xs space-y-1">
                      <span className="text-[9px] uppercase font-mono text-coral-400 block">Priority • Career Target</span>
                      <p className="font-semibold text-white">Review Profile Readiness & ATS Resume</p>
                      <p className="text-[11px] text-slate-400 leading-snug">Ensure certificates and technical proficiencies for {profile?.target_role || 'Software Intern'} are updated.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-midnight-900 border border-midnight-700 text-xs space-y-1">
                      <span className="text-[9px] uppercase font-mono text-emerald block">Priority • Schemes</span>
                      <p className="font-semibold text-white">Verify Income & Domicile Certificates</p>
                      <p className="text-[11px] text-slate-400 leading-snug">Keep MeeSeva / Tahsildar certificates ready to convert conditionally eligible schemes to fully eligible.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Deadline Radar Card */}
              <div className="glass-wine-card rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-sm font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-coral-300" />
                    Upcoming Deadlines Radar
                  </span>
                  <Link to="/notifications" className="text-[11px] text-coral-300 hover:underline">Radar</Link>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-midnight-950/60 border border-wine-600/30">
                    <span className="text-[10px] text-coral-300 font-mono font-bold">Nov 15, 2026 (22 Days Left)</span>
                    <p className="font-semibold text-white mt-0.5">Post-Matric Scholarship for SC Students</p>
                    <p className="text-[10px] text-slate-400">Mandatory Caste Certificate Required</p>
                  </div>
                  <div className="p-3 rounded-xl bg-midnight-950/60 border border-wine-600/30">
                    <span className="text-[10px] text-coral-300 font-mono font-bold">Nov 30, 2026 (37 Days Left)</span>
                    <p className="font-semibold text-white mt-0.5">Central Sector Scheme of Scholarship (PM-USP)</p>
                    <p className="text-[10px] text-slate-400">Apply via National Scholarship Portal</p>
                  </div>
                </div>
              </div>

              {/* Quick Navigation Drawer */}
              <div className="glass-panel rounded-3xl p-6 space-y-3">
                <span className="font-heading text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Quick Tools
                </span>
                <Link to="/skills" className="flex items-center justify-between p-3 rounded-xl bg-midnight-900/60 hover:bg-midnight-800 text-xs text-slate-200 transition-colors">
                  <span className="flex items-center gap-2"><Target className="w-4 h-4 text-coral-400" /> Run Skill-Gap Radar</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
                <Link to="/resume" className="flex items-center justify-between p-3 rounded-xl bg-midnight-900/60 hover:bg-midnight-800 text-xs text-slate-200 transition-colors">
                  <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-coral-400" /> Generate ATS PDF Resume</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
                <Link to="/applications" className="flex items-center justify-between p-3 rounded-xl bg-midnight-900/60 hover:bg-midnight-800 text-xs text-slate-200 transition-colors">
                  <span className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-coral-400" /> View Application Kanban</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

