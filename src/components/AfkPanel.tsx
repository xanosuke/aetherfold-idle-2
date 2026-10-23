import { useEffect, useState } from "react";
import { MAX_AFK_HOURS, NO_NM, campRefusal, checkRating, farmZoneAt, nearestGroup, nearestNm, previewAfk, regionKind, spotById, zoneGroups, zoneNms, type CampMode } from "@/game/afk";
import { ITEMS } from "@/game/content";
import { readPlace } from "@/game/save";
import { useGame } from "@/game/store";
import { regionName } from "@/game/world";

function clock(mins: number): string {
  const whole = Math.max(0, Math.floor(mins));
  const h = Math.floor(whole / 60);
  const m = whole % 60;
  if (h <= 0) return `${m}m`;
  if (m <= 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function pace(kpm: number): string {
  return `${Math.round(kpm * 10) / 10} kills/min`;
}

function hourPace(perHour: number): string {
  return `~${Math.round(perHour * 10) / 10}/hr`;
}

export function AfkPanel({ onClose }: { onClose: () => void }) {
  const session = useGame((s) => s.afkFarm);
  const screen = useGame((s) => s.screen);
  const level = useGame((s) => s.jobLevels?.[s.mainJob] ?? 75);
  const [tick, setTick] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [tab, setTab] = useState<CampMode>("exp");
  const here = readPlace();
  const zone = farmZoneAt(screen, here.x, here.z);
  const preview = session ? previewAfk(session, Date.now(), here) : null;
  const hereRegion = regionName(here.x, here.z);
  const refused = regionKind(hereRegion) === "town" || regionKind(hereRegion) === "instance";
  const groups = zone ? zoneGroups(here.x, here.z) : [];
  const nms = zone ? zoneNms(here.x, here.z) : [];
  const closest = zone ? nearestGroup(here.x, here.z) : null;
  const closestNm = zone ? nearestNm(here.x, here.z) : null;
  const onNm = tab === "nm";
  const selected = zone
    ? onNm
      ? (nms.find((row) => row.id === pick) ?? closestNm)
      : (groups.find((group) => group.id === pick) ?? closest)
    : null;
  const preyName = session?.mode === "nm"
    ? (session.groupName || preview?.preyName || "Camp")
    : (session?.groupName || preview?.preyName || "Camp");
  const preyLevel = session?.mode === "nm"
    ? (preview?.preyLevel ?? 0)
    : (session?.preyLevel ?? preview?.preyLevel ?? 0);
  const rating = session && preyLevel > 0 ? checkRating(session.level, preyLevel) : "";
  const nmRate = session?.nmPerHour ?? preview?.perHour ?? 0;

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
          <div className="mt-3 min-h-0 flex-1 overflow-y-auto">
            <p className="text-sm text-ink">
              {session.mode === "nm"
                ? `${preyName} · ${rating} · ${hourPace(nmRate)}`
                : `${preyName} - ${rating} - ${pace(session.farmingEfficiency)}`}
            </p>
            <p className="mt-1 text-sm text-gold">
              {clock(preview.elapsedMinutes)} elapsed · {clock(preview.remainingMinutes)} left on the cap
            </p>
            <p className="mt-1 text-xs text-muted">{session.note}</p>
            <ClaimLines preview={preview} />
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
          </div>
        ) : (
          <div className="mt-3 flex min-h-0 flex-1 flex-col">
            <div className="flex gap-2">
              {(["exp", "nm"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setTab(mode);
                    setPick(null);
                  }}
                  className={`h-9 flex-1 border text-sm ${tab === mode ? "border-gold bg-gold text-navy" : "border-gold-dim text-ink"}`}
                >
                  {mode === "exp" ? "Prey" : "Notorious Monsters"}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-ink">
              {!zone
                ? refused
                  ? "Towns and instances can't hold a camp."
                  : campRefusal(screen, here.x, here.z)
                : onNm && nms.length === 0
                  ? NO_NM
                  : !onNm && groups.length === 0
                    ? "Nothing hunts here."
                    : `You are in ${spotById(zone).name}.`}
            </p>
            <button
              type="button"
              disabled={!selected}
              onClick={() => {
                if (selected) useGame.getState().startAfk(selected.id, onNm ? "nm" : "exp");
              }}
              className={`mt-3 h-11 w-full border border-gold bg-gold text-sm font-semibold text-navy ${selected ? "" : "opacity-40"}`}
            >
              Make camp
            </button>
            <p className="mt-4 text-xs uppercase tracking-wide text-muted">{onNm ? "Notorious Monsters" : "Prey"}</p>
            <ul className="mt-1 min-h-0 flex-1 overflow-y-auto">
              {onNm
                ? nms.map((row) => {
                    const outside = level < row.levelMin || level > row.levelMax;
                    const on = selected?.id === row.id;
                    return (
                      <li key={row.id} className="border-t border-gold-dim py-1">
                        <button
                          type="button"
                          onClick={() => setPick(row.id)}
                          className={`mt-1 w-full border px-2 py-2 text-left ${on ? "border-gold" : "border-transparent"}`}
                        >
                          <p className="text-sm text-ink">
                            {row.name}
                            {closestNm?.id === row.id ? <span className="text-gold"> · closest</span> : null}
                          </p>
                          <p className="text-xs text-muted">
                            levels {row.levelMin}–{row.levelMax} · {checkRating(level, row.level)}
                            {outside ? " · outside your level" : ""}
                          </p>
                          <p className="text-xs text-muted">{row.phName ? `PH: ${row.phName}` : "No PH: timed"}</p>
                        </button>
                      </li>
                    );
                  })
                : groups.map((group, index) => {
                const outside = level < group.levelMin || level > group.levelMax;
                const on = selected?.id === group.id;
                const showFamily = index === 0 || groups[index - 1]?.family !== group.family;
                return (
                  <li key={group.id} className="border-t border-gold-dim py-1">
                    {showFamily ? <p className="pt-1 text-xs uppercase tracking-wide text-muted">{group.family}</p> : null}
                    <button
                      type="button"
                      onClick={() => setPick(group.id)}
                      className={`mt-1 w-full border px-2 py-2 text-left ${on ? "border-gold" : "border-transparent"}`}
                    >
                      <p className="text-sm text-ink">
                        {group.name}
                        {closest?.id === group.id ? <span className="text-gold"> · closest</span> : null}
                      </p>
                      <p className="text-xs text-muted">
                        levels {group.levelMin}–{group.levelMax} · {checkRating(level, group.level)}
                        {outside ? " · outside your level" : ""}
                      </p>
                    </button>
                  </li>
                );
              })
              }
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function ClaimLines({ preview }: { preview: ReturnType<typeof previewAfk> }) {
  const rows = Object.entries(preview.items);
  const nmRows = Object.entries(preview.nmItems);
  if (!preview.nm) {
    return (
      <div className="mt-3 border border-gold-dim px-2 py-2 text-sm text-ink">
        <p>{preview.kills} kills · {preview.exp.toLocaleString()} experience</p>
        {preview.gil > 0 ? <p>{preview.gil.toLocaleString()} gil</p> : null}
        {preview.tabs > 0 ? <p>{preview.tabs} tabs</p> : null}
        {preview.crystals > 0 ? <p>{preview.crystals} fire crystals</p> : null}
        {preview.rankPoints > 0 ? <p>{preview.rankPoints} rank and conquest points</p> : null}
        {rows.length === 0 ? <p className="text-muted">No items kept.</p> : rows.map(([id, qty]) => (
          <p key={id}>{ITEMS[id]?.name ?? id} × {qty}</p>
        ))}
      </div>
    );
  }
  const filler = preview.fillerName || "filler";
  return (
    <div className="mt-3 border border-gold-dim px-2 py-2 text-sm text-ink">
      <p>{preview.phKills} {preview.placeholder ? "placeholder" : filler} kills · {preview.exp.toLocaleString()} experience</p>
      <p>{preview.nmPops} notorious {preview.nmPops === 1 ? "monster" : "monsters"} popped</p>
      <p>{preview.nmKills} notorious {preview.nmKills === 1 ? "monster" : "monsters"} defeated</p>
      {preview.gil > 0 ? <p>{preview.gil.toLocaleString()} gil</p> : null}
      {preview.crystals > 0 ? <p>{preview.crystals} fire crystals</p> : null}
      {preview.rankPoints > 0 ? <p>{preview.rankPoints} rank and conquest points</p> : null}
      {nmRows.length === 0 ? <p className="text-muted">No notorious drops.</p> : nmRows.map(([id, qty]) => (
        <p key={`nm-${id}`}>{ITEMS[id]?.name ?? id} × {qty}</p>
      ))}
      {rows.map(([id, qty]) => (
        <p key={id}>{ITEMS[id]?.name ?? id} × {qty}</p>
      ))}
    </div>
  );
}
