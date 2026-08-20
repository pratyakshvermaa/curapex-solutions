"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type InsightStickyBarProps = {
  catalogHref: string;
  catalogLabel: string;
  shareTitle: string;
  shareUrl: string;
};

export default function InsightStickyBar({
  catalogHref,
  catalogLabel,
  shareTitle,
  shareUrl,
}: InsightStickyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 320);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shareMessage = encodeURIComponent(
    `I read "${shareTitle}" on Curapex Solutions — ${shareUrl}`
  );
  const whatsappShare = `https://wa.me/?text=${shareMessage}`;

  return (
    <div
      className={`insight-sticky-bar ${visible ? "is-visible" : ""}`}
      aria-hidden={!visible}
    >
      <div className="insight-sticky-bar-inner">
        <Link href={catalogHref} className="insight-sticky-primary">
          {catalogLabel}
        </Link>
        <a
          href={whatsappShare}
          target="_blank"
          rel="noopener noreferrer"
          className="insight-sticky-secondary"
        >
          Share
        </a>
      </div>
    </div>
  );
}
