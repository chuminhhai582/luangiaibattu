import timezoneHistory from "../../../data/vn-timezone-history.json";
import provinces from "../../../data/vn-provinces.json";

interface NormalizeInput {
  birth_date: string; // YYYY-MM-DD
  birth_time: string; // HH:mm
  province_code: string;
  use_solar_time: boolean;
}

export function normalizeTime(input: NormalizeInput) {
  const { birth_date, birth_time, province_code, use_solar_time } = input;
  
  // Find province
  const province = provinces.find((p: any) => p.code === province_code) || provinces[0]; // fallback to HN
  
  // Parse date and time to Date object
  // Assume local time as entered, we need to find what GMT offset it was
  const dateStr = `${birth_date}T${birth_time}:00`;
  const tempDate = new Date(dateStr); // this parses as local system time, we just need the string parts
  
  const year = parseInt(birth_date.split('-')[0]);
  const month = parseInt(birth_date.split('-')[1]);
  const day = parseInt(birth_date.split('-')[2]);
  
  const [hourStr, minStr] = birth_time.split(':');
  let hour = parseInt(hourStr);
  let min = parseInt(minStr);
  
  // Find applicable timezone rule
  let appliedRule = timezoneHistory.find((rule: any) => {
    if (birth_date >= rule.from && birth_date <= rule.to) {
      if (rule.region === 'all') return true;
      if (rule.region === province.region_1954_1975) return true;
    }
    return false;
  }) || { utc_offset: "+07:00", note: "Default" };

  let offsetMinutes = 0;
  if (appliedRule.utc_offset.startsWith("+")) {
    const parts = appliedRule.utc_offset.substring(1).split(":");
    offsetMinutes = parseInt(parts[0]) * 60 + (parts[1] ? parseInt(parts[1]) : 0);
  }

  // Calculate GMT+7 standard time
  // If historical offset was +08:00, it means they were 1 hour ahead of GMT+7.
  // So to get back to GMT+7 (standard for bazi calculation usually, or we just calculate true solar time),
  // Actually lunar-typescript works best with Date objects (which use system timezone) or explicit solar terms.
  // We should adjust the hour/min to standard GMT+7.
  
  let diffToGMT7 = 7 * 60 - offsetMinutes; // e.g. +8 is 480. 420 - 480 = -60 mins
  min += diffToGMT7;

  // Apply solar time correction
  let solarTimeCorrected = false;
  if (use_solar_time) {
    const lonDiff = province.longitude - 105;
    const solarDiffMinutes = Math.round(lonDiff * 4);
    min += solarDiffMinutes;
    solarTimeCorrected = true;
  }

  // Normalize hours and minutes
  while (min < 0) {
    min += 60;
    hour -= 1;
  }
  while (min >= 60) {
    min -= 60;
    hour += 1;
  }
  
  // Day rollover
  let dateObj = new Date(year, month - 1, day, hour, min, 0);

  // Near jieqi warning (dummy implementation for MVP)
  // Real implementation would check lunar-typescript Solar to JieQi difference < 2 hours
  let near_jieqi_warning = false;

  return {
    normalized_date: dateObj,
    solar_time_corrected: solarTimeCorrected,
    timezone_rule_applied: `${appliedRule.utc_offset} ${appliedRule.note || ''}`.trim(),
    near_jieqi_warning,
    hour: dateObj.getHours(),
    min: dateObj.getMinutes()
  };
}
