import React from 'react';
import { 
  ShieldCheck, 
  Activity, 
  BarChart3, 
  Sparkles, 
  Sliders, 
  FileText, 
  PlusCircle, 
  Bot, 
  Layers, 
  Cpu,
  Network,
  Scale,
  Radio,
  ShieldAlert
} from 'lucide-react';
import { CarrierAppetiteConfig } from '../types/underwriting';

interface HeaderProps {
  currentTab: 'pipeline' | 'analyze' | 'supply-chain' | 'compliance-actuary' | 'threat-intel' | 'resiliency-hub' | 'consolidation-audit' | 'appetite' | 'portfolio' | 'memos';
  setCurrentTab: (tab: 'pipeline' | 'analyze' | 'supply-chain' | 'compliance-actuary' | 'threat-intel' | 'resiliency-hub' | 'consolidation-audit' | 'appetite' | 'portfolio' | 'memos') => void;
  carrierConfig: CarrierAppetiteConfig;
  totalTIV: number;
  averageScore: number;
  openNewSubmissionModal: () => void;
  toggleCopilot: () => void;
  isCopilotOpen: boolean;
  onOpenResiliencyScorecard?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  carrierConfig,
  totalTIV,
  averageScore,
  openNewSubmissionModal,
  toggleCopilot,
  isCopilotOpen,
  onOpenResiliencyScorecard,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      {/* Top utility ticker */}
      <div className="bg-slate-900/60 px-4 py-1.5 border-b border-slate-800/60 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            RiskPulse Appetite Engine v4.2
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="hidden sm:inline">
            Carrier Capacity: <strong className="text-slate-200">{carrierConfig.carrierName}</strong>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Pipeline TIV:</span>
            <span className="text-emerald-400 font-semibold font-mono">
              ${(totalTIV / 1000000).toFixed(1)}M
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Avg Pulse:</span>
            <span className="text-cyan-400 font-semibold font-mono">
              {averageScore.toFixed(1)}/100
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span className="text-[11px] font-mono">Gemini 3.8 Flash</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('pipeline')}>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 p-[1.5px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-400 animate-pulse-subtle" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  RiskPulse
                </span>
                <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  AI Underwriter
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Commercial Risk Intelligence & Appetite Engine
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('pipeline')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all ${
                currentTab === 'pipeline'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              Workbench
            </button>

            <button
              onClick={() => setCurrentTab('analyze')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all ${
                currentTab === 'analyze'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              AI Underwrite
            </button>

            {/* VENDOR SUPPLY CHAIN RISK */}
            <button
              onClick={() => setCurrentTab('supply-chain')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all ${
                currentTab === 'supply-chain'
                  ? 'bg-cyan-950/60 text-cyan-300 shadow-sm border border-cyan-700/60'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-900/60'
              }`}
            >
              <Network className="w-4 h-4 text-cyan-400" />
              <span>Supply Chain Risk</span>
            </button>

            {/* NEW TAB: DPDP 2025 & ACTUARY LAB */}
            <button
              onClick={() => setCurrentTab('compliance-actuary')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all relative ${
                currentTab === 'compliance-actuary'
                  ? 'bg-emerald-950/60 text-emerald-300 shadow-sm border border-emerald-700/60'
                  : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-900/60'
              }`}
            >
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>DPDP & Actuary</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            {/* NEW TAB: THREAT INTELLIGENCE & DARK WEB MONITOR */}
            <button
              onClick={() => setCurrentTab('threat-intel')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all relative ${
                currentTab === 'threat-intel'
                  ? 'bg-rose-950/70 text-rose-300 shadow-sm border border-rose-700/60'
                  : 'text-slate-400 hover:text-rose-300 hover:bg-slate-900/60'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Threat Intel & Dark Web</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            </button>

            {/* NEW TAB: FOUR-PILLAR RESILIENCY HUB */}
            <button
              onClick={() => setCurrentTab('resiliency-hub')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all relative ${
                currentTab === 'resiliency-hub'
                  ? 'bg-teal-950/70 text-teal-300 shadow-sm border border-teal-700/60'
                  : 'text-slate-400 hover:text-teal-300 hover:bg-slate-900/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Resiliency Hub</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            </button>

            {/* NEW TAB: STACK CONSOLIDATION & SLA AUDIT */}
            <button
              onClick={() => setCurrentTab('consolidation-audit')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all relative ${
                currentTab === 'consolidation-audit'
                  ? 'bg-indigo-950/70 text-indigo-300 shadow-sm border border-indigo-700/60'
                  : 'text-slate-400 hover:text-indigo-300 hover:bg-slate-900/60'
              }`}
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Stack Consolidation</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            </button>

            <button
              onClick={() => setCurrentTab('appetite')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all ${
                currentTab === 'appetite'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Sliders className="w-4 h-4 text-emerald-400" />
              Appetite & Rules
            </button>

            <button
              onClick={() => setCurrentTab('portfolio')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all ${
                currentTab === 'portfolio'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-purple-400" />
              Portfolio & CAT
            </button>

            <button
              onClick={() => setCurrentTab('memos')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all ${
                currentTab === 'memos'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <FileText className="w-4 h-4 text-blue-400" />
              UW Memos
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            {onOpenResiliencyScorecard && (
              <button
                onClick={onOpenResiliencyScorecard}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                title="Mitigata 4-Pillar Enterprise Resiliency Scorecard"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="hidden xl:inline">Mitigata Scorecard</span>
                <span className="xl:hidden">Pillars</span>
              </button>
            )}

            <button
              onClick={openNewSubmissionModal}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs sm:text-sm font-medium rounded-lg shadow-md shadow-cyan-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">New Submission</span>
              <span className="sm:hidden">New</span>
            </button>

            <button
              onClick={toggleCopilot}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all border ${
                isCopilotOpen
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Risk Copilot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Tabs */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-800/70 bg-slate-950 py-2 px-1 text-xs">
        <button
          onClick={() => setCurrentTab('pipeline')}
          className={`flex flex-col items-center gap-1 py-1 px-1.5 rounded ${
            currentTab === 'pipeline' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Layers className="w-4 h-4" />
          Workbench
        </button>
        <button
          onClick={() => setCurrentTab('analyze')}
          className={`flex flex-col items-center gap-1 py-1 px-1.5 rounded ${
            currentTab === 'analyze' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          AI Lab
        </button>
        <button
          onClick={() => setCurrentTab('supply-chain')}
          className={`flex flex-col items-center gap-1 py-1 px-1.5 rounded ${
            currentTab === 'supply-chain' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Network className="w-4 h-4" />
          Supply Chain
        </button>
        <button
          onClick={() => setCurrentTab('compliance-actuary')}
          className={`flex flex-col items-center gap-1 py-1 px-1.5 rounded ${
            currentTab === 'compliance-actuary' ? 'text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Scale className="w-4 h-4" />
          DPDP & Actuary
        </button>
        <button
          onClick={() => setCurrentTab('portfolio')}
          className={`flex flex-col items-center gap-1 py-1 px-1.5 rounded ${
            currentTab === 'portfolio' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Portfolio
        </button>
        <button
          onClick={() => setCurrentTab('memos')}
          className={`flex flex-col items-center gap-1 py-1 px-1.5 rounded ${
            currentTab === 'memos' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          Memos
        </button>
      </div>
    </header>
  );
};
