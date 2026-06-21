import { useEffect, useState } from 'react';
import {
  Globe2,
  Network,
  Heart,
  Swords,
  Bug,
  Skull,
  Filter,
  Info,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { NetworkGraph } from './NetworkGraph';
import { MicrobeRelationsPanel } from './MicrobeRelationsPanel';
import { PathExplorer } from './PathExplorer';
import type { EcologicalRelationType, Microbe } from '../../../shared/types';
import {
  RELATION_TYPE_COLORS,
  RELATION_TYPE_LABELS,
  RELATION_TYPE_DESCRIPTIONS,
} from '../../../shared/types';

const ALL_RELATION_TYPES: EcologicalRelationType[] = [
  'symbiosis',
  'competition',
  'parasitism',
  'predation',
];

const RELATION_ICONS: Record<EcologicalRelationType, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  symbiosis: Heart,
  competition: Swords,
  parasitism: Bug,
  predation: Skull,
};

export function MicrobialNetworkLab() {
  const { microbes, fetchMicrobes } = useAppStore();
  const [selectedMicrobeId, setSelectedMicrobeId] = useState<number | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<number[]>([]);
  const [activeRelationTypes, setActiveRelationTypes] = useState<EcologicalRelationType[]>([
    ...ALL_RELATION_TYPES,
  ]);
  const [showLegend, setShowLegend] = useState(true);
  const [rightPanel, setRightPanel] = useState<'details' | 'paths'>('details');

  useEffect(() => {
    if (microbes.length === 0) {
      fetchMicrobes();
    }
  }, [microbes.length, fetchMicrobes]);

  const selectedMicrobe: Microbe | undefined = microbes.find(
    (m) => m.id === selectedMicrobeId
  );

  const toggleRelationType = (type: EcologicalRelationType) => {
    setActiveRelationTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSelectMicrobe = (id: number | null) => {
    setSelectedMicrobeId(id);
    if (id !== null) {
      setHighlightedPath([]);
      setRightPanel('details');
    }
  };

  const handleSelectPath = (path: number[]) => {
    setHighlightedPath(path);
    setSelectedMicrobeId(null);
  };

  const stats = {
    nodes: microbes.length,
    edges: 40,
    symbiosis: 10,
    competition: 15,
    parasitism: 12,
    predation: 3,
  };

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-glow-purple/30 bg-glow-purple/5 backdrop-blur-sm mb-6">
          <Globe2 className="w-4 h-4 text-glow-purple" />
          <span className="font-mono text-xs text-glow-purple tracking-[0.2em] uppercase">
            Microbial Ecological Network
          </span>
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-semibold text-text-light mb-6">
          微生物<span className="text-gradient-primary">关系网络馆</span>
        </h1>
        <p className="font-mono text-text-muted/70 max-w-2xl mx-auto">
          探索微生物之间复杂的生态关系——共生、竞争、寄生、捕食构成的生命网络。
          发现隐藏的生态路径，理解微生物世界的微妙平衡。
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-glow-primary/10 border border-glow-primary/30">
            <Network className="w-6 h-6 text-glow-primary" />
          </div>
          <div>
            <p className="font-mono text-[10px] text-text-muted/60">微生物种类</p>
            <p className="font-mono text-2xl font-bold text-text-light">{stats.nodes}</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-glow-purple/10 border border-glow-purple/30">
            <Globe2 className="w-6 h-6 text-glow-purple" />
          </div>
          <div>
            <p className="font-mono text-[10px] text-text-muted/60">关系总数</p>
            <p className="font-mono text-2xl font-bold text-text-light">{stats.edges}</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30">
            <Heart className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p className="font-mono text-[10px] text-text-muted/60">共生关系</p>
            <p className="font-mono text-2xl font-bold text-green-400">{stats.symbiosis}</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-glow-red/10 border border-glow-red/30">
            <Skull className="w-6 h-6 text-glow-red" />
          </div>
          <div>
            <p className="font-mono text-[10px] text-text-muted/60">捕食/寄生</p>
            <p className="font-mono text-2xl font-bold text-glow-red">
              {stats.parasitism + stats.predation}
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-text-muted/60" />
            <span className="font-mono text-xs text-text-muted/60">关系类型筛选：</span>
            <div className="flex flex-wrap gap-2">
              {ALL_RELATION_TYPES.map((type) => {
                const Icon = RELATION_ICONS[type];
                const active = activeRelationTypes.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleRelationType(type)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                      active
                        ? 'border-opacity-100 shadow-[0_0_15px_var(--tw-shadow-color)]'
                        : 'border-opacity-20 opacity-50'
                    }`}
                    style={{
                      '--tw-shadow-color': `${RELATION_TYPE_COLORS[type]}40`,
                      borderColor: active ? RELATION_TYPE_COLORS[type] : `${RELATION_TYPE_COLORS[type]}40`,
                      backgroundColor: active ? `${RELATION_TYPE_COLORS[type]}15` : 'transparent',
                      color: active ? RELATION_TYPE_COLORS[type] : `${RELATION_TYPE_COLORS[type]}90`,
                    } as React.CSSProperties}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="font-mono text-[11px]">{RELATION_TYPE_LABELS[type]}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-glow-primary/30 hover:bg-glow-primary/10 transition-all"
            >
              <Info className="w-3.5 h-3.5 text-glow-primary" />
              <span className="font-mono text-[11px] text-glow-primary">
                {showLegend ? '隐藏图例' : '显示图例'}
              </span>
            </button>
          </div>
        </div>

        {showLegend && (
          <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4">
            {ALL_RELATION_TYPES.map((type) => {
              const Icon = RELATION_ICONS[type];
              return (
                <div key={type} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      backgroundColor: `${RELATION_TYPE_COLORS[type]}15`,
                      border: `1px solid ${RELATION_TYPE_COLORS[type]}40`,
                    }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: RELATION_TYPE_COLORS[type] }}
                    />
                  </div>
                  <div>
                    <p
                      className="font-mono text-sm font-semibold"
                      style={{ color: RELATION_TYPE_COLORS[type] }}
                    >
                      {RELATION_TYPE_LABELS[type]}
                    </p>
                    <p className="font-mono text-[10px] text-text-muted/60 leading-relaxed mt-0.5">
                      {RELATION_TYPE_DESCRIPTIONS[type]}
                    </p>
                    {type === 'competition' && (
                      <p className="font-mono text-[9px] text-text-muted/40 mt-1">
                        样式：虚线
                      </p>
                    )}
                    {(type === 'parasitism' || type === 'predation') && (
                      <p className="font-mono text-[9px] text-text-muted/40 mt-1">
                        箭头方向：作用方向
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        <div className="glass-card p-0 overflow-hidden" style={{ minHeight: 620 }}>
          <NetworkGraph
            microbes={microbes}
            selectedMicrobeId={selectedMicrobeId}
            onSelectMicrobe={handleSelectMicrobe}
            highlightedPath={highlightedPath}
            activeRelationTypes={activeRelationTypes}
          />
        </div>

        <div className="space-y-4" style={{ minHeight: 620 }}>
          <div className="flex gap-2">
            <button
              onClick={() => setRightPanel('details')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                rightPanel === 'details'
                  ? 'bg-glow-primary/15 border-glow-primary/60 text-glow-primary shadow-[0_0_15px_rgba(0,255,200,0.15)]'
                  : 'border-white/10 text-text-muted/60 hover:text-text-light hover:border-white/20'
              }`}
            >
              <Network className="w-4 h-4" />
              <span className="font-mono text-xs">微生物详情</span>
            </button>
            <button
              onClick={() => setRightPanel('paths')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                rightPanel === 'paths'
                  ? 'bg-glow-purple/15 border-glow-purple/60 text-glow-purple shadow-[0_0_15px_rgba(155,89,182,0.15)]'
                  : 'border-white/10 text-text-muted/60 hover:text-text-light hover:border-white/20'
              }`}
            >
              <Globe2 className="w-4 h-4" />
              <span className="font-mono text-xs">路径探索</span>
            </button>
          </div>

          <div style={{ height: 'calc(100% - 52px)' }}>
            {rightPanel === 'details' ? (
              selectedMicrobe ? (
                <MicrobeRelationsPanel
                  microbe={selectedMicrobe}
                  allMicrobes={microbes}
                  onClose={() => handleSelectMicrobe(null)}
                  onSelectMicrobe={(id) => handleSelectMicrobe(id)}
                />
              ) : (
                <div className="glass-card p-8 h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-glow-primary/10 border border-glow-primary/30 flex items-center justify-center mb-5">
                    <Network className="w-10 h-10 text-glow-primary/50" />
                  </div>
                  <h4 className="font-display text-xl text-text-light mb-2">
                    点击网络中的节点
                  </h4>
                  <p className="font-mono text-xs text-text-muted/60 max-w-xs leading-relaxed">
                    选择任意微生物查看其详细生态关系，包括共生伙伴、竞争者、天敌等信息。
                  </p>
                  <div className="mt-6 space-y-2 w-full max-w-xs">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted/50">
                      <span className="w-2 h-2 rounded-full bg-glow-primary" />
                      绿色节点 = 细菌
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted/50">
                      <span className="w-2 h-2 rounded-full bg-glow-purple" />
                      紫色节点 = 真菌
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted/50">
                      <span className="w-2 h-2 rounded-full bg-glow-red" />
                      红色节点 = 病毒
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted/50">
                      <span className="w-2 h-2 rounded-full bg-glow-gold" />
                      金色节点 = 古菌
                    </div>
                  </div>
                </div>
              )
            ) : (
              <PathExplorer
                microbes={microbes}
                onSelectPath={handleSelectPath}
                selectedPath={highlightedPath}
                onClearPath={() => setHighlightedPath([])}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
