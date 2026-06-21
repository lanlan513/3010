import { useMemo, useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Search,
  X,
  TrendingUp,
  Zap,
  BarChart3,
  GitBranch,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Award,
  Target,
  Users,
  Activity,
  Info,
  Link2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import {
  ABILITY_DIMENSION_LABELS,
  ABILITY_DIMENSION_DESCRIPTIONS,
  ABILITY_DIMENSION_COLORS,
  ABILITY_TAG_LABELS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from '../../shared/types';
import type {
  AbilityDimension,
  AbilityTag,
  AbilityRankItem,
  AbilityAssociation,
} from '../../shared/types';
import {
  getAbilityTagsByDimension,
  getMicrobesByAbility,
  getAbilityRank,
  getAbilityAssociations,
  getAbilityAssociationsForTag,
  getDimensionSummary,
  getAbilityTagInfo,
  abilityTagInfos,
} from '../data/microbeAbilities';
import { MicrobeCard } from '../components/MicrobeCard';

type TabType = 'browse' | 'rank' | 'association';
type SortRankBy = 'count' | 'totalStrength' | 'avgStrength';

const dimensionIcons: Record<AbilityDimension, typeof Zap> = {
  metabolism: Zap,
  environment: Target,
  biotechnology: Sparkles,
  ecology: Layers,
  pathogenicity: Activity,
  medicine: Users,
};

export function AbilityAtlasPage() {
  const { microbes } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('browse');
  const [activeDimension, setActiveDimension] = useState<AbilityDimension | null>(null);
  const [activeTag, setActiveTag] = useState<AbilityTag | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [rankSortBy, setRankSortBy] = useState<SortRankBy>('count');
  const [expandedAssociations, setExpandedAssociations] = useState<Set<AbilityTag>>(new Set());
  const [fetchTriggered, setFetchTriggered] = useState(false);

  useEffect(() => {
    if (!fetchTriggered) {
      useAppStore.getState().fetchMicrobes();
      setFetchTriggered(true);
    }
  }, [fetchTriggered]);

  const dimensionSummary = useMemo(() => getDimensionSummary(), []);
  const abilityRank = useMemo(() => getAbilityRank(rankSortBy), [rankSortBy]);
  const allAssociations = useMemo(() => getAbilityAssociations(), []);
  const topAssociations = useMemo(() => allAssociations.slice(0, 20), [allAssociations]);

  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return abilityTagInfos;
    const q = searchQuery.toLowerCase();
    return abilityTagInfos.filter(
      (info) =>
        ABILITY_TAG_LABELS[info.tag].toLowerCase().includes(q) ||
        info.description.toLowerCase().includes(q) ||
        info.scientificBackground.toLowerCase().includes(q) ||
        ABILITY_DIMENSION_LABELS[info.dimension].toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const dimensionToShow: AbilityDimension | null = activeDimension;

  const microbesForActiveTag = useMemo(() => {
    if (!activeTag) return [];
    const results = getMicrobesByAbility(activeTag);
    return results
      .map((r) => {
        const m = microbes.find((microbe) => microbe.id === r.microbeId);
        return m ? { microbe: m, strength: r.strength, evidence: r.evidence } : null;
      })
      .filter(Boolean) as { microbe: any; strength: number; evidence: string }[];
  }, [activeTag, microbes]);

  const activeTagAssociations = useMemo(() => {
    if (!activeTag) return [];
    return getAbilityAssociationsForTag(activeTag).slice(0, 10);
  }, [activeTag]);

  const allDimensions: AbilityDimension[] = [
    'metabolism',
    'environment',
    'biotechnology',
    'ecology',
    'pathogenicity',
    'medicine',
  ];

  const toggleAssociationPair = (tag1: AbilityTag, tag2: AbilityTag) => {
    setExpandedAssociations((prev) => {
      const next = new Set(prev);
      const shouldExpand = !(next.has(tag1) && next.has(tag2));
      if (shouldExpand) {
        next.add(tag1);
        next.add(tag2);
      } else {
        next.delete(tag1);
        next.delete(tag2);
      }
      return next;
    });
  };

  const isAssociationExpanded = (tag1: AbilityTag, tag2: AbilityTag) =>
    expandedAssociations.has(tag1) && expandedAssociations.has(tag2);

  const microbeListRef = useRef<HTMLDivElement>(null);

  const scrollToMicrobeList = () => {
    setTimeout(() => {
      microbeListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="relative min-h-screen">
      <section className="relative overflow-hidden pt-32 pb-12">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 60% 80% at 20% 10%, #00ffc815, transparent), radial-gradient(ellipse 50% 70% at 80% 30%, #9b59b615, transparent), radial-gradient(ellipse 40% 60% at 50% 90%, #3498db15, transparent)',
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
                  <BarChart3 className="w-8 h-8" />
                </div>
                <div>
                  <span className="font-mono text-xs tracking-[0.3em] uppercase block text-glow-primary">
                    Function Atlas
                  </span>
                </div>
              </div>

              <h1 className="animate-fade-in-up stagger-3 opacity-0 font-display text-5xl md:text-6xl font-bold text-text-light mb-8 leading-tight">
                微生物能力图鉴
              </h1>

              <p className="animate-fade-in-up stagger-4 opacity-0 font-mono text-base text-text-muted/80 leading-relaxed max-w-xl">
                超越分类学的功能学视角。在这里，我们不再按物种划分微生物世界，而是从
                <span className="text-glow-primary mx-1">代谢能力</span>、
                <span className="text-glow-primary mx-1">环境适应</span>、
                <span className="text-glow-primary mx-1">生物技术</span>、
                <span className="text-glow-primary mx-1">生态功能</span>、
                <span className="text-glow-primary mx-1">致病特性</span>、
                <span className="text-glow-primary mx-1">医学应用</span>
                六大维度重新描绘微生物的功能图谱，揭示能力之间的深层关联。
              </p>

              <div className="animate-fade-in-up stagger-5 opacity-0 mt-10 flex items-center gap-8">
                <div>
                  <div className="font-display text-5xl font-bold text-glow-primary">
                    {abilityTagInfos.length}
                  </div>
                  <div className="font-mono text-xs text-text-muted/60 mt-1 tracking-widest uppercase">
                    能力标签
                  </div>
                </div>
                <div className="h-16 w-px bg-white/10" />
                <div>
                  <div className="font-display text-5xl font-bold text-glow-purple">6</div>
                  <div className="font-mono text-xs text-text-muted/60 mt-1 tracking-widest uppercase">
                    功能维度
                  </div>
                </div>
                <div className="h-16 w-px bg-white/10" />
                <div>
                  <div className="font-display text-5xl font-bold text-glow-blue">
                    {allAssociations.length}
                  </div>
                  <div className="font-mono text-xs text-text-muted/60 mt-1 tracking-widest uppercase">
                    能力关联
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-fade-in-up stagger-3 opacity-0">
              <div className="grid grid-cols-2 gap-4">
                {allDimensions.map((dim, idx) => {
                  const summary = dimensionSummary[dim];
                  const color = ABILITY_DIMENSION_COLORS[dim];
                  const Icon = dimensionIcons[dim];
                  return (
                    <button
                      key={dim}
                      onClick={() => {
                        setActiveDimension(dim);
                        setActiveTab('browse');
                        setActiveTag(null);
                      }}
                      className="glass-card p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-glow-primary/40 group"
                      style={{
                        borderColor:
                          activeDimension === dim ? `${color}80` : undefined,
                        boxShadow:
                          activeDimension === dim ? `0 0 30px ${color}20` : undefined,
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
                            style={{ color: activeDimension === dim ? color : undefined }}
                          >
                            {ABILITY_DIMENSION_LABELS[dim]}
                          </div>
                        </div>
                      </div>
                      <p className="font-mono text-[11px] text-text-muted/70 leading-relaxed mb-3 line-clamp-2">
                        {ABILITY_DIMENSION_DESCRIPTIONS[dim]}
                      </p>
                      <div className="flex items-center gap-4 text-[10px] font-mono text-text-muted/60">
                        <span>
                          <span className="text-text-light mr-1">{summary.tagCount}</span>标签
                        </span>
                        <span>
                          <span className="text-text-light mr-1">{summary.microbeCount}</span>物种
                        </span>
                        <span>
                          均<span className="text-text-light ml-1">{summary.avgAbilitiesPerMicrobe.toFixed(1)}</span>
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
          <div className="glass-card p-2 inline-flex gap-2 mb-10">
            {(
              [
                { key: 'browse', label: '能力维度浏览', icon: Layers },
                { key: 'rank', label: '能力排行榜', icon: TrendingUp },
                { key: 'association', label: '能力关联分析', icon: GitBranch },
              ] as { key: TabType; label: string; icon: typeof Layers }[]
            ).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-sm transition-all duration-300 ${
                    isActive
                      ? 'bg-glow-primary/15 text-glow-primary'
                      : 'text-text-muted hover:text-text-light hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {activeTab === 'browse' && (
            <div className="space-y-8">
              <div className="relative max-w-md mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索能力标签..."
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

              {!dimensionToShow && (
                <div className="space-y-8">
                  {allDimensions.map((dim) => {
                    const tags = getAbilityTagsByDimension(dim).filter((t) =>
                      filteredTags.some((f) => f.tag === t.tag),
                    );
                    if (tags.length === 0) return null;
                    const color = ABILITY_DIMENSION_COLORS[dim];
                    const Icon = dimensionIcons[dim];
                    return (
                      <div key={dim} className="animate-fade-in-up opacity-0 stagger-1">
                        <div className="flex items-center gap-3 mb-6">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: `${color}20`, color }}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3
                              className="font-display text-2xl font-semibold"
                              style={{ color }}
                            >
                              {ABILITY_DIMENSION_LABELS[dim]}
                            </h3>
                            <p className="font-mono text-xs text-text-muted/60 mt-0.5">
                              {ABILITY_DIMENSION_DESCRIPTIONS[dim]}
                            </p>
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {tags.map((tagInfo) => {
                            const count = getMicrobesByAbility(tagInfo.tag).length;
                            const isActive = activeTag === tagInfo.tag;
                            return (
                              <button
                                key={tagInfo.tag}
                                onClick={() =>
                                  setActiveTag(isActive ? null : tagInfo.tag)
                                }
                                className={`glass-card p-4 text-left transition-all duration-300 hover:-translate-y-1 ${
                                  isActive
                                    ? 'ring-2 ring-glow-primary/60 border-glow-primary/60'
                                    : ''
                                }`}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <h4 className="font-display text-lg font-semibold text-text-light">
                                    {ABILITY_TAG_LABELS[tagInfo.tag]}
                                  </h4>
                                  <span
                                    className="font-mono text-xs px-2 py-1 rounded-md"
                                    style={{ background: `${color}20`, color }}
                                  >
                                    {count} 种
                                  </span>
                                </div>
                                <p className="font-mono text-[11px] text-text-muted/80 leading-relaxed line-clamp-2">
                                  {tagInfo.description}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {dimensionToShow && (
                <div>
                  <button
                    onClick={() => setActiveDimension(null)}
                    className="flex items-center gap-2 font-mono text-sm text-text-muted hover:text-glow-primary transition-colors mb-6"
                  >
                    <ChevronDown className="w-4 h-4 -rotate-90" />
                    查看全部维度
                  </button>

                  {(() => {
                    const dim = dimensionToShow;
                    const color = ABILITY_DIMENSION_COLORS[dim];
                    const Icon = dimensionIcons[dim];
                    const tags = getAbilityTagsByDimension(dim).filter((t) =>
                      filteredTags.some((f) => f.tag === t.tag),
                    );
                    return (
                      <div className="animate-fade-in-up opacity-0">
                        <div
                          className="glass-card p-8 mb-8"
                          style={{ borderColor: `${color}30` }}
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div
                              className="w-14 h-14 rounded-2xl flex items-center justify-center"
                              style={{ background: `${color}20`, color }}
                            >
                              <Icon className="w-7 h-7" />
                            </div>
                            <div>
                              <h2
                                className="font-display text-3xl font-semibold"
                                style={{ color }}
                              >
                                {ABILITY_DIMENSION_LABELS[dim]}
                              </h2>
                              <p className="font-mono text-sm text-text-muted/70 mt-1">
                                {ABILITY_DIMENSION_DESCRIPTIONS[dim]}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-6 mt-6 pt-6 border-t border-white/5">
                            <div>
                              <div
                                className="font-display text-4xl font-bold"
                                style={{ color }}
                              >
                                {tags.length}
                              </div>
                              <div className="font-mono text-xs text-text-muted/60 mt-1 tracking-wider uppercase">
                                能力标签
                              </div>
                            </div>
                            <div>
                              <div className="font-display text-4xl font-bold text-text-light">
                                {dimensionSummary[dim].microbeCount}
                              </div>
                              <div className="font-mono text-xs text-text-muted/60 mt-1 tracking-wider uppercase">
                                覆盖物种
                              </div>
                            </div>
                            <div>
                              <div className="font-display text-4xl font-bold text-text-light">
                                {dimensionSummary[dim].totalAbilities}
                              </div>
                              <div className="font-mono text-xs text-text-muted/60 mt-1 tracking-wider uppercase">
                                总能力实例
                              </div>
                            </div>
                            <div>
                              <div className="font-display text-4xl font-bold text-text-light">
                                {dimensionSummary[dim].avgAbilitiesPerMicrobe.toFixed(1)}
                              </div>
                              <div className="font-mono text-xs text-text-muted/60 mt-1 tracking-wider uppercase">
                                平均/物种
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                          {tags.map((tagInfo) => {
                            const count = getMicrobesByAbility(tagInfo.tag).length;
                            const isActive = activeTag === tagInfo.tag;
                            return (
                              <button
                                key={tagInfo.tag}
                                onClick={() => setActiveTag(isActive ? null : tagInfo.tag)}
                                className={`glass-card p-4 text-left transition-all duration-300 hover:-translate-y-1 ${
                                  isActive
                                    ? 'ring-2 ring-glow-primary/60 border-glow-primary/60'
                                    : ''
                                }`}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <h4 className="font-display text-lg font-semibold text-text-light">
                                    {ABILITY_TAG_LABELS[tagInfo.tag]}
                                  </h4>
                                  <span
                                    className="font-mono text-xs px-2 py-1 rounded-md"
                                    style={{ background: `${color}20`, color }}
                                  >
                                    {count} 种
                                  </span>
                                </div>
                                <p className="font-mono text-[11px] text-text-muted/80 leading-relaxed line-clamp-2">
                                  {tagInfo.description}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {activeTag && (
                <div className="mt-10">
                  {(() => {
                    const info = getAbilityTagInfo(activeTag);
                    if (!info) return null;
                    const color = ABILITY_DIMENSION_COLORS[info.dimension];
                    return (
                      <div className="animate-fade-in-up opacity-0">
                        <div
                          className="glass-card p-6 mb-6"
                          style={{ borderLeftColor: color, borderLeftWidth: 4 }}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className="font-mono text-xs px-2 py-1 rounded-md"
                                  style={{ background: `${color}20`, color }}
                                >
                                  {ABILITY_DIMENSION_LABELS[info.dimension]}
                                </span>
                                <span className="font-mono text-xs text-text-muted/60">
                                  {microbesForActiveTag.length} 种微生物具备此能力
                                </span>
                              </div>
                              <h3 className="font-display text-3xl font-semibold text-text-light">
                                {ABILITY_TAG_LABELS[activeTag]}
                              </h3>
                            </div>
                            <button
                              onClick={() => setActiveTag(null)}
                              className="p-2 rounded-full hover:bg-white/5 text-text-muted hover:text-text-light transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <p className="font-mono text-sm text-text-light/90 leading-relaxed mb-3">
                            {info.description}
                          </p>
                          <div className="flex items-start gap-2 mt-4 p-4 rounded-xl bg-background-deep/50">
                            <Info className="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0" />
                            <p className="font-mono text-xs text-text-muted/80 leading-relaxed">
                              {info.scientificBackground}
                            </p>
                          </div>

                          {activeTagAssociations.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-white/5">
                              <div className="flex items-center gap-2 mb-4">
                                <Link2 className="w-4 h-4 text-glow-primary" />
                                <span className="font-mono text-sm text-text-light">
                                  关联能力 (Top {activeTagAssociations.length})
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {activeTagAssociations.map((assoc) => {
                                  const otherTag =
                                    assoc.tag1 === activeTag ? assoc.tag2 : assoc.tag1;
                                  const otherInfo = getAbilityTagInfo(otherTag);
                                  if (!otherInfo) return null;
                                  const otherColor =
                                    ABILITY_DIMENSION_COLORS[otherInfo.dimension];
                                  return (
                                    <button
                                      key={otherTag}
                                      onClick={() => setActiveTag(otherTag)}
                                      className="group flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 hover:border-glow-primary/40 transition-all duration-300"
                                      style={{
                                        background: `linear-gradient(90deg, ${color}10, ${otherColor}10)`,
                                      }}
                                    >
                                      <span className="font-mono text-xs text-text-light group-hover:text-glow-primary transition-colors">
                                        {ABILITY_TAG_LABELS[otherTag]}
                                      </span>
                                      <span className="font-mono text-[10px] text-text-muted/60">
                                        {Math.round(assoc.correlationScore * 100)}%
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        <h4 ref={microbeListRef} className="font-display text-xl font-semibold text-text-light mb-6">
                          具备此能力的微生物
                          <span className="ml-2 font-mono text-sm text-text-muted/60">
                            按能力强度排序
                          </span>
                        </h4>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                          {microbesForActiveTag.map((item, idx) => (
                            <div key={item.microbe.id} className="relative">
                              <MicrobeCard microbe={item.microbe} index={idx} />
                              <div className="absolute top-3 left-3 z-20">
                                <div
                                  className="glass-card px-3 py-1.5 flex items-center gap-2"
                                  style={{ borderColor: `${color}50` }}
                                >
                                  <Zap className="w-3 h-3" style={{ color }} />
                                  <span
                                    className="font-mono text-[11px] font-bold"
                                    style={{ color }}
                                  >
                                    {Math.round(item.strength * 100)}%
                                  </span>
                                </div>
                              </div>
                              <div className="mt-3 px-1">
                                <p className="font-mono text-[11px] text-text-muted/70 leading-relaxed line-clamp-2">
                                  {item.evidence}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {activeTab === 'rank' && (
            <div className="space-y-8">
              <div className="glass-card p-4 inline-flex gap-2 mb-8">
                {(
                  [
                    { key: 'count', label: '按物种数量', desc: '覆盖物种数排名' },
                    { key: 'totalStrength', label: '按累计强度', desc: '能力总和排名' },
                    { key: 'avgStrength', label: '按平均强度', desc: '单物种强度排名' },
                  ] as { key: SortRankBy; label: string; desc: string }[]
                ).map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setRankSortBy(item.key)}
                    className={`flex flex-col items-start px-5 py-3 rounded-xl transition-all duration-300 ${
                      rankSortBy === item.key
                        ? 'bg-glow-primary/15 text-glow-primary'
                        : 'text-text-muted hover:text-text-light hover:bg-white/5'
                    }`}
                  >
                    <span className="font-mono text-sm font-semibold">{item.label}</span>
                    <span className="font-mono text-[10px] opacity-70">{item.desc}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {abilityRank.map((item, idx) => {
                  const info = getAbilityTagInfo(item.tag);
                  if (!info) return null;
                  const color = ABILITY_DIMENSION_COLORS[item.dimension];
                  const maxCount = abilityRank[0].microbeCount;
                  const maxTotal = abilityRank[0].totalStrength;
                  const maxAvg = abilityRank[0].avgStrength;
                  const value =
                    rankSortBy === 'count'
                      ? item.microbeCount
                      : rankSortBy === 'totalStrength'
                      ? item.totalStrength
                      : item.avgStrength;
                  const maxValue =
                    rankSortBy === 'count'
                      ? maxCount
                      : rankSortBy === 'totalStrength'
                      ? maxTotal
                      : maxAvg;
                  const pct = (value / maxValue) * 100;
                  const isTop = idx < 3;

                  return (
                    <div
                      key={item.tag}
                      className="glass-card p-5 hover:border-glow-primary/40 transition-all duration-300"
                    >
                      <div className="flex items-center gap-5">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-display text-xl font-bold ${
                            isTop ? 'text-background-deep' : 'text-text-muted'
                          }`}
                          style={{
                            background: isTop
                              ? idx === 0
                                ? 'linear-gradient(135deg, #f1c40f, #e67e22)'
                                : idx === 1
                                ? 'linear-gradient(135deg, #bdc3c7, #95a5a6)'
                                : 'linear-gradient(135deg, #cd7f32, #a0522d)'
                              : 'transparent',
                            border: isTop ? 'none' : '1px solid rgba(255,255,255,0.1)',
                          }}
                        >
                          {isTop ? (
                            <Award className="w-5 h-5" />
                          ) : (
                            <span>#{idx + 1}</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-display text-xl font-semibold text-text-light">
                              {ABILITY_TAG_LABELS[item.tag]}
                            </h4>
                            <span
                              className="font-mono text-[10px] px-2 py-1 rounded-md"
                              style={{ background: `${color}20`, color }}
                            >
                              {ABILITY_DIMENSION_LABELS[item.dimension]}
                            </span>
                          </div>
                          <p className="font-mono text-xs text-text-muted/70 leading-relaxed line-clamp-1 mb-3">
                            {info.description}
                          </p>
                          <div className="relative h-2 bg-background-deep/50 rounded-full overflow-hidden">
                            <div
                              className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                              style={{
                                width: `${pct}%`,
                                background: `linear-gradient(90deg, ${color}80, ${color})`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-right">
                          <div>
                            <div className="font-display text-2xl font-bold text-text-light">
                              {item.microbeCount}
                            </div>
                            <div className="font-mono text-[10px] text-text-muted/60 uppercase tracking-wider">
                              物种数
                            </div>
                          </div>
                          <div className="hidden sm:block">
                            <div
                              className="font-display text-2xl font-bold"
                              style={{ color }}
                            >
                              {rankSortBy === 'avgStrength'
                                ? (value * 100).toFixed(0) + '%'
                                : rankSortBy === 'totalStrength'
                                ? value.toFixed(1)
                                : value}
                            </div>
                            <div className="font-mono text-[10px] text-text-muted/60 uppercase tracking-wider">
                              {rankSortBy === 'count'
                                ? '物种数'
                                : rankSortBy === 'totalStrength'
                                ? '累积强度'
                                : '平均强度'}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setActiveTag(item.tag);
                              setActiveTab('browse');
                              scrollToMicrobeList();
                            }}
                            className="p-2 rounded-full hover:bg-white/5 text-text-muted hover:text-glow-primary transition-colors"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'association' && (
            <div className="space-y-8">
              <div className="glass-card p-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-glow-purple/20 text-glow-purple flex-shrink-0">
                    <GitBranch className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-text-light mb-2">
                      能力关联图谱分析
                    </h3>
                    <p className="font-mono text-sm text-text-muted/80 leading-relaxed max-w-3xl">
                      通过共现分析计算能力之间的相关性（Lift值）。高关联度意味着当微生物具备某项能力时，
                      很可能同时具备另一项能力。这揭示了微生物功能模块的演化关联——某些能力在生态位中是协同出现的，
                      如嗜热与嗜压常共存于深海热泉古菌，益生菌与免疫调节常共存于肠道共生菌。
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {topAssociations.map((assoc, idx) => {
                  const info1 = getAbilityTagInfo(assoc.tag1);
                  const info2 = getAbilityTagInfo(assoc.tag2);
                  if (!info1 || !info2) return null;
                  const color1 = ABILITY_DIMENSION_COLORS[info1.dimension];
                  const color2 = ABILITY_DIMENSION_COLORS[info2.dimension];
                  const isExpanded = isAssociationExpanded(assoc.tag1, assoc.tag2);
                  const microbes1 = getMicrobesByAbility(assoc.tag1).map((m) => m.microbeId);
                  const microbes2 = getMicrobesByAbility(assoc.tag2).map((m) => m.microbeId);
                  const sharedMicrobeIds = microbes1.filter((id) => microbes2.includes(id));
                  const sharedMicrobes = sharedMicrobeIds
                    .map((id) => microbes.find((m) => m.id === id))
                    .filter(Boolean) as any[];

                  return (
                    <div
                      key={idx}
                      className="glass-card overflow-hidden transition-all duration-300"
                    >
                      <button
                        onClick={() => toggleAssociationPair(assoc.tag1, assoc.tag2)}
                        className="w-full p-5 text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="font-display text-2xl font-bold text-text-muted/50 w-8 text-center">
                            #{idx + 1}
                          </div>

                          <div
                            className="flex-1 min-w-0 flex items-center gap-3 p-3 rounded-xl"
                            style={{
                              background: `linear-gradient(90deg, ${color1}15, transparent 50%, ${color2}15)`,
                            }}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className="font-mono text-[10px] px-2 py-0.5 rounded-md"
                                  style={{ background: `${color1}25`, color: color1 }}
                                >
                                  {ABILITY_DIMENSION_LABELS[info1.dimension]}
                                </span>
                              </div>
                              <span className="font-display text-lg font-semibold text-text-light">
                                {ABILITY_TAG_LABELS[assoc.tag1]}
                              </span>
                            </div>

                            <div className="flex flex-col items-center px-4">
                              <div
                                className="w-24 h-1.5 rounded-full overflow-hidden"
                                style={{ background: 'rgba(255,255,255,0.05)' }}
                              >
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${assoc.correlationScore * 100}%`,
                                    background: `linear-gradient(90deg, ${color1}, #00ffc8, ${color2})`,
                                  }}
                                />
                              </div>
                              <div className="flex items-center gap-1 mt-2">
                                <Link2 className="w-3 h-3 text-glow-primary" />
                                <span className="font-mono text-[10px] text-glow-primary font-bold">
                                  {Math.round(assoc.correlationScore * 100)}%
                                </span>
                              </div>
                            </div>

                            <div className="flex-1 min-w-0 text-right">
                              <div className="flex items-center justify-end gap-2 mb-1">
                                <span
                                  className="font-mono text-[10px] px-2 py-0.5 rounded-md"
                                  style={{ background: `${color2}25`, color: color2 }}
                                >
                                  {ABILITY_DIMENSION_LABELS[info2.dimension]}
                                </span>
                              </div>
                              <span className="font-display text-lg font-semibold text-text-light">
                                {ABILITY_TAG_LABELS[assoc.tag2]}
                              </span>
                            </div>
                          </div>

                          <div className="text-right pr-2">
                            <div className="font-display text-xl font-bold text-text-light">
                              {assoc.cooccurrenceCount}
                            </div>
                            <div className="font-mono text-[10px] text-text-muted/60 uppercase tracking-wider">
                              共现数
                            </div>
                          </div>

                          <div
                            className={`p-2 rounded-lg transition-transform duration-300 ${
                              isExpanded ? 'rotate-180 text-glow-primary' : 'text-text-muted'
                            }`}
                          >
                            <ChevronDown className="w-5 h-5" />
                          </div>
                        </div>

                        <div className="mt-4 ml-12 pl-4 border-l-2 border-white/5">
                          <p className="font-mono text-xs text-text-muted/70 leading-relaxed">
                            {assoc.description}
                          </p>
                        </div>
                      </button>

                      {isExpanded && sharedMicrobes.length > 0 && (
                        <div className="px-5 pb-6 pt-2 border-t border-white/5 animate-fade-in-up">
                          <div className="flex items-center gap-2 mb-4 ml-12">
                            <Users className="w-4 h-4 text-text-muted" />
                            <span className="font-mono text-sm text-text-light">
                              同时具备两项能力的微生物 ({sharedMicrobes.length} 种)
                            </span>
                          </div>
                          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 ml-12">
                            {sharedMicrobes.map((m) => (
                              <Link
                                key={m.id}
                                to={`/microbe/${m.id}`}
                                className="group flex items-center gap-3 p-3 rounded-xl border border-white/10 hover:border-glow-primary/40 transition-all duration-300"
                              >
                                <div
                                  className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden"
                                  style={{
                                    background: `${CATEGORY_COLORS[m.category]}20`,
                                    border: `1px solid ${CATEGORY_COLORS[m.category]}40`,
                                  }}
                                >
                                  <img
                                    src={m.imageUrl}
                                    alt={m.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h5 className="font-display text-sm font-semibold text-text-light group-hover:text-glow-primary transition-colors truncate">
                                    {m.name}
                                  </h5>
                                  <span
                                    className="font-mono text-[10px]"
                                    style={{ color: CATEGORY_COLORS[m.category] }}
                                  >
                                    {CATEGORY_LABELS[m.category]}
                                  </span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-glow-primary group-hover:translate-x-0.5 transition-all" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
