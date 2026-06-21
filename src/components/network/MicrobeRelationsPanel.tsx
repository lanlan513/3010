import { X, Heart, Swords, Bug, Skull, ArrowRight } from 'lucide-react';
import type { Microbe, EcologicalRelation } from '../../../shared/types';
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  RELATION_TYPE_COLORS,
  RELATION_TYPE_LABELS,
} from '../../../shared/types';
import {
  getSymbiosisPartners,
  getCompetitors,
  getPredators,
  getPreys,
  getParasites,
  getHosts,
  getRelationsForMicrobe,
} from '../../data/ecologicalRelations';

interface MicrobeRelationsPanelProps {
  microbe: Microbe;
  allMicrobes: Microbe[];
  onClose: () => void;
  onSelectMicrobe: (id: number) => void;
}

interface RelationGroupProps {
  title: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconColor: string;
  items: { microbe: Microbe; relation: EcologicalRelation }[];
  onSelectMicrobe: (id: number) => void;
}

function RelationGroup({
  title,
  icon: Icon,
  iconColor,
  items,
  onSelectMicrobe,
}: RelationGroupProps) {
  if (items.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" style={{ color: iconColor }} />
        <span className="font-mono text-sm font-semibold" style={{ color: iconColor }}>
          {title}
        </span>
        <span className="font-mono text-xs text-text-muted/60">({items.length})</span>
      </div>
      <div className="space-y-2">
        {items.map(({ microbe, relation }) => (
          <div
            key={`${microbe.id}-${relation.id}`}
            onClick={() => onSelectMicrobe(microbe.id)}
            className="group flex items-center gap-3 p-3 rounded-xl bg-background-card/40 hover:bg-background-card/70
                       border border-transparent hover:border-glow-primary/30 cursor-pointer transition-all"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: `${CATEGORY_COLORS[microbe.category]}20`,
                border: `2px solid ${CATEGORY_COLORS[microbe.category]}`,
              }}
            >
              <span
                className="font-mono text-xs font-bold"
                style={{ color: CATEGORY_COLORS[microbe.category] }}
              >
                {microbe.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-text-light truncate">
                  {microbe.name}
                </span>
                <span
                  className="category-badge text-[10px] py-0.5"
                  style={{
                    color: CATEGORY_COLORS[microbe.category],
                    borderColor: `${CATEGORY_COLORS[microbe.category]}40`,
                    backgroundColor: `${CATEGORY_COLORS[microbe.category]}10`,
                  }}
                >
                  {CATEGORY_LABELS[microbe.category]}
                </span>
              </div>
              <p className="font-mono text-[10px] text-text-muted/70 line-clamp-2 mt-0.5">
                {relation.description}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <div className="flex items-center gap-1">
                <ArrowRight className="w-3 h-3 text-text-muted/40 group-hover:text-glow-primary transition-colors" />
              </div>
              <div className="w-12 h-1.5 rounded-full bg-background-muted/50 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${relation.strength * 100}%`,
                    backgroundColor: iconColor,
                  }}
                />
              </div>
              <span className="font-mono text-[9px] text-text-muted/50">
                强度 {(relation.strength * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MicrobeRelationsPanel({
  microbe,
  allMicrobes,
  onClose,
  onSelectMicrobe,
}: MicrobeRelationsPanelProps) {
  const microbeMap = new Map(allMicrobes.map((m) => [m.id, m]));
  const allRelations = getRelationsForMicrobe(microbe.id);
  const relationCount = allRelations.length;

  const symbiosis = getSymbiosisPartners(microbe.id)
    .map((r) => ({ microbe: microbeMap.get(r.microbeId)!, relation: r.relation }))
    .filter((r) => r.microbe);

  const competition = getCompetitors(microbe.id)
    .map((r) => ({ microbe: microbeMap.get(r.microbeId)!, relation: r.relation }))
    .filter((r) => r.microbe);

  const predators = getPredators(microbe.id)
    .map((r) => ({ microbe: microbeMap.get(r.microbeId)!, relation: r.relation }))
    .filter((r) => r.microbe);

  const preys = getPreys(microbe.id)
    .map((r) => ({ microbe: microbeMap.get(r.microbeId)!, relation: r.relation }))
    .filter((r) => r.microbe);

  const parasites = getParasites(microbe.id)
    .map((r) => ({ microbe: microbeMap.get(r.microbeId)!, relation: r.relation }))
    .filter((r) => r.microbe);

  const hosts = getHosts(microbe.id)
    .map((r) => ({ microbe: microbeMap.get(r.microbeId)!, relation: r.relation }))
    .filter((r) => r.microbe);

  const enemiesCount = competition.length + predators.length + parasites.length;
  const friendsCount = symbiosis.length + hosts.length + preys.length;

  return (
    <div className="glass-card h-full flex flex-col">
      <div
        className="p-5 border-b border-glow-primary/20"
        style={{
          background: `linear-gradient(135deg, ${CATEGORY_COLORS[microbe.category]}10, transparent)`,
        }}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: `${CATEGORY_COLORS[microbe.category]}20`,
                border: `2px solid ${CATEGORY_COLORS[microbe.category]}`,
                boxShadow: `0 0 20px ${CATEGORY_COLORS[microbe.category]}30`,
              }}
            >
              <span
                className="font-mono text-2xl font-bold"
                style={{ color: CATEGORY_COLORS[microbe.category] }}
              >
                {microbe.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-display text-2xl text-text-light leading-tight">
                {microbe.name}
              </h3>
              <p className="font-mono text-xs text-text-muted italic mt-0.5">
                {microbe.scientificName}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className="category-badge text-[10px]"
                  style={{
                    color: CATEGORY_COLORS[microbe.category],
                    borderColor: `${CATEGORY_COLORS[microbe.category]}40`,
                    backgroundColor: `${CATEGORY_COLORS[microbe.category]}10`,
                  }}
                >
                  {CATEGORY_LABELS[microbe.category]}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-background-card/60 text-text-muted hover:text-text-light transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="font-mono text-xs text-text-light/80 leading-relaxed line-clamp-2">
          {microbe.description}
        </p>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="glass-card p-3 bg-background-deep/50 text-center">
            <p className="font-mono text-[10px] text-text-muted/60 mb-1">总关系</p>
            <p className="font-mono text-xl font-bold text-glow-primary">{relationCount}</p>
          </div>
          <div className="glass-card p-3 bg-background-deep/50 text-center">
            <p className="font-mono text-[10px] text-text-muted/60 mb-1">生态伙伴</p>
            <p className="font-mono text-xl font-bold text-green-400">{friendsCount}</p>
          </div>
          <div className="glass-card p-3 bg-background-deep/50 text-center">
            <p className="font-mono text-[10px] text-text-muted/60 mb-1">天敌/对手</p>
            <p className="font-mono text-xl font-bold text-glow-red">{enemiesCount}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        <RelationGroup
          title="共生伙伴"
          icon={Heart}
          iconColor={RELATION_TYPE_COLORS.symbiosis}
          items={symbiosis}
          onSelectMicrobe={onSelectMicrobe}
        />
        <RelationGroup
          title="竞争者"
          icon={Swords}
          iconColor={RELATION_TYPE_COLORS.competition}
          items={competition}
          onSelectMicrobe={onSelectMicrobe}
        />
        <RelationGroup
          title="天敌 (捕食者)"
          icon={Skull}
          iconColor={RELATION_TYPE_COLORS.predation}
          items={predators}
          onSelectMicrobe={onSelectMicrobe}
        />
        <RelationGroup
          title="猎物"
          icon={Bug}
          iconColor={RELATION_TYPE_COLORS.predation}
          items={preys}
          onSelectMicrobe={onSelectMicrobe}
        />
        <RelationGroup
          title="寄生者 (对我有害)"
          icon={Bug}
          iconColor={RELATION_TYPE_COLORS.parasitism}
          items={parasites}
          onSelectMicrobe={onSelectMicrobe}
        />
        <RelationGroup
          title="宿主 (我寄生的)"
          icon={Heart}
          iconColor={RELATION_TYPE_COLORS.parasitism}
          items={hosts}
          onSelectMicrobe={onSelectMicrobe}
        />

        {relationCount === 0 && (
          <div className="text-center py-12 text-text-muted/50">
            <p className="font-mono text-sm">该微生物暂未建立生态关系网络</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-glow-primary/20 flex flex-wrap gap-2">
        {(['symbiosis', 'competition', 'parasitism', 'predation'] as const).map((type) => {
          const count = allRelations.filter((r) => r.type === type).length;
          if (count === 0) return null;
          return (
            <div
              key={type}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: `${RELATION_TYPE_COLORS[type]}15`,
                border: `1px solid ${RELATION_TYPE_COLORS[type]}30`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: RELATION_TYPE_COLORS[type] }}
              />
              <span className="font-mono text-[10px]" style={{ color: RELATION_TYPE_COLORS[type] }}>
                {RELATION_TYPE_LABELS[type]}
              </span>
              <span className="font-mono text-[10px] text-text-muted/70">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
