import { useEffect, useMemo, useState } from "react";
import { entries } from "./generated/manifest";
import Gallery from "./Gallery";
import Viewer from "./Viewer";

export default function App() {
  const [selected, setSelected] = useState<string | null>(null);

  const current = useMemo(
    () => entries.find((e) => e.id === selected) ?? null,
    [selected]
  );

  // Close the viewer with Escape.
  useEffect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current]);

  if (current) {
    return <Viewer key={current.id} entry={current} onBack={() => setSelected(null)} />;
  }
  return <Gallery onSelect={setSelected} />;
}
