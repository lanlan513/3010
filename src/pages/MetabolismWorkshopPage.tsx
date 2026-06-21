import { useEffect, useState } from 'react';
import { Atom, Sparkles, Layers, Search, Scale } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { biogeochemicalCyclesData } from '../data/metabolismData';
import { CycleFlowchart } from '../components/metabolism/CycleFlowchart';
import { MetabolismComparison } from '../components/metabolism/MetabolismComparison';
import { PathwaySearch } from '../components/metabolism/PathwaySearch';
import { CYCLE_LABELS, CYCLE_COLORS } from '../../shared/types';
import type { BiogeochemicalCycle } from '../../shared/types';

type TabType = 'cycles' | 'comparison' | 'search';

export function MetabolismWorkshopPage() {
  const { fetchMicrobes } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('cycles');
  const [activeCycle, setActiveCycle] = useState<BiogeochemicalCycle>('carbon');

  useEffect(() => {
    fetchMicrobes();
  }, [fetchMicrobes]);

  const activeCycleData = biogeochemicalCyclesData.find((c) => c.cycle === activeCycle)!;

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
    { id: 'cycles', label: '循环图谱', icon: Layers, desc: '三大生物地球化学循环可视化' },
    { id: 'comparison', label: '代谢对比', icon: Scale, desc: '微生物代谢特征多维度对比' },
    { id: 'search', label: '途径搜索', icon: Search, desc: '按底物/产物/类型搜索代谢途径' },
  ];

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
          代谢<span className="text-gradient-primary">工坊</span>
        </h1>
        <p className="font-mono text-text-muted/70 max-w-2xl mx-auto leading-relaxed">
          探索微生物世界错综复杂的能量代谢网络。从碳氮硫三大循环到具体的代谢途径，
          了解这些微观生命如何驱动地球的生物地球化学循环。
        </p>
        <div className="grid grid-cols-3 gap-6 mt-8 max-w-lg mx-auto">
          {(['carbon', 'nitrogen', 'sulfur'] as const).map((cycle, idx) => (
            <div
              key={cycle}
              className="glass-card p-3 cursor-pointer transition-all hover:scale-105"
              onClick={() => {
                setActiveTab('cycles');
                setActiveCycle(cycle);
              }}
            >
              <div
                className="w-3 h-3 rounded-full mx-auto mb-1.5"
                style={{ backgroundColor: CYCLE_COLORS[cycle] }}
              />
              <p className="font-display text-lg" style={{ color: CYCLE_COLORS[cycle] }}>
                {CYCLE_LABELS[cycle]}
              </p>
              <p className="font-mono text-[9px] text-text-muted/50">
                {biogeochemicalCyclesData.find((c) => c.cycle === cycle)?.steps.length} 途径
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <div className="glass-card p-1.5 flex flex-wrap gap-1 justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-glow-primary/15 text-glow-primary border border-glow-primary/40 shadow-[0_0_20px_rgba(0,255,200,0.15)]'
                    : 'text-text-muted/70 hover:text-text-light hover:bg-background-card/50 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-mono text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'cycles' && (
        <div className="space-y-6">
          <div className="flex justify-center gap-2 mb-4 flex-wrap">
            {biogeochemicalCyclesData.map((cycle) => (
              <button
                key={cycle.cycle}
                onClick={() => setActiveCycle(cycle.cycle)}
                className={`px-4 py-2 rounded-xl font-mono text-sm transition-all duration-300 border ${
                  activeCycle === cycle.cycle
                    ? 'shadow-[0_0_20px_rgba(0,255,200,0.15)]'
                    : 'bg-background-card/30 text-text-muted/70 border-white/5 hover:text-text-light hover:border-glow-primary/20'
                }`}
                style={
                  activeCycle === cycle.cycle
                    ? {
                        backgroundColor: CYCLE_COLORS[cycle.cycle] + '15',
                        color: CYCLE_COLORS[cycle.cycle],
                        borderColor: CYCLE_COLORS[cycle.cycle] + '40',
                      }
                    : undefined
                }
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: CYCLE_COLORS[cycle.cycle] }}
                  />
                  {CYCLE_LABELS[cycle.cycle]}
                </div>
              </button>
            ))}
          </div>

          <div className="glass-card p-6 mb-6">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: CYCLE_COLORS[activeCycle] + '15',
                  border: `1px solid ${CYCLE_COLORS[activeCycle]}33`,
                }}
              >
                <Atom
                  className="w-6 h-6"
                  style={{ color: CYCLE_COLORS[activeCycle] }}
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-display text-3xl text-text-light">
                    {activeCycleData.title}
                  </h3>
                  <span className="font-mono text-[10px] text-text-muted/50 tracking-[0.2em] uppercase">
                    {activeCycleData.subtitle}
                  </span>
                </div>
                <p className="font-mono text-sm text-text-muted/70 leading-relaxed max-w-3xl">
                  {activeCycleData.description}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <CycleFlowchart data={activeCycleData} />
          </div>
        </div>
      )}

      {activeTab === 'comparison' && <MetabolismComparison />}

      {activeTab === 'search' && <PathwaySearch />}
    </div>
  );
}
