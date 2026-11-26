export function PageHeading({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <div className="page pb-10 pt-14 text-center md:pb-14 md:pt-24">
      <p className="eyebrow text-muted-foreground">{eyebrow}</p>
      <h1 className="mt-4 text-5xl md:text-7xl">{title}</h1>
      {lead && <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted-foreground">{lead}</p>}
    </div>
  );
}
