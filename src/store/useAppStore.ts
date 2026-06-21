import { create } from 'zustand';
import type {
  Microbe,
  MicrobeCategory,
  Stats,
  ExperimentConditions,
  ExperimentRecord,
  GrowthDataPoint,
  MicrobeOptimalConditions,
} from '../../shared/types';
import { api } from '../utils/api';

const MICROBE_OPTIMAL: Record<number, MicrobeOptimalConditions> = {
  1: { temperatureRange: [35, 40], humidityRange: [60, 80], phRange: [6.5, 7.5], baseGrowthRate: 0.5 },
  2: { temperatureRange: [30, 39], humidityRange: [50, 70], phRange: [6.0, 7.5], baseGrowthRate: 0.4 },
  3: { temperatureRange: [25, 37], humidityRange: [40, 70], phRange: [6.0, 8.0], baseGrowthRate: 0.45 },
  4: { temperatureRange: [35, 42], humidityRange: [60, 90], phRange: [6.5, 8.0], baseGrowthRate: 0.55 },
  5: { temperatureRange: [35, 40], humidityRange: [70, 90], phRange: [5.0, 6.5], baseGrowthRate: 0.5 },
  6: { temperatureRange: [35, 38], humidityRange: [70, 90], phRange: [6.5, 7.5], baseGrowthRate: 0.25 },
  7: { temperatureRange: [30, 37], humidityRange: [70, 95], phRange: [7.0, 8.5], baseGrowthRate: 0.6 },
  8: { temperatureRange: [36, 40], humidityRange: [80, 95], phRange: [6.0, 7.0], baseGrowthRate: 0.4 },
  9: { temperatureRange: [25, 32], humidityRange: [70, 90], phRange: [4.5, 6.5], baseGrowthRate: 0.35 },
  10: { temperatureRange: [25, 37], humidityRange: [80, 95], phRange: [4.0, 7.0], baseGrowthRate: 0.4 },
  11: { temperatureRange: [22, 30], humidityRange: [70, 90], phRange: [5.0, 7.0], baseGrowthRate: 0.3 },
  12: { temperatureRange: [35, 39], humidityRange: [80, 95], phRange: [5.5, 7.5], baseGrowthRate: 0.35 },
  13: { temperatureRange: [18, 25], humidityRange: [80, 95], phRange: [6.0, 7.5], baseGrowthRate: 0.2 },
  14: { temperatureRange: [25, 30], humidityRange: [70, 90], phRange: [5.0, 6.5], baseGrowthRate: 0.15 },
  15: { temperatureRange: [35, 39], humidityRange: [70, 90], phRange: [6.5, 7.5], baseGrowthRate: 0.7 },
  16: { temperatureRange: [20, 30], humidityRange: [60, 80], phRange: [6.0, 8.0], baseGrowthRate: 0.6 },
  17: { temperatureRange: [33, 37], humidityRange: [70, 90], phRange: [6.5, 7.5], baseGrowthRate: 0.65 },
  18: { temperatureRange: [33, 37], humidityRange: [70, 90], phRange: [6.0, 8.0], baseGrowthRate: 0.7 },
  19: { temperatureRange: [35, 39], humidityRange: [80, 95], phRange: [6.5, 7.5], baseGrowthRate: 0.55 },
  20: { temperatureRange: [35, 39], humidityRange: [60, 80], phRange: [6.0, 8.0], baseGrowthRate: 0.6 },
  21: { temperatureRange: [75, 92], humidityRange: [80, 100], phRange: [6.0, 7.5], baseGrowthRate: 0.45 },
  22: { temperatureRange: [65, 85], humidityRange: [80, 100], phRange: [1.5, 3.5], baseGrowthRate: 0.4 },
  23: { temperatureRange: [35, 45], humidityRange: [50, 70], phRange: [6.0, 7.5], baseGrowthRate: 0.35 },
  24: { temperatureRange: [90, 105], humidityRange: [90, 100], phRange: [6.0, 8.0], baseGrowthRate: 0.5 },
};

const STORAGE_KEY = 'microbe_lab_experiments';

function loadExperiments(): ExperimentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveExperiments(experiments: ExperimentRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(experiments));
  } catch {
    console.error('Failed to save experiments');
  }
}

function calculateFitness(value: number, range: [number, number]): number {
  const [min, max] = range;
  const mid = (min + max) / 2;
  const halfRange = (max - min) / 2;
  const distance = Math.abs(value - mid);
  if (distance <= halfRange) {
    return 1 - (distance / halfRange) * 0.3;
  }
  const penalty = Math.min(1, (distance - halfRange) / halfRange);
  return Math.max(0.05, 0.7 - penalty * 0.65);
}

