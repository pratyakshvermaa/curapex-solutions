import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start px-5 py-24 md:px-8">
      <p className="text-xs uppercase tracking-[0.18em] text-sage">404</p>
      <h1 className="mt-2 font-display text-4xl text-ink">Page not found</h1>
      <p className="mt-3 text-ink-soft/80">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/catalog"
        className="mt-8 bg-teal px-5 py-3 text-sm font-medium text-white hover:bg-teal-deep"
      >
        Go to catalog
      </Link>
    </div>
  );
}
