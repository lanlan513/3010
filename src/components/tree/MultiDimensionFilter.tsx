import { useState } from 'react';
import type { FilterState } from '../../data/treeOfLife';
import { YEAR_RANGES, CATEGORY_LABELS, CATEGORY_COLORS } from '../../data/treeOfLife';
import type { MicrobeCategory, AbilityDimension, AbilityTag } from '../../../shared/types';
import {
  ABILITY_DIMENSION_LABELS,
  ABILITY_DIMENSION_COLORS,
  ABILITY_TAG_LABELS,
} from '../../../shared/types';
import { HABITAT_ZONES } from '../../data/habitats';
import { getAbilityTagsByDimension } from '../../data/microbeAbilities';
import {
  Filter,
  Calendar,
  MapPin,
  Sparkles,
  Dna,
  ChevronDown,
  ChevronUp,
  X,
  RotateCcw,
} from 'lucide-react';

interface MultiDimensionFilterProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

type SectionType = 'era' | 'habitat' | 'ability' | 'category';

export function MultiDimensionFilter({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
}: MultiDimensionFilterProps) {
  const [expandedSections, setExpandedSections] = useState<Set<SectionType>>(
    new Set(['era', 'habitat', 'ability', 'category']),
  );

  const toggleSection = (section: SectionType) => {
    const next = new Set(expandedSections);
    if (next.has(section)) {
      next.delete(section);
    } else {
      next.add(section);
    }
    setExpandedSections(next);
  };

  const resetFilters = () => {
    onFiltersChange({
      yearRange: [0, 2100],
      habitats: [],
      abilityDimensions: [],
      abilityTags: [],
      categories: [],
    });
  };

  const hasActiveFilters =
    filters.yearRange[0] !== 0 ||
    filters.yearRange[1] !== 2100 ||
    filters.habitats.length > 0 ||
    filters.abilityDimensions.length > 0 ||
    filters.abilityTags.length > 0 ||
    filters.categories.length > 0;

  const toggleCategory = (cat: MicrobeCategory) => {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onFiltersChange({ ...filters, categories: next });
  };

  const toggleHabitat = (habitatId: string) => {
    const next = filters.habitats.includes(habitatId)
      ? filters.habitats.filter((h) => h !== habitatId)
      : [...filters.habitats, habitatId];
    onFiltersChange({ ...filters, habitats: next });
  };

  const toggleYearRange = (range: [number, number]) => {
    if (filters.yearRange[0] === range[0] && filters.yearRange[1] === range[1]) {
      onFiltersChange({ ...filters, yearRange: [0, 2100] });
    } else {
      onFiltersChange({ ...filters, yearRange: range });
    }
  };

  const toggleAbilityDimension = (dim: AbilityDimension) => {
    const next = filters.abilityDimensions.includes(dim)
      ? filters.abilityDimensions.filter((d) => d !== dim)
      : [...filters.abilityDimensions, dim];
    const tags = next.length > 0
      ? Array.from(
          new Set(
            next.flatMap((d) => getAbilityTagsByDimension(d).map((t) => t.tag)),
          ),
        ).filter((t) => filters.abilityTags.includes(t))
      : [];
    onFiltersChange({ ...filters, abilityDimensions: next, abilityTags: tags });
  };

  const toggleAbilityTag = (tag: AbilityTag) => {
    const next = filters.abilityTags.includes(tag)
      ? filters.abilityTags.filter((t) => t !== tag)
      : [...filters.abilityTags, tag];
    onFiltersChange({ ...filters, abilityTags: next });
  };

  const getActiveTagsForDimension = (dim: AbilityDimension): AbilityTag[] => {
    const allTags = getAbilityTagsByDimension(dim).map((t) => t.tag);
    return filters.abilityTags.filter((t) => allTags.includes(t));
  };

  return (
    <div className="glass-card p-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-glow-primary" />
          <h3 className="font-display text-lg font-semibold text-text-light">多维筛选</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-mono text-text-muted hover:text-glow-primary hover:bg-glow-primary/10 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            重置
          </button>
        )}
      </div>

      <div className="mb-4 p-3 rounded-xl bg-glow-primary/5 border border-glow-primary/10">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-text-muted tracking-wider uppercase">
            筛选结果
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-glow-primary">
              {filteredCount}
            </span>
            <span className="font-mono text-[10px] text-text-muted">
              / {totalCount} 种
            </span>
          </div>
        </div>
        <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-glow-primary to-glow-purple transition-all duration-300"
            style={{ width: `${totalCount > 0 ? (filteredCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl border border-white/5 overflow-hidden">
          <button
            onClick={() => toggleSection('era')}
            className="w-full flex items-center justify-between p-3 hover:bg-white/3 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-glow-primary" />
              <span className="font-mono text-sm text-text-light">发现年代</span>
              {filters.yearRange[0] !== 0 || filters.yearRange[1] !== 2100 ? (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-glow-primary/15 text-glow-primary">
                  已选
                </span>
              ) : null}
            </div>
            {expandedSections.has('era') ? (
              <ChevronUp className="w-4 h-4 text-text-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-muted" />
            )}
          </button>
          {expandedSections.has('era') && (
            <div className="p-3 pt-0 space-y-2 border-t border-white/5">
              {YEAR_RANGES.map((yr) => {
                const isSelected =
                  filters.yearRange[0] === yr.range[0] && filters.yearRange[1] === yr.range[1];
                return (
                  <button
                    key={yr.label}
                    onClick={() => toggleYearRange(yr.range)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all ${
                      isSelected
                        ? 'bg-glow-primary/15 border border-glow-primary/30'
                        : 'bg-white/3 hover:bg-white/8 border border-transparent'
                    }`}
                  >
                    <span
                      className={`font-mono text-xs ${isSelected ? 'text-glow-primary' : 'text-text-light/80'}`}
                    >
                      {yr.label}
                    </span>
                    {isSelected && <X className="w-3 h-3 text-glow-primary" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/5 overflow-hidden">
          <button
            onClick={() => toggleSection('category')}
            className="w-full flex items-center justify-between p-3 hover:bg-white/3 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Dna className="w-4 h-4 text-glow-primary" />
              <span className="font-mono text-sm text-text-light">分类界域</span>
              {filters.categories.length > 0 && (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-glow-primary/15 text-glow-primary">
                  {filters.categories.length} 项
                </span>
              )}
            </div>
            {expandedSections.has('category') ? (
              <ChevronUp className="w-4 h-4 text-text-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-muted" />
            )}
          </button>
          {expandedSections.has('category') && (
            <div className="p-3 pt-0 grid grid-cols-2 gap-2 border-t border-white/5">
              {(['bacteria', 'fungi', 'virus', 'archaea'] as MicrobeCategory[]).map((cat) => {
                const isSelected = filters.categories.includes(cat);
                const color = CATEGORY_COLORS[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg transition-all ${
                      isSelected ? 'border-2' : 'border border-white/5 bg-white/3 hover:bg-white/8'
                    }`}
                    style={{
                      borderColor: isSelected ? color : undefined,
                      background: isSelected ? `${color}15` : undefined,
                    }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span
                      className={`font-mono text-xs ${isSelected ? '' : 'text-text-light/80'}`}
                      style={{ color: isSelected ? color : undefined }}
                    >
                      {CATEGORY_LABELS[cat]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/5 overflow-hidden">
          <button
            onClick={() => toggleSection('habitat')}
            className="w-full flex items-center justify-between p-3 hover:bg-white/3 transition-colors"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-glow-primary" />
              <span className="font-mono text-sm text-text-light">栖息环境</span>
              {filters.habitats.length > 0 && (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-glow-primary/15 text-glow-primary">
                  {filters.habitats.length} 项
                </span>
              )}
            </div>
            {expandedSections.has('habitat') ? (
              <ChevronUp className="w-4 h-4 text-text-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-muted" />
            )}
          </button>
          {expandedSections.has('habitat') && (
            <div className="p-3 pt-0 space-y-2 border-t border-white/5 max-h-64 overflow-y-auto">
              {HABITAT_ZONES.map((zone) => {
                const isSelected = filters.habitats.includes(zone.id);
                return (
                  <button
                    key={zone.id}
                    onClick={() => toggleHabitat(zone.id)}
                    className={`w-full flex items-start justify-between p-2.5 rounded-lg text-left transition-all ${
                      isSelected
                        ? 'border-2 bg-white/5'
                        : 'border border-white/5 bg-white/3 hover:bg-white/8'
                    }`}
                    style={{
                      borderColor: isSelected ? zone.color : undefined,
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-base">{zone.icon}</span>
                      <div>
                        <div
                          className={`font-mono text-xs ${isSelected ? '' : 'text-text-light/80'}`}
                          style={{ color: isSelected ? zone.color : undefined }}
                        >
                          {zone.name}
                        </div>
                        <div className="font-mono text-[9px] text-text-muted/60 mt-0.5">
                          {zone.nameEn}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <X className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: zone.color }} />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/5 overflow-hidden">
          <button
            onClick={() => toggleSection('ability')}
            className="w-full flex items-center justify-between p-3 hover:bg-white/3 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-glow-primary" />
              <span className="font-mono text-sm text-text-light">能力维度</span>
              {filters.abilityTags.length > 0 && (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-glow-primary/15 text-glow-primary">
                  {filters.abilityTags.length} 标签
                </span>
              )}
            </div>
            {expandedSections.has('ability') ? (
              <ChevronUp className="w-4 h-4 text-text-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-muted" />
            )}
          </button>
          {expandedSections.has('ability') && (
            <div className="p-3 pt-0 space-y-3 border-t border-white/5 max-h-96 overflow-y-auto">
              {(
                [
                  'metabolism',
                  'environment',
                  'biotechnology',
                  'ecology',
                  'pathogenicity',
                  'medicine',
                ] as AbilityDimension[]
              ).map((dim) => {
                const dimColor = ABILITY_DIMENSION_COLORS[dim];
                const isDimSelected = filters.abilityDimensions.includes(dim);
                const tags = getAbilityTagsByDimension(dim);
                const activeTags = getActiveTagsForDimension(dim);

                return (
                  <div key={dim} className="space-y-2">
                    <button
                      onClick={() => toggleAbilityDimension(dim)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${
                        isDimSelected
                          ? 'border-2 bg-white/5'
                          : 'border border-white/5 bg-white/3 hover:bg-white/8'
                      }`}
                      style={{
                        borderColor: isDimSelected ? dimColor : undefined,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ background: dimColor }}
                        />
                        <span
                          className={`font-mono text-xs ${isDimSelected ? 'font-bold' : ''}`}
                          style={{ color: isDimSelected ? dimColor : undefined }}
                        >
                          {ABILITY_DIMENSION_LABELS[dim]}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-text-muted/60">
                        {activeTags.length > 0 ? `${activeTags.length}/${tags.length}` : tags.length}
                      </span>
                    </button>

                    {isDimSelected && (
                      <div className="ml-4 flex flex-wrap gap-1.5">
                        {tags.map((tagInfo) => {
                          const isTagSelected = filters.abilityTags.includes(tagInfo.tag);
                          return (
                            <button
                              key={tagInfo.tag}
                              onClick={() => toggleAbilityTag(tagInfo.tag)}
                              className={`group relative px-2 py-1 rounded-md font-mono text-[10px] transition-all ${
                                isTagSelected
                                  ? 'text-white'
                                  : 'text-text-muted/70 hover:text-text-light/90'
                              }`}
                              style={{
                                background: isTagSelected ? `${dimColor}30` : 'rgba(255,255,255,0.03)',
                                border: isTagSelected ? `1px solid ${dimColor}60` : '1px solid rgba(255,255,255,0.05)',
                              }}
                            >
                              {ABILITY_TAG_LABELS[tagInfo.tag as AbilityTag]}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 glass-card p-2 text-[9px] font-mono text-text-light/90 w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-50">
                                {tagInfo.description}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
