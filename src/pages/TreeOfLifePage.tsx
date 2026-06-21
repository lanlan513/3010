import { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  buildTreeOfLife,
  filterTree,
  flattenTree,
  findNodeById,
  getAncestorIds,
  type TreeNode,
  type FilterState,
} from '../data/treeOfLife';
import { TreeOfLife3D } from '../components/tree/TreeOfLife3D';
import { NodeDetailPanel } from '../components/tree/NodeDetailPanel';
import { MultiDimensionFilter } from '../components/tree/MultiDimensionFilter';
import { Sparkles, TreeDeciduous, Info, ChevronRight, Dna } from 'lucide-react';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../../shared/types';
import { Link } from 'react-router-dom';

export function TreeOfLifePage() {
  const { microbes, fetchMicrobes, stats, fetchStats } = useAppStore();
  const [fetchTriggered, setFetchTriggered] = useState(false);

  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(
    new Set(['root', 'bacteria', 'fungi', 'virus', 'archaea']),
  );
  const [filters, setFilters] = useState<FilterState>({
    yearRange: [0, 2100],
    habitats: [],
    abilityDimensions: [],
    abilityTags: [],
    categories: [],
  });

  useEffect(() => {
    if (!fetchTriggered) {
      fetchMicrobes({ limit: 100 });
      fetchStats();
      setFetchTriggered(true);
    }
  }, [fetchTriggered, fetchMicrobes, fetchStats]);

  const fullTree = useMemo(() => buildTreeOfLife(microbes), [microbes]);

  const { filteredRoot, matchedSpeciesIds } = useMemo(
    () => filterTree(fullTree, filters),
    [fullTree, filters],
  );

  const totalSpecies = useMemo(() => {
    return flattenTree(fullTree).filter((n) => n.rank === 'species').length;
  }, [fullTree]);

  const handleSelectNode = (node: TreeNode | null) => {
    setSelectedNode(node);
  };

  const handleToggleExpand = (nodeId: string) => {
    setExpandedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    const allIds = new Set<string>();
    function traverse(node: TreeNode) {
      if (node.children.length > 0) {
        allIds.add(node.id);
      }
      node.children.forEach(traverse);
    }
    traverse(filteredRoot);
    setExpandedNodeIds(allIds);
  };

  const handleCollapseAll = () => {
    setExpandedNodeIds(new Set(['root']));
  };

  const handleSelectRelatedNode = (relatedNodeId: string) => {
    const node = findNodeById(fullTree, relatedNodeId);
    if (node) {
      const ancestors = getAncestorIds(fullTree, relatedNodeId);
      setExpandedNodeIds((prev) => {
        const next = new Set(prev);
        ancestors.forEach((a) => next.add(a));
        next.add(relatedNodeId);
        return next;
      });
      setSelectedNode(node);
    }
  };

  return (
    <div className="relative min-h-screen">
      <section className="relative overflow-hidden pt-28 pb-6">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 60% 80% at 20% 10%, #00ffc815, transparent), radial-gradient(ellipse 50% 70% at 80% 30%, #9b59b615, transparent)',
          }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="animate-fade-in-up stagger-1 opacity-0 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-glow-primary/30 bg-glow-primary/5 backdrop-blur-sm">
              <TreeDeciduous className="w-4 h-4 text-glow-primary" />
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-glow-primary">
                Tree of Life Hall
              </span>
            </div>
          </div>

          <div className="animate-fade-in-up stagger-2 opacity-0 flex items-start justify-between flex-wrap gap-4 mb-8">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-text-light mb-3">
                微生物生命树大厅
              </h1>
              <p className="font-mono text-sm text-text-muted/80 max-w-2xl leading-relaxed">
                以三维生命树方式展示所有已收录微生物。缩放、旋转和钻取不同分类层级，
                点击节点查看完整档案、生态关系和研究记录。支持多维筛选，是整个平台的核心导航入口。
              </p>
            </div>

            <div className="flex items-center gap-3">
              {stats && (
                <div className="flex items-center gap-4">
                  {(['bacteria', 'fungi', 'virus', 'archaea'] as const).map((cat) => (
                    <Link
                      key={cat}
                      to={`/category/${cat}`}
                      className="group glass-card px-4 py-2 hover:border-glow-primary/40 transition-all"
                      style={{ borderColor: `${CATEGORY_COLORS[cat]}20` }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: CATEGORY_COLORS[cat] }}
                        />
                        <div>
                          <div
                            className="font-display text-lg font-bold leading-none"
                            style={{ color: CATEGORY_COLORS[cat] }}
                          >
                            {stats[cat]}
                          </div>
                          <div className="font-mono text-[9px] text-text-muted/60 tracking-wider uppercase">
                            {CATEGORY_LABELS[cat]}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-text-muted/30 group-hover:text-glow-primary transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="animate-fade-in-up stagger-3 opacity-0 flex flex-wrap items-center gap-2 mb-6">
            <div className="flex items-center gap-2 glass-card px-3 py-2">
              <Info className="w-4 h-4 text-glow-primary" />
              <span className="font-mono text-[11px] text-text-muted">
                拖拽旋转 · 滚轮缩放 · Shift+拖拽平移 · 点击节点展开
              </span>
            </div>
            <div className="flex items-center gap-2 glass-card px-3 py-2">
              <Sparkles className="w-4 h-4 text-glow-purple" />
              <span className="font-mono text-[11px] text-text-muted">
                共收录 <span className="text-glow-primary font-bold">{totalSpecies}</span> 种微生物
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-[320px_1fr] gap-6">
            <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
              <MultiDimensionFilter
                filters={filters}
                onFiltersChange={setFilters}
                totalCount={totalSpecies}
                filteredCount={matchedSpeciesIds.size}
              />
            </div>

            <div className="relative">
              <div
                className="glass-card overflow-hidden relative"
                style={{ minHeight: 700 }}
              >
                <TreeOfLife3D
                  tree={filteredRoot}
                  selectedNodeId={selectedNode?.id || null}
                  onSelectNode={handleSelectNode}
                  matchedSpeciesIds={matchedSpeciesIds}
                  expandedNodeIds={expandedNodeIds}
                  onToggleExpand={handleToggleExpand}
                  onExpandAll={handleExpandAll}
                  onCollapseAll={handleCollapseAll}
                />

                {!selectedNode && (
                  <div className="absolute top-6 left-6 max-w-md animate-fade-in-up">
                    <div className="glass-card p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-glow-primary/15 flex items-center justify-center flex-shrink-0">
                          <Dna className="w-5 h-5 text-glow-primary" />
                        </div>
                        <div>
                          <h3 className="font-display text-sm font-semibold text-text-light mb-1">
                            探索生命之树
                          </h3>
                          <p className="font-mono text-[11px] text-text-muted/70 leading-relaxed">
                            点击任意节点展开下级分类，钻取到物种级别查看完整档案。
                            使用左侧筛选器按年代、环境和能力进行多维筛选。
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {matchedSpeciesIds.size > 0 && matchedSpeciesIds.size < totalSpecies && (
                <div className="mt-4 glass-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-glow-primary" />
                      <span className="font-mono text-sm text-text-light">
                        筛选结果 ({matchedSpeciesIds.size} 种)
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                    {Array.from(matchedSpeciesIds).map((id) => {
                      const node = findNodeById(fullTree, id);
                      if (!node || !node.microbeId) return null;
                      const category = node.category;
                      const color = category ? CATEGORY_COLORS[category] : '#00ffc8';
                      return (
                        <Link
                          key={id}
                          to={`/microbe/${node.microbeId}`}
                          onClick={() => handleSelectNode(node)}
                          className="group flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all hover:border-glow-primary/40"
                          style={{
                            borderColor: `${color}30`,
                            background: `${color}08`,
                          }}
                        >
                          {node.imageUrl && (
                            <img
                              src={node.imageUrl}
                              alt={node.name}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                          )}
                          <span
                            className="font-mono text-[11px] group-hover:text-glow-primary transition-colors"
                            style={{ color }}
                          >
                            {node.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <NodeDetailPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          microbes={microbes}
          onSelectRelatedNode={handleSelectRelatedNode}
        />
      </section>
    </div>
  );
}
