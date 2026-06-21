import { Scientist } from '../../../shared/types';
import { Award, MapPin, Calendar } from 'lucide-react';

interface ScientistCardProps {
  scientist: Scientist;
  compact?: boolean;
}

export function ScientistCard({ scientist, compact = false }: ScientistCardProps) {
  if (compact) {
    return (
      <div className="glass-card p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-glow-purple/20 to-glow-primary/20 flex items-center justify-center border border-glow-purple/30">
          <span className="font-display text-lg text-text-light">
            {scientist.name.charAt(0)}
          </span>
        </div>
        <div>
          <h4 className="font-display text-base font-semibold text-text-light">
            {scientist.name}
          </h4>
          <p className="font-mono text-xs text-text-muted">
            {scientist.nationality}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 relative overflow-hidden group hover:border-glow-purple/40 transition-all duration-300">
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-glow-purple/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-glow-purple/30 to-glow-primary/20 flex items-center justify-center border border-glow-purple/40">
            <span className="font-display text-2xl text-text-light">
              {scientist.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-text-light mb-1">
              {scientist.name}
            </h3>
            <div className="flex items-center gap-3 text-text-muted text-sm font-mono">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {scientist.nationality}
              </span>
            </div>
            <div className="flex items-center gap-1 text-text-muted/70 text-xs font-mono mt-1">
              <Calendar className="w-3 h-3" />
              <span>
                {scientist.birthYear}
                {scientist.deathYear ? ` - ${scientist.deathYear}` : ' - 至今'}
              </span>
            </div>
          </div>
        </div>

        <p className="font-mono text-sm text-text-muted/80 leading-relaxed mb-4">
          {scientist.biography}
        </p>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-glow-gold" />
            <span className="font-mono text-xs text-text-muted tracking-wider uppercase">
              主要成就
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {scientist.achievements.slice(0, compact ? 2 : 4).map((achievement, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-mono bg-glow-primary/10 text-glow-primary/80 border border-glow-primary/20"
              >
                {achievement}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
