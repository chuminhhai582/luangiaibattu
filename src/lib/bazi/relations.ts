import { Pillar, Relation } from "./types";

const HEAVENLY_COMBINATIONS: Record<string, string> = {
  "Giáp-Kỷ": "hóa Thổ", "Kỷ-Giáp": "hóa Thổ",
  "Ất-Canh": "hóa Kim", "Canh-Ất": "hóa Kim",
  "Bính-Tân": "hóa Thủy", "Tân-Bính": "hóa Thủy",
  "Đinh-Nhâm": "hóa Mộc", "Nhâm-Đinh": "hóa Mộc",
  "Mậu-Quý": "hóa Hỏa", "Quý-Mậu": "hóa Hỏa",
};

const HEAVENLY_CLASHES = [
  "Giáp-Canh", "Canh-Giáp",
  "Ất-Tân", "Tân-Ất",
  "Nhâm-Bính", "Bính-Nhâm",
  "Quý-Đinh", "Đinh-Quý",
];

const EARTHLY_COMBINATIONS_6: Record<string, string> = {
  "Tý-Sửu": "hóa Thổ", "Sửu-Tý": "hóa Thổ",
  "Dần-Hợi": "hóa Mộc", "Hợi-Dần": "hóa Mộc",
  "Mão-Tuất": "hóa Hỏa", "Tuất-Mão": "hóa Hỏa",
  "Thìn-Dậu": "hóa Kim", "Dậu-Thìn": "hóa Kim",
  "Tỵ-Thân": "hóa Thủy", "Thân-Tỵ": "hóa Thủy",
  "Ngọ-Mùi": "hóa Hỏa/Thổ", "Mùi-Ngọ": "hóa Hỏa/Thổ",
};

const EARTHLY_COMBINATIONS_3_DIRECTION = [
  ["Dần", "Mão", "Thìn"], // Mộc
  ["Tỵ", "Ngọ", "Mùi"],   // Hỏa
  ["Thân", "Dậu", "Tuất"],// Kim
  ["Hợi", "Tý", "Sửu"]    // Thủy
];

const EARTHLY_COMBINATIONS_3 = [
  ["Thân", "Tý", "Thìn"], // Thủy
  ["Hợi", "Mão", "Mùi"],  // Mộc
  ["Dần", "Ngọ", "Tuất"], // Hỏa
  ["Tỵ", "Dậu", "Sửu"]    // Kim
];

const EARTHLY_CLASHES = [
  "Tý-Ngọ", "Ngọ-Tý",
  "Sửu-Mùi", "Mùi-Sửu",
  "Dần-Thân", "Thân-Dần",
  "Mão-Dậu", "Dậu-Mão",
  "Thìn-Tuất", "Tuất-Thìn",
  "Tỵ-Hợi", "Hợi-Tỵ"
];

export function extractRelations(pillars: { year: Pillar; month: Pillar; day: Pillar; hour: Pillar }): Relation[] {
  const relations: Relation[] = [];
  const gans = [
    { name: pillars.year.gan, pos: "năm" },
    { name: pillars.month.gan, pos: "tháng" },
    { name: pillars.day.gan, pos: "ngày" },
    { name: pillars.hour.gan, pos: "giờ" }
  ];
  const zhis = [
    { name: pillars.year.zhi, pos: "năm" },
    { name: pillars.month.zhi, pos: "tháng" },
    { name: pillars.day.zhi, pos: "ngày" },
    { name: pillars.hour.zhi, pos: "giờ" }
  ];

  // 1. Heavenly Stem Combinations & Clashes
  for (let i = 0; i < gans.length; i++) {
    for (let j = i + 1; j < gans.length; j++) {
      const pair = `${gans[i].name}-${gans[j].name}`;
      if (HEAVENLY_COMBINATIONS[pair]) {
        relations.push({
          type: "thiên can hợp",
          between: [`${gans[i].name}(${gans[i].pos})`, `${gans[j].name}(${gans[j].pos})`],
          result: HEAVENLY_COMBINATIONS[pair]
        });
      }
      if (HEAVENLY_CLASHES.includes(pair)) {
        relations.push({
          type: "thiên can xung",
          between: [`${gans[i].name}(${gans[i].pos})`, `${gans[j].name}(${gans[j].pos})`]
        });
      }
    }
  }

  // 2. Earthly Branch Combinations (Lục hợp) & Clashes (Lục xung)
  for (let i = 0; i < zhis.length; i++) {
    for (let j = i + 1; j < zhis.length; j++) {
      const pair = `${zhis[i].name}-${zhis[j].name}`;
      if (EARTHLY_COMBINATIONS_6[pair]) {
        relations.push({
          type: "lục hợp",
          between: [`${zhis[i].name}(${zhis[i].pos})`, `${zhis[j].name}(${zhis[j].pos})`],
          result: EARTHLY_COMBINATIONS_6[pair]
        });
      }
      if (EARTHLY_CLASHES.includes(pair)) {
        relations.push({
          type: "xung",
          between: [`${zhis[i].name}(${zhis[i].pos})`, `${zhis[j].name}(${zhis[j].pos})`]
        });
      }
    }
  }

  // 3. Earthly Branch Combinations (Tam hợp, Tam hội)
  const zhiNames = zhis.map(z => z.name);
  
  // Tam hợp
  EARTHLY_COMBINATIONS_3.forEach(combo => {
    if (combo.every(zhi => zhiNames.includes(zhi))) {
      relations.push({
        type: "tam hợp",
        between: combo,
        result: `hóa ${combo[0] === 'Thân' ? 'Thủy' : combo[0] === 'Hợi' ? 'Mộc' : combo[0] === 'Dần' ? 'Hỏa' : 'Kim'}`
      });
    }
  });

  // Tam hội
  EARTHLY_COMBINATIONS_3_DIRECTION.forEach(combo => {
    if (combo.every(zhi => zhiNames.includes(zhi))) {
      relations.push({
        type: "tam hội",
        between: combo,
        result: `hóa ${combo[0] === 'Dần' ? 'Mộc' : combo[0] === 'Tỵ' ? 'Hỏa' : combo[0] === 'Thân' ? 'Kim' : 'Thủy'}`
      });
    }
  });

  return relations;
}
