import { useEffect, useState } from "react";
import {
  CRAFTS,
  CRYSTALS,
  attemptLimit,
  levelBands,
  materialOnHand,
  recipeById,
  recipesFor,
  skillText,
  type CraftId,
  type Recipe,
} from "@/game/craft";
import { useGame } from "@/game/store";

export function CraftMenu() {
  const crystals = useGame((s) => s.crystals);
  const craftSkill = useGame((s) => s.craftSkill);
  const stock = useGame((s) => s.craftStock);
  const inventory = useGame((s) => s.inventory);
  const [craft, setCraft] = useState<CraftId>("wood");
  const [band, setBand] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const skill = craftSkill?.[craft] ?? 0;
  const limit = attemptLimit(skill);
  const bands = levelBands(craft);
  const bandWindow = bands[Math.min(band, bands.length - 1)] ?? bands[0];
  const rows = recipesFor(craft).filter((row) => row.level >= bandWindow.start && row.level <= bandWindow.end);
  const recipe = picked ? recipeById(picked) : null;
  const named = CRAFTS.find((row) => row.id === craft);
  const [pop, setPop] = useState<{ id: number; text: string } | null>(null);

  useEffect(() => {
    if (!pop) return;
    const fade = window.setTimeout(() => {
      setPop((cur) => (cur && cur.id === pop.id ? null : cur));
    }, 2600);
    return () => window.clearTimeout(fade);
  }, [pop]);

  function have(name: string): number {
    return materialOnHand(name, inventory, stock);
  }

  return (
    <div className="relative mt-2 flex min-h-0 flex-1 flex-col">
      {pop ? (
        <p className="pointer-events-none absolute left-1/2 top-1/2 z-20 max-w-[16rem] -translate-x-1/2 -translate-y-1/2 border border-gold bg-[#0c1b38]/95 px-3 py-1.5 text-center text-sm font-semibold text-[#f3e6d0]">
          {pop.text}
        </p>
      ) : null}
      <div className="grid shrink-0 grid-cols-8 gap-1">
        {CRYSTALS.map((crystal) => (
          <div key={crystal.id} className="border border-gold-dim/70 px-0.5 py-1 text-center" title={`${crystal.name} Crystal`}>
            <span className="mx-auto block size-2.5" style={{ background: crystal.color }} />
            <span className="mt-0.5 block text-[8px] leading-none text-muted">{crystal.name}</span>
            <span className="mt-0.5 block font-mono text-[10px] tabular-nums text-ink">{crystals?.[crystal.id] ?? 0}</span>
          </div>
        ))}
      </div>
      <p className="mt-1 shrink-0 text-[10px] text-muted">Crystals stay here. They do not take a bag slot.</p>
      <div className="mt-2 grid shrink-0 grid-cols-4 gap-1">
        {CRAFTS.map((row) => (
          <button
            key={row.id}
            type="button"
            onClick={() => {
              setCraft(row.id);
              setBand(0);
              setPicked(null);
            }}
            className={`h-8 border text-[11px] ${craft === row.id ? "border-gold bg-gold text-navy" : "border-gold-dim text-ink"}`}
          >
            {row.short}
          </button>
        ))}
      </div>
      <div className="mt-2 flex shrink-0 items-baseline justify-between gap-2">
        <p className="font-display text-xl leading-none text-gold">{named?.name}</p>
        <p className="font-mono text-sm text-ink">
          Skill <span className="tabular-nums">{skillText(skill)}</span>
        </p>
      </div>
      <div className="mt-2 flex shrink-0 gap-1">
        {bands.map((row, index) => (
          <button
            key={`${row.start}-${row.end}`}
            type="button"
            onClick={() => {
              setBand(index);
              setPicked(null);
            }}
            className={`h-7 border px-2 text-[11px] ${index === Math.min(band, bands.length - 1) ? "border-gold text-gold" : "border-gold-dim text-muted"}`}
          >
            {row.start}-{row.end}
          </button>
        ))}
      </div>
      {recipe && recipe.craft === craft ? (
        <RecipeCard
          recipe={recipe}
          skill={skill}
          have={have}
          crystals={crystals?.[recipe.crystal] ?? 0}
          onBack={() => setPicked(null)}
          onSkill={(text) => setPop({ id: Date.now(), text })}
        />
      ) : (
        <ul className="mt-2 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pb-1">
          {rows.map((row) => {
            const open = row.level <= limit;
            return (
              <li key={row.id}>
                <button
                  type="button"
                  onClick={() => setPicked(row.id)}
                  className="flex w-full items-baseline justify-between gap-2 border border-gold-dim/70 px-2 py-1.5 text-left"
                >
                  <span className={`text-sm ${open ? "text-ink" : "text-muted"}`}>
                    <span className="mr-2 font-mono text-[11px] text-muted">Lv.{row.level}</span>
                    {row.result}
                    {row.qty > 1 ? ` ×${row.qty}` : ""}
                  </span>
                  <span className="shrink-0 text-[10px] text-muted">{open ? "Attempt" : "Too high"}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function RecipeCard({
  recipe,
  skill,
  have,
  crystals,
  onBack,
  onSkill,
}: {
  recipe: Recipe;
  skill: number;
  have: (name: string) => number;
  crystals: number;
  onBack: () => void;
  onSkill: (text: string) => void;
}) {
  const crystal = CRYSTALS.find((row) => row.id === recipe.crystal);
  const open = recipe.level <= attemptLimit(skill);
  const shortCrystal = crystals < 1;
  const shortMat = recipe.materials.some((row) => have(row.name) < row.qty);
  return (
    <div className="mt-2 min-h-0 flex-1 overflow-y-auto pb-1">
      <button type="button" onClick={onBack} className="text-sm text-gold">
        Recipes
      </button>
      <p className="mt-2 font-display text-2xl leading-none text-ink">
        {recipe.result}
        {recipe.qty > 1 ? ` ×${recipe.qty}` : ""}
      </p>
      <p className="mt-1 text-xs text-muted">Lv.{recipe.level}</p>
      <p className="mt-3 flex items-center justify-between gap-2 text-sm text-ink">
        <span className="flex items-center gap-2">
          <span className="inline-block size-3" style={{ background: crystal?.color }} />
          {crystal?.name} Crystal
        </span>
        <span className={`font-mono tabular-nums ${shortCrystal ? "text-bad" : "text-gold"}`}>{crystals}/1</span>
      </p>
      <p className="mt-3 text-[11px] tracking-[0.14em] text-gold">MATERIALS</p>
      <ul className="mt-1 flex flex-col gap-1">
        {recipe.materials.map((row) => {
          const owned = have(row.name);
          return (
            <li key={row.name} className="flex items-baseline justify-between gap-2 border border-gold-dim/70 px-2 py-1.5 text-sm">
              <span className="text-ink">{row.name}</span>
              <span className={`font-mono tabular-nums ${owned < row.qty ? "text-bad" : "text-gold"}`}>
                {owned}/{row.qty}
              </span>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        disabled={!open || shortCrystal || shortMat}
        onClick={() => {
          const note = useGame.getState().synthesize(recipe.id);
          if (note) onSkill(note);
        }}
        className="mt-3 h-11 w-full border border-gold bg-gold text-sm font-semibold text-navy disabled:opacity-40"
      >
        {open ? "Synthesize" : "Too high"}
      </button>
    </div>
  );
}
