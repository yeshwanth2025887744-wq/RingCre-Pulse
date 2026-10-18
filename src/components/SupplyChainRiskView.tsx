import React, { useState } from 'react';
import { 
  Submission, 
  VendorDependency, 
  CascadeBreachScenario, 
  VendorCategory, 
  VendorSecurityRating 
} from '../types/underwriting';
import { defaultVendorEcosystem, defaultCascadeScenarios } from '../data/mockVendors';
import { 
  Network, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw, 
  Cloud, 
  CreditCard, 
  Key, 
  Users, 
  Truck, 
  Database, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign, 
  Layers, 
  ChevronRight, 
  FileCheck, 
  Sliders, 
  Building2, 
  Search, 
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Send
} from 'lucide-react';

interface SupplyChainRiskViewProps {
  submissions: Submission[];
  selectedSubmission: Submission | null;
  onSelectSubmission: (sub: Submission | null) => void;
  onOpenCopilotWithContext: (sub: Submission | null, prompt?: string) => void;
}

export const SupplyChainRiskView: React.FC<SupplyChainRiskViewProps> = ({
  submissions,
  selectedSubmission,
  onSelectSubmission,
  onOpenCopilotWithContext,
}) => {
  const [vendors, setVendors] = useState<VendorDependency[]>(defaultVendorEcosystem);
  const [cascadeScenarios, setCascadeScenarios] = useState<CascadeBreachScenario[]>(defaultCascadeScenarios);
  const [selectedScenario, setSelectedScenario] = useState<CascadeBreachScenario>(defaultCascadeScenarios[0]);
  
  // Active tab inside Supply Chain
  const [supplyTab, setSupplyTab] = useState<'map' | 'cascade' | 'compliance'>('map');

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedApproval, setSelectedApproval] = useState<string>('ALL');

  // Auditing loading state
  const [auditingVendorId, setAuditingVendorId] = useState<string | null>(null);
  const [isSimulatingCascade, setIsSimulatingCascade] = useState(false);
  const [activeVendorDetail, setActiveVendorDetail] = useState<VendorDependency | null>(null);

  // Cascade simulation inputs
  const [customTargetVendor, setCustomTargetVendor] = useState(defaultVendorEcosystem[0].name);
  const [customAttackVector, setCustomAttackVector] = useState('Cloud Infrastructure Outage / BGP Hijack');

  // Filtered vendors
  const filteredVendors = vendors.filter((v) => {
    const matchesSearch = 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.serviceProvided.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.fourthPartyDependencies.some((fp) => fp.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || v.category === selectedCategory;
    const matchesApproval = selectedApproval === 'ALL' || v.underwriterApproval === selectedApproval;
    return matchesSearch && matchesCategory && matchesApproval;
  });

  // Calculate statistics
  const avgVendorScore = Math.round(vendors.reduce((acc, curr) => acc + curr.riskScore, 0) / vendors.length);
  const verifiedComplianceCount = vendors.filter(
    (v) => v.compliance.iso27001Status === 'VERIFIED' && v.compliance.soc2Type2Status === 'VERIFIED'
  ).length;
  const criticalTier1Count = vendors.filter((v) => v.blastRadiusTier.includes('Tier 1')).length;
  const highestLossScenario = cascadeScenarios.reduce((max, s) => s.totalCascadeExposure > max.totalCascadeExposure ? s : max, cascadeScenarios[0]);

  // Icon selector
  const getCategoryIcon = (cat: VendorCategory) => {
    switch (cat) {
      case 'Cloud Infrastructure': return <Cloud className="w-4 h-4 text-cyan-400" />;
      case 'Payment Gateway & Processing': return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case 'Identity Provider (IdP)': return <Key className="w-4 h-4 text-amber-400" />;
      case 'HR & Payroll SaaS': return <Users className="w-4 h-4 text-blue-400" />;
      case 'Logistics & Fleet Telematics': return <Truck className="w-4 h-4 text-orange-400" />;
      case 'API & Data Partner': return <Database className="w-4 h-4 text-purple-400" />;
      default: return <Cpu className="w-4 h-4 text-slate-400" />;
    }
  };

  const getRatingBadge = (rating: VendorSecurityRating) => {
    if (rating.startsWith('A')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (rating.startsWith('B')) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    if (rating.startsWith('C')) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  };

  const getComplianceStatusBadge = (status: 'VERIFIED' | 'EXPIRED' | 'MISSING' | 'IN_PROGRESS' | 'N/A') => {
    switch (status) {
      case 'VERIFIED':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded"><CheckCircle2 className="w-3 h-3" /> Verified</span>;
      case 'EXPIRED':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded"><Clock className="w-3 h-3" /> Expired</span>;
      case 'MISSING':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded"><XCircle className="w-3 h-3" /> Missing</span>;
      case 'IN_PROGRESS':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded"><RefreshCw className="w-3 h-3 animate-spin" /> In Audit</span>;
      default:
        return <span className="text-[11px] text-slate-500">N/A</span>;
    }
  };

  // Trigger Gemini Deep Dependency Auto-Audit
  const handleAutoAuditVendor = async (vendor: VendorDependency) => {
    setAuditingVendorId(vendor.id);
    try {
      const res = await fetch('/api/vendor-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorName: vendor.name,
          category: vendor.category,
          serviceProvided: vendor.serviceProvided,
          currentRiskScore: vendor.riskScore,
          compliance: vendor.compliance,
        }),
      });

      const data = await res.json();
      if (data && data.audit) {
        const audit = data.audit;
        const updatedVendors = vendors.map((v) => {
          if (v.id === vendor.id) {
            return {
              ...v,
              riskScore: audit.updatedRiskScore || v.riskScore,
              securityRating: audit.securityRating || v.securityRating,
              fourthPartyDependencies: audit.fourthPartyDependencies || v.fourthPartyDependencies,
              recentAuditFindings: audit.auditFindings || v.recentAuditFindings,
              underwriterApproval: audit.underwriterAdvisory || v.underwriterApproval,
              compliance: {
                ...v.compliance,
                ...audit.complianceAudit,
              },
            };
          }
          return v;
        });
        setVendors(updatedVendors);
        if (activeVendorDetail?.id === vendor.id) {
          const refreshed = updatedVendors.find((v) => v.id === vendor.id);
          if (refreshed) setActiveVendorDetail(refreshed);
        }
      }
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setAuditingVendorId(null);
    }
  };

  // Run Gemini Cascade Simulation
  const handleRunCascadeSimulation = async () => {
    setIsSimulatingCascade(true);
    try {
      const clientRev = selectedSubmission ? selectedSubmission.revenue : 45000000;
      const clientTiv = selectedSubmission ? selectedSubmission.tiv : 30000000;
      const clientLine = selectedSubmission ? selectedSubmission.lineOfBusiness : 'Cyber & Tech E&O';

      const res = await fetch('/api/cascade-simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetVendor: customTargetVendor,
          attackVector: customAttackVector,
          clientRevenue: clientRev,
          clientTIV: clientTiv,
          lineOfBusiness: clientLine,
        }),
      });

      const data = await res.json();
      if (data && data.scenario) {
        const newScenario: CascadeBreachScenario = {
          id: `cas-${Date.now()}`,
          ...data.scenario,
          targetVendor: customTargetVendor,
          attackVector: customAttackVector,
        };
        setCascadeScenarios([newScenario, ...cascadeScenarios]);
        setSelectedScenario(newScenario);
      }
    } catch (err) {
      console.error('Cascade error:', err);
    } finally {
      setIsSimulatingCascade(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Account Switcher */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs mb-1">
            <Network className="w-4 h-4" />
            VENDOR SUPPLY CHAIN RISK & 4TH-PARTY CONCENTRATION
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            Third-Party Cyber Supply Chain Auditing
            <span className="text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">
              ISO 27001 / SOC 2 Gate
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate external vendor risk ratings, 4th-party cascade blast radiuses, and automated compliance pre-bind verification.
          </p>
        </div>

        {/* Insured Account Selector */}
        <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Audited Insured:</span>
          </div>
          <select
            value={selectedSubmission?.id || ''}
            onChange={(e) => {
              const sub = submissions.find((s) => s.id === e.target.value) || null;
              onSelectSubmission(sub);
            }}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-cyan-500 font-medium"
          >
            <option value="">All Accounts (Global Portfolio)</option>
            {submissions.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.companyName} (${(sub.tiv / 1000000).toFixed(0)}M TIV)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>CONNECTED 3RD-PARTY VENDORS</span>
            <Network className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{vendors.length}</span>
            <span className="text-xs text-slate-400">Critical Services</span>
          </div>
          <div className="text-[11px] text-cyan-400 mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{criticalTier1Count} Mission-Critical Tier 1</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>AVG VENDOR SECURITY PULSE</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">{avgVendorScore}</span>
            <span className="text-xs text-slate-400">/ 100 Rating</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full" 
              style={{ width: `${avgVendorScore}%` }}
            />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>COMPLIANCE GATE STATUS</span>
            <FileCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-blue-400">{verifiedComplianceCount} of {vendors.length}</span>
            <span className="text-xs text-slate-400">Verified</span>
          </div>
          <div className="text-[11px] text-amber-400 mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{vendors.length - verifiedComplianceCount} Require Subjectivity Warranty</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>MAX CASCADE BREACH EXPOSURE</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-400">
              ${(highestLossScenario.totalCascadeExposure / 1000000).toFixed(2)}M
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 truncate">
            Peak: {highestLossScenario.targetVendor}
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="bg-slate-900/90 rounded-xl p-1.5 border border-slate-800 flex items-center gap-1 text-xs font-semibold">
        <button
          onClick={() => setSupplyTab('map')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
            supplyTab === 'map'
              ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Network className="w-4 h-4 text-cyan-400" />
          <span>1. Third-Party Ecosystem Map</span>
        </button>

        <button
          onClick={() => setSupplyTab('cascade')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
            supplyTab === 'cascade'
              ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>2. Cascade Risk & Shared Exposure Calculator</span>
        </button>

        <button
          onClick={() => setSupplyTab('compliance')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
            supplyTab === 'compliance'
              ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span>3. Vendor Compliance Verifier (ISO / SOC 2)</span>
        </button>
      </div>

      {/* ----------------- SECTION 1: THIRD-PARTY ECOSYSTEM MAP ----------------- */}
      {supplyTab === 'map' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendors by name, service, or 4th-party sub-processor..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Vendor Categories</option>
                <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                <option value="Payment Gateway & Processing">Payment Gateway</option>
                <option value="Identity Provider (IdP)">Identity Provider</option>
                <option value="HR & Payroll SaaS">HR & Payroll</option>
                <option value="Logistics & Fleet Telematics">Logistics & Telematics</option>
                <option value="API & Data Partner">API & Data Partner</option>
                <option value="Core ERP / CRM System">Core ERP / CRM</option>
              </select>

              <select
                value={selectedApproval}
                onChange={(e) => setSelectedApproval(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Underwriter Approvals</option>
                <option value="APPROVED">Approved</option>
                <option value="CONDITIONAL_WARRANTY">Conditional Warranty</option>
                <option value="ACTION_REQUIRED">Action Required</option>
                <option value="FLAGGED">Flagged Red</option>
              </select>
            </div>
          </div>

          {/* Vendors Ecosystem Table */}
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Vendor & Criticality</th>
                    <th className="py-3 px-4">Category & Role</th>
                    <th className="py-3 px-4">Security Rating</th>
                    <th className="py-3 px-4">Data Access Level</th>
                    <th className="py-3 px-4">Blast Radius Tier</th>
                    <th className="py-3 px-4">4th-Party Dependencies</th>
                    <th className="py-3 px-4">Underwriting Approval</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs">
                  {filteredVendors.map((vendor) => {
                    const isAuditing = auditingVendorId === vendor.id;
                    return (
                      <tr 
                        key={vendor.id}
                        className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                        onClick={() => setActiveVendorDetail(vendor)}
                      >
                        {/* Name & Criticality */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                            {vendor.name}
                          </div>
                          <div className="mt-1">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              vendor.criticality === 'Mission Critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                              vendor.criticality === 'High' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                              'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}>
                              {vendor.criticality}
                            </span>
                          </div>
                        </td>

                        {/* Category & Service */}
                        <td className="py-3.5 px-4 max-w-[200px]">
                          <div className="flex items-center gap-1.5 font-medium text-slate-200">
                            {getCategoryIcon(vendor.category)}
                            <span className="truncate">{vendor.category}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">
                            {vendor.serviceProvided}
                          </div>
                        </td>

                        {/* Security Rating */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs border ${getRatingBadge(vendor.securityRating)}`}>
                              {vendor.securityRating}
                            </span>
                            <span className="font-mono text-slate-400 text-xs font-semibold">
                              {vendor.riskScore}/100
                            </span>
                          </div>
                        </td>

                        {/* Data Access Level */}
                        <td className="py-3.5 px-4 font-mono text-[11px]">
                          <span className={`${
                            vendor.dataAccessLevel.includes('PII') ? 'text-rose-300 font-semibold' : 'text-slate-300'
                          }`}>
                            {vendor.dataAccessLevel}
                          </span>
                        </td>

                        {/* Blast Radius Tier */}
                        <td className="py-3.5 px-4">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                            vendor.blastRadiusTier.includes('Tier 1') ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                            vendor.blastRadiusTier.includes('Tier 2') ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {vendor.blastRadiusTier.split(' - ')[0]}
                          </span>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {vendor.blastRadiusTier.split(' - ')[1]}
                          </div>
                        </td>

                        {/* 4th-Party Dependencies */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {vendor.fourthPartyDependencies.map((fp, i) => (
                              <span key={i} className="text-[10px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400 font-mono">
                                {fp}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Underwriter Approval */}
                        <td className="py-3.5 px-4">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono ${
                            vendor.underwriterApproval === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                            vendor.underwriterApproval === 'CONDITIONAL_WARRANTY' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
                            vendor.underwriterApproval === 'ACTION_REQUIRED' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                            'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}>
                            {vendor.underwriterApproval.replace(/_/g, ' ')}
                          </span>
                        </td>

                        {/* Actions: Auto-Audit Button */}
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleAutoAuditVendor(vendor)}
                            disabled={isAuditing}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600/80 to-teal-600/80 hover:from-cyan-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                            title="Run simulated deep dependency scan via Gemini 3.8 Flash"
                          >
                            <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isAuditing ? 'animate-spin' : ''}`} />
                            <span>{isAuditing ? 'Auditing...' : 'Auto-Audit'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SECTION 2: CASCADE RISK & SHARED EXPOSURE CALCULATOR ----------------- */}
      {supplyTab === 'cascade' && (
        <div className="space-y-6">
          {/* Simulator Controls Bar */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  4th-Party Cascade Breach & Downtime Loss Simulator
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Simulate how an upstream disruption or zero-day compromise in a critical vendor cascades through the supply chain into primary enterprise losses.
                </p>
              </div>

              <button
                onClick={handleRunCascadeSimulation}
                disabled={isSimulatingCascade}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-amber-950 transition-all hover:scale-[1.02]"
              >
                <Sparkles className={`w-4 h-4 text-amber-200 ${isSimulatingCascade ? 'animate-spin' : ''}`} />
                <span>{isSimulatingCascade ? 'Calculating Cascade...' : 'Simulate Cascade Breach'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target Upstream Vendor</label>
                <select
                  value={customTargetVendor}
                  onChange={(e) => setCustomTargetVendor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.name}>{v.name} ({v.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Compromise Scenario / Attack Vector</label>
                <select
                  value={customAttackVector}
                  onChange={(e) => setCustomAttackVector(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Cloud Infrastructure Outage / BGP Hijack">Cloud Infrastructure Outage / BGP Hijack</option>
                  <option value="Ransomware Software Supply-Chain Build Injection">Ransomware Software Supply-Chain Build Injection</option>
                  <option value="Stolen Third-Party API Master Token Exfiltration">Stolen Third-Party API Master Token Exfiltration</option>
                  <option value="Zero-Day Remote Code Execution in 4th-Party Dependency">Zero-Day Remote Code Execution in 4th-Party Dependency</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cascade Scenario Deep Dive */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left: Financial Impact Summary */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Simulated Scenario
                </span>
                <h4 className="text-sm font-bold text-white mt-1 leading-snug">
                  {selectedScenario.title}
                </h4>
                <div className="text-xs text-slate-400 mt-1">
                  Target: <strong className="text-slate-200">{selectedScenario.targetVendor}</strong>
                </div>
              </div>

              {/* Total Loss Hero */}
              <div className="bg-slate-950 p-4 rounded-xl border border-rose-900/40 text-center">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Total Insured Cascade Exposure
                </div>
                <div className="text-3xl font-black font-mono text-rose-400 mt-1">
                  ${selectedScenario.totalCascadeExposure.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{selectedScenario.businessInterruptionHours} Hours Production Downtime</span>
                </div>
              </div>

              {/* Loss Breakdown Table */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Direct Incident & Forensic Response:</span>
                  <span className="font-mono font-bold text-slate-200">${selectedScenario.directFinancialLoss.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Contingent Business Interruption (CBI):</span>
                  <span className="font-mono font-bold text-amber-400">${selectedScenario.contingentLossOfAttraction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Regulatory Penalties (SEC/GDPR):</span>
                  <span className="font-mono font-bold text-slate-200">${selectedScenario.regulatoryFinesEstimated.toLocaleString()}</span>
                </div>
              </div>

              {/* Underwriter Guidance */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
                <strong className="text-cyan-400 block font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Underwriter Policy Terms Advisory
                </strong>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {selectedScenario.carrierPolicyImpact}
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex justify-between font-mono text-[11px]">
                  <span className="text-slate-400">Recommended CBI Sublimit:</span>
                  <span className="text-emerald-400 font-bold">${selectedScenario.recommendedSublimit.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Right: Multi-Hop Supply Chain Propagation Chain */}
            <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Network className="w-4 h-4 text-cyan-400" />
                  Multi-Hop Supply Chain Breach Propagation Chain
                </h4>
                <span className="text-xs text-slate-400">3-Stage Hop Analysis</span>
              </div>

              <div className="space-y-4">
                {selectedScenario.propagationSteps.map((step) => (
                  <div key={step.step} className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">
                          {step.step}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{step.entity}</div>
                          <div className="text-[11px] font-mono text-slate-500">{step.impactDuration}</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {step.lossMagnitude}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-2.5 leading-relaxed pl-9">
                      {step.event}
                    </p>
                  </div>
                ))}
              </div>

              {/* Action Banner */}
              <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded-xl flex items-center justify-between text-xs">
                <span className="text-cyan-200">
                  Need to attach a Contingent Business Interruption (CBI) endorsement to this account?
                </span>
                <button
                  onClick={() => onOpenCopilotWithContext(selectedSubmission, `Draft an underwriter endorsement clause for ${selectedScenario.targetVendor} supply-chain cascade risk.`)}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold transition-colors flex items-center gap-1 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Draft Endorsement in Copilot</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SECTION 3: VENDOR COMPLIANCE VERIFIER ----------------- */}
      {supplyTab === 'compliance' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                Pre-Bind Vendor Compliance Verifier (ISO 27001 & SOC 2 Type II)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Carrier guidelines prohibit binding master policies if Tier 1 mission-critical vendors have missing or expired certifications.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                {verifiedComplianceCount} Passed Verification
              </span>
              <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/30 font-semibold">
                {vendors.length - verifiedComplianceCount} Underwriter Exceptions
              </span>
            </div>
          </div>

          {/* Compliance Verifier Table */}
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Vendor & Class</th>
                    <th className="py-3 px-4">ISO 27001</th>
                    <th className="py-3 px-4">SOC 2 Type II</th>
                    <th className="py-3 px-4">PCI-DSS</th>
                    <th className="py-3 px-4">Auditor Firm</th>
                    <th className="py-3 px-4">Certificate Expiry</th>
                    <th className="py-3 px-4">Binding Decision</th>
                    <th className="py-3 px-4 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs">
                  {vendors.map((v) => {
                    const isAllValid = v.compliance.iso27001Status === 'VERIFIED' && v.compliance.soc2Type2Status === 'VERIFIED';
                    return (
                      <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{v.name}</div>
                          <div className="text-[11px] text-slate-400">{v.category}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          {getComplianceStatusBadge(v.compliance.iso27001Status)}
                        </td>

                        <td className="py-3.5 px-4">
                          {getComplianceStatusBadge(v.compliance.soc2Type2Status)}
                        </td>

                        <td className="py-3.5 px-4">
                          {getComplianceStatusBadge(v.compliance.pciDssStatus)}
                        </td>

                        <td className="py-3.5 px-4 text-slate-300 font-medium">
                          {v.compliance.auditorFirm}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px]">
                          <span className={v.compliance.certificateExpiry.includes('2025') ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
                            {v.compliance.certificateExpiry}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {isAllValid ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                              <CheckCircle2 className="w-3 h-3" /> Eligible to Bind
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                              <AlertTriangle className="w-3 h-3" /> Subjectivity Required
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleAutoAuditVendor(v)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-xs font-medium border border-slate-700 transition-colors"
                          >
                            Re-Verify
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal for Selected Vendor */}
      {activeVendorDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{activeVendorDetail.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded border ${getRatingBadge(activeVendorDetail.securityRating)}`}>
                    {activeVendorDetail.securityRating}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activeVendorDetail.category} • {activeVendorDetail.serviceProvided}
                </p>
              </div>

              <button
                onClick={() => setActiveVendorDetail(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Findings */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Forensic Audit Observations & Dependencies
              </h4>
              <div className="space-y-1.5">
                {activeVendorDetail.recentAuditFindings.map((finding, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    • {finding}
                  </div>
                ))}
              </div>
            </div>

            {/* 4th-Party Dependencies */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
              <strong className="text-slate-400 block uppercase text-[10px]">Upstream 4th-Party Sub-Processors</strong>
              <div className="flex flex-wrap gap-1.5">
                {activeVendorDetail.fourthPartyDependencies.map((fp, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-cyan-300 rounded text-xs font-mono">
                    {fp}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setActiveVendorDetail(null)}
                className="px-4 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleAutoAuditVendor(activeVendorDetail);
                }}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Run Deep Scan Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
