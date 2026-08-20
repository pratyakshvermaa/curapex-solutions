"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export type MedicineOption = {
  slug: string;
  name: string;
};

type ReviewFormProps = {
  medicines: MedicineOption[];
  onSubmitted?: () => void;
};

export default function ReviewForm({
  medicines,
  onSubmitted,
}: ReviewFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [medicineQuery, setMedicineQuery] = useState("");
  const [medicineSlug, setMedicineSlug] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [pending, setPending] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedMedicine = medicines.find((m) => m.slug === medicineSlug);

  const suggestions = useMemo(() => {
    const q = medicineQuery.trim().toLowerCase();
    if (!q) return medicines.slice(0, 8);
    return medicines
      .filter((m) => m.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [medicineQuery, medicines]);

  const pickMedicine = (m: MedicineOption) => {
    setMedicineSlug(m.slug);
    setMedicineQuery(m.name);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setOk(false);

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!medicineSlug || !selectedMedicine) {
      setError("Please search and select a medicine from the list.");
      return;
    }
    if (!rating || rating < 1 || rating > 5) {
      setError("Please choose a rating from 1 to 5.");
      return;
    }
    if (!body.trim() || body.trim().length < 10) {
      setError("Please write a short review (at least 10 characters).");
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          location,
          rating,
          body,
          medicineName: selectedMedicine?.name || medicineQuery.trim() || null,
          medicineSlug: medicineSlug || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save your review.");
        return;
      }
      setOk(true);
      setName("");
      setLocation("");
      setBody("");
      setMedicineQuery("");
      setMedicineSlug("");
      setRating(5);
      router.refresh();
      window.dispatchEvent(new Event("curapex:reviews-updated"));
      onSubmitted?.();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <section
      id="write-review"
      className="overflow-hidden rounded-2xl border border-line bg-surface/80 shadow-[0_18px_40px_-32px_rgba(12,46,58,0.35)]"
    >
      <div className="flex items-start gap-3 border-b border-line/70 bg-gradient-to-r from-teal-mist/80 to-surface px-5 py-4 md:px-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal text-white">
          <PenIcon />
        </span>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-sage">
            Share feedback
          </p>
          <h2 className="mt-0.5 font-display text-2xl text-ink">
            Write a review
          </h2>
          <p className="mt-1 text-sm text-ink-soft/75">
            Your review is saved on this site and appears below right away.
          </p>
        </div>
      </div>

      <form className="space-y-4 px-5 py-5 md:px-6" onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 text-sm text-ink-soft">
              <UserIcon />
              Name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Required"
              required
              className="w-full rounded-xl border border-line bg-sand/40 px-3.5 py-2.5 text-sm outline-none ring-teal/25 focus:border-teal/40 focus:bg-surface focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 text-sm text-ink-soft">
              <PinIcon />
              Country / city
            </span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Optional"
              className="w-full rounded-xl border border-line bg-sand/40 px-3.5 py-2.5 text-sm outline-none ring-teal/25 focus:border-teal/40 focus:bg-surface focus:ring-2"
            />
          </label>
        </div>

        <div className="relative">
          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 text-sm text-ink-soft">
              <PillIcon />
              Medicine
            </span>
            <input
              value={medicineQuery}
              onChange={(e) => {
                setMedicineQuery(e.target.value);
                setMedicineSlug("");
                setDropdownOpen(true);
              }}
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => {
                // Delay so click on suggestion fires before dropdown hides
                window.setTimeout(() => setDropdownOpen(false), 150);
              }}
              placeholder="Required — search and select a medicine"
              required
              className="w-full rounded-xl border border-line bg-sand/40 px-3.5 py-2.5 text-sm outline-none ring-teal/25 focus:border-teal/40 focus:bg-surface focus:ring-2"
              autoComplete="off"
            />
          </label>
          {dropdownOpen && medicineQuery.trim() && !medicineSlug && suggestions.length > 0 && (
            <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-line bg-surface py-1 shadow-soft">
              {suggestions.map((m) => (
                <li key={m.slug}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pickMedicine(m)}
                    className="block w-full px-3.5 py-2 text-left text-sm text-ink hover:bg-teal-mist"
                  >
                    {m.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {selectedMedicine && (
            <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-teal-mist px-2.5 py-1 text-xs text-teal">
              <CheckIcon />
              {selectedMedicine.name}
            </p>
          )}
        </div>

        <fieldset>
          <legend className="mb-2 flex items-center gap-1.5 text-sm text-ink-soft">
            <StarIcon />
            Rating
          </legend>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((n) => {
              const active = rating === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`inline-flex min-w-[2.75rem] items-center justify-center gap-1 rounded-full border px-3 py-2 text-sm font-medium ${
                    active
                      ? "border-amber-400 bg-amber-50 text-ink"
                      : "border-line bg-surface text-ink-soft hover:border-amber-300"
                  }`}
                  aria-pressed={active}
                >
                  {n}
                  <span className="text-amber-500">★</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="block">
          <span className="mb-1 flex items-center gap-1.5 text-sm text-ink-soft">
            <ChatIcon />
            Your review
          </span>
          <textarea
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Required — share your experience…"
            className="w-full resize-none rounded-xl border border-line bg-sand/40 px-3.5 py-2.5 text-sm outline-none ring-teal/25 focus:border-teal/40 focus:bg-surface focus:ring-2"
            required
          />
        </label>

        {error && (
          <p
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}
        {ok && (
          <p
            className="rounded-xl border border-teal/30 bg-teal-mist px-3 py-2 text-sm text-teal-deep"
            role="status"
          >
            Thanks — your review is live below.
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal px-4 py-3 text-sm font-semibold text-white hover:bg-teal-deep disabled:opacity-60 sm:w-auto sm:min-w-[12rem]"
        >
          <SendIcon />
          {pending ? "Saving…" : "Submit review"}
        </button>
      </form>
    </section>
  );
}

function PenIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 20h4l10-10-4-4L4 16v4zM13 7l4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-sage" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5.5 18.5c1.4-2.5 3.6-3.8 6.5-3.8s5.1 1.3 6.5 3.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-sage" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s6.5-5.2 6.5-10.5a6.5 6.5 0 10-13 0C5.5 15.8 12 21 12 21z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="10.5" r="2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function PillIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-sage" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8.5 15.5l7-7a3.4 3.4 0 014.8 4.8l-7 7a3.4 3.4 0 01-4.8-4.8z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-sage" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3.5l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.8 7.2 18.4l.9-5.4L4.2 9.2l5.4-.8L12 3.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-sage" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.5 18.5L4 20.5V7.5A2.5 2.5 0 016.5 5h11A2.5 2.5 0 0120 7.5v8a2.5 2.5 0 01-2.5 2.5H6.5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12.5l4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12l16-8-6.5 16-3-6.5L4 12z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}
