import { toast } from "sonner";

/** Honest feedback for actions that need the backend, which is not connected yet. */
export function notConnected(what: string) {
  toast.info(`${what}: aún no está activo`, {
    description: "Esta es una vista previa del diseño. No se envió ni se guardó nada.",
  });
}
