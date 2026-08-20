"use client";

import { useId } from "react";

type BrandMarkProps = {
  className?: string;
  title?: string;
};

const NODES: { cx: number; cy: number; r: number }[] = [
  { cx: 32, cy: 9.2, r: 2.15 },
  { cx: 47.8, cy: 16.8, r: 1.95 },
  { cx: 54.2, cy: 32, r: 2.05 },
  { cx: 47.2, cy: 48.2, r: 1.95 },
  { cx: 32, cy: 54.6, r: 2.15 },
  { cx: 16.8, cy: 48.2, r: 1.95 },
  { cx: 9.8, cy: 32, r: 2.05 },
  { cx: 16.2, cy: 16.8, r: 1.95 },
  { cx: 22.5, cy: 24.5, r: 1.5 },
  { cx: 41.5, cy: 24.5, r: 1.5 },
  { cx: 22.5, cy: 41, r: 1.5 },
  { cx: 41.5, cy: 41, r: 1.5 },
];

/**
 * Crisp vector mark — network sphere + apex arrow.
 * Animations: pulse nodes + apex rise (respects reduced motion).
 */
export default function BrandMark({
  className = "h-8 w-8",
  title = "CurApex",
}: BrandMarkProps) {
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 64 64"
      className={`brand-mark ${className}`}
      role="img"
      aria-label={title}
      fill="none"
    >
      <defs>
        <linearGradient
          id={`${uid}-ring`}
          x1="8"
          y1="6"
          x2="56"
          y2="58"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4FD4CF" />
          <stop offset="0.55" stopColor="#3A7FD0" />
          <stop offset="1" stopColor="#1E458C" />
        </linearGradient>
        <linearGradient
          id={`${uid}-left`}
          x1="20"
          y1="14"
          x2="32"
          y2="48"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6FE8E0" />
          <stop offset="1" stopColor="#2AA8A4" />
        </linearGradient>
        <linearGradient
          id={`${uid}-right`}
          x1="32"
          y1="14"
          x2="48"
          y2="50"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6A9AE8" />
          <stop offset="1" stopColor="#2A4FA8" />
        </linearGradient>
      </defs>

      <circle className="brand-mark__disc" cx="32" cy="32" r="30" />
      <circle
        cx="32"
        cy="32"
        r="27.5"
        stroke={`url(#${uid}-ring)`}
        strokeWidth="2.2"
        opacity="0.95"
      />

      <g
        stroke={`url(#${uid}-ring)`}
        strokeWidth="1.35"
        strokeLinecap="round"
        opacity="0.8"
      >
        <path d="M32 8.5c8.2 3.2 14.2 10.6 15.8 19.2" />
        <path d="M32 8.5c-8.2 3.2-14.2 10.6-15.8 19.2" />
        <path d="M10.5 36.5c4.6 10.4 14.2 17.2 25.2 17.8" />
        <path d="M53.5 36.5c-4.6 10.4-14.2 17.2-25.2 17.8" />
        <path d="M14 22c6.5-2.8 13.8-2.8 20.4 0" />
        <path d="M50 22c-6.5-2.8-13.8-2.8-20.4 0" />
        <path d="M16 44c5.2 3.4 11.4 5.2 18 5.2" />
        <path d="M48 44c-5.2 3.4-11.4 5.2-18 5.2" />
      </g>

      <g fill={`url(#${uid}-ring)`}>
        {NODES.map((node, i) => (
          <circle
            key={`${node.cx}-${node.cy}`}
            className="brand-mark__node"
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        ))}
      </g>

      <g className="brand-mark__apex">
        <path
          d="M32 15.5 L20.5 42.5 H27.2 L32 30.8 Z"
          fill={`url(#${uid}-left)`}
        />
        <path
          d="M32 15.5 L43.5 42.5 H36.8 L32 30.8 Z"
          fill={`url(#${uid}-right)`}
        />
      </g>
    </svg>
  );
}
