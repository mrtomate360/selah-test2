import type { ReactNode } from "react";

export function DemoNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 border border-border bg-accent px-4 py-3 text-sm leading-relaxed" role="note">
      <span className="eyebrow mt-0.5 shrink-0 text-[0.5625rem]">Demo</span>
      <p>{children}</p>
    </div>
  );
}
