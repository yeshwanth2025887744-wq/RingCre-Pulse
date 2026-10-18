import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  AlertTriangle, 
  ShieldAlert, 
  ExternalLink, 
  Search, 
  Terminal, 
  Lock, 
  Key, 
  Database, 
  Users, 
  DollarSign, 
  FileCheck2, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  AlertOctagon, 
  Building2, 
  Flame, 
  Eye, 
  Copy, 
  Check, 
  X, 
  Sliders, 
  Activity, 
  FileText, 
  ChevronRight,
  Shield,
  Layers,
  Clock,
  Send
} from 'lucide-react';
import { Submission } from '../types/underwriting';

interface ThreatIntelDarkWebViewProps {
  submissions: Submission[];
  selectedSubmission: Submission | null;
  onSelectSubmission?: (sub: Submission) => void;
  onOpenCopilotWithContext?: (sub: Submission | null, prompt?: string) => void;
}

export interface DarkWebThreatItem {
  id: string;
  timestamp: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  category: 'CREDENTIAL_LEAK' | 'API_SECRET' | 'DATABASE_EXPOSURE' | 'RANSOMWARE_RECON' | 'EMPLOYEE_STEALER';
  title: string;
  source: string;
  sourceType: 'Dark Web Pastebin' | 'GitHub Public Repo' | 'Telegram Syndicate' | 'Shodan / Censys' | 'Ransomware Leak Site';
  affectedAsset: string;
  description: string;
  riskPenaltyPoints: number;
  financialExposureImpactUsd: number;
  policyBreachClause: string;
  status: 'ACTIVE' | 'INVESTIGATING' | 'MITIGATED';
}

const initialDarkWebAlerts: DarkWebThreatItem[] = [
  {
    id: 'THREAT-DW-901',
    timestamp: '3 minutes ago',
    severity: 'CRITICAL',
    category: 'CREDENTIAL_LEAK',
    title: 'Corporate domain credentials found in dark web pastebin',
    source: 'Russian Market & BreachForums Dump #419',
    sourceType: 'Dark Web Pastebin',
    affectedAsset: 'admin@apexglobalfin.com (Master IAM Identity)',
    description: 'Cleartext corporate credentials and hashed passwords found in an active pastebin dump from RedLine Stealer infostealer campaign targeting corporate browser sessions.',
    riskPenaltyPoints: 14,
    financialExposureImpactUsd: 1250000,
    policyBreachClause: 'Protective Safeguards Warranty Clause 4B: Compromised privileged administrator credentials exposed on public networks.',
    status: 'ACTIVE'
  },
  {
    id: 'THREAT-DW-902',
    timestamp: '7 minutes ago',
    severity: 'CRITICAL',
    category: 'API_SECRET',
    title: 'Leaked database master API key detected on GitHub public repository',
    source: 'GitGuardian & GitHub Public Code Intelligence Feed',
    sourceType: 'GitHub Public Repo',
    affectedAsset: 'AWS IAM Key: AKIAIOSFODNN7... (Prod MongoDB & RDS Access)',
    description: 'Production cloud storage credentials and JWT signing secrets pushed in commit "fix: master-backup-pipeline.sh". Automated bot scrapers observed querying endpoint.',
    riskPenaltyPoints: 15,
    financialExposureImpactUsd: 1800000,
    policyBreachClause: 'Condition 8: Failure to revoke exposed API secrets and cryptographic keys within mandated 2-hour window.',
    status: 'ACTIVE'
  },
  {
    id: 'THREAT-DW-903',
    timestamp: '19 minutes ago',
    severity: 'HIGH',
    category: 'DATABASE_EXPOSURE',
    title: 'Exposed MongoDB cluster endpoint with unencrypted PII records on Shodan',
    source: 'Shodan.io & Censys Continuous Attack Surface Monitor',
    sourceType: 'Shodan / Censys',
    affectedAsset: 'db-analytics-replica-01.internal (Port 27017, Public IP: 194.26.29.114)',
    description: 'Database replica configured with default administrative access without mutual TLS authentication. 42,000 Aadhaar and PAN financial transaction records indexed.',
    riskPenaltyPoints: 11,
    financialExposureImpactUsd: 950000,
    policyBreachClause: 'SEBI CSCRF Domain 6.1 & DPDP Section 8(5) Mandatory Reasonable Technical Safeguards Warranty.',
    status: 'ACTIVE'
  },
  {
    id: 'THREAT-DW-904',
    timestamp: '42 minutes ago',
    severity: 'HIGH',
    category: 'EMPLOYEE_STEALER',
    title: 'Compromised C-Suite executive login session found in Lumma Stealer log',
    source: 'Telegram Cyber Syndicate Channel: Genesis Market Reborn',
    sourceType: 'Telegram Syndicate',
    affectedAsset: 'cfo@apexglobalfin.com (Treasury & Wire Transfer Scope)',
    description: 'Valid Okta SSO session tokens and Active Directory cookie hashes retrieved from compromised executive personal Mac. High risk of wire transfer diversion.',
    riskPenaltyPoints: 10,
    financialExposureImpactUsd: 1400000,
    policyBreachClause: 'Protective Safeguards Warranty Clause 9: Dual Multi-Factor Authorization for Corporate Fund Transfers.',
    status: 'ACTIVE'
  },
  {
    id: 'THREAT-DW-905',
    timestamp: '1 hour ago',
    severity: 'MEDIUM',
    category: 'RANSOMWARE_RECON',
    title: 'Ransomware threat actor reconnaissance pinging perimeter VPN gateway',
    source: 'Dark Web Tor Negotiation Forum Intelligence (LockBit 4.0 affiliate)',
    sourceType: 'Ransomware Leak Site',
    affectedAsset: 'vpn-gateway-apac.apexglobalfin.com (Pulse Secure / SSL-VPN)',
    description: 'Target corporate domain mentioned on private cybercrime channel as candidate for double-extortion ransomware campaign due to unpatched VPN vulnerability.',
    riskPenaltyPoints: 6,
    financialExposureImpactUsd: 750000,
    policyBreachClause: 'Condition 14: Prompt Critical CVE Patching within 14-day Carrier SLA.',
    status: 'INVESTIGATING'
  }
];

