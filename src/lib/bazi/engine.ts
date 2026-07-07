import { Solar, Lunar, EightChar } from 'lunar-typescript';
import { BaziChartJSON, Pillar, DaYun } from './types';
import { normalizeTime } from '../time/normalize';
import { extractRelations } from './relations';
import { findShenSha } from './shensha';
import { calculateStrength } from './strength';
import { generateChartHash } from './hash';

export function buildChart(input: {
  birth_date: string;
  birth_time: string;
  calendar_type: 'solar' | 'lunar';
  gender: 'nam' | 'nữ';
  province_code: string;
  use_solar_time: boolean;
  zi_hour_sect: number; // 1 or 2
}): BaziChartJSON {
  const ENGINE_VERSION = "1.0.0";

  let solarDate: Solar;
  
  if (input.calendar_type === 'lunar') {
    const [y, m, d] = input.birth_date.split('-').map(Number);
    const lunar = Lunar.fromYmd(y, m, d);
    solarDate = lunar.getSolar();
  } else {
    const [y, m, d] = input.birth_date.split('-').map(Number);
    solarDate = Solar.fromYmd(y, m, d);
  }

  const normalized = normalizeTime({
    birth_date: solarDate.toYmd(),
    birth_time: input.birth_time,
    province_code: input.province_code,
    use_solar_time: input.use_solar_time
  });

  const exactSolar = Solar.fromYmdHms(
    normalized.normalized_date.getFullYear(),
    normalized.normalized_date.getMonth() + 1,
    normalized.normalized_date.getDate(),
    normalized.hour,
    normalized.min,
    0
  );

  const lunarDate = exactSolar.getLunar();
  const eightChar = lunarDate.getEightChar();
  eightChar.setSect(input.zi_hour_sect);

  const getPillar = (type: 'year' | 'month' | 'day' | 'hour'): Pillar => {
    let gan = '', zhi = '', hideGan: string[] = [], naYin = '', shiShenGan = '', shiShenZhi: string[] = [];
    if (type === 'year') {
      gan = eightChar.getYearGan(); zhi = eightChar.getYearZhi();
      hideGan = eightChar.getYearHideGan(); naYin = eightChar.getYearNaYin();
      shiShenGan = eightChar.getYearShiShenGan(); shiShenZhi = eightChar.getYearShiShenZhi();
    } else if (type === 'month') {
      gan = eightChar.getMonthGan(); zhi = eightChar.getMonthZhi();
      hideGan = eightChar.getMonthHideGan(); naYin = eightChar.getMonthNaYin();
      shiShenGan = eightChar.getMonthShiShenGan(); shiShenZhi = eightChar.getMonthShiShenZhi();
    } else if (type === 'day') {
      gan = eightChar.getDayGan(); zhi = eightChar.getDayZhi();
      hideGan = eightChar.getDayHideGan(); naYin = eightChar.getDayNaYin();
      shiShenGan = "NHẬT CHỦ"; shiShenZhi = eightChar.getDayShiShenZhi();
    } else {
      gan = eightChar.getTimeGan(); zhi = eightChar.getTimeZhi();
      hideGan = eightChar.getTimeHideGan(); naYin = eightChar.getTimeNaYin();
      shiShenGan = eightChar.getTimeShiShenGan(); shiShenZhi = eightChar.getTimeShiShenZhi();
    }
    return { gan, zhi, hide_gan: hideGan, na_yin: naYin, shi_shen_gan: shiShenGan, shi_shen_zhi: shiShenZhi };
  };

  const pillars = {
    year: getPillar('year'),
    month: getPillar('month'),
    day: getPillar('day'),
    hour: getPillar('hour')
  };

  const genderNum = input.gender === 'nam' ? 1 : 0;
  const yun = eightChar.getYun(genderNum);
  const daYunList = yun.getDaYun();
  
  const da_yun = {
    direction: yun.isForward() ? "thuận" : "nghịch" as "thuận" | "nghịch",
    start_age: yun.getStartAge(),
    start_year: yun.getStartSolarYear(),
    list: daYunList.slice(0, 10).map(dy => ({
      index: dy.getIndex(),
      gan_zhi: dy.getGanZhi(),
      from_age: dy.getStartAge(),
      to_age: dy.getEndAge(),
      shi_shen: "", // In a full implementation, you'd calculate ten gods for the da yun gan
      from_year: dy.getStartYear(),
      to_year: dy.getEndYear()
    }))
  };

  const strength = calculateStrength(
    pillars.day.gan, pillars.month.zhi,
    [pillars.year.zhi, pillars.month.zhi, pillars.day.zhi, pillars.hour.zhi],
    [pillars.year.gan, pillars.month.gan, pillars.hour.gan]
  );

  // Five elements count
  const allElements = [pillars.year.gan, pillars.year.zhi, pillars.month.gan, pillars.month.zhi, pillars.day.gan, pillars.day.zhi, pillars.hour.gan, pillars.hour.zhi].join("");
  // Simple mapping, proper mapping needed for actual counting
  
  return {
    engine_version: ENGINE_VERSION,
    meta: {
      solar_datetime: exactSolar.toYmdHms(),
      lunar_date: `${lunarDate.getDayInChinese()} tháng ${lunarDate.getMonthInChinese()} năm ${lunarDate.getYearInGanZhi()}`,
      solar_time_corrected: normalized.solar_time_corrected,
      timezone_rule_applied: normalized.timezone_rule_applied,
      zi_hour_sect: input.zi_hour_sect,
      near_jieqi_warning: normalized.near_jieqi_warning,
      gender: input.gender
    },
    pillars,
    day_master: {
      gan: pillars.day.gan,
      element: "Mộc", // Placeholder, use lunar-typescript to get element
      yin_yang: "âm" // Placeholder
    },
    five_elements: {
      count: { "Mộc": 2, "Hỏa": 1, "Thổ": 3, "Kim": 3, "Thủy": 2 }, // Placeholder
      season_state: "Placeholder"
    },
    strength,
    relations: extractRelations(pillars),
    shen_sha: findShenSha(pillars),
    da_yun,
    liu_nian_current: {
      year: new Date().getFullYear(),
      gan_zhi: "...",
      shi_shen: "..."
    }
  };
}
