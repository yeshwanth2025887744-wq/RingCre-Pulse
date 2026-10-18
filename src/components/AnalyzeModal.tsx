import React, { useState } from 'react';
import { 
  Submission, 
  LineOfBusiness 
} from '../types/underwriting';
import { 
  Sparkles, 
  X, 
  FileText, 
  Upload, 
  Building2, 
  ShieldAlert, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Copy, 
  Layers,
  Wand2
} from 'lucide-react';

interface AnalyzeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmissionCreated: (newSub: Submission) => void;
}

export const AnalyzeModal: React.FC<AnalyzeModalProps> = ({
  isOpen,
  onClose,
  onSubmissionCreated,
}) => {
  if (!isOpen) return null;

  // Preset accounts
  const presets = [
    {
      label: '🚀 BioTech Labs (Preferred)',
      data: {
        companyName: 'Apex Genomic Therapies Inc',
        industry: 'Biotechnology & Genetic R&D',
        naicsCode: '541714',
        lineOfBusiness: 'Commercial Package' as LineOfBusiness,
        tiv: 38000000,
        revenue: 45000000,
        employees: 110,
        yearsInBusiness: 7,
        locations: 'Cambridge, MA R&D Lab Campus',
        locationZone: 'Northeast Low-Peril Zone',
        lossHistoryText: '5-year clean loss record. 0 claims incurred.',
        protections: '100% Wet Sprinklers, FM-200 Clean Agent in cold rooms, 24/7 central alarm, dual backup generators with 72hr diesel contract.',
        cyberPosture: 'SOC 2 Type II, Universal MFA, immutable cloud backups, zero trust endpoint architecture.',
        requestedLimits: '$35,000,000 Blanket Property / $2,000,000 Occurrence GL',
        requestedDeductible: '$50,000',
      },
    },
    {
      label: '🚛 Heavy Freight Fleet (Substandard)',
      data: {
        companyName: 'Titan Interstate Hauling Corp',
        industry: 'Commercial Freight & Long-Haul Trucking',
        naicsCode: '484121',
        lineOfBusiness: 'Commercial Auto & Fleet' as LineOfBusiness,
        tiv: 22000000,
        revenue: 29000000,
        employees: 130,
        yearsInBusiness: 11,
        locations: 'Terminals in Kansas City, MO and Fort Worth, TX',
        locationZone: 'Central Tornado Alley & Hail Belt',
        lossHistoryText: '3 major collision claims in past 4 years ($420,000 total incurred). 1 cargo spill incident ($85,000).',
        protections: 'GPS tracking on all tractors, dual-facing cameras installed 6 months ago, electronic logs.',
        cyberPosture: 'Basic endpoint antivirus, standard cloud accounting.',
        requestedLimits: '$1,000,000 CSL / $5,000,000 Excess',
        requestedDeductible: '$25,000',
      },
    },
    {
      label: '☀️ Utility Solar Facility (Peril Risk)',
      data: {
        companyName: 'Helios SunPower Plant Beta',
        industry: 'Renewable Power Generation',
        naicsCode: '221114',
        lineOfBusiness: 'Renewable Energy & Power' as LineOfBusiness,
        tiv: 28500000,
        revenue: 8500000,
        employees: 18,
        yearsInBusiness: 4,
        locations: '300-acre solar array in Lubbock County, Texas',
        locationZone: 'Texas Panhandle Hail Tier 1',
        lossHistoryText: '1 hail strike in 2023 causing cracked glass on 400 modules ($65,000 claim).',
        protections: 'Automated 70-degree hail stow sensors, 150-ft brush cleared perimeter, LiFePO4 battery modules with NFPA 855 blast vents.',
        cyberPosture: 'NERC CIP compliant SCADA network with hardware firewall.',
        requestedLimits: '$28,000,000 Property & BI',
        requestedDeductible: '$100,000 Property / 5% Hail',
      },
    },
  ];

  const [formData, setFormData] = useState(presets[0].data);
  const [rawText, setRawText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');

  // Handle Preset Load
  const loadPreset = (presetData: any) => {
    setFormData(presetData);
  };

  // Handle Extract from document text
  const handleExtractText = async () => {
    if (!rawText.trim()) return;
    setIsExtracting(true);
    try {
      const res = await fetch('/api/extract-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentText: rawText }),
      });
      const data = await res.json();
      if (data && data.companyName) {
        setFormData((prev) => ({
          ...prev,
          ...data,
        }));
      }
    } catch (err) {
      console.error('Extract error:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  // Submit for AI Underwriting
  const handleRunUnderwrite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setAnalysisStep('Ingesting submission parameters & exposure baseline...');

    try {
      setTimeout(() => setAnalysisStep('Auditing 5-year loss history and catastrophe peril zones...'), 700);
      setTimeout(() => setAnalysisStep('Checking carrier appetite rules & actuarial rates...'), 1400);

      const res = await fetch('/api/underwrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      const analysis = result.analysis;

      const newSubmission: Submission = {
        id: `sub-${Date.now()}`,
        submissionNumber: `RP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        companyName: formData.companyName,
        industry: formData.industry,
        naicsCode: formData.naicsCode || '541990',
        lineOfBusiness: formData.lineOfBusiness,
        brokerName: 'Underwriting Desk Intake',
        brokerAgency: 'National Brokerage Exchange',
        tiv: Number(formData.tiv),
        revenue: Number(formData.revenue),
        employees: Number(formData.employees),
        yearsInBusiness: Number(formData.yearsInBusiness),
        locationsCount: 1,
        locations: formData.locations,
        locationZone: formData.locationZone,
        lossHistoryText: formData.lossHistoryText,
        claimsPast5YearsCount: formData.lossHistoryText.includes('clean') ? 0 : 2,
        totalLossIncurred: formData.lossHistoryText.includes('clean') ? 0 : 150000,
        protections: formData.protections,
        cyberPosture: formData.cyberPosture,
        requestedLimits: formData.requestedLimits,
        requestedDeductible: formData.requestedDeductible,
        status: analysis.underwritingAction === 'RECOMMEND_QUOTE' ? 'QUOTED' :
                analysis.underwritingAction === 'REFERRAL_REQUIRED' ? 'FLAGGED_HIGH_RISK' : 'DECLINED',
        dateSubmitted: new Date().toISOString().split('T')[0],
        assignedUnderwriter: 'Marcus Sterling (Senior VP Underwriting)',
        analysis,
        quoteDetails: analysis.underwritingAction === 'RECOMMEND_QUOTE' ? {
          boundPremium: analysis.recommendedPricing.indicatedAnnualPremium,
          quotedDeductible: analysis.recommendedPricing.recommendedDeductible,
          quoteExpiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          termsNotes: 'Auto-quoted by RiskPulse AI engine.',
        } : undefined,
      };

      onSubmissionCreated(newSubmission);
      onClose();
    } catch (err) {
      console.error('Underwrite error:', err);
      alert('Error analyzing submission. Please check connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                RiskPulse AI Underwriting Lab
                <span className="text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">
                  Gemini 3.8 Flash
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Instant risk score computation, loss history forensic audit, and appetite matching
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Preset Selector */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-400">
              Pre-Loaded Demo Accounts:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => loadPreset(preset.data)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-200 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Raw Text / ACORD / Slip Extractor Drawer */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                AI Document & Slip Text Extractor (Optional)
              </span>
              <span className="text-[11px] text-slate-500">
                Paste ACORD 125, Schedule of Values, or broker email
              </span>
            </div>
            <textarea
              rows={2}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="e.g. Insured is Apex Logistics LLC, $24M TIV blanket across 2 warehouses in Dallas TX, 85 tractors, 2 loss claims totaling $45k in 2024, fully sprinklered with alarm..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleExtractText}
                disabled={isExtracting || !rawText.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-cyan-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
              >
                {isExtracting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Extracting with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Auto-Fill Form from Text</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Submission Form */}
          <form onSubmit={handleRunUnderwrite} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Company Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Insured Name *</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Industry & NAICS */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Industry Classification & NAICS *</label>
                <input
                  type="text"
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Line of Business */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Line of Business *</label>
                <select
                  value={formData.lineOfBusiness}
                  onChange={(e) => setFormData({ ...formData, lineOfBusiness: e.target.value as LineOfBusiness })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Commercial Property">Commercial Property</option>
                  <option value="Commercial Package">Commercial Package</option>
                  <option value="Commercial Auto & Fleet">Commercial Auto & Fleet</option>
                  <option value="Cyber & Tech E&O">Cyber & Tech E&O</option>
                  <option value="Renewable Energy & Power">Renewable Energy & Power</option>
                </select>
              </div>

              {/* Total Insured Value (TIV) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Total Insured Value ($ TIV) *</label>
                <input
                  type="number"
                  required
                  value={formData.tiv}
                  onChange={(e) => setFormData({ ...formData, tiv: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Annual Revenue */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Annual Gross Revenue ($)</label>
                <input
                  type="number"
                  value={formData.revenue}
                  onChange={(e) => setFormData({ ...formData, revenue: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Headcount */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Employees / Headcount</label>
                <input
                  type="number"
                  value={formData.employees}
                  onChange={(e) => setFormData({ ...formData, employees: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Locations */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Facility Locations & Construction</label>
                <input
                  type="text"
                  value={formData.locations}
                  onChange={(e) => setFormData({ ...formData, locations: e.target.value })}
                  placeholder="e.g. 1 HQ & Manufacturing Facility in Dallas, TX (Reinforced Concrete Tilt-up)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Loss History */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">5-Year Loss Run History *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.lossHistoryText}
                  onChange={(e) => setFormData({ ...formData, lossHistoryText: e.target.value })}
                  placeholder="e.g. 5-year clean loss history, zero claims incurred"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Protections */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Fire & Physical Protections</label>
                <input
                  type="text"
                  value={formData.protections}
                  onChange={(e) => setFormData({ ...formData, protections: e.target.value })}
                  placeholder="e.g. 100% NFPA 13 Wet Sprinklers, Central Station Alarm, 24/7 Security Patrol"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Cyber Posture */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cyber Security & InfoSec Hygiene</label>
                <input
                  type="text"
                  value={formData.cyberPosture}
                  onChange={(e) => setFormData({ ...formData, cyberPosture: e.target.value })}
                  placeholder="e.g. MFA enforced on 100% endpoints, air-gapped immutable backups, SOC 2 certified"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Requested Limits */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Requested Policy Limits</label>
                <input
                  type="text"
                  value={formData.requestedLimits}
                  onChange={(e) => setFormData({ ...formData, requestedLimits: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Requested Deductible */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Requested Deductible</label>
                <input
                  type="text"
                  value={formData.requestedDeductible}
                  onChange={(e) => setFormData({ ...formData, requestedDeductible: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Analysis Loading Screen */}
            {isAnalyzing && (
              <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/40 space-y-2 animate-pulse">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>RISKPULSE AI UNDERWRITING IN PROGRESS...</span>
                </div>
                <div className="text-xs text-slate-300 font-mono">
                  &gt; {analysisStep}
                </div>
              </div>
            )}

            {/* Submit CTA */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs sm:text-sm font-bold shadow-lg shadow-cyan-950 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Run RiskPulse AI Underwrite</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
