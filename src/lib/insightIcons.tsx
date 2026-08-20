import type { ReactNode } from "react";
import type { AccentTone } from "@/lib/categoryStyle";

/** Stable color codes per therapeutic / trade category */
const CATEGORY_TONES: Record<string, AccentTone> = {
  Antibiotics: { accent: "#1fa8a0", wash: "rgba(31,168,160,0.14)", mist: "#e6f7f5" },
  "Pain Killers": { accent: "#c07070", wash: "rgba(192,112,112,0.14)", mist: "#f6ecec" },
  "Anti Cancer": { accent: "#3d8ec4", wash: "rgba(61,142,196,0.14)", mist: "#e7f1f5" },
  "Anti Diabetics": { accent: "#c9a03a", wash: "rgba(201,160,58,0.16)", mist: "#f7f1e4" },
  "ED Medicines": { accent: "#4a8fd8", wash: "rgba(74,143,216,0.14)", mist: "#e6f7f5" },
  Antiviral: { accent: "#5a9aaa", wash: "rgba(90,154,170,0.16)", mist: "#eef3f7" },
  "Skin Care": { accent: "#7a8a96", wash: "rgba(122,138,150,0.16)", mist: "#eef4f8" },
  Cardiac: { accent: "#d06070", wash: "rgba(208,96,112,0.14)", mist: "#f7ebee" },
  Steroids: { accent: "#8a7ab0", wash: "rgba(138,122,176,0.16)", mist: "#f0eef5" },
  "HIV Drugs": { accent: "#4a9ec4", wash: "rgba(74,158,196,0.16)", mist: "#e7f2f6" },
  "General Medicines": { accent: "#6b8aa0", wash: "rgba(107,138,160,0.14)", mist: "#e8eef1" },
  "Anti Anxiety": { accent: "#7a92b0", wash: "rgba(122,146,176,0.16)", mist: "#eef2f6" },
  Fertility: { accent: "#c09050", wash: "rgba(192,144,80,0.16)", mist: "#f7f0e6" },
  "Weight Loss": { accent: "#1fa8a0", wash: "rgba(31,168,160,0.16)", mist: "#e6f7f5" },
  "Anti Parasitic": { accent: "#a09050", wash: "rgba(160,144,80,0.16)", mist: "#f4f1e8" },
  "Sleeping Pills": { accent: "#7a8ab0", wash: "rgba(122,138,176,0.16)", mist: "#eef0f6" },
  Thyroid: { accent: "#a08060", wash: "rgba(160,128,96,0.16)", mist: "#f5f0e9" },
  Export: { accent: "#1fa8a0", wash: "rgba(31,168,160,0.14)", mist: "#e6f7f5" },
};

export function insightTone(category?: string | null): AccentTone {
  if (!category) return CATEGORY_TONES.Export;
  return CATEGORY_TONES[category] || CATEGORY_TONES["General Medicines"];
}

function iconSvg(children: ReactNode, className = "h-4 w-4") {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      {children}
    </svg>
  );
}

