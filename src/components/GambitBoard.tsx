import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  GAMBIT_HP_PCTS,
  GAMBIT_MEMBER,
  GAMBIT_READY_CHAINS,
  GAMBIT_SLOT_COUNT,
  GAMBIT_SPELL_NAMES,
  blankBoard,
  blankSlot,
  gambitActionGroups,
  gambitBuffChoices,
  gambitDebuffChoices,
  type GambitSlot,
} from "@/game/gambits";
import { TRUSTS, trustActionGroups, trustById, trustGearOf, trustKit } from "@/game/party";
import { LEVEL } from "@/game/content";
import { rangedBar } from "@/game/hotbar";
import { subjobLevel } from "@/game/jobs";
import { spellsKnown } from "@/game/spells";
import { useGame } from "@/game/store";

const field = "h-11 w-full min-w-0 border border-gold-dim bg-navy px-1.5 text-xs text-ink";

const HP_ROW = 36;

function targetLine(slot: GambitSlot) {
  if (slot.target === "self") return "Self";
  if (slot.target === "ally-any") return "Ally: Any";
  if (slot.target.startsWith("ally:")) {
    const id = slot.target.slice(5);
    const label = id === "player" ? "Xanosuke" : trustById(id)?.name ?? id;
    return `Ally: ${label}`;
  }
  if (slot.target === "foe") return "Foe: current target";
  if (slot.target === "foe-claimed") return "Foe: Claimed";
  if (slot.target === "foe-2") return "Foe: 2+";
  if (slot.target === "foe-hp") return `Foe: HP < ${slot.hpPct ?? 50}%`;
  if (slot.target === "foe-closest") return "Foe: Closest";
  return "—";
}

function conditionLine(slot: GambitSlot) {
  if (slot.condition === "nothing") return "Nothing";
  if (slot.condition === "ally-hp") return `Ally: HP < ${slot.hpPct ?? 50}%`;
  if (slot.condition === "ally-hp-over") return `Ally: HP > ${slot.hpPct ?? 50}%`;
  if (slot.condition === "ally-mp-under") return `Ally: MP < ${slot.hpPct ?? 50}%`;
  if (slot.condition === "ally-mp-over") return `Ally: MP > ${slot.hpPct ?? 50}%`;
  if (slot.condition === "self-mp-under") return `Self: MP < ${slot.hpPct ?? 50}%`;
  if (slot.condition === "self-mp-over") return `Self: MP > ${slot.hpPct ?? 50}%`;
  if (slot.condition === "self-buff") return slot.buff ? `Self: Buff Missing: ${slot.buff}` : "Self: Buff Missing";
  if (slot.condition === "ally-buff") return slot.buff ? `Ally: Buff Missing: ${slot.buff}` : "Ally: Buff Missing";
  if (slot.condition === "ally-tp-over") return "Ally: TP > 1000";
  if (slot.condition === "foe-debuff") return slot.buff ? `Enemy: Debuff Missing: ${slot.buff}` : "Enemy: Debuff Missing";
  if (slot.condition === "foe-hp-under") return `Enemy: HP < ${slot.hpPct ?? 50}%`;
  if (slot.condition === "foe-hp-over") return `Enemy: HP > ${slot.hpPct ?? 50}%`;
  if (slot.condition === "ko") return "KO";
  if (slot.condition === "tp-1000") return "TP at least 1000";
  if (slot.condition === "tp-over") return "TP > 1000";
  if (slot.condition === "tp-under") return "TP < 1000";
  if (slot.condition === "ready") return "Ability ready";
  if (slot.condition === "sc-light") return "Skill chain: Light";
  if (slot.condition === "sc-ready") return slot.buff ? `Skillchain ready: ${slot.buff}` : "Skillchain ready";
  return "—";
}

function targetMenu(target: GambitSlot["target"]) {
  if (target === "ally-any" || target.startsWith("ally:")) return "ally";
  if (target === "foe-claimed" || target === "foe-2" || target === "foe-hp" || target === "foe-closest") return "foe-menu";
  return target;
}

function percentCondition(condition: GambitSlot["condition"]) {
  return condition === "ally-hp" || condition === "ally-hp-over" || condition === "ally-mp-under" || condition === "ally-mp-over" || condition === "self-mp-under" || condition === "self-mp-over" || condition === "foe-hp-under" || condition === "foe-hp-over";
}

