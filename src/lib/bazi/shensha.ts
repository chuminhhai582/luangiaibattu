import { Pillar, ShenSha } from "./types";
import shenshaRules from "../../../data/shensha-rules.json";

export function findShenSha(pillars: { year: Pillar; month: Pillar; day: Pillar; hour: Pillar }): ShenSha[] {
  const shenshaList: ShenSha[] = [];
  
  const ctx = {
    day_gan: pillars.day.gan,
    day_zhi: pillars.day.zhi,
    year_zhi: pillars.year.zhi,
    month_zhi: pillars.month.zhi,
    hour_zhi: pillars.hour.zhi
  };

  const getZhiGroup = (zhi: string) => {
    if (["Thân", "Tý", "Thìn"].includes(zhi)) return "Thân-Tý-Thìn";
    if (["Dần", "Ngọ", "Tuất"].includes(zhi)) return "Dần-Ngọ-Tuất";
    if (["Tỵ", "Dậu", "Sửu"].includes(zhi)) return "Tỵ-Dậu-Sửu";
    if (["Hợi", "Mão", "Mùi"].includes(zhi)) return "Hợi-Mão-Mùi";
    return "";
  };

  shenshaRules.forEach((rule: any) => {
    let lookupKey = "";
    if (rule.lookup_by === "day_gan") lookupKey = ctx.day_gan;
    else if (rule.lookup_by === "day_zhi_group") lookupKey = getZhiGroup(ctx.day_zhi);
    // Add more lookup methods if needed

    const targetZhis = rule.rules[lookupKey] || [];
    const targetZhisArray = Array.isArray(targetZhis) ? targetZhis : [targetZhis];

    rule.match_against.forEach((pos: string) => {
      const zhiAtPos = ctx[pos as keyof typeof ctx];
      if (targetZhisArray.includes(zhiAtPos)) {
        const positionName = pos === "year_zhi" ? "chi năm" :
                             pos === "month_zhi" ? "chi tháng" :
                             pos === "day_zhi" ? "chi ngày" : "chi giờ";
        shenshaList.push({ name: rule.name, position: positionName });
      }
    });
  });

  return shenshaList;
}
