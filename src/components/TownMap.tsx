import { CraftMenu } from "@/components/CraftMenu";
import { MagianMenu } from "@/components/MagianMenu";
import { LEVEL } from "@/game/content";
import { CONQUEST_SHOP, NATION, rankFromPoints, rankGoal, signetHours } from "@/game/signet";
import { supportCatalog } from "@/game/fov";
import { TRUSTS, TRUST_MAIN_KINDS, TRUST_OFF_KINDS, TRUST_RANGE_KINDS, memberCap, trustById, trustCombat, trustGearOf, trustSeats, trustSubChoices, trustTwoHand } from "@/game/party";
import { JOB_NAME, type JobId } from "@/game/stats";
import { useGame } from "@/game/store";
import { useEffect, useRef, useState } from "react";

const SHOP_TABS = ["Gear", "Weapons", "Armor", "Items"] as const;

const SPOTS = [
  { id: "stable", label: "Stable", x: 0, y: 36, w: 9, h: 54, text: "Chocobo raising and riding come later." },
  { id: "craft", label: "Craft", x: 18, y: 26, w: 10, h: 11, text: "Crafting skills come later." },
  { id: "shop", label: "Shop", x: 18, y: 52, w: 22, h: 42, text: "" },
  { id: "auction", label: "Auction House", x: 41, y: 48, w: 16, h: 44, text: "Buying and selling with other players comes later." },
  { id: "trusts", label: "Trusts", x: 57, y: 44, w: 12, h: 44, text: "" },
  { id: "magian", label: "Magian Trials", x: 68, y: 38, w: 14, h: 48, text: "" },
  { id: "manual", label: "Field Manual", x: 84, y: 36, w: 15, h: 52, text: "" },
  { id: "nation", label: "San d'Oria", x: 45, y: 2, w: 11, h: 10, text: "" },
] as const;

const field = "h-11 w-full min-w-0 border border-gold-dim bg-navy px-2 text-sm text-ink";

function TrustMark() {
  return (
    <div className="mt-1.5 flex w-28 items-center gap-1.5 text-gold" aria-hidden>
      <span className="h-px flex-1 bg-gold" />
      <svg viewBox="0 0 28 10" className="h-2.5 w-7 shrink-0 fill-current">
        <path d="M6 3.4 7.2 5 6 6.6 4.8 5Z" />
        <path d="M14 0.6 16.1 5 14 9.4 11.9 5Z" />
        <path d="M22 3.4 23.2 5 22 6.6 20.8 5Z" />
      </svg>
      <span className="h-px flex-1 bg-gold" />
    </div>
  );
}

function TrustDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const who = trustById(id);
  const party = useGame((s) => s.party);
  const jobLevels = useGame((s) => s.jobLevels);
  const blueSet = useGame((s) => s.blueSet);
  const vital = useGame((s) => s.trustVitals[id]);
  const callTrust = useGame((s) => s.callTrust);
  const dismissTrust = useGame((s) => s.dismissTrust);
  const setTrustSub = useGame((s) => s.setTrustSub);
  const setTrustGear = useGame((s) => s.setTrustGear);
  if (!who) return null;
  const summoned = party.summoned.includes(id);
  const sub = party.subs[id] ?? null;
  const gear = trustGearOf(party, id);
  const sheet = trustCombat(id, sub, gear);
  const seats = trustSeats(party.players, party.mode);
  const known = jobLevels[who.job] ?? 0;
  const choices = trustSubChoices(who.job, jobLevels);
  const full = !summoned && party.summoned.length >= seats;

  return (
    <div className="mt-2 min-h-0 space-y-2 overflow-y-auto pr-1">
      <button type="button" onClick={onBack} className="flex h-11 items-center text-sm text-gold">
        Trusts
      </button>
      <div className="border border-gold-dim px-2 py-2">
        <p className="font-display text-2xl leading-none text-ink">{who.name}</p>
        <p className="mt-1 text-xs text-muted">
          {who.raceName} · {who.jobName}
          {sub ? ` / ${JOB_NAME[sub]}` : ""} · {who.home}
        </p>
        <p className="mt-1 text-xs text-muted">
          Battle Lv.{LEVEL} · your {who.jobName} Lv.{known}
        </p>
        <p className="mt-1 text-sm text-ink">
          HP {sheet.hp} · MP {sheet.mp}
        </p>
        {vital && (
          <p className="text-xs text-sky">
            Now HP {vital.hp}/{vital.maxHp} · MP {vital.mp}/{vital.maxMp}
            {vital.casting ? ` · casts ${vital.casting}` : ""}
          </p>
        )}
        <p className="mt-2 text-sm text-ink">{who.line}</p>
        <p className="mt-1 text-xs text-muted">Spells and abilities follow your {who.jobName} (Lv.{known}).</p>
        {who.job === "BLU" ? (
          <p className="mt-1 text-xs text-muted">He casts the {blueSet.length === 1 ? "spell" : `${blueSet.length} spells`} set on your Blue Mage list, and his traits follow that set.</p>
        ) : null}
        {who.job === "PUP" ? (
          <p className="mt-1 text-xs text-muted">She calls the automaton from your Puppetmaster tab, head, frame, and attachments. Repair uses a copy of the Automaton Oil you have equipped, and that stack is not spent.</p>
        ) : null}
        {who.job === "BST" ? (
          <p className="mt-1 text-xs text-muted">She calls Courier Carrie only when Fish Oil Broth is equipped. The jug is not used up. Reward feeds her a copy of the pet food you selected, and your stack is not spent.</p>
        ) : null}
        <label className="mt-2 grid gap-1">
          <span className="text-xs text-muted">Subjob</span>
          <select
            className={field}
            aria-label={`${who.name} subjob`}
            value={sub ?? ""}
            onChange={(event) => setTrustSub(id, event.target.value === "" ? null : (event.target.value as JobId))}
          >
            <option value="">None</option>
            {choices.map((job) => (
              <option key={job} value={job}>
                {JOB_NAME[job]}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-2 grid gap-1">
          <span className="text-xs text-muted">Main hand</span>
          <select
            className={field}
            aria-label={`${who.name} main hand`}
            value={gear.main}
            onChange={(event) => setTrustGear(id, "main", event.target.value)}
          >
            {TRUST_MAIN_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {kind}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-2 grid gap-1">
          <span className="text-xs text-muted">Off hand</span>
          <select
            className={field}
            aria-label={`${who.name} off hand`}
            value={trustTwoHand(gear.main) ? "" : gear.off}
            disabled={trustTwoHand(gear.main)}
            onChange={(event) => setTrustGear(id, "off", event.target.value)}
          >
            <option value="">None</option>
            {TRUST_OFF_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {kind}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-2 grid gap-1">
          <span className="text-xs text-muted">Ranged</span>
          <select
            className={field}
            aria-label={`${who.name} ranged`}
            value={gear.range}
            onChange={(event) => setTrustGear(id, "range", event.target.value)}
          >
            <option value="">None</option>
            {TRUST_RANGE_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {kind}
              </option>
            ))}
          </select>
        </label>
        {summoned ? (
          <button type="button" onClick={() => dismissTrust(id)} className="mt-2 h-11 w-full border border-gold text-sm font-semibold text-gold">
            Dismiss
          </button>
        ) : (
          <button
            type="button"
            onClick={() => callTrust(id)}
            disabled={full}
            className="mt-2 h-11 w-full border border-gold bg-gold text-sm font-semibold text-navy disabled:opacity-40"
          >
            Call
          </button>
        )}
        <p className="mt-2 text-xs text-muted">
          A called trust follows a step behind you. Engage on the gambit board walks them in and they auto-attack. The weapon in hand is the weapon skill list, up to your {who.jobName} level.
        </p>
      </div>
    </div>
  );
}

function FieldShop() {
  const level = useGame((s) => s.jobLevels?.[s.mainJob] ?? LEVEL);
  const tabs = useGame((s) => s.fov?.tabs ?? 0);
  const rows = supportCatalog(level);
  return (
    <div className="mt-2 flex min-h-0 flex-1 flex-col">
      <p className="text-xs text-gold">Tabs {tabs}</p>
      <p className="mt-1 text-xs text-muted">Field Support. The same list as the book by the San d'Oria gate.</p>
      <ul className="mt-2 flex min-h-0 flex-col gap-2 overflow-y-auto pb-1">
        {rows.map((row) => (
          <li key={row.id}>
            <button
              type="button"
              onClick={() => useGame.getState().buyFieldSupport(row.id, "town")}
              className="w-full border border-gold bg-navy px-3 py-2 text-left"
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold text-gold">{row.name}</span>
                <span className="shrink-0 text-xs text-gold">{row.tabs} tabs</span>
              </span>
              <span className="mt-1 block text-xs text-ink">{row.effect}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TrustsSheet() {
  const party = useGame((s) => s.party);
  const [picked, setPicked] = useState<string | null>(null);
  const cap = memberCap(party.mode);
  const seats = trustSeats(party.players, party.mode);
  const members = party.players + party.summoned.length;
  if (picked) return <TrustDetail id={picked} onBack={() => setPicked(null)} />;

  return (
    <div className="mt-2 flex min-h-0 flex-1 flex-col">
      <TrustMark />
      <p className="mt-3 text-sm text-ink">Choose who to call.</p>
      <p className="mt-1 text-xs text-muted">
        Party {members}/{cap}
        <span> · </span>
        Trust seats {party.summoned.length}/{seats}
      </p>
      <ul className="mt-2 flex min-h-0 flex-col gap-2 overflow-y-auto pb-1">
        {TRUSTS.map((trust) => {
          const called = party.summoned.includes(trust.id);
          return (
            <li key={trust.id}>
              <button
                type="button"
                onClick={() => setPicked(trust.id)}
                className="flex min-h-12 w-full items-center gap-3 rounded-md border border-gold px-3 py-2 text-left"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-xl leading-none text-ink">{trust.name}</span>
                  <span className="mt-1 block text-xs text-muted">
                    {trust.raceName} · {trust.jobName}
                  </span>
                </span>
                <span className="font-display text-lg leading-none text-gold">{called ? "Called" : "Away"}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function NationSheet() {
  const points = useGame((s) => s.rankPoints ?? 0);
  const conquest = useGame((s) => s.conquestPoints ?? 0);
  const buffs = useGame((s) => s.buffs);
  const [shop, setShop] = useState(false);
  const rank = rankFromPoints(points);
  const goal = rankGoal(rank);
  const signet = buffs.find((buff) => buff.name === "Signet" && buff.left > 0);
  const hours = signet ? Math.max(1, Math.ceil(signet.left / 3600)) : 0;
  return (
    <div className="mt-2 flex min-h-0 flex-1 flex-col">
      <p className="font-display text-xl leading-none text-ink">{NATION}</p>
      <p className="mt-3 font-display text-3xl leading-none text-gold">Rank {rank}</p>
      <p className="mt-2 font-mono text-sm text-ink">
        {goal == null ? `${points.toLocaleString()} rank points` : `${points.toLocaleString()} / ${goal.toLocaleString()}`}
      </p>
      <p className="mt-1 font-mono text-sm text-gold">{conquest.toLocaleString()} conquest points</p>
      <p className="mt-3 text-sm text-ink">
        Signet lets a defeated enemy drop its crystal. Ten percent of the experience becomes rank points and conquest points in San d'Oria lands. Elsewhere that cut is fifteen percent.
      </p>
      <p className="mt-2 text-xs text-muted">San d'Oria holds this city. Signet lasts {signetHours(rank)} hours at this rank. Receiving it again starts the timer over.</p>
      <button
        type="button"
        onClick={() => setShop((open) => !open)}
        className={`mt-3 h-9 border text-sm ${shop ? "border-gold bg-gold text-navy" : "border-gold-dim text-ink"}`}
      >
        Shop
      </button>
      {shop ? (
        <ul className="mt-2 flex min-h-0 flex-col gap-2 overflow-y-auto">
          {CONQUEST_SHOP.map((offer) => {
            const locked = rank < offer.rank;
            const poor = conquest < offer.cost;
            return (
              <li key={offer.id} className="border border-gold-dim px-2 py-2">
                <p className="text-sm font-semibold text-ink">{offer.name}</p>
                <p className="mt-1 text-xs text-muted">{offer.note}</p>
                <p className="mt-1 text-xs text-gold">{offer.cost} conquest points · Rank {offer.rank}</p>
                <button
                  type="button"
                  disabled={locked || poor}
                  onClick={() => useGame.getState().buyConquest(offer.id)}
                  className="mt-2 h-10 w-full border border-gold text-sm font-semibold text-gold disabled:opacity-40"
                >
                  {locked ? `Requires rank ${offer.rank}` : "Buy"}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
      <button
        type="button"
        onClick={() => useGame.getState().castSignet()}
        className="mt-3 h-11 w-full border border-gold bg-gold text-sm font-semibold text-navy"
      >
        {signet ? "Receive Signet again" : "Receive Signet"}
      </button>
      {signet ? <p className="mt-2 text-xs text-gold">Signet is active. About {hours} {hours === 1 ? "hour" : "hours"} left.</p> : null}
    </div>
  );
}

export function TownMap() {
  const scroller = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<(typeof SPOTS)[number]["id"] | null>(null);
  const [tab, setTab] = useState<(typeof SHOP_TABS)[number]>("Gear");
  const spot = SPOTS.find((entry) => entry.id === open) ?? null;

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const center = () => {
      el.scrollLeft = Math.max(0, (el.scrollWidth - el.clientWidth) * 0.42);
    };
    const img = el.querySelector("img");
    if (img && !img.complete) img.addEventListener("load", center, { once: true });
    else center();
  }, []);

  return (
    <div className="relative h-full w-full bg-[#c4a574]">
      <div ref={scroller} className="h-full w-full overflow-x-auto overflow-y-hidden">
        <div className="relative h-full w-max">
          <img
            src="/town/san-doria.jpg?v=7"
            alt="San d'Oria"
            draggable={false}
            className="pointer-events-none h-full w-auto max-w-none select-none"
          />
          {SPOTS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              aria-label={entry.label}
              onClick={() => {
                setOpen(entry.id);
                if (entry.id === "shop") setTab("Gear");
              }}
              className="absolute touch-pan-x"
              style={{ left: `${entry.x}%`, top: `${entry.y}%`, width: `${entry.w}%`, height: `${entry.h}%` }}
            />
          ))}
        </div>
      </div>
      {spot && (
        <div className={`ffxi-frame absolute inset-x-2 z-10 flex flex-col p-3 ${spot.id === "trusts" || spot.id === "manual" || spot.id === "craft" || spot.id === "nation" || spot.id === "magian" ? "top-16 bottom-2 max-h-none overflow-hidden" : "bottom-2"}`}>
          <div className="flex shrink-0 items-start justify-between gap-2">
            <p className="font-display text-2xl leading-none text-gold">{spot.label}</p>
            <button type="button" onClick={() => setOpen(null)} className="h-8 border border-gold px-2 text-xs text-gold">
              Close
            </button>
          </div>
          {spot.id === "shop" ? (
            <>
              <div className="mt-2 grid grid-cols-4 gap-1">
                {SHOP_TABS.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setTab(name)}
                    className={`h-8 border text-xs ${tab === name ? "border-gold bg-gold text-navy" : "border-gold-dim text-ink"}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-muted">The {tab.toLowerCase()} shelves are not stocked yet.</p>
            </>
          ) : spot.id === "trusts" ? (
            <TrustsSheet />
          ) : spot.id === "manual" ? (
            <FieldShop />
          ) : spot.id === "craft" ? (
            <CraftMenu />
          ) : spot.id === "nation" ? (
            <NationSheet />
          ) : spot.id === "magian" ? (
            <MagianMenu />
          ) : (
            <p className="mt-2 text-sm text-muted">{spot.text}</p>
          )}
        </div>
      )}
    </div>
  );
}
