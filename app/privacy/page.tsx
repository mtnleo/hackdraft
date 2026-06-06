import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";
import { H1, H2, P, LangTag } from "@/components/legalUI";

export const metadata: Metadata = {
  title: "Privacy Policy — HackDraft",
  description: "How HackDraft handles data and analytics.",
};

const UPDATED = "June 5, 2026";
const EMAIL = "hello@hackdraft.dev";

export default function PrivacyPage() {
  return (
    <LegalShell>
      <div className="flex flex-col gap-12">
        {/* English */}
        <section className="flex flex-col gap-1">
          <LangTag>EN</LangTag>
          <H1>Privacy Policy</H1>
          <P>Last updated: {UPDATED}</P>

          <H2>No accounts, no personal data</H2>
          <P>
            HackDraft has no sign-up and no login. We do not ask for or store
            your name, email, or any personal information — the app simply shows
            curated hackathon ideas.
          </P>

          <H2>Analytics & cookies</H2>
          <P>
            With your consent, we use Google Analytics to understand how the site
            is used. Google Analytics sets cookies and collects pseudonymous
            data such as your device and browser, approximate location derived
            from your IP address, and the pages you view. This data is processed
            by Google; see Google&apos;s Privacy Policy at
            policies.google.com/privacy. We enable IP anonymization. If you
            decline in the cookie banner, Google Analytics is not loaded and no
            analytics cookies are set.
          </P>

          <H2>Your choices</H2>
          <P>
            You choose whether to allow analytics via the cookie banner. To
            change your choice, clear this site&apos;s data in your browser and
            the banner will appear again. You can also use browser controls or
            Google&apos;s opt-out tools.
          </P>

          <H2>Hosting</H2>
          <P>
            The site is hosted on Cloudflare. Standard server logs may be
            processed by Cloudflare to deliver and protect the site, per their
            policies.
          </P>

          <H2>Contact</H2>
          <P>Questions? Email {EMAIL}.</P>
        </section>

        <hr className="border-t-2 border-ink/15" />

        {/* Español */}
        <section className="flex flex-col gap-1">
          <LangTag>ES</LangTag>
          <H1>Política de privacidad</H1>
          <P>Última actualización: {UPDATED}</P>

          <H2>Sin cuentas, sin datos personales</H2>
          <P>
            HackDraft no tiene registro ni inicio de sesión. No pedimos ni
            guardamos tu nombre, correo ni ninguna información personal — la app
            solo muestra ideas de hackathon seleccionadas.
          </P>

          <H2>Analítica y cookies</H2>
          <P>
            Con tu consentimiento, usamos Google Analytics para entender cómo se
            usa el sitio. Google Analytics instala cookies y recopila datos
            seudónimos como tu dispositivo y navegador, ubicación aproximada
            derivada de tu dirección IP y las páginas que ves. Estos datos son
            procesados por Google; consultá la Política de privacidad de Google
            en policies.google.com/privacy. Activamos la anonimización de IP. Si
            rechazás en el aviso de cookies, Google Analytics no se carga y no se
            instalan cookies de analítica.
          </P>

          <H2>Tus opciones</H2>
          <P>
            Vos elegís si permitir la analítica mediante el aviso de cookies.
            Para cambiar tu elección, borrá los datos de este sitio en tu
            navegador y el aviso volverá a aparecer. También podés usar los
            controles del navegador o las herramientas de exclusión de Google.
          </P>

          <H2>Hosting</H2>
          <P>
            El sitio está alojado en Cloudflare. Cloudflare puede procesar
            registros de servidor estándar para entregar y proteger el sitio,
            según sus políticas.
          </P>

          <H2>Contacto</H2>
          <P>¿Preguntas? Escribí a {EMAIL}.</P>
        </section>
      </div>
    </LegalShell>
  );
}
