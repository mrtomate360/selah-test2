import { createFileRoute, Link } from "@tanstack/react-router";

import { AuthShell, Field } from "@/components/AuthShell";
import { notConnected } from "@/lib/notices";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/forgot-password")({
  head: () => seo("Recuperar contraseña — SELAH", "Recupera el acceso a tu cuenta SELAH."),
  component: Forgot,
});

function Forgot() {
  return (
    <AuthShell title="Recupera tu acceso" lead="Escribe tu correo y te enviaremos un enlace para crear una nueva contraseña.">
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          notConnected("La recuperación de contraseña");
        }}
      >
        <Field label="Correo electrónico" type="email" name="email" autoComplete="email" required maxLength={255} />
        <button type="submit" className="btn btn-solid w-full">
          Enviar enlace
        </button>
      </form>
      <p className="mt-6 text-sm">
        <Link to="/login" className="link-line">
          Volver a iniciar sesión
        </Link>
      </p>
    </AuthShell>
  );
}
