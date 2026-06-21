import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { TreeNode } from '../../data/treeOfLife';
import {
  TAXONOMY_RANK_LABELS,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
} from '../../data/treeOfLife';
import type { Microbe } from '../../../shared/types';
import {
  RELATION_TYPE_COLORS,
  RELATION_TYPE_LABELS,
  ABILITY_TAG_LABELS,
  ABILITY_DIMENSION_COLORS,
} from '../../../shared/types';
import { getRelationsForMicrobe } from '../../data/ecologicalRelations';
import { getMicrobeAbilityProfile, getAbilityTagInfo } from '../../data/microbeAbilities';
import type { AbilityDimension } from '../../../shared/types';
import { scientists, discoveryEvents } from '../../data/archaeologyData';
import {
  X,
  Info,
  Users,
  FileText,
  ChevronRight,
  ExternalLink,
  Calendar,
  MapPin,
  Ruler,
  Sparkles,
  Dna,
  BookOpen,
} from 'lucide-react';

interface NodeDetailPanelProps {
  node: TreeNode | null;
  onClose: () => void;
  microbes: Microbe[];
  onSelectRelatedNode: (nodeId: string) => void;
}

type TabType = 'profile' | 'relations' | 'research';

export function NodeDetailPanel({
  node,
  onClose,
  microbes,
  onSelectRelatedNode,
}: NodeDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [relatedMicrobes, setRelatedMicrobes] = useState<
    { microbe: Microbe; relationType: string; description: string }[]
  >([]);
  const [abilityProfile, setAbilityProfile] = useState<ReturnType<
    typeof getMicrobeAbilityProfile
  > | null>(null);
  const [relatedDiscoveries, setRelatedDiscoveries] = useState<typeof discoveryEvents>([]);
  const [relatedScientists, setRelatedScientists] = useState<typeof scientists>([]);

  useEffect(() => {
    if (node && node.rank === 'species' && node.microbeId) {
      const relations = getRelationsForMicrobe(node.microbeId);
      const related: { microbe: Microbe; relationType: string; description: string }[] = [];

      relations.forEach((rel) => {
        const otherId = rel.sourceId === node.microbeId ? rel.targetId : rel.sourceId;
        const other = microbes.find((m) => m.id === otherId);
        if (other) {
          related.push({
            microbe: other,
            relationType: rel.type,
            description: rel.description,
          });
        }
      });

      setRelatedMicrobes(related);
      setAbilityProfile(getMicrobeAbilityProfile(node.microbeId));

      const disc = discoveryEvents.filter((d) => d.relatedMicrobes.includes(node.microbeId!));
      setRelatedDiscoveries(disc);

      const sciIds = new Set(disc.flatMap((d) => d.scientists));
      const scis = scientists.filter((s) => sciIds.has(s.id));
      setRelatedScientists(scis);
    } else {
      setRelatedMicrobes([]);
      setAbilityProfile(null);
      setRelatedDiscoveries([]);
      setRelatedScientists([]);
    }
    setActiveTab('profile');
  }, [node, microbes]);

  if (!node) return null;

  const category = node.category;
  const color = category ? CATEGORY_COLORS[category] : '#00ffc8';
  const isSpecies = node.rank === 'species';
  const microbe = isSpecies ? microbes.find((m) => m.id === node.microbeId) : null;

  return (
    <div className="fixed right-0 top-0 bottom-0 w-full lg:w-[520px] z-40 animate-slide-in-right">
      <div className="absolute inset-0 bg-background-deep/95 backdrop-blur-xl border-l border-glow-primary/20" />
      <div className="relative h-full overflow-y-auto">
        <div className="p-6 pb-24">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${color}20`, color }}
              >
                {isSpecies ? <Dna className="w-5 h-5" /> : <Info className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-text-light">
                  {node.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="font-mono text-[10px] px-2 py-0.5 rounded-md"
                    style={{ background: `${color}20`, color }}
                  >
                    {TAXONOMY_RANK_LABELS[node.rank]}
                  </span>
                  {category && (
                    <span className="font-mono text-[10px] text-text-muted">
                      {CATEGORY_LABELS[category]}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-text-muted hover:text-text-light transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2 mb-6 border-b border-white/5">
            {([
              { id: 'profile', label: '档案', icon: Info },
              { id: 'relations', label: '生态关系', icon: Users },
              { id: 'research', label: '研究记录', icon: FileText },
            ] as const).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-mono text-sm border-b-2 -mb-px transition-all ${
                    isActive
                      ? 'text-glow-primary border-glow-primary'
                      : 'text-text-muted hover:text-text-light border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === 'relations' && relatedMicrobes.length > 0 && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{ background: `${color}20`, color }}
                    >
                      {relatedMicrobes.length}
                    </span>
                  )}
                  {tab.id === 'research' && relatedDiscoveries.length > 0 && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{ background: `${color}20`, color }}
                    >
                      {relatedDiscoveries.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {activeTab === 'profile' && (
            <div className="space-y-6">
              {isSpecies && microbe && (
                <div className="glass-card p-5" style={{ borderColor: `${color}20` }}>
                  <div className="flex gap-4">
                    <div
                      className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0"
                      style={{
                        background: `${color}15`,
                        border: `1px solid ${color}30`,
                      }}
                    >
                      {microbe.imageUrl && (
                        <img
                          src={microbe.imageUrl}
                          alt={microbe.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg font-semibold text-text-light mb-1">
                        {microbe.name}
                      </h3>
                      <p className="font-mono text-xs text-glow-primary italic mb-3">
                        {microbe.scientificName}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {microbe.characteristics?.slice(0, 3).map((c, i) => (
                          <span
                            key={i}
                            className="font-mono text-[10px] px-2 py-1 rounded-md"
                            style={{ background: `${color}12`, color: `${color}cc` }}
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {node.description && (
                <div className="glass-card p-5">
                  <h3 className="font-display text-sm font-semibold text-text-light mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" style={{ color }} />
                    简介
                  </h3>
                  <p className="font-mono text-xs text-text-light/80 leading-relaxed whitespace-pre-line">
                    {node.description}
                  </p>
                </div>
              )}

              {isSpecies && (
                <div className="grid grid-cols-2 gap-3">
                  {node.discoveredYear && (
                    <div className="glass-card p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-glow-primary" />
                        <span className="font-mono text-[10px] text-text-muted tracking-wider uppercase">
                          发现年代
                        </span>
                      </div>
                      <div className="font-display text-lg font-bold text-text-light">
                        {node.discoveredYear}
                      </div>
                    </div>
                  )}
                  {node.size && (
                    <div className="glass-card p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Ruler className="w-4 h-4 text-glow-primary" />
                        <span className="font-mono text-[10px] text-text-muted tracking-wider uppercase">
                          大小
                        </span>
                      </div>
                      <div className="font-display text-lg font-bold text-text-light">
                        {node.size}
                      </div>
                    </div>
                  )}
                  {node.habitat && (
                    <div className="glass-card p-4 col-span-2">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-glow-primary" />
                        <span className="font-mono text-[10px] text-text-muted tracking-wider uppercase">
                          栖息环境
                        </span>
                      </div>
                      <div className="font-mono text-sm text-text-light">{node.habitat}</div>
                    </div>
                  )}
                </div>
              )}

              {abilityProfile && abilityProfile.abilities.length > 0 && (
                <div className="glass-card p-5">
                  <h3 className="font-display text-sm font-semibold text-text-light mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" style={{ color }} />
                    能力标签
                    <span className="font-mono text-[10px] text-text-muted ml-auto">
                      共 {abilityProfile.abilities.length} 项
                    </span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {abilityProfile.abilities.map((a, i) => {
                      const tagInfo = getAbilityTagInfo(a.tag);
                      const dim: AbilityDimension = tagInfo?.dimension || 'metabolism';
                      const dimColor = ABILITY_DIMENSION_COLORS[dim] || color;
                      return (
                        <div
                          key={i}
                          className="group relative"
                        >
                          <span
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg cursor-help"
                            style={{
                              background: `${dimColor}15`,
                              border: `1px solid ${dimColor}30`,
                            }}
                          >
                            <span
                              className="font-mono text-[11px]"
                              style={{ color: dimColor }}
                            >
                              {ABILITY_TAG_LABELS[a.tag]}
                            </span>
                            <span className="font-mono text-[9px] text-text-muted/60">
                              {Math.round(a.strength * 100)}%
                            </span>
                          </span>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 glass-card p-2 text-[10px] font-mono text-text-light/90 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-50">
                            {a.evidence}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {!isSpecies && node.microbeCount !== undefined && (
                <div className="glass-card p-5">
                  <h3 className="font-display text-sm font-semibold text-text-light mb-3 flex items-center gap-2">
                    <Dna className="w-4 h-4" style={{ color }} />
                    分类概览
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-mono text-[10px] text-text-muted mb-1">包含物种</div>
                      <div
                        className="font-display text-3xl font-bold"
                        style={{ color }}
                      >
                        {node.microbeCount}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-text-muted mb-1">下级分类</div>
                      <div className="font-display text-3xl font-bold text-text-light">
                        {node.children.length}
                      </div>
                    </div>
                  </div>
                  {node.children.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="font-mono text-[10px] text-text-muted mb-2">
                        {TAXONOMY_RANK_LABELS[
                          (['domain', 'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'] as const)[
                            ['domain', 'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'].indexOf(
                              node.rank,
                            ) + 1
                          ]
                        ] || '种'}级子类
                      </div>
                      {node.children.slice(0, 8).map((child) => (
                        <button
                          key={child.id}
                          onClick={() => onSelectRelatedNode(child.id)}
                          className="w-full flex items-center justify-between p-3 rounded-lg bg-white/3 hover:bg-white/8 border border-white/5 hover:border-glow-primary/30 transition-all group text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{
                                background: child.category
                                  ? CATEGORY_COLORS[child.category]
                                  : color,
                              }}
                            />
                            <span className="font-mono text-xs text-text-light group-hover:text-glow-primary transition-colors">
                              {child.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {child.microbeCount !== undefined && (
                              <span className="font-mono text-[10px] text-text-muted">
                                {child.microbeCount}种
                              </span>
                            )}
                            <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-glow-primary transition-colors" />
                          </div>
                        </button>
                      ))}
                      {node.children.length > 8 && (
                        <div className="text-center font-mono text-[10px] text-text-muted py-2">
                          还有 {node.children.length - 8} 个分类...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {isSpecies && node.microbeId && (
                <Link
                  to={`/microbe/${node.microbeId}`}
                  className="btn-primary w-full justify-center"
                >
                  <ExternalLink className="w-4 h-4" />
                  查看完整档案页面
                </Link>
              )}
            </div>
          )}

          {activeTab === 'relations' && (
            <div className="space-y-4">
              {relatedMicrobes.length > 0 ? (
                relatedMicrobes.map((item, idx) => {
                  const relColor = RELATION_TYPE_COLORS[item.relationType as keyof typeof RELATION_TYPE_COLORS];
                  return (
                    <div
                      key={idx}
                      className="glass-card p-4"
                      style={{ borderColor: `${relColor}15` }}
                    >
                      <div className="flex items-start gap-4">
                        <Link
                          to={`/microbe/${item.microbe.id}`}
                          className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 group"
                          style={{
                            background: `${CATEGORY_COLORS[item.microbe.category]}15`,
                            border: `1px solid ${CATEGORY_COLORS[item.microbe.category]}30`,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRelatedNode(`species_${item.microbe.id}`);
                          }}
                        >
                          <img
                            src={item.microbe.imageUrl}
                            alt={item.microbe.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <button
                                onClick={() => onSelectRelatedNode(`species_${item.microbe.id}`)}
                                className="font-display text-sm font-semibold text-text-light hover:text-glow-primary transition-colors"
                              >
                                {item.microbe.name}
                              </button>
                              <p className="font-mono text-[10px] text-text-muted/60 italic">
                                {item.microbe.scientificName}
                              </p>
                            </div>
                            <span
                              className="font-mono text-[10px] px-2 py-0.5 rounded-md whitespace-nowrap"
                              style={{
                                background: `${relColor}15`,
                                color: relColor,
                              }}
                            >
                              {RELATION_TYPE_LABELS[item.relationType as keyof typeof RELATION_TYPE_LABELS]}
                            </span>
                          </div>
                          <p className="font-mono text-[11px] text-text-light/70 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="glass-card p-12 text-center">
                  <Users className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
                  <p className="font-mono text-sm text-text-muted mb-2">暂无生态关系数据</p>
                  <p className="font-mono text-[10px] text-text-muted/50">
                    {isSpecies ? '该物种暂无记录的生态关系' : '请选择具体物种查看生态关系'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'research' && (
            <div className="space-y-4">
              {relatedDiscoveries.length > 0 && (
                <div>
                  <h3 className="font-display text-sm font-semibold text-text-light mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" style={{ color }} />
                    相关发现事件
                  </h3>
                  <div className="space-y-3">
                    {relatedDiscoveries.map((d) => (
                      <div key={d.id} className="glass-card p-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h4 className="font-display text-sm font-semibold text-text-light">
                            {d.title}
                          </h4>
                          <span className="font-mono text-[10px] text-text-muted whitespace-nowrap">
                            {d.year}年
                          </span>
                        </div>
                        <p className="font-mono text-[11px] text-text-light/70 leading-relaxed mb-3">
                          {d.summary}
                        </p>
                        {d.keyFindings.length > 0 && (
                          <div className="space-y-1.5">
                            {d.keyFindings.slice(0, 3).map((f, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <span className="w-1 h-1 rounded-full bg-glow-primary mt-1.5 flex-shrink-0" />
                                <span className="font-mono text-[10px] text-text-muted/80">
                                  {f}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {relatedScientists.length > 0 && (
                <div>
                  <h3 className="font-display text-sm font-semibold text-text-light mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4" style={{ color }} />
                    相关科学家
                  </h3>
                  <div className="space-y-3">
                    {relatedScientists.map((s) => (
                      <div key={s.id} className="glass-card p-4">
                        <div className="flex gap-4">
                          <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                              background: `${color}15`,
                              border: `1px solid ${color}30`,
                            }}
                          >
                            <Users className="w-6 h-6" style={{ color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-display text-sm font-semibold text-text-light">
                                {s.name}
                              </h4>
                              <span className="font-mono text-[10px] text-text-muted">
                                {s.nationality}
                              </span>
                            </div>
                            <p className="font-mono text-[10px] text-text-muted/60 mb-2">
                              {s.birthYear}
                              {s.deathYear ? ` - ${s.deathYear}` : ''}
                            </p>
                            <p className="font-mono text-[11px] text-text-light/70 leading-relaxed line-clamp-2">
                              {s.biography}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {relatedDiscoveries.length === 0 && relatedScientists.length === 0 && (
                <div className="glass-card p-12 text-center">
                  <FileText className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
                  <p className="font-mono text-sm text-text-muted mb-2">暂无研究记录</p>
                  <p className="font-mono text-[10px] text-text-muted/50">
                    {isSpecies ? '该物种暂无记录的研究历史' : '请选择具体物种查看研究记录'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
