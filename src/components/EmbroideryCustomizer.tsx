import { BookOpen, MapPin } from "lucide-react";

import {
  BIBLE_BOOKS,
  formatReference,
  isValidSelection,
  type EmbroideryConfig,
  type EmbroiderySelection,
} from "@/lib/embroidery";

interface EmbroideryCustomizerProps {
  config: EmbroideryConfig;
  value: EmbroiderySelection;
  onChange: (value: EmbroiderySelection) => void;
}

export function EmbroideryCustomizer({ config, value, onChange }: EmbroideryCustomizerProps) {
  const selectedBook = BIBLE_BOOKS.find((book) => book.name === value.book) ?? BIBLE_BOOKS[0];
  const valid = isValidSelection(value);

  const updateNumber = (field: "chapter" | "fromVerse" | "toVerse", raw: string) => {
    onChange({ ...value, [field]: Number(raw) });
  };

  return (
    <section className="mt-10 border-y border-border py-7" aria-labelledby="embroidery-title">
      <div className="flex items-start gap-3">
        <BookOpen aria-hidden className="mt-1 size-5 shrink-0" strokeWidth={1.25} />
        <div>
          <p className="eyebrow text-[0.5625rem] text-muted-foreground">Personalización incluida</p>
          <h2 id="embroidery-title" className="mt-2 text-3xl">Borda tu referencia</h2>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Elige el libro, capítulo y versículos. Bordaremos únicamente la referencia, no el texto del pasaje.
      </p>

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 bg-card p-4 text-sm">
        <span className="flex items-center gap-2">
          <MapPin aria-hidden className="size-4" strokeWidth={1.25} />
          Posición fija: <strong className="font-medium">{config.position}</strong>
        </span>
        <span>Tamaño: <strong className="font-medium">{config.size}</strong></span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <label className="col-span-2 block">
          <span className="eyebrow mb-1.5 block text-[0.5625rem] text-muted-foreground">Libro</span>
          <select
            className="field-box"
            value={value.book}
            onChange={(event) => onChange({ ...value, book: event.target.value, chapter: 1 })}
          >
            {BIBLE_BOOKS.map((book) => (
              <option key={book.name} value={book.name}>{book.name}</option>
            ))}
          </select>
        </label>
        <label className="col-span-2 block sm:col-span-1">
          <span className="eyebrow mb-1.5 block text-[0.5625rem] text-muted-foreground">Capítulo</span>
          <input
            className="field-box"
            type="number"
            min={1}
            max={selectedBook.chapters}
            value={Number.isNaN(value.chapter) ? "" : value.chapter}
            onChange={(event) => updateNumber("chapter", event.target.value)}
          />
        </label>
        <div className="col-span-2 grid grid-cols-2 gap-4 sm:col-span-1">
          <label className="block">
            <span className="eyebrow mb-1.5 block text-[0.5625rem] text-muted-foreground">Desde</span>
            <input
              className="field-box"
              type="number"
              min={1}
              max={176}
              value={Number.isNaN(value.fromVerse) ? "" : value.fromVerse}
              onChange={(event) => updateNumber("fromVerse", event.target.value)}
            />
          </label>
          <label className="block">
            <span className="eyebrow mb-1.5 block text-[0.5625rem] text-muted-foreground">Hasta</span>
            <input
              className="field-box"
              type="number"
              min={value.fromVerse || 1}
              max={176}
              value={Number.isNaN(value.toVerse) ? "" : value.toVerse}
              onChange={(event) => updateNumber("toVerse", event.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="mt-5 border-l-2 border-primary pl-4" aria-live="polite">
        <p className="eyebrow text-[0.5625rem] text-muted-foreground">Se bordará</p>
        <p className="mt-1 font-serif text-2xl">
          {valid ? formatReference(value) : "Revisa el capítulo y el rango de versículos"}
        </p>
      </div>
    </section>
  );
}
