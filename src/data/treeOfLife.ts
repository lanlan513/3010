import type { Microbe, MicrobeCategory, AbilityTag, AbilityDimension } from '../../shared/types';
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  ABILITY_TAG_LABELS,
  ABILITY_DIMENSION_LABELS,
} from '../../shared/types';
import { HABITAT_ZONES } from './habitats';
import { getMicrobeAbilityProfile } from './microbeAbilities';

export type TaxonomyRank =
  | 'domain'
  | 'kingdom'
  | 'phylum'
  | 'class'
  | 'order'
  | 'family'
  | 'genus'
  | 'species';

export const TAXONOMY_RANK_LABELS: Record<TaxonomyRank, string> = {
  domain: '域',
  kingdom: '界',
  phylum: '门',
  class: '纲',
  order: '目',
  family: '科',
  genus: '属',
  species: '种',
};

export interface TreeNode {
  id: string;
  name: string;
  rank: TaxonomyRank;
  category?: MicrobeCategory;
  microbeId?: number;
  children: TreeNode[];
  parentId: string | null;
  description?: string;
  discoveredYear?: number;
  habitat?: string;
  imageUrl?: string;
  scientificName?: string;
  size?: string;
  characteristics?: string[];
  abilityTags?: AbilityTag[];
  microbeCount?: number;
}

export interface FilterState {
  yearRange: [number, number];
  habitats: string[];
  abilityDimensions: AbilityDimension[];
  abilityTags: AbilityTag[];
  categories: MicrobeCategory[];
}

const PHYLA_DATA: Record<MicrobeCategory, { id: string; name: string; description: string }[]> = {
  bacteria: [
    { id: 'firmicutes', name: '厚壁菌门', description: '革兰氏阳性菌，包括芽孢杆菌、乳酸菌、梭菌等' },
    { id: 'proteobacteria', name: '变形菌门', description: '革兰氏阴性菌，包括大肠杆菌、霍乱弧菌、假单胞菌等' },
    { id: 'actinobacteria', name: '放线菌门', description: '高GC含量革兰氏阳性菌，包括链霉菌、分枝杆菌等' },
    { id: 'bacteroidetes', name: '拟杆菌门', description: '肠道中常见的革兰氏阴性厌氧菌' },
    { id: 'cyanobacteria', name: '蓝细菌门', description: '能进行光合作用的原核生物' },
    { id: 'tenericutes', name: '软壁菌门', description: '无细胞壁的细菌，包括支原体' },
  ],
  fungi: [
    { id: 'ascomycota', name: '子囊菌门', description: '最大的真菌门，包括酵母、青霉、曲霉、灵芝等' },
    { id: 'basidiomycota', name: '担子菌门', description: '包括蘑菇、灵芝等大型真菌' },
    { id: 'zygomycota', name: '接合菌门', description: '包括毛霉等真菌' },
  ],
  virus: [
    { id: 'caudovirales', name: '有尾噬菌体目', description: '感染细菌的病毒，包括T4噬菌体' },
    { id: 'orthomyxoviridae', name: '正黏病毒科', description: '包括流感病毒' },
    { id: 'coronaviridae', name: '冠状病毒科', description: '包括新冠病毒' },
    { id: 'retroviridae', name: '逆转录病毒科', description: '包括HIV' },
    { id: 'adenoviridae', name: '腺病毒科', description: '包括腺病毒' },
    { id: 'virgaviridae', name: '芜菁黄花叶病毒目', description: '包括烟草花叶病毒' },
    { id: 'rhabdoviridae', name: '弹状病毒科', description: '包括狂犬病毒' },
  ],
  archaea: [
    { id: 'euryarchaeota', name: '广古菌门', description: '包括产甲烷古菌、嗜盐古菌等' },
    { id: 'crenarchaeota', name: '泉古菌门', description: '包括嗜热嗜酸的硫化叶菌等' },
    { id: 'thaumarchaeota', name: '奇古菌门', description: '包括氨氧化古菌' },
  ],
};

