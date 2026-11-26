import type { EmbroideredVerse } from "@/lib/embroidery";

export function EmbroideryTextDetails({ verses }: { verses: EmbroideredVerse[] }) {
  if (verses.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      <p className="eyebrow text-[0.5rem] text-muted-foreground">Texto bíblico solicitado</p>
      <ol className="space-y-2">
        {verses.map((item) => (
          <li key={item.verse} className="grid grid-cols-[2rem_1fr] gap-2 text-xs leading-relaxed">
            <span className="font-medium text-foreground">Vers. {item.verse}</span>
            <span className="text-muted-foreground">«{item.text}»</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
