"use client";

import {
  FormEvent,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { formatUsd, inrToUsd, parseUnitPrice } from "@/lib/price";

type EnquiryModalProps = {
  open: boolean;
  onClose: () => void;
  medicineName: string;
  price?: string | null;
};

type FormState = {
  name: string;
  countryCode: string;
  phone: string;
  email: string;
  quantity: string;
  message: string;
};

type Channel = "whatsapp" | "telegram";

/** Dial codes for international wholesale enquiries */
const COUNTRY_CODES: { code: string; label: string; dial: string }[] = [
  { code: "IN", label: "India", dial: "+91" },
  { code: "US", label: "United States", dial: "+1" },
  { code: "CA", label: "Canada", dial: "+1" },
  { code: "GB", label: "United Kingdom", dial: "+44" },
  { code: "AE", label: "UAE", dial: "+971" },
  { code: "SA", label: "Saudi Arabia", dial: "+966" },
  { code: "QA", label: "Qatar", dial: "+974" },
  { code: "KW", label: "Kuwait", dial: "+965" },
  { code: "OM", label: "Oman", dial: "+968" },
  { code: "BH", label: "Bahrain", dial: "+973" },
  { code: "SG", label: "Singapore", dial: "+65" },
  { code: "MY", label: "Malaysia", dial: "+60" },
  { code: "ID", label: "Indonesia", dial: "+62" },
  { code: "PH", label: "Philippines", dial: "+63" },
  { code: "TH", label: "Thailand", dial: "+66" },
  { code: "VN", label: "Vietnam", dial: "+84" },
  { code: "BD", label: "Bangladesh", dial: "+880" },
  { code: "PK", label: "Pakistan", dial: "+92" },
  { code: "LK", label: "Sri Lanka", dial: "+94" },
  { code: "NP", label: "Nepal", dial: "+977" },
  { code: "NG", label: "Nigeria", dial: "+234" },
  { code: "KE", label: "Kenya", dial: "+254" },
  { code: "GH", label: "Ghana", dial: "+233" },
  { code: "ZA", label: "South Africa", dial: "+27" },
  { code: "EG", label: "Egypt", dial: "+20" },
  { code: "AU", label: "Australia", dial: "+61" },
  { code: "NZ", label: "New Zealand", dial: "+64" },
  { code: "DE", label: "Germany", dial: "+49" },
  { code: "FR", label: "France", dial: "+33" },
  { code: "NL", label: "Netherlands", dial: "+31" },
  { code: "BR", label: "Brazil", dial: "+55" },
  { code: "MX", label: "Mexico", dial: "+52" },
  { code: "RU", label: "Russia", dial: "+7" },
  { code: "CN", label: "China", dial: "+86" },
  { code: "JP", label: "Japan", dial: "+81" },
  { code: "KR", label: "South Korea", dial: "+82" },
];

const DEFAULT_COUNTRY = "IN";

function dialFor(code: string) {
  return COUNTRY_CODES.find((c) => c.code === code)?.dial || "+91";
}

function flagEmoji(code: string) {
  return code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function formatPhone(countryCode: string, phone: string) {
  const digits = digitsOnly(phone);
  if (!digits) return "";
  return `${dialFor(countryCode)} ${digits}`;
}

/** National number length / pattern by country (E.164-friendly). */
const PHONE_RULES: Record<
  string,
  { min: number; max: number; pattern?: RegExp; hint: string }
> = {
  IN: { min: 10, max: 10, pattern: /^[6-9]\d{9}$/, hint: "10 digits starting with 6–9" },
  US: { min: 10, max: 10, hint: "10-digit number" },
  CA: { min: 10, max: 10, hint: "10-digit number" },
  GB: { min: 10, max: 11, hint: "10–11 digits" },
  AE: { min: 9, max: 9, pattern: /^5\d{8}$/, hint: "9 digits starting with 5" },
  SA: { min: 9, max: 9, pattern: /^5\d{8}$/, hint: "9 digits starting with 5" },
  QA: { min: 8, max: 8, hint: "8-digit number" },
  KW: { min: 8, max: 8, hint: "8-digit number" },
  OM: { min: 8, max: 8, hint: "8-digit number" },
  BH: { min: 8, max: 8, hint: "8-digit number" },
  SG: { min: 8, max: 8, pattern: /^[89]\d{7}$/, hint: "8 digits starting with 8 or 9" },
  MY: { min: 9, max: 10, hint: "9–10 digits" },
  ID: { min: 9, max: 12, hint: "9–12 digits" },
  PH: { min: 10, max: 10, pattern: /^9\d{9}$/, hint: "10 digits starting with 9" },
  TH: { min: 9, max: 9, pattern: /^[689]\d{8}$/, hint: "9 digits" },
  VN: { min: 9, max: 10, hint: "9–10 digits" },
  BD: { min: 10, max: 10, pattern: /^1\d{9}$/, hint: "10 digits starting with 1" },
  PK: { min: 10, max: 10, pattern: /^3\d{9}$/, hint: "10 digits starting with 3" },
  LK: { min: 9, max: 9, hint: "9-digit number" },
  NP: { min: 10, max: 10, pattern: /^9\d{9}$/, hint: "10 digits starting with 9" },
  NG: { min: 10, max: 11, hint: "10–11 digits" },
  KE: { min: 9, max: 9, hint: "9-digit number" },
  GH: { min: 9, max: 9, hint: "9-digit number" },
  ZA: { min: 9, max: 9, hint: "9-digit number" },
  EG: { min: 10, max: 10, pattern: /^1\d{9}$/, hint: "10 digits starting with 1" },
  AU: { min: 9, max: 9, hint: "9-digit number" },
  NZ: { min: 8, max: 10, hint: "8–10 digits" },
  DE: { min: 10, max: 12, hint: "10–12 digits" },
  FR: { min: 9, max: 9, hint: "9-digit number" },
  NL: { min: 9, max: 9, hint: "9-digit number" },
  BR: { min: 10, max: 11, hint: "10–11 digits" },
  MX: { min: 10, max: 10, hint: "10-digit number" },
  RU: { min: 10, max: 10, hint: "10-digit number" },
  CN: { min: 11, max: 11, pattern: /^1\d{10}$/, hint: "11 digits starting with 1" },
  JP: { min: 10, max: 11, hint: "10–11 digits" },
  KR: { min: 9, max: 11, hint: "9–11 digits" },
};

function isScrapPhoneDigits(digits: string) {
  if (digits.length < 6) return false;
  if (/^(\d)\1+$/.test(digits)) return true;
  let ascending = true;
  let descending = true;
  for (let i = 1; i < digits.length; i++) {
    const prev = Number(digits[i - 1]);
    const curr = Number(digits[i]);
    if (curr !== (prev + 1) % 10) ascending = false;
    if (curr !== (prev + 9) % 10) descending = false;
  }
  if (ascending || descending) return true;
  if (new Set(digits).size < 3) return true;
  return false;
}

function phoneValidation(
  countryCode: string,
  phone: string,
  opts?: { force?: boolean }
): string | null {
  const digits = digitsOnly(phone);
  if (!digits) return null;
  if (isScrapPhoneDigits(digits)) {
    return "That looks like a filler number. Use a mobile where we can call or WhatsApp you.";
  }
  const country =
    COUNTRY_CODES.find((c) => c.code === countryCode)?.label || "this country";
  const rule = PHONE_RULES[countryCode] || {
    min: 7,
    max: 15,
    hint: "7–15 digits",
  };
  const force = Boolean(opts?.force);

  if (digits.length < rule.min) {
    // Show once they have typed enough, or after blur
    if (force || digits.length >= Math.min(6, rule.min)) {
      return countryCode === "IN"
        ? `Indian mobiles need 10 digits (starting 6–9). You’ve entered ${digits.length}.`
        : `${country} mobiles need ${
            rule.min === rule.max ? rule.min : `${rule.min}–${rule.max}`
          } digits. You’ve entered ${digits.length}.`;
    }
    return null;
  }
  if (digits.length > rule.max) {
    return `Too many digits for ${country}. ${
      rule.min === rule.max
        ? `Use ${rule.min} digits only.`
        : `Use ${rule.min}–${rule.max} digits.`
    }`;
  }
  if (rule.pattern && !rule.pattern.test(digits)) {
    if (countryCode === "IN") {
      return "Indian mobiles are 10 digits and start with 6, 7, 8, or 9.";
    }
    return `This doesn’t match a typical ${country} mobile (${rule.hint}).`;
  }
  return null;
}

function isValidPhone(countryCode: string, phone: string) {
  const digits = digitsOnly(phone);
  if (!digits) return false;
  if (isScrapPhoneDigits(digits)) return false;
  const rule = PHONE_RULES[countryCode] || {
    min: 7,
    max: 15,
    hint: "7–15 digits",
  };
  if (digits.length < rule.min || digits.length > rule.max) return false;
  if (rule.pattern && !rule.pattern.test(digits)) return false;
  return true;
}

const SCRAP_EMAIL_LOCALS = new Set([
  "test",
  "testing",
  "asdf",
  "qwerty",
  "abc",
  "xyz",
  "xxx",
  "none",
  "na",
  "n/a",
  "email",
  "mail",
  "user",
  "admin",
  "sample",
  "demo",
  "fake",
  "temp",
  "aaa",
  "abc123",
  "name",
  "fullname",
]);

const SCRAP_EMAIL_DOMAINS = new Set([
  "test.com",
  "testing.com",
  "asdf.com",
  "abc.com",
  "xyz.com",
  "email.com",
  "mail.com",
  "example.com",
  "example.org",
  "fake.com",
  "temp.com",
  "xxx.com",
  "mailinator.com",
  "yopmail.com",
  "guerrillamail.com",
  "10minutemail.com",
  "trashmail.com",
]);

function emailValidation(
  email: string,
  opts?: { force?: boolean }
): string | null {
  const value = email.trim().toLowerCase();
  if (!value) return null;
  const force = Boolean(opts?.force);

  if (/\s/.test(email)) {
    return "Remove the spaces — emails can’t have blank gaps.";
  }
  if (value.includes("..")) {
    return "There’s a double dot in the email. Fix that and try again.";
  }

  // Still typing local part
  if (!value.includes("@")) {
    if (force || value.length >= 5) {
      return "Include an @ and domain, e.g. name@company.com.";
    }
    return null;
  }

  const atParts = value.split("@");
  const local = atParts[0] || "";
  const domain = atParts[1] || "";

  if (SCRAP_EMAIL_LOCALS.has(local)) {
    return "Use an inbox you actually check — placeholder names won’t reach you.";
  }

  if (!domain) {
    if (force || local.length >= 2) {
      return "Add the part after @, e.g. gmail.com or your company domain.";
    }
    return null;
  }

  if (!domain.includes(".")) {
    if (force || domain.length >= 3) {
      return "Add a domain ending like .com or .in after the @.";
    }
    return null;
  }

  if (
    !/^[a-z0-9](?:[a-z0-9._%+-]{0,62}[a-z0-9])?@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z]{2,24})+$/i.test(
      value
    )
  ) {
    return "Finish the email like name@company.com so we can reply to you.";
  }

  if (SCRAP_EMAIL_DOMAINS.has(domain)) {
    return "Disposable or fake domains are blocked. Share a work or personal email instead.";
  }
  if (/^(\d+)\1*$/.test(local) || local.length < 2) {
    return "That email name looks incomplete. Add your usual address.";
  }
  const tld = domain.split(".").pop() || "";
  if (tld.length < 2 || /^\d+$/.test(tld)) {
    return "The ending looks off — use something like .com, .in, or .co.uk.";
  }
  return null;
}

