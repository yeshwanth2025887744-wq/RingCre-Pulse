/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { PipelineWorkbench } from './components/PipelineWorkbench';
import { SubmissionDetailModal } from './components/SubmissionDetailModal';
import { AnalyzeModal } from './components/AnalyzeModal';
import { SupplyChainRiskView } from './components/SupplyChainRiskView';
import { ComplianceAndActuaryView } from './components/ComplianceAndActuaryView';
import { ThreatIntelDarkWebView } from './components/ThreatIntelDarkWebView';
import { FourPillarResiliencyHubView } from './components/FourPillarResiliencyHubView';
import { StackConsolidationSlaAuditView } from './components/StackConsolidationSlaAuditView';
import { CSuiteBoardBriefModal } from './components/CSuiteBoardBriefModal';
import { AppetiteConfigView } from './components/AppetiteConfigView';
import { PortfolioAnalyticsView } from './components/PortfolioAnalyticsView';
import { UnderwritingMemoModal } from './components/UnderwritingMemoModal';
import { CopilotDrawer } from './components/CopilotDrawer';
import { MitigataResiliencyScorecardModal } from './components/MitigataResiliencyScorecardModal';

import { initialSubmissions, initialCarrierConfig, defaultAppetiteRules } from './data/mockSubmissions';
import { Submission, CarrierAppetiteConfig, AppetiteRule } from './types/underwriting';

