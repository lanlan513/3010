import { useEffect, useState, useMemo } from 'react';
import { Sparkles, Atom, Leaf, Droplets, FlaskConical, GitCompare, Info } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { CycleFlowchart } from '../components/metabolism/CycleFlowchart';
import { PathwaySearch } from '../components/metabolism/PathwaySearch';
import { MetabolismComparison } from '../components/metabolism/MetabolismComparison';
import { cycleDataMap, microbeMetabolismProfiles } from '../data/metabolismData';
import type { BiogeochemicalCycle, CycleFlowEdge, MetabolicPathwayStep } from '../../shared/types';
import { CYCLE_LABELS, CYCLE_COLORS, METABOLISM_TYPE_LABELS, CATEGORY_COLORS, CATEGORY_LABELS } from '../../shared/types';

type TabType = 'flowchart' | 'comparison';

const cycleIcons: Record<BiogeochemicalCycle, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  carbon: Atom,
  nitrogen: Leaf,
  sulfur: Droplets,
};

function computeCycleMicrobeCount(cycle: BiogeochemicalCycle): string {
  const cycleData = cycleDataMap[cycle];
  if (!cycleData) return '0种微生物参与';
  const ids = new Set<number>();
  cycleData.edges.forEach((e) => e.microbeIds.forEach((id) => ids.add(id)));
  cycleData.steps.forEach((s) => s.microbeIds.forEach((id) => ids.add(id)));
  return `${ids.size}种微生物参与`;
}

const cycleDescriptions: Record<BiogeochemicalCycle, { summary: string; keyProcess: string }> = {
  carbon: {
    summary: '碳循环驱动着地球气候系统和生命能量流动',
    keyProcess: '光合/化能固碳 → 有机碳 → 呼吸/发酵 → CO₂',
  },
  nitrogen: {
    summary: '氮循环将大气中的惰性氮气转化为生物可利用形态',
    keyProcess: 'N₂ → 固氮 → NH₄⁺ → 硝化 → NO₃⁻ → 反硝化 → N₂',
  },
  sulfur: {
    summary: '硫循环在深海热泉和缺氧环境中支撑独特生态系统',
    keyProcess: 'SO₄²⁻ → 还原 → H₂S → 氧化 → S⁰/SO₄²⁻',
  },
};

