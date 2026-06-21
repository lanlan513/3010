import type {
  AbilityTagInfo,
  MicrobeAbilityProfile,
  AbilityAssociation,
  AbilityTag,
  AbilityDimension,
} from '../../shared/types';
import { ABILITY_DIMENSION_COLORS, ABILITY_DIMENSION_DESCRIPTIONS } from '../../shared/types';

export const abilityTagInfos: AbilityTagInfo[] = [
  {
    tag: 'nitrogen_fixation',
    dimension: 'metabolism',
    description: '将大气中的氮气转化为可被生物利用的氨',
    scientificBackground: '仅原核生物具有固氮酶复合体，是氮循环最关键的限速步骤',
  },
  {
    tag: 'fermentation',
    dimension: 'metabolism',
    description: '在无氧条件下通过糖酵解产生能量和代谢产物',
    scientificBackground: '最原始的能量获取方式，产物包括乙醇、乳酸、乙酸等',
  },
  {
    tag: 'aerobic_respiration',
    dimension: 'metabolism',
    description: '利用氧气作为末端电子受体的高效能量代谢',
    scientificBackground: '通过电子传递链和氧化磷酸化，每分子葡萄糖可产生约30-32 ATP',
  },
  {
    tag: 'anaerobic_respiration',
    dimension: 'metabolism',
    description: '使用非氧气物质作为末端电子受体',
    scientificBackground: '电子受体包括硝酸盐、硫酸盐、延胡索酸等，效率介于有氧呼吸和发酵之间',
  },
  {
    tag: 'photosynthesis',
    dimension: 'metabolism',
    description: '利用光能将CO2转化为有机物质',
    scientificBackground: '细菌视紫红质或叶绿素系统驱动，分为产氧和不产氧类型',
  },
  {
    tag: 'chemosynthesis',
    dimension: 'metabolism',
    description: '氧化无机化合物获取能量进行碳固定',
    scientificBackground: '化能自养生物独有的营养方式，常见于深海热泉等无光环境',
  },
  {
    tag: 'nitrification',
    dimension: 'metabolism',
    description: '将氨逐步氧化为亚硝酸盐和硝酸盐',
    scientificBackground: '主要由硝化细菌和古菌完成，是氮循环的关键环节',
  },
  {
    tag: 'denitrification',
    dimension: 'metabolism',
    description: '将硝酸盐还原为气态氮化合物返回大气',
    scientificBackground: '厌氧微生物完成的反硝化过程，完成氮循环闭环',
  },
  {
    tag: 'sulfate_reduction',
    dimension: 'metabolism',
    description: '以硫酸盐为末端电子受体进行厌氧呼吸',
    scientificBackground: '硫酸盐还原菌产生H2S，是硫循环的重要驱动者',
  },
  {
    tag: 'sulfur_oxidation',
    dimension: 'metabolism',
    description: '氧化还原态硫化合物获取能量',
    scientificBackground: '硫氧化细菌是海洋和热泉生态系统的初级生产者',
  },
  {
    tag: 'methanogenesis',
    dimension: 'metabolism',
    description: '古菌特有途径，产生甲烷气体',
    scientificBackground: '产甲烷古菌是严格厌氧菌，驱动全球甲烷循环',
  },
  {
    tag: 'methanotrophy',
    dimension: 'metabolism',
    description: '以甲烷作为唯一碳源和能源',
    scientificBackground: '甲烷氧化菌消耗大气甲烷，缓解温室效应',
  },
  {
    tag: 'cellulose_degradation',
    dimension: 'metabolism',
    description: '分泌纤维素酶分解植物细胞壁多糖',
    scientificBackground: '纤维素是地球上最丰富的生物质资源，微生物分解是碳循环关键',
  },
  {
    tag: 'lignin_degradation',
    dimension: 'metabolism',
    description: '分解复杂芳香族木质素聚合物',
    scientificBackground: '白腐真菌等产生木质素过氧化物酶，完成森林碳循环',
  },
  {
    tag: 'thermophilic',
    dimension: 'environment',
    description: '在50-80°C或更高温度下最适生长',
    scientificBackground: '蛋白质和核酸具有特殊稳定性，嗜热酶用于PCR等生物技术',
  },
  {
    tag: 'psychrophilic',
    dimension: 'environment',
    description: '在低温环境下最适生长（<15°C）',
    scientificBackground: '细胞膜含高比例不饱和脂肪酸，酶具有低温活性',
  },
  {
    tag: 'acidophilic',
    dimension: 'environment',
    description: '在pH<3的极端酸性环境中生长',
    scientificBackground: '细胞膜H+转运机制维持胞内中性pH，常见于火山硫泉',
  },
  {
    tag: 'alkaliphilic',
    dimension: 'environment',
    description: '在pH>9的极端碱性环境中生长',
    scientificBackground: '通过Na+/H+反向转运体维持pH稳态，碱性酶有工业价值',
  },
  {
    tag: 'halophilic',
    dimension: 'environment',
    description: '需要高盐浓度（>15%NaCl）才能生长',
    scientificBackground: '细胞内积累相容溶质或KCl维持渗透压平衡',
  },
  {
    tag: 'radiation_resistant',
    dimension: 'environment',
    description: '耐受高剂量电离辐射',
    scientificBackground: '具备超强DNA修复机制，可修复数百个双链断裂',
  },
  {
    tag: 'desiccation_resistant',
    dimension: 'environment',
    description: '在干燥脱水条件下长期存活',
    scientificBackground: '合成海藻糖和特殊蛋白保护细胞结构，孢子是典型代表',
  },
  {
    tag: 'barophilic',
    dimension: 'environment',
    description: '适应高压环境（深海）',
    scientificBackground: '细胞膜和蛋白质结构适应高压，最适生长压力>400atm',
  },
  {
    tag: 'osmotic_tolerant',
    dimension: 'environment',
    description: '耐受广泛的渗透压变化',
    scientificBackground: '快速调节胞内渗透溶质浓度，常见于腌制食品',
  },
  {
    tag: 'biofilm_formation',
    dimension: 'environment',
    description: '形成结构化的微生物群落附着于表面',
    scientificBackground: '生物膜细胞耐药性可提高10-1000倍，是临床感染的重要因素',
  },
  {
    tag: 'endospore_formation',
    dimension: 'environment',
    description: '产生耐热抗逆的内生孢子进入休眠状态',
    scientificBackground: '芽孢杆菌和梭菌特有，孢子可在土壤中存活数十年',
  },
  {
    tag: 'antibiotic_production',
    dimension: 'biotechnology',
    description: '合成能抑制其他微生物生长的次级代谢产物',
    scientificBackground: '链霉菌属产生超过70%的天然抗生素，是现代医药的基础',
  },
  {
    tag: 'enzyme_production',
    dimension: 'biotechnology',
    description: '分泌具有工业价值的水解酶和合成酶',
    scientificBackground: '淀粉酶、蛋白酶、脂肪酶等广泛应用于食品、纺织、洗涤剂工业',
  },
  {
    tag: 'organic_acid_production',
    dimension: 'biotechnology',
    description: '发酵大规模生产有机酸',
    scientificBackground: '柠檬酸、乳酸、乙酸等年产量超千万吨，服务于食品医药行业',
  },
  {
    tag: 'vitamin_synthesis',
    dimension: 'biotechnology',
    description: '合成人体必需的维生素',
    scientificBackground: '肠道菌合成B族维生素和维生素K，工业发酵生产维生素C、B12',
  },
  {
    tag: 'polysaccharide_production',
    dimension: 'biotechnology',
    description: '合成具有特殊功能的胞外多糖',
    scientificBackground: '黄原胶、透明质酸、海藻酸等用于食品、医药、化妆品',
  },
  {
    tag: 'bioremediation',
    dimension: 'ecology',
    description: '利用微生物降解或转化环境污染物',
    scientificBackground: '石油泄漏、重金属污染、农药残留的生物修复方案',
  },
  {
    tag: 'pollutant_degradation',
    dimension: 'ecology',
    description: '将有害化学物质降解为无害产物',
    scientificBackground: '假单胞菌等可降解多环芳烃、卤代化合物等持久性有机污染物',
  },
  {
    tag: 'heavy_metal_resistance',
    dimension: 'ecology',
    description: '耐受并转化重金属离子',
    scientificBackground: '通过沉淀、螯合、氧化还原等机制转化汞、镉、铅等重金属',
  },
  {
    tag: 'synthetic_biology_chassis',
    dimension: 'biotechnology',
    description: '作为合成生物学的底盘生物进行遗传改造',
    scientificBackground: '大肠杆菌、酿酒酵母是最成熟的底盘生物，支撑代谢工程创新',
  },
  {
    tag: 'recombinant_protein_host',
    dimension: 'biotechnology',
    description: '高效表达异源重组蛋白',
    scientificBackground: '毕赤酵母、CHO细胞等用于生产胰岛素、单克隆抗体等生物药',
  },
  {
    tag: 'symbiont',
    dimension: 'ecology',
    description: '与宿主建立互惠共生关系',
    scientificBackground: '根瘤菌-豆科植物共生固氮，是可持续农业的典范',
  },
  {
    tag: 'probiotic',
    dimension: 'ecology',
    description: '对宿主健康有益的活体微生物',
    scientificBackground: '乳酸菌和双歧杆菌调节肠道菌群，增强免疫，降低疾病风险',
  },
  {
    tag: 'decomposer',
    dimension: 'ecology',
    description: '分解动植物残体和有机废物',
    scientificBackground: '腐生微生物是生态系统的分解者，完成物质循环的最后一步',
  },
  {
    tag: 'carbon_fixation',
    dimension: 'ecology',
    description: '将无机CO2转化为有机碳化合物',
    scientificBackground: '卡尔文循环、还原乙酰-CoA途径等6种固碳途径，支持全球初级生产力',
  },
  {
    tag: 'pathogenic',
    dimension: 'pathogenicity',
    description: '能够引起宿主疾病的微生物',
    scientificBackground: '鼠疫、霍乱、结核等历史上的瘟疫病原体改变了人类历史进程',
  },
  {
    tag: 'opportunistic_pathogen',
    dimension: 'pathogenicity',
    description: '在免疫力低下时引起感染',
    scientificBackground: '医院感染的主要病原体，铜绿假单胞菌、白色念珠菌是典型代表',
  },
  {
    tag: 'toxin_production',
    dimension: 'pathogenicity',
    description: '产生对宿主细胞有毒性的蛋白质或小分子',
    scientificBackground: '肉毒素、霍乱肠毒素、炭疽毒素是已知最毒的生物活性物质',
  },
  {
    tag: 'biofilm_virulence',
    dimension: 'pathogenicity',
    description: '通过生物膜形成增强致病能力',
    scientificBackground: '导管相关感染、囊性纤维化肺部感染与生物膜密切相关',
  },
  {
    tag: 'antibiotic_resistant',
    dimension: 'pathogenicity',
    description: '对一种或多种抗生素产生耐药性',
    scientificBackground: 'MRSA、耐碳青霉烯肠杆菌等超级细菌是全球公共卫生威胁',
  },
  {
    tag: 'intracellular_parasite',
    dimension: 'pathogenicity',
    description: '在宿主细胞内增殖的寄生微生物',
    scientificBackground: '结核分枝杆菌、衣原体等在巨噬细胞内逃避免疫攻击',
  },
  {
    tag: 'antimicrobial_activity',
    dimension: 'medicine',
    description: '产生抑制或杀灭病原微生物的活性物质',
    scientificBackground: '青霉素的发现开启了抗生素时代，拯救了数亿人的生命',
  },
  {
    tag: 'immunomodulatory',
    dimension: 'medicine',
    description: '调节宿主免疫系统功能',
    scientificBackground: '益生菌、灵芝多糖通过肠道相关淋巴组织调节全身免疫',
  },
  {
    tag: 'antitumor',
    dimension: 'medicine',
    description: '具有抑制肿瘤细胞生长的活性',
    scientificBackground: '灵芝三萜、卡介苗、溶瘤病毒用于肿瘤免疫治疗',
  },
  {
    tag: 'vaccine_vector',
    dimension: 'medicine',
    description: '作为疫苗递送载体表达外源抗原',
    scientificBackground: '腺病毒、减毒牛痘病毒用于新冠疫苗和基因治疗',
  },
  {
    tag: 'phage_therapy',
    dimension: 'medicine',
    description: '利用噬菌体治疗细菌感染',
    scientificBackground: '噬菌体疗法在抗生素耐药时代重新受到重视',
  },
];

