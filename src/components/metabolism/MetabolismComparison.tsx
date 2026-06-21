import { useState, useMemo } from 'react';
import { Scale, Plus, X, TrendingUp, Check, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import {
  microbeMetabolismProfiles,
  getMicrobeCycles,
  getMicrobeMetabolismTypes,
} from '../../data/metabolismData';
import type {
  Microbe,
  BiogeochemicalCycle,
  MetabolismType,
} from '../../../shared/types';
import {
  CATEGORY_COLORS,
  CYCLE_COLORS,
  CYCLE_LABELS,
  METABOLISM_TYPE_LABELS,
} from '../../../shared/types';

export function MetabolismComparison() {
  const { microbes } = useAppStore();
  const [selectedIds, setSelectedIds] = useState<number[]>([1, 9, 21]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredMicrobes = useMemo(() => {
    if (!search.trim()) return microbes;
    const q = search.toLowerCase();
    return microbes.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.scientificName.toLowerCase().includes(q)
    );
  }, [microbes, search]);

  const selectedMicrobes: Microbe[] = selectedIds
    .map((id) => microbes.find((m) => m.id === id))
    .filter((m): m is Microbe => m !== undefined);

  const commonCycles = useMemo(() => {
    if (selectedMicrobes.length === 0) return [];
    const cyclesMap = new Map<BiogeochemicalCycle, number>();
    for (const m of selectedMicrobes) {
      for (const c of getMicrobeCycles(m.id)) {
        cyclesMap.set(c, (cyclesMap.get(c) ?? 0) + 1);
      }
    }
    return [...cyclesMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([cycle, count]) => ({ cycle, count }));
  }, [selectedMicrobes]);

  const commonMetabolismTypes = useMemo(() => {
    if (selectedMicrobes.length === 0) return [];
    const typesMap = new Map<MetabolismType, number>();
    for (const m of selectedMicrobes) {
      for (const t of getMicrobeMetabolismTypes(m.id)) {
        typesMap.set(t, (typesMap.get(t) ?? 0) + 1);
      }
    }
    return [...typesMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count }));
  }, [selectedMicrobes]);

  const complementarityScore = useMemo(() => {
    if (selectedMicrobes.length < 2) return 0;
    const allCycles = new Set<BiogeochemicalCycle>();
    const allTypes = new Set<MetabolismType>();
    for (const m of selectedMicrobes) {
      getMicrobeCycles(m.id).forEach((c) => allCycles.add(c));
      getMicrobeMetabolismTypes(m.id).forEach((t) => allTypes.add(t));
    }
    const cycleCoverage = allCycles.size / 3;
    const typeCoverage = allTypes.size / 12;
    return Math.round((cycleCoverage * 50 + typeCoverage * 50));
  }, [selectedMicrobes]);

  const handleAdd = (id: number) => {
    if (selectedIds.length >= 6) return;
    if (selectedIds.includes(id)) return;
    setSelectedIds([...selectedIds, id]);
    setPickerOpen(false);
    setSearch('');
  };

  const handleRemove = (id: number) => {
    setSelectedIds(selectedIds.filter((i) => i !== id));
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-glow-primary" />
            <h3 className="font-display text-xl text-text-light">代谢特征对比</h3>
          </div>
          <span className="font-mono text-xs text-text-muted/50">
            最多选择6种
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {selectedMicrobes.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border"
              style={{
                borderColor: CATEGORY_COLORS[m.category] + '44',
                backgroundColor: CATEGORY_COLORS[m.category] + '08',
              }}
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[m.category] }}
              />
              <span className="font-mono text-sm text-text-light">
                {m.name}
              </span>
              <button
                onClick={() => handleRemove(m.id)}
                className="w-5 h-5 rounded-md bg-glow-red/10 border border-glow-red/20 flex items-center justify-center text-glow-red hover:bg-glow-red/20 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {selectedIds.length < 6 && (
            <div className="relative">
              <button
                onClick={() => setPickerOpen(!pickerOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-glow-primary/30 text-glow-primary/70 hover:text-glow-primary hover:border-glow-primary/60 transition-all font-mono text-sm"
              >
                <Plus className="w-4 h-4" />
                添加
              </button>
              {pickerOpen && (
                <div className="absolute z-20 top-full mt-2 left-0 w-64 glass-card p-3 animate-fade-in-up">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="搜索..."
                    className="w-full px-3 py-2 rounded-lg bg-background-card/80 border border-glow-primary/20 text-text-light font-mono text-sm focus:outline-none focus:border-glow-primary/60 mb-2"
                    autoFocus
                  />
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {filteredMicrobes.map((m) => {
                      const disabled = selectedIds.includes(m.id);
                      return (
                        <button
                          key={m.id}
                          onClick={() => !disabled && handleAdd(m.id)}
                          disabled={disabled}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                            disabled
                              ? 'opacity-40 cursor-not-allowed'
                              : 'hover:bg-glow-primary/10'
                          }`}
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: CATEGORY_COLORS[m.category],
                            }}
                          />
                          <span className="font-mono text-sm text-text-light">
                            {m.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {selectedMicrobes.length >= 2 && (
          <div className="glass-card p-4 mb-4 flex items-center gap-4">
            <div>
              <p className="font-mono text-[10px] text-text-muted/50 mb-1">
                代谢互补性评分
              </p>
              <p
                className="font-display text-3xl font-bold"
                style={{
                  color:
                    complementarityScore >= 60
                      ? '#00ffc8'
                      : complementarityScore >= 30
                      ? '#f1c40f'
                      : '#e74c3c',
                }}
              >
                {complementarityScore}
              </p>
            </div>
            <div className="flex-1 h-3 rounded-full bg-background-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${complementarityScore}%`,
                  background:
                    complementarityScore >= 60
                      ? 'linear-gradient(90deg,#00ffc8,#00e5b0)'
                      : complementarityScore >= 30
                      ? 'linear-gradient(90deg,#f1c40f,#f39c12)'
                      : 'linear-gradient(90deg,#e74c3c,#c0392b)',
                }}
              />
            </div>
            {complementarityScore >= 60 ? (
              <div className="flex items-center gap-1 text-glow-primary">
                <Check className="w-4 h-4" />
                <span className="font-mono text-xs">互补性良好</span>
              </div>
            ) : complementarityScore >= 30 ? (
              <div className="flex items-center gap-1 text-glow-yellow">
                <TrendingUp className="w-4 h-4" />
                <span className="font-mono text-xs">部分互补</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-glow-red">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-mono text-xs">高度重叠</span>
              </div>
            )}
          </div>
        )}

        {selectedMicrobes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-glow-primary/10">
                  <th className="text-left py-3 px-2 font-mono text-[10px] text-text-muted/50 w-24">
                    特征
                  </th>
                  {selectedMicrobes.map((m) => (
                    <th
                      key={m.id}
                      className="text-center py-3 px-2 font-mono text-[10px]"
                    >
                      <div
                        className="w-2 h-2 rounded-full mx-auto mb-1"
                        style={{
                          backgroundColor: CATEGORY_COLORS[m.category],
                        }}
                      />
                      {m.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-glow-primary/5">
                  <td className="py-3 px-2 font-mono text-[10px] text-text-muted/50 align-top">
                    参与循环
                  </td>
                  {selectedMicrobes.map((m) => {
                    const cycles = getMicrobeCycles(m.id);
                    return (
                      <td
                        key={m.id}
                        className="py-3 px-2 text-center align-top"
                      >
                        <div className="flex flex-wrap gap-1 justify-center">
                          {cycles.map((c) => (
                            <span
                              key={c}
                              className="font-mono text-[9px] px-1.5 py-0.5 rounded border"
                              style={{
                                color: CYCLE_COLORS[c],
                                borderColor: CYCLE_COLORS[c] + '44',
                                backgroundColor: CYCLE_COLORS[c] + '10',
                              }}
                            >
                              {CYCLE_LABELS[c]}
                            </span>
                          ))}
                          {cycles.length === 0 && (
                            <span className="font-mono text-[9px] text-text-muted/30">
                              -
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b border-glow-primary/5">
                  <td className="py-3 px-2 font-mono text-[10px] text-text-muted/50 align-top">
                    代谢类型
                  </td>
                  {selectedMicrobes.map((m) => {
                    const types = getMicrobeMetabolismTypes(m.id);
                    return (
                      <td
                        key={m.id}
                        className="py-3 px-2 text-center align-top"
                      >
                        <div className="flex flex-col gap-1">
                          {types.map((t) => (
                            <span
                              key={t}
                              className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-background-card/50 border border-white/5 text-text-light"
                            >
                              {METABOLISM_TYPE_LABELS[t]}
                            </span>
                          ))}
                          {types.length === 0 && (
                            <span className="font-mono text-[9px] text-text-muted/30">
                              -
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 px-2 font-mono text-[10px] text-text-muted/50 align-top">
                    途径数量
                  </td>
                  {selectedMicrobes.map((m) => {
                    const profile = microbeMetabolismProfiles.find(
                      (p) => p.microbeId === m.id
                    );
                    return (
                      <td
                        key={m.id}
                        className="py-3 px-2 text-center align-top"
                      >
                        <span className="font-display text-lg text-glow-primary">
                          {profile?.pathways.length ?? 0}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="font-mono text-sm text-text-muted/50">
              请添加至少1种微生物进行代谢特征对比
            </p>
          </div>
        )}

        {(commonCycles.length > 0 || commonMetabolismTypes.length > 0) && (
          <div className="grid sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-glow-primary/10">
            <div className="glass-card p-4">
              <p className="font-mono text-[10px] text-text-muted/50 mb-3">
                参与生物地球化学循环
              </p>
              <div className="space-y-2">
                {commonCycles.map(({ cycle, count }) => (
                  <div key={cycle} className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: CYCLE_COLORS[cycle] }}
                    />
                    <span className="font-mono text-xs text-text-light flex-1">
                      {CYCLE_LABELS[cycle]}
                    </span>
                    <div className="flex -space-x-1">
                      {Array.from({ length: count }).map((_, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border-2 border-background-deep"
                          style={{ backgroundColor: CYCLE_COLORS[cycle] + '40' }}
                        />
                      ))}
                    </div>
                    <span
                      className="font-mono text-xs"
                      style={{ color: CYCLE_COLORS[cycle] }}
                    >
                      {count}/{selectedMicrobes.length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card p-4">
              <p className="font-mono text-[10px] text-text-muted/50 mb-3">
                共有的代谢类型
              </p>
              <div className="space-y-2">
                {commonMetabolismTypes.slice(0, 5).map(({ type, count }) => (
                  <div
                    key={type}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="font-mono text-xs text-text-light flex-1">
                      {METABOLISM_TYPE_LABELS[type]}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-background-muted overflow-hidden mx-2 max-w-[120px]">
                      <div
                        className="h-full rounded-full bg-glow-primary/50"
                        style={{
                          width: `${(count / selectedMicrobes.length) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="font-mono text-xs text-glow-primary">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
