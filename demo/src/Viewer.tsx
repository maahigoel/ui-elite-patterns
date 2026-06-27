import { Suspense, lazy, useMemo, useState, type ComponentType } from "react";
import type { DemoEntry } from "./generated/manifest";
import { ComplexityBadge } from "./ui";

// Statically-analyzable glob of every generated component.
const modules = import.meta.glob("./generated/*.tsx");

export default function Viewer({ entry, onBack }: { entry: DemoEntry; onBack: () => void }) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const Comp = useMemo<ComponentType | null>(() => {
    const loader = modules[`./generated/${entry.id}.tsx`];
    return loader ? lazy(loader as () => Promise<{ default: ComponentType }>) : null;
  }, [entry.id]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(entry.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be unavailable over http — ignore */
    }
  };

  return (
    <div className="relative min-h-screen bg-neutral-950">
      {/* Live component */}
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center text-white/40">
            Loading…
          </div>
        }
      >
        {Comp ? (
          <Comp />
        ) : (
          <div className="flex min-h-screen items-center justify-center text-white/40">
            Component not found.
          </div>
        )}
      </Suspense>

      {/* Floating top bar — above component fixed elements (which use z-50). */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex items-center justify-between gap-3 p-4">
        <button
          onClick={onBack}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-neutral-900/80 px-4 py-2 text-sm font-medium text-white backdrop-blur-xl transition-colors hover:bg-neutral-800"
        >
          ← Gallery
        </button>
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/15 bg-neutral-900/80 px-3 py-1.5 backdrop-blur-xl">
          <span className="max-w-[40vw] truncate text-sm font-medium text-white">{entry.name}</span>
          <ComplexityBadge complexity={entry.complexity} />
          <button
            onClick={() => setShowCode((s) => !s)}
            className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white hover:bg-white/20"
          >
            {showCode ? "Hide code" : "View code"}
          </button>
        </div>
      </div>

      {/* Slide-in code panel */}
      <div
        className={
          "fixed right-0 top-0 z-[100] flex h-full w-full max-w-xl flex-col border-l border-white/10 bg-neutral-950/95 backdrop-blur-xl transition-transform duration-300 md:w-[40vw] " +
          (showCode ? "translate-x-0" : "translate-x-full")
        }
      >
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div>
            <h2 className="font-semibold text-white">{entry.name}</h2>
            <p className="text-xs text-white/40">
              {entry.kind}
              {entry.componentType ? ` · ${entry.componentType}` : ""} · {entry.framework.join(", ")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copy}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={() => setShowCode(false)}
              className="rounded-lg px-2 py-1.5 text-white/50 hover:text-white"
              aria-label="Close code panel"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-white/60">{entry.description}</p>
          <p className="mt-2 text-xs leading-relaxed text-white/40">{entry.implementation_notes}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {entry.tags.map((t) => (
              <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-white/50">
                {t}
              </span>
            ))}
          </div>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-[12.5px] leading-relaxed text-white/85">
            <code>{entry.code}</code>
          </pre>
          <p className="mt-3 text-[11px] text-white/30">
            Inspiration: {entry.sources.join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
}
