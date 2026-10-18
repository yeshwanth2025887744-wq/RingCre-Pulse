import React, { useState } from 'react';
import { 
  Submission, 
  RiskTier, 
  SubmissionStatus, 
  CategoryScores 
} from '../types/underwriting';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  TrendingUp, 
  Building2, 
  Sliders, 
  DollarSign, 
  CloudLightning, 
  Lock, 
  Flame, 
  History, 
  User, 
  Printer, 
  Send, 
  Check, 
  RefreshCw,
  Info
} from 'lucide-react';

interface SubmissionDetailModalProps {
  submission: Submission | null;
  onClose: () => void;
  onUpdateSubmission: (updated: Submission) => void;
  onReUnderwrite: (submission: Submission) => void;
  onViewMemo: (submission: Submission) => void;
  onOpenCopilotWithContext: (submission: Submission, prompt?: string) => void;
}

export const SubmissionDetailModal: React.FC<SubmissionDetailModalProps> = ({
  submission,
  onClose,
  onUpdateSubmission,
  onReUnderwrite,
  onViewMemo,
  onOpenCopilotWithContext,
}) => {
  if (!submission) return null;

  const [activeTab, setActiveTab] = useState<'audit' | 'pricing' | 'subjectivities' | 'scenarios' | 'simulator'>('audit');
  const [isQuoting, setIsQuoting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [declineReasonInput, setDeclineReasonInput] = useState('');
  const [quotePremiumInput, setQuotePremiumInput] = useState(submission.analysis.recommendedPricing.indicatedAnnualPremium);
  const [quoteDeductibleInput, setQuoteDeductibleInput] = useState(submission.analysis.recommendedPricing.recommendedDeductible);
  const [bindingSuccess, setBindingSuccess] = useState(false);

  // What-If Simulator state
  const [simSprinklerUpgrade, setSimSprinklerUpgrade] = useState(false);
  const [simDeductibleFactor, setSimDeductibleFactor] = useState(submission.analysis.recommendedPricing.recommendedDeductible);
  const [simCyberHardened, setSimCyberHardened] = useState(false);
  const [simLossRatioModifier, setSimLossRatioModifier] = useState(0);

  // Calculate simulated values
  let simulatedScore = submission.analysis.pulseScore;
  if (simSprinklerUpgrade) simulatedScore += 6;
  if (simCyberHardened) simulatedScore += 5;
  if (simDeductibleFactor > submission.analysis.recommendedPricing.recommendedDeductible) simulatedScore += 3;
  simulatedScore = Math.min(99, Math.max(10, simulatedScore));

  const simulatedPremium = Math.round(
    submission.analysis.recommendedPricing.indicatedAnnualPremium *
    (1 - (simulatedScore - submission.analysis.pulseScore) * 0.015)
  );

  const getPulseBadge = (score: number) => {
    if (score >= 80) return { label: 'Preferred Risk', color: 'emerald', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
    if (score >= 65) return { label: 'Standard Risk', color: 'cyan', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' };
    if (score >= 50) return { label: 'Substandard / High Risk', color: 'amber', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
    return { label: 'Ineligible Risk', color: 'rose', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
  };

  const currentBadge = getPulseBadge(submission.analysis.pulseScore);

  const handleIssueQuote = () => {
    const updated: Submission = {
      ...submission,
      status: 'QUOTED',
      quoteDetails: {
        boundPremium: Number(quotePremiumInput),
        quotedDeductible: Number(quoteDeductibleInput),
        quoteExpiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        termsNotes: `Formal quotation issued with indicated annual premium of $${Number(quotePremiumInput).toLocaleString()}. Valid 30 days.`,
      },
    };
    onUpdateSubmission(updated);
    setIsQuoting(false);
  };

  const handleBindPolicy = () => {
    const binderId = `RP-BND-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const updated: Submission = {
      ...submission,
      status: 'BOUND',
      binderNumber: binderId,
      quoteDetails: submission.quoteDetails || {
        boundPremium: submission.analysis.recommendedPricing.indicatedAnnualPremium,
        quotedDeductible: submission.analysis.recommendedPricing.recommendedDeductible,
        quoteExpiration: new Date().toISOString().split('T')[0],
        termsNotes: 'Bound on underwriter authority.',
      },
    };
    onUpdateSubmission(updated);
    setBindingSuccess(true);
    setTimeout(() => setBindingSuccess(false), 4000);
  };

  const handleDecline = () => {
    const updated: Submission = {
      ...submission,
      status: 'DECLINED',
      declineReason: declineReasonInput || 'Submission does not meet carrier risk appetite benchmarks.',
    };
    onUpdateSubmission(updated);
    setIsDeclining(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Banner */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{submission.companyName}</h2>
                <span className="text-xs text-slate-500 font-mono">({submission.submissionNumber})</span>
              </div>
              <p className="text-xs text-slate-400">
                {submission.industry} • {submission.lineOfBusiness} • Broker: {submission.brokerAgency}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onReUnderwrite(submission)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs rounded-lg transition-colors"
              title="Re-run Gemini Underwrite"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Re-Run AI Audit</span>
            </button>
            <button
              onClick={() => onViewMemo(submission)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs rounded-lg transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">UW Memo</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Binding Celebration Toast */}
        {bindingSuccess && (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-300 animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span><strong>Policy Successfully Bound!</strong> Binder #{submission.binderNumber || 'RP-BND-ACTIVE'} has been registered in the carrier ledger.</span>
            </div>
            <button 
              onClick={() => onViewMemo(submission)}
              className="underline text-emerald-200 hover:text-white"
            >
              Open Policy Binder Document
            </button>
          </div>
        )}

        {/* Hero Score & Appetite Header Bar */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
          {/* Pulse Score */}
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-mono text-2xl font-black ${currentBadge.bg} border`}>
              {submission.analysis.pulseScore}
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Risk Pulse Score
              </div>
              <div className="text-sm font-bold text-white">
                {currentBadge.label}
              </div>
              <div className="text-[11px] text-slate-500">
                Carrier Percentile: Top {100 - submission.analysis.pulseScore}%
              </div>
            </div>
          </div>

          {/* Appetite Fit */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Carrier Appetite Fit
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                submission.analysis.appetiteFit === 'Full Appetite Match' ? 'bg-emerald-400' :
                submission.analysis.appetiteFit.includes('Conditional') ? 'bg-amber-400' : 'bg-rose-400'
              }`} />
              <span className="text-sm font-semibold text-slate-200">
                {submission.analysis.appetiteFit}
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Guideline Rule Set 1892
            </div>
          </div>

          {/* Indicated Premium */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Indicated Annual Premium
            </div>
            <div className="text-lg font-bold font-mono text-emerald-400">
              ${submission.analysis.recommendedPricing.indicatedAnnualPremium.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400">
              {submission.analysis.recommendedPricing.suggestedDebitCreditPercent < 0
                ? `${submission.analysis.recommendedPricing.suggestedDebitCreditPercent}% Preferred Credit`
                : submission.analysis.recommendedPricing.suggestedDebitCreditPercent > 0
                ? `+${submission.analysis.recommendedPricing.suggestedDebitCreditPercent}% Experience Surcharge`
                : 'Par Standard Rate'}
            </div>
          </div>

          {/* Recommended Action */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Underwriting Verdict
            </div>
            <div className="mt-0.5">
              {submission.analysis.underwritingAction === 'RECOMMEND_QUOTE' ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                  <Check className="w-3.5 h-3.5" /> Quote Recommended
                </span>
              ) : submission.analysis.underwritingAction === 'REFERRAL_REQUIRED' ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                  <AlertTriangle className="w-3.5 h-3.5" /> Senior Referral Required
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded">
                  <X className="w-3.5 h-3.5" /> Decline Recommended
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Assigned: {submission.assignedUnderwriter.split(' ')[0]}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-6 gap-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-3 border-b-2 transition-all ${
              activeTab === 'audit'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Pillar Audit & AI Findings
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`py-3 px-3 border-b-2 transition-all ${
              activeTab === 'pricing'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Actuarial Pricing & Terms
          </button>
          <button
            onClick={() => setActiveTab('subjectivities')}
            className={`py-3 px-3 border-b-2 transition-all ${
              activeTab === 'subjectivities'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Subjectivities & Warranties ({submission.analysis.mandatorySubjectivities.length})
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`py-3 px-3 border-b-2 transition-all ${
              activeTab === 'scenarios'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Catastrophe Scenarios (PML)
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'border-cyan-400 text-cyan-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            What-If Simulator
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: AUDIT & FINDINGS */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              {/* Executive Summary */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  AI UNDERWRITING SYNTHESIS (GEMINI 3.8 FLASH)
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {submission.analysis.executiveSummary}
                </p>
              </div>

              {/* 6 Pillars Breakdown */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Underwriting Pillar Decomposition
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Property & Engineering', score: submission.analysis.categoryScores.propertyRisk, icon: Building2 },
                    { label: 'Operational Safety', score: submission.analysis.categoryScores.operationalSafety, icon: ShieldCheck },
                    { label: 'Financial Solvency', score: submission.analysis.categoryScores.financialSolvency, icon: DollarSign },
                    { label: 'Cyber Posture', score: submission.analysis.categoryScores.cyberPosture, icon: Lock },
                    { label: 'Natural Catastrophe / Perils', score: submission.analysis.categoryScores.catPerils, icon: CloudLightning },
                    { label: 'Loss Run Performance', score: submission.analysis.categoryScores.claimsHistory, icon: History },
                  ].map((pillar) => {
                    const Icon = pillar.icon;
                    return (
                      <div key={pillar.label} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Icon className="w-3.5 h-3.5 text-cyan-400" />
                            {pillar.label}
                          </span>
                          <span className="font-mono font-bold text-slate-200">{pillar.score}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              pillar.score >= 80 ? 'bg-emerald-400' :
                              pillar.score >= 65 ? 'bg-cyan-400' :
                              pillar.score >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                            }`}
                            style={{ width: `${pillar.score}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Key Findings List */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Forensic Risk Factors & Anomalies Detected ({submission.analysis.keyFindings.length})
                </h3>
                <div className="space-y-3">
                  {submission.analysis.keyFindings.map((finding, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 rounded-xl border ${
                        finding.type === 'critical'
                          ? 'bg-rose-950/20 border-rose-800/60 text-rose-200'
                          : finding.type === 'warning'
                          ? 'bg-amber-950/20 border-amber-800/60 text-amber-200'
                          : 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          {finding.type === 'critical' && <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />}
                          {finding.type === 'warning' && <Info className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />}
                          {finding.type === 'positive' && <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase tracking-wider opacity-75">
                                [{finding.category}]
                              </span>
                              <h4 className="text-sm font-bold text-slate-100">{finding.title}</h4>
                            </div>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                              {finding.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-xs flex items-center gap-2">
                        <strong className="text-slate-400">Underwriting Impact:</strong>
                        <span className="text-slate-200">{finding.underwritingImpact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Loss Run Audit Box */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <History className="w-4 h-4 text-purple-400" />
                    5-YEAR LOSS RUN & CLAIMS PERFORMANCE
                  </span>
                  <span className="font-mono text-slate-300">
                    Total Incurred: ${submission.totalLossIncurred.toLocaleString()} ({submission.claimsPast5YearsCount} Claims)
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
                  {submission.lossHistoryText}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & TERMS */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Actuarial Rate Indication
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Total Insurable Value (TIV)</span>
                      <span className="font-mono font-bold text-slate-200">${submission.tiv.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Technical Base Rate</span>
                      <span className="font-mono text-slate-200">
                        ${((submission.analysis.recommendedPricing.indicatedAnnualPremium / submission.tiv) * 100).toFixed(4)} / $100 TIV
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Underwriter Debit / Credit Mod</span>
                      <span className={`font-mono font-bold ${
                        submission.analysis.recommendedPricing.suggestedDebitCreditPercent < 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {submission.analysis.recommendedPricing.suggestedDebitCreditPercent}%
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Expected Loss Ratio (AAL)</span>
                      <span className="font-mono text-cyan-400">
                        {submission.analysis.recommendedPricing.targetLossRatioExpected}%
                      </span>
                    </div>
                    <div className="flex justify-between py-2 bg-slate-900 px-3 rounded-lg">
                      <span className="font-semibold text-slate-200">Indicated Annual Premium</span>
                      <span className="font-mono font-bold text-emerald-400 text-base">
                        ${submission.analysis.recommendedPricing.indicatedAnnualPremium.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Recommended Retentions & Limits
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Requested Limits</span>
                      <span className="font-mono text-slate-200">{submission.requestedLimits}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Standard All-Perils Deductible</span>
                      <span className="font-mono text-slate-200">
                        ${submission.analysis.recommendedPricing.recommendedDeductible.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Named Storm / Wind Percentage</span>
                      <span className="font-mono text-amber-400">2% to 5% of TIV Location</span>
                    </div>
                    <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-xs text-slate-300">
                      <strong className="text-slate-200 block mb-1">Pricing Rationale:</strong>
                      {submission.analysis.recommendedPricing.pricingRationale}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SUBJECTIVITIES & WARRANTIES */}
          {activeTab === 'subjectivities' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Mandatory Subjectivities (Must Satisfy Prior to Binding)
                </h3>
                <div className="space-y-2">
                  {submission.analysis.mandatorySubjectivities.map((subj, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                      <input 
                        type="checkbox" 
                        defaultChecked={false} 
                        className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-900" 
                      />
                      <span className="text-slate-200 leading-relaxed">{subj}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Policy Warranties & Endorsement Requirements
                </h3>
                <div className="space-y-2">
                  {submission.analysis.warrantiesAndEndorsements.map((warr, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-amber-300">
                      <ShieldCheck className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <span className="text-slate-300 leading-relaxed">{warr}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onOpenCopilotWithContext(submission, 'Draft a formal Broker RFI letter requesting these subjectivities.')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Ask Copilot to Draft Broker Subjectivities Letter
              </button>
            </div>
          )}

          {/* TAB 4: CATASTROPHE SCENARIOS */}
          {activeTab === 'scenarios' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300">100-YEAR STRESS TEST MODELS (PML)</span>
                <span>Regional Hazard Zone: {submission.locationZone}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {submission.analysis.catastropheScenarios.map((cat, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-amber-400" />
                        <h4 className="text-sm font-bold text-white">{cat.event}</h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        cat.probability === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                        cat.probability === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      }`}>
                        {cat.probability} Probability
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-900 rounded-lg font-mono text-xs flex justify-between">
                      <span className="text-slate-400">Probable Maximum Loss:</span>
                      <span className="font-bold text-rose-400">{cat.pmlExposure}</span>
                    </div>

                    <div className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-slate-400 block mb-0.5">Engineering Mitigation:</strong>
                      {cat.mitigationNotes}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: WHAT-IF SENSITIVITY SIMULATOR */}
          {activeTab === 'simulator' && (
            <div className="space-y-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    Interactive Risk & Pricing Sensitivity Simulator
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Toggle protective controls and retention limits to preview dynamic impact on Risk Pulse Score and indicated premium.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Simulated Score</div>
                    <div className="text-2xl font-bold font-mono text-cyan-400">{simulatedScore}/100</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Simulated Premium</div>
                    <div className="text-2xl font-bold font-mono text-emerald-400">${simulatedPremium.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">Upgrade Sprinklers to NFPA 13 ESFR</span>
                    <input 
                      type="checkbox"
                      checked={simSprinklerUpgrade}
                      onChange={(e) => setSimSprinklerUpgrade(e.target.checked)}
                      className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-900 w-4 h-4"
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    Installs quick-response high-volume suppression. Reduces water consequential damage and property loss severity (+6 score).
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">Universal MFA & Air-Gap Backups</span>
                    <input 
                      type="checkbox"
                      checked={simCyberHardened}
                      onChange={(e) => setSimCyberHardened(e.target.checked)}
                      className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-900 w-4 h-4"
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    Eliminates credential-based ransomware entry points (+5 score, -4% premium discount).
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">Property Deductible</span>
                    <span className="font-mono text-cyan-400">${simDeductibleFactor.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={25000}
                    max={250000}
                    step={25000}
                    value={simDeductibleFactor}
                    onChange={(e) => setSimDeductibleFactor(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>$25k</span>
                    <span>$100k</span>
                    <span>$250k</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Underwriting Action Bar */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Current Status:</span>
            <span className="font-semibold text-xs text-slate-200">{submission.status}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Ask Copilot about this account */}
            <button
              onClick={() => onOpenCopilotWithContext(submission)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ask Copilot</span>
            </button>

            {/* Issue Quote */}
            <button
              onClick={() => setIsQuoting(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Issue Quote</span>
            </button>

            {/* Bind Policy */}
            <button
              onClick={handleBindPolicy}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-md shadow-emerald-950"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Bind Policy</span>
            </button>

            {/* Decline Risk */}
            <button
              onClick={() => setIsDeclining(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 rounded-lg text-xs font-semibold border border-rose-800/40 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Decline Risk</span>
            </button>
          </div>
        </div>

        {/* Issue Quote Prompt Modal */}
        {isQuoting && (
          <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full space-y-4">
              <h3 className="text-sm font-bold text-white">Confirm Quotation Terms</h3>
              <p className="text-xs text-slate-400">
                Release formal quotation to {submission.brokerAgency} for {submission.companyName}.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Quoted Annual Premium ($)</label>
                  <input
                    type="number"
                    value={quotePremiumInput}
                    onChange={(e) => setQuotePremiumInput(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Quoted Deductible ($)</label>
                  <input
                    type="number"
                    value={quoteDeductibleInput}
                    onChange={(e) => setQuoteDeductibleInput(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsQuoting(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleIssueQuote}
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold"
                >
                  Release Formal Quote
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Decline Prompt Modal */}
        {isDeclining && (
          <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full space-y-4">
              <h3 className="text-sm font-bold text-white">Decline Commercial Submission</h3>
              <p className="text-xs text-slate-400">
                Please provide the underwriting rationale for declining {submission.companyName}.
              </p>

              <div>
                <textarea
                  value={declineReasonInput}
                  onChange={(e) => setDeclineReasonInput(e.target.value)}
                  placeholder="e.g. Unsprinklered woodworking facility with excessive prior fire loss exceeds carrier CAT appetite."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white placeholder-slate-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsDeclining(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDecline}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold"
                >
                  Confirm Declination
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