function mpCondition(condition: GambitSlot["condition"]) {
  return condition === "ally-mp-under" || condition === "ally-mp-over" || condition === "self-mp-under" || condition === "self-mp-over";
}

function conditionMenu(condition: GambitSlot["condition"]) {
  if (condition === "self-buff" || condition === "self-mp-under" || condition === "self-mp-over") return "self";
  if (condition === "foe-hp-under" || condition === "foe-hp-over" || condition === "foe-debuff") return "enemy";
  if (percentCondition(condition) || condition === "ally-buff" || condition === "ally-tp-over") return "ally";
  return condition;
}

function HpWheel({ value, onChange, label }: { value: number; onChange: (next: number) => void; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const skip = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const index = Math.max(0, GAMBIT_HP_PCTS.indexOf(value as (typeof GAMBIT_HP_PCTS)[number]));
    const top = index * HP_ROW;
    if (Math.abs(el.scrollTop - top) < 2) return;
    skip.current = true;
    el.scrollTop = top;
    requestAnimationFrame(() => {
      skip.current = false;
    });
  }, [value]);
  return (
    <div className="relative mt-1 h-[108px] overflow-hidden rounded-md border border-gold-dim bg-navy">
      <div className="pointer-events-none absolute inset-x-0 top-9 z-10 h-9 border-y border-gold/70" aria-hidden />
      <div
        ref={ref}
        role="listbox"
        aria-label={label}
        onScroll={(event) => {
          if (skip.current) return;
          const index = Math.round(event.currentTarget.scrollTop / HP_ROW);
          const next = GAMBIT_HP_PCTS[Math.max(0, Math.min(GAMBIT_HP_PCTS.length - 1, index))] ?? 50;
          if (next !== value) onChange(next);
        }}
        className="h-full snap-y snap-mandatory overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div style={{ height: HP_ROW }} />
        {GAMBIT_HP_PCTS.map((pct) => (
          <button
            key={pct}
            type="button"
            role="option"
            aria-selected={pct === value}
            onClick={() => onChange(pct)}
            className={`flex h-9 w-full snap-center items-center justify-center font-display text-lg leading-none ${pct === value ? "text-gold" : "text-muted"}`}
          >
            {pct}%
          </button>
        ))}
        <div style={{ height: HP_ROW }} />
      </div>
    </div>
  );
}

const TONE = {
  gold: { text: "text-gold", border: "border-gold", bar: "bg-gold" },
  meadow: { text: "text-meadow", border: "border-meadow", bar: "bg-meadow" },
  sky: { text: "text-sky", border: "border-sky", bar: "bg-sky" },
  bronze: { text: "text-bronze", border: "border-bronze", bar: "bg-bronze" },
  hold: { text: "text-gold-dim", border: "border-gold-dim", bar: "bg-gold-dim" },
  muted: { text: "text-muted", border: "border-muted/40", bar: "bg-muted" },
} as const;

type ToneName = keyof typeof TONE;

function emptySlot(slot: GambitSlot) {
  return slot.target === "" && slot.condition === "" && slot.action === "";
}

function completeSlot(slot: GambitSlot) {
  if (slot.target === "" || slot.condition === "" || slot.action === "") return false;
  if (slot.condition === "self-buff" && !slot.buff) return false;
  if (slot.condition === "ally-buff" && !slot.buff) return false;
  if (slot.condition === "foe-debuff" && !slot.buff) return false;
  if (slot.condition === "sc-ready" && !(GAMBIT_READY_CHAINS as readonly string[]).includes(slot.buff ?? "")) return false;
  return true;
}

function toneFor(action: string, live: boolean): ToneName {
  if (!live) return "muted";
  if (action === "hold") return "hold";
  if (action === "ranged") return "gold";
  if (action === "spell:raise" || action.startsWith("spell:cure")) return "meadow";
  if (action.startsWith("spell:")) return "sky";
  if (action.startsWith("ws:")) return "gold";
  if (action.startsWith("ability:")) return "bronze";
  return "muted";
}

function actionName(id: string, groups: { actions: { id: string; label: string }[] }[]) {
  if (!id) return "—";
  for (const group of groups) {
    const found = group.actions.find((action) => action.id === id);
    if (found) return found.label.replace(" (not learned)", "");
  }
  return id;
}

