import type {
  BiogeochemicalCycle,
  MetabolismType,
  MicrobeMetabolismProfile,
  BiogeochemicalCycleData,
  MetabolicPathwayStep,
  CycleFlowEdge,
} from '../../shared/types';

export const microbeMetabolismProfiles: MicrobeMetabolismProfile[] = [
  {
    microbeId: 1,
    microbeName: '大肠杆菌',
    pathways: [
      { cycle: 'carbon', stepId: 'c_glycolysis', role: '糖酵解主力', metabolismType: 'fermentation', efficiency: 0.75 },
      { cycle: 'carbon', stepId: 'c_tca', role: 'TCA循环参与者', metabolismType: 'aerobic_respiration', efficiency: 0.8 },
      { cycle: 'nitrogen', stepId: 'n_ammonification', role: '有机氮氨化', metabolismType: 'anaerobic_respiration', efficiency: 0.5 },
    ],
  },
  {
    microbeId: 2,
    microbeName: '金黄色葡萄球菌',
    pathways: [
      { cycle: 'carbon', stepId: 'c_glycolysis', role: '糖发酵', metabolismType: 'fermentation', efficiency: 0.65 },
      { cycle: 'carbon', stepId: 'c_tca', role: '有氧呼吸', metabolismType: 'aerobic_respiration', efficiency: 0.7 },
    ],
  },
  {
    microbeId: 3,
    microbeName: '枯草芽孢杆菌',
    pathways: [
      { cycle: 'carbon', stepId: 'c_glycolysis', role: '高效糖酵解', metabolismType: 'fermentation', efficiency: 0.8 },
      { cycle: 'carbon', stepId: 'c_tca', role: '强有氧呼吸', metabolismType: 'aerobic_respiration', efficiency: 0.85 },
      { cycle: 'sulfur', stepId: 's_mineralization', role: '有机硫矿化', metabolismType: 'chemosynthesis', efficiency: 0.5 },
    ],
  },
  {
    microbeId: 4,
    microbeName: '铜绿假单胞菌',
    pathways: [
      { cycle: 'carbon', stepId: 'c_tca', role: '高效有氧呼吸', metabolismType: 'aerobic_respiration', efficiency: 0.9 },
      { cycle: 'nitrogen', stepId: 'n_denitrification', role: '反硝化作用', metabolismType: 'denitrification', efficiency: 0.75 },
      { cycle: 'sulfur', stepId: 's_oxidation', role: '硫氧化', metabolismType: 'sulfur_oxidation', efficiency: 0.6 },
    ],
  },
  {
    microbeId: 5,
    microbeName: '嗜酸乳杆菌',
    pathways: [
      { cycle: 'carbon', stepId: 'c_glycolysis', role: '同型乳酸发酵', metabolismType: 'fermentation', efficiency: 0.85 },
      { cycle: 'carbon', stepId: 'c_tca', role: '有限TCA', metabolismType: 'anaerobic_respiration', efficiency: 0.4 },
    ],
  },
  {
    microbeId: 6,
    microbeName: '结核分枝杆菌',
    pathways: [
      { cycle: 'carbon', stepId: 'c_tca', role: '慢速有氧呼吸', metabolismType: 'aerobic_respiration', efficiency: 0.5 },
      { cycle: 'nitrogen', stepId: 'n_ammonification', role: '氨基酸分解', metabolismType: 'anaerobic_respiration', efficiency: 0.35 },
    ],
  },
  {
    microbeId: 7,
    microbeName: '霍乱弧菌',
    pathways: [
      { cycle: 'carbon', stepId: 'c_glycolysis', role: '糖酵解', metabolismType: 'fermentation', efficiency: 0.7 },
      { cycle: 'carbon', stepId: 'c_tca', role: '有氧呼吸', metabolismType: 'aerobic_respiration', efficiency: 0.75 },
      { cycle: 'nitrogen', stepId: 'n_ammonification', role: '几丁质分解', metabolismType: 'anaerobic_respiration', efficiency: 0.55 },
    ],
  },
  {
    microbeId: 8,
    microbeName: '双歧杆菌',
    pathways: [
      { cycle: 'carbon', stepId: 'c_glycolysis', role: '双歧途径发酵', metabolismType: 'fermentation', efficiency: 0.9 },
      { cycle: 'carbon', stepId: 'c_tca', role: '乙酸生成', metabolismType: 'anaerobic_respiration', efficiency: 0.45 },
    ],
  },
  {
    microbeId: 9,
    microbeName: '酿酒酵母',
    pathways: [
      { cycle: 'carbon', stepId: 'c_glycolysis', role: '酒精发酵', metabolismType: 'fermentation', efficiency: 0.9 },
      { cycle: 'carbon', stepId: 'c_tca', role: '有氧呼吸Crabtree效应', metabolismType: 'aerobic_respiration', efficiency: 0.85 },
    ],
  },
  {
    microbeId: 10,
    microbeName: '黑曲霉',
    pathways: [
      { cycle: 'carbon', stepId: 'c_glycolysis', role: '多糖降解', metabolismType: 'fermentation', efficiency: 0.8 },
      { cycle: 'carbon', stepId: 'c_tca', role: '柠檬酸生产', metabolismType: 'aerobic_respiration', efficiency: 0.95 },
      { cycle: 'nitrogen', stepId: 'n_ammonification', role: '蛋白酶分泌', metabolismType: 'anaerobic_respiration', efficiency: 0.55 },
      { cycle: 'sulfur', stepId: 's_mineralization', role: '有机硫分解', metabolismType: 'chemosynthesis', efficiency: 0.5 },
    ],
  },
  {
    microbeId: 11,
    microbeName: '产黄青霉',
    pathways: [
      { cycle: 'carbon', stepId: 'c_glycolysis', role: '纤维素降解', metabolismType: 'fermentation', efficiency: 0.65 },
      { cycle: 'carbon', stepId: 'c_tca', role: '三羧酸循环', metabolismType: 'aerobic_respiration', efficiency: 0.8 },
      { cycle: 'sulfur', stepId: 's_mineralization', role: '半胱氨酸代谢', metabolismType: 'chemosynthesis', efficiency: 0.45 },
    ],
  },
  {
    microbeId: 12,
    microbeName: '白色念珠菌',
    pathways: [
      { cycle: 'carbon', stepId: 'c_glycolysis', role: '酵母型发酵', metabolismType: 'fermentation', efficiency: 0.7 },
      { cycle: 'carbon', stepId: 'c_tca', role: '菌丝型呼吸', metabolismType: 'aerobic_respiration', efficiency: 0.75 },
    ],
  },
  {
    microbeId: 13,
    microbeName: '双孢蘑菇',
    pathways: [
      { cycle: 'carbon', stepId: 'c_glycolysis', role: '木质纤维素降解', metabolismType: 'fermentation', efficiency: 0.75 },
      { cycle: 'carbon', stepId: 'c_tca', role: '子实体呼吸', metabolismType: 'aerobic_respiration', efficiency: 0.8 },
      { cycle: 'nitrogen', stepId: 'n_ammonification', role: '蛋白质矿化', metabolismType: 'anaerobic_respiration', efficiency: 0.65 },
    ],
  },
  {
    microbeId: 14,
    microbeName: '灵芝',
    pathways: [
      { cycle: 'carbon', stepId: 'c_glycolysis', role: '木质素分解', metabolismType: 'fermentation', efficiency: 0.6 },
      { cycle: 'carbon', stepId: 'c_tca', role: '次生代谢合成', metabolismType: 'aerobic_respiration', efficiency: 0.75 },
      { cycle: 'sulfur', stepId: 's_mineralization', role: '活性硫代谢', metabolismType: 'chemosynthesis', efficiency: 0.55 },
    ],
  },
  {
    microbeId: 15,
    microbeName: 'T4噬菌体',
    pathways: [
      { cycle: 'carbon', stepId: 'c_host_lysis', role: '宿主碳源劫持', metabolismType: 'fermentation', efficiency: 0.99 },
    ],
  },
  {
    microbeId: 16,
    microbeName: '烟草花叶病毒',
    pathways: [
      { cycle: 'carbon', stepId: 'c_host_lysis', role: '植物蛋白合成劫持', metabolismType: 'fermentation', efficiency: 0.95 },
    ],
  },
  {
    microbeId: 17,
    microbeName: '流感病毒',
    pathways: [
      { cycle: 'carbon', stepId: 'c_host_lysis', role: '呼吸道细胞劫持', metabolismType: 'aerobic_respiration', efficiency: 0.9 },
    ],
  },
  {
    microbeId: 18,
    microbeName: '新冠病毒',
    pathways: [
      { cycle: 'carbon', stepId: 'c_host_lysis', role: 'ACE2细胞代谢重编程', metabolismType: 'aerobic_respiration', efficiency: 0.92 },
    ],
  },
  {
    microbeId: 19,
    microbeName: '人类免疫缺陷病毒',
    pathways: [
      { cycle: 'carbon', stepId: 'c_host_lysis', role: 'CD4+T细胞整合', metabolismType: 'aerobic_respiration', efficiency: 0.85 },
      { cycle: 'nitrogen', stepId: 'n_host_integration', role: '逆转录整合', metabolismType: 'anaerobic_respiration', efficiency: 0.8 },
    ],
  },
  {
    microbeId: 20,
    microbeName: '腺病毒',
    pathways: [
      { cycle: 'carbon', stepId: 'c_host_lysis', role: '细胞核复制', metabolismType: 'aerobic_respiration', efficiency: 0.88 },
    ],
  },
  {
    microbeId: 21,
    microbeName: '詹氏甲烷球菌',
    pathways: [
      { cycle: 'carbon', stepId: 'c_methanogenesis', role: 'CO2还原产甲烷', metabolismType: 'methanogenesis', efficiency: 0.85 },
      { cycle: 'nitrogen', stepId: 'n_fixation', role: '高温固氮', metabolismType: 'nitrogen_fixation', efficiency: 0.6 },
      { cycle: 'sulfur', stepId: 's_sulfate_reduction', role: '硫代谢辅助', metabolismType: 'sulfate_reduction', efficiency: 0.4 },
    ],
  },
  {
    microbeId: 22,
    microbeName: '嗜酸热硫化叶菌',
    pathways: [
      { cycle: 'carbon', stepId: 'c_calvin', role: '碳固定', metabolismType: 'chemosynthesis', efficiency: 0.7 },
      { cycle: 'sulfur', stepId: 's_oxidation', role: '硫氧化产能', metabolismType: 'sulfur_oxidation', efficiency: 0.95 },
      { cycle: 'nitrogen', stepId: 'n_nitrification', role: '氨氧化辅助', metabolismType: 'nitrification', efficiency: 0.35 },
    ],
  },
  {
    microbeId: 23,
    microbeName: '盐生盐杆菌',
    pathways: [
      { cycle: 'carbon', stepId: 'c_rhodopsin', role: '细菌视紫红质光合', metabolismType: 'photosynthesis', efficiency: 0.8 },
      { cycle: 'carbon', stepId: 'c_tca', role: '有氧呼吸', metabolismType: 'aerobic_respiration', efficiency: 0.7 },
      { cycle: 'nitrogen', stepId: 'n_ammonification', role: '氨基酸降解', metabolismType: 'anaerobic_respiration', efficiency: 0.5 },
    ],
  },
  {
    microbeId: 24,
    microbeName: '激烈火球菌',
    pathways: [
      { cycle: 'carbon', stepId: 'c_glycolysis', role: '高温糖酵解变体', metabolismType: 'fermentation', efficiency: 0.85 },
      { cycle: 'sulfur', stepId: 's_sulfate_reduction', role: '硫还原呼吸', metabolismType: 'sulfate_reduction', efficiency: 0.9 },
      { cycle: 'carbon', stepId: 'c_methanotrophy', role: 'C1化合物代谢', metabolismType: 'methanotrophy', efficiency: 0.4 },
    ],
  },
  {
    microbeId: 25,
    microbeName: '炭疽杆菌',
    pathways: [
      { cycle: 'carbon', stepId: 'c_glycolysis', role: '孢子萌发糖酵解', metabolismType: 'fermentation', efficiency: 0.7 },
      { cycle: 'carbon', stepId: 'c_tca', role: '毒力阶段有氧呼吸', metabolismType: 'aerobic_respiration', efficiency: 0.78 },
      { cycle: 'nitrogen', stepId: 'n_ammonification', role: '组织蛋白分解', metabolismType: 'anaerobic_respiration', efficiency: 0.6 },
    ],
  },
  {
    microbeId: 26,
    microbeName: '狂犬病毒',
    pathways: [
      { cycle: 'carbon', stepId: 'c_host_lysis', role: '神经元代谢劫持', metabolismType: 'aerobic_respiration', efficiency: 0.93 },
    ],
  },
  {
    microbeId: 27,
    microbeName: '蕈状支原体',
    pathways: [
      { cycle: 'carbon', stepId: 'c_glycolysis', role: '简化糖酵解', metabolismType: 'fermentation', efficiency: 0.65 },
      { cycle: 'carbon', stepId: 'c_tca', role: '极简能量代谢', metabolismType: 'anaerobic_respiration', efficiency: 0.45 },
    ],
  },
];

