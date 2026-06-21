import { useEffect, useState, useMemo } from 'react';
import {
  Thermometer,
  Droplets,
  FlaskConical,
  Leaf,
  Clock,
  Play,
  Save,
  RefreshCw,
  Microscope,
  Sparkles,
  GitCompare,
  X,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { GrowthChart } from '../components/GrowthChart';
import { ExperimentList } from '../components/ExperimentList';
import type { ExperimentConditions, ExperimentRecord } from '../../shared/types';
import {
  DEFAULT_CONDITIONS,
  EXPERIMENT_COLORS,
  CATEGORY_LABELS,
} from '../../shared/types';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  optimal?: [number, number];
  onChange: (v: number) => void;
}

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  icon: Icon,
  optimal,
  onChange,
}: SliderControlProps) {
  const isOptimal =
    optimal && value >= optimal[0] && value <= optimal[1];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon
            className={`w-4 h-4 ${
              isOptimal ? 'text-glow-primary' : 'text-text-muted'
            }`}
          />
          <span className="font-mono text-sm text-text-light">{label}</span>
          {optimal && (
            <span className="font-mono text-[10px] text-glow-primary/70">
              最优: {optimal[0]}~{optimal[1]}{unit}
            </span>
          )}
        </div>
        <span
          className={`font-mono text-sm font-bold ${
            isOptimal ? 'text-glow-primary' : 'text-text-light'
          }`}
        >
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-background-muted rounded-full appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-4
                   [&::-webkit-slider-thumb]:h-4
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-glow-primary
                   [&::-webkit-slider-thumb]:shadow-glow
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-webkit-slider-thumb]:transition-all
                   hover:[&::-webkit-slider-thumb]:scale-110"
      />
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toLocaleString();
}