function visibleRows(slots: GambitSlot[], openIndex: number | null) {
  return slots
    .map((slot, index) => ({ slot, index }))
    .filter((row) => !emptySlot(row.slot) || row.index === openIndex);
}

/** Keep filled rows, and the open blank draft, packed to the front. Scan order follows this list. */
function packRows(slots: GambitSlot[], openIndex: number | null, from: number | null, to: number | null) {
  const rows = visibleRows(slots, openIndex).map((row) => ({ slot: { ...row.slot }, index: row.index }));
  if (from != null && to != null) {
    const fromPos = rows.findIndex((row) => row.index === from);
    const toPos = rows.findIndex((row) => row.index === to);
    if (fromPos >= 0 && toPos >= 0 && fromPos !== toPos) {
      const [moved] = rows.splice(fromPos, 1);
      rows.splice(toPos, 0, moved);
    }
  }
  const next = Array.from({ length: GAMBIT_SLOT_COUNT }, () => blankSlot());
  rows.forEach((row, index) => {
    next[index] = row.slot;
  });
  const openAt = openIndex == null ? -1 : rows.findIndex((row) => row.index === openIndex);
  return { slots: next, openIndex: openAt < 0 ? null : openAt };
}

function sameSlots(a: GambitSlot[], b: GambitSlot[]) {
  return a.every(
    (slot, index) =>
      slot.target === b[index]?.target &&
      slot.condition === b[index]?.condition &&
      slot.action === b[index]?.action &&
      (slot.hpPct ?? null) === (b[index]?.hpPct ?? null) &&
      (slot.buff ?? "") === (b[index]?.buff ?? ""),
  );
}

const FALLBACK_BOARD = blankBoard();

