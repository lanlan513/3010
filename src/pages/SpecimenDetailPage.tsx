import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Dna,
  Brain,
  Leaf,
  Clock,
  Zap,
  Factory,
  Calendar,
  MapPin,
  User,
  Archive,
  Award,
  FileCheck2,
  Thermometer,
  Droplets,
  Wind,
  Globe2,
  BookOpen,
  BookText,
  Scroll,
  BarChart3,
  Building,
  ChevronRight,
  Star,
  TrendingUp,
  Beaker,
  Microscope,
} from 'lucide-react';
import { getSpecimenById } from '../data/specimensData';
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  GRAM_STAIN_LABELS,
  OXYGEN_REQUIREMENT_LABELS,
  MATURITY_LABELS,
  MATURITY_COLORS,
  INDUSTRIAL_CATEGORY_LABELS,
  INDUSTRIAL_CATEGORY_COLORS,
  METABOLISM_TYPE_LABELS,
  SPECIMEN_CATEGORY_LABELS,
  SPECIMEN_CATEGORY_COLORS,
  type MicrobeCategory,
} from '../../shared/types';
import { KnowledgeCard } from '../components/specimens/KnowledgeCard';
import { ModelViewer } from '../components/specimens/ModelViewer';
import { ImageGallery } from '../components/specimens/ImageGallery';

type SectionTab = 'overview' | 'morphology' | 'habitat' | 'discovery' | 'metabolism' | 'application' | 'knowledge';

