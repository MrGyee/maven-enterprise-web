"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "maven_cookie_consent";
type Consent = "accepted" | "declined";

// Renders both the consent banner and the (gated) analytics scripts, since
// they share one piece of state: nothing tracks until the visitor accepts.
export function CookieConsent() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Reading localStorage can only happen post-mount (unavailable during
    // SSR), so this genuinely needs an effect — the server always renders
    // "no decision yet" to avoid a hydration mismatch, and this is what
    // reconciles the real, possibly-different client-side value right after.
    const stored = window.localStorage.getItem(CONSENT_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored === "accepted" || stored === "declined") setConsent(stored);
    setHydrated(true);
  }, []);

  function choose(value: Consent) {
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  }

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <>
      {consent === "accepted" && gaId && <GoogleAnalytics gaId={gaId} />}
      {consent === "accepted" && metaPixelId && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              alt=""
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}

      {hydrated && consent === null && (
        <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-sm rounded-2xl border border-border bg-card p-4 shadow-lg sm:left-4 sm:right-auto">
          <p className="text-sm text-muted-foreground">
            We use cookies for analytics to understand how visitors use our
            site.{" "}
            <Link href="/privacy-policy" className="text-primary underline underline-offset-2">
              Learn more
            </Link>
            .
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={() => choose("accepted")}>
              Accept
            </Button>
            <Button size="sm" variant="outline" onClick={() => choose("declined")}>
              Decline
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
