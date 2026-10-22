import { useRef, useState } from "react";
import { Backpack, Flag, Landmark, ScrollText, Sword } from "lucide-react";
import { addendumHold, countsDown, findAction, hotbarGroups, isCarrieTpMove, isRarabTpMove, markOf, rangedBar, type HotAction, type HotKind, type RangeBar } from "@/game/hotbar";
import { pactBlurb, pactByName, pactMp } from "@/game/smn";
import { FISH_OIL_BROTH, LEVEL } from "@/game/content";
import { expSegments } from "@/game/exp";
import { spellByName } from "@/game/spells";
import type { JobId } from "@/game/stats";
import type { Screen } from "@/game/store";
import { useGame } from "@/game/store";
import { PROTECT_DEF, SHELL_CUT } from "@/game/magic";

const KIND_COLOR: Record<HotKind, string> = {
  ability: "#e3c57a",
  spell: "#3d7dff",
  item: "#7dffa8",
  weaponskill: "#c47b3a",
  ranged: "#8ec8ef",
};

const TABS: { id: Screen; label: string; icon: typeof Sword }[] = [
  { id: "raids", label: "Raids", icon: Flag },
  { id: "equipment", label: "Equipment", icon: Backpack },
  { id: "battle", label: "Battle", icon: Sword },
  { id: "gambits", label: "Gambits", icon: ScrollText },
  { id: "town", label: "Town", icon: Landmark },
];