function isValidEmail(email: string) {
  const value = email.trim().toLowerCase();
  if (!value) return false;
  if (
    !/^[a-z0-9](?:[a-z0-9._%+-]{0,62}[a-z0-9])?@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z]{2,24})+$/i.test(
      value
    )
  ) {
    return false;
  }
  return emailValidation(value) === null;
}

function interestMessage(medicineName: string, quantity: string) {
  const qty = Math.max(0, Number.parseInt(quantity, 10) || 0);
  const base = `I'm interested in ${medicineName}`;
  return qty > 0 ? `${base}. Quantity: ${qty}` : base;
}

/** Border color is applied separately so invalid/valid states are never overridden. */
const fieldClass =
  "w-full rounded-xl border bg-surface/80 px-3.5 py-2 text-sm outline-none transition placeholder:text-ink-soft/40 focus:ring-2 disabled:cursor-not-allowed disabled:bg-sand/60 disabled:text-ink-soft/45 disabled:opacity-70";

function fieldToneClass(tone: "default" | "invalid" | "valid") {
  if (tone === "invalid") {
    return "border-red-400 bg-red-50/70 focus:border-red-400 focus:ring-red-100";
  }
  if (tone === "valid") {
    return "border-emerald-400/80 bg-emerald-50/40 focus:border-emerald-400 focus:ring-emerald-100";
  }
  return "border-line focus:border-teal/40 focus:ring-teal/25";
}

