import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { TreeNode, TaxonomyRank } from '../../data/treeOfLife';
import { TAXONOMY_RANK_LABELS, CATEGORY_COLORS } from '../../data/treeOfLife';
import { Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut, ChevronUp, ChevronDown } from 'lucide-react';

interface TreeOfLife3DProps {
  tree: TreeNode;
  selectedNodeId: string | null;
  onSelectNode: (node: TreeNode | null) => void;
  matchedSpeciesIds: Set<string>;
  expandedNodeIds: Set<string>;
  onToggleExpand: (nodeId: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

interface LayoutNode {
  id: string;
  node: TreeNode;
  x: number;
  y: number;
  z: number;
  angle: number;
  radius: number;
  depth: number;
  parentId: string | null;
}

const RANK_RADIUS: Record<TaxonomyRank, number> = {
  domain: 60,
  kingdom: 60,
  phylum: 140,
  class: 220,
  order: 300,
  family: 380,
  genus: 460,
  species: 540,
};

const RANK_NODE_SIZE: Record<TaxonomyRank, number> = {
  domain: 28,
  kingdom: 28,
  phylum: 20,
  class: 16,
  order: 14,
  family: 12,
  genus: 10,
  species: 8,
};

export function TreeOfLife3D({
  tree,
  selectedNodeId,
  onSelectNode,
  matchedSpeciesIds,
  expandedNodeIds,
  onToggleExpand,
  onExpandAll,
  onCollapseAll,
}: TreeOfLife3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 800 });
  const [rotation, setRotation] = useState({ x: -15, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: Math.max(600, rect.height) });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const layoutNodes = useMemo(() => {
    const nodes: LayoutNode[] = [];
    const centerX = 0;
    const centerY = 0;

    function layout(
      node: TreeNode,
      depth: number,
      startAngle: number,
      endAngle: number,
      parentId: string | null,
    ) {
      const angle = (startAngle + endAngle) / 2;
      const radius = RANK_RADIUS[node.rank];
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      const z = depth * 8;

      nodes.push({
        id: node.id,
        node,
        x,
        y,
        z,
        angle,
        radius,
        depth,
        parentId,
      });

      if (expandedNodeIds.has(node.id) && node.children.length > 0) {
        const childCount = node.children.length;
        const angleRange = endAngle - startAngle;
        const angleStep = angleRange / childCount;

        node.children.forEach((child, i) => {
          const childStart = startAngle + i * angleStep;
          const childEnd = childStart + angleStep;
          layout(child, depth + 1, childStart, childEnd, node.id);
        });
      }
    }

    if (tree.children.length > 0) {
      const rootAngle = -Math.PI / 2;
      nodes.push({
        id: tree.id,
        node: tree,
        x: centerX,
        y: centerY,
        z: 0,
        angle: rootAngle,
        radius: 0,
        depth: 0,
        parentId: null,
      });

      tree.children.forEach((child, i) => {
        const totalChildren = tree.children.length;
        const start = -Math.PI * 0.8 + (i / totalChildren) * Math.PI * 1.6;
        const end = start + (Math.PI * 1.6) / totalChildren;
        layout(child, 1, start, end, tree.id);
      });
    }

    return nodes;
  }, [tree, expandedNodeIds]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, LayoutNode>();
    layoutNodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [layoutNodes]);

  const projectedNodes = useMemo(() => {
    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;
    const rotX = (rotation.x * Math.PI) / 180;
    const rotY = (rotation.y * Math.PI) / 180;

    return layoutNodes
      .map((n) => {
        let x = n.x;
        let y = n.y;
        let z = n.z;

        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        x = x1;
        z = z1;

        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const y1 = y * cosX - z * sinX;
        const z2 = y * sinX + z * cosX;
        y = y1;
        z = z2;

        const perspective = 1200;
        const scale = perspective / (perspective + z);
        const projX = cx + x * zoom * scale + pan.x;
        const projY = cy + y * zoom * scale + pan.y;

        return {
          ...n,
          projX,
          projY,
          scale,
          depthZ: z,
        };
      })
      .sort((a, b) => a.depthZ - b.depthZ);
  }, [layoutNodes, dimensions, rotation, zoom, pan]);

