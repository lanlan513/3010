import { useMemo, useState } from 'react';
import { ChevronRight, Zap, ArrowRight } from 'lucide-react';
import type {
  BiogeochemicalCycleData,
  MetabolicPathwayStep,
} from '../../../shared/types';
import {
  CYCLE_COLORS,
  CYCLE_LABELS,
  METABOLISM_TYPE_LABELS,
  CATEGORY_COLORS,
} from '../../../shared/types';
import { useAppStore } from '../../store/useAppStore';

interface CycleFlowchartProps {
  data: BiogeochemicalCycleData;
}

export function CycleFlowchart({ data }: CycleFlowchartProps) {
  const { microbes } = useAppStore();
  const [selectedStep, setSelectedStep] = useState<MetabolicPathwayStep | null>(null);
  const color = CYCLE_COLORS[data.cycle];

  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    const steps = data.steps;
    const stepCount = steps.length;
    const centerX = 400;
    const centerY = 220;
    const radius = 160;

    steps.forEach((step, idx) => {
      const angle = (idx / stepCount) * Math.PI * 2 - Math.PI / 2;
      positions[step.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    const reservoirNodes = new Set<string>();
    data.edges.forEach((e) => {
      if (!data.steps.find((s) => s.id === e.from)) reservoirNodes.add(e.from);
      if (!data.steps.find((s) => s.id === e.to)) reservoirNodes.add(e.to);
    });

    let resIdx = 0;
    const resCount = reservoirNodes.size;
    const resRadius = 250;
    reservoirNodes.forEach((name) => {
      const angle = (resIdx / resCount) * Math.PI * 2 - Math.PI / 4;
      positions[name] = {
        x: centerX + resRadius * Math.cos(angle),
        y: centerY + resRadius * Math.sin(angle),
      };
      resIdx++;
    });

    return positions;
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <svg viewBox="0 0 800 440" className="w-full h-[440px]">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker
              id={`arrow-${data.cycle}`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
            </marker>
          </defs>

          {data.edges.map((edge, idx) => {
            const from = nodePositions[edge.from];
            const to = nodePositions[edge.to];
            if (!from || !to) return null;
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const startX = from.x + (dx / dist) * 35;
            const startY = from.y + (dy / dist) * 35;
            const endX = to.x - (dx / dist) * 35;
            const endY = to.y - (dy / dist) * 35;

            return (
              <g key={idx}>
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke={color}
                  strokeWidth="2"
                  strokeOpacity="0.5"
                  markerEnd={`url(#arrow-${data.cycle})`}
                />
                <text
                  x={(startX + endX) / 2}
                  y={(startY + endY) / 2 - 8}
                  textAnchor="middle"
                  fill={color}
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {edge.label}
                </text>
              </g>
            );
          })}

          {data.steps.map((step) => {
            const pos = nodePositions[step.id];
            if (!pos) return null;
            const isSelected = selectedStep?.id === step.id;
            return (
              <g
                key={step.id}
                onClick={() => setSelectedStep(isSelected ? null : step)}
                className="cursor-pointer"
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="32"
                  fill={color + '15'}
                  stroke={color}
                  strokeWidth={isSelected ? '3' : '1.5'}
                  strokeOpacity={isSelected ? '1' : '0.6'}
                  filter={isSelected ? 'url(#glow)' : undefined}
                />
                <Zap
                  x={pos.x - 8}
                  y={pos.y - 8}
                  width="16"
                  height="16"
                  stroke={color}
                  fill="none"
                  strokeWidth="1.5"
                />
                <text
                  x={pos.x}
                  y={pos.y + 50}
                  textAnchor="middle"
                  fill="#dfebf0"
                  fontSize="11"
                  fontFamily="monospace"
                >
                  {step.label}
                </text>
              </g>
            );
          })}

          {Object.entries(nodePositions)
            .filter(([name]) => !data.steps.find((s) => s.id === name))
            .map(([name, pos]) => (
              <g key={name}>
                <rect
                  x={pos.x - 45}
                  y={pos.y - 16}
                  width="90"
                  height="32"
                  rx="16"
                  fill="#0d1f1c"
                  stroke={color}
                  strokeOpacity="0.3"
                  strokeWidth="1"
                />
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fill="#8fb5af"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {name}
                </text>
              </g>
            ))}
        </svg>
      </div>

      {selectedStep && (
        <div className="glass-card p-5 animate-fade-in-up">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span
                  className="font-mono text-[10px] px-2 py-0.5 rounded-full border"
                  style={{
                    color,
                    borderColor: color + '44',
                    backgroundColor: color + '10',
                  }}
                >
                  {METABOLISM_TYPE_LABELS[selectedStep.metabolismType]}
                </span>
              </div>
              <h4 className="font-display text-xl text-text-light">
                {selectedStep.label}
              </h4>
            </div>
            <div
              className="font-mono text-[10px] px-2 py-1 rounded bg-glow-primary/10 text-glow-primary border border-glow-primary/20"
            >
              {selectedStep.energyOutput}
            </div>
          </div>

          <p className="font-mono text-sm text-text-muted/70 leading-relaxed mb-4">
            {selectedStep.description}
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="glass-card p-3">
              <p className="font-mono text-[10px] text-text-muted/50 mb-2">
                底物 (反应物)
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedStep.reactants.map((r, i) => (
                  <span
                    key={i}
                    className="font-mono text-[10px] px-2 py-0.5 rounded bg-background-card/80 text-text-light border border-white/10"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
            <div className="glass-card p-3">
              <p className="font-mono text-[10px] text-text-muted/50 mb-2">
                产物
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedStep.products.map((p, i) => (
                  <span
                    key={i}
                    className="font-mono text-[10px] px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: color + '15',
                      color: color,
                      border: `1px solid ${color}33`,
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] text-text-muted/50 mb-2">
              参与微生物 ({selectedStep.microbeIds.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedStep.microbeIds.map((id) => {
                const microbe = microbes.find((m) => m.id === id);
                if (!microbe) return null;
                return (
                  <div
                    key={id}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-background-card/50 border border-white/5"
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: CATEGORY_COLORS[microbe.category],
                      }}
                    />
                    <span className="font-mono text-[10px] text-text-light">
                      {microbe.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!selectedStep && (
        <div className="text-center py-4">
          <p className="font-mono text-xs text-text-muted/50">
            点击循环节点查看详细代谢途径信息
          </p>
        </div>
      )}
    </div>
  );
}