export const microbeAbilityProfiles: MicrobeAbilityProfile[] = [
  {
    microbeId: 1,
    microbeName: '大肠杆菌',
    abilities: [
      { tag: 'fermentation', strength: 0.9, evidence: '混合酸发酵途径，代谢工程首选底盘' },
      { tag: 'aerobic_respiration', strength: 0.85, evidence: '完整的电子传递链系统' },
      { tag: 'anaerobic_respiration', strength: 0.7, evidence: '硝酸盐、延胡索酸呼吸途径' },
      { tag: 'vitamin_synthesis', strength: 0.75, evidence: '肠道中合成维生素K和B族' },
      { tag: 'synthetic_biology_chassis', strength: 0.95, evidence: '分子生物学和合成生物学最成熟底盘' },
      { tag: 'recombinant_protein_host', strength: 0.9, evidence: '重组蛋白表达的首选宿主' },
      { tag: 'biofilm_formation', strength: 0.6, evidence: '肠道黏膜和导管表面形成生物膜' },
      { tag: 'opportunistic_pathogen', strength: 0.5, evidence: 'O157:H7等血清型可致出血性肠炎' },
    ],
  },
  {
    microbeId: 2,
    microbeName: '金黄色葡萄球菌',
    abilities: [
      { tag: 'fermentation', strength: 0.75, evidence: '可发酵葡萄糖产乳酸' },
      { tag: 'aerobic_respiration', strength: 0.7, evidence: '兼性厌氧菌，有氧时生长更佳' },
      { tag: 'biofilm_formation', strength: 0.85, evidence: '医疗植入物生物膜的主要形成菌' },
      { tag: 'biofilm_virulence', strength: 0.9, evidence: '生物膜相关感染极难清除' },
      { tag: 'toxin_production', strength: 0.9, evidence: '肠毒素、中毒性休克综合征毒素、溶血素' },
      { tag: 'antibiotic_resistant', strength: 0.95, evidence: 'MRSA是全球最受关注的耐药菌' },
      { tag: 'opportunistic_pathogen', strength: 0.8, evidence: '皮肤和黏膜的常见条件致病菌' },
      { tag: 'desiccation_resistant', strength: 0.7, evidence: '干燥物体表面可存活数月' },
      { tag: 'osmotic_tolerant', strength: 0.75, evidence: '耐受高盐，可在高盐食品中生长' },
    ],
  },
  {
    microbeId: 3,
    microbeName: '枯草芽孢杆菌',
    abilities: [
      { tag: 'fermentation', strength: 0.85, evidence: '高效糖酵解和发酵能力' },
      { tag: 'aerobic_respiration', strength: 0.9, evidence: '严格好氧，呼吸链系统完善' },
      { tag: 'endospore_formation', strength: 0.95, evidence: '研究最透彻的孢子形成模式生物' },
      { tag: 'desiccation_resistant', strength: 0.9, evidence: '孢子可在极端干燥下存活数十年' },
      { tag: 'enzyme_production', strength: 0.9, evidence: '淀粉酶、蛋白酶的工业生产菌株' },
      { tag: 'probiotic', strength: 0.75, evidence: '农业和畜牧业中广泛使用的益生菌' },
      { tag: 'decomposer', strength: 0.8, evidence: '土壤中主要的有机物分解者' },
      { tag: 'thermophilic', strength: 0.5, evidence: '孢子可耐受高温但营养细胞为中温' },
    ],
  },
  {
    microbeId: 4,
    microbeName: '铜绿假单胞菌',
    abilities: [
      { tag: 'aerobic_respiration', strength: 0.95, evidence: '专性需氧，代谢能力极强' },
      { tag: 'denitrification', strength: 0.85, evidence: '厌氧条件下可进行完整反硝化' },
      { tag: 'sulfur_oxidation', strength: 0.7, evidence: '可利用硫化合物作为能源' },
      { tag: 'biofilm_formation', strength: 0.95, evidence: '模式生物膜形成菌，藻酸盐基质' },
      { tag: 'biofilm_virulence', strength: 0.95, evidence: '囊性纤维化患者慢性肺部感染主因' },
      { tag: 'pollutant_degradation', strength: 0.9, evidence: '降解多种芳香族化合物和烃类' },
      { tag: 'bioremediation', strength: 0.85, evidence: '石油污染和工业废水修复的候选菌' },
      { tag: 'heavy_metal_resistance', strength: 0.8, evidence: '耐受多种重金属，可转化汞镉' },
      { tag: 'opportunistic_pathogen', strength: 0.9, evidence: '医院感染排名前三的条件致病菌' },
      { tag: 'antibiotic_resistant', strength: 0.9, evidence: '天然多重耐药，易产生获得性耐药' },
    ],
  },
  {
    microbeId: 5,
    microbeName: '嗜酸乳杆菌',
    abilities: [
      { tag: 'fermentation', strength: 0.95, evidence: '同型乳酸发酵，产酸效率极高' },
      { tag: 'anaerobic_respiration', strength: 0.5, evidence: '微厌氧条件下有限呼吸' },
      { tag: 'organic_acid_production', strength: 0.9, evidence: '工业生产L-乳酸的主力菌株' },
      { tag: 'probiotic', strength: 0.95, evidence: '研究最深入的益生菌之一' },
      { tag: 'vitamin_synthesis', strength: 0.75, evidence: '合成叶酸、B族维生素' },
      { tag: 'polysaccharide_production', strength: 0.65, evidence: '产生胞外多糖保护自身和宿主' },
      { tag: 'symbiont', strength: 0.85, evidence: '人体肠道和阴道的正常共生菌' },
      { tag: 'immunomodulatory', strength: 0.8, evidence: '调节肠道黏膜免疫和系统免疫' },
      { tag: 'antimicrobial_activity', strength: 0.75, evidence: '产细菌素和有机酸抑制病原菌' },
      { tag: 'acidophilic', strength: 0.7, evidence: '适应低pH环境，最适pH 5-6' },
    ],
  },
  {
    microbeId: 6,
    microbeName: '结核分枝杆菌',
    abilities: [
      { tag: 'aerobic_respiration', strength: 0.65, evidence: '专性需氧但生长速率缓慢' },
      { tag: 'anaerobic_respiration', strength: 0.55, evidence: '潜伏感染期可进行有限的厌氧代谢' },
      { tag: 'intracellular_parasite', strength: 0.95, evidence: '在巨噬细胞内生存繁殖的典范' },
      { tag: 'pathogenic', strength: 0.95, evidence: '结核病病原体，全球十大死因之一' },
      { tag: 'toxin_production', strength: 0.5, evidence: '分枝菌酸和TDM等毒力脂质' },
      { tag: 'antibiotic_resistant', strength: 0.85, evidence: '天然耐药加上MDR和XDR结核的出现' },
      { tag: 'biofilm_formation', strength: 0.6, evidence: '体外可形成生物膜与致病力相关' },
      { tag: 'desiccation_resistant', strength: 0.8, evidence: '痰液干燥后仍保持感染性' },
    ],
  },
  {
    microbeId: 7,
    microbeName: '霍乱弧菌',
    abilities: [
      { tag: 'fermentation', strength: 0.75, evidence: '发酵糖类产酸不产气' },
      { tag: 'aerobic_respiration', strength: 0.85, evidence: '兼性厌氧，呼吸代谢活跃' },
      { tag: 'anaerobic_respiration', strength: 0.6, evidence: '可利用多种电子受体' },
      { tag: 'pathogenic', strength: 0.95, evidence: '霍乱病原体，引起烈性肠道传染病' },
      { tag: 'toxin_production', strength: 0.95, evidence: '霍乱肠毒素是已知最强致泻毒素' },
      { tag: 'biofilm_formation', strength: 0.8, evidence: '水生环境中形成生物膜持久存活' },
      { tag: 'biofilm_virulence', strength: 0.75, evidence: '生物膜形式更易引起爆发感染' },
      { tag: 'osmotic_tolerant', strength: 0.7, evidence: '咸淡水交界的河口环境生存' },
      { tag: 'alkaliphilic', strength: 0.55, evidence: '可在pH 9-10的碱性水中存活' },
    ],
  },
  {
    microbeId: 8,
    microbeName: '双歧杆菌',
    abilities: [
      { tag: 'fermentation', strength: 0.95, evidence: '独特的双歧发酵途径，产生乙酸和乳酸' },
      { tag: 'anaerobic_respiration', strength: 0.45, evidence: '严格厌氧，呼吸活动有限' },
      { tag: 'organic_acid_production', strength: 0.85, evidence: '发酵产乙酸维持肠道酸性' },
      { tag: 'probiotic', strength: 0.95, evidence: '人体健康最重要的益生菌代表' },
      { tag: 'vitamin_synthesis', strength: 0.8, evidence: '合成多种B族维生素和叶酸' },
      { tag: 'polysaccharide_production', strength: 0.75, evidence: '产生胞外多糖参与免疫调节' },
      { tag: 'symbiont', strength: 0.9, evidence: '母乳喂养婴儿肠道优势共生菌' },
      { tag: 'immunomodulatory', strength: 0.85, evidence: '激活肠道免疫，抗过敏作用' },
      { tag: 'antitumor', strength: 0.7, evidence: '增强抗肿瘤免疫的研究证据' },
      { tag: 'antimicrobial_activity', strength: 0.8, evidence: '双歧菌素和有机酸抑制有害菌' },
    ],
  },
  {
    microbeId: 9,
    microbeName: '酿酒酵母',
    abilities: [
      { tag: 'fermentation', strength: 0.98, evidence: '酒精发酵的模式生物，最早驯化微生物' },
      { tag: 'aerobic_respiration', strength: 0.9, evidence: 'Crabtree效应，葡萄糖高时倾向发酵' },
      { tag: 'organic_acid_production', strength: 0.75, evidence: '少量有机酸和酯类赋予发酵风味' },
      { tag: 'vitamin_synthesis', strength: 0.7, evidence: '酵母本身富含B族维生素' },
      { tag: 'polysaccharide_production', strength: 0.6, evidence: '产葡聚糖和甘露聚糖' },
      { tag: 'synthetic_biology_chassis', strength: 0.95, evidence: '真核生物底盘的金标准' },
      { tag: 'recombinant_protein_host', strength: 0.85, evidence: '毕赤酵母近缘，表达真核蛋白' },
      { tag: 'enzyme_production', strength: 0.65, evidence: '生产转化酶和多种代谢酶' },
      { tag: 'decomposer', strength: 0.7, evidence: '水果表面和发酵食品中的腐生真菌' },
      { tag: 'probiotic', strength: 0.55, evidence: '灭活酵母也有肠道调节作用' },
    ],
  },
  {
    microbeId: 10,
    microbeName: '黑曲霉',
    abilities: [
      { tag: 'fermentation', strength: 0.85, evidence: '多糖分解和糖酵解能力强' },
      { tag: 'aerobic_respiration', strength: 0.95, evidence: '严格好氧，工业深层发酵需大量通气' },
      { tag: 'anaerobic_respiration', strength: 0.6, evidence: '有限的厌氧代谢能力' },
      { tag: 'organic_acid_production', strength: 0.98, evidence: '全球柠檬酸生产的绝对主力菌株' },
      { tag: 'enzyme_production', strength: 0.95, evidence: '糖化酶、淀粉酶、脂肪酶、植酸酶' },
      { tag: 'cellulose_degradation', strength: 0.8, evidence: '分泌完整的纤维素酶系' },
      { tag: 'lignin_degradation', strength: 0.65, evidence: '产生漆酶和过氧化物酶' },
      { tag: 'decomposer', strength: 0.9, evidence: '土壤和腐败物中最常见的分解真菌' },
      { tag: 'recombinant_protein_host', strength: 0.8, evidence: '强大的分泌系统用于工业酶表达' },
      { tag: 'polysaccharide_production', strength: 0.55, evidence: '产生胞外多糖' },
      { tag: 'heavy_metal_resistance', strength: 0.6, evidence: '生物吸附重金属离子' },
    ],
  },
  {
    microbeId: 11,
    microbeName: '产黄青霉',
    abilities: [
      { tag: 'fermentation', strength: 0.7, evidence: '糖类发酵和基础代谢' },
      { tag: 'aerobic_respiration', strength: 0.85, evidence: '青霉菌素生产需要严格好氧条件' },
      { tag: 'antibiotic_production', strength: 0.99, evidence: '青霉素的发现者和工业生产菌，医学史上最重要' },
      { tag: 'antimicrobial_activity', strength: 0.95, evidence: '青霉素抑制革兰阳性菌细胞壁合成' },
      { tag: 'enzyme_production', strength: 0.75, evidence: '青霉素酰化酶等多种工业酶' },
      { tag: 'cellulose_degradation', strength: 0.75, evidence: '分泌纤维素酶分解植物残体' },
      { tag: 'lignin_degradation', strength: 0.6, evidence: '木质纤维素分解能力' },
      { tag: 'decomposer', strength: 0.85, evidence: '土壤中常见的有机物分解者' },
      { tag: 'polysaccharide_production', strength: 0.5, evidence: '产生多种胞外多糖' },
      { tag: 'bioremediation', strength: 0.6, evidence: '可降解某些有机污染物' },
    ],
  },
  {
    microbeId: 12,
    microbeName: '白色念珠菌',
    abilities: [
      { tag: 'fermentation', strength: 0.75, evidence: '酵母态发酵糖类产酒精' },
      { tag: 'aerobic_respiration', strength: 0.8, evidence: '菌丝态活跃的呼吸代谢' },
      { tag: 'biofilm_formation', strength: 0.9, evidence: '医疗导管和黏膜表面生物膜形成' },
      { tag: 'biofilm_virulence', strength: 0.9, evidence: '生物膜相关念珠菌病治疗困难' },
      { tag: 'opportunistic_pathogen', strength: 0.9, evidence: '最常见的深部真菌感染病原体' },
      { tag: 'antibiotic_resistant', strength: 0.7, evidence: '对唑类药物耐药率上升' },
      { tag: 'symbiont', strength: 0.6, evidence: '正常黏膜表面的共生酵母' },
      { tag: 'polysaccharide_production', strength: 0.75, evidence: '生物膜基质多糖合成' },
      { tag: 'osmotic_tolerant', strength: 0.65, evidence: '可在高渗透压环境存活' },
    ],
  },
  {
    microbeId: 13,
    microbeName: '双孢蘑菇',
    abilities: [
      { tag: 'fermentation', strength: 0.8, evidence: '堆肥发酵阶段活跃的分解代谢' },
      { tag: 'aerobic_respiration', strength: 0.85, evidence: '子实体发育需要充足氧气' },
      { tag: 'cellulose_degradation', strength: 0.9, evidence: '高效分解秸秆等农业废弃物' },
      { tag: 'lignin_degradation', strength: 0.75, evidence: '木质素降解完成堆肥腐熟' },
      { tag: 'decomposer', strength: 0.95, evidence: '草腐生真菌的代表，参与碳循环' },
      { tag: 'enzyme_production', strength: 0.7, evidence: '分泌木质纤维素酶系' },
      { tag: 'organic_acid_production', strength: 0.6, evidence: '产生有机酸促进堆肥腐熟' },
      { tag: 'polysaccharide_production', strength: 0.7, evidence: '子实体含有丰富的真菌多糖' },
      { tag: 'immunomodulatory', strength: 0.65, evidence: '蘑菇多糖的免疫调节作用' },
      { tag: 'vitamin_synthesis', strength: 0.6, evidence: '子实体富含维生素D和B族' },
    ],
  },
  {
    microbeId: 14,
    microbeName: '灵芝',
    abilities: [
      { tag: 'fermentation', strength: 0.65, evidence: '深层液体发酵用于菌丝体生产' },
      { tag: 'aerobic_respiration', strength: 0.8, evidence: '子实体发育和次生代谢需氧' },
      { tag: 'lignin_degradation', strength: 0.85, evidence: '木腐生真菌，分解阔叶树材' },
      { tag: 'cellulose_degradation', strength: 0.75, evidence: '纤维素半纤维素降解酶系' },
      { tag: 'decomposer', strength: 0.85, evidence: '森林木材分解者，参与木质素循环' },
      { tag: 'polysaccharide_production', strength: 0.95, evidence: '灵芝多糖是核心药效成分' },
      { tag: 'enzyme_production', strength: 0.65, evidence: '漆酶和木质素酶系' },
      { tag: 'antitumor', strength: 0.9, evidence: '灵芝多糖和三萜的抗肿瘤活性' },
      { tag: 'immunomodulatory', strength: 0.95, evidence: '增强宿主免疫，传统名药' },
      { tag: 'antimicrobial_activity', strength: 0.6, evidence: '提取物具有抗菌抗病毒活性' },
      { tag: 'vitamin_synthesis', strength: 0.55, evidence: '子实体含多种维生素和矿物质' },
    ],
  },
  {
    microbeId: 15,
    microbeName: 'T4噬菌体',
    abilities: [
      { tag: 'pathogenic', strength: 0.8, evidence: '烈性噬菌体，裂解大肠杆菌' },
      { tag: 'phage_therapy', strength: 0.85, evidence: '模式噬菌体，抗菌应用研究的原型' },
      { tag: 'antimicrobial_activity', strength: 0.9, evidence: '特异性裂解宿主菌' },
      { tag: 'toxin_production', strength: 0.4, evidence: '噬菌体自身不产毒素，但可携带毒素基因' },
      { tag: 'synthetic_biology_chassis', strength: 0.75, evidence: '噬菌体展示技术和合成生物学工具' },
      { tag: 'vaccine_vector', strength: 0.5, evidence: '噬菌体展示疫苗平台' },
    ],
  },
  {
    microbeId: 16,
    microbeName: '烟草花叶病毒',
    abilities: [
      { tag: 'pathogenic', strength: 0.85, evidence: '烟草花叶病病原体，植物病毒学鼻祖' },
      { tag: 'synthetic_biology_chassis', strength: 0.8, evidence: '纳米材料和疫苗载体的研究热点' },
      { tag: 'vaccine_vector', strength: 0.75, evidence: 'TMV纳米颗粒用于疫苗抗原展示' },
      { tag: 'recombinant_protein_host', strength: 0.7, evidence: '植物生物反应器，瞬时表达外源蛋白' },
    ],
  },
  {
    microbeId: 17,
    microbeName: '流感病毒',
    abilities: [
      { tag: 'pathogenic', strength: 0.95, evidence: '流行性感冒病原体，每年造成数十万死亡' },
      { tag: 'toxin_production', strength: 0.6, evidence: 'NA和HA等表面蛋白的致细胞病变效应' },
      { tag: 'antibiotic_resistant', strength: 0.7, evidence: '对金刚烷胺类耐药率极高' },
      { tag: 'intracellular_parasite', strength: 0.95, evidence: '完全依赖宿主细胞合成系统' },
      { tag: 'vaccine_vector', strength: 0.5, evidence: '减毒流感病毒作为呼吸道疫苗载体' },
    ],
  },
  {
    microbeId: 18,
    microbeName: '新冠病毒',
    abilities: [
      { tag: 'pathogenic', strength: 0.95, evidence: 'COVID-19病原体，全球大流行' },
      { tag: 'toxin_production', strength: 0.75, evidence: 'Spike蛋白和ORF3a等致细胞病变' },
      { tag: 'intracellular_parasite', strength: 0.95, evidence: '利用ACE2受体入侵并重塑宿主细胞' },
      { tag: 'biofilm_formation', strength: 0.4, evidence: '呼吸道黏液层中的病毒颗粒聚集' },
      { tag: 'vaccine_vector', strength: 0.6, evidence: '灭活和mRNA疫苗平台的成功案例' },
      { tag: 'antibiotic_resistant', strength: 0.6, evidence: '病毒突变逃逸中和抗体' },
    ],
  },
  {
    microbeId: 19,
    microbeName: '人类免疫缺陷病毒',
    abilities: [
      { tag: 'pathogenic', strength: 0.98, evidence: 'AIDS病原体，持续破坏免疫系统' },
      { tag: 'intracellular_parasite', strength: 0.98, evidence: '逆转录整合到宿主染色体，永久潜伏' },
      { tag: 'antibiotic_resistant', strength: 0.9, evidence: '高突变率导致抗病毒药物耐药' },
      { tag: 'toxin_production', strength: 0.65, evidence: 'GP120、Tat、Rev等多种毒力因子' },
      { tag: 'synthetic_biology_chassis', strength: 0.65, evidence: '基于HIV的慢病毒载体用于基因治疗' },
      { tag: 'vaccine_vector', strength: 0.7, evidence: 'SIV/HIV载体平台用于疫苗研发' },
    ],
  },
  {
    microbeId: 20,
    microbeName: '腺病毒',
    abilities: [
      { tag: 'pathogenic', strength: 0.55, evidence: '多数引起轻微呼吸道和眼部感染' },
      { tag: 'intracellular_parasite', strength: 0.9, evidence: '细胞核内复制，高效劫持转录翻译' },
      { tag: 'vaccine_vector', strength: 0.95, evidence: '新冠疫苗和基因治疗最常用的病毒载体' },
      { tag: 'recombinant_protein_host', strength: 0.85, evidence: '哺乳动物细胞中高效表达重组蛋白' },
      { tag: 'synthetic_biology_chassis', strength: 0.8, evidence: '溶瘤腺病毒用于肿瘤靶向治疗' },
      { tag: 'antitumor', strength: 0.75, evidence: '溶瘤病毒选择性杀伤肿瘤细胞' },
    ],
  },
  {
    microbeId: 21,
    microbeName: '詹氏甲烷球菌',
    abilities: [
      { tag: 'methanogenesis', strength: 0.95, evidence: '产甲烷古菌的模式生物' },
      { tag: 'anaerobic_respiration', strength: 0.95, evidence: '严格厌氧，CO2/H2产甲烷呼吸' },
      { tag: 'thermophilic', strength: 0.95, evidence: '最适85°C，深海热泉分离' },
      { tag: 'barophilic', strength: 0.85, evidence: '2600米深海分离，适应高压' },
      { tag: 'nitrogen_fixation', strength: 0.7, evidence: '高温固氮酶系统可固氮' },
      { tag: 'sulfate_reduction', strength: 0.55, evidence: '辅助硫代谢途径' },
      { tag: 'carbon_fixation', strength: 0.85, evidence: '乙酰-CoA途径固定CO2' },
      { tag: 'chemosynthesis', strength: 0.9, evidence: '化能自养型古菌' },
      { tag: 'enzyme_production', strength: 0.75, evidence: '嗜热酶用于工业和分子生物学' },
      { tag: 'decomposer', strength: 0.7, evidence: '厌氧环境有机质降解终端' },
    ],
  },
  {
    microbeId: 22,
    microbeName: '嗜酸热硫化叶菌',
    abilities: [
      { tag: 'thermophilic', strength: 0.95, evidence: '最适75-80°C，火山热泉分离' },
      { tag: 'acidophilic', strength: 0.95, evidence: '最适pH 2-3，极端嗜酸' },
      { tag: 'sulfur_oxidation', strength: 0.98, evidence: '高效氧化硫和硫化物获取能量' },
      { tag: 'chemosynthesis', strength: 0.95, evidence: '硫氧化驱动化能自养' },
      { tag: 'carbon_fixation', strength: 0.8, evidence: '3-HP/4-HB循环固定CO2' },
      { tag: 'aerobic_respiration', strength: 0.85, evidence: '好氧条件下进行硫氧化呼吸' },
      { tag: 'nitrification', strength: 0.5, evidence: '有限的氨氧化能力' },
      { tag: 'heavy_metal_resistance', strength: 0.85, evidence: '酸性热泉中天然耐受重金属' },
      { tag: 'bioremediation', strength: 0.8, evidence: '生物冶金用于铜金铀矿浸出' },
      { tag: 'enzyme_production', strength: 0.8, evidence: '嗜热嗜酸酶用于工业催化' },
    ],
  },
  {
    microbeId: 23,
    microbeName: '盐生盐杆菌',
    abilities: [
      { tag: 'halophilic', strength: 0.99, evidence: '需2.5M以上NaCl，最适接近饱和' },
      { tag: 'osmotic_tolerant', strength: 0.95, evidence: '累积KCl平衡渗透压' },
      { tag: 'photosynthesis', strength: 0.9, evidence: '细菌视紫红质光驱动质子泵，不依赖叶绿素' },
      { tag: 'aerobic_respiration', strength: 0.8, evidence: '黑暗条件下有氧呼吸供能' },
      { tag: 'anaerobic_respiration', strength: 0.6, evidence: '厌氧条件下可利用氨基酸' },
      { tag: 'radiation_resistant', strength: 0.8, evidence: '高盐环境增强紫外线耐受' },
      { tag: 'polysaccharide_production', strength: 0.65, evidence: '产生胞外聚合物适应高盐' },
      { tag: 'enzyme_production', strength: 0.75, evidence: '嗜盐酶用于高盐废水处理' },
      { tag: 'synthetic_biology_chassis', strength: 0.6, evidence: '独特蛋白翻译后修饰系统' },
      { tag: 'desiccation_resistant', strength: 0.8, evidence: '高盐环境下可长期存活' },
    ],
  },
  {
    microbeId: 24,
    microbeName: '激烈火球菌',
    abilities: [
      { tag: 'thermophilic', strength: 0.98, evidence: '最适100°C，已知最嗜热生物之一' },
      { tag: 'barophilic', strength: 0.9, evidence: '深海火山分离，天然嗜压' },
      { tag: 'anaerobic_respiration', strength: 0.95, evidence: '严格厌氧，元素硫呼吸' },
      { tag: 'sulfate_reduction', strength: 0.95, evidence: '高效硫酸盐还原产H2S' },
      { tag: 'fermentation', strength: 0.9, evidence: '高温改良型糖酵解途径' },
      { tag: 'methanotrophy', strength: 0.55, evidence: 'C1化合物代谢能力' },
      { tag: 'enzyme_production', strength: 0.95, evidence: 'Pfu DNA聚合酶是高保真PCR首选' },
      { tag: 'synthetic_biology_chassis', strength: 0.6, evidence: '嗜热代谢工程研究的底盘' },
      { tag: 'radiation_resistant', strength: 0.6, evidence: 'DNA修复系统高效' },
      { tag: 'desiccation_resistant', strength: 0.5, evidence: '蛋白和核酸热稳定性高' },
    ],
  },
  {
    microbeId: 25,
    microbeName: '炭疽杆菌',
    abilities: [
      { tag: 'fermentation', strength: 0.75, evidence: '孢子萌发后的活跃代谢' },
      { tag: 'aerobic_respiration', strength: 0.8, evidence: '兼性厌氧，感染组织中活跃呼吸' },
      { tag: 'endospore_formation', strength: 0.98, evidence: '炭疽孢子是生物恐怖威胁的代表' },
      { tag: 'desiccation_resistant', strength: 0.98, evidence: '孢子在土壤中存活数十年' },
      { tag: 'pathogenic', strength: 0.95, evidence: '炭疽病病原体，高致死率' },
      { tag: 'toxin_production', strength: 0.95, evidence: '致死毒素、水肿毒素、荚膜三毒力因子' },
      { tag: 'intracellular_parasite', strength: 0.75, evidence: '可在巨噬细胞内短暂存活并繁殖' },
      { tag: 'heavy_metal_resistance', strength: 0.4, evidence: '对某些重金属有耐受' },
    ],
  },
  {
    microbeId: 26,
    microbeName: '狂犬病毒',
    abilities: [
      { tag: 'pathogenic', strength: 0.99, evidence: '发病后死亡率几乎100%，最致命病毒' },
      { tag: 'intracellular_parasite', strength: 0.98, evidence: '严格嗜神经性，沿外周神经向中枢扩散' },
      { tag: 'toxin_production', strength: 0.7, evidence: 'G蛋白和P蛋白干扰神经信号传导' },
      { tag: 'vaccine_vector', strength: 0.75, evidence: '减毒狂犬病毒株用于狂犬病疫苗' },
      { tag: 'antibiotic_resistant', strength: 0.5, evidence: '目前无特效抗病毒药物' },
    ],
  },
  {
    microbeId: 27,
    microbeName: '蕈状支原体',
    abilities: [
      { tag: 'fermentation', strength: 0.7, evidence: '简化糖酵解途径' },
      { tag: 'anaerobic_respiration', strength: 0.55, evidence: '极简能量代谢系统' },
      { tag: 'pathogenic', strength: 0.5, evidence: '反刍动物呼吸道病原体' },
      { tag: 'opportunistic_pathogen', strength: 0.55, evidence: '某些株可引起乳腺感染' },
      { tag: 'synthetic_biology_chassis', strength: 0.95, evidence: '首个合成基因组细胞"辛西娅"的基础' },
      { tag: 'osmotic_tolerant', strength: 0.6, evidence: '无细胞壁需特殊渗透压环境' },
      { tag: 'recombinant_protein_host', strength: 0.6, evidence: '研究最小基因组的表达系统' },
    ],
  },
];

