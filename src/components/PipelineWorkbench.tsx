import React, { useState } from 'react';
import { 
  Submission, 
  SubmissionStatus, 
  LineOfBusiness, 
  RiskTier 
} from '../types/underwriting';
import { CSuiteBoardBriefModal } from './CSuiteBoardBriefModal';
import { 
  Search, 
  Filter, 
  Layers, 
  Table as TableIcon, 
  Kanban, 
  ArrowUpRight, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldAlert, 
  ChevronRight, 
  Sparkles, 
  Building2, 
  MapPin, 
  DollarSign, 
  FileText,
  RefreshCw
} from 'lucide-react';

interface PipelineWorkbenchProps {
  submissions: Submission[];
  onSelectSubmission: (submission: Submission) => void;
  onOpenAnalyze: () => void;
  onReUnderwrite: (submission: Submission) => void;
  onViewMemo: (submission: Submission) => void;
}

export const PipelineWorkbench: React.FC<PipelineWorkbenchProps> = ({
  submissions,
  onSelectSubmission,
  onOpenAnalyze,
  onReUnderwrite,
  onViewMemo,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedLine, setSelectedLine] = useState<string>('ALL');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [isBoardBriefOpen, setIsBoardBriefOpen] = useState(false);

  // Filter calculations
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch = 
      sub.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.brokerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.locations.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.submissionNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || sub.status === selectedStatus;
    const matchesLine = selectedLine === 'ALL' || sub.lineOfBusiness === selectedLine;
    const matchesTier = selectedTier === 'ALL' || sub.analysis.riskTier.startsWith(selectedTier);

    return matchesSearch && matchesStatus && matchesLine && matchesTier;
  });

  // Aggregate stats
  const totalTIV = submissions.reduce((acc, curr) => acc + curr.tiv, 0);
  const avgPulse = submissions.length 
    ? Math.round(submissions.reduce((acc, curr) => acc + curr.analysis.pulseScore, 0) / submissions.length)
    : 0;
  const boundCount = submissions.filter((s) => s.status === 'BOUND').length;
  const quotedCount = submissions.filter((s) => s.status === 'QUOTED').length;
  const flaggedCount = submissions.filter((s) => s.status === 'FLAGGED_HIGH_RISK').length;

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'BOUND':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Bound
          </span>
        );
      case 'QUOTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <ArrowUpRight className="w-3 h-3" /> Quoted
          </span>
        );
      case 'FLAGGED_HIGH_RISK':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-3 h-3" /> High Risk
          </span>
        );
      case 'APPETITE_MATCHED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <CheckCircle2 className="w-3 h-3" /> Appetite Matched
          </span>
        );
      case 'IN_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" /> In Review
          </span>
        );
      case 'DECLINED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            <XCircle className="w-3 h-3" /> Declined
          </span>
        );
    }
  };

  const getPulseColor = (score: number) => {
    if (score >= 80) return { text: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500/30', lightBg: 'bg-emerald-500/10' };
    if (score >= 65) return { text: 'text-cyan-400', bg: 'bg-cyan-500', border: 'border-cyan-500/30', lightBg: 'bg-cyan-500/10' };
    if (score >= 50) return { text: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500/30', lightBg: 'bg-amber-500/10' };
    return { text: 'text-rose-400', bg: 'bg-rose-500', border: 'border-rose-500/30', lightBg: 'bg-rose-500/10' };
  };

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>PIPELINE TOTAL INSURED VALUE</span>
            <Building2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            ${(totalTIV / 1000000).toFixed(1)}M
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% capacity utilized this month</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>AVERAGE RISK PULSE SCORE</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{avgPulse}</span>
            <span className="text-xs text-slate-400">/ 100</span>
            <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Low-Moderate Risk
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full" 
              style={{ width: `${avgPulse}%` }}
            />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>PORTFOLIO CONVERSION</span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{boundCount} Bound</span>
            <span className="text-xs text-slate-400">({quotedCount} Active Quotes)</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            <span>Avg Bound Premium: $117k</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-all" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>HIGH RISK REFERRALS</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-400 font-mono">{flaggedCount} Accounts</span>
            <span className="text-xs text-slate-400">Requiring Subjectivities</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Loss run & surge exposure checks active</span>
          </div>
        </div>
      </div>

      {/* FEATURE CARD: C-SUITE & BOARD EXECUTIVE BRIEF */}
      <div 
        onClick={() => setIsBoardBriefOpen(true)}
        className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 rounded-xl p-4 border border-amber-500/40 shadow-lg hover:border-amber-400 transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                C-Suite & Board Executive Brief
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                BOARDROOM FINANCIAL TRANSLATION
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Clean, non-technical financial briefing for corporate boardrooms—translating technical CVEs and compliance failures into balance-sheet terms, financial impact in currency ($ & ₹), and recommended 8.2x risk-mitigation ROI.
            </p>
          </div>
        </div>

        <button className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold shrink-0 shadow-md transition-all">
          <span>Open Board Brief</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by company, NAICS code, broker agency, or location..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Right toggles */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition-colors ${
                  viewMode === 'table' ? 'bg-slate-800 text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Table view"
              >
                <TableIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition-colors ${
                  viewMode === 'kanban' ? 'bg-slate-800 text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Kanban view"
              >
                <Kanban className="w-4 h-4" />
                <span className="hidden sm:inline">Kanban</span>
              </button>
            </div>

            {/* AI Analyze trigger */}
            <button
              onClick={onOpenAnalyze}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs sm:text-sm font-medium rounded-lg transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Instant AI Underwrite</span>
            </button>
          </div>
        </div>

        {/* Sub-filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60 text-xs">
          <span className="text-slate-500 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Status:
          </span>
          {['ALL', 'IN_REVIEW', 'QUOTED', 'FLAGGED_HIGH_RISK', 'BOUND', 'DECLINED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedStatus === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}

          <span className="text-slate-600 mx-1">|</span>

          {/* Line of Business */}
          <select
            value={selectedLine}
            onChange={(e) => setSelectedLine(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Lines of Business</option>
            <option value="Commercial Property">Commercial Property</option>
            <option value="Commercial Package">Commercial Package</option>
            <option value="Commercial Auto & Fleet">Commercial Auto & Fleet</option>
            <option value="Cyber & Tech E&O">Cyber & Tech E&O</option>
            <option value="Renewable Energy & Power">Renewable Energy & Power</option>
          </select>

          {/* Risk Tier */}
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Risk Tiers</option>
            <option value="Tier 1">Tier 1 - Preferred</option>
            <option value="Tier 2">Tier 2 - Standard</option>
            <option value="Tier 3">Tier 3 - Substandard</option>
            <option value="Tier 4">Tier 4 - Declined</option>
          </select>
        </div>
      </div>

      {/* Workbench Content */}
      {viewMode === 'table' ? (
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Account & Industry</th>
                  <th className="py-3.5 px-4">Line of Business</th>
                  <th className="py-3.5 px-4">TIV & Revenue</th>
                  <th className="py-3.5 px-4">Risk Pulse Score</th>
                  <th className="py-3.5 px-4">Carrier Appetite</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Indicated Premium</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      No insurance submissions found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => {
                    const pulse = getPulseColor(sub.analysis.pulseScore);
                    return (
                      <tr 
                        key={sub.id} 
                        className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                        onClick={() => onSelectSubmission(sub)}
                      >
                        {/* Company & Broker */}
                        <td className="py-4 px-4">
                          <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                            {sub.companyName}
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{sub.submissionNumber}</span>
                            <span>•</span>
                            <span>NAICS {sub.naicsCode}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-600" />
                            <span className="truncate max-w-[200px]">{sub.locations}</span>
                          </div>
                        </td>

                        {/* Line of Business */}
                        <td className="py-4 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700">
                            {sub.lineOfBusiness}
                          </span>
                          <div className="text-[11px] text-slate-400 mt-1">
                            Broker: {sub.brokerAgency}
                          </div>
                        </td>

                        {/* TIV & Revenue */}
                        <td className="py-4 px-4 font-mono text-xs">
                          <div className="font-semibold text-slate-200">
                            ${(sub.tiv / 1000000).toFixed(1)}M TIV
                          </div>
                          <div className="text-slate-500 text-[11px] mt-0.5">
                            Rev: ${(sub.revenue / 1000000).toFixed(1)}M • {sub.employees} staff
                          </div>
                        </td>

                        {/* Risk Pulse Score */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-10 h-10 rounded-lg ${pulse.lightBg} border ${pulse.border} flex items-center justify-center font-mono font-bold text-sm ${pulse.text}`}>
                              {sub.analysis.pulseScore}
                            </div>
                            <div>
                              <div className="text-xs font-medium text-slate-200">
                                {sub.analysis.riskTier.split(' - ')[1] || sub.analysis.riskTier}
                              </div>
                              <div className="w-20 bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                                <div 
                                  className={`${pulse.bg} h-full rounded-full`} 
                                  style={{ width: `${sub.analysis.pulseScore}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Appetite Fit */}
                        <td className="py-4 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            sub.analysis.appetiteFit === 'Full Appetite Match'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : sub.analysis.appetiteFit === 'Conditional Match (Subjectivities Required)'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {sub.analysis.appetiteFit === 'Full Appetite Match' ? 'Full Match' : sub.analysis.appetiteFit === 'Conditional Match (Subjectivities Required)' ? 'Conditional' : 'Out of Appetite'}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          {getStatusBadge(sub.status)}
                        </td>

                        {/* Pricing */}
                        <td className="py-4 px-4 font-mono text-xs">
                          <div className="font-semibold text-slate-200">
                            ${sub.analysis.recommendedPricing.indicatedAnnualPremium.toLocaleString()}/yr
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {sub.analysis.recommendedPricing.suggestedDebitCreditPercent < 0 
                              ? `${sub.analysis.recommendedPricing.suggestedDebitCreditPercent}% Credit`
                              : sub.analysis.recommendedPricing.suggestedDebitCreditPercent > 0
                              ? `+${sub.analysis.recommendedPricing.suggestedDebitCreditPercent}% Debit`
                              : 'Flat Base'}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onSelectSubmission(sub)}
                              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium border border-slate-700 transition-colors"
                              title="Audit Risk Dossier"
                            >
                              Audit Risk
                            </button>
                            <button
                              onClick={() => onReUnderwrite(sub)}
                              className="p-1.5 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-400 rounded border border-cyan-800/50 transition-colors"
                              title="Re-run Gemini Underwrite"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onViewMemo(sub)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
                              title="View Underwriting Memo"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {(['IN_REVIEW', 'FLAGGED_HIGH_RISK', 'QUOTED', 'BOUND', 'DECLINED'] as SubmissionStatus[]).map((columnStatus) => {
            const columnSubs = filteredSubmissions.filter((s) => s.status === columnStatus);
            return (
              <div key={columnStatus} className="bg-slate-900/70 rounded-xl border border-slate-800 p-3 space-y-3 flex flex-col">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    {columnStatus === 'BOUND' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {columnStatus === 'QUOTED' && <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />}
                    {columnStatus === 'FLAGGED_HIGH_RISK' && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                    {columnStatus === 'IN_REVIEW' && <Clock className="w-3.5 h-3.5 text-amber-400" />}
                    {columnStatus === 'DECLINED' && <XCircle className="w-3.5 h-3.5 text-slate-400" />}
                    <span className="text-slate-300">{columnStatus.replace(/_/g, ' ')}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    {columnSubs.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[650px] pr-1">
                  {columnSubs.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-600 border border-dashed border-slate-800 rounded-lg">
                      No accounts
                    </div>
                  ) : (
                    columnSubs.map((sub) => {
                      const pulse = getPulseColor(sub.analysis.pulseScore);
                      return (
                        <div
                          key={sub.id}
                          onClick={() => onSelectSubmission(sub)}
                          className="bg-slate-950 p-3 rounded-lg border border-slate-800 hover:border-slate-700 transition-all hover:scale-[1.01] cursor-pointer space-y-2 group"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-xs font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                              {sub.companyName}
                            </h4>
                            <span className={`text-[11px] font-bold font-mono px-1.5 py-0.5 rounded ${pulse.lightBg} ${pulse.text} border ${pulse.border}`}>
                              {sub.analysis.pulseScore}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-400 line-clamp-1">
                            {sub.lineOfBusiness}
                          </div>

                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-900">
                            <span>${(sub.tiv / 1000000).toFixed(1)}M TIV</span>
                            <span className="text-slate-300">
                              ${Math.round(sub.analysis.recommendedPricing.indicatedAnnualPremium / 1000)}k/yr
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isBoardBriefOpen && (
        <CSuiteBoardBriefModal
          isOpen={isBoardBriefOpen}
          onClose={() => setIsBoardBriefOpen(false)}
          submission={submissions[0] || null}
        />
      )}
    </div>
  );
};
