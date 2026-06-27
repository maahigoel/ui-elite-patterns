import { useMemo, useState } from "react";
import { entries, type DemoEntry } from "./generated/manifest";
import { ComplexityBadge, COMPLEXITY_ORDER } from "./ui";

type ComplexityFilter = "all" | DemoEntry["complexity"];
type KindFilter = "all" | "pattern" | "component";

export default function Gallery({ onSelect }: { onSelect: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [complexity, setComplexity] = useState<ComplexityFilter>("all");
  const [kind, setKind] = useState<KindFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries
      .filter((e) => complexity === "all" || e.complexity === complexity)
      .filter((e) => kind === "all" || e.kind === kind)
      .filter(
        (e) =>
          q === "" ||
          e.name.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q)) ||
          e.description.toLowerCase().includes(q)
      )
      .sort(
        (a, b) =>
          COMPLEXITY_ORDER.indexOf(a.complexity) - COMPLEXITY_ORDER.indexOf(b.complexity) ||
          a.name.localeCompare(b.name)
      );
  }, [query, complexity, kind]);

  const counts = useMemo(
    () => ({
      clean: entries.filter((e) => e.complexity === "clean").length,
      elevated: entries.filter((e) => e.complexity === "elevated").length,
      insane: entries.filter((e) => e.complexity === "insane").length,
    }),
    []
  );

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero header */}
      <header className="relative overflow-hidden border-b border-white/10">
        <div className="absolute -top-32 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-fuchsia-500/15 blur-[120px]" />
        <div className="absolute -top-24 left-1/4 h-60 w-96 rounded-full bg-emerald-500/15 blur-[120px]" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Powered by the ui-mcp registry
          </span>
          <h1 className="mt-5 bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
            UI Elite Patterns
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            {entries.length} live, copy-pasteable UI patterns &amp; components — magnetic cursors,
            scroll-jacking, particle grids, page transitions and more. Click any card to view it
            full-screen with its source.
          </p>
        </div>
      </header>

      {/* Controls */}
      <div className="sticky top-0 z-30 border-b border-white/10 bg-neutral-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patterns, tags, descriptions…"
            className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-emerald-400 md:max-w-xs"
          />
          <div className="flex flex-wrap items-center gap-2">
            <FilterGroup<KindFilter>
              value={kind}
              onChange={setKind}
              options={[
                ["all", "All"],
                ["pattern", "Patterns"],
                ["component", "Components"],
              ]}
            />
            <FilterGroup<ComplexityFilter>
              value={complexity}
              onChange={setComplexity}
              options={[
                ["all", "All"],
                ["clean", `Clean ${counts.clean}`],
                ["elevated", `Elevated ${counts.elevated}`],
                ["insane", `Insane ${counts.insane}`],
              ]}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="mb-5 text-sm text-white/40">
          {filtered.length} {filtered.length === 1 ? "result" : "results"}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <button
              key={e.id}
              onClick={() => onSelect(e.id)}
              className="group flex flex-col rounded-2xl border border-white/10 bg-neutral-900 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-2xl hover:shadow-emerald-500/5"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-white">{e.name}</h3>
                <ComplexityBadge complexity={e.complexity} />
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-white/55">{e.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {e.tags.slice(0, 4).map((t) => (
                  <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-white/50">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-white/35">
                <span className="capitalize">{e.kind}{e.componentType ? ` · ${e.componentType}` : ""}</span>
                <span className="text-emerald-400/70 opacity-0 transition-opacity group-hover:opacity-100">
                  View live →
                </span>
              </div>
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="py-20 text-center text-white/40">No patterns match your filters.</div>
        )}
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-white/30">
        Generated from the ui-mcp registry · Inspiration: Aceternity UI, Godly, Mobbin, Refero
      </footer>
    </div>
  );
}

function FilterGroup<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: [T, string][];
}) {
  return (
    <div className="flex rounded-lg border border-white/10 bg-white/5 p-0.5">
      {options.map(([val, label]) => (
        <button
          key={val}
          onClick={() => onChange(val)}
          className={
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors " +
            (value === val ? "bg-white text-neutral-950" : "text-white/60 hover:text-white")
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
}
