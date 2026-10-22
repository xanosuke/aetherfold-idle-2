import { useEffect, useState } from "react";
import { FARM_SPOTS, HARE_MEAT_GIL, MAX_AFK_HOURS, farmZoneAt, previewAfk, spotById } from "@/game/afk";
import { ITEMS } from "@/game/content";
import { readPlace } from "@/game/save";
import { useGame } from "@/game/store";

function clock(mins: number): string {
  const whole = Math.max(0, Math.floor(mins));
  const h = Math.floor(whole / 60);
  const m = whole % 60;
  if (h <= 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export function AfkPanel({ onClose }: { onClose: () => void }) {
  const session = useGame((s) => s.afkFarm);
  const screen = useGame((s) => s.screen);
  const level = useGame((s) => s.jobLevels?.[s.mainJob] ?? 75);
  const [tick, setTick] = useState(0);
  const here = readPlace();
  const zone = farmZoneAt(screen, here.x, here.z);
  const preview = session ? previewAfk(session, Date.now()) : null;

  useEffect(() => {
    if (!session) return;
    const id = window.setInterval(() => setTick((n) => n + 1), 15000);
    return () => window.clearInterval(id);
  }, [session]);

  void tick;

  return (
    <div className="absolute inset-0 z-40" onClick={onClose}>
      <div
        className="ffxi-frame absolute inset-x-3 top-14 bottom-28 flex flex-col overflow-hidden p-3"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-baseline justify-between gap-2">
          <p className="font-display text-2xl leading-none text-gold">Camp</p>
          <button type="button" onClick={onClose} className="text-sm text-ink">Close</button>
        </div>
        <p className="mt-2 text-xs text-muted">
          {session ? "Camp is active." : "Camp is inactive."} A camp runs for {MAX_AFK_HOURS} hours, then stops paying.
        </p>
        {session && preview ? (
          <>
            <p className="mt-3 text-sm text-ink">
              {spotById(session.zoneId).name} · {session.farmingEfficiency} kills a minute
            </p>
            <p className="mt-1 text-sm text-gold">
              {clock(preview.elapsedMinutes)} elapsed · {clock(preview.remainingMinutes)} left on the cap
            </p>
            <p className="mt-1 text-xs text-muted">{session.note}</p>
            <ClaimLines preview={preview} />
            <label className="mt-3 flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={session.sellMeat}
                onChange={(event) => useGame.getState().setAfkSell(event.target.checked)}
              />
              Sell Hare Meat ({HARE_MEAT_GIL} gil each)
            </label>
            <button
              type="button"
              onClick={() => {
                useGame.getState().claimAfk();
                onClose();
              }}
              className="mt-3 h-11 w-full border border-gold bg-gold text-sm font-semibold text-navy"
            >
              Claim rewards
            </button>
            <button
              type="button"
              onClick={() => useGame.getState().stopAfk()}
              className="mt-2 h-10 w-full border border-gold-dim text-sm text-ink"
            >
              Break camp without claiming
            </button>
          </>
        ) : (
          <>
            <p className="mt-3 text-sm text-ink">
              {zone ? `You are in ${spotById(zone).name}.` : "You are not in an outdoor camp. Towns and instances will not take one."}
            </p>
            <button
              type="button"
              onClick={() => useGame.getState().startAfk()}
              className="mt-3 h-11 w-full border border-gold bg-gold text-sm font-semibold text-navy"
            >
              Make camp
            </button>
          </>
        )}
        <p className="mt-4 text-xs uppercase tracking-wide text-muted">Recommended</p>
        <ul className="mt-1 min-h-0 flex-1 overflow-y-auto">
          {FARM_SPOTS.map((spot) => {
            const hereNow = zone === spot.id;
            const fit = level >= spot.levelMin && level <= spot.levelMax;
            return (
              <li key={spot.id} className="border-t border-gold-dim py-2">
                <p className="text-sm text-ink">
                  {spot.name}
                  {hereNow ? <span className="text-gold"> · here</span> : null}
                </p>
                <p className="text-xs text-muted">
                  {spot.prey} · levels {spot.levelMin}–{spot.levelMax}
                  {fit ? "" : " · outside your level"}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function ClaimLines({ preview }: { preview: ReturnType<typeof previewAfk> }) {
  const rows = Object.entries(preview.items);
  return (
    <div className="mt-3 border border-gold-dim px-2 py-2 text-sm text-ink">
      <p>{preview.kills} kills · {preview.exp.toLocaleString()} experience</p>
      <p>{preview.gil.toLocaleString()} gil{preview.soldMeat > 0 ? ` · sold ${preview.soldMeat} Hare Meat` : ""}</p>
      {preview.tabs > 0 ? <p>{preview.tabs} tabs</p> : null}
      {preview.crystals > 0 ? <p>{preview.crystals} fire crystals</p> : null}
      {preview.rankPoints > 0 ? <p>{preview.rankPoints} rank and conquest points</p> : null}
      {rows.length === 0 ? <p className="text-muted">No items kept.</p> : rows.map(([id, qty]) => (
        <p key={id}>{ITEMS[id]?.name ?? id} × {qty}</p>
      ))}
    </div>
  );
}
