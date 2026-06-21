import { useEffect, useRef, useState, useCallback } from 'react';
import type { Microbe, EcologicalRelation, EcologicalRelationType } from '../../../shared/types';
import {
  CATEGORY_COLORS,
  RELATION_TYPE_COLORS,
  RELATION_TYPE_LABELS,
} from '../../../shared/types';
import { ecologicalRelations } from '../../data/ecologicalRelations';

interface NetworkGraphProps {
  microbes: Microbe[];
  selectedMicrobeId: number | null;
  onSelectMicrobe: (id: number | null) => void;
  highlightedPath: number[];
  activeRelationTypes: EcologicalRelationType[];
}

interface Node {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  microbe: Microbe;
  connections: number;
}

interface Edge {
  source: number;
  target: number;
  type: EcologicalRelationType;
  strength: number;
  description: string;
}

const NODE_RADIUS = 22;
const EDGE_LENGTH = 140;
const REPULSION_STRENGTH = 2500;
const ATTRACTION_STRENGTH = 0.008;
const CENTER_STRENGTH = 0.003;
const DAMPING = 0.85;
const ITERATIONS = 300;

export function NetworkGraph({
  microbes,
  selectedMicrobeId,
  onSelectMicrobe,
  highlightedPath,
  activeRelationTypes,
}: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Map<number, Node>>(new Map());
  const edgesRef = useRef<Edge[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggingNodeId, setDraggingNodeId] = useState<number | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<Edge | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const iterationsRef = useRef(0);

  const filteredEdges = edges.filter((e) => activeRelationTypes.includes(e.type));
  const connectedNodeIds = new Set<number>();
  filteredEdges.forEach((e) => {
    connectedNodeIds.add(e.source);
    connectedNodeIds.add(e.target);
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: Math.max(500, rect.height) });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const { width, height } = dimensions;
    const newNodes = new Map<number, Node>();

    microbes.forEach((m, i) => {
      const angle = (i / microbes.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.35;
      newNodes.set(m.id, {
        id: m.id,
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        microbe: m,
        connections: 0,
      });
    });

    const rels = ecologicalRelations.filter((r) => {
      return newNodes.has(r.sourceId) && newNodes.has(r.targetId);
    });

    const newEdges: Edge[] = rels.map((r: EcologicalRelation) => ({
      source: r.sourceId,
      target: r.targetId,
      type: r.type,
      strength: r.strength,
      description: r.description,
    }));

    newEdges.forEach((e) => {
      const s = newNodes.get(e.source);
      const t = newNodes.get(e.target);
      if (s) s.connections++;
      if (t) t.connections++;
    });

    nodesRef.current = newNodes;
    edgesRef.current = newEdges;
    setEdges(newEdges);
    iterationsRef.current = 0;

    runSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microbes, dimensions]);

  const runSimulation = useCallback(() => {
    const tick = () => {
      const { width, height } = dimensions;
      const nodeMap = nodesRef.current;
      const nodeArray = Array.from(nodeMap.values());
      const edgeList = edgesRef.current;

      for (let i = 0; i < nodeArray.length; i++) {
        for (let j = i + 1; j < nodeArray.length; j++) {
          const n1 = nodeArray[i];
          const n2 = nodeArray[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const distSq = dx * dx + dy * dy + 1;
          const dist = Math.sqrt(distSq);
          const force = REPULSION_STRENGTH / distSq;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          n1.vx -= fx;
          n1.vy -= fy;
          n2.vx += fx;
          n2.vy += fy;
        }
      }

      edgeList.forEach((e) => {
        const n1 = nodeMap.get(e.source);
        const n2 = nodeMap.get(e.target);
        if (!n1 || !n2) return;
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 1;
        const force = (dist - EDGE_LENGTH * (1 / (0.5 + e.strength))) * ATTRACTION_STRENGTH;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        n1.vx += fx;
        n1.vy += fy;
        n2.vx -= fx;
        n2.vy -= fy;
      });

      nodeArray.forEach((n) => {
        const cx = width / 2 - n.x;
        const cy = height / 2 - n.y;
        n.vx += cx * CENTER_STRENGTH;
        n.vy += cy * CENTER_STRENGTH;
      });

      nodeArray.forEach((n) => {
        n.vx *= DAMPING;
        n.vy *= DAMPING;

        if (n.id === draggingNodeId) return;

        n.x += n.vx;
        n.y += n.vy;

        n.x = Math.max(NODE_RADIUS + 20, Math.min(width - NODE_RADIUS - 20, n.x));
        n.y = Math.max(NODE_RADIUS + 20, Math.min(height - NODE_RADIUS - 20, n.y));
      });

      setNodes([...nodeArray]);

      iterationsRef.current++;
      if (iterationsRef.current < ITERATIONS) {
        animationRef.current = requestAnimationFrame(tick);
      }
    };

    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(tick);
  }, [dimensions, draggingNodeId]);

  useEffect(() => {
    if (iterationsRef.current >= ITERATIONS) {
      iterationsRef.current = 0;
      runSimulation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRelationTypes]);

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent, nodeId?: number) => {
    if (nodeId !== undefined) {
      setDraggingNodeId(nodeId);
      e.stopPropagation();
    } else {
      setIsPanning(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setTransform((t) => ({
        ...t,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    } else if (draggingNodeId !== null) {
      const svg = svgRef.current;
      if (!svg) return;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const svgP = pt.matrixTransform(ctm.inverse());
      const node = nodesRef.current.get(draggingNodeId);
      if (node) {
        node.x = (svgP.x - transform.x) / transform.scale;
        node.y = (svgP.y - transform.y) / transform.scale;
        node.vx = 0;
        node.vy = 0;
        setNodes([...nodesRef.current.values()]);
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform((t) => {
      const newScale = Math.max(0.3, Math.min(3, t.scale * delta));
      return { ...t, scale: newScale };
    });
  };

  const isInPath = (nodeId: number) => highlightedPath.includes(nodeId);
  const isEdgeInPath = (e: Edge) => {
    for (let i = 0; i < highlightedPath.length - 1; i++) {
      const a = highlightedPath[i];
      const b = highlightedPath[i + 1];
      if ((e.source === a && e.target === b) || (e.source === b && e.target === a)) {
        return true;
      }
    }
    return false;
  };

  const getNodeOpacity = (nodeId: number, connections: number) => {
    if (!activeRelationTypes.length) return 0.9;
    if (!connectedNodeIds.has(nodeId) && connections === 0) return 0.15;
    if (selectedMicrobeId && selectedMicrobeId !== nodeId && !isInPath(nodeId)) return 0.25;
    return 1;
  };

  const getEdgeOpacity = (e: Edge) => {
    if (highlightedPath.length > 1) {
      return isEdgeInPath(e) ? 1 : 0.08;
    }
    if (selectedMicrobeId) {
      return e.source === selectedMicrobeId || e.target === selectedMicrobeId ? 1 : 0.12;
    }
    return 0.45;
  };

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => handleMouseDown(e)}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <defs>
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="pathGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker
            id="arrowSymbiosis"
            viewBox="0 -5 10 10"
            refX="9"
            refY="0"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M0,-3 L6,0 L0,3" fill={RELATION_TYPE_COLORS.symbiosis} />
          </marker>
          <marker
            id="arrowCompetition"
            viewBox="0 -5 10 10"
            refX="9"
            refY="0"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M0,-3 L6,0 L0,3" fill={RELATION_TYPE_COLORS.competition} />
          </marker>
          <marker
            id="arrowParasitism"
            viewBox="0 -5 10 10"
            refX="9"
            refY="0"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M0,-3 L6,0 L0,3" fill={RELATION_TYPE_COLORS.parasitism} />
          </marker>
          <marker
            id="arrowPredation"
            viewBox="0 -5 10 10"
            refX="9"
            refY="0"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M0,-3 L6,0 L0,3" fill={RELATION_TYPE_COLORS.predation} />
          </marker>
        </defs>

        <g
          transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
        >
          <g>
            {filteredEdges.map((e, idx) => {
              const source = nodesRef.current.get(e.source);
              const target = nodesRef.current.get(e.target);
              if (!source || !target) return null;

              const color = RELATION_TYPE_COLORS[e.type];
              const inPath = isEdgeInPath(e);
              const strokeWidth = inPath ? 3.5 : 1.5 + e.strength;

              const dx = target.x - source.x;
              const dy = target.y - source.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const offsetX = (dx / dist) * NODE_RADIUS;
              const offsetY = (dy / dist) * NODE_RADIUS;

              const showArrow = e.type === 'parasitism' || e.type === 'predation';
              const markerEnd = showArrow ? `url(#arrow${e.type.charAt(0).toUpperCase() + e.type.slice(1)})` : undefined;

              return (
                <line
                  key={`edge-${idx}`}
                  x1={source.x + offsetX}
                  y1={source.y + offsetY}
                  x2={target.x - offsetX}
                  y2={target.y - offsetY}
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeOpacity={getEdgeOpacity(e)}
                  strokeDasharray={e.type === 'competition' ? '8 4' : undefined}
                  markerEnd={markerEnd}
                  filter={inPath ? 'url(#pathGlow)' : undefined}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={(ev) => {
                    setHoveredEdge(e);
                    const svg = svgRef.current;
                    if (svg) {
                      const rect = svg.getBoundingClientRect();
                      setTooltipPos({
                        x: ev.clientX - rect.left + 10,
                        y: ev.clientY - rect.top - 10,
                      });
                    }
                  }}
                  onMouseLeave={() => setHoveredEdge(null)}
                />
              );
            })}
          </g>

          <g>
            {nodes.map((n) => {
              const color = CATEGORY_COLORS[n.microbe.category];
              const isSelected = selectedMicrobeId === n.id;
              const inPath = isInPath(n.id);
              const scale = isSelected || inPath ? 1.15 : 1;
              const displayRadius = NODE_RADIUS * scale;
              const opacity = getNodeOpacity(n.id, n.connections);
              const showLabel = opacity > 0.3;

              return (
                <g
                  key={`node-${n.id}`}
                  transform={`translate(${n.x}, ${n.y}) scale(${scale})`}
                  style={{ cursor: 'pointer', opacity }}
                  className="transition-opacity duration-200"
                  onMouseDown={(e) => handleMouseDown(e, n.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMicrobe(isSelected ? null : n.id);
                  }}
                >
                  <circle
                    r={displayRadius + 4}
                    fill="none"
                    stroke={color}
                    strokeWidth={isSelected ? 3 : inPath ? 2 : 0}
                    strokeOpacity={0.8}
                    filter={isSelected ? 'url(#nodeGlow)' : undefined}
                  />
                  <circle
                    r={displayRadius}
                    fill={color}
                    fillOpacity={0.2}
                    stroke={color}
                    strokeWidth={2}
                    filter={inPath ? 'url(#nodeGlow)' : undefined}
                  />
                  <circle
                    r={displayRadius * 0.6}
                    fill={color}
                    fillOpacity={0.6}
                  />
                  {showLabel && (
                    <text
                      y={displayRadius + 16}
                      textAnchor="middle"
                      fill="#e8f5f2"
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight={isSelected ? 700 : 500}
                      style={{
                        paintOrder: 'stroke',
                        stroke: '#061513',
                        strokeWidth: 3,
                        strokeLinejoin: 'round',
                      }}
                    >
                      {n.microbe.name}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {hoveredEdge && (
        <div
          className="absolute z-20 pointer-events-none glass-card p-3 max-w-xs"
          style={{ left: tooltipPos.x, top: tooltipPos.y, transform: 'translateY(-100%)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: RELATION_TYPE_COLORS[hoveredEdge.type] }}
            />
            <span
              className="font-mono text-sm font-bold"
              style={{ color: RELATION_TYPE_COLORS[hoveredEdge.type] }}
            >
              {RELATION_TYPE_LABELS[hoveredEdge.type]}
            </span>
            <span className="font-mono text-xs text-text-muted">
              强度: {(hoveredEdge.strength * 100).toFixed(0)}%
            </span>
          </div>
          <p className="font-mono text-xs text-text-light/90 leading-relaxed">
            {hoveredEdge.description}
          </p>
        </div>
      )}

      <div className="absolute bottom-3 right-3 glass-card px-3 py-2 font-mono text-[10px] text-text-muted/70 space-y-1">
        <div>🖱️ 拖拽节点 · 滚轮缩放 · 空白平移</div>
      </div>
    </div>
  );
}
