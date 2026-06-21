import { useState, useMemo, Fragment } from 'react';
import { GitCompare, X, ChevronDown, ChevronUp, Zap, TrendingUp, Activity, Award } from 'lucide-react';
import type { Microbe, BiogeochemicalCycle, MetabolismType } from '../../../shared/types';
import { METABOLISM_TYPE_LABELS, CYCLE_LABELS, CYCLE_COLORS, CATEGORY_LABELS, CATEGORY_COLORS } from '../../../shared/types';
import { microbeMetabolismProfiles } from '../../data/metabolismData';

interface MetabolismComparisonProps {
  microbes: Microbe[];
  onMicrobeClick?: (id: number, cycle?: BiogeochemicalCycle) => void;
  onPathwayClick?: (microbeId: number, cycle: BiogeochemicalCycle, stepId: string) => void;
}

export function MetabolismComparison({ microbes, onMicrobeClick, onPathwayClick }: MetabolismComparisonProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [expandedMicrobe, setExpandedMicrobe] = useState<number | null>(null);

  const availableProfiles = useMemo(() => {
    return microbeMetabolismProfiles.filter((p) =>
      microbes.some((m) => m.id === p.microbeId)
    );
  }, [microbes]);

  const selectedProfiles = useMemo(() => {
    return availableProfiles.filter((p) => selectedIds.includes(p.microbeId));
  }, [availableProfiles, selectedIds]);

  const allCycles: BiogeochemicalCycle[] = ['carbon', 'nitrogen', 'sulfur'];

  const metabolismTypeStats = useMemo(() => {
    if (selectedProfiles.length === 0) return [];
    const stats: { type: MetabolismType; count: number; totalEfficiency: number }[] = [];
    const typeMap = new Map<MetabolismType, { count: number; totalEfficiency: number }>();

    selectedProfiles.forEach((p) => {
      const seenTypes = new Set<MetabolismType>();
      p.pathways.forEach((pw) => {
        if (!seenTypes.has(pw.metabolismType)) {
          seenTypes.add(pw.metabolismType);
          const current = typeMap.get(pw.metabolismType) || { count: 0, totalEfficiency: 0 };
          typeMap.set(pw.metabolismType, {
            count: current.count + 1,
            totalEfficiency: current.totalEfficiency + pw.efficiency,
          });
        }
      });
    });

    typeMap.forEach((value, key) => {
      stats.push({ type: key, ...value });
    });

    return stats.sort((a, b) => b.count - a.count);
  }, [selectedProfiles]);

  const toggleMicrobe = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else if (selectedIds.length < 4) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getMicrobeInfo = (id: number) => microbes.find((m) => m.id === id);

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 0.85) return '#00ffc8';
    if (efficiency >= 0.6) return '#f1c40f';
    if (efficiency >= 0.4) return '#ff7b29';
    return '#e74c3c';
  };

  const getMicrobeScore = (profile: typeof selectedProfiles[number]) => {
    if (profile.pathways.length === 0) return 0;
    const avgEfficiency = profile.pathways.reduce((sum, pw) => sum + pw.efficiency, 0) / profile.pathways.length;
    const cycleCount = new Set(profile.pathways.map((pw) => pw.cycle)).size;
    return Math.round((avgEfficiency * 0.6 + (cycleCount / 3) * 0.4) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <GitCompare className="w-5 h-5 text-glow-primary" />
          <h3 className="font-display text-2xl text-text-light">代谢能力对比</h3>
        </div>
        <p className="font-mono text-sm text-text-muted/70 mb-5">
          选择最多4种微生物，对比它们在碳循环、氮循环和硫循环中的代谢能力与效率
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-4">
          {availableProfiles.map((profile) => {
            const microbe = getMicrobeInfo(profile.microbeId);
            if (!microbe) return null;
            const isSelected = selectedIds.includes(profile.microbeId);
            const score = getMicrobeScore(profile);

            return (
              <button
                key={profile.microbeId}
                onClick={() => toggleMicrobe(profile.microbeId)}
                className={`text-left p-3 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                  isSelected
                    ? 'bg-glow-primary/10 border-glow-primary/50 shadow-[0_0_15px_rgba(0,255,200,0.15)]'
                    : 'bg-background-card/50 border-glow-primary/10 hover:border-glow-primary/30'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-glow-primary flex items-center justify-center">
                    <span className="text-[10px] text-background-deep font-bold">✓</span>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: CATEGORY_COLORS[microbe.category],
                    }}
                  />
                  <span className="font-mono text-sm text-text-light truncate pr-6">
                    {microbe.name}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-mono text-[10px] text-text-muted/50">
                    {CATEGORY_LABELS[microbe.category]}
                  </span>
                  <div className="flex items-center gap-1">
                    <Award className="w-3 h-3 text-glow-gold" />
                    <span className="font-mono text-[10px] text-glow-gold">{score}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  {allCycles.map((cycle) => {
                    const hasCycle = profile.pathways.some((pw) => pw.cycle === cycle);
                    return (
                      <div
                        key={cycle}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: hasCycle ? CYCLE_COLORS[cycle] : '#2d4a46',
                          opacity: hasCycle ? 1 : 0.3,
                        }}
                      />
                    );
                  })}
                  <span className="font-mono text-[10px] text-text-muted/40 ml-1">
                    {profile.pathways.length}条路径
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] text-text-muted/50">已选择：</span>
            {selectedIds.map((id) => {
              const m = getMicrobeInfo(id);
              if (!m) return null;
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-glow-primary/10 border border-glow-primary/30 text-glow-primary font-mono text-[11px]"
                >
                  {m.name}
                  <button onClick={() => toggleMicrobe(id)} className="hover:text-text-light">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            <button
              onClick={() => setSelectedIds([])}
              className="font-mono text-[10px] text-text-muted/50 hover:text-glow-red transition-colors ml-2"
            >
              清除全部
            </button>
          </div>
        )}
      </div>

      {selectedProfiles.length >= 2 && (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-5 h-5 text-glow-primary" />
                <h4 className="font-display text-xl text-text-light">综合代谢评分</h4>
              </div>
              <div className="space-y-4">
                {selectedProfiles
                  .map((p) => ({ profile: p, score: getMicrobeScore(p) }))
                  .sort((a, b) => b.score - a.score)
                  .map(({ profile, score }, idx) => {
                    const microbe = getMicrobeInfo(profile.microbeId);
                    if (!microbe) return null;
                    const maxScore = 100;
                    return (
                      <div key={profile.microbeId}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-mono text-xs w-5 h-5 rounded-full flex items-center justify-center ${
                                idx === 0
                                  ? 'bg-glow-gold/20 text-glow-gold border border-glow-gold/50'
                                  : idx === 1
                                  ? 'bg-text-muted/20 text-text-muted border border-text-muted/30'
                                  : 'bg-glow-orange/20 text-glow-orange border border-glow-orange/30'
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <span className="font-mono text-sm text-text-light">{microbe.name}</span>
                          </div>
                          <span
                            className="font-mono text-sm font-bold"
                            style={{ color: getEfficiencyColor(score / 100) }}
                          >
                            {score}分
                          </span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-background-muted overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${(score / maxScore) * 100}%`,
                              backgroundColor: getEfficiencyColor(score / 100),
                              boxShadow: `0 0 10px ${getEfficiencyColor(score / 100)}40`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <Activity className="w-5 h-5 text-glow-purple" />
                <h4 className="font-display text-xl text-text-light">代谢类型分布</h4>
              </div>
              {metabolismTypeStats.length > 0 ? (
                <div className="space-y-3">
                  {metabolismTypeStats.slice(0, 6).map((stat) => {
                    const percentage = (stat.count / selectedProfiles.length) * 100;
                    const avgEff = stat.totalEfficiency / stat.count;
                    return (
                      <div key={stat.type}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs text-text-light">
                            {METABOLISM_TYPE_LABELS[stat.type]}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-text-muted/50">
                              {stat.count}/{selectedProfiles.length}
                            </span>
                            <span
                              className="font-mono text-[10px]"
                              style={{ color: getEfficiencyColor(avgEff) }}
                            >
                              ~{Math.round(avgEff * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-2 rounded-full bg-background-muted overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r"
                            style={{
                              width: `${percentage}%`,
                              background: `linear-gradient(90deg, ${getEfficiencyColor(avgEff)}88, ${getEfficiencyColor(avgEff)})`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="font-mono text-sm text-text-muted/50 text-center py-4">暂无数据</p>
              )}
            </div>
          </div>

          <div className="glass-card p-6">
            <h4 className="font-display text-xl text-text-light mb-5">代谢路径概览</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-glow-primary/10">
                    <th className="text-left font-mono text-xs text-text-muted/60 py-3 px-3">
                      代谢路径
                    </th>
                    <th className="text-left font-mono text-xs text-text-muted/60 py-3 px-3">
                      代谢类型
                    </th>
                    {selectedProfiles.map((p) => (
                      <th key={p.microbeId} className="text-center font-mono text-xs text-text-muted/60 py-3 px-3 min-w-[100px]">
                        {p.microbeName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allCycles.map((cycle) => {
                    const cycleSteps = new Map<string, { role: string; efficiency: number; metabolismType: MetabolismType }[]>();
                    selectedProfiles.forEach((p) => {
                      const pathways = p.pathways.filter((pw) => pw.cycle === cycle);
                      pathways.forEach((pw) => {
                        if (!cycleSteps.has(pw.stepId)) {
                          cycleSteps.set(pw.stepId, []);
                        }
                        cycleSteps.get(pw.stepId)!.push({
                          role: pw.role,
                          efficiency: pw.efficiency,
                          metabolismType: pw.metabolismType,
                        });
                      });
                    });

                    if (cycleSteps.size === 0) return null;

                    return (
                      <Fragment key={cycle}>
                        <tr key={`cycle-header-${cycle}`}>
                          <td
                            colSpan={2 + selectedProfiles.length}
                            className="py-2 px-3"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: CYCLE_COLORS[cycle] }}
                              />
                              <span
                                className="font-mono text-xs font-bold"
                                style={{ color: CYCLE_COLORS[cycle] }}
                              >
                                {CYCLE_LABELS[cycle]}
                              </span>
                            </div>
                          </td>
                        </tr>
                        {Array.from(cycleSteps.entries()).map(([stepId, profiles], idx) => (
                          <tr
                            key={`${cycle}-${stepId}-${idx}`}
                            className="border-b border-white/5 hover:bg-glow-primary/5"
                          >
                            <td className="py-3 px-3 font-mono text-sm text-text-light">
                              {profiles[0]?.role || stepId}
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-mono text-[11px] px-2 py-0.5 rounded-full border border-glow-primary/20 text-glow-primary bg-glow-primary/5">
                                {profiles[0] ? METABOLISM_TYPE_LABELS[profiles[0].metabolismType] : '-'}
                              </span>
                            </td>
                            {selectedProfiles.map((p) => {
                              const pathway = p.pathways.find(
                                (pw) => pw.cycle === cycle && pw.stepId === stepId
                              );
                              return (
                                <td key={p.microbeId} className="py-3 px-3 text-center">
                                  {pathway ? (
                                    <div className="flex flex-col items-center gap-1">
                                      <div className="w-16 h-2 rounded-full bg-background-muted overflow-hidden">
                                        <div
                                          className="h-full rounded-full transition-all duration-500"
                                          style={{
                                            width: `${pathway.efficiency * 100}%`,
                                            backgroundColor: getEfficiencyColor(pathway.efficiency),
                                          }}
                                        />
                                      </div>
                                      <span
                                        className="font-mono text-[10px]"
                                        style={{ color: getEfficiencyColor(pathway.efficiency) }}
                                      >
                                        {Math.round(pathway.efficiency * 100)}%
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="font-mono text-[10px] text-text-muted/30">-</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card p-6">
            <h4 className="font-display text-xl text-text-light mb-5">代谢能力雷达</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {selectedProfiles.map((profile) => {
                const microbe = getMicrobeInfo(profile.microbeId);
                if (!microbe) return null;
                const isExpanded = expandedMicrobe === profile.microbeId;

                const cycleScores = allCycles.map((cycle) => {
                  const pathways = profile.pathways.filter((pw) => pw.cycle === cycle);
                  const avgEff = pathways.length > 0
                    ? pathways.reduce((sum, pw) => sum + pw.efficiency, 0) / pathways.length
                    : 0;
                  return { cycle, avgEff, count: pathways.length };
                });

                const score = getMicrobeScore(profile);
                const maxBarHeight = 80;

                return (
                  <div
                    key={profile.microbeId}
                    className="glass-card p-4 cursor-pointer hover:border-glow-primary/40 transition-all"
                    onClick={() => {
                      const cycleCounts = allCycles.map((cycle) => ({
                        cycle,
                        count: profile.pathways.filter((pw) => pw.cycle === cycle).length,
                      }));
                      const topCycle = cycleCounts.sort((a, b) => b.count - a.count)[0];
                      setExpandedMicrobe(isExpanded ? null : profile.microbeId);
                      onMicrobeClick?.(
                        profile.microbeId,
                        topCycle && topCycle.count > 0 ? topCycle.cycle : undefined
                      );
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[microbe.category] }}
                        />
                        <span className="font-mono text-sm text-text-light truncate">
                          {microbe.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3 text-glow-gold" />
                        <span className="font-mono text-xs text-glow-gold font-bold">{score}</span>
                      </div>
                    </div>

                    <div className="flex items-end justify-around gap-2" style={{ height: maxBarHeight + 20 }}>
                      {cycleScores.map(({ cycle, avgEff, count }) => (
                        <div key={cycle} className="flex flex-col items-center gap-1">
                          <span
                            className="font-mono text-[10px]"
                            style={{ color: getEfficiencyColor(avgEff) }}
                          >
                            {avgEff > 0 ? Math.round(avgEff * 100) + '%' : '-'}
                          </span>
                          <div
                            className="w-8 rounded-t-md transition-all duration-500 relative"
                            style={{
                              height: avgEff > 0 ? Math.max(4, avgEff * maxBarHeight) : 4,
                              backgroundColor: avgEff > 0 ? CYCLE_COLORS[cycle] : '#2d4a46',
                              opacity: avgEff > 0 ? 0.8 : 0.3,
                            }}
                          >
                            {count > 0 && (
                              <span className="absolute -top-4 left-1/2 -translate-x-1/2 font-mono text-[8px] text-text-muted/60">
                                {count}条
                              </span>
                            )}
                          </div>
                          <span
                            className="font-mono text-[9px]"
                            style={{ color: CYCLE_COLORS[cycle] }}
                          >
                            {CYCLE_LABELS[cycle].replace('循环', '')}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 pt-3 border-t border-glow-primary/10">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-text-muted/50">
                          代谢路径总数
                        </span>
                        <span className="font-mono text-sm text-glow-primary">
                          {profile.pathways.length}
                        </span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-glow-primary/10 space-y-2 animate-fade-in-up">
                        {profile.pathways.map((pw, idx) => (
                          <button
                            key={idx}
                            className="w-full text-left flex items-start gap-2 p-1.5 -mx-1.5 rounded-lg hover:bg-glow-primary/10 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              onPathwayClick?.(profile.microbeId, pw.cycle, pw.stepId);
                            }}
                          >
                            <Zap className="w-3 h-3 mt-0.5 shrink-0" style={{ color: CYCLE_COLORS[pw.cycle] }} />
                            <div className="flex-1 min-w-0">
                              <p className="font-mono text-[11px] text-text-light">{pw.role}</p>
                              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                <span
                                  className="font-mono text-[9px] px-1.5 py-0.5 rounded border"
                                  style={{
                                    color: CYCLE_COLORS[pw.cycle],
                                    borderColor: CYCLE_COLORS[pw.cycle] + '44',
                                    backgroundColor: CYCLE_COLORS[pw.cycle] + '10',
                                  }}
                                >
                                  {CYCLE_LABELS[pw.cycle]}
                                </span>
                                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-glow-primary/20 text-glow-primary bg-glow-primary/5">
                                  {METABOLISM_TYPE_LABELS[pw.metabolismType]}
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-center text-text-muted/40">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {selectedProfiles.length === 1 && (
        <div className="glass-card p-6">
          <p className="font-mono text-sm text-text-muted/60 text-center">
            请至少选择2种微生物以查看对比分析
          </p>
        </div>
      )}

      {selectedProfiles.length === 0 && (
        <div className="glass-card p-8 text-center">
          <GitCompare className="w-10 h-10 text-text-muted/20 mx-auto mb-3" />
          <p className="font-mono text-sm text-text-muted/50">选择微生物开始对比分析</p>
          <p className="font-mono text-[10px] text-text-muted/30 mt-1">
            点击上方微生物卡片添加至对比面板（最多4种）
          </p>
        </div>
      )}
    </div>
  );
}
