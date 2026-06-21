import type { GrowthDataPoint } from '../../shared/types';

interface SeriesData {
  label: string;
  data: GrowthDataPoint[];
  color: string;
}

interface GrowthChartProps {
  series: SeriesData[];
  height?: number;
  logScale?: boolean;
}

export function GrowthChart({ series, height = 360, logScale = true }: GrowthChartProps) {
  const width = 800;
  const padding = { top: 30, right: 30, bottom: 50, left: 70 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  if (series.length === 0 || !series[0].data.length) {
    return (
      <div
        className="glass-card flex items-center justify-center w-full"
        style={{ height }}
      >
        <p className="font-mono text-text-muted">暂无数据</p>
      </div>
    );
  }

  const maxHour = Math.max(...series.flatMap((s) => s.data.map((d) => d.hour)));
  const allPopulations = series.flatMap((s) => s.data.map((d) => d.population));
  const rawMaxPop = Math.max(...allPopulations);
  const rawMinPop = Math.min(...allPopulations.filter((p) => p > 0));

  const yMin = logScale ? Math.max(1, Math.floor(Math.log10(rawMinPop || 1))) : 0;
  const yMax = logScale
    ? Math.ceil(Math.log10(rawMaxPop || 1))
    : rawMaxPop * 1.1;

  const xScale = (hour: number) => padding.left + (hour / maxHour) * chartWidth;
  const yScale = (pop: number) => {
    if (logScale) {
      const logPop = Math.max(yMin, Math.log10(Math.max(1, pop)));
      return padding.top + chartHeight - ((logPop - yMin) / (yMax - yMin)) * chartHeight;
    }
    return padding.top + chartHeight - (pop / yMax) * chartHeight;
  };

  const yTicksCount = 6;
  const yTicks = Array.from({ length: yTicksCount + 1 }, (_, i) => {
    const value = logScale
      ? Math.pow(10, yMin + (i / yTicksCount) * (yMax - yMin))
      : (i / yTicksCount) * yMax;
    return value;
  });

  const xTicksCount = Math.min(8, maxHour);
  const xTicks = Array.from({ length: xTicksCount + 1 }, (_, i) =>
    Math.round((i / xTicksCount) * maxHour)
  );

  function buildPath(data: GrowthDataPoint[]) {
    if (!data.length) return '';
    return data
      .map((d, i) => {
        const x = xScale(d.hour);
        const y = yScale(d.population);
        return `${i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`}`;
      })
      .join(' ');
  }

  function buildAreaPath(data: GrowthDataPoint[]) {
    if (!data.length) return '';
    const path = buildPath(data);
    const lastX = xScale(data[data.length - 1].hour);
    const firstX = xScale(data[0].hour);
    const bottomY = padding.top + chartHeight;
    return `${path} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }

  function formatPopulation(pop: number) {
    if (logScale) {
      return pop >= 1e6 ? `${(pop / 1e6).toFixed(1)}M` : pop >= 1e3 ? `${(pop / 1e3).toFixed(1)}K` : `${pop}`;
    }
    return pop.toLocaleString();
  }

  return (
    <div className="glass-card p-4 md:p-6 relative overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          {series.map((s, idx) => (
            <linearGradient
              key={`grad-${idx}`}
              id={`area-gradient-${idx}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={s.color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0.02" />
            </linearGradient>
          ))}
        </defs>

        {yTicks.map((_, i) => {
          const y = padding.top + (i / yTicksCount) * chartHeight;
          return (
            <line
              key={`grid-h-${i}`}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="rgba(0, 255, 200, 0.08)"
              strokeDasharray="4 4"
            />
          );
        })}

        {xTicks.map((t, i) => {
          const x = xScale(t);
          return (
            <line
              key={`grid-v-${i}`}
              x1={x}
              y1={padding.top}
              x2={x}
              y2={height - padding.bottom}
              stroke="rgba(0, 255, 200, 0.05)"
              strokeDasharray="4 4"
            />
          );
        })}

        {yTicks.map((t, i) => (
          <text
            key={`yt-${i}`}
            x={padding.left - 10}
            y={padding.top + (i / yTicksCount) * chartHeight + 4}
            textAnchor="end"
            className="fill-text-muted"
            style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
          >
            {formatPopulation(t)}
          </text>
        ))}

        {xTicks.map((t, i) => (
          <text
            key={`xt-${i}`}
            x={xScale(t)}
            y={height - padding.bottom + 20}
            textAnchor="middle"
            className="fill-text-muted"
            style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
          >
            {t}h
          </text>
        ))}

        <text
          x={padding.left - 50}
          y={height / 2}
          textAnchor="middle"
          className="fill-text-light"
          style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
          transform={`rotate(-90, ${padding.left - 50}, ${height / 2})`}
        >
          种群数量
        </text>

        <text
          x={width / 2}
          y={height - 10}
          textAnchor="middle"
          className="fill-text-light"
          style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
        >
          培养时间（小时）
        </text>

        {series.map((s, idx) => (
          <path
            key={`area-${idx}`}
            d={buildAreaPath(s.data)}
            fill={`url(#area-gradient-${idx})`}
          />
        ))}

        {series.map((s, idx) => (
          <path
            key={`line-${idx}`}
            d={buildPath(s.data)}
            fill="none"
            stroke={s.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {series.map((s, idx) =>
          s.data.map((d, di) => (
            <circle
              key={`dot-${idx}-${di}`}
              cx={xScale(d.hour)}
              cy={yScale(d.population)}
              r="3"
              fill={s.color}
              opacity="0.7"
            />
          ))
        )}
      </svg>

      {series.length > 1 && (
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {series.map((s, idx) => (
            <div key={`legend-${idx}`} className="flex items-center gap-2">
              <span
                className="w-4 h-1 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="font-mono text-xs text-text-muted">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
