"use client";

import type { CSSProperties, ReactNode } from "react";
import { useId, useState } from "react";

type SpecRow = {
  label: string;
  value: string;
};

type Tone = {
  accent: string;
  wash: string;
};

export default function SpecsPanel({
  fields,
  formTone,
}: {
  fields: SpecRow[];
  parentTone: Tone;
  formTone: Tone;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="group flex h-9 w-full items-center gap-2 rounded-md border border-line/70 bg-surface/60 px-2 text-left transition hover:border-teal/35 hover:bg-surface"
      >
        <span
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded"
          style={{
            background: formTone.wash,
            color: formTone.accent,
          }}
          aria-hidden
        >
          <ListIcon />
        </span>
        <span className="font-display text-sm leading-none text-ink">
          Specifications
        </span>
        <span className="min-w-0 flex-1 truncate text-[0.68rem] leading-none text-ink-soft/60">
          {open ? "Hide pack, strength & more" : "See pack, strength & more"}
        </span>
        <span
          className={`inline-flex h-6 w-6 shrink-0 items-center justify-center text-ink-soft transition duration-300 group-hover:text-teal ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        >
          <ChevronDown />
        </span>
      </button>

      <div
        id={panelId}
        className={`specs-parallax grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
        data-open={open ? "true" : "false"}
      >
        <div className="min-h-0 overflow-hidden">
          <dl
            className={`mt-3 overflow-hidden rounded-xl border border-line/70 bg-surface/60 transition duration-500 ease-out ${
              open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {fields.map((row, i) => {
              const { accent, wash, icon } = specMeta(row.label);
              const depth = ((i % 4) + 1) * 8;
              return (
                <div
                  key={row.label}
                  className="specs-parallax-row grid grid-cols-[9.5rem_1fr] items-start gap-3 border-b border-line/60 px-3.5 py-2.5 last:border-b-0 sm:grid-cols-[11rem_1fr] sm:gap-5 sm:px-4"
                  style={
                    {
                      "--row-delay": `${90 + i * 48}ms`,
                      "--row-depth": `${depth}px`,
                    } as CSSProperties
                  }
                >
                  <dt
                    className="flex items-center gap-1.5 text-xs font-medium"
                    style={{ color: accent }}
                  >
                    <span
                      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
                      style={{ background: wash, color: accent }}
                      aria-hidden
                    >
                      {icon}
                    </span>
                    <span className="opacity-80">{row.label}</span>
                  </dt>
                  <dd className="text-sm leading-snug text-ink">{row.value}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </div>
  );
}

function tone(accent: string, alpha = 0.13): Tone {
  const r = parseInt(accent.slice(1, 3), 16);
  const g = parseInt(accent.slice(3, 5), 16);
  const b = parseInt(accent.slice(5, 7), 16);
  return { accent, wash: `rgba(${r},${g},${b},${alpha})` };
}

function iconSvg(children: ReactNode, className = "h-3.5 w-3.5") {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      {children}
    </svg>
  );
}

function specMeta(label: string): Tone & { icon: ReactNode } {
  const key = label.toLowerCase();

  // Order matters — more specific phrases first
  if (key.includes("instruction") || key.includes("direction")) {
    return {
      ...tone("#0a6e7a"),
      icon: iconSvg(
        <path
          d="M8 3h7l3 3v15H8V3zM15 3v3h3M10 10h6M10 14h6M10 18h4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      ),
    };
  }
  if (key.includes("dosage") || key.includes("form")) {
    return {
      ...tone("#3d8ec4"),
      icon: iconSvg(
        <path
          d="M8.5 15.5l7-7a3.5 3.5 0 015 5l-7 7a3.5 3.5 0 01-5-5z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      ),
    };
  }
  if (key.includes("category")) {
    return {
      ...tone("#1fa8a0"),
      icon: iconSvg(
        <path
          d="M12 4l8 4-8 4-8-4 8-4zm-8 8l8 4 8-4M4 16l8 4 8-4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      ),
    };
  }
  if (key.includes("composition") || key.includes("ingredient")) {
    return {
      ...tone("#5a9aaa"),
      icon: iconSvg(
        <path
          d="M9 3h6M10 3v5.2L5.8 18a2.8 2.8 0 002.5 4h7.4a2.8 2.8 0 002.5-4L14 8.2V3M8.5 14h7"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    };
  }
  if (key.includes("strength") || key.includes("potency")) {
    return {
      ...tone("#9a6a10"),
      icon: iconSvg(
        <path
          d="M13 2L5 14h6l-1 8 9-13h-6l0-7z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      ),
    };
  }
  if (key.includes("brand")) {
    return {
      ...tone("#6b8aa0"),
      icon: iconSvg(
        <path
          d="M4 12l8-8h6v6l-8 8L4 12zM15.5 7.5h.01"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    };
  }
  if (key.includes("pack")) {
    return {
      ...tone("#7a8a96"),
      icon: iconSvg(
        <path
          d="M4 8.5l8-3.5 8 3.5v8.2l-8 3.8-8-3.8V8.5zM12 5v15.5M4 8.5l8 4 8-4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      ),
    };
  }
  if (key.includes("moq") || key.includes("minimum")) {
    return {
      ...tone("#6a7a3d"),
      icon: iconSvg(
        <path
          d="M4 8h16M6 12h12M8 16h8"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      ),
    };
  }
  if (key.includes("manufacturer") || key.includes("company") || key.includes("maker")) {
    return {
      ...tone("#4a5d72"),
      icon: iconSvg(
        <path
          d="M3 21h18M5 21V9l5 3V9l5 3V7l4-2v16M8 17h.01M12 17h.01M16 17h.01"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    };
  }
  if (key.includes("treatment") || key.includes("indication") || key.includes("use")) {
    return {
      ...tone("#8a4b4b"),
      icon: iconSvg(
        <path
          d="M12 21s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.6-7 10-7 10z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      ),
    };
  }
  if (key.includes("shelf") || key.includes("expiry") || key.includes("expire")) {
    return {
      ...tone("#2f6f8f"),
      icon: iconSvg(
        <path
          d="M8 3v3M16 3v3M5 9h14M6 6h12a1 1 0 011 1v12a1 1 0 01-1 1H6a1 1 0 01-1-1V7a1 1 0 011-1zM9 13h6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    };
  }
  if (key.includes("storage") || key.includes("store")) {
    return {
      ...tone("#4a8fd8"),
      icon: iconSvg(
        <path
          d="M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M3 12h2M19 12h2M5.6 18.4l1.4-1.4M17 7l1.4-1.4M12 8a4 4 0 100 8 4 4 0 000-8z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      ),
    };
  }
  if (key.includes("cert")) {
    return {
      ...tone("#1fa8a0"),
      icon: iconSvg(
        <path
          d="M12 3l8 3.5v5.2c0 5-3.4 8.5-8 9.8-4.6-1.3-8-4.8-8-9.8V6.5L12 3zM9.5 12l1.8 1.8L15 10"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ),
    };
  }
  if (key.includes("price")) {
    return {
      ...tone("#9a6a10"),
      icon: iconSvg(
        <path
          d="M12 3v18M16 8.5c0-1.7-1.8-3-4-3s-4 1.3-4 3 1.8 2.6 4 3 4 1.4 4 3-1.8 3-4 3-4-1.3-4-3"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      ),
    };
  }

  return {
    ...tone("#7a8a96"),
    icon: iconSvg(
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
    ),
  };
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <path
        d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
