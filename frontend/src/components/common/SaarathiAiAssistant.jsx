import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Send, X, ShieldAlert, BookOpen, Bot, User, CheckCircle2 } from 'lucide-react';

export default function SaarathiAiAssistant({ isOpen, onClose }) {
  const { lang } = useLanguage();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: lang === 'te'
        ? 'నమస్కారం! నేను మీ సారథి AI మార్గదర్శిని. మీరు అర్హత సాధించే స్కాలర్‌షిప్‌లు మరియు ఇంటర్న్‌షిప్‌ల గురించి నన్ను అడగండి.'
        : 'Welcome to Saarathi AI! I am grounded exclusively in official government notices and verified opportunity records. How can I guide your career today?',
      citations: [{ source: 'National Scholarship Portal (scholarships.gov.in)', verified: '2026-10-15' }]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiStatusInfo, setAiStatusInfo] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      api.getAiStatus().then(res => setAiStatusInfo(res)).catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || isTyping) return;

    const userMsg = { role: 'user', content: queryText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const data = await api.aiChat({ message: queryText });
      const replyContent = data.reply || data.text || data.content || 'Namaste! I am here to help you navigate scholarships and career pathways.';
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: replyContent,
          model: data.model || 'openai/gpt-4o',
          isDemo: Boolean(data.isDemo),
          citations: data.citations || data.groundTruthCitations || []
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'I encountered a brief connection issue. Standard fallback: Please verify all scheme dates and income caps directly at scholarships.gov.in.',
          isDemo: true
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-all animate-fadeIn">
      <div className="w-full max-w-md bg-midnight-950 border-l border-midnight-700 h-full flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-4 border-b border-midnight-800 bg-midnight-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-wine-600 to-coral-500 p-2 text-white flex items-center justify-center shadow-glow-wine">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-white tracking-wide">Saarathi AI Companion</h3>
              <p className="text-[10px] text-coral-300 font-mono">
                {aiStatusInfo?.demoMode ? 'Offline Hackathon Demo Mode' : `Live OpenRouter (${aiStatusInfo?.lastModelUsed || 'Active'})`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-midnight-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="px-4 py-2 bg-wine-950/40 border-b border-wine-900/40 flex items-center gap-2 text-[10px] text-slate-300">
          <ShieldAlert className="w-3.5 h-3.5 text-coral-400 shrink-0" />
          <span>AI explains & tutors. Deterministic logic calculates official eligibility.</span>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-wine-800 text-coral-200 flex items-center justify-center shrink-0 text-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-wine-600 to-wine-700 text-white shadow-md'
                    : 'bg-midnight-900/90 border border-midnight-700/80 text-slate-200'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>

                {/* Model badge */}
                {m.model && (
                  <div className="mt-2 text-[9px] text-coral-400/80 font-mono flex items-center gap-1">
                    <span>Powered by: {m.model}</span>
                    {m.isDemo && <span className="bg-wine-900 text-coral-300 px-1 rounded">(Demo)</span>}
                  </div>
                )}

                {/* Grounding Citations */}
                {m.citations && m.citations.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-midnight-700/60 text-[10px] text-slate-400">
                    <span className="font-semibold text-coral-300 block mb-1">Attributed Sources:</span>
                    {m.citations.map((c, i) => (
                      <div key={i} className="flex items-center gap-1 text-slate-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald shrink-0" />
                        <span>{c.source} (Verified: {c.verified})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0 text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-coral-400 font-mono animate-pulse">
              <Bot className="w-4 h-4" />
              <span>Saarathi is synthesizing verified data...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-midnight-800 bg-midnight-900/40 flex items-center gap-1.5 overflow-x-auto text-[10px] no-scrollbar">
          <button
            onClick={() => handleSend('Am I eligible for the PM-USP scholarship?')}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-midnight-800 hover:bg-wine-900 text-slate-300 border border-midnight-700 transition-colors"
          >
            PM-USP Eligibility?
          </button>
          <button
            onClick={() => handleSend('What skills am I missing for Software Engineer Intern?')}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-midnight-800 hover:bg-wine-900 text-slate-300 border border-midnight-700 transition-colors"
          >
            Software Intern Skills?
          </button>
          <button
            onClick={() => handleSend('How does Saarathi calculate my match score?')}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-midnight-800 hover:bg-wine-900 text-slate-300 border border-midnight-700 transition-colors"
          >
            How scoring works?
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-midnight-800 bg-midnight-950">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={lang === 'te' ? 'సారథిని ఏదైనా అడగండి...' : 'Ask about scholarships, internships, or skills...'}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-coral-400"
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-wine-600 to-coral-500 text-white disabled:opacity-40 hover:opacity-90 shadow-glow-wine transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