function isMobileDevice() {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

/** Prefer native app deep link, then fall back to https. */
function openAppOrWeb(appUrl: string, webUrl: string) {
  if (!isMobileDevice()) {
    window.location.assign(webUrl);
    return;
  }

  const started = Date.now();
  let fellBack = false;

  const fallback = () => {
    if (fellBack) return;
    // If the page is still visible, the app likely did not open.
    if (document.hidden || Date.now() - started > 2000) return;
    fellBack = true;
    window.location.assign(webUrl);
  };

  const onVisibility = () => {
    if (document.hidden) {
      fellBack = true;
      document.removeEventListener("visibilitychange", onVisibility);
    }
  };

  document.addEventListener("visibilitychange", onVisibility);
  window.location.href = appUrl;
  window.setTimeout(fallback, 900);
  window.setTimeout(() => {
    document.removeEventListener("visibilitychange", onVisibility);
  }, 2500);
}

/** Works on http/LAN too (clipboard API often needs https). */
function copyText(text: string) {
  try {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      void navigator.clipboard.writeText(text).catch(() => {});
      return;
    }
  } catch {
    /* fall through */
  }
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  } catch {
    /* ignore */
  }
}

export default function EnquiryModal({
  open,
  onClose,
  medicineName,
  price,
}: EnquiryModalProps) {
  const titleId = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const quantityRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [chatUrl, setChatUrl] = useState("");
  const [enquiryText, setEnquiryText] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [phoneBlurred, setPhoneBlurred] = useState(false);
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "",
    countryCode: DEFAULT_COUNTRY,
    phone: "",
    email: "",
    quantity: "",
    message: interestMessage(medicineName, ""),
  });

  const unitPrice = useMemo(() => parseUnitPrice(price), [price]);
  const quantityNum = Math.max(0, Number.parseInt(form.quantity, 10) || 0);
  const unitUsd = unitPrice ? inrToUsd(unitPrice.amountInr) : null;
  const approxTotalUsd =
    unitUsd != null && quantityNum > 0 ? unitUsd * quantityNum : null;

  const nameReady = form.name.trim().length > 0;
  const phoneOk = isValidPhone(form.countryCode, form.phone);
  const emailOk = isValidEmail(form.email);
  const phoneError = phoneValidation(form.countryCode, form.phone, {
    force: phoneBlurred,
  });
  const emailError = emailValidation(form.email, { force: emailBlurred });
  const contactReady = phoneOk || emailOk;
  const quantityReady = quantityNum > 0;
  const canSend = nameReady && contactReady && quantityReady;
  const phoneTone: "default" | "invalid" | "valid" = phoneOk
    ? "valid"
    : phoneError
      ? "invalid"
      : "default";
  const emailTone: "default" | "invalid" | "valid" = emailOk
    ? "valid"
    : emailError
      ? "invalid"
      : "default";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setSubmitted(false);
    setChannel(null);
    setRedirectUrl("");
    setChatUrl("");
    setEnquiryText("");
    setCopied(false);
    setError("");
    setPhoneBlurred(false);
    setEmailBlurred(false);
    setForm({
      name: "",
      countryCode: DEFAULT_COUNTRY,
      phone: "",
      email: "",
      quantity: "",
      message: interestMessage(medicineName, ""),
    });
    const t = window.setTimeout(() => nameRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
    // medicineName changes should NOT reset form while modal is open
    // Only reset when modal opens (open transitions from false to true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      // Focus trap: cycle Tab within the dialog
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    // Do not lock body scroll — page stays scrollable behind the popup.
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const handleBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!open || !mounted) return null;

  const update = (key: keyof FormState, value: string) => {
    let nextValue = value;
    if (key === "phone") {
      // Digits only, cap to country max (fallback 15)
      const max =
        PHONE_RULES[form.countryCode]?.max ?? 15;
      nextValue = digitsOnly(value).slice(0, max);
    }
    if (key === "email") {
      nextValue = value.replace(/\s/g, "");
    }
    setForm((prev) => {
      const next = { ...prev, [key]: nextValue };
      if (key === "quantity") {
        next.message = interestMessage(medicineName, nextValue);
      }
      return next;
    });
    if (error) setError("");
  };

  const buildMessage = () => {
    const phone = formatPhone(form.countryCode, form.phone);
    const email = form.email.trim();
    const qty = quantityNum > 0 ? quantityNum : null;
    const country =
      COUNTRY_CODES.find((c) => c.code === form.countryCode)?.label || "";
    return [
      `Enquiry for: ${medicineName}`,
      form.name.trim() ? `Name: ${form.name.trim()}` : null,
      phone ? `Phone: ${phone}` : null,
      phone && country ? `Country: ${country}` : null,
      email ? `Email: ${email}` : null,
      qty ? `Quantity: ${qty}` : null,
      qty && unitUsd != null && unitPrice
        ? `Listed unit price: ~${formatUsd(unitUsd)} / ${unitPrice.unit}`
        : null,
      qty && approxTotalUsd != null
        ? `Approximate value: ~${formatUsd(approxTotalUsd)} (shipping extra)`
        : null,
      form.message.trim() ? `Message: ${form.message.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      setError("Please enter your name.");
      return false;
    }
    const phoneDigits = digitsOnly(form.phone);
    const emailTrim = form.email.trim();
    if (!phoneDigits && !emailTrim) {
      setError("Please add a phone number or email so we can reach you.");
      return false;
    }
    if (phoneDigits && phoneError) {
      setError(phoneError);
      return false;
    }
    if (emailTrim && emailError) {
      setError(emailError);
      return false;
    }
    if (!phoneOk && !emailOk) {
      setError("Please add a valid phone number or email so we can reach you.");
      return false;
    }
    if (quantityNum < 1) {
      setError("Please enter a quantity.");
      return false;
    }
    return true;
  };

  const handleWhatsApp = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    if (!number) {
      setError("WhatsApp number is not configured. Please try again later.");
      return;
    }

    const text = encodeURIComponent(buildMessage());
    const webUrl = `https://wa.me/${number}?text=${text}`;
    const appUrl = `whatsapp://send?phone=${number}&text=${text}`;

    setChannel("whatsapp");
    setRedirectUrl(webUrl);
    setSubmitted(true);
    window.setTimeout(() => openAppOrWeb(appUrl, webUrl), 120);
  };

  const handleTelegram = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const username = (
      process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || ""
    ).replace(/^@/, "");
    if (!username) {
      setError("Telegram username is not configured. Please try again later.");
      return;
    }

    // Official Telegram deep links with draft text for a specific user:
    //   https://t.me/<username>?text=<draft>
    //   tg://resolve?domain=<username>&text=<draft>
    let draft = buildMessage();
    if (draft.startsWith("@")) draft = ` ${draft}`;
    const encoded = encodeURIComponent(draft);

    // Prefer https://t.me/…?text= so Universal Links open the app WITH the draft.
    // Opening tg:// first often drops ?text= on some Telegram versions.
    const webUrl = `https://t.me/${username}?text=${encoded}`;
    const appUrl = `tg://resolve?domain=${encodeURIComponent(username)}&text=${encoded}`;

    setChannel("telegram");
    setRedirectUrl(webUrl);
    setChatUrl(webUrl);
    setEnquiryText(draft);
    setSubmitted(true);
    copyText(draft);

    window.setTimeout(() => {
      // Desktop / most mobiles: https link carries the draft into the chat.
      // If still on-page shortly after, retry native scheme with the same draft.
      window.location.assign(webUrl);
      if (isMobileDevice()) {
        window.setTimeout(() => {
          if (!document.hidden) window.location.href = appUrl;
        }, 1200);
      }
    }, 120);
  };

  const channelLabel = channel === "telegram" ? "Telegram" : "WhatsApp";

  // Portal to body so parent card transforms don't trap position:fixed
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop — click to close */}
      <div className="absolute inset-0 enquiry-modal-backdrop" aria-hidden onClick={handleBackdropClick} />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 flex w-full max-h-[min(88dvh,640px)] max-w-lg flex-col overflow-hidden rounded-3xl border border-line/80 bg-gradient-to-b from-teal-mist to-sand shadow-[0_24px_80px_-24px_rgb(var(--color-shadow)/0.5)] animate-fade-up"
      >
        <div className="h-1.5 w-full shrink-0 bg-gradient-to-r from-teal via-sage to-[#2AABEE]" />

        {/* Header — always visible */}
        <div className="flex shrink-0 items-start justify-between gap-3 px-5 pb-3 pt-4 sm:px-6 sm:pt-5">
          <div className="flex min-w-0 items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-mist text-teal ring-1 ring-teal/10">
              <ChatBubbleIcon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-sage">
                Enquiry
              </p>
              <h2
                id={titleId}
                className="mt-0.5 font-display text-lg leading-snug text-ink sm:text-xl line-clamp-2"
              >
                Enquire about {medicineName}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink-soft/70 hover:border-ink/20 hover:bg-sand hover:text-ink"
            aria-label="Close"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5 sm:px-6">
            <div className="rounded-2xl border border-line/80 bg-surface px-4 py-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${
                    channel === "telegram" ? "bg-[#2AABEE]" : "bg-[#25D366]"
                  }`}
                >
                  {channel === "telegram" ? (
                    <TelegramIcon className="h-5 w-5" />
                  ) : (
                    <WhatsAppIcon className="h-5 w-5" />
                  )}
                </span>
                <p className="font-medium text-ink">
                  Opening {channelLabel} — just hit Send!
                </p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft/80">
                {channel === "telegram" ? (
                  <>
                    Your enquiry opens as a draft in Telegram. Tap{" "}
                    <strong>Send</strong> to deliver it. If the draft is empty,
                    use <strong>Copy message</strong> and paste.
                  </>
                ) : (
                  <>
                    WhatsApp opens with the enquiry ready. Tap{" "}
                    <strong>Send</strong> in the app to deliver it.
                  </>
                )}
              </p>

              {channel === "telegram" && enquiryText && (
                <pre className="mt-3 max-h-28 overflow-auto whitespace-pre-wrap rounded-xl bg-sand/80 px-3 py-2.5 text-xs leading-relaxed text-ink-soft">
                  {enquiryText}
                </pre>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {redirectUrl && (
                  <a
                    href={redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white ${
                      channel === "telegram"
                        ? "bg-[#2AABEE] hover:bg-[#1f96d4]"
                        : "bg-[#25D366] hover:bg-[#1ebe57]"
                    }`}
                  >
                    {channel === "telegram" ? (
                      <TelegramIcon className="h-4 w-4" />
                    ) : (
                      <WhatsAppIcon className="h-4 w-4" />
                    )}
                    Open {channelLabel} again
                  </a>
                )}
                {channel === "telegram" && enquiryText && (
                  <button
                    type="button"
                    onClick={() => {
                      copyText(enquiryText);
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 2000);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink hover:bg-sand"
                  >
                    {copied ? "Copied" : "Copy message"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="text-sm text-ink-soft hover:text-ink"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Scrollable fields */}
            <form
              id="enquiry-form"
              className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-5 pb-3 sm:space-y-3.5 sm:px-6"
              onSubmit={handleWhatsApp}
            >
              <Field
                label="Name"
                placeholder="Your name"
                value={form.name}
                onChange={(v) => update("name", v)}
                autoComplete="name"
                required
                inputRef={nameRef}
                icon={<UserIcon className="h-4 w-4" />}
              />
              <div className="block">
                <span
                  className={`mb-1 flex items-center gap-1.5 text-sm ${
                    nameReady ? "text-ink-soft" : "text-ink-soft/40"
                  }`}
                >
                  <span className={nameReady ? "text-sage" : "text-ink-soft/35"}>
                    <PhoneIcon className="h-4 w-4" />
                  </span>
                  Phone number
                  <span className="text-[0.65rem] text-ink-soft/45">
                    (or email)
                  </span>
                </span>
                <div className="flex gap-2">
                  <CountryCodePicker
                    value={form.countryCode}
                    onChange={(code) => update("countryCode", code)}
                    disabled={!nameReady}
                  />
                  <div className="relative min-w-0 flex-1">
                    <input
                      ref={phoneRef}
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      value={form.phone}
                      placeholder="Mobile number"
                      disabled={!nameReady}
                      aria-invalid={Boolean(phoneError)}
                      aria-describedby={phoneError ? "phone-error" : "phone-hint"}
                      onChange={(e) => update("phone", e.target.value)}
                      onBlur={() => setPhoneBlurred(true)}
                      className={`${fieldClass} bg-surface py-2.5 pr-10 ${fieldToneClass(phoneTone)}`}
                    />
                    {phoneOk && (
                      <span
                        className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-emerald-500"
                        aria-label="Mobile number looks good"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                </div>
                {phoneError ? (
                  <p id="phone-error" className="mt-1 text-[0.7rem] leading-snug text-red-600" role="alert">
                    {phoneError}
                  </p>
                ) : (
                  <p id="phone-hint" className="mt-1 text-[0.68rem] text-ink-soft/55">
                    Digits only · includes country code for international orders
                  </p>
                )}
              </div>
              <div>
                <Field
                  label="Email"
                  value={form.email}
                  onChange={(v) => update("email", v)}
                  type="email"
                  autoComplete="email"
                  disabled={!nameReady}
                  tone={emailTone}
                  showCheck={emailOk}
                  onBlur={() => setEmailBlurred(true)}
                  icon={<MailIcon className="h-4 w-4" />}
                />
                {emailError && (
                  <p className="mt-1 text-[0.7rem] leading-snug text-red-600" role="alert">
                    {emailError}
                  </p>
                )}
              </div>
              <label className="block">
                <span
                  className={`mb-1 flex items-center gap-1.5 text-sm ${
                    contactReady ? "text-ink-soft" : "text-ink-soft/40"
                  }`}
                >
                  <BoxIcon
                    className={`h-4 w-4 ${
                      contactReady ? "text-sage" : "text-ink-soft/35"
                    }`}
                  />
                  Quantity
                </span>
                <input
                  ref={quantityRef}
                  type="number"
                  min={1}
                  step={1}
                  inputMode="numeric"
                  value={form.quantity}
                  placeholder="e.g. 10"
                  disabled={!contactReady}
                  onChange={(e) => update("quantity", e.target.value)}
                  className={fieldClass}
                />
                <p className="mt-1.5 text-xs leading-relaxed text-ink-soft/70">
                  {approxTotalUsd != null && unitUsd != null && unitPrice ? (
                    <>
                      Approx. value:{" "}
                      <span className="font-semibold text-teal">
                        {formatUsd(approxTotalUsd)}
                      </span>
                      <span className="text-ink-soft/55">
                        {" "}
                        ({quantityNum} × {formatUsd(unitUsd)} /{" "}
                        {unitPrice.unit})
                      </span>
                    </>
                  ) : unitPrice ? (
                    <>Enter quantity to see approximate value.</>
                  ) : (
                    <>Listed price unavailable — value shown after you enquire.</>
                  )}
                </p>
                <p className="mt-1 text-[0.7rem] leading-relaxed text-red-600">
                  Shipping charges are extra.
                </p>
              </label>
              <label className="block">
                <span
                  className={`mb-1 flex items-center gap-1.5 text-sm ${
                    quantityReady ? "text-ink-soft" : "text-ink-soft/40"
                  }`}
                >
                  <MessageIcon
                    className={`h-4 w-4 ${
                      quantityReady ? "text-sage" : "text-ink-soft/35"
                    }`}
                  />
                  Message
                </span>
                <textarea
                  rows={2}
                  value={form.message}
                  disabled={!quantityReady}
                  onChange={(e) => update("message", e.target.value)}
                  className={`${fieldClass} resize-none py-2.5`}
                />
              </label>
            </form>

            {/* Actions pinned — always visible */}
            <div className="shrink-0 border-t border-line/80 bg-[#e4ece9]/95 px-5 py-3 backdrop-blur-sm sm:px-6 sm:py-4">
              {error && (
                <p
                  className="mb-2.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  role="alert"
                >
                  {error}
                </p>
              )}
              {!canSend && (
                <p className="mb-2.5 text-center text-[0.7rem] text-ink-soft/55">
                  {!nameReady
                    ? "Enter your name to continue"
                    : !contactReady
                      ? "Add a phone number or email"
                      : "Enter quantity to enable WhatsApp / Telegram"}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="submit"
                  form="enquiry-form"
                  disabled={!canSend}
                  className="enquiry-channel-btn inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(37,211,102,0.8)] hover:bg-[#1ebe57] disabled:cursor-not-allowed disabled:bg-[#25D366]/35 disabled:shadow-none disabled:hover:bg-[#25D366]/35"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={handleTelegram}
                  disabled={!canSend}
                  className="enquiry-channel-btn inline-flex items-center justify-center gap-2 rounded-xl bg-[#2AABEE] px-3 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(42,171,238,0.8)] hover:bg-[#1f96d4] disabled:cursor-not-allowed disabled:bg-[#2AABEE]/35 disabled:shadow-none disabled:hover:bg-[#2AABEE]/35"
                >
                  <TelegramIcon className="h-5 w-5" />
                  Telegram
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

function CountryCodePicker({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const selected =
    COUNTRY_CODES.find((c) => c.code === value) || COUNTRY_CODES[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRY_CODES;
    return COUNTRY_CODES.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.dial.replace("+", "").includes(q)
    );
  }, [query]);

  useEffect(() => {
    if (disabled) {
      setOpen(false);
      setQuery("");
    }
  }, [disabled]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    window.setTimeout(() => searchRef.current?.focus(), 40);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`Country code ${selected.dial}`}
        className={`inline-flex h-[2.625rem] items-center gap-1.5 rounded-xl border px-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-45 ${
          open
            ? "border-teal bg-teal text-white shadow-[0_8px_20px_-10px_rgba(31,168,160,0.75)]"
            : "border-teal/25 bg-teal-mist text-teal hover:border-teal/45 hover:bg-teal hover:text-white"
        }`}
      >
        <span className="text-base leading-none" aria-hidden>
          {flagEmoji(selected.code)}
        </span>
        <span className="tabular-nums">{selected.dial}</span>
        <svg
          className={`h-3.5 w-3.5 opacity-80 transition ${open ? "rotate-180" : ""}`}
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          id={listId}
          role="listbox"
          aria-label="Select country code"
          className="absolute left-0 top-[calc(100%+0.4rem)] z-30 w-[min(18.5rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-teal/20 bg-surface shadow-[0_18px_40px_-16px_rgba(11,31,58,0.45)] animate-fade-up"
        >
          <div className="border-b border-line/80 bg-gradient-to-b from-teal-mist/80 to-surface p-2">
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or code"
              className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none ring-teal/25 placeholder:text-ink-soft/45 focus:border-teal/45 focus:ring-2"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto overscroll-contain p-1.5">
            {filtered.length === 0 ? (
              <li className="px-3 py-4 text-center text-sm text-ink-soft/60">
                No match
              </li>
            ) : (
              filtered.map((c) => {
                const active = c.code === value;
                return (
                  <li key={c.code}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        onChange(c.code);
                        setOpen(false);
                        setQuery("");
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition ${
                        active
                          ? "bg-teal text-white"
                          : "text-ink hover:bg-teal-mist"
                      }`}
                    >
                      <span className="text-lg leading-none" aria-hidden>
                        {flagEmoji(c.code)}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">
                        {c.label}
                      </span>
                      <span
                        className={`shrink-0 text-sm font-semibold tabular-nums ${
                          active ? "text-white/90" : "text-teal"
                        }`}
                      >
                        {c.dial}
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  required,
  disabled,
  tone = "default",
  showCheck,
  onBlur,
  inputRef,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  tone?: "default" | "invalid" | "valid";
  showCheck?: boolean;
  onBlur?: () => void;
  inputRef?: RefObject<HTMLInputElement>;
  icon?: ReactNode;
}) {
  return (
    <label className="block">
      <span
        className={`mb-1 flex items-center gap-1.5 text-sm ${
          disabled ? "text-ink-soft/40" : "text-ink-soft"
        }`}
      >
        {icon && (
          <span className={disabled ? "text-ink-soft/35" : "text-sage"}>
            {icon}
          </span>
        )}
        {label}
        {required && (
          <span className="text-[0.65rem] text-ink-soft/50">(required)</span>
        )}
      </span>
      <div className="relative">
        <input
          ref={inputRef}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={tone === "invalid" || undefined}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`${fieldClass} ${showCheck ? "pr-10" : ""} ${fieldToneClass(tone)}`}
        />
        {showCheck && (
          <span
            className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-emerald-500"
            aria-label={`${label} looks good`}
          >
            <CheckIcon className="h-4 w-4" />
          </span>
        )}
      </div>
    </label>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15" />
      <path
        d="M6.2 10.2l2.4 2.4 5.2-5.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChatBubbleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 18.5L4 21V7a3 3 0 013-3h10a3 3 0 013 3v8.5a3 3 0 01-3 3H7z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 10h7M8.5 13.5h4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BoxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 8.5l8-3.5 8 3.5v8.2l-8 3.8-8-3.8V8.5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M12 5v15.5M4 8.5l8 4 8-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5.5 18.5c1.4-2.6 3.6-3.9 6.5-3.9s5.1 1.3 6.5 3.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8.5 4.5h2.2l1.1 3.2-1.4 1.4a12.5 12.5 0 005.5 5.5l1.4-1.4 3.2 1.1v2.2a2 2 0 01-2.1 2A14.5 14.5 0 016.5 6.6a2 2 0 012-2.1z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="5.5"
        width="17"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4.5 7.5L12 13l7.5-5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MessageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 7.5A2.5 2.5 0 017.5 5h9A2.5 2.5 0 0119 7.5v6A2.5 2.5 0 0116.5 16H10l-3.5 3v-3H7.5A2.5 2.5 0 015 13.5v-6z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.05 4.91A9.82 9.82 0 0012.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 004.78 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.02zm-7.01 15.24h-.01a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 01-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 012.42 5.83c0 4.54-3.7 8.23-8.25 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.22-.08-.39-.12-.55.13-.16.25-.63.8-.77.97-.14.16-.28.18-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.28.37-.42.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.02s.87 2.34 1 2.5c.12.16 1.71 2.61 4.14 3.66 1.44.62 2.01.67 2.73.56.42-.06 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9.78 14.86l-.37 5.22c.53 0 .76-.23 1.04-.5l2.49-2.39 5.16 3.8c.95.52 1.62.25 1.88-.88l3.41-16.02h.01c.3-1.41-.51-1.96-1.44-1.62L1.74 9.35C.37 9.88.39 10.66 1.5 11l4.96 1.55 11.52-7.26c.54-.33 1.04-.15.63.21L9.78 14.86z" />
    </svg>
  );
}
