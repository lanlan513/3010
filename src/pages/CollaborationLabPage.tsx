import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import {
  Sparkles,
  Users,
  Play,
  Save,
  Share2,
  X,
  Plus,
  Minus,
  Thermometer,
  Droplets,
  FlaskConical,
  Leaf,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Upload,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import {
  simulateCommunity,
  deriveInteractions,
  generateShareCode,
  parseShareCode,
  COLLABORATION_COLORS,
  INTERACTION_TYPE_LABELS,
  INTERACTION_TYPE_COLORS,
} from '../data/collaborationData';
import { microbeMetabolismProfiles } from '../data/metabolismData';
import type {
  CommunityMicrobe,
  StabilityReport,
  CollaborationExperimentConfig,
  CollaborationExperimentRecord,
} from '../../shared/types';
import { CATEGORY_LABELS, CATEGORY_COLORS, CYCLE_LABELS } from '../../shared/types';

const COLLAB_STORAGE_KEY = 'microbe_collab_experiments';

function loadCollabExperiments(): CollaborationExperimentRecord[] {
  try {
    const raw = localStorage.getItem(COLLAB_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCollabExperiments(experiments: CollaborationExperimentRecord[]) {
  try {
    localStorage.setItem(COLLAB_STORAGE_KEY, JSON.stringify(experiments));
  } catch {}
}

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  onChange: (v: number) => void;
}

function SliderControl({ label, value, min, max, step, unit, icon: Icon, onChange }: SliderControlProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-glow-primary" />
          <span className="font-mono text-sm text-text-light">{label}</span>
        </div>
        <span className="font-mono text-sm font-bold text-glow-primary">
          {value}{unit}
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

function formatPop(num: number): string {
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return Math.round(num).toLocaleString();
}

function ScoreGauge({ score }: { score: number }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 70 ? '#00ffc8' : score >= 40 ? '#f1c40f' : '#e74c3c';

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#1a2a28" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={radius} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold" style={{ color }}>{score}</span>
        <span className="font-mono text-[9px] text-text-muted/60">稳定性评分</span>
      </div>
    </div>
  );
}

export function CollaborationLabPage() {
  const { microbes, fetchMicrobes } = useAppStore();
  const [selectedMicrobes, setSelectedMicrobes] = useState<CommunityMicrobe[]>([]);
  const [temperature, setTemperature] = useState(37);
  const [humidity, setHumidity] = useState(70);
  const [ph, setPh] = useState(7.0);
  const [nutrients, setNutrients] = useState(60);
  const [duration, setDuration] = useState(72);
  const [stabilityReport, setStabilityReport] = useState<StabilityReport | null>(null);
  const [experiments, setExperiments] = useState<CollaborationExperimentRecord[]>(loadCollabExperiments);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [expName, setExpName] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCode, setShareCode] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [microbeSearch, setMicrobeSearch] = useState('');
  const [showMicrobePicker, setShowMicrobePicker] = useState(false);
  const [expandedTimeline, setExpandedTimeline] = useState(false);
  const [viewingReport, setViewingReport] = useState<CollaborationExperimentRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'experiment' | 'history'>('experiment');
  const reportRef = useRef<HTMLDivElement>(null);
  const lastSimulateConfig = useRef<{
    microbes: CommunityMicrobe[];
    temperature: number;
    humidity: number;
    ph: number;
    nutrients: number;
    duration: number;
  } | null>(null);

  useEffect(() => {
    fetchMicrobes();
  }, [fetchMicrobes]);

  const availableMicrobes = useMemo(() => {
    const selectedIds = new Set(selectedMicrobes.map((m) => m.microbeId));
    return microbes.filter((m) => !selectedIds.has(m.id));
  }, [microbes, selectedMicrobes]);

  const filteredAvailable = useMemo(() => {
    if (!microbeSearch.trim()) return availableMicrobes;
    const q = microbeSearch.toLowerCase();
    return availableMicrobes.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.scientificName.toLowerCase().includes(q) ||
        CATEGORY_LABELS[m.category].includes(q)
    );
  }, [availableMicrobes, microbeSearch]);

  const previewInteractions = useMemo(() => {
    if (selectedMicrobes.length < 2) return [];
    return deriveInteractions(selectedMicrobes.map((m) => m.microbeId));
  }, [selectedMicrobes]);

  const handleAddMicrobe = useCallback((microbeId: number) => {
    if (selectedMicrobes.length >= 8) return;
    const microbe = microbes.find((m) => m.id === microbeId);
    if (!microbe) return;
    const profile = microbeMetabolismProfiles.find((p) => p.microbeId === microbeId);
    const mainCycle = profile?.pathways[0]?.cycle ?? 'carbon';
    setSelectedMicrobes((prev) => [
      ...prev,
      { microbeId, initialPopulation: 500, role: `${CYCLE_LABELS[mainCycle]}相关` },
    ]);
    setShowMicrobePicker(false);
    setMicrobeSearch('');
  }, [microbes]);

  const handleRemoveMicrobe = useCallback((microbeId: number) => {
    setSelectedMicrobes((prev) => prev.filter((m) => m.microbeId !== microbeId));
  }, []);

  const handlePopulationChange = useCallback((microbeId: number, pop: number) => {
    setSelectedMicrobes((prev) =>
      prev.map((m) => (m.microbeId === microbeId ? { ...m, initialPopulation: pop } : m))
    );
  }, []);

  const handleSimulate = useCallback(() => {
    if (selectedMicrobes.length < 2) return;
    const snapshot = {
      microbes: selectedMicrobes.map((m) => ({ ...m })),
      temperature,
      humidity,
      ph,
      nutrients,
      duration,
    };
    const report = simulateCommunity(snapshot.microbes, snapshot.temperature, snapshot.ph, snapshot.nutrients, snapshot.duration);
    lastSimulateConfig.current = snapshot;
    setStabilityReport(report);
    setViewingReport(null);
    setTimeout(() => {
      reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [selectedMicrobes, temperature, humidity, ph, nutrients, duration]);

  const handleSave = useCallback(() => {
    if (!expName.trim() || !stabilityReport) return;
    let snapshot: {
      microbes: CommunityMicrobe[];
      temperature: number;
      humidity: number;
      ph: number;
      nutrients: number;
      duration: number;
      finalPopulations?: Record<number, number>;
    } | null = null;

    if (viewingReport) {
      snapshot = {
        microbes: viewingReport.config.microbes.map((m) => ({ ...m })),
        temperature: viewingReport.config.temperature,
        humidity: viewingReport.config.humidity,
        ph: viewingReport.config.ph,
        nutrients: viewingReport.config.nutrients,
        duration: viewingReport.config.duration,
        finalPopulations: viewingReport.config.finalPopulations,
      };
    } else if (lastSimulateConfig.current) {
      snapshot = { ...lastSimulateConfig.current };
    }
    if (!snapshot) return;

    const report = viewingReport?.stabilityReport ?? stabilityReport;
    const timeline = report.timeline;
    const finalPopulations = snapshot.finalPopulations ?? (timeline.length > 0 ? { ...timeline[timeline.length - 1].populations } : undefined);
    const config: CollaborationExperimentConfig = {
      id: `collab_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: expName.trim(),
      createdAt: Date.now(),
      microbes: snapshot.microbes.map((m) => ({ ...m })),
      temperature: snapshot.temperature,
      humidity: snapshot.humidity,
      ph: snapshot.ph,
      nutrients: snapshot.nutrients,
      duration: snapshot.duration,
      finalPopulations,
    };
    const record: CollaborationExperimentRecord = {
      id: config.id,
      name: expName.trim(),
      createdAt: Date.now(),
      config,
      stabilityReport: report,
    };
    const newExperiments = [record, ...experiments];
    setExperiments(newExperiments);
    saveCollabExperiments(newExperiments);
    setShowSaveModal(false);
    setExpName('');
  }, [expName, stabilityReport, experiments, viewingReport]);

  const handleShare = useCallback(() => {
    const code = generateShareCode({
      microbes: selectedMicrobes,
      temperature,
      humidity,
      ph,
      nutrients,
      duration,
    });
    setShareCode(code);
    setShowShareModal(true);
  }, [selectedMicrobes, temperature, humidity, ph, nutrients, duration]);

  const handleImport = useCallback(() => {
    const parsed = parseShareCode(importCode.trim());
    if (!parsed) return;
    setSelectedMicrobes(parsed.microbes.map((m) => ({ ...m, role: m.role || '' })));
    setTemperature(parsed.temperature);
    setHumidity(parsed.humidity);
    setPh(parsed.ph);
    setNutrients(parsed.nutrients);
    setDuration(parsed.duration);
    setShowImportModal(false);
    setImportCode('');
  }, [importCode]);

  const handleDeleteExperiment = useCallback((id: string) => {
    const newExperiments = experiments.filter((e) => e.id !== id);
    setExperiments(newExperiments);
    saveCollabExperiments(newExperiments);
    if (viewingReport?.id === id) setViewingReport(null);
  }, [experiments, viewingReport]);

  const handleViewExperiment = useCallback((exp: CollaborationExperimentRecord) => {
    setViewingReport(viewingReport?.id === exp.id ? null : exp);
    setStabilityReport(exp.stabilityReport);
  }, [viewingReport]);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(shareCode).catch(() => {});
  }, [shareCode]);

  const activeReport = viewingReport?.stabilityReport ?? stabilityReport;

  const timelineChartData = useMemo(() => {
    if (!activeReport) return null;
    const microbeIds = Object.keys(activeReport.timeline[0]?.populations ?? {}).map(Number);
    return {
      microbeIds,
      timeline: activeReport.timeline,
    };
  }, [activeReport]);

  return (
    <div className="container mx-auto px-6 pt-32 pb-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-glow-primary/30 bg-glow-primary/5 backdrop-blur-sm mb-6">
          <Sparkles className="w-4 h-4 text-glow-primary" />
          <span className="font-mono text-xs text-glow-primary tracking-[0.2em] uppercase">
            Collaboration Lab
          </span>
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-semibold text-text-light mb-6">
          微生物<span className="text-gradient-primary">协作实验</span>
        </h1>
        <p className="font-mono text-text-muted/70 max-w-2xl mx-auto leading-relaxed">
          将多种微生物组合成群落进行培养，模拟群落内部的协作与竞争变化。
          生成稳定性评分和演化报告，保存并分享你的实验配置。
        </p>
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="text-center">
            <p className="font-display text-2xl text-glow-primary">{selectedMicrobes.length}</p>
            <p className="font-mono text-[10px] text-text-muted/50">已选物种</p>
          </div>
          <div className="w-px h-8 bg-glow-primary/20" />
          <div className="text-center">
            <p className="font-display text-2xl" style={{ color: INTERACTION_TYPE_COLORS.cooperation }}>
              {previewInteractions.filter((i) => i.type === 'cooperation').length}
            </p>
            <p className="font-mono text-[10px] text-text-muted/50">协作关系</p>
          </div>
          <div className="w-px h-8 bg-glow-primary/20" />
          <div className="text-center">
            <p className="font-display text-2xl" style={{ color: INTERACTION_TYPE_COLORS.competition }}>
              {previewInteractions.filter((i) => i.type === 'competition').length}
            </p>
            <p className="font-mono text-[10px] text-text-muted/50">竞争关系</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <div className="glass-card p-1.5 flex gap-1">
          <button
            onClick={() => setActiveTab('experiment')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 ${
              activeTab === 'experiment'
                ? 'bg-glow-primary/15 text-glow-primary border border-glow-primary/40 shadow-[0_0_20px_rgba(0,255,200,0.15)]'
                : 'text-text-muted/70 hover:text-text-light hover:bg-background-card/50 border border-transparent'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="font-mono text-sm">群落实验</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 ${
              activeTab === 'history'
                ? 'bg-glow-purple/15 text-glow-purple border border-glow-purple/40 shadow-[0_0_20px_rgba(155,89,182,0.2)]'
                : 'text-text-muted/70 hover:text-text-light hover:bg-background-card/50 border border-transparent'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span className="font-mono text-sm">实验记录</span>
          </button>
        </div>
      </div>

      {activeTab === 'experiment' ? (
        <>
          <div className="grid lg:grid-cols-[400px_1fr] gap-6">
            <div className="space-y-6">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-glow-primary" />
                    <h2 className="font-display text-2xl text-text-light">群落构建</h2>
                  </div>
                  <span className="font-mono text-xs text-text-muted/50">
                    {selectedMicrobes.length}/8
                  </span>
                </div>

                {selectedMicrobes.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {selectedMicrobes.map((cm, idx) => {
                      const microbe = microbes.find((m) => m.id === cm.microbeId);
                      if (!microbe) return null;
                      const color = COLLABORATION_COLORS[idx % COLLABORATION_COLORS.length];
                      return (
                        <div
                          key={cm.microbeId}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-background-card/50 border border-white/5"
                        >
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                          <div className="flex-1 min-w-0">
                            <p className="font-mono text-sm text-text-light truncate">{microbe.name}</p>
                            <p className="font-mono text-[10px] text-text-muted/50">
                              {CATEGORY_LABELS[microbe.category]} · 初始种群 {formatPop(cm.initialPopulation)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handlePopulationChange(cm.microbeId, Math.max(50, cm.initialPopulation - 100))}
                              className="w-6 h-6 rounded-md bg-background-card/80 border border-white/10 flex items-center justify-center text-text-muted hover:text-text-light hover:border-glow-primary/30 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handlePopulationChange(cm.microbeId, Math.min(10000, cm.initialPopulation + 100))}
                              className="w-6 h-6 rounded-md bg-background-card/80 border border-white/10 flex items-center justify-center text-text-muted hover:text-text-light hover:border-glow-primary/30 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleRemoveMicrobe(cm.microbeId)}
                              className="w-6 h-6 rounded-md bg-glow-red/10 border border-glow-red/20 flex items-center justify-center text-glow-red hover:bg-glow-red/20 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedMicrobes.length === 0 && (
                  <p className="font-mono text-sm text-text-muted/50 text-center py-4">
                    请添加至少2种微生物构建群落
                  </p>
                )}

                {selectedMicrobes.length < 8 && (
                  <div className="relative">
                    <button
                      onClick={() => setShowMicrobePicker(!showMicrobePicker)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-glow-primary/30 text-glow-primary/70 hover:text-glow-primary hover:border-glow-primary/60 transition-all font-mono text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      添加微生物
                    </button>

                    {showMicrobePicker && (
                      <div className="absolute z-[100] top-full mt-2 left-0 right-0 glass-card p-3 max-h-64 overflow-y-auto animate-fade-in-up shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                        <input
                          type="text"
                          value={microbeSearch}
                          onChange={(e) => setMicrobeSearch(e.target.value)}
                          placeholder="搜索微生物..."
                          className="w-full px-3 py-2 rounded-lg bg-background-card/80 border border-glow-primary/20 text-text-light font-mono text-sm focus:outline-none focus:border-glow-primary/60 mb-2"
                          autoFocus
                        />
                        <div className="space-y-1">
                          {filteredAvailable.map((m) => (
                            <button
                              key={m.id}
                              onClick={() => handleAddMicrobe(m.id)}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-glow-primary/10 transition-colors flex items-center gap-2"
                            >
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[m.category] }} />
                              <span className="font-mono text-sm text-text-light">{m.name}</span>
                              <span className="font-mono text-[10px] text-text-muted/50">{CATEGORY_LABELS[m.category]}</span>
                            </button>
                          ))}
                          {filteredAvailable.length === 0 && (
                            <p className="font-mono text-xs text-text-muted/50 text-center py-2">无匹配结果</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {previewInteractions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-glow-primary/10">
                    <p className="font-mono text-[10px] text-text-muted/50 mb-2">种间关系预览</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(['cooperation', 'competition', 'parasitism', 'neutral'] as const).map((type) => {
                        const count = previewInteractions.filter((i) => i.type === type).length;
                        if (count === 0) return null;
                        return (
                          <span
                            key={type}
                            className="font-mono text-[10px] px-2 py-1 rounded-full border"
                            style={{
                              color: INTERACTION_TYPE_COLORS[type],
                              borderColor: INTERACTION_TYPE_COLORS[type] + '44',
                              backgroundColor: INTERACTION_TYPE_COLORS[type] + '10',
                            }}
                          >
                            {INTERACTION_TYPE_LABELS[type]} {count}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="glass-card p-6">
                <h3 className="font-display text-xl text-text-light mb-4">培养条件</h3>
                <div className="space-y-4">
                  <SliderControl label="培养温度" value={temperature} min={0} max={120} step={1} unit="°C" icon={Thermometer} onChange={setTemperature} />
                  <SliderControl label="环境湿度" value={humidity} min={0} max={100} step={1} unit="%" icon={Droplets} onChange={setHumidity} />
                  <SliderControl label="酸碱度 (pH)" value={ph} min={0} max={14} step={0.1} unit="" icon={FlaskConical} onChange={setPh} />
                  <SliderControl label="营养浓度" value={nutrients} min={1} max={100} step={1} unit="%" icon={Leaf} onChange={setNutrients} />
                  <SliderControl label="培养时长" value={duration} min={12} max={168} step={6} unit="h" icon={Clock} onChange={setDuration} />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSimulate}
                    disabled={selectedMicrobes.length < 2}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-4 h-4" />
                    开始模拟
                  </button>
                  <button
                    onClick={handleShare}
                    disabled={selectedMicrobes.length < 2}
                    className="btn-primary-ghost px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="分享配置"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="btn-primary-ghost px-4"
                    title="导入配置"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6" ref={reportRef}>
              {activeReport ? (
                <>
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-display text-2xl text-text-light">稳定性评估</h3>
                      {stabilityReport && !viewingReport && (
                        <button onClick={() => setShowSaveModal(true)} className="btn-primary-ghost text-sm">
                          <Save className="w-4 h-4" />
                          保存实验
                        </button>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-[160px_1fr] gap-6 items-start">
                      <ScoreGauge score={activeReport.overallScore} />

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="glass-card p-3 text-center">
                            <p className="font-mono text-[10px] text-text-muted/50 mb-1">多样性指数</p>
                            <p className="font-display text-xl text-glow-primary">{(activeReport.diversityIndex * 100).toFixed(0)}%</p>
                          </div>
                          <div className="glass-card p-3 text-center">
                            <p className="font-mono text-[10px] text-text-muted/50 mb-1">协作比率</p>
                            <p className="font-display text-xl" style={{ color: INTERACTION_TYPE_COLORS.cooperation }}>
                              {(activeReport.cooperationRatio * 100).toFixed(0)}%
                            </p>
                          </div>
                          <div className="glass-card p-3 text-center">
                            <p className="font-mono text-[10px] text-text-muted/50 mb-1">竞争比率</p>
                            <p className="font-display text-xl" style={{ color: INTERACTION_TYPE_COLORS.competition }}>
                              {(activeReport.competitionRatio * 100).toFixed(0)}%
                            </p>
                          </div>
                          <div className="glass-card p-3 text-center">
                            <p className="font-mono text-[10px] text-text-muted/50 mb-1">均衡状态</p>
                            <p className={`font-display text-xl ${activeReport.equilibriumReached ? 'text-glow-primary' : 'text-glow-red'}`}>
                              {activeReport.equilibriumReached ? '已达到' : '未达到'}
                            </p>
                          </div>
                        </div>

                        {activeReport.dominantSpecies !== null && (
                          <div className="glass-card p-3">
                            <span className="font-mono text-[10px] text-text-muted/50">优势物种</span>
                            <p className="font-mono text-sm text-text-light mt-0.5">
                              {microbes.find((m) => m.id === activeReport.dominantSpecies)?.name ?? `ID:${activeReport.dominantSpecies}`}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="glass-card p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-glow-primary" />
                        <h4 className="font-display text-xl text-glow-primary">群落优势</h4>
                      </div>
                      <div className="space-y-2">
                        {activeReport.strengths.length > 0 ? (
                          activeReport.strengths.map((s, i) => (
                            <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-glow-primary/5 border border-glow-primary/10">
                              <div className="w-1.5 h-1.5 rounded-full bg-glow-primary mt-1.5 shrink-0" />
                              <p className="font-mono text-xs text-text-light leading-relaxed">{s}</p>
                            </div>
                          ))
                        ) : (
                          <p className="font-mono text-xs text-text-muted/50">暂无显著优势</p>
                        )}
                      </div>
                    </div>

                    <div className="glass-card p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-glow-red" />
                        <h4 className="font-display text-xl text-glow-red">风险因素</h4>
                      </div>
                      <div className="space-y-2">
                        {activeReport.riskFactors.length > 0 ? (
                          activeReport.riskFactors.map((r, i) => (
                            <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-glow-red/5 border border-glow-red/10">
                              <div className="w-1.5 h-1.5 rounded-full bg-glow-red mt-1.5 shrink-0" />
                              <p className="font-mono text-xs text-text-light leading-relaxed">{r}</p>
                            </div>
                          ))
                        ) : (
                          <p className="font-mono text-xs text-glow-primary">未检测到明显风险</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-glow-primary" />
                        <h4 className="font-display text-xl text-text-light">种群动态曲线</h4>
                      </div>
                    </div>
                    {timelineChartData && timelineChartData.timeline.length > 0 ? (
                      <div className="h-72 relative">
                        <svg viewBox="0 0 800 280" className="w-full h-full" preserveAspectRatio="none">
                          {(() => {
                            const t = timelineChartData.timeline;
                            const allPops = t.flatMap((tp) => Object.values(tp.populations));
                            const maxPop = Math.max(...allPops, 100);
                            const xStep = 760 / Math.max(1, t.length - 1);
                            const padY = 20;
                            const chartH = 240;

                            return (
                              <>
                                {[0.25, 0.5, 0.75, 1].map((frac) => (
                                  <line
                                    key={frac}
                                    x1="40" y1={padY + chartH * (1 - frac)}
                                    x2="800" y2={padY + chartH * (1 - frac)}
                                    stroke="#1a2a28" strokeWidth="1"
                                  />
                                ))}
                                <line x1="40" y1={padY + chartH} x2="800" y2={padY + chartH} stroke="#2d4a46" strokeWidth="1" />
                                <line x1="40" y1={padY} x2="40" y2={padY + chartH} stroke="#2d4a46" strokeWidth="1" />

                                {[0, 0.5, 1].map((frac) => (
                                  <text key={frac} x="36" y={padY + chartH * (1 - frac) + 4} textAnchor="end" fill="#8fb5af" fontSize="9" fontFamily="monospace">
                                    {formatPop(maxPop * frac)}
                                  </text>
                                ))}

                                <text x="420" y={padY + chartH + 16} textAnchor="middle" fill="#8fb5af" fontSize="9" fontFamily="monospace">时间 (h)</text>

                                {timelineChartData.microbeIds.map((microbeId, mIdx) => {
                                  const color = COLLABORATION_COLORS[mIdx % COLLABORATION_COLORS.length];
                                  const points = t.map((tp, i) => {
                                    const pop = tp.populations[microbeId] ?? 0;
                                    const x = 40 + i * xStep;
                                    const y = padY + chartH * (1 - pop / maxPop);
                                    return `${x},${y}`;
                                  }).join(' ');
                                  const microbe = microbes.find((m) => m.id === microbeId);
                                  return (
                                    <g key={microbeId}>
                                      <polyline points={points} fill="none" stroke={color} strokeWidth="2" opacity="0.9" />
                                      {t.length <= 40 && t.map((tp, i) => {
                                        const pop = tp.populations[microbeId] ?? 0;
                                        const x = 40 + i * xStep;
                                        const y = padY + chartH * (1 - pop / maxPop);
                                        return <circle key={i} cx={x} cy={y} r="2" fill={color} />;
                                      })}
                                      <circle cx="40" cy={padY + chartH * (1 - (t[0]?.populations[microbeId] ?? 0) / maxPop)} r="5" fill={color} />
                                      <text x="50" y={padY + chartH * (1 - (t[0]?.populations[microbeId] ?? 0) / maxPop) + 4} fill={color} fontSize="10" fontFamily="monospace">
                                        {microbe?.name ?? `ID:${microbeId}`}
                                      </text>
                                    </g>
                                  );
                                })}
                              </>
                            );
                          })()}
                        </svg>
                      </div>
                    ) : (
                      <p className="font-mono text-sm text-text-muted/50 text-center py-8">暂无时间线数据</p>
                    )}

                    {timelineChartData && timelineChartData.microbeIds.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-glow-primary/10">
                        {timelineChartData.microbeIds.map((id, idx) => {
                          const microbe = microbes.find((m) => m.id === id);
                          const color = COLLABORATION_COLORS[idx % COLLABORATION_COLORS.length];
                          const finalPop = activeReport.timeline[activeReport.timeline.length - 1]?.populations[id] ?? 0;
                          return (
                            <div key={id} className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                              <span className="font-mono text-xs text-text-light">{microbe?.name ?? `ID:${id}`}</span>
                              <span className="font-mono text-[10px] text-text-muted/50">{formatPop(finalPop)}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="glass-card p-6">
                    <button
                      onClick={() => setExpandedTimeline(!expandedTimeline)}
                      className="w-full flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-glow-primary" />
                        <h4 className="font-display text-xl text-text-light">演化时间线</h4>
                      </div>
                      {expandedTimeline ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
                    </button>

                    {expandedTimeline && activeReport.timeline.length > 0 && (
                      <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
                        {activeReport.timeline.map((tp, idx) => {
                          const popEntries = Object.entries(tp.populations).sort(([, a], [, b]) => b - a);
                          return (
                            <div key={idx} className="glass-card p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-mono text-xs text-glow-primary">{tp.hour}h</span>
                                <div className="flex-1 h-px bg-glow-primary/10" />
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {popEntries.map(([id, pop]) => {
                                  const microbe = microbes.find((m) => m.id === Number(id));
                                  const mIdx = timelineChartData?.microbeIds.indexOf(Number(id)) ?? 0;
                                  const color = COLLABORATION_COLORS[mIdx % COLLABORATION_COLORS.length];
                                  return (
                                    <span key={id} className="font-mono text-[10px] px-2 py-0.5 rounded-full border" style={{
                                      color,
                                      borderColor: color + '44',
                                      backgroundColor: color + '10',
                                    }}>
                                      {microbe?.name ?? `ID:${id}`}: {formatPop(pop)}
                                    </span>
                                  );
                                })}
                              </div>
                              {tp.interactions.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {tp.interactions.slice(0, 4).map((inter, iIdx) => (
                                    <span key={iIdx} className="font-mono text-[9px] px-1.5 py-0.5 rounded border" style={{
                                      color: INTERACTION_TYPE_COLORS[inter.type],
                                      borderColor: INTERACTION_TYPE_COLORS[inter.type] + '33',
                                    }}>
                                      {INTERACTION_TYPE_LABELS[inter.type]}
                                    </span>
                                  ))}
                                  {tp.interactions.length > 4 && (
                                    <span className="font-mono text-[9px] text-text-muted/50">+{tp.interactions.length - 4}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="glass-card p-12 text-center">
                  <Users className="w-16 h-16 text-glow-primary/20 mx-auto mb-4" />
                  <h3 className="font-display text-2xl text-text-light mb-3">构建你的微生物群落</h3>
                  <p className="font-mono text-sm text-text-muted/70 max-w-md mx-auto leading-relaxed">
                    在左侧选择2至8种微生物，调整培养条件后点击"开始模拟"，
                    系统将模拟群落内部的协作与竞争变化，生成稳定性评分和演化报告。
                  </p>
                  <div className="grid grid-cols-3 gap-4 mt-8 max-w-sm mx-auto">
                    <div className="glass-card p-3">
                      <Users className="w-5 h-5 text-glow-primary mx-auto mb-1" />
                      <p className="font-mono text-[10px] text-text-muted/50">选择物种</p>
                    </div>
                    <div className="glass-card p-3">
                      <FlaskConical className="w-5 h-5 text-glow-primary mx-auto mb-1" />
                      <p className="font-mono text-[10px] text-text-muted/50">设定条件</p>
                    </div>
                    <div className="glass-card p-3">
                      <Activity className="w-5 h-5 text-glow-primary mx-auto mb-1" />
                      <p className="font-mono text-[10px] text-text-muted/50">观察演化</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="glass-card p-6">
          <h3 className="font-display text-2xl text-text-light mb-5">实验记录</h3>
          {experiments.length === 0 ? (
            <p className="font-mono text-sm text-text-muted/50 text-center py-8">暂无保存的协作实验记录</p>
          ) : (
            <div className="space-y-3">
              {experiments.map((exp) => {
                const isActive = viewingReport?.id === exp.id;
                return (
                  <div
                    key={exp.id}
                    className={`glass-card p-4 transition-all cursor-pointer ${
                      isActive ? 'border-glow-primary/50 bg-glow-primary/5' : 'border-white/5 hover:border-glow-primary/30'
                    }`}
                    onClick={() => handleViewExperiment(exp)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-display text-lg text-text-light">{exp.name}</p>
                        <p className="font-mono text-[10px] text-text-muted/50 mt-1">
                          {new Date(exp.createdAt).toLocaleString('zh-CN')} · {exp.config.microbes.length}种微生物 · 评分 {exp.stabilityReport.overallScore}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                          {exp.config.microbes.slice(0, 5).map((cm, idx) => {
                            const microbe = microbes.find((m) => m.id === cm.microbeId);
                            const color = COLLABORATION_COLORS[idx % COLLABORATION_COLORS.length];
                            return (
                              <div
                                key={cm.microbeId}
                                className="w-6 h-6 rounded-full border-2 border-background-deep flex items-center justify-center"
                                style={{ backgroundColor: color + '30', borderColor: color }}
                              >
                                <span className="font-mono text-[8px]" style={{ color }}>
                                  {microbe?.name[0] ?? '?'}
                                </span>
                              </div>
                            );
                          })}
                          {exp.config.microbes.length > 5 && (
                            <div className="w-6 h-6 rounded-full border-2 border-background-deep bg-background-card/80 flex items-center justify-center">
                              <span className="font-mono text-[8px] text-text-muted">+{exp.config.microbes.length - 5}</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteExperiment(exp.id); }}
                          className="p-1.5 text-text-muted/50 hover:text-glow-red transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {isActive && (
                      <div className="mt-4 pt-4 border-t border-glow-primary/10">
                        <div className="grid grid-cols-4 gap-3 mb-3">
                          <div className="text-center">
                            <p className="font-mono text-[10px] text-text-muted/50">评分</p>
                            <p className="font-display text-lg text-glow-primary">{exp.stabilityReport.overallScore}</p>
                          </div>
                          <div className="text-center">
                            <p className="font-mono text-[10px] text-text-muted/50">多样性</p>
                            <p className="font-display text-lg text-text-light">{(exp.stabilityReport.diversityIndex * 100).toFixed(0)}%</p>
                          </div>
                          <div className="text-center">
                            <p className="font-mono text-[10px] text-text-muted/50">协作率</p>
                            <p className="font-display text-lg" style={{ color: INTERACTION_TYPE_COLORS.cooperation }}>
                              {(exp.stabilityReport.cooperationRatio * 100).toFixed(0)}%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="font-mono text-[10px] text-text-muted/50">均衡</p>
                            <p className={`font-display text-lg ${exp.stabilityReport.equilibriumReached ? 'text-glow-primary' : 'text-glow-red'}`}>
                              {exp.stabilityReport.equilibriumReached ? '是' : '否'}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {exp.config.microbes.map((cm) => {
                            const microbe = microbes.find((m) => m.id === cm.microbeId);
                            return (
                              <span key={cm.microbeId} className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-glow-primary/10 border border-glow-primary/20 text-glow-primary">
                                {microbe?.name ?? `ID:${cm.microbeId}`}
                              </span>
                            );
                          })}
                        </div>
                        <p className="font-mono text-[10px] text-text-muted/50">
                          条件: {exp.config.temperature}°C · pH {exp.config.ph} · 湿度 {exp.config.humidity}% · 营养 {exp.config.nutrients}% · {exp.config.duration}h
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-deep/80 backdrop-blur-sm">
          <div className="glass-card p-8 w-full max-w-md mx-4 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-2xl text-text-light">保存协作实验</h3>
              <button onClick={() => setShowSaveModal(false)} className="p-1 text-text-muted hover:text-text-light">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="font-mono text-sm text-text-muted block mb-2">实验名称 *</label>
                <input
                  type="text"
                  value={expName}
                  onChange={(e) => setExpName(e.target.value)}
                  placeholder="例如：肠道微生物共生实验"
                  className="w-full px-4 py-3 rounded-xl bg-background-card/80 border border-glow-primary/20 text-text-light font-mono text-sm focus:outline-none focus:border-glow-primary/60 transition-colors"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowSaveModal(false)} className="btn-primary-ghost flex-1">取消</button>
                <button onClick={handleSave} disabled={!expName.trim()} className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Save className="w-4 h-4" />
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-deep/80 backdrop-blur-sm">
          <div className="glass-card p-8 w-full max-w-md mx-4 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-2xl text-text-light">分享实验配置</h3>
              <button onClick={() => setShowShareModal(false)} className="p-1 text-text-muted hover:text-text-light">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="font-mono text-sm text-text-muted/70 mb-4">
              复制以下代码发送给他人，对方可通过"导入配置"还原你的实验设置。
            </p>
            <div className="relative">
              <textarea
                readOnly
                value={shareCode}
                className="w-full px-4 py-3 rounded-xl bg-background-card/80 border border-glow-primary/20 text-text-light font-mono text-xs focus:outline-none resize-none h-24 break-all"
              />
              <button
                onClick={handleCopyCode}
                className="absolute top-2 right-2 p-2 rounded-lg bg-glow-primary/10 border border-glow-primary/20 text-glow-primary hover:bg-glow-primary/20 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <button onClick={() => setShowShareModal(false)} className="btn-primary w-full mt-4">
              完成
            </button>
          </div>
        </div>
      )}

      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-deep/80 backdrop-blur-sm">
          <div className="glass-card p-8 w-full max-w-md mx-4 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-2xl text-text-light">导入实验配置</h3>
              <button onClick={() => setShowImportModal(false)} className="p-1 text-text-muted hover:text-text-light">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="font-mono text-sm text-text-muted block mb-2">粘贴分享代码</label>
                <textarea
                  value={importCode}
                  onChange={(e) => setImportCode(e.target.value)}
                  placeholder="粘贴他人分享的实验配置代码..."
                  className="w-full px-4 py-3 rounded-xl bg-background-card/80 border border-glow-primary/20 text-text-light font-mono text-xs focus:outline-none focus:border-glow-primary/60 transition-colors resize-none h-24"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowImportModal(false)} className="btn-primary-ghost flex-1">取消</button>
                <button
                  onClick={handleImport}
                  disabled={!importCode.trim()}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  导入
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
