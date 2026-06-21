import { useState } from 'react';
import {
  Eye,
  ZoomIn,
  Maximize2,
  Layers,
  Info,
  ChevronLeft,
  ChevronRight,
  X,
  Ruler,
  Crosshair,
} from 'lucide-react';
import type { MultiViewModel } from '../../../shared/types';
import { SPECIMEN_TYPE_LABELS } from '../../../shared/types';

interface ModelViewerProps {
  models: MultiViewModel[];
}

export function ModelViewer({ models }: ModelViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeModel = models[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + models.length) % models.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % models.length);
  };

  if (!activeModel) return null;

  return (
    <div className="space-y-4">
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-glow-primary" />
            <span className="font-mono text-xs text-text-light tracking-wider">
              多视角模型观察台
            </span>
            <span className="font-mono text-[10px] text-text-muted">
              {activeIndex + 1} / {models.length}
            </span>
          </div>
          <button
            onClick={() => setLightboxOpen(true)}
            className="p-2 rounded-lg border border-white/10 text-text-muted hover:text-glow-primary hover:border-glow-primary/40 transition-colors"
            title="全屏查看"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        <div className="relative aspect-video bg-background-deep">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <img
            src={activeModel.imageUrl}
            alt={activeModel.name}
            className="w-full h-full object-contain p-4"
          />

          <div className="absolute bottom-4 left-4 glass-card px-3 py-1.5">
            <div className="flex items-center gap-2">
              <Ruler className="w-3 h-3 text-glow-primary" />
              <span className="font-mono text-[10px] text-glow-primary">
                比例尺: {activeModel.scaleBar}
              </span>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 glass-card px-3 py-1.5">
            <div className="flex items-center gap-2">
              <Crosshair className="w-3 h-3 text-glow-gold" />
              <span className="font-mono text-[10px] text-glow-gold">
                分辨率: {activeModel.resolution}
              </span>
            </div>
          </div>

          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-text-muted hover:text-glow-primary hover:border-glow-primary/40 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-text-muted hover:text-glow-primary hover:border-glow-primary/40 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 border-t border-white/5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-display text-lg font-semibold text-text-light mb-1">
                {activeModel.name}
              </h3>
              <span
                className="inline-block px-2 py-0.5 rounded-full font-mono text-[10px] tracking-wider"
                style={{
                  background: 'rgba(0,255,200,0.1)',
                  color: '#00ffc8',
                  border: '1px solid rgba(0,255,200,0.2)',
                }}
              >
                {SPECIMEN_TYPE_LABELS[activeModel.type]}
              </span>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] text-text-muted">
                放大倍率
              </div>
              <div className="font-display text-sm font-semibold text-text-light">
                {activeModel.magnification}
              </div>
            </div>
          </div>

          <p className="font-mono text-sm text-text-muted/80 leading-relaxed mb-4">
            {activeModel.description}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-glow-primary/5 border border-glow-primary/10">
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-3 h-3 text-glow-primary" />
                <span className="font-mono text-[10px] text-text-muted">
                  成像技术
                </span>
              </div>
              <p className="font-mono text-xs text-text-light">
                {activeModel.technique}
              </p>
            </div>
            {activeModel.viewAngle && (
              <div className="p-3 rounded-xl bg-glow-purple/5 border border-glow-purple/10">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="w-3 h-3 text-glow-purple" />
                  <span className="font-mono text-[10px] text-text-muted">
                    观察角度
                  </span>
                </div>
                <p className="font-mono text-xs text-text-light">
                  {activeModel.viewAngle}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {models.map((model, idx) => (
          <button
            key={model.id}
            onClick={() => setActiveIndex(idx)}
            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
              idx === activeIndex
                ? 'border-glow-primary shadow-glow'
                : 'border-white/10 hover:border-white/30'
            }`}
          >
            <img
              src={model.imageUrl}
              alt={model.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-1.5 left-1.5 right-1.5">
              <span className="font-mono text-[9px] text-text-light truncate block">
                {SPECIMEN_TYPE_LABELS[model.type]}
              </span>
            </div>
            {idx === activeIndex && (
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-glow-primary shadow-[0_0_8px_#00ffc8]" />
            )}
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-background-deep/95 backdrop-blur-xl flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-text-muted hover:text-glow-primary hover:border-glow-primary/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-background/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-text-muted hover:text-glow-primary hover:border-glow-primary/40 transition-all"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-background/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-text-muted hover:text-glow-primary hover:border-glow-primary/40 transition-all"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          <div
            className="max-w-5xl max-h-[85vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeModel.imageUrl}
              alt={activeModel.name}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl"
            />
            <div className="absolute bottom-6 left-6 right-6 glass-card p-4">
              <h3 className="font-display text-xl font-semibold text-text-light mb-1">
                {activeModel.name}
              </h3>
              <p className="font-mono text-sm text-text-muted/80">
                {activeModel.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