const carbonSteps: MetabolicPathwayStep[] = [
  {
    id: 'c_glycolysis',
    label: '糖酵解',
    description: '将葡萄糖分解为丙酮酸，产生少量ATP和NADH，是所有细胞能量代谢的起点。',
    reactants: ['葡萄糖', 'ADP', 'NAD+'],
    products: ['丙酮酸', 'ATP', 'NADH'],
    energyOutput: '2 ATP',
    microbeIds: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 24, 25, 27],
    metabolismType: 'fermentation',
  },
  {
    id: 'c_tca',
    label: '三羧酸循环 (TCA)',
    description: '氧化乙酰-CoA生成CO2，产生大量NADH/FADH2，是有氧呼吸的核心。',
    reactants: ['乙酰-CoA', 'NAD+', 'FAD'],
    products: ['CO2', 'NADH', 'FADH2', 'GTP'],
    energyOutput: '~10 ATP',
    microbeIds: [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 23, 25, 27],
    metabolismType: 'aerobic_respiration',
  },
  {
    id: 'c_calvin',
    label: '卡尔文循环',
    description: '化能自养生物固定CO2合成有机碳的核心途径。',
    reactants: ['CO2', 'ATP', 'NADPH'],
    products: ['葡萄糖', 'ADP', 'NADP+'],
    energyOutput: '-18 ATP',
    microbeIds: [22],
    metabolismType: 'chemosynthesis',
  },
  {
    id: 'c_methanogenesis',
    label: '产甲烷作用',
    description: '古菌特有途径，利用H2还原CO2生成甲烷，是厌氧环境碳循环的终端。',
    reactants: ['CO2', 'H2'],
    products: ['甲烷', 'H2O'],
    energyOutput: '1 ATP',
    microbeIds: [21],
    metabolismType: 'methanogenesis',
  },
  {
    id: 'c_rhodopsin',
    label: '细菌视紫红质光合',
    description: '不依赖叶绿素的独特光驱动质子泵，利用光能合成ATP。',
    reactants: ['光', 'ADP'],
    products: ['ATP'],
    energyOutput: '~3 ATP/光子',
    microbeIds: [23],
    metabolismType: 'photosynthesis',
  },
  {
    id: 'c_methanotrophy',
    label: '甲烷氧化',
    description: '利用甲烷作为碳源和能源，将甲烷氧化为CO2。',
    reactants: ['甲烷', 'O2'],
    products: ['CO2', 'H2O'],
    energyOutput: '~28 ATP',
    microbeIds: [24],
    metabolismType: 'methanotrophy',
  },
  {
    id: 'c_host_lysis',
    label: '宿主代谢劫持',
    description: '病毒利用宿主细胞的能量和合成系统完成自身复制。',
    reactants: ['宿主ATP', '宿主氨基酸'],
    products: ['病毒颗粒', '宿主裂解'],
    energyOutput: '依赖宿主',
    microbeIds: [15, 16, 17, 18, 19, 20, 26],
    metabolismType: 'aerobic_respiration',
  },
];

