import type { EcologicalRelation } from '../../shared/types';

export const ecologicalRelations: EcologicalRelation[] = [
  {
    id: 'rel_001',
    sourceId: 1,
    targetId: 5,
    type: 'symbiosis',
    strength: 0.85,
    description: '大肠杆菌与嗜酸乳杆菌在肠道中共生，乳杆菌产生的乳酸降低pH值，抑制有害菌生长，为大肠杆菌创造适宜环境。',
  },
  {
    id: 'rel_002',
    sourceId: 5,
    targetId: 8,
    type: 'symbiosis',
    strength: 0.9,
    description: '嗜酸乳杆菌与双歧杆菌协同作用，乳杆菌分解复杂碳水化合物产生乳酸，双歧杆菌利用其代谢产物进一步发酵，共同维护肠道健康。',
  },
  {
    id: 'rel_003',
    sourceId: 1,
    targetId: 8,
    type: 'symbiosis',
    strength: 0.75,
    description: '大肠杆菌与双歧杆菌在肠道中形成互利共生，大肠杆菌合成维生素K，双歧杆菌维持酸性环境，双方相互受益。',
  },
  {
    id: 'rel_004',
    sourceId: 1,
    targetId: 2,
    type: 'competition',
    strength: 0.7,
    description: '大肠杆菌与金黄色葡萄球菌竞争肠道和皮肤的定植位点及营养资源，双方存在生态位重叠。',
  },
  {
    id: 'rel_005',
    sourceId: 1,
    targetId: 4,
    type: 'competition',
    strength: 0.65,
    description: '大肠杆菌与铜绿假单胞菌在医院环境和水体中竞争营养物质和生存空间。',
  },
  {
    id: 'rel_006',
    sourceId: 15,
    targetId: 1,
    type: 'predation',
    strength: 0.95,
    description: 'T4噬菌体专一性感染并裂解大肠杆菌，通过注入DNA利用宿主代谢系统复制自身，最终导致宿主细胞破裂死亡。',
  },
  {
    id: 'rel_007',
    sourceId: 2,
    targetId: 12,
    type: 'competition',
    strength: 0.6,
    description: '金黄色葡萄球菌与白色念珠菌在皮肤和黏膜表面竞争定植位点。',
  },
  {
    id: 'rel_008',
    sourceId: 11,
    targetId: 2,
    type: 'parasitism',
    strength: 0.9,
    description: '产黄青霉产生青霉素抑制金黄色葡萄球菌细胞壁合成，属于典型的抗生关系（化学介导的竞争抑制）。',
  },
  {
    id: 'rel_009',
    sourceId: 11,
    targetId: 6,
    type: 'parasitism',
    strength: 0.7,
    description: '产黄青霉产生的抗生素对结核分枝杆菌有一定抑制作用。',
  },
  {
    id: 'rel_010',
    sourceId: 9,
    targetId: 10,
    type: 'competition',
    strength: 0.55,
    description: '酿酒酵母与黑曲霉在发酵环境中竞争糖类营养物质。',
  },
  {
    id: 'rel_011',
    sourceId: 9,
    targetId: 5,
    type: 'symbiosis',
    strength: 0.6,
    description: '酿酒酵母与嗜酸乳杆菌在发酵食品（如酸面包、酸奶）中共生，酵母产生CO₂和风味物质，乳杆菌产酸调节pH。',
  },
  {
    id: 'rel_012',
    sourceId: 10,
    targetId: 11,
    type: 'competition',
    strength: 0.5,
    description: '黑曲霉与产黄青霉在土壤和腐败有机物中竞争生态位。',
  },
  {
    id: 'rel_013',
    sourceId: 12,
    targetId: 5,
    type: 'parasitism',
    strength: 0.65,
    description: '白色念珠菌在菌群失调时过度繁殖，抑制嗜酸乳杆菌等益生菌的生长，破坏阴道微生态平衡。',
  },
  {
    id: 'rel_014',
    sourceId: 12,
    targetId: 8,
    type: 'competition',
    strength: 0.6,
    description: '白色念珠菌与双歧杆菌竞争肠道黏膜定植位点。',
  },
  {
    id: 'rel_015',
    sourceId: 7,
    targetId: 1,
    type: 'competition',
    strength: 0.75,
    description: '霍乱弧菌与大肠杆菌竞争肠道定植位点，霍乱弧菌通过分泌霍乱毒素破坏肠道环境。',
  },
  {
    id: 'rel_016',
    sourceId: 6,
    targetId: 1,
    type: 'competition',
    strength: 0.4,
    description: '结核分枝杆菌与大肠杆菌在巨噬细胞内存在间接竞争。',
  },
  {
    id: 'rel_017',
    sourceId: 4,
    targetId: 2,
    type: 'competition',
    strength: 0.55,
    description: '铜绿假单胞菌与金黄色葡萄球菌在医院感染中常共存在，争夺营养和空间。',
  },
  {
    id: 'rel_018',
    sourceId: 4,
    targetId: 11,
    type: 'parasitism',
    strength: 0.5,
    description: '铜绿假单胞菌产生的代谢产物可抑制部分真菌生长。',
  },
  {
    id: 'rel_019',
    sourceId: 3,
    targetId: 10,
    type: 'symbiosis',
    strength: 0.5,
    description: '枯草芽孢杆菌与黑曲霉在土壤中协同分解有机物，芽孢杆菌分泌蛋白酶，曲霉分泌纤维素酶。',
  },
  {
    id: 'rel_020',
    sourceId: 3,
    targetId: 2,
    type: 'parasitism',
    strength: 0.6,
    description: '枯草芽孢杆菌产生的抗菌肽（杆菌肽）对金黄色葡萄球菌有抑制作用。',
  },
  {
    id: 'rel_021',
    sourceId: 17,
    targetId: 2,
    type: 'competition',
    strength: 0.45,
    description: '流感病毒感染呼吸道黏膜后，会影响金黄色葡萄球菌等细菌的定植环境。',
  },
  {
    id: 'rel_022',
    sourceId: 18,
    targetId: 1,
    type: 'competition',
    strength: 0.35,
    description: '新冠病毒感染后肠道菌群失调，影响大肠杆菌等共生菌的平衡。',
  },
  {
    id: 'rel_023',
    sourceId: 19,
    targetId: 5,
    type: 'parasitism',
    strength: 0.4,
    description: 'HIV感染导致免疫系统受损，间接影响嗜酸乳杆菌等益生菌的生存环境。',
  },
  {
    id: 'rel_024',
    sourceId: 20,
    targetId: 1,
    type: 'parasitism',
    strength: 0.5,
    description: '某些腺病毒可感染肠道黏膜上皮细胞，间接影响大肠杆菌的生存微环境。',
  },
  {
    id: 'rel_025',
    sourceId: 13,
    targetId: 3,
    type: 'symbiosis',
    strength: 0.55,
    description: '双孢蘑菇与枯草芽孢杆菌在堆肥中协同作用，细菌分解有机物产生的代谢产物为蘑菇菌丝生长提供营养。',
  },
  {
    id: 'rel_026',
    sourceId: 14,
    targetId: 3,
    type: 'symbiosis',
    strength: 0.45,
    description: '灵芝与部分土壤细菌（如枯草芽孢杆菌）存在协同关系，有助于灵芝菌丝体的生长和代谢产物积累。',
  },
  {
    id: 'rel_027',
    sourceId: 21,
    targetId: 24,
    type: 'competition',
    strength: 0.6,
    description: '詹氏甲烷球菌与激烈火球菌在深海热泉环境中竞争氢和硫化物等能源物质。',
  },
  {
    id: 'rel_028',
    sourceId: 22,
    targetId: 24,
    type: 'competition',
    strength: 0.5,
    description: '嗜酸热硫化叶菌与激烈火球菌在火山热液环境中竞争高温生态位。',
  },
  {
    id: 'rel_029',
    sourceId: 23,
    targetId: 21,
    type: 'competition',
    strength: 0.4,
    description: '盐生盐杆菌与詹氏甲烷球菌在特殊高盐厌氧环境中存在生态竞争。',
  },
  {
    id: 'rel_030',
    sourceId: 16,
    targetId: 13,
    type: 'parasitism',
    strength: 0.85,
    description: '烟草花叶病毒感染双孢蘑菇等真菌的宿主植物，间接影响真菌的共生环境。',
  },
  {
    id: 'rel_031',
    sourceId: 5,
    targetId: 2,
    type: 'parasitism',
    strength: 0.7,
    description: '嗜酸乳杆菌产生的乳酸和细菌素可抑制金黄色葡萄球菌的生长，维持微生态平衡。',
  },
  {
    id: 'rel_032',
    sourceId: 8,
    targetId: 12,
    type: 'parasitism',
    strength: 0.75,
    description: '双歧杆菌产生的乙酸和乳酸可抑制白色念珠菌的菌丝形成，抵抗真菌感染。',
  },
  {
    id: 'rel_033',
    sourceId: 10,
    targetId: 9,
    type: 'parasitism',
    strength: 0.45,
    description: '黑曲霉在特定条件下可抑制酿酒酵母的生长，两者在发酵体系中存在拮抗关系。',
  },
  {
    id: 'rel_034',
    sourceId: 3,
    targetId: 6,
    type: 'parasitism',
    strength: 0.5,
    description: '枯草芽孢杆菌产生的多种抗菌物质对结核分枝杆菌有一定的抑制作用。',
  },
  {
    id: 'rel_035',
    sourceId: 7,
    targetId: 5,
    type: 'competition',
    strength: 0.65,
    description: '霍乱弧菌在肠道中与嗜酸乳杆菌竞争定植位点，乳杆菌的酸性环境对霍乱弧菌有抑制作用。',
  },
  {
    id: 'rel_036',
    sourceId: 4,
    targetId: 7,
    type: 'competition',
    strength: 0.45,
    description: '铜绿假单胞菌与霍乱弧菌在水体环境中竞争营养资源。',
  },
  {
    id: 'rel_037',
    sourceId: 9,
    targetId: 8,
    type: 'symbiosis',
    strength: 0.55,
    description: '酿酒酵母与双歧杆菌在发酵乳制品中协同，酵母提供B族维生素，双歧杆菌维持酸性环境。',
  },
  {
    id: 'rel_038',
    sourceId: 14,
    targetId: 10,
    type: 'competition',
    strength: 0.4,
    description: '灵芝与黑曲霉在木材腐生环境中竞争木质纤维素资源。',
  },
  {
    id: 'rel_039',
    sourceId: 20,
    targetId: 17,
    type: 'competition',
    strength: 0.35,
    description: '腺病毒与流感病毒在呼吸道上皮细胞中竞争感染位点。',
  },
  {
    id: 'rel_040',
    sourceId: 18,
    targetId: 17,
    type: 'competition',
    strength: 0.5,
    description: '新冠病毒与流感病毒在呼吸道黏膜中竞争感染靶细胞，存在病毒干扰现象。',
  },
];

