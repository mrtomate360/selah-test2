import { type DemoOrder, formatDate, type JourneyState, orderJourney } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const DOT: Record<JourneyState, string> = {
  done: "border-primary bg-primary",
  current: "border-primary bg-primary outline outline-4 outline-secondary",
  upcoming: "border-input bg-card",
  cancelled: "border-destructive bg-destructive outline outline-4 outline-accent",
};

export function OrderJourney({ order }: { order: Pick<DemoOrder, "status" | "history"> }) {
  const steps = orderJourney(order);

  return (
    <section className="mt-6" aria-label="Recorrido del pedido">
      <h3 className="eyebrow text-[0.5625rem] text-muted-foreground">Recorrido del pedido</h3>
      <ol className="mt-5 grid md:grid-cols-4">
        {steps.map((step, i) => {
          const next = steps[i + 1];
          const reached = step.state !== "upcoming";
          return (
            <li
              key={step.status}
              aria-current={step.state === "current" || step.state === "cancelled" ? "step" : undefined}
              className="relative flex gap-4 pb-6 last:pb-0 md:block md:pb-0 md:pr-6"
            >
              {next ? (
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-3 bottom-0 left-[5px] w-px md:top-[5px] md:right-0 md:bottom-auto md:left-3 md:h-px md:w-auto",
                    next.state === "upcoming" ? "bg-border" : "bg-primary",
                  )}
                />
              ) : null}
              <span aria-hidden className={cn("relative mt-0.5 block size-[11px] shrink-0 rounded-full border md:mt-0", DOT[step.state])} />
              <div className="md:mt-4">
                <p className={cn("text-sm", step.state === "cancelled" && "text-destructive", !reached && "text-muted-foreground")}>
                  {step.label}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{step.date ? formatDate(step.date) : "Pendiente"}</p>
                {step.detail && step.state !== "done" ? (
                  <p className={cn("mt-2 text-xs leading-relaxed", reached ? "text-foreground" : "text-muted-foreground")}>{step.detail}</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