export default function App() {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [carrierConfig, setCarrierConfig] = useState<CarrierAppetiteConfig>(initialCarrierConfig);
  const [rules, setRules] = useState<AppetiteRule[]>(defaultAppetiteRules);

  const [currentTab, setCurrentTab] = useState<'pipeline' | 'analyze' | 'supply-chain' | 'compliance-actuary' | 'threat-intel' | 'resiliency-hub' | 'consolidation-audit' | 'appetite' | 'portfolio' | 'memos'>('pipeline');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [selectedMemoSubmission, setSelectedMemoSubmission] = useState<Submission | null>(null);
  const [isAnalyzeModalOpen, setIsAnalyzeModalOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isResiliencyScorecardOpen, setIsResiliencyScorecardOpen] = useState(false);
  const [isBoardBriefOpen, setIsBoardBriefOpen] = useState(false);
  const [focusedCopilotSubmission, setFocusedCopilotSubmission] = useState<Submission | null>(null);

  // Compute aggregate stats
  const totalTIV = submissions.reduce((acc, curr) => acc + curr.tiv, 0);
  const averageScore = submissions.length
    ? submissions.reduce((acc, curr) => acc + curr.analysis.pulseScore, 0) / submissions.length
    : 0;

  // Handler: Update an existing submission
  const handleUpdateSubmission = (updated: Submission) => {
    setSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    if (selectedSubmission?.id === updated.id) {
      setSelectedSubmission(updated);
    }
  };

  // Handler: Add newly analyzed submission from the AI Lab
  const handleSubmissionCreated = (newSub: Submission) => {
    setSubmissions((prev) => [newSub, ...prev]);
    setSelectedSubmission(newSub);
    setCurrentTab('pipeline');
  };

  // Handler: Re-run Gemini AI Underwrite on a submission
  const handleReUnderwrite = async (sub: Submission) => {
    try {
      const res = await fetch('/api/underwrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: sub.companyName,
          industry: sub.industry,
          lineOfBusiness: sub.lineOfBusiness,
          tiv: sub.tiv,
          revenue: sub.revenue,
          employees: sub.employees,
          yearsInBusiness: sub.yearsInBusiness,
          locations: sub.locations,
          locationZone: sub.locationZone,
          lossHistoryText: sub.lossHistoryText,
          protections: sub.protections,
          cyberPosture: sub.cyberPosture,
          requestedLimits: sub.requestedLimits,
          requestedDeductible: sub.requestedDeductible,
        }),
      });

      const data = await res.json();
      if (data && data.analysis) {
        const updated: Submission = {
          ...sub,
          analysis: data.analysis,
        };
        handleUpdateSubmission(updated);
      }
    } catch (err) {
      console.error('Re-underwrite error:', err);
    }
  };

  // Handler: Open Copilot with specific submission context
  const handleOpenCopilotWithContext = (sub: Submission | null, prompt?: string) => {
    setFocusedCopilotSubmission(sub);
    setIsCopilotOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Global Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        carrierConfig={carrierConfig}
        totalTIV={totalTIV}
        averageScore={averageScore}
        openNewSubmissionModal={() => setIsAnalyzeModalOpen(true)}
        toggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
        isCopilotOpen={isCopilotOpen}
        onOpenResiliencyScorecard={() => setIsResiliencyScorecardOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'pipeline' && (
          <PipelineWorkbench
            submissions={submissions}
            onSelectSubmission={(sub) => setSelectedSubmission(sub)}
            onOpenAnalyze={() => setIsAnalyzeModalOpen(true)}
            onReUnderwrite={handleReUnderwrite}
            onViewMemo={(sub) => setSelectedMemoSubmission(sub)}
          />
        )}

        {currentTab === 'analyze' && (
          <div className="py-4">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">AI Underwriting Laboratory</h2>
                <p className="text-xs text-slate-400">
                  Input commercial asset data or parse ACORD / SOV documentation to trigger deep forensic risk analysis.
                </p>
              </div>
            </div>
            {/* Direct inline preview of the lab */}
            <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
                <span className="text-2xl font-black">⚡</span>
              </div>
              <h3 className="text-base font-bold text-white">Ready to Underwrite a New Risk?</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Launch our interactive intake studio with sample commercial accounts, document extraction, or manual underwriting specifications.
              </p>
              <button
                onClick={() => setIsAnalyzeModalOpen(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-cyan-950 transition-all hover:scale-[1.02]"
              >
                Launch AI Underwrite Studio
              </button>
            </div>
          </div>
        )}

        {/* VENDOR SUPPLY CHAIN RISK */}
        {currentTab === 'supply-chain' && (
          <SupplyChainRiskView
            submissions={submissions}
            selectedSubmission={selectedSubmission}
            onSelectSubmission={setSelectedSubmission}
            onOpenCopilotWithContext={handleOpenCopilotWithContext}
          />
        )}

        {/* DPDP 2025, SEBI CSCRF & ACTUARY LAB */}
        {currentTab === 'compliance-actuary' && (
          <ComplianceAndActuaryView
            submissions={submissions}
            selectedSubmission={selectedSubmission}
            onOpenCopilotWithContext={handleOpenCopilotWithContext}
          />
        )}

        {/* THREAT INTELLIGENCE & DARK WEB MONITOR */}
        {currentTab === 'threat-intel' && (
          <ThreatIntelDarkWebView
            submissions={submissions}
            selectedSubmission={selectedSubmission}
            onSelectSubmission={setSelectedSubmission}
            onOpenCopilotWithContext={handleOpenCopilotWithContext}
          />
        )}

        {/* FOUR-PILLAR RESILIENCY HUB */}
        {currentTab === 'resiliency-hub' && (
          <FourPillarResiliencyHubView
            submissions={submissions}
            selectedSubmission={selectedSubmission}
            onSelectSubmission={setSelectedSubmission}
            onOpenCopilotWithContext={handleOpenCopilotWithContext}
          />
        )}

        {/* STACK CONSOLIDATION & SLA AUDIT */}
        {currentTab === 'consolidation-audit' && (
          <StackConsolidationSlaAuditView
            submissions={submissions}
            selectedSubmission={selectedSubmission}
            onSelectSubmission={setSelectedSubmission}
            onOpenCopilotWithContext={handleOpenCopilotWithContext}
            onOpenBoardBrief={() => setIsBoardBriefOpen(true)}
          />
        )}

        {currentTab === 'appetite' && (
          <AppetiteConfigView
            config={carrierConfig}
            rules={rules}
            onUpdateConfig={setCarrierConfig}
            onUpdateRules={setRules}
          />
        )}

        {currentTab === 'portfolio' && (
          <PortfolioAnalyticsView submissions={submissions} />
        )}

        {currentTab === 'memos' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Underwriting Memorandums & Policy Binders</h2>
                <p className="text-xs text-slate-400">
                  Formal carrier documentation, actuarial rating schedules, and signed binding binders.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-slate-900/80 rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-all space-y-3 cursor-pointer group"
                  onClick={() => setSelectedMemoSubmission(sub)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {sub.companyName}
                      </h4>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        {sub.submissionNumber}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      sub.status === 'BOUND' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      sub.status === 'QUOTED' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                      'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {sub.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400">
                    <div>Line: {sub.lineOfBusiness}</div>
                    <div>TIV: ${(sub.tiv / 1000000).toFixed(1)}M Blanket</div>
                    <div>Indicated Prem: ${sub.analysis.recommendedPricing.indicatedAnnualPremium.toLocaleString()}/yr</div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 font-medium">
                    <span>View Formal Memorandum</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-4 sm:px-8 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">RiskPulse AI Underwriting Platform</span>
          <span>•</span>
          <span>Syndicate 1892</span>
        </div>
        <div>
          Powered by Gemini 3.8 Flash • Real-time Actuarial & Exposure Analytics
        </div>
      </footer>

      {/* Modals & Overlays */}
      {selectedSubmission && (
        <SubmissionDetailModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onUpdateSubmission={handleUpdateSubmission}
          onReUnderwrite={handleReUnderwrite}
          onViewMemo={(sub) => {
            setSelectedSubmission(null);
            setSelectedMemoSubmission(sub);
          }}
          onOpenCopilotWithContext={handleOpenCopilotWithContext}
        />
      )}

      {selectedMemoSubmission && (
        <UnderwritingMemoModal
          submission={selectedMemoSubmission}
          onClose={() => setSelectedMemoSubmission(null)}
        />
      )}

      {isAnalyzeModalOpen && (
        <AnalyzeModal
          isOpen={isAnalyzeModalOpen}
          onClose={() => setIsAnalyzeModalOpen(false)}
          onSubmissionCreated={handleSubmissionCreated}
        />
      )}

      {isCopilotOpen && (
        <CopilotDrawer
          isOpen={isCopilotOpen}
          onClose={() => setIsCopilotOpen(false)}
          focusedSubmission={focusedCopilotSubmission}
          onSelectSubmissionFocus={setFocusedCopilotSubmission}
          submissions={submissions}
        />
      )}

      {isResiliencyScorecardOpen && (
        <MitigataResiliencyScorecardModal
          isOpen={isResiliencyScorecardOpen}
          onClose={() => setIsResiliencyScorecardOpen(false)}
          selectedSubmission={selectedSubmission}
        />
      )}

      {isBoardBriefOpen && (
        <CSuiteBoardBriefModal
          isOpen={isBoardBriefOpen}
          onClose={() => setIsBoardBriefOpen(false)}
          submission={selectedSubmission || submissions[0] || null}
        />
      )}
    </div>
  );
}
