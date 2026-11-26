import { createFileRoute } from "@tanstack/react-router";

import { Field } from "@/components/AuthShell";
import { PageHeading } from "@/components/PageHeading";
import { SOCIALS } from "@/components/SiteFooter";
import { notConnected } from "@/lib/notices";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => seo("Contacto — SELAH", "Escríbenos: dudas sobre tallas, envíos, cambios o pedidos SELAH."),
  component: Contact,
});

const SUPPORT = [
  { title: "Envíos", text: "Despachamos a todo Chile. El plazo y el costo se confirman antes de pagar." },
  { title: "Cambios", text: "Si la talla no fue la correcta, escríbenos y te ayudamos a cambiarla." },
  { title: "Horario", text: "Respondemos de lunes a viernes, de 9:00 a 18:00 h." },
];

function Contact() {
  return (
    <>
      <PageHeading eyebrow="Contacto" title="Conversemos" lead="Dudas sobre tallas, envíos o tu pedido. Te leemos con calma." />
      <div className="page grid gap-14 pb-24 lg:grid-cols-[1.2fr_1fr] lg:gap-24 lg:pb-32">
        <form
          className="space-y-7"
          onSubmit={(e) => {
            e.preventDefault();
            notConnected("El formulario de contacto");
          }}
        >
          <div className="grid gap-7 md:grid-cols-2">
            <Field label="Nombre" name="name" required maxLength={100} autoComplete="name" />
            <Field label="Correo electrónico" name="email" type="email" required maxLength={255} autoComplete="email" />
          </div>
          <Field label="Asunto" name="subject" maxLength={120} />
          <label className="block">
            <span className="eyebrow text-[0.625rem] text-muted-foreground">Mensaje</span>
            <textarea name="message" required maxLength={1000} rows={5} className="field resize-y" />
          </label>
          <button type="submit" className="btn btn-solid">
            Enviar mensaje
          </button>
        </form>

        <div className="space-y-10">
          <div className="bg-secondary p-8">
            <p className="eyebrow text-foreground/70">Atención</p>
            <ul className="mt-6 space-y-6">
              {SUPPORT.map((s) => (
                <li key={s.title}>
                  <h2 className="text-2xl">{s.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed">{s.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-muted-foreground">Redes</p>
            <ul className="mt-4 flex flex-wrap gap-6 font-serif text-2xl">
              {SOCIALS.map((s) => (
                <li key={s.name}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="link-line">
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
