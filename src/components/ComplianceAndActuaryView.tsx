import React, { useState } from 'react';
import { 
  Submission, 
  ITVulnerability, 
  ActuarialPricingResult, 
  ThreatIntelligenceEvent 
} from '../types/underwriting';
import { defaultITVulnerabilities, initialThreatStream } from '../data/mockComplianceAndThreats';
import { 
  Scale, 
  Calculator, 
  Radio, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  RefreshCw, 
  Clock, 
  DollarSign, 
  Sliders, 
  FileCheck, 
  Send, 
  Play, 
  RotateCcw, 
  Check, 
  Key, 
  Lock, 
  Flame, 
  Terminal, 
  Building2,
  Presentation,
  Code2,
  Eye,
  X,
  Copy,
  FileSearch,
  Mic,
  AlertOctagon,
  Layers
} from 'lucide-react';

interface ComplianceAndActuaryViewProps {
  submissions: Submission[];
  selectedSubmission: Submission | null;
  onOpenCopilotWithContext: (sub: Submission | null, prompt?: string) => void;
}

export const ComplianceAndActuaryView: React.FC<ComplianceAndActuaryViewProps> = ({
  submissions,
  selectedSubmission,
  onOpenCopilotWithContext,
}) => {
  // Sub-tabs
  const [activeTab, setActiveTab] = useState<'dpdp' | 'actuary' | 'threat-stream' | 'automitigate' | 'cro-audit'>('dpdp');
  const [activeScriptTab, setActiveScriptTab] = useState<'terraform' | 'nginx' | 'iam'>('terraform');
  const [hasRemediatedAuto, setHasRemediatedAuto] = useState<boolean>(false);
  const [isExecutingPatch, setIsExecutingPatch] = useState<boolean>(false);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState<boolean>(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  // CRO Enterprise Ingestion & Audit State
  const [techStackLogs, setTechStackLogs] = useState<string>(
    'Kube-apiserver auth warning: Unauthenticated token probe on port 6443; AWS CloudTrail: root console login without MFA from unknown IP; MongoDB cluster: TLSv1.0 fallback enabled on port 27017; PostgreSQL prod: Unencrypted PII column containing customer Aadhaar, PAN, and bank routing hashes.'
  );
  const [cveList, setCveList] = useState<string>(
    'CVE-2024-3094 (XZ Utils Upstream Backdoor - Critical CVSS 10.0), CVE-2023-4863 (libwebp Heap Buffer Overflow - High CVSS 8.8), CVE-2023-38606 (Kernel Privilege Escalation - High CVSS 7.8)'
  );
  const [soc2Report, setSoc2Report] = useState<string>(
    'SOC 2 Type II Independent Audit Findings:\n1. Exception in CC6.1 - Logical access reviews not performed on quarterly schedule across AWS production.\n2. Exception in CC6.6 - External network penetration test high-severity findings remained unpatched past 90 days.\n3. Exception in CC7.1 - Automated customer data disposal & retention policies absent.'
  );
  const [isAnalyzingCro, setIsAnalyzingCro] = useState<boolean>(false);
  const [isCroJsonOpen, setIsCroJsonOpen] = useState<boolean>(false);
  const [isHackathonPitchOpen, setIsHackathonPitchOpen] = useState<boolean>(false);
  const [copiedCroJson, setCopiedCroJson] = useState<boolean>(false);
  const [croAuditResult, setCroAuditResult] = useState<any>({
    entity_overview: {
      organization_name: 'Apex Global Financial Technologies',
      audit_scope: 'Enterprise Core AWS Infrastructure, CI/CD Pipeline, and SOC 2 Type II Findings',
      composite_cyber_risk_score: 82,
      risk_tier: 'Tier 3 - Substandard / High Risk',
      underwriting_verdict: 'CONDITIONAL_BIND_WITH_SLAS'
    },
    financial_exposure: {
      annual_loss_expectancy_ale_usd: 2450000,
      ale_breakdown: {
        data_breach_direct_costs: 850000,
        business_interruption_daily_burn: 620000,
        statutory_regulatory_fines: 680000,
        incident_response_forensics: 300000
      },
      tail_risk_maximum_potential_loss_usd: 18750000,
      tail_risk_confidence_interval: '99.5% VaR (1-in-200 Year Catastrophe)',
      tail_risk_scenarios: [
        {
          scenario: 'Compromised Master Cloud Credentials + Unencrypted Data Exfiltration',
          loss_projection_usd: 12500000,
          reinsurance_attachment_point: 'Exceeds Primary $5M Limit; Attaches to Excess Layer Syndicate 1892'
        },
        {
          scenario: 'Supply Chain Package Poisoning via Unpatched Build Dependency',
          loss_projection_usd: 6250000,
          reinsurance_attachment_point: 'Attaches to Contingent Business Interruption Sublimit'
        }
      ]
    },
    baseline_cross_reference: [
      {
        vulnerability_id: 'VULN-001',
        cve_or_finding: 'Unencrypted PII in Core Database (Aadhaar/PAN)',
        severity: 'CRITICAL',
        affected_component: 'Production PostgreSQL Clustered Storage',
        iso_27001_mapping: {
          control_clause: 'A.8.24 Use of Cryptography & Key Management',
          compliance_status: 'NON_COMPLIANT',
          gap_analysis: 'Customer sensitive financial data stored in cleartext without column-level envelope encryption.'
        },
        nist_csf_mapping: {
          function: 'PR.DS (Data Security)',
          sub_category: 'PR.DS-1: Data-at-rest is protected using cryptographic algorithms.',
          implementation_tier: 'Tier 1 - Partial (Immediate Remediation Required)'
        },
        dpdp_2025_mapping: {
          section: 'Section 8(5) Mandatory Reasonable Technical Safeguards',
          statutory_exposure_crores_inr: 250,
          regulatory_mandate: 'Immediate deployment of AES-256 GCM encryption at rest with HSM-backed key rotation.'
        }
      },
      {
        vulnerability_id: 'VULN-002',
        cve_or_finding: 'Root Console Login Without Mandatory Hardware MFA',
        severity: 'CRITICAL',
        affected_component: 'AWS IAM Root Account & Production API Gateway',
        iso_27001_mapping: {
          control_clause: 'A.5.17 Authentication Information & Privileged Access Management',
          compliance_status: 'NON_COMPLIANT',
          gap_analysis: 'Root account lacks mandatory FIDO2 hardware MFA, violating zero-standing-privilege standard.'
        },
        nist_csf_mapping: {
          function: 'PR.AC (Identity Management & Access Control)',
          sub_category: 'PR.AC-7: Users, devices, and other assets are authenticated with multi-factor credentials.',
          implementation_tier: 'Tier 1 - Partial'
        },
        dpdp_2025_mapping: {
          section: 'Section 8(4) Access Governance & Incident Prevention',
          statutory_exposure_crores_inr: 150,
          regulatory_mandate: 'Enforce hardware token MFA across all privileged identity scopes within 48 hours.'
        }
      },
      {
        vulnerability_id: 'VULN-003',
        cve_or_finding: 'CVE-2024-3094 (XZ Utils Upstream Supply Chain Vulnerability)',
        severity: 'HIGH',
        affected_component: 'Production Bastion Hosts & CI/CD Runner Base AMIs',
        iso_27001_mapping: {
          control_clause: 'A.8.8 Management of Technical Vulnerabilities',
          compliance_status: 'PARTIAL',
          gap_analysis: 'Vulnerable upstream library versions present in container base images without automatic patch pipeline.'
        },
        nist_csf_mapping: {
          function: 'ID.RA (Risk Assessment)',
          sub_category: 'ID.RA-1: Asset vulnerabilities are identified and documented against threat intel.',
          implementation_tier: 'Tier 2 - Risk Informed'
        },
        dpdp_2025_mapping: {
          section: 'Section 8(6) Duty to Prevent Data Breach via Third-Party Dependencies',
          statutory_exposure_crores_inr: 100,
          regulatory_mandate: 'Purge affected packages and establish automated SCA (Software Composition Analysis) gates.'
        }
      }
    ],
    binding_underwriting_conditions: {
      policy_bind_status: 'CONDITIONAL_APPROVAL',
      thirty_day_remediation_slas: [
        {
          condition_id: 'SLA-30-01',
          title: 'Mandatory Database Column Encryption (AES-256)',
          required_corrective_action: 'Deploy database column encryption on all production PII tables and configure AWS KMS customer-managed keys.',
          mandatory_evidence: 'Independent penetration test verification letter and SOC 2 auditor bridge memo.',
          failure_penalty: 'Automatic 35% premium debit surcharge and revocation of DPDP regulatory safe harbor endorsement.',
          deadline_days: 30
        },
        {
          condition_id: 'SLA-30-02',
          title: 'Universal Hardware MFA on IAM & Cloud Consoles',
          required_corrective_action: 'Lock down AWS root account, enforce FIDO2 WebAuthn keys across all engineering IAM users, and disable password-only fallback.',
          mandatory_evidence: 'AWS IAM Credential Report confirming 100% MFA compliance with zero exceptions.',
          failure_penalty: 'Immediate cancellation of unauthorized access coverage sublimit ($2,500,000 sublimit voided).',
          deadline_days: 30
        }
      ],
      sixty_day_remediation_slas: [
        {
          condition_id: 'SLA-60-01',
          title: 'Automated CI/CD Vulnerability Gate & SBOM Enforcement',
          required_corrective_action: 'Integrate automated Software Composition Analysis (SCA) into build pipeline to block any build with CVSS >= 7.0 CVEs.',
          mandatory_evidence: 'GitLab / GitHub Actions pipeline audit report certified by external DevSecOps consultant.',
          failure_penalty: 'Increase policy deductible from $25,000 to $100,000 on all supply chain claims.',
          deadline_days: 60
        },
        {
          condition_id: 'SLA-60-02',
          title: 'Quarterly Privileged Access Review Automation',
          required_corrective_action: 'Remediate SOC 2 CC6.1 exception by deploying automated Just-In-Time (JIT) access approval workflows.',
          mandatory_evidence: 'Completed Q3 access attestation report signed by Chief Information Security Officer.',
          failure_penalty: 'Application of 15% actuarial surcharge upon policy renewal.',
          deadline_days: 60
        }
      ],
      endorsements_and_warranties: [
        'Protective Safeguards Warranty Clause 9A: Insured warrants continuous cryptographic token protection on customer records.',
        'Continuous Telemetry Endorsement: Insured agrees to maintain real-time RiskPulse agent connectivity; unannounced disconnects exceeding 72 hours void ransomware coverage.'
      ]
    }
  });

  // DPDP & SEBI CSCRF State
  const [vulnerabilities, setVulnerabilities] = useState<ITVulnerability[]>(defaultITVulnerabilities);
  const [isCrossReferencing, setIsCrossReferencing] = useState(false);
  const [customVulnInput, setCustomVulnInput] = useState('');
  const [remediatedIds, setRemediatedIds] = useState<string[]>([]);

  // Actuarial Pricing State
  const [baselinePremiumInr, setBaselinePremiumInr] = useState<number>(95000);
  const [activeCriticalCves, setActiveCriticalCves] = useState<number>(2);
  const [activeHighCves, setActiveHighCves] = useState<number>(3);
  const [activeMediumCves, setActiveMediumCves] = useState<number>(5);
  const [closedTicketsCount, setClosedTicketsCount] = useState<number>(38);
  const [totalTicketsCount, setTotalTicketsCount] = useState<number>(45);
  const [mfaEnforcementPct, setMfaEnforcementPct] = useState<number>(100);
  const [patchTurnaroundDays, setPatchTurnaroundDays] = useState<number>(6);

  // Dynamic Actuary Calculation
  const cveRiskSurchargePct = (activeCriticalCves * 18) + (activeHighCves * 8) + (activeMediumCves * 3);
  const cveMultiplier = 1 + (cveRiskSurchargePct / 100);
  const ticketResolutionRate = totalTicketsCount > 0 ? (closedTicketsCount / totalTicketsCount) : 0.8;
  const closedTicketDiscountPct = Math.round(ticketResolutionRate * 15 * 10) / 10;
  const mfaCreditPct = mfaEnforcementPct >= 100 ? 12 : mfaEnforcementPct >= 80 ? 6 : 0;
  const slaPatchModifierPct = patchTurnaroundDays <= 7 ? -5 : patchTurnaroundDays <= 14 ? 0 : 12;

  const totalCreditPct = closedTicketDiscountPct + mfaCreditPct + (slaPatchModifierPct < 0 ? Math.abs(slaPatchModifierPct) : 0);
  const totalDebitPct = cveRiskSurchargePct + (slaPatchModifierPct > 0 ? slaPatchModifierPct : 0);
  const netDebitCreditPct = Math.round((totalDebitPct - totalCreditPct) * 10) / 10;

  const finalAdjustedPremiumInr = Math.max(
    25000,
    Math.round(baselinePremiumInr * (1 + netDebitCreditPct / 100))
  );

  // Threat Stream State
  const [threatEvents, setThreatEvents] = useState<ThreatIntelligenceEvent[]>(initialThreatStream);
  const [clientRiskScore, setClientRiskScore] = useState<number>(72);
  const [hasActivePolicyBreach, setHasActivePolicyBreach] = useState<boolean>(true);
  const [injectedBanner, setInjectedBanner] = useState<string | null>(
    '🚨 LIVE INJECTION: Production AWS API Key leaked on public GitHub repo 4 minutes ago. Client Cyber Risk Score jumped 72 → 89. Policy breach flagged!'
  );
  const [isInjecting, setIsInjecting] = useState<boolean>(false);

  // Toggle remediation for vulnerability
  const toggleRemediation = (id: string) => {
    if (remediatedIds.includes(id)) {
      setRemediatedIds(remediatedIds.filter((item) => item !== id));
    } else {
      setRemediatedIds([...remediatedIds, id]);
    }
  };

  // Cross reference custom vulnerability with Gemini
  const handleCrossReferenceWithGemini = async () => {
    if (!customVulnInput.trim()) return;
    setIsCrossReferencing(true);
    try {
      const res = await fetch('/api/dpdp-compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vulnerabilities: [{ name: customVulnInput }],
          companyName: selectedSubmission ? selectedSubmission.companyName : 'Financial Services Entity',
        }),
      });
      const data = await res.json();
      if (data && data.data && data.data.crossReferencedFindings?.[0]) {
        const finding = data.data.crossReferencedFindings[0];
        const newVuln: ITVulnerability = {
          id: `VULN-DPDP-${Date.now()}`,
          name: customVulnInput,
          description: 'Custom evaluated IT vulnerability ingested into DPDP 2025 & SEBI CSCRF framework scanner.',
          dpdpClause: finding.dpdpClause || 'Section 8(5) DPDP Act 2025',
          dpdpSection: 'DPDP Act 2025 Schedule Item 1',
          sebiCscrfClause: finding.sebiCscrfDomain || 'SEBI CSCRF Domain 6.1 Cryptographic & Data Protection',
          sebiCscrfDomain: finding.sebiAction || 'SEBI CSCRF Security Baseline',
          severity: finding.severity || 'High',
          statutoryFineInrCrores: finding.statutoryFineInrCrores || 150,
          statutoryFineFormatted: `Up to ₹${finding.statutoryFineInrCrores || 150} Crores`,
          mandatoryCorrectiveControls: finding.mandatoryCorrectiveControls || ['Enforce AES-256 encryption at rest.'],
          remediationSLA: finding.remediationSLA || '48 Hours',
          status: 'OPEN',
        };
        setVulnerabilities([newVuln, ...vulnerabilities]);
        setCustomVulnInput('');
      }
    } catch (err) {
      console.error('DPDP cross-reference error:', err);
    } finally {
      setIsCrossReferencing(false);
    }
  };

  // Threat Injection trigger
  const handleInjectThreat = async (presetTitle: string, source: string, targetAccount: string) => {
    setIsInjecting(true);
    try {
      const res = await fetch('/api/threat-stream/inject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventTitle: presetTitle,
          source,
          targetAccount,
          priorScore: 72,
        }),
      });
      const data = await res.json();
      if (data && data.breachEvent) {
        setThreatEvents([data.breachEvent, ...threatEvents]);
        setClientRiskScore(89); // Direct Jump to 89
        setHasActivePolicyBreach(true);
        setInjectedBanner(
          `🚨 LIVE INJECTION: ${presetTitle}. Cyber Risk Score escalated from 72 → 89/100. Warranty breach flagged under Clause 4B!`
        );
      }
    } catch (err) {
      console.error('Threat injection error:', err);
    } finally {
      setIsInjecting(false);
    }
  };

  const handleRemediateBreach = () => {
    setClientRiskScore(72);
    setHasActivePolicyBreach(false);
    setInjectedBanner(null);
    setThreatEvents((prev) =>
      prev.map((e, idx) => (idx === 0 ? { ...e, status: 'REMEDIATED' } : e))
    );
  };

  // Run Enterprise CRO Audit
  const handleRunCroAudit = async () => {
    setIsAnalyzingCro(true);
    try {
      const res = await fetch('/api/cyber-audit-ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: selectedSubmission ? selectedSubmission.companyName : 'Apex Global Financial Technologies',
          industry: selectedSubmission ? selectedSubmission.industry : 'FinTech & Cloud Banking',
          techStackLogs,
          cveList,
          soc2ReportText: soc2Report,
          annualRevenue: selectedSubmission ? selectedSubmission.revenue : 65000000,
          tiv: selectedSubmission ? selectedSubmission.tiv : 40000000,
        }),
      });
      const data = await res.json();
      if (data && data.data) {
        setCroAuditResult(data.data);
      }
    } catch (err) {
      console.error('CRO audit ingestion error:', err);
    } finally {
      setIsAnalyzingCro(false);
    }
  };

  // Statutory fines calculation
  const totalOpenFinesCrores = vulnerabilities
    .filter((v) => !remediatedIds.includes(v.id))
    .reduce((acc, curr) => acc + curr.statutoryFineInrCrores, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs mb-1">
            <Scale className="w-4 h-4" />
            DPDP 2025 • SEBI CSCRF • ACTUARIAL CVE PRICING • REAL-TIME THREAT INTEL
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            Regulatory Cyber-Law & Actuarial Rating Hub
            <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
              Live Regulatory Safe Harbor
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated statutory penalty cross-referencing, dynamic CVE actuarial pricing, and real-time incident stream simulation.
          </p>
        </div>

        {/* Account in Focus and 3-Min Pitch Script */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsHackathonPitchOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-950 transition-all hover:scale-[1.02]"
          >
            <Mic className="w-3.5 h-3.5 text-purple-200" />
            <span>3-Min Hackathon Pitch</span>
          </button>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Insured:</span>
            <strong className="text-slate-200">
              {selectedSubmission ? selectedSubmission.companyName : 'Apex Sterling Financial'}
            </strong>
          </div>
        </div>
      </div>

      {/* Primary Tab Switcher */}
      <div className="bg-slate-900/90 rounded-xl p-1.5 border border-slate-800 flex items-center gap-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('dpdp')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
            activeTab === 'dpdp'
              ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scale className="w-4 h-4 text-cyan-400" />
          <span>1. DPDP 2025 & SEBI CSCRF Regulatory Cross-Reference</span>
        </button>

        <button
          onClick={() => setActiveTab('actuary')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
            activeTab === 'actuary'
              ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calculator className="w-4 h-4 text-emerald-400" />
          <span>2. Dynamic Actuarial Pricing Engine (CVE & Ticket Credits)</span>
        </button>

        <button
          onClick={() => setActiveTab('threat-stream')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all relative ${
            activeTab === 'threat-stream'
              ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>3. Threat Stream</span>
          {hasActivePolicyBreach && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute top-2 right-3" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('automitigate')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all relative ${
            activeTab === 'automitigate'
              ? 'bg-gradient-to-r from-cyan-950 to-teal-950 text-cyan-300 shadow-sm border border-cyan-700/60'
              : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-900/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>4. AutoMitigate</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">-15% Drop</span>
        </button>

        <button
          onClick={() => setActiveTab('cro-audit')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all relative ${
            activeTab === 'cro-audit'
              ? 'bg-gradient-to-r from-purple-950 to-indigo-950 text-purple-300 shadow-sm border border-purple-700/60'
              : 'text-slate-400 hover:text-purple-300 hover:bg-slate-900/60'
          }`}
        >
          <FileSearch className="w-4 h-4 text-purple-400" />
          <span>5. Enterprise CRO Audit</span>
          <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded font-mono">ISO • NIST • SLAs</span>
        </button>
      </div>

      {/* ----------------- SECTION 1: DPDP 2025 & SEBI CSCRF CROSS-REFERENCE ----------------- */}
      {activeTab === 'dpdp' && (
        <div className="space-y-6">
          {/* Statutory Exposure Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-rose-900/40">
              <div className="text-xs text-slate-400 font-semibold uppercase">Cumulative DPDP Statutory Exposure</div>
              <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
                ₹{totalOpenFinesCrores} Crores
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Across {vulnerabilities.filter((v) => !remediatedIds.includes(v.id)).length} unmitigated IT vulnerabilities
              </div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold uppercase">SEBI CSCRF Reporting Mandate</div>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                6-Hour SLA
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Domain 9.3 mandatory notification window to CERT-In / SEBI
              </div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold uppercase">Remediation Safe Harbor Progress</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {remediatedIds.length} of {vulnerabilities.length} Cleared
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">
                {Math.round((remediatedIds.length / vulnerabilities.length) * 100)}% audit compliance achieved
              </div>
            </div>
          </div>

          {/* Custom Vulnerability Ingestion Bar */}
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Cross-Reference Any IT Vulnerability against DPDP 2025 & SEBI CSCRF
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Gemini 3.8 Flash Cyber-Law Engine</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={customVulnInput}
                onChange={(e) => setCustomVulnInput(e.target.value)}
                placeholder="e.g. Unauthenticated Redis cache storing cleartext customer session tokens and Aadhaar tokens..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleCrossReferenceWithGemini}
                disabled={isCrossReferencing || !customVulnInput.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all shadow-md"
              >
                {isCrossReferencing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Mapping Clauses...</span>
                  </>
                ) : (
                  <>
                    <Scale className="w-3.5 h-3.5" />
                    <span>Cross-Reference Clauses</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Vulnerabilities Table & Mandatory Corrective Controls */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Identified IT Vulnerabilities & Statutory Clause Mappings ({vulnerabilities.length})</span>
              <span className="text-slate-500 normal-case font-normal text-[11px]">Click checkbox once corrective control is verified</span>
            </h3>

            <div className="space-y-3">
              {vulnerabilities.map((vuln) => {
                const isRemediated = remediatedIds.includes(vuln.id);
                return (
                  <div
                    key={vuln.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isRemediated
                        ? 'bg-emerald-950/20 border-emerald-800/40 opacity-70'
                        : vuln.severity === 'Critical'
                        ? 'bg-slate-950 border-rose-800/60 shadow-sm'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          checked={isRemediated}
                          onChange={() => toggleRemediation(vuln.id)}
                          className="mt-1 w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-900 cursor-pointer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className={`text-sm font-bold ${isRemediated ? 'line-through text-slate-400' : 'text-white'}`}>
                              {vuln.name}
                            </h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                              vuln.severity === 'Critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                              'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            }`}>
                              {vuln.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{vuln.description}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-500 block uppercase">Statutory Penalty Cap</span>
                        <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          {vuln.statutoryFineFormatted}
                        </span>
                      </div>
                    </div>

                    {/* Clauses and Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs">
                      {/* Left: Regulatory Clauses */}
                      <div className="space-y-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
                        <div>
                          <span className="text-[10px] font-bold text-cyan-400 uppercase block">
                            DPDP 2025 Statutory Clause:
                          </span>
                          <span className="text-slate-200 text-[11px] leading-relaxed">
                            {vuln.dpdpClause}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-purple-400 uppercase block">
                            SEBI CSCRF Security Domain:
                          </span>
                          <span className="text-slate-200 text-[11px] leading-relaxed">
                            {vuln.sebiCscrfClause}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Mandatory Remediation SLA: <strong className="text-slate-200">{vuln.remediationSLA}</strong></span>
                        </div>
                      </div>

                      {/* Right: Mandatory Corrective Controls Required for Audit Clearance */}
                      <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 space-y-1.5">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase block">
                          Mandatory Corrective Controls for Audit Safe Harbor:
                        </span>
                        <ul className="space-y-1 text-[11px] text-slate-300">
                          {vuln.mandatoryCorrectiveControls.map((ctrl, i) => (
                            <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                              <span className="text-emerald-400 mt-0.5">•</span>
                              <span>{ctrl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SECTION 2: DYNAMIC ACTUARIAL PRICING MODEL ----------------- */}
      {activeTab === 'actuary' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  Dynamic Cyber Actuarial Pricing Engine
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time rating algorithm applying CVE risk multipliers and closed security ticket compliance credits.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Baseline Premium:</span>
                <div className="flex items-center gap-1 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-xs font-bold text-white">
                  <span>₹</span>
                  <input
                    type="number"
                    value={baselinePremiumInr}
                    onChange={(e) => setBaselinePremiumInr(Number(e.target.value))}
                    className="w-24 bg-transparent focus:outline-none text-emerald-400 font-mono"
                  />
                  <span>/yr</span>
                </div>
              </div>
            </div>

            {/* Actuarial Slider Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              {/* Active Critical CVEs */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-rose-300">Active Critical CVEs (+18% each)</span>
                  <span className="font-mono font-bold text-rose-400">{activeCriticalCves}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={8}
                  value={activeCriticalCves}
                  onChange={(e) => setActiveCriticalCves(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0 (Clean)</span>
                  <span>4 (Referral)</span>
                  <span>8 (Decline)</span>
                </div>
              </div>

              {/* Active High CVEs */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-300">Active High CVEs (+8% each)</span>
                  <span className="font-mono font-bold text-amber-400">{activeHighCves}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={15}
                  value={activeHighCves}
                  onChange={(e) => setActiveHighCves(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0 (Zero High)</span>
                  <span>7 Moderate</span>
                  <span>15 Max</span>
                </div>
              </div>

              {/* Closed Security Tickets Credit */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-300">Resolved Security Tickets</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {closedTicketsCount} / {totalTicketsCount} ({Math.round(ticketResolutionRate * 100)}%)
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={totalTicketsCount}
                  value={closedTicketsCount}
                  onChange={(e) => setClosedTicketsCount(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0% (No Credit)</span>
                  <span>50%</span>
                  <span>100% (-15% Max Credit)</span>
                </div>
              </div>

              {/* MFA Enforcement % */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-cyan-300">MFA Workforce Enforcement</span>
                  <span className="font-mono font-bold text-cyan-400">{mfaEnforcementPct}%</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={100}
                  step={5}
                  value={mfaEnforcementPct}
                  onChange={(e) => setMfaEnforcementPct(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>40% (No Credit)</span>
                  <span>80% (-6%)</span>
                  <span>100% (-12% Preferred)</span>
                </div>
              </div>

              {/* SLA Patch Turnaround Days */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-purple-300">Average Patch Turnaround SLA</span>
                  <span className="font-mono font-bold text-purple-400">{patchTurnaroundDays} Days</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={45}
                  value={patchTurnaroundDays}
                  onChange={(e) => setPatchTurnaroundDays(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>≤7 Days (-5% Credit)</span>
                  <span>14 Days (Par)</span>
                  <span>≥30 Days (+12% Debit)</span>
                </div>
              </div>

              {/* Actuarial Verdict Badge */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Underwriting Verdict</span>
                  <div className="mt-1">
                    {netDebitCreditPct > 15 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded">
                        <AlertTriangle className="w-3.5 h-3.5" /> High Risk Referral
                      </span>
                    ) : netDebitCreditPct > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded">
                        <DollarSign className="w-3.5 h-3.5" /> Debit Surcharge Applied
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Preferred Credit Granted
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 mt-2">
                  Net Rating Mod: <strong className={netDebitCreditPct <= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {netDebitCreditPct > 0 ? `+${netDebitCreditPct}%` : `${netDebitCreditPct}%`}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Actuarial Rating Output Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3 font-mono text-xs">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-sans">
                Actuarial Rate Breakdown
              </h4>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400 font-sans">Baseline Annual Premium</span>
                <span className="text-white font-bold">₹{baselinePremiumInr.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400 font-sans">CVE Threat Multiplier</span>
                <span className="text-rose-400 font-bold">{cveMultiplier}x (+{cveRiskSurchargePct}%)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400 font-sans">Resolved Security Tickets Credit</span>
                <span className="text-emerald-400 font-bold">-{closedTicketDiscountPct}%</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400 font-sans">Universal MFA Safeguard Discount</span>
                <span className="text-emerald-400 font-bold">-{mfaCreditPct}%</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400 font-sans">Patch Turnaround SLA Factor</span>
                <span className={slaPatchModifierPct <= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {slaPatchModifierPct <= 0 ? `${slaPatchModifierPct}%` : `+${slaPatchModifierPct}%`}
                </span>
              </div>
            </div>

            {/* Final Rate Box */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between text-center">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">Final Optimized Annual Premium</span>
                <div className="text-3xl font-black font-mono text-emerald-400 mt-2">
                  ₹{finalAdjustedPremiumInr.toLocaleString()}
                  <span className="text-xs text-slate-400 font-normal"> / year</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Adjusted from baseline ₹{baselinePremiumInr.toLocaleString()} based on verified security telemetry.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Want to attach this pricing schedule?</span>
                <button
                  onClick={() => onOpenCopilotWithContext(selectedSubmission, `Explain the dynamic CVE actuarial rate schedule calculation (₹${finalAdjustedPremiumInr.toLocaleString()}/yr).`)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg font-semibold transition-colors flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Draft Actuarial Endorsement</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SECTION 3: REAL-TIME THREAT INTEL STREAM & INJECTOR ----------------- */}
      {activeTab === 'threat-stream' && (
        <div className="space-y-6">
          {/* Live Injected Alert Banner */}
          {injectedBanner && hasActivePolicyBreach && (
            <div className="p-4 bg-rose-950/40 border-2 border-rose-500 rounded-2xl shadow-lg shadow-rose-950/50 space-y-3 animate-pulse">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-rose-400 mt-0.5 shrink-0 animate-bounce" />
                  <div>
                    <h4 className="text-sm font-bold text-rose-200">
                      LIVE CRITICAL UNDERWRITER ALERT: Policy Breach Detected
                    </h4>
                    <p className="text-xs text-rose-300 mt-0.5 leading-relaxed">
                      {injectedBanner}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleRemediateBreach}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shrink-0 shadow-md"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Remediate & Clear Breach</span>
                </button>
              </div>

              <div className="p-2.5 bg-rose-950/60 rounded-xl border border-rose-800/60 text-xs font-mono flex flex-wrap justify-between gap-2">
                <span className="text-rose-300">
                  Breached Warranty: <strong>Protective Cyber Warranty Clause 4B</strong>
                </span>
                <span className="text-rose-400 font-bold">
                  Binding Status: SUSPENDED
                </span>
              </div>
            </div>
          )}

          {/* Threat Injection Simulator Bar */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  Real-Time Threat Intelligence Feed & Mock Incident Injector
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Inject live simulated zero-day leaks or credential breaches to test real-time score adjustment (72 → 89) and automated underwriter alerts.
                </p>
              </div>

              {/* Current Client Score Badge */}
              <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Client Cyber Score</div>
                  <div className={`text-xl font-black font-mono ${
                    clientRiskScore >= 80 ? 'text-rose-400' : 'text-cyan-400'
                  }`}>
                    {clientRiskScore}/100
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  clientRiskScore >= 80 ? 'bg-rose-500 animate-ping' : 'bg-cyan-500'
                }`} />
              </div>
            </div>

            {/* Injection Buttons */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-400 block">
                Select Mock Event to Inject into Live Feed:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handleInjectThreat(
                    'Production AWS API Key leaked on public GitHub repository 4 minutes ago',
                    'GitGuardian Public GitHub Feed',
                    'Aegis Cyber Solutions'
                  )}
                  disabled={isInjecting}
                  className="p-3 bg-slate-950 hover:bg-slate-800 border border-rose-900/40 hover:border-rose-500/60 rounded-xl text-left transition-all group"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-rose-300 mb-1">
                    <span>1. API Key Public GitHub Leak</span>
                    <Play className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Escalates score 72 → 89. Triggers Warranty Clause 4B breach and emergency policy review.
                  </p>
                </button>

                <button
                  onClick={() => handleInjectThreat(
                    'Active CVE-2026-3094 RCE Exploit Probe Detected Against Ingress NGINX',
                    'ThreatFox IOC Threat Grid',
                    'Vanguard BioPharma Labs'
                  )}
                  disabled={isInjecting}
                  className="p-3 bg-slate-950 hover:bg-slate-800 border border-amber-900/40 hover:border-amber-500/60 rounded-xl text-left transition-all group"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300 mb-1">
                    <span>2. Zero-Day RCE Probe</span>
                    <Play className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Escalates score 68 → 81. Triggers automated 12-hour patch verification demand.
                  </p>
                </button>

                <button
                  onClick={() => handleInjectThreat(
                    'Massive Volumetric Distributed Denial-of-Service (DDoS) on Payment Gateway',
                    'Cloudflare Magic Transit Radar',
                    'Solaria Clean Energy Farm'
                  )}
                  disabled={isInjecting}
                  className="p-3 bg-slate-950 hover:bg-slate-800 border border-cyan-900/40 hover:border-cyan-500/60 rounded-xl text-left transition-all group"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-cyan-300 mb-1">
                    <span>3. Volumetric Gateway DDoS</span>
                    <Play className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Calculates contingent business interruption (CBI) surge of $340k.
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* Threat Event Feed Stream */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              Live Security Telemetry Stream ({threatEvents.length} Events Logged)
            </h4>

            <div className="space-y-3">
              {threatEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    event.severity === 'CRITICAL'
                      ? 'bg-rose-950/20 border-rose-800/60 text-rose-200'
                      : event.severity === 'HIGH'
                      ? 'bg-amber-950/20 border-amber-800/60 text-amber-200'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                        event.severity === 'CRITICAL' ? 'bg-rose-500 text-white' :
                        event.severity === 'HIGH' ? 'bg-amber-500 text-black' : 'bg-blue-500 text-white'
                      }`}>
                        {event.severity}
                      </span>
                      <strong className="text-white text-xs">{event.title}</strong>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                      <span>Source: {event.source}</span>
                      <span>•</span>
                      <span>{event.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-[11px] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Score Impact:</span>
                      <span className="font-mono text-slate-400">{event.priorScore}</span>
                      <span className="text-rose-400 font-bold">→ {event.adjustedScore}/100</span>
                    </div>

                    <div className="text-slate-300">
                      <strong>Underwriter Action:</strong> {event.recommendedAction}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SECTION 4: AUTOMITIGATE: AUTONOMOUS REMEDIATION & DYNAMIC RE-PRICING ----------------- */}
      {activeTab === 'automitigate' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 rounded-2xl p-5 border border-cyan-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs mb-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                AUTOMITIGATE RUNTIME AGENT v2.4 • CLOSED-LOOP CYBER RESILIENCE
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Autonomous Self-Healing & Dynamic Premium Adjustment
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Detect vulnerabilities, generate and deploy exact production configuration patches, and automatically trigger an instant 15% insurance premium reduction.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsPitchModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
              >
                <Presentation className="w-3.5 h-3.5 text-cyan-400" />
                <span>VC Pitch & 90-Day Plan</span>
              </button>

              <button
                onClick={() => setIsJsonModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
              >
                <Code2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Structured JSON</span>
              </button>

              <button
                onClick={() => {
                  setIsExecutingPatch(true);
                  setTimeout(() => {
                    setIsExecutingPatch(false);
                    setHasRemediatedAuto(true);
                  }, 900);
                }}
                disabled={isExecutingPatch}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all ${
                  hasRemediatedAuto
                    ? 'bg-emerald-600 text-white shadow-emerald-950'
                    : 'bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white shadow-cyan-950 hover:scale-[1.02]'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${isExecutingPatch ? 'animate-spin' : ''}`} />
                <span>{isExecutingPatch ? 'Deploying Autonomous Patch...' : hasRemediatedAuto ? 'Patch Deployed & Verified' : 'Deploy Autonomous Patch'}</span>
              </button>
            </div>
          </div>

          {/* 3 Pillars of AutoMitigate Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* 1. Autonomous Remediation Scripts */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" />
                  1. Autonomous Production Patches
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">HCL / Conf / JSON</span>
              </div>

              {/* Script Tabs */}
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
                <button
                  onClick={() => setActiveScriptTab('terraform')}
                  className={`flex-1 py-1 rounded transition-colors ${
                    activeScriptTab === 'terraform' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  Terraform
                </button>
                <button
                  onClick={() => setActiveScriptTab('nginx')}
                  className={`flex-1 py-1 rounded transition-colors ${
                    activeScriptTab === 'nginx' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  Nginx
                </button>
                <button
                  onClick={() => setActiveScriptTab('iam')}
                  className={`flex-1 py-1 rounded transition-colors ${
                    activeScriptTab === 'iam' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  AWS IAM
                </button>
              </div>

              {/* Code Display */}
              <div className="relative">
                <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/90 text-[10.5px] font-mono text-slate-200 overflow-x-auto max-h-72 leading-relaxed">
                  {activeScriptTab === 'terraform' && `# AutoMitigate Terraform Autonomous Patch
resource "aws_lb_listener" "https_secure" {
  load_balancer_arn = aws_lb.gateway.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate.cert.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.core.arn
  }
}

resource "aws_cloudfront_distribution" "cdn" {
  viewer_certificate {
    minimum_protocol_version = "TLSv1.2_2021"
    ssl_support_method       = "sni-only"
  }
}`}
                  {activeScriptTab === 'nginx' && `# AutoMitigate Nginx SSL Hardening
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384';
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;

# HSTS 1-Year Preload
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Frame-Options DENY always;`}
                  {activeScriptTab === 'iam' && `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AutoMitigateBlockNonMfa",
      "Effect": "Deny",
      "NotAction": [
        "iam:CreateVirtualMFADevice",
        "iam:EnableMFADevice",
        "sts:GetSessionToken"
      ],
      "Resource": "*",
      "Condition": {
        "BoolIfExists": {
          "aws:MultiFactorAuthPresent": "false"
        }
      }
    }
  ]
}`}
                </pre>

                <button
                  onClick={() => {
                    setCopiedScript(activeScriptTab);
                    setTimeout(() => setCopiedScript(null), 2000);
                  }}
                  className="absolute top-2.5 right-2.5 px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-mono flex items-center gap-1 border border-slate-700"
                >
                  {copiedScript === activeScriptTab ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                  <span>{copiedScript === activeScriptTab ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero human overhead. Applied via GitOps CI/CD webhooks in 45 seconds.</span>
              </div>
            </div>

            {/* 2. Dynamic Financial Recalculation (ALE & Tail Risk) */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  2. Dynamic Financial Recalculation
                </h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                  hasRemediatedAuto ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  {hasRemediatedAuto ? 'STATE: REMEDIATED' : 'STATE: VULNERABLE'}
                </span>
              </div>

              {/* Loss Metrics Comparison Table */}
              <div className="space-y-2.5 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase">Annual Loss Expectancy (ALE)</div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-slate-400 line-through">$1,850,000</span>
                    <span className="font-mono text-xl font-bold text-emerald-400">
                      {hasRemediatedAuto ? '$698,000' : '$1,850,000'}
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center justify-between pt-1 border-t border-slate-800">
                    <span>ALE Drop:</span>
                    <strong className="font-mono">{hasRemediatedAuto ? '-$1,152,000 (-62.16%)' : '0% (Unmitigated)'}</strong>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase">Tail Risk / 1-in-100 PML</div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-slate-400 line-through">$12,025,000</span>
                    <span className="font-mono text-base font-bold text-cyan-400">
                      {hasRemediatedAuto ? '$4,560,000' : '$12,025,000'}
                    </span>
                  </div>
                  <div className="text-[10px] text-cyan-400 flex items-center justify-between pt-1 border-t border-slate-800">
                    <span>Tail Risk Drop:</span>
                    <strong className="font-mono">{hasRemediatedAuto ? '-$7,465,000 (-62.1%)' : '0%'}</strong>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase">Cyber Risk Score</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-rose-400 line-through text-xs">84</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-emerald-400 font-bold text-base">
                      {hasRemediatedAuto ? '36/100' : '84/100'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {hasRemediatedAuto
                  ? 'Actuarial risk delta validated: Cryptographic posture upgrades eliminate primary remote exploit vectors.'
                  : 'Awaiting autonomous remediation patch deployment to trigger actuarial state transition.'}
              </p>
            </div>

            {/* 3. Automated Insurance Policy Adjustment */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4" />
                  3. Automated Premium Adjustment
                </h4>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  -15% Surcharge Slashed
                </span>
              </div>

              {/* Policy Adjustment Box */}
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/40 space-y-3">
                <div className="text-center pb-2 border-b border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Adjusted Annual Insurance Premium</div>
                  <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                    {hasRemediatedAuto ? '$80,750 / year' : '$95,000 / year'}
                  </div>
                  <div className="text-xs text-emerald-400 font-semibold mt-0.5">
                    {hasRemediatedAuto ? 'Instant $14,250 Annual Premium Savings' : 'Standard Rate (Unhedged)'}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Continuous Compliance Discount:</span>
                    <span className="font-mono font-bold text-emerald-400">-15.0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Deductible Reduction:</span>
                    <span className="font-mono font-bold text-cyan-400">-$25,000 ($50k → $25k)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ransomware Coinsurance:</span>
                    <span className="font-mono font-bold text-emerald-400">WAIVED (0%)</span>
                  </div>
                </div>
              </div>

              {/* Endorsement Statement */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                <strong className="text-white block mb-1">Carrier Binder Endorsement Clause:</strong>
                "In consideration of immediate autonomous patching via AutoMitigate, carrier grants an instant 15% rate credit and waives standard 30-day waiting period exclusions for newly identified CVEs."
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SECTION 5: ENTERPRISE CRO AUDIT & LOG INGESTION ----------------- */}
      {activeTab === 'cro-audit' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 rounded-2xl p-5 border border-purple-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs mb-1">
                <FileSearch className="w-4 h-4 text-purple-400" />
                CHIEF RISK OFFICER & LEAD CYBERSECURITY ARCHITECT ENGINE
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Enterprise Tech Stack Logs & SOC 2 Ingestion Lab
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ingest tech stack telemetry, CVE databases, and SOC 2 Type II reports. Automated ISO 27001, NIST CSF & DPDP statutory cross-referencing, precise ALE vs. Tail Risk calculation, and binding 30/60-day remediation SLAs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsHackathonPitchOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-950 transition-all hover:scale-[1.02]"
              >
                <Mic className="w-3.5 h-3.5 text-purple-200" />
                <span>3-Min Hackathon Pitch</span>
              </button>

              <button
                onClick={() => setIsCroJsonOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
              >
                <Code2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Strict JSON</span>
              </button>

              <button
                onClick={handleRunCroAudit}
                disabled={isAnalyzingCro}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-purple-950 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isAnalyzingCro ? 'animate-spin' : ''}`} />
                <span>{isAnalyzingCro ? 'Running CRO Forensic Audit...' : 'Run Enterprise CRO Audit'}</span>
              </button>
            </div>
          </div>

          {/* Quick Intake Presets */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider shrink-0">Sample Ingestion Presets:</span>
            <button
              onClick={() => {
                setTechStackLogs('Kube-apiserver auth warning: Unauthenticated token probe on port 6443; AWS CloudTrail: root console login without MFA from unknown IP; MongoDB cluster: TLSv1.0 fallback enabled on port 27017; PostgreSQL prod: Unencrypted PII column containing customer Aadhaar, PAN, and bank routing hashes.');
                setCveList('CVE-2024-3094 (XZ Utils Upstream Backdoor - Critical CVSS 10.0), CVE-2023-4863 (libwebp Heap Buffer Overflow - High CVSS 8.8), CVE-2023-38606 (Kernel Privilege Escalation - High CVSS 7.8)');
                setSoc2Report('SOC 2 Type II Independent Audit Findings:\n1. Exception in CC6.1 - Logical access reviews not performed on quarterly schedule across AWS production.\n2. Exception in CC6.6 - External network penetration test high-severity findings remained unpatched past 90 days.\n3. Exception in CC7.1 - Automated customer data disposal & retention policies absent.');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-[11px] shrink-0"
            >
              Preset 1: Apex FinTech (Core Banking & Cloud)
            </button>
            <button
              onClick={() => {
                setTechStackLogs('Kubernetes ingress: Deprecated SSL ciphers accepted; AWS RDS Aurora: Automated snapshots unencrypted; OpenSSL 1.1.1 unpatched on edge proxy nodes; Telehealth video bridge: Unauthenticated WebSocket endpoint.');
                setCveList('CVE-2023-44487 (HTTP/2 Rapid Reset Attack - High), CVE-2024-21626 (runc Container Escape - Critical), CVE-2023-38545 (curl SOCKS5 buffer overflow - High)');
                setSoc2Report('SOC 2 Health Cloud Evaluation:\n1. Exception in CC6.3 - Offboarding checklist incomplete for 4 engineering contractors.\n2. Exception in CC6.7 - Encryption keys stored in unencrypted configuration repository.\n3. HIPAA Security Rule 164.312 - Missing immutable audit log retention past 180 days.');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-[11px] shrink-0"
            >
              Preset 2: BioHealth Telemedicine (HIPAA & Containers)
            </button>
            <button
              onClick={() => {
                setTechStackLogs('Docker Swarm cluster: Unauthenticated Docker daemon exposed on port 2375; Redis cache: No AUTH required on internal VPC subnet; GitHub secret scan: Stripe live secret key committed in repo commit history.');
                setCveList('CVE-2024-23897 (Jenkins CLI Arbitrary File Read - Critical), CVE-2023-22515 (Confluence PrivEsc - Critical), CVE-2023-36845 (Juniper Junos OS RCE - High)');
                setSoc2Report('SOC 2 Retail Cloud Review:\n1. Exception in CC5.2 - Threat modeling exercises not conducted for new microservices.\n2. Exception in CC7.2 - Disaster recovery failover testing failed for second consecutive year.\n3. PCI-DSS Requirement 8.3 - Missing MFA on administrative jump boxes.');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-[11px] shrink-0"
            >
              Preset 3: OmniRetail E-Commerce (Microservices & Secrets)
            </button>
          </div>

          {/* Three Ingestion Inputs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Terminal className="w-3.5 h-3.5" />
                  1. Tech Stack Logs & Telemetry
                </span>
                <span className="text-[10px] text-slate-500 font-mono">CloudTrail / K8s / DB</span>
              </label>
              <textarea
                value={techStackLogs}
                onChange={(e) => setTechStackLogs(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                placeholder="Paste raw server logs, Kubernetes events, or CloudTrail alerts..."
              />
            </div>

            <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-rose-400">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  2. Active CVE List & Advisories
                </span>
                <span className="text-[10px] text-slate-500 font-mono">NVD / CVSS / Zero-Days</span>
              </label>
              <textarea
                value={cveList}
                onChange={(e) => setCveList(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:border-rose-500 focus:outline-none"
                placeholder="List active CVE identifiers and severity ratings..."
              />
            </div>

            <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <FileCheck className="w-3.5 h-3.5" />
                  3. SOC 2 Audit Report Findings
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Type II Exceptions & Pentests</span>
              </label>
              <textarea
                value={soc2Report}
                onChange={(e) => setSoc2Report(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
                placeholder="Paste SOC 2 Trust Services Criteria exceptions and pentest notes..."
              />
            </div>
          </div>

          {/* Results Display */}
          {croAuditResult && (
            <div className="space-y-6">
              {/* Executive Overview Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Composite Risk Score</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold font-mono text-rose-400">
                      {croAuditResult.entity_overview?.composite_cyber_risk_score || 82}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">/ 100</span>
                  </div>
                  <div className="text-[11px] text-rose-300 font-semibold mt-1">
                    {croAuditResult.entity_overview?.risk_tier || 'Tier 3 - Substandard / High Risk'}
                  </div>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-amber-900/40">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Annual Loss Expectancy (ALE)</div>
                  <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                    ${Number(croAuditResult.financial_exposure?.annual_loss_expectancy_ale_usd || 2450000).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Expected annualized loss frequency × impact
                  </div>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-purple-900/40">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Tail Risk (Max Potential Loss)</div>
                  <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
                    ${Number(croAuditResult.financial_exposure?.tail_risk_maximum_potential_loss_usd || 18750000).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-purple-300 mt-1">
                    {croAuditResult.financial_exposure?.tail_risk_confidence_interval || '99.5% VaR (1-in-200 Catastrophe)'}
                  </div>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-emerald-900/40">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Binding Underwriting Verdict</div>
                  <div className="text-base font-bold font-mono text-emerald-400 mt-1">
                    {croAuditResult.binding_underwriting_conditions?.policy_bind_status || 'CONDITIONAL_APPROVAL'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Binding subject to 30/60-day remediation SLAs
                  </div>
                </div>
              </div>

              {/* Requirement 1: Global Security Baseline Cross-Reference */}
              <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Scale className="w-4 h-4" />
                    1. Global Security Baseline Cross-Reference (ISO 27001 • NIST CSF • DPDP 2025)
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {croAuditResult.baseline_cross_reference?.length || 3} Vulnerabilities Mapped
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Vulnerability & Component</th>
                        <th className="py-2.5 px-3">Severity</th>
                        <th className="py-2.5 px-3">ISO 27001 Control</th>
                        <th className="py-2.5 px-3">NIST CSF 2.0 Function</th>
                        <th className="py-2.5 px-3">DPDP 2025 Mandate & Exposure</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-sans">
                      {croAuditResult.baseline_cross_reference?.map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-semibold text-white">{item.cve_or_finding}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">{item.affected_component}</div>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              item.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                              item.severity === 'HIGH' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                              'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                            }`}>
                              {item.severity}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-200">{item.iso_27001_mapping?.control_clause}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{item.iso_27001_mapping?.gap_analysis}</div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-cyan-300">{item.nist_csf_mapping?.function}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{item.nist_csf_mapping?.sub_category}</div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-emerald-400">₹{item.dpdp_2025_mapping?.statutory_exposure_crores_inr} Crores Fine Cap</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{item.dpdp_2025_mapping?.section}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Requirement 2: Financial Exposure (ALE vs. Tail Risk) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* ALE Breakdown */}
                <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" />
                      Annual Loss Expectancy (ALE) Breakdown
                    </h4>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      ${Number(croAuditResult.financial_exposure?.annual_loss_expectancy_ale_usd || 2450000).toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <span className="text-slate-400">Data Breach Direct Forensic & Notification Costs</span>
                      <span className="font-mono font-bold text-slate-200">
                        ${Number(croAuditResult.financial_exposure?.ale_breakdown?.data_breach_direct_costs || 850000).toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <span className="text-slate-400">Business Interruption Daily Operational Burn</span>
                      <span className="font-mono font-bold text-slate-200">
                        ${Number(croAuditResult.financial_exposure?.ale_breakdown?.business_interruption_daily_burn || 620000).toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <span className="text-slate-400">Statutory Regulatory Fines (DPDP / GDPR / SEBI)</span>
                      <span className="font-mono font-bold text-slate-200">
                        ${Number(croAuditResult.financial_exposure?.ale_breakdown?.statutory_regulatory_fines || 680000).toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <span className="text-slate-400">Emergency Incident Response & Ransomware Retainers</span>
                      <span className="font-mono font-bold text-slate-200">
                        ${Number(croAuditResult.financial_exposure?.ale_breakdown?.incident_response_forensics || 300000).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tail Risk / Maximum Potential Loss */}
                <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-purple-400" />
                      Tail Risk: Maximum Potential Loss (1-in-200 Year VaR)
                    </h4>
                    <span className="text-xs font-mono font-bold text-purple-400">
                      ${Number(croAuditResult.financial_exposure?.tail_risk_maximum_potential_loss_usd || 18750000).toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {croAuditResult.financial_exposure?.tail_risk_scenarios?.map((sc: any, idx: number) => (
                      <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/90 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <strong className="text-slate-200">{sc.scenario}</strong>
                          <span className="font-mono font-bold text-rose-400">
                            ${Number(sc.loss_projection_usd).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <span className="text-purple-400 font-semibold">Attachment Layer:</span>
                          <span>{sc.reinsurance_attachment_point}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Requirement 3: Binding Underwriting Conditions (30 & 60 Day SLAs) */}
              <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4" />
                    3. Binding Underwriting Conditions & Remediation SLAs
                  </h4>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
                    Legally Binding Policy Subjectivities
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 30-Day SLAs */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      Strict 30-Day Remediation SLAs (Critical Remediations)
                    </div>

                    {croAuditResult.binding_underwriting_conditions?.thirty_day_remediation_slas?.map((sla: any, idx: number) => (
                      <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-rose-900/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <strong className="text-xs text-white">{sla.title}</strong>
                          <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                            {sla.deadline_days} Days
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          <strong>Action:</strong> {sla.required_corrective_action}
                        </p>
                        <div className="text-[11px] text-slate-400">
                          <strong>Mandatory Evidence:</strong> {sla.mandatory_evidence}
                        </div>
                        <div className="text-[11px] text-rose-400/90 bg-rose-950/40 p-2 rounded border border-rose-900/40">
                          <strong>Failure Penalty:</strong> {sla.failure_penalty}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 60-Day SLAs */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      Strict 60-Day Remediation SLAs (Process & Governance)
                    </div>

                    {croAuditResult.binding_underwriting_conditions?.sixty_day_remediation_slas?.map((sla: any, idx: number) => (
                      <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-amber-900/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <strong className="text-xs text-white">{sla.title}</strong>
                          <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                            {sla.deadline_days} Days
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          <strong>Action:</strong> {sla.required_corrective_action}
                        </p>
                        <div className="text-[11px] text-slate-400">
                          <strong>Mandatory Evidence:</strong> {sla.mandatory_evidence}
                        </div>
                        <div className="text-[11px] text-amber-400/90 bg-amber-950/40 p-2 rounded border border-amber-900/40">
                          <strong>Failure Penalty:</strong> {sla.failure_penalty}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Endorsement and Warranties */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    Mandatory Policy Warranties & Endorsement Clauses:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {croAuditResult.binding_underwriting_conditions?.endorsements_and_warranties?.map((clause: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-cyan-400 shrink-0">•</span>
                        <span>{clause}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------- MODAL: VC PITCH & 90-DAY EXECUTION NARRATIVE ----------------- */}
      {isPitchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5">
                  <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                    <Presentation className="w-4 h-4 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">AutoMitigate — Venture Keynote & 90-Day Execution Plan</h3>
                  <p className="text-xs text-slate-400">Autonomous Cyber-Resilience & Dynamic Insurance Pricing Operating Layer</p>
                </div>
              </div>
              <button
                onClick={() => setIsPitchModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-sm text-slate-300">
              {/* Pitch Highlight Box */}
              <div className="bg-gradient-to-r from-cyan-950/50 via-slate-950 to-teal-950/40 p-4 rounded-xl border border-cyan-800/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                  Keynote Pitch Transcript
                </span>
                <p className="text-sm font-medium text-slate-100 italic mt-2 leading-relaxed">
                  "Ladies and gentlemen, cyber insurance is broken because it exists in an actuarial vacuum. Today, we close the loop."
                </p>
              </div>

              {/* The 3 Core Pillars */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/40 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    1. The Broken Paradigm
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Traditional cybersecurity and insurance are fundamentally reactive. Companies get scanned, receive a paralyzing 500-page PDF report of CVEs, panic, take 6 to 9 months manually trying to patch them, and pay flat, punishingly high insurance rates regardless of their posture. Underwriters price risk blind, and insureds view cyber insurance as an adversarial annual tax.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-cyan-900/40 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    2. The AutoMitigate Revolution
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    We do not just detect risk — <strong>our autonomous runtime agents fix the code</strong>. When an outdated TLS cipher, missing MFA requirement, or unpatched zero-day is surfaced, AutoMitigate synthesizes and deploys production-ready Terraform, Nginx, or IAM policy patches directly through the CI/CD pipeline. The instant cryptographic verification completes, the system <strong>immediately cuts the insured's premium by 15% and slashes their deductible by $25,000</strong> as an immediate financial reward for continuous resilience.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/40 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    3. Why Mitigata Wins
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    AutoMitigate turns cyber insurance from a static annual grudge purchase into an <strong>active, continuous incentive loop</strong>. We align the CFO, the CISO, and the Insurance Carrier: the CISO gets automated vulnerability eradication, the CFO unlocks immediate cash balance sheet savings, and the carrier drops portfolio loss ratios from 68% down to 24%.
                  </p>
                </div>
              </div>

              {/* 90-Day Execution Roadmap */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span>90-Day Go-To-Market Execution Plan</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="text-[10px] font-mono text-cyan-400 font-bold">DAYS 1 – 30</div>
                    <div className="text-xs font-bold text-white">Agent Hardening & GitOps Hooks</div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Deploy autonomous patch generators across Terraform, Kubernetes Helm, and AWS IAM. Finalize zero-latency telemetry agent with GitHub/GitLab webhooks.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="text-[10px] font-mono text-amber-400 font-bold">DAYS 31 – 60</div>
                    <div className="text-xs font-bold text-white">Dynamic Actuarial Binding Authority</div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Integrate real-time actuarial rate curves. Calibrate ALE (Annual Loss Expectancy) drop algorithms directly with Lloyd's syndicate binding authority.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="text-[10px] font-mono text-emerald-400 font-bold">DAYS 61 – 90</div>
                    <div className="text-xs font-bold text-white">Commercial Launch & MGA Scaling</div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Onboard initial cohort of 25 enterprise mid-market insureds ($50M+ ARR). Demonstrate 62% ALE loss reduction and 100% policy renewal retention.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button
                onClick={() => setIsPitchModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
              >
                Close Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: STRUCTURED JSON OBJECT ----------------- */}
      {isJsonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900 sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">AutoMitigate Structured JSON Response</h3>
                  <p className="text-xs text-slate-400">Keys: "remediation_scripts", "financial_impact", "new_insurance_terms"</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const jsonPayload = JSON.stringify({
                      remediation_scripts: [
                        {
                          language: "terraform",
                          filename: "security_group_tls.tf",
                          description: "Enforces TLS 1.3 minimum protocol version and disables deprecated SSLv3/TLS1.0/TLS1.1 ciphers across CloudFront and Application Load Balancers.",
                          code: `resource "aws_lb_listener" "https_secure" {\n  load_balancer_arn = aws_lb.production_gateway.arn\n  port              = 443\n  protocol          = "HTTPS"\n  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"\n  certificate_arn   = aws_acm_certificate.wildcard_cert.arn\n\n  default_action {\n    type             = "forward"\n    target_group_arn = aws_lb_target_group.core_api.arn\n  }\n}\n\nresource "aws_cloudfront_distribution" "cdn_secure" {\n  viewer_certificate {\n    acm_certificate_arn      = aws_acm_certificate.wildcard_cert.arn\n    ssl_support_method       = "sni-only"\n    minimum_protocol_version = "TLSv1.2_2021"\n  }\n}`
                        },
                        {
                          language: "nginx",
                          filename: "nginx_ssl_hardening.conf",
                          description: "Production Nginx reverse proxy SSL configuration rejecting legacy handshakes and enforcing HSTS with ECDHE cipher suites.",
                          code: `ssl_protocols TLSv1.2 TLSv1.3;\nssl_prefer_server_ciphers on;\nssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';\nssl_session_timeout 1d;\nssl_session_cache shared:SSL:10m;\nssl_session_tickets off;\n\n# HSTS (HTTP Strict Transport Security) - 1 year with subdomains\nadd_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;\nadd_header X-Frame-Options DENY always;\nadd_header X-Content-Type-Options nosniff always;`
                        },
                        {
                          language: "json",
                          filename: "aws_iam_enforce_mfa_policy.json",
                          description: "AWS IAM Condition block policy denying all administrative and API access unless authenticated with hardware/FIDO2 MFA token.",
                          code: `{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Sid": "AutoMitigateBlockNonMfaAccess",\n      "Effect": "Deny",\n      "NotAction": [\n        "iam:CreateVirtualMFADevice",\n        "iam:EnableMFADevice",\n        "iam:GetUser",\n        "iam:ListMFADevices",\n        "iam:ResyncMFADevice",\n        "sts:GetSessionToken"\n      ],\n      "Resource": "*",\n      "Condition": {\n        "BoolIfExists": {\n          "aws:MultiFactorAuthPresent": "false"\n        }\n      }\n    }\n  ]\n}`
                        }
                      ],
                      financial_impact: {
                        pre_remediation: {
                          system_status: "VULNERABLE",
                          cyber_risk_score: 84,
                          annual_loss_expectancy_ale_usd: 1850000,
                          probable_maximum_loss_pml_usd: 7770000,
                          tail_risk_exposure_usd: 12025000
                        },
                        post_remediation: {
                          system_status: "REMEDIATED_AUTONOMOUSLY",
                          cyber_risk_score: 36,
                          annual_loss_expectancy_ale_usd: 698000,
                          probable_maximum_loss_pml_usd: 3496500,
                          tail_risk_exposure_usd: 4560000,
                          delta_reduction: {
                            ale_savings_usd: 1152000,
                            ale_reduction_percentage: 62.16,
                            tail_risk_reduction_usd: 7465000,
                            risk_score_improvement: -48
                          }
                        }
                      },
                      new_insurance_terms: {
                        carrier_syndicate: "RiskPulse Syndicate 1892 (Underwritten via AutoMitigate Binding Authority)",
                        policy_status: "ACTIVE_PREFERRED_TERMS",
                        action_applied: "INSTANT_CONTINUOUS_COMPLIANCE_DISCOUNT",
                        adjustment_summary: "Active security patch deployed: Applying an instant 15% compliance discount to monthly insurance premium, reducing deductible by $25,000.",
                        premium_details: {
                          baseline_annual_premium_usd: 95000,
                          applied_discount_percentage: 15,
                          annual_cash_savings_usd: 14250,
                          new_adjusted_annual_premium_usd: 80750,
                          billing_frequency: "Monthly Dynamic Adjustment"
                        },
                        retention_and_sublimits: {
                          previous_deductible_usd: 50000,
                          new_deductible_usd: 25000,
                          deductible_reduction_usd: 25000,
                          contingent_bi_sublimit_usd: 5000000,
                          ransomware_coinsurance_waived: true
                        },
                        mandatory_endorsement_clause: "AutoMitigate Continuous Cyber Warranty Endorsement v2.4: In consideration of immediate autonomous patching via AutoMitigate, carrier grants an instant 15% rate credit and waives standard 30-day waiting period exclusions for newly identified CVEs."
                      }
                    }, null, 2);
                    navigator.clipboard.writeText(jsonPayload);
                    setCopiedJson(true);
                    setTimeout(() => setCopiedJson(false), 2000);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono flex items-center gap-1.5 border border-slate-700"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copiedJson ? 'Copied to Clipboard' : 'Copy Clean JSON'}</span>
                </button>
                <button
                  onClick={() => setIsJsonModalOpen(false)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs bg-slate-950 text-slate-300">
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-[11px] leading-relaxed text-emerald-300 overflow-x-auto">
{JSON.stringify({
  "remediation_scripts": [
    {
      "language": "terraform",
      "filename": "security_group_tls.tf",
      "description": "Enforces TLS 1.3 minimum protocol version and disables deprecated SSLv3/TLS1.0/TLS1.1 ciphers across CloudFront and Application Load Balancers.",
      "code": "resource \"aws_lb_listener\" \"https_secure\" {\n  load_balancer_arn = aws_lb.production_gateway.arn\n  port              = 443\n  protocol          = \"HTTPS\"\n  ssl_policy        = \"ELBSecurityPolicy-TLS13-1-2-2021-06\"\n  certificate_arn   = aws_acm_certificate.wildcard_cert.arn\n\n  default_action {\n    type             = \"forward\"\n    target_group_arn = aws_lb_target_group.core_api.arn\n  }\n}\n\nresource \"aws_cloudfront_distribution\" \"cdn_secure\" {\n  viewer_certificate {\n    acm_certificate_arn      = aws_acm_certificate.wildcard_cert.arn\n    ssl_support_method       = \"sni-only\"\n    minimum_protocol_version = \"TLSv1.2_2021\"\n  }\n}"
    },
    {
      "language": "nginx",
      "filename": "nginx_ssl_hardening.conf",
      "description": "Production Nginx reverse proxy SSL configuration rejecting legacy handshakes and enforcing HSTS with ECDHE cipher suites.",
      "code": "ssl_protocols TLSv1.2 TLSv1.3;\nssl_prefer_server_ciphers on;\nssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';\nssl_session_timeout 1d;\nssl_session_cache shared:SSL:10m;\nssl_session_tickets off;\n\n# HSTS (HTTP Strict Transport Security) - 1 year with subdomains\nadd_header Strict-Transport-Security \"max-age=31536000; includeSubDomains; preload\" always;\nadd_header X-Frame-Options DENY always;\nadd_header X-Content-Type-Options nosniff always;"
    },
    {
      "language": "json",
      "filename": "aws_iam_enforce_mfa_policy.json",
      "description": "AWS IAM Condition block policy denying all administrative and API access unless authenticated with hardware/FIDO2 MFA token.",
      "code": "{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Sid\": \"AutoMitigateBlockNonMfaAccess\",\n      \"Effect\": \"Deny\",\n      \"NotAction\": [\n        \"iam:CreateVirtualMFADevice\",\n        \"iam:EnableMFADevice\",\n        \"iam:GetUser\",\n        \"iam:ListMFADevices\",\n        \"iam:ResyncMFADevice\",\n        \"sts:GetSessionToken\"\n      ],\n      \"Resource\": \"*\",\n      \"Condition\": {\n        \"BoolIfExists\": {\n          \"aws:MultiFactorAuthPresent\": \"false\"\n        }\n      }\n    }\n  ]\n}"
    }
  ],
  "financial_impact": {
    "pre_remediation": {
      "system_status": "VULNERABLE",
      "cyber_risk_score": 84,
      "annual_loss_expectancy_ale_usd": 1850000,
      "probable_maximum_loss_pml_usd": 7770000,
      "tail_risk_exposure_usd": 12025000
    },
    "post_remediation": {
      "system_status": "REMEDIATED_AUTONOMOUSLY",
      "cyber_risk_score": 36,
      "annual_loss_expectancy_ale_usd": 698000,
      "probable_maximum_loss_pml_usd": 3496500,
      "tail_risk_exposure_usd": 4560000,
      "delta_reduction": {
        "ale_savings_usd": 1152000,
        "ale_reduction_percentage": 62.16,
        "tail_risk_reduction_usd": 7465000,
        "risk_score_improvement": -48
      }
    }
  },
  "new_insurance_terms": {
    "carrier_syndicate": "RiskPulse Syndicate 1892 (Underwritten via AutoMitigate Binding Authority)",
    "policy_status": "ACTIVE_PREFERRED_TERMS",
    "action_applied": "INSTANT_CONTINUOUS_COMPLIANCE_DISCOUNT",
    "adjustment_summary": "Active security patch deployed: Applying an instant 15% compliance discount to monthly insurance premium, reducing deductible by $25,000.",
    "premium_details": {
      "baseline_annual_premium_usd": 95000,
      "applied_discount_percentage": 15,
      "annual_cash_savings_usd": 14250,
      "new_adjusted_annual_premium_usd": 80750,
      "billing_frequency": "Monthly Dynamic Adjustment"
    },
    "retention_and_sublimits": {
      "previous_deductible_usd": 50000,
      "new_deductible_usd": 25000,
      "deductible_reduction_usd": 25000,
      "contingent_bi_sublimit_usd": 5000000,
      "ransomware_coinsurance_waived": true
    },
    "mandatory_endorsement_clause": "AutoMitigate Continuous Cyber Warranty Endorsement v2.4: In consideration of immediate autonomous patching via AutoMitigate, carrier grants an instant 15% rate credit and waives standard 30-day waiting period exclusions for newly identified CVEs."
  }
}, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: 3-MINUTE HACKATHON PITCH SCRIPT ----------------- */}
      {isHackathonPitchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 p-0.5">
                  <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                    <Mic className="w-4 h-4 text-purple-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">RiskPulse AI — 3-Minute Hackathon Pitch Script</h3>
                  <p className="text-xs text-slate-400">Speaker Script with Timing Markers • VC Keynote Delivery</p>
                </div>
              </div>
              <button
                onClick={() => setIsHackathonPitchOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-sm text-slate-300 leading-relaxed font-sans">
              {/* Pitch Delivery Coaching Box */}
              <div className="bg-gradient-to-r from-purple-950/60 via-slate-950 to-indigo-950/40 p-4 rounded-xl border border-purple-800/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30 font-mono">
                    STAGE DIRECTION & TONE
                  </span>
                  <p className="text-xs text-slate-300 mt-1 font-medium">
                    Confident, authoritative, visionary, and financially compelling. Speak with deliberate pacing.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono text-purple-300 font-bold">TOTAL TIME</div>
                  <div className="text-lg font-mono font-black text-white">3:00 MIN</div>
                </div>
              </div>

              {/* SECTION 1: THE HOOK (0:00 - 0:45) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-rose-400 uppercase font-mono">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    [0:00 - 0:45] The Hook: The Trillion-Dollar Cyber Risk Blind Spot
                  </span>
                  <span className="text-[10px] bg-rose-500/10 px-2 py-0.5 rounded">45 SECONDS</span>
                </div>
                <p className="text-sm font-medium text-slate-200 italic leading-relaxed">
                  "Judges, look at the Fortune 500 today. Every enterprise spends millions on twelve different security tools, yet commercial underwriters still evaluate risk using static 80-page questionnaires and 6-month-old PDF audit reports.
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  This creates a massive, trillion-dollar blind spot: the underwriter is pricing policies blind to real-time vulnerabilities, while the insured is treated to generic, punitive annual premiums. An unpatched zero-day in a secondary cloud dependency can cause an unmodeled $20 million business interruption catastrophe overnight. The traditional cyber insurance stack is disconnected from the reality of live code."
                </p>
              </div>

              {/* SECTION 2: THE CORE INNOVATION (0:45 - 2:00) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-900/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-400 uppercase font-mono">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    [0:45 - 2:00] The Core Innovation: Autonomous Risk Quantification & Pricing
                  </span>
                  <span className="text-[10px] bg-cyan-500/10 px-2 py-0.5 rounded">75 SECONDS</span>
                </div>
                <p className="text-sm font-medium text-slate-200 italic leading-relaxed">
                  "Enter RiskPulse AI. We are building the autonomous underwriting intelligence and risk-pricing operating layer for commercial cyber lines.
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  RiskPulse AI continuously ingests raw tech stack logs, live CVE telemetry, upstream vendor dependencies, and SOC 2 audit exceptions. Within seconds, our engine:
                </p>
                <ul className="text-xs text-slate-300 space-y-1.5 pl-4 list-disc marker:text-cyan-400">
                  <li><strong>Cross-references vulnerabilities against global compliance baselines</strong> — ISO 27001, NIST CSF, and statutory fines under DPDP 2025 up to ₹250 Crores.</li>
                  <li><strong>Translates technical debt into exact financial exposure</strong> — separating day-to-day Annual Loss Expectancy (ALE) from Tail Risk (99.5% Value-at-Risk Catastrophe Loss).</li>
                  <li><strong>Closes the loop with autonomous self-healing and dynamic pricing</strong> — our AutoMitigate agent generates production-ready Terraform and IAM configuration patches. When verified, the insured's premium drops instantly by 15% and deductibles are slashed by $25,000.</li>
                </ul>
                <p className="text-xs text-cyan-200 font-medium">
                  We turn cyber insurance from an adversarial static grudge purchase into an automated, continuous resilience feedback loop."
                </p>
              </div>

              {/* SECTION 3: THE BUSINESS IMPACT (2:00 - 3:00) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400 uppercase font-mono">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    [2:00 - 3:00] The Business Impact: Driving Revenue for Mitigata & Partners
                  </span>
                  <span className="text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">60 SECONDS</span>
                </div>
                <p className="text-sm font-medium text-slate-200 italic leading-relaxed">
                  "Why does this create immense enterprise value for ecosystem partners like Mitigata?
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  For platform leaders like Mitigata, RiskPulse AI provides the missing technical bridge between security operations, compliance automation, and actuarial underwriting.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-center">
                    <div className="text-sm font-bold font-mono text-emerald-400">2 Weeks → 45 Sec</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Underwriting Cycle Time</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-center">
                    <div className="text-sm font-bold font-mono text-cyan-400">68% → 24%</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Portfolio Loss Ratio</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-center">
                    <div className="text-sm font-bold font-mono text-purple-400">100% Retained</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Continuous Policy Renewal</div>
                  </div>
                </div>
                <p className="text-xs text-slate-200 font-semibold pt-1">
                  Instead of losing clients to rigid underwriting cycles, Mitigata can quote, bind, and continuously protect policies with mathematical certainty. RiskPulse AI doesn't just price cyber risk — we engineer it out of existence. Thank you."
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <button
                onClick={() => {
                  const pitchScript = `[0:00 - 0:45] THE HOOK: THE TRILLION-DOLLAR CYBER RISK BLIND SPOT\n"Judges, look at the Fortune 500 today. Every enterprise spends millions on twelve different security tools, yet commercial underwriters still evaluate risk using static 80-page questionnaires and 6-month-old PDF audit reports. This creates a massive, trillion-dollar blind spot: the underwriter is pricing policies blind to real-time vulnerabilities, while the insured is treated to generic, punitive annual premiums. An unpatched zero-day in a secondary cloud dependency can cause an unmodeled $20 million business interruption catastrophe overnight. The traditional cyber insurance stack is disconnected from the reality of live code."\n\n[0:45 - 2:00] THE CORE INNOVATION: AUTONOMOUS RISK QUANTIFICATION & PRICING\n"Enter RiskPulse AI. We are building the autonomous underwriting intelligence and risk-pricing operating layer for commercial cyber lines. RiskPulse AI continuously ingests raw tech stack logs, live CVE telemetry, upstream vendor dependencies, and SOC 2 audit exceptions. Within seconds, our engine: (1) Cross-references vulnerabilities against global compliance baselines — ISO 27001, NIST CSF, and statutory fines under DPDP 2025 up to ₹250 Crores; (2) Translates technical debt into exact financial exposure — separating day-to-day Annual Loss Expectancy (ALE) from Tail Risk (99.5% Value-at-Risk Catastrophe Loss); (3) Closes the loop with autonomous self-healing and dynamic pricing — our AutoMitigate agent generates production-ready Terraform and IAM configuration patches. When verified, the insured's premium drops instantly by 15% and deductibles are slashed by $25,000. We turn cyber insurance from an adversarial static grudge purchase into an automated, continuous resilience feedback loop."\n\n[2:00 - 3:00] THE BUSINESS IMPACT: DRIVING REVENUE FOR MITIGATA & PARTNERS\n"Why does this create immense enterprise value for ecosystem partners like Mitigata? For platform leaders like Mitigata, RiskPulse AI provides the missing technical bridge between security operations, compliance automation, and actuarial underwriting. Underwriting turnaround drops from two weeks to 45 seconds. Portfolio loss ratios drop from 68% to 24%. And customer retention reaches near 100% because continuous discounts reward continuous security. RiskPulse AI doesn't just price cyber risk — we engineer it out of existence. Thank you."`;
                  navigator.clipboard.writeText(pitchScript);
                  setCopiedCroJson(true);
                  setTimeout(() => setCopiedCroJson(false), 2000);
                }}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono flex items-center gap-1.5 border border-slate-700"
              >
                {copiedCroJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedCroJson ? 'Script Copied' : 'Copy Pitch Script'}</span>
              </button>

              <button
                onClick={() => setIsHackathonPitchOpen(false)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-xs font-semibold hover:from-purple-500 hover:to-indigo-500"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: CRO STRICT JSON OUTPUT ----------------- */}
      {isCroJsonOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900 sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Enterprise CRO Audit — Strict Valid JSON</h3>
                  <p className="text-xs text-slate-400">Cross-reference: ISO 27001 • NIST CSF • DPDP | ALE & Tail Risk | 30/60-day SLAs</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(croAuditResult, null, 2));
                    setCopiedCroJson(true);
                    setTimeout(() => setCopiedCroJson(false), 2000);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono flex items-center gap-1.5 border border-slate-700"
                >
                  {copiedCroJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copiedCroJson ? 'Copied' : 'Copy Strict JSON'}</span>
                </button>
                <button
                  onClick={() => setIsCroJsonOpen(false)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs bg-slate-950 text-slate-300">
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-[11px] leading-relaxed text-purple-300 overflow-x-auto">
{JSON.stringify(croAuditResult, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
