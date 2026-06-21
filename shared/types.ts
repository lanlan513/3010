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

export interface CommunityMicrobe {
  microbeId: number;
  initialPopulation: number;
  role: string;
}

export interface CommunityInteraction {
  sourceId: number;
  targetId: number;
  type: 'cooperation' | 'competition' | 'parasitism' | 'neutral';
  strength: number;
  description: string;
}

export interface CommunityTimePoint {
  hour: number;
  populations: Record<number, number>;
  interactions: CommunityInteraction[];
}

export interface StabilityReport {
  overallScore: number;
  diversityIndex: number;
  cooperationRatio: number;
  competitionRatio: number;
  dominantSpecies: number | null;
  equilibriumReached: boolean;
  equilibriumHour: number | null;
  riskFactors: string[];
  strengths: string[];
  timeline: CommunityTimePoint[];
}

export interface CollaborationExperimentConfig {
  id: string;
  name: string;
  createdAt: number;
  microbes: CommunityMicrobe[];
  temperature: number;
  humidity: number;
  ph: number;
  nutrients: number;
  duration: number;
  finalPopulations?: Record<number, number>;
}

export interface CollaborationExperimentRecord {
  id: string;
  name: string;
  createdAt: number;
  config: CollaborationExperimentConfig;
  stabilityReport: StabilityReport;
  shareCode?: string;
}

export type AbilityDimension =
  | 'metabolism'
  | 'environment'
  | 'biotechnology'
  | 'ecology'
  | 'pathogenicity'
  | 'medicine';

export const ABILITY_DIMENSION_LABELS: Record<AbilityDimension, string> = {
  metabolism: '代谢能力',
  environment: '环境适应',
  biotechnology: '生物技术',
  ecology: '生态功能',
  pathogenicity: '致病特性',
  medicine: '医学应用',
};

export const ABILITY_DIMENSION_DESCRIPTIONS: Record<AbilityDimension, string> = {
  metabolism: '能量获取、物质转化、合成代谢等核心生化能力',
  environment: '温度、pH、盐度、压力等极端环境耐受能力',
  biotechnology: '工业生产、酶学应用、合成生物学底盘等价值',
  ecology: '碳氮硫循环、共生关系、环境修复等生态功能',
  pathogenicity: '感染机制、毒力因子、耐药性等致病相关特性',
  medicine: '抗菌活性、免疫调节、药物载体等医药用途',
};

export const ABILITY_DIMENSION_COLORS: Record<AbilityDimension, string> = {
  metabolism: '#00ffc8',
  environment: '#f1c40f',
  biotechnology: '#3498db',
  ecology: '#2ecc71',
  pathogenicity: '#e74c3c',
  medicine: '#9b59b6',
};

export type AbilityTag =
  | 'nitrogen_fixation'
  | 'fermentation'
  | 'aerobic_respiration'
  | 'anaerobic_respiration'
  | 'photosynthesis'
  | 'chemosynthesis'
  | 'nitrification'
  | 'denitrification'
  | 'sulfate_reduction'
  | 'sulfur_oxidation'
  | 'methanogenesis'
  | 'methanotrophy'
  | 'cellulose_degradation'
  | 'lignin_degradation'
  | 'thermophilic'
  | 'psychrophilic'
  | 'acidophilic'
  | 'alkaliphilic'
  | 'halophilic'
  | 'radiation_resistant'
  | 'desiccation_resistant'
  | 'barophilic'
  | 'osmotic_tolerant'
  | 'biofilm_formation'
  | 'endospore_formation'
  | 'antibiotic_production'
  | 'enzyme_production'
  | 'organic_acid_production'
  | 'vitamin_synthesis'
  | 'polysaccharide_production'
  | 'bioremediation'
  | 'pollutant_degradation'
  | 'heavy_metal_resistance'
  | 'synthetic_biology_chassis'
  | 'recombinant_protein_host'
  | 'symbiont'
  | 'probiotic'
  | 'decomposer'
  | 'carbon_fixation'
  | 'pathogenic'
  | 'opportunistic_pathogen'
  | 'toxin_production'
  | 'biofilm_virulence'
  | 'antibiotic_resistant'
  | 'intracellular_parasite'
  | 'antimicrobial_activity'
  | 'immunomodulatory'
  | 'antitumor'
  | 'vaccine_vector'
  | 'phage_therapy';

export const ABILITY_TAG_LABELS: Record<AbilityTag, string> = {
  nitrogen_fixation: '固氮作用',
  fermentation: '发酵',
  aerobic_respiration: '有氧呼吸',
  anaerobic_respiration: '无氧呼吸',
  photosynthesis: '光合作用',
  chemosynthesis: '化能合成',
  nitrification: '硝化作用',
  denitrification: '反硝化作用',
  sulfate_reduction: '硫酸盐还原',
  sulfur_oxidation: '硫氧化',
  methanogenesis: '产甲烷',
  methanotrophy: '甲烷氧化',
  cellulose_degradation: '纤维素降解',
  lignin_degradation: '木质素降解',
  thermophilic: '嗜热',
  psychrophilic: '嗜冷',
  acidophilic: '嗜酸',
  alkaliphilic: '嗜碱',
  halophilic: '嗜盐',
  radiation_resistant: '耐辐射',
  desiccation_resistant: '耐干燥',
  barophilic: '嗜压',
  osmotic_tolerant: '耐渗透压',
  biofilm_formation: '生物膜形成',
  endospore_formation: '产内生孢子',
  antibiotic_production: '产抗生素',
  enzyme_production: '产酶',
  organic_acid_production: '产有机酸',
  vitamin_synthesis: '合成维生素',
  polysaccharide_production: '产多糖',
  bioremediation: '生物修复',
  pollutant_degradation: '降解污染物',
  heavy_metal_resistance: '抗重金属',
  synthetic_biology_chassis: '合成生物学底盘',
  recombinant_protein_host: '重组蛋白表达宿主',
  symbiont: '共生',
  probiotic: '益生菌',
  decomposer: '分解者',
  carbon_fixation: '碳固定',
  pathogenic: '致病菌',
  opportunistic_pathogen: '条件致病菌',
  toxin_production: '产毒素',
  biofilm_virulence: '生物膜毒力',
  antibiotic_resistant: '耐药性',
  intracellular_parasite: '胞内寄生',
  antimicrobial_activity: '抗菌活性',
  immunomodulatory: '免疫调节',
  antitumor: '抗肿瘤',
  vaccine_vector: '疫苗载体',
  phage_therapy: '噬菌体疗法',
};

export interface AbilityTagInfo {
  tag: AbilityTag;
  dimension: AbilityDimension;
  description: string;
  scientificBackground: string;
}

export interface MicrobeAbilityProfile {
  microbeId: number;
  microbeName: string;
  abilities: {
    tag: AbilityTag;
    strength: number;
    evidence: string;
  }[];
}

export interface AbilityAssociation {
  tag1: AbilityTag;
  tag2: AbilityTag;
  cooccurrenceCount: number;
  correlationScore: number;
  description: string;
}

export interface AbilityRankItem {
  tag: AbilityTag;
  microbeCount: number;
  totalStrength: number;
  avgStrength: number;
  dimension: AbilityDimension;
}
