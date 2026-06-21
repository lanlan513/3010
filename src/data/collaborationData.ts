import type {
  CommunityMicrobe,
  CommunityInteraction,
  CommunityTimePoint,
  StabilityReport,
} from '../../shared/types';
import { ecologicalRelations } from './ecologicalRelations';
import { microbeMetabolismProfiles } from './metabolismData';

const MICROBE_GROWTH_RATES: Record<number, number> = {
  1: 0.5, 2: 0.4, 3: 0.45, 4: 0.55, 5: 0.5,
  6: 0.25, 7: 0.6, 8: 0.4, 9: 0.35, 10: 0.4,
  11: 0.3, 12: 0.35, 13: 0.2, 14: 0.15, 15: 0.7,
  16: 0.6, 17: 0.65, 18: 0.7, 19: 0.55, 20: 0.6,
  21: 0.45, 22: 0.4, 23: 0.35, 24: 0.5,
};

const MICROBE_TEMP_OPT: Record<number, [number, number]> = {
  1: [35, 40], 2: [30, 39], 3: [25, 37], 4: [35, 42], 5: [35, 40],
  6: [35, 38], 7: [30, 37], 8: [36, 40], 9: [25, 32], 10: [25, 37],
  11: [22, 30], 12: [35, 39], 13: [18, 25], 14: [25, 30], 15: [35, 39],
  16: [20, 30], 17: [33, 37], 18: [33, 37], 19: [35, 39], 20: [35, 39],
  21: [75, 92], 22: [65, 85], 23: [35, 45], 24: [90, 105],
};

const MICROBE_PH_OPT: Record<number, [number, number]> = {
  1: [6.5, 7.5], 2: [6.0, 7.5], 3: [6.0, 8.0], 4: [6.5, 8.0], 5: [5.0, 6.5],
  6: [6.5, 7.5], 7: [7.0, 8.5], 8: [6.0, 7.0], 9: [4.5, 6.5], 10: [4.0, 7.0],
  11: [5.0, 7.0], 12: [5.5, 7.5], 13: [6.0, 7.5], 14: [5.0, 6.5], 15: [6.5, 7.5],
  16: [6.0, 8.0], 17: [6.5, 7.5], 18: [6.0, 8.0], 19: [6.5, 7.5], 20: [6.0, 8.0],
  21: [6.0, 7.5], 22: [1.5, 3.5], 23: [6.0, 7.5], 24: [6.0, 8.0],
};

function getInteractionType(
  relType: string
): 'cooperation' | 'competition' | 'parasitism' | 'neutral' {
  if (relType === 'symbiosis') return 'cooperation';
  if (relType === 'competition') return 'competition';
  if (relType === 'parasitism' || relType === 'predation') return 'parasitism';
  return 'neutral';
}

function fitnessScore(value: number, range: [number, number]): number {
  const [min, max] = range;
  const mid = (min + max) / 2;
  const halfRange = (max - min) / 2;
  const distance = Math.abs(value - mid);
  if (distance <= halfRange) return 1 - (distance / halfRange) * 0.3;
  const penalty = Math.min(1, (distance - halfRange) / halfRange);
  return Math.max(0.05, 0.7 - penalty * 0.65);
}