export function LabPage() {
  const {
    microbes,
    fetchMicrobes,
    currentGrowthData,
    experiments,
    comparisonExperimentIds,
    runSimulation,
    saveExperiment,
    deleteExperiment,
    clearCurrentSimulation,
    toggleComparison,
    clearComparison,
    getOptimalConditions,
  } = useAppStore();

  const [conditions, setConditions] =
    useState<ExperimentConditions>(DEFAULT_CONDITIONS);
  const [expName, setExpName] = useState('');
  const [expNotes, setExpNotes] = useState('');
  const [viewingExperiment, setViewingExperiment] =
    useState<ExperimentRecord | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    fetchMicrobes();
  }, [fetchMicrobes]);

  const optimal = useMemo(
    () => getOptimalConditions(conditions.microbeId),
    [conditions.microbeId, getOptimalConditions]
  );

  useEffect(() => {
    const selectedMicrobe = microbes.find(
      (m) => m.id === conditions.microbeId
    );
    if (selectedMicrobe) {
      setConditions((c) => ({
        ...c,
        microbeName: selectedMicrobe.name,
      }));
    }
  }, [conditions.microbeId, microbes]);

  const chartSeries = useMemo(() => {
    const series = [];

    if (viewingExperiment) {
      const viewIdx = experiments.findIndex(
        (e) => e.id === viewingExperiment.id
      );
      series.push({
        label: viewingExperiment.name,
        data: viewingExperiment.growthData,
        color: EXPERIMENT_COLORS[viewIdx % EXPERIMENT_COLORS.length],
      });
    } else if (currentGrowthData) {
      series.push({
        label: '当前模拟',
        data: currentGrowthData,
        color: EXPERIMENT_COLORS[0],
      });
    }

    comparisonExperimentIds.forEach((id) => {
      const exp = experiments.find((e) => e.id === id);
      if (exp && exp.id !== viewingExperiment?.id) {
        const expIdx = experiments.findIndex((e) => e.id === id);
        series.push({
          label: exp.name,
          data: exp.growthData,
          color:
            EXPERIMENT_COLORS[(expIdx + (viewingExperiment ? 1 : 0)) % EXPERIMENT_COLORS.length],
        });
      }
    });

    return series;
  }, [currentGrowthData, experiments, comparisonExperimentIds, viewingExperiment]);

  const handleRunSimulation = () => {
    setViewingExperiment(null);
    runSimulation(conditions);
  };

  const handleSaveExperiment = () => {
    if (!expName.trim()) return;
    const record = saveExperiment(expName.trim(), conditions, expNotes.trim() || undefined);
    if (record) {
      setShowSaveModal(false);
      setExpName('');
      setExpNotes('');
    }
  };

  const handleViewExperiment = (exp: ExperimentRecord) => {
    if (viewingExperiment?.id === exp.id) {
      setViewingExperiment(null);
    } else {
      setViewingExperiment(exp);
    }
  };

  const currentAnalysis = useMemo(() => {
    const data = viewingExperiment
      ? viewingExperiment.growthData
      : currentGrowthData;
    if (!data) return null;

    let peakPopulation = 0;
    let peakHour = 0;
    data.forEach((d) => {
      if (d.population > peakPopulation) {
        peakPopulation = d.population;
        peakHour = d.hour;
      }
    });

    const finalPopulation = data[data.length - 1]?.population ?? 0;
    const initialPopulation = data[0]?.population ?? 1;
    const duration = data[data.length - 1]?.hour ?? 1;
    const growthRate =
      duration > 0
        ? Math.log(finalPopulation / initialPopulation) / duration
        : 0;

    return { peakPopulation, peakHour, finalPopulation, growthRate };
  }, [currentGrowthData, viewingExperiment]);

  return (
    <div className="container mx-auto px-6 pt-32 pb-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-glow-primary/30 bg-glow-primary/5 backdrop-blur-sm mb-6">
          <Sparkles className="w-4 h-4 text-glow-primary" />
          <span className="font-mono text-xs text-glow-primary tracking-[0.2em] uppercase">
            Microbial Simulation Lab
          </span>
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-semibold text-text-light mb-6">
          微生物<span className="text-gradient-primary">培养实验室</span>
        </h1>
        <p className="font-mono text-text-muted/70 max-w-2xl mx-auto">
          调整温度、湿度、pH值和营养浓度，模拟不同环境下微生物的生长曲线。
          保存实验记录，对比不同条件下的生长差异。
        </p>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-6">
        <div className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Microscope className="w-5 h-5 text-glow-primary" />
              <h2 className="font-display text-2xl text-text-light">
                实验条件
              </h2>
            </div>

            <div className="mb-5">
              <label className="font-mono text-sm text-text-muted block mb-2">
                选择微生物
              </label>
              <select
                value={conditions.microbeId}
                onChange={(e) =>
                  setConditions((c) => ({
                    ...c,
                    microbeId: Number(e.target.value),
                  }))
                }
                className="w-full px-4 py-3 rounded-xl bg-background-card/80 border border-glow-primary/20
                           text-text-light font-mono text-sm focus:outline-none focus:border-glow-primary/60
                           transition-colors cursor-pointer"
              >
                {microbes.map((m) => (
                  <option key={m.id} value={m.id} className="bg-background-card">
                    {m.name} ({CATEGORY_LABELS[m.category]})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-5">
              <SliderControl
                label="培养温度"
                value={conditions.temperature}
                min={0}
                max={120}
                step={1}
                unit="°C"
                icon={Thermometer}
                optimal={optimal.temperatureRange}
                onChange={(v) =>
                  setConditions((c) => ({ ...c, temperature: v }))
                }
              />
              <SliderControl
                label="环境湿度"
                value={conditions.humidity}
                min={0}
                max={100}
                step={1}
                unit="%"
                icon={Droplets}
                optimal={optimal.humidityRange}
                onChange={(v) =>
                  setConditions((c) => ({ ...c, humidity: v }))
                }
              />
              <SliderControl
                label="酸碱度 (pH)"
                value={conditions.ph}
                min={0}
                max={14}
                step={0.1}
                unit=""
                icon={FlaskConical}
                optimal={optimal.phRange}
                onChange={(v) => setConditions((c) => ({ ...c, ph: v }))}
              />
              <SliderControl
                label="营养浓度"
                value={conditions.nutrients}
                min={1}
                max={100}
                step={1}
                unit="%"
                icon={Leaf}
                onChange={(v) =>
                  setConditions((c) => ({ ...c, nutrients: v }))
                }
              />
              <SliderControl
                label="培养时长"
                value={conditions.duration}
                min={6}
                max={168}
                step={6}
                unit="h"
                icon={Clock}
                onChange={(v) =>
                  setConditions((c) => ({ ...c, duration: v }))
                }
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleRunSimulation}
                className="btn-primary flex-1"
              >
                <Play className="w-4 h-4" />
                开始模拟
              </button>
              <button
                onClick={clearCurrentSimulation}
                className="btn-primary-ghost px-4"
                title="清除当前模拟"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {currentGrowthData && !viewingExperiment && (
              <button
                onClick={() => setShowSaveModal(true)}
                className="w-full mt-3 btn-primary-ghost"
              >
                <Save className="w-4 h-4" />
                保存本次实验
              </button>
            )}
          </div>

          {currentAnalysis && (
            <div className="glass-card p-6">
              <h3 className="font-display text-xl text-text-light mb-4">
                模拟结果分析
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-mono text-[10px] text-text-muted/60 mb-1">
                    峰值种群密度
                  </p>
                  <p className="font-mono text-xl text-glow-primary">
                    {formatNumber(currentAnalysis.peakPopulation)}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-text-muted/60 mb-1">
                    到达峰值时间
                  </p>
                  <p className="font-mono text-xl text-text-light">
                    {currentAnalysis.peakHour}h
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-text-muted/60 mb-1">
                    最终种群密度
                  </p>
                  <p className="font-mono text-xl text-text-light">
                    {formatNumber(currentAnalysis.finalPopulation)}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-text-muted/60 mb-1">
                    平均增长速率
                  </p>
                  <p className="font-mono text-xl text-glow-orange">
                    {currentAnalysis.growthRate.toFixed(3)}
                    <span className="text-sm text-text-muted/60">/h</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <GrowthChart series={chartSeries} height={400} />

          {comparisonExperimentIds.length > 1 && (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <GitCompare className="w-5 h-5 text-glow-primary" />
                  <h3 className="font-display text-xl text-text-light">
                    对比分析
                  </h3>
                </div>
                <button
                  onClick={clearComparison}
                  className="font-mono text-xs text-text-muted hover:text-glow-red transition-colors"
                >
                  清除对比
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-glow-primary/10">
                      <th className="text-left font-mono text-xs text-text-muted/60 py-3 px-3">
                        实验名称
                      </th>
                      <th className="text-left font-mono text-xs text-text-muted/60 py-3 px-3">
                        微生物
                      </th>
                      <th className="text-right font-mono text-xs text-text-muted/60 py-3 px-3">
                        峰值种群
                      </th>
                      <th className="text-right font-mono text-xs text-text-muted/60 py-3 px-3">
                        峰值时间
                      </th>
                      <th className="text-right font-mono text-xs text-text-muted/60 py-3 px-3">
                        增长速率
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonExperimentIds.map((id) => {
                      const exp = experiments.find((e) => e.id === id);
                      if (!exp) return null;
                      const color =
                        EXPERIMENT_COLORS[
                          experiments.findIndex((e) => e.id === id) %
                            EXPERIMENT_COLORS.length
                        ];
                      return (
                        <tr
                          key={id}
                          className="border-b border-white/5 hover:bg-glow-primary/5"
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                              <span className="font-mono text-sm text-text-light">
                                {exp.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono text-sm text-text-muted">
                            {exp.conditions.microbeName}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-sm text-glow-primary">
                            {formatNumber(exp.peakPopulation)}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-sm text-text-light">
                            {exp.peakHour}h
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-sm text-glow-orange">
                            {exp.growthRate.toFixed(3)}/h
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="glass-card p-6">
            <h3 className="font-display text-2xl text-text-light mb-5">
              实验历史记录
            </h3>
            <ExperimentList
              experiments={experiments}
              comparisonIds={comparisonExperimentIds}
              onToggleComparison={toggleComparison}
              onDelete={deleteExperiment}
              onView={handleViewExperiment}
              viewingId={viewingExperiment?.id ?? null}
            />
          </div>
        </div>
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-deep/80 backdrop-blur-sm">
          <div className="glass-card p-8 w-full max-w-md mx-4 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-2xl text-text-light">
                保存实验记录
              </h3>
              <button
                onClick={() => setShowSaveModal(false)}
                className="p-1 text-text-muted hover:text-text-light"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-mono text-sm text-text-muted block mb-2">
                  实验名称 *
                </label>
                <input
                  type="text"
                  value={expName}
                  onChange={(e) => setExpName(e.target.value)}
                  placeholder="例如：大肠杆菌 37°C 最优条件"
                  className="w-full px-4 py-3 rounded-xl bg-background-card/80 border border-glow-primary/20
                             text-text-light font-mono text-sm focus:outline-none focus:border-glow-primary/60
                             transition-colors"
                />
              </div>
              <div>
                <label className="font-mono text-sm text-text-muted block mb-2">
                  备注（可选）
                </label>
                <textarea
                  value={expNotes}
                  onChange={(e) => setExpNotes(e.target.value)}
                  placeholder="记录实验目的、观察到的现象等..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-background-card/80 border border-glow-primary/20
                             text-text-light font-mono text-sm focus:outline-none focus:border-glow-primary/60
                             transition-colors resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="btn-primary-ghost flex-1"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveExperiment}
                  disabled={!expName.trim()}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