/** Category symbol for Insights filters + cards */
export function insightCategoryIcon(
  category?: string | null,
  className = "h-4 w-4"
): ReactNode {
  const key = (category || "export").toLowerCase();

  if (key.includes("pain"))
    return iconSvg(
      <path
        d="M12 3l2.2 5.4L20 10l-4.5 3.6L17 20l-5-3.2L7 20l1.5-6.4L4 10l5.8-1.6L12 3z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />,
      className
    );

  if (key.includes("cancer"))
    return iconSvg(
      <>
        <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M12 3.5v2.5M12 18v2.5M3.5 12h2.5M18 12h2.5M6.2 6.2l1.8 1.8M16 16l1.8 1.8M17.8 6.2L16 8M8 16l-1.8 1.8"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </>,
      className
    );

  if (key.includes("diabet"))
    return iconSvg(
      <path
        d="M12 3c3.8 4.2 6.5 7.4 6.5 10.4A6.5 6.5 0 0112 20a6.5 6.5 0 01-6.5-6.6C5.5 10.4 8.2 7.2 12 3z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />,
      className
    );

  if (key.includes("ed medicine") || key === "ed medicines")
    return iconSvg(
      <path
        d="M12 20s-7-4.4-7-9.5A4.5 4.5 0 0112 7a4.5 4.5 0 017 3.5C19 15.6 12 20 12 20z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />,
      className
    );

  if (key.includes("viral") || key.includes("hiv"))
    return iconSvg(
      <>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M12 5v2M12 17v2M5 12h2M17 12h2M7.2 7.2l1.4 1.4M15.4 15.4l1.4 1.4M16.8 7.2l-1.4 1.4M8.6 15.4l-1.4 1.4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </>,
      className
    );

  if (key.includes("skin"))
    return iconSvg(
      <path
        d="M8 8c0-2.2 1.8-4 4-4s4 1.8 4 4c0 3-2 4.5-2 7H10c0-2.5-2-4-2-7zM10 17h4v2a2 2 0 01-4 0v-2z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />,
      className
    );

  if (key.includes("cardiac") || key.includes("antihypertensive"))
    return iconSvg(
      <path
        d="M4 12h3l2-4 3 8 2-4h6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />,
      className
    );

  if (key.includes("steroid") || key.includes("growth"))
    return iconSvg(
      <path
        d="M8 4h8M9 4v4.5L7 14v4h10v-4l-2-5.5V4M10 18h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />,
      className
    );

  if (key.includes("anxiety"))
    return iconSvg(
      <path
        d="M12 4a7 7 0 017 7c0 3.2-1.8 5.2-3.5 6.5-.7.5-1.2 1.3-1.2 2.1V21H9.7v-1.4c0-.8-.5-1.6-1.2-2.1C6.8 16.2 5 14.2 5 11a7 7 0 017-7z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />,
      className
    );

  if (key.includes("fertility"))
    return iconSvg(
      <>
        <circle cx="9" cy="10" r="3" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="15.5" cy="10" r="3" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M9 13v5M15.5 13v5M7.5 20h3M14 20h3"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </>,
      className
    );

  if (key.includes("weight"))
    return iconSvg(
      <path
        d="M7 10h10l-1.2 9H8.2L7 10zM9.5 10V8.5A2.5 2.5 0 0112 6a2.5 2.5 0 012.5 2.5V10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />,
      className
    );

  if (key.includes("parasitic"))
    return iconSvg(
      <path
        d="M12 4c3 2.5 5 5.2 5 8.2A5 5 0 017 12.2C7 9.2 9 6.5 12 4zM8 16.5c1.2.9 2.5 1.5 4 1.5s2.8-.6 4-1.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />,
      className
    );

  if (key.includes("sleep"))
    return iconSvg(
      <path
        d="M14.5 4.5A7 7 0 1110 19.2 6.2 6.2 0 0014.5 4.5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />,
      className
    );

  if (key.includes("thyroid"))
    return iconSvg(
      <path
        d="M8 9c0-2.2 1.8-4 4-4s4 1.8 4 4c0 3.5-2.2 4.5-2.2 8H10.2C10.2 13.5 8 12.5 8 9zM10 19h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />,
      className
    );

  if (key.includes("antibiotic"))
    return iconSvg(
      <>
        <rect
          x="8"
          y="3.5"
          width="8"
          height="17"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path d="M8 9h8M8 15h8" stroke="currentColor" strokeWidth="1.7" />
      </>,
      className
    );

  if (key.includes("general"))
    return iconSvg(
      <path
        d="M5 7h6v6H5V7zm8 0h6v4h-6V7zM5 15h6v4H5v-4zm8-2h6v6h-6v-6z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />,
      className
    );

  // Export / default
  return iconSvg(
    <path
      d="M5 12h10M12 7l5 5-5 5M5 19h14"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    className
  );
}
