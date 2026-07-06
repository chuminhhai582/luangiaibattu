export interface BaziChartJSON {
  engine_version: string;
  meta: {
    solar_datetime: string;
    lunar_date: string;
    solar_time_corrected: boolean;
    timezone_rule_applied: string;
    zi_hour_sect: number;
    near_jieqi_warning: boolean;
    gender: "nam" | "nữ";
  };
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar;
  };
  day_master: {
    gan: string;
    element: string;
    yin_yang: string;
  };
  five_elements: {
    count: Record<string, number>;
    season_state: string;
  };
  strength: {
    score: number;
    label: string;
    detail: {
      de_lenh: number;
      de_dia: number;
      de_the: number;
    };
  };
  relations: Relation[];
  shen_sha: ShenSha[];
  da_yun: {
    direction: "thuận" | "nghịch";
    start_age: number;
    start_year: number;
    list: DaYun[];
  };
  liu_nian_current?: {
    year: number;
    gan_zhi: string;
    shi_shen: string;
  };
}

export interface Pillar {
  gan: string;
  zhi: string;
  hide_gan: string[];
  na_yin: string;
  shi_shen_gan: string;
  shi_shen_zhi: string[];
}

export interface Relation {
  type: string;
  between: string[];
  result?: string;
}

export interface ShenSha {
  name: string;
  position: string;
}

export interface DaYun {
  index: number;
  gan_zhi: string;
  from_age: number;
  to_age: number;
  shi_shen: string;
  from_year: number;
  to_year: number;
}
