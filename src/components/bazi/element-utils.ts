/** Maps a Heavenly Stem / Earthly Branch / Element name to its Ngũ Hành */
export type ElementType = "wood" | "fire" | "earth" | "metal" | "water";

const WOOD  = ["Giáp", "Ất", "Dần", "Mão"];
const FIRE  = ["Bính", "Đinh", "Tỵ", "Ngọ"];
const EARTH = ["Mậu", "Kỷ", "Thìn", "Tuất", "Sửu", "Mùi"];
const METAL = ["Canh", "Tân", "Thân", "Dậu"];
const WATER = ["Nhâm", "Quý", "Hợi", "Tý"];

export function getElement(name: string): ElementType {
  if (WOOD.includes(name) || name === "Mộc") return "wood";
  if (FIRE.includes(name) || name === "Hỏa") return "fire";
  if (EARTH.includes(name) || name === "Thổ") return "earth";
  if (METAL.includes(name) || name === "Kim") return "metal";
  if (WATER.includes(name) || name === "Thủy") return "water";
  return "earth"; // fallback
}

export function getElementTextClass(name: string): string {
  const el = getElement(name);
  return `text-el-${el}`;
}

export function getElementBgClass(name: string): string {
  const el = getElement(name);
  return `bg-el-${el}`;
}

export function getElementGlowClass(name: string): string {
  const el = getElement(name);
  return `glow-el-${el}`;
}

export function getElementLabel(el: ElementType): string {
  const labels: Record<ElementType, string> = {
    wood: "Mộc", fire: "Hỏa", earth: "Thổ", metal: "Kim", water: "Thủy",
  };
  return labels[el];
}

export function getElementEmoji(el: ElementType): string {
  const emojis: Record<ElementType, string> = {
    wood: "🌿", fire: "🔥", earth: "⛰️", metal: "⚔️", water: "💧",
  };
  return emojis[el];
}
