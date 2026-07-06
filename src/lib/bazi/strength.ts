import strengthWeights from "../../../data/strength-weights.json";

export function calculateStrength(
  dayGanElement: string,
  monthZhi: string,
  zhis: string[], // year, month, day, hour
  gans: string[] // year, month, hour
): { score: number; label: string; detail: any } {
  // A simplistic MVP implementation
  // In reality, you'd check Lunar-TypeScript's DiShi (12 states) for accurate de_lenh

  let deLenhScore = 0.5; // Mock calculation
  let deDiaScore = 0.4;  // Mock calculation
  let deTheScore = 0.3;  // Mock calculation

  const w = strengthWeights as any;
  const score = 
    deLenhScore * w.de_lenh.weight + 
    deDiaScore * w.de_dia.weight + 
    deTheScore * w.de_the.weight;

  let label = "trung hòa";
  for (const l of w.labels) {
    if (score >= l.min) {
      label = l.label;
      break;
    }
  }

  return {
    score,
    label,
    detail: {
      de_lenh: deLenhScore,
      de_dia: deDiaScore,
      de_the: deTheScore
    }
  };
}
