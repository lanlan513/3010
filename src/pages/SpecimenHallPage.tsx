import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Database,
  Dna,
  Search,
  Filter,
  SlidersHorizontal,
  Archive,
  Award,
  FileCheck2,
  Brain,
  Leaf,
  Clock,
  Zap,
  Factory,
  Sparkles,
  ChevronRight,
  BarChart3,
  BookText,
  FolderKanban,
  Network,
} from 'lucide-react';
import {
  getAllSpecimens,
  getSpecimenStats,
} from '../data/specimensData';
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  SPECIMEN_CATEGORY_COLORS,
  SPECIMEN_CATEGORY_LABELS,
  type MicrobeCategory,
  type KnowledgeCard,
} from '../../shared/types';

export function SpecimenHallPage() {
  const specimens = getAllSpecimens();
  const stats = getSpecimenStats();
  const [activeCategory, setActiveCategory] = useState<MicrobeCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'quality' | 'code' | 'completeness'>('quality');

  const filteredSpecimens = useMemo(() => {
    let result = [...specimens];

    if (activeCategory !== 'all') {
      const prefixMap: Record<string, string> = {
        bacteria: 'SPEC-BACT',
        fungi: 'SPEC-FUNG',
        virus: 'SPEC-VIRU',
        archaea: 'SPEC-ARCH',
      };
      const prefix = prefixMap[activeCategory];
      result = result.filter((s) => s.specimenCode.startsWith(prefix));
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.taxonomicClassification.species.toLowerCase().includes(term) ||
          s.specimenCode.toLowerCase().includes(term) ||
          s.accessionNumber.toLowerCase().includes(term) ||
          s.collector.toLowerCase().includes(term) ||
          s.notes.toLowerCase().includes(term)
      );
    }

    if (sortBy === 'quality') {
      result.sort((a, b) => b.qualityScore - a.qualityScore);
    } else if (sortBy === 'code') {
      result.sort((a, b) => a.specimenCode.localeCompare(b.specimenCode));
    } else if (sortBy === 'completeness') {
      result.sort((a, b) => b.completenessIndex - a.completenessIndex);
    }

    return result;
  }, [specimens, activeCategory, searchTerm, sortBy]);

  const totalQualityAvg =
    specimens.reduce((acc, s) => acc + s.qualityScore, 0) / Math.max(1, specimens.length);
  const totalCompletenessAvg =
    specimens.reduce((acc, s) => acc + s.completenessIndex, 0) /
    Math.max(1, specimens.length);

  const knowledgeCardTypes: KnowledgeCard['type'][] = [
    'morphology',
    'habitat',
    'discovery',
    'metabolism',
    'application',
    'fun_fact',
  ];
  const cardIcons = [Brain, Leaf, Clock, Zap, Factory, Sparkles];

  const getCategoryFromCode = (code: string): MicrobeCategory => {
    if (code.startsWith('SPEC-BACT')) return 'bacteria';
    if (code.startsWith('SPEC-FUNG')) return 'fungi';
    if (code.startsWith('SPEC-VIRU')) return 'virus';
    return 'archaea';
  };

  return (
    <div className="relative min-h-screen pt-32 pb-20">
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up opacity-0">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-glow-primary/30 bg-glow-primary/5 backdrop-blur-sm mb-6">
            <Database className="w-4 h-4 text-glow-primary" />
            <span className="font-mono text-xs text-glow-primary tracking-[0.2em] uppercase">
              Digital Specimen Museum
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-text-light mb-6 leading-tight">
            微生物
            <br />
            <span className="text-gradient-primary text-shadow-glow">数字标本馆</span>
          </h1>

          <p className="font-mono text-base text-text-muted/80 max-w-2xl mx-auto leading-relaxed">
            标准化数字档案体系，收录每一种微生物的完整生物学信息。
            从形态特征到代谢能力，从发现历史到工业应用，构建微观世界的数字孪生。
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 animate-fade-in-up stagger-1 opacity-0">
          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-display font-bold text-glow-primary mb-2">
              {specimens.length}
            </div>
            <div className="font-mono text-xs text-text-muted tracking-wider uppercase">
              数字标本
            </div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-display font-bold text-glow-purple mb-2">
              {totalQualityAvg.toFixed(0)}
              <span className="text-xl">%</span>
            </div>
            <div className="font-mono text-xs text-text-muted tracking-wider uppercase">
              平均质量分
            </div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-display font-bold text-glow-gold mb-2">
              {totalCompletenessAvg.toFixed(0)}
              <span className="text-xl">%</span>
            </div>
            <div className="font-mono text-xs text-text-muted tracking-wider uppercase">
              档案完整度
            </div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-display font-bold text-glow-red mb-2">
              {specimens.reduce((acc, s) => acc + s.knowledgeCards.length, 0)}
            </div>
            <div className="font-mono text-xs text-text-muted tracking-wider uppercase">
              知识卡片
            </div>
          </div>
        </div>

        <div className="glass-card p-6 mb-12 animate-fade-in-up stagger-2 opacity-0">
          <div className="flex items-center gap-3 mb-6">
            <FolderKanban className="w-5 h-5 text-glow-primary" />
            <h3 className="font-display text-xl font-semibold text-text-light">
              标本分类统计
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const color = CATEGORY_COLORS[stat.category as MicrobeCategory];
              return (
                <div
                  key={stat.category}
                  className="p-4 rounded-2xl border relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer"
                  style={{
                    backgroundColor: `${color}08`,
                    borderColor: `${color}20`,
                  }}
                  onClick={() => setActiveCategory(stat.category as MicrobeCategory)}
                >
                  <div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
                    style={{ background: color }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: `${color}15`,
                          border: `1px solid ${color}30`,
                        }}
                      >
                        <Dna className="w-5 h-5" style={{ color }} />
                      </div>
                      <span
                        className="font-mono text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          background: `${color}15`,
                          color,
                          border: `1px solid ${color}30`,
                        }}
                      >
                        {stat.count > 0 ? `质量 ${stat.avgQuality.toFixed(0)}` : '待收录'}
                      </span>
                    </div>
                    <div
                      className="text-3xl font-display font-bold mb-1"
                      style={{ color }}
                    >
                      {stat.count}
                    </div>
                    <div className="font-mono text-[11px] text-text-muted tracking-wide uppercase">
                      {CATEGORY_LABELS[stat.category as MicrobeCategory]}标本
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-6 mb-10 animate-fade-in-up stagger-2 opacity-0">
          <div className="flex items-center gap-3 mb-6">
            <BookText className="w-5 h-5 text-glow-purple" />
            <h3 className="font-display text-xl font-semibold text-text-light">
              数字档案标准体系
            </h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="p-5 rounded-2xl border border-glow-primary/15 bg-glow-primary/5">
              <div className="flex items-center gap-2 mb-3">
                <Archive className="w-4 h-4 text-glow-primary" />
                <span className="font-mono text-[11px] tracking-wider text-glow-primary uppercase">
                  01 / 采集建档
                </span>
              </div>
              <h4 className="font-display text-base font-semibold text-text-light mb-2">
                标本元数据规范
              </h4>
              <p className="font-mono text-xs text-text-muted/80 leading-relaxed">
                18项核心元数据字段：采集编号、时间地点、采集者、保藏方法、
                存储条件、国际登录号等，符合WDCM世界数据中心标准。
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-glow-purple/15 bg-glow-purple/5">
              <div className="flex items-center gap-2 mb-3">
                <Dna className="w-4 h-4 text-glow-purple" />
                <span className="font-mono text-[11px] tracking-wider text-glow-purple uppercase">
                  02 / 分类鉴定
                </span>
              </div>
              <h4 className="font-display text-base font-semibold text-text-light mb-2">
                七级分类系统
              </h4>
              <p className="font-mono text-xs text-text-muted/80 leading-relaxed">
                严格遵循ICNP/ICNafp命名法规：界门纲目科属种七级分类，
                搭配16S/18S/ITS序列信息，支持系统发育树回溯。
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-glow-gold/15 bg-glow-gold/5">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-glow-gold" />
                <span className="font-mono text-[11px] tracking-wider text-glow-gold uppercase">
                  03 / 质量控制
                </span>
              </div>
              <h4 className="font-display text-base font-semibold text-text-light mb-2">
                双维度评分体系
              </h4>
              <p className="font-mono text-xs text-text-muted/80 leading-relaxed">
                质量评分：数据可信度、来源可追溯性；完整度指数：
                20+子模块覆盖度。两项指标均>90%方可进入核心馆藏。
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-glow-red/15 bg-glow-red/5">
              <div className="flex items-center gap-2 mb-3">
                <FileCheck2 className="w-4 h-4 text-glow-red" />
                <span className="font-mono text-[11px] tracking-wider text-glow-red uppercase">
                  04 / 文献溯源
                </span>
              </div>
              <h4 className="font-display text-base font-semibold text-text-light mb-2">
                学术证据链
              </h4>
              <p className="font-mono text-xs text-text-muted/80 leading-relaxed">
                每条信息均附Peer Reviewed文献出处，支持DOI跳转，
                数据更新时间戳记录，可追溯所有变更历史。
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-green-500/15 bg-green-500/5">
              <div className="flex items-center gap-2 mb-3">
                <Network className="w-4 h-4 text-green-400" />
                <span className="font-mono text-[11px] tracking-wider text-green-400 uppercase">
                  05 / 关联网络
                </span>
              </div>
              <h4 className="font-display text-base font-semibold text-text-light mb-2">
                跨模块语义链接
              </h4>
              <p className="font-mono text-xs text-text-muted/80 leading-relaxed">
                知识卡片与生命树、代谢工坊、工业应用馆深度联动，
                支持从标本一键跳转至对应实验模拟与场景展示。
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-white/15 bg-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-white/80" />
                <span className="font-mono text-[11px] tracking-wider text-white/80 uppercase">
                  06 / 开放获取
                </span>
              </div>
              <h4 className="font-display text-base font-semibold text-text-light mb-2">
                CC BY 4.0 开放协议
              </h4>
              <p className="font-mono text-xs text-text-muted/80 leading-relaxed">
                所有非敏感数据开放共享，支持学术研究与教育用途免费下载。
                结构化JSON/TSV/RDF多格式导出，兼容GBIF/ENA国际数据平台。
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 mb-12 animate-fade-in-up stagger-3 opacity-0">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索标本编号、物种名、采集者、登录号..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-white/10 focus:border-glow-primary/40 focus:bg-background/70 outline-none transition-all font-mono text-sm text-text-light placeholder:text-text-muted/50"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background/50 border border-white/10">
                <SlidersHorizontal className="w-4 h-4 text-text-muted" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-transparent outline-none font-mono text-sm text-text-light cursor-pointer"
                >
                  <option value="quality">按质量排序</option>
                  <option value="completeness">按完整度排序</option>
                  <option value="code">按编号排序</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
            <Filter className="w-4 h-4 text-text-muted" />
            <span className="font-mono text-xs text-text-muted">分类筛选：</span>
            <div className="flex flex-wrap gap-2">
              {(['all', 'bacteria', 'fungi', 'virus', 'archaea'] as const).map(
                (cat) => {
                  const isAll = cat === 'all';
                  const color = isAll ? '#00ffc8' : CATEGORY_COLORS[cat];
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-1.5 rounded-full font-mono text-xs transition-all ${
                        isActive
                          ? 'shadow-glow'
                          : 'hover:bg-white/5'
                      }`}
                      style={{
                        background: isActive ? `${color}20` : 'transparent',
                        color: isActive ? color : '#94a3b8',
                        border: `1px solid ${isActive ? `${color}50` : 'rgba(255,255,255,0.1)'}`,
                      }}
                    >
                      {isAll ? '全部' : CATEGORY_LABELS[cat]}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between animate-fade-in-up stagger-3 opacity-0">
          <div>
            <h2 className="font-display text-3xl font-semibold text-text-light mb-1">
              数字标本展柜
            </h2>
            <p className="font-mono text-sm text-text-muted/70">
              共找到 <span className="text-glow-primary">{filteredSpecimens.length}</span> 份标准化数字标本
            </p>
          </div>
        </div>

        {filteredSpecimens.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <Search className="w-12 h-12 text-text-muted/50 mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-text-light mb-2">
              暂无匹配的标本
            </h3>
            <p className="font-mono text-sm text-text-muted/70">
              尝试调整筛选条件或搜索关键词
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredSpecimens.map((specimen, idx) => {
              const category = getCategoryFromCode(specimen.specimenCode);
              const color = CATEGORY_COLORS[category];
              const mainModel = specimen.multiViewModels[0];
              const speciesName = specimen.taxonomicClassification.species;
              return (
                <Link
                  key={specimen.id}
                  to={`/specimen/${specimen.id}`}
                  className="glass-card p-6 relative overflow-hidden group hover:shadow-glow-xl transition-all duration-500 animate-fade-in-up opacity-0"
                  style={{
                    animationDelay: `${0.08 * idx}s`,
                    borderColor: `${color}15`,
                  }}
                >
                  <div
                    className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
                    style={{ background: color }}
                  />
                  <div
                    className="absolute top-0 left-0 w-1 h-full"
                    style={{
                      background: `linear-gradient(180deg, ${color}88, ${color}22, transparent)`,
                    }}
                  />

                  <div className="relative z-10 flex flex-col md:flex-row gap-6">
                    <div className="md:w-48 flex-shrink-0">
                      <div
                        className="aspect-square rounded-2xl overflow-hidden border-2 group-hover:scale-[1.02] transition-transform"
                        style={{ borderColor: `${color}30` }}
                      >
                        <img
                          src={mainModel?.imageUrl || specimen.highResImages[0]?.imageUrl}
                          alt={speciesName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className="font-mono text-[10px] tracking-widest px-2 py-0.5 rounded-full"
                              style={{
                                background: `${color}15`,
                                color,
                                border: `1px solid ${color}30`,
                              }}
                            >
                              {specimen.specimenCode}
                            </span>
                            <span className="font-mono text-[10px] text-text-muted">
                              {CATEGORY_LABELS[category]}
                            </span>
                          </div>
                          <h3 className="font-display text-2xl font-bold text-text-light leading-tight mb-1">
                            {speciesName.split(' ')[1] || speciesName}
                          </h3>
                          <p className="font-mono text-sm text-text-muted italic">
                            {speciesName}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div
                            className="px-2 py-1 rounded-lg flex items-center gap-1"
                            style={{
                              background: 'rgba(0,255,200,0.08)',
                              border: '1px solid rgba(0,255,200,0.2)',
                            }}
                          >
                            <Award className="w-3 h-3 text-glow-primary" />
                            <span className="font-mono text-[10px] text-glow-primary font-semibold">
                              {specimen.qualityScore}分
                            </span>
                          </div>
                          <div
                            className="px-2 py-1 rounded-lg flex items-center gap-1"
                            style={{
                              background: 'rgba(155,89,182,0.08)',
                              border: '1px solid rgba(155,89,182,0.2)',
                            }}
                          >
                            <FileCheck2 className="w-3 h-3 text-glow-purple" />
                            <span className="font-mono text-[10px] text-glow-purple font-semibold">
                              {specimen.completenessIndex}%完整
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="font-mono text-xs text-text-muted/80 leading-relaxed mb-4 line-clamp-2">
                        {specimen.notes}
                      </p>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-background/40 border border-white/5">
                          <div className="font-mono text-[9px] text-text-muted mb-1">
                            知识卡片
                          </div>
                          <div className="font-display text-lg font-semibold text-text-light">
                            {specimen.knowledgeCards.length}
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-background/40 border border-white/5">
                          <div className="font-mono text-[9px] text-text-muted mb-1">
                            多视角模型
                          </div>
                          <div className="font-display text-lg font-semibold text-text-light">
                            {specimen.multiViewModels.length}
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-background/40 border border-white/5">
                          <div className="font-mono text-[9px] text-text-muted mb-1">
                            高清图像
                          </div>
                          <div className="font-display text-lg font-semibold text-text-light">
                            {specimen.highResImages.length}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <div className="flex gap-1.5">
                          {knowledgeCardTypes.slice(0, 5).map((type, typeIdx) => {
                            const hasType = specimen.knowledgeCards.some(
                              (c) => c.type === type
                            );
                            const Icon = cardIcons[typeIdx];
                            return (
                              <div
                                key={type}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                                  hasType
                                    ? ''
                                    : 'opacity-30 grayscale'
                                }`}
                                style={{
                                  background: `${SPECIMEN_CATEGORY_COLORS[type]}12`,
                                  border: `1px solid ${SPECIMEN_CATEGORY_COLORS[type]}25`,
                                }}
                                title={SPECIMEN_CATEGORY_LABELS[type]}
                              >
                                <Icon
                                  className="w-3.5 h-3.5"
                                  style={{
                                    color: SPECIMEN_CATEGORY_COLORS[type],
                                  }}
                                />
                              </div>
                            );
                          })}
                        </div>
                        <div
                          className="flex items-center gap-1 font-mono text-xs transition-colors"
                          style={{ color }}
                        >
                          打开数字档案
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