const carbonEdges: CycleFlowEdge[] = [
  { from: '大气CO2', to: 'c_calvin', label: '碳固定', microbeIds: [22], metabolismType: 'chemosynthesis' },
  { from: '大气CO2', to: 'c_methanogenesis', label: 'CO2还原', microbeIds: [21], metabolismType: 'methanogenesis' },
  { from: '有机碳', to: 'c_glycolysis', label: '糖酵解', microbeIds: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 24, 25, 27], metabolismType: 'fermentation' },
  { from: 'c_glycolysis', to: 'c_tca', label: '乙酰-CoA', microbeIds: [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 23, 25, 27], metabolismType: 'aerobic_respiration' },
  { from: 'c_tca', to: '大气CO2', label: '呼吸释放', microbeIds: [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 23, 25, 27], metabolismType: 'aerobic_respiration' },
  { from: 'c_methanogenesis', to: '大气甲烷', label: '产甲烷', microbeIds: [21], metabolismType: 'methanogenesis' },
  { from: '大气甲烷', to: 'c_methanotrophy', label: '甲烷氧化', microbeIds: [24], metabolismType: 'methanotrophy' },
  { from: '光', to: 'c_rhodopsin', label: '光驱动', microbeIds: [23], metabolismType: 'photosynthesis' },
];

