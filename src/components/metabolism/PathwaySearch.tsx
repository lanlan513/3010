import { useState, useMemo } from 'react';
import { Search, X, Zap, ArrowRight } from 'lucide-react';
import type { BiogeochemicalCycleData, MetabolismType, BiogeochemicalCycle } from '../../../shared/types';
import { METABOLISM_TYPE_LABELS, CYCLE_LABELS, CYCLE_COLORS } from '../../../shared/types';
import { microbeMetabolismProfiles, cycleDataMap } from '../../data/metabolismData';

interface PathwaySearchProps {
  cycleData: BiogeochemicalCycleData;
  onMicrobeSelect?: (id: number) => void;
  onEdgeSelect?: (from: string, to: string) => void;
  onCycleChange?: (cycle: BiogeochemicalCycle) => void;
}

interface SearchResult {
  type: 'microbe' | 'pathway' | 'step';
  title: string;
  subtitle: string;
  cycle: BiogeochemicalCycle;
  metabolismType: MetabolismType;
  microbeId?: number;
  stepId?: string;
  edgeFrom?: string;
  edgeTo?: string;
}

export function PathwaySearch({ cycleData, onMicrobeSelect, onEdgeSelect, onCycleChange }: PathwaySearchProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const allCycles = useMemo(() => Object.values(cycleDataMap), []);

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase().trim();
    const searchResults: SearchResult[] = [];

    allCycles.forEach((cd) => {
      cd.steps.forEach((step) => {
        const matchLabel = step.label.toLowerCase().includes(q);
        const matchDesc = step.description.toLowerCase().includes(q);
        const matchReactant = step.reactants.some((r) => r.toLowerCase().includes(q));
        const matchProduct = step.products.some((r) => r.toLowerCase().includes(q));
        const matchMetabolism = METABOLISM_TYPE_LABELS[step.metabolismType].toLowerCase().includes(q);

        if (matchLabel || matchDesc || matchReactant || matchProduct || matchMetabolism) {
          searchResults.push({
            type: 'step',
            title: step.label,
            subtitle: step.description.slice(0, 60) + (step.description.length > 60 ? '...' : ''),
            cycle: cd.cycle,
            metabolismType: step.metabolismType,
            stepId: step.id,
          });
        }
      });

      cd.edges.forEach((edge) => {
        const matchLabel = edge.label.toLowerCase().includes(q);
        const matchMetabolism = METABOLISM_TYPE_LABELS[edge.metabolismType].toLowerCase().includes(q);
        const hasMatchingMicrobe = edge.microbeIds.length > 0 && edge.microbeIds.some((mid) => {
          const profile = microbeMetabolismProfiles.find((p) => p.microbeId === mid);
          return profile && profile.microbeName.toLowerCase().includes(q);
        });

        if (matchLabel || matchMetabolism || hasMatchingMicrobe) {
          searchResults.push({
            type: 'pathway',
            title: edge.label,
            subtitle: `${METABOLISM_TYPE_LABELS[edge.metabolismType]}`,
            cycle: cd.cycle,
            metabolismType: edge.metabolismType,
            edgeFrom: edge.from,
            edgeTo: edge.to,
            microbeId: edge.microbeIds[0],
          });
        }
      });

      microbeMetabolismProfiles.forEach((profile) => {
        const matchName = profile.microbeName.toLowerCase().includes(q);
        const hasPathwayInCycle = profile.pathways.some((p) => p.cycle === cd.cycle);
        const matchPathway = profile.pathways.some(
          (p) => p.role.toLowerCase().includes(q) || METABOLISM_TYPE_LABELS[p.metabolismType].toLowerCase().includes(q)
        );

        if ((matchName || matchPathway) && hasPathwayInCycle) {
          searchResults.push({
            type: 'microbe',
            title: profile.microbeName,
            subtitle: profile.pathways
              .filter((p) => p.cycle === cd.cycle)
              .map((p) => p.role)
              .join(' / '),
            cycle: cd.cycle,
            metabolismType: profile.pathways[0].metabolismType,
            microbeId: profile.microbeId,
          });
        }
      });
    });

    const seen = new Set<string>();
    return searchResults.filter((r) => {
      const key = `${r.type}-${r.title}-${r.cycle}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 15);
  }, [query, allCycles]);

  const showResults = isFocused && query.trim().length > 0;

  const typeIcons: Record<string, string> = {
    microbe: '🦠',
    pathway: '🔄',
    step: '⚛️',
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.cycle !== cycleData.cycle && onCycleChange) {
      onCycleChange(result.cycle);
    }
    setTimeout(() => {
      if (result.type === 'microbe' && result.microbeId) {
        onMicrobeSelect?.(result.microbeId);
      } else if (result.type === 'pathway' && result.edgeFrom && result.edgeTo) {
        onEdgeSelect?.(result.edgeFrom, result.edgeTo);
      }
    }, 100);
    setQuery('');
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="搜索代谢路径、微生物、化学物质（跨所有循环）..."
          className="w-full pl-11 pr-10 py-3 rounded-xl bg-background-card/80 border border-glow-primary/20
                     text-text-light font-mono text-sm focus:outline-none focus:border-glow-primary/60
                     transition-colors placeholder:text-text-muted/40"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-light transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card p-2 max-h-[420px] overflow-y-auto z-20 animate-fade-in-up">
          {results.length === 0 ? (
            <div className="text-center py-6">
              <p className="font-mono text-sm text-text-muted/60">未找到匹配的代谢路径</p>
              <p className="font-mono text-[10px] text-text-muted/40 mt-1">
                试试搜索&quot;固氮&quot;、&quot;发酵&quot;、&quot;CO₂&quot;、&quot;甲烷&quot;等关键词
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((result, idx) => {
                const cycleColor = CYCLE_COLORS[result.cycle];
                const isCurrentCycle = result.cycle === cycleData.cycle;
                return (
                  <button
                    key={idx}
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-glow-primary/5 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-base mt-0.5">{typeIcons[result.type]}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm text-text-light group-hover:text-glow-primary transition-colors truncate">
                            {result.title}
                          </span>
                          <span
                            className="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-mono border"
                            style={{
                              color: cycleColor,
                              borderColor: cycleColor + '44',
                              backgroundColor: cycleColor + '10',
                            }}
                          >
                            {CYCLE_LABELS[result.cycle]}
                          </span>
                          {!isCurrentCycle && (
                            <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono bg-background-muted/60 text-text-muted/60">
                              <ArrowRight className="w-2.5 h-2.5" />
                              切换循环
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-[11px] text-text-muted/60 truncate mt-0.5">
                          {result.subtitle}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Zap className="w-3 h-3" style={{ color: cycleColor }} />
                        <span className="font-mono text-[10px]" style={{ color: cycleColor }}>
                          {METABOLISM_TYPE_LABELS[result.metabolismType]}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!query && (
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { tag: '光合固碳', hint: 'carbon' },
            { tag: '固氮', hint: 'nitrogen' },
            { tag: '发酵', hint: 'carbon' },
            { tag: '产甲烷', hint: 'carbon' },
            { tag: '硫酸盐还原', hint: 'sulfur' },
            { tag: '反硝化', hint: 'nitrogen' },
            { tag: '硫氧化', hint: 'sulfur' },
            { tag: 'CO₂', hint: 'carbon' },
          ].map(({ tag, hint }) => (
            <button
              key={tag}
              onClick={() => {
                setQuery(tag);
                const targetCycle = hint as BiogeochemicalCycle;
                if (targetCycle !== cycleData.cycle && onCycleChange) {
                  onCycleChange(targetCycle);
                }
              }}
              className="px-3 py-1 rounded-full border border-glow-primary/20 text-text-muted/60
                         hover:border-glow-primary/50 hover:text-glow-primary transition-all
                         font-mono text-[11px]"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
