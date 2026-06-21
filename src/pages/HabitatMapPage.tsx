import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, X, MapPin, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { HABITAT_ZONES } from '../data/habitats';
import type { HabitatZone } from '../data/habitats';
import type { Microbe } from '../../shared/types';
import { CATEGORY_LABELS } from '../../shared/types';

function filterByHabitat(microbes: Microbe[], zone: HabitatZone): Microbe[] {
  return microbes.filter((m) =>
    zone.keywords.some((kw) => m.habitat.includes(kw))
  );
}

export function HabitatMapPage() {
  const { microbes, fetchMicrobes } = useAppStore();
  const [selectedZone, setSelectedZone] = useState<HabitatZone | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  useEffect(() => {
    fetchMicrobes();
  }, [fetchMicrobes]);

  const filteredMicrobes = useMemo(() => {
    if (!selectedZone) return [];
    return filterByHabitat(microbes, selectedZone);
  }, [microbes, selectedZone]);

  return (
    <div className="relative min-h-screen">
      <section className="relative overflow-hidden pt-28 pb-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'radial-gradient(ellipse 50% 50% at 50% 30%, rgba(0,255,200,0.1), transparent)',
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="animate-fade-in-up stagger-1 opacity-0 mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-mono text-sm text-text-muted hover:text-glow-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回首页大厅
            </Link>
          </div>

          <div className="text-center mb-8">
            <div className="animate-fade-in-up stagger-1 opacity-0 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-glow-primary/30 bg-glow-primary/5 backdrop-blur-sm mb-6">
              <MapPin className="w-4 h-4 text-glow-primary" />
              <span className="font-mono text-xs text-glow-primary tracking-[0.2em] uppercase">
                Survival Map
              </span>
            </div>

            <h2 className="animate-fade-in-up stagger-2 opacity-0 font-display text-5xl md:text-6xl font-semibold text-text-light mb-4">
              微生物生存地图
            </h2>
            <p className="animate-fade-in-up stagger-3 opacity-0 font-mono text-text-muted/70 max-w-2xl mx-auto">
              探索微生物在地球各生态环境中的分布。点击区域查看该栖息地中的微生物群落与生态介绍。
            </p>
          </div>
        </div>
      </section>

      <section className="relative pb-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <div
              className={`flex-1 transition-all duration-500 ${
                selectedZone ? 'lg:flex-1' : 'lg:flex-1'
              }`}
            >
              <div className="glass-card p-4 md:p-8 overflow-hidden">
                <svg
                  viewBox="0 0 960 600"
                  className="w-full h-auto"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    {HABITAT_ZONES.map((zone) => (
                      <radialGradient
                        key={`grad-${zone.id}`}
                        id={`grad-${zone.id}`}
                        cx="50%"
                        cy="50%"
                        r="50%"
                      >
                        <stop
                          offset="0%"
                          stopColor={zone.colorLight}
                          stopOpacity={
                            hoveredZone === zone.id || selectedZone?.id === zone.id
                              ? 0.5
                              : 0.2
                          }
                        />
                        <stop
                          offset="70%"
                          stopColor={zone.color}
                          stopOpacity={
                            hoveredZone === zone.id || selectedZone?.id === zone.id
                              ? 0.3
                              : 0.1
                          }
                        />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                      </radialGradient>
                    ))}

                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    <filter id="glow-strong">
                      <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <rect width="960" height="600" fill="transparent" />

                  <g opacity="0.15">
                    <line
                      x1="0" y1="100" x2="960" y2="100"
                      stroke="#00ffc8" strokeWidth="0.5"
                    />
                    <line
                      x1="0" y1="200" x2="960" y2="200"
                      stroke="#00ffc8" strokeWidth="0.5"
                    />
                    <line
                      x1="0" y1="300" x2="960" y2="300"
                      stroke="#00ffc8" strokeWidth="0.5"
                    />
                    <line
                      x1="0" y1="400" x2="960" y2="400"
                      stroke="#00ffc8" strokeWidth="0.5"
                    />
                    <line
                      x1="0" y1="500" x2="960" y2="500"
                      stroke="#00ffc8" strokeWidth="0.5"
                    />
                    <line
                      x1="160" y1="0" x2="160" y2="600"
                      stroke="#00ffc8" strokeWidth="0.5"
                    />
                    <line
                      x1="320" y1="0" x2="320" y2="600"
                      stroke="#00ffc8" strokeWidth="0.5"
                    />
                    <line
                      x1="480" y1="0" x2="480" y2="600"
                      stroke="#00ffc8" strokeWidth="0.5"
                    />
                    <line
                      x1="640" y1="0" x2="640" y2="600"
                      stroke="#00ffc8" strokeWidth="0.5"
                    />
                    <line
                      x1="800" y1="0" x2="800" y2="600"
                      stroke="#00ffc8" strokeWidth="0.5"
                    />
                  </g>

                  <g opacity="0.08">
                    <path
                      d="M0,120 Q240,80 480,130 Q720,180 960,100"
                      stroke="#2e86c1"
                      strokeWidth="1"
                      fill="none"
                    />
                    <path
                      d="M0,450 Q300,420 600,460 Q800,480 960,440"
                      stroke="#00b894"
                      strokeWidth="1"
                      fill="none"
                    />
                  </g>

                  {HABITAT_ZONES.map((zone) => {
                    const isActive =
                      selectedZone?.id === zone.id || hoveredZone === zone.id;
                    return (
                      <g
                        key={zone.id}
                        className="cursor-pointer"
                        onClick={() =>
                          setSelectedZone(
                            selectedZone?.id === zone.id ? null : zone
                          )
                        }
                        onMouseEnter={() => setHoveredZone(zone.id)}
                        onMouseLeave={() => setHoveredZone(null)}
                      >
                        <ellipse
                          cx={zone.cx}
                          cy={zone.cy}
                          rx={zone.rx + 20}
                          ry={zone.ry + 20}
                          fill={`url(#grad-${zone.id})`}
                          className="transition-all duration-500"
                        />

                        <ellipse
                          cx={zone.cx}
                          cy={zone.cy}
                          rx={zone.rx}
                          ry={zone.ry}
                          fill={`${zone.color}${
                            isActive ? '40' : '15'
                          }`}
                          stroke={zone.colorLight}
                          strokeWidth={isActive ? 2 : 1}
                          strokeOpacity={isActive ? 0.8 : 0.3}
                          strokeDasharray={isActive ? 'none' : '4 4'}
                          className="transition-all duration-500"
                          filter={isActive ? 'url(#glow-strong)' : 'url(#glow)'}
                        />

                        <text
                          x={zone.cx}
                          y={zone.cy - 10}
                          textAnchor="middle"
                          fill={zone.colorLight}
                          fontSize="28"
                          opacity={isActive ? 1 : 0.7}
                          className="transition-all duration-300 select-none pointer-events-none"
                        >
                          {zone.icon}
                        </text>

                        <text
                          x={zone.cx}
                          y={zone.cy + 22}
                          textAnchor="middle"
                          fill={zone.colorLight}
                          fontSize="14"
                          fontWeight="600"
                          fontFamily="'JetBrains Mono', monospace"
                          opacity={isActive ? 1 : 0.6}
                          className="transition-all duration-300 select-none pointer-events-none"
                        >
                          {zone.name}
                        </text>

                        <text
                          x={zone.cx}
                          y={zone.cy + 38}
                          textAnchor="middle"
                          fill={zone.colorLight}
                          fontSize="9"
                          fontFamily="'JetBrains Mono', monospace"
                          opacity={0.4}
                          className="transition-all duration-300 select-none pointer-events-none"
                        >
                          {zone.nameEn}
                        </text>

                        {isActive && (
                          <>
                            <ellipse
                              cx={zone.cx}
                              cy={zone.cy}
                              rx={zone.rx + 8}
                              ry={zone.ry + 8}
                              fill="none"
                              stroke={zone.colorLight}
                              strokeWidth="0.5"
                              strokeOpacity="0.4"
                              className="animate-pulse"
                            />
                          </>
                        )}
                      </g>
                    );
                  })}

                  <g opacity="0.3">
                    <line
                      x1="270" y1="300" x2="405" y2="380"
                      stroke="#00ffc8" strokeWidth="0.5"
                      strokeDasharray="3 3"
                    />
                    <line
                      x1="600" y1="380" x2="700" y2="520"
                      stroke="#2e86c1" strokeWidth="0.5"
                      strokeDasharray="3 3"
                    />
                    <line
                      x1="500" y1="245" x2="500" y2="310"
                      stroke="#e74c3c" strokeWidth="0.5"
                      strokeDasharray="3 3"
                    />
                    <line
                      x1="425" y1="380" x2="320" y2="480"
                      stroke="#fd79a8" strokeWidth="0.5"
                      strokeDasharray="3 3"
                    />
                  </g>

                  <g opacity="0.2" className="select-none pointer-events-none">
                    <text x="30" y="30" fill="#8fb5af" fontSize="9" fontFamily="'JetBrains Mono', monospace">
                      MICRORIAL HABITAT MAP
                    </text>
                    <text x="30" y="580" fill="#8fb5af" fontSize="8" fontFamily="'JetBrains Mono', monospace">
                      SCALE: NOT TO SCALE · CLICK ZONES TO EXPLORE
                    </text>
                    <text x="780" y="580" fill="#8fb5af" fontSize="8" fontFamily="'JetBrains Mono', monospace">
                      {microbes.length} SPECIES INDEXED
                    </text>
                  </g>
                </svg>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {HABITAT_ZONES.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() =>
                      setSelectedZone(
                        selectedZone?.id === zone.id ? null : zone
                      )
                    }
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border transition-all duration-300 cursor-pointer ${
                      selectedZone?.id === zone.id
                        ? 'border-opacity-60 bg-opacity-20'
                        : 'border-white/10 bg-white/5 text-text-muted hover:text-text-light hover:border-white/20'
                    }`}
                    style={
                      selectedZone?.id === zone.id
                        ? {
                            borderColor: zone.colorLight,
                            backgroundColor: `${zone.color}20`,
                            color: zone.colorLight,
                          }
                        : undefined
                    }
                  >
                    <span>{zone.icon}</span>
                    {zone.name}
                  </button>
                ))}
              </div>
            </div>

            {selectedZone && (
              <div className="lg:w-[420px] flex-shrink-0">
                <div
                  className="glass-card p-6 md:p-8 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto animate-fade-in-up"
                  style={{
                    borderColor: `${selectedZone.colorLight}40`,
                  }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border"
                        style={{
                          borderColor: `${selectedZone.colorLight}40`,
                          background: `${selectedZone.color}20`,
                        }}
                      >
                        {selectedZone.icon}
                      </div>
                      <div>
                        <h3
                          className="font-display text-2xl font-semibold"
                          style={{ color: selectedZone.colorLight }}
                        >
                          {selectedZone.name}
                        </h3>
                        <span className="font-mono text-[10px] text-text-muted/60 tracking-[0.15em] uppercase">
                          {selectedZone.nameEn}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedZone(null)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-text-light transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div
                    className="h-px mb-6"
                    style={{
                      background: `linear-gradient(to right, ${selectedZone.colorLight}40, transparent)`,
                    }}
                  />

                  <p className="font-mono text-sm text-text-muted/80 leading-relaxed mb-6">
                    {selectedZone.description}
                  </p>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs text-text-muted/60 tracking-widest uppercase">
                        栖息微生物
                      </span>
                      <span
                        className="font-mono text-xs px-2 py-0.5 rounded-full"
                        style={{
                          color: selectedZone.colorLight,
                          background: `${selectedZone.color}20`,
                        }}
                      >
                        {filteredMicrobes.length} 种
                      </span>
                    </div>
                  </div>

                  {filteredMicrobes.length === 0 ? (
                    <div className="text-center py-8 text-text-muted/50 font-mono text-sm">
                      暂无该栖息地的馆藏标本
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredMicrobes.map((microbe) => (
                        <Link
                          key={microbe.id}
                          to={`/microbe/${microbe.id}`}
                          className="group block p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
                              <img
                                src={microbe.imageUrl}
                                alt={microbe.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-display text-base font-semibold text-text-light group-hover:text-glow-primary transition-colors truncate">
                                  {microbe.name}
                                </h4>
                                <span
                                  className={`category-badge category-badge-${microbe.category} text-[10px] px-1.5 py-0`}
                                >
                                  {CATEGORY_LABELS[microbe.category]}
                                </span>
                              </div>
                              <p className="font-mono text-[11px] text-text-muted/60 italic mb-1.5">
                                {microbe.scientificName}
                              </p>
                              <p className="font-mono text-xs text-text-muted/70 line-clamp-2 leading-relaxed">
                                {microbe.description.slice(0, 60)}...
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-text-muted/30 group-hover:text-glow-primary flex-shrink-0 mt-2 transition-all duration-300 group-hover:translate-x-0.5" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  <div
                    className="mt-6 pt-4"
                    style={{
                      borderTop: `1px solid ${selectedZone.colorLight}15`,
                    }}
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {selectedZone.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="px-2 py-0.5 text-[10px] font-mono rounded-md border"
                          style={{
                            color: selectedZone.colorLight,
                            borderColor: `${selectedZone.colorLight}25`,
                            background: `${selectedZone.color}10`,
                          }}
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
