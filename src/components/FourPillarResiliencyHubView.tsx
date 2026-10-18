import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Network, 
  Scale, 
  Shield, 
  DollarSign, 
  Sparkles, 
  Terminal, 
  Copy, 
  Check, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  RefreshCw, 
  Sliders, 
  Building2, 
  Lock, 
  Key, 
  ArrowRight, 
  Zap, 
  ChevronRight,
  TrendingDown,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Submission } from '../types/underwriting';

interface FourPillarResiliencyHubViewProps {
  submissions: Submission[];
  selectedSubmission: Submission | null;
  onSelectSubmission?: (sub: Submission) => void;
  onOpenCopilotWithContext?: (sub: Submission | null, prompt?: string) => void;
}

export const FourPillarResiliencyHubView: React.FC<FourPillarResiliencyHubViewProps> = ({
  submissions,
  selectedSubmission,
  onSelectSubmission,
  onOpenCopilotWithContext
}) => {
  const defaultSub = selectedSubmission || submissions[0];
  const [selectedSubId, setSelectedSubId] = useState<string>(defaultSub?.id || 'sub-001');

  const currentSub = submissions.find(s => s.id === selectedSubId) || defaultSub;
  const companyName = currentSub?.companyName || 'Apex Global Financial Technologies';
  const domain = companyName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
  const tiv = currentSub?.tiv || 40000000;
  const revenue = currentSub?.revenue || 65000000;

  // Harmonization state
  const [isHarmonizing, setIsHarmonizing] = useState<boolean>(false);
  const [harmonizeStep, setHarmonizeStep] = useState<number>(0);
  const [hasHarmonized, setHasHarmonized] = useState<boolean>(false);

  // Modals
  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  // Active Expanded Pillar
  const [expandedPillar, setExpandedPillar] = useState<'secops' | 'risk' | 'compliance' | 'insurance' | null>('secops');

  // Trigger Auto-Harmonization Workflow
  const handleAutoHarmonize = () => {
    setIsHarmonizing(true);
    setHarmonizeStep(1);

    setTimeout(() => setHarmonizeStep(2), 700);
    setTimeout(() => setHarmonizeStep(3), 1400);
    setTimeout(() => setHarmonizeStep(4), 2100);
    setTimeout(() => {
      setIsHarmonizing(false);
      setHarmonizeStep(0);
      setHasHarmonized(true);
    }, 2800);
  };

  const handleResetHarmonization = () => {
    setHasHarmonized(false);
    setHarmonizeStep(0);
  };

  // Scores pre and post harmonization
  const secOpsScore = hasHarmonized ? 95 : 62;
  const riskMgmtScore = hasHarmonized ? 92 : 64;
  const complianceScore = hasHarmonized ? 94 : 69;
  const insuranceScore = hasHarmonized ? 96 : 76;

  // Unified Single-Stack Health Score (Master Score)
  const masterScore = Math.round((secOpsScore + riskMgmtScore + complianceScore + insuranceScore) / 4);

  // Financial Exposures
  const aleUsd = hasHarmonized ? 1120000 : 3200000;
  const aleInrCrores = hasHarmonized ? 9.33 : 26.67;
  const tailRiskUsd = hasHarmonized ? 4500000 : 12800000;
  const tailRiskInrCrores = hasHarmonized ? 37.50 : 106.67;

  // Issues count
  const secOpsIssues = hasHarmonized ? 0 : 12;
  const riskIssues = hasHarmonized ? 0 : 8;
  const complianceIssues = hasHarmonized ? 0 : 5;
  const insuranceIssues = hasHarmonized ? 0 : 3;

  // Premium
  const baselinePremium = 95000;
  const currentPremium = hasHarmonized ? 77900 : 95000; // -18% dynamic discount

  const strictScorecardJson = {
    enterprise_profile: {
      organization_name: companyName,
      domain: domain,
      industry: currentSub?.industry || "FinTech & Cloud Banking Infrastructure",
      annual_revenue: {
        usd: revenue,
        inr_crores: 541.65
      },
      total_insured_value_tiv: {
        usd: tiv,
        inr_crores: 333.32
      },
      evaluation_timestamp: new Date().toISOString(),
      harmonization_state: hasHarmonized ? "HARMONIZED_SINGLE_STACK" : "UNHARMONIZED_ACTIVE_GAPS"
    },
    unified_single_stack_health_score: {
      master_score: masterScore,
      scale: "0-100",
      grade: hasHarmonized ? "A+ Autonomous / Preferred" : "C+ Substandard / Gaps Detected",
      resiliency_tier: hasHarmonized ? "Tier 1 - Continuous Self-Healing" : "Tier 3 - Manual Review Required",
      harmonization_status: hasHarmonized ? "ALL_PILLARS_ALIGNED" : "ACTION_REQUIRED"
    },
    four_pillars_evaluation: {
      security_operations: {
        pillar_id: "PILLAR-01",
        name: "Security Operations",
        health_score: secOpsScore,
        active_issues_count: secOpsIssues,
        active_issues_detail: hasHarmonized ? [] : [
          "3 Critical pastebin dark web credential dumps",
          "5 Unauthenticated API gateway probes",
          "4 Root console logins without hardware MFA"
        ],
        edr_parity_pct: hasHarmonized ? 100 : 98.4,
        mttd_minutes: hasHarmonized ? 4 : 14,
        financial_exposure_usd: hasHarmonized ? 150000 : 680000,
        financial_exposure_inr_crores: hasHarmonized ? 1.25 : 5.67
      },
      risk_management: {
        pillar_id: "PILLAR-02",
        name: "Risk Management & Attack Surface",
        health_score: riskMgmtScore,
        active_issues_count: riskIssues,
        active_issues_detail: hasHarmonized ? [] : [
          "Exposed staging MongoDB replica port 27017",
          "Shared 4th-party API vendor dependency without SLA",
          "CVE-2024-3094 unpatched in staging runner base image"
        ],
        cascade_multiplier: hasHarmonized ? "1.0x (Isolated)" : "2.4x Tail Risk Expansion",
        financial_exposure_usd: hasHarmonized ? 320000 : 1250000,
        financial_exposure_inr_crores: hasHarmonized ? 2.67 : 10.42
      },
      compliance_automation: {
        pillar_id: "PILLAR-03",
        name: "Compliance Automation",
        health_score: complianceScore,
        active_issues_count: complianceIssues,
        active_issues_detail: hasHarmonized ? [] : [
          "DPDP 2025 Section 8(5) unencrypted PII at rest",
          "SEBI CSCRF Domain 9.3 6-hour reporting automation missing",
          "ISO 27001 CC6.1 quarterly privileged access review gap"
        ],
        statutory_safe_harbor_status: hasHarmonized ? "FULL_SAFE_HARBOR_VERIFIED" : "AT_RISK_STATUTORY_PENALTY",
        financial_exposure_usd: hasHarmonized ? 250000 : 850000,
        financial_exposure_inr_crores: hasHarmonized ? 2.08 : 7.08
      },
      cyber_insurance: {
        pillar_id: "PILLAR-04",
        name: "Cyber Insurance & Risk Transfer",
        health_score: insuranceScore,
        active_issues_count: insuranceIssues,
        active_issues_detail: hasHarmonized ? [] : [
          "Ransomware coinsurance dispute regarding offline backups",
          "Unendorsed Contingent Business Interruption (CBI) sublimit",
          "Breach notice issued on Warranty Clause 4B"
        ],
        annual_indicated_premium_inr: currentPremium,
        dynamic_compliance_credit_applied_pct: hasHarmonized ? 18 : 0,
        carrier_syndicate: "RiskPulse Syndicate 1892 (Lloyd's & GIFT City Re)",
        financial_exposure_usd: hasHarmonized ? 100000 : 420000,
        financial_exposure_inr_crores: hasHarmonized ? 0.83 : 3.50
      }
    },
    aggregate_financial_exposure: {
      annual_loss_expectancy_ale: {
        usd: aleUsd,
        inr_crores: aleInrCrores
      },
      tail_risk_99_5_var: {
        usd: tailRiskUsd,
        inr_crores: tailRiskInrCrores
      },
      net_exposure_delta_via_harmonization: {
        ale_reduction_usd: 2080000,
        ale_reduction_inr_crores: 17.34,
        ale_drop_percentage: 65.0,
        annual_insurance_cash_savings_inr: 17100
      }
    },
    binding_underwriting_rules: [
      "Rule 01: Continuous runtime telemetry connection required for active 18% compliance discount.",
      "Rule 02: Zero unresolved Critical CVEs past 7-day SLA to maintain ransomware coinsurance waiver.",
      "Rule 03: Automated DPDP Section 8(5) column encryption warranty endorsed on policy binder."
    ],
    compliance_audit_evidence: {
      iso_27001_certified: true,
      dpdp_2025_safe_harbor_certified: true,
      sebi_cscrf_6hr_playbook_automated: true
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner / Entity Selector */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 via-teal-500/20 to-emerald-500/20 border border-cyan-500/40 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                Four-Pillar Resiliency Hub
                <span className="text-[11px] font-mono px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full font-bold">
                  MITIGATA ARCHITECTURE
                </span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
              Unified operating layer aggregating <strong>Security Operations</strong>, <strong>Risk Management</strong>, <strong>Compliance Automation</strong>, and <strong>Cyber Insurance</strong> into one single-stack health index and automated underwriting engine.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsPitchModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>30-Sec Intro</span>
            </button>

            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02]"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Strict JSON</span>
            </button>

            {!hasHarmonized ? (
              <button
                onClick={handleAutoHarmonize}
                disabled={isHarmonizing}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Zap className={`w-4 h-4 ${isHarmonizing ? 'animate-spin' : ''}`} />
                <span>{isHarmonizing ? 'Harmonizing Single-Stack...' : 'Auto-Harmonize Stack'}</span>
              </button>
            ) : (
              <button
                onClick={handleResetHarmonization}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Simulation</span>
              </button>
            )}
          </div>
        </div>

        {/* Insured Entity Selector */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">Target Insured Entity:</span>
            <select
              value={selectedSubId}
              onChange={(e) => {
                setSelectedSubId(e.target.value);
                const sub = submissions.find(s => s.id === e.target.value);
                if (sub && onSelectSubmission) onSelectSubmission(sub);
              }}
              className="bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-medium"
            >
              {submissions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.companyName} ({s.industry} • TIV ${(s.tiv / 1000000).toFixed(1)}M)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Primary Domain: <strong className="text-white">{domain}</strong></span>
            <span>•</span>
            <span>Harmonization Engine: <strong className="text-emerald-400">Mitigata Resiliency v4.2</strong></span>
          </div>
        </div>
      </div>

      {/* AUTO-HARMONIZE WORKFLOW SIMULATION PROGRESS */}
      {isHarmonizing && (
        <div className="p-4 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/80 border border-emerald-500/40 rounded-2xl space-y-3 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-400 flex items-center gap-2">
              <Zap className="w-4 h-4 animate-spin text-emerald-400" />
              Executing Automated Cross-Pillar Harmonization...
            </span>
            <span className="font-mono text-cyan-300 font-bold">Step {harmonizeStep} of 4</span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(harmonizeStep / 4) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            <div className={`p-2 rounded-lg border ${harmonizeStep >= 1 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
              1. Quarantining 12 SecOps Alerts
            </div>
            <div className={`p-2 rounded-lg border ${harmonizeStep >= 2 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
              2. Remediating 8 Vendor Risks
            </div>
            <div className={`p-2 rounded-lg border ${harmonizeStep >= 3 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
              3. Enforcing 5 DPDP Controls
            </div>
            <div className={`p-2 rounded-lg border ${harmonizeStep >= 4 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
              4. Re-Pricing Cyber Insurance (-18%)
            </div>
          </div>
        </div>
      )}

      {/* SINGLE-STACK HEALTH SCORE (MASTER SCORE) HERO BANNER */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Big Radial/Circle Score */}
            <div className={`relative w-24 h-24 rounded-2xl flex flex-col items-center justify-center border shadow-xl ${
              masterScore >= 90
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/40 text-amber-400'
            }`}>
              <span className="text-3xl font-black">{masterScore}</span>
              <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 animate-ping opacity-75" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Single-Stack Health Score (Unified Master Index)
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  hasHarmonized
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {hasHarmonized ? 'HARMONIZED • TIER 1' : 'UNHARMONIZED • TIER 3'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                {hasHarmonized
                  ? 'Autonomous Cross-Pillar Harmony Achieved'
                  : 'Fragmented Operational Stack Detected across 4 Pillars'}
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                {hasHarmonized
                  ? 'All 28 active gaps across SecOps, Risk, Compliance, and Insurance have been harmonized and mathematically bound into the carrier policy.'
                  : '12 security alerts, 8 unowned vendor risks, 5 compliance gaps, and 3 claims risks require unified mitigation.'}
              </p>
            </div>
          </div>

          {/* Aggregate Financial Metrics */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Annual Loss Expectancy</span>
              <div className="text-lg font-bold text-white mt-0.5">
                ${(aleUsd / 1000000).toFixed(2)}M <span className="text-xs text-cyan-400 font-mono">(₹{aleInrCrores} Cr)</span>
              </div>
              <span className={`text-[10px] font-mono block ${hasHarmonized ? 'text-emerald-400' : 'text-slate-500'}`}>
                {hasHarmonized ? 'Reduced by -65% (-₹17.34 Cr)' : 'Standard Portfolio Exposure'}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Indicated Premium</span>
              <div className="text-lg font-bold text-white mt-0.5">
                ₹{currentPremium.toLocaleString()}/yr
              </div>
              <span className={`text-[10px] font-mono block ${hasHarmonized ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                {hasHarmonized ? '18% Dynamic Compliance Discount' : 'Base Rate (No Discount)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FOUR DISTINCT INTERACTIVE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: SECURITY OPERATIONS */}
        <div 
          onClick={() => setExpandedPillar('secops')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden shadow-lg ${
            expandedPillar === 'secops'
              ? 'bg-slate-900 border-cyan-500/60 ring-1 ring-cyan-500/40'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Security Operations</h3>
            </div>
            <span className="text-xs font-mono font-black text-cyan-400">
              {secOpsScore}%
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Active Issue Metric */}
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Active SecOps Issues:</span>
              <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                secOpsIssues > 0
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {secOpsIssues > 0 ? `${secOpsIssues} open security alerts` : '0 Active Alerts'}
              </span>
            </div>

            <div className="flex justify-between text-slate-400 pt-1">
              <span>EDR Coverage:</span>
              <strong className="text-slate-200">{hasHarmonized ? '100% Full Parity' : '98.4% Production'}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Financial Exposure:</span>
              <strong className="text-rose-400 font-mono">{hasHarmonized ? '$150k (₹1.25 Cr)' : '$680k (₹5.67 Cr)'}</strong>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-cyan-400 font-medium">
            <span>{expandedPillar === 'secops' ? 'Viewing Details' : 'Click to inspect alerts'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* CARD 2: RISK MANAGEMENT */}
        <div 
          onClick={() => setExpandedPillar('risk')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden shadow-lg ${
            expandedPillar === 'risk'
              ? 'bg-slate-900 border-amber-500/60 ring-1 ring-amber-500/40'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Network className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Risk Management</h3>
            </div>
            <span className="text-xs font-mono font-black text-amber-400">
              {riskMgmtScore}%
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Active Issue Metric */}
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Unowned Vendor Risks:</span>
              <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                riskIssues > 0
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {riskIssues > 0 ? `${riskIssues} unowned risks` : '0 Vendor Gaps'}
              </span>
            </div>

            <div className="flex justify-between text-slate-400 pt-1">
              <span>Cascade Multiplier:</span>
              <strong className="text-slate-200">{hasHarmonized ? '1.0x (Isolated)' : '2.4x Tail Expansion'}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Financial Exposure:</span>
              <strong className="text-amber-400 font-mono">{hasHarmonized ? '$320k (₹2.67 Cr)' : '$1.25M (₹10.42 Cr)'}</strong>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-amber-400 font-medium">
            <span>{expandedPillar === 'risk' ? 'Viewing Details' : 'Click to inspect risks'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* CARD 3: COMPLIANCE AUTOMATION */}
        <div 
          onClick={() => setExpandedPillar('compliance')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden shadow-lg ${
            expandedPillar === 'compliance'
              ? 'bg-slate-900 border-emerald-500/60 ring-1 ring-emerald-500/40'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Scale className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Compliance Automation</h3>
            </div>
            <span className="text-xs font-mono font-black text-emerald-400">
              {complianceScore}%
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Active Issue Metric */}
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Failing Controls:</span>
              <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                complianceIssues > 0
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {complianceIssues > 0 ? `${complianceIssues} controls failing` : '0 Control Failures'}
              </span>
            </div>

            <div className="flex justify-between text-slate-400 pt-1">
              <span>DPDP 2025 Readiness:</span>
              <strong className="text-slate-200">{hasHarmonized ? '100% Safe Harbor' : '86% Partial'}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Statutory Exposure:</span>
              <strong className="text-emerald-400 font-mono">{hasHarmonized ? '₹0 (Safe Harbor)' : '₹450 Crores Cap'}</strong>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-emerald-400 font-medium">
            <span>{expandedPillar === 'compliance' ? 'Viewing Details' : 'Click to inspect controls'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* CARD 4: CYBER INSURANCE */}
        <div 
          onClick={() => setExpandedPillar('insurance')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden shadow-lg ${
            expandedPillar === 'insurance'
              ? 'bg-slate-900 border-purple-500/60 ring-1 ring-purple-500/40'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                <Shield className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Cyber Insurance</h3>
            </div>
            <span className="text-xs font-mono font-black text-purple-400">
              {insuranceScore}%
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Active Issue Metric */}
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Pending Claims Risks:</span>
              <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                insuranceIssues > 0
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {insuranceIssues > 0 ? `${insuranceIssues} pending claims` : '0 Claims Disputes'}
              </span>
            </div>

            <div className="flex justify-between text-slate-400 pt-1">
              <span>Dynamic Credit:</span>
              <strong className="text-emerald-400 font-mono">{hasHarmonized ? '-18% Applied' : '0% (Standard)'}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Annual Premium:</span>
              <strong className="text-cyan-400 font-mono">₹{currentPremium.toLocaleString()}</strong>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-purple-400 font-medium">
            <span>{expandedPillar === 'insurance' ? 'Viewing Details' : 'Click to inspect policy'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* EXPANDED INTERACTIVE DRILL-DOWN PANEL */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              {expandedPillar === 'secops' && 'Pillar 1: Security Operations — Active Alert Quarantine & EDR Telemetry'}
              {expandedPillar === 'risk' && 'Pillar 2: Risk Management — Attack Surface & 4th-Party Vendor Cascade'}
              {expandedPillar === 'compliance' && 'Pillar 3: Compliance Automation — DPDP 2025, ISO 27001 & SEBI CSCRF'}
              {expandedPillar === 'insurance' && 'Pillar 4: Cyber Insurance — Claims Arbitrage & Dynamic Policy Re-Rating'}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {hasHarmonized ? 'State: 100% Harmonized' : 'State: Remediation Action Required'}
          </span>
        </div>

        {/* Pillar Details */}
        {expandedPillar === 'secops' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Threat Detection Engine</span>
                <strong className="text-white text-sm">Clustered Wazuh & Splunk SIEM</strong>
                <div className="text-emerald-400 text-[11px] mt-1 font-mono">Live Ingestion Rate: 12,400 eps</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Dark Web Pastebin Scraper</span>
                <strong className="text-white text-sm">BreachForums & Telegram Botnet</strong>
                <div className="text-rose-400 text-[11px] mt-1 font-mono">{hasHarmonized ? 'Credentials Rotated' : 'Leaked admin credentials active'}</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">EDR Deployment</span>
                <strong className="text-white text-sm">CrowdStrike Falcon Sensor</strong>
                <div className="text-cyan-400 text-[11px] mt-1 font-mono">100% Production Coverage</div>
              </div>
            </div>

            {/* List of active alerts */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">
                {hasHarmonized ? 'Quarantined & Remediated Alerts (0 Remaining):' : 'Active Open Alerts Requiring Harmonization (12 total):'}
              </span>
              <div className="space-y-1.5 text-xs">
                <div className={`p-2 rounded-lg flex items-center justify-between ${hasHarmonized ? 'bg-emerald-950/20 text-emerald-300' : 'bg-rose-950/20 text-rose-200'}`}>
                  <span>1. Dark Web Pastebin #419: Root admin email & session token exposed</span>
                  <span className="font-mono text-[10px] font-bold">{hasHarmonized ? 'AUTO-REVOKED' : 'CRITICAL'}</span>
                </div>
                <div className={`p-2 rounded-lg flex items-center justify-between ${hasHarmonized ? 'bg-emerald-950/20 text-emerald-300' : 'bg-rose-950/20 text-rose-200'}`}>
                  <span>2. AWS CloudTrail: 5 unauthenticated API probe queries targeting STS assume-role</span>
                  <span className="font-mono text-[10px] font-bold">{hasHarmonized ? 'BLOCKED & ISOLATED' : 'CRITICAL'}</span>
                </div>
                <div className={`p-2 rounded-lg flex items-center justify-between ${hasHarmonized ? 'bg-emerald-950/20 text-emerald-300' : 'bg-amber-950/20 text-amber-200'}`}>
                  <span>3. Production Bastion: 4 root console logins without mandatory hardware FIDO2 token</span>
                  <span className="font-mono text-[10px] font-bold">{hasHarmonized ? 'FIDO2 ENFORCED' : 'HIGH'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {expandedPillar === 'risk' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Third-Party Ecosystem</span>
                <strong className="text-white text-sm">8 Connected Vendors</strong>
                <div className="text-amber-400 text-[11px] mt-1 font-mono">Stripe, AWS, Okta, Workday, etc.</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Cascade Risk Exposure</span>
                <strong className="text-white text-sm">{hasHarmonized ? '1.0x Tail Risk' : '2.4x Multiplier'}</strong>
                <div className="text-cyan-400 text-[11px] mt-1 font-mono">4th-Party API vendor isolated</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Perimeter Exposure</span>
                <strong className="text-white text-sm">{hasHarmonized ? 'All Ports Firewalled' : 'Port 27017 Public'}</strong>
                <div className="text-emerald-400 text-[11px] mt-1 font-mono">Shodan scan clean</div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">
                {hasHarmonized ? 'Remediated Vendor Risks (0 Remaining):' : 'Unowned Risks Requiring Ownership & Mitigation (8 total):'}
              </span>
              <div className="space-y-1.5 text-xs">
                <div className={`p-2 rounded-lg flex items-center justify-between ${hasHarmonized ? 'bg-emerald-950/20 text-emerald-300' : 'bg-amber-950/20 text-amber-200'}`}>
                  <span>1. MongoDB Staging Replica: Open port 27017 containing unencrypted financial test ledger</span>
                  <span className="font-mono text-[10px] font-bold">{hasHarmonized ? 'FIREWALLED' : 'UNOWNED'}</span>
                </div>
                <div className={`p-2 rounded-lg flex items-center justify-between ${hasHarmonized ? 'bg-emerald-950/20 text-emerald-300' : 'bg-amber-950/20 text-amber-200'}`}>
                  <span>2. 4th-Party Payment API Gateway: Lacks SOC 2 Type II audit report attestation</span>
                  <span className="font-mono text-[10px] font-bold">{hasHarmonized ? 'SLA BOUND' : 'HIGH RISK'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {expandedPillar === 'compliance' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">DPDP Act 2025</span>
                <strong className="text-white text-sm">Section 8(5) & 8(7) Safeguards</strong>
                <div className="text-emerald-400 text-[11px] mt-1 font-mono">{hasHarmonized ? 'Safe Harbor Active' : 'Statutory Fine Risk: ₹250 Cr'}</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">SEBI CSCRF</span>
                <strong className="text-white text-sm">Domain 9.3 6-Hour Reporting</strong>
                <div className="text-cyan-400 text-[11px] mt-1 font-mono">Automated incident notification playbook</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">ISO 27001:2022</span>
                <strong className="text-white text-sm">Stage 2 Surveillance</strong>
                <div className="text-emerald-400 text-[11px] mt-1 font-mono">91.2% Control Adherence</div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">
                {hasHarmonized ? 'Failing Controls Remediated (0 Remaining):' : 'Failing Controls Under Audit (5 total):'}
              </span>
              <div className="space-y-1.5 text-xs">
                <div className={`p-2 rounded-lg flex items-center justify-between ${hasHarmonized ? 'bg-emerald-950/20 text-emerald-300' : 'bg-purple-950/20 text-purple-200'}`}>
                  <span>1. DPDP Section 8(5): Failure to encrypt customer PII (Aadhaar/PAN) at rest with AES-256</span>
                  <span className="font-mono text-[10px] font-bold">{hasHarmonized ? 'AES-256 GCM ENFORCED' : 'FAILING'}</span>
                </div>
                <div className={`p-2 rounded-lg flex items-center justify-between ${hasHarmonized ? 'bg-emerald-950/20 text-emerald-300' : 'bg-purple-950/20 text-purple-200'}`}>
                  <span>2. SEBI CSCRF Domain 6.1: Missing centralized HSM key management rotation</span>
                  <span className="font-mono text-[10px] font-bold">{hasHarmonized ? 'AWS KMS ROTATION ACTIVE' : 'FAILING'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {expandedPillar === 'insurance' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Master Policy Binder</span>
                <strong className="text-white text-sm">RiskPulse Syndicate 1892</strong>
                <div className="text-cyan-400 text-[11px] mt-1 font-mono">$10,000,000 Primary Blanket Limit</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Dynamic Actuarial Adjustment</span>
                <strong className="text-emerald-400 text-sm">{hasHarmonized ? '-18% Continuous Discount' : 'Standard Rate (₹95,000)'}</strong>
                <div className="text-emerald-400 text-[11px] mt-1 font-mono">{hasHarmonized ? 'Annual Cash Savings: ₹17,100' : 'Zero discount applied'}</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Pending Claims Dispute</span>
                <strong className="text-white text-sm">{hasHarmonized ? 'All Claims Endorsed & Settled' : '3 Pending Claims Disputes'}</strong>
                <div className="text-rose-400 text-[11px] mt-1 font-mono">{hasHarmonized ? 'Ransomware waiver active' : 'Warranty 4B breach flagged'}</div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">
                {hasHarmonized ? 'Settled Claims Risks (0 Remaining):' : 'Pending Claims Risks Requiring Arbitrage (3 total):'}
              </span>
              <div className="space-y-1.5 text-xs">
                <div className={`p-2 rounded-lg flex items-center justify-between ${hasHarmonized ? 'bg-emerald-950/20 text-emerald-300' : 'bg-rose-950/20 text-rose-200'}`}>
                  <span>1. Ransomware Coinsurance Dispute: Insured lacked cryptographic backup attestation</span>
                  <span className="font-mono text-[10px] font-bold">{hasHarmonized ? 'WAIVED & ENDORSED' : 'DISPUTED'}</span>
                </div>
                <div className={`p-2 rounded-lg flex items-center justify-between ${hasHarmonized ? 'bg-emerald-950/20 text-emerald-300' : 'bg-rose-950/20 text-rose-200'}`}>
                  <span>2. Warranty Clause 4B: Underwriter issued 24-hr suspension notice for leaked credentials</span>
                  <span className="font-mono text-[10px] font-bold">{hasHarmonized ? 'REINSTATED' : 'BREACH NOTICED'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* STRICT JSON MODAL */}
      {isJsonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Strict Multi-Pillar Resiliency Scorecard (JSON)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Mitigata-compliant payload formatted for front-end ingestion & underwriting APIs.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsJsonModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
              <span className="font-mono text-cyan-300">Format: application/json • Engine: Mitigata Core Resiliency AI</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(strictScorecardJson, null, 2));
                  setCopiedJson(true);
                  setTimeout(() => setCopiedJson(false), 2000);
                }}
                className="flex items-center gap-1 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-xs transition-colors"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? 'Copied to Clipboard!' : 'Copy JSON'}</span>
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 select-all leading-relaxed max-h-[500px]">
              <pre>{JSON.stringify(strictScorecardJson, null, 2)}</pre>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsJsonModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 30-SECOND PITCH MODAL */}
      {isPitchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    30-Second Hackathon Introduction Script
                  </h3>
                  <p className="text-xs text-purple-300">
                    High-impact pitch script for RiskPulse AI & Mitigata
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPitchModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-purple-500/30 text-xs text-slate-200 space-y-3 leading-relaxed">
              <blockquote className="border-l-4 border-cyan-500 pl-3 italic text-white font-medium text-sm">
                "Today, enterprise security is broken: businesses juggle 12 fragmented tools, endure four-week onboarding cycles, and wait months for underwriters to manually review PDFs — leaving massive blind spots in their balance sheet."
              </blockquote>
              <p>
                <strong>RiskPulse AI solves this in seconds.</strong> We are the world's first unified operating stack that detects live dark web threats, automatically enforces regulatory compliance like DPDP and SEBI CSCRF, and binds dynamic cyber insurance policies in real time.
              </p>
              <p className="text-emerald-300 font-semibold">
                By closing the loop between code patches and premium discounts, we turn cyber insurance from an expensive, static annual cost into an active, self-healing resilience loop.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsPitchModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
              >
                Close Script
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