const nitrogenSteps: MetabolicPathwayStep[] = [
  {
    id: 'n_fixation',
    label: '生物固氮',
    description: '将大气N2还原为氨，是氮循环最关键的限速步骤，仅原核生物具备此能力。',
    reactants: ['N2', 'ATP', '还原剂'],
    products: ['NH3', 'ADP'],
    energyOutput: '-16 ATP',
    microbeIds: [21],
    metabolismType: 'nitrogen_fixation',
  },
  {
    id: 'n_nitrification',
    label: '硝化作用',
    description: '将氨逐步氧化为亚硝酸盐和硝酸盐，产生化学能用于碳固定。',
    reactants: ['NH3', 'O2'],
    products: ['NO2-', 'NO3-'],
    energyOutput: '~3 ATP',
    microbeIds: [22],
    metabolismType: 'nitrification',
  },
  {
    id: 'n_denitrification',
    label: '反硝化作用',
    description: '厌氧条件下将硝酸盐还原为N2返回大气，完成氮循环闭环。',
    reactants: ['NO3-', '有机碳'],
    products: ['N2', 'CO2'],
    energyOutput: '~24 ATP',
    microbeIds: [4],
    metabolismType: 'denitrification',
  },
  {
    id: 'n_ammonification',
    label: '氨化作用',
    description: '分解有机氮化合物（蛋白质、核酸）释放氨，是氮的矿化过程。',
    reactants: ['蛋白质', '核酸'],
    products: ['NH3', '氨基酸'],
    energyOutput: '可变',
    microbeIds: [1, 3, 6, 7, 10, 13, 23, 25, 27],
    metabolismType: 'anaerobic_respiration',
  },
  {
    id: 'n_host_integration',
    label: '病毒整合',
    description: '病毒将自身基因组整合到宿主染色体中，利用宿主氮源合成核酸。',
    reactants: ['宿主核苷酸'],
    products: ['病毒DNA/RNA'],
    energyOutput: '依赖宿主',
    microbeIds: [19],
    metabolismType: 'anaerobic_respiration',
  },
];

