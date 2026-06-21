import type { IndustrialApplication, IndustrialCategory } from '../../shared/types';

export const industrialApplications: IndustrialApplication[] = [
  {
    id: 'beer-brewing',
    category: 'food_fermentation',
    title: '啤酒酿造工艺',
    subtitle: '千年发酵工艺的微生物智慧',
    summary: '利用酿酒酵母将麦芽中的糖分发酵转化为酒精和二氧化碳，赋予啤酒独特的风味与口感。',
    description:
      '啤酒酿造是人类最古老的食品发酵技术之一，其历史可追溯至公元前5000年的美索不达米亚文明。现代啤酒酿造工艺以大麦麦芽为主要原料，通过糊化、糖化将淀粉转化为可发酵糖，再利用酿酒酵母（Saccharomyces cerevisiae）进行酒精发酵。发酵过程中酵母不仅将糖转化为酒精和CO₂，还产生数百种风味物质，如酯类、高级醇、硫化物等，共同构成了啤酒的复杂风味体系。不同的酵母菌株、发酵温度和工艺条件决定了啤酒的风格类型，从清爽的皮尔森到浓郁的修道院啤酒，背后都是微生物代谢的精妙调控。',
    history:
      '公元前5000年左右，苏美尔人已开始酿造大麦啤酒。中世纪欧洲修道院发展了系统化的酿造技术。1857年巴斯德揭示了发酵的微生物本质，1883年汉森分离出纯培养酵母，开启了现代啤酒工业。',
    impact:
      '全球啤酒年产量超过1900亿升，市场规模超过6000亿美元。啤酒工业带动了农业、包装、物流等上下游产业链，同时酵母工业副产品（如酵母提取物、B族维生素）也具有重要经济价值。',
    advantages: [
      '利用微生物代谢实现常温常压下的生物转化',
      '酵母发酵产生的天然风味物质非化学合成可比拟',
      '发酵过程可抑制有害微生物生长，延长保质期',
      '工艺成熟稳定，适合大规模工业化生产',
    ],
    challenges: [
      '发酵风味控制精度要求高，批次间一致性挑战',
      '发酵副产物处理与资源利用效率',
      '冷温发酵能耗较高',
      '野生酵母污染风险控制',
    ],
    relatedMicrobes: [
      {
        microbeId: 9,
        role: '主力发酵菌',
        importance: 'primary',
        contribution: '将麦芽糖等糖类发酵为酒精和二氧化碳，产生酯类等风味物质',
      },
      {
        microbeId: 5,
        role: '酸啤发酵辅助',
        importance: 'secondary',
        contribution: '在酸啤工艺中产生乳酸，赋予啤酒独特的酸味',
      },
    ],
    processSteps: [
      {
        id: 'malt',
        order: 1,
        title: '麦芽制备',
        description: '大麦发芽产生淀粉酶，烘干后粉碎备用',
        duration: '5-7天',
        temperature: '15-20°C发芽',
      },
      {
        id: 'mashing',
        order: 2,
        title: '糖化',
        description: '麦芽粉与热水混合，淀粉酶将淀粉分解为麦芽糖等可发酵糖',
        duration: '1-2小时',
        temperature: '65-75°C',
        ph: '5.2-5.6',
      },
      {
        id: 'boiling',
        order: 3,
        title: '麦汁煮沸与酒花添加',
        description: '麦汁煮沸灭菌，添加酒花赋予苦味和香气',
        duration: '60-90分钟',
        temperature: '100°C',
      },
      {
        id: 'cooling',
        order: 4,
        title: '冷却与充氧',
        description: '麦汁快速冷却至发酵温度，充氧以利酵母繁殖',
        temperature: '10-20°C',
      },
      {
        id: 'fermentation',
        order: 5,
        title: '主发酵',
        description: '接种酵母进行酒精发酵，糖转化为酒精和CO₂',
        duration: '7-14天',
        temperature: '10-18°C（艾尔）/ 7-15°C（拉格）',
        keyMicrobeIds: [9],
      },
      {
        id: 'conditioning',
        order: 6,
        title: '后熟与陈酿',
        description: '低温成熟，风味物质进一步转化，口感更圆润',
        duration: '2-6周',
        temperature: '0-4°C',
      },
    ],
    products: ['淡色啤酒', '浓色啤酒', '黑啤酒', '小麦啤酒', '酸啤酒', '精酿啤酒'],
    scale: 'global',
    keyMetrics: [
      { label: '全球年产量', value: '1900亿升' },
      { label: '发酵转化率', value: '75-85%' },
      { label: '酒精含量', value: '3-12% ABV' },
      { label: '酵母用量', value: '0.5-1g/L' },
    ],
  },
  {
    id: 'yogurt-production',
    category: 'food_fermentation',
    title: '酸奶发酵生产',
    subtitle: '益生菌与人类健康的桥梁',
    summary: '通过乳酸菌发酵牛奶中的乳糖产生乳酸，使牛奶凝固并形成酸奶独特的风味与质地。',
    description:
      '酸奶是最具代表性的发酵乳制品，其生产主要利用保加利亚乳杆菌和嗜热链球菌的协同发酵作用。这两种乳酸菌在发酵过程中形成共生关系：嗜热链球菌首先生长，产生甲酸和CO₂刺激保加利亚乳杆菌生长，后者则大量产生乳酸降低pH值。发酵过程中，乳糖被转化为乳酸，使乳蛋白凝固，同时产生乙醛、双乙酰等特征风味物质。此外，益生菌酸奶还添加嗜酸乳杆菌、双歧杆菌等益生菌，赋予产品调节肠道菌群、增强免疫力等健康功效。',
    history:
      '酸奶起源于公元前3000年左右的中东地区，游牧民族偶然发现牛奶自然发酵后更易保存。1905年梅契尼科夫提出酸奶长寿学说，1919年伊萨克·卡拉索在巴塞罗那创立达能公司，开启了酸奶的工业化生产。',
    impact:
      '全球酸奶市场规模超过1000亿美元，年人均消费量从几升到几十升不等。酸奶已成为全球最受欢迎的健康食品之一，益生菌产业的快速发展更是推动了功能型发酵乳制品的创新。',
    advantages: [
      '乳糖被分解为乳酸，适合乳糖不耐受人群',
      '益生菌调节肠道微生态平衡',
      '发酵提高蛋白质和钙的生物利用率',
      '产生B族维生素等营养物质',
    ],
    challenges: [
      '益生菌在货架期内的存活率控制',
      '冷链运输和存储的成本',
      '不同批次产品的质构和风味一致性',
      '高强度搅拌等加工对益生菌的损伤',
    ],
    relatedMicrobes: [
      {
        microbeId: 5,
        role: '益生菌添加剂',
        importance: 'primary',
        contribution: '产酸促进发酵，作为益生菌调节肠道菌群平衡',
      },
      {
        microbeId: 8,
        role: '益生菌添加剂',
        importance: 'primary',
        contribution: '产乙酸和乳酸，调节肠道免疫功能',
      },
    ],
    processSteps: [
      {
        id: 'standardization',
        order: 1,
        title: '原料标准化',
        description: '调整牛奶的脂肪和固形物含量，可添加奶粉、乳清蛋白',
      },
      {
        id: 'homogenization',
        order: 2,
        title: '均质',
        description: '高压均质使脂肪球破碎，防止脂肪上浮，改善质地',
        temperature: '60-65°C',
      },
      {
        id: 'pasteurization',
        order: 3,
        title: '杀菌',
        description: '杀灭原料中的有害微生物和竞争性微生物',
        duration: '5-30分钟',
        temperature: '85-95°C',
      },
      {
        id: 'inoculation',
        order: 4,
        title: '接种发酵剂',
        description: '冷却至发酵温度后接种乳酸菌发酵剂',
        temperature: '40-45°C',
      },
      {
        id: 'fermentation',
        order: 5,
        title: '发酵',
        description: '乳酸菌发酵产酸，pH下降至4.5-4.7，乳蛋白凝固',
        duration: '4-8小时',
        temperature: '40-45°C',
        ph: '4.5-4.7',
        keyMicrobeIds: [5, 8],
      },
      {
        id: 'cooling',
        order: 6,
        title: '冷却与后熟',
        description: '快速冷却终止发酵，冷藏条件下风味进一步发展',
        temperature: '4-6°C',
      },
    ],
    products: ['凝固型酸奶', '搅拌型酸奶', '饮用型酸奶', '希腊酸奶', '益生菌酸奶'],
    scale: 'global',
    keyMetrics: [
      { label: '全球市场规模', value: '1000亿美元' },
      { label: '发酵终点pH', value: '4.5-4.7' },
      { label: '益生菌含量', value: '≥10⁶ CFU/g' },
      { label: '发酵时间', value: '4-8小时' },
    ],
  },
  {
    id: 'activated-sludge',
    category: 'wastewater_treatment',
    title: '活性污泥法污水处理',
    subtitle: '微生物群落的净化奇迹',
    summary: '利用活性污泥中的复合微生物菌群，通过好氧呼吸和厌氧代谢降解污水中的有机污染物。',
    description:
      '活性污泥法是当今全球应用最广泛的城市污水处理技术，其核心是曝气池中悬浮生长的微生物聚集体——活性污泥。这个复杂的微生物生态系统包括细菌（如芽孢杆菌、假单胞菌、硝化细菌）、原生动物（如钟虫、轮虫）、真菌和藻类，它们形成协同作用的食物网：首先细菌将溶解性有机物分解吸收并合成为自身生物量，随后原生动物捕食游离细菌，后生动物进一步捕食原生动物，形成稳定的生态平衡。系统通过控制溶解氧、污泥回流比、污泥龄等参数，实现COD、BOD、氮、磷等污染物的高效去除。',
    history:
      '1912年英国的克拉克和盖奇发现污水长时间曝气会产生污泥，水质同时得到净化。1914年阿登和洛基特正式发表活性污泥法论文，标志着该技术的诞生。一个多世纪以来，从传统推流式到A²/O、MBR等衍生工艺不断涌现。',
    impact:
      '全球超过60%的城市污水处理厂采用活性污泥法及其衍生工艺，每天处理数百亿立方米污水，保护了全球水体环境，是现代城市文明的重要基础设施。',
    advantages: [
      '污染物去除效率高，BOD₅去除率可达95%以上',
      '可同时实现脱氮除磷',
      '工艺成熟，运行管理经验丰富',
      '微生物自养为主，运行成本相对较低',
    ],
    challenges: [
      '剩余污泥产量大，处理处置成本高',
      '污泥膨胀等运行异常问题',
      '水力和有机负荷冲击的适应性',
      '新兴微污染物（药物、内分泌干扰素）的去除',
    ],
    relatedMicrobes: [
      {
        microbeId: 3,
        role: '有机物降解',
        importance: 'primary',
        contribution: '分泌多种水解酶，高效降解淀粉、蛋白质等大分子有机物',
      },
      {
        microbeId: 4,
        role: '污染物降解',
        importance: 'secondary',
        contribution: '降解多种难降解有机物，具有强大的代谢多样性',
      },
    ],
    processSteps: [
      {
        id: 'pretreatment',
        order: 1,
        title: '预处理',
        description: '格栅截留大颗粒悬浮物，沉砂池去除砂粒',
      },
      {
        id: 'primary',
        order: 2,
        title: '初次沉淀',
        description: '沉淀池去除悬浮固体和部分有机物',
        duration: '1-2小时',
      },
      {
        id: 'aeration',
        order: 3,
        title: '曝气池（核心）',
        description: '鼓风或机械曝气，活性污泥微生物降解有机污染物',
        duration: '6-24小时',
        temperature: '15-30°C',
        ph: '6.5-8.5',
        keyMicrobeIds: [3, 4],
      },
      {
        id: 'sedimentation',
        order: 4,
        title: '二次沉淀',
        description: '活性污泥与处理水分离，上清液排放',
        duration: '2-4小时',
      },
      {
        id: 'return',
        order: 5,
        title: '污泥回流与排放',
        description: '部分污泥回流至曝气池维持菌群浓度，剩余污泥进行脱水处置',
      },
      {
        id: 'disinfection',
        order: 6,
        title: '消毒排放',
        description: '紫外线或加氯消毒后达标排放',
      },
    ],
    products: ['达标排放水', '再生水（灌溉/工业回用）', '脱水污泥'],
    scale: 'global',
    keyMetrics: [
      { label: 'BOD₅去除率', value: '90-95%' },
      { label: 'COD去除率', value: '85-90%' },
      { label: '污泥龄', value: '5-15天' },
      { label: '溶解氧', value: '2-4 mg/L' },
    ],
  },
  {
    id: 'anaerobic-digestion',
    category: 'wastewater_treatment',
    title: '厌氧消化沼气工艺',
    subtitle: '变废为宝的微生物炼金术',
    summary: '利用厌氧微生物菌群将有机废弃物转化为沼气（甲烷+二氧化碳），实现能源回收与污染治理的双赢。',
    description:
      '厌氧消化是在无氧条件下利用复杂微生物群落将有机物质转化为沼气的过程，广泛应用于高浓度有机废水和有机固废处理。整个过程分为四个阶段：水解发酵阶段（细菌分泌胞外酶将大分子分解为小分子）、产氢产乙酸阶段（发酵产物进一步转化为乙酸、氢气和CO₂）、同型产乙酸阶段（H₂/CO₂合成乙酸）、产甲烷阶段（产甲烷古菌利用乙酸或H₂/CO₂生成甲烷）。参与的微生物包括拟杆菌门、厚壁菌门等发酵细菌，互营单胞菌属等产氢产乙酸菌，以及甲烷八叠球菌属、甲烷杆菌属等产甲烷古菌，它们形成紧密的互养共生关系。',
    history:
      '1776年伏打发现湖底可燃气体，1896年英国建成第一个厌氧消化池处理生活污水。1950年代后UASB、IC等高效反应器的发明使厌氧技术进入高速发展期，当今已成为资源循环经济的核心技术之一。',
    impact:
      '全球厌氧消化系统每年可产生约500亿立方米沼气，相当于约3500万吨标准煤的能源。同时每年处理数亿吨有机废弃物，实现了废弃物的减量化、资源化和无害化。',
    advantages: [
      '产生沼气作为可再生能源，实现碳中和',
      '高负荷处理，能耗远低于好氧工艺',
      '剩余污泥产量低，仅为好氧法的1/10-1/5',
      '可处理高浓度有机废水，无需大量稀释',
    ],
    challenges: [
      '启动周期长，污泥增殖慢',
      '对温度、pH、毒物等冲击敏感',
      '产甲烷菌世代时间长，流失后难恢复',
      '沼气需净化后才能高效利用',
    ],
    relatedMicrobes: [
      {
        microbeId: 21,
        role: '产甲烷古菌',
        importance: 'primary',
        contribution: '利用H₂和CO₂生成甲烷，是沼气产出的关键微生物',
      },
      {
        microbeId: 24,
        role: '高温发酵菌',
        importance: 'secondary',
        contribution: '在高温厌氧消化中参与有机物质的发酵降解',
      },
    ],
    processSteps: [
      {
        id: 'pretreatment',
        order: 1,
        title: '预处理',
        description: '筛选去除杂物，调节浓度、温度和pH值',
        temperature: '35°C（中温）或 55°C（高温）',
      },
      {
        id: 'hydrolysis',
        order: 2,
        title: '水解发酵',
        description: '水解菌分泌胞外酶分解大分子为可溶性小分子',
        duration: '1-3天',
        ph: '5.5-7.0',
      },
      {
        id: 'acidogenesis',
        order: 3,
        title: '产氢产乙酸',
        description: '发酵产物被产氢产乙酸菌转化为乙酸、H₂和CO₂',
        ph: '5.5-6.5',
        keyMicrobeIds: [3, 4],
      },
      {
        id: 'methanogenesis',
        order: 4,
        title: '产甲烷阶段',
        description: '产甲烷古菌将乙酸和H₂/CO₂转化为甲烷和CO₂',
        duration: '10-30天',
        temperature: '35°C或 55°C',
        ph: '6.8-7.4',
        keyMicrobeIds: [21, 24],
      },
      {
        id: 'separation',
        order: 5,
        title: '固液分离',
        description: '沼液沼渣分离，污泥回流或排出系统',
      },
      {
        id: 'utilization',
        order: 6,
        title: '沼气利用',
        description: '沼气净化后用于锅炉燃烧、发电或提纯为生物天然气',
      },
    ],
    products: ['沼气（CH₄ 55-70%）', '沼渣有机肥', '沼液（液态肥）'],
    scale: 'industrial',
    keyMetrics: [
      { label: '沼气产率', value: '0.3-0.6 m³/kg COD' },
      { label: 'COD去除率', value: '80-95%' },
      { label: '甲烷含量', value: '55-70%' },
      { label: '水力停留时间', value: '15-40天' },
    ],
  },
  {
    id: 'penicillin-production',
    category: 'biopharmaceutical',
    title: '青霉素工业化生产',
    subtitle: '拯救数千万生命的医学奇迹',
    summary: '利用产黄青霉发酵生产青霉素，开创了抗生素工业时代，成为微生物制药的经典范例。',
    description:
      '青霉素是人类历史上第一种抗生素，其工业化生产是微生物发酵工程的里程碑成就。生产菌种产黄青霉（Penicillium chrysogenum）通过深层液体发酵合成青霉素。发酵过程分为两个阶段：菌体生长阶段（快速生长期，菌丝大量增殖）和青霉素合成阶段（限速期，碳源缓慢补给，青霉素大量分泌）。青霉素是β-内酰胺类抗生素，通过抑制细菌细胞壁肽聚糖的转肽酶，阻断细胞壁合成从而杀死细菌。从最初弗莱明的培养皿中每升仅产几毫克，到现代工业菌株通过诱变育种和代谢工程改造，产量已超过每升50克，提高了数万倍。',
    history:
      '1928年弗莱明偶然发现青霉素的抗菌作用，1938年弗洛里和钱恩开始系统研究和提纯。1943年美国农业部北方地区研究实验室（NRRL）分离到产量更高的产黄青霉NRRL 1951，随后开展深层液体发酵研究。1945年青霉素实现大规模工业化生产，为二战盟军伤员救治做出巨大贡献。',
    impact:
      '青霉素及衍生的β-内酰胺类抗生素至今仍是全球使用最广泛的抗生素，年产量超过6万吨。抗生素的应用使全球平均预期寿命提高了约10年，被公认为20世纪最伟大的医学成就。',
    advantages: [
      '对革兰氏阳性菌杀菌效力强，毒性极低',
      '发酵工艺成熟，生产成本低廉',
      '作为母核可半合成多种衍生抗生素',
      '工业发酵技术可推广至其他抗生素生产',
    ],
    challenges: [
      '青霉素耐药性问题日益严峻',
      '发酵后期青霉素降解的防控',
      '高产菌株的遗传稳定性维护',
      '过敏反应等不良反应限制使用人群',
    ],
    relatedMicrobes: [
      {
        microbeId: 11,
        role: '青霉素产生菌',
        importance: 'primary',
        contribution: '通过次生代谢合成青霉素G/V等β-内酰胺类抗生素',
      },
    ],
    processSteps: [
      {
        id: 'strain',
        order: 1,
        title: '菌种选育与保藏',
        description: '采用基因工程改造的高产菌株，液氮或沙土管保藏',
      },
      {
        id: 'seed',
        order: 2,
        title: '种子培养',
        description: '从孢子悬浮液开始，经三级种子罐逐级扩大培养',
        duration: '2-4天',
        temperature: '25-28°C',
        keyMicrobeIds: [11],
      },
      {
        id: 'fermentation',
        order: 3,
        title: '发酵培养',
        description: '补料分批发酵，分生长期和生产期两阶段控制',
        duration: '6-8天',
        temperature: '25-26°C',
        ph: '6.5-7.5',
        keyMicrobeIds: [11],
      },
      {
        id: 'filtration',
        order: 4,
        title: '发酵液过滤',
        description: '过滤或离心去除菌丝体，获得含青霉素的澄清滤液',
      },
      {
        id: 'extraction',
        order: 5,
        title: '溶剂萃取与纯化',
        description: '醋酸丁酯或醋酸戊酯萃取，结晶纯化得到青霉素钾/钠盐',
      },
      {
        id: 'formulation',
        order: 6,
        title: '制剂',
        description: '冷冻干燥制备粉针剂，或进一步合成半合成抗生素',
      },
    ],
    products: ['青霉素G钾/钠', '青霉素V', '阿莫西林', '氨苄西林', '头孢菌素母核'],
    scale: 'global',
    keyMetrics: [
      { label: '全球年产量', value: '>6万吨' },
      { label: '发酵效价', value: '>50000 U/mL' },
      { label: '发酵周期', value: '6-8天' },
      { label: '提取收率', value: '>85%' },
    ],
  },
  {
    id: 'recombinant-protein',
    category: 'biopharmaceutical',
    title: '重组蛋白药物表达',
    subtitle: '以微生物为工厂的生物制药革命',
    summary: '以大肠杆菌、酿酒酵母等为宿主，通过重组DNA技术表达生产胰岛素、干扰素等治疗性蛋白质药物。',
    description:
      '重组蛋白药物是现代生物制药产业的核心，其本质是将编码目标蛋白的外源基因导入微生物宿主细胞，利用微生物的转录翻译系统大量合成人类所需的蛋白质。大肠杆菌是最早也是应用最广泛的原核表达系统，生长快、培养成本低、遗传背景清楚，适合表达不复杂翻译后修饰的蛋白质；酿酒酵母和毕赤酵母等真核表达系统则能进行糖基化等修饰，适合更复杂的蛋白。自1978年首个重组人胰岛素在大肠杆菌中成功表达以来，已有超过200种重组蛋白药物获批上市，涵盖胰岛素、单克隆抗体、干扰素、生长激素、凝血因子等，治疗糖尿病、癌症、自身免疫病、遗传性疾病等多种重大疾病。',
    history:
      '1973年科恩和博耶建立重组DNA技术。1978年基因泰克公司成功在大肠杆菌中表达重组人胰岛素，1982年获FDA批准上市，成为全球首个基因工程药物。此后干扰素、生长激素、EPO等药物相继问世，开启了生物制药黄金时代。',
    impact:
      '全球重组蛋白药物市场规模超过3000亿美元，占生物制药市场的70%以上。仅重组胰岛素就使全球超过4亿糖尿病患者受益，单克隆抗体已成为肿瘤治疗的基石药物。',
    advantages: [
      '精确表达人源蛋白，免疫原性远低于动物源产品',
      '量产成本远低于传统提取方式',
      '可通过蛋白质工程优化药物性能',
      '避免动物源疾病传播风险',
    ],
    challenges: [
      '包涵体复性的效率问题',
      '糖基化等翻译后修饰的精确控制',
      '宿主蛋白残留的纯化难题',
      '大规模培养的密度和表达量优化',
    ],
    relatedMicrobes: [
      {
        microbeId: 1,
        role: '原核表达宿主',
        importance: 'primary',
        contribution: '最常用的重组蛋白表达宿主，用于胰岛素、干扰素等的生产',
      },
      {
        microbeId: 9,
        role: '真核表达宿主',
        importance: 'primary',
        contribution: '用于表达需要简单翻译后修饰的重组蛋白和疫苗抗原',
      },
      {
        microbeId: 3,
        role: '酶制剂表达',
        importance: 'secondary',
        contribution: '用于淀粉酶、蛋白酶等工业酶的重组表达和生产',
      },
    ],
    processSteps: [
      {
        id: 'vector',
        order: 1,
        title: '重组质粒构建',
        description: '将目标基因克隆到表达载体，构建重组表达质粒',
      },
      {
        id: 'transformation',
        order: 2,
        title: '转化与筛选',
        description: '重组质粒转化宿主菌，筛选高表达阳性克隆',
        keyMicrobeIds: [1, 9],
      },
      {
        id: 'seed',
        order: 3,
        title: '种子培养',
        description: '从单菌落开始，摇瓶和种子罐逐级扩大培养',
        temperature: '37°C（大肠杆菌）',
        keyMicrobeIds: [1, 9],
      },
      {
        id: 'fermentation',
        order: 4,
        title: '高密度发酵',
        description: '补料分批发酵，OD₆₀₀可达100以上，诱导表达目标蛋白',
        duration: '24-72小时',
        temperature: '37°C或降温至25-30°C',
        keyMicrobeIds: [1, 9],
      },
      {
        id: 'harvest',
        order: 5,
        title: '菌体收集与破碎',
        description: '离心收集菌体，高压均质或超声破碎释放胞内蛋白',
      },
      {
        id: 'purification',
        order: 6,
        title: '蛋白纯化',
        description: '亲和层析、离子交换、凝胶过滤等多步纯化获得高纯度蛋白',
      },
    ],
    products: ['重组人胰岛素', '干扰素α/β', '重组人生长激素', 'EPO', '粒细胞集落刺激因子', '乙肝疫苗抗原'],
    scale: 'global',
    keyMetrics: [
      { label: '全球市场规模', value: '>3000亿美元' },
      { label: '发酵密度', value: 'OD₆₀₀ > 100' },
      { label: '表达量', value: '占总蛋白 10-50%' },
      { label: '纯化纯度', value: '>99%' },
    ],
  },
  {
    id: 'rhizobium-fertilizer',
    category: 'agricultural_improvement',
    title: '根瘤菌生物肥料',
    subtitle: '空气中取氮肥的微生物魔术师',
    summary: '利用根瘤菌与豆科植物的共生固氮作用，将大气中的氮气转化为植物可利用的氨态氮。',
    description:
      '根瘤菌是一类能够与豆科植物形成共生关系的土壤细菌，它们通过植物根毛侵入根部，形成根瘤，在根瘤中分化为类菌体，将大气中的N₂还原为NH₃供植物吸收利用。催化这一反应的固氮酶对氧气极为敏感，根瘤内的豆血红蛋白通过调节氧分压保护固氮酶，同时类菌体采用特殊的呼吸链高效利用氧气。全球每年生物固氮总量约为2亿吨，其中豆科植物-根瘤菌共生体系贡献了约70%，是农业生态系统中最重要的氮素来源。根瘤菌接种剂作为生物肥料，可替代20-50%的化学氮肥，在减少化肥使用、降低农业面源污染方面发挥着重要作用。',
    history:
      '1886年德国科学家赫尔利格尔和威尔法斯首次证明豆科植物通过根瘤固氮。1888年拜耶林克首次分离出根瘤菌纯培养。20世纪初根瘤菌接种剂开始商品化应用，至今仍是全球使用最广泛的微生物肥料。',
    impact:
      '全球根瘤菌肥料年使用面积超过2亿公顷，每年固定氮素约1500万吨，相当于减少尿素使用约3200万吨，经济和环境效益巨大。同时豆科轮作也是保持土壤肥力的重要措施。',
    advantages: [
      '替代化学氮肥，降低生产成本',
      '减少氮肥造成的水体富营养化和温室气体排放',
      '改良土壤结构和微生物生态',
      '与宿主植物共生，效果稳定持久',
    ],
    challenges: [
      '土著根瘤菌竞争问题影响接种效果',
      '菌剂货架期和活菌数稳定性',
      '菌株与品种的匹配性和专化性',
      '不利土壤环境（干旱、盐分、酸度）的适应性',
    ],
    relatedMicrobes: [
      {
        microbeId: 3,
        role: '促生辅助菌',
        importance: 'secondary',
        contribution: '产生植物促生长物质，溶解土壤磷素，协同提高作物产量',
      },
    ],
    processSteps: [
      {
        id: 'strain',
        order: 1,
        title: '高效菌株筛选',
        description: '从根瘤中分离筛选固氮效率高、竞争能力强的优良菌株',
      },
      {
        id: 'seed',
        order: 2,
        title: '种子培养',
        description: '斜面种子→摇瓶→种子罐逐级扩大培养',
        temperature: '28-30°C',
        ph: '6.8-7.2',
      },
      {
        id: 'fermentation',
        order: 3,
        title: '发酵培养',
        description: '深层好氧发酵培养获得高浓度根瘤菌活菌体',
        duration: '24-48小时',
        temperature: '28-30°C',
        keyMicrobeIds: [3],
      },
      {
        id: 'formulation',
        order: 4,
        title: '载体吸附与剂型制备',
        description: '发酵液与草炭、蛭石等载体混合，或制备液体剂型、微胶囊',
      },
      {
        id: 'quality',
        order: 5,
        title: '质量检验',
        description: '检测有效活菌数、杂菌率、水分含量等指标',
      },
      {
        id: 'application',
        order: 6,
        title: '田间应用',
        description: '种子包衣、拌种或土壤施用，接种到豆科作物',
      },
    ],
    products: ['大豆根瘤菌剂', '花生根瘤菌剂', '苜蓿根瘤菌剂', '复合微生物肥料'],
    scale: 'global',
    keyMetrics: [
      { label: '年固氮量', value: '1500万吨' },
      { label: '菌剂活菌数', value: '≥2×10⁸ CFU/g' },
      { label: '化肥替代率', value: '20-50%' },
      { label: '增产效果', value: '10-25%' },
    ],
  },
  {
    id: 'bt-biocontrol',
    category: 'agricultural_improvement',
    title: '苏云金芽孢杆菌生物农药',
    subtitle: '绿色农业的微生物卫士',
    summary: '利用苏云金芽孢杆菌产生的杀虫晶体蛋白（Bt毒素），开发对环境友好的微生物杀虫剂。',
    description:
      '苏云金芽孢杆菌（Bacillus thuringiensis）在芽孢形成过程中能够产生伴孢晶体蛋白（δ-内毒素），这些蛋白对特定昆虫具有高度选择性毒杀作用，而对哺乳动物、鸟类、鱼类等非靶标生物安全无害。当敏感昆虫取食Bt后，晶体蛋白在昆虫中肠碱性环境下被蛋白酶水解激活，与中肠上皮细胞膜上的特异受体结合，形成孔道导致细胞裂解和昆虫死亡。不同Bt菌株产生的Cry蛋白具有不同的杀虫谱，分别对鳞翅目、双翅目、鞘翅目等多种害虫有效。Bt制剂是全球产量最大、应用最广的微生物农药，占生物农药市场的70%以上。此外，Bt杀虫基因也是转基因抗虫作物（如Bt棉花、Bt玉米）的核心基因。',
    history:
      '1901年日本科学家石渡繁胤首次从病死家蚕中分离出Bt。1911年柏林纳从德国苏云金省的地中海粉螟中再次分离并正式命名。1938年法国开始商品化生产Bt制剂，1950年代后全球Bt产业快速发展。1996年首批Bt转基因作物（棉花、玉米）开始商业化种植。',
    impact:
      '全球Bt制剂年产量超过1万吨，年应用面积超过5000万公顷。Bt转基因作物种植面积超过1亿公顷，每年减少化学农药用量数万吨，有效保护了生态环境和农民健康。',
    advantages: [
      '对靶标害虫高度专一，不伤害天敌和有益昆虫',
      '对人畜安全，无残留污染',
      '不产生抗药性（或抗性产生缓慢）',
      '可与其他生物防治手段兼容',
    ],
    challenges: [
      '田间持效期短，易被紫外线降解',
      '杀虫谱相对较窄',
      '长期大面积使用仍有抗药性风险',
      '对钻蛀性、地下害虫防治效果有限',
    ],
    relatedMicrobes: [
      {
        microbeId: 3,
        role: '近缘种参考',
        importance: 'supporting',
        contribution: '枯草芽孢杆菌作为近缘种，其发酵工艺可直接借鉴用于Bt生产',
      },
    ],
    processSteps: [
      {
        id: 'strain',
        order: 1,
        title: '菌株选育',
        description: '筛选高产、高毒力的Bt菌株，构建基因工程菌株',
      },
      {
        id: 'seed',
        order: 2,
        title: '种子培养',
        description: '琼脂斜面→摇瓶→种子罐，确保菌量充足和纯度',
        temperature: '28-30°C',
        keyMicrobeIds: [3],
      },
      {
        id: 'fermentation',
        order: 3,
        title: '深层发酵',
        description: '半合成培养基补料发酵，控制溶氧促进芽孢和晶体形成',
        duration: '36-48小时',
        temperature: '28-30°C',
        ph: '6.8-7.4',
        keyMicrobeIds: [3],
      },
      {
        id: 'harvest',
        order: 4,
        title: '菌体收集',
        description: '离心或板框过滤收集芽孢晶体复合物',
      },
      {
        id: 'formulation',
        order: 5,
        title: '剂型加工',
        description: '加入助剂、填料，制备可湿性粉剂、悬浮剂、水分散粒剂',
      },
      {
        id: 'application',
        order: 6,
        title: '田间应用',
        description: '喷雾施用，在卵孵盛期和低龄幼虫期用药效果最佳',
      },
    ],
    products: ['Bt可湿性粉剂', 'Bt悬浮剂', 'Bt水分散粒剂', 'Bt+化学农药复配剂'],
    scale: 'global',
    keyMetrics: [
      { label: '全球市场份额', value: '>70%生物农药' },
      { label: '制剂毒力', value: '16000-32000 IU/mg' },
      { label: '杀虫死亡率', value: '>85%' },
      { label: '持效期', value: '5-10天' },
    ],
  },
  {
    id: 'fuel-ethanol',
    category: 'biofuel_production',
    title: '燃料乙醇发酵',
    subtitle: '驶向绿色未来的微生物引擎',
    summary: '利用酿酒酵母发酵淀粉质或糖质原料生产燃料乙醇，作为汽油的可再生替代燃料。',
    description:
      '燃料乙醇是以生物质为原料，经微生物发酵生产的高纯度乙醇，与汽油按一定比例混合作为车用燃料。第一代燃料乙醇以玉米、甘蔗、小麦等粮食或糖料作物为原料，其中以甘蔗为原料的巴西模式和以玉米为原料的美国模式最为成熟。第二代燃料乙醇以农业废弃物、林业废弃物等木质纤维素为原料，难点在于纤维素的预处理和糖化。微生物方面，酿酒酵母是乙醇发酵的主力，具有成熟稳定的工业应用背景；近年来运动发酵单胞菌、工程化大肠杆菌等也在开发中。发酵过程中，六碳糖（葡萄糖、果糖、甘露糖）通过EMP途径转化为丙酮酸，再经丙酮酸脱羧酶和乙醇脱氢酶作用生成乙醇和CO₂。',
    history:
      '19世纪末内燃机发明后，乙醇即被作为燃料使用。1970年代石油危机后，巴西和美国大规模发展燃料乙醇产业。1975年巴西启动"ProAlcool"计划，美国1990年通过《清洁空气法》推动乙醇汽油使用。近年二代纤维素乙醇技术逐步突破，开始商业化。',
    impact:
      '全球燃料乙醇年产量超过1000亿升，其中美国和巴西占全球产量的85%以上。燃料乙醇的使用每年减少数亿吨二氧化碳排放，对能源安全和气候变化应对具有重要意义。',
    advantages: [
      '可再生能源，减少对石油的依赖',
      '全生命周期碳减排30-60%',
      '提高汽油辛烷值，减少有害排放',
      '发酵技术成熟，原料来源广泛',
    ],
    challenges: [
      '一代燃料乙醇存在"与人争粮"争议',
      '二代纤维素乙醇成本仍偏高',
      '戊糖高效利用的工程酵母构建',
      '发酵副产物（如木质素）高值化利用',
    ],
    relatedMicrobes: [
      {
        microbeId: 9,
        role: '乙醇发酵主力',
        importance: 'primary',
        contribution: '高效将葡萄糖等六碳糖发酵转化为乙醇和CO₂',
      },
    ],
    processSteps: [
      {
        id: 'pretreatment',
        order: 1,
        title: '原料预处理',
        description: '玉米粉碎、甘蔗榨汁，或纤维素原料的蒸汽爆破/酸/碱预处理',
      },
      {
        id: 'saccharification',
        order: 2,
        title: '糖化',
        description: '添加淀粉酶、糖化酶将淀粉转化为可发酵糖（SSF同步糖化发酵）',
        temperature: '85-95°C（液化）/ 60-65°C（糖化）',
        ph: '5.5-6.0',
      },
      {
        id: 'fermentation',
        order: 3,
        title: '酒精发酵',
        description: '酵母将可发酵糖转化为乙醇，酒精度可达10-14%（v/v）',
        duration: '48-72小时',
        temperature: '30-35°C',
        ph: '4.5-5.0',
        keyMicrobeIds: [9],
      },
      {
        id: 'distillation',
        order: 4,
        title: '蒸馏',
        description: '差压蒸馏将发酵醪液浓缩至95%（v/v）左右的粗酒精',
      },
      {
        id: 'dehydration',
        order: 5,
        title: '脱水',
        description: '分子筛吸附或共沸蒸馏制备无水乙醇（≥99.5%）',
      },
      {
        id: 'blending',
        order: 6,
        title: '调和',
        description: '与汽油按比例调和制成E10、E85等乙醇汽油产品',
      },
    ],
    products: ['燃料无水乙醇', 'E10乙醇汽油', 'E85乙醇汽油', 'DDGS蛋白饲料', '二氧化碳'],
    scale: 'global',
    keyMetrics: [
      { label: '全球年产量', value: '>1000亿升' },
      { label: '糖-醇转化率', value: '90-93%理论值' },
      { label: '发酵终点酒度', value: '10-14%' },
      { label: '碳减排', value: '30-60%' },
    ],
  },
  {
    id: 'bioremediation-oil',
    category: 'environmental_remediation',
    title: '石油污染生物修复',
    subtitle: '吃掉油污的微生物清道夫',
    summary: '利用石油降解微生物的代谢能力，将环境中的石油烃类污染物降解为无害的CO₂和水。',
    description:
      '石油污染是全球最严重的环境问题之一，传统物理化学修复方法成本高且易造成二次污染。生物修复技术利用自然界中广泛存在的石油降解微生物（如假单胞菌属、芽孢杆菌属、诺卡氏菌属、红球菌属等），通过其代谢酶系将石油中的烷烃、芳香烃、胶质沥青质等组分逐步分解，最终转化为CO₂、H₂O和微生物生物量。生物修复可分为原位生物强化（添加高效降解菌）、生物刺激（添加氮磷营养盐、曝气供氧促进土著微生物）以及植物-微生物联合修复等策略。微生物降解石油的酶系包括单加氧酶、双加氧酶、脱氢酶等，其中烷烃羟化酶（AlkB）和细胞色素P450是烷烃降解的关键酶，萘双加氧酶（NDO）等则负责多环芳烃的开环反应。',
    history:
      '1970年代中期首次提出生物修复概念。1989年美国Exxon Valdez号油轮泄漏事件中，大规模施用亲油性肥料进行生物刺激，使油污清除速度提高了2-3倍，这是生物修复技术发展的里程碑。此后生物修复技术在全球多次石油污染事件中得到验证和应用。',
    impact:
      '生物修复已成为处理大规模石油污染的首选或辅助方案之一，在美国EPA登记的石油污染场地中，约40%采用了生物修复技术。与传统技术相比，生物修复成本可降低30-70%，且环境友好。',
    advantages: [
      '污染物原位降解，无二次污染',
      '处理成本低，仅为焚烧填埋的1/3-1/10',
      '操作简单，适合大面积土壤和水体修复',
      '对环境扰动小，保护生态系统',
    ],
    challenges: [
      '重质组分和高环芳烃降解效率低',
      '低温、缺氧等不利环境条件限制降解效率',
      '外源降解菌与土著微生物的竞争存活',
      '修复周期较长（数月至数年）',
    ],
    relatedMicrobes: [
      {
        microbeId: 4,
        role: '石油降解主力',
        importance: 'primary',
        contribution: '具有广泛的底物降解谱，可降解烷烃、芳香烃等多种石油组分',
      },
      {
        microbeId: 3,
        role: '协同降解菌',
        importance: 'secondary',
        contribution: '产生生物表面活性剂促进石油乳化，协同降解石油组分',
      },
    ],
    processSteps: [
      {
        id: 'assessment',
        order: 1,
        title: '污染调查与评估',
        description: '测定污染物种类、浓度、分布范围，评估土壤和地下水环境参数',
      },
      {
        id: 'strain',
        order: 2,
        title: '降解菌筛选与培养',
        description: '从污染场地富集分离高效降解菌，或使用经过验证的菌剂',
        temperature: '25-30°C',
        keyMicrobeIds: [4, 3],
      },
      {
        id: 'biostimulation',
        order: 3,
        title: '生物刺激（营养调节）',
        description: '添加氮磷营养盐（最佳C:N:P约100:10:1），调节pH和水分',
      },
      {
        id: 'bioaugmentation',
        order: 4,
        title: '生物强化（投菌）',
        description: '接种高效降解菌剂，必要时投加生物表面活性剂促进乳化',
        keyMicrobeIds: [4, 3],
      },
      {
        id: 'aeration',
        order: 5,
        title: '供氧与过程调控',
        description: '通过翻耕、曝气、注入空气等方式维持好氧条件',
      },
      {
        id: 'monitoring',
        order: 6,
        title: '监测与评估',
        description: '定期监测污染物浓度、微生物活性、总石油烃（TPH）变化，评估修复效果',
      },
    ],
    products: ['石油降解菌剂', '生物表面活性剂', '修复后的清洁土壤/水体'],
    scale: 'industrial',
    keyMetrics: [
      { label: 'TPH去除率', value: '60-95%' },
      { label: '修复周期', value: '3-24个月' },
      { label: '成本节约', value: '30-70%' },
      { label: '降解温度', value: '15-35°C' },
    ],
  },
];

export function getAllApplications(): IndustrialApplication[] {
  return industrialApplications;
}

export function getApplicationsByCategory(
  category: IndustrialCategory,
): IndustrialApplication[] {
  return industrialApplications.filter((app) => app.category === category);
}

export function getApplicationById(id: string): IndustrialApplication | undefined {
  return industrialApplications.find((app) => app.id === id);
}

export function getApplicationsByMicrobe(microbeId: number): IndustrialApplication[] {
  return industrialApplications.filter((app) =>
    app.relatedMicrobes.some((rm) => rm.microbeId === microbeId),
  );
}

export function getCategorySummary() {
  const categories: IndustrialCategory[] = [
    'food_fermentation',
    'wastewater_treatment',
    'biopharmaceutical',
    'agricultural_improvement',
    'biofuel_production',
    'environmental_remediation',
  ];
  return categories.map((cat) => {
    const apps = getApplicationsByCategory(cat);
    const totalMicrobes = new Set(apps.flatMap((a) => a.relatedMicrobes.map((m) => m.microbeId)))
      .size;
    return {
      category: cat,
      count: apps.length,
      microbeCount: totalMicrobes,
    };
  });
}
