import { useState, useMemo } from 'react';
import type { BiogeochemicalCycleData, CycleFlowEdge, MetabolicPathwayStep, MetabolismType } from '../../../shared/types';
import { METABOLISM_TYPE_LABELS, CYCLE_COLORS } from '../../../shared/types';

interface CycleFlowchartProps {
  data: BiogeochemicalCycleData;
  onStepClick?: (step: MetabolicPathwayStep) => void;
  onEdgeClick?: (edge: CycleFlowEdge) => void;
  highlightMicrobeId?: number | null;
}

const METABOLISM_COLORS: Record<MetabolismType, string> = {
  aerobic_respiration: '#00ffc8',
  anaerobic_respiration: '#9b59b6',
  fermentation: '#ff7b29',
  photosynthesis: '#2ecc71',
  chemosynthesis: '#1abc9c',
  nitrogen_fixation: '#3498db',
  nitrification: '#e67e22',
  denitrification: '#e74c3c',
  sulfate_reduction: '#f1c40f',
  sulfur_oxidation: '#d4ac0d',
  methanogenesis: '#8e44ad',
  methanotrophy: '#27ae60',
};

interface NodePosition {
  x: number;
  y: number;
}

function computeNodePositions(steps: MetabolicPathwayStep[], edges: CycleFlowEdge[]): Record<string, NodePosition> {
  const positions: Record<string, NodePosition> = {};
  const ids = steps.map((s) => s.id);
  const n = ids.length;

  if (n === 0) return positions;

  const centerX = 500;
  const centerY = 320;
  const radiusX = 320;
  const radiusY = 220;

  const inDegree: Record<string, number> = {};
  const outDegree: Record<string, number> = {};
  ids.forEach((id) => {
    inDegree[id] = 0;
    outDegree[id] = 0;
  });
  edges.forEach((e) => {
    outDegree[e.from] = (outDegree[e.from] || 0) + 1;
    inDegree[e.to] = (inDegree[e.to] || 0) + 1;
  });

  const sortedIds = [...ids].sort((a, b) => {
    const aScore = inDegree[a] + outDegree[a];
    const bScore = inDegree[b] + outDegree[b];
    return bScore - aScore;
  });

  const hubId = sortedIds[0];
  const hubIdx = ids.indexOf(hubId);

  ids.forEach((id, idx) => {
    let adjustedIdx = idx;
    if (hubIdx === 0) {
      adjustedIdx = idx;
    } else {
      adjustedIdx = (idx - hubIdx + n) % n;
    }
    const angle = (adjustedIdx / n) * Math.PI * 2 - Math.PI / 2;
    positions[id] = {
      x: centerX + radiusX * Math.cos(angle),
      y: centerY + radiusY * Math.sin(angle),
    };
  });

  return positions;
}

