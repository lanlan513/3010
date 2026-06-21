export type MicrobeCategory = 'bacteria' | 'fungi' | 'virus' | 'archaea';

export const CATEGORY_LABELS: Record<MicrobeCategory, string> = {
  bacteria: '细菌',
  fungi: '真菌',
  virus: '病毒',
  archaea: '古菌',
};

export const CATEGORY_COLORS: Record<MicrobeCategory, string> = {
  bacteria: '#00ffc8',
  fungi: '#9b59b6',
  virus: '#e74c3c',
  archaea: '#f1c40f',
};

export interface Microbe {
  id: number;
  name: string;
  scientificName: string;
  category: MicrobeCategory;
  habitat: string;
  description: string;
  imageUrl: string;
  discoveredYear: number;
  size: string;
  characteristics: string[];
}

export interface Stats {
  total: number;
  bacteria: number;
  fungi: number;
  virus: number;
  archaea: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface GrowthDataPoint {
  hour: number;
  population: number;
}

export interface ExperimentConditions {
  microbeId: number;
  microbeName: string;
  temperature: number;
  humidity: number;
  ph: number;
  nutrients: number;
  duration: number;
}

export interface ExperimentRecord {
  id: string;
  name: string;
  createdAt: number;
  conditions: ExperimentConditions;
  growthData: GrowthDataPoint[];
  peakPopulation: number;
  peakHour: number;
  finalPopulation: number;
  growthRate: number;
  notes?: string;
}

export interface MicrobeOptimalConditions {
  temperatureRange: [number, number];
  humidityRange: [number, number];
  phRange: [number, number];
  baseGrowthRate: number;
}

export const DEFAULT_CONDITIONS: ExperimentConditions = {
  microbeId: 1,
  microbeName: '大肠杆菌',
  temperature: 37,
  humidity: 70,
  ph: 7.0,
  nutrients: 50,
  duration: 48,
};

export const EXPERIMENT_COLORS = [
  '#00ffc8',
  '#9b59b6',
  '#ff7b29',
  '#f1c40f',
  '#e74c3c',
  '#3498db',
  '#1abc9c',
  '#e91e63',
];
