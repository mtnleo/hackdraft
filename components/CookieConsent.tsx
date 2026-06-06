"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

type Consent = "granted" | "denied";

const TEXT = {
  en: {
    msg: "We use Google Analytics (cookies) to understand how the site is used. You can accept or decline — declining sets no analytics cookies.",
    accept: "Accept",
    decline: "Decline",
    more: "Privacy Policy",
  },
  es: {
    msg: "Usamos Google Analytics (cookies) para entender cómo se usa el sitio. Podés aceptar o rechazar — si rechazás no se guardan cookies de analítica.",
    accept: "Aceptar",
    decline: "Rechazar",
    more: "Política de privacidad",
  },
};

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent | null>(null);
  // Start "decided" so nothing flashes during SSR/first paint; resolve on mount.
  const [decided, setDecided] = useState(true);
  const [lang, setLang] = useState<"en" | "es">("en");
  // Sit the toast above the footer (whose height varies by viewport).
  const [bottomOffset, setBottomOffset] = useState(16);

  useEffect(() => {
    setLang(navigator.language?.toLowerCase().startsWith("es") ? "es" : "en");
    const stored = localStorage.getItem("cookie-consent") as Consent | null;
    setConsent(stored);
    setDecided(stored !== null);
  }, []);

  useEffect(() => {
    const measure = () => {
      const footer = document.querySelector("footer");
      setBottomOffset((footer?.offsetHeight ?? 0) + 16);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const choose = (c: Consent) => {
    localStorage.setItem("cookie-consent", c);
    setConsent(c);
    setDecided(true);
  };

  const t = TEXT[lang];

  return (
    <>
      {/* Google Analytics — only loaded after explicit consent. */}
      {consent === "granted" && GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {!decided && (
        <div
          style={{ bottom: bottomOffset }}
          className="fixed inset-x-3 z-50 mx-auto flex max-w-2xl flex-col gap-3 rounded-xl border-2 border-ink bg-card-white p-4 shadow-hard-md md:flex-row md:items-center md:justify-between"
        >
          <p className="font-body text-sm text-ink">
            {t.msg}{" "}
            <a
              href="/privacy"
              className="font-medium underline underline-offset-2 hover:text-cobalt"
            >
              {t.more}
            </a>
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => choose("denied")}
              className="active-press rounded-lg border-2 border-ink bg-card-white px-4 py-2 font-body text-sm font-semibold text-ink shadow-hard-sm"
            >
              {t.decline}
            </button>
            <button
              type="button"
              onClick={() => choose("granted")}
              className="active-press rounded-lg border-2 border-ink bg-cobalt px-4 py-2 font-body text-sm font-semibold text-card-white shadow-hard-sm"
            >
              {t.accept}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