const nitrogenEdges: CycleFlowEdge[] = [
  { from: '大气N2', to: 'n_fixation', label: '固氮', microbeIds: [21], metabolismType: 'nitrogen_fixation' },
  { from: 'n_fixation', to: '氨池', label: '产氨', microbeIds: [21], metabolismType: 'nitrogen_fixation' },
  { from: '有机氮', to: 'n_ammonification', label: '矿化', microbeIds: [1, 3, 6, 7, 10, 13, 23, 25, 27], metabolismType: 'anaerobic_respiration' },
  { from: 'n_ammonification', to: '氨池', label: '释放氨', microbeIds: [1, 3, 6, 7, 10, 13, 23, 25, 27], metabolismType: 'anaerobic_respiration' },
  { from: '氨池', to: 'n_nitrification', label: '硝化', microbeIds: [22], metabolismType: 'nitrification' },
  { from: 'n_nitrification', to: '硝酸盐池', label: '产硝酸盐', microbeIds: [22], metabolismType: 'nitrification' },
  { from: '硝酸盐池', to: 'n_denitrification', label: '厌氧呼吸', microbeIds: [4], metabolismType: 'denitrification' },
  { from: 'n_denitrification', to: '大气N2', label: '释放N2', microbeIds: [4], metabolismType: 'denitrification' },
];

