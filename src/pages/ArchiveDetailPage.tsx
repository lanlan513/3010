import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Users,
  Sparkles,
  Lightbulb,
  Zap,
  Microscope,
  BookOpen,
} from 'lucide-react';
import {
  DiscoveryEvent,
  DISCOVERY_CATEGORY_LABELS,
  DISCOVERY_CATEGORY_COLORS,
  ERA_LABELS,
  Microbe,
} from '../../shared/types';
import {
  getDiscoveryById,
  getScientistById,
  scientists,
} from '../data/archaeologyData';
import { useAppStore } from '../store/useAppStore';
import { MicrobeCard } from '../components/MicrobeCard';

export function ArchiveDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { microbes, fetchMicrobes } = useAppStore();
  const [discovery, setDiscovery] = useState<DiscoveryEvent | undefined>();
  const [relatedMicrobes, setRelatedMicrobes] = useState<Microbe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (microbes.length === 0) {
      fetchMicrobes();
    }
  }, [microbes.length, fetchMicrobes]);

  useEffect(() => {
    if (id) {
      const event = getDiscoveryById(id);
      setDiscovery(event);

      if (event && microbes.length > 0) {
        const related = microbes.filter((m) =>
          event.relatedMicrobes.includes(m.id)
        );
        setRelatedMicrobes(related);
      }

      setLoading(false);
    }
  }, [id, microbes]);

  const formatYear = (year: number) => {
    if (year < 0) {
      return `公元前 ${Math.abs(year)} 年`;
    }
    return `${year} 年`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-32">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-32 bg-background-card rounded" />
          <div className="h-16 w-96 bg-background-card rounded" />
          <div className="h-64 bg-background-card rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!discovery) {
    return (
      <div className="container mx-auto px-6 pt-32 text-center">
        <h1 className="font-display text-4xl text-glow-red mb-4">事件不存在</h1>
        <Link to="/archive" className="btn-primary">
          <ArrowLeft className="w-4 h-4" />
          返回考古馆
        </Link>
      </div>
    );
  }

  const color = DISCOVERY_CATEGORY_COLORS[discovery.category];
  const relatedScientists = discovery.scientists
    .map((sid) => getScientistById(sid))
    .filter(Boolean);

  const otherScientists = scientists.filter(
    (s) => !discovery.scientists.includes(s.id)
  );

  return (
    <div className="relative min-h-screen pt-32 pb-16">
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 30% 10%, ${color}22, transparent), radial-gradient(ellipse 50% 40% at 80% 60%, ${color}15, transparent)`,
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="animate-fade-in-up stagger-1 opacity-0 mb-8">
          <Link
            to="/archive"
            className="inline-flex items-center gap-2 font-mono text-sm text-text-muted hover:text-glow-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回考古馆
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="animate-fade-in-up stagger-2 opacity-0 mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-mono"
                style={{
                  backgroundColor: `${color}15`,
                  color: color,
                  border: `1px solid ${color}40`,
                }}
              >
                <Calendar className="w-4 h-4" />
                {formatYear(discovery.year)}
              </span>
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-mono"
                style={{
                  backgroundColor: `${color}10`,
                  color: color,
                }}
              >
                {DISCOVERY_CATEGORY_LABELS[discovery.category]}
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-mono bg-background-card/50 text-text-muted border border-white/10">
                {ERA_LABELS[discovery.era]}
              </span>
            </div>

            <h1
              className="font-display text-5xl md:text-6xl font-bold text-text-light mb-4 leading-tight"
              style={{ textShadow: `0 0 40px ${color}40` }}
            >
              {discovery.title}
            </h1>

            <p className="font-mono text-lg text-text-muted/80 leading-relaxed">
              {discovery.summary}
            </p>
          </div>

          <div className="animate-fade-in-up stagger-3 opacity-0 glass-card p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-5 h-5" style={{ color }} />
              <h2 className="font-display text-2xl font-semibold text-text-light">
                事件详情
              </h2>
            </div>
            <p className="font-mono text-base text-text-light/90 leading-loose tracking-wide">
              {discovery.description}
            </p>
          </div>

          <div className="animate-fade-in-up stagger-4 opacity-0 grid md:grid-cols-2 gap-6 mb-8">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-5 h-5 text-glow-gold" />
                <h3 className="font-display text-xl font-semibold text-text-light">
                  关键发现
                </h3>
              </div>
              <ul className="space-y-3">
                {discovery.keyFindings.map((finding, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 font-mono text-sm text-text-muted/80"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    {finding}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-5 h-5 text-glow-primary" />
                <h3 className="font-display text-xl font-semibold text-text-light">
                  历史影响
                </h3>
              </div>
              <p className="font-mono text-sm text-text-muted/80 leading-relaxed">
                {discovery.impact}
              </p>
            </div>
          </div>

          {relatedScientists.length > 0 && (
            <div className="animate-fade-in-up stagger-5 opacity-0 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-5 h-5 text-glow-purple" />
                <h2 className="font-display text-2xl font-semibold text-text-light">
                  相关科学家
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedScientists.map(
                  (scientist) =>
                    scientist && (
                      <div key={scientist.id}>
                        <div className="glass-card p-5 hover:border-glow-purple/40 transition-colors cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-glow-purple/30 to-glow-primary/20 flex items-center justify-center border border-glow-purple/40">
                              <span className="font-display text-xl text-text-light">
                                {scientist.name.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-display text-lg font-semibold text-text-light mb-1">
                                {scientist.name}
                              </h4>
                              <p className="font-mono text-xs text-text-muted">
                                {scientist.nationality} · {scientist.birthYear}
                                {scientist.deathYear
                                  ? ` - ${scientist.deathYear}`
                                  : ' - 至今'}
                              </p>
                            </div>
                          </div>
                          <p className="font-mono text-xs text-text-muted/70 mt-3 leading-relaxed">
                            {scientist.biography.slice(0, 80)}...
                          </p>
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
          )}

          {relatedMicrobes.length > 0 && (
            <div className="animate-fade-in-up stagger-6 opacity-0 mb-8">
              <div className="flex items-end justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Microscope className="w-5 h-5 text-glow-primary" />
                  <h2 className="font-display text-2xl font-semibold text-text-light">
                    关联微生物
                  </h2>
                </div>
                <Link
                  to="/category/bacteria"
                  className="hidden sm:inline-flex items-center gap-2 font-mono text-sm text-text-muted hover:text-glow-primary transition-colors"
                >
                  查看更多
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedMicrobes.map((m, idx) => (
                  <MicrobeCard key={m.id} microbe={m} index={idx} />
                ))}
              </div>
            </div>
          )}

          {relatedScientists.length > 0 && (
            <div className="animate-fade-in-up stagger-7 opacity-0">
              <div className="glass-card p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-glow-purple/10 blur-[40px]" />

                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <Sparkles className="w-8 h-8 text-glow-purple mx-auto mb-3" />
                    <h3 className="font-display text-2xl font-semibold text-text-light">
                      探索更多科学巨匠
                    </h3>
                    <p className="font-mono text-sm text-text-muted mt-2">
                      了解更多推动微生物学发展的先驱者
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {otherScientists.slice(0, 4).map((scientist) => (
                      <Link
                        key={scientist.id}
                        to="/archive"
                        className="glass-card p-4 text-center hover:border-glow-purple/40 transition-all duration-300 group"
                        onClick={() => {
                          // Scroll to scientists section
                        }}
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-glow-purple/20 to-glow-primary/10 flex items-center justify-center border border-glow-purple/30 mx-auto mb-3">
                          <span className="font-display text-lg text-text-light">
                            {scientist.name.charAt(0)}
                          </span>
                        </div>
                        <h4 className="font-display text-sm font-semibold text-text-light mb-1">
                          {scientist.name}
                        </h4>
                        <p className="font-mono text-[10px] text-text-muted">
                          {scientist.nationality}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
