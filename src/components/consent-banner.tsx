import { useEffect, useState } from "react";
import {
  CONSENT_EVENT,
  CONSENT_STORAGE_KEY,
  applyPixelConsent,
  isConsentRequiredRegion,
  lookupRegion,
  readConsentRecord,
  saveConsentDecision,
} from "@/lib/consent";

/**
 * Regional consent banner for the Meta Pixel.
 *
 * Shown only to visitors in regions that legally require cookie consent
 * (plus failed/unknown lookups, where the default-deny state holds).
 * Elsewhere the pixel runs without a banner. Rejection is as easy as
 * acceptance and the choice can be changed later via Cookie Settings.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [region, setRegion] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const stored = readConsentRecord();
    if (stored) {
      applyPixelConsent(stored.decision);
    } else {
      void lookupRegion().then((found) => {
        if (cancelled) return;
        setRegion(found);
        if (found && !isConsentRequiredRegion(found)) {
          saveConsentDecision("not-required", found);
          applyPixelConsent("not-required");
        } else {
          // Consent region, unknown region, or lookup failure: stay denied
          // until the visitor decides.
          setVisible(true);
        }
      });
    }

    const open = () => setVisible(true);
    const onStorage = (event: StorageEvent) => {
      if (event.key !== CONSENT_STORAGE_KEY) return;
      const record = readConsentRecord();
      if (!record) return;
      applyPixelConsent(record.decision);
      if (record.decision !== "declined") setVisible(false);
    };
    window.addEventListener(CONSENT_EVENT, open);
    window.addEventListener("storage", onStorage);
    return () => {
      cancelled = true;
      window.removeEventListener(CONSENT_EVENT, open);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const decide = (decision: "accepted" | "declined") => {
    void lookupRegion().then((found) => {
      saveConsentDecision(decision, found ?? region);
      applyPixelConsent(decision);
      setVisible(false);
    });
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie settings"
      className="fixed bottom-4 left-4 right-4 z-80 rounded-2xl border border-primary/30 bg-card p-5 text-foreground shadow-lg sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-md"
    >
      <h2 className="text-lg font-bold">Cookies & ads</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        We use the Meta (Facebook) Pixel to measure visits to this page and
        improve our ads. This shares pages visited, device and browser details
        and the Meta cookie ID (_fbp) with Meta Platforms. See our{" "}
        <a href="/privacy" className="font-medium text-primary underline underline-offset-2">
          Privacy Policy
        </a>
        .
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => decide("accepted")}
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => decide("declined")}
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-input bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
