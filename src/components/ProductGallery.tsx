"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] || images[0];

  if (!images.length) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl bg-teal-mist text-sm text-sage">
        No image available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface ring-1 ring-line/60">
        <Image
          key={`${current}-${active}`}
          src={current}
          alt={name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-5 animate-fade-in md:p-7"
        />
      </div>

      {images.length > 1 && (
        <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0 sm:gap-3">
          {images.map((src, i) => {
            const selected = i === active;
            return (
              <li key={`${src}-${i}`} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className={`relative block h-16 w-16 overflow-hidden rounded-xl bg-surface transition sm:h-[4.5rem] sm:w-[4.5rem] ${
                    selected
                      ? "outline outline-2 outline-offset-2 outline-teal"
                      : "ring-1 ring-line hover:ring-teal/45"
                  }`}
                  aria-label={`View image ${i + 1}`}
                  aria-current={selected ? "true" : undefined}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="72px"
                    className="object-contain p-1.5"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
