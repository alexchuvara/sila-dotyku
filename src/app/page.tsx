import Link from "next/link";
import { Emblem } from "@/components/brand/Emblem";

// Temporary page that exercises the design tokens. Real content and translated strings arrive in Phase 5.
export default function Home() {
  return (
    <>
      <header className="flex items-center justify-between gap-4 p-4 sm:px-8">
        <div className="flex items-center gap-3">
          <Emblem className="size-9" />
          <span className="font-display text-primary text-2xl font-semibold">Siła dotyku</span>
        </div>
        {/* Your task: <ThemeToggle /> goes here. */}
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-4 py-12 sm:px-8">
        <h1 className="font-display text-primary text-4xl leading-tight font-medium sm:text-5xl">
          Masaż, który zmienia samopoczucie
        </h1>
        <p className="text-muted text-lg">
          Ajurwedyjski i wschodni masaż w Gliwicach, w spokojnej atmosferze. Strona w przygotowaniu.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/kontakt"
            className="bg-primary text-primary-foreground rounded-xl px-5 py-3 font-medium"
          >
            Kontakt
          </Link>
          <span className="border-link text-link rounded-xl border px-5 py-3 font-medium">
            Zobacz masaże
          </span>
        </div>

        <section className="border-border bg-surface rounded-2xl border p-5">
          <span className="bg-accent-soft text-accent rounded-md px-2 py-0.5 text-xs font-medium">
            Autorska metoda
          </span>
          <div className="mt-3 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-primary text-2xl font-semibold">Energodynamika</h2>
            <span className="text-muted text-sm">od 150 zł</span>
          </div>
          <div className="bg-gold mt-3 h-0.5 w-10" aria-hidden="true" />
        </section>
      </main>
    </>
  );
}