const MICROBE_TAXONOMY: Record<number, { phylum: string; class: string; order: string; family: string; genus: string }> = {
  1: { phylum: 'proteobacteria', class: 'γ-变形菌纲', order: '肠杆菌目', family: '肠杆菌科', genus: '埃希氏菌属' },
  2: { phylum: 'firmicutes', class: '芽孢杆菌纲', order: '芽孢杆菌目', family: '葡萄球菌科', genus: '葡萄球菌属' },
  3: { phylum: 'firmicutes', class: '芽孢杆菌纲', order: '芽孢杆菌目', family: '芽孢杆菌科', genus: '芽孢杆菌属' },
  4: { phylum: 'proteobacteria', class: 'γ-变形菌纲', order: '假单胞菌目', family: '假单胞菌科', genus: '假单胞菌属' },
  5: { phylum: 'firmicutes', class: '芽孢杆菌纲', order: '乳杆菌目', family: '乳杆菌科', genus: '乳杆菌属' },
  6: { phylum: 'actinobacteria', class: '放线菌纲', order: '放线菌目', family: '分枝杆菌科', genus: '分枝杆菌属' },
  7: { phylum: 'proteobacteria', class: 'γ-变形菌纲', order: '弧菌目', family: '弧菌科', genus: '弧菌属' },
  8: { phylum: 'actinobacteria', class: '放线菌纲', order: '双歧杆菌目', family: '双歧杆菌科', genus: '双歧杆菌属' },
  9: { phylum: 'ascomycota', class: '酵母纲', order: '酵母目', family: '酵母科', genus: '酵母属' },
  10: { phylum: 'ascomycota', class: '散囊菌纲', order: '散囊菌目', family: '曲霉菌科', genus: '曲霉属' },
  11: { phylum: 'ascomycota', class: '散囊菌纲', order: '散囊菌目', family: '曲霉菌科', genus: '青霉属' },
  12: { phylum: 'ascomycota', class: '酵母纲', order: '酵母目', family: '酵母科', genus: '念珠菌属' },
  13: { phylum: 'basidiomycota', class: '伞菌纲', order: '伞菌目', family: '蘑菇科', genus: '蘑菇属' },
  14: { phylum: 'basidiomycota', class: '伞菌纲', order: '多孔菌目', family: '灵芝科', genus: '灵芝属' },
  15: { phylum: 'caudovirales', class: '有尾噬菌体', order: '肌尾噬菌体目', family: '肌尾噬菌体科', genus: 'T4噬菌体属' },
  16: { phylum: 'virgaviridae', class: '烟草花叶病毒', order: '烟草花叶病毒目', family: '烟草花叶病毒科', genus: '烟草花叶病毒属' },
  17: { phylum: 'orthomyxoviridae', class: '正黏病毒', order: '正黏病毒目', family: '正黏病毒科', genus: '流感病毒属' },
  18: { phylum: 'coronaviridae', class: '冠状病毒', order: '套式病毒目', family: '冠状病毒科', genus: 'β冠状病毒属' },
  19: { phylum: 'retroviridae', class: '逆转录病毒', order: '逆转录病毒目', family: '逆转录病毒科', genus: '慢病毒属' },
  20: { phylum: 'adenoviridae', class: '腺病毒', order: '腺病毒目', family: '腺病毒科', genus: '哺乳动物腺病毒属' },
  21: { phylum: 'euryarchaeota', class: '甲烷球菌纲', order: '甲烷球菌目', family: '甲烷球菌科', genus: '甲烷球菌属' },
  22: { phylum: 'crenarchaeota', class: '热变形菌纲', order: '硫化叶菌目', family: '硫化叶菌科', genus: '硫化叶菌属' },
  23: { phylum: 'euryarchaeota', class: '盐杆菌纲', order: '盐杆菌目', family: '盐杆菌科', genus: '盐杆菌属' },
  24: { phylum: 'euryarchaeota', class: '热球菌纲', order: '热球菌目', family: '热球菌科', genus: '火球菌属' },
  25: { phylum: 'firmicutes', class: '芽孢杆菌纲', order: '芽孢杆菌目', family: '芽孢杆菌科', genus: '芽孢杆菌属' },
  26: { phylum: 'rhabdoviridae', class: '弹状病毒', order: '单股负链病毒目', family: '弹状病毒科', genus: '狂犬病毒属' },
  27: { phylum: 'tenericutes', class: '柔膜菌纲', order: '支原体目', family: '支原体科', genus: '支原体属' },
};