export function deriveInteractions(
  microbeIds: number[]
): CommunityInteraction[] {
  const idSet = new Set(microbeIds);
  const interactions: CommunityInteraction[] = [];
  const seen = new Set<string>();

  for (const rel of ecologicalRelations) {
    if (idSet.has(rel.sourceId) && idSet.has(rel.targetId)) {
      const key = `${Math.min(rel.sourceId, rel.targetId)}-${Math.max(rel.sourceId, rel.targetId)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      interactions.push({
        sourceId: rel.sourceId,
        targetId: rel.targetId,
        type: getInteractionType(rel.type),
        strength: rel.strength,
        description: rel.description,
      });
    }
  }

  for (let i = 0; i < microbeIds.length; i++) {
    for (let j = i + 1; j < microbeIds.length; j++) {
      const a = microbeIds[i];
      const b = microbeIds[j];
      const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const profileA = microbeMetabolismProfiles.find((p) => p.microbeId === a);
      const profileB = microbeMetabolismProfiles.find((p) => p.microbeId === b);
      if (!profileA || !profileB) continue;

      const cyclesA = new Set(profileA.pathways.map((p) => p.cycle));
      const cyclesB = new Set(profileB.pathways.map((p) => p.cycle));
      const sharedCycles = [...cyclesA].filter((c) => cyclesB.has(c));

      const typesA = new Set(profileA.pathways.map((p) => p.metabolismType));
      const typesB = new Set(profileB.pathways.map((p) => p.metabolismType));
      const sharedTypes = [...typesA].filter((t) => typesB.has(t));

      if (sharedCycles.length >= 2 && sharedTypes.length <= 1) {
        interactions.push({
          sourceId: a,
          targetId: b,
          type: 'cooperation',
          strength: 0.3 + sharedCycles.length * 0.1,
          description: `两种微生物在${sharedCycles.join('、')}循环中存在互补代谢关系`,
        });
      } else if (sharedTypes.length >= 2) {
        interactions.push({
          sourceId: a,
          targetId: b,
          type: 'competition',
          strength: 0.2 + sharedTypes.length * 0.1,
          description: `两种微生物在代谢类型上存在重叠，可能竞争相似资源`,
        });
      } else {
        interactions.push({
          sourceId: a,
          targetId: b,
          type: 'neutral',
          strength: 0.1,
          description: '两种微生物间无明显强交互关系',
        });
      }
    }
  }

  return interactions;
}

export function simulateCommunity(
  microbes: CommunityMicrobe[],
  temperature: number,
  ph: number,
  nutrients: number,
  duration: number
): StabilityReport {
  if (microbes.length === 0) {
    return {
      overallScore: 0,
      diversityIndex: 0,
      cooperationRatio: 0,
      competitionRatio: 0,
      dominantSpecies: null,
      equilibriumReached: false,
      equilibriumHour: null,
      riskFactors: ['群落为空'],
      strengths: [],
      timeline: [],
    };
  }

  const microbeIds = microbes.map((m) => m.microbeId);
  const interactions = deriveInteractions(microbeIds);
  const interactionsMap = new Map<string, CommunityInteraction>();
  for (const inter of interactions) {
    interactionsMap.set(`${inter.sourceId}-${inter.targetId}`, inter);
    interactionsMap.set(`${inter.targetId}-${inter.sourceId}`, {
      ...inter,
      sourceId: inter.targetId,
      targetId: inter.sourceId,
      type: inter.type === 'parasitism' ? 'parasitism' : inter.type,
    });
  }

  const populations = new Map<number, number>();
  for (const m of microbes) {
    populations.set(m.microbeId, m.initialPopulation);
  }

  const carryingCapacity = 1000000 * (nutrients / 100) * (1 + microbes.length * 0.05);

  const timeline: CommunityTimePoint[] = [];
  const step = duration <= 48 ? 2 : duration <= 96 ? 4 : 8;

  let equilibriumHour: number | null = null;
  let equilibriumCheckCount = 0;

  for (let hour = 0; hour <= duration; hour += step) {
    const currentPopulations: Record<number, number> = {};
    for (const [id, pop] of populations) {
      currentPopulations[id] = Math.round(pop);
    }

    const currentInteractions: CommunityInteraction[] = [];
    for (const inter of interactions) {
      const srcPop = populations.get(inter.sourceId) ?? 0;
      const tgtPop = populations.get(inter.targetId) ?? 0;
      if (srcPop > 10 && tgtPop > 10) {
        currentInteractions.push({
          ...inter,
          strength: inter.strength * Math.min(1, Math.min(srcPop, tgtPop) / 500),
        });
      }
    }

    timeline.push({
      hour,
      populations: currentPopulations,
      interactions: currentInteractions,
    });

    if (hour < duration) {
      const newPopulations = new Map<number, number>();

      for (const m of microbes) {
        const currentPop = populations.get(m.microbeId) ?? 0;
        if (currentPop <= 0) {
          newPopulations.set(m.microbeId, 0);
          continue;
        }

        const baseRate = MICROBE_GROWTH_RATES[m.microbeId] ?? 0.3;
        const tempFit = fitnessScore(temperature, MICROBE_TEMP_OPT[m.microbeId] ?? [25, 40]);
        const phFit = fitnessScore(ph, MICROBE_PH_OPT[m.microbeId] ?? [6, 8]);

        let interactionModifier = 0;
        for (const other of microbes) {
          if (other.microbeId === m.microbeId) continue;
          const inter = interactionsMap.get(`${other.microbeId}-${m.microbeId}`);
          if (!inter) continue;
          const otherPop = populations.get(other.microbeId) ?? 0;
          const popFactor = Math.min(1, otherPop / 1000);

          if (inter.type === 'cooperation') {
            interactionModifier += inter.strength * 0.15 * popFactor;
          } else if (inter.type === 'competition') {
            interactionModifier -= inter.strength * 0.12 * popFactor;
          } else if (inter.type === 'parasitism') {
            const isVictim = inter.targetId === m.microbeId;
            if (isVictim) {
              interactionModifier -= inter.strength * 0.2 * popFactor;
            } else {
              interactionModifier += inter.strength * 0.1 * popFactor;
            }
          }
        }

        const effectiveRate = baseRate * tempFit * phFit * (1 + interactionModifier) * (nutrients / 100);
        const logisticGrowth =
          carryingCapacity /
          (1 +
            (carryingCapacity / Math.max(1, currentPop) - 1) *
              Math.exp(-Math.max(0.01, effectiveRate) * (step / 5)));

        const stochastic = 0.92 + Math.random() * 0.16;
        const newPop = Math.max(0, Math.round(logisticGrowth * stochastic));
        newPopulations.set(m.microbeId, newPop);
      }

      if (equilibriumHour === null && hour > duration * 0.3) {
        let totalChange = 0;
        let totalPop = 0;
        for (const m of microbes) {
          const oldP = populations.get(m.microbeId) ?? 0;
          const newP = newPopulations.get(m.microbeId) ?? 0;
          totalChange += Math.abs(newP - oldP);
          totalPop += oldP;
        }
        if (totalPop > 0 && totalChange / totalPop < 0.02) {
          equilibriumCheckCount++;
          if (equilibriumCheckCount >= 3) {
            equilibriumHour = hour;
          }
        } else {
          equilibriumCheckCount = 0;
        }
      }

      for (const [id, pop] of newPopulations) {
        populations.set(id, pop);
      }
    }
  }

  const finalPops = new Map<number, number>();
  for (const m of microbes) {
    finalPops.set(m.microbeId, populations.get(m.microbeId) ?? 0);
  }

  const totalFinalPop = [...finalPops.values()].reduce((a, b) => a + b, 0);
  const survivingSpecies = [...finalPops.values()].filter((p) => p > 10).length;

  let diversityIndex = 0;
  if (totalFinalPop > 0) {
    for (const pop of finalPops.values()) {
      const proportion = pop / totalFinalPop;
      if (proportion > 0) diversityIndex -= proportion * Math.log2(proportion);
    }
  }
  const maxDiversity = Math.log2(Math.max(2, microbes.length));
  const normalizedDiversity = maxDiversity > 0 ? diversityIndex / maxDiversity : 0;

  const coopInteractions = interactions.filter((i) => i.type === 'cooperation');
  const compInteractions = interactions.filter((i) => i.type === 'competition');
  const totalInteractions = interactions.length;
  const cooperationRatio = totalInteractions > 0 ? coopInteractions.length / totalInteractions : 0;
  const competitionRatio = totalInteractions > 0 ? compInteractions.length / totalInteractions : 0;

  const avgCoopStrength = coopInteractions.length > 0
    ? coopInteractions.reduce((s, i) => s + i.strength, 0) / coopInteractions.length
    : 0;
  const avgCompStrength = compInteractions.length > 0
    ? compInteractions.reduce((s, i) => s + i.strength, 0) / compInteractions.length
    : 0;

  let dominantSpecies: number | null = null;
  let maxPop = 0;
  for (const [id, pop] of finalPops) {
    if (pop > maxPop) {
      maxPop = pop;
      dominantSpecies = id;
    }
  }
  if (maxPop < 10) dominantSpecies = null;

  const dominanceRatio = totalFinalPop > 0 && dominantSpecies !== null
    ? (finalPops.get(dominantSpecies) ?? 0) / totalFinalPop
    : 1;

  let overallScore = 0;
  overallScore += normalizedDiversity * 30;
  overallScore += cooperationRatio * 25;
  overallScore += avgCoopStrength * 15;
  overallScore -= competitionRatio * 10;
  overallScore -= avgCompStrength * 8;
  if (survivingSpecies === microbes.length) overallScore += 15;
  else if (survivingSpecies >= microbes.length * 0.7) overallScore += 8;
  if (equilibriumHour !== null) overallScore += 10;
  if (dominanceRatio > 0.8 && microbes.length > 2) overallScore -= 10;
  overallScore = Math.max(0, Math.min(100, overallScore));

  const riskFactors: string[] = [];
  const strengths: string[] = [];

  if (competitionRatio > 0.5) riskFactors.push('竞争关系占比过高，群落不稳定风险大');
  if (survivingSpecies < microbes.length) riskFactors.push(`${microbes.length - survivingSpecies}种微生物可能被淘汰`);
  if (dominanceRatio > 0.7 && microbes.length > 2) riskFactors.push('单一物种过度优势，多样性降低');
  if (equilibriumHour === null) riskFactors.push('群落未达到稳定均衡状态');
  if (avgCompStrength > 0.6) riskFactors.push('竞争强度较高，资源争夺激烈');
  if (coopInteractions.length === 0) riskFactors.push('缺乏协作关系，群落缺乏互利支撑');

  if (cooperationRatio > 0.5) strengths.push('协作关系占主导，群落具有良好互利基础');
  if (survivingSpecies === microbes.length) strengths.push('所有物种均存活，群落完整性良好');
  if (normalizedDiversity > 0.7) strengths.push('多样性指数高，群落具有较强的抗干扰能力');
  if (equilibriumHour !== null) strengths.push(`群落于第${equilibriumHour}小时达到均衡`);
  if (avgCoopStrength > 0.6) strengths.push('协作关系强度高，种间互利效果显著');
  if (microbes.length >= 4 && survivingSpecies >= 4) strengths.push('多物种群落稳定共存，生态系统健康');

  return {
    overallScore: Math.round(overallScore),
    diversityIndex: +normalizedDiversity.toFixed(3),
    cooperationRatio: +cooperationRatio.toFixed(3),
    competitionRatio: +competitionRatio.toFixed(3),
    dominantSpecies,
    equilibriumReached: equilibriumHour !== null,
    equilibriumHour,
    riskFactors,
    strengths,
    timeline,
  };
}

export function generateShareCode(config: {
  microbes: CommunityMicrobe[];
  temperature: number;
  humidity: number;
  ph: number;
  nutrients: number;
  duration: number;
}): string {
  const payload = {
    m: config.microbes.map((m) => [m.microbeId, m.initialPopulation]),
    t: config.temperature,
    h: config.humidity,
    p: config.ph,
    n: config.nutrients,
    d: config.duration,
  };
  try {
    return btoa(JSON.stringify(payload));
  } catch {
    return '';
  }
}

export function parseShareCode(code: string): {
  microbes: CommunityMicrobe[];
  temperature: number;
  humidity: number;
  ph: number;
  nutrients: number;
  duration: number;
} | null {
  try {
    const payload = JSON.parse(atob(code));
    return {
      microbes: payload.m.map(([id, pop]: [number, number]) => ({
        microbeId: id,
        initialPopulation: pop,
        role: '',
      })),
      temperature: payload.t,
      humidity: payload.h,
      ph: payload.p,
      nutrients: payload.n,
      duration: payload.d,
    };
  } catch {
    return null;
  }
}

export const COLLABORATION_COLORS = [
  '#00ffc8', '#9b59b6', '#f1c40f', '#e74c3c', '#3498db',
  '#1abc9c', '#e91e63', '#ff7b29', '#8e44ad', '#2ecc71',
];

export const INTERACTION_TYPE_LABELS: Record<CommunityInteraction['type'], string> = {
  cooperation: '协作',
  competition: '竞争',
  parasitism: '寄生',
  neutral: '中性',
};

export const INTERACTION_TYPE_COLORS: Record<CommunityInteraction['type'], string> = {
  cooperation: '#00ffc8',
  competition: '#f1c40f',
  parasitism: '#9b59b6',
  neutral: '#7f8c8d',
};