export function getAbilityTagsByDimension(dimension: AbilityDimension): AbilityTagInfo[] {
  return abilityTagInfos.filter((info) => info.dimension === dimension);
}

export function getAbilityTagInfo(tag: AbilityTag): AbilityTagInfo | undefined {
  return abilityTagInfos.find((info) => info.tag === tag);
}

export function getMicrobeAbilityProfile(microbeId: number): MicrobeAbilityProfile | undefined {
  return microbeAbilityProfiles.find((p) => p.microbeId === microbeId);
}

export function getMicrobesByAbility(tag: AbilityTag): { microbeId: number; strength: number; evidence: string }[] {
  const result: { microbeId: number; strength: number; evidence: string }[] = [];
  for (const profile of microbeAbilityProfiles) {
    const ability = profile.abilities.find((a) => a.tag === tag);
    if (ability) {
      result.push({ microbeId: profile.microbeId, strength: ability.strength, evidence: ability.evidence });
    }
  }
  return result.sort((a, b) => b.strength - a.strength);
}

export function getAbilityRank(sortBy: 'count' | 'totalStrength' | 'avgStrength' = 'count') {
  const tagMap = new Map<AbilityTag, { total: number; count: number; dimension: AbilityDimension }>();

  for (const profile of microbeAbilityProfiles) {
    for (const ability of profile.abilities) {
      const info = getAbilityTagInfo(ability.tag);
      if (!info) continue;
      const existing = tagMap.get(ability.tag) || { total: 0, count: 0, dimension: info.dimension };
      existing.total += ability.strength;
      existing.count += 1;
      tagMap.set(ability.tag, existing);
    }
  }

  const ranks = Array.from(tagMap.entries()).map(([tag, data]) => ({
    tag,
    microbeCount: data.count,
    totalStrength: data.total,
    avgStrength: data.count > 0 ? data.total / data.count : 0,
    dimension: data.dimension,
  }));

  if (sortBy === 'count') {
    ranks.sort((a, b) => b.microbeCount - a.microbeCount);
  } else if (sortBy === 'totalStrength') {
    ranks.sort((a, b) => b.totalStrength - a.totalStrength);
  } else {
    ranks.sort((a, b) => b.avgStrength - a.avgStrength);
  }

  return ranks;
}

