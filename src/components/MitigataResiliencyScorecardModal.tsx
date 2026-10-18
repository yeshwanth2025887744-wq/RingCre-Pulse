import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  Terminal, 
  Copy, 
  Check, 
  Activity, 
  Network, 
  Scale, 
  Shield, 
  DollarSign, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  FileText
} from 'lucide-react';
import { Submission } from '../types/underwriting';

interface MitigataResiliencyScorecardModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSubmission: Submission | null;
}

export const MitigataResiliencyScorecardModal: React.FC<MitigataResiliencyScorecardModalProps> = ({
  isOpen,
  onClose,
  selectedSubmission
}) => {
  const [copiedJson, setCopiedJson] = useState(false);
  const [activeTab, setActiveTab] = useState<'scorecard' | 'json' | 'statement'>('scorecard');

  if (!isOpen) return null;

  const companyName = selectedSubmission?.companyName || 'Apex Global Financial Technologies';
  const domain = companyName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
  const tiv = selectedSubmission?.tiv || 40000000;
  const revenue = selectedSubmission?.revenue || 65000000;

  const inrRate = 83.33;
  const revCrores = ((revenue * inrRate) / 10000000).toFixed(2);
  const tivCrores = ((tiv * inrRate) / 10000000).toFixed(2);

  const scorecardPayload = {
    entity_profile: {
      organization_name: companyName,
      primary_domain: domain,
      industry: selectedSubmission?.industry || "FinTech & Banking Infrastructure",
      annual_revenue: {
        usd: revenue,
        inr_crores: Number(revCrores)
      },
      total_insured_value_tiv: {
        usd: tiv,
        inr_crores: Number(tivCrores)
      },
      evaluation_timestamp: new Date().toISOString(),
      engine_version: "Mitigata Resiliency Intelligence Engine v4.2"
    },
    overall_resiliency_index: {
      score: 78,
      grade: "B+ Strong / Insurable with Remediations",
      resilience_tier: "Tier 2 - Dynamic Self-Healing Eligible",
      trend: "+6.4% MoM (Automated patch deployment active)",
      underwriting_eligibility: "PREFERRED_TERMS_APPROVED"
    },
    operational_pillars: {
      security_operations: {
        pillar_name: "Security Operations",
        health_score: 74,
        status: "ELEVATED_ATTENTION",
        metrics: {
          edr_coverage_percentage: 98.4,
          siem_log_ingestion_coverage: "24/7 Clustered Wazuh & Splunk",
          mean_time_to_detect_mttd_minutes: 14,
          mean_time_to_respond_mttr_minutes: 42,
          active_dark_web_exposures: 2,
          critical_unresolved_alerts: 1
        },
        strengths: [
          "98.4% CrowdStrike/SentinelOne EDR sensor parity across production servers",
          "Automated GitHub & git-hound secrets quarantine active"
        ],
        gaps: [
          "Dark web pastebin leak containing administrative email credentials",
          "Occasional delay in out-of-hours root access alert triage"
        ],
        financial_risk_usd: 680000,
        financial_risk_inr_crores: 5.67
      },
      risk_management: {
        pillar_name: "Risk Management & Attack Surface",
        health_score: 71,
        status: "MODERATE_RISK",
        metrics: {
          external_attack_surface_assets: 14,
          third_party_vendor_dependencies: 8,
          high_risk_tier4_vendor_exposure: "Stripe, AWS, Okta, Workday",
          cascade_risk_multiplier: "2.4x Tail Risk Expansion",
          unpatched_cves_count: 3
        },
        strengths: [
          "Quarterly external attack surface & Shodan port scans automated",
          "Tier-1 cloud vendor SOC 2 compliance verification enforced"
        ],
        gaps: [
          "Exposed MongoDB replica port 27017 detected on staging network",
          "Shared 4th-party API partner dependency lacks SLA guarantee"
        ],
        financial_risk_usd: 1250000,
        financial_risk_inr_crores: 10.42
      },
      compliance_automation: {
        pillar_name: "Compliance Automation",
        health_score: 83,
        status: "HEALTHY",
        metrics: {
          dpdp_2025_readiness_score: 86,
          iso_27001_2022_control_adherence_pct: 91.2,
          sebi_cscrf_domain_compliance_pct: 79.5,
          statutory_safe_harbor_status: "ACTIVE_WITH_WARRANTY",
          six_hour_breach_reporting_readiness: "100% Automated Playbook Ready"
        },
        strengths: [
          "Automated consent revocation and TTL data purging active for DPDP Section 8(7)",
          "Formal ISO 27001:2022 Stage 2 surveillance audit cleared with zero major non-conformities"
        ],
        gaps: [
          "Column-level AES-256 database tokenization pending completion on secondary archive DB"
        ],
        financial_risk_usd: 850000,
        financial_risk_inr_crores: 7.08
      },
      cyber_insurance: {
        pillar_name: "Cyber Insurance & Risk Transfer",
        health_score: 85,
        status: "OPTIMAL_TERMS",
        metrics: {
          current_policy_status: "BOUND & ACTIVE",
          binding_carrier: "RiskPulse Syndicate 1892 (Lloyd's of London & GIFT City Re)",
          annual_premium_usd: 80750,
          annual_premium_inr: 6732000,
          baseline_indicated_premium_usd: 95000,
          mitigata_active_discount_applied: "15% Continuous Compliance Credit (-$14,250/yr)",
          aggregate_policy_limit_usd: 10000000,
          policy_retention_deductible_usd: 25000,
          claims_risk_probability_annual: "3.8% (Benchmark: 9.4%)"
        },
        strengths: [
          "Continuous telemetry link unlocks dynamic monthly premium debits/credits",
          "Ransomware coinsurance waiver granted based on verified offline air-gapped backups"
        ],
        gaps: [
          "Contingent Business Interruption (CBI) sublimit capped at $5,000,000"
        ],
        financial_risk_usd: 420000,
        financial_risk_inr_crores: 3.50
      }
    },
    aggregate_financial_exposure: {
      annual_loss_expectancy_ale: {
        usd: 3200000,
        inr_crores: 26.67
      },
      probable_maximum_loss_pml_tail_risk: {
        usd: 12800000,
        inr_crores: 106.67
      },
      composite_risk_exposure_inr: "₹26.67 Crores Annual Burn Expectancy / ₹106.67 Crores 99.5% Tail Risk",
      exposure_reduction_potential_via_mitigata: {
        ale_savings_usd: 1850000,
        ale_savings_inr_crores: 15.42,
        premium_savings_annual_usd: 14250,
        roi_on_resiliency_automation: "12.4x First-Year Net ROI"
      }
    },
    executive_underwriter_recommendation: "Firm displays robust operational telemetry and automated compliance controls. The Mitigata Continuous Resiliency Engine qualifies the client for a 15% upfront policy credit and expedited binder approval under Syndicate 1892 treaty."
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(scorecardPayload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-4xl w-full p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Mitigata Enterprise Resiliency Engine</h2>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  4-PILLAR UNIFIED SCORECARD
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Holistic cyber-financial posture quantification for <strong>{companyName}</strong> across Operations, Attack Surface, Compliance, and Insurance.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('scorecard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'scorecard'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              4-Pillar Scorecard
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'json'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Unified JSON Scorecard</span>
            </button>
            <button
              onClick={() => setActiveTab('statement')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'statement'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tech Evangelist Statement</span>
            </button>
          </div>

          {activeTab === 'json' && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all"
            >
              {copiedJson ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
            </button>
          )}
        </div>

        {/* TAB 1: 4-PILLAR SCORECARD */}
        {activeTab === 'scorecard' && (
          <div className="space-y-5">
            {/* Top Key Metrics Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/30">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Overall Resiliency Index
                </span>
                <div className="text-3xl font-black text-emerald-400 mt-1 flex items-baseline gap-2">
                  <span>78</span>
                  <span className="text-xs text-slate-400 font-normal">/ 100</span>
                  <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                    Tier 2 Self-Healing
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  B+ Strong • Preferred Underwriting Terms Approved
                </span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Annual Loss Expectancy (ALE)
                </span>
                <div className="text-2xl font-bold text-white mt-1">
                  $3.20M <span className="text-xs text-cyan-400 font-mono">(₹26.67 Cr)</span>
                </div>
                <span className="text-[11px] text-emerald-400 mt-1 block font-mono">
                  Mitigata Potential Savings: ₹15.42 Cr (-58%)
                </span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-purple-500/30">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Tail Risk Exposure (99.5% PML)
                </span>
                <div className="text-2xl font-bold text-purple-300 mt-1">
                  $12.80M <span className="text-xs text-purple-400 font-mono">(₹106.67 Cr)</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block font-mono">
                  Fully protected via Syndicate 1892 primary + excess
                </span>
              </div>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pillar 1: Security Operations */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">1. Security Operations</h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    74 / 100
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">EDR Deployment:</span>
                    <strong className="text-white">98.4% Production Parity</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">MTTD / MTTR:</span>
                    <strong className="text-white">14 mins / 42 mins</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Financial Risk Exposure:</span>
                    <strong className="text-rose-400 font-mono">$680,000 (₹5.67 Cr)</strong>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg text-[11px] text-slate-300 border border-slate-800">
                  <span className="text-emerald-400 font-semibold block">Strength:</span>
                  Automated Git secret quarantine and 24/7 SIEM clustering active.
                </div>
              </div>

              {/* Pillar 2: Risk Management & Attack Surface */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Network className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">2. Risk Management</h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    71 / 100
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">External Attack Surface:</span>
                    <strong className="text-white">14 Monitored Cloud Assets</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cascade Risk Multiplier:</span>
                    <strong className="text-amber-400 font-mono">2.4x Tail Expansion</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Financial Risk Exposure:</span>
                    <strong className="text-rose-400 font-mono">$1,250,000 (₹10.42 Cr)</strong>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg text-[11px] text-slate-300 border border-slate-800">
                  <span className="text-amber-400 font-semibold block">Remediation Gap:</span>
                  Staging MongoDB port 27017 exposed; 4th-party API partner SLA dependency unverified.
                </div>
              </div>

              {/* Pillar 3: Compliance Automation */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">3. Compliance Automation</h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    83 / 100
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">DPDP 2025 Readiness:</span>
                    <strong className="text-white">86% Safe Harbor Active</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ISO 27001 / SEBI CSCRF:</span>
                    <strong className="text-white">91.2% / 79.5% Adherence</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Financial Risk Exposure:</span>
                    <strong className="text-emerald-400 font-mono">$850,000 (₹7.08 Cr)</strong>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg text-[11px] text-slate-300 border border-slate-800">
                  <span className="text-emerald-400 font-semibold block">Strength:</span>
                  Automated customer consent withdrawal and TTL cryptographic deletion playbooks deployed.
                </div>
              </div>

              {/* Pillar 4: Cyber Insurance & Risk Transfer */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-bold text-white">4. Cyber Insurance</h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    85 / 100
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Policy & Syndicate:</span>
                    <strong className="text-white">Syndicate 1892 ($10M Limit)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mitigata Discount Applied:</span>
                    <strong className="text-emerald-400 font-mono">15% Compliance Credit (-$14.2k)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Residual Financial Risk:</span>
                    <strong className="text-purple-300 font-mono">$420,000 (₹3.50 Cr)</strong>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg text-[11px] text-slate-300 border border-slate-800">
                  <span className="text-purple-400 font-semibold block">Incentive Loop:</span>
                  Continuous runtime telemetry qualifies client for monthly dynamic premium adjustments.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: UNIFIED JSON SCORECARD */}
        {activeTab === 'json' && (
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="text-xs text-slate-400 font-mono flex items-center justify-between bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <span>Schema: Mitigata Enterprise Resiliency Engine v4.2 • application/json</span>
              <span className="text-emerald-400">Status: Validated</span>
            </div>
            <div className="flex-1 overflow-auto bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 select-all leading-relaxed max-h-[460px]">
              <pre>{JSON.stringify(scorecardPayload, null, 2)}</pre>
            </div>
          </div>
        )}

        {/* TAB 3: TECH EVANGELIST CONCLUDING STATEMENT */}
        {activeTab === 'statement' && (
          <div className="p-6 bg-slate-950 rounded-xl border border-purple-500/40 space-y-4 text-slate-200">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>RiskPulse AI × Mitigata — Hackathon Concluding Statement</span>
            </div>

            <blockquote className="border-l-4 border-cyan-500 pl-4 py-2 italic text-base text-white font-medium bg-slate-900/60 rounded-r-lg">
              "For three decades, the boardroom treated cybersecurity as a siloed IT headache — an endless spreadsheet of CVEs, a scramble for compliance tickboxes, and an annual insurance renewal that treated every enterprise like a coin toss. 
              <br /><br />
              <strong>RiskPulse AI shatters that reality. Today, cyber risk has a direct rupee and dollar balance-sheet number.</strong>"
            </blockquote>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <p>
                By connecting real-time telemetry, automated dark web crawling, statutory DPDP 2025 and SEBI CSCRF legal mappings, and actuarial pricing models, <strong>RiskPulse AI transforms 12+ fragmented security tools into a single, automated, underwriting-ready operating layer</strong>.
              </p>
              <p>
                When a vulnerability is detected, we don't just alert the engineer; our autonomous agents propose the patch, quantify the immediate drops in Annual Loss Expectancy (ALE) and Tail Risk, and instantly reward the enterprise with continuous insurance discounts and expanded coverage limits.
              </p>
              <p className="font-semibold text-emerald-300">
                This is the realization of Mitigata's vision: turning cyber insurance from a static, reluctant expense into a living, proactive incentive engine for enterprise resilience.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>RiskPulse Syndicate 1892 • Mitigata Enterprise Partner Stack</span>
              <span className="text-cyan-400 font-mono">Built for Hackathon Demo Excellence</span>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            Pillars Evaluated: <strong className="text-white">SecOps • Risk Mgmt • Compliance • Insurance</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
          >
            Close Scorecard
          </button>
        </div>
      </div>
    </div>
  );
};
