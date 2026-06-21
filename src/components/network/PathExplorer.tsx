import { useState, useMemo } from 'react';
import {
  Search,
  ArrowRightLeft,
  Route,
  Sparkles,
  ChevronRight,
  Shuffle,
  X,
} from 'lucide-react';
import type { Microbe, EcologicalRelation } from '../../../shared/types';
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  RELATION_TYPE_COLORS,
  RELATION_TYPE_LABELS,
} from '../../../shared/types';
import { findAllPaths } from '../../data/ecologicalRelations';

interface PathExplorerProps {
  microbes: Microbe[];
  onSelectPath: (path: number[]) => void;
  selectedPath: number[];
  onClearPath: () => void;
}

interface SearchSelectProps {
  label: string;
  value: Microbe | null;
  microbes: Microbe[];
  onChange: (m: Microbe | null) => void;
  excludeId?: number | null;
}

function SearchSelect({ label, value, microbes, onChange, excludeId }: SearchSelectProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return microbes.filter((m) => {
      if (excludeId && m.id === excludeId) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.scientificName.toLowerCase().includes(q) ||
        CATEGORY_LABELS[m.category].includes(q)
      );
    });
  }, [query, microbes, excludeId]);

  return (
    <div className="relative">
      <label className="font-mono text-xs text-text-muted/60 block mb-1.5">{label}</label>
      {value ? (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all"
          style={{
            backgroundColor: `${CATEGORY_COLORS[value.category]}10`,
            borderColor: `${CATEGORY_COLORS[value.category]}40`,
          }}
          onClick={() => setOpen(!open)}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: `${CATEGORY_COLORS[value.category]}30`,
              border: `2px solid ${CATEGORY_COLORS[value.category]}`,
            }}
          >
            <span
              className="font-mono text-xs font-bold"
              style={{ color: CATEGORY_COLORS[value.category] }}
            >
              {value.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-sm text-text-light truncate">{value.name}</p>
            <p className="font-mono text-[10px] text-text-muted/60 truncate">
              {CATEGORY_LABELS[value.category]} · {value.scientificName}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
              setQuery('');
            }}
            className="p-1 rounded hover:bg-background-card/60 text-text-muted hover:text-text-light"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div
          className="relative"
          onClick={() => setOpen(true)}
        >
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-background-card/60 border border-glow-primary/20 cursor-pointer hover:border-glow-primary/40 transition-all">
            <Search className="w-4 h-4 text-text-muted/50" />
            <input
              type="text"
              placeholder="搜索或选择微生物..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
              className="flex-1 bg-transparent outline-none font-mono text-sm text-text-light placeholder:text-text-muted/40"
            />
          </div>
          {open && filtered.length > 0 && (
            <div
              className="absolute top-full left-0 right-0 mt-2 glass-card max-h-64 overflow-y-auto z-30"
              onClick={(e) => e.stopPropagation()}
            >
              {filtered.slice(0, 15).map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    onChange(m);
                    setQuery('');
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2.5 hover:bg-glow-primary/10 cursor-pointer border-b border-white/5 last:border-0 transition-colors"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `${CATEGORY_COLORS[m.category]}20`,
                      border: `1.5px solid ${CATEGORY_COLORS[m.category]}`,
                    }}
                  >
                    <span
                      className="font-mono text-[10px] font-bold"
                      style={{ color: CATEGORY_COLORS[m.category] }}
                    >
                      {m.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-text-light truncate">{m.name}</p>
                    <p className="font-mono text-[9px] text-text-muted/50 truncate">
                      {CATEGORY_LABELS[m.category]}
                    </p>
                  </div>
                </div>
              ))}
              {filtered.length > 15 && (
                <div className="px-3 py-2 font-mono text-[10px] text-text-muted/50 text-center border-t border-white/5">
                  仅显示前 15 条结果...
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {open && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}

export function PathExplorer({
  microbes,
  onSelectPath,
  selectedPath,
  onClearPath,
}: PathExplorerProps) {
  const [fromMicrobe, setFromMicrobe] = useState<Microbe | null>(null);
  const [toMicrobe, setToMicrobe] = useState<Microbe | null>(null);
  const [maxDepth, setMaxDepth] = useState(4);

  const paths = useMemo(() => {
    if (!fromMicrobe || !toMicrobe) return [];
    return findAllPaths(fromMicrobe.id, toMicrobe.id, maxDepth);
  }, [fromMicrobe, toMicrobe, maxDepth]);

  const microbeMap = useMemo(
    () => new Map(microbes.map((m) => [m.id, m])),
    [microbes]
  );

  const handleSwap = () => {
    const temp = fromMicrobe;
    setFromMicrobe(toMicrobe);
    setToMicrobe(temp);
  };

  const handleRandomExample = () => {
    const connected = [
      [11, 6],
      [15, 8],
      [9, 2],
      [18, 5],
      [21, 22],
    ];
    const pair = connected[Math.floor(Math.random() * connected.length)];
    setFromMicrobe(microbeMap.get(pair[0]) || null);
    setToMicrobe(microbeMap.get(pair[1]) || null);
  };

  const getRelationColor = (rel: EcologicalRelation, fromId: number, toId: number): string => {
    if (rel.type === 'symbiosis') return RELATION_TYPE_COLORS.symbiosis;
    if (rel.type === 'competition') return RELATION_TYPE_COLORS.competition;
    if (rel.type === 'parasitism') {
      return rel.sourceId === fromId && rel.targetId === toId
        ? RELATION_TYPE_COLORS.parasitism
        : RELATION_TYPE_COLORS.parasitism;
    }
    if (rel.type === 'predation') {
      return rel.sourceId === fromId && rel.targetId === toId
        ? RELATION_TYPE_COLORS.predation
        : RELATION_TYPE_COLORS.predation;
    }
    return '#888';
  };

  return (
    <div className="glass-card p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-glow-purple/10 border border-glow-purple/30">
            <Route className="w-5 h-5 text-glow-purple" />
          </div>
          <div>
            <h3 className="font-display text-xl text-text-light">关系路径探索</h3>
            <p className="font-mono text-[10px] text-text-muted/60">发现微生物间的间接联系</p>
          </div>
        </div>
        <button
          onClick={handleRandomExample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-glow-primary/30
                     hover:border-glow-primary/60 hover:bg-glow-primary/10 transition-all"
          title="随机示例"
        >
          <Shuffle className="w-3.5 h-3.5 text-glow-primary" />
          <span className="font-mono text-[10px] text-glow-primary">随机示例</span>
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <SearchSelect
          label="起点微生物"
          value={fromMicrobe}
          microbes={microbes}
          onChange={setFromMicrobe}
          excludeId={toMicrobe?.id}
        />
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            disabled={!fromMicrobe || !toMicrobe}
            className="p-2 rounded-full bg-background-card/60 border border-glow-primary/20
                       hover:border-glow-primary/50 hover:bg-glow-primary/10 disabled:opacity-30
                       disabled:cursor-not-allowed transition-all"
            title="交换"
          >
            <ArrowRightLeft className="w-4 h-4 text-text-muted hover:text-glow-primary transition-colors" />
          </button>
        </div>
        <SearchSelect
          label="终点微生物"
          value={toMicrobe}
          microbes={microbes}
          onChange={setToMicrobe}
          excludeId={fromMicrobe?.id}
        />
      </div>

      <div className="mb-4">
        <label className="font-mono text-xs text-text-muted/60 flex items-center justify-between mb-1.5">
          <span>最大探索深度</span>
          <span className="text-glow-primary font-bold">{maxDepth} 步</span>
        </label>
        <input
          type="range"
          min={2}
          max={6}
          value={maxDepth}
          onChange={(e) => setMaxDepth(Number(e.target.value))}
          className="w-full h-1.5 bg-background-muted rounded-full appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-glow-purple
                     [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(155,89,182,0.5)]
                     [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
        {!fromMicrobe || !toMicrobe ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-8 px-4">
            <div className="w-16 h-16 rounded-2xl bg-glow-purple/10 border border-glow-purple/30 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-glow-purple/70" />
            </div>
            <p className="font-mono text-sm text-text-muted/70 mb-1">选择起点和终点微生物</p>
            <p className="font-mono text-[10px] text-text-muted/40">
              系统将自动搜索它们之间的所有生态路径
            </p>
          </div>
        ) : paths.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-8 px-4">
            <div className="w-16 h-16 rounded-2xl bg-glow-red/10 border border-glow-red/30 flex items-center justify-center mb-4">
              <Route className="w-8 h-8 text-glow-red/50" />
            </div>
            <p className="font-mono text-sm text-text-muted/70 mb-1">未找到连接路径</p>
            <p className="font-mono text-[10px] text-text-muted/40">
              尝试增加最大探索深度或选择其他微生物
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="font-mono text-[10px] text-text-muted/60">
                找到 {paths.length} 条路径
              </span>
              {selectedPath.length > 0 && (
                <button
                  onClick={onClearPath}
                  className="font-mono text-[10px] text-glow-red hover:text-glow-red/80"
                >
                  清除高亮
                </button>
              )}
            </div>
            {paths.map((pathData, idx) => {
              const isHighlighted =
                selectedPath.length === pathData.path.length &&
                selectedPath.every((id, i) => id === pathData.path[i]);

              return (
                <div
                  key={`path-${idx}`}
                  onClick={() => onSelectPath(pathData.path)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isHighlighted
                      ? 'bg-glow-purple/15 border-glow-purple/60 shadow-[0_0_20px_rgba(155,89,182,0.2)]'
                      : 'bg-background-card/40 border-white/5 hover:bg-background-card/70 hover:border-glow-purple/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-text-muted/50">
                        路径 #{idx + 1}
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-glow-purple/15 text-glow-purple">
                        {pathData.path.length - 1} 步
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-glow-primary/15 text-glow-primary">
                        强度 {(pathData.totalStrength * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-1 flex-wrap">
                    {pathData.path.map((id, i) => {
                      const m = microbeMap.get(id);
                      const rel = pathData.relations[i];
                      const nextId = pathData.path[i + 1];

                      return (
                        <div key={i} className="flex items-center gap-1">
                          <div
                            className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
                            style={{
                              backgroundColor: m ? `${CATEGORY_COLORS[m.category]}15` : '#333',
                              border: `1px solid ${m ? CATEGORY_COLORS[m.category] : '#555'}50`,
                            }}
                          >
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor: m
                                  ? `${CATEGORY_COLORS[m.category]}30`
                                  : '#555',
                              }}
                            >
                              <span
                                className="font-mono text-[9px] font-bold"
                                style={{
                                  color: m ? CATEGORY_COLORS[m.category] : '#999',
                                }}
                              >
                                {m ? m.name.charAt(0) : '?'}
                              </span>
                            </div>
                            <span className="font-mono text-[10px] text-text-light whitespace-nowrap">
                              {m?.name || '未知'}
                            </span>
                          </div>
                          {rel && nextId && (
                            <div
                              className="flex items-center gap-1 px-1.5 py-0.5 rounded"
                              style={{
                                backgroundColor: `${getRelationColor(rel, id, nextId)}15`,
                              }}
                            >
                              <ChevronRight
                                className="w-3 h-3"
                                style={{
                                  color: getRelationColor(rel, id, nextId),
                                }}
                              />
                              <span
                                className="font-mono text-[9px]"
                                style={{
                                  color: getRelationColor(rel, id, nextId),
                                }}
                              >
                                {RELATION_TYPE_LABELS[rel.type]}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