export function SpecimenDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeSection, setActiveSection] = useState<SectionTab>('overview');
  const specimen = id ? getSpecimenById(Number(id)) : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!specimen) {
    return (
      <div className="container mx-auto px-6 pt-32 text-center">
        <h1 className="font-display text-4xl text-glow-red mb-4">标本不存在</h1>
        <Link to="/specimen-hall" className="btn-primary inline-flex">
          <ArrowLeft className="w-4 h-4" />
          返回标本馆
        </Link>
      </div>
  }

  const getCategoryFromCode = (code: string): MicrobeCategory => {
    if (code.startsWith('SPEC-BACT')) return 'bacteria';
    if (code.startsWith('SPEC-FUNG')) return 'fungi';
    if (code.startsWith('SPEC-VIRU')) return 'virus';
    return 'archaea';
  };

  const category = getCategoryFromCode(specimen.specimenCode);
  const color = CATEGORY_COLORS[category];
  const speciesName = specimen.taxonomicClassification.species;
  const commonName = speciesName.split(' ')[1] || speciesName;

  const sections: { key: SectionTab; label: string; icon: typeof Dna; color: string }[] = [
    { key: 'overview', label: '档案总览', icon: Archive, color: '#00ffc8' },
    { key: 'morphology', label: '形态特征', icon: Brain, color: SPECIMEN_CATEGORY_COLORS.morphology },
    { key: 'habitat', label: '生存环境', icon: Leaf, color: SPECIMEN_CATEGORY_COLORS.habitat },
    { key: 'discovery', label: '发现历史', icon: Clock, color: SPECIMEN_CATEGORY_COLORS.discovery },
    { key: 'metabolism', label: '代谢能力', icon: Zap, color: SPECIMEN_CATEGORY_COLORS.metabolism },
    { key: 'application', label: '应用价值', icon: Factory, color: SPECIMEN_CATEGORY_COLORS.application },
    { key: 'knowledge', label: '知识卡片', icon: BookText, color: '#9b59b6' },
  ];

  return (
    <div className="relative min-h-screen pt-32 pb-20">
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 30% 10%, ${color}22, transparent), radial-gradient(ellipse 50% 40% at 80% 60%, ${color}15, transparent)`,
        }}
      />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-8 animate-fade-in-up stagger-1 opacity-0">
          <Link
            to="/specimen-hall"
            className="inline-flex items-center gap-2 font-mono text-sm text-text-muted hover:text-glow-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回数字标本馆
          </Link>
        </div>

        <div className="mb-12 animate-fade-in-up stagger-2 opacity-0">
          <div className="flex flex-col lg:flex-row gap-8 lg:items-end lg:justify-between mb-8">
            <div className="flex items-start gap-5">
              <div
              className="w-24 h-24 rounded-3xl p-0.5 shrink-0"
              style={{
                background: `linear-gradient(135deg, ${color}88, transparent 60%)`,
              }}
            >
              <div className="w-full h-full rounded-3xl bg-background-card flex items-center justify-center overflow-hidden">
                <img
                  src={specimen.multiViewModels[0]?.imageUrl || specimen.highResImages[0]?.imageUrl}
                  alt={commonName}
                  className="w-full h-full object-cover"
                />
              </div>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className="font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{
                      background: `${color}15`,
                      color,
                      border: `1px solid ${color}30`,
                    }}
                  >
                    {specimen.specimenCode}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded-full bg-white/5 text-text-muted border border-white/10">
                    {CATEGORY_LABELS[category]}
                  </span>
                  <span className="font-mono text-[10px] tracking-wider px-3 py-1 rounded-full bg-glow-primary/10 text-glow-primary border border-glow-primary/20">
                    {specimen.accessionNumber}
                  </span>
                </div>
                <h1 className="font-display text-5xl md:text-6xl font-bold text-text-light mb-2 leading-tight" style={{ textShadow: `0 0 40px ${color}40` }}>
                  {commonName}
                </h1>
                <p className="font-mono text-lg text-text-muted italic">
                  {speciesName}
                </p>
              </div>
              </div>

            <div className="flex items-center gap-3">
              <div className="glass-card p-4 text-center min-w-[100px">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Award className="w-3.5 h-3.5 text-glow-primary" />
                  <span className="font-mono text-[10px] tracking-wider text-glow-primary">质量评分</span>
                </div>
                <div className="font-display text-2xl font-bold text-glow-primary">
                  {specimen.qualityScore}
                  <span className="text-sm">/100</span>
                </div>
              </div>
              <div className="glass-card p-4 text-center min-w-[100px">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <FileCheck2 className="w-3.5 h-3.5 text-glow-purple" />
                  <span className="font-mono text-[10px] tracking-wider text-glow-purple">档案完整度</span>
                </div>
                <div className="font-display text-2xl font-bold text-glow-purple">
                  {specimen.completenessIndex}
                  <span className="text-sm">%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.key;
              return (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={`px-5 py-2.5 rounded-full font-mono text-sm transition-all duration-300 flex items-center gap-2 ${
                    isActive ? 'shadow-glow-sm' : ''
                  }`}
                  style={{
                    background: isActive ? `${section.color}15` : 'rgba(255,255,255,0.03)`,
                    color: isActive ? section.color : '#94a3b8',
                    border: `1px solid ${isActive ? `${section.color}50` : 'rgba(255,255,255,0.1)`,
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeSection === 'overview' && (
          <div className="space-y-8 animate-fade-in-up stagger-3 opacity-0">
            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 space-y-6">
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <Archive className="w-5 h-5 text-glow-primary" />
                    <h2 className="font-display text-xl font-semibold text-text-light">
                      采集与保藏信息
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-background/40 border border-white/5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Calendar className="w-3 h-3 text-glow-primary" />
                        <span className="font-mono text-[10px] text-text-muted">采集日期</span>
                      </div>
                      <p className="font-mono text-sm text-text-light">{specimen.collectionDate}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-background/40 border border-white/5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <MapPin className="w-3 h-3 text-glow-purple" />
                        <span className="font-mono text-[10px] text-text-muted">采集地点</span>
                      </div>
                      <p className="font-mono text-sm text-text-light">{specimen.collectionLocation}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-background/40 border border-white/5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <User className="w-3 h-3 text-glow-gold" />
                        <span className="font-mono text-[10px] text-text-muted">采集者</span>
                      </div>
                      <p className="font-mono text-sm text-text-light">{specimen.collector}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-background/40 border border-white/5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Beaker className="w-3 h-3 text-green-400" />
                        <span className="font-mono text-[10px] text-text-muted">保藏方式</span>
                      </div>
                      <p className="font-mono text-sm text-text-light">{specimen.preservationMethod}</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 rounded-xl bg-glow-gold/5 border border-glow-gold/15">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Microscope className="w-3 h-3 text-glow-gold" />
                      <span className="font-mono text-[10px] text-text-muted">存储条件</span>
                    </div>
                    <p className="font-mono text-sm text-text-light">{specimen.storageConditions}</p>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <Dna className="w-5 h-5 text-glow-purple" />
                    <h2 className="font-display text-xl font-semibold text-text-light">
                      系统分类学地位
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(specimen.taxonomicClassification).map(([rank, name], idx) => {
                      const rankLabels: Record<string, string> = {
                        kingdom: '界',
                        phylum: '门',
                        class: '纲',
                        order: '目',
                        family: '科',
                        genus: '属',
                        species: '种',
                      };
                      return (
                        <div
                          key={rank}
                          className="flex items-center gap-3 p-3 rounded-xl bg-background/30 border border-white/5 hover:border-glow-purple/20 transition-colors"
                        >
                          <span
                            className="font-mono text-[10px] font-bold w-10 text-right px-2 py-0.5 rounded"
                            style={{
                              background: `rgba(155,89,182,0.12)`,
                              color: '#9b59b6',
                            }}
                          >
                            {rankLabels[rank]}
                          </span>
                          <span className="font-mono text-xs text-text-light">
                            {name}
                          </span>
                          {idx < 6 && (
                            <ChevronRight className="w-3 h-3 text-text-muted/40 ml-auto" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <BookText className="w-5 h-5 text-text-light" />
                    <h2 className="font-display text-xl font-semibold text-text-light">
                      标本备注说明
                    </h2>
                  </div>
                  <p className="font-mono text-sm text-text-muted/80 leading-relaxed">
                    {specimen.notes}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <ModelViewer models={specimen.multiViewModels} />
              </div>
            </div>

            <ImageGallery images={specimen.highResImages} />

            {specimen.references.length > 0 && (
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <BookOpen className="w-5 h-5 text-green-400" />
                  <h2 className="font-display text-xl font-semibold text-text-light">
                    参考文献 ({specimen.references.length})
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {specimen.references.map((ref, idx) => (
                    <div
                      key={ref.id}
                      className="p-4 rounded-xl bg-background/30 border border-white/5 hover:border-green-400/20 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="font-mono text-[10px] text-text-muted">[{idx + 1}]</span>
                        {ref.doi && (
                          <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-green-400/10 text-green-400 border border-green-400/20">
                            DOI
                          </span>
                        )}
                      </div>
                      <h4 className="font-display text-sm font-semibold text-text-light mb-1 leading-snug">
                        {ref.title}
                      </h4>
                      <p className="font-mono text-[11px] text-text-muted/70">
                        {ref.authors}
                      </p>
                      <p className="font-mono text-[11px] text-glow-primary/80 mt-1">
                        {ref.journal}, {ref.year}
                        {ref.doi && ` · ${ref.doi}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'morphology' && (
          <div className="space-y-8 animate-fade-in-up stagger-3 opacity-0">
            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Brain className="w-5 h-5" style={{ color: SPECIMEN_CATEGORY_COLORS.morphology }} />
                    <h2 className="font-display text-xl font-semibold text-text-light">
                      形态学结构
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {[
                      { label: '细胞形状', value: specimen.morphology.cellShape },
                      { label: '细胞大小', value: specimen.morphology.cellSize },
                      { label: '革兰氏染色', value: GRAM_STAIN_LABELS[specimen.morphology.gramStain] },
                      { label: '排列方式', value: specimen.morphology.arrangement },
                    ].map((item) => (
                      <div key={item.label} className="p-3 rounded-xl bg-background/30 border border-white/5">
                        <div className="font-mono text-[10px] text-text-muted tracking-wide mb-1">
                          {item.label}
                        </div>
                        <div className="font-display text-base font-semibold text-text-light">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div
                      className={`p-3 rounded-xl border ${
                        specimen.morphology.motility
                          ? 'bg-green-400/10 border-green-400/20 text-green-400'
                          : 'bg-white/5 border-white/10 text-text-muted/50'
                      }`}
                    >
                      <div className="font-mono text-[10px] tracking-wider">运动能力</div>
                      <div className="font-display text-sm font-semibold">
                        {specimen.morphology.motility ? '有运动性' : '无运动'}
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-xl border ${
                        specimen.morphology.sporeFormation
                          ? 'bg-glow-gold/10 border-glow-gold/20 text-glow-gold'
                          : 'bg-white/5 border-white/10 text-text-muted/50'
                    }`}
                    >
                      <div className="font-mono text-[10px] tracking-wider">产孢子</div>
                      <div className="font-display text-sm font-semibold">
                        {specimen.morphology.sporeFormation ? '可形成孢子' : '不产孢子'}
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-xl border ${
                        specimen.morphology.capsule
                          ? 'bg-glow-primary/10 border-glow-primary/20 text-glow-primary'
                          : 'bg-white/5 border-white/10 text-text-muted/50'
                      }`}
                    >
                      <div className="font-mono text-[10px] tracking-wider">荚膜形成</div>
                      <div className="font-display text-sm font-semibold">
                        {specimen.morphology.capsule ? '有荚膜' : '无荚膜'}
                      </div>
                    </div>
                  </div>

                  <h3 className="font-display text-base font-semibold text-text-light mb-3">
                    特殊结构特征
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {specimen.morphology.specialFeatures.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1.5 rounded-full font-mono text-xs border"
                        style={{
                          background: `${SPECIMEN_CATEGORY_COLORS.morphology}10`,
                          color: SPECIMEN_CATEGORY_COLORS.morphology,
                          borderColor: `${SPECIMEN_CATEGORY_COLORS.morphology}30`,
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-display text-base font-semibold text-text-light mb-3">
                    详细形态特征描述
                  </h3>
                  <div className="space-y-3">
                    {specimen.morphology.detailedFeatures.map((feat) => (
                      <div
                        key={feat.id}
                        className="p-4 rounded-xl border-l-4 bg-background/30 border-white/5 transition-colors hover:bg-background/50"
                        style={{
                          borderLeftColor: SPECIMEN_CATEGORY_COLORS.morphology,
                        }}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-display text-sm font-semibold text-text-light">
                            {feat.label}
                          </h4>
                          <span
                            className="font-mono text-xs px-2 py-0.5 rounded"
                            style={{
                              background: `${SPECIMEN_CATEGORY_COLORS.morphology}12`,
                              color: SPECIMEN_CATEGORY_COLORS.morphology,
                            }}
                          >
                            {feat.value}
                          </span>
                        </div>
                        <p className="font-mono text-xs text-text-muted/80">
                          {feat.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <ModelViewer models={specimen.multiViewModels} />
              </div>
            </div>
            </div>
        )}

        {activeSection === 'habitat' && (
          <div className="space-y-8 animate-fade-in-up stagger-3 opacity-0">
            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Leaf className="w-5 h-5" style={{ color: SPECIMEN_CATEGORY_COLORS.habitat }} />
                    <h2 className="font-display text-xl font-semibold text-text-light">
                      生存环境生态
                    </h2>
                  </div>

                  <div className="p-4 rounded-2xl border mb-6"
                    style={{
                      background: `${SPECIMEN_CATEGORY_COLORS.habitat}08`,
                      borderColor: `${SPECIMEN_CATEGORY_COLORS.habitat}20`,
                    }}
                  >
                    <div className="font-mono text-[10px] text-text-muted tracking-widest uppercase mb-2"
                      style={{ color: SPECIMEN_CATEGORY_COLORS.habitat }}
                    >
                      栖息地类型：{specimen.habitat.type}
                    </div>
                    <p className="font-mono text-sm text-text-muted/80 leading-relaxed">
                      {specimen.habitat.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="p-4 rounded-xl bg-background/30 border border-white/5">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Thermometer className="w-3.5 h-3.5 text-glow-red" />
                        <span className="font-mono text-[10px] text-text-muted">生长温度</span>
                      </div>
                      <div className="font-display text-lg font-bold text-text-light">
                        {specimen.habitat.temperature[0]}°C
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 mt-2 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-400 via-glow-primary to-glow-red"
                          style={{
                            marginLeft: `${(specimen.habitat.temperature[0] / 120 * 100}%`,
                            width: `${((specimen.habitat.temperature[1] - specimen.habitat.temperature[0]) / 120 * 100}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="font-mono text-[9px] text-text-muted">{specimen.habitat.temperature[1]}°C</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-background/30 border border-white/5">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Droplets className="w-3.5 h-3.5 text-glow-purple" />
                        <span className="font-mono text-[10px] text-text-muted">pH 范围</span>
                      </div>
                      <div className="font-display text-lg font-bold text-text-light">
                        {specimen.habitat.phRange[0]} - {specimen.habitat.phRange[1]}
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 mt-2 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-glow-red via-glow-primary to-glow-purple"
                          style={{
                            marginLeft: `${(specimen.habitat.phRange[0] / 14 * 100}%`,
                            width: `${((specimen.habitat.phRange[1] - specimen.habitat.phRange[0]) / 14 * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-background/30 border border-white/5">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Wind className="w-3.5 h-3.5 text-green-400" />
                        <span className="font-mono text-[10px] text-text-muted">氧气需求</span>
                      </div>
                      <div className="font-display text-base font-bold text-text-light">
                        {OXYGEN_REQUIREMENT_LABELS[specimen.habitat.oxygenRequirement]}
                      </div>
                      <div className="font-mono text-[10px] text-text-muted mt-2">
                        盐度: {specimen.habitat.salinity}
                      </div>
                    </div>
                  </div>

                  <h3 className="font-display text-base font-semibold text-text-light mb-3">
                    常见分布地点
                  </h3>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {specimen.habitat.commonLocations.map((loc) => (
                      <div
                        key={loc}
                        className="flex items-center gap-2 p-3 rounded-xl bg-background/30 border border-white/5"
                      >
                        <Globe2 className="w-3.5 h-3.5" style={{ color: SPECIMEN_CATEGORY_COLORS.habitat }} />
                        <span className="font-mono text-xs text-text-light">
                          {loc}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl border border-green-400/15 bg-green-400/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="w-4 h-4 text-green-400" />
                      <span className="font-mono text-xs tracking-wider text-green-400">生态功能定位</span>
                    </div>
                    <p className="font-mono text-sm text-text-muted/80 leading-relaxed">
                      {specimen.habitat.ecologicalRole}
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <ImageGallery images={specimen.highResImages} />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'discovery' && (
          <div className="space-y-8 animate-fade-in-up stagger-3 opacity-0">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-8">
                <Clock className="w-5 h-5" style={{ color: SPECIMEN_CATEGORY_COLORS.discovery }} />
                <h2 className="font-display text-xl font-semibold text-text-light">
                  发现历史时间线
                </h2>
              </div>

              <div className="relative">
                <div
                  className="absolute left-6 top-0 bottom-0 w-0.5"
                  style={{
                    background: `linear-gradient(180deg, ${SPECIMEN_CATEGORY_COLORS.discovery}66, transparent)`,
                  }}
                />
                <div className="space-y-6">
                  {specimen.discoveryTimeline.map((event, idx) => (
                    <div key={event.id} className="relative flex gap-6 pl-12">
                      <div
                        className="absolute left-0 w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10"
                        style={{
                          background: `${SPECIMEN_CATEGORY_COLORS.discovery}20`,
                          border: `2px solid ${SPECIMEN_CATEGORY_COLORS.discovery}`,
                        }}
                      >
                        <span className="font-display text-lg font-bold"
                          style={{ color: SPECIMEN_CATEGORY_COLORS.discovery }}
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="flex-1 p-5 rounded-2xl bg-background/40 border border-white/5 hover:border-glow-gold/30 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-display text-3xl font-bold"
                              style={{ color: SPECIMEN_CATEGORY_COLORS.discovery }}
                            >
                              {event.year}
                            </div>
                            <h3 className="font-display text-lg font-semibold text-text-light mt-1">
                              {event.title}
                            </h3>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-[10px] text-text-muted tracking-wider">发现者</div>
                            <div className="font-mono text-xs text-text-light">{event.discoverer}</div>
                          </div>
                        </div>
                        <p className="font-mono text-sm text-text-muted/80 leading-relaxed mb-3">
                          {event.description}
                        </p>
                        <div
                          className="p-3 rounded-xl"
                          style={{
                            background: `${SPECIMEN_CATEGORY_COLORS.discovery}08`,
                            borderLeft: `3px solid ${SPECIMEN_CATEGORY_COLORS.discovery}`,
                          }}
                        >
                          <div className="flex items-start gap-2">
                            <Star className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: SPECIMEN_CATEGORY_COLORS.discovery }} />
                            <p className="font-mono text-xs text-text-light/90 leading-relaxed">
                              <span className="font-semibold">科学意义：</span>
                              {event.significance}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'metabolism' && (
          <div className="space-y-8 animate-fade-in-up stagger-3 opacity-0">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-8">
                <Zap className="w-5 h-5" style={{ color: SPECIMEN_CATEGORY_COLORS.metabolism }} />
                <h2 className="font-display text-xl font-semibold text-text-light">
                  代谢能力图谱
                </h2>
              </div>

              <div className="space-y-5">
                {specimen.metabolicCapabilities.map((cap) => (
                  <div
                    key={cap.id}
                    className="p-5 rounded-2xl bg-background/30 border border-white/5 hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                          style={{
                            background: `${SPECIMEN_CATEGORY_COLORS.metabolism}15`,
                            border: `1px solid ${SPECIMEN_CATEGORY_COLORS.metabolism}30`,
                          }}
                        >
                          <TrendingUp className="w-7 h-7" style={{ color: SPECIMEN_CATEGORY_COLORS.metabolism }} />
                        </div>
                        <div>
                          <span className="font-mono text-[10px] text-text-muted tracking-widest uppercase">
                            {METABOLISM_TYPE_LABELS[cap.category]}
                          </span>
                          <h3 className="font-display text-lg font-semibold text-text-light">
                            {cap.name}
                          </h3>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono text-[10px] text-text-muted tracking-wider mb-1">
                          代谢效率</div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${cap.efficiency}%`,
                                background: `linear-gradient(90deg, ${SPECIMEN_CATEGORY_COLORS.metabolism}, ${SPECIMEN_CATEGORY_COLORS.metabolism}88)`,
                              }}
                            />
                          </div>
                          <span className="font-display text-lg font-bold" style={{ color: SPECIMEN_CATEGORY_COLORS.metabolism }}>
                            {cap.efficiency}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="font-mono text-sm text-text-muted/80 leading-relaxed mb-4">
                      {cap.description}
                    </p>

                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-background/40 border border-white/5">
                        <div className="font-mono text-[10px] text-text-muted mb-1">反应底物</div>
                        <div className="flex flex-wrap gap-1">
                          {cap.substrates.map((s) => (
                            <span key={s} className="px-2 py-0.5 rounded text-[10px] font-mono bg-glow-red/10 text-glow-red/90 border border-glow-red/20">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-background/40 border border-white/5">
                        <div className="font-mono text-[10px] text-text-muted mb-1">代谢产物</div>
                        <div className="flex flex-wrap gap-1">
                          {cap.products.map((p) => (
                            <span key={p} className="px-2 py-0.5 rounded text-[10px] font-mono bg-green-400/10 text-green-400/90 border border-green-400/20">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-background/40 border border-white/5">
                        <div className="font-mono text-[10px] text-text-muted mb-1">关键酶系</div>
                        <div className="flex flex-wrap gap-1">
                          {cap.keyEnzymes.slice(0, 2).map((e) => (
                            <span key={e} className="px-2 py-0.5 rounded text-[10px] font-mono bg-glow-purple/10 text-glow-purple/90 border border-glow-purple/20">
                              {e}
                            </span>
                          ))}
                          {cap.keyEnzymes.length > 2 && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-text-muted border border-white/10">
                              +{cap.keyEnzymes.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
        )}

        {activeSection === 'application' && (
          <div className="space-y-8 animate-fade-in-up stagger-3 opacity-0">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-8">
                <Factory className="w-5 h-5" style={{ color: SPECIMEN_CATEGORY_COLORS.application }} />
                <h2 className="font-display text-xl font-semibold text-text-light">
                  工业与科研应用
                </h2>
              </div>

              <div className="space-y-6">
                {specimen.applications.map((app) => {
                  const catColor = INDUSTRIAL_CATEGORY_COLORS[app.category];
                  const matColor = MATURITY_COLORS[app.maturity];
                  return (
                    <div
                      key={app.id}
                      className="p-6 rounded-2xl bg-background/30 border border-white/5 overflow-hidden relative group"
                    >
                      <div className="absolute top-0 left-0 w-full h-1"
                        style={{ background: `linear-gradient(90deg, ${catColor}88, ${catColor}22, transparent)` }}
                      />
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-5">
                        <div className="flex items-start gap-4">
                          <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                            style={{
                              background: `${catColor}15`,
                              border: `1px solid ${catColor}30`,
                            }}
                          >
                            <Building className="w-7 h-7" style={{ color: catColor }} />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span
                                className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full"
                                style={{
                                  background: `${catColor}12`,
                                  color: catColor,
                                  border: `1px solid ${catColor}30`,
                                }}
                              >
                                {INDUSTRIAL_CATEGORY_LABELS[app.category]}
                              </span>
                              <span
                                className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full"
                                style={{
                                  background: `${matColor}12`,
                                  color: matColor,
                                  border: `1px solid ${matColor}30`,
                                }}
                              >
                                {MATURITY_LABELS[app.maturity]}
                              </span>
                            </div>
                            <h3 className="font-display text-xl font-semibold text-text-light">
                              {app.title}
                            </h3>
                          </div>
                        </div>
                        <div className="mt-3 md:mt-0 md:text-right shrink-0">
                          <div className="font-mono text-[10px] text-text-muted tracking-wider">市场规模</div>
                          <div className="font-display text-base font-semibold" style={{ color: catColor }}>
                            {app.marketScale}
                          </div>
                        </div>
                      </div>

                      <p className="font-mono text-sm text-text-muted/80 leading-relaxed mb-4">
                        {app.description}
                      </p>

                      <div className="mb-4">
                        <div className="font-mono text-[10px] text-text-muted tracking-wider uppercase mb-2">
                          核心优势
                        </div>
                        <div className="grid md:grid-cols-2 gap-2">
                          {app.keyAdvantages.map((adv) => (
                            <div
                              key={adv}
                              className="flex items-start gap-2 p-2.5 rounded-xl"
                              style={{
                                background: `${catColor}08`,
                                border: `1px solid ${catColor}15`,
                              }}
                            >
                              <ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: catColor }} />
                              <span className="font-mono text-xs text-text-light">{adv}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/5">
                        <div className="font-mono text-[10px] text-text-muted tracking-wider uppercase mb-2">
                          典型案例研究
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          {app.caseStudies.map((cs, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-background/40 border border-white/5">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-[9px] text-text-muted">[{idx + 1}]</span>
                                <h4 className="font-display text-sm font-semibold text-text-light">
                                  {cs.title}
                                </h4>
                              </div>
                              <div className="font-mono text-[10px]" style={{ color: catColor }}>
                                {cs.organization}
                              </div>
                              <p className="font-mono text-[11px] text-text-muted/80 mt-1 leading-relaxed">
                                {cs.outcome}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            </div>
        )}

        {activeSection === 'knowledge' && (
          <div className="animate-fade-in-up stagger-3 opacity-0">
            <div className="flex items-center gap-3 mb-8">
              <BookText className="w-5 h-5 text-glow-purple" />
              <h2 className="font-display text-xl font-semibold text-text-light">
                精选知识卡片集
              </h2>
              <span className="font-mono text-xs text-text-muted px-2 py-1 rounded-full bg-glow-purple/10 text-glow-purple border border-glow-purple/20">
                共 {specimen.knowledgeCards.length} 张卡片
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {specimen.knowledgeCards.map((card, idx) => (
                <KnowledgeCard key={card.id} card={card} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
