import React from 'react';
import { Submission } from '../types/underwriting';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  Activity, 
  DollarSign, 
  Flame, 
  CloudRain, 
  Zap, 
  Clock 
} from 'lucide-react';

interface PortfolioAnalyticsViewProps {
  submissions: Submission[];
}

export const PortfolioAnalyticsView: React.FC<PortfolioAnalyticsViewProps> = ({ submissions }) => {
  const totalTIV = submissions.reduce((acc, curr) => acc + curr.tiv, 0);
  const totalIncurred = submissions.reduce((acc, curr) => acc + curr.totalLossIncurred, 0);
  const totalBoundPremium = submissions
    .filter((s) => s.status === 'BOUND')
    .reduce((acc, curr) => acc + (curr.quoteDetails?.boundPremium || curr.analysis.recommendedPricing.indicatedAnnualPremium), 0);
  
  const avgPulse = Math.round(submissions.reduce((acc, curr) => acc + curr.analysis.pulseScore, 0) / submissions.length);

  // Group by line of business
  const linesMap: { [key: string]: number } = {};
  submissions.forEach((s) => {
    linesMap[s.lineOfBusiness] = (linesMap[s.lineOfBusiness] || 0) + s.tiv;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs mb-1">
            <BarChart3 className="w-4 h-4" />
            ACTUARIAL PORTFOLIO & CATASTROPHE CONCENTRATION MONITOR
          </div>
          <h2 className="text-xl font-bold text-white">Aggregated Risk & PML Analytics</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Holistic capital exposure, probable maximum loss simulations, and line-of-business limits.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
          <span className="text-slate-400">Total Bound Book:</span>
          <span className="font-mono font-bold text-emerald-400">${totalBoundPremium.toLocaleString()}/yr</span>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">TOTAL PORTFOLIO TIV</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            ${(totalTIV / 1000000).toFixed(1)}M
          </div>
          <div className="text-[11px] text-cyan-400 mt-1">Across {submissions.length} Commercial Accounts</div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">ACTUAL LOSS RATIO FORECAST</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            34.2%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Under target ceiling of 46.5% (Safe)</div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">100-YEAR PML EXPOSURE</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            $18.4M
          </div>
          <div className="text-[11px] text-slate-400 mt-1">11.8% of Total Portfolio Assets</div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">AI UNDERWRITE VELOCITY</div>
          <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
            1.8 min
          </div>
          <div className="text-[11px] text-slate-400 mt-1">vs 4.2 days manual broker cycle</div>
        </div>
      </div>

      {/* Line of Business Exposure Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-cyan-400" />
            Exposure by Line of Business
          </h3>

          <div className="space-y-3">
            {Object.entries(linesMap).map(([line, val]) => {
              const percent = Math.round((val / totalTIV) * 100);
              return (
                <div key={line} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{line}</span>
                    <span className="font-mono text-slate-400">
                      ${(val / 1000000).toFixed(1)}M ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Catastrophe Peril Concentration */}
        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-400" />
            Natural Catastrophe Peril Exposure
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CloudRain className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="font-semibold text-slate-200">Gulf Coast Surge & Coastal Wind</div>
                  <div className="text-slate-500">Tier 1 Named Storm Perils</div>
                </div>
              </div>
              <span className="font-mono font-bold text-slate-200">$26.8M TIV</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="font-semibold text-slate-200">California Wildfire Urban Interface</div>
                  <div className="text-slate-500">Tier 2 Brush Clearance Standards</div>
                </div>
              </div>
              <span className="font-mono font-bold text-slate-200">$36.2M TIV</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="font-semibold text-slate-200">Central Hail & Convective Tornado Alley</div>
                  <div className="text-slate-500">Fleet Yards & Utility Solar</div>
                </div>
              </div>
              <span className="font-mono font-bold text-slate-200">$48.3M TIV</span>
            </div>
          </div>
        </div>
      </div>

      {/* PML Exceedance Curve Card */}
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Probable Maximum Loss (PML) Capital Stress Table</h3>
          <span className="text-xs text-slate-400">Syndicate Treaty Capacity Limit: $45M</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold">1-in-50 Year Event (2% Annual Prob)</div>
            <div className="text-xl font-bold font-mono text-cyan-400 mt-1">$11.2M Loss</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Surplus Buffer: $33.8M Remaining</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold">1-in-100 Year Event (1% Annual Prob)</div>
            <div className="text-xl font-bold font-mono text-amber-400 mt-1">$18.4M Loss</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Surplus Buffer: $26.6M Remaining</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold">1-in-250 Year Event (0.4% Annual Prob)</div>
            <div className="text-xl font-bold font-mono text-rose-400 mt-1">$29.5M Loss</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Surplus Buffer: $15.5M Remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
};