export function getRelationsForMicrobe(microbeId: number): EcologicalRelation[] {
  return ecologicalRelations.filter(
    (r) => r.sourceId === microbeId || r.targetId === microbeId
  );
}

export function getSymbiosisPartners(microbeId: number): { microbeId: number; relation: EcologicalRelation }[] {
  return ecologicalRelations
    .filter((r) => r.type === 'symbiosis' && (r.sourceId === microbeId || r.targetId === microbeId))
    .map((r) => ({
      microbeId: r.sourceId === microbeId ? r.targetId : r.sourceId,
      relation: r,
    }));
}

export function getCompetitors(microbeId: number): { microbeId: number; relation: EcologicalRelation }[] {
  return ecologicalRelations
    .filter((r) => r.type === 'competition' && (r.sourceId === microbeId || r.targetId === microbeId))
    .map((r) => ({
      microbeId: r.sourceId === microbeId ? r.targetId : r.sourceId,
      relation: r,
    }));
}

export function getPredators(microbeId: number): { microbeId: number; relation: EcologicalRelation }[] {
  return ecologicalRelations
    .filter((r) => r.type === 'predation' && r.targetId === microbeId)
    .map((r) => ({ microbeId: r.sourceId, relation: r }));
}

export function getPreys(microbeId: number): { microbeId: number; relation: EcologicalRelation }[] {
  return ecologicalRelations
    .filter((r) => r.type === 'predation' && r.sourceId === microbeId)
    .map((r) => ({ microbeId: r.targetId, relation: r }));
}

