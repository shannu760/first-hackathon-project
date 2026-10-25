import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ExternalLink, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="bg-midnight-950 border-t border-midnight-800 pt-16 pb-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Mission & Trust Banner */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-wine-700/60 p-1.5 border border-coral-400/30">
                <img src="/logo.svg" alt="Saarathi" className="w-full h-full" />
              </div>
              <span className="font-heading text-xl font-bold tracking-wider text-white">SAARATHI</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              {lang === 'te'
                ? 'విద్యార్థుల అర్హత ఆధారంగా స్కాలర్‌షిప్‌లు మరియు ఇంటర్న్‌షిప్‌లను శోధించే నమ్మకమైన వేదిక.'
                : 'A production-grade student companion analyzing profile fit, transparent eligibility logic, and career skill roadmaps from officially attributed sources.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-coral-300 font-medium bg-wine-950/60 p-2.5 rounded-lg border border-wine-800/40">
              <ShieldCheck className="w-4 h-4 text-emerald" />
              <span>Official notices are authoritative. Zero fake vacancies.</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/schemes" className="hover:text-coral-300 transition-colors">Scholarship Predictor</Link></li>
              <li><Link to="/internships" className="hover:text-coral-300 transition-colors">Internship Fit Radar</Link></li>
              <li><Link to="/skills" className="hover:text-coral-300 transition-colors">Skill-Gap Analyzer</Link></li>
              <li><Link to="/courses" className="hover:text-coral-300 transition-colors">Curated Learning Paths</Link></li>
              <li><Link to="/copilot" className="hover:text-coral-300 transition-colors">Preparation Copilot</Link></li>
            </ul>
          </div>

          {/* Col 3: Legal & Privacy */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs tracking-wider uppercase">Compliance & Ethics</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/privacy" className="hover:text-coral-300 transition-colors">Privacy Policy & DPDP</Link></li>
              <li><Link to="/terms" className="hover:text-coral-300 transition-colors">Terms of Service</Link></li>
              <li><a href="https://scholarships.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-coral-300">National Scholarship Portal <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://aicte-india.org" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-coral-300">AICTE Student Portal <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
          </div>

          {/* Col 4: Design Philosophy */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs tracking-wider uppercase">Engineering Philosophy</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Built with mathematical determinism: Match scores indicate profile alignment, not legal approval. AI explains and assists; code decides eligibility.
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Designed with 20-year craftsmanship standards. Three.js WebGL Core & SQLite Engine.
            </p>
          </div>

        </div>

        <div className="pt-8 border-t border-midnight-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Saarathi. All rights reserved. Made for Indian students with care.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse"></span>
            <span>All systems operational • Demo fixtures explicitly labelled</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