function GambitEditor({ memberId, onBack }: { memberId: string; onBack: () => void }) {
  const stored = useGame((s) => s.gambits[memberId]);
  const board = stored ?? FALLBACK_BOARD;
  const mainJob = useGame((s) => s.mainJob);
  const subJob = useGame((s) => s.subJob);
  const sheet = useGame((s) => s.sheet);
  const loadout = useGame((s) => s.loadout);
  const party = useGame((s) => s.party);
  const jobLevels = useGame((s) => s.jobLevels);
  const setEnabled = useGame((s) => s.setGambitEnabled);
  const setSlot = useGame((s) => s.setGambitSlot);
  const setSlots = useGame((s) => s.setGambitSlots);
  const [open, setOpen] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const openRef = useRef(open);
  openRef.current = open;
  const drag = useRef<{ from: number; over: number; x: number; y: number; moved: boolean } | null>(null);
  const profile = trustById(memberId);
  const name = profile?.name ?? "Xanosuke";
  const trustSub = profile ? party.subs[profile.id] ?? null : null;

  const spellLevels = {
    [mainJob]: LEVEL,
    ...(subJob && subJob !== mainJob ? { [subJob]: subjobLevel(LEVEL) } : {}),
  };
  const learned = new Set(spellsKnown(spellLevels, undefined, mainJob).map((spell) => spell.name));
  const spellNames = learned.has("Reprisal") ? [...GAMBIT_SPELL_NAMES, "Reprisal"] : [...GAMBIT_SPELL_NAMES];
  const groups = profile
    ? trustActionGroups(profile.id, trustSub, jobLevels, trustGearOf(party, profile.id))
    : gambitActionGroups({
        job: mainJob,
        sub: subJob,
        skillName: sheet.skillName,
        skill: sheet.skill,
        weaponName: sheet.weaponName,
        range: rangedBar(mainJob, subJob, loadout.range),
        spellNames,
      });
  const known = new Set(groups.flatMap((group) => group.actions.map((action) => action.id)));
  const buffChoices = profile
    ? gambitBuffChoices(profile.job, trustSub, trustKit(profile.id, trustSub, jobLevels).levels)
    : gambitBuffChoices(mainJob, subJob);
  const debuffChoices = profile
    ? gambitDebuffChoices(profile.job, trustSub, trustKit(profile.id, trustSub, jobLevels).levels)
    : gambitDebuffChoices(mainJob, subJob);
  const rows = visibleRows(board.slots, open);
  const full = board.slots.every((slot) => !emptySlot(slot));

  function writePacked(next: GambitSlot[], openIndex: number | null) {
    if (!sameSlots(next, board.slots)) setSlots(memberId, next);
    setOpen(openIndex);
  }

  function add() {
    if (open != null && emptySlot(board.slots[open] ?? blankSlot())) return;
    const packed = packRows(board.slots, null, null, null);
    const at = packed.slots.findIndex(emptySlot);
    if (at < 0) return;
    writePacked(packed.slots, at);
  }

  function remove(index: number) {
    const cleared = board.slots.map((slot, i) => (i === index ? blankSlot() : { ...slot }));
    const packed = packRows(cleared, null, null, null);
    writePacked(packed.slots, null);
  }

  function toggle(index: number) {
    setOpen((current) => (current === index ? null : index));
  }

  function gripDown(event: ReactPointerEvent<HTMLDivElement>, index: number) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { from: index, over: index, x: event.clientX, y: event.clientY, moved: false };
    setDragging(index);
    setDragOver(index);
  }

  function gripMove(event: ReactPointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current) return;
    if (!current.moved && Math.hypot(event.clientX - current.x, event.clientY - current.y) > 8) current.moved = true;
    const hit = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-gambit-index]");
    const over = hit ? Number((hit as HTMLElement).dataset.gambitIndex) : current.over;
    if (!Number.isInteger(over)) return;
    current.over = over;
    setDragOver((prev) => (prev === over ? prev : over));
  }

  function gripUp() {
    const current = drag.current;
    drag.current = null;
    setDragging(null);
    setDragOver(null);
    if (!current) return;
    if (!current.moved) {
      toggle(current.from);
      return;
    }
    if (current.from === current.over) return;
    const slots = useGame.getState().gambits[memberId]?.slots ?? board.slots;
    const packed = packRows(slots, openRef.current, current.from, current.over);
    writePacked(packed.slots, packed.openIndex);
  }

  return (
    <section className="mx-auto flex h-full min-h-0 w-full max-w-lg flex-col px-3 pt-32 pb-2 sm:max-w-xl sm:pt-40">
      <div className="flex min-h-0 flex-1 flex-col">
      <div className="ffxi-frame flex max-h-full min-h-0 flex-col overflow-hidden" style={{ background: "var(--color-navy)" }}>
        <div className="shrink-0 px-4 pt-4 pb-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <button type="button" onClick={onBack} className="mb-1 flex h-11 items-center text-left text-sm text-gold">
                Party
              </button>
              <h1 className="font-display text-4xl leading-none text-gold">Gambits</h1>
              <div className="mt-1.5 flex w-28 items-center gap-1.5 text-gold" aria-hidden>
                <span className="h-px flex-1 bg-gold" />
                <svg viewBox="0 0 28 10" className="h-2.5 w-7 shrink-0 fill-current">
                  <path d="M6 3.4 7.2 5 6 6.6 4.8 5Z" />
                  <path d="M14 0.6 16.1 5 14 9.4 11.9 5Z" />
                  <path d="M22 3.4 23.2 5 22 6.6 20.8 5Z" />
                </svg>
                <span className="h-px flex-1 bg-gold" />
              </div>
              <p className="mt-1 truncate font-display text-2xl leading-none text-ink">{name}</p>
            </div>
            <button
              type="button"
              aria-pressed={board.on}
              onClick={() => setEnabled(memberId, !board.on)}
              className="flex h-11 shrink-0 items-center gap-2.5 rounded-full border border-gold bg-navy pr-1.5 pl-3.5"
            >
              <span className="font-display text-lg leading-none text-gold">{board.on ? "On" : "Off"}</span>
              <span className={`size-7 rounded-full border border-gold ${board.on ? "bg-gold" : "bg-navy"}`} />
            </button>
          </div>
          <p className="mt-3 text-sm text-ink">Rows run from the top. The first match fires.</p>
          {profile && !party.summoned.includes(profile.id) && (
            <p className="mt-1 text-xs text-muted">This board runs only while {profile.name} is in the party.</p>
          )}
        </div>
        <div className="min-h-0 overflow-y-auto px-3 pb-3">
          <ol className="flex select-none flex-col gap-2">
            {rows.map(({ slot, index }, position) => {
              const live = board.on && completeSlot(slot);
              const tone = TONE[toneFor(slot.action, live)];
              const orphan = slot.action !== "" && !known.has(slot.action);
              const left = emptySlot(slot)
                ? "— · —"
                : `${targetLine(slot)} · ${conditionLine(slot)}`;
              const action = actionName(slot.action, groups);
              const expanded = open === index;
              return (
                <li
                  key={index}
                  data-gambit-index={index}
                  className={`rounded-md border ${tone.border} ${dragging === index ? "opacity-60" : ""} ${dragOver === index && dragging != null && dragging !== index ? "ring-1 ring-gold" : ""}`}
                >
                  <div className="flex items-stretch">
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={`Reorder gambit ${position + 1}`}
                      onPointerDown={(event) => gripDown(event, index)}
                      onPointerMove={gripMove}
                      onPointerUp={gripUp}
                      onPointerCancel={gripUp}
                      onKeyDown={(event) => {
                        if (event.key !== "Enter" && event.key !== " ") return;
                        event.preventDefault();
                        toggle(index);
                      }}
                      className={`flex touch-none items-center px-2.5 ${tone.text} cursor-grab`}
                    >
                      <span className="grid grid-cols-2 gap-x-1 gap-y-0.5" aria-hidden>
                        {Array.from({ length: 6 }, (_, dot) => (
                          <span key={dot} className="size-1.5 rounded-full bg-current" />
                        ))}
                      </span>
                    </div>
                    <span className={`my-2 w-0.5 shrink-0 ${tone.bar}`} aria-hidden />
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() => toggle(index)}
                      className="flex min-h-12 min-w-0 flex-1 items-center gap-2 px-2 py-2 text-left"
                    >
                      <span className={`w-6 shrink-0 text-center font-display text-2xl leading-none ${tone.text}`}>{position + 1}</span>
                      <span className={`flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-3 font-display text-sm leading-snug sm:text-base ${live ? "text-ink" : "text-muted"}`}>
                        <span>{left}</span>
                        <span className="ml-auto whitespace-nowrap">
                          <span className="text-muted">→ </span>
                          <span className={tone.text}>{action}</span>
                        </span>
                      </span>
                    </button>
                  </div>
                  {expanded && (
                    <div className="border-t border-gold-dim/50 px-2 pt-2 pb-2">
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="grid min-w-0 content-start gap-1">
                          <label className="grid min-w-0 gap-0.5">
                            <span className="text-xs text-muted">Target</span>
                            <select
                              className={field}
                              value={targetMenu(slot.target)}
                              aria-label={`Gambit ${position + 1} target`}
                              onChange={(event) => {
                                const value = event.target.value;
                                if (value === "ally") setSlot(memberId, index, { target: "ally-any" });
                                else if (value === "foe-menu") {
                                  const keep = slot.target === "foe-claimed" || slot.target === "foe-2" || slot.target === "foe-hp" || slot.target === "foe-closest" ? slot.target : "foe-claimed";
                                  setSlot(memberId, index, { target: keep, ...(keep === "foe-hp" ? { hpPct: slot.hpPct ?? 50 } : {}) });
                                } else setSlot(memberId, index, { target: value as GambitSlot["target"] });
                              }}
                            >
                              <option value="">—</option>
                              <option value="self">Self</option>
                              <option value="ally">Ally:</option>
                              <option value="foe">Foe current target</option>
                              <option value="foe-menu">Foe:</option>
                            </select>
                          </label>
                          {targetMenu(slot.target) === "ally" && (
                            <label className="grid min-w-0 gap-0.5">
                              <span className="sr-only">Ally target</span>
                              <select
                                className={field}
                                value={slot.target}
                                aria-label={`Gambit ${position + 1} ally`}
                                onChange={(event) => setSlot(memberId, index, { target: event.target.value as GambitSlot["target"] })}
                              >
                                <option value="ally-any">Any</option>
                                <option value="ally:player">Xanosuke</option>
                                {party.summoned.map((id) => {
                                  const trust = trustById(id);
                                  return trust ? <option key={trust.id} value={`ally:${trust.id}`}>{trust.name}</option> : null;
                                })}
                                {slot.target.startsWith("ally:") && slot.target !== "ally:player" && !party.summoned.some((id) => slot.target === `ally:${id}`) && (
                                  <option value={slot.target}>{trustById(slot.target.slice(5))?.name ?? slot.target.slice(5)}</option>
                                )}
                              </select>
                            </label>
                          )}
                          {targetMenu(slot.target) === "foe-menu" && (
                            <label className="grid min-w-0 gap-0.5">
                              <span className="sr-only">Foe target</span>
                              <select
                                className={field}
                                value={slot.target}
                                aria-label={`Gambit ${position + 1} foe`}
                                onChange={(event) => {
                                  const target = event.target.value as GambitSlot["target"];
                                  setSlot(memberId, index, { target, ...(target === "foe-hp" ? { hpPct: slot.hpPct ?? 50 } : {}) });
                                }}
                              >
                                <option value="foe-claimed">Claimed</option>
                                <option value="foe-2">2+</option>
                                <option value="foe-hp">{"HP < %"}</option>
                                <option value="foe-closest">Closest</option>
                              </select>
                            </label>
                          )}
                        </div>
                        <div className="grid min-w-0 content-start gap-1">
                          <label className="grid min-w-0 gap-0.5">
                            <span className="text-xs text-muted">Condition</span>
                            <select
                              className={field}
                              value={conditionMenu(slot.condition)}
                              aria-label={`Gambit ${position + 1} condition`}
                              onChange={(event) => {
                                const value = event.target.value;
                                if (value === "self") {
                                  const buff = slot.buff && buffChoices.some((row) => row.id === slot.buff) ? slot.buff : buffChoices[0]?.id ?? "";
                                  setSlot(memberId, index, { condition: "self-buff", buff });
                                } else if (value === "ally") setSlot(memberId, index, { condition: "ally-hp", hpPct: slot.hpPct ?? 50 });
                                else if (value === "enemy") {
                                  const buff = slot.buff && debuffChoices.some((row) => row.id === slot.buff) ? slot.buff : debuffChoices[0]?.id ?? "";
                                  setSlot(memberId, index, { condition: "foe-debuff", buff });
                                } else if (value === "sc-ready") {
                                  const buff = slot.buff && (GAMBIT_READY_CHAINS as readonly string[]).includes(slot.buff) ? slot.buff : GAMBIT_READY_CHAINS[0] ?? "";
                                  setSlot(memberId, index, { condition: "sc-ready", buff });
                                } else setSlot(memberId, index, { condition: value as GambitSlot["condition"] });
                              }}
                            >
                              <option value="">—</option>
                              <option value="nothing">Nothing</option>
                              <option value="self">Self:</option>
                              <option value="ally">Ally:</option>
                              <option value="enemy">Enemy:</option>
                              <option value="ko">Status = KO</option>
                              <option value="tp-1000">TP at least 1000</option>
                              <option value="tp-over">{"TP > 1000"}</option>
                              <option value="tp-under">{"TP < 1000"}</option>
                              <option value="ready">Ability ready</option>
                              <option value="sc-light">Skill chain: Light</option>
                              <option value="sc-ready">Skillchain ready:</option>
                            </select>
                          </label>
                          {conditionMenu(slot.condition) === "ally" && (
                            <label className="grid min-w-0 gap-0.5">
                              <span className="sr-only">Ally condition</span>
                              <select
                                className={field}
                                value={slot.condition}
                                aria-label={`Gambit ${position + 1} ally condition`}
                                onChange={(event) => {
                                  const condition = event.target.value as GambitSlot["condition"];
                                  if (percentCondition(condition)) setSlot(memberId, index, { condition, hpPct: slot.hpPct ?? 50 });
                                  else if (condition === "ally-buff") setSlot(memberId, index, { condition, buff: slot.buff && buffChoices.some((row) => row.id === slot.buff) ? slot.buff : buffChoices[0]?.id ?? "" });
                                  else setSlot(memberId, index, { condition });
                                }}
                              >
                                <option value="ally-hp">{"HP < %"}</option>
                                <option value="ally-hp-over">{"HP > %"}</option>
                                <option value="ally-mp-under">{"MP < %"}</option>
                                <option value="ally-mp-over">{"MP > %"}</option>
                                <option value="ally-buff">Buff Missing</option>
                                <option value="ally-tp-over">{"TP > 1000"}</option>
                              </select>
                            </label>
                          )}
                          {conditionMenu(slot.condition) === "self" && (
                            <label className="grid min-w-0 gap-0.5">
                              <span className="sr-only">Self condition</span>
                              <select
                                className={field}
                                value={slot.condition}
                                aria-label={`Gambit ${position + 1} self condition`}
                                onChange={(event) => {
                                  const condition = event.target.value as GambitSlot["condition"];
                                  if (condition === "self-mp-under" || condition === "self-mp-over") {
                                    setSlot(memberId, index, { condition, hpPct: slot.hpPct ?? 50 });
                                  } else {
                                    const buff = slot.buff && buffChoices.some((row) => row.id === slot.buff) ? slot.buff : buffChoices[0]?.id ?? "";
                                    setSlot(memberId, index, { condition, buff });
                                  }
                                }}
                              >
                                <option value="self-buff">Buff Missing</option>
                                <option value="self-mp-under">{"MP < %"}</option>
                                <option value="self-mp-over">{"MP > %"}</option>
                              </select>
                            </label>
                          )}
                          {(slot.condition === "self-buff" || slot.condition === "ally-buff") && (
                            <label className="grid min-w-0 gap-0.5">
                              <span className="sr-only">Missing buff</span>
                              <select
                                className={field}
                                value={slot.buff ?? ""}
                                aria-label={`Gambit ${position + 1} buff`}
                                onChange={(event) => setSlot(memberId, index, { buff: event.target.value })}
                              >
                                <option value="">—</option>
                                {slot.buff && !buffChoices.some((row) => row.id === slot.buff) && <option value={slot.buff}>{slot.buff}</option>}
                                {buffChoices.map((choice) => (
                                  <option key={choice.id} value={choice.id}>{choice.label}</option>
                                ))}
                              </select>
                            </label>
                          )}
                          {conditionMenu(slot.condition) === "enemy" && (
                            <label className="grid min-w-0 gap-0.5">
                              <span className="sr-only">Enemy condition</span>
                              <select
                                className={field}
                                value={slot.condition}
                                aria-label={`Gambit ${position + 1} enemy condition`}
                                onChange={(event) => {
                                  const condition = event.target.value as GambitSlot["condition"];
                                  if (condition === "foe-hp-under" || condition === "foe-hp-over") {
                                    setSlot(memberId, index, { condition, hpPct: slot.hpPct ?? 50 });
                                  } else {
                                    const buff = slot.buff && debuffChoices.some((row) => row.id === slot.buff) ? slot.buff : debuffChoices[0]?.id ?? "";
                                    setSlot(memberId, index, { condition, buff });
                                  }
                                }}
                              >
                                <option value="foe-debuff">Debuff Missing</option>
                                <option value="foe-hp-under">{"HP < %"}</option>
                                <option value="foe-hp-over">{"HP > %"}</option>
                              </select>
                            </label>
                          )}
                          {slot.condition === "sc-ready" && (
                            <label className="grid min-w-0 gap-0.5">
                              <span className="sr-only">Skillchain</span>
                              <select
                                className={field}
                                value={slot.buff ?? ""}
                                aria-label={`Gambit ${position + 1} skillchain`}
                                onChange={(event) => setSlot(memberId, index, { buff: event.target.value })}
                              >
                                {(GAMBIT_READY_CHAINS as readonly string[]).map((name) => (
                                  <option key={name} value={name}>{name}</option>
                                ))}
                              </select>
                            </label>
                          )}
                          {slot.condition === "foe-debuff" && (
                            <label className="grid min-w-0 gap-0.5">
                              <span className="sr-only">Missing debuff</span>
                              <select
                                className={field}
                                value={slot.buff ?? ""}
                                aria-label={`Gambit ${position + 1} debuff`}
                                onChange={(event) => setSlot(memberId, index, { buff: event.target.value })}
                              >
                                <option value="">—</option>
                                {slot.buff && !debuffChoices.some((row) => row.id === slot.buff) && <option value={slot.buff}>{slot.buff}</option>}
                                {debuffChoices.map((choice) => (
                                  <option key={choice.id} value={choice.id}>{choice.label}</option>
                                ))}
                              </select>
                            </label>
                          )}
                        </div>
                      </div>
                      {(slot.target === "foe-hp" || percentCondition(slot.condition)) && (
                        <HpWheel
                          value={slot.hpPct ?? 50}
                          label={`Gambit ${position + 1} ${mpCondition(slot.condition) ? "MP" : "HP"} percent`}
                          onChange={(hpPct) => setSlot(memberId, index, { hpPct })}
                        />
                      )}
                      <label className="mt-1.5 grid min-w-0 gap-0.5">
                        <span className="text-xs text-muted">Action</span>
                        <select
                          className={field}
                          value={slot.action}
                          aria-label={`Gambit ${position + 1} action`}
                          onChange={(event) => setSlot(memberId, index, { action: event.target.value })}
                        >
                          <option value="">—</option>
                          {orphan && <option value={slot.action}>{slot.action}</option>}
                          {groups.map((group) => (
                            <optgroup key={group.title} label={group.title}>
                              {group.actions.map((choice) => (
                                <option key={choice.id} value={choice.id}>{choice.label}</option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </label>
                      <button type="button" onClick={() => remove(index)} className="mt-2 h-11 px-1 text-sm text-muted">
                        Remove
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
          <button
            type="button"
            onClick={add}
            disabled={full}
            className="mt-2 flex h-12 items-center gap-3 rounded-md border border-gold px-3 text-gold disabled:opacity-40"
          >
            <span className="grid size-7 place-items-center rounded-full border border-current font-display text-xl leading-none">+</span>
            <span className="font-display text-xl leading-none">Add gambit</span>
          </button>
        </div>
      </div>
      </div>
    </section>
  );
}

function GambitRoster({ onPick }: { onPick: (id: string) => void }) {
  const gambits = useGame((s) => s.gambits);
  const party = useGame((s) => s.party);
  const rows = [
    { id: GAMBIT_MEMBER, name: "Xanosuke", note: "You", on: gambits[GAMBIT_MEMBER]?.on === true },
    ...TRUSTS.map((trust) => {
      const inParty = party.summoned.includes(trust.id);
      return {
        id: trust.id,
        name: trust.name,
        note: inParty ? `In the party · ${trust.jobName}` : `Not in the party · ${trust.jobName}`,
        on: gambits[trust.id]?.on === true,
      };
    }),
  ];
  return (
    <section className="mx-auto flex h-full min-h-0 w-full max-w-lg flex-col px-3 pt-32 pb-2 sm:max-w-xl sm:pt-40">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="ffxi-frame flex max-h-full min-h-0 flex-col overflow-hidden" style={{ background: "var(--color-navy)" }}>
          <div className="shrink-0 px-4 pt-4 pb-3">
            <h1 className="font-display text-4xl leading-none text-gold">Gambits</h1>
            <div className="mt-1.5 flex w-28 items-center gap-1.5 text-gold" aria-hidden>
              <span className="h-px flex-1 bg-gold" />
              <svg viewBox="0 0 28 10" className="h-2.5 w-7 shrink-0 fill-current">
                <path d="M6 3.4 7.2 5 6 6.6 4.8 5Z" />
                <path d="M14 0.6 16.1 5 14 9.4 11.9 5Z" />
                <path d="M22 3.4 23.2 5 22 6.6 20.8 5Z" />
              </svg>
              <span className="h-px flex-1 bg-gold" />
            </div>
            <p className="mt-3 text-sm text-ink">Choose who to set.</p>
          </div>
          <div className="min-h-0 overflow-y-auto px-3 pb-3">
            <ul className="flex flex-col gap-2">
              {rows.map((row) => (
                <li key={row.id}>
                  <button
                    type="button"
                    onClick={() => onPick(row.id)}
                    className="flex min-h-12 w-full items-center gap-3 rounded-md border border-gold px-3 py-2 text-left"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-xl leading-none text-ink">{row.name}</span>
                      <span className="mt-1 block text-xs text-muted">{row.note}</span>
                    </span>
                    <span className="font-display text-lg leading-none text-gold">{row.on ? "On" : "Off"}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function GambitBoard() {
  const [member, setMember] = useState<string | null>(null);
  if (member == null) return <GambitRoster onPick={setMember} />;
  return <GambitEditor key={member} memberId={member} onBack={() => setMember(null)} />;
}