export function Dock() {
  const screen = useGame((s) => s.screen);
  const hotbar = useGame((s) => s.hotbar);
  const sheet = useGame((s) => s.sheet);
  const hp = useGame((s) => s.hp);
  const hpGift = useGame((s) => s.hpGift);
  const mp = useGame((s) => s.mp);
  const mainJob = useGame((s) => s.mainJob);
  const subJob = useGame((s) => s.subJob);
  const loadout = useGame((s) => s.loadout);
  const bow = rangedBar(mainJob, subJob, loadout.range);
  const tp = useGame((s) => s.tp);
  const buffs = useGame((s) => s.buffs);
  const manafont = buffs.some((buff) => buff.name === "Manafont");
  const setScreen = useGame((s) => s.setScreen);
  const exp = useGame((s) => s.exp);
  const jobLevels = useGame((s) => s.jobLevels);
  const setHotbar = useGame((s) => s.setHotbar);
  const recasts = useGame((s) => s.recasts);
  const actionLock = useGame((s) => s.actionLock);
  const abilityLock = useGame((s) => s.abilityLock);
  const [assigning, setAssigning] = useState<number | null>(null);

  function useSlot(index: number) {
    const action = findAction(hotbar[index]);
    if (!action) {
      setAssigning(index);
      return;
    }
    useGame.getState().useHotbar(index);
  }

  return (
    <>
      {screen === "battle" && assigning !== null && (
        <AssignList
          index={assigning}
          skillName={sheet.skillName}
          skill={sheet.skill}
          weaponName={sheet.weaponName}
          job={mainJob}
          sub={subJob}
          range={bow}
          onPick={(id) => {
            setHotbar(assigning, id);
            setAssigning(null);
          }}
          onClose={() => setAssigning(null)}
        />
      )}
      {screen === "battle" && (
        <div className="border-t border-[#3a3d46] bg-[#12141a]/95 px-1 py-1">
          <div className="flex items-center gap-1">
            <Orb
              label="HP"
              value={hp}
              max={sheet.hp + hpGift}
              tone="hp"
              protect={wardTier(buffs, "Protect")}
              shell={wardTier(buffs, "Shell")}
            />
            <div className="grid min-w-0 flex-1 grid-cols-6 gap-0.5">
              {hotbar.map((id, index) => {
                const action = findAction(id);
                const recastKey = action?.id.startsWith("pact:") ? action.id : action?.name;
                const own = action && recastKey && countsDown(action.kind) ? (recasts[recastKey] ?? 0) : 0;
                const lock = action?.kind === "ability" ? abilityLock : actionLock;
                const broke = action ? cannotPay(action.kind, action.name, mp, tp, manafont) : false;
                const sealed = action?.kind === "spell" ? addendumHold(action.name, buffs, mainJob, subJob) : null;
                const why = sealed ?? (broke ? (action?.kind === "weaponskill" ? "Not enough TP." : "Not enough MP.") : "");
                return (
                  <Slot
                    key={index}
                    id={id}
                    wait={Math.max(own, lock)}
                    dim={Boolean(why)}
                    why={why}
                    onUse={() => useSlot(index)}
                    onEdit={() => setAssigning(index)}
                  />
                );
              })}
            </div>
            <Orb label="MP" value={mp} max={sheet.mp} tone="mp" tp={tp} />
          </div>
        </div>
      )}
      <div className="safe-b bg-[#101216]">
        <nav className="grid grid-cols-5 border-t border-[#3a3d46]">
          {TABS.map((tab) => {
            const on = screen === tab.id;
            const Icon = tab.icon;
            const battle = tab.id === "battle";
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setAssigning(null);
                  setScreen(tab.id);
                }}
                className={`flex flex-col items-center justify-center gap-0.5 border-t-2 py-1.5 ${
                  on ? "border-gold text-gold" : "border-transparent text-muted"
                } ${battle ? "bg-[#1c2433]" : ""}`}
              >
                <Icon className={battle ? "size-6" : "size-5"} strokeWidth={1.75} />
                <span className="text-[10px] leading-none font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </nav>
        <ExpBar exp={exp} level={jobLevels[mainJob] ?? LEVEL} />
      </div>
    </>
  );
}

function ExpBar({ exp, level }: { exp: number; level: number }) {
  const { hold, held, fills } = expSegments(exp, level);
  const capped = level >= 75 && held >= hold;
  const label = capped ? "MAX" : `${((held / hold) * 100).toFixed(1)}%`;
  return (
    <div
      className="relative border-t border-[#3a3d46] bg-[#0a0c10] px-1 py-1"
      role="meter"
      aria-valuemin={0}
      aria-valuemax={hold}
      aria-valuenow={held}
      aria-label={capped ? `Experience capped at ${hold.toLocaleString()}` : `Experience ${held.toLocaleString()} of ${hold.toLocaleString()}`}
      title={capped ? `Level 75 holds ${hold.toLocaleString()} experience` : `${held.toLocaleString()} / ${hold.toLocaleString()}`}
    >
      <div className="grid grid-cols-10 gap-0.5">
        {fills.map((fill, i) => (
          <div key={i} className="relative h-3.5 overflow-hidden border border-[#3a3d46] bg-[#1c212c]">
            <div className="absolute inset-y-0 left-0 bg-gold" style={{ width: `${fill * 100}%` }} />
          </div>
        ))}
      </div>
      <p className="pointer-events-none absolute inset-0 grid place-items-center text-[10px] font-semibold tabular-nums text-ink" style={{ textShadow: "0 1px 1px #000" }}>
        {label}
      </p>
    </div>
  );
}

export function Soon({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="ffxi-frame max-w-sm p-5 text-center">
        <p className="font-display text-3xl leading-none text-gold">{title}</p>
        <p className="mt-2 text-sm text-muted">{text}</p>
      </div>
    </div>
  );
}

function AssignList({
  index,
  skillName,
  skill,
  weaponName,
  job,
  sub,
  range,
  onPick,
  onClose,
}: {
  index: number;
  skillName: string;
  skill: number;
  weaponName: string;
  job: JobId;
  sub: JobId | null;
  range: RangeBar | null;
  onPick: (id: string | null) => void;
  onClose: () => void;
}) {
  const avatarName = useGame((s) => s.pets.find((pet) => pet.id === "avatar")?.name ?? null);
  const broth = useGame((s) => s.loadout.ammo === FISH_OIL_BROTH);
  const charmed = useGame((s) => s.pets.some((pet) => pet.id === "charm"));
  const blueSet = useGame((s) => s.blueSet);
  const groups = hotbarGroups(skillName, skill, weaponName, job, sub, range, job === "BLU" ? blueSet : []).map((group) => {
    if (group.title === "Abilities") {
      return {
        ...group,
        actions: group.actions.filter((action) => {
          if (isCarrieTpMove(action.name)) return broth && !charmed;
          if (isRarabTpMove(action.name)) return charmed;
          return true;
        }),
      };
    }
    if (group.title !== "Blood Pacts" || !avatarName) return group;
    const actions = group.actions.filter((action) => pactByName(action.name)?.avatar === avatarName);
    return { ...group, actions, empty: `${avatarName} has no blood pact you can use.` };
  });
  return (
    <div className="mx-2 mb-1 max-h-[46vh] overflow-y-auto border border-gold bg-[#12141a] p-2">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs text-muted">Slot {index + 1}. Hold a filled slot to change it.</p>
        <div className="flex gap-1">
          <button type="button" onClick={() => onPick(null)} className="h-8 border border-gold-dim px-2 text-xs text-ink">
            Clear
          </button>
          <button type="button" onClick={onClose} className="h-8 border border-gold px-2 text-xs text-gold">
            Close
          </button>
        </div>
      </div>
      {groups.map((group) => (
        <div key={group.title} className="mb-2">
          <p className="font-display text-lg leading-none text-gold">{group.title}</p>
          {group.actions.length === 0 ? (
            <p className="mt-1 text-xs text-muted">{group.empty}</p>
          ) : group.title === "Blood Pacts" ? (
            <PactList actions={group.actions} onPick={onPick} />
          ) : (
            <ul className="mt-1 flex flex-col gap-1">
              {group.actions.map((action) => (
                <li key={action.id}>
                  <ActionPick action={action} onPick={onPick} />
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function ActionPick({ action, onPick, detail }: { action: HotAction; onPick: (id: string) => void; detail?: string }) {
  return (
    <button
      type="button"
      onClick={() => onPick(action.id)}
      className="flex h-9 w-full items-center gap-2 overflow-hidden border border-[#3a3d46] px-2 text-left"
    >
      <span className="grid size-6 shrink-0 place-items-center text-[10px] font-bold text-navy" style={{ background: KIND_COLOR[action.kind] }}>
        {markOf(action.name)}
      </span>
      <span className="shrink-0 text-sm leading-none text-ink">{action.label ?? action.name}</span>
      <span className="min-w-0 flex-1 truncate text-right text-[11px] text-muted">{detail ?? action.detail}</span>
    </button>
  );
}

function PactList({ actions, onPick }: { actions: HotAction[]; onPick: (id: string) => void }) {
  const rows: ({ kind: "head"; avatar: string } | { kind: "pact"; action: HotAction; detail: string })[] = [];
  let last = "";
  for (const action of actions) {
    const pact = pactByName(action.name);
    const avatar = pact?.avatar ?? "Avatar";
    if (avatar !== last) {
      rows.push({ kind: "head", avatar });
      last = avatar;
    }
    const detail = pact
      ? `Lv ${pact.level} · ${pact.kind === "ward" ? "Ward" : "Rage"} · ${pactMp(pact, LEVEL)} MP. ${pactBlurb(pact)}`
      : action.detail;
    rows.push({ kind: "pact", action, detail });
  }
  return (
    <ul className="mt-1 flex flex-col gap-1">
      {rows.map((row) =>
        row.kind === "head" ? (
          <li key={`avatar:${row.avatar}`} className="mt-2 border-b border-gold-dim/40 pb-0.5 first:mt-1">
            <p className="text-xs font-semibold tracking-wide text-gold">{row.avatar}</p>
          </li>
        ) : (
          <li key={row.action.id}>
            <ActionPick action={row.action} onPick={onPick} detail={row.detail} />
          </li>
        ),
      )}
    </ul>
  );
}

function recastLabel(seconds: number): string {
  const left = Math.max(0, Math.ceil(seconds));
  if (left < 60) return String(left);
  const m = Math.floor(left / 60);
  const s = left % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function LockFace({ seconds }: { seconds: number }) {
  return (
    <span className="absolute inset-0 grid place-items-center bg-[#101216]/85 text-[9px] font-bold tabular-nums text-gold sm:text-[10px]">
      {recastLabel(seconds)}
    </span>
  );
}

/** Gray against the listed MP, not a Conserve MP roll. Manafont pays nothing. Weapon skills need 1000 TP. */
function cannotPay(kind: HotKind, name: string, mp: number, tp: number, manafont: boolean): boolean {
  if (kind === "spell") {
    if (manafont) return false;
    return mp < (spellByName(name)?.mp ?? 0);
  }
  if (kind === "weaponskill") return tp < 1000;
  if (kind === "ability") {
    const pact = pactByName(name);
    if (!pact) return false;
    if (manafont && (name === "Zantetsuken" || name === "Perfect Defense")) return false;
    return mp < pactMp(pact, LEVEL);
  }
  return false;
}

function Slot({ id, wait, dim, why = "", onUse, onEdit }: { id: string | null; wait: number; dim: boolean; why?: string; onUse: () => void; onEdit: () => void }) {
  const action = findAction(id);
  const timer = useRef<number | null>(null);
  const held = useRef(false);

  function clearTimer() {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }

  const note = why ? ` ${why}` : "";

  return (
    <button
      type="button"
      title={action ? `${action.name}.${note} Hold to change.` : "Set this slot"}
      onContextMenu={(e) => {
        e.preventDefault();
        onEdit();
      }}
      onPointerDown={() => {
        held.current = false;
        clearTimer();
        timer.current = window.setTimeout(() => {
          held.current = true;
          onEdit();
        }, 420);
      }}
      onPointerUp={() => {
        clearTimer();
        if (!held.current) onUse();
      }}
      onPointerCancel={clearTimer}
      className={`grid aspect-square place-items-center border bg-[#1a1e27] ${wait > 0 ? "border-[#6d7380]" : "border-[#3a3d46]"}`}
    >
      {action ? (
        <span
          className="relative grid size-[70%] place-items-center text-[10px] font-bold leading-none text-navy sm:text-xs"
          style={{
            background: KIND_COLOR[action.kind],
            filter: dim ? "grayscale(1) brightness(0.45)" : undefined,
          }}
        >
          {markOf(action.name)}
          {wait > 0 && <LockFace seconds={wait} />}
        </span>
      ) : (
        <span className="relative grid size-[70%] place-items-center text-lg leading-none text-[#6d7380]">
          +
          {wait > 0 && <LockFace seconds={wait} />}
        </span>
      )}
    </button>
  );
}

function Orb({
  label,
  value,
  max,
  tone,
  tp,
  protect = 0,
  shell = 0,
}: {
  label: string;
  value: number;
  max: number;
  tone: "hp" | "mp";
  tp?: number;
  protect?: number;
  shell?: number;
}) {
  const pct = max <= 0 ? 0 : Math.max(0, Math.min(100, (Math.min(value, max) / max) * 100));
  const shown = max <= 0 ? 0 : Math.round(pct);
  const fill = tone === "hp" ? "#d24b4b" : "#3d7dff";
  const deep = tone === "hp" ? "#4a1518" : "#10244a";
  const gloss = tone === "hp" ? "#f3b4b0" : "#c5d8ff";
  const ward = tone === "hp" ? ` Protect ${protect === 0 ? "none" : protect}. Shell ${shell === 0 ? "none" : shell}.` : "";
  return (
    <div className="relative size-[4.4rem] shrink-0 sm:size-[5.25rem]">
      {tp !== undefined && <TpRing tp={tp} />}
      {tone === "hp" && <WardRing protect={protect} shell={shell} />}
      <div
        className="absolute inset-[7px] overflow-hidden rounded-full border-2 border-[#1a120c]"
        style={{ background: deep }}
      >
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: `${pct}%`,
            background: `linear-gradient(to top, ${deep}, ${fill} 46%, ${gloss})`,
            transition: "height 180ms linear",
          }}
        >
          <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: gloss, opacity: 0.9 }} />
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(circle at 34% 28%, rgba(255,255,255,0.28), transparent 46%)" }}
        />
        <div className="relative flex h-full flex-col items-center justify-center" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.9)" }}>
          <span className="text-[10px] leading-none font-bold text-white sm:text-xs">{shown}%</span>
          <span className="text-[11px] leading-tight font-semibold text-white tabular-nums sm:text-sm">{value}</span>
          <span className="sr-only">{label}.{ward}</span>
        </div>
      </div>
    </div>
  );
}

/** Ten bars around the HP orb. Left is Protect, right is Shell, both counted down from the top. */
function WardRing({ protect, shell }: { protect: number; shell: number }) {
  const size = 84;
  const r = 36;
  const c = 2 * Math.PI * r;
  const gap = 5;
  const seg = (c - gap * 10) / 10;
  const cx = size / 2;
  const on = [
    shell >= 1, shell >= 2, shell >= 3, shell >= 4, shell >= 5,
    protect >= 5, protect >= 4, protect >= 3, protect >= 2, protect >= 1,
  ];
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-[-6px] size-[calc(100%+12px)]" aria-hidden>
      {on.map((lit, i) => {
        const rot = -90 + ((gap / 2 + i * (seg + gap)) * 360) / c;
        const pale = i < 5 ? "#b7e3a8" : "#a9d4f2";
        return (
          <g key={i} transform={`rotate(${rot} ${cx} ${cx})`}>
            <circle
              cx={cx}
              cy={cx}
              r={r}
              fill="none"
              stroke={lit ? pale : "#3a3d46"}
              strokeWidth="3.5"
              strokeDasharray={`${seg} ${c - seg}`}
            />
          </g>
        );
      })}
    </svg>
  );
}

function wardTier(buffs: { name: string; tier?: number; power?: number }[], name: "Protect" | "Shell"): number {
  const buff = buffs.find((row) => row.name === name);
  if (!buff) return 0;
  const tier = buff.tier ?? 0;
  if (tier >= 1 && tier <= 5) return Math.floor(tier);
  const table = name === "Protect" ? PROTECT_DEF : SHELL_CUT;
  let found = 0;
  for (const step of [1, 2, 3, 4, 5] as const) {
    if ((buff.power ?? 0) >= table[step]) found = step;
  }
  return found;
}

/** Three arcs. Each one is 1000 TP, around the outside of the MP orb. */
function TpRing({ tp }: { tp: number }) {
  const size = 84;
  const r = 36;
  const c = 2 * Math.PI * r;
  const gap = 12;
  const seg = (c - gap * 3) / 3;
  const cx = size / 2;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-[-6px] size-[calc(100%+12px)]" aria-hidden>
      {[0, 1, 2].map((i) => {
        const frac = Math.max(0, Math.min(1, (tp - i * 1000) / 1000));
        const rot = -90 + (i * (seg + gap) * 360) / c;
        return (
          <g key={i} transform={`rotate(${rot} ${cx} ${cx})`}>
            <circle
              cx={cx}
              cy={cx}
              r={r}
              fill="none"
              stroke="#3a3d46"
              strokeWidth="3.5"
              strokeDasharray={`${seg} ${c - seg}`}
            />
            {frac > 0 && (
              <circle
                cx={cx}
                cy={cx}
                r={r}
                fill="none"
                stroke="#f4ecd4"
                strokeWidth="3.5"
                strokeDasharray={`${seg * frac} ${c}`}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
