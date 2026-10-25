import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  Kanban,
  Plus,
  Trash2,
  ExternalLink,
  Clock,
  Briefcase,
  GraduationCap,
  ChevronRight,
  X
} from 'lucide-react';

const COLUMNS = ['To Apply', 'Applied', 'Under Review', 'Interview', 'Offer', 'Rejected'];

export default function ApplicationsPage({ onOpenAiAssistant }) {
  const { lang, t } = useLanguage();
  const [applications, setApplications] = useState([]);
  const [kanban, setKanban] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newApp, setNewApp] = useState({
    role_title: '',
    company_or_provider: '',
    opportunity_type: 'internship',
    status: 'To Apply',
    deadline: '',
    notes: '',
    official_url: '',
  });

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await api.getApplications();
      if (res.success) {
        setApplications(res.applications || []);
        setKanban(res.kanban || {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.addApplication(newApp);
      setIsModalOpen(false);
      setNewApp({
        role_title: '',
        company_or_provider: '',
        opportunity_type: 'internship',
        status: 'To Apply',
        deadline: '',
        notes: '',
        official_url: '',
      });
      loadApplications();
    } catch (err) {
      alert('Error creating application: ' + err.message);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.updateApplicationStatus(appId, newStatus);
      loadApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (appId) => {
    if (confirm('Delete this application from your tracker?')) {
      try {
        await api.deleteApplication(appId);
        loadApplications();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-midnight-950 text-slate-100">
      <Sidebar onOpenAiAssistant={onOpenAiAssistant} />

      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="pb-6 border-b border-midnight-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Kanban className="w-4 h-4 text-coral-400" />
                <span className="text-xs font-mono uppercase text-coral-400 font-semibold tracking-wider">
                  OPPORTUNITY OUTCOME TRACKER
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                Application Kanban Board
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Track your active scholarship submissions and corporate internship recruitment stages.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-wine-600 to-coral-500 hover:brightness-110 text-white font-bold text-xs shadow-glow-wine flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Track New Application</span>
            </button>
          </div>

          {/* Kanban Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
            {COLUMNS.map(col => {
              const items = kanban[col] || [];

              return (
                <div key={col} className="bg-midnight-900/60 rounded-2xl border border-midnight-800 p-3.5 space-y-3 min-w-[210px]">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-white font-heading uppercase tracking-wider">{col}</span>
                    <span className="text-[10px] bg-midnight-950 text-coral-300 px-2 py-0.5 rounded-full font-mono border border-midnight-700">
                      {items.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {items.map(app => (
                      <div
                        key={app.id}
                        className="glass-panel p-3.5 rounded-xl border border-midnight-700 hover:border-wine-500/50 transition-all space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-midnight-950 text-coral-300 border border-midnight-800">
                            {app.opportunity_type}
                          </span>
                          <button
                            onClick={() => handleDelete(app.id)}
                            className="text-slate-500 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h4 className="font-bold text-white text-xs leading-snug">{app.role_title}</h4>
                        <p className="text-[11px] text-slate-400">{app.company_or_provider}</p>

                        {app.deadline && (
                          <div className="text-[10px] text-coral-300 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-coral-400" />
                            <span>{app.deadline}</span>
                          </div>
                        )}

                        {app.notes && (
                          <p className="text-[10px] text-slate-400 italic bg-midnight-950/60 p-1.5 rounded">
                            {app.notes}
                          </p>
                        )}

                        {/* Status Change Selector */}
                        <div className="pt-2 border-t border-midnight-800">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            className="w-full bg-midnight-950 text-[10px] border border-midnight-700 rounded-lg p-1 text-slate-300"
                          >
                            {COLUMNS.map(c => (
                              <option key={c} value={c}>Move to: {c}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Application Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
              <div className="w-full max-w-md bg-midnight-950 border border-wine-500/40 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-midnight-800 mb-4">
                  <h3 className="font-heading text-lg font-bold text-white">Add Opportunity to Tracker</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Role / Scheme Title</label>
                    <input
                      type="text"
                      value={newApp.role_title}
                      onChange={e => setNewApp({ ...newApp, role_title: e.target.value })}
                      placeholder="e.g. Backend Python Developer Intern"
                      className="w-full px-3 py-2 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Company / Govt Provider</label>
                    <input
                      type="text"
                      value={newApp.company_or_provider}
                      onChange={e => setNewApp({ ...newApp, company_or_provider: e.target.value })}
                      placeholder="e.g. Ministry of Education or FinTech Corp"
                      className="w-full px-3 py-2 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Type</label>
                      <select
                        value={newApp.opportunity_type}
                        onChange={e => setNewApp({ ...newApp, opportunity_type: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                      >
                        <option value="internship">Internship</option>
                        <option value="scholarship">Scholarship</option>
                        <option value="job">Job</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Status Column</label>
                      <select
                        value={newApp.status}
                        onChange={e => setNewApp({ ...newApp, status: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                      >
                        {COLUMNS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Portal Application URL</label>
                    <input
                      type="url"
                      value={newApp.official_url}
                      onChange={e => setNewApp({ ...newApp, official_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Notes / Action Items</label>
                    <input
                      type="text"
                      value={newApp.notes}
                      onChange={e => setNewApp({ ...newApp, notes: e.target.value })}
                      placeholder="e.g. Online assessment completed on 24th Oct"
                      className="w-full px-3 py-2 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                    />
                  </div>

                  <div className="pt-3 border-t border-midnight-800 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-midnight-700 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-wine-600 to-coral-500 text-white font-bold shadow-glow-wine"
                    >
                      Save to Board
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

