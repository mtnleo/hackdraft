import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";
import { H1, H2, P, LangTag } from "@/components/legalUI";

export const metadata: Metadata = {
  title: "Terms & Disclaimer — HackDraft",
  description: "Terms of use and disclaimer for HackDraft.",
};

const UPDATED = "June 5, 2026";
const EMAIL = "mtnleonardi@gmail.com";

export default function TermsPage() {
  return (
    <LegalShell>
      <div className="flex flex-col gap-12">
        {/* English */}
        <section className="flex flex-col gap-1">
          <LangTag>EN</LangTag>
          <H1>Terms &amp; Disclaimer</H1>
          <P>Last updated: {UPDATED}</P>

          <H2>What HackDraft is</H2>
          <P>
            HackDraft shows curated hackathon project ideas for inspiration.
            By using the site you agree to these terms.
          </P>

          <H2>Provided “as is”</H2>
          <P>
            The ideas are provided “as is,” without warranties of any kind. We
            do not guarantee that any idea is accurate, complete, feasible,
            original, novel, or unclaimed. Verify anything independently before
            relying on it or building it.
          </P>

          <H2>Originality & intellectual property</H2>
          <P>
            Ideas are compiled from publicly available sources and offered only
            as inspiration. We claim no ownership over them and make no
            guarantee that any idea is free of third-party rights. You are
            responsible for ensuring your use does not infringe anyone
            else&apos;s rights.
          </P>

          <H2>Limitation of liability</H2>
          <P>
            To the maximum extent permitted by law, HackDraft and its author
            are not liable for any damages or losses arising from use of the
            site or the ideas it presents.
          </P>

          <H2>Takedowns</H2>
          <P>
            If you believe something should be removed, email {EMAIL} and we
            will review it.
          </P>

          <H2>No affiliation</H2>
          <P>
            HackDraft is not affiliated with any company, startup, or
            hackathon organizer that may be referenced.
          </P>
        </section>

        <hr className="border-t-2 border-ink/15" />

        {/* Español */}
        <section className="flex flex-col gap-1">
          <LangTag>ES</LangTag>
          <H1>Términos y aviso legal</H1>
          <P>Última actualización: {UPDATED}</P>

          <H2>Qué es HackDraft</H2>
          <P>
            HackDraft muestra ideas de proyectos de hackathon seleccionadas
            como inspiración. Al usar el sitio aceptás estos términos.
          </P>

          <H2>Se ofrece “tal cual”</H2>
          <P>
            Las ideas se ofrecen “tal cual”, sin garantías de ningún tipo. No
            garantizamos que una idea sea precisa, completa, viable, original,
            novedosa ni libre de reclamos. Verificá todo de forma independiente
            antes de usarlo o construirlo.
          </P>

          <H2>Originalidad y propiedad intelectual</H2>
          <P>
            Las ideas se recopilan de fuentes públicas y se ofrecen solo como
            inspiración. No reclamamos su propiedad ni garantizamos que estén
            libres de derechos de terceros. Sos responsable de asegurarte de que
            tu uso no infrinja los derechos de otros.
          </P>

          <H2>Limitación de responsabilidad</H2>
          <P>
            En la máxima medida permitida por la ley, HackDraft y su autor no
            son responsables por daños o pérdidas derivados del uso del sitio o
            de las ideas que presenta.
          </P>

          <H2>Retiros de contenido</H2>
          <P>
            Si creés que algo debería eliminarse, escribí a {EMAIL} y lo
            revisaremos.
          </P>

          <H2>Sin afiliación</H2>
          <P>
            HackDraft no está afiliado a ninguna empresa, startup ni
            organizador de hackathons que pudiera mencionarse.
          </P>
        </section>
      </div>
    </LegalShell>
  );
}
