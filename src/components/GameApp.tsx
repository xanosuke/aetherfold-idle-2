// @ts-nocheck
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { AfkPanel } from "@/components/AfkPanel";
import { Dock, Soon } from "@/components/Dock";
import { EquipmentMenu } from "@/components/EquipmentMenu";
import { GambitBoard } from "@/components/GambitBoard";
import { TownMap } from "@/components/TownMap";
import { YardMap } from "@/components/YardMap";
import { HARE, HARE_DEF } from "@/game/content";
import { createYard } from "@/game/engine";
import { fieldFoodChip, manualBookAt, nearFieldManual, readFov, regimeByPage, regimeProgress, regimesFor, supportCatalog } from "@/game/fov";
import { colureBrief } from "@/game/geo";
import { subjobLevel } from "@/game/jobs";
import { DEBUFF_STAT_LABEL, distractPower } from "@/game/magic";
import { subscribePack, readPackPlate } from "@/game/pack";
import { trustById, trustCombat, trustGearOf } from "@/game/party";
import { subscribeField, readFieldPlate } from "@/game/ronfaure";
import { gambitLine } from "@/game/run";
import { homeHere, nearHomeCrystal, readPlace } from "@/game/save";
import { targetEvasion } from "@/game/smn";
import { JOB_NAME, RACES } from "@/game/stats";
import { exportSaveText, flushYardMirror, hydrateYardSave, loadNewestSave, resetProgress, resumeSavedGame, saveSettings, useGame, yardReady } from "@/game/store";
import { vanadielTime } from "@/game/vanatime";

