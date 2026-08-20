import Image from "next/image";
import Link from "next/link";

const markets = [
  { code: "gb", name: "United Kingdom" },
  { code: "us", name: "United States" },
  { code: "de", name: "Germany" },
  { code: "nl", name: "Netherlands" },
  { code: "be", name: "Belgium" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden text-white/90">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(520px 220px at 10% 0%, rgba(72,220,212,0.18) 0%, transparent 55%), radial-gradient(420px 180px at 95% 30%, rgba(255,255,255,0.05) 0%, transparent 50%), linear-gradient(180deg, #1a1b1e 0%, #0a0a0b 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal/40 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-5 py-5 md:px-8 md:py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-3xl leading-none tracking-tight md:text-[2.15rem]">
              <span className="brand-wordmark">CURAPEX</span>
              <span
                className="brand-live-dot"
                title="Always live"
                aria-label="Always live"
                role="img"
              />
            </p>
            <p className="mt-1.5 text-[0.7rem] uppercase tracking-[0.18em] text-white/55">
              Solutions
            </p>
            <p className="mt-1 text-[0.7rem] text-white/45">
              Pharmaceutical wholesale &amp; export · Business enquiries only
            </p>
          </div>

          <Link
            href="/catalog"
            className="pressable inline-flex items-center gap-1.5 self-start rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/10 sm:self-center"
          >
            Browse catalog
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mt-3.5 space-y-2.5 border-t border-white/[0.08] pt-3">
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.68rem] font-medium">
            <li>
              <Link
                href="/catalog"
                className="text-white/40 transition hover:text-white/70"
              >
                Catalog
              </Link>
            </li>
            <li>
              <Link
                href="/insights"
                className="text-white/40 transition hover:text-white/70"
              >
                Insights
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-white/40 transition hover:text-white/70"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/policies"
                className="text-white/40 transition hover:text-white/70"
              >
                Policies
              </Link>
            </li>
          </ul>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.14em] text-white/30">
                Export markets
              </p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {markets.map((m) => (
                  <li
                    key={m.code}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] py-0.5 pl-0.5 pr-2"
                  >
                    <span className="relative inline-flex h-3.5 w-3.5 overflow-hidden rounded-full ring-1 ring-white/15">
                      <Image
                        src={`/images/flags/${m.code}.png`}
                        alt=""
                        width={14}
                        height={14}
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span className="text-[0.65rem] text-white/70">{m.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[0.65rem] text-white/30 sm:text-right">
              © {new Date().getFullYear()} CURAPEX SOLUTIONS · Submit enquiries via catalog
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
