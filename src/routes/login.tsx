import { createFileRoute, Link } from "@tanstack/react-router";

import { AuthShell, Field } from "@/components/AuthShell";
import { notConnected } from "@/lib/notices";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/login")({
  head: () => seo("Iniciar sesión — SELAH", "Ingresa a tu cuenta SELAH para ver tu perfil y tus pedidos."),
  component: Login,
});

function Login() {
  return (
    <AuthShell title="Bienvenida de vuelta" lead="Ingresa para ver tu perfil y el historial de tus pedidos.">
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          notConnected("El inicio de sesión");
        }}
      >
        <Field label="Correo electrónico" type="email" name="email" autoComplete="email" required maxLength={255} />
        <Field label="Contraseña" type="password" name="password" autoComplete="current-password" required maxLength={72} />
        <button type="submit" className="btn btn-solid w-full">
          Iniciar sesión
        </button>
      </form>
      <div className="mt-6 flex justify-between text-sm">
        <Link to="/forgot-password" className="link-line">
          ¿Olvidaste tu contraseña?
        </Link>
        <Link to="/register" className="link-line">
          Crear cuenta
        </Link>
      </div>
    </AuthShell>
  );
}
