import type { ReactNode } from "react";

import portrait from "@/assets/hoodie-worn.jpg";
import { DemoNotice } from "@/components/DemoNotice";

export function AuthShell({ title, lead, children }: { title: string; lead: string; children: ReactNode }) {
  return (
    <div className="grid min-h-[80vh] lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={portrait} alt="" className="absolute inset-0 size-full object-cover" />
      </div>
      <div className="flex items-center justify-center px-5 py-16 md:px-10">
        <div className="w-full max-w-sm">
          <p className="eyebrow text-muted-foreground">Mi cuenta</p>
          <h1 className="mt-4 text-5xl">{title}</h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">{lead}</p>
          <div className="mt-8">
            <DemoNotice>Las cuentas se activarán al conectar la tienda. Por ahora este formulario es solo una vista previa.</DemoNotice>
          </div>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="eyebrow text-[0.625rem] text-muted-foreground">{label}</span>
      <input className="field" {...props} />
    </label>
  );
}