export const ThreatIntelDarkWebView: React.FC<ThreatIntelDarkWebViewProps> = ({
  submissions,
  selectedSubmission,
  onSelectSubmission,
  onOpenCopilotWithContext
}) => {
  // Selected Profile
  const defaultSub = selectedSubmission || submissions[0];
  const [selectedSubId, setSelectedSubId] = useState<string>(defaultSub?.id || 'sub-001');
  
  const currentSub = submissions.find(s => s.id === selectedSubId) || defaultSub;
  const companyName = currentSub?.companyName || 'Apex Global Financial Technologies';
  const domain = companyName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';

  // Threat Feed State
  const [threats, setThreats] = useState<DarkWebThreatItem[]>(initialDarkWebAlerts);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [activeThreatCount, setActiveThreatCount] = useState<number>(initialDarkWebAlerts.length);
  const [isInjecting, setIsInjecting] = useState<boolean>(false);
  const [injectedBanner, setInjectedBanner] = useState<string | null>(
    '🚨 LIVE DARK WEB ALERT: Real-time crawler detected fresh pastebin dump with corporate domain credentials & AWS API secret.'
  );

  // Risk Penalty Calculator State
  const baselineRiskScore = currentSub?.analysis.pulseScore || 64;
  const baselineAleUsd = Math.round((currentSub?.tiv || 40000000) * 0.036); // e.g. $1,440,000
  const baselineTailRiskUsd = Math.round((currentSub?.tiv || 40000000) * 0.187); // e.g. $7,480,000

  // Penalty Calculation based on active threats
  const calculatedPenalty = threats
    .filter(t => t.status === 'ACTIVE')
    .reduce((acc, curr) => acc + curr.riskPenaltyPoints, 0);

  const escalatedRiskScore = Math.min(99, baselineRiskScore + calculatedPenalty);
  
  const calculatedExposureSurge = threats
    .filter(t => t.status === 'ACTIVE')
    .reduce((acc, curr) => acc + curr.financialExposureImpactUsd, 0);

  const escalatedAleUsd = baselineAleUsd + calculatedExposureSurge;
  const escalatedTailRiskUsd = baselineTailRiskUsd + Math.round(calculatedExposureSurge * 2.8);

  // Policy Audit State
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [hasAudited, setHasAudited] = useState<boolean>(true);

  // OSINT Dark Web Engine State
  const [isGeneratingOsint, setIsGeneratingOsint] = useState<boolean>(false);
  const [osintReport, setOsintReport] = useState<any>(null);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [activeOsintTab, setActiveOsintTab] = useState<'credentials' | 'endpoints' | 'accounts' | 'financial' | 'override'>('credentials');

  // Load OSINT report on initial mount
  useEffect(() => {
    fetchOsintReport();
  }, [selectedSubId]);

  const fetchOsintReport = async () => {
    setIsGeneratingOsint(true);
    try {
      const res = await fetch('/api/threat-intel/dark-web-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          domain,
          industry: currentSub?.industry || 'FinTech & Cloud Banking',
          annualRevenue: currentSub?.revenue || 65000000,
          tiv: currentSub?.tiv || 40000000,
          threatScenario: 'Compromised C-Suite Credential Dump & Exposed Staging DB Replica'
        })
      });
      const data = await res.json();
      if (data && data.report) {
        setOsintReport(data.report);
      }
    } catch (err) {
      console.error('Failed to load OSINT report:', err);
    } finally {
      setIsGeneratingOsint(false);
    }
  };

  // Handler: Inject Live Simulated Threat
  const handleInjectThreat = async () => {
    setIsInjecting(true);
    try {
      const newThreat: DarkWebThreatItem = {
        id: `THREAT-LIVE-${Date.now().toString().slice(-4)}`,
        timestamp: 'Just now (Live Injection)',
        severity: 'CRITICAL',
        category: 'API_SECRET',
        title: 'Master CloudFormation Secrets Key leaked on public paste site',
        source: 'BreachForums Telegram Bot Intelligence Mirror',
        sourceType: 'Dark Web Pastebin',
        affectedAsset: `prod-deployer@${domain} (Secret: AWS_SECRET_ACCESS_KEY)`,
        description: 'Hardcoded production deployment tokens disclosed in an unredacted pastebin snippet. Automated threat botnets initiating continuous unauthorized API requests.',
        riskPenaltyPoints: 12,
        financialExposureImpactUsd: 1450000,
        policyBreachClause: 'Warranty 4B: Mandatory Hardware Secrets Vaulting & Zero Plaintext Credential Disclosures.',
        status: 'ACTIVE'
      };

      setThreats(prev => [newThreat, ...prev]);
      setInjectedBanner(
        `🚨 CRITICAL LIVE INJECTION: ${newThreat.title} detected for ${companyName}! Immediate Risk Score penalty applied (+12 pts). Underwriter review required!`
      );
    } finally {
      setIsInjecting(false);
    }
  };

  // Handler: Execute Policy Audit
  const handleExecutePolicyAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch('/api/threat-intel/execute-policy-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          policyNumber: `RP-CYBER-${companyName.slice(0, 3).toUpperCase()}-2026`,
          riskScore: escalatedRiskScore,
          threatCount: threats.filter(t => t.status === 'ACTIVE').length
        })
      });
      const data = await res.json();
      if (data && data.auditResult) {
        setAuditResult(data.auditResult);
        setHasAudited(true);
        setIsAuditModalOpen(true);
      }
    } catch (err) {
      console.error('Policy audit execution error:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const filteredThreats = threats.filter(t => {
    if (selectedCategoryFilter === 'ALL') return true;
    return t.category === selectedCategoryFilter;
  });

  const structuredJsonOutput = osintReport || {
    target_company_profile: {
      entity_name: companyName,
      primary_domain: domain,
      industry: currentSub?.industry || 'FinTech & Cloud Banking',
      threat_monitoring_level: "RED - ACTIVE EXFILTRATION DETECTED",
      timestamp: "Live Threat Stream"
    },
    leaked_credentials: threats.map(t => ({
      id: t.id,
      source: t.source,
      identity: t.affectedAsset,
      risk_rating: t.severity,
      description: t.description,
      penalty_points: t.riskPenaltyPoints
    })),
    financial_exposure_escalation: {
      baseline_cyber_risk_score: baselineRiskScore,
      escalated_cyber_risk_score: escalatedRiskScore,
      risk_score_penalty_delta: calculatedPenalty,
      baseline_annual_loss_expectancy_usd: baselineAleUsd,
      escalated_annual_loss_expectancy_usd: escalatedAleUsd,
      baseline_tail_risk_pml_usd: baselineTailRiskUsd,
      escalated_tail_risk_pml_usd: escalatedTailRiskUsd
    },
    automated_insurance_policy_override: {
      override_status: "MANDATORY_EMERGENCY_POLICY_OVERRIDE",
      carrier_directive: "Immediate temporary suspension of cyber coverage limits pending mandatory 24-hour credential rotation.",
      grace_period_hours: 24
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner / Pulse Status */}
      {injectedBanner && (
        <div className="bg-gradient-to-r from-rose-950/80 via-red-900/60 to-slate-900 border border-rose-500/40 rounded-2xl p-4 text-xs sm:text-sm text-rose-100 flex items-start sm:items-center justify-between gap-3 shadow-xl shadow-rose-950/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 text-rose-400 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-white uppercase tracking-wider text-[11px] bg-rose-500/30 px-2 py-0.5 rounded border border-rose-500/40 mr-2">
                Live Threat Stream
              </span>
              <span>{injectedBanner}</span>
            </div>
          </div>
          <button
            onClick={() => setInjectedBanner(null)}
            className="text-slate-400 hover:text-white shrink-0 p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Header & Target Account Control */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                Threat Intelligence & Dark Web Monitor
                <span className="text-[11px] font-mono px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full font-bold animate-pulse">
                  LIVE OSINT RADAR
                </span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
              Real-time deep web crawler and threat intelligence feed scanning dark web pastebins, public code repositories, ransomware leak sites, and illicit credential markets. Translates cyber threat signals into immediate financial loss escalation and automated underwriting policy actions.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02]"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Structured JSON</span>
            </button>

            <button
              onClick={handleInjectThreat}
              disabled={isInjecting}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Flame className="w-3.5 h-3.5 text-white" />
              <span>{isInjecting ? 'Simulating Threat...' : 'Inject Sudden Threat'}</span>
            </button>

            <button
              onClick={handleExecutePolicyAudit}
              disabled={isAuditing}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-950/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-white" />
              <span>{isAuditing ? 'Auditing Policy...' : 'Execute Policy Audit'}</span>
            </button>
          </div>
        </div>

        {/* Monitored Account Selector */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">Active Insured Entity:</span>
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
            <span>Domain: <strong className="text-white">{domain}</strong></span>
            <span>•</span>
            <span>Monitored Assets: <strong className="text-cyan-300">14 Cloud Endpoints</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Active Dark Web Scraper Online
            </span>
          </div>
        </div>
      </div>

      {/* METRIC CARDS: Threat Level, Risk Score Escalation, ALE Surge, Tail Risk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Threat Level */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-rose-500/30 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-rose-300">Dark Web Exposure Level</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 tracking-tight">
            CRITICAL EXFILTRATION
          </div>
          <div className="mt-2 text-xs text-rose-200/80 flex items-center justify-between">
            <span>Active Indicators:</span>
            <span className="font-mono font-bold text-white">{threats.filter(t => t.status === 'ACTIVE').length} High/Crit Alerts</span>
          </div>
          <div className="mt-3 w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full w-[92%]" />
          </div>
        </div>

        {/* Dynamic Risk Score Escalation */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-amber-300">Cyber Risk Score</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{escalatedRiskScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
            <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
              +{calculatedPenalty} penalty
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Baseline Score:</span>
            <span className="font-mono text-slate-300">{baselineRiskScore}/100</span>
          </div>
          <div className="mt-3 w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div className={`h-full rounded-full ${escalatedRiskScore > 80 ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${escalatedRiskScore}%` }} />
          </div>
        </div>

        {/* Escalated ALE */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-cyan-300">Escalated ALE (Annual Loss)</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 tracking-tight">
            ${(escalatedAleUsd / 1000000).toFixed(2)}M / yr
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Surge from Threats:</span>
            <span className="font-mono text-rose-400 font-bold">+${(calculatedExposureSurge / 1000000).toFixed(2)}M</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 font-mono">
            Baseline: ${(baselineAleUsd / 1000000).toFixed(2)}M • Surge +{Math.round((calculatedExposureSurge / baselineAleUsd) * 100)}%
          </div>
        </div>

        {/* Tail Risk (Maximum Potential Loss) */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-purple-500/30 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-purple-300">Tail Risk (PML 99.5% VaR)</span>
            <AlertOctagon className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300 tracking-tight">
            ${(escalatedTailRiskUsd / 1000000).toFixed(1)}M Blanket
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Policy Limit Status:</span>
            <span className="font-mono text-rose-300 font-bold bg-rose-500/10 px-1 rounded">EXCEEDED</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 font-mono">
            Baseline PML: ${(baselineTailRiskUsd / 1000000).toFixed(1)}M • Reinsurance Attachment Triggered
          </div>
        </div>
      </div>

      {/* TWO COLUMN WORKBENCH: Left = Live Stream & Penalty Calculator, Right = Policy Audit & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: LIVE THREAT STREAM FEED & PENALTY CALCULATOR (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Live Threat Stream Feed */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
                  Live Threat Stream Feed
                </h3>
                <p className="text-xs text-slate-400">
                  Continuous OSINT ingestion from dark web pastebins, GitHub code leaks, Shodan, and Telegram channels.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['ALL', 'CREDENTIAL_LEAK', 'API_SECRET', 'DATABASE_EXPOSURE'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wide whitespace-nowrap transition-all ${
                      selectedCategoryFilter === cat
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat === 'ALL' ? 'All Alerts' : cat.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Threat List */}
            <div className="space-y-3">
              {filteredThreats.map((threat) => (
                <div
                  key={threat.id}
                  className={`p-4 rounded-xl border transition-all ${
                    threat.severity === 'CRITICAL'
                      ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50'
                      : threat.severity === 'HIGH'
                      ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded font-mono ${
                          threat.severity === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : threat.severity === 'HIGH'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        }`}>
                          {threat.severity}
                        </span>
                        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                          {threat.sourceType}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {threat.timestamp}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white pt-1">
                        {threat.title}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold text-rose-400">
                        +{threat.riskPenaltyPoints} pts penalty
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        +${(threat.financialExposureImpactUsd / 1000).toLocaleString()}k exposure
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {threat.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-2 text-slate-400 font-mono">
                      <span className="text-slate-500">Target:</span>
                      <span className="text-slate-200 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {threat.affectedAsset}
                      </span>
                    </div>

                    <div className="text-rose-400/90 font-medium">
                      Violation: {threat.policyBreachClause.split(':')[0]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Automated Risk Penalty & Tail Risk Calculator */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Automated Risk Penalty & Exposure Escalation Engine
                </h3>
                <p className="text-xs text-slate-400">
                  Actuarial multiplier model instantly recalculates Risk Score, ALE, and Tail Risk (99.5% VaR) upon threat detection.
                </p>
              </div>
            </div>

            {/* Interactive Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold block uppercase">Risk Score Penalty</span>
                <div className="text-xl font-bold text-white flex items-center gap-2">
                  <span>{baselineRiskScore}</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-rose-400 font-black">{escalatedRiskScore}</span>
                  <span className="text-[11px] font-mono text-rose-400 font-bold">(+{calculatedPenalty})</span>
                </div>
                <span className="text-[10px] text-slate-500 block">Treaty Threshold: 80 (Exceeded)</span>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold block uppercase">Annual Loss Expectancy</span>
                <div className="text-xl font-bold text-white flex items-center gap-1.5">
                  <span className="text-slate-300">${(baselineAleUsd / 1000000).toFixed(1)}M</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-cyan-400 font-black">${(escalatedAleUsd / 1000000).toFixed(2)}M</span>
                </div>
                <span className="text-[10px] text-emerald-400 block font-mono">Surge +{Math.round((calculatedExposureSurge / baselineAleUsd) * 100)}%</span>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold block uppercase">Tail Risk Maximum Loss</span>
                <div className="text-xl font-bold text-white flex items-center gap-1.5">
                  <span className="text-slate-300">${(baselineTailRiskUsd / 1000000).toFixed(1)}M</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-purple-400 font-black">${(escalatedTailRiskUsd / 1000000).toFixed(1)}M</span>
                </div>
                <span className="text-[10px] text-rose-400 block font-mono">Excess Syndicate Layer Invoked</span>
              </div>
            </div>

            {/* Financial Loss Allocation Table */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 block">
                Immediate Financial Exposure Breakdown (Projected Loss Component)
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    Immediate Digital Forensics & Incident Response:
                  </span>
                  <span className="font-mono font-bold text-white">$480,000</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Ransom Extortion Contingency Reserve:
                  </span>
                  <span className="font-mono font-bold text-white">$1,250,000</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    Regulatory DPDP 2025 & SEBI Statutory Fine Exposure:
                  </span>
                  <span className="font-mono font-bold text-white">$1,650,000</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    Customer Notification & Credit Monitoring (42k PII):
                  </span>
                  <span className="font-mono font-bold text-white">$640,000</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Contingent Business Interruption Daily Burn:
                  </span>
                  <span className="font-mono font-bold text-white">$800,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: POLICY AUDIT EXECUTION & UNDERWRITER DIRECTIVES (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section 3: Execute Policy Audit Box */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-rose-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Automated Policy Audit & Violation Flags</h3>
                  <span className="text-[11px] text-slate-400 font-mono">Syndicate 1892 Treaty Compliance</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono animate-pulse">
                ACTION REQUIRED
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              When critical dark web exfiltration or leaked credentials are authenticated, the policy audit engine cross-checks the carrier binder, flags active warranty violations, and alerts the lead underwriter.
            </p>

            <button
              onClick={handleExecutePolicyAudit}
              disabled={isAuditing}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-950/60 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>{isAuditing ? 'Executing Automated Audit...' : 'Execute Policy Audit Now'}</span>
            </button>

            {/* Flagged Violations List */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Active Insurance Policy Violations Flagged:
              </span>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-rose-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-rose-400">Protective Safeguards Warranty 4B</span>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono font-bold">
                    BREACHED
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Live administrator and cloud credentials exposed publicly. Mandated HSM cryptographic protection failed.
                </p>
                <div className="text-[10px] font-mono text-rose-300/80">
                  Carrier Action: Temporary suspension of unauthorized access coverage sublimit ($2.5M).
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-amber-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-400">Condition 7: Perimeter Ingress Exposure</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
                    BREACHED
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Port 27017 exposed to global internet without access control, containing 42,000 cleartext PII records.
                </p>
                <div className="text-[10px] font-mono text-amber-300/80">
                  Carrier Action: Emergency deductible surcharge ($25,000 → $75,000).
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-purple-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-400">SEBI CSCRF 6-Hour Disclosure Window</span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono font-bold">
                    COUNTDOWN ACTIVE
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Domain 9.3 mandates incident notification to SEBI and CERT-In within 6 hours of threat detection.
                </p>
                <div className="text-[10px] font-mono text-purple-300/80">
                  Carrier Action: Automated legal counsel dispatch and breach response retainer mobilized.
                </div>
              </div>
            </div>

            {/* Underwriter Notice Banner */}
            <div className="p-3.5 bg-rose-950/40 rounded-xl border border-rose-500/40 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <Send className="w-3.5 h-3.5 text-rose-400" />
                <span>Underwriter Referral Notice Dispatched</span>
              </div>
              <p className="text-[11px] text-rose-200/90 leading-relaxed">
                Notice automatically transmitted to Syndicate 1892 Lead Underwriter Eleanor Vance:
                <em> "Immediate coverage limit reduction applied. Broker notified of mandatory 24-hour credential rotation window."</em>
              </p>
            </div>
          </div>

          {/* Section 4: OSINT Dark Web Intelligence Report Card */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Elite OSINT Agent Deep Report
                </h3>
                <p className="text-[11px] text-slate-400">
                  Autonomous threat analysis generated by Gemini 3.8 Flash OSINT Engine.
                </p>
              </div>
              <button
                onClick={fetchOsintReport}
                disabled={isGeneratingOsint}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                title="Refresh OSINT scan"
              >
                <RefreshCw className={`w-4 h-4 ${isGeneratingOsint ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
            </div>

            {/* Sub-nav tabs for OSINT report */}
            <div className="flex border-b border-slate-800 text-[11px] font-medium overflow-x-auto pb-1 gap-1">
              <button
                onClick={() => setActiveOsintTab('credentials')}
                className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  activeOsintTab === 'credentials'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                1. Credentials ({osintReport?.leaked_credentials?.length || 3})
              </button>
              <button
                onClick={() => setActiveOsintTab('endpoints')}
                className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  activeOsintTab === 'endpoints'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                2. DB Endpoints ({osintReport?.exposed_database_endpoints?.length || 2})
              </button>
              <button
                onClick={() => setActiveOsintTab('accounts')}
                className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  activeOsintTab === 'accounts'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                3. Compromised Staff
              </button>
              <button
                onClick={() => setActiveOsintTab('override')}
                className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  activeOsintTab === 'override'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                4. Policy Override
              </button>
            </div>

            {/* OSINT Tab Content */}
            <div className="min-h-[180px] text-xs">
              {activeOsintTab === 'credentials' && (
                <div className="space-y-2">
                  {(osintReport?.leaked_credentials || [
                    {
                      id: 'LEAK-8841',
                      identity: `admin@${domain}`,
                      source: 'BreachForums Dark Web Pastebin',
                      stealer_variant: 'RedLine v24.2',
                      risk_rating: 'CRITICAL',
                      exposure_context: 'Corporate admin session tokens & AWS credentials exfiltrated.'
                    },
                    {
                      id: 'LEAK-8842',
                      identity: 'AKIAIOSFODNN7EXAMPLE (AWS Root Key)',
                      source: 'Public GitHub Commit',
                      stealer_variant: 'Automated Code Scraper',
                      risk_rating: 'CRITICAL',
                      exposure_context: 'Live cloud production credentials hardcoded in public repository.'
                    }
                  ]).map((item: any, idx: number) => (
                    <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-rose-400 font-bold">{item.identity}</span>
                        <span className="text-[10px] font-mono bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-bold">
                          {item.risk_rating}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">{item.source} • {item.stealer_variant}</div>
                      <p className="text-[11px] text-slate-300">{item.exposure_context}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeOsintTab === 'endpoints' && (
                <div className="space-y-2">
                  {(osintReport?.exposed_database_endpoints || [
                    {
                      endpoint_url: `db-analytics-replica-01.${domain} (Port 27017)`,
                      service_type: 'MongoDB 6.0 Replica Cluster',
                      data_exposed: '42,000 PII records, unencrypted Aadhaar & PAN hashes',
                      risk_rating: 'CRITICAL'
                    },
                    {
                      endpoint_url: `api-internal-gateway.${domain}:8443`,
                      service_type: 'Public Swagger API Documentation',
                      data_exposed: 'Internal endpoints & JWT test signing key disclosed',
                      risk_rating: 'HIGH'
                    }
                  ]).map((ep: any, idx: number) => (
                    <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-cyan-300 font-bold">{ep.endpoint_url}</span>
                        <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                          {ep.risk_rating}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{ep.service_type}</div>
                      <p className="text-[11px] text-slate-300">{ep.data_exposed}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeOsintTab === 'accounts' && (
                <div className="space-y-2">
                  {(osintReport?.compromised_employee_accounts || [
                    {
                      employee_name: 'Vikram Malhotra',
                      job_title: 'Lead DevOps Architect & Cloud Admin',
                      privilege_level: 'Tier-0 Domain & Cloud Root Admin',
                      mfa_bypass_risk: 'Session Cookie Hijack (Pass-the-Cookie)',
                      status: 'IMMEDIATE_SESSION_TERMINATION_REQUIRED'
                    },
                    {
                      employee_name: 'Priya Nair',
                      job_title: 'Treasury & Payments Controller',
                      privilege_level: 'Tier-1 Swift/Wire Approval Authority',
                      mfa_bypass_risk: 'Compromised Password + SMS OTP Interception',
                      status: 'IMMEDIATE_PASSWORD_RESET_REQUIRED'
                    }
                  ]).map((acc: any, idx: number) => (
                    <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{acc.employee_name}</span>
                        <span className="text-[10px] font-mono text-amber-400">{acc.job_title}</span>
                      </div>
                      <div className="text-[11px] text-cyan-400 font-mono">{acc.privilege_level}</div>
                      <div className="text-[11px] text-rose-300">Bypass Risk: {acc.mfa_bypass_risk}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeOsintTab === 'override' && (
                <div className="space-y-2.5 p-3 bg-slate-950 rounded-xl border border-rose-500/30">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-400">Carrier Directive:</span>
                    <span className="text-[10px] font-mono bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-bold">
                      24-HR GRACE PERIOD
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {osintReport?.automated_insurance_policy_override?.carrier_directive || 
                    "Immediate temporary suspension of cyber coverage limits pending mandatory 24-hour credential rotation and forensic remediation."}
                  </p>
                  <div className="pt-2 border-t border-slate-800 space-y-1 font-mono text-[11px] text-slate-400">
                    <div>• Primary Limit: <strong className="text-white">$1,000,000 Emergency Sublimit</strong></div>
                    <div>• Ransomware Coverage: <strong className="text-rose-400">Suspended (0% Reimbursement)</strong></div>
                    <div>• Emergency Retention: <strong className="text-amber-400">3x Multiplier ($75,000)</strong></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* POLICY AUDIT MODAL */}
      {isAuditModalOpen && auditResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center">
                  <FileCheck2 className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Policy Audit Execution Certificate
                  </h3>
                  <div className="text-xs text-rose-400 font-mono">
                    Audit Ref: {auditResult.audit_id} • Status: {auditResult.audit_verdict}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Insured Entity:</span>
                <strong className="text-white">{auditResult.company_name}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Master Policy Number:</span>
                <strong className="text-cyan-300 font-mono">{auditResult.policy_number}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Underwriting Syndicate:</span>
                <strong className="text-slate-200">{auditResult.underwriter_syndicate}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Trigger Event:</span>
                <strong className="text-rose-400 font-mono">{auditResult.audit_trigger}</strong>
              </div>
            </div>

            {/* Violations Flagged */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Breached Policy Warranties & Action Directives
              </h4>
              {auditResult.violations_flagged.map((v: any, i: number) => (
                <div key={i} className="p-3 bg-rose-950/20 rounded-xl border border-rose-500/30 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-rose-300">
                    <span>{v.clause}: {v.title}</span>
                    <span className="text-[10px] bg-rose-500/30 px-2 py-0.5 rounded font-mono text-rose-200">
                      SLA: {v.remedy_deadline}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{v.detail}</p>
                </div>
              ))}
            </div>

            {/* Underwriter Directives */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
              <span className="text-amber-400 font-bold block uppercase font-sans">
                Mandatory Underwriter Directives Applied:
              </span>
              <div className="text-slate-300">• {auditResult.underwriter_directives.coverage_suspension}</div>
              <div className="text-slate-300">• {auditResult.underwriter_directives.ransomware_waiver}</div>
              <div className="text-slate-300">• {auditResult.underwriter_directives.deductible_increase}</div>
              <div className="text-cyan-300 pt-1">
                Assigned Lead Actuary: {auditResult.underwriter_directives.assigned_senior_underwriter}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
              >
                Close Audit Record
              </button>
              <button
                onClick={() => {
                  setIsAuditModalOpen(false);
                  if (onOpenCopilotWithContext) {
                    onOpenCopilotWithContext(currentSub, 'Draft an emergency underwriter review memorandum for policy audit breach.');
                  }
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-950 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open Copilot to Draft Underwriting Memo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STRUCTURED JSON MODAL */}
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
                    Structured OSINT Dark Web JSON Payload
                  </h3>
                  <p className="text-xs text-slate-400">
                    Clean, structured JSON output formatted for front-end ingestion & API interoperability.
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
              <span className="font-mono text-cyan-300">Format: application/json • Model: Gemini 3.8 Flash OSINT Engine</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(structuredJsonOutput, null, 2));
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
              <pre>{JSON.stringify(structuredJsonOutput, null, 2)}</pre>
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
    </div>
  );
};
