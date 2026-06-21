import { useState } from 'react';
import {
  Brain,
  Leaf,
  Clock,
  Zap,
  Factory,
  Sparkles,
  BookOpen,
  Tag,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { KnowledgeCard as KnowledgeCardType } from '../../../shared/types';
import {
  SPECIMEN_CATEGORY_COLORS,
  SPECIMEN_CATEGORY_LABELS,
} from '../../../shared/types';

const iconMap: Record<KnowledgeCardType['type'], typeof Brain> = {
  morphology: Brain,
  habitat: Leaf,
  discovery: Clock,
  metabolism: Zap,
  application: Factory,
  fun_fact: Sparkles,
};

interface KnowledgeCardProps {
  card: KnowledgeCardType;
  index?: number;
}

export function KnowledgeCard({ card, index = 0 }: KnowledgeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const color = SPECIMEN_CATEGORY_COLORS[card.type];
  const Icon = iconMap[card.type];

  return (
    <div
      className="glass-card p-6 relative overflow-hidden group hover:shadow-glow transition-all duration-500 animate-fade-in-up opacity-0"
      style={{
        animationDelay: `${index * 0.08}s`,
        borderColor: `${color}20`,
      }}
    >
      <div
        className="absolute top-0 left-0 w-full h-1"
        style={{
          background: `linear-gradient(90deg, ${color}88, ${color}22, transparent)`,
        }}
      />
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"
        style={{ background: color }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: `${color}15`,
                border: `1px solid ${color}40`,
              }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <span
                className="font-mono text-[10px] tracking-widest uppercase"
                style={{ color }}
              >
                {SPECIMEN_CATEGORY_LABELS[card.type]}
              </span>
              <h3 className="font-display text-lg font-semibold text-text-light mt-0.5">
                {card.title}
              </h3>
            </div>
          </div>
        </div>

        <p
          className={`font-mono text-sm text-text-muted/80 leading-relaxed transition-all duration-300 ${
            expanded ? '' : 'line-clamp-3'
          }`}
        >
          {card.content}
        </p>

        {card.content.length > 150 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 flex items-center gap-1 font-mono text-xs transition-colors"
            style={{ color }}
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3 h-3" />
                收起
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                展开更多
              </>
            )}
          </button>
        )}

        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3 h-3 text-text-muted" />
              <span className="font-mono text-[10px] text-text-muted">
                {card.dataSource}
              </span>
            </div>
            <span className="font-mono text-[10px] text-text-muted">
              {card.lastUpdated}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {card.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono"
                style={{
                  background: `${color}10`,
                  color: `${color}cc`,
                  border: `1px solid ${color}20`,
                }}
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