export function buildTreeOfLife(microbes: Microbe[]): TreeNode {
  const root: TreeNode = {
    id: 'root',
    name: '生命之树',
    rank: 'domain',
    children: [],
    parentId: null,
    description: '所有已收录微生物的完整分类谱系',
    microbeCount: microbes.length,
  };

  const domainMap = new Map<string, TreeNode>();
  const phylumMap = new Map<string, TreeNode>();
  const classMap = new Map<string, TreeNode>();
  const orderMap = new Map<string, TreeNode>();
  const familyMap = new Map<string, TreeNode>();
  const genusMap = new Map<string, TreeNode>();

  const categories: MicrobeCategory[] = ['bacteria', 'fungi', 'virus', 'archaea'];
  const domainNames: Record<MicrobeCategory, string> = {
    bacteria: '细菌域',
    fungi: '真菌界',
    virus: '病毒界',
    archaea: '古菌域',
  };

  categories.forEach((cat) => {
    const catMicrobes = microbes.filter((m) => m.category === cat);
    if (catMicrobes.length === 0) return;

    const domainNode: TreeNode = {
      id: cat,
      name: domainNames[cat],
      rank: cat === 'bacteria' || cat === 'archaea' ? 'domain' : 'kingdom',
      category: cat,
      children: [],
      parentId: 'root',
      description: `${CATEGORY_LABELS[cat]}类微生物的完整分类`,
      microbeCount: catMicrobes.length,
    };
    domainMap.set(cat, domainNode);
    root.children.push(domainNode);

    const phyla = PHYLA_DATA[cat];
    phyla.forEach((phylum) => {
      const phylumNode: TreeNode = {
        id: `${cat}_${phylum.id}`,
        name: phylum.name,
        rank: 'phylum',
        category: cat,
        children: [],
        parentId: cat,
        description: phylum.description,
      };
      phylumMap.set(phylum.id, phylumNode);
      domainNode.children.push(phylumNode);
    });
  });

  microbes.forEach((m) => {
    const taxonomy = MICROBE_TAXONOMY[m.id];
    if (!taxonomy) return;

    const phylumNode = phylumMap.get(taxonomy.phylum);
    if (!phylumNode) return;

    let classNode = classMap.get(taxonomy.class);
    if (!classNode) {
      classNode = {
        id: `class_${taxonomy.class}`,
        name: taxonomy.class,
        rank: 'class',
        category: m.category,
        children: [],
        parentId: phylumNode.id,
      };
      classMap.set(taxonomy.class, classNode);
      phylumNode.children.push(classNode);
    }

    let orderNode = orderMap.get(taxonomy.order);
    if (!orderNode) {
      orderNode = {
        id: `order_${taxonomy.order}`,
        name: taxonomy.order,
        rank: 'order',
        category: m.category,
        children: [],
        parentId: classNode.id,
      };
      orderMap.set(taxonomy.order, orderNode);
      classNode.children.push(orderNode);
    }

    let familyNode = familyMap.get(taxonomy.family);
    if (!familyNode) {
      familyNode = {
        id: `family_${taxonomy.family}`,
        name: taxonomy.family,
        rank: 'family',
        category: m.category,
        children: [],
        parentId: orderNode.id,
      };
      familyMap.set(taxonomy.family, familyNode);
      orderNode.children.push(familyNode);
    }

    let genusNode = genusMap.get(taxonomy.genus);
    if (!genusNode) {
      genusNode = {
        id: `genus_${taxonomy.genus}`,
        name: taxonomy.genus,
        rank: 'genus',
        category: m.category,
        children: [],
        parentId: familyNode.id,
      };
      genusMap.set(taxonomy.genus, genusNode);
      familyNode.children.push(genusNode);
    }

    const profile = getMicrobeAbilityProfile(m.id);
    const speciesNode: TreeNode = {
      id: `species_${m.id}`,
      name: m.name,
      rank: 'species',
      category: m.category,
      microbeId: m.id,
      children: [],
      parentId: genusNode.id,
      description: m.description,
      discoveredYear: m.discoveredYear,
      habitat: m.habitat,
      imageUrl: m.imageUrl,
      scientificName: m.scientificName,
      size: m.size,
      characteristics: m.characteristics,
      abilityTags: profile?.abilities.map((a) => a.tag) ?? [],
    };
    genusNode.children.push(speciesNode);
  });

  function updateCounts(node: TreeNode): number {
    if (node.rank === 'species') {
      node.microbeCount = 1;
      return 1;
    }
    let count = 0;
    node.children.forEach((child) => {
      count += updateCounts(child);
    });
    node.microbeCount = count;
    return count;
  }
  updateCounts(root);

  return root;
}

