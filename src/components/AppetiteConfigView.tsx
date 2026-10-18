import React, { useState } from 'react';
import { 
  CarrierAppetiteConfig, 
  AppetiteRule 
} from '../types/underwriting';
import { 
  Sliders, 
  ShieldCheck, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Building2, 
  DollarSign, 
  Percent, 
  Layers, 
  HelpCircle 
} from 'lucide-react';

interface AppetiteConfigViewProps {
  config: CarrierAppetiteConfig;
  rules: AppetiteRule[];
  onUpdateConfig: (updated: CarrierAppetiteConfig) => void;
  onUpdateRules: (updated: AppetiteRule[]) => void;
}

export const AppetiteConfigView: React.FC<AppetiteConfigViewProps> = ({
  config,
  rules,
  onUpdateConfig,
  onUpdateRules,
}) => {
  const [newIndustry, setNewIndustry] = useState('');
  const [newPerilZone, setNewPerilZone] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const addExcludedIndustry = () => {
    if (!newIndustry.trim()) return;
    onUpdateConfig({
      ...config,
      excludedIndustries: [...config.excludedIndustries, newIndustry.trim()],
    });
    setNewIndustry('');
  };

  const removeExcludedIndustry = (index: number) => {
    const updated = [...config.excludedIndustries];
    updated.splice(index, 1);
    onUpdateConfig({ ...config, excludedIndustries: updated });
  };

  const addRestrictedPeril = () => {
    if (!newPerilZone.trim()) return;
    onUpdateConfig({
      ...config,
      restrictedPerilZones: [...config.restrictedPerilZones, newPerilZone.trim()],
    });
    setNewPerilZone('');
  };

  const removeRestrictedPeril = (index: number) => {
    const updated = [...config.restrictedPerilZones];
    updated.splice(index, 1);
    onUpdateConfig({ ...config, restrictedPerilZones: updated });
  };

  const toggleRuleActive = (ruleId: string) => {
    const updated = rules.map((r) => (r.id === ruleId ? { ...r, active: !r.active } : r));
    onUpdateRules(updated);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs mb-1">
            <Sliders className="w-4 h-4" />
            CARRIER APPETITE & UNDERWRITING GUIDELINES ENGINE
          </div>
          <h2 className="text-xl font-bold text-white">{config.carrierName}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Define automated binding authority, hard exclusions, catastrophe limits, and referral logic.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Save Appetite Rules</span>
        </button>
      </div>

      {saveToast && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-lg text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Underwriting appetite parameters successfully deployed across the active engine.</span>
        </div>
      )}

      {/* Grid: Capacity & Loss Ratio Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Max Blanket TIV */}
        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>MAX BLANKET TIV PER ACCOUNT</span>
            <Building2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            ${(config.maxBlanketTIV / 1000000).toFixed(0)}M
          </div>
          <input
            type="range"
            min={10000000}
            max={150000000}
            step={5000000}
            value={config.maxBlanketTIV}
            onChange={(e) => onUpdateConfig({ ...config, maxBlanketTIV: Number(e.target.value) })}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>$10M Min</span>
            <span>$150M Treaty Cap</span>
          </div>
        </div>

        {/* Target Loss Ratio */}
        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>TARGET PORTFOLIO LOSS RATIO</span>
            <Percent className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {config.targetLossRatio}%
          </div>
          <input
            type="range"
            min={30}
            max={65}
            step={0.5}
            value={config.targetLossRatio}
            onChange={(e) => onUpdateConfig({ ...config, targetLossRatio: Number(e.target.value) })}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>30% Ultra-Conservative</span>
            <span>65% Growth Aggressive</span>
          </div>
        </div>

        {/* Auto-Quote Threshold */}
        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>AUTO-QUOTE MINIMUM PULSE</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-purple-400">
              {config.autoQuoteMinPulseScore}
            </span>
            <span className="text-xs text-slate-400">/ 100 Score</span>
          </div>
          <input
            type="range"
            min={60}
            max={85}
            step={1}
            value={config.autoQuoteMinPulseScore}
            onChange={(e) => onUpdateConfig({ ...config, autoQuoteMinPulseScore: Number(e.target.value) })}
            className="w-full accent-purple-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Score 60 (Loose)</span>
            <span>Score 85 (Strict Tier 1)</span>
          </div>
        </div>
      </div>

      {/* Excluded Classes & Peril Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Excluded Industries */}
        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Prohibited Classes & Excluded NAICS
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Submissions in these sectors trigger automatic declination.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newIndustry}
              onChange={(e) => setNewIndustry(e.target.value)}
              placeholder="e.g. Fireworks Manufacturing"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={addExcludedIndustry}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {config.excludedIndustries.map((ind, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-xs">
                <span className="text-slate-200">{ind}</span>
                <button
                  onClick={() => removeExcludedIndustry(idx)}
                  className="text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Restricted Peril Zones */}
        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Restricted Catastrophe Peril Zones
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Requires mandatory named storm deductibles or special referral.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newPerilZone}
              onChange={(e) => setNewPerilZone(e.target.value)}
              placeholder="e.g. Atlantic Coastal Wind Tier 1"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={addRestrictedPeril}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {config.restrictedPerilZones.map((peril, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-xs">
                <span className="text-slate-200">{peril}</span>
                <button
                  onClick={() => removeRestrictedPeril(idx)}
                  className="text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Automated Underwriting Rules Table */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Active Automated Underwriting Rules</h3>
          <span className="text-xs text-slate-400">{rules.filter((r) => r.active).length} of {rules.length} Active</span>
        </div>

        <div className="divide-y divide-slate-800">
          {rules.map((rule) => (
            <div key={rule.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-100">{rule.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700 font-mono">
                    {rule.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{rule.condition}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono ${
                  rule.action === 'AUTO_QUOTE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                  rule.action === 'REFER_SENIOR' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                  'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  {rule.action.replace(/_/g, ' ')}
                </span>

                <button
                  onClick={() => toggleRuleActive(rule.id)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                    rule.active ? 'bg-cyan-600' : 'bg-slate-800'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    rule.active ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
