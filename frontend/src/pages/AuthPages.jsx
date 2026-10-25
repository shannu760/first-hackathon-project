import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export function LoginPage({ onOpenAiAssistant }) {
  const { login } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login({ email, password });
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('demo@saarathi.edu.in');
    setPassword('Password@123');
  };

  return (
    <div className="min-h-screen bg-midnight-950 text-slate-100 flex flex-col">
      <Navbar onOpenAiAssistant={onOpenAiAssistant} />

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-wine-500/30 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-heading text-2xl font-bold text-white">Student Login</h2>
            <p className="text-xs text-slate-400">Access your saved schemes, applications, and roadmaps.</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="student@college.edu.in"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white placeholder-slate-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-wine-600 to-coral-500 text-white font-bold shadow-glow-wine hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo User Quick-Fill (Hackathon convenience) */}
          <div className="pt-2 border-t border-midnight-800 text-center">
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-[11px] text-coral-300 hover:underline font-mono inline-flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-coral-400" />
              <span>Fill Seeded Demo Account (Ananya Sharma)</span>
            </button>
          </div>

          <div className="text-center text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-coral-300 font-semibold hover:underline">
              Create free profile
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export function SignupPage({ onOpenAiAssistant }) {
  const { signup } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [consentTerms, setConsentTerms] = useState(true);
  const [consentPrivacy, setConsentPrivacy] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consentTerms || !consentPrivacy) {
      setError('You must accept terms of service and privacy policy to continue.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await signup({
        full_name: fullName,
        email,
        phone,
        password,
        consent_terms: consentTerms,
        consent_privacy: consentPrivacy,
      });
      if (res.success) {
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight-950 text-slate-100 flex flex-col">
      <Navbar onOpenAiAssistant={onOpenAiAssistant} />

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-wine-500/30 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-heading text-2xl font-bold text-white">Create Your Free Profile</h2>
            <p className="text-xs text-slate-400">Zero charges for core eligibility prediction and internship radar.</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Legal Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Ananya Sharma"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="student@college.edu.in"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password (min 8 characters)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-start gap-2 cursor-pointer text-slate-400">
                <input
                  type="checkbox"
                  checked={consentTerms}
                  onChange={e => setConsentTerms(e.target.checked)}
                  className="rounded mt-0.5 bg-midnight-900 border-midnight-700 text-wine-600"
                />
                <span>I agree to the Terms of Service.</span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer text-slate-400">
                <input
                  type="checkbox"
                  checked={consentPrivacy}
                  onChange={e => setConsentPrivacy(e.target.checked)}
                  className="rounded mt-0.5 bg-midnight-900 border-midnight-700 text-wine-600"
                />
                <span>I consent to processing under Indian DPDP privacy principles.</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-wine-600 to-coral-500 text-white font-bold shadow-glow-wine hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Creating...' : 'Create My Free Profile'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-coral-300 font-semibold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export function PricingPage({ onOpenAiAssistant }) {
  return (
    <div className="min-h-screen bg-midnight-950 text-slate-100 flex flex-col">
      <Navbar onOpenAiAssistant={onOpenAiAssistant} />
      <div className="flex-1 max-w-6xl mx-auto px-4 py-16 text-center space-y-6">
        <h1 className="font-heading text-4xl font-extrabold text-white">Transparent Student Pricing</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Free forever for core scholarship predictions and internship fit. Student Pro gives you unlimited AI reviews and roadmaps.
        </p>
        <div className="pt-6">
          <Link to="/signup" className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-wine-600 to-coral-500 text-white font-bold text-sm shadow-glow-wine">
            Get Started Free
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export function PrivacyPage({ onOpenAiAssistant }) {
  return (
    <div className="min-h-screen bg-midnight-950 text-slate-100 flex flex-col">
      <Navbar onOpenAiAssistant={onOpenAiAssistant} />
      <div className="flex-1 max-w-4xl mx-auto px-4 py-16 space-y-6 text-xs text-slate-300 leading-relaxed">
        <h1 className="font-heading text-3xl font-bold text-white">Privacy Policy & DPDP Notice</h1>
        <p>Saarathi adheres strictly to the Digital Personal Data Protection (DPDP) Act of India. We do not monetize student demographic data or share private caste and income figures with recruiters.</p>
        <p>All students maintain the absolute right to export their complete data dossier in JSON format or trigger permanent erasure from their profile settings.</p>
      </div>
      <Footer />
    </div>
  );
}

export function TermsPage({ onOpenAiAssistant }) {
  return (
    <div className="min-h-screen bg-midnight-950 text-slate-100 flex flex-col">
      <Navbar onOpenAiAssistant={onOpenAiAssistant} />
      <div className="flex-1 max-w-4xl mx-auto px-4 py-16 space-y-6 text-xs text-slate-300 leading-relaxed">
        <h1 className="font-heading text-3xl font-bold text-white">Terms of Service</h1>
        <p>Saarathi provides eligibility estimation and career planning tools. Match scores represent heuristic and mathematical alignment against published guidelines. Official notices published on government portals (e.g. scholarships.gov.in) remain authoritative.</p>
      </div>
      <Footer />
    </div>
  );
}
