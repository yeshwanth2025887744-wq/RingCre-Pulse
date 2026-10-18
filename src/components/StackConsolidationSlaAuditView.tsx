import React, { useState } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Terminal, 
  DollarSign, 
  TrendingDown, 
  ShieldCheck, 
  RefreshCw, 
  X, 
  Copy, 
  Check, 
  Sliders, 
  Building2, 
  Activity, 
  FileText,
  Zap,
  Network
} from 'lucide-react';
import { Submission } from '../types/underwriting';

interface StackConsolidationSlaAuditViewProps {
  submissions: Submission[];
  selectedSubmission: Submission | null;
  onSelectSubmission?: (sub: Submission) => void;
  onOpenCopilotWithContext?: (sub: Submission | null, prompt?: string) => void;
  onOpenBoardBrief?: () => void;
}

interface VendorOption {
  id: string;
  name: string;
  category: 'EDR' | 'SIEM' | 'Compliance' | 'Broker' | 'AttackSurface' | 'Scanner';
  annualCostUsd: number;
  slaLatencyHours: number;
  unmappedGapDescription: string;
}

const availableVendors: VendorOption[] = [
  {
    id: 'v-1',
    name: 'CrowdStrike Falcon (Standalone EDR)',
    category: 'EDR',
    annualCostUsd: 48000,
    slaLatencyHours: 336, // 14 days
    unmappedGapDescription: 'EDR flags root credential leaks but does not notify cyber underwriter; risks Warranty 4B breach.'
  },
  {
    id: 'v-2',
    name: 'Splunk Enterprise (Separate SIEM)',
    category: 'SIEM',
    annualCostUsd: 52000,
    slaLatencyHours: 168, // 7 days
    unmappedGapDescription: 'Alert correlation separated from insurance actuary; high false-positive rate inflates risk tier.'
  },
  {
    id: 'v-3',
    name: 'Vanta / Drata (Siloed Compliance)',
    category: 'Compliance',
    annualCostUsd: 36000,
    slaLatencyHours: 2160, // 90 days quarterly
    unmappedGapDescription: 'Quarterly static screenshots fail to satisfy DPDP Section 8(5) continuous encryption mandates.'
  },
  {
    id: 'v-4',
    name: 'Traditional Cyber Insurance Broker',
    category: 'Broker',
    annualCostUsd: 22000,
    slaLatencyHours: 672, // 28 days (4 weeks)
    unmappedGapDescription: '120-question PDF paperwork causes 4-week onboarding delay and unpriced zero-day exclusions.'
  },
  {
    id: 'v-5',
    name: 'SecurityScorecard (External Surface)',
    category: 'AttackSurface',
    annualCostUsd: 18000,
    slaLatencyHours: 72,
    unmappedGapDescription: 'External DNS/IP scan decoupled from internal IAM and code repo reality, creating phantom findings.'
  },
  {
    id: 'v-6',
    name: 'Tenable Nessus / Qualys (Scanner)',
    category: 'Scanner',
    annualCostUsd: 24000,
    slaLatencyHours: 120,
    unmappedGapDescription: 'Vulnerability lists generated without actuarial financial loss weighting or automated code patches.'
  }
];

