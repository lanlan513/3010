import { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  X,
  Factory,
  Beaker,
  Droplets,
  Leaf,
  Flame,
  Recycle,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  INDUSTRIAL_CATEGORY_LABELS,
  INDUSTRIAL_CATEGORY_COLORS,
  INDUSTRIAL_CATEGORY_DESCRIPTIONS,
  CATEGORY_COLORS,
} from '../../shared/types';
import type { IndustrialCategory } from '../../shared/types';
import {
  getAllApplications,
  getCategorySummary,
  getApplicationsByCategory,
} from '../data/industrialApplications';
import { useAppStore } from '../store/useAppStore';

const categoryIcons: Record<IndustrialCategory, typeof Factory> = {
  food_fermentation: Beaker,
  wastewater_treatment: Droplets,
  biopharmaceutical: Beaker,
  agricultural_improvement: Leaf,
  biofuel_production: Flame,
  environmental_remediation: Recycle,
};

const scaleLabels: Record<string, string> = {
  laboratory: '实验室',
  pilot: '中试',
  industrial: '工业化',
  global: '全球化',
};

export function IndustryAppPage() {
  const { microbes } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<IndustrialCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const allApplications = useMemo(() => getAllApplications(), []);
  const categorySummary = useMemo(() => getCategorySummary(), []);

  const filteredApplications = useMemo(() => {
    let apps = activeCategory
      ? getApplicationsByCategory(activeCategory)
      : allApplications;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      apps = apps.filter(
        (app) =>
          app.title.toLowerCase().includes(q) ||
          app.subtitle.toLowerCase().includes(q) ||
          app.summary.toLowerCase().includes(q) ||
          app.description.toLowerCase().includes(q),
      );
    }
    return apps;
  }, [activeCategory, searchQuery, allApplications]);

  const totalMicrobes = useMemo(() => {
    const ids = new Set(allApplications.flatMap((a) => a.relatedMicrobes.map((m) => m.microbeId)));
    return ids.size;
  }, [allApplications]);

  const allCategories: IndustrialCategory[] = [
    'food_fermentation',
    'wastewater_treatment',
    'biopharmaceutical',
    'agricultural_improvement',
    'biofuel_production',
    'environmental_remediation',
  ];

  return (
    <div className="relative min-h-screen">
      <section className="relative overflow-hidden pt-32 pb-12">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 60% 80% at 20% 10%, #f39c1215, transparent), radial-gradient(ellipse 50% 70% at 80% 30%, #9b59b615, transparent), radial-gradient(ellipse 40% 60% at 50% 90%, #2ecc7115, transparent)',
          }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="animate-fade-in-up stagger-1 opacity-0 mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-mono text-sm text-text-muted hover:text-glow-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回首页大厅
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="animate-fade-in-up stagger-2 opacity-0 flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl border border-glow-primary/40 bg-glow-primary/10 text-glow-primary">
                  <Factory className="w-8 h-8" />
                </div>
                <div>
                  <span className="font-mono text-xs tracking-[0.3em] uppercase block text-glow-primary">
                    Industrial Applications
                  </span>
                </div>
              </div>

              <h1 className="animate-fade-in-up stagger-3 opacity-0 font-display text-5xl md:text-6xl font-bold text-text-light mb-8 leading-tight">
                微生物工业应用馆
              </h1>

              <p className="animate-fade-in-up stagger-4 opacity-0 font-mono text-base text-text-muted/80 leading-relaxed max-w-xl">
                从远古的发酵酿酒到现代的基因工程药物，微生物始终是人类工业文明的隐形合作伙伴。
                在这里，我们探索微生物在<span className="text-glow-primary mx-1">食品发酵</span>、
                <span className="text-glow-primary mx-1">污水处理</span>、
                <span className="text-glow-primary mx-1">生物制药</span>、
                <span className="text-glow-primary mx-1">农业改良</span>、
                <span className="text-glow-primary mx-1">生物燃料</span>、
                <span className="text-glow-primary mx-1">环境修复</span>
                六大领域的真实产业应用，见证微观生命改变宏观世界的力量。
              </p>

              <div className="animate-fade-in-up stagger-5 opacity-0 mt-10 flex items-center gap-8">
                <div>
                  <div className="font-display text-5xl font-bold text-glow-primary">
                    {allApplications.length}
                  </div>
                  <div className="font-mono text-xs text-text-muted/60 mt-1 tracking-widest uppercase">
                    应用案例
                  </div>
                </div>
                <div className="h-16 w-px bg-white/10" />
                <div>
                  <div className="font-display text-5xl font-bold text-glow-purple">6</div>
                  <div className="font-mono text-xs text-text-muted/60 mt-1 tracking-widest uppercase">
                    产业领域
                  </div>
                </div>
                <div className="h-16 w-px bg-white/10" />
                <div>
                  <div className="font-display text-5xl font-bold text-glow-blue">
                    {totalMicrobes}
                  </div>
                  <div className="font-mono text-xs text-text-muted/60 mt-1 tracking-widest uppercase">
                    关联微生物
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-fade-in-up stagger-3 opacity-0">
              <div className="grid grid-cols-2 gap-4">
                {allCategories.map((cat) => {
                  const summary = categorySummary.find((s) => s.category === cat)!;
                  const color = INDUSTRIAL_CATEGORY_COLORS[cat];
                  const Icon = categoryIcons[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                      className="glass-card p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-glow-primary/40 group"
                      style={{
                        borderColor: activeCategory === cat ? `${color}80` : undefined,
                        boxShadow: activeCategory === cat ? `0 0 30px ${color}20` : undefined,
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: `${color}20`, color }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div
                            className="font-display text-lg font-semibold"
                            style={{ color: activeCategory === cat ? color : undefined }}
                          >
                            {INDUSTRIAL_CATEGORY_LABELS[cat]}
                          </div>
                        </div>
                      </div>
                      <p className="font-mono text-[11px] text-text-muted/70 leading-relaxed mb-3 line-clamp-2">
                        {INDUSTRIAL_CATEGORY_DESCRIPTIONS[cat]}
                      </p>
                      <div className="flex items-center gap-4 text-[10px] font-mono text-text-muted/60">
                        <span>
                          <span className="text-text-light mr-1">{summary.count}</span>案例
                        </span>
                        <span>
                          <span className="text-text-light mr-1">{summary.microbeCount}</span>物种
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-8">
        <div className="container mx-auto px-6">
          <div className="relative max-w-md mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索应用案例..."
              className="w-full pl-11 pr-10 py-3 rounded-full bg-background-card/60 border border-white/10 text-text-light font-mono text-sm placeholder:text-text-muted/40 focus:outline-none focus:border-glow-primary/40 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/5 text-text-muted hover:text-text-light transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {activeCategory && (
            <div className="mb-8 animate-fade-in-up opacity-0">
              {(() => {
                const color = INDUSTRIAL_CATEGORY_COLORS[activeCategory];
                const Icon = categoryIcons[activeCategory];
                const summary = categorySummary.find((s) => s.category === activeCategory)!;
                return (
                  <div className="glass-card p-8" style={{ borderColor: `${color}30` }}>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center"
                          style={{ background: `${color}20`, color }}
                        >
                          <Icon className="w-7 h-7" />
                        </div>
                        <div>
                          <h2 className="font-display text-3xl font-semibold" style={{ color }}>
                            {INDUSTRIAL_CATEGORY_LABELS[activeCategory]}
                          </h2>
                          <p className="font-mono text-sm text-text-muted/70 mt-1">
                            {INDUSTRIAL_CATEGORY_DESCRIPTIONS[activeCategory]}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveCategory(null)}
                        className="p-2 rounded-full hover:bg-white/5 text-text-muted hover:text-text-light transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
                      <div>
                        <div className="font-display text-4xl font-bold" style={{ color }}>
                          {summary.count}
                        </div>
                        <div className="font-mono text-xs text-text-muted/60 mt-1 tracking-wider uppercase">
                          应用案例
                        </div>
                      </div>
                      <div>
                        <div className="font-display text-4xl font-bold text-text-light">
                          {summary.microbeCount}
                        </div>
                        <div className="font-mono text-xs text-text-muted/60 mt-1 tracking-wider uppercase">
                          关联微生物
                        </div>
                      </div>
                      <div>
                        <div className="font-display text-4xl font-bold text-text-light">
                          {scaleLabels[
                            getApplicationsByCategory(activeCategory).some((a) => a.scale === 'global')
                              ? 'global'
                              : getApplicationsByCategory(activeCategory).some((a) => a.scale === 'industrial')
                                ? 'industrial'
                                : 'pilot'
                          ]}
                        </div>
                        <div className="font-mono text-xs text-text-muted/60 mt-1 tracking-wider uppercase">
                          产业规模
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {filteredApplications.length === 0 ? (
            <div className="text-center py-20">
              <div className="font-mono text-text-muted">暂无匹配的应用案例</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplications.map((app) => {
                const color = INDUSTRIAL_CATEGORY_COLORS[app.category];
                const relatedMicrobesData = app.relatedMicrobes
                  .map((rm) => {
                    const m = microbes.find((microbe) => microbe.id === rm.microbeId);
                    return m ? { microbe: m, role: rm.role, importance: rm.importance } : null;
                  })
                  .filter(
                    (item): item is { microbe: typeof microbes[number]; role: string; importance: 'primary' | 'secondary' | 'supporting' } =>
                      item !== null,
                  );
                return (
                  <Link
                    key={app.id}
                    to={`/industry/${app.id}`}
                    className="glass-card p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-glow-primary/40 group animate-fade-in-up opacity-0"
                    style={{ borderColor: `${color}20` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span
                        className="font-mono text-[10px] px-2 py-1 rounded-md"
                        style={{ background: `${color}20`, color }}
                      >
                        {INDUSTRIAL_CATEGORY_LABELS[app.category]}
                      </span>
                      <span className="font-mono text-[10px] text-text-muted/60">
                        {scaleLabels[app.scale]}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-semibold text-text-light mb-2 group-hover:text-glow-primary transition-colors">
                      {app.title}
                    </h3>
                    <p className="font-mono text-xs text-text-muted/60 mb-3">{app.subtitle}</p>

                    <p className="font-mono text-[11px] text-text-muted/80 leading-relaxed mb-4 line-clamp-3">
                      {app.summary}
                    </p>

                    {app.keyMetrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mb-4 pt-4 border-t border-white/5">
                        {app.keyMetrics.slice(0, 2).map((metric, i) => (
                          <div key={i}>
                            <div className="font-display text-lg font-bold" style={{ color }}>
                              {metric.value}
                            </div>
                            <div className="font-mono text-[9px] text-text-muted/60 mt-0.5">
                              {metric.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {relatedMicrobesData.length > 0 && (
                      <div className="pt-4 border-t border-white/5">
                        <div className="flex items-center gap-1.5 mb-3">
                          <Info className="w-3 h-3 text-text-muted" />
                          <span className="font-mono text-[10px] text-text-muted/70">
                            关联微生物 ({relatedMicrobesData.length})
                          </span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {relatedMicrobesData.slice(0, 3).map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
                              style={{
                                background: `${CATEGORY_COLORS[item.microbe.category]}10`,
                                border: `1px solid ${CATEGORY_COLORS[item.microbe.category]}30`,
                              }}
                            >
                              <img
                                src={item.microbe.imageUrl}
                                alt={item.microbe.name}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                              <span
                                className="font-mono text-[10px]"
                                style={{ color: CATEGORY_COLORS[item.microbe.category] }}
                              >
                                {item.microbe.name}
                              </span>
                            </div>
                          ))}
                          {relatedMicrobesData.length > 3 && (
                            <span className="font-mono text-[10px] text-text-muted/60 px-2 py-1">
                              +{relatedMicrobesData.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-text-muted/60">
                        {app.processSteps.length} 个工艺步骤
                      </span>
                      <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-glow-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
