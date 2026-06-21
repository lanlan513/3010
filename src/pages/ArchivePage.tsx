import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Sparkles,
  Clock,
  Microscope,
  Award,
  Globe2,
} from 'lucide-react';
import { Timeline } from '../components/archaeology/Timeline';
import { ScientistCard } from '../components/archaeology/ScientistCard';
import {
  getAllDiscoveriesSorted,
  scientists,
} from '../data/archaeologyData';
import {
  DISCOVERY_CATEGORY_LABELS,
  DISCOVERY_CATEGORY_COLORS,
  ERA_LABELS,
} from '../../shared/types';

const SCROLL_POSITION_KEY = 'archive_scroll_position';

export function ArchivePage() {
  const [events, setEvents] = useState(getAllDiscoveriesSorted());
  const [activeSection, setActiveSection] = useState<'timeline' | 'scientists'>(
    'timeline'
  );

  useEffect(() => {
    setEvents(getAllDiscoveriesSorted());
    const savedPosition = sessionStorage.getItem(SCROLL_POSITION_KEY);
    if (savedPosition) {
      const pos = parseInt(savedPosition, 10);
      setTimeout(() => {
        window.scrollTo({ top: pos, behavior: 'auto' });
      }, 50);
      sessionStorage.removeItem(SCROLL_POSITION_KEY);
    }
  }, []);

  const handleEventClick = () => {
    sessionStorage.setItem(SCROLL_POSITION_KEY, String(window.scrollY));
  };

  const categoryStats = (
    ['discovery', 'theory', 'technology', 'medical', 'genomics'] as const
  ).map((cat) => ({
    category: cat,
    count: events.filter((e) => e.category === cat).length,
  }));

  const eraStats = (
    ['ancient', 'renaissance', 'modern', 'contemporary'] as const
  ).map((era) => ({
    era,
    count: events.filter((e) => e.era === era).length,
  }));

  return (
    <div className="relative min-h-screen pt-32 pb-20">
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up opacity-0">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-glow-primary/30 bg-glow-primary/5 backdrop-blur-sm mb-6">
            <BookOpen className="w-4 h-4 text-glow-primary" />
            <span className="font-mono text-xs text-glow-primary tracking-[0.2em] uppercase">
              Microbiology Archive
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-text-light mb-6 leading-tight">
            微生物档案
            <br />
            <span className="text-gradient-primary text-shadow-glow">考古馆</span>
          </h1>

          <p className="font-mono text-base text-text-muted/80 max-w-2xl mx-auto leading-relaxed">
            穿越时空，探索微生物学发展的光辉历程。
            从古代的发酵工艺到当代的合成生物学，每一个发现都在改写生命的边界。
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 animate-fade-in-up stagger-1 opacity-0">
          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-display font-bold text-glow-primary mb-2">
              {events.length}
            </div>
            <div className="font-mono text-xs text-text-muted tracking-wider uppercase">
              历史事件
            </div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-display font-bold text-glow-purple mb-2">
              {scientists.length}
            </div>
            <div className="font-mono text-xs text-text-muted tracking-wider uppercase">
              科学巨匠
            </div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-display font-bold text-glow-gold mb-2">
              4
            </div>
            <div className="font-mono text-xs text-text-muted tracking-wider uppercase">
              历史时代
            </div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-display font-bold text-glow-red mb-2">
              5
            </div>
            <div className="font-mono text-xs text-text-muted tracking-wider uppercase">
              发现类别
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-12 animate-fade-in-up stagger-2 opacity-0">
          <button
            onClick={() => setActiveSection('timeline')}
            className={`px-8 py-3 rounded-full font-mono text-sm transition-all duration-300 flex items-center gap-2 ${
              activeSection === 'timeline'
                ? 'bg-glow-primary/20 text-glow-primary border border-glow-primary/50 shadow-glow'
                : 'bg-background-card/50 text-text-muted border border-white/10 hover:border-glow-primary/30 hover:text-text-light'
            }`}
          >
            <Clock className="w-4 h-4" />
            时间长廊
          </button>
          <button
            onClick={() => setActiveSection('scientists')}
            className={`px-8 py-3 rounded-full font-mono text-sm transition-all duration-300 flex items-center gap-2 ${
              activeSection === 'scientists'
                ? 'bg-glow-purple/20 text-glow-purple border border-glow-purple/50 shadow-glow-purple'
                : 'bg-background-card/50 text-text-muted border border-white/10 hover:border-glow-purple/30 hover:text-text-light'
            }`}
          >
            <Users className="w-4 h-4" />
            科学巨匠
          </button>
        </div>

        {activeSection === 'timeline' && (
          <div className="animate-fade-in-up stagger-3 opacity-0">
            <div className="max-w-4xl mx-auto mb-12">
              <div className="glass-card p-6 mb-8">
                <h3 className="font-display text-xl font-semibold text-text-light mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-glow-gold" />
                  发现类别
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {categoryStats.map((stat) => {
                    const color = DISCOVERY_CATEGORY_COLORS[stat.category];
                    return (
                      <div
                        key={stat.category}
                        className="p-3 rounded-xl text-center border"
                        style={{
                          backgroundColor: `${color}08`,
                          borderColor: `${color}20`,
                        }}
                      >
                        <div
                          className="text-2xl font-display font-bold mb-1"
                          style={{ color }}
                        >
                          {stat.count}
                        </div>
                        <div className="font-mono text-[10px] text-text-muted tracking-wide">
                          {DISCOVERY_CATEGORY_LABELS[stat.category]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-display text-xl font-semibold text-text-light mb-4 flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-glow-primary" />
                  时代划分
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {eraStats.map((stat) => (
                    <div
                      key={stat.era}
                      className="p-3 rounded-xl text-center border border-glow-primary/20 bg-glow-primary/5"
                    >
                      <div className="text-2xl font-display font-bold text-glow-primary mb-1">
                        {stat.count}
                      </div>
                      <div className="font-mono text-[10px] text-text-muted tracking-wide">
                        {ERA_LABELS[stat.era]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center mb-10">
              <h2 className="font-display text-4xl font-semibold text-text-light mb-3">
                时间长廊
              </h2>
              <p className="font-mono text-text-muted/70">
                沿时间轴浏览微生物学发展史上的里程碑事件
              </p>
            </div>

            <Timeline events={events} onEventClick={handleEventClick} />
          </div>
        )}

        {activeSection === 'scientists' && (
          <div className="animate-fade-in-up stagger-3 opacity-0">
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl font-semibold text-text-light mb-3">
                科学巨匠
              </h2>
              <p className="font-mono text-text-muted/70">
                致敬那些照亮微观世界的先驱者们
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {scientists.map((scientist, idx) => (
                <div
                  key={scientist.id}
                  className="animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${0.1 * idx}s` }}
                >
                  <ScientistCard scientist={scientist} />
                </div>
              ))}
            </div>
          </div>
        )}

        <section className="mt-32 animate-fade-in-up stagger-4 opacity-0">
          <div className="max-w-3xl mx-auto text-center glass-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-30" />
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-glow-primary/10 blur-[60px]" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-glow-purple/10 blur-[60px]" />

            <div className="relative z-10">
              <Sparkles className="w-10 h-10 text-glow-primary mx-auto mb-6" />
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-text-light mb-6">
                探索微观世界
              </h2>
              <p className="font-mono text-text-muted/80 leading-relaxed mb-8">
                历史上的每一次发现，都为我们打开了一扇通往微观宇宙的大门。
                今天，让我们继续沿着先驱者的足迹，探索更多未知。
              </p>
              <Link to="/category/bacteria" className="btn-primary">
                <Microscope className="w-5 h-5" />
                浏览微生物标本
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
