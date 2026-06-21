import type { DigitalSpecimen } from '../../shared/types';

export const digitalSpecimens: DigitalSpecimen[] = [
  {
    id: 1,
    microbeId: 1,
    specimenCode: 'SPEC-BACT-0001',
    collectionDate: '1885-03-15',
    collectionLocation: '德国慕尼黑',
    collector: 'Theodor Escherich',
    preservationMethod: '冷冻干燥',
    storageConditions: '-80°C 超低温冷冻',
    accessionNumber: 'DSM-30083',
    taxonomicClassification: {
      kingdom: 'Bacteria',
      phylum: 'Pseudomonadota',
      class: 'Gammaproteobacteria',
      order: 'Enterobacterales',
      family: 'Enterobacteriaceae',
      genus: 'Escherichia',
      species: 'Escherichia coli',
    },
    morphology: {
      cellShape: '杆状',
      cellSize: '0.5-1.0 μm × 2.0-4.0 μm',
      gramStain: 'negative',
      motility: true,
      sporeFormation: false,
      capsule: true,
      arrangement: '单个或成对',
      specialFeatures: ['周生鞭毛', '性菌毛', '荚膜'],
      detailedFeatures: [
        { id: 'mf-1', label: '细胞壁', value: '革兰氏阴性', description: '由外膜、肽聚糖薄层和细胞质膜组成，外膜含脂多糖LPS', icon: 'wall' },
        { id: 'mf-2', label: '鞭毛', value: '4-8根周生', description: '通过旋转鞭毛实现运动，速度可达30μm/s', icon: 'move' },
        { id: 'mf-3', label: '菌毛', value: '多种类型', description: '普通菌毛介导黏附，性菌毛参与接合生殖', icon: 'link' },
        { id: 'mf-4', label: '核区', value: '环状DNA', description: '基因组约4.6Mb，含约4300个基因', icon: 'dna' },
      ],
    },
    habitat: {
      id: 'hab-1',
      type: '肠道/环境',
      description: '主要栖息于恒温动物的下肠道，也可在粪便污染的环境中短暂存活',
      temperature: [36, 42],
      phRange: [5.5, 8.0],
      salinity: '0-0.5% NaCl',
      oxygenRequirement: 'facultative',
      commonLocations: ['人类结肠', '温血动物肠道', '污染水体', '土壤（粪便污染）'],
      ecologicalRole: '肠道共生菌，参与维生素K合成，抑制病原菌定植',
    },
    discoveryTimeline: [
      { id: 'dt-1', year: 1885, title: '首次分离', description: '从健康婴儿粪便中分离出该细菌', discoverer: 'Theodor Escherich', significance: '首次描述了这种共生于肠道的细菌' },
      { id: 'dt-2', year: 1946, title: '发现细菌接合', description: '发现大肠杆菌可通过性菌毛进行基因转移', discoverer: 'Joshua Lederberg', significance: '开启了细菌遗传学研究的新时代' },
      { id: 'dt-3', year: 1973, title: '基因工程奠基', description: '首次使用大肠杆菌作为重组DNA表达宿主', discoverer: 'Herbert Boyer & Stanley Cohen', significance: '标志着现代生物技术时代的开始' },
      { id: 'dt-4', year: 1997, title: '基因组测序完成', description: 'K-12菌株基因组测序完成', discoverer: 'Blattner等人', significance: '成为首个完成全基因组测序的细菌之一' },
    ],
    metabolicCapabilities: [
      { id: 'mc-1', name: '混合酸发酵', category: 'fermentation', efficiency: 85, description: '厌氧条件下将葡萄糖转化为多种有机酸', substrates: ['葡萄糖', '磷酸烯醇式丙酮酸'], products: ['乳酸', '乙酸', '甲酸', '乙醇'], keyEnzymes: ['乳酸脱氢酶', '丙酮酸甲酸裂解酶', '乙醛脱氢酶'] },
      { id: 'mc-2', name: '有氧呼吸', category: 'aerobic_respiration', efficiency: 95, description: '三羧酸循环完全氧化有机物', substrates: ['丙酮酸', '乙酰-CoA'], products: ['CO2', 'H2O', 'ATP'], keyEnzymes: ['丙酮酸脱氢酶', '柠檬酸合酶', '细胞色素氧化酶'] },
      { id: 'mc-3', name: '硝酸盐呼吸', category: 'anaerobic_respiration', efficiency: 70, description: '以硝酸盐作为最终电子受体', substrates: ['硝酸盐', 'NADH'], products: ['亚硝酸盐', 'NAD+'], keyEnzymes: ['硝酸盐还原酶NarGHJI'] },
    ],
    applications: [
      { id: 'ap-1', category: 'biopharmaceutical', title: '重组蛋白生产', description: '作为合成生物学首选底盘，生产各种重组蛋白和多肽药物', maturity: 'established', marketScale: '全球市场规模超千亿美元', keyAdvantages: ['生长迅速', '遗传操作成熟', '成本低廉', '表达量高'], caseStudies: [{ title: '重组人胰岛素', organization: 'Genentech', outcome: '1978年首次成功表达，开启了生物制药产业' }, { title: '干扰素生产', organization: '多家药企', outcome: '年产数十吨级干扰素用于抗病毒和抗肿瘤治疗' }] },
      { id: 'ap-2', category: 'biopharmaceutical', title: '疫苗开发', description: '利用减毒菌株或表达抗原蛋白制备疫苗', maturity: 'commercial', marketScale: '数十亿美元级市场', keyAdvantages: ['安全性可控', '免疫原性良好', '可口服递送'], caseStudies: [{ title: '霍乱疫苗', organization: 'WHO合作实验室', outcome: '口服霍乱疫苗保护率超60%' }] },
      { id: 'ap-3', category: 'agricultural_improvement', title: '生物燃料', description: '代谢工程改造生产乙醇、丁醇等生物燃料', maturity: 'pilot', marketScale: '中试示范阶段', keyAdvantages: ['底物利用谱广', '发酵周期短', '可连续发酵'], caseStudies: [{ title: '纤维素乙醇', organization: 'DOE生物能源中心', outcome: '吨级示范装置已完成试运行' }] },
    ],
    knowledgeCards: [
      { id: 'kc-1', type: 'morphology', title: '杆状细胞的精密几何', content: '大肠杆菌为何选择杆状？数学模型显示，杆状结构在营养吸收和分裂增殖之间达到最优平衡。比表面积比球形细胞高约30%，同时分裂时只需形成一个隔膜。', dataSource: 'Nature Reviews Microbiology', lastUpdated: '2025-11-10', tags: ['形态学', '生物物理', '细胞分裂'] },
      { id: 'kc-2', type: 'habitat', title: '肠道内的百万亿邻居', content: '你的肠道中住着约10^14个微生物，其中大肠杆菌占比不到1%，但它是研究最深入的模式生物。健康肠道中，大肠杆菌与数百种其他细菌维持着微妙的平衡。', dataSource: 'Cell Host & Microbe', lastUpdated: '2025-10-22', tags: ['肠道菌群', '共生', '微生态'] },
      { id: 'kc-3', type: 'discovery', title: '从粪便中诞生的诺贝尔奖', content: 'Escherich最初研究婴儿腹泻时分离出大肠杆菌，他可能不会想到，这种普通的肠道菌会催生至少5项诺贝尔奖：细菌接合、操纵子学说、限制性内切酶、PCR技术、CRISPR发现。', dataSource: 'Science Magazine', lastUpdated: '2025-09-05', tags: ['科学史', '诺贝尔奖', '遗传学'] },
      { id: 'kc-4', type: 'metabolism', title: '一克葡萄糖的旅行', content: '在有氧条件下，一分子葡萄糖经大肠杆菌代谢可产生38个ATP，效率约43%——几乎与内燃机相当。而无氧时仅2个ATP，但发酵产物却是食品工业的宝贵资源。', dataSource: 'Biochemistry Journal', lastUpdated: '2025-08-18', tags: ['代谢工程', '能量转换', '生物化学'] },
      { id: 'kc-5', type: 'application', title: '一升菌液胜过千头牛', content: '1982年之前，治疗糖尿病的胰岛素需从牛或猪的胰腺中提取，每克胰岛素需要数千头牛。而如今，1000升大肠杆菌发酵液就能产出相同数量的重组人胰岛素。', dataSource: 'Nature Biotechnology', lastUpdated: '2025-07-30', tags: ['生物制药', '可持续发展', '合成生物学'] },
      { id: 'kc-6', type: 'fun_fact', title: '20分钟一代的"生物时钟"', content: '在理想条件下，大肠杆菌每20分钟分裂一次。如果有足够营养，一个细菌在48小时内理论上能产生一个质量超过地球的菌群——幸好现实中营养是有限的。', dataSource: 'Journal of Bacteriology', lastUpdated: '2025-06-12', tags: ['生长动力学', '指数增长', '趣味'] },
    ],
    multiViewModels: [
      { id: 'mv-1', name: '扫描电镜全景', type: 'electron_micrograph', description: '显示大肠杆菌完整表面形态和分裂中的细胞', resolution: '2.0nm', magnification: '×50,000', technique: '扫描电子显微镜（SEM）', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Escherichia%20coli%20scanning%20electron%20micrograph%20rod%20shaped%20bacteria%20cyberpunk%20scientific%20style&image_size=square_hd', scaleBar: '1μm', viewAngle: '45°俯视角' },
      { id: 'mv-2', name: '膜蛋白荧光标记', type: 'fluorescence', description: '外膜蛋白OmpA经GFP标记显示分布特征', resolution: '200nm', magnification: '×1,000', technique: '全内反射荧光显微镜（TIRF）', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bacteria%20fluorescence%20microscopy%20green%20glowing%20cells%20membrane%20proteins%20dark%20background%20scientific&image_size=square_hd', scaleBar: '5μm' },
      { id: 'mv-3', name: '细胞内部断层扫描', type: 'confocal', description: '激光共聚焦扫描获取的连续Z轴切片', resolution: '500nm', magnification: '×630', technique: '激光共聚焦扫描显微镜', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=confocal%20laser%20scanning%20microscopy%203d%20bacteria%20cross%20section%20colorful%20layers&image_size=square_hd', scaleBar: '2μm', viewAngle: 'Z-stack重建' },
      { id: 'mv-4', name: '冷冻电镜三维重建', type: '3d_reconstruction', description: 'Cryo-EM单颗粒分析重建的核糖体结构', resolution: '2.8Å', magnification: '×100,000', technique: '冷冻电子显微镜单颗粒重建', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cryo%20electron%20microscopy%203d%20reconstruction%20ribosome%20structure%20molecular%20colorful&image_size=square_hd', scaleBar: '5nm' },
      { id: 'mv-5', name: '细胞结构示意图', type: 'schematic', description: '大肠杆菌超微结构模式图', resolution: '矢量图', magnification: '示意图', technique: '生物信息学可视化', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bacteria%20cell%20structure%20diagram%20labeled%20parts%20educational%20scientific%20illustration%20cyberpunk&image_size=square_hd', scaleBar: '示意图无比例尺' },
    ],
    highResImages: [
      { id: 'hr-1', title: '菌落宏观形态', description: 'LB琼脂平板上37°C培养18小时的菌落特征', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=E%20coli%20colonies%20agar%20plate%20petri%20dish%20laboratory%20bacteria%20culture&image_size=landscape_16_9', thumbnailUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=E%20coli%20colonies%20agar%20plate%20petri%20dish%20laboratory%20bacteria%20culture&image_size=square', resolution: '6000×4000', copyright: 'CC BY 4.0 Microbial Culture Collection', captureMethod: '宏观摄影 + 侧面照明' },
      { id: 'hr-2', title: '透射电镜超薄切片', description: '显示细胞壁、细胞质和核区的超微结构', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=transmission%20electron%20microscopy%20TEM%20bacteria%20thin%20section%20cell%20wall%20ultrastructure&image_size=landscape_16_9', thumbnailUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=transmission%20electron%20microscopy%20TEM%20bacteria%20thin%20section%20cell%20wall%20ultrastructure&image_size=square', resolution: '4096×2800', copyright: '© 2025 Electron Microscopy Facility', captureMethod: '透射电子显微镜 80kV' },
      { id: 'hr-3', title: '生物膜形成过程', description: '96小时培养过程中生物膜的共聚焦成像', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bacterial%20biofilm%20formation%203d%20structure%20confocal%20microscopy%20colorful%20extracellular%20matrix&image_size=landscape_16_9', thumbnailUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bacterial%20biofilm%20formation%203d%20structure%20confocal%20microscopy%20colorful%20extracellular%20matrix&image_size=square', resolution: '5120×3200', copyright: 'Nature Publishing Group', captureMethod: '共聚焦显微镜 + 荧光染色' },
    ],
    qualityScore: 98,
    completenessIndex: 96,
    references: [
      { id: 'ref-1', title: 'Complete genome sequence of Escherichia coli K-12', authors: 'Blattner FR, et al.', journal: 'Science', year: 1997, doi: '10.1126/science.277.5331.1453' },
      { id: 'ref-2', title: 'Construction of biologically functional bacterial plasmids in vitro', authors: 'Cohen SN, et al.', journal: 'Proc Natl Acad Sci USA', year: 1973 },
      { id: 'ref-3', title: 'Escherichia coli: model organism and biotechnological workhorse', authors: 'Lee SY', journal: 'Biotechnology Journal', year: 2014, doi: '10.1002/biot.201300413' },
    ],
    notes: '本标本为标准K-12衍生菌株MG1655，不含致病性因子。广泛用于基础研究和工业应用。已完成全基因组甲基化图谱、转录组动态图谱、蛋白互作网络等多组学测定。',
  },
  {
    id: 2,
    microbeId: 2,
    specimenCode: 'SPEC-FUNG-0001',
    collectionDate: '1680-05-20',
    collectionLocation: '荷兰代尔夫特',
    collector: 'Antonie van Leeuwenhoek',
    preservationMethod: '液氮冷冻',
    storageConditions: '-196°C 液氮保藏',
    accessionNumber: 'CBS-6188',
    taxonomicClassification: {
      kingdom: 'Fungi',
      phylum: 'Ascomycota',
      class: 'Saccharomycetes',
      order: 'Saccharomycetales',
      family: 'Saccharomycetaceae',
      genus: 'Saccharomyces',
      species: 'Saccharomyces cerevisiae',
    },
    morphology: {
      cellShape: '卵圆形/球形',
      cellSize: '5-10 μm × 5-10 μm',
      gramStain: 'positive',
      motility: false,
      sporeFormation: true,
      capsule: false,
      arrangement: '单个、成对或出芽链',
      specialFeatures: ['芽殖繁殖', '子囊孢子形成', '双倍体/单倍体世代交替'],
      detailedFeatures: [
        { id: 'mf-y1', label: '细胞壁', value: '甘露聚糖-葡聚糖-几丁质', description: '三层结构：外层甘露聚糖、中层β-葡聚糖、内层几丁质', icon: 'wall' },
        { id: 'mf-y2', label: '出芽痕', value: '环状几丁质', description: '出芽位点在母细胞表面留下永久痕迹，可标记复制年龄', icon: 'circle' },
        { id: 'mf-y3', label: '线粒体', value: '分支网状', description: '含有自身mtDNA，约78kb编码呼吸链组分', icon: 'power' },
        { id: 'mf-y4', label: '液泡', value: '酸性消化器', description: '占细胞体积20%，含水解酶和氨基酸储存功能', icon: 'drop' },
      ],
    },
    habitat: {
      id: 'hab-y1',
      type: '富糖环境/发酵',
      description: '自然存在于果实表皮、花蜜、树皮和土壤中，与人类活动密切相关',
      temperature: [25, 30],
      phRange: [4.0, 7.5],
      salinity: '0-1.0% NaCl',
      oxygenRequirement: 'facultative',
      commonLocations: ['葡萄皮', '发酵面团', '啤酒发酵罐', '果园土壤'],
      ecologicalRole: '分解植物多糖，参与碳循环，为昆虫提供营养',
    },
    discoveryTimeline: [
      { id: 'dt-y1', year: 1680, title: '显微镜下首次观察', description: 'Leeuwenhoek用自制显微镜观察到酵母细胞', discoverer: 'Antonie van Leeuwenhoek', significance: '人类首次看到的微生物之一' },
      { id: 'dt-y2', year: 1857, title: '发酵本质揭示', description: '巴斯德证明发酵是由活酵母引起的生物学过程', discoverer: 'Louis Pasteur', significance: '建立了微生物学的理论基础' },
      { id: 'dt-y3', year: 1881, title: '纯培养分离', description: 'Emil Hansen首次获得啤酒酵母的纯培养', discoverer: 'Emil Christian Hansen', significance: '实现了酵母菌种的标准化生产' },
      { id: 'dt-y4', year: 1996, title: '首个真核基因组', description: '酿酒酵母基因组测序完成，共6000个基因', discoverer: '国际酵母基因组联盟', significance: '人类历史上第一个完成测序的真核生物基因组' },
    ],
    metabolicCapabilities: [
      { id: 'mc-y1', name: '酒精发酵', category: 'fermentation', efficiency: 90, description: '厌氧条件下将葡萄糖转化为乙醇和CO2', substrates: ['葡萄糖', '果糖', '蔗糖'], products: ['乙醇', 'CO2', 'ATP'], keyEnzymes: ['丙酮酸脱羧酶', '乙醇脱氢酶', '己糖激酶'] },
      { id: 'mc-y2', name: '呼吸代谢', category: 'aerobic_respiration', efficiency: 88, description: '有氧时完全氧化，Crabtree效应存在', substrates: ['丙酮酸', '乙酸'], products: ['CO2', 'H2O', '大量ATP'], keyEnzymes: ['琥珀酸脱氢酶', '细胞色素c氧化酶', 'ATP合酶'] },
      { id: 'mc-y3', name: '甘油合成', category: 'fermentation', efficiency: 65, description: '渗透胁迫下大量合成甘油维持渗透压', substrates: ['磷酸二羟丙酮'], products: ['甘油', 'NAD+'], keyEnzymes: ['G3P脱氢酶', '甘油磷酸酯酶'] },
    ],
    applications: [
      { id: 'ap-y1', category: 'food_fermentation', title: '面包烘焙', description: '发酵产生CO2使面团膨胀，同时产生风味物质', maturity: 'established', marketScale: '全球年消费量超400万吨干酵母', keyAdvantages: ['发酵力强', '风味优良', '耐高糖高盐', '保存稳定'], caseStudies: [{ title: '法式长棍面包', organization: '巴黎烘焙学院', outcome: '传统工艺与现代酵母菌株结合，出品稳定' }, { title: '冷冻面团技术', organization: '国际食品科技联盟', outcome: '实现-20°C储存6个月仍保持90%活性' }] },
      { id: 'ap-y2', category: 'food_fermentation', title: '啤酒酿造', description: '艾尔和拉格啤酒的核心发酵微生物', maturity: 'established', marketScale: '全球啤酒市场超6000亿美元', keyAdvantages: ['底物转化率高', '副产物少', '风味可控'], caseStudies: [{ title: '工业拉格发酵', organization: 'AB InBev研发中心', outcome: '大型发酵罐单批次产量达5000hl' }] },
      { id: 'ap-y3', category: 'biofuel_production', title: '纤维素乙醇', description: '工程化改造后可直接发酵木质纤维素水解液', maturity: 'commercial', marketScale: '全球年产能超100亿升', keyAdvantages: ['戊糖利用', '抑制物耐受', '高密度发酵'], caseStudies: [{ title: 'POET-DSM纤维素乙醇工厂', organization: 'POET LLC', outcome: '年产能8000万加仑纤维素乙醇' }] },
      { id: 'ap-y4', category: 'biopharmaceutical', title: '亚单位疫苗平台', description: '作为真核表达系统生产复杂糖蛋白药物', maturity: 'established', marketScale: '数百亿美元级市场', keyAdvantages: ['蛋白折叠正确', '翻译后修饰', '无内毒素污染'], caseStudies: [{ title: 'HPV疫苗（Gardasil）', organization: 'Merck & Co.', outcome: '酵母表达的VLP疫苗接种超1亿剂' }] },
    ],
    knowledgeCards: [
      { id: 'kc-y1', type: 'morphology', title: '一个芽痕记录一段青春', content: '酵母母细胞每次出芽后会留下一个永久的芽痕。理论上可通过计数芽痕确定"复制年龄"。母细胞一生中大约能出芽30-50次，然后进入衰老。这是研究细胞衰老的重要模型。', dataSource: 'Journal of Cell Biology', lastUpdated: '2025-10-15', tags: ['细胞衰老', '不对称分裂', '形态学'] },
      { id: 'kc-y2', type: 'habitat', title: '葡萄园的隐形居民', content: '成熟葡萄表面的白粉层中，每平方厘米可能藏着100万个酵母细胞。传统自然发酵工艺正是依靠这些"野生酵母"，赋予每款葡萄酒独特的风土特征。', dataSource: 'Environmental Microbiology', lastUpdated: '2025-09-20', tags: ['葡萄酒', '微生物生态', '发酵'] },
      { id: 'kc-y3', type: 'discovery', title: '巴氏杀菌的诞生', content: '1864年巴斯德发现"为什么好酒会变坏"——因为有害细菌污染。他发明了加热到55°C保持数分钟的方法，拯救了法国葡萄酒产业。这个工艺后来被称为"巴氏杀菌"，至今仍在使用。', dataSource: 'Louis Pasteur Museum', lastUpdated: '2025-08-05', tags: ['科学史', '食品工业', '灭菌技术'] },
      { id: 'kc-y4', type: 'metabolism', title: 'Crabtree效应：葡萄糖的甜蜜陷阱', content: '即使在有氧条件下，只要葡萄糖浓度足够高，酿酒酵母也会优先选择发酵而非呼吸。这就是著名的Crabtree效应。原因是高糖导致糖酵解通量超过了线粒体的承载能力。', dataSource: 'Trends in Biochemical Sciences', lastUpdated: '2025-07-22', tags: ['代谢调控', '生物能学', '发酵'] },
      { id: 'kc-y5', type: 'application', title: '从面包房到疫苗工厂', content: '10000年前人类就用酵母做面包。今天，同样的酵母在生物反应器中生产HPV疫苗、胰岛素类似物、抗肿瘤抗体。"最古老的家养微生物"正在成为"最现代的细胞工厂"。', dataSource: 'Nature Biotechnology', lastUpdated: '2025-06-30', tags: ['生物技术', '疫苗', '合成生物学'] },
      { id: 'kc-y6', type: 'fun_fact', title: '150个诺贝尔奖背后的酵母', content: '截至2025年，有超过150个与酵母相关的研究获得诺贝尔奖。从细胞周期、端粒酶、自噬，到囊泡运输、mRNA降解……酿酒酵母被称为"真核生物的大肠杆菌"，是生命科学最高产的模式生物。', dataSource: 'Cell Press', lastUpdated: '2025-05-18', tags: ['诺贝尔奖', '模式生物', '科学史'] },
    ],
    multiViewModels: [
      { id: 'mv-y1', name: '扫描电镜出芽状态', type: 'electron_micrograph', description: '显示不同时期芽殖细胞的表面形貌', resolution: '5.0nm', magnification: '×30,000', technique: '扫描电子显微镜（SEM）', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=saccharomyces%20cerevisiae%20yeast%20budding%20SEM%20scanning%20electron%20micrograph%20scientific&image_size=square_hd', scaleBar: '2μm', viewAngle: '正视图' },
      { id: 'mv-y2', name: '线粒体网络', type: 'fluorescence', description: 'GFP标记线粒体显示动态网状结构', resolution: '250nm', magnification: '×1,000', technique: '宽场荧光显微镜', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=yeast%20mitochondria%20network%20green%20fluorescence%20microscopy%20cells%20dark%20background&image_size=square_hd', scaleBar: '5μm' },
      { id: 'mv-y3', name: '子囊孢子三维', type: 'confocal', description: 'Meiosis后形成的四分体结构三维重建', resolution: '300nm', magnification: '×1,000', technique: '共聚焦激光扫描', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=yeast%20ascus%20spores%20confocal%203d%20reconstruction%20four%20spores%20colorful&image_size=square_hd', scaleBar: '3μm', viewAngle: '3D透视' },
      { id: 'mv-y4', name: '核糖体Cryo-EM', type: '3d_reconstruction', description: '80S核糖体冷冻电镜高分辨率结构', resolution: '2.5Å', magnification: '×200,000', technique: '冷冻电镜单颗粒分析', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=eukaryotic%20ribosome%2080S%20cryo%20EM%203d%20structure%20molecular%20biology%20colorful&image_size=square_hd', scaleBar: '5nm' },
      { id: 'mv-y5', name: '细胞周期示意图', type: 'schematic', description: '出芽周期与染色体分离的模式图', resolution: '矢量图', magnification: '示意图', technique: '数据可视化', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=yeast%20cell%20cycle%20budding%20diagram%20schematic%20illustration%20phases%20G1%20S%20G2%20M&image_size=square_hd', scaleBar: '示意图无比例尺' },
    ],
    highResImages: [
      { id: 'hr-y1', title: '菌落宏观形态', description: 'YPD平板30°C培养3天的菌落特征', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=yeast%20colonies%20YPD%20agar%20plate%20cream%20colored%20circular%20colonies%20laboratory&image_size=landscape_16_9', thumbnailUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=yeast%20colonies%20YPD%20agar%20plate%20cream%20colored%20circular%20colonies%20laboratory&image_size=square', resolution: '6000×4000', copyright: 'CC BY 4.0 Yeast Stock Center', captureMethod: '高分辨率扫描' },
      { id: 'hr-y2', title: '孢子显微观察', description: '四分体孢子经碘液染色的明场成像', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=yeast%20ascus%20tetrad%20spores%20microscopy%20iodine%20stained%20scientific&image_size=landscape_16_9', thumbnailUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=yeast%20ascus%20tetrad%20spores%20microscopy%20iodine%20stained%20scientific&image_size=square', resolution: '4096×2800', copyright: '© 2025 Genetics Institute', captureMethod: '明场显微镜 100×物镜' },
      { id: 'hr-y3', title: '工业发酵罐', description: '200m³规模工业生物反应器内景', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=industrial%20bioreactor%20fermenter%20stainless%20steel%20large%20scale%20biotechnology%20factory&image_size=landscape_16_9', thumbnailUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=industrial%20bioreactor%20fermenter%20stainless%20steel%20large%20scale%20biotechnology%20factory&image_size=square', resolution: '5120×3200', copyright: '© Novozymes A/S', captureMethod: '工业摄影' },
    ],
    qualityScore: 99,
    completenessIndex: 98,
    references: [
      { id: 'ref-y1', title: 'Life with 6000 genes', authors: 'Goffeau A, et al.', journal: 'Science', year: 1996, doi: '10.1126/science.274.5287.546' },
      { id: 'ref-y2', title: 'Saccharomyces cerevisiae in the production of fermented beverages', authors: 'Steensels J, Verstrepen KJ', journal: 'Nature Reviews Microbiology', year: 2014 },
      { id: 'ref-y3', title: 'Yeast synthetic biology for advanced biomanufacturing', authors: 'Jensen MK, et al.', journal: 'Nature Biotechnology', year: 2019 },
    ],
    notes: '本标本为标准实验室菌株BY4741（MATa his3Δ1 leu2Δ0 met15Δ0 ura3Δ0），是酵母基因敲除文库的背景菌株。包含完整的单基因敲除、GFP标记、温度敏感突变体等遗传资源库。',
  },
];

export function getAllSpecimens() {
  return digitalSpecimens;
}

export function getSpecimenById(id: number): DigitalSpecimen | undefined {
  return digitalSpecimens.find((s) => s.id === id);
}

export function getSpecimensByCategory(category: string): DigitalSpecimen[] {
  const prefixMap: Record<string, string> = {
    bacteria: 'SPEC-BACT',
    fungi: 'SPEC-FUNG',
    virus: 'SPEC-VIRU',
    archaea: 'SPEC-ARCH',
  };
  const prefix = prefixMap[category] || '';
  return digitalSpecimens.filter((s) => s.specimenCode.startsWith(prefix));
}

export function getSpecimenStats() {
  const categories = [
    { key: 'bacteria', prefix: 'SPEC-BACT' },
    { key: 'fungi', prefix: 'SPEC-FUNG' },
    { key: 'virus', prefix: 'SPEC-VIRU' },
    { key: 'archaea', prefix: 'SPEC-ARCH' },
  ];
  return categories.map((c) => ({
    category: c.key,
    count: digitalSpecimens.filter((s) => s.specimenCode.startsWith(c.prefix)).length,
    avgQuality: digitalSpecimens.filter((s) => s.specimenCode.startsWith(c.prefix)).reduce((acc, s) => acc + s.qualityScore, 0) / Math.max(1, digitalSpecimens.filter((s) => s.specimenCode.startsWith(c.prefix)).length),
  }));
}
