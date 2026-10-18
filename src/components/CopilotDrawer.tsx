import React, { useState, useRef, useEffect } from 'react';
import { Submission } from '../types/underwriting';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  Building2, 
  HelpCircle, 
  FileText 
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  focusedSubmission: Submission | null;
  onSelectSubmissionFocus: (sub: Submission | null) => void;
  submissions: Submission[];
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({
  isOpen,
  onClose,
  focusedSubmission,
  onSelectSubmissionFocus,
  submissions,
}) => {
  if (!isOpen) return null;

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Hello! I am your **RiskPulse AI Underwriting Copilot**, powered by Gemini 3.8 Flash.\n\nI can analyze loss runs, explain composite risk scores, draft broker RFIs, evaluate warranties and endorsements, or verify carrier appetite adherence.\n\nHow can I assist your underwriting desk today?`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = focusedSubmission ? [
    `Draft a broker RFI for ${focusedSubmission.companyName}`,
    `Explain the risk factors for this account`,
    `Suggest mandatory warranties for ${focusedSubmission.lineOfBusiness}`,
    `Compare with carrier appetite guidelines`,
  ] : [
    'What are the highest risk accounts currently in review?',
    'Explain our carrier appetite rules for coastal wind & hail',
    'How is the 100-year PML calculated?',
    'Draft a standard broker subjectivity letter template',
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          submissionContext: focusedSubmission,
          history: messages.slice(-4),
        }),
      });

      const data = await res.json();
      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Underwriting analysis completed with standard criteria.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Copilot error:', err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Apologies, I encountered an issue connecting to the underwriting copilot service. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              RiskPulse AI Copilot
              <span className="text-[10px] text-cyan-400 font-mono">v4.2</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Commercial Lines Intelligence & Broker Drafting
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Account Context Bar */}
      <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 truncate">
          <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="text-slate-500">Context:</span>
          {focusedSubmission ? (
            <span className="font-semibold text-slate-200 truncate max-w-[220px]">
              {focusedSubmission.companyName}
            </span>
          ) : (
            <span className="text-slate-400 italic">Portfolio-Wide Overview</span>
          )}
        </div>

        {/* Change account dropdown */}
        <select
          value={focusedSubmission?.id || ''}
          onChange={(e) => {
            const found = submissions.find((s) => s.id === e.target.value) || null;
            onSelectSubmissionFocus(found);
          }}
          className="bg-slate-950 border border-slate-800 text-[11px] text-slate-300 rounded px-2 py-0.5 max-w-[140px] truncate focus:outline-none focus:border-cyan-500"
        >
          <option value="">Portfolio View</option>
          {submissions.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.companyName}
            </option>
          ))}
        </select>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-3.5 shadow-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-br-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>

            <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-500">
              <span>{msg.timestamp}</span>
              {msg.sender === 'assistant' && (
                <button
                  onClick={() => copyText(msg.id, msg.text)}
                  className="hover:text-slate-300 flex items-center gap-0.5"
                  title="Copy text"
                >
                  {copiedId === msg.id ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            <span>Underwriting Copilot reasoning...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="p-3 bg-slate-900/60 border-t border-slate-800/60 space-y-2">
        <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Suggested Inquiries:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 px-2.5 py-1 rounded-full transition-colors text-left"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
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
            placeholder="Ask Copilot about exclusions, loss runs, or broker RFIs..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