const sulfurSteps: MetabolicPathwayStep[] = [
  {
    id: 's_oxidation',
    label: '硫氧化',
    description: '将还原态硫（H2S、S、S2O3^2-）氧化为硫酸盐，释放能量。',
    reactants: ['H2S/S', 'O2'],
    products: ['SO4^2-', 'H2O'],
    energyOutput: '~6 ATP',
    microbeIds: [4, 22],
    metabolismType: 'sulfur_oxidation',
  },
  {
    id: 's_sulfate_reduction',
    label: '硫酸盐还原',
    description: '厌氧条件下以硫酸盐为末端电子受体，产生H2S。',
    reactants: ['SO4^2-', '有机碳/H2'],
    products: ['H2S', 'CO2'],
    energyOutput: '~3 ATP',
    microbeIds: [21, 24],
    metabolismType: 'sulfate_reduction',
  },
  {
    id: 's_mineralization',
    label: '有机硫矿化',
    description: '分解含硫氨基酸（半胱氨酸、甲硫氨酸）释放H2S或硫酸盐。',
    reactants: ['含硫蛋白质'],
    products: ['H2S', 'SO4^2-'],
    energyOutput: '可变',
    microbeIds: [3, 10, 11, 14, 22],
    metabolismType: 'chemosynthesis',
  },
];

const sulfurEdges: CycleFlowEdge[] = [
  { from: '硫酸盐池', to: 's_sulfate_reduction', label: '厌氧还原', microbeIds: [21, 24], metabolismType: 'sulfate_reduction' },
  { from: 's_sulfate_reduction', to: '硫化物池', label: '产H2S', microbeIds: [21, 24], metabolismType: 'sulfate_reduction' },
  { from: '硫化物池', to: 's_oxidation', label: '硫氧化', microbeIds: [4, 22], metabolismType: 'sulfur_oxidation' },
  { from: 's_oxidation', to: '硫酸盐池', label: '产硫酸盐', microbeIds: [4, 22], metabolismType: 'sulfur_oxidation' },
  { from: '有机硫', to: 's_mineralization', label: '分解矿化', microbeIds: [3, 10, 11, 14, 22], metabolismType: 'chemosynthesis' },
  { from: 's_mineralization', to: '硫酸盐池', label: '释放', microbeIds: [3, 10, 11, 14, 22], metabolismType: 'chemosynthesis' },
];

export const biogeochemicalCyclesData: BiogeochemicalCycleData[] = [
  {
    cycle: 'carbon',
    title: '碳循环',
    subtitle: 'Carbon Cycle',
    description: '碳是生命的骨架元素。微生物驱动碳在有机态、无机态和大气之间循环，是全球碳平衡的核心调节者。',
    steps: carbonSteps,
    edges: carbonEdges,
  },
  {
    cycle: 'nitrogen',
    title: '氮循环',
    subtitle: 'Nitrogen Cycle',
    description: '氮是蛋白质和核酸的核心元素。微生物独有的固氮、硝化和反硝化作用构成了完整的氮循环网络。',
    steps: nitrogenSteps,
    edges: nitrogenEdges,
  },
  {
    cycle: 'sulfur',
    title: '硫循环',
    subtitle: 'Sulfur Cycle',
    description: '硫参与蛋白质结构和能量代谢。微生物介导硫的氧化还原转化，连接生命活动与地质化学循环。',
    steps: sulfurSteps,
    edges: sulfurEdges,
  },
];

export function getMicrobeCycles(microbeId: number): BiogeochemicalCycle[] {
  const profile = microbeMetabolismProfiles.find((p) => p.microbeId === microbeId);
  if (!profile) return [];
  const cycles = new Set<BiogeochemicalCycle>();
  for (const pathway of profile.pathways) {
    cycles.add(pathway.cycle);
  }
  return [...cycles];
}

export function getMicrobeMetabolismTypes(microbeId: number): MetabolismType[] {
  const profile = microbeMetabolismProfiles.find((p) => p.microbeId === microbeId);
  if (!profile) return [];
  return profile.pathways.map((p) => p.metabolismType);
}

export function getMicrobesForCycle(cycle: BiogeochemicalCycle): number[] {
  const ids: number[] = [];
  for (const profile of microbeMetabolismProfiles) {
    if (profile.pathways.some((p) => p.cycle === cycle)) {
      ids.push(profile.microbeId);
    }
  }
  return ids;
}

export function getMicrobesForMetabolismType(type: MetabolismType): number[] {
  const ids: number[] = [];
  for (const profile of microbeMetabolismProfiles) {
    if (profile.pathways.some((p) => p.metabolismType === type)) {
      ids.push(profile.microbeId);
    }
  }
  return ids;
}
