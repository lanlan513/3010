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

export type EcologicalRelationType = 'symbiosis' | 'competition' | 'parasitism' | 'predation';

export const RELATION_TYPE_LABELS: Record<EcologicalRelationType, string> = {
  symbiosis: '共生',
  competition: '竞争',
  parasitism: '寄生',
  predation: '捕食',
};

export const RELATION_TYPE_COLORS: Record<EcologicalRelationType, string> = {
  symbiosis: '#00ffc8',
  competition: '#f1c40f',
  parasitism: '#9b59b6',
  predation: '#e74c3c',
};

export const RELATION_TYPE_DESCRIPTIONS: Record<EcologicalRelationType, string> = {
  symbiosis: '两种微生物相互受益，共同生活的关系',
  competition: '争夺相同资源（营养、空间等）的竞争关系',
  parasitism: '一种微生物寄生于另一种并从中获取营养',
  predation: '一种微生物捕食并吞噬另一种微生物',
};

export interface EcologicalRelation {
  id: string;
  sourceId: number;
  targetId: number;
  type: EcologicalRelationType;
  strength: number;
  description: string;
}

export interface NetworkNode {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  microbe: Microbe;
}

export interface NetworkEdge {
  id: string;
  source: number;
  target: number;
  type: EcologicalRelationType;
  strength: number;
  description: string;
}

export interface PathStep {
  fromId: number;
  toId: number;
  relationType: EcologicalRelationType;
  description: string;
}

export interface RelationPath {
  steps: PathStep[];
  totalStrength: number;
}

export interface Scientist {
  id: string;
  name: string;
  nationality: string;
  birthYear: number;
  deathYear?: number;
  portraitUrl?: string;
  biography: string;
  achievements: string[];
}

export interface DiscoveryEvent {
  id: string;
  year: number;
  yearEnd?: number;
  title: string;
  summary: string;
  description: string;
  category: 'discovery' | 'theory' | 'technology' | 'medical' | 'genomics';
  scientists: string[];
  relatedMicrobes: number[];
  keyFindings: string[];
  impact: string;
  imageUrl?: string;
  era: 'ancient' | 'renaissance' | 'modern' | 'contemporary';
}

export const DISCOVERY_CATEGORY_LABELS: Record<DiscoveryEvent['category'], string> = {
  discovery: '重大发现',
  theory: '理论建立',
  technology: '技术突破',
  medical: '医学应用',
  genomics: '基因组学',
};

export const DISCOVERY_CATEGORY_COLORS: Record<DiscoveryEvent['category'], string> = {
  discovery: '#00ffc8',
  theory: '#9b59b6',
  technology: '#f1c40f',
  medical: '#e74c3c',
  genomics: '#3498db',
};

export const ERA_LABELS: Record<DiscoveryEvent['era'], string> = {
  ancient: '古代',
  renaissance: '启蒙时代',
  modern: '近代',
  contemporary: '当代',
};

export type BiogeochemicalCycle = 'carbon' | 'nitrogen' | 'sulfur';

export const CYCLE_LABELS: Record<BiogeochemicalCycle, string> = {
  carbon: '碳循环',
  nitrogen: '氮循环',
  sulfur: '硫循环',
};

export const CYCLE_COLORS: Record<BiogeochemicalCycle, string> = {
  carbon: '#00ffc8',
  nitrogen: '#3498db',
  sulfur: '#f1c40f',
};

export type MetabolismType = 'aerobic_respiration' | 'anaerobic_respiration' | 'fermentation' | 'photosynthesis' | 'chemosynthesis' | 'nitrogen_fixation' | 'nitrification' | 'denitrification' | 'sulfate_reduction' | 'sulfur_oxidation' | 'methanogenesis' | 'methanotrophy';

export const METABOLISM_TYPE_LABELS: Record<MetabolismType, string> = {
  aerobic_respiration: '有氧呼吸',
  anaerobic_respiration: '无氧呼吸',
  fermentation: '发酵',
  photosynthesis: '光合作用',
  chemosynthesis: '化能合成',
  nitrogen_fixation: '固氮作用',
  nitrification: '硝化作用',
  denitrification: '反硝化作用',
  sulfate_reduction: '硫酸盐还原',
  sulfur_oxidation: '硫氧化',
  methanogenesis: '产甲烷作用',
  methanotrophy: '甲烷氧化',
};

export interface MetabolicPathwayStep {
  id: string;
  label: string;
  description: string;
  reactants: string[];
  products: string[];
  energyOutput: string;
  microbeIds: number[];
  metabolismType: MetabolismType;
}

export interface CycleFlowEdge {
  from: string;
  to: string;
  label: string;
  microbeIds: number[];
  metabolismType: MetabolismType;
}

export interface BiogeochemicalCycleData {
  cycle: BiogeochemicalCycle;
  title: string;
  subtitle: string;
  description: string;
  steps: MetabolicPathwayStep[];
  edges: CycleFlowEdge[];
}

export interface MicrobeMetabolismProfile {
  microbeId: number;
  microbeName: string;
  pathways: {
    cycle: BiogeochemicalCycle;
    stepId: string;
    role: string;
    metabolismType: MetabolismType;
    efficiency: number;
  }[];
}