  const projectedNodeMap = useMemo(() => {
    const map = new Map<string, (typeof projectedNodes)[number]>();
    projectedNodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [projectedNodes]);

  const edges = useMemo(() => {
    const result: {
      id: string;
      from: (typeof projectedNodes)[number];
      to: (typeof projectedNodes)[number];
      node: TreeNode;
    }[] = [];

    projectedNodes.forEach((n) => {
      if (n.parentId) {
        const parent = projectedNodeMap.get(n.parentId);
        if (parent) {
          result.push({
            id: `edge-${n.id}`,
            from: parent,
            to: n,
            node: n.node,
          });
        }
      }
    });

    return result;
  }, [projectedNodes, projectedNodeMap]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-node]')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      if (e.shiftKey) {
        setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
      } else {
        setRotation((r) => ({
          x: Math.max(-60, Math.min(30, r.x - dy * 0.3)),
          y: r.y + dx * 0.3,
        }));
      }
      setDragStart({ x: e.clientX, y: e.clientY });
    },
    [isDragging, dragStart],
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.92 : 1.08;
    setZoom((z) => Math.max(0.3, Math.min(3, z * delta)));
  };

  const resetView = () => {
    setRotation({ x: -15, y: 0 });
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const isNodeHighlighted = (node: TreeNode): boolean => {
    if (matchedSpeciesIds.size === 0) return true;
    if (node.rank === 'species') return matchedSpeciesIds.has(node.id);
    return node.microbeCount !== undefined && node.microbeCount > 0;
  };

  const hoveredNodeData = hoveredNode ? nodeMap.get(hoveredNode) : null;
  const hoveredProjected = hoveredNode ? projectedNodeMap.get(hoveredNode) : null;

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-background-deep' : 'h-[700px]'}`}
    >
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <div className="glass-card p-2 flex flex-col gap-1">
          <button
            onClick={() => setZoom((z) => Math.min(3, z * 1.2))}
            className="p-2 rounded-lg hover:bg-white/10 text-text-muted hover:text-text-light transition-colors"
            title="放大"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.3, z * 0.8))}
            className="p-2 rounded-lg hover:bg-white/10 text-text-muted hover:text-text-light transition-colors"
            title="缩小"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-2 rounded-lg hover:bg-white/10 text-text-muted hover:text-text-light transition-colors"
            title="重置视图"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:bg-white/10 text-text-muted hover:text-text-light transition-colors"
            title={isFullscreen ? '退出全屏' : '全屏'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
        <div className="glass-card p-2 flex flex-col gap-1">
          <button
            onClick={onExpandAll}
            className="p-2 rounded-lg hover:bg-white/10 text-text-muted hover:text-text-light transition-colors"
            title="展开全部"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={onCollapseAll}
            className="p-2 rounded-lg hover:bg-white/10 text-text-muted hover:text-text-light transition-colors"
            title="折叠全部"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 glass-card px-3 py-2 z-20 font-mono text-[10px] text-text-muted/70 space-y-1">
        <div>🖱️ 拖拽旋转 · 滚轮缩放 · Shift+拖拽平移</div>
        <div>🔬 点击节点钻取 · 双击物种查看详情</div>
      </div>

      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className={isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <defs>
          <radialGradient id="treeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00ffc8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#00ffc8" stopOpacity="0" />
          </radialGradient>
          <filter id="nodeGlow3d" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="edgeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={dimensions.width / 2}
          cy={dimensions.height / 2}
          r={300 * zoom}
          fill="url(#treeGlow)"
        />

        {edges.map((edge) => {
          const category = edge.node.category;
          const color = category ? CATEGORY_COLORS[category] : '#00ffc8';
          const highlighted = isNodeHighlighted(edge.node);
          const isSelected = selectedNodeId === edge.node.id || selectedNodeId === edge.from.id;
          const opacity = highlighted ? (isSelected ? 1 : 0.4) : 0.08;

          return (
            <g key={edge.id}>
              <line
                x1={edge.from.projX}
                y1={edge.from.projY}
                x2={edge.to.projX}
                y2={edge.to.projY}
                stroke={color}
                strokeWidth={isSelected ? 2.5 : 1.2}
                strokeOpacity={opacity}
                filter={isSelected ? 'url(#edgeGlow)' : undefined}
                className="transition-all duration-200"
              />
            </g>
          );
        })}

        {projectedNodes.map((n) => {
          const category = n.node.category;
          const color = category ? CATEGORY_COLORS[category] : '#00ffc8';
          const size = RANK_NODE_SIZE[n.node.rank] * n.scale * zoom;
          const isSelected = selectedNodeId === n.id;
          const isHovered = hoveredNode === n.id;
          const isExpanded = expandedNodeIds.has(n.id);
          const hasChildren = n.node.children.length > 0;
          const highlighted = isNodeHighlighted(n.node);
          const displaySize = size * (isSelected || isHovered ? 1.3 : 1);
          const opacity = highlighted ? 1 : 0.15;

          return (
            <g
              key={n.id}
              data-node
              transform={`translate(${n.projX}, ${n.projY})`}
              style={{ cursor: 'pointer', opacity }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectNode(n.node);
                if (hasChildren) {
                  onToggleExpand(n.id);
                }
              }}
              onMouseEnter={(e) => {
                setHoveredNode(n.id);
                const rect = svgRef.current?.getBoundingClientRect();
                if (rect) {
                  setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }
              }}
              onMouseLeave={() => setHoveredNode(null)}
              onDoubleClick={() => {
                if (n.node.rank === 'species' && n.node.microbeId) {
                  onSelectNode(n.node);
                }
              }}
            >
              {(isSelected || isHovered) && (
                <circle
                  r={displaySize + 8}
                  fill="none"
                  stroke={color}
                  strokeWidth={1.5}
                  strokeOpacity={0.5}
                  strokeDasharray="4 3"
                />
              )}

              {hasChildren && (
                <circle
                  r={displaySize * 1.6}
                  fill={color}
                  fillOpacity={isExpanded ? 0.05 : 0.08}
                  stroke={color}
                  strokeWidth={1}
                  strokeOpacity={0.2}
                />
              )}

              <circle
                r={displaySize}
                fill={color}
                fillOpacity={n.node.rank === 'species' ? 0.7 : 0.3}
                stroke={color}
                strokeWidth={isSelected ? 3 : 1.5}
                filter={isSelected || isHovered ? 'url(#nodeGlow3d)' : undefined}
              />

              <circle
                r={displaySize * 0.5}
                fill={color}
                fillOpacity={0.9}
              />

              {hasChildren && (
                <text
                  y={displaySize * 0.35}
                  textAnchor="middle"
                  fill="#061513"
                  fontSize={displaySize * 0.9}
                  fontWeight="bold"
                >
                  {isExpanded ? '−' : '+'}
                </text>
              )}

              {(n.node.rank === 'domain' ||
                n.node.rank === 'kingdom' ||
                n.node.rank === 'phylum' ||
                isSelected ||
                isHovered) && (
                <>
                  <text
                    y={displaySize + 18}
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
                    {n.node.name}
                  </text>
                  <text
                    y={displaySize + 32}
                    textAnchor="middle"
                    fill={color}
                    fontSize="9"
                    fontFamily="monospace"
                    opacity={0.7}
                    style={{
                      paintOrder: 'stroke',
                      stroke: '#061513',
                      strokeWidth: 3,
                      strokeLinejoin: 'round',
                    }}
                  >
                    {TAXONOMY_RANK_LABELS[n.node.rank]}
                    {n.node.microbeCount !== undefined && n.node.rank !== 'species'
                      ? ` · ${n.node.microbeCount}种`
                      : ''}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      {hoveredNodeData && hoveredProjected && (
        <div
          className="absolute z-30 pointer-events-none glass-card p-3 max-w-xs animate-fade-in-up"
          style={{
            left: tooltipPos.x + 15,
            top: tooltipPos.y - 10,
            transform: 'translateY(-100%)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            {hoveredNodeData.node.category && (
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[hoveredNodeData.node.category] }}
              />
            )}
            <span className="font-display text-sm font-bold text-text-light">
              {hoveredNodeData.node.name}
            </span>
          </div>
          <div className="font-mono text-[10px] text-text-muted mb-2">
            {TAXONOMY_RANK_LABELS[hoveredNodeData.node.rank]}级分类
          </div>
          {hoveredNodeData.node.description && (
            <p className="font-mono text-[11px] text-text-light/80 leading-relaxed">
              {hoveredNodeData.node.description}
            </p>
          )}
          {hoveredNodeData.node.rank === 'species' && hoveredNodeData.node.scientificName && (
            <p className="font-mono text-[10px] text-glow-primary italic mt-2">
              {hoveredNodeData.node.scientificName}
            </p>
          )}
          {hoveredNodeData.node.microbeCount !== undefined && hoveredNodeData.node.rank !== 'species' && (
            <p className="font-mono text-[10px] text-text-muted mt-2">
              包含物种: <span className="text-glow-primary">{hoveredNodeData.node.microbeCount}</span>
            </p>
          )}
          {hoveredNodeData.node.rank !== 'species' && hoveredNodeData.node.children.length > 0 && (
            <p className="font-mono text-[10px] text-glow-primary/70 mt-2">
              点击展开下级分类 →
            </p>
          )}
        </div>
      )}
    </div>
  );
}
