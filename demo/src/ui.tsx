import type { DemoEntry } from "./generated/manifest";

export const COMPLEXITY_STYLES: Record<DemoEntry["complexity"], string> = {
  clean: "border-emerald-400/30 bg-emerald-400/15 text-emerald-300",
  elevated: "border-sky-400/30 bg-sky-400/15 text-sky-300",
  insane: "border-fuchsia-400/30 bg-fuchsia-400/15 text-fuchsia-300",
};

export const COMPLEXITY_ORDER: DemoEntry["complexity"][] = ["clean", "elevated", "insane"];

export function ComplexityBadge({ complexity }: { complexity: DemoEntry["complexity"] }) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide " +
        COMPLEXITY_STYLES[complexity]
      }
    >
      {complexity}
    </span>
  );
}
