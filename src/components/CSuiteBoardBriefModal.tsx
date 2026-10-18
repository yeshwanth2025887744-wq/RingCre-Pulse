import React, { useState } from 'react';
import { 
  Building2, 
  X, 
  Printer, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Scale,
  Copy,
  Check,
  ArrowRight
} from 'lucide-react';
import { Submission } from '../types/underwriting';

interface CSuiteBoardBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission | null;
}

export const CSuiteBoardBriefModal: React.FC<CSuiteBoardBriefModalProps> = ({
  isOpen,
  onClose,
  submission
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const companyName = submission?.companyName || 'Apex Global Financial Technologies';
  const industry = submission?.industry || 'FinTech & Banking Infrastructure';
  const tiv = submission?.tiv || 40000000;
  const revenue = submission?.revenue || 65000000;
  const pulseScore = submission?.analysis.pulseScore || 68;

  const inrRate = 83.33;
  const revCrores = ((revenue * inrRate) / 10000000).toFixed(2);
  const tivCrores = ((tiv * inrRate) / 10000000).toFixed(2);

  const aleUsd = 3200000;
  const aleInrCrores = 26.67;
  const tailRiskUsd = 12800000;
  const tailRiskInrCrores = 106.67;

  const mitigatedAleUsd = 1120000;
  const mitigatedAleInrCrores = 9.33;
  const netCapitalProtectedCrores = (aleInrCrores - mitigatedAleInrCrores).toFixed(2);

  const handlePrint = () => {
    window.print();
  };

  const copyBriefText = () => {
    const text = `C-SUITE & BOARD EXECUTIVE CYBER RISK BRIEF\nTarget: ${companyName}\nPrepared For: Board of Directors & Audit Committee\n\nEXECUTIVE VERDICT:\nCyber risk is now a material balance-sheet exposure. Mitigata single-stack consolidation protects ₹17.34 Crores in enterprise value with an 8.2x Net ROI.\n\nFINANCIAL EXPOSURE MATRIX:\n- Annual Loss Expectancy: $3.20M / ₹26.67 Cr\n- Catastrophic Tail Risk (99.5% VaR): $12.80M / ₹106.67 Cr\n- Post-Consolidation Exposure: $1.12M / ₹9.33 Cr\n- Capital Protected: $2.08M / ₹17.34 Cr\n\nRECOMMENDED RESOLUTION:\nManagement is authorized to consolidate onto RiskPulse AI and bind terms with Syndicate 1892.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[92vh] flex flex-col text-slate-100">
        
        {/* Document Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 via-teal-500/20 to-emerald-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Board Deliberation Confidential
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Ref: BRIEF-BOARD-2026-X9
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-0.5">
                C-Suite & Board Executive Brief
              </h2>
              <p className="text-xs text-slate-400">
                Prepared for the Board of Directors & Audit Committee of <strong>{companyName}</strong> ({industry})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyBriefText}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Copy Brief Text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Print Executive Memo"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Boardroom Headline Callout */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-cyan-500/30 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Executive Verdict for Corporate Governance</span>
          </div>
          <p className="text-sm font-semibold text-white leading-relaxed">
            "Cyber risk is no longer a technical IT nuance; it is a material balance-sheet exposure with direct Rupee and Dollar cash implications. Fragmented tooling currently creates a <strong>4-week underwriting blind spot</strong>. By unifying monitoring, compliance, and insurance, the enterprise preserves <strong>₹17.34 Crores ($2.08M) in enterprise value</strong>."
          </p>
        </div>

        {/* Balance Sheet Exposure Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Annual Loss Expectancy (ALE)
            </span>
            <div className="text-2xl font-black text-rose-400">
              ₹{aleInrCrores} Cr <span className="text-xs text-slate-400 font-normal">($3.20M USD)</span>
            </div>
            <span className="text-[11px] text-slate-500 block">
              Expected annual cash drain across breaches, fines & downtime
            </span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-purple-500/30 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Tail Risk Shock (99.5% PML)
            </span>
            <div className="text-2xl font-black text-purple-300">
              ₹{tailRiskInrCrores} Cr <span className="text-xs text-slate-400 font-normal">($12.8M USD)</span>
            </div>
            <span className="text-[11px] text-slate-500 block">
              1-in-200 Year Catastrophic event threatening solvency
            </span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Capital Protected via Single-Stack
            </span>
            <div className="text-2xl font-black text-emerald-400">
              ₹{netCapitalProtectedCrores} Cr <span className="text-xs text-slate-400 font-normal">(-65% ALE)</span>
            </div>
            <span className="text-[11px] text-emerald-300 block font-mono">
              Net 5-Year Enterprise ROI: 8.2x
            </span>
          </div>
        </div>

        {/* Translation Table: Technical Vulnerabilities to Boardroom Business Terms */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Translation: Technical Vulnerabilities & Compliance Failures $\rightarrow$ Boardroom Impact
          </h3>

          <div className="space-y-2.5">
            {/* Row 1 */}
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  CVE-2024-3094, Exposed MongoDB Port 27017 & Root IAM Token Leak
                </span>
                <span className="text-xs font-mono font-bold text-white bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                  Cash Impact: ₹15.41 Crores ($1.85M)
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Business Translation:</strong> Attackers can impersonate cloud administrators to exfiltrate customer databases and halt live transaction pipelines. This triggers immediate legal retainers, forensic investigations, and mandatory public incident disclosure.
              </p>
              <div className="text-[11px] text-cyan-400 font-medium">
                $\rightarrow$ <strong>Boardroom Action:</strong> Approve automated infrastructure patch pipeline; authorize emergency credential rotation.
              </div>
            </div>

            {/* Row 2 */}
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  DPDP 2025 Section 8(5) & SEBI CSCRF Domain 9.3 Gaps
                </span>
                <span className="text-xs font-mono font-bold text-white bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                  Statutory Exposure: Up to ₹250 Crores
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Business Translation:</strong> Storing unencrypted customer personal data violates statutory data protection laws, creating corporate fines up to ₹250 Crores and personal liability show-cause notices for directors and audit committee members.
              </p>
              <div className="text-[11px] text-cyan-400 font-medium">
                $\rightarrow$ <strong>Boardroom Action:</strong> Mandate continuous automated encryption verification to establish statutory Safe Harbor.
              </div>
            </div>

            {/* Row 3 */}
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  Fragmented Multi-Vendor Stack & 4-Week Broker Delays
                </span>
                <span className="text-xs font-mono font-bold text-white bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                  Operational Waste: ₹1.54 Crores / year
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Business Translation:</strong> The enterprise pays for 5 disconnected security software licenses while spending 460 engineering hours per year filling out manual insurance spreadsheets—resulting in delayed policy renewals and unpriced exposures.
              </p>
              <div className="text-[11px] text-cyan-400 font-medium">
                $\rightarrow$ <strong>Boardroom Action:</strong> Consolidate onto RiskPulse unified operating stack to capture 18% insurance premium discounts.
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Board Resolution */}
        <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/40 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Recommended Board Resolution (Draft for Minute Book)</span>
          </div>
          <p className="text-xs text-slate-300 italic font-mono leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            "RESOLVED THAT, having reviewed the executive cyber risk evaluation, management is hereby authorized to consolidate fragmented security tooling onto the RiskPulse AI operating layer, implement automated DPDP compliance verification, and execute bindable cyber insurance terms under Syndicate 1892, achieving a projected 8.2x Net ROI within 44 days."
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-800 text-xs">
          <span className="text-slate-400">
            RiskPulse Syndicate 1892 • Mitigata Enterprise Partner Stack
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl"
          >
            Close Executive Brief
          </button>
        </div>
      </div>
    </div>
  );
};
