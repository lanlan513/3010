import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  History,
  Globe,
  CheckCircle,
  AlertCircle,
  Users,
  FlaskConical,
  Thermometer,
  Clock,
  Droplet,
  Package,
} from 'lucide-react';
import {
  INDUSTRIAL_CATEGORY_LABELS,
  INDUSTRIAL_CATEGORY_COLORS,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
} from '../../shared/types';
import { getApplicationById } from '../data/industrialApplications';
import { useAppStore } from '../store/useAppStore';
import { NotFoundPage } from './NotFoundPage';

const scaleLabels: Record<string, string> = {
  laboratory: '实验室阶段',
  pilot: '中试运行',
  industrial: '工业化生产',
  global: '全球化应用',
};

const importanceLabels: Record<string, string> = {
  primary: '核心菌种',
  secondary: '辅助菌种',
  supporting: '支持菌种',
};

const importanceColors: Record<string, string> = {
  primary: '#00ffc8',
  secondary: '#f1c40f',
  supporting: '#95a5a6',
};

export function IndustryAppDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { microbes, fetchMicrobes } = useAppStore();
  const [fetchTriggered, setFetchTriggered] = useState(false);

  useEffect(() => {
    if (!fetchTriggered) {
      fetchMicrobes();
      setFetchTriggered(true);
    }
  }, [fetchTriggered, fetchMicrobes]);

  const application = useMemo(() => (id ? getApplicationById(id) : undefined), [id]);

  if (!application) {
    return <NotFoundPage />;
  }

  const color = INDUSTRIAL_CATEGORY_COLORS[application.category];
  const relatedMicrobesData = application.relatedMicrobes
    .map((rm) => {
      const m = microbes.find((microbe) => microbe.id === rm.microbeId);
      return m
        ? {
            microbe: m,
            role: rm.role,
            importance: rm.importance,
            contribution: rm.contribution,
          }
        : null;
    })
    .filter(
      (
        item,
      ): item is {
        microbe: typeof microbes[number];
        role: string;
        importance: 'primary' | 'secondary' | 'supporting';
        contribution: string;
      } => item !== null,
    );

  return (
    <div className="relative min-h-screen">
      <section className="relative overflow-hidden pt-32 pb-12">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(ellipse 60% 80% at 20% 10%, ${color}15, transparent), radial-gradient(ellipse 50% 70% at 80% 30%, #9b59b615, transparent)`,
          }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="animate-fade-in-up stagger-1 opacity-0 mb-8">
            <Link
              to="/industry"
              className="inline-flex items-center gap-2 font-mono text-sm text-text-muted hover:text-glow-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回工业应用馆
            </Link>
          </div>

          <div className="animate-fade-in-up stagger-2 opacity-0 flex items-center gap-4 mb-6">
            <span
              className="font-mono text-xs tracking-[0.2em] uppercase px-4 py-1.5 rounded-full"
              style={{ background: `${color}20`, color }}
            >
              {INDUSTRIAL_CATEGORY_LABELS[application.category]}
            </span>
            <span className="font-mono text-xs text-text-muted/60">
              {scaleLabels[application.scale]}
            </span>
          </div>

          <h1 className="animate-fade-in-up stagger-3 opacity-0 font-display text-4xl md:text-6xl font-bold text-text-light mb-4 leading-tight">
            {application.title}
          </h1>
          <p className="animate-fade-in-up stagger-4 opacity-0 font-mono text-lg text-text-muted/80 mb-8">
            {application.subtitle}
          </p>

          {application.keyMetrics.length > 0 && (
            <div className="animate-fade-in-up stagger-5 opacity-0 grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {application.keyMetrics.map((metric, idx) => (
                <div key={idx} className="glass-card p-5" style={{ borderColor: `${color}20` }}>
                  <div className="font-display text-3xl font-bold" style={{ color }}>
                    {metric.value}
                  </div>
                  <div className="font-mono text-xs text-text-muted/60 mt-2 tracking-wider">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative py-8">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="glass-card p-8 animate-fade-in-up opacity-0">
                <h2 className="font-display text-2xl font-semibold text-text-light mb-4">
                  技术概述
                </h2>
                <p className="font-mono text-sm text-text-light/80 leading-relaxed whitespace-pre-line">
                  {application.description}
                </p>
              </div>

              <div className="glass-card p-8 animate-fade-in-up opacity-0 stagger-1">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${color}20`, color }}
                  >
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-text-light">
                    工艺流程
                  </h2>
                </div>

                <div className="relative">
                  <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-glow-primary/60 to-glow-purple/60" />

                  {application.processSteps.map((step) => (
                    <div key={step.id} className="relative pl-16 pb-8 last:pb-0">
                      <div
                        className="absolute left-0 top-0 w-12 h-12 rounded-xl flex items-center justify-center font-display text-xl font-bold border-2"
                        style={{
                          background: `linear-gradient(135deg, ${color}20, ${color}10)`,
                          borderColor: `${color}50`,
                          color,
                        }}
                      >
                        {step.order}
                      </div>

                      <div className="glass-card p-5" style={{ borderColor: `${color}15` }}>
                        <h3 className="font-display text-lg font-semibold text-text-light mb-2">
                          {step.title}
                        </h3>
                        <p className="font-mono text-xs text-text-muted/80 leading-relaxed mb-4">
                          {step.description}
                        </p>

                        <div className="flex flex-wrap gap-3 text-xs font-mono">
                          {step.duration && (
                            <span
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                              style={{ background: `${color}10`, color: `${color}cc` }}
                            >
                              <Clock className="w-3.5 h-3.5" />
                              {step.duration}
                            </span>
                          )}
                          {step.temperature && (
                            <span
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                              style={{ background: '#e67e2215', color: '#e67e22' }}
                            >
                              <Thermometer className="w-3.5 h-3.5" />
                              {step.temperature}
                            </span>
                          )}
                          {step.ph && (
                            <span
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                              style={{ background: '#3498db15', color: '#3498db' }}
                            >
                              <Droplet className="w-3.5 h-3.5" />
                              pH {step.ph}
                            </span>
                          )}
                        </div>

                        {step.keyMicrobeIds && step.keyMicrobeIds.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-1.5 mb-3">
                              <Users className="w-3.5 h-3.5 text-text-muted" />
                              <span className="font-mono text-[11px] text-text-muted/70">
                                关键微生物
                              </span>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              {step.keyMicrobeIds.map((mid) => {
                                const m = microbes.find((x) => x.id === mid);
                                if (!m) return null;
                                return (
                                  <Link
                                    key={mid}
                                    to={`/microbe/${m.id}`}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border group transition-all"
                                    style={{
                                      borderColor: `${CATEGORY_COLORS[m.category]}30`,
                                      background: `${CATEGORY_COLORS[m.category]}08`,
                                    }}
                                  >
                                    <img
                                      src={m.imageUrl}
                                      alt={m.name}
                                      className="w-6 h-6 rounded-full object-cover"
                                    />
                                    <span
                                      className="font-mono text-xs group-hover:text-glow-primary transition-colors"
                                      style={{ color: CATEGORY_COLORS[m.category] }}
                                    >
                                      {m.name}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 animate-fade-in-up opacity-0 stagger-2">
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-glow-primary/15 text-glow-primary">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-text-light">
                      技术优势
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {application.advantages.map((adv, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-glow-primary mt-1.5 flex-shrink-0" />
                        <span className="font-mono text-xs text-text-light/80 leading-relaxed">
                          {adv}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-glow-purple/15 text-glow-purple">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-text-light">
                      面临挑战
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {application.challenges.map((chal, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-glow-purple mt-1.5 flex-shrink-0" />
                        <span className="font-mono text-xs text-text-light/80 leading-relaxed">
                          {chal}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass-card p-6 animate-fade-in-up opacity-0">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${color}20`, color }}
                  >
                    <History className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-xl font-semibold text-text-light">发展历史</h2>
                </div>
                <p className="font-mono text-xs text-text-light/80 leading-relaxed">
                  {application.history}
                </p>
              </div>

              <div className="glass-card p-6 animate-fade-in-up opacity-0 stagger-1">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${color}20`, color }}
                  >
                    <Globe className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-xl font-semibold text-text-light">产业影响</h2>
                </div>
                <p className="font-mono text-xs text-text-light/80 leading-relaxed">
                  {application.impact}
                </p>
              </div>

              <div className="glass-card p-6 animate-fade-in-up opacity-0 stagger-2">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${color}20`, color }}
                  >
                    <Package className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-xl font-semibold text-text-light">
                    主要产品
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {application.products.map((product, idx) => (
                    <span
                      key={idx}
                      className="font-mono text-xs px-3 py-1.5 rounded-lg"
                      style={{ background: `${color}12`, color: `${color}dd` }}
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>

              {relatedMicrobesData.length > 0 && (
                <div className="animate-fade-in-up opacity-0 stagger-3">
                  <div className="flex items-center gap-3 mb-4 px-2">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${color}20`, color }}
                    >
                      <Users className="w-5 h-5" />
                    </div>
                    <h2 className="font-display text-xl font-semibold text-text-light">
                      关联微生物
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {relatedMicrobesData.map((item, idx) => {
                      const importanceColor = importanceColors[item.importance];
                      return (
                        <Link
                          key={idx}
                          to={`/microbe/${item.microbe.id}`}
                          className="glass-card p-4 block group transition-all hover:border-glow-primary/40"
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0"
                              style={{
                                background: `${CATEGORY_COLORS[item.microbe.category]}15`,
                                border: `1px solid ${CATEGORY_COLORS[item.microbe.category]}30`,
                              }}
                            >
                              <img
                                src={item.microbe.imageUrl}
                                alt={item.microbe.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-display text-base font-semibold text-text-light group-hover:text-glow-primary transition-colors">
                                    {item.microbe.name}
                                  </h4>
                                  <p className="font-mono text-[10px] text-text-muted/60">
                                    {item.microbe.scientificName}
                                  </p>
                                </div>
                                <span
                                  className="font-mono text-[10px] px-2 py-0.5 rounded-md whitespace-nowrap"
                                  style={{
                                    background: `${importanceColor}15`,
                                    color: importanceColor,
                                  }}
                                >
                                  {importanceLabels[item.importance]}
                                </span>
                              </div>
                              <div className="mb-2">
                                <span
                                  className="font-mono text-[10px]"
                                  style={{ color: CATEGORY_COLORS[item.microbe.category] }}
                                >
                                  {CATEGORY_LABELS[item.microbe.category]}
                                </span>
                                <span className="text-text-muted/40 mx-2">·</span>
                                <span className="font-mono text-[10px] text-text-muted/70">
                                  {item.role}
                                </span>
                              </div>
                              <p className="font-mono text-[11px] text-text-muted/80 leading-relaxed">
                                {item.contribution}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