function simulateGrowth(conditions: ExperimentConditions): GrowthDataPoint[] {
  const optimal = MICROBE_OPTIMAL[conditions.microbeId] || MICROBE_OPTIMAL[1];
  const tempFitness = calculateFitness(conditions.temperature, optimal.temperatureRange);
  const humidityFitness = calculateFitness(conditions.humidity, optimal.humidityRange);
  const phFitness = calculateFitness(conditions.ph, optimal.phRange);
  const nutrientFactor = conditions.nutrients / 100;

  const effectiveGrowthRate =
    optimal.baseGrowthRate * tempFitness * humidityFitness * phFitness * nutrientFactor;

  const data: GrowthDataPoint[] = [];
  const step = conditions.duration <= 24 ? 1 : 2;
  const population = 100;
  const carryingCapacity = 1000000 * nutrientFactor;

  for (let hour = 0; hour <= conditions.duration; hour += step) {
    const t = hour;
    const logisticGrowth =
      carryingCapacity / (1 + (carryingCapacity / population - 1) * Math.exp(-effectiveGrowthRate * (t / 5)));

    const stochasticFactor = 0.9 + Math.random() * 0.2;
    const adjustedGrowth = Math.round(logisticGrowth * stochasticFactor);

    data.push({ hour, population: adjustedGrowth });
  }

  return data;
}

function analyzeGrowth(data: GrowthDataPoint[]): {
  peakPopulation: number;
  peakHour: number;
  finalPopulation: number;
  growthRate: number;
} {
  let peakPopulation = 0;
  let peakHour = 0;

  data.forEach((d) => {
    if (d.population > peakPopulation) {
      peakPopulation = d.population;
      peakHour = d.hour;
    }
  });

  const finalPopulation = data[data.length - 1]?.population ?? 0;
  const initialPopulation = data[0]?.population ?? 1;
  const duration = data[data.length - 1]?.hour ?? 1;
  const growthRate =
    duration > 0 ? Math.log(finalPopulation / initialPopulation) / duration : 0;

  return { peakPopulation, peakHour, finalPopulation, growthRate };
}

interface AppState {
  microbes: Microbe[];
  microbe: Microbe | null;
  related: Microbe[];
  stats: Stats | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  activeCategory: MicrobeCategory | null;
  experiments: ExperimentRecord[];
  currentGrowthData: GrowthDataPoint[] | null;
  comparisonExperimentIds: string[];
  fetchMicrobes: (params?: { category?: MicrobeCategory; search?: string; habitat?: string; limit?: number; offset?: number }) => Promise<void>;
  fetchMicrobeById: (id: number) => Promise<void>;
  fetchRelated: (id: number) => Promise<void>;
  fetchStats: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: MicrobeCategory | null) => void;
  runSimulation: (conditions: ExperimentConditions) => void;
  saveExperiment: (name: string, conditions: ExperimentConditions, notes?: string) => ExperimentRecord | null;
  deleteExperiment: (id: string) => void;
  clearCurrentSimulation: () => void;
  toggleComparison: (id: string) => void;
  clearComparison: () => void;
  getOptimalConditions: (microbeId: number) => MicrobeOptimalConditions;
}

export const useAppStore = create<AppState>((set, get) => ({
  microbes: [],
  microbe: null,
  related: [],
  stats: null,
  loading: false,
  error: null,
  searchQuery: '',
  activeCategory: null,
  experiments: loadExperiments(),
  currentGrowthData: null,
  comparisonExperimentIds: [],

  fetchMicrobes: async (params) => {
    set({ loading: true, error: null });
    try {
      const data = await api.getMicrobes(params);
      set({ microbes: data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchMicrobeById: async (id) => {
    set({ loading: true, error: null, microbe: null });
    try {
      const data = await api.getMicrobeById(id);
      set({ microbe: data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchRelated: async (id) => {
    try {
      const data = await api.getRelated(id);
      set({ related: data });
    } catch (err) {
      console.error(err);
    }
  },

  fetchStats: async () => {
    try {
      const data = await api.getStats();
      set({ stats: data });
    } catch (err) {
      console.error(err);
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  setActiveCategory: (category) => set({ activeCategory: category }),

  runSimulation: (conditions) => {
    const data = simulateGrowth(conditions);
    set({ currentGrowthData: data });
  },

  saveExperiment: (name, conditions, notes) => {
    const data = get().currentGrowthData;
    if (!data || data.length === 0) return null;
    const analysis = analyzeGrowth(data);
    const record: ExperimentRecord = {
      id: `exp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      createdAt: Date.now(),
      conditions,
      growthData: data,
      ...analysis,
      notes,
    };
    const experiments = [record, ...get().experiments];
    saveExperiments(experiments);
    set({ experiments });
    return record;
  },

  deleteExperiment: (id) => {
    const experiments = get().experiments.filter((e) => e.id !== id);
    const comparisonExperimentIds = get().comparisonExperimentIds.filter((eid) => eid !== id);
    saveExperiments(experiments);
    set({ experiments, comparisonExperimentIds });
  },

  clearCurrentSimulation: () => set({ currentGrowthData: null }),

  toggleComparison: (id) => {
    const ids = get().comparisonExperimentIds;
    const newIds = ids.includes(id) ? ids.filter((eid) => eid !== id) : [...ids, id];
    set({ comparisonExperimentIds: newIds });
  },

  clearComparison: () => set({ comparisonExperimentIds: [] }),

  getOptimalConditions: (microbeId) => {
    return MICROBE_OPTIMAL[microbeId] || MICROBE_OPTIMAL[1];
  },
}));
