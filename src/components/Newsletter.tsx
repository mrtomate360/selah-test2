import { useState, type FormEvent } from "react";

import { notConnected } from "@/lib/notices";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    notConnected("La suscripción");
  };
  return (
    <section className="bg-accent">
      <div className="page py-20 text-center md:py-28">
        <p className="eyebrow text-muted-foreground">Newsletter</p>
        <h2 className="mx-auto mt-4 max-w-2xl text-4xl md:text-6xl">Una pausa en tu correo</h2>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted-foreground">
          Nuevas colecciones, historias detrás de cada bordado y palabras para la semana. Sin ruido.
        </p>
        <form onSubmit={submit} className="mx-auto mt-10 flex max-w-md flex-col gap-4 sm:flex-row sm:items-end">
          <label className="flex-1 text-left">
            <span className="sr-only">Correo electrónico</span>
            <input
              type="email"
              required
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.cl"
              className="field"
            />
          </label>
          <button type="submit" className="btn btn-solid">
            Suscribirme
          </button>
        </form>
      </div>
    </section>
  );
}