export function flattenTree(root: TreeNode): TreeNode[] {
  const result: TreeNode[] = [];
  function traverse(node: TreeNode) {
    result.push(node);
    node.children.forEach(traverse);
  }
  traverse(root);
  return result;
}

export function findNodeById(root: TreeNode, id: string): TreeNode | null {
  if (root.id === id) return root;
  for (const child of root.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

export function getAncestorIds(root: TreeNode, nodeId: string): string[] {
  const ancestors: string[] = [];
  function traverse(node: TreeNode, path: string[]): boolean {
    if (node.id === nodeId) {
      ancestors.push(...path);
      return true;
    }
    for (const child of node.children) {
      if (traverse(child, [...path, node.id])) return true;
    }
    return false;
  }
  traverse(root, []);
  return ancestors;
}

export function getDescendantSpecies(node: TreeNode): TreeNode[] {
  const species: TreeNode[] = [];
  function traverse(n: TreeNode) {
    if (n.rank === 'species') {
      species.push(n);
    }
    n.children.forEach(traverse);
  }
  traverse(node);
  return species;
}

export function filterTree(
  root: TreeNode,
  filters: FilterState,
): { filteredRoot: TreeNode; matchedSpeciesIds: Set<string> } {
  const matchedIds = new Set<string>();

  function passesFilter(node: TreeNode): boolean {
    if (node.rank !== 'species') return true;

    if (filters.categories.length > 0 && node.category && !filters.categories.includes(node.category)) {
      return false;
    }

    if (node.discoveredYear !== undefined) {
      if (node.discoveredYear < filters.yearRange[0] || node.discoveredYear > filters.yearRange[1]) {
        return false;
      }
    }

    if (filters.habitats.length > 0 && node.habitat) {
      const habitatMatch = filters.habitats.some((h) => {
        const zone = HABITAT_ZONES.find((z) => z.id === h);
        if (!zone) return false;
        return zone.keywords.some((kw) => node.habitat?.includes(kw));
      });
      if (!habitatMatch) return false;
    }

    if (filters.abilityTags.length > 0 && node.abilityTags) {
      const hasAbility = filters.abilityTags.some((tag) => node.abilityTags?.includes(tag));
      if (!hasAbility) return false;
    }

    return true;
  }

  function cloneFilter(node: TreeNode): TreeNode | null {
    if (node.rank === 'species') {
      if (passesFilter(node)) {
        matchedIds.add(node.id);
        return { ...node, children: [] };
      }
      return null;
    }

    const filteredChildren: TreeNode[] = [];
    for (const child of node.children) {
      const filtered = cloneFilter(child);
      if (filtered) {
        filteredChildren.push(filtered);
      }
    }

    if (filteredChildren.length === 0 && node.rank !== 'domain') return null;

    return {
      ...node,
      children: filteredChildren,
      microbeCount: filteredChildren.reduce((sum, c) => sum + (c.microbeCount || 0), 0),
    };
  }

  const filteredRoot = cloneFilter(root) || root;
  return { filteredRoot, matchedSpeciesIds: matchedIds };
}

export const YEAR_RANGES = [
  { label: '古代至17世纪', range: [0, 1700] as [number, number] },
  { label: '启蒙时代 (1700-1850)', range: [1700, 1850] as [number, number] },
  { label: '近代 (1850-1950)', range: [1850, 1950] as [number, number] },
  { label: '当代 (1950-至今)', range: [1950, 2100] as [number, number] },
];

export { CATEGORY_LABELS, CATEGORY_COLORS, ABILITY_TAG_LABELS, ABILITY_DIMENSION_LABELS };