export function CycleFlowchart({ data, onStepClick, onEdgeClick, highlightMicrobeId }: CycleFlowchartProps) {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  const positions = useMemo(() => computeNodePositions(data.steps, data.edges), [data.steps, data.edges]);

  const cycleColor = CYCLE_COLORS[data.cycle];

  const isStepHighlighted = (stepId: string) => {
    if (!highlightMicrobeId) return false;
    const step = data.steps.find((s) => s.id === stepId);
    return step ? step.microbeIds.includes(highlightMicrobeId) : false;
  };

  const isEdgeHighlighted = (edge: CycleFlowEdge) => {
    if (!highlightMicrobeId) return false;
    return edge.microbeIds.includes(highlightMicrobeId);
  };

  const getEdgePath = (from: NodePosition, to: NodePosition) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const curvature = Math.min(0.3, 60 / dist);

    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const perpX = -dy * curvature;
    const perpY = dx * curvature;

    const cx = midX + perpX;
    const cy = midY + perpY;

    return { path: `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`, midX: cx, midY: cy };
  };

  const handleStepClick = (step: MetabolicPathwayStep) => {
    setSelectedStep(selectedStep === step.id ? null : step.id);
    onStepClick?.(step);
  };

  const nodeWidth = 110;
  const nodeHeight = 50;

  const selectedStepData = selectedStep ? data.steps.find((s) => s.id === selectedStep) : null;

  return (
    <div className="relative">
      <svg viewBox="0 0 1000 640" className="w-full h-auto" style={{ minHeight: 400 }}>
        <defs>
          <marker
            id={`arrow-${data.cycle}`}
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={cycleColor} fillOpacity="0.7" />
          </marker>
          <marker
            id={`arrow-highlight-${data.cycle}`}
            markerWidth="12"
            markerHeight="8"
            refX="10"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="0 0, 12 4, 0 8" fill={cycleColor} />
          </marker>
          <filter id={`glow-${data.cycle}`}>
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={`glow-strong-${data.cycle}`}>
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {data.edges.map((edge, idx) => {
          const from = positions[edge.from];
          const to = positions[edge.to];
          if (!from || !to) return null;

          const highlighted = isEdgeHighlighted(edge);
          const isHovered = hoveredEdge === `${edge.from}-${edge.to}-${idx}`;
          const metColor = METABOLISM_COLORS[edge.metabolismType] || cycleColor;

          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const offsetX = (dx / dist) * (nodeWidth / 2 + 5);
          const offsetY = (dy / dist) * (nodeHeight / 2 + 5);
          const startX = from.x + offsetX;
          const startY = from.y + offsetY;
          const endX = to.x - offsetX;
          const endY = to.y - offsetY;

          const { path: clippedPath, midX: labelX, midY: labelY } = getEdgePath(
            { x: startX, y: startY },
            { x: endX, y: endY }
          );

          return (
            <g
              key={`edge-${idx}`}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredEdge(`${edge.from}-${edge.to}-${idx}`)}
              onMouseLeave={() => setHoveredEdge(null)}
              onClick={() => onEdgeClick?.(edge)}
            >
              <path
                d={clippedPath}
                fill="none"
                stroke={highlighted || isHovered ? metColor : cycleColor}
                strokeWidth={highlighted || isHovered ? 3 : 1.5}
                strokeOpacity={highlighted || isHovered ? 1 : 0.35}
                markerEnd={highlighted || isHovered ? `url(#arrow-highlight-${data.cycle})` : `url(#arrow-${data.cycle})`}
                filter={highlighted ? `url(#glow-${data.cycle})` : undefined}
              />
              {(isHovered || highlighted) && (
                <text
                  x={labelX}
                  y={labelY - 8}
                  textAnchor="middle"
                  fill={metColor}
                  fontSize="11"
                  fontFamily="JetBrains Mono, monospace"
                  className="pointer-events-none"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {data.steps.map((step) => {
          const pos = positions[step.id];
          if (!pos) return null;

          const highlighted = isStepHighlighted(step.id);
          const isHovered = hoveredStep === step.id;
          const isSelected = selectedStep === step.id;

          return (
            <g
              key={step.id}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredStep(step.id)}
              onMouseLeave={() => setHoveredStep(null)}
              onClick={() => handleStepClick(step)}
            >
              {(highlighted || isHovered || isSelected) && (
                <rect
                  x={pos.x - nodeWidth / 2 - 4}
                  y={pos.y - nodeHeight / 2 - 4}
                  width={nodeWidth + 8}
                  height={nodeHeight + 8}
                  rx={16}
                  fill={cycleColor}
                  fillOpacity={0.1}
                  filter={`url(#glow-strong-${data.cycle})`}
                />
              )}
              <rect
                x={pos.x - nodeWidth / 2}
                y={pos.y - nodeHeight / 2}
                width={nodeWidth}
                height={nodeHeight}
                rx={12}
                fill={highlighted || isSelected ? cycleColor : '#1a2a28'}
                fillOpacity={highlighted || isSelected ? 0.25 : 0.9}
                stroke={cycleColor}
                strokeWidth={highlighted || isHovered || isSelected ? 2 : 1}
                strokeOpacity={highlighted || isHovered || isSelected ? 0.8 : 0.3}
              />
              <text
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                fill={highlighted || isHovered || isSelected ? cycleColor : '#e8f5f2'}
                fontSize="14"
                fontWeight="bold"
                fontFamily="JetBrains Mono, monospace"
              >
                {step.label}
              </text>
            </g>
          );
        })}
      </svg>

      {selectedStepData && (
        <div className="glass-card p-5 mt-4 animate-fade-in-up">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-display text-xl text-text-light">{selectedStepData.label}</h4>
              <span
                className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-mono border"
                style={{
                  color: cycleColor,
                  borderColor: cycleColor + '66',
                  backgroundColor: cycleColor + '15',
                }}
              >
                {METABOLISM_TYPE_LABELS[selectedStepData.metabolismType]}
              </span>
            </div>
            <button
              onClick={() => setSelectedStep(null)}
              className="text-text-muted hover:text-text-light transition-colors text-sm"
            >
              ✕
            </button>
          </div>
          <p className="font-mono text-sm text-text-muted leading-relaxed mb-3">
            {selectedStepData.description}
          </p>
          {selectedStepData.reactants.length > 0 && (
            <div className="mb-2">
              <span className="font-mono text-[10px] text-text-muted/60">反应物：</span>
              <span className="font-mono text-sm text-glow-primary ml-2">
                {selectedStepData.reactants.join(' + ')}
              </span>
            </div>
          )}
          {selectedStepData.products.length > 0 && (
            <div className="mb-2">
              <span className="font-mono text-[10px] text-text-muted/60">产物：</span>
              <span className="font-mono text-sm text-glow-orange ml-2">
                {selectedStepData.products.join(' + ')}
              </span>
            </div>
          )}
          {selectedStepData.energyOutput && (
            <div className="mb-2">
              <span className="font-mono text-[10px] text-text-muted/60">能量：</span>
              <span className="font-mono text-sm text-glow-gold ml-2">
                {selectedStepData.energyOutput}
              </span>
            </div>
          )}
          {selectedStepData.microbeIds.length > 0 && (
            <div>
              <span className="font-mono text-[10px] text-text-muted/60">参与微生物 ID：</span>
              <span className="font-mono text-sm text-text-light ml-2">
                {selectedStepData.microbeIds.join(', ')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
