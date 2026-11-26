import { BookOpen, MapPin, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

import { BIBLE_VERSION, loadBibleChapter } from "@/lib/bible-text";
import { formatPrice } from "@/lib/catalog";
import {
  BIBLE_BOOKS,
  embroideryTextSurcharge,
  formatReference,
  isValidSelection,
  normalizeTextVerses,
  TEXT_VERSE_PRICE,
  verseCount,
  type EmbroideryConfig,
  type EmbroiderySelection,
} from "@/lib/embroidery";

interface EmbroideryCustomizerProps {
  config: EmbroideryConfig;
  value: EmbroiderySelection;
  onChange: (value: EmbroiderySelection) => void;
}

type TextState =
  | { key: string; status: "loading"; verses: string[] }
  | { key: string; status: "error"; verses: string[] }
  | { key: string; status: "ready"; verses: string[] };

export function EmbroideryCustomizer({ config, value, onChange }: EmbroideryCustomizerProps) {
  const selectedBook = BIBLE_BOOKS.find((book) => book.name === value.book) ?? BIBLE_BOOKS[0];
  const availableVerses = verseCount(value.book, value.chapter);
  const valid = isValidSelection(value);
  const isLarge = config.size === "Grande";
  const textKey = `${value.book}:${value.chapter}`;
  const [textState, setTextState] = useState<TextState>({ key: "", status: "loading", verses: [] });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!isLarge || availableVerses === 0) return;
    const controller = new AbortController();
    setTextState({ key: textKey, status: "loading", verses: [] });
    loadBibleChapter(value.book, value.chapter, controller.signal)
      .then((verses) => {
        if (verses.length !== availableVerses) throw new Error("Texto bíblico incompleto");
        if (!controller.signal.aborted) setTextState({ key: textKey, status: "ready", verses });
      })
      .catch(() => {
        if (!controller.signal.aborted) setTextState({ key: textKey, status: "error", verses: [] });
      });
    return () => controller.abort();
  }, [attempt, availableVerses, isLarge, textKey, value.book, value.chapter]);

  const updateNumber = (field: "chapter" | "fromVerse" | "toVerse", raw: string) => {
    const number = Number(raw);
    if (field === "chapter") {
      onChange({ ...value, chapter: number, fromVerse: 1, toVerse: 1, textVerses: [] });
      return;
    }
    const next = { ...value, [field]: number };
    onChange({ ...next, textVerses: normalizeTextVerses(next) });
  };

  const toggleTextVerse = (verse: number) => {
    const textVerses = value.textVerses.includes(verse)
      ? value.textVerses.filter((selected) => selected !== verse)
      : [...value.textVerses, verse];
    onChange({ ...value, textVerses: normalizeTextVerses({ ...value, textVerses }) });
  };

  const range = valid
    ? Array.from({ length: value.toVerse - value.fromVerse + 1 }, (_, index) => value.fromVerse + index)
    : [];
  const currentText = textState.key === textKey ? textState : undefined;
  const textReady = currentText?.status === "ready";
  const surcharge = embroideryTextSurcharge(config, value);

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
        Elige el libro, capítulo y versículos. La referencia está incluida; en los diseños grandes también puedes añadir el texto.
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
            aria-label="Libro"
            value={value.book}
            onChange={(event) => onChange({ book: event.target.value, chapter: 1, fromVerse: 1, toVerse: 1, textVerses: [] })}
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
            aria-label="Capítulo"
            type="number"
            min={1}
            max={selectedBook?.chapters ?? 1}
            value={Number.isNaN(value.chapter) ? "" : value.chapter}
            onChange={(event) => updateNumber("chapter", event.target.value)}
          />
        </label>
        <div className="col-span-2 grid grid-cols-2 gap-4 sm:col-span-1">
          <label className="block">
            <span className="eyebrow mb-1.5 block text-[0.5625rem] text-muted-foreground">Desde</span>
            <input
              className="field-box"
              aria-label="Desde"
              type="number"
              min={1}
              max={availableVerses || 1}
              value={Number.isNaN(value.fromVerse) ? "" : value.fromVerse}
              onChange={(event) => updateNumber("fromVerse", event.target.value)}
            />
          </label>
          <label className="block">
            <span className="eyebrow mb-1.5 block text-[0.5625rem] text-muted-foreground">Hasta</span>
            <input
              className="field-box"
              aria-label="Hasta"
              type="number"
              min={value.fromVerse || 1}
              max={availableVerses || 1}
              value={Number.isNaN(value.toVerse) ? "" : value.toVerse}
              onChange={(event) => updateNumber("toVerse", event.target.value)}
            />
          </label>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">
        {availableVerses > 0
          ? `${value.book} ${value.chapter} tiene ${availableVerses} ${availableVerses === 1 ? "versículo" : "versículos"}.`
          : `Ese capítulo no existe en ${value.book}.`}
      </p>

      <div className="mt-5 border-l-2 border-primary pl-4" aria-live="polite">
        <p className="eyebrow text-[0.5625rem] text-muted-foreground">Se bordará</p>
        <p className="mt-1 font-serif text-2xl">
          {valid ? formatReference(value) : "Revisa el capítulo y el rango de versículos"}
        </p>
      </div>

      {isLarge ? (
        <div className="mt-7 border-t border-border pt-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl">Añade el texto bíblico</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Marca todos o solo algunos versículos del rango. Cada uno suma {formatPrice(TEXT_VERSE_PRICE)}.
              </p>
            </div>
            {valid && range.length > 1 && (
              <div className="flex shrink-0 flex-col gap-2 text-xs sm:flex-row">
                <button
                  type="button"
                  className="link-line"
                  disabled={!textReady}
                  onClick={() => onChange({ ...value, textVerses: range })}
                >
                  Todos
                </button>
                <button
                  type="button"
                  className="link-line"
                  disabled={value.textVerses.length === 0}
                  onClick={() => onChange({ ...value, textVerses: [] })}
                >
                  Ninguno
                </button>
              </div>
            )}
          </div>

          {valid && currentText?.status === "loading" && (
            <p className="mt-5 bg-card p-4 text-sm text-muted-foreground" role="status">Cargando el texto bíblico…</p>
          )}
          {valid && currentText?.status === "error" && (
            <div className="mt-5 bg-card p-4 text-sm" role="alert">
              <p>No pudimos cargar el texto. La referencia sigue disponible.</p>
              <button type="button" className="link-line mt-3 inline-flex items-center gap-2" onClick={() => setAttempt((value) => value + 1)}>
                <RotateCcw aria-hidden className="size-3.5" /> Reintentar
              </button>
            </div>
          )}
          {valid && textReady && (
            <div className="mt-5 max-h-96 divide-y divide-border overflow-y-auto border-y border-border">
              {range.map((verse) => (
                <label key={verse} className="flex cursor-pointer items-start gap-3 py-3 pr-2 text-sm leading-relaxed">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 shrink-0 accent-primary"
                    aria-label={`Incluir texto del versículo ${verse}`}
                    checked={value.textVerses.includes(verse)}
                    onChange={() => toggleTextVerse(verse)}
                  />
                  <span className="w-8 shrink-0 font-medium">{verse}</span>
                  <span className="text-muted-foreground">{currentText.verses[verse - 1]}</span>
                </label>
              ))}
            </div>
          )}
          {!valid && <p className="mt-5 text-sm text-muted-foreground">Elige un rango válido para añadir texto.</p>}
          <p className="mt-4 text-sm" aria-live="polite">
            {value.textVerses.length === 0
              ? "Solo se bordará la referencia, sin recargo."
              : `${value.textVerses.length} ${value.textVerses.length === 1 ? "versículo" : "versículos"} con texto · +${formatPrice(surcharge)}`}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Texto: {BIBLE_VERSION}.</p>
        </div>
      ) : (
        <p className="mt-5 bg-card p-4 text-xs leading-relaxed text-muted-foreground">
          Este diseño pequeño incluye solo la referencia. El texto bíblico completo está disponible en los diseños grandes.
        </p>
      )}
    </section>
  );
}