export const StackConsolidationSlaAuditView: React.FC<StackConsolidationSlaAuditViewProps> = ({
  submissions,
  selectedSubmission,
  onSelectSubmission,
  onOpenCopilotWithContext,
  onOpenBoardBrief
}) => {
  const defaultSub = selectedSubmission || submissions[0];
  const [selectedSubId, setSelectedSubId] = useState<string>(defaultSub?.id || 'sub-001');

  const currentSub = submissions.find(s => s.id === selectedSubId) || defaultSub;
  const companyName = currentSub?.companyName || 'Apex Global Financial Technologies';

  // Vendor selection state
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([
    'v-1', 'v-2', 'v-3', 'v-4', 'v-5'
  ]);

  // Consolidation state
  const [isConsolidated, setIsConsolidated] = useState<boolean>(false);
  const [isConsolidating, setIsConsolidating] = useState<boolean>(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);
  const [isExecSummaryModalOpen, setIsExecSummaryModalOpen] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  const toggleVendor = (id: string) => {
    setSelectedVendorIds(prev => 
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const handleConsolidate = () => {
    setIsConsolidating(true);
    setTimeout(() => {
      setIsConsolidating(false);
      setIsConsolidated(true);
    }, 1800);
  };

  const handleReset = () => {
    setIsConsolidated(false);
  };

  // Calculations
  const selectedVendorsList = availableVendors.filter(v => selectedVendorIds.includes(v.id));
  const totalFragmentedLicenseCost = selectedVendorsList.reduce((acc, curr) => acc + curr.annualCostUsd, 0);
  const hiddenAdministrativeCost = Math.round(selectedVendorsList.length * 18400); // Admin overhead
  const totalFragmentedSpend = totalFragmentedLicenseCost + hiddenAdministrativeCost;

  const baselineRiskScore = 84;
  const consolidatedRiskScore = Math.round(baselineRiskScore * 0.75); // 25% drop (84 -> 63)
  const currentRiskScore = isConsolidated ? consolidatedRiskScore : baselineRiskScore;

  const onboardingTime = isConsolidated ? '< 3 Minutes' : '4 Weeks (28 Days)';
  const netSavingsAnnualUsd = 185100;
  const netSavingsAnnualInrCrores = 1.54;

  const strictAuditJson = {
    audit_meta: {
      organization_name: companyName,
      consultant_role: "Enterprise Cyber-Resilience and Vendor Consolidation Consultant",
      framework_version: "RiskPulse Multi-Vendor Harmonizer v3.2",
      evaluation_timestamp: new Date().toISOString()
    },
    current_fragmented_stack: {
      vendor_count: selectedVendorsList.length,
      vendors_selected: selectedVendorsList.map(v => v.name),
      direct_software_license_spend_usd: totalFragmentedLicenseCost,
      hidden_administrative_overhead_usd: hiddenAdministrativeCost,
      total_annual_cost_usd: totalFragmentedSpend,
      total_annual_cost_inr_crores: Number(((totalFragmentedSpend * 83.33) / 10000000).toFixed(2))
    },
    sla_blind_spots_and_communication_gaps: [
      {
        gap_id: "GAP-01",
        name: "Alert-to-Underwrite Latency Blind Spot",
        severity: "CRITICAL",
        latency: isConsolidated ? "< 30 seconds" : "14 to 28 days",
        impact: "Technical findings detected by standalone EDR sit unpatched in engineering tickets without notifying insurance actuary, silently voiding policy warranty coverage."
      },
      {
        gap_id: "GAP-02",
        name: "Siloed Compliance vs Threat Reality Disconnect",
        severity: "HIGH",
        latency: isConsolidated ? "Continuous (Real-time)" : "90 days quarterly",
        impact: "Static audit screenshots collected by standalone compliance platforms miss active CVEs and exposed cloud database ports, violating DPDP Section 8(5)."
      },
      {
        gap_id: "GAP-03",
        name: "Manual Insurance Broker Onboarding Lag",
        severity: "HIGH",
        latency: isConsolidated ? "3 minutes automated bind" : "4 weeks (28 days)",
        impact: "120-field manual paper questionnaires delay policy binding by weeks, during which enterprise operates with zero contingent ransomware or business interruption coverage."
      }
    ],
    single_stack_consolidation_impact: {
      risk_score_reduction_percentage: 25.0,
      baseline_risk_score: baselineRiskScore,
      consolidated_risk_score: consolidatedRiskScore,
      onboarding_time_reduction: {
        from: "4 Weeks (28 Days)",
        to: "< 3 Minutes",
        efficiency_gain: "13,440x faster execution"
      },
      financial_roi: {
        annual_cash_savings_usd: netSavingsAnnualUsd,
        annual_cash_savings_inr_crores: netSavingsAnnualInrCrores,
        net_roi_multiplier: "4.8x First-Year Net ROI"
      }
    },
    transition_roadmap: [
      {
        step: 1,
        timeline: "Day 1 (15 minutes)",
        action: "Deploy lightweight RiskPulse agent to eliminate monitoring silos and activate 24/7 dark web radar."
      },
      {
        step: 2,
        timeline: "Days 2 to 7",
        action: "Autonomous patch scripts resolve active CVEs, enforce DPDP AES-256 encryption, and firewall exposed ports."
      },
      {
        step: 3,
        timeline: "Day 8",
        action: "Decommission standalone compliance tools; execute automated Syndicate 1892 policy binder with 18% dynamic discount."
      }
    ]
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner / Entity Selector */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-cyan-500/20 border border-indigo-500/40 flex items-center justify-center">
                <Layers className="w-5 h-5 text-indigo-400" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                Stack Consolidation & SLA Audit
                <span className="text-[11px] font-mono px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full font-bold">
                  MULTI-VENDOR HARMONIZER
                </span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
              Audit the hidden overhead, communication gaps, and SLA latency caused by splintered security tooling. Benchmark your current multi-vendor stack against RiskPulse AI's single-stack unified operating layer.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenBoardBrief && (
              <button
                onClick={onOpenBoardBrief}
                className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-600/30 to-orange-600/30 hover:from-amber-600/40 hover:to-orange-600/40 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02]"
              >
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>C-Suite Board Brief</span>
              </button>
            )}

            <button
              onClick={() => setIsExecSummaryModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02]"
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>Exec Summary</span>
            </button>

            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02]"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Strict JSON</span>
            </button>

            {!isConsolidated ? (
              <button
                onClick={handleConsolidate}
                disabled={isConsolidating}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-950/60 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Zap className={`w-4 h-4 ${isConsolidating ? 'animate-spin' : ''}`} />
                <span>{isConsolidating ? 'Consolidating Stack...' : 'Consolidate to Single-Stack'}</span>
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Comparison</span>
              </button>
            )}
          </div>
        </div>

        {/* Selected Entity */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">Audited Enterprise:</span>
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
            <span>Selected Vendors: <strong className="text-white">{selectedVendorIds.length} Tools</strong></span>
            <span>•</span>
            <span>Annual License Spend: <strong className="text-rose-400">${totalFragmentedLicenseCost.toLocaleString()}</strong></span>
          </div>
        </div>
      </div>

      {/* METRIC HERO TILES: 25% RISK REDUCTION & 4-WEEK TO MINUTES SPEEDUP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Onboarding Time */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isConsolidated 
            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
            : 'bg-slate-900/80 border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Policy Onboarding Time</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {onboardingTime}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Traditional Cycle:</span>
            <span className="font-mono text-rose-400 font-bold">4 Weeks (28 Days)</span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-400 font-mono">
            {isConsolidated ? '✓ Instant 3-Minute Telemetry Bind' : 'Manual questionnaires delay coverage'}
          </div>
        </div>

        {/* Risk Score Reduction (-25%) */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isConsolidated 
            ? 'bg-emerald-950/20 border-emerald-500/40'
            : 'bg-slate-900/80 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Cyber Risk Score</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{currentRiskScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
            {isConsolidated && (
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                -25% Reduction
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Baseline Score:</span>
            <span className="font-mono text-slate-300">{baselineRiskScore}/100</span>
          </div>
          <div className="mt-2 text-[10px] font-mono text-cyan-400">
            {isConsolidated ? 'Progressed to Tier 1 Preferred' : 'Substandard Fragmented Rating'}
          </div>
        </div>

        {/* Eliminated Operational Waste */}
        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Annual Overhead Reclaimed</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            ${netSavingsAnnualUsd.toLocaleString()} <span className="text-xs font-mono text-emerald-300">(₹{netSavingsAnnualInrCrores} Cr)</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Engineering Hours Saved:</span>
            <span className="font-mono text-white font-bold">460 hrs / year</span>
          </div>
          <div className="mt-2 text-[10px] font-mono text-slate-500">
            Redundant license fees + manual form filling eliminated
          </div>
        </div>

        {/* Net ROI */}
        <div className="p-4 bg-slate-900/80 rounded-2xl border border-purple-500/30">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Consolidation ROI</span>
            <TrendingDown className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">
            4.8x Net ROI
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Payback Period:</span>
            <span className="font-mono text-white font-bold">44 Days</span>
          </div>
          <div className="mt-2 text-[10px] font-mono text-purple-300">
            18% Dynamic Insurance Discount Included
          </div>
        </div>
      </div>

      {/* TWO COLUMN WORKBENCH: Left = Vendor Stack Selector, Right = SLA Blind Spot AI Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: VENDOR SELECTOR TOOL (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              1. Select Current Fragmented Vendors
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Check the standalone security products currently deployed in your enterprise stack.
            </p>
          </div>

          <div className="space-y-2.5">
            {availableVendors.map((vendor) => {
              const isSelected = selectedVendorIds.includes(vendor.id);
              return (
                <div
                  key={vendor.id}
                  onClick={() => toggleVendor(vendor.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/20 border-indigo-500/40 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 bg-slate-900'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold">{vendor.name}</h4>
                        <span className="text-[10px] font-mono text-slate-400">
                          Category: {vendor.category}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono text-xs font-bold text-slate-300">
                      ${(vendor.annualCostUsd / 1000).toFixed(0)}k/yr
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-2 text-[11px] text-slate-300 bg-slate-950/80 p-2 rounded-lg border border-slate-800 leading-relaxed">
                      <span className="text-rose-400 font-semibold block">SLA Gap:</span>
                      {vendor.unmappedGapDescription}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Direct Software Spend:</span>
              <strong className="text-white">${totalFragmentedLicenseCost.toLocaleString()}/yr</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Administrative Overhead (Fringe):</span>
              <strong className="text-rose-400">${hiddenAdministrativeCost.toLocaleString()}/yr</strong>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm">
              <span className="text-slate-300">Total Fragmented Run-Rate:</span>
              <span className="text-rose-400">${totalFragmentedSpend.toLocaleString()}/yr</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI SLA BLIND SPOTS COMPARISON VIEW (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                2. AI SLA Blind Spots & Communication Gaps
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                How fragmented handoffs delay policy underwriting and create silent warranty breaches.
              </p>
            </div>

            <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${
              isConsolidated
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
            }`}>
              {isConsolidated ? 'ALL GAPS RESOLVED' : '3 CRITICAL BLIND SPOTS ACTIVE'}
            </span>
          </div>

          {/* Blind Spots List */}
          <div className="space-y-3">
            {/* Blind Spot 1 */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Blind Spot 1: Alert-to-Underwrite Latency (The Silent Breach)
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {isConsolidated ? 'Real-Time (<30s)' : '14-28 Day Delay'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                When CrowdStrike or SentinelOne identifies leaked root credentials, the finding sits in JIRA backlogs. Because traditional cyber insurance has no telemetry link, the carrier isn't notified—resulting in a <strong>breach of Protective Safeguards Warranty Clause 4B</strong> that voids coverage during a claim.
              </p>
              <div className="p-2.5 bg-slate-900 rounded-lg text-[11px] text-cyan-300 border border-slate-800 flex items-center justify-between">
                <span><strong>Single-Stack Fix:</strong> Instant API telemetry binds the finding and triggers automated remediation in &lt; 30 seconds.</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
              </div>
            </div>

            {/* Blind Spot 2 */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Blind Spot 2: Static Compliance vs Active Attack Surface Disconnect
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {isConsolidated ? '24/7 Verified' : 'Quarterly Snapshot (90d)'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Siloed compliance tools take static quarterly screenshots for SOC 2. Meanwhile, Shodan indexes an exposed MongoDB replica with 42,000 cleartext PII records—directly violating <strong>DPDP Act 2025 Section 8(5)</strong> and inviting ₹250 Cr penalties.
              </p>
              <div className="p-2.5 bg-slate-900 rounded-lg text-[11px] text-cyan-300 border border-slate-800 flex items-center justify-between">
                <span><strong>Single-Stack Fix:</strong> Continuous cryptographic control checks maintain certified Safe Harbor around the clock.</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
              </div>
            </div>

            {/* Blind Spot 3 */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-400" />
                  Blind Spot 3: 4-Week Manual Broker Questionnaires
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {isConsolidated ? '3 Minutes' : '28 Days Friction'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Traditional cyber brokers pass 120-question PDF forms between IT, legal, and underwriting. During this 4-week lag, the enterprise has no bound policy and pays inflated baseline premiums with zero reward for closed security tickets.
              </p>
              <div className="p-2.5 bg-slate-900 rounded-lg text-[11px] text-cyan-300 border border-slate-800 flex items-center justify-between">
                <span><strong>Single-Stack Fix:</strong> Automated ingestion underwrites and prices bindable policies in 3 minutes with 18% dynamic credits.</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          {!isConsolidated ? (
            <div className="p-4 bg-gradient-to-r from-indigo-950/60 to-purple-950/60 rounded-xl border border-indigo-500/30 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-white">Ready to eliminate multi-vendor friction?</h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Click 'Consolidate to Single-Stack' to simulate immediate 25% risk drop and 3-minute onboarding.
                </p>
              </div>
              <button
                onClick={handleConsolidate}
                disabled={isConsolidating}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-all shrink-0"
              >
                {isConsolidating ? 'Consolidating...' : 'Consolidate Now'}
              </button>
            </div>
          ) : (
            <div className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between">
              <span className="font-semibold">
                ✓ Single-Stack Architecture Active: Risk Score reduced 84 $\rightarrow$ 63 (-25%). Policy bound in &lt; 3 minutes.
              </span>
              <button
                onClick={handleReset}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-bold"
              >
                Reset
              </button>
            </div>
          )}
        </div>
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
                    Vendor Consolidation & SLA Audit Payload (JSON)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Consultant-grade structured JSON output adhering to Mitigata consolidation framework.
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
              <span className="font-mono text-cyan-300">Format: application/json • Role: Cyber-Resilience & Consolidation Consultant</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(strictAuditJson, null, 2));
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
              <pre>{JSON.stringify(strictAuditJson, null, 2)}</pre>
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

      {/* EXECUTIVE SUMMARY MODAL */}
      {isExecSummaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Executive Summary: The Balance-Sheet Operating Layer
                  </h3>
                  <p className="text-xs text-purple-300">
                    Prepared for Enterprise Hackathon Judging Panel & Insurance Leadership
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExecSummaryModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-purple-500/30 text-xs text-slate-200 space-y-3 leading-relaxed">
              <blockquote className="border-l-4 border-cyan-500 pl-3 italic text-white font-medium text-sm">
                "The modern enterprise does not have a tooling shortage; it has an integration crisis. Corporations spend millions across fragmented EDR, SIEM, and compliance checkers, yet remain uninsurable due to multi-week onboarding latency and unpriced coverage blind spots."
              </blockquote>
              <p>
                <strong>RiskPulse AI bridges this divide.</strong> By unifying threat operations, statutory compliance automation (DPDP & SEBI), and algorithmic underwriting into a single operating stack, we convert fragmented technical signals into real-time balance-sheet pricing.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-[11px]">
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Onboarding Velocity:</span>
                  <strong className="text-emerald-400">4 Weeks $\rightarrow$ 3 Minutes (13,440x)</strong>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Immediate Risk Reduction:</span>
                  <strong className="text-cyan-400">-25% Certified Drop (84 $\rightarrow$ 63)</strong>
                </div>
              </div>
              <p className="text-emerald-300 font-semibold pt-1">
                For partners like Mitigata, RiskPulse AI turns cyber insurance into a living, automated incentive engine that protects capital, eliminates vendor duplication, and scales corporate resilience.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsExecSummaryModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
              >
                Close Executive Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
