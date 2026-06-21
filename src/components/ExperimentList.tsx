import { Trash2, GitCompare, Eye, X } from 'lucide-react';
import type { ExperimentRecord } from '../../shared/types';
import { EXPERIMENT_COLORS } from '../../shared/types';

interface ExperimentListProps {
  experiments: ExperimentRecord[];
  comparisonIds: string[];
  onToggleComparison: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (experiment: ExperimentRecord) => void;
  viewingId: string | null;
}

function formatNumber(num: number): string {
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ExperimentList({
  experiments,
  comparisonIds,
  onToggleComparison,
  onDelete,
  onView,
  viewingId,
}: ExperimentListProps) {
  if (experiments.length === 0) {
    return (
      <div className="glass-card p-10 text-center">
        <p className="font-mono text-text-muted">
          暂无保存的实验记录
        </p>
        <p className="font-mono text-xs text-text-muted/60 mt-2">
          完成模拟后可保存实验结果
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comparisonIds.length > 0 && (
        <div className="glass-card p-3 flex items-center justify-between">
          <span className="font-mono text-xs text-glow-primary">
            已选择 {comparisonIds.length} 个实验进行对比
          </span>
          <span className="flex items-center gap-1">
            {comparisonIds.map((id, i) => {
              const exp = experiments.find((e) => e.id === id);
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono"
                  style={{
                    backgroundColor: `${EXPERIMENT_COLORS[i % EXPERIMENT_COLORS.length]}20`,
                    color: EXPERIMENT_COLORS[i % EXPERIMENT_COLORS.length],
                    border: `1px solid ${EXPERIMENT_COLORS[i % EXPERIMENT_COLORS.length]}40`,
                  }}
                >
                  {exp?.name.slice(0, 10)}
                  <button onClick={() => onToggleComparison(id)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </span>
        </div>
      )}

      <div className="grid gap-3">
        {experiments.map((exp, idx) => {
          const isComparing = comparisonIds.includes(exp.id);
          const isViewing = viewingId === exp.id;
          const color = EXPERIMENT_COLORS[idx % EXPERIMENT_COLORS.length];

          return (
            <div
              key={exp.id}
              className={`glass-card p-4 transition-all duration-300 ${
                isViewing ? 'border-glow-primary/60 shadow-glow' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <h3 className="font-display text-lg text-text-light truncate">
                      {exp.name}
                    </h3>
                    <span className="font-mono text-[10px] text-text-muted/60">
                      {formatDate(exp.createdAt)}
                    </span>
                  </div>

                  <p className="font-mono text-xs text-text-muted mb-3">
                    {exp.conditions.microbeName} · {exp.conditions.temperature}°C · pH{' '}
                    {exp.conditions.ph} · 湿度 {exp.conditions.humidity}% · 营养{' '}
                    {exp.conditions.nutrients}%
                  </p>

                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <p className="font-mono text-[10px] text-text-muted/60">峰值种群</p>
                      <p className="font-mono text-sm text-glow-primary">
                        {formatNumber(exp.peakPopulation)}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-text-muted/60">峰值时间</p>
                      <p className="font-mono text-sm text-text-light">{exp.peakHour}h</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-text-muted/60">最终种群</p>
                      <p className="font-mono text-sm text-text-light">
                        {formatNumber(exp.finalPopulation)}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-text-muted/60">增长速率</p>
                      <p className="font-mono text-sm text-glow-orange">
                        {exp.growthRate.toFixed(3)}/h
                      </p>
                    </div>
                  </div>

                  {exp.notes && (
                    <p className="font-mono text-[11px] text-text-muted/70 mt-3 italic">
                      "{exp.notes}"
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => onToggleComparison(exp.id)}
                    className={`p-2 rounded-lg border transition-all ${
                      isComparing
                        ? 'bg-glow-primary/20 border-glow-primary text-glow-primary'
                        : 'border-white/10 text-text-muted hover:text-glow-primary hover:border-glow-primary/40'
                    }`}
                    title={isComparing ? '移出对比' : '加入对比'}
                  >
                    <GitCompare className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onView(exp)}
                    className={`p-2 rounded-lg border transition-all ${
                      isViewing
                        ? 'bg-glow-primary/20 border-glow-primary text-glow-primary'
                        : 'border-white/10 text-text-muted hover:text-glow-primary hover:border-glow-primary/40'
                    }`}
                    title="查看曲线"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(exp.id)}
                    className="p-2 rounded-lg border border-white/10 text-text-muted hover:text-glow-red hover:border-glow-red/40 transition-all"
                    title="删除实验"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
