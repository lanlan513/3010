import { useState } from 'react';
import {
  ImageIcon,
  Download,
  Info,
  Camera,
  FileWarning,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from 'lucide-react';
import type { HighResImage } from '../../../shared/types';

interface ImageGalleryProps {
  images: HighResImage[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + images.length) % images.length
    );
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev === null ? null : (prev + 1) % images.length
    );
  };

  const activeImage = lightboxIndex !== null ? images[lightboxIndex] : null;

  return (
    <>
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-glow-primary" />
            <span className="font-mono text-xs tracking-wider text-text-light">
              高清图像档案
            </span>
            <span className="font-mono text-[10px] text-text-muted px-2 py-0.5 rounded-full bg-glow-primary/10 border border-glow-primary/20">
              {images.length} 张
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, idx) => (
            <div
              key={image.id}
              className="group relative aspect-video rounded-xl overflow-hidden border border-white/10 hover:border-glow-primary/40 transition-all cursor-pointer animate-fade-in-up opacity-0"
              style={{ animationDelay: `${idx * 0.08}s` }}
              onClick={() => setLightboxIndex(idx)}
            >
              <img
                src={image.thumbnailUrl || image.imageUrl}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-glow-primary/30 flex items-center justify-center">
                  <ZoomIn className="w-4 h-4 text-glow-primary" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-display text-sm font-semibold text-text-light">
                    {image.title}
                  </h4>
                  <div className="px-1.5 py-0.5 rounded bg-glow-primary/15 border border-glow-primary/20">
                    <span className="font-mono text-[9px] text-glow-primary">
                      {image.resolution}
                    </span>
                  </div>
                </div>
                <p className="font-mono text-[10px] text-text-muted/80 line-clamp-2">
                  {image.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeImage && (
        <div
          className="fixed inset-0 z-[100] bg-background-deep/95 backdrop-blur-xl flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-text-muted hover:text-glow-primary hover:border-glow-primary/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {images.length > 1 && (
            <>
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
            </>
          )}

          <div className="max-w-6xl max-h-[90vh] w-full mx-20 relative" onClick={(e) => e.stopPropagation()}>
            <div className="relative rounded-2xl overflow-hidden border border-white/10">
              <img
                src={activeImage.imageUrl}
                alt={activeImage.title}
                className="w-full max-h-[75vh] object-contain bg-background"
              />
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-4">
                <h3 className="font-display text-lg font-semibold text-text-light mb-2">
                  {activeImage.title}
                </h3>
                <p className="font-mono text-sm text-text-muted/80 leading-relaxed">
                  {activeImage.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Camera className="w-3 h-3 text-glow-primary" />
                    <span className="font-mono text-[10px] text-text-muted">
                      采集方式
                    </span>
                  </div>
                  <p className="font-mono text-xs text-text-light">
                    {activeImage.captureMethod}
                  </p>
                </div>
                <div className="glass-card p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <ZoomIn className="w-3 h-3 text-glow-gold" />
                    <span className="font-mono text-[10px] text-text-muted">
                      分辨率
                    </span>
                  </div>
                  <p className="font-mono text-xs text-text-light">
                    {activeImage.resolution}
                  </p>
                </div>
                <div className="glass-card p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Info className="w-3 h-3 text-glow-purple" />
                    <span className="font-mono text-[10px] text-text-muted">
                      版权信息
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-text-light leading-tight">
                    {activeImage.copyright}
                  </p>
                </div>
                <div className="glass-card p-3">
                  <button className="w-full h-full flex flex-col items-center justify-center gap-1 rounded-xl border border-glow-primary/30 bg-glow-primary/5 hover:bg-glow-primary/10 transition-colors py-2">
                    <Download className="w-4 h-4 text-glow-primary" />
                    <span className="font-mono text-[10px] text-glow-primary">
                      下载原图
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === lightboxIndex
                        ? 'w-8 bg-glow-primary'
                        : 'w-1.5 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
