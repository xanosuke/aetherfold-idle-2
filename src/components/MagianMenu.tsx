import { useState } from "react";
import { ITEMS, PAPER_DOLL, SLOT_LABEL, type Slot } from "@/game/content";
import { emptyEquipSets, resolveGear } from "@/game/equipsets";
import { emptyCrystals } from "@/game/craft";
import {
  MAGIAN_TRIALS,
  REMOVAL_STONE_GIL,
  bonusForItem,
  bonusText,
  describeMagian,
  emptyMagian,
  trialById,
  trialQty,
  trialRank,
} from "@/game/magian";
import { useGame } from "@/game/store";

const SWATCH: Record<string, string> = {
  bronze: "#c47b3a",
  wood: "#8d7340",
  sea: "#3d7dff",
  cloth: "#2f6dff",
  oil: "#8a5a28",
};

function gilText(n: number): string {
  return Math.max(0, Math.floor(n)).toLocaleString("en-US");
}

export function MagianMenu() {
  const gearBase = useGame((s) => s.gearBase ?? s.loadout);
  const equipSets = useGame((s) => s.equipSets);
  const mainJob = useGame((s) => s.mainJob);
  const subJob = useGame((s) => s.subJob);
  const magian = useGame((s) => s.magian ?? emptyMagian());
  const crystals = useGame((s) => s.crystals ?? emptyCrystals());
  const gil = useGame((s) => s.gil ?? 0);
  const idle = resolveGear("idle", gearBase, equipSets ?? emptyEquipSets(), mainJob, subJob, false);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [trialsOpen, setTrialsOpen] = useState(false);
  const itemId = slot ? idle[slot] : null;
  const item = itemId ? ITEMS[itemId] : null;

  if (slot && item && trialsOpen) {
    return (
      <TrialList
        itemId={item.id}
        onBack={() => setTrialsOpen(false)}
      />
    );
  }
  if (slot) {
    return (
      <PieceDetail
        slot={slot}
        itemId={itemId}
        stones={magian.stones}
        gil={gil}
        note={item ? describeMagian(item.id, magian) : null}
        onBack={() => {
          setSlot(null);
          setTrialsOpen(false);
        }}
        onTrials={() => setTrialsOpen(true)}
      />
    );
  }

  const active = magian.active;
  const activeItem = active ? ITEMS[active.itemId] : null;
  const activeTrial = active ? trialById(active.trial) : null;

  return (
    <div className="mt-2 flex min-h-0 flex-1 flex-col overflow-y-auto pb-1">
      <p className="text-sm text-ink">Idle gear. Choose a piece. The moogle inscribes one trial.</p>
      <p className="mt-1 text-xs text-muted">
        Ammo is refused. The piece's level sets the crystals and the bonus. A two-handed weapon doubles that bonus and does not raise the cost. Only one enchantment can stay on a piece.
      </p>
      {active && activeItem && activeTrial ? (
        <p className="mt-2 text-xs text-gold">
          {activeItem.name} is inscribed with {activeTrial.name}. Turn in {trialQty(activeItem.level)} {activeTrial.crystalName} crystals, or abandon it.
        </p>
      ) : (
        <p className="mt-2 text-xs text-muted">No trial is inscribed.</p>
      )}
      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {PAPER_DOLL.map((entry) => {
          const worn = idle[entry] ? ITEMS[idle[entry]!] : null;
          const marked = worn ? describeMagian(worn.id, magian) : null;
          return (
            <button
              key={entry}
              type="button"
              onClick={() => setSlot(entry)}
              className={`flex min-h-14 flex-col justify-between border px-1 py-1 text-left ${marked ? "border-gold" : "border-gold-dim/70"}`}
            >
              <span className="text-[10px] tracking-[0.08em] text-gold">{SLOT_LABEL[entry]}</span>
              <span className={`truncate text-[11px] ${worn ? "text-ink" : "text-muted"}`}>{worn ? worn.name : "—"}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted">
        Removal Stones {magian.stones} · Gil {gilText(gil)}
      </p>
      <button
        type="button"
        disabled={gil < REMOVAL_STONE_GIL || magian.stones >= 99}
        onClick={() => useGame.getState().buyRemovalStone()}
        className="mt-2 h-11 w-full border border-gold text-sm font-semibold text-gold disabled:opacity-40"
      >
        Buy Removal Stone ({gilText(REMOVAL_STONE_GIL)} gil)
      </button>
      <p className="mt-2 text-[11px] text-muted">Crystals on hand are spent only when you finish a trial.</p>
      <ul className="mt-1 grid grid-cols-2 gap-x-3 text-[11px] text-muted">
        {MAGIAN_TRIALS.map((trial) => (
          <li key={trial.id}>
            {trial.crystalName} {crystals[trial.crystal] ?? 0}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PieceDetail({
  slot,
  itemId,
  stones,
  gil,
  note,
  onBack,
  onTrials,
}: {
  slot: Slot;
  itemId: string | null;
  stones: number;
  gil: number;
  note: string | null;
  onBack: () => void;
  onTrials: () => void;
}) {
  const item = itemId ? ITEMS[itemId] : null;
  const ammo = item?.slot === "ammo";
  return (
    <div className="mt-2 min-h-0 space-y-2 overflow-y-auto pr-1">
      <button type="button" onClick={onBack} className="flex h-11 items-center text-sm text-gold">
        Idle
      </button>
      <div className="border border-gold-dim px-2 py-2">
        <p className="text-[10px] tracking-[0.08em] text-gold">{SLOT_LABEL[slot]}</p>
        {item ? (
          <>
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-block size-3" style={{ background: SWATCH[item.swatch] ?? "#c47b3a" }} />
              <p className="font-display text-2xl leading-none text-gold">{item.name}</p>
            </div>
            <p className="mt-1 text-xs text-muted">
              {item.kind} · Lv {item.level}
            </p>
            <p className="mt-2 font-mono text-sm text-ink">{item.line}</p>
            <p className="mt-2 text-[11px] leading-relaxed text-muted">{item.jobs}</p>
            {note ? <p className="mt-2 font-mono text-sm text-gold">{note}</p> : null}
          </>
        ) : (
          <p className="mt-2 text-sm text-muted">Nothing is equipped there.</p>
        )}
        {item && ammo ? <p className="mt-2 text-sm text-muted">Ammo cannot undertake a trial.</p> : null}
        {item && !ammo ? (
          <button type="button" onClick={onTrials} className="mt-3 h-11 w-full border border-gold bg-gold text-sm font-semibold text-navy">
            Magian Trials
          </button>
        ) : null}
        {item && note?.startsWith("Inscribed:") ? (
          <button
            type="button"
            onClick={() => useGame.getState().abandonTrial(item.id)}
            className="mt-2 h-11 w-full border border-gold text-sm font-semibold text-gold"
          >
            Abandon
          </button>
        ) : null}
        {item && note?.startsWith("Enchanted:") ? (
          <button
            type="button"
            disabled={stones < 1}
            onClick={() => useGame.getState().clearEnchant(item.id)}
            className="mt-2 h-11 w-full border border-gold text-sm font-semibold text-gold disabled:opacity-40"
          >
            Remove enchantment ({stones} {stones === 1 ? "stone" : "stones"})
          </button>
        ) : null}
        {item && note?.startsWith("Enchanted:") && stones < 1 ? (
          <button
            type="button"
            disabled={gil < REMOVAL_STONE_GIL}
            onClick={() => useGame.getState().buyRemovalStone()}
            className="mt-2 h-11 w-full border border-gold-dim text-sm text-gold disabled:opacity-40"
          >
            Buy Removal Stone ({gilText(REMOVAL_STONE_GIL)} gil)
          </button>
        ) : null}
      </div>
    </div>
  );
}

function TrialList({ itemId, onBack }: { itemId: string; onBack: () => void }) {
  const magian = useGame((s) => s.magian ?? emptyMagian());
  const crystals = useGame((s) => s.crystals ?? emptyCrystals());
  const item = ITEMS[itemId];
  if (!item) return null;
  const twoHand = item.grip === "two";
  const rank = trialRank(item.level);
  const qty = trialQty(item.level);
  const enchanted = Boolean(magian.augments[itemId]);
  const mine = magian.active?.itemId === itemId ? magian.active : null;
  const other = magian.active && magian.active.itemId !== itemId ? magian.active : null;
  const otherName = other ? ITEMS[other.itemId]?.name ?? "another piece" : null;
  const openTrial = mine ? trialById(mine.trial) : null;

  return (
    <div className="mt-2 flex min-h-0 flex-1 flex-col">
      <button type="button" onClick={onBack} className="flex h-11 shrink-0 items-center text-sm text-gold">
        {item.name}
      </button>
      <p className="text-sm text-ink">Choose a trial. It is inscribed on {item.name} until you turn the crystals in or abandon it.</p>
      <p className="mt-1 text-xs text-muted">
        Lv {item.level}. This rank is ×{rank}, so the turn-in is {qty} crystals.
        {twoHand ? " Two-handed, so the bonus is doubled again." : ""}
      </p>
      {enchanted ? <p className="mt-1 text-xs text-gold">This piece already bears an enchantment. A Removal Stone can clear it.</p> : null}
      {otherName ? <p className="mt-1 text-xs text-gold">A trial is already inscribed on {otherName}.</p> : null}
      {openTrial ? (
        <p className="mt-1 text-xs text-gold">
          Inscribed: {openTrial.name}. You have {crystals[openTrial.crystal] ?? 0} {openTrial.crystalName} crystals.
        </p>
      ) : null}
      <ul className="mt-2 flex min-h-0 flex-col gap-2 overflow-y-auto pb-1">
        {MAGIAN_TRIALS.map((trial) => {
          const bonus = bonusForItem(itemId, trial.id);
          const have = crystals[trial.crystal] ?? 0;
          const current = mine?.trial === trial.id;
          const blocked = enchanted || Boolean(other) || (Boolean(mine) && !current);
          return (
            <li key={trial.id} className="border border-gold-dim px-2 py-2">
              <p className="text-sm font-semibold text-gold">{trial.name}</p>
              <p className="mt-1 font-mono text-xs text-ink">{bonus ? bonusText(bonus) : ""}</p>
              <p className="mt-1 text-xs text-muted">
                {qty} {trial.crystalName} crystals · you have {have}
              </p>
              {current ? (
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    disabled={have < qty}
                    onClick={() => useGame.getState().completeTrial(itemId)}
                    className="h-11 flex-1 border border-gold bg-gold text-sm font-semibold text-navy disabled:opacity-40"
                  >
                    Turn in
                  </button>
                  <button
                    type="button"
                    onClick={() => useGame.getState().abandonTrial(itemId)}
                    className="h-11 flex-1 border border-gold text-sm font-semibold text-gold"
                  >
                    Abandon
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={blocked}
                  onClick={() => useGame.getState().inscribeTrial(itemId, trial.id)}
                  className="mt-2 h-11 w-full border border-gold text-sm font-semibold text-gold disabled:opacity-40"
                >
                  Inscribe
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
