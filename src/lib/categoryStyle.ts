/** Shared color language + symbols for catalog / category UI */

export type AccentTone = {
  accent: string;
  wash: string;
  mist: string;
};

const TONES: AccentTone[] = [
  { accent: "#1fa8a0", wash: "rgba(31,168,160,0.12)", mist: "#e6f7f5" },
  { accent: "#3d8ec4", wash: "rgba(61,142,196,0.14)", mist: "#e7f1f5" },
  { accent: "#4a8fd8", wash: "rgba(74,143,216,0.14)", mist: "#e6f7f5" },
  { accent: "#5a9aaa", wash: "rgba(90,154,170,0.14)", mist: "#eef3f7" },
  { accent: "#6b8aa0", wash: "rgba(107,138,160,0.14)", mist: "#e8eef1" },
  { accent: "#7a8a96", wash: "rgba(122,138,150,0.14)", mist: "#eef4f8" },
  { accent: "#9a6a10", wash: "rgba(196,138,26,0.14)", mist: "#f7f1e4" },
  { accent: "#c07070", wash: "rgba(192,112,112,0.14)", mist: "#f6ecec" },
];

/** Stable dosage-form colors (not hashed) */
const FORM_TONES: Record<string, AccentTone> = {
  tablet: { accent: "#1fa8a0", wash: "rgba(31,168,160,0.12)", mist: "#e6f7f5" },
  capsule: { accent: "#3d8ec4", wash: "rgba(61,142,196,0.14)", mist: "#e7f1f5" },
  syringe: { accent: "#c07070", wash: "rgba(192,112,112,0.14)", mist: "#f6ecec" },
  tube: { accent: "#9a6a10", wash: "rgba(196,138,26,0.14)", mist: "#f7f1e4" },
  drop: { accent: "#3d8ec4", wash: "rgba(61,142,196,0.14)", mist: "#e7f1f5" },
  bottle: { accent: "#5a9aaa", wash: "rgba(90,154,170,0.14)", mist: "#eef3f7" },
  inhaler: { accent: "#4a8fd8", wash: "rgba(74,143,216,0.14)", mist: "#e6f7f5" },
  jelly: { accent: "#7a8a96", wash: "rgba(122,138,150,0.14)", mist: "#eef4f8" },
};

export function toneForForm(form?: string | null): AccentTone {
  const glyph = dosageGlyph(form);
  return FORM_TONES[glyph] || TONES[0];
}

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function toneForCategory(name?: string | null): AccentTone {
  if (!name) return TONES[0];
  return TONES[hash(name) % TONES.length];
}

export function dosageGlyph(form?: string | null): string {
  const f = (form || "").toLowerCase();
  if (f.includes("inject")) return "syringe";
  if (f.includes("capsule")) return "capsule";
  if (f.includes("cream") || f.includes("gel")) return "tube";
  if (f.includes("drop")) return "drop";
  if (f.includes("syrup")) return "bottle";
  if (f.includes("inhal")) return "inhaler";
  if (f.includes("jelly")) return "jelly";
  return "tablet";
}