export function getAbilityAssociations(): AbilityAssociation[] {
  const cooccurrence = new Map<string, { count: number; microbeIds: Set<number> }>();
  const tagCounts = new Map<AbilityTag, number>();

  for (const profile of microbeAbilityProfiles) {
    const tags = profile.abilities.map((a) => a.tag);
    for (const tag of tags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
    for (let i = 0; i < tags.length; i++) {
      for (let j = i + 1; j < tags.length; j++) {
        const key = [tags[i], tags[j]].sort().join('||');
        const entry = cooccurrence.get(key) || { count: 0, microbeIds: new Set() };
        entry.count += 1;
        entry.microbeIds.add(profile.microbeId);
        cooccurrence.set(key, entry);
      }
    }
  }

  const associations: AbilityAssociation[] = [];
  const totalMicrobes = microbeAbilityProfiles.length;

  for (const [key, data] of cooccurrence.entries()) {
    const [tag1, tag2] = key.split('||') as [AbilityTag, AbilityTag];
    const count1 = tagCounts.get(tag1) || 0;
    const count2 = tagCounts.get(tag2) || 0;
    const expected = (count1 * count2) / totalMicrobes;
    const lift = expected > 0 ? data.count / expected : 0;

    const info1 = getAbilityTagInfo(tag1);
    const info2 = getAbilityTagInfo(tag2);
    const sameDimension = info1 && info2 && info1.dimension === info2.dimension;

    let description = '';
    if (sameDimension) {
      description = `同属${ABILITY_DIMENSION_DESCRIPTIONS[info1!.dimension].slice(0, 10)}维度的相关能力`;
    } else if (lift > 1.5) {
      description = `高正相关，具有此能力的微生物常同时具备另一项能力`;
    } else if (lift > 1.1) {
      description = `中等正相关，常出现在同一微生物中`;
    } else {
      description = `弱关联，共现频率接近随机`;
    }

    associations.push({
      tag1,
      tag2,
      cooccurrenceCount: data.count,
      correlationScore: Math.min(lift, 3) / 3,
      description,
    });
  }

  return associations.sort((a, b) => b.correlationScore - a.correlationScore);
}

export function getAbilityAssociationsForTag(tag: AbilityTag): AbilityAssociation[] {
  const all = getAbilityAssociations();
  return all.filter((a) => a.tag1 === tag || a.tag2 === tag).sort(
    (a, b) => b.correlationScore - a.correlationScore,
  );
}

export function getDimensionSummary() {
  const dims: Record<
    AbilityDimension,
    { tagCount: number; microbeCount: number; totalAbilities: number; avgAbilitiesPerMicrobe: number }
  > = {} as any;

  const allDimensions: AbilityDimension[] = [
    'metabolism',
    'environment',
    'biotechnology',
    'ecology',
    'pathogenicity',
    'medicine',
  ];

  for (const dim of allDimensions) {
    const dimTags = getAbilityTagsByDimension(dim).map((t) => t.tag);
    const microbeSet = new Set<number>();
    let totalAbilities = 0;

    for (const profile of microbeAbilityProfiles) {
      const matches = profile.abilities.filter((a) => dimTags.includes(a.tag));
      if (matches.length > 0) {
        microbeSet.add(profile.microbeId);
        totalAbilities += matches.length;
      }
    }

    dims[dim] = {
      tagCount: dimTags.length,
      microbeCount: microbeSet.size,
      totalAbilities,
      avgAbilitiesPerMicrobe: microbeSet.size > 0 ? totalAbilities / microbeSet.size : 0,
    };
  }

  return dims;
}

export { ABILITY_DIMENSION_COLORS };
