import crypto from 'crypto';

export function generateChartHash(
  eightCharString: string, // e.g. "CanhNgọMậuTýẤtDậuCanhThìn"
  gender: string,
  startAge: number,
  direction: string,
  engineVersion: string
): string {
  const payload = `${eightCharString}_${gender}_${startAge}_${direction}_${engineVersion}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}