function ObjectiveTrack() {
  const fov = useGame((s) => s.fov);
  const book = readFov(fov);
  if (!book.active) return null;
  const line = regimeProgress(book);
  if (!line) return null;
  return <div className="px-0.5 text-right" aria-label="Current objective"><p className="font-display text-sm leading-none text-gold [text-shadow:0_1px_2px_#0c1b38]">Individual Training:</p><p className="mt-1 text-xs text-ink [text-shadow:0_1px_2px_#0c1b38]">{line}</p></div>;
}
export function GameApp() {
  const canvasRef = useRef(null);
  const started = useGame(s => s.started);
  const screen = useGame(s => s.screen);
  const targeted = useGame(s => s.targeted);
  const selfTargeted = useGame(s => s.selfTargeted);
  const trustTargeted = useGame(s => s.trustTargeted);
  const pet = useGame(s => s.petTargeted ? s.pets.find(row => row.id === s.petTargeted) ?? null : null);
  const trustVital = useGame(s => s.trustTargeted ? s.trustVitals[s.trustTargeted] : void 0);
  const party = useGame(s => s.party);
  const crystalTargeted = useGame(s => s.crystalTargeted);
  const manualTargeted = useGame(s => s.manualTargeted);
  const manualPage = useGame(s => s.manualPage);
  const fov = useGame(s => s.fov);
  const homeAt = useGame(s => s.homeAt);
  const homeSpot = useHomeHere();
  const homeAsk = useGame(s => s.homeAsk);
  const rivalryAsk = useGame(s => s.rivalryAsk);
  const ko = useGame(s => s.ko);
  const pendingRaise = useGame(s => s.pendingRaise);
  const engaged = useGame(s => s.engaged);
  const healPhase = useGame(s => s.healPhase);
  const sheet = useGame(s => s.sheet);
  const hp = useGame(s => s.hp);
  const hpGift = useGame(s => s.hpGift);
  const mp = useGame(s => s.mp);
  const race = useGame(s => s.race);
  const mainJob = useGame(s => s.mainJob);
  const subJob = useGame(s => s.subJob);
  const jobLevels = useGame(s => s.jobLevels);
  const buffs = useGame(s => s.buffs);
  const ailments = useGame(s => s.ailments);
  const hareDebuffs = useGame(s => s.hareDebuffs);
  const kinDebuffs = useGame(s => s.kinDebuffs);
  const statDown = useGame(s => s.statDown);
  const hareEnfeebles = useGame(s => s.hareEnfeebles);
  const kinEnfeebles = useGame(s => s.kinEnfeebles);
  const banishDown = useGame(s => s.banishDown);
  const hate = useGame(s => s.hate);
  const hateFace = useGame(s => s.hateFace);
  const packMark = useGame(s => s.packMark);
  const kinHate = useGame(s => s.kinHate);
  const kinHateFace = useGame(s => s.kinHateFace);
  const hareTp = useGame(s => s.hareTp);
  const hareHp = useGame(s => s.hareHp);
  const hareRespawn = useGame(s => s.hareRespawn);
  const quarry = useGame(s => s.quarry);
  const kinHp = useGame(s => s.kinHp);
  const kinTp = useGame(s => s.kinTp);
  const kinRespawn = useGame(s => s.kinRespawn);
  const log = useGame(s => s.log);
  const [logOpen, setLogOpen] = useState(false);
  const [afkOpen, setAfkOpen] = useState(false);
  const camp = useGame(s => s.afkFarm);
  const logPane = useRef(null);
  useEffect(() => {
    if (!logOpen || !logPane.current) return;
    logPane.current.scrollTop = logPane.current.scrollHeight;
  }, [logOpen, log.length]);
  useEffect(() => {
    if (!camp?.active) return;
    if (Date.now() - camp.startTimestamp < 6e4) return;
    setAfkOpen(true);
  }, [camp?.startTimestamp, camp?.active]);
  const dealt = useGame(s => s.dealt);
  const swings = useGame(s => s.swings);
  const stripId = trustTargeted || party.summoned[0] || "";
  const stripVital = useGame(s => s.trustVitals[stripId]);
  const strip = trustById(stripId);
  const yard = useRef(null);
  const [bootChecked, setBootChecked] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef(null);
  const [targetOpen, setTargetOpen] = useState(false);
  const [canFish, setCanFish] = useState(false);
  const targetRef = useRef(null);
  const raceName = RACES.find(r => r.id === race)?.name;
  const jobLine = subJob ? `${mainJob}/${subJob}` : mainJob;
  const mainLevel = jobLevels?.[mainJob] ?? 75;
  const subCap = subjobLevel(mainLevel);
  const subLevel = subJob ? Math.min(subCap, jobLevels?.[subJob] ?? subCap) : 0;
  const plate = subJob ? `Xanosuke ${mainLevel}${mainJob}/${subLevel}${subJob}` : `Xanosuke ${mainLevel}${mainJob}`;
  const hpMax = sheet.hp + hpGift;
  const hpPct = hpMax > 0 ? Math.max(0, Math.min(100, hp / hpMax * 100)) : 0;
  const foeHp = quarry === "kin" ? kinHp : hareHp;
  const foeTp = quarry === "kin" ? kinTp : hareTp;
  const foeRespawn = quarry === "kin" ? kinRespawn : hareRespawn;
  const foeHate = quarry === "kin" ? kinHate : hate;
  const foeFace = quarry === "kin" ? kinHateFace : hateFace;
  const foeDebuffs = quarry === "kin" ? kinDebuffs : hareDebuffs;
  const foeEnfeebles = quarry === "kin" ? kinEnfeebles : hareEnfeebles;
  const foePct = HARE.hpNatural > 0 ? Math.max(0, Math.min(100, foeHp / HARE.hpNatural * 100)) : 0;
  const profile = trustTargeted ? trustById(trustTargeted) : null;
  const trustSub = trustTargeted ? party.subs[trustTargeted] ?? null : null;
  const trustJob = profile ? trustSub && trustSub !== profile.job ? `${profile.jobName} / ${JOB_NAME[trustSub]}` : profile.jobName : "";
  const trustSheet = profile && trustTargeted ? trustCombat(trustTargeted, trustSub && trustSub !== profile.job ? trustSub : null, trustGearOf(party, trustTargeted)) : null;
  const trustHpPct = trustVital && trustVital.maxHp > 0 ? Math.max(0, Math.min(100, trustVital.hp / trustVital.maxHp * 100)) : 0;
  const trustMpPct = trustVital && trustVital.maxMp > 0 ? Math.max(0, Math.min(100, trustVital.mp / trustVital.maxMp * 100)) : 0;
  const petHpPct = pet && pet.max > 0 ? Math.max(0, Math.min(100, pet.hp / pet.max * 100)) : 0;
  const hareEva = targetEvasion(HARE.evasion, hareEnfeebles, distractPower(hareEnfeebles));
  const trustPlate = profile ? trustSub && trustSub !== profile.job ? `${profile.name} ${profile.job}/${trustSub} 75` : `${profile.name} ${profile.job} 75` : "";
  const pack = useSyncExternalStore(subscribePack, readPackPlate, readPackPlate);
  const field = useSyncExternalStore(subscribeField, readFieldPlate, readFieldPlate);
  const packPct = pack.max > 0 ? Math.max(0, Math.min(100, pack.hp / pack.max * 100)) : 0;
  const packLine = pack.status === "defeated" ? "Defeated" : pack.status === "return" ? "Returning to spawn" : pack.swinging ? "Engaged" : pack.status === "chase" ? "Linked" : "On patrol";
  const targetKey = manualTargeted ? "manual" : crystalTargeted ? "crystal" : field.id ? `field:${field.id}` : targeted ? `foe:${quarry}` : pack.id ? `pack:${pack.id}` : pet ? `pet:${pet.id}` : trustTargeted && trustVital && trustSheet ? `trust:${trustTargeted}` : targeted ? `foe:${quarry}` : selfTargeted ? "self" : "";
  useLayoutEffect(() => {
    resumeSavedGame();
    setBootChecked(true);
    if (!useGame.getState().started) setRestoring(true);
    let live = true;
    const done = new Promise(resolve => {
      window.setTimeout(resolve, 8e3);
    });
    Promise.race([hydrateYardSave(), done]).finally(() => {
      if (live) setRestoring(false);
    });
    return () => {
      live = false;
    };
  }, []);
  useEffect(() => {
    if (!sheetOpen) return;
    const onDown = event => {
      const root = sheetRef.current;
      if (!root || !(event.target instanceof Node) || root.contains(event.target)) return;
      setSheetOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [sheetOpen]);
  useEffect(() => {
    setTargetOpen(false);
  }, [targetKey]);
  useEffect(() => {
    if (!targetOpen) return;
    const onDown = event => {
      const root = targetRef.current;
      if (!root || !(event.target instanceof Node) || root.contains(event.target)) return;
      setTargetOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [targetOpen]);
  useEffect(() => {
    const flush = () => {
      saveSettings();
      flushYardMirror();
    };
    const onHide = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", flush);
    window.addEventListener("beforeunload", flush);
    document.addEventListener("visibilitychange", onHide);
    const timer = window.setInterval(() => {
      if (!useGame.getState().started || !yardReady()) return;
      saveSettings(false);
    }, 5e3);
    return () => {
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("beforeunload", flush);
      document.removeEventListener("visibilitychange", onHide);
      window.clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    const onFish = event => setCanFish(event.detail === true);
    window.addEventListener("fs-fish", onFish);
    return () => window.removeEventListener("fs-fish", onFish);
  }, []);
  useEffect(() => {
    const host = canvasRef.current;
    if (!host) return;
    const canvas = document.createElement("canvas");
    canvas.className = "absolute inset-0 h-full w-full touch-none";
    host.replaceWith(canvas);
    let created = null;
    try {
      created = createYard(canvas);
      yard.current = created;
    } catch (err) {
      console.error(err);
    }
    return () => {
      created?.dispose();
      yard.current = null;
      if (canvas.isConnected) canvas.replaceWith(host);
    };
  }, [createYard]);
  return <main className="relative h-dvh w-full overflow-hidden bg-sky text-ink"><canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" /><div id="fs-floaters" className="pointer-events-none absolute inset-0 overflow-hidden" /><header className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-2 sm:p-3"><div className="flex min-w-0 max-w-[calc(100%-8.75rem)] flex-col items-start gap-1"><div ref={sheetRef} className={sheetOpen ? "pointer-events-auto w-44 sm:w-64" : "pointer-events-auto min-w-0 max-w-full"}>{sheetOpen ? <section className="ffxi-frame min-w-0 p-2 sm:p-3"><div className="flex items-baseline justify-between gap-2"><p className="truncate font-display text-xl leading-none sm:text-2xl">Xanosuke</p><p className="shrink-0 text-[11px] text-muted sm:hidden">{jobLine} {mainLevel}</p></div><p className="hidden text-xs text-muted sm:block">{raceName} · {jobLine} · Lv.{mainLevel}</p><div className="mt-1.5 sm:mt-2"><div className="flex items-baseline justify-between text-[11px] text-muted sm:text-xs"><span>Delay</span><span id="fs-swing-label">3.85s</span></div><div className="mt-1 h-2 overflow-hidden bg-navy"><div id="fs-swing" className="h-full origin-left bg-gold" style={{
                  transform: "scaleX(0)"
                }} /></div><p className="mt-1 truncate text-[11px] text-muted sm:text-xs">{sheet.weaponName} · {sheet.delay} · {sheet.tpHit} TP · {sheet.reach.toFixed(1)}'</p>{strip && stripVital && <p className="mt-0.5 truncate text-[11px] text-sky">{stripVital.casting ? `${strip.name} casts ${stripVital.casting}` : `${strip.name} HP ${stripVital.hp} MP ${stripVital.mp}`}</p>}{buffs.length > 0 && <ul className="mt-1.5 flex flex-wrap gap-1">{buffs.map(buff => <li className="border border-gold bg-navy/90 px-1.5 py-1 text-[10px] leading-none text-gold" key={buff.name}><span className="font-semibold">{buff.song && buff.power != null ? `${buff.name} ${buff.power}` : buff.name === "Protect" && buff.power != null ? `Protect +${buff.power}` : buff.name === "Shell" && buff.power != null ? `Shell ${buff.power}/256` : buff.name === "Regen" && buff.power != null ? `Regen ${buff.power}/tick` : buff.name === "Haste" && buff.power != null ? `Haste ${buff.power}/1024` : buff.name === "Defense Boost" ? "Defense +50%" : buff.name === "Magic Atk. Boost" && buff.power != null ? `Magic Atk. +${buff.power}` : buff.name === "Refresh" && buff.power != null ? `Refresh ${buff.power}/tick` : buff.name === "Auspice" && buff.power != null ? `Auspice +${buff.power}${buff.acc ? ` · +${buff.acc} acc` : ""}` : buff.name === "Aquaveil" && buff.charges != null ? `Aquaveil ${buff.charges}` : buff.name === "Blink" && buff.charges != null ? `Blink ${buff.charges}` : buff.name === "Phalanx" && buff.power != null ? `Phalanx −${buff.power}` : buff.name === "Reprisal" && buff.power != null ? `Reprisal ${buff.power}%` : buff.name === "Perfect Defense" && buff.power != null ? `Perfect Defense −${buff.power}%` : buff.name === "Ecliptic Growl" ? `Ecliptic Growl +${buff.power ?? 0}/+${buff.mind ?? 0}` : buff.name === "Bust" ? `Bust ×${(Math.floor((buff.power ?? 0) / 100) > 0 ? 1 : 0) + ((buff.power ?? 0) % 100 > 0 ? 1 : 0)}` : buff.name.endsWith("Roll") && buff.power != null ? `${buff.name} ${buff.power >= 100 ? `${buff.power % 100}+` : buff.power}` : buff.name.startsWith("Bar") && buff.power != null ? `${buff.name} +${buff.power}` : buff.name === "Finishing Move" && buff.power != null ? `Finishing Move ${buff.power}` : buff.name === "Stratagem" && buff.power != null ? `Stratagem ${buff.power}` : buff.name === "Sublimation" && buff.power != null ? `Sublimation ${buff.power} MP` : buff.name === "Sublimation: Complete" && buff.power != null ? `Sublimation: Complete ${buff.power} MP` : `${foodMark(buff.name) ?? withColure(buff.name, buff.power, buff.skin)}`}</span>{buff.hold && !buff.name.startsWith("Indi-") || buff.name.startsWith("Geo-") ? null : <span className="ml-1 tabular-nums">{clock(buff.left)}</span>}</li>)}</ul>}{ailments.length > 0 && <ul className="mt-1.5 flex flex-wrap gap-1">{ailments.map(ailment => <li className="border border-hp bg-navy/90 px-1.5 py-1 text-[10px] leading-none text-hp" key={ailment.name}><span className="font-semibold">{ailment.name}</span><span className="ml-1 tabular-nums">{clock(ailment.left)}</span></li>)}</ul>}<SaveChip /></div></section> : <button type="button" onClick={() => setSheetOpen(true)} className="ffxi-frame flex h-11 max-w-full items-center px-3 text-left font-display text-base leading-none text-ink" aria-expanded={false} aria-label={plate}><span className="truncate">{plate}</span></button>}</div>{targetKey !== "" && <div ref={targetRef} className="pointer-events-auto max-w-full">{targetOpen ? <section className="ffxi-frame w-[min(14rem,calc(100vw-13.5rem))] p-2 sm:p-3">{manualTargeted ? <><p className="truncate font-display text-xl leading-none sm:text-2xl">Field Manual</p><p className="text-[11px] text-muted sm:text-xs">Fields of Valor · {manualBookAt(readPlace().x, readPlace().z) === "east" ? "East Ronfaure" : "West Ronfaure"}</p><p className="mt-1 text-sm text-ink">{regimeProgress(readFov(fov)) || "No regime active."}</p><p className="text-[11px] text-gold">Tabs {fov?.tabs ?? 0}</p></> : crystalTargeted ? <><p className="truncate font-display text-xl leading-none sm:text-2xl">Home Point</p><p className="text-[11px] text-muted sm:text-xs">{homeSpot === "port" ? "NPC · Port San d'Oria" : "NPC · San d'Oria"}</p><p className="mt-1 text-sm text-ink">{homeSpot && homeAt === homeSpot ? "Your home point." : "Not your home point."}</p></> : field.id ? <><p className="truncate font-display text-xl leading-none sm:text-2xl">{field.name}</p><p className="text-[11px] text-muted sm:text-xs">Lv.{field.level} · {field.family}{field.nm ? " · Notorious" : ""}</p><div className="mt-1.5 h-2 overflow-hidden bg-navy sm:mt-2"><div className="h-full bg-hp" style={{
                  width: `${field.max <= 0 ? 0 : Math.max(0, Math.min(100, field.hp / field.max * 100))}%`
                }} /></div><p className="mt-1 text-sm text-ink">HP {field.hp} / {field.max}</p><p className="text-[11px] text-gold">{field.claimed ? "Engaged" : "Not engaged"}</p></> : pack.id && !targeted ? <><p className="truncate font-display text-xl leading-none sm:text-2xl">{HARE.name}</p><p className="text-[11px] text-muted sm:text-xs">Lv.{HARE.level} · {HARE.family} · Sight, scent</p><p className="text-[11px] text-muted sm:text-xs">Does not link. Claiming one leaves the others on patrol.</p><div className="mt-1.5 h-2 overflow-hidden bg-navy sm:mt-2"><div className="h-full bg-hp" style={{
                  width: `${pack.hp <= 0 ? 0 : packPct}%`
                }} /></div>{pack.hp <= 0 ? <><p className="mt-1 text-sm text-ink">Defeated</p><p className="text-[11px] tabular-nums text-gold">Respawn {clock(pack.respawn)}</p></> : <><p className="mt-1 text-sm text-ink">HP {pack.hp} / {pack.max}</p><p className="text-[11px] text-gold">{packLine}</p>{packMark && packMark.id === pack.id && (packMark.ce > 0 || packMark.ve > 0) && <>{packMark.faceName ? <p className="text-[11px] text-gold">On {packMark.faceName}</p> : null}<p className="text-[11px] text-gold">CE {packMark.ce} · VE {Math.floor(packMark.ve)}</p></>}{packMark && packMark.id === pack.id && packMark.debuffs?.length > 0 && <ul className="mt-1.5 flex flex-wrap gap-1">{packMark.debuffs.map(row => <li className="border border-gold bg-navy/90 px-1.5 py-1 text-[10px] leading-none text-gold" key={row.name}><span className="font-semibold">{row.name}</span>{row.down != null && row.stat ? <span className="ml-1">−{row.down} {DEBUFF_STAT_LABEL[row.stat]}</span> : null}<span className="ml-1 tabular-nums">{clock(row.left)}</span></li>)}</ul>}{packMark && packMark.id === pack.id && packMark.enfeebles?.length > 0 && <ul className="mt-1.5 flex flex-wrap gap-1">{packMark.enfeebles.map(row => <li className="border border-gold bg-navy/90 px-1.5 py-1 text-[10px] leading-none text-gold" key={row.name}><span className="font-semibold">{row.name}</span>{colureName(row.name) ? colureNote(row.name, row.power) : <>{row.accDown != null && <span className="ml-1">−{row.accDown} acc</span>}{row.evaDown != null && <span className="ml-1">−{row.evaDown} eva</span>}{row.power != null && <span className="ml-1">{row.power}</span>}{row.dot != null && <span className="ml-1">−{row.dot}/tick</span>}</>}{row.name.startsWith("Geo-") ? null : <span className="ml-1 tabular-nums">{clock(row.left)}</span>}</li>)}</ul>}</>}</> : pet ? <><p className="truncate font-display text-xl leading-none sm:text-2xl">{pet.name}</p><p className="truncate text-[11px] text-muted sm:text-xs">Pet · {pet.line}</p>{pet.max > 0 ? <><div className="mt-1.5 h-2 overflow-hidden bg-navy sm:mt-2"><div className="h-full bg-meadow" style={{
                    width: `${petHpPct}%`
                  }} /></div><p className="mt-1 text-sm text-ink">HP {pet.hp} / {pet.max}</p><p className="text-[11px] tabular-nums text-gold">TP {pet.tp}</p></> : null}</> : trustTargeted && trustVital && trustSheet ? <><p className="truncate font-display text-xl leading-none sm:text-2xl">{profile?.name}</p><p className="truncate text-[11px] text-muted sm:text-xs">{profile?.raceName} · {trustJob} · Lv.{75}</p><div className="mt-1.5 h-2 overflow-hidden bg-navy sm:mt-2"><div className="h-full bg-meadow" style={{
                  width: `${trustHpPct}%`
                }} /></div><p className="mt-1 text-sm text-ink">HP {trustVital.hp} / {trustVital.maxHp}</p><div className="mt-1 h-1.5 overflow-hidden bg-navy"><div className="h-full bg-mp" style={{
                  width: `${trustMpPct}%`
                }} /></div><p className="mt-1 text-[11px] text-muted sm:text-xs">MP {trustVital.mp} / {trustVital.maxMp}</p><p className="text-[11px] tabular-nums text-gold">TP {trustVital.tp}</p><p className="truncate text-[11px] text-muted sm:text-xs">{trustSheet.weaponName} · delay {trustSheet.delay}{trustVital.engaged ? " · engaged" : ""}</p>{trustVital.casting && <p className="truncate text-[11px] text-sky">Casting {trustVital.casting}</p>}{trustVital.buffs.length > 0 && <ul className="mt-1.5 flex flex-wrap gap-1">{trustVital.buffs.map(buff => <li className="border border-gold bg-navy/90 px-1.5 py-1 text-[10px] leading-none text-gold" key={buff.name}><span className="font-semibold">{buff.name === "Protect" && buff.power != null ? `Protect +${buff.power}` : buff.name === "Shell" && buff.power != null ? `Shell ${buff.power}/256` : buff.name === "Regen" && buff.power != null ? `Regen ${buff.power}/tick` : buff.name === "Haste" && buff.power != null ? `Haste ${buff.power}/1024` : buff.name === "Refresh" && buff.power != null ? `Refresh ${buff.power}/tick` : buff.name === "Phalanx" && buff.power != null ? `Phalanx −${buff.power}` : buff.name === "Reprisal" && buff.power != null ? `Reprisal ${buff.power}%` : buff.name === "Aquaveil" && buff.charges != null ? `Aquaveil ${buff.charges}` : buff.name === "Blink" && buff.charges != null ? `Blink ${buff.charges}` : buff.name === "Stoneskin" && buff.power != null ? `Stoneskin ${buff.power}` : buff.name === "Bust" ? `Bust ×${(Math.floor((buff.power ?? 0) / 100) > 0 ? 1 : 0) + ((buff.power ?? 0) % 100 > 0 ? 1 : 0)}` : buff.name.endsWith("Roll") && buff.power != null ? `${buff.name} ${buff.power >= 100 ? `${buff.power % 100}+` : buff.power}` : buff.name.startsWith("Bar") && buff.power != null ? `${buff.name} +${buff.power}` : withColure(buff.name, buff.power)}</span>{buff.hold && !buff.name.startsWith("Indi-") || buff.name.startsWith("Geo-") ? null : <span className="ml-1 tabular-nums">{clock(buff.left)}</span>}</li>)}</ul>}</> : targeted ? <><p className="truncate font-display text-xl leading-none sm:text-2xl">{HARE.name}</p><p className="text-[11px] text-muted sm:text-xs">Lv.{HARE.level} · {HARE.family} · {HARE.levelMin}–{HARE.levelMax}</p><div className="mt-1.5 h-2 overflow-hidden bg-navy sm:mt-2"><div className="h-full bg-hp" style={{
                  width: `${foeHp <= 0 ? 0 : foePct}%`
                }} /></div>{foeHp <= 0 ? <><p className="mt-1 text-sm text-ink">Defeated</p><p className="text-[11px] tabular-nums text-gold">Respawn {clock(foeRespawn)}</p></> : <><p className="mt-1 text-sm text-ink">HP {foeHp} / {HARE.hpNatural}</p><p className="text-[11px] tabular-nums text-gold">TP {foeTp}</p></>}{(foeFace ? foeFace.ce > 0 || foeFace.ve > 0 : foeHate.ce > 0 || foeHate.ve > 0) && <>{foeFace && foeFace.id !== "player" && <p className="text-[11px] text-gold">On {foeFace.name}</p>}<p className="text-[11px] text-gold">CE {foeFace ? foeFace.ce : foeHate.ce} · VE {Math.floor(foeFace ? foeFace.ve : foeHate.ve)}</p></>}<p className="hidden text-xs text-muted sm:block">DEF {HARE_DEF} · EVA {hareEva} · VIT {HARE.vit}</p><p className="hidden text-xs text-muted sm:block">WAR/WAR · slashing · delay {HARE.delay}</p><p className="text-[11px] text-muted sm:hidden">DEF {HARE_DEF} · EVA {hareEva}</p>{statDown && quarry !== "kin" && <ul className="mt-1.5 flex flex-wrap gap-1"><li className="border border-gold bg-navy/90 px-1.5 py-1 text-[10px] leading-none text-gold"><span className="font-semibold">{statDown.name}</span><span className="ml-1">−{statDown.down} INT</span><span className="ml-1 tabular-nums">{clock(statDown.left)}</span></li></ul>}{foeDebuffs.length > 0 && <ul className="mt-1.5 flex flex-wrap gap-1">{foeDebuffs.map(debuff => <li className="border border-gold bg-navy/90 px-1.5 py-1 text-[10px] leading-none text-gold" key={debuff.name}><span className="font-semibold">{debuff.name}</span><span className="ml-1">−{debuff.down} {DEBUFF_STAT_LABEL[debuff.stat]}</span><span className="ml-1 tabular-nums">{clock(debuff.left)}</span></li>)}</ul>}{foeEnfeebles.length > 0 && <ul className="mt-1.5 flex flex-wrap gap-1">{foeEnfeebles.map(row => <li className="border border-gold bg-navy/90 px-1.5 py-1 text-[10px] leading-none text-gold" key={row.name}><span className="font-semibold">{row.name}</span>{colureName(row.name) ? colureNote(row.name, row.power) : <>{row.accDown != null && <span className="ml-1">−{row.accDown} acc</span>}{row.evaDown != null && <span className="ml-1">−{row.evaDown} eva</span>}{row.name === "Lethargic Daze" && row.power != null && <span className="ml-1">lv {row.power}</span>}{row.name === "Sluggish Daze" && row.power != null && <span className="ml-1">lv {row.power} −{5 + 2 * (Math.floor(row.power) - 1)}% def</span>}{row.name === "Weakened Daze" && row.power != null && <span className="ml-1">lv {row.power} −{3 * Math.floor(row.power)} meva</span>}{(row.name === "Slow" || row.name === "Slow II") && row.power != null && <span className="ml-1">{row.power}/1024</span>}{(row.name === "Paralyze" || row.name === "Paralyze II") && row.power != null && <span className="ml-1">{row.power}%</span>}{row.name === "Gravity" && row.power != null && <span className="ml-1">−{row.power}% move</span>}{(row.name === "Dia" || row.name === "Dia II" || row.name === "Dia III" || row.name === "Diaga") && row.power != null && <span className="ml-1">−{row.power}/1024 def</span>}{(row.name === "Bio" || row.name === "Bio II" || row.name === "Bio III") && row.power != null && <span className="ml-1">−{row.power}/1024 atk</span>}{(row.name === "Dia" || row.name === "Dia II" || row.name === "Dia III" || row.name === "Diaga" || row.name === "Poison" || row.name === "Poison II" || row.name === "Poisonga" || row.name === "Bio" || row.name === "Bio II" || row.name === "Bio III") && row.dot != null && <span className="ml-1">−{row.dot}/tick</span>}{row.name === "Distract" && row.power != null && <span className="ml-1">−{row.power} eva</span>}{row.name === "Frazzle" && row.power != null && <span className="ml-1">−{row.power} meva</span>}{row.name === "Crit. Evasion Down" && row.power != null && <span className="ml-1">+{row.power}% crit</span>}{row.name === "Gambit" && row.power != null && <span className="ml-1">{gambitLine(row.power)}</span>}</>}{row.name.startsWith("Geo-") ? null : <span className="ml-1 tabular-nums">{clock(row.left)}</span>}</li>)}</ul>}{banishDown && <ul className="mt-1.5 flex flex-wrap gap-1"><li className="border border-gold bg-navy/90 px-1.5 py-1 text-[10px] leading-none text-gold"><span className="font-semibold">{banishDown.name}</span><span className="ml-1">{Math.round(banishDown.sdr * 256)}/256 def</span><span className="ml-1 tabular-nums">{clock(banishDown.left)}</span></li></ul>}<p className="mt-1 text-[11px] text-gold sm:text-xs">{swings} swings · {dealt} dealt</p></> : selfTargeted ? <><p className="truncate font-display text-xl leading-none sm:text-2xl">Xanosuke</p><p className="text-[11px] text-muted sm:text-xs">{raceName} · {jobLine} · Lv.{mainLevel}</p><div className="mt-1.5 h-2 overflow-hidden bg-navy sm:mt-2"><div className="h-full bg-hp" style={{
                  width: `${hpPct}%`
                }} /></div><p className="mt-1 text-sm text-ink">HP {hp} / {hpMax}</p><p className="text-[11px] text-muted sm:text-xs">MP {mp} / {sheet.mp}</p></> : crystalTargeted ? <><p className="truncate font-display text-xl leading-none sm:text-2xl">Home Point</p><p className="text-[11px] text-muted sm:text-xs">{homeSpot === "port" ? "NPC · Port San d'Oria" : "NPC · San d'Oria"}</p><p className="mt-1 text-sm text-ink">{homeSpot && homeAt === homeSpot ? "Your home point." : "Not your home point."}</p></> : manualTargeted ? <><p className="truncate font-display text-xl leading-none sm:text-2xl">Field Manual</p><p className="text-[11px] text-muted sm:text-xs">Fields of Valor · {manualBookAt(readPlace().x, readPlace().z) === "east" ? "East Ronfaure" : "West Ronfaure"}</p><p className="mt-1 text-sm text-ink">{regimeProgress(readFov(fov)) || "No regime active."}</p><p className="text-[11px] text-gold">Tabs {fov?.tabs ?? 0}</p></> : null}</section> : <button type="button" onClick={() => setTargetOpen(true)} className={!manualTargeted && !crystalTargeted && (targeted || selfTargeted || field.id != null || pack.id != null || pet != null && pet.max > 0) ? "ffxi-frame flex max-w-full flex-col items-start px-3 py-1.5 text-left" : "ffxi-frame flex h-11 max-w-full items-center px-3 text-left font-display text-base leading-none text-ink"} aria-expanded={false} aria-label={manualTargeted ? "Field Manual" : crystalTargeted ? "Home Point" : field.id ? `${field.name}, ${field.hp} of ${field.max} HP` : targeted ? `${HARE.name}, ${foeHp <= 0 ? "defeated" : `${foeHp} of ${HARE.hpNatural} HP`}` : pack.id ? `${HARE.name}, ${pack.hp <= 0 ? "defeated" : `${pack.hp} of ${pack.max} HP`}` : pet ? pet.max > 0 ? `${pet.name}, ${pet.hp} of ${pet.max} HP` : pet.name : trustPlate ? trustPlate : selfTargeted ? `Xanosuke, ${hp} of ${hpMax} HP` : "Home Point"}>{manualTargeted ? <span className="truncate">Field Manual</span> : crystalTargeted ? <span className="truncate">Home Point</span> : field.id ? <><span className="max-w-full truncate font-display text-base leading-none text-ink">{field.name}</span><span className="mt-1 text-[11px] tabular-nums leading-none text-ink">{field.hp} / {field.max}</span></> : targeted ? <><span className="max-w-full truncate font-display text-base leading-none text-ink">{HARE.name}</span><span className={`mt-1 text-[11px] tabular-nums leading-none ${foeHp <= 0 ? "text-muted" : "text-ink"}`}>{foeHp <= 0 ? "Defeated" : `${foeHp} / ${HARE.hpNatural}`}</span></> : pack.id ? <><span className="max-w-full truncate font-display text-base leading-none text-ink">{HARE.name}</span><span className={`mt-1 text-[11px] tabular-nums leading-none ${pack.hp <= 0 ? "text-muted" : "text-ink"}`}>{pack.hp <= 0 ? "Defeated" : `${pack.hp} / ${pack.max}`}</span></> : pet ? <><span className="max-w-full truncate font-display text-base leading-none text-ink">{pet.name}</span>{pet.max > 0 && <span className="mt-1 text-[11px] tabular-nums leading-none text-ink">{pet.hp} / {pet.max}</span>}</> : trustPlate ? <span className="truncate">{trustPlate}</span> : selfTargeted ? <><span className="max-w-full truncate font-display text-base leading-none text-ink">Xanosuke</span><span className="mt-1 text-[11px] tabular-nums leading-none text-ink">{hp} / {hpMax}</span></> : manualTargeted ? <span className="truncate">Field Manual</span> : <span className="truncate">Home Point</span>}</button>}</div>}</div><div className="ml-auto flex shrink-0 flex-col items-end gap-1"><VanadielClock /><YardMap /><ObjectiveTrack /></div></header><div className={`pointer-events-none absolute inset-0 z-30 flex flex-col ${started ? "" : "invisible"}`}>{logOpen && screen === "battle" && <button type="button" aria-label="Close chat" className="pointer-events-auto absolute inset-0 z-20" onClick={() => setLogOpen(false)} />}<div className="relative min-h-0 flex-1">{screen !== "battle" && <div className={`pointer-events-auto absolute inset-0 ${screen === "town" ? "" : "bg-black/55"}`}>{screen === "equipment" && <EquipmentMenu />}{screen === "raids" && <Soon title="Raids" text="Raids are not in the yard yet." />}{screen === "gambits" && <GambitBoard />}{screen === "town" && <TownMap />}</div>}<div className={`absolute inset-x-0 bottom-0 z-30 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-2 p-2 ${screen === "battle" ? "" : "hidden"}`}><button type="button" ref={logPane} aria-expanded={logOpen} onClick={() => setLogOpen(open => !open)} className={`ffxi-frame pointer-events-auto relative z-30 mb-1 w-full px-2 py-1 text-left ${logOpen ? "max-h-64 overflow-y-auto" : "max-h-16 overflow-hidden"}`}>{log.length === 0 && <span className="block truncate text-xs text-muted">The yard is quiet.</span>}{(logOpen ? log : log.slice(-4)).map(line => <span className={`block text-xs ${logOpen ? "" : "truncate"} ${line.kind === "crit" ? "text-gold" : line.kind === "miss" ? "text-muted" : "text-ink"}`} key={line.id}>{line.text}</span>)}</button><div id="fs-stick" className="pointer-events-auto relative size-20 shrink-0 touch-none justify-self-center rounded-full border border-gold bg-navy/80 sm:size-28" aria-hidden><div id="fs-knob" className="absolute top-1/2 left-1/2 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold sm:size-10" /></div><div className="pointer-events-auto mb-1 flex flex-col items-stretch gap-1 justify-self-end">{crystalTargeted && !ko && !engaged && <CrystalInteract />}{manualTargeted && !crystalTargeted && !ko && !engaged && <ManualInteract />}{(targeted || engaged || pack.id || pack.swinging || field.id && field.hp > 0) && !crystalTargeted && !manualTargeted && <>{(targeted || pack.id != null && pack.hp > 0 || field.id != null && field.hp > 0) && <button type="button" onClick={() => useGame.getState().checkTarget()} className="h-10 border border-gold bg-navy px-3 text-sm font-semibold text-gold">Check</button>}<button type="button" onClick={() => useGame.getState().toggleEngage()} className="h-10 border border-gold bg-gold px-3 text-sm font-semibold text-navy">{field.id && field.claimed || engaged || pack.swinging ? "Disengage" : "Engage"}</button></>}{canFish && <button type="button" aria-label="Fish" onPointerDown={event => {
              event.preventDefault();
              event.stopPropagation();
              window.dispatchEvent(new Event("fs-fish-go"));
            }} className="h-10 border border-gold bg-navy px-3 text-sm font-semibold text-gold">Fish</button>}<button type="button" onClick={() => setAfkOpen(true)} className={`h-10 border px-3 text-sm font-semibold ${camp?.active ? "border-gold bg-gold text-navy" : "border-gold bg-navy text-gold"}`}>{camp?.active ? "Camp" : "AFK"}</button><button type="button" onClick={() => useGame.getState().toggleHeal()} className={`h-10 border border-gold px-3 text-sm font-semibold ${healPhase === "off" ? "bg-navy text-gold" : "bg-gold text-navy"}`}>{healPhase === "off" ? "Heal" : "Healing"}</button></div></div></div><div className="pointer-events-auto"><Dock /></div></div>{afkOpen && <AfkPanel onClose={() => setAfkOpen(false)} />}{homeAsk && <div className="absolute inset-0 z-50" onClick={() => useGame.getState().closeHomeAsk()}><div className="ffxi-frame absolute top-1/2 left-1/2 w-72 -translate-x-1/2 -translate-y-1/2 p-4" onClick={event => event.stopPropagation()}><p className="font-display text-2xl leading-none text-gold">Home Point</p><p className="mt-2 text-sm text-ink">Set your home point at this crystal?</p><div className="mt-4 flex flex-col gap-2"><button type="button" onClick={() => useGame.getState().setHomePoint()} className="h-10 border border-gold bg-gold text-sm font-semibold text-navy">Set Home Point</button><button type="button" onClick={() => useGame.getState().healAtCrystal()} className="h-10 border border-gold bg-navy text-sm font-semibold text-gold">Heal</button><button type="button" onClick={() => useGame.getState().closeHomeAsk()} className="h-10 border border-gold bg-navy text-sm font-semibold text-gold">Close</button></div></div></div>}{rivalryAsk === "gallijaux" || rivalryAsk === "joulet" ? <div className="absolute inset-0 z-50" onClick={() => useGame.getState().closeRivalry()}><div className="ffxi-frame absolute top-1/2 left-1/2 w-72 -translate-x-1/2 -translate-y-1/2 p-4" onClick={event => event.stopPropagation()}><p className="font-display text-2xl leading-none text-gold">{rivalryAsk === "gallijaux" ? "The Rivalry" : "The Competition"}</p><p className="mt-2 text-sm text-ink">{rivalryAsk === "gallijaux" ? "Help Gallijaux win the fishing contest against his brother, Joulet?" : "Help Joulet win the fishing contest against his brother, Gallijaux?"}</p><div className="mt-4 flex flex-col gap-2"><button type="button" onClick={() => useGame.getState().acceptRivalry()} className="h-10 border border-gold bg-gold text-sm font-semibold text-navy">Help out</button><button type="button" onClick={() => useGame.getState().closeRivalry()} className="h-10 border border-gold bg-navy text-sm font-semibold text-gold">Refuse</button></div></div></div> : null}{manualPage !== "closed" && manualTargeted && !ko && !engaged && <FieldManual page={manualPage} fov={fov} />}{ko && <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/45"><div className="ffxi-frame w-72 p-4"><p className="font-display text-2xl leading-none text-gold">Knocked out</p><p className="mt-2 text-sm text-ink">You are off the hate list. The enemy does not follow you home, and it does not turn back when you stand up.</p>{pendingRaise && <button type="button" onClick={() => useGame.getState().acceptRaise()} className="mt-4 h-10 w-full border border-gold bg-navy text-sm font-semibold text-gold">{pendingRaise.via ?? pendingRaise.spell} · {pendingRaise.hp} HP</button>}<button type="button" onClick={() => useGame.getState().returnToHomePoint("death")} className={`${pendingRaise ? "mt-2" : "mt-4"} h-10 w-full border border-gold bg-gold text-sm font-semibold text-navy`}>Return</button></div></div>}{bootChecked && !started && !restoring && <div className="ffxi-frame absolute inset-x-0 bottom-0 z-40 p-5 sm:p-6"><p className="font-display text-3xl leading-none text-gold sm:text-4xl">Aetherfold Idle 2</p><p className="mt-1 text-sm text-muted">San d'Oria</p><p className="mt-3 max-w-xl text-sm leading-relaxed text-ink">Move with the stick, WASD, or a double tap on the street. The south bridge zones into West Ronfaure. The north street zones to Northern San d'Oria. The east road zones into East Ronfaure. The chocobo lane is shut. At the end of the port pier, equip a bamboo rod in ranged and a little worm in ammo, then Fish. Tap yourself, a trust, your pet, the Home Point, or a Field Manual. Job and support job are on the Equipment tab.</p><button type="button" onClick={() => useGame.getState().start()} className="mt-4 h-12 min-w-32 border border-gold bg-gold px-6 text-base font-semibold text-navy">Start</button></div>}{(!bootChecked || restoring) && <div className="absolute inset-0 z-[80] flex items-center justify-center bg-[#0c1b38]"><p className="font-display text-lg text-gold">Restoring your yard...</p></div>}</main>;
}
function foodMark(name) {
  return fieldFoodChip(name);
}
function useNearManual() {
  const [near, setNear] = useState(() => nearFieldManual(readPlace().x, readPlace().z));
  useEffect(() => {
    let frame = 0;
    let shown = nearFieldManual(readPlace().x, readPlace().z);
    const tick = () => {
      frame = window.requestAnimationFrame(tick);
      const here = readPlace();
      const next = nearFieldManual(here.x, here.z);
      if (next === shown) return;
      shown = next;
      setNear(next);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);
  return near;
}
function ManualInteract() {
  const near = useNearManual();
  return <button type="button" onClick={() => useGame.getState().openManual()} aria-label={near ? "Interact" : "Too far away"} className={`h-10 border px-3 text-sm font-semibold ${near ? "border-gold bg-navy text-gold" : "border-gold-dim bg-navy text-muted"}`}>{near ? "Interact" : "Too far"}</button>;
}
function FieldManual({ page, fov }) {
  const level = useGame((s) => s.jobLevels?.[s.mainJob] ?? 75);
  const book = readFov(fov);
  const here = readPlace();
  const zone = manualBookAt(here.x, here.z) ?? "west";
  const zoneName = zone === "east" ? "East Ronfaure" : "West Ronfaure";
  const regimes = regimesFor(zone);
  const rows = supportCatalog(level);
  const go = (next) => useGame.getState().setManualPage(next);
  const picked = page.startsWith("repeat:") ? regimeByPage(Number(page.slice("repeat:".length)), zone) : null;
  return <div className="absolute inset-0 z-50" onClick={() => useGame.getState().closeManual()}><div className="ffxi-frame absolute top-1/2 left-1/2 flex max-h-[min(70vh,32rem)] w-[min(22rem,calc(100vw-1.5rem))] -translate-x-1/2 -translate-y-1/2 flex-col p-4" onClick={(event) => event.stopPropagation()}><p className="font-display text-2xl leading-none text-gold">Field Manual</p><p className="mt-1 text-xs text-gold">Tabs {book.tabs ?? 0}</p><div className="mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">{page === "root" && <><p className="text-sm text-ink">{book.active ? `${regimeProgress(book)}${book.repeat ? " · repeats" : ""}.` : "No regime is active."}</p><ManualButton label="Individual Training" onClick={() => go("train")} /><ManualButton label="Field Support" onClick={() => go("support")} /><ManualButton label="Items" onClick={() => go("items")} /><ManualButton label="Weapons" onClick={() => go("weapons")} /><ManualButton label="Armor" onClick={() => go("armor")} />{book.active && <ManualButton label="Cancel regime" onClick={() => useGame.getState().cancelRegime()} />}</>}{page === "train" && regimes.map((row) => {
          const on = book.active && book.book === zone && book.page === row.page;
          return <button key={row.page} type="button" onClick={() => go(`repeat:${row.page}`)} className="border border-gold bg-navy px-3 py-2 text-left"><span className="block text-sm font-semibold text-gold">{row.title}</span><span className="mt-1 block text-xs text-ink">{zoneName} · Lv. {row.level}. {row.exp} EXP. {row.gil} gil and {row.tabs} tabs, once each Vana'diel day.</span>{on && <span className="mt-1 block text-xs text-gold">{regimeProgress(book)} · {book.repeat ? "Repeating" : "Once"}</span>}</button>;
        })}{picked && <><p className="text-sm font-semibold text-gold">{picked.title}</p><p className="text-sm text-ink">Repeat this regime?</p><p className="text-xs text-muted">Yes starts it over when you finish. No is a single page. Only these mobs in {zoneName} count.</p><ManualButton gold label="Yes" onClick={() => useGame.getState().acceptRegime(true)} /><ManualButton label="No" onClick={() => useGame.getState().acceptRegime(false)} /></>}{page === "support" && rows.map((row) => <button key={row.id} type="button" onClick={() => useGame.getState().buyFieldSupport(row.id)} className="border border-gold bg-navy px-3 py-2 text-left"><span className="flex items-baseline justify-between gap-2"><span className="text-sm font-semibold text-gold">{row.name}</span><span className="shrink-0 text-xs text-gold">{row.tabs} tabs</span></span><span className="mt-1 block text-xs text-ink">{row.effect}</span></button>)}{(page === "items" || page === "weapons" || page === "armor") && <p className="text-sm text-ink">Nothing is stocked.</p>}</div><div className="mt-3 flex gap-2">{page !== "root" && <ManualButton label="Back" onClick={() => go(page.startsWith("repeat:") ? "train" : "root")} />}<ManualButton label="Close" onClick={() => useGame.getState().closeManual()} /></div></div></div>;
}
function ManualButton({
  label,
  onClick,
  gold
}) {
  return <button type="button" onClick={onClick} className={`h-10 border border-gold px-3 text-sm font-semibold ${gold ? "bg-gold text-navy" : "bg-navy text-gold"}`}>{label}</button>;
}
function useHomeHere() {
  const [id, setId] = useState(() => homeHere(readPlace().x, readPlace().z));
  useEffect(() => {
    let frame = 0;
    let shown = homeHere(readPlace().x, readPlace().z);
    const tick = () => {
      frame = window.requestAnimationFrame(tick);
      const next = homeHere(readPlace().x, readPlace().z);
      if (next === shown) return;
      shown = next;
      setId(next);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);
  return id;
}
function useNearCrystal() {
  const [near, setNear] = useState(() => {
    const here = readPlace();
    return nearHomeCrystal(here.x, here.z);
  });
  useEffect(() => {
    let frame = 0;
    let shown = nearHomeCrystal(readPlace().x, readPlace().z);
    const tick = () => {
      frame = window.requestAnimationFrame(tick);
      const here = readPlace();
      const next = nearHomeCrystal(here.x, here.z);
      if (next === shown) return;
      shown = next;
      setNear(next);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);
  return near;
}
function CrystalInteract() {
  const near = useNearCrystal();
  return <button type="button" onClick={() => useGame.getState().askHome()} aria-label={near ? "Interact" : "Too far away"} className={`h-10 border px-3 text-sm font-semibold ${near ? "border-gold bg-navy text-gold" : "border-gold-dim bg-navy text-muted"}`}>{near ? "Interact" : "Too far"}</button>;
}
function MoonMark({
  phase
}) {
  return <svg viewBox="0 0 16 16" className="size-4 shrink-0" aria-hidden="true"><defs><clipPath id="vana-moon"><circle cx="8" cy="8" r="6.15" /></clipPath></defs><g clipPath="url(#vana-moon)"><rect width="16" height="16" className="fill-navy" />{phase === "New Moon" ? null : phase === "Full Moon" ? <circle cx="8" cy="8" r="6.15" className="fill-gold" /> : phase === "First Quarter" ? <rect x="8" y="0" width="8" height="16" className="fill-gold" /> : phase === "Last Quarter" ? <rect x="0" y="0" width="8" height="16" className="fill-gold" /> : <><circle cx="8" cy="8" r="6.15" className="fill-gold" />{phase === "Waxing Crescent" && <circle cx="4.4" cy="8" r="6.15" className="fill-navy" />}{phase === "Waning Crescent" && <circle cx="11.6" cy="8" r="6.15" className="fill-navy" />}{phase === "Waxing Gibbous" && <circle cx="-1.9" cy="8" r="6.15" className="fill-navy" />}{phase === "Waning Gibbous" && <circle cx="17.9" cy="8" r="6.15" className="fill-navy" />}</>}</g><circle cx="8" cy="8" r="6.15" fill="none" className="stroke-gold" strokeWidth="1.1" /></svg>;
}
function VanadielClock() {
  const [row, setRow] = useState(null);
  useEffect(() => {
    const tick = () => setRow(vanadielTime());
    tick();
    const id = window.setInterval(tick, 1e3);
    return () => window.clearInterval(id);
  }, []);
  const hh = row ? String(row.hour).padStart(2, "0") : "--";
  const mm = row ? String(row.minute).padStart(2, "0") : "--";
  const tint = row ? ["text-hp", "text-bronze", "text-mp", "text-meadow", "text-sky", "text-gold", "text-ink", "text-muted"][row.weekDay] ?? "text-gold" : "text-gold";
  const dayPart = row ? row.daytime ? "Day" : "Night" : "—";
  return <div className="ffxi-frame flex items-center gap-1.5 whitespace-nowrap px-2 py-1" aria-label={row ? `${row.weekDayName} ${hh}:${mm}, ${row.moonPhase}, ${dayPart}` : "Vana'diel clock"}><p className={`shrink-0 text-[11px] font-semibold leading-none ${tint}`}>{row?.weekDayName ?? "—"}</p><p className="shrink-0 font-display text-sm leading-none tabular-nums text-gold">{hh}:{mm}</p>{row ? <MoonMark phase={row.moonPhase} /> : <span className="text-[11px] leading-none text-muted">—</span>}<p className="shrink-0 text-[11px] leading-none text-ink">{dayPart}</p></div>;
}
function colureName(name) {
  return name.startsWith("Indi-") || name.startsWith("Geo-");
}
function withColure(name, power, skin) {
  if (power == null || !name.startsWith("Indi-") && !name.startsWith("Geo-")) return skin != null ? `${name} ${skin}` : name;
  const brief = colureBrief(name, power);
  return brief ? `${name} ${brief}` : name;
}
function colureNote(name, power) {
  if (power == null || !name.startsWith("Indi-") && !name.startsWith("Geo-")) return null;
  const brief = colureBrief(name, power);
  return brief ? <span className="ml-1">{brief}</span> : null;
}
function clock(seconds) {
  const left = Math.max(0, Math.ceil(seconds));
  const m = Math.floor(left / 60);
  const s = left % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
function SaveChip() {
  const [open, setOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [note, setNote] = useState(null);
  useEffect(() => {
    const onKey = event => {
      if (!event.altKey || !event.shiftKey || event.ctrlKey || event.metaKey) return;
      const tag = event.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (event.code === "KeyS") {
        event.preventDefault();
        setOpen(true);
        saveSettings();
        flushYardMirror();
        setNote("Saved");
      } else if (event.code === "KeyL") {
        event.preventDefault();
        setOpen(true);
        loadNewestSave().then(ok => setNote(ok ? "Loaded" : "No save stored"));
      } else if (event.code === "KeyE") {
        event.preventDefault();
        setOpen(true);
        shareSave().then(label => setNote(label));
      } else if (event.code === "KeyR") {
        event.preventDefault();
        setOpen(true);
        setConfirmReset(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return <div className="pointer-events-auto mt-1.5">{!open ? <button type="button" onClick={() => {
      setConfirmReset(false);
      setOpen(true);
    }} className="border border-gold/40 bg-navy/80 px-1.5 py-0.5 text-[10px] text-gold">Save</button> : <div className="border border-gold/50 bg-navy/95 p-1.5"><div className="flex items-center justify-between gap-2"><p className="text-[10px] font-semibold tracking-wide text-gold">Save</p><button type="button" onClick={() => setOpen(false)} className="text-[10px] text-muted">Close</button></div>{confirmReset ? <div className="mt-1"><p className="text-[10px] leading-snug text-ink">Reset all progress? This cannot be undone.</p><div className="mt-1 flex gap-1"><button type="button" onClick={() => resetProgress()} className="h-7 flex-1 border border-hp bg-hp text-[10px] font-semibold text-navy">Reset</button><button type="button" onClick={() => setConfirmReset(false)} className="h-7 flex-1 border border-gold bg-navy text-[10px] text-gold">Cancel</button></div></div> : <div className="mt-1 grid grid-cols-2 gap-1"><button type="button" onClick={() => {
          saveSettings();
          flushYardMirror();
          setNote("Saved");
        }} className="h-7 border border-gold bg-navy text-[10px] text-gold">Save now</button><button type="button" onClick={() => {
          loadNewestSave().then(ok => setNote(ok ? "Loaded" : "No save stored"));
        }} className="h-7 border border-gold bg-navy text-[10px] text-gold">Load last</button><button type="button" onClick={() => {
          shareSave().then(setNote);
        }} className="h-7 border border-gold bg-navy text-[10px] text-gold">Export</button><button type="button" onClick={() => setConfirmReset(true)} className="h-7 border border-gold bg-navy text-[10px] text-gold">Reset</button></div>}<p className="mt-1 text-[10px] text-muted">{note ?? "Alt+Shift S L E R"}</p></div>}</div>;
}
async function shareSave() {
  const text = exportSaveText();
  const blob = new Blob([text], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "aetherfold-idle-save.json";
  link.click();
  URL.revokeObjectURL(url);
  try {
    await navigator.clipboard.writeText(text);
    return "Copied and downloaded";
  } catch {
    return "Downloaded";
  }
}