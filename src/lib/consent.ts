// Client-side consent store for the Meta Pixel (advertising measurement).
// Records what the visitor chose, when, and the notice content that was shown,
// so later server-side or CRM reporting can re-check the recorded acceptance.

export const CONSENT_STORAGE_KEY = "infield-cookie-consent-v1";
export const CONSENT_EVENT = "infield:open-cookie-settings";
export const NOTICE_VERSION = "2026-10-13";

export const NOTICE_DATA = [
  "Pages visited",
  "Device and browser details",
  "Meta cookie ID (_fbp)",
];
export const NOTICE_PURPOSES = [
  "Measuring site visits",
  "Measuring ad performance",
  "Improving our ads (optimization)",
];
export const NOTICE_RECIPIENTS = [
  "Meta Platforms Ireland Ltd. (EU/EEA/UK) or Meta Platforms, Inc. (US)",
];

// Regions where cookies require consent before ad measurement may run.
const CONSENT_REQUIRED_REGIONS = new Set([
  // EEA
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT",
  "LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE",
  // EEA-adjacent
  "IS","LI","NO",
  // UK and Switzerland
  "GB","CH",
]);

export type ConsentDecision = "accepted" | "declined" | "not-required";

export interface ConsentRecord {
  decision: ConsentDecision;
  timestamp: string;
  region: string | null;
  noticeVersion: string;
  data: string[];
  purposes: string[];
  recipients: string[];
  /** Preserved evidence of the decision this record replaced. */
  previous?: ConsentRecord;
}

interface Fbq {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: (...args: unknown[]) => void;
  loaded: boolean;
  version: string;
}

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & Fbq;
    _fbq?: Window["fbq"];
  }
}

export function readConsentRecord(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (parsed && typeof parsed.decision === "string") return parsed;
    return null;
  } catch {
    return null;
  }
}

export function saveConsentDecision(
  decision: ConsentDecision,
  region: string | null,
): void {
  if (typeof window === "undefined") return;
  try {
    const stored = readConsentRecord();
    const record: ConsentRecord = {
      decision,
      timestamp: new Date().toISOString(),
      region,
      noticeVersion: NOTICE_VERSION,
      data: NOTICE_DATA,
      purposes: NOTICE_PURPOSES,
      recipients: NOTICE_RECIPIENTS,
      previous: stored ? { ...stored, previous: undefined } : undefined,
    };
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
    window.dispatchEvent(new Event("infield:consent-changed"));
  } catch {
    // Storage unavailable; the choice applies to this visit only.
  }
}

export function isConsentRequiredRegion(region: string): boolean {
  return CONSENT_REQUIRED_REGIONS.has(region.toUpperCase());
}

let cachedRegion: string | null | undefined;

/**
 * Reads the visitor country from the same-origin Cloudflare trace endpoint.
 * Unknown (XX), Tor (T1) and failed lookups resolve to null so the banner
 * shows and the default-deny consent state holds.
 */
export async function lookupRegion(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  if (cachedRegion !== undefined) return cachedRegion;
  try {
    const cached = window.sessionStorage.getItem("infield-visitor-region");
    if (cached) {
      cachedRegion = cached === "unknown" ? null : cached;
      return cachedRegion;
    }
  } catch {
    // Session storage unavailable; fall through to the network lookup.
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const response = await fetch("/cdn-cgi/trace", { signal: controller.signal });
    clearTimeout(timer);
    if (!response.ok) return null;
    const text = await response.text();
    const loc = /(?:^|\n)loc=([^\n]+)/.exec(text)?.[1]?.trim() ?? null;
    const region =
      !loc || loc.toUpperCase() === "XX" || loc.toUpperCase() === "T1"
        ? null
        : loc.toUpperCase();
    cachedRegion = region;
    if (region) {
      try {
        window.sessionStorage.setItem("infield-visitor-region", region);
      } catch {
        // Ignore; the in-memory cache covers this visit.
      }
    }
    return region;
  } catch {
    return null;
  }
}

/** Applies the decision to the Meta Pixel without reloading the page. */
export function applyPixelConsent(decision: ConsentDecision): void {
  if (typeof window === "undefined") return;
  const fbq = window.fbq;
  if (!fbq) return;
  const status = decision === "declined" ? "revoke" : "grant";
  if (typeof fbq.callMethod === "function") {
    fbq.callMethod.apply(fbq, ["consent", status]);
  } else {
    fbq.queue.push(["consent", status]);
  }
}