export function getParasites(microbeId: number): { microbeId: number; relation: EcologicalRelation }[] {
  return ecologicalRelations
    .filter((r) => r.type === 'parasitism' && r.targetId === microbeId)
    .map((r) => ({ microbeId: r.sourceId, relation: r }));
}

export function getHosts(microbeId: number): { microbeId: number; relation: EcologicalRelation }[] {
  return ecologicalRelations
    .filter((r) => r.type === 'parasitism' && r.sourceId === microbeId)
    .map((r) => ({ microbeId: r.targetId, relation: r }));
}

export function findAllPaths(
  startId: number,
  endId: number,
  maxDepth: number = 4
): { path: number[]; relations: EcologicalRelation[]; totalStrength: number }[] {
  const results: { path: number[]; relations: EcologicalRelation[]; totalStrength: number }[] = [];
  const visited = new Set<number>();

  function dfs(
    currentId: number,
    path: number[],
    relations: EcologicalRelation[],
    strength: number,
    depth: number
  ) {
    if (currentId === endId && path.length > 1) {
      results.push({
        path: [...path],
        relations: [...relations],
        totalStrength: +(strength / relations.length).toFixed(3),
      });
      return;
    }

    if (depth >= maxDepth) return;

    visited.add(currentId);

    const nextRelations = ecologicalRelations.filter(
      (r) =>
        (r.sourceId === currentId || r.targetId === currentId) &&
        !visited.has(r.sourceId === currentId ? r.targetId : r.sourceId)
    );

    for (const rel of nextRelations) {
      const nextId = rel.sourceId === currentId ? rel.targetId : rel.sourceId;
      dfs(nextId, [...path, nextId], [...relations, rel], strength + rel.strength, depth + 1);
    }

    visited.delete(currentId);
  }

  dfs(startId, [startId], [], 0, 0);

  results.sort((a, b) => {
    if (a.path.length !== b.path.length) return a.path.length - b.path.length;
    return b.totalStrength - a.totalStrength;
  });

  return results.slice(0, 10);
}
