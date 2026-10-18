import React, { useState } from 'react';
import { Submission } from '../types/underwriting';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';

interface UnderwritingMemoModalProps {
  submission: Submission | null;
  onClose: () => void;
}

export const UnderwritingMemoModal: React.FC<UnderwritingMemoModalProps> = ({
  submission,
  onClose,
}) => {
  if (!submission) return null;

  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `RISKPULSE SYNDICATE 1892 - UNDERWRITING MEMORANDUM
Reference: ${submission.submissionNumber}
Binder ID: ${submission.binderNumber || 'PENDING BIND'}
Date: ${submission.dateSubmitted}
Insured: ${submission.companyName}
Industry / NAICS: ${submission.industry} (NAICS ${submission.naicsCode})
Line of Business: ${submission.lineOfBusiness}
Total Insured Value (TIV): $${submission.tiv.toLocaleString()}
Annual Revenue: $${submission.revenue.toLocaleString()}
Broker: ${submission.brokerName} (${submission.brokerAgency})

RISK PULSE SCORE: ${submission.analysis.pulseScore}/100 (${submission.analysis.riskTier})
Carrier Appetite Fit: ${submission.analysis.appetiteFit}

PRICING & TERMS:
Indicated Annual Premium: $${submission.analysis.recommendedPricing.indicatedAnnualPremium.toLocaleString()}
Debit/Credit Adjustment: ${submission.analysis.recommendedPricing.suggestedDebitCreditPercent}%
Deductible: $${submission.analysis.recommendedPricing.recommendedDeductible.toLocaleString()}
Expected Loss Ratio: ${submission.analysis.recommendedPricing.targetLossRatioExpected}%

EXECUTIVE SUMMARY:
${submission.analysis.executiveSummary}

MANDATORY SUBJECTIVITIES:
${submission.analysis.mandatorySubjectivities.map((s, i) => `${i + 1}. ${s}`).join('\n')}

WARRANTIES & ENDORSEMENTS:
${submission.analysis.warrantiesAndEndorsements.map((w, i) => `${i + 1}. ${w}`).join('\n')}

SIGN-OFF:
Assigned Underwriter: ${submission.assignedUnderwriter}
Status: ${submission.status}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:max-h-none print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Modal Controls (Hidden in print) */}
        <div className="px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Formal Commercial Underwriting Memorandum</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Text' : 'Copy Memo'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Memo Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 text-slate-200 print:text-black print:p-6 print:overflow-visible font-sans bg-slate-900 print:bg-white">
          
          {/* Memo Letterhead */}
          <div className="border-b-2 border-slate-700 print:border-black pb-4 flex items-start justify-between">
            <div>
              <div className="text-xl font-black uppercase tracking-tight text-white print:text-black flex items-center gap-2">
                RiskPulse Syndicate 1892
              </div>
              <div className="text-xs text-slate-400 print:text-gray-600">
                Commercial Lines Underwriting & Risk Engineering Memorandum
              </div>
            </div>
            <div className="text-right text-xs font-mono">
              <div className="font-bold text-cyan-400 print:text-black">
                REF: {submission.submissionNumber}
              </div>
              <div className="text-slate-400 print:text-gray-600">
                BINDER: {submission.binderNumber || 'PENDING BIND'}
              </div>
              <div className="text-slate-500 print:text-gray-500">
                Date: {submission.dateSubmitted}
              </div>
            </div>
          </div>

          {/* Account Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-slate-950/60 print:bg-gray-100 p-4 rounded-xl border border-slate-800 print:border-gray-300">
            <div>
              <span className="text-slate-400 print:text-gray-600 block text-[10px] uppercase font-semibold">Named Insured</span>
              <strong className="text-white print:text-black text-sm">{submission.companyName}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-600 block text-[10px] uppercase font-semibold">Line of Business</span>
              <strong className="text-white print:text-black">{submission.lineOfBusiness}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-600 block text-[10px] uppercase font-semibold">Industry & NAICS</span>
              <span className="text-slate-200 print:text-gray-800">{submission.industry} ({submission.naicsCode})</span>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-600 block text-[10px] uppercase font-semibold">Total Insured Value (TIV)</span>
              <strong className="font-mono text-cyan-400 print:text-black">${submission.tiv.toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-600 block text-[10px] uppercase font-semibold">Broker Agency</span>
              <span className="text-slate-200 print:text-gray-800">{submission.brokerAgency} ({submission.brokerName})</span>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-600 block text-[10px] uppercase font-semibold">Risk Pulse Composite</span>
              <strong className="font-mono text-emerald-400 print:text-black">
                {submission.analysis.pulseScore}/100 ({submission.analysis.riskTier.split(' - ')[1] || submission.analysis.riskTier})
              </strong>
            </div>
          </div>

          {/* Executive Underwriting Synthesis */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-400 print:text-gray-700 uppercase tracking-wider">
              1. Executive Underwriting Synthesis
            </h3>
            <p className="text-xs text-slate-300 print:text-gray-800 leading-relaxed bg-slate-950/40 print:bg-white p-3 rounded-lg border border-slate-800/60 print:border-none">
              {submission.analysis.executiveSummary}
            </p>
          </div>

          {/* Pricing & Rating Breakdown */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 print:text-gray-700 uppercase tracking-wider">
              2. Actuarial Rating & Indicated Terms
            </h3>
            <table className="w-full text-xs text-left border border-slate-800 print:border-gray-300">
              <thead className="bg-slate-950 print:bg-gray-200 text-slate-400 print:text-gray-800 font-semibold">
                <tr>
                  <th className="p-2 border-b border-slate-800 print:border-gray-300">Rating Component</th>
                  <th className="p-2 border-b border-slate-800 print:border-gray-300">Actuarial Factor</th>
                  <th className="p-2 border-b border-slate-800 print:border-gray-300 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-gray-300 font-mono">
                <tr>
                  <td className="p-2">Blanket Policy Limits</td>
                  <td className="p-2 font-sans">{submission.requestedLimits}</td>
                  <td className="p-2 text-right">${submission.tiv.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="p-2">Underwriter Schedule Modifier</td>
                  <td className="p-2 font-sans">Experience Debit/Credit Factor</td>
                  <td className="p-2 text-right">{submission.analysis.recommendedPricing.suggestedDebitCreditPercent}%</td>
                </tr>
                <tr>
                  <td className="p-2">Standard Property Deductible</td>
                  <td className="p-2 font-sans">All Other Perils Retention</td>
                  <td className="p-2 text-right">${submission.analysis.recommendedPricing.recommendedDeductible.toLocaleString()}</td>
                </tr>
                <tr className="bg-slate-950/60 print:bg-gray-100 font-bold">
                  <td className="p-2 font-sans">Final Indicated Annual Premium</td>
                  <td className="p-2 font-sans">Subject to treaty reinsurance terms</td>
                  <td className="p-2 text-right text-emerald-400 print:text-black text-sm">
                    ${submission.analysis.recommendedPricing.indicatedAnnualPremium.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mandatory Subjectivities */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-400 print:text-gray-700 uppercase tracking-wider">
              3. Mandatory Binding Subjectivities
            </h3>
            <ul className="list-decimal pl-5 text-xs text-slate-300 print:text-gray-800 space-y-1">
              {submission.analysis.mandatorySubjectivities.map((subj, idx) => (
                <li key={idx} className="leading-relaxed">{subj}</li>
              ))}
            </ul>
          </div>

          {/* Warranties & Endorsements */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-400 print:text-gray-700 uppercase tracking-wider">
              4. Warranties & Mandatory Policy Endorsements
            </h3>
            <ul className="list-disc pl-5 text-xs text-slate-300 print:text-gray-800 space-y-1">
              {submission.analysis.warrantiesAndEndorsements.map((warr, idx) => (
                <li key={idx} className="leading-relaxed">{warr}</li>
              ))}
            </ul>
          </div>

          {/* Signatures & Execution Block */}
          <div className="border-t border-slate-800 print:border-black pt-4 grid grid-cols-2 gap-8 text-xs">
            <div>
              <span className="text-slate-400 print:text-gray-600 block text-[10px] uppercase">Underwriting Officer</span>
              <strong className="text-white print:text-black block text-sm mt-1">{submission.assignedUnderwriter}</strong>
              <span className="text-slate-500 print:text-gray-600 text-[11px]">Commercial Lines Binding Authority</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 print:text-gray-600 block text-[10px] uppercase">Action Verdict & Timestamp</span>
              <strong className="text-emerald-400 print:text-black block text-sm mt-1">
                {submission.status}
              </strong>
              <span className="text-slate-500 print:text-gray-600 text-[11px] font-mono">
                Digitally Sealed • RiskPulse AI Audit Trail
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
