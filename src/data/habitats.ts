export interface HabitatZone {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  keywords: string[];
  color: string;
  colorLight: string;
  icon: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export const HABITAT_ZONES: HabitatZone[] = [
  {
    id: 'soil',
    name: '土壤',
    nameEn: 'Soil',
    description:
      '土壤是微生物最丰富的栖息地之一。每克土壤中含有数十亿个微生物，它们分解有机物、循环养分、维持土壤结构。从枯草芽孢杆菌的耐热孢子到黑曲霉的繁茂菌丝，土壤微生物构成了地球生态系统的基础。',
    keywords: ['土壤', '草原'],
    color: '#8B6914',
    colorLight: '#C4A44A',
    icon: '⛰',
    cx: 180,
    cy: 300,
    rx: 100,
    ry: 70,
  },
  {
    id: 'deep-sea',
    name: '深海热泉',
    nameEn: 'Deep Sea Vents',
    description:
      '深海热泉喷口是地球上最极端的生存环境之一，温度高达400°C、压力巨大、完全无光。然而，正是在这里，古菌依靠化能自养方式繁衍生息，构建了不依赖太阳能的独特生态系统。詹氏甲烷球菌和激烈火球菌是这里的代表性居民。',
    keywords: ['深海'],
    color: '#1a5276',
    colorLight: '#2e86c1',
    icon: '🌊',
    cx: 700,
    cy: 520,
    rx: 110,
    ry: 60,
  },
  {
    id: 'hot-spring',
    name: '温泉火山',
    nameEn: 'Hot Springs',
    description:
      '酸性热泉和火山热液环境，pH低至2-3，温度高达80°C以上。嗜酸热硫化叶菌在此氧化硫获取能量，其DNA复制和转录机制更接近真核生物，为生命的起源和演化提供了重要线索。',
    keywords: ['热泉', '火山'],
    color: '#c0392b',
    colorLight: '#e74c3c',
    icon: '🌋',
    cx: 500,
    cy: 180,
    rx: 100,
    ry: 65,
  },
  {
    id: 'human-gut',
    name: '人体肠道',
    nameEn: 'Human Gut',
    description:
      '人体肠道是微生物的庞大生态帝国，寄居着约100万亿个微生物细胞，数量超过人体自身细胞的总和。大肠杆菌、嗜酸乳杆菌和双歧杆菌等在这里形成复杂的共生关系，参与消化、合成维生素、训练免疫系统。',
    keywords: ['肠道'],
    color: '#00b894',
    colorLight: '#00ffc8',
    icon: '🦠',
    cx: 500,
    cy: 380,
    rx: 95,
    ry: 70,
  },
  {
    id: 'human-body',
    name: '人体体表与呼吸道',
    nameEn: 'Human Body Surface',
    description:
      '人体皮肤、呼吸道和黏膜表面定植着数以万亿计的微生物。金黄色葡萄球菌栖息于皮肤和鼻腔，流感病毒和新冠病毒侵袭呼吸道，白色念珠菌在口腔和黏膜表面等待机会。它们与宿主之间进行着永不停歇的攻防博弈。',
    keywords: ['皮肤', '呼吸道', '免疫', '肺部', '口腔'],
    color: '#e84393',
    colorLight: '#fd79a8',
    icon: '🫁',
    cx: 320,
    cy: 480,
    rx: 105,
    ry: 60,
  },
  {
    id: 'salt-lake',
    name: '高盐湖泊',
    nameEn: 'Salt Lakes',
    description:
      '盐湖和晒盐场中盐浓度接近饱和，绝大多数生命无法存活。然而盐生盐杆菌却在此繁盛，其细胞膜含有独特的细菌视紫红质，能利用光能驱动质子泵合成ATP——这是地球上唯一不依赖叶绿素的光合作用系统。',
    keywords: ['高盐', '盐湖'],
    color: '#6c5ce7',
    colorLight: '#a29bfe',
    icon: '🧂',
    cx: 820,
    cy: 300,
    rx: 95,
    ry: 60,
  },
  {
    id: 'aquatic',
    name: '海洋与水体',
    nameEn: 'Ocean & Water',
    description:
      '海洋、淡水和咸淡水交汇处孕育着丰富的微生物群落。霍乱弧菌在咸淡水中繁殖，通过水源传播疾病；铜绿假单胞菌在水体和土壤中广泛分布，是自然界重要的分解者和条件致病菌。',
    keywords: ['海水', '水体', '咸淡水', '环境水体'],
    color: '#0984e3',
    colorLight: '#74b9ff',
    icon: '💧',
    cx: 120,
    cy: 180,
    rx: 90,
    ry: 60,
  },
  {
    id: 'forest',
    name: '腐木与发酵',
    nameEn: 'Forest & Fermentation',
    description:
      '枯木和发酵环境中活跃着真菌的身影。灵芝在阔叶树枯木上生长，被奉为百草之王；酿酒酵母在水果表面和发酵食品中繁衍，与人类文明交织数千年；黑曲霉在腐败食物上繁殖，却也是工业柠檬酸生产的主力。',
    keywords: ['枯木', '树桩', '水果', '发酵', '腐败'],
    color: '#d35400',
    colorLight: '#e67e22',
    icon: '🍄',
    cx: 700,
    cy: 160,
    rx: 95,
    ry: 60,
  },
];
