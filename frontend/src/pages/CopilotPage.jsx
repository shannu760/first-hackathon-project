import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  CalendarCheck,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  TrendingUp,
  Layers,
  Award
} from 'lucide-react';

export default function CopilotPage({ onOpenAiAssistant }) {
  const { lang, t } = useLanguage();
  const [plan, setPlan] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(7);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    try {
      const res = await api.getPlan();
      if (res.success && res.plan) {
        setPlan(res.plan);
        setTasks(res.tasks || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async (days) => {
    setGenerating(true);
    setSelectedDuration(days);
    try {
      const res = await api.generatePlan(days);
      if (res.success) {
        setPlan(res.plan);
        setTasks(res.tasks || []);
      }
    } catch (err) {
      alert('Plan generation failed: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const res = await api.toggleTask(taskId);
      if (res.success) {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, is_completed: res.is_completed } : t));
        if (plan) setPlan(prev => ({ ...prev, progress_pct: res.plan_progress_pct }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-midnight-950 text-slate-100">
      <Sidebar onOpenAiAssistant={onOpenAiAssistant} />

      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="pb-6 border-b border-midnight-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CalendarCheck className="w-4 h-4 text-coral-400" />
                <span className="text-xs font-mono uppercase text-coral-400 font-semibold tracking-wider">
                  STRUCTURED DAILY CAREER SPRINT
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                Preparation Copilot & Daily Roadmap
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                A daily progressive checklist covering coding exercises, system concepts, and application outreach.
              </p>
            </div>

            {/* Plan Duration Selector */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-midnight-900 border border-midnight-700 text-xs font-semibold">
              {[7, 30, 90].map(days => (
                <button
                  key={days}
                  onClick={() => handleGeneratePlan(days)}
                  disabled={generating}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    (plan?.duration_days === days)
                      ? 'bg-wine-600 text-white shadow-glow-wine'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {days}-Day Sprint
                </button>
              ))}
            </div>
          </div>

          {/* Active Plan Overview Card */}
          {plan ? (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 border border-wine-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-coral-400 font-bold tracking-wider">
                    {plan.duration_days}-Day Active Schedule â€¢ {plan.target_role || 'Software Intern'}
                  </span>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-white mt-1">
                    {plan.title}
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-mono">Sprint Progress</span>
                  <span className="font-heading text-2xl font-extrabold text-emerald">
                    {plan.progress_pct || 0}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-midnight-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-wine-500 to-coral-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${plan.progress_pct || 0}%` }}
                />
              </div>

              {plan.plan_data?.overview && (
                <p className="text-xs text-slate-300 leading-relaxed pt-2">
                  {plan.plan_data.overview}
                </p>
              )}
            </div>
          ) : (
            <div className="glass-panel p-10 rounded-3xl text-center space-y-4">
              <Sparkles className="w-10 h-10 text-coral-400 mx-auto" />
              <h3 className="font-heading text-lg font-bold text-white">No Active Sprint Plan</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Generate a tailored 7, 30, or 90-day daily preparation schedule designed from your current skill gap.
              </p>
              <button
                onClick={() => handleGeneratePlan(7)}
                disabled={generating}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-wine-600 to-coral-500 text-white font-bold text-xs shadow-glow-wine"
              >
                {generating ? 'Generating with Saarathi AI...' : 'Generate 7-Day Sprint Plan'}
              </button>
            </div>
          )}

          {/* Daily Tasks Interactive Checklist */}
          {tasks.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-heading text-base font-bold text-white">Daily Tasks & Milestones</h3>

              <div className="space-y-3">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                      task.is_completed
                        ? 'bg-midnight-900/40 border-midnight-800 opacity-60'
                        : 'glass-panel border-midnight-700 hover:border-wine-500/50'
                    }`}
                  >
                    <div className="mt-0.5 text-coral-400 shrink-0">
                      {task.is_completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500" />
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-midnight-900 text-coral-300 border border-midnight-700">
                          Day {task.day_number}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">â€¢ {task.category}</span>
                      </div>
                      <h4 className={`text-sm font-bold ${task.is_completed ? 'line-through text-slate-400' : 'text-white'}`}>
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{task.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

