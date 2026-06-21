import { useState, useMemo } from 'react';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { biogeochemicalCyclesData, microbeMetabolismProfiles } from '../../data/metabolismData';
import type {
  BiogeochemicalCycle,
  MetabolismType,
  MetabolicPathwayStep,
} from '../../../shared/types';
import {
  CATEGORY_COLORS,
  CYCLE_LABELS,
  CYCLE_COLORS,
  METABOLISM_TYPE_LABELS,
} from '../../../shared/types';

export function PathwaySearch() {
  const { microbes } = useAppStore();
  const [query, setQuery] = useState('');
  const [filterCycle, setFilterCycle] = useState<BiogeochemicalCycle | 'all'>('all');
  const [filterType, setFilterType] = useState<MetabolismType | 'all'>('all');
  const [selectedStep, setSelectedStep] = useState<MetabolicPathwayStep | null>(null);

  const allSteps = useMemo(() => {
    return biogeochemicalCyclesData.flatMap((cycle) =>
      cycle.steps.map((step) => ({ ...step, cycle: cycle.cycle }))
    );
  }, []);

  const filteredSteps = useMemo(() => {
    let result = allSteps;
    if (filterCycle !== 'all') {
      result = result.filter((s) => s.cycle === filterCycle);
    }
    if (filterType !== 'all') {
      result = result.filter((s) => s.metabolismType === filterType);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (s) =>
          s.label.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.reactants.some((r) => r.toLowerCase().includes(q)) ||
          s.products.some((p) => p.toLowerCase().includes(q))
      );
    }
    return result;
  }, [allSteps, filterCycle, filterType, query]);

  const allTypes = useMemo(() => {
    const types = new Set<MetabolismType>();
    allSteps.forEach((s) => types.add(s.metabolismType));
    return [...types];
  }, [allSteps]);

  return (
    <div className="space-y-5">
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-glow-primary" />
          <h3 className="font-display text-xl text-text-light">代谢途径搜索</h3>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索途径、底物、产物名称..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-background-card/80 border border-glow-primary/20 text-text-light font-mono text-sm focus:outline-none focus:border-glow-primary/60 transition-colors"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Filter className="w-3.5 h-3.5 text-text-muted/50" />
              <span className="font-mono text-[10px] text-text-muted/50">
                生物地球化学循环
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setFilterCycle('all')}
                className={`font-mono text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                  filterCycle === 'all'
                    ? 'bg-glow-primary/15 text-glow-primary border-glow-primary/40'
                    : 'bg-background-card/50 text-text-muted/70 border-white/5 hover:border-glow-primary/20 hover:text-text-light'
                }`}
              >
                全部
              </button>
              {(['carbon', 'nitrogen', 'sulfur'] as const).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setFilterCycle(cycle)}
                  className={`font-mono text-[10px] px-2.5 py-1 rounded-full border transition-all`}
                  style={
                    filterCycle === cycle
                      ? {
                          backgroundColor: CYCLE_COLORS[cycle] + '15',
                          color: CYCLE_COLORS[cycle],
                          borderColor: CYCLE_COLORS[cycle] + '40',
                        }
                      : {
                          backgroundColor: '#0d1f1c50',
                          color: '#8fb5afaa',
                          borderColor: '#ffffff0d',
                        }
                  }
                >
                  {CYCLE_LABELS[cycle]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Filter className="w-3.5 h-3.5 text-text-muted/50" />
              <span className="font-mono text-[10px] text-text-muted/50">代谢类型</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setFilterType('all')}
                className={`font-mono text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                  filterType === 'all'
                    ? 'bg-glow-primary/15 text-glow-primary border-glow-primary/40'
                    : 'bg-background-card/50 text-text-muted/70 border-white/5 hover:border-glow-primary/20 hover:text-text-light'
                }`}
              >
                全部
              </button>
              {allTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`font-mono text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                    filterType === type
                      ? 'bg-glow-primary/15 text-glow-primary border-glow-primary/40'
                      : 'bg-background-card/50 text-text-muted/70 border-white/5 hover:border-glow-primary/20 hover:text-text-light'
                  }`}
                >
                  {METABOLISM_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {filteredSteps.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="font-mono text-sm text-text-muted/50">未找到匹配的代谢途径</p>
          </div>
        ) : (
          filteredSteps.map((step) => {
            const color = CYCLE_COLORS[step.cycle];
            const isSelected = selectedStep?.id === step.id;
            return (
              <div
                key={step.id}
                className={`glass-card p-4 transition-all cursor-pointer ${
                  isSelected ? 'border-glow-primary/50' : 'hover:border-glow-primary/30'
                }`}
                onClick={() => setSelectedStep(isSelected ? null : step)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-2 h-2 rounded-full mt-2 shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h4 className="font-display text-lg text-text-light">{step.label}</h4>
                      <span
                        className="font-mono text-[9px] px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: color + '15',
                          color: color,
                          border: `1px solid ${color}33`,
                        }}
                      >
                        {CYCLE_LABELS[step.cycle]}
                      </span>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-background-card/50 border border-white/10 text-text-muted/70">
                        {METABOLISM_TYPE_LABELS[step.metabolismType]}
                      </span>
                      <span className="font-mono text-[9px] text-glow-primary ml-auto">
                        {step.energyOutput}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-text-muted/70 leading-relaxed mb-3 line-clamp-2">
                      {step.description}
                    </p>

                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex flex-wrap gap-1">
                        {step.reactants.map((r, i) => (
                          <span
                            key={i}
                            className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-background-card/50 border border-white/5 text-text-light"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                      <ArrowRight className="w-3 h-3 text-text-muted/50 shrink-0" />
                      <div className="flex flex-wrap gap-1">
                        {step.products.map((p, i) => (
                          <span
                            key={i}
                            className="font-mono text-[9px] px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: color + '15',
                              color: color,
                              border: `1px solid ${color}33`,
                            }}
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-glow-primary/10 animate-fade-in-up">
                        <p className="font-mono text-[10px] text-text-muted/50 mb-2">
                          参与微生物 ({step.microbeIds.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {step.microbeIds.map((mid) => {
                            const microbe = microbes.find((m) => m.id === mid);
                            if (!microbe) return null;
                            return (
                              <div
                                key={mid}
                                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-background-card/50 border border-white/5"
                              >
                                <div
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{
                                    backgroundColor: CATEGORY_COLORS[microbe.category],
                                  }}
                                />
                                <span className="font-mono text-[10px] text-text-light">
                                  {microbe.name}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