export function MetabolismWorkshopPage() {
  const { microbes, fetchMicrobes } = useAppStore();
  const [activeCycle, setActiveCycle] = useState<BiogeochemicalCycle>('carbon');
  const [activeTab, setActiveTab] = useState<TabType>('flowchart');
  const [highlightMicrobeId, setHighlightMicrobeId] = useState<number | null>(null);
  const [selectedEdgeInfo, setSelectedEdgeInfo] = useState<CycleFlowEdge | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    fetchMicrobes();
  }, [fetchMicrobes]);

  const currentCycleData = cycleDataMap[activeCycle];

  const activeCycleMicrobes = useMemo(() => {
    if (!currentCycleData) return [];
    const ids = new Set<number>();
    currentCycleData.edges.forEach((e) => e.microbeIds.forEach((id) => ids.add(id)));
    currentCycleData.steps.forEach((s) => s.microbeIds.forEach((id) => ids.add(id)));
    return microbes.filter((m) => ids.has(m.id));
  }, [currentCycleData, microbes]);

  const handleCycleChange = (cycle: BiogeochemicalCycle) => {
    setActiveCycle(cycle);
    setHighlightMicrobeId(null);
    setSelectedEdgeInfo(null);
  };

  const handleEdgeClick = (edge: CycleFlowEdge) => {
    setSelectedEdgeInfo(selectedEdgeInfo?.label === edge.label ? null : edge);
  };

  const handleStepClick = (step: MetabolicPathwayStep) => {
    if (step.microbeIds.length > 0) {
      setHighlightMicrobeId(highlightMicrobeId === step.microbeIds[0] ? null : step.microbeIds[0]);
    }
  };

  const handleSearchMicrobeSelect = (id: number) => {
    setHighlightMicrobeId(highlightMicrobeId === id ? null : id);
  };

  const handleSearchEdgeSelect = (from: string, to: string) => {
    const edge = currentCycleData?.edges.find((e) => e.from === from && e.to === to);
    if (edge) {
      setSelectedEdgeInfo(edge);
    }
  };

  const highlightMicrobe = highlightMicrobeId
    ? microbes.find((m) => m.id === highlightMicrobeId)
    : null;

  const highlightProfile = highlightMicrobeId
    ? microbeMetabolismProfiles.find((p) => p.microbeId === highlightMicrobeId)
    : null;

  const totalMicrobesWithMetabolism = microbeMetabolismProfiles.length;

  return (
    <div className="container mx-auto px-6 pt-32 pb-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-glow-primary/30 bg-glow-primary/5 backdrop-blur-sm mb-6">
          <Sparkles className="w-4 h-4 text-glow-primary" />
          <span className="font-mono text-xs text-glow-primary tracking-[0.2em] uppercase">
            Metabolism Workshop
          </span>
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-semibold text-text-light mb-6">
          微生物<span className="text-gradient-primary">代谢工坊</span>
        </h1>
        <p className="font-mono text-text-muted/70 max-w-2xl mx-auto leading-relaxed">
          探索微生物如何获取能量、分解物质，驱动碳循环、氮循环和硫循环。
          通过流程图可视化代谢路径，搜索和对比不同微生物的代谢能力。
        </p>
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="text-center">
            <p className="font-display text-2xl text-glow-primary">{totalMicrobesWithMetabolism}</p>
            <p className="font-mono text-[10px] text-text-muted/50">微生物图谱</p>
          </div>
          <div className="w-px h-8 bg-glow-primary/20" />
          <div className="text-center">
            <p className="font-display text-2xl" style={{ color: CYCLE_COLORS.carbon }}>3</p>
            <p className="font-mono text-[10px] text-text-muted/50">生物地球化学循环</p>
          </div>
          <div className="w-px h-8 bg-glow-primary/20" />
          <div className="text-center">
            <p className="font-display text-2xl" style={{ color: CYCLE_COLORS.nitrogen }}>
              {Object.values(cycleDataMap).reduce((sum, cd) => sum + cd.edges.length, 0)}
            </p>
            <p className="font-mono text-[10px] text-text-muted/50">转化路径</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <PathwaySearch
          cycleData={currentCycleData}
          onMicrobeSelect={handleSearchMicrobeSelect}
          onEdgeSelect={handleSearchEdgeSelect}
          onCycleChange={handleCycleChange}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
        {(['carbon', 'nitrogen', 'sulfur'] as const).map((cycle) => {
          const Icon = cycleIcons[cycle];
          const color = CYCLE_COLORS[cycle];
          const isActive = activeCycle === cycle;

          return (
            <button
              key={cycle}
              onClick={() => handleCycleChange(cycle)}
              className={`relative flex items-center gap-3 px-8 py-4 rounded-2xl border transition-all duration-300 group ${
                isActive
                  ? 'shadow-lg'
                  : 'bg-background-card/40 border-white/5 hover:border-white/20'
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: color + '12',
                      borderColor: color + '55',
                      boxShadow: `0 0 30px ${color}20`,
                    }
                  : undefined
              }
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                style={{
                  backgroundColor: isActive ? color + '25' : '#1a2a28',
                  border: `1px solid ${isActive ? color + '60' : '#2d4a46'}`,
                }}
              >
                <Icon
                  className="w-5 h-5 transition-colors"
                  style={{ color: isActive ? color : '#8fb5af' }}
                />
              </div>
              <div className="text-left">
                <span
                  className="font-display text-lg font-semibold block transition-colors"
                  style={{ color: isActive ? color : '#e8f5f2' }}
                >
                  {CYCLE_LABELS[cycle]}
                </span>
                <span className="font-mono text-[10px] text-text-muted/50">
                  {computeCycleMicrobeCount(cycle)}
                </span>
              </div>
              {isActive && (
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
              )}
            </button>
          );
        })}
      </div>

      {showIntro && (
        <div
          className="glass-card p-6 mb-8 relative overflow-hidden animate-fade-in-up"
          style={{ borderColor: CYCLE_COLORS[activeCycle] + '30' }}
        >
          <div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-20"
            style={{ backgroundColor: CYCLE_COLORS[activeCycle] }}
          />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4" style={{ color: CYCLE_COLORS[activeCycle] }} />
                <h3
                  className="font-display text-xl"
                  style={{ color: CYCLE_COLORS[activeCycle] }}
                >
                  {currentCycleData.title} · {currentCycleData.subtitle}
                </h3>
              </div>
              <button
                onClick={() => setShowIntro(false)}
                className="text-text-muted/50 hover:text-text-light transition-colors text-xs font-mono"
              >
                关闭
              </button>
            </div>
            <p className="font-mono text-sm text-text-muted/80 leading-relaxed mb-3">
              {currentCycleData.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <div>
                <span className="font-mono text-[10px] text-text-muted/50">关键流程</span>
                <p className="font-mono text-xs text-text-light mt-1">
                  {cycleDescriptions[activeCycle].keyProcess}
                </p>
              </div>
              <div>
                <span className="font-mono text-[10px] text-text-muted/50">代谢节点</span>
                <p className="font-mono text-xs text-text-light mt-1">
                  {currentCycleData.steps.length} 个
                </p>
              </div>
              <div>
                <span className="font-mono text-[10px] text-text-muted/50">转化路径</span>
                <p className="font-mono text-xs text-text-light mt-1">
                  {currentCycleData.edges.length} 条
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center mb-8">
        <div className="glass-card p-1.5 flex gap-1">
          <button
            onClick={() => setActiveTab('flowchart')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 ${
              activeTab === 'flowchart'
                ? `shadow-[0_0_20px_${CYCLE_COLORS[activeCycle]}25]`
                : 'text-text-muted/70 hover:text-text-light hover:bg-background-card/50 border border-transparent'
            }`}
            style={
              activeTab === 'flowchart'
                ? {
                    backgroundColor: CYCLE_COLORS[activeCycle] + '15',
                    color: CYCLE_COLORS[activeCycle],
                    border: `1px solid ${CYCLE_COLORS[activeCycle]}40`,
                  }
                : undefined
            }
          >
            <FlaskConical className="w-4 h-4" />
            <span className="font-mono text-sm">循环流程图</span>
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 ${
              activeTab === 'comparison'
                ? 'bg-glow-primary/15 text-glow-primary border border-glow-primary/40 shadow-[0_0_20px_rgba(0,255,200,0.15)]'
                : 'text-text-muted/70 hover:text-text-light hover:bg-background-card/50 border border-transparent'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span className="font-mono text-sm">对比分析</span>
          </button>
        </div>
      </div>

      {activeTab === 'flowchart' ? (
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="font-display text-2xl"
                style={{ color: CYCLE_COLORS[activeCycle] }}
              >
                {CYCLE_LABELS[activeCycle]}流程图
              </h3>
              {highlightMicrobeId && (
                <button
                  onClick={() => setHighlightMicrobeId(null)}
                  className="font-mono text-xs text-text-muted hover:text-glow-red transition-colors"
                >
                  清除高亮
                </button>
              )}
            </div>
            <CycleFlowchart
              data={currentCycleData}
              onStepClick={handleStepClick}
              onEdgeClick={handleEdgeClick}
              highlightMicrobeId={highlightMicrobeId}
            />

            {selectedEdgeInfo && (
              <div
                className="mt-4 glass-card p-4 animate-fade-in-up"
                style={{ borderColor: CYCLE_COLORS[activeCycle] + '30' }}
              >
                <h4 className="font-mono text-sm text-text-light mb-2">
                  {selectedEdgeInfo.label}
                </h4>
                <div className="flex flex-wrap gap-3">
                  <div>
                    <span className="font-mono text-[10px] text-text-muted/50">代谢类型</span>
                    <p
                      className="font-mono text-xs mt-0.5"
                      style={{ color: CYCLE_COLORS[activeCycle] }}
                    >
                      {METABOLISM_TYPE_LABELS[selectedEdgeInfo.metabolismType]}
                    </p>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-text-muted/50">参与微生物</span>
                    <p className="font-mono text-xs text-text-light mt-0.5">
                      {selectedEdgeInfo.microbeIds.length > 0
                        ? selectedEdgeInfo.microbeIds
                            .map((id) => {
                              const m = microbes.find((mb) => mb.id === id);
                              return m ? m.name : `ID:${id}`;
                            })
                            .join('、')
                        : '无特定微生物（非生物过程）'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {highlightMicrobe && highlightProfile && (
              <div className="glass-card p-5 animate-fade-in-up">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-display text-lg text-text-light">
                      {highlightMicrobe.name}
                    </h4>
                    <span className="font-mono text-[10px] text-text-muted/50">
                      {CATEGORY_LABELS[highlightMicrobe.category]} · {highlightMicrobe.scientificName}
                    </span>
                  </div>
                  <button
                    onClick={() => setHighlightMicrobeId(null)}
                    className="text-text-muted/50 hover:text-text-light transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <p className="font-mono text-xs text-text-muted/70 leading-relaxed mb-3 line-clamp-3">
                  {highlightMicrobe.description}
                </p>

                <div>
                  <span className="font-mono text-[10px] text-text-muted/50 block mb-2">
                    代谢路径
                  </span>
                  <div className="space-y-2">
                    {highlightProfile.pathways.map((pw, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-2 rounded-lg bg-background-card/50 border border-white/5"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                          style={{ backgroundColor: CYCLE_COLORS[pw.cycle] }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-[11px] text-text-light">{pw.role}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span
                              className="font-mono text-[9px] px-1 py-0.5 rounded border"
                              style={{
                                color: CYCLE_COLORS[pw.cycle],
                                borderColor: CYCLE_COLORS[pw.cycle] + '44',
                                backgroundColor: CYCLE_COLORS[pw.cycle] + '10',
                              }}
                            >
                              {CYCLE_LABELS[pw.cycle]}
                            </span>
                            <span className="font-mono text-[9px] text-text-muted/40">
                              效率 {Math.round(pw.efficiency * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="glass-card p-5">
              <h4 className="font-display text-lg text-text-light mb-3">
                参与{CYCLE_LABELS[activeCycle]}的微生物
              </h4>
              <div className="space-y-2">
                {activeCycleMicrobes.map((m) => {
                  const profile = microbeMetabolismProfiles.find((p) => p.microbeId === m.id);
                  const cyclePathways = profile?.pathways.filter((p) => p.cycle === activeCycle) || [];
                  const isHighlighted = highlightMicrobeId === m.id;

                  return (
                    <button
                      key={m.id}
                      onClick={() =>
                        setHighlightMicrobeId(isHighlighted ? null : m.id)
                      }
                      className={`w-full text-left p-3 rounded-xl border transition-all duration-300 ${
                        isHighlighted
                          ? 'bg-glow-primary/10 border-glow-primary/50'
                          : 'bg-background-card/30 border-white/5 hover:border-glow-primary/30 hover:bg-background-card/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[m.category] }}
                        />
                        <span className="font-mono text-sm text-text-light">
                          {m.name}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {cyclePathways.slice(0, 3).map((pw, idx) => (
                          <span
                            key={idx}
                            className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-glow-primary/20 text-glow-primary bg-glow-primary/5"
                          >
                            {METABOLISM_TYPE_LABELS[pw.metabolismType]}
                          </span>
                        ))}
                        {cyclePathways.length > 3 && (
                          <span className="font-mono text-[9px] px-1.5 py-0.5 text-text-muted/50">
                            +{cyclePathways.length - 3}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
                {activeCycleMicrobes.length === 0 && (
                  <p className="font-mono text-sm text-text-muted/50 text-center py-4">
                    暂无数据
                  </p>
                )}
              </div>
            </div>

            <div className="glass-card p-5">
              <h4 className="font-display text-lg text-text-light mb-3">图例说明</h4>
              <div className="space-y-2">
                {Object.entries(CYCLE_COLORS).map(([cycle, color]) => (
                  <div key={cycle} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="font-mono text-xs text-text-muted">
                      {CYCLE_LABELS[cycle as BiogeochemicalCycle]}
                    </span>
                  </div>
                ))}
                <div className="border-t border-glow-primary/10 my-2" />
                <p className="font-mono text-[10px] text-text-muted/50">
                  点击节点查看详细代谢信息
                </p>
                <p className="font-mono text-[10px] text-text-muted/50">
                  悬浮连线查看转化路径
                </p>
                <p className="font-mono text-[10px] text-text-muted/50">
                  点击右侧微生物高亮其在循环中的位置
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <MetabolismComparison
          microbes={microbes}
          onMicrobeClick={(id) => {
            setActiveTab('flowchart');
            setHighlightMicrobeId(id);
          }}
        />
      )}
    </div>
  );
}
