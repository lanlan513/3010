import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight, Sparkles } from 'lucide-react';
import {
  DiscoveryEvent,
  DISCOVERY_CATEGORY_LABELS,
  DISCOVERY_CATEGORY_COLORS,
} from '../../../shared/types';

interface TimelineProps {
  events: DiscoveryEvent[];
}

export function Timeline({ events }: TimelineProps) {
  const [selectedEra, setSelectedEra] = useState<DiscoveryEvent['era'] | 'all'>('all');

  const filteredEvents =
    selectedEra === 'all'
      ? events
      : events.filter((e) => e.era === selectedEra);

  const eras: Array<{ key: DiscoveryEvent['era'] | 'all'; label: string }> = [
    { key: 'all', label: '全部时代' },
    { key: 'ancient', label: '古代' },
    { key: 'renaissance', label: '启蒙时代' },
    { key: 'modern', label: '近代' },
    { key: 'contemporary', label: '当代' },
  ];

  const formatYear = (year: number) => {
    if (year < 0) {
      return `公元前 ${Math.abs(year)} 年`;
    }
    return `${year} 年`;
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-3 mb-12 justify-center">
        {eras.map((era) => (
          <button
            key={era.key}
            onClick={() => setSelectedEra(era.key)}
            className={`px-5 py-2.5 rounded-full font-mono text-sm transition-all duration-300 ${
              selectedEra === era.key
                ? 'bg-glow-primary/20 text-glow-primary border border-glow-primary/50 shadow-glow'
                : 'bg-background-card/50 text-text-muted border border-white/10 hover:border-glow-primary/30 hover:text-text-light'
            }`}
          >
            {era.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-glow-primary/0 via-glow-primary/30 to-glow-primary/0 hidden md:block" />

        <div className="space-y-8">
          {filteredEvents.map((event, index) => {
            const color = DISCOVERY_CATEGORY_COLORS[event.category];
            const isLeft = index % 2 === 0;

            return (
              <div
                key={event.id}
                className={`relative md:flex items-center ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full z-10 border-2 border-background bg-glow-primary/20"
                  style={{
                    boxShadow: `0 0 20px ${color}80, inset 0 0 8px ${color}60`,
                    borderColor: color,
                  }}
                />

                <div className={`md:w-1/2 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                  <Link
                    to={`/archive/${event.id}`}
                    className="group block glass-card p-6 hover:border-glow-primary/40 transition-all duration-300 hover:shadow-glow"
                    style={{
                      '--hover-shadow-color': `${color}40`,
                    } as React.CSSProperties}
                  >
                    <div className={`flex items-center gap-3 mb-4 ${isLeft ? 'md:justify-end' : ''}`}>
                      <div
                        className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono"
                        style={{
                          backgroundColor: `${color}15`,
                          color: color,
                          border: `1px solid ${color}40`,
                        }}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{formatYear(event.year)}</span>
                      </div>
                      <span
                        className="text-xs font-mono px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: `${color}10`,
                          color: color,
                        }}
                      >
                        {DISCOVERY_CATEGORY_LABELS[event.category]}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-semibold text-text-light mb-3 group-hover:text-glow-primary transition-colors">
                      {event.title}
                    </h3>

                    <p className="font-mono text-sm text-text-muted/80 leading-relaxed mb-4">
                      {event.summary}
                    </p>

                    <div className={`flex items-center gap-2 text-sm font-mono ${isLeft ? 'md:justify-end' : ''}`}>
                      <span className="text-glow-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        查看详情
                      </span>
                      <ChevronRight
                        className="w-4 h-4 text-glow-primary transform group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </Link>
                </div>

                <div className="hidden md:block w-1/2" />
              </div>
            );
          })}
        </div>
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-20">
          <Sparkles className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
          <p className="font-mono text-text-muted">该时代暂无记录</p>
        </div>
      )}
    </div>
  );
}
