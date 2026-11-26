import { createFileRoute, Link } from "@tanstack/react-router";

import { AuthShell, Field } from "@/components/AuthShell";
import { notConnected } from "@/lib/notices";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/register")({
  head: () => seo("Crear cuenta — SELAH", "Crea tu cuenta SELAH para comprar más rápido y seguir tus pedidos."),
  component: Register,
});

function Register() {
  return (
    <AuthShell title="Crea tu cuenta" lead="Guarda tus datos, sigue tus pedidos y recibe las novedades primero.">
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          notConnected("El registro");
        }}
      >
        <Field label="Nombre completo" name="name" autoComplete="name" required maxLength={100} />
        <Field label="Correo electrónico" type="email" name="email" autoComplete="email" required maxLength={255} />
        <Field label="Contraseña" type="password" name="password" autoComplete="new-password" required minLength={8} maxLength={72} />
        <button type="submit" className="btn btn-solid w-full">
          Crear cuenta
        </button>
      </form>
      <p className="mt-6 text-sm">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="link-line">
          Inicia sesión
        </Link>
      </p>
    </AuthShell>
  );
}
