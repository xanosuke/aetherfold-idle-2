// @ts-nocheck
/** Recovered from the last successful build after the source file was overwritten. Types were stripped by that build. */
export type Screen = "battle" | "raids" | "equipment" | "gambits" | "town";

import { meleeStats, tryAbility } from "./abilities";
import { attachmentNote, attachmentsThatFit, AUTO_ELEMENT_LABEL, autoAttackProfile, autoFrame, autoHead, automatonCastDelay, automatonCureAmount, automatonCureSpell, automatonHpMax, automatonMpMax, automatonPayMp, automatonPlan, automatonSpellMp, automatonSpellPower, burdenDecay, canAddAttachment, chooseAutomatonWs, cureFrameMod, emptyCapacity, frameAttr, MANEUVER_STAT, maneuverBurden, maneuverStatBonus, overloadChance, replicatorShadows } from "./automaton";
import { ACTINIC_VE, actinicCanReplace, actinicMagicAccuracy, attackDownFactor, badBreathRaw, battleDanceSeconds, blitzRaw, blueAccBonus, blueAttackMult, blueChainProps, blueOrbRaw, blueSpellByName, blueSpellFtp, chaoticCanReplace, chaoticMagicAccuracy, coldWaveFrost, corrosiveOozeRaw, deathRayRaw, diamondhideCanLand, diamondhidePower, digestRaw, dissevermentPoison, ENERV_DEF, exuviationBase, eyesRaw, FEATHER_TICKLE_TP, firespitRaw, FRIGHTFUL_DEF, frostBreathRaw, headButtStunSeconds, healingBreezeBase, healingBreezePower, heatBreathRaw, hecatombWaveRaw, hipPressRaw, iceBreakRaw, JETTA_VE, kissRaw, maelRaw, magicFruitBase, magicHammerRaw, magnetiteCloudRaw, mantleCanReplace, metallicBodyPower, metallicCanLand, mindBlastRaw, mysteriousLightRaw, needlesSplit, nextBlueSet, offerBlueLearn, pineconeSeconds, plantEffectSeconds, poisonBreathRaw, pollenBase, POWER_ATTACK_AZURE_CRIT, queasySeconds, radiantBreathRaw, refuelCanReplace, REGURG_BEHIND, regurgitationRaw, rollPhysicalBlue, saberRaw, sandspinRaw, sandsprayCanReplace, SCREWDRIVER_AZURE_CRIT, SEED_DEF, selfDestructRaw, sheepSongSeconds, SHIFT_VE, SICKLE_AZURE_CRIT, wildCarrotBase, wildCarrotPower } from "./blu";
import { instrumentKind, landSong, pianissimoCast, placeSong, songByName, songSkill, songSlots } from "./brd";
import { CARRIE_HP_STANDIN, carrieDefense, carrieMeleeDamage, carrieSwingSeconds, carrieTpPerHit, FAMILIAR_CHARM_SECONDS, familiarMaxHp, formatCharm, JUG_SECONDS, readyByName, sicMove, wildCarrotHeal } from "./bst";
import { checkLine, queueCheckMark, restBreaksOnDamage, restTick } from "./commands";
import { bankExp, noteDefeat, queueExpMark, expHold } from "./exp";
import { AUTOMATON_OIL, canEquipInSub, canWear, DEFAULT_LOADOUT, derive, FISH_OIL_BROTH, fitLoadout, HARE, hareLiveDefense, ITEMS as ITEMS$1, jugCount, oilCount, PET_FOOD_ZETA, petFoodCount, petFoodCounts, setHareDefenseOverride, tpLostOnWeaponChange } from "./content";
import { choralInterrupt, fighterDoubleAttack, ONE_HOURS, ROLL_RANGE, rollByName, rollCombat, rolledStoreTp, rollFace, quickDrawBonus } from "./cor";
import { aspirFromHit, CHOCOBO_JIG_II_RADIUS, DIVINE_RADIUS, drainFromHit, HEALING_AOE, healingWaltzRemoves, isWaltz, JIG_SECONDS, lethargicEvasion, sambaDaze, SAMBA_DAZE_SECONDS, sluggishDefense, SPECTRAL_SECONDS, waltzHeal, weakenedMagicEvasion } from "./dnc";
import { grimoireSkill, activeStorm, darkArtsHelixBonus, helixElement, helixFirstTock, helixProperty, helixSeconds, helixWord, HELIX_TOCK_CAP, klimaformMacc, KLIMAFORM_MACC, KLIMAFORM_SECONDS, scholarCastAdjust, stepHelix, STORM_SECONDS, stormByName, tickScholar, weatherAdjusted } from "./sch";
import { emboldenDuration, emboldenPotency, isRuneName, newestRune, runeElement, runeEnhancementDamage, runeEnhancementDps, runeOffensive, RUNE_NAMES, tickSwordplay } from "./run";
import { acumenBonus, cardinalAngle, cardinalChant, colureBrief, colureLine, colureMelee, colureNamed, colurePower, colureReaches, colureStat, geoAllies, isRaNuke, luopanDecay, luopanMaxHp } from "./geo";
import { crabMotionSeconds } from "./crab";
import { blockKept, blockRate, blockTaken, guardedPdif, guardRate, shieldSize } from "./defense";
import { autoAttackRange } from "./distance";
import { breathElement, elementalBreathAccuracy, healingBreathAmount, healingBreathTier, healingThreshold, removeBreathFor, SPIRIT_LINK_DOTS, spiritBondSplit, spiritLinkHeal, spiritLinkRegen, WYVERN_DAMAGE_TAKEN, wyvernBreathChoice, wyvernBreathDamage, wyvernDefense, wyvernKind, wyvernMaxHp, wyvernMeleeDamage, wyvernSwingSeconds } from "./drg";
import { consumeManaAdd, occultTp, souleaterStrike } from "./drk";
import { ceLostOnHit, cureEnmity, damageEnmity, foldHate, HATE_DEAGGRO_SECONDS, HATE_NEAR_YARDS, holdClaim, partnerOnLine, thiefStrike, topHate, trickAllyPresent } from "./enmity";
import { accuracyFrom, fStr, hitRate, monsterTpGain, rollSwordPdif, swingTiming, tpPerHit, tpTakenPhysical } from "./formulas";
import { armGambitYield, blankBoard, blankBook, GAMBIT_MEMBER, gambitApproach, gambitDistance, gambitPinsWeaponSkill, saveGambitBook, scanGambit, takeGambitYield } from "./gambits";
import { addendumHold, archeryBar, canUse, findAction, hotbarGroups, marksmanshipBar, rangedBar } from "./hotbar";
import { combinedSkill, PLAYABLE, subjobLevel } from "./jobs";
import { blockedByLock, clearActionLocks, commitLock, lockClock, readLocks, tickActionLocks } from "./locks";
import { applyMab, aquaveilCharges, auspiceAccuracy, auspiceBlockedByEnspell, banishDamage, barResistLabel, barrierDuration, barrierOverwrites, bindWearsOff, BIO_HIT, BIO_SECONDS, bioAttackFactor, bioAttackNumer, bioCanLand, bioPotency, blindPotency, blindTwoPotency, castEnmity, curagaBase, curagaPower, cureBase, cureFinal, curePower, cureUndeadD, DEBUFF_STAT, DEBUFF_STAT_LABEL, debuffTick, DIA_DOT, DIA_HIT, DIA_SECONDS, diaDefenseFactor, diaDefenseNumer, distractPower, elementalCastSeconds, elementalD, elementDebuffPotency, elementResisted, enfeebleCanLand, enfeebleFamily, enhancingDuration, enspellOverwrites, enspellTwoBase, enspellTwoDamage, evasionDownPotency, hastedRecast, hasteMagic, helixD, holyDamage, hymnusOnKo, interruptSkill, isBioSpell, isDiaSpell, isElementBar, isPoisonSpell, isReraiseSpell, isSleepSpell, isSlipSpell, isStatusBar, nextMiseryWound, paralyzeChance, paralyzeTwoChance, phalanxOverwrites, phalanxPower, poisonCanLand, poisongaPotency, poisonPotency, poisonSeconds, PROTECT_DEF, protectPower, refreshPower, REGEN_HP, REGEN_SECONDS, regenPower, REPRISAL_BLOCK, REPRISAL_SKILL, reprisalReflect, RERAISE_SECONDS, reraiseOnKo, resolveBanishDown, resolveElementBar, resolveElementDebuff, resolveRaise, resolveStatusBar, SHELL_CUT, siphonGained, siphonPotency, siphonTaken, sleepCanLand, sleepIsWide, sleepSeconds, slipCanLand, slowPotency, slowTwoPotency, solaceSkin, spellInterruptChance, spikeBase, spikeDamage, statusResisted as statusResisted$1, stoneskinCanLand, stoneskinPower, stoneskinSource, stunCancels, stunInterruptLine, subtleBlow } from "./magic";
import { dodgeGuard, mnkSubtleBlow, monkJobLevel } from "./mnk";
import { landNinjutsu, mijinRaiseHp, stancePower } from "./nin";
import { blankParty, defaultJobLevels, noteTrustBlue, saveJobLevels, saveParty, trustActionGroups, trustArms, trustById, trustCombat, trustGearOf, trustItemId, trustKit, trustLoadout, trustSeats } from "./party";
import { MAJESTY_CURE, MAJESTY_RECAST, sentinelCut, shieldSizeBonus } from "./pld";
import { fStr2, keepAmmo, pairRanged, rangedAttack, rangedHitChance, rangedPdifCap, rangedStrike, rangedTp, shotAimSeconds, MARKSMANSHIP_WS_AIM } from "./ranged";
import { HARE_VS_HARE, physicalRaw, rarabOnRarab, rarabTaken, rollRarabStrike } from "./rarab";
import { claimLive, clearPackSelection, hurtPack, livePack, notePackAct, pullPack, readActedBody, readPackPlate, readSwingBody, readWsBody, togglePackEngage } from "./pack";
import { engageField, fieldById, fieldCard, fieldMeleeReach, fieldStatusPark, fieldStatusSave, fieldTarget, hurtField, keepFieldSteal, peekFieldSteal, readFieldPlate, toggleFieldEngage } from "./ronfaure";
import { CHAINSPELL_CAST_SECONDS, composureDuration, composureEnspell, composureRecast, fastCastRecast, fastCastSeconds } from "./rdm";
import { adjustedMagicEvasion, applyFixedDuration, carolMagicEvasion, chartResistance, composedMagicAccuracy, elementalResistState, resistedDamage, resistFractionLabel, resistIncomingMagic, statusResisted, threnodyElement } from "./resist";
import { barrageShots } from "./rng";
import { meditateGain, meditateTick, tpAfterWeaponSkill, twoHandKind } from "./sam";
import { adoptRevision, boot, bootShouldPersist, browserStorage, chooseYardSource, homeHere, homeStand, isRealProgress, nearHomeCrystal, nextRevision, normalizeProgress, PROGRESS_KEY, progressFromText, readAfkSeconds, readExtra, readPlace, readStoredSave, resetStored, serializeProgress, setAfkSeconds, setExtra, writeHome, writeHotbar, writeJobs, writeLoadout, writePlace, writeSerialized } from "./save";
import { applyMagicBurst, burstChainName, burstElements, burstSteps, chainIsOpen, chainLevel, chainRank, clearChain, magicBurstOf, offerKonzen, offerWeaponSkill, openChainbound, peekChain, readyChains, resonanceProps, restoreSkillchain, skillchainSnapshot, takeChainNote, tickSkillchain } from "./skillchain";
import { APOGEE_WARD, avatarAccuracy, avatarAttack, avatarInt, avatarMeleeBase, avatarMnd, avatarSheet, avatarSwingSeconds, bloodBoon, bloodPactCost, crimsonHowlAttack, dreamShroudCut, earthenWardSkin, eclipticGrowlCut, GLITTER_STATS, glitteringRuby, levelHolyHits, lunarCryCut, pactBindSeconds, pactBurstElement, pactByName, pactMp, pactPayoff, pactPhysicalHits, pactPresses, pactRecastId, pactSkillchain, pactSpendsAvatarTp, pactWardPower, pactWardSeconds, perfectDefenseSeconds, perpetuation, SMN_PACTS, spiritSpellDamage, summonById, summonByName, summonCostsAllMp, summonShowPacts, targetEvasion } from "./smn";
import { castElement, conserveMpCost, cursnaDoomLands, ERASE_NAMED, resolveCleanse, spellAim, spellByName, spellsKnown, takeAilments } from "./spells";
import { vanadielMoonIndex, vanadielTime } from "./vanatime";
import { applyFieldFood, advanceRegime, FIELD_FOOD_NAMES, fovBarrierTier, isFieldFood, manualBookAt, nearFieldManual, readFov, regimeByPage, supportCatalog, vanaDayKey } from "./fov";
import { emptyEquipSets, legalizeEquipSets, legalizeSet, resolveGear, underGear } from "./equipsets";
import { attemptLimit, CRAFTS, craftSkillLine, emptyCraftSkill, emptyCrystals, gearIdForResult, materialOnHand, recipeById, skillAfterSuccess } from "./craft";
import { abandonTrial as dropMagianTrial, beginTrial as openMagianTrial, bonusesFor, clearEnchant as liftMagianEnchant, completeTrial as finishMagianTrial, emptyMagian, REMOVAL_STONE_GIL, sanitizeMagian } from "./magian";
import { CONQUEST_SHOP, RARAB_CRYSTAL, crystalChance, pointsFromExp, rankFromPoints, signetHours } from "./signet";
import { RARAB_DROPS, dropRate } from "./drops";
import { BAG_SLOTS, bagUsed } from "./inventory";
import { campHere, campRefusal, expKpm, gambitShape, measureFarm, nearestGroup, nearestNm, nmFiller, nmPace, partyHelps, previewAfk, zoneGroups, zoneNms, NO_NM, type AfkFarmSave, type CampMode } from "./afk";
import { nmCampModel } from "./ronfaure";
import { scale256 } from "./war";
import { archeryByName, axeByName, blmCanUse, bluCanUse, brdCanUse, bstCanUse, castSword, clubByName, corCanUse, daggerByName, dncCanUse, drgCanUse, drkCanUse, effectiveTp, ftpAt, greatAxeByName, greatKatanaByName, greatSwordByName, HAND_SKILLS, handByName, katanaByName, marksmanshipByName, mnkCanUse, ninCanUse, pldCanUse, polearmByName, pupCanUse, rdmCanUse, rngCanUse, samCanUse, schCanUse, scytheByName, smnCanUse, staffByName, swordByName, thfCanUse, warCanUse, warCanUseArchery, warCanUseAxe, warCanUseClub, warCanUseDagger, warCanUseGreatAxe, warCanUseGreatKatana, warCanUseGreatSword, warCanUseHand, warCanUseKatana, warCanUseMarksmanship, warCanUsePolearm, warCanUseScythe, warCanUseStaff, whmCanUse, runCanUse, geoCanUse } from "./weaponskills";
import { clearYardSave, readYardSave, writeYardSave } from "./yard-save";
import { create, type StoreApi, type UseBoundStore } from "zustand";
import type { Loadout, Sheet } from "./content";
import type { GambitBook } from "./gambits";
import type { DebuffStat } from "./magic";
import type { JobLevels, PartySave } from "./party";
import type { JobId } from "./stats";

type NamedRow = {
	name: string;
	left: number;
	power?: number;
	accDown?: number;
	evaDown?: number;
	dot?: number;
	tier?: number;
	song?: { family?: string } | null;
	acc?: number;
	charges?: number;
	mind?: number;
	skin?: number;
	hold?: boolean;
	spectral?: boolean;
	indiFrom?: string;
	from?: string;
};
type DebuffRow = { name: string; stat: DebuffStat; down: number; left: number; dot?: number; qd?: number; acc?: number };
type PetRow = { id: string; name?: string; hp: number; max: number; tp: number; line?: string };
type TrustBuff = { name: string; left: number; power?: number; charges?: number; hold?: boolean; spectral?: boolean; song?: { family?: string } | null; indiFrom?: string };
type TrustVital = {
	hp: number;
	maxHp: number;
	mp: number;
	maxMp: number;
	tp: number;
	engaged: boolean;
	casting: string | null;
	ko: boolean;
	buffs: TrustBuff[];
};

export type GameState = {
	screen: Screen;
	mainJob: JobId;
	subJob: JobId | null;
	hotbar: (string | null)[];
	buffs: NamedRow[];
	ailments: NamedRow[];
	hareDebuffs: DebuffRow[];
	kinDebuffs: DebuffRow[];
	hareEnfeebles: NamedRow[];
	kinEnfeebles: NamedRow[];
	log: { text: string; kind: string; id?: number }[];
	sheet: Sheet;
	loadout: Loadout;
	pets: PetRow[];
	blueSet: string[];
	blueLearned: string[];
	gambits: GambitBook;
	party: PartySave;
	jobLevels: JobLevels;
	statDown: { name: string; down: number; left: number } | null;
	trustVitals: Record<string, TrustVital>;
	flags: Record<string, unknown>;
	inventory: Record<string, number>;
	recasts: Record<string, number>;
	[key: string]: any;
};
/** Composure triples self-targeted enhancing magic. An area spell is not self-targeted. */
function composeEnhancing(seconds, area) {
	return composureDuration(seconds, !area && liveBuffs.some((buff) => buff.name === "Composure"));
}
var castSeq = 1;
function sheetFor(loadout, race, main, sub, blueSet = []) {
	return derive(loadout, race, main, sub, main === "BLU" ? blueSet : [], bonusesFor(liveMagian));
}
var logSeq = 1;
var yardDistance = 999;
var playerStand = {
	x: 0,
	z: 0
};
var foeStand = {
	x: 0,
	z: 0
};
/** The party member who receives this Trick Attack round, including the weapon skill and the skillchain it closes. */
var trickHateTo = null;
/** Accuracy, AGI, and Assassin for the rest of the round after the first hit spends the buff. */
var trickHand = null;
/** True when the player is in the hare's rear arc. The yard writes this each frame. */
var playerBehind = false;
/** True when the fight target sits inside the player's forward cone. True until the first frame, so a cast that resolves before facing is written still hits a target you are squared to. */
var playerCone = true;
var mijinDown = false;
var liveBuffs = [];
var liveRecasts = {};
var liveHate = {
	ce: 0,
	ve: 0
};
/**
* One row per actor. The player is "player". A trust is their id.
* The mob faces the highest CE+VE. A tie goes to the later stamp.
* A row that computes 0 stays while that actor is inside 30 yalms, at 1 CE.
* Death, a raise, Hide, and 25 seconds past 30 yalms delete the row.
*/
var hateRows = [];
var hateStamp = 0;
/** Same enmity rules as the training dummy, stored on the second Tropical Rarab. */
var kinHateRows = [];
var kinHateStamp = 0;
/** Pulled at least once since the last reset. An empty list walks home. */
var pulled = false;
/** Seconds every living actor on that list has been past 30 yalms. */
var hareAway = 0;
var kinAway = 0;
var liveHareDebuffs = [];
var liveStatDown = null;
/** Bubble Shower. −9 STR. The decay slope is not printed, so it holds for 3 minutes. */
var bubbleStr = 0;
var bubbleStrLeft = 0;
function foeStr() {
	const down = liveEnfeebles.reduce((n, row) => row.name === "STR Down" ? n + (row.power ?? 0) : n, 0) + statDown("str", liveHareDebuffs);
	return Math.max(0, HARE.str - bubbleStr - down);
}
var liveEnfeebles = [];
var kinEnfeebles = [];
/** Magic Defense Down lowers the hare's MDB. A missing potency is Enervation's −8. */
function hareTargetMdb() {
	const row = liveEnfeebles.find((entry) => entry.name === "Magic Defense Down");
	if (!row) return 0;
	return -(row.power ?? 8);
}
var kinDebuffs = [];
/** The lists on the body those enfeeble rows belong to. A borrowed kin strike already swapped the live lists. */
function debuffsFor(enfeebles) {
	if (enfeebles === kinEnfeebles) return kinDebuffs;
	return liveHareDebuffs;
}
function statDown(stat, debuffs) {
	let n = 0;
	for (const row of debuffs) if (row.stat === stat) n += row.down || 0;
	return n;
}
function quarryDebuffs() {
	return playerFoe() === "kin" ? kinDebuffs : liveHareDebuffs;
}
function quarryEnfeebles() {
	return playerFoe() === "kin" ? kinEnfeebles : liveEnfeebles;
}
/** AGI the shot sees. Elemental Frost is `down`. Cold Wave's Frost is `power` on the enfeeble. */
function quarryAgi() {
	const frost = quarryEnfeebles().find((row) => row.name === "Frost");
	return Math.max(0, HARE.agi - statDown("agi", quarryDebuffs()) - (frost?.power ?? 0));
}
/** True while formulas borrowed from the training dummy are resolving on the second Tropical Rarab. */
var strikeKin = false;
/** The forest rabbit a spell is resolving on. Damage must not touch the training pair. */
var strikePackId = null;
var strikeFieldId = null;
/** Statuses sitting on a forest rabbit. The training pair keeps its own lists. */
var packStatuses = /* @__PURE__ */ new Map();
function packStatusNames(id) {
	const held = packStatuses.get(id);
	if (!held) return [];
	return [...held.enfeebles.map((row) => row.name), ...held.debuffs.map((row) => row.name)];
}
/** Statuses on one forest rabbit. Empty when nothing is landed. */
export function readPackStatuses(id) {
	const held = id ? packStatuses.get(id) : null;
	return held ? held.enfeebles : [];
}
function packStatusRows(id) {
	return readPackStatuses(id);
}
function keepPackStatuses(id, enfeebles, debuffs) {
	const nextE = enfeebles.filter((row) => row.left > 0).map((row) => ({ ...row }));
	const nextD = debuffs.filter((row) => row.left > 0).map((row) => ({ ...row }));
	if (!nextE.length && !nextD.length) packStatuses.delete(id);
	else packStatuses.set(id, { enfeebles: nextE, debuffs: nextD });
}
function tickPackStatuses(dt) {
	if (strikePackId || dt <= 0) return;
	for (const [id, held] of packStatuses) {
		const body = livePack().find((row) => row.id === id);
		if (!body || body.hp <= 0 || body.mode === "dead") {
			packStatuses.delete(id);
			continue;
		}
		const nextE = [];
		let dot = 0;
		for (const row of held.enfeebles) {
			if (row.dot != null && row.dot > 0) {
				const step = debuffTick(row.left, row.acc ?? 0, dt);
				if (step.ticks > 0) dot += row.dot * step.ticks;
				if (step.left > 0) nextE.push({
					...row,
					left: step.left,
					acc: step.acc
				});
				else useGame.getState().pushLog(`${row.name} wears off.`, "info");
			} else {
				const left = row.left - dt;
				if (left > 0) nextE.push({
					...row,
					left
				});
				else useGame.getState().pushLog(`${row.name} wears off.`, "info");
			}
		}
		const nextD = [];
		for (const row of held.debuffs) {
			const step = debuffTick(row.left, row.acc ?? 0, dt);
			if (step.ticks > 0 && row.dot) dot += row.dot * step.ticks;
			if (step.left > 0) nextD.push({
				...row,
				left: step.left,
				acc: step.acc
			});
		}
		if (dot > 0) {
			useGame.getState().pushLog(`The ${HARE.name} takes ${dot} points of damage.`, "hit");
			if (strikePack(id, dot)) continue;
		}
		keepPackStatuses(id, nextE, nextD);
	}
}
/**
 * The body a spell already started on. While this is set, the cast does not
 * move to the other Tropical Rarab.
 */
var pinnedFoe = null;
/** A spell keeps the foe it began on. A corpse does not hand that cast to the other body. */
export function spellMarkDown(foeId, hareHp, kinHp) {
	if (foeId === "hare") return hareHp <= 0;
	if (foeId === "kin") return kinHp <= 0;
	return false;
}
export function assertSpellMark() {
	if (!spellMarkDown("hare", 0, 400)) throw new Error("a dead quarry cancels the cast");
	if (spellMarkDown("hare", 40, 0)) throw new Error("a living quarry keeps the cast");
	if (!spellMarkDown("kin", 400, 0)) throw new Error("a dead second rarab cancels the cast");
	if (spellMarkDown("kin", 0, 80)) throw new Error("the other corpse is not this cast");
	if (spellMarkDown(null, 0, 0)) throw new Error("a spell with no foe still finishes");
}
/** The move this swing already chose. Set only for the second body's blow, so the dummy's action bar stays its own. */
var strikerMove = null;
var liveAilments = [];
/** Not applied to the sheet. Taken off when you fall. A raise puts a fresh one on. */
var liveWeakness = null;
/** You fell while Weakness was still up. The icon is gone. The next raise is the double one. */
var fellWhileWeak = false;
/** Set when a KO finds Reraise. Cleared on Return or when that Reraise is accepted. */
var livePending = null;
/**
 * LandSandBoat deletes every status carrying the death flag, and it does not announce it.
 * Weakness has no death flag. Die() still takes the icon off and remembers it for the next raise.
 * Stratagem charges are a job bank, not a status with that flag. Medicine is not one either.
 * Signet, Sanction, Sigil, Ionis, Dedication, and the level and battle markers are the same kind.
 * TP is not cleared. Recasts keep running.
 */
var KEEPS_THROUGH_DEATH = new Set(["Stratagem", "Medicine", "Dedication", "Signet", "Sanction", "Sigil", "Ionis", "Level Sync", "Level Restriction", "Battlefield", "Besieged", "Encumbrance", "Visitant", "Atma", ...FIELD_FOOD_NAMES]);
function statusLostOnDeath() {
	fellWhileWeak = !!(liveWeakness && liveWeakness.left > 0);
	liveWeakness = null;
	liveBuffs = liveBuffs.filter((buff) => KEEPS_THROUGH_DEATH.has(buff.name));
	liveAilments = liveAilments.filter((row) => KEEPS_THROUGH_DEATH.has(row.name));
}
/** What a later Raise should see. The icon is already gone, so the mark stands in for it. */
function weaknessForRaise() {
	if (liveWeakness && liveWeakness.left > 0) return liveWeakness;
	if (fellWhileWeak) return { left: 1, double: false };
	return null;
}
function clearFallenWeak() {
	fellWhileWeak = false;
}
/** Undead special-defense reduction. Not applied to the hare's defense. */
var liveBanish = null;
/** Most recent HP lost while Afflatus Misery is up. Cura spends it. The bonus is not numbered. */
var miseryWound = 0;
/** Connecting rounds already counted for Auspice's Enspell II. Recasting or losing Auspice clears it. */
var auspiceRamp = 0;
function clearAuspiceAccuracy() {
	if (!liveBuffs.some((buff) => buff.name === "Auspice" && (buff.acc ?? 0) > 0)) return;
	liveBuffs = liveBuffs.map((buff) => buff.name === "Auspice" ? {
		...buff,
		acc: 0
	} : buff);
}
var pendingDots = [];
var initialParty = blankParty();
var initialJobLevels = defaultJobLevels();
function makeLiveTrust(id, sub, gear) {
	const sheet = trustCombat(id, sub, gear);
	return {
		hp: sheet.hp,
		mp: sheet.mp,
		maxHp: sheet.hp,
		maxMp: sheet.mp,
		tp: 0,
		ko: false,
		cast: null,
		lock: 0,
		recasts: {},
		buffs: [],
		skipScan: false,
		engaged: false,
		meditateAcc: 0,
		meditateGained: 0,
		regenAcc: 0,
		refreshAcc: 0
	};
}
var liveTrusts = {};
for (const id of initialParty.summoned) if (trustById(id)) liveTrusts[id] = makeLiveTrust(id, initialParty.subs[id] ?? null, trustGearOf(initialParty, id));
function scanBuff(buff) {
	return {
		name: buff.name,
		...buff.tier != null ? { tier: buff.tier } : {},
		...buff.enspell ? { enspell: {
			tier: buff.enspell.tier,
			element: buff.enspell.element
		} } : {}
	};
}
function trustVitalsNow() {
	const out = {};
	for (const [id, trust] of Object.entries(liveTrusts)) out[id] = {
		hp: Math.max(0, Math.floor(trust.hp)),
		mp: Math.max(0, Math.floor(trust.mp)),
		maxHp: trust.maxHp,
		maxMp: trust.maxMp,
		tp: Math.max(0, Math.floor(trust.tp)),
		casting: trust.cast?.name ?? null,
		engaged: trust.engaged,
		ko: trust.ko === true || trust.hp <= 0,
		buffs: trust.buffs.map((buff) => ({
			name: buff.name,
			left: buff.left,
			...buff.power != null ? { power: buff.power } : {},
			...buff.charges != null ? { charges: buff.charges } : {},
			...buff.indiFrom ? { indiFrom: buff.indiFrom } : {},
			...buff.hold ? { hold: true } : {}
		}))
	};
	return out;
}
function sameTrustBuffs(left, right) {
	if (left.length !== right.length) return false;
	return left.every((row, index) => row.name === right[index]?.name && Math.ceil(row.left) === Math.ceil(right[index]?.left ?? -1) && (row.power ?? 0) === (right[index]?.power ?? 0));
}
var initialTrustVitals = trustVitalsNow();
function trustSubOf(party, id) {
	const sub = party.subs[id] ?? null;
	const job = trustById(id)?.job;
	return sub && sub !== job ? sub : null;
}
export function noteDistance(yards) {
	yardDistance = yards;
}
/** Player-to-kin yalms. Charm, Gauge, and Tame use this when the kin is the quarry. */
var kinYards = 6;
export function noteKinYards(yards) {
	kinYards = yards;
}
/** Where the two rabbits are standing. Sic and Fight measure this gap, not the player check. */
var hareAt = {
	x: 0,
	z: 0
};
var kinAt = {
	x: 2.4,
	z: 0
};
export function noteHarePair(hx, hz, kx, kz) {
	hareAt = {
		x: hx,
		z: hz
	};
	kinAt = {
		x: kx,
		z: kz
	};
}
function pairYards() {
	return Math.hypot(hareAt.x - kinAt.x, hareAt.z - kinAt.z);
}
var liveShot = null;
var pendingShotMark = null;
export function rangedShotClock() {
	return liveShot ? {
		...liveShot,
		pair: { ...liveShot.pair },
		...liveShot.ws ? { ws: { ...liveShot.ws } } : {}
	} : null;
}
export function takeShotMark() {
	const mark = pendingShotMark;
	pendingShotMark = null;
	return mark;
}
var quickDrawMarks = [];
function shotTitle(element) {
	if (element === "ice") return "Ice Shot";
	if (element === "wind") return "Wind Shot";
	if (element === "earth") return "Earth Shot";
	if (element === "thunder") return "Thunder Shot";
	if (element === "water") return "Water Shot";
	if (element === "light") return "Light Shot";
	if (element === "dark") return "Dark Shot";
	return "Fire Shot";
}
function queueQuickDrawMark(shot, result, effects, hold, foe) {
	const deals = shot.element !== "light" && shot.element !== "dark";
	const lines = effects.slice();
	if (!deals && lines.length === 0) lines.push("No effect.");
	quickDrawMarks.push({
		name: shotTitle(shot.element),
		dmg: deals ? String(result.bash ?? 0) : "",
		effect: lines.join(" · "),
		element: shot.element,
		foe,
		hold: hold === true
	});
}
/** Player shots wait for the bullet. A trust shot is ready on the next frame. */
export function takeQuickDrawMark(held) {
	const index = quickDrawMarks.findIndex((mark) => held === true ? mark.hold === true : mark.hold !== true);
	if (index < 0) return null;
	const mark = quickDrawMarks[index];
	quickDrawMarks.splice(index, 1);
	return mark;
}
export function releaseHeldQuickDraw() {
	for (const mark of quickDrawMarks) mark.hold = false;
}
function dropNamedBuff(name, line) {
	if (!liveBuffs.some((buff) => buff.name === name)) return false;
	liveBuffs = liveBuffs.filter((buff) => buff.name !== name);
	useGame.getState().pushLog(line, "info");
	return true;
}
function castBreaksMazurka(spell) {
	if (!spell) return false;
	if (spell.song) return songByName(spell.name)?.hostile === true;
	if (spell.nuke || spell.debuff || spell.enfeeble || spell.banish || spell.holy || spell.flash || spell.repose || spell.siphon || spell.blue != null && ("physical" in spell.blue || "magical" in spell.blue || "flash" in spell.blue || "silence" in spell.blue || "song" in spell.blue || "sand" in spell.blue || "orb" in spell.blue || "breath" in spell.blue || "sound" in spell.blue || "ray" in spell.blue || "digest" in spell.blue || "kiss" in spell.blue || "blitz" in spell.blue || "gas" in spell.blue || "gaze" in spell.blue || "mystery" in spell.blue || "venom" in spell.blue || "geist" in spell.blue || "awful" in spell.blue || "saber" in spell.blue || "jetta" in spell.blue || "ice" in spell.blue || "destruct" in spell.blue || "roar" in spell.blue || "cold" in spell.blue || "hold" in spell.blue || "penance" in spell.blue || "mael" in spell.blue || "eyes" in spell.blue || "needles" in spell.blue || "tickle" in spell.blue || "yawn" in spell.blue || "trunk" in spell.blue || "infra" in spell.blue || "spray" in spell.blue || "ooze" in spell.blue || "enerv" in spell.blue || "spit" in spell.blue || "gorge" in spell.blue || "lowing" in spell.blue || "shift" in spell.blue || "hammer" in spell.blue)) return true;
	const kind = spell.nin?.kind;
	return kind === "nuke" || kind === "blind" || kind === "slow" || kind === "poison" || kind === "paralyze";
}
/** The song is already gone from the list. The log names it once. */
function breakPlayerMazurka() {
	if (!liveBuffs.some((buff) => buff.song?.family === "mazurka")) return false;
	liveBuffs = liveBuffs.filter((buff) => buff.song?.family !== "mazurka");
	useGame.setState({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
	useGame.getState().pushLog("Mazurka wears off.", "info");
	return true;
}
function spectralPair(buff) {
	return buff.spectral === true && (buff.name === "Sneak" || buff.name === "Invisible");
}
/** Quickening drops on an attack or on being hit. The spectral pair also drops on a spell or another job ability. */
function abilityTravelMode(name, result) {
	if (name === "Spectral Jig") return null;
	const flourish = name === "Animated Flourish" || name === "Violent Flourish" || name === "Desperate Flourish";
	const step = name === "Quickstep" || name === "Box Step" || name === "Stutter Step";
	if (flourish || step || result?.daze || result?.weight || result?.bash != null) return "offense";
	return "ability";
}
function breakActorTravel(who, mode) {
	const dropQuick = mode === "offense" || mode === "hit";
	const rewrite = (buffs) => {
		let next = buffs;
		const notes = [];
		if (next.some(spectralPair)) {
			next = next.filter((buff) => !spectralPair(buff));
			notes.push("Sneak and Invisible wear off.");
		}
		if (dropQuick && next.some((buff) => buff.name === "Chocobo Jig")) {
			next = next.filter((buff) => buff.name !== "Chocobo Jig");
			notes.push("Chocobo Jig wears off.");
		}
		return { next, notes };
	};
	if (who == null || who === "player") {
		const done = rewrite(liveBuffs);
		if (!done.notes.length) return false;
		liveBuffs = done.next;
		useGame.setState({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
		useGame.getState().pushLog(done.notes.join(" "), "info");
		return true;
	}
	const trust = liveTrusts[who];
	if (!trust) return false;
	const done = rewrite(trust.buffs);
	if (!done.notes.length) return false;
	trust.buffs = done.next;
	const label = trustName(who);
	useGame.setState({ trustVitals: trustVitalsNow() });
	useGame.getState().pushLog(done.notes.map((line) => `${label}'s ${line}`).join(" "), "info");
	return true;
}
function breakPlayerTravel(mode) {
	return breakActorTravel("player", mode);
}
function spendUnlimited(hit) {
	if (hit) dropNamedBuff("Unlimited Shot", "Unlimited Shot wears off.");
}
function openRangedShot(pair, extra) {
	breakPlayerMazurka();
	breakPlayerTravel("offense");
	const state = useGame.getState();
	const velocity = liveBuffs.some((buff) => buff.name === "Velocity Shot");
	const rapidRate = state.sheet.rapidShot;
	const rapidRoll = Math.random();
	const rapidCut = Math.random();
	const snapshot = Math.min(.7, Math.max(0, state.sheet.snapshot));
	// A marksmanship weapon skill starts on the command. It does not aim for the gun's delay.
	const gunSkill = extra.ws != null && pair.family === "marksmanship";
	const aim = gunSkill ? MARKSMANSHIP_WS_AIM : shotAimSeconds(pair.weaponDelay, {
		velocity,
		rapidRate,
		rapidRoll,
		rapidCut,
		snapshot
	});
	const snap = rapidRoll < rapidRate || extra.ws != null;
	let volley = 1;
	if (!extra.ws && !extra.eagle && !extra.bind && liveBuffs.some((buff) => buff.name === "Barrage") && !liveBuffs.some((buff) => buff.name === "Unlimited Shot")) {
		const level = state.mainJob === "RNG" ? 75 : state.subJob === "RNG" ? subjobLevel(75) : 0;
		volley = Math.max(1, barrageShots(level));
		dropNamedBuff("Barrage", "Barrage.");
	}
	if (extra.ws || extra.eagle || extra.bind) dropNamedBuff("Camouflage", "Camouflage wears off.");
	const aimingField = !useGame.getState().targeted ? fieldTarget() : null;
	liveShot = {
		pair,
		aim,
		elapsed: 0,
		landed: false,
		volley,
		eagle: extra.eagle === true,
		bind: extra.bind === true,
		snap,
		fieldId: aimingField ? aimingField.id : null,
		...extra.ws ? { ws: extra.ws } : {}
	};
	commitLock("ranged", aim);
}
function landArcheryWs(shot) {
	const gun = shot.pair?.family === "marksmanship";
	const skillName = gun ? "Marksmanship" : "Archery";
	const state = useGame.getState();
	const ws = shot.ws ? gun ? marksmanshipByName(shot.ws.name) : archeryByName(shot.ws.name) : void 0;
	const miss = (text) => {
		state.pushLog(text, "miss");
		pendingShotMark = {
			text: "Miss",
			hit: false,
			crit: false,
			ws: shot.ws?.name,
			dmg: 0
		};
	};
	if (!ws || !shot.ws || state.ko || struckYards() > autoAttackRange(skillName)) {
		miss(state.ko ? `${shot.ws?.name ?? skillName} misses.` : `${shot.ws?.name ?? skillName} is out of range.`);
		return;
	}
	keepAmmo(shot.pair.ammoId);
	const skill = combinedSkill(skillName, state.mainJob, 75, state.subJob, state.subJob ? subjobLevel(75) : 0);
	const usedTp = effectiveTp(shot.ws.tp, 0);
	const defenseMod = ws.defenseIgnored ? 1 - ftpAt(ws.defenseIgnored, usedTp) : 1;
	const accMod = ws.rangedAcc ? ftpAt(ws.rangedAcc, usedTp) : 0;
	endTrickRound();
	const lined = state.lineThiefStrike("ranged");
	const velocity = liveBuffs.some((buff) => buff.name === "Velocity Shot");
	const sharpshot = liveBuffs.some((buff) => buff.name === "Sharpshot");
	const baseAttack = rangedAttack(state.sheet.str, skill);
	const velocityAttack = velocity ? scale256(baseAttack, 38) : baseAttack;
	const attackMod = ws.attackBonus ? 1 + ftpAt(ws.attackBonus, usedTp) : 1;
	const shotRows = playerFoe() === "kin" ? kinEnfeebles : liveEnfeebles;
	const attack = velocityAttack * attackMod;
	const defense = Math.max(1, foeVitDefense(shotRows) * diaDefenseFactor(shotRows) * defenseMod);
	const cap = rangedPdifCap(gun ? "marksmanship" : "archery") + Math.max(0, state.sheet.pdifCap - 3.25);
	const deadAim = state.sheet.deadAim;
	let firstPdif = true;
	const cast = castSword({
		ws,
		tp: shot.ws.tp,
		fencerTp: 0,
		stats: state.sheet,
		hp: hpCap(),
		currentHp: state.hp,
		dmg: shot.pair.weaponDmg + shot.pair.ammoDmg,
		fstr: fStr2(state.sheet.str - HARE.vit, shot.pair.rank),
		pdif: () => {
			const sure = lined.sure && firstPdif;
			firstPdif = false;
			let pdif = rollSwordPdif(attack / defense, false, Math.random, cap);
			if (sure) {
				pdif = Math.min(cap * 1.25, pdif * 1.25);
				if (deadAim > 0) pdif *= 1 + deadAim;
			}
			return pdif;
		},
		hitRoll: Math.random() * 100,
		hitRate: ws.unavoidable ? 100 : rangedHitChance(accuracyFrom(state.sheet.agi, skill) + state.sheet.accuracyBonus + (sharpshot ? 40 : 0) + accMod + rollCombat(liveBuffs).acc, targetEvasion(HARE.evasion, shotRows), HARE.level - 75, sharpshot),
		doubleAttack: 0,
		delay: shot.pair.weaponDelay + shot.pair.ammoDelay,
		skill,
		mp: state.mp,
		maxMp: state.sheet.mp,
		maxHp: hpCap(),
		targetMp: HARE.mp,
		targetInt: hareInt(),
		level: 75,
		sneakDex: lined.dex,
		sneakVia: lined.via,
		sureHit: lined.sure
	});
	if (shot.ws.grantReturn && cast.kind !== "miss") {
		const returned = Math.floor(cast.tp * rolledStoreTp(state.sheet.storeTp || 1, liveBuffs));
		if (returned > 0) state.setTp(Math.min(3e3, state.tp + returned));
	}
	state.pushLog(`${cast.text} ${ws.effect}`.replace(
		shot.ws.sekkanoki ? /used TP \d+/ : /$^/,
		shot.ws.sekkanoki ? `fTP from ${Math.floor(shot.ws.tp)} TP, spent 1000` : ""
	), cast.kind === "info" ? "info" : cast.kind);
	if (cast.dmg > 0) state.recordSwing({
		hit: true,
		crit: lined.sure,
		dmg: cast.dmg,
		fstr: fStr2(state.sheet.str - HARE.vit, shot.pair.rank),
		base: shot.pair.weaponDmg + shot.pair.ammoDmg,
		ratio: attack / defense,
		pdif: 0
	});
	if (cast.kind !== "miss" && cast.dmg > 0) {
		const hits = Math.max(1, ws.hits);
		for (let i = 0; i < hits; i++) grantPlayerFoeTp(rangedTp(shot.pair));
		const chainTarget = playerFoe() === "kin" ? "kin" : "hare";
		const chain = shot.ws.konzen && !peekChain(ws.chains, chainTarget) ? offerKonzen(ws.chains[0] ?? "", cast.dmg, "player", chainTarget) : offerWeaponSkill(ws.chains, cast.dmg, "player", chainTarget);
		if (chain) {
			if (chain.damage > 0) {
				if (chain.target === "kin") {
					creditKinDamage(chain.damage);
					const dead = chipKin(chain.damage);
					const woke = !dead && clearKinSleep();
					const unbound = !dead && clearKinBind(chain.damage);
					useGame.setState((s) => ({
						dealt: s.dealt + chain.damage,
						kinHp: liveKinHp,
						...kinHateState(),
						kinEnfeebles: kinEnfeebles.map((row) => ({ ...row })),
						kinDebuffs: kinDebuffs.map((row) => ({ ...row }))
					}));
					if (woke) state.pushLog(`The ${HARE.name} wakes.`, "info");
					if (unbound) state.pushLog(`The ${HARE.name}'s Bind effect wears off.`, "info");
				} else {
					creditDamage(chain.damage);
					const dead = chipHare(chain.damage);
					const woke = !dead && clearSleep();
					const unbound = !dead && bindWearsOff(chain.damage) && clearBind();
					useGame.setState((s) => ({
						dealt: s.dealt + chain.damage,
						hareHp: liveHareHp,
						...hateNow(),
						hareEnfeebles: liveEnfeebles.map((row) => ({ ...row })),
						hareDebuffs: liveHareDebuffs.map((row) => ({ ...row })),
						statDown: liveStatDown ? {
							name: liveStatDown.name,
							stat: "int",
							down: liveStatDown.down,
							left: liveStatDown.left
						} : null
					}));
					if (woke) state.pushLog(`The ${HARE.name} wakes.`, "info");
					if (unbound) state.pushLog(`The ${HARE.name}'s Bind effect wears off.`, "info");
				}
			}
			state.pushLog(`${chain.name} skillchain. ${chain.damage} damage.`, "hit");
		} else {
			const noted = takeChainNote();
			if (noted?.held) state.pushLog(`${noted.held} holds. It lands when the window opens.`, "info");
			else if (noted?.resonating?.length) state.pushLog(`${noted.resonating.join(" / ")} resonates.`, "info");
		}
	}
	pendingShotMark = {
		text: cast.kind === "miss" ? "Miss" : String(cast.dmg),
		hit: cast.kind !== "miss",
		crit: lined.sure,
		ws: ws.name,
		dmg: cast.dmg
	};
	spendUnlimited(cast.kind !== "miss");
	const sniper = ws.name === "Sniper Shot" && cast.kind === "hit" ? landMarksmanshipStatus(ws.name, true) : null;
	if (sniper) state.pushLog(sniper, "info");
	useGame.setState({
		buffs: liveBuffs.map((buff) => ({ ...buff })),
		...sniper ? { statDown: {
			name: "Sniper Shot",
			stat: "int",
			down: 10,
			left: 140
		} } : {}
	});
}
function landRangedShot(shot) {
	const fieldPark = shot.fieldId ? beginPackStrike(shot.fieldId) : null;
	if (shot.fieldId && !fieldPark) {
		useGame.getState().pushLog("The shot finds nothing.", "miss");
		return;
	}
	try {
	if (shot.ws) {
		landArcheryWs(shot);
		syncGear();
		return;
	}
	const state = useGame.getState();
	keepAmmo(shot.pair.ammoId);
	const blank = {
		hit: false,
		crit: false,
		dmg: 0,
		fstr: 0,
		base: 0,
		ratio: 0,
		pdif: 0
	};
	const flags = {
		...shot.eagle ? { eagle: true } : {},
		...shot.bind ? { bind: true } : {},
		...shot.volley > 1 ? { volley: shot.volley, barrage: true, hits: 0 } : {}
	};
	if (state.ko || struckYards() > autoAttackRange(shot.pair.skillName)) {
		state.pushLog(shot.bind ? `Shadowbind misses the ${HARE.name}.` : shot.eagle ? "Eagle Eye Shot misses." : `Xanosuke misses the ${HARE.name}.`, "miss");
		if (!shot.bind) state.recordSwing(blank);
		pendingShotMark = {
			text: "Miss",
			hit: false,
			crit: false,
			...flags
		};
		return;
	}
	const shotRows = playerFoe() === "kin" ? kinEnfeebles : liveEnfeebles;
	const skill = combinedSkill(shot.pair.skillName, state.mainJob, 75, state.subJob, state.subJob ? subjobLevel(75) : 0);
	const sharpshot = liveBuffs.some((buff) => buff.name === "Sharpshot");
	const velocity = liveBuffs.some((buff) => buff.name === "Velocity Shot");
	const accBonus = state.sheet.accuracyBonus + (sharpshot ? 40 : 0) + rollCombat(liveBuffs).acc;
	let furyNumer = 0;
	let precision = 0;
	for (const buff of liveBuffs) {
		const colure = colureMelee(buff.name, buff.power ?? 0);
		if (String(buff.name).endsWith("Fury")) furyNumer += colure.attackNumer;
		if (String(buff.name).endsWith("Precision")) precision += colure.accuracy;
	}
	const shotStr = state.sheet.str + colureStat(liveBuffs, "STR");
	const shotAgi = state.sheet.agi + colureStat(liveBuffs, "AGI");
	const pdifBonus = Math.max(0, state.sheet.pdifCap - 3.25);
	if (shot.bind) {
		const chance = rangedHitChance(accuracyFrom(shotAgi, skill) + accBonus + precision, targetEvasion(HARE.evasion, shotRows), HARE.level - 75, sharpshot);
		const hit = Math.random() * 100 < chance;
		if (hit) {
			if (playerFoe() === "kin") {
				kinEnfeebles = kinEnfeebles.filter((row) => row.name !== "Bind");
				kinEnfeebles = [...kinEnfeebles, {
					name: "Bind",
					left: 30
				}];
				useGame.setState({ kinEnfeebles: kinEnfeebles.map((row) => ({ ...row })) });
			} else {
				liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Bind");
				liveEnfeebles = [...liveEnfeebles, {
					name: "Bind",
					left: 30
				}];
				useGame.setState({ hareEnfeebles: liveEnfeebles.map((row) => ({ ...row })) });
			}
			state.pushLog(`Shadowbind binds the ${HARE.name}.`, "info");
		} else state.pushLog(`Shadowbind misses the ${HARE.name}.`, "miss");
		pendingShotMark = {
			text: hit ? "Bind" : "Miss",
			hit,
			crit: false,
			bind: true
		};
		return;
	}
	const fireOne = (ftp) => {
		const lined = state.lineThiefStrike("ranged");
		return {
			lined,
			struck: rangedStrike({
				pair: shot.pair,
				str: shotStr,
				agi: shotAgi,
				skill,
				targetVit: HARE.vit,
				targetEva: targetEvasion(HARE.evasion, shotRows),
				targetDef: foeVitDefense(shotRows) * diaDefenseFactor(shotRows),
				targetLevel: HARE.level,
				attackerLevel: 75,
				sneakDex: lined.dex,
				sure: lined.sure,
				rng: Math.random,
				targetAgi: Math.max(0, HARE.agi - (shotRows.find((row) => row.name === "Frost")?.power ?? 0) - statDown("agi", debuffsFor(shotRows))),
				accBonus: accBonus + precision,
				sharpshot,
				velocity,
				attackNumer: furyNumer,
				deadAim: state.sheet.deadAim,
				pdifBonus,
				...ftp != null ? { ftp } : {}
			})
		};
	};
	const noteHit = (struck, meikyo) => {
		if (struck.hit && !meikyo) {
			const gain = Math.floor(rangedTp(shot.pair) * rolledStoreTp(state.sheet.storeTp || 1, liveBuffs));
			state.setTp(Math.min(3e3, useGame.getState().tp + gain));
		}
		if (struck.hit) grantPlayerFoeTp(rangedTp(shot.pair));
		state.recordSwing({
			hit: struck.hit,
			crit: struck.crit,
			dmg: struck.dmg,
			fstr: struck.fstr2,
			base: struck.base,
			ratio: struck.ratio,
			pdif: struck.pdif
		});
	};
	if (shot.eagle) {
		const { lined, struck } = fireOne(5);
		noteHit(struck, state.buffs.some((buff) => buff.name === "Meikyo Shisui"));
		const points = struck.dmg === 1 ? "point" : "points";
		const sneak = lined.via ? struck.crit && lined.dex > 0 ? ` ${lined.via} +${lined.dex} DEX.` : ` ${lined.via}.` : "";
		state.pushLog(struck.hit ? `Eagle Eye Shot ${struck.crit ? "critically hits" : "hits"} the ${HARE.name} for ${struck.dmg} ${points} of damage.${sneak}` : "Eagle Eye Shot misses.", struck.crit ? "crit" : struck.hit ? "hit" : "miss");
		pendingShotMark = {
			text: struck.hit ? struck.crit ? `${struck.dmg}!` : String(struck.dmg) : "Miss",
			hit: struck.hit,
			crit: struck.crit,
			eagle: true,
			dmg: struck.dmg
		};
		spendUnlimited(struck.hit);
		useGame.setState({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
		return;
	}
	const volley = Math.max(1, shot.volley ?? 1);
	let total = 0;
	let hits = 0;
	let anyHit = false;
	let anyCrit = false;
	const meikyo = liveBuffs.some((buff) => buff.name === "Meikyo Shisui");
	for (let i = 0; i < volley; i++) {
		const { lined, struck } = fireOne();
		noteHit(struck, meikyo);
		if (struck.hit) {
			anyHit = true;
			hits += 1;
			total += struck.dmg;
			if (struck.crit) anyCrit = true;
		}
		if (volley === 1) {
			const points = struck.dmg === 1 ? "point" : "points";
			const verb = struck.crit ? "critically hits" : "hits";
			const sneak = lined.via ? struck.crit && lined.dex > 0 ? ` ${lined.via} +${lined.dex} DEX.` : ` ${lined.via}.` : "";
			state.pushLog(struck.hit ? `Xanosuke ${verb} the ${HARE.name} for ${struck.dmg} ${points} of damage.${sneak}` : `Xanosuke misses the ${HARE.name}.`, struck.crit ? "crit" : struck.hit ? "hit" : "miss");
		}
	}
	if (volley > 1) {
		const points = total === 1 ? "point" : "points";
		state.pushLog(anyHit ? `Barrage hits the ${HARE.name} for ${total} ${points} of damage.` : `Barrage misses the ${HARE.name}.`, anyCrit ? "crit" : anyHit ? "hit" : "miss");
	}
	pendingShotMark = {
		text: anyHit ? anyCrit ? `${total}!` : String(total) : "Miss",
		hit: anyHit,
		crit: anyCrit,
		dmg: total,
		...volley > 1 ? { volley, barrage: true, hits } : {}
	};
	spendUnlimited(anyHit);
	useGame.setState({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
	} finally {
		if (fieldPark) endPackStrike(fieldPark);
	}
}
function advanceRangedShot(dt) {
	if (!liveShot) return;
	if (useGame.getState().ko) {
		liveShot = null;
		return;
	}
	const elapsed = liveShot.elapsed + dt;
	liveShot = {
		...liveShot,
		elapsed
	};
	if (!liveShot.landed && elapsed >= liveShot.aim) {
		liveShot = {
			...liveShot,
			landed: true
		};
		landRangedShot(liveShot);
	}
	if (liveShot && elapsed >= liveShot.aim + 1) liveShot = null;
}
var gambitClose = false;
/** Yards from you to each trust. Missing means that trust is not in the yard. */
var trustPlaces = {};
/** Where a trust is walking so a gambit can reach. Cleared once the action is in range. */
var trustSteps = {};
var PARTY_RADIUS = 10;
var PARTY_CAST_RANGE = 20;
/** Party abilities with a printed radius. The user is inside their own area. */
var PARTY_ABILITY = {
	Warcry: 13.9,
	Rampart: 13,
	"Ancient Circle": 10,
	Valiance: 14
};
/** One trust's distance to the hare, whether that weapon reaches, and yards back to you. */
export function noteTrustPlace(id, yards, inRange, party, x, z) {
	const prev = trustPlaces[id];
	trustPlaces[id] = {
		yards,
		melee: inRange,
		party,
		x: x ?? prev?.x ?? 0,
		z: z ?? prev?.z ?? 0
	};
	if (id === "kupipi") {}
}
export function clearTrustPlace(id) {
	delete trustPlaces[id];
	delete trustSteps[id];
	if (id === "kupipi") {}
}
function noteTrustStep(id, step) {
	if (!step) delete trustSteps[id];
	else trustSteps[id] = step;
}
export function trustStep(id) {
	return trustSteps[id] ?? null;
}
/** Where another trust is standing, once the yard has placed them. */
export function trustSpot(id) {
	const row = trustPlaces[id];
	if (!row || row.yards >= 90) return null;
	return {
		x: row.x,
		z: row.z
	};
}
function trustName(id) {
	if (id === "player" || id === GAMBIT_MEMBER) return "Xanosuke";
	return trustById(id)?.name ?? "Trust";
}
function summonedTrustIds() {
	return useGame.getState().party.summoned.filter((id) => trustById(id) != null && liveTrusts[id] && !liveTrusts[id].ko);
}
function yardsFrom(casterId, otherId) {
	if (casterId === otherId) return 0;
	const from = trustPlaces[casterId];
	const to = trustPlaces[otherId];
	if (!from || !to) return 99;
	return Math.hypot(from.x - to.x, from.z - to.z);
}
/** Trusts standing inside a cast centered on this trust, including the caster. */
function trustsInRadius(casterId, radius) {
	return summonedTrustIds().filter((id) => yardsFrom(casterId, id) <= radius);
}
var partySplashNames = [];
function partyNote(result) {
	if (result === "none") return " You are the only one here.";
	if (result === "far") return " A trust is out of range.";
	if (result === "weak") return " No effect.";
	if (partySplashNames.length === 0) return "";
	return ` ${partySplashNames.join(", ")} receives it.`;
}
function putTrustStatus(trust, next, drop, tierGate) {
	if (tierGate) {
		const current = trust.buffs.find(drop);
		if (current && next.tier != null && !barrierOverwrites(current.tier ?? null, next.tier)) return false;
	}
	trust.buffs = [...trust.buffs.filter((buff) => !drop(buff)), next];
	return true;
}
/** Area status on every trust standing inside the radius. */
function splashTrust(radius, next, drop, tierGate) {
	const ids = summonedTrustIds();
	if (ids.length === 0) return "none";
	partySplashNames = [];
	let far = false;
	let weak = false;
	for (const id of ids) {
		const trust = liveTrusts[id];
		const place = trustPlaces[id];
		if (!trust || !place || place.party > radius) {
			far = true;
			continue;
		}
		if (putTrustStatus(trust, next, drop, tierGate)) partySplashNames.push(trustName(id));
		else weak = true;
	}
	if (partySplashNames.length > 0) return "hit";
	if (far && !weak) return "far";
	return "weak";
}
function grantPlayerStatus(next, drop, tierGate) {
	if (useGame.getState().ko) return "none";
	if (tierGate) {
		const current = liveBuffs.find(drop);
		if (current && next.tier != null && !barrierOverwrites(current.tier ?? null, next.tier)) return "weak";
	}
	liveBuffs = [...liveBuffs.filter((buff) => !drop(buff)), next];
	return "hit";
}
function trustComposed(seconds, caster, onSelf) {
	return composureDuration(seconds, onSelf && caster.buffs.some((buff) => buff.name === "Composure"));
}
function enhancingWho(casterId, targetId) {
	if (targetId === "player") return GAMBIT_MEMBER;
	if (targetId && targetId !== casterId && liveTrusts[targetId] && !liveTrusts[targetId].ko) return targetId;
	return casterId;
}
function enhancingNear(casterId, who, range) {
	if (who === casterId) return true;
	if (casterId === "player" || casterId === GAMBIT_MEMBER) {
		if (who === "player" || who === GAMBIT_MEMBER) return true;
		return (trustPlaces[who]?.party ?? 99) <= range;
	}
	if (who === "player" || who === GAMBIT_MEMBER) return (trustPlaces[casterId]?.party ?? 99) <= range;
	return yardsFrom(casterId, who) <= range;
}
function recipientName(id) {
	return id === "player" ? "Xanosuke" : trustName(id);
}
function statusTier(who, name) {
	return (who === "player" ? liveBuffs : liveTrusts[who]?.buffs ?? []).find((buff) => buff.name === name)?.tier ?? null;
}
function statusPower(who, name) {
	return (who === "player" ? liveBuffs : liveTrusts[who]?.buffs ?? []).find((buff) => buff.name === name)?.power ?? null;
}
function shieldBonus(who) {
	if (who === "player") return useGame.getState().sheet.shieldBarrier;
	const state = useGame.getState();
	return trustCombat(who, trustSubOf(state.party, who), trustGearOf(state.party, who)).shieldBarrier;
}
/** A finished trust spell lands on the player or on one trust. Stoneskin's absorb is `skin` on you and `power` on a trust. */
function giveStatus(who, next, drop, tierGate) {
	if (who === "player") {
		if (useGame.getState().ko) return false;
		return grantPlayerStatus(next.name === "Stoneskin" ? {
			name: next.name,
			left: next.left,
			skin: next.power,
			skinFrom: next.skinFrom ?? "spell"
		} : next, drop, tierGate) === "hit";
	}
	const row = liveTrusts[who];
	if (!row || row.ko) return false;
	return putTrustStatus(row, next, drop, tierGate);
}
function named(names) {
	if (names.length === 0) return "";
	return ` ${names.join(", ")} ${names.length === 1 ? "receives" : "receive"} it.`;
}
/**
* Warcry and Rampart are party auras. A trust is the center when casterId is set.
* The player is the center when it is null. The caster already has the buff.
*/
function splashPartyAbility(name, left, power, casterId) {
	const radius = PARTY_ABILITY[name];
	if (radius == null) return [];
	const next = {
		name,
		left,
		...power != null ? { power } : {}
	};
	const drop = (buff) => buff.name === name;
	const blocked = (buffs) => name === "Valiance" && buffs.some((buff) => buff.name === "Vallation");
	if (casterId == null) {
		if (name !== "Valiance") return splashTrust(radius, next, drop, false) === "hit" ? partySplashNames.slice() : [];
		const names = [];
		for (const id of summonedTrustIds()) {
			const trust = liveTrusts[id];
			const place = trustPlaces[id];
			if (!trust || !place || place.party > radius) continue;
			if (blocked(trust.buffs)) continue;
			if (putTrustStatus(trust, next, drop, false)) names.push(trustName(id));
		}
		return names;
	}
	const names = [];
	for (const id of trustsInRadius(casterId, radius)) {
		if (id === casterId) continue;
		const row = liveTrusts[id];
		if (!row || row.ko) continue;
		if (blocked(row.buffs)) continue;
		if (putTrustStatus(row, next, drop, false)) names.push(trustName(id));
	}
	if (!useGame.getState().ko && (trustPlaces[casterId]?.party ?? 99) <= radius && !blocked(liveBuffs) && grantPlayerStatus(next, drop, false) === "hit") names.push("Xanosuke");
	return names;
}
function partyMainJobs() {
	const jobs = [useGame.getState().mainJob];
	for (const id of useGame.getState().party.summoned) {
		const job = trustById(id)?.job;
		if (job) jobs.push(job);
	}
	return jobs;
}
function corsairCastFields(input) {
	return {
		corLevel: input.main === "COR" ? input.mainLevel : input.sub === "COR" ? input.subLevel : 0,
		corMain: input.main === "COR",
		rolls: input.buffs.filter((buff) => buff.name.endsWith("Roll")).map((buff) => ({
			name: buff.name,
			left: buff.left,
			power: buff.power ?? 0
		})),
		bustPower: input.buffs.find((buff) => buff.name === "Bust")?.power ?? 0,
		snake: input.buffs.some((buff) => buff.name === "Snake Eye"),
		die: 1 + Math.floor(Math.random() * 6),
		partyJobs: partyMainJobs(),
		waiting: Object.keys(input.recasts).filter((name) => (input.recasts[name] ?? 0) > 0),
		gun: input.gun,
		bullet: input.bullet,
		gunDmg: input.gunDmg,
		bulletDmg: input.bulletDmg,
		agi: input.agi,
		targetAgi: quarryAgi()
	};
}
const STEP_DAZE = {
	Quickstep: "Lethargic Daze",
	"Box Step": "Sluggish Daze",
	"Stutter Step": "Weakened Daze"
};
const STEP_DAZE_NAMES = new Set(Object.values(STEP_DAZE));
var stepStacks = { hare: {}, kin: {} };
function stepWho() {
	return playerFoe() === "kin" ? "kin" : "hare";
}
function stackBucket(who) {
	return who === "kin" ? stepStacks.kin : stepStacks.hare;
}
function rememberStep(who, name, level, left) {
	if (!STEP_DAZE_NAMES.has(name) || level <= 0 || left <= 0) return;
	stackBucket(who)[name] = { level, left };
}
function clearStepStacks(who) {
	if (who === "kin") stepStacks.kin = {};
	else stepStacks.hare = {};
}
function rowsForStep() {
	const who = stepWho();
	const live = who === "kin" ? kinEnfeebles : liveEnfeebles;
	const shown = who === "kin" ? useGame.getState().kinEnfeebles ?? [] : useGame.getState().hareEnfeebles ?? [];
	const rows = live.map((row) => ({ ...row }));
	const liveNames = new Set(rows.filter((row) => STEP_DAZE_NAMES.has(row.name)).map((row) => row.name));
	const fill = (row) => {
		if (!row || !STEP_DAZE_NAMES.has(row.name)) return;
		const level = Math.max(0, Math.floor(row.power ?? row.level ?? 0));
		const left = row.left ?? 0;
		if (level <= 0 || left <= 0) return;
		const have = rows.find((entry) => entry.name === row.name);
		if (!have) {
			rows.push({
				name: row.name,
				power: level,
				left,
				...row.evaDown != null ? { evaDown: row.evaDown } : {}
			});
			return;
		}
		if (level > (have.power ?? 0)) have.power = level;
		if (!liveNames.has(row.name) && left > (have.left ?? 0)) have.left = left;
	};
	for (const row of shown) fill(row);
	const bucket = stackBucket(who);
	for (const name of Object.keys(bucket)) fill({ name, power: bucket[name]?.level ?? 0, left: bucket[name]?.left ?? 0 });
	return rows;
}
function holdStepStacks(who, before, next, dt) {
	const bucket = stackBucket(who);
	const beforeNames = new Set(before.filter((row) => STEP_DAZE_NAMES.has(row.name)).map((row) => row.name));
	for (const name of Object.keys(bucket)) {
		const still = next.find((row) => row.name === name);
		if (still) {
			const level = Math.max(bucket[name].level, Math.floor(still.power ?? 0));
			if ((still.power ?? 0) < level) {
				still.power = level;
				if (name === "Lethargic Daze") still.evaDown = lethargicEvasion(level);
			}
			bucket[name] = { level, left: still.left };
			continue;
		}
		if (beforeNames.has(name)) {
			delete bucket[name];
			useGame.getState().pushLog(`${name} wears off.`, "info");
			continue;
		}
		const left = bucket[name].left - dt;
		if (left <= 0) {
			delete bucket[name];
			useGame.getState().pushLog(`${name} wears off.`, "info");
			continue;
		}
		bucket[name].left = left;
		const level = bucket[name].level;
		next.push({
			name,
			left,
			power: level,
			...name === "Lethargic Daze" ? { evaDown: lethargicEvasion(level) } : {}
		});
	}
}
function dancerCastFields(input) {
	const label = STEP_DAZE[input.ability];
	const rows = input.enfeebles ?? [];
	const stepRow = label ? rows.find((row) => row.name === label) : null;
	return {
		dncLevel: input.main === "DNC" ? input.mainLevel : input.sub === "DNC" ? input.subLevel : 0,
		dncMain: input.main === "DNC",
		tp: input.tp ?? 0,
		finishing: input.buffs.find((buff) => buff.name === "Finishing Move")?.power ?? 0,
		trance: input.buffs.some((buff) => buff.name === "Trance"),
		contradance: input.buffs.some((buff) => buff.name === "Contradance"),
		chr: input.chr ?? 0,
		hitRoll: Math.random(),
		dazeLevel: stepRow?.power ?? 0,
		dazeLeft: stepRow?.left ?? 0,
		waltzAlly: input.waltzAlly === true,
		waltzCenter: input.waltzCenter ?? "self",
		sneak: input.buffs.some((buff) => buff.name === "Sneak"),
		flee: input.buffs.some((buff) => buff.name === "Flee"),
		chainOpen: input.chainOpen === true,
		stunRoll: Math.random()
	};
}
function scholarCastFields(input) {
	const buffs = input.buffs ?? [];
	const charging = buffs.find((buff) => buff.name === "Sublimation");
	const done = buffs.find((buff) => buff.name === "Sublimation: Complete");
	const helix = (input.enfeebles ?? []).find((row) => row.name === "Helix");
	return {
		schLevel: input.main === "SCH" ? input.mainLevel : input.sub === "SCH" ? input.subLevel : 0,
		schMain: input.main === "SCH",
		lightArts: buffs.some((buff) => buff.name === "Light Arts"),
		darkArts: buffs.some((buff) => buff.name === "Dark Arts"),
		tabula: buffs.some((buff) => buff.name === "Tabula Rasa"),
		charges: buffs.find((buff) => buff.name === "Stratagem")?.power ?? 0,
		sublimation: charging?.power ?? done?.power ?? 0,
		sublimationComplete: done != null,
		helixLeft: helix?.left ?? 0,
		helixModus: helix?.power === 1
	};
}
const RUNE_SET = new Set(RUNE_NAMES);
function runeCastFields(input) {
	return {
		runLevel: input.main === "RUN" ? input.mainLevel : input.sub === "RUN" ? input.subLevel : 0,
		runMain: input.main === "RUN",
		runes: (input.buffs ?? []).filter((buff) => RUNE_SET.has(buff.name)).map((buff) => ({
			name: buff.name,
			left: buff.left,
			power: buff.power ?? 0
		})),
		combatSkill: input.skill ?? 0,
		divine: input.divine ?? 0,
		str: input.str ?? 0,
		dex: input.dex ?? 0,
		agi: input.agi ?? 0,
		int: input.int ?? 0,
		mnd: input.mnd ?? 0,
		chr: input.chr ?? 0,
		shadows: 0,
		targetHp: input.targetHp ?? null
	};
}
function geoCastFields(input) {
	const buffs = input.buffs ?? [];
	return {
		geoLevel: input.main === "GEO" ? input.mainLevel : input.sub === "GEO" ? input.subLevel : 0,
		geoMain: input.main === "GEO",
		luopan: luopan != null,
		luopanHp: luopan?.hp ?? 0,
		luopanMax: luopan?.max ?? 0,
		luopanMp: luopan?.mp ?? 0,
		bolster: buffs.some((buff) => buff.name === "Bolster"),
		eclipticOn: luopan?.ecliptic === true,
		lastingOn: luopan?.lasting === true
	};
}
/** Fields the gambit scan must hand to tryAbility. Without them a Scholar reads as level 0 and Dark Arts never matches. */
function scanAbilityFields(input) {
	const main = input.main;
	const sub = input.sub;
	const mainLevel = input.mainLevel;
	const subLevel = input.subLevel;
	const buffs = input.buffs ?? [];
	const drgTrust = input.trust === true && main === "DRG";
	const bstTrust = input.trust === true && main === "BST";
	const pupTrust = input.trust === true && main === "PUP";
	const smnTrust = input.trust === true && main === "SMN";
	const herWyvern = drgTrust ? trustWyvern() : null;
	const herJug = bstTrust ? trustJug() : null;
	const herAuto = pupTrust ? trustAuto() : null;
	const herAvatar = smnTrust ? trustAvatarPet() : null;
	return {
		seigan: buffs.some((buff) => buff.name === "Seigan"),
		drgLevel: main === "DRG" ? mainLevel : sub === "DRG" ? subLevel : 0,
		drgMain: main === "DRG",
		wyvernOut: drgTrust ? herWyvern != null : input.trust ? false : wyvern != null,
		wyvernFull: drgTrust ? herWyvern != null && herWyvern.hp >= herWyvern.max : !input.trust && wyvern != null && wyvern.hp >= wyvern.max,
		surge: buffs.some((buff) => buff.name === "Spirit Surge"),
		smnLevel: main === "SMN" ? mainLevel : sub === "SMN" ? subLevel : 0,
		smnMain: main === "SMN",
		avatarOut: smnTrust ? herAvatar != null : input.trust ? false : avatar != null,
		avatarSpirit: smnTrust ? herAvatar?.spirit === true : input.trust ? false : avatar?.spirit === true,
		summoning: input.summoning ?? 0,
		bstLevel: main === "BST" ? mainLevel : sub === "BST" ? subLevel : 0,
		bstMain: main === "BST",
		jugOut: bstTrust ? herJug != null : input.trust ? false : jug != null,
		charmOut: bstTrust ? (charmOwner === "lhu-mhakaracca" && charm != null) || (packCharm != null && packCharm.owner === "lhu-mhakaracca") : input.trust ? false : charm != null || packCharm != null,
		charmBlocked: bstTrust && (herJug != null || charm != null || packCharm != null),
		petDistance: bstTrust && ((charmOwner === "lhu-mhakaracca" && charm != null) || (packCharm != null && packCharm.owner === "lhu-mhakaracca")) ? packCharm != null && packCharm.owner === "lhu-mhakaracca" ? trustFoeYards("lhu-mhakaracca", packCharm.id) : trustCharmYards() : input.trust ? null : masterToPet(),
		jugItem: bstTrust ? FISH_OIL_BROTH : input.ammo ?? null,
		jugLeft: bstTrust ? 12 : input.ammo === "fish-oil-broth" ? input.jugLeft ?? 0 : 0,
		foodCounts: input.foodCounts,
		foodId: input.foodId ?? null,
		foodCopy: input.trust === true,
		petHp: bstTrust ? herJug?.hp ?? 0 : jug?.hp ?? 0,
		petMax: bstTrust ? herJug?.max ?? 0 : jug?.max ?? 0,
		jugCharges: bstTrust ? herJug?.charges ?? 3 : jug?.charges ?? readyBank.charges,
		readyCharges: bstTrust ? herJug?.charges ?? (charmOwner === "lhu-mhakaracca" && charm ? charm.charges ?? 0 : packCharm?.owner === "lhu-mhakaracca" ? packCharm.charges ?? 0 : 3) : readyBank.charges,
		automatonOut: pupTrust ? herAuto != null : input.trust ? false : automaton != null,
		animator: pupTrust ? true : input.animator === true,
		oilItem: pupTrust ? AUTOMATON_OIL : input.ammo ?? null,
		oilLeft: pupTrust ? 12 : input.ammo === "automaton-oil" ? input.oilLeft ?? 0 : 0,
		oilCopy: input.trust === true,
		autoHp: pupTrust ? herAuto?.hp ?? 0 : automaton?.hp ?? 0,
		autoMax: pupTrust ? herAuto?.max ?? 0 : automaton?.max ?? 0,
		otherPet: input.trust ? false : wyvern != null || jug != null || avatar != null || charm != null || packCharm != null,
		dmg: input.dmg ?? 0,
		fstr: input.fstr ?? 0,
		hitChance: input.hit ?? 0,
		tp: input.tp ?? 0,
		chr: input.chr ?? 0,
		thfMain: main === "THF",
		...corsairCastFields({
			main,
			sub,
			mainLevel,
			subLevel,
			buffs,
			recasts: input.recasts ?? {},
			gun: input.gun === true,
			bullet: input.bullet === true,
			gunDmg: input.gunDmg ?? 0,
			bulletDmg: input.bulletDmg ?? 0,
			agi: input.agi ?? 0
		}),
		...dancerCastFields({
			main,
			sub,
			mainLevel,
			subLevel,
			buffs,
			tp: input.tp ?? 0,
			chr: input.chr ?? 0,
			ability: "",
			enfeebles: input.enfeebles ?? [],
			waltzAlly: false,
			waltzCenter: "self",
			chainOpen: input.chainOpen === true
		}),
		...runeCastFields({
			main,
			sub,
			mainLevel,
			subLevel,
			buffs,
			skill: input.skill ?? 0,
			divine: input.divine ?? 0,
			str: input.str ?? 0,
			dex: input.dex ?? 0,
			agi: input.agi ?? 0,
			int: input.int ?? 0,
			mnd: input.mnd ?? 0,
			chr: input.chr ?? 0,
			targetHp: input.targetHp ?? null
		}),
		...scholarCastFields({
			main,
			sub,
			mainLevel,
			subLevel,
			buffs,
			enfeebles: input.enfeebles ?? []
		}),
		...geoCastFields({
			main,
			sub,
			mainLevel,
			subLevel,
			buffs
		})
	};
}
function paintRunes(buffs, runes) {
	return [...buffs.filter((buff) => !RUNE_SET.has(buff.name)), ...runes.map((row) => ({
		name: row.name,
		left: row.duration,
		power: row.power
	}))];
}
/** Elements the yard should flash. Taken when the pose starts, so a queued swing does not eat it. */
var runeFlash = null;
function chargeElements(buffs) {
	const out = [];
	for (const buff of buffs) {
		if (!isRuneName(buff.name) || (buff.power ?? 0) <= 0) continue;
		const n = Math.max(1, Math.min(3, buff.power));
		for (let i = 0; i < n; i++) out.push(runeElement(buff.name));
	}
	return out;
}
function noteRuneFlash(name, buffs) {
	let elements = null;
	if (isRuneName(name)) elements = [runeElement(name)];
	else if (name === "Swipe") {
		const rows = buffs.filter((buff) => isRuneName(buff.name) && (buff.power ?? 0) > 0).map((buff) => ({
			name: buff.name,
			left: buff.left ?? 0,
			power: buff.power ?? 0
		}));
		const hit = newestRune(rows);
		elements = hit ? [runeElement(hit.name)] : [];
	} else if (name === "Lunge" || name === "Gambit") elements = chargeElements(buffs);
	else if (name === "Vivacious Pulse") elements = chargeElements(buffs);
	else if (name === "Vallation" || name === "Valiance" || name === "Pflug") {
		const rows = buffs.filter((buff) => isRuneName(buff.name) && (buff.power ?? 0) > 0).map((buff) => ({
			name: buff.name,
			left: buff.left ?? 0,
			power: buff.power ?? 0
		}));
		const hit = newestRune(rows);
		elements = hit ? [runeElement(hit.name)] : [];
	} else if (name === "Swordplay") elements = ["wind"];
	else if (name === "Embolden") elements = ["light"];
	else if (name === "Elemental Sforzo") elements = ["fire", "ice", "wind", "earth", "thunder", "water", "light", "dark"];
	if (elements) runeFlash = { name, elements };
}
export function takeRuneFlash(name) {
	const fx = runeFlash;
	runeFlash = null;
	if (!fx || fx.name !== name) return null;
	return fx.elements;
}
function popShadow(buffs) {
	const next = buffs.map((buff) => ({ ...buff }));
	const row = next.find((buff) => (buff.name === "Blink" || buff.name === "Copy Image") && (buff.charges ?? 0) > 0);
	if (!row) return { buffs: next, wore: null };
	row.charges = (row.charges ?? 1) - 1;
	if (row.charges <= 0) return { buffs: next.filter((buff) => buff !== row), wore: row.name };
	return { buffs: next, wore: null };
}
function stepRuneBuffs(buffs, dt) {
	let changed = false;
	const next = [];
	for (const buff of buffs) {
		if (buff.name === "Swordplay") {
			const ticked = tickSwordplay(buff.power ?? 0, buff.acc ?? 0, dt);
			if (ticked.power !== (buff.power ?? 0) || ticked.acc !== (buff.acc ?? 0)) changed = true;
			next.push({ ...buff, power: ticked.power, acc: ticked.acc });
		} else if (buff.name === "Foil") {
			let acc = (buff.acc ?? 0) + dt;
			let power = buff.power ?? 0;
			const start = power;
			while (acc >= 3 && power > 0) {
				acc -= 3;
				power = Math.max(0, power - 3);
			}
			if (power !== start || acc !== (buff.acc ?? 0)) changed = true;
			next.push({ ...buff, power, acc });
		} else next.push(buff);
	}
	return { buffs: next, changed };
}
function paintFinishing(buffs, left) {
	if (left <= 0) return buffs.filter((buff) => buff.name !== "Finishing Move");
	const had = buffs.find((buff) => buff.name === "Finishing Move");
	return [...buffs.filter((buff) => buff.name !== "Finishing Move"), {
		name: "Finishing Move",
		left: had?.left ?? 7200,
		power: left
	}];
}
function landDancer(result, casterId) {
	if (!(result.tpSpend || result.finishingLeft != null || result.daze || result.weight || result.jig || result.eraseOne || result.partyHeal || result.waltz || result.flourish || result.chainbound || result.strike)) return;
	if (result.tpSpend) {
		if (casterId == null) {
			const state = useGame.getState();
			useGame.setState({ tp: Math.max(0, state.tp - result.tpSpend) });
		} else if (liveTrusts[casterId]) liveTrusts[casterId].tp = Math.max(0, liveTrusts[casterId].tp - result.tpSpend);
	}
	if (result.finishingLeft != null) {
		if (casterId == null) liveBuffs = paintFinishing(liveBuffs, result.finishingLeft);
		else if (liveTrusts[casterId]) liveTrusts[casterId].buffs = paintFinishing(liveTrusts[casterId].buffs, result.finishingLeft);
	}
	if (result.jig === "spectral") {
		const paint = (buffs) => [...buffs.filter((buff) => buff.name !== "Sneak" && buff.name !== "Invisible"), {
			name: "Sneak",
			left: SPECTRAL_SECONDS,
			spectral: true
		}, {
			name: "Invisible",
			left: SPECTRAL_SECONDS,
			spectral: true
		}];
		if (casterId == null) liveBuffs = paint(liveBuffs);
		else if (liveTrusts[casterId]) liveTrusts[casterId].buffs = paint(liveTrusts[casterId].buffs);
	}
	if (result.jig === "chocobo" || result.jig === "chocobo2") {
		const casterKey = casterId == null ? "player" : casterId;
		const wide = result.jig === "chocobo2";
		const bodies = waltzBodies(casterKey, wide ? CHOCOBO_JIG_II_RADIUS : 0);
		const left = result.buff?.duration ?? JIG_SECONDS;
		const notes = [];
		let playerTouched = false;
		let trustTouched = false;
		for (const who of bodies) {
			if (who === "player") {
				if (liveAilments.some((row) => row.name === "Gravity")) {
					liveAilments = liveAilments.filter((row) => row.name !== "Gravity");
					notes.push("Weight wears off.");
					playerTouched = true;
				}
				if (who !== casterKey) {
					liveBuffs = [...liveBuffs.filter((buff) => buff.name !== "Chocobo Jig"), {
						name: "Chocobo Jig",
						left
					}];
					notes.push("Xanosuke receives it.");
					jigFxQueue.push({ who, wide: true });
					playerTouched = true;
				}
			} else if (liveTrusts[who]) {
				const trust = liveTrusts[who];
				if (trust.buffs.some((buff) => buff.name === "Gravity")) {
					trust.buffs = trust.buffs.filter((buff) => buff.name !== "Gravity");
					notes.push(`${trustName(who)}'s Weight wears off.`);
					trustTouched = true;
				}
				if (who !== casterKey) {
					trust.buffs = [...trust.buffs.filter((buff) => buff.name !== "Chocobo Jig"), {
						name: "Chocobo Jig",
						left
					}];
					notes.push(`${trustName(who)} receives it.`);
					jigFxQueue.push({ who, wide: true });
					trustTouched = true;
				}
			}
		}
		if (playerTouched || trustTouched) {
			useGame.setState({
				...playerTouched ? {
					buffs: liveBuffs.map((buff) => ({ ...buff })),
					ailments: liveAilments.map((row) => ({ ...row }))
				} : {},
				...trustTouched ? { trustVitals: trustVitalsNow() } : {}
			});
		}
		if (notes.length) useGame.getState().pushLog(notes.join(" "), "info");
	}
	if (result.eraseOne && casterId == null) {
		const blocked = new Set(["Doom", "Amnesia", "Petrification"]);
		const idx = liveAilments.findIndex((row) => !blocked.has(row.name));
		if (idx >= 0) {
			const gone = liveAilments[idx];
			liveAilments = liveAilments.filter((_, i) => i !== idx);
			useGame.getState().pushLog(`${gone.name} wears off.`, "info");
			useGame.setState({ ailments: liveAilments.map((row) => ({ ...row })) });
		}
	}
	if (result.partyHeal && result.heal) {
		const healed = healTrust(result.heal, 9.9);
		if (healed.note) useGame.getState().pushLog(healed.note.trim(), "info");
	}
	if (result.waltz) landWaltz(result, casterId);
	if (result.daze || result.weight) {
		const park = foeIsKin() ? borrowKin() : null;
		try {
			if (result.daze) {
				const daze = result.daze;
				const had = liveEnfeebles.find((row) => row.name === daze.name);
				const hadLevel = Math.max(0, Math.floor(had?.power ?? 0));
				const who = park ? "kin" : "hare";
				const remembered = stackBucket(who)[daze.name];
				const rememberedLevel = Math.max(0, Math.floor(remembered?.level ?? 0));
				const best = Math.max(hadLevel, rememberedLevel);
				const castLevel = daze.level ?? 1;
				const cap = daze.cap ?? 10;
				let level = castLevel;
				let seconds = daze.seconds;
				if (best > castLevel) {
					level = best >= cap ? best : Math.min(cap, best + 1);
					const baseLeft = Math.max(had?.left ?? 0, remembered?.left ?? 0);
					seconds = Math.min(120, baseLeft + 30);
				}
				liveEnfeebles = liveEnfeebles.filter((row) => row.name !== daze.name);
				liveEnfeebles = [...liveEnfeebles, {
					name: daze.name,
					left: seconds,
					power: level,
					...daze.name === "Lethargic Daze" ? { evaDown: lethargicEvasion(level) } : daze.evaDown ? { evaDown: daze.evaDown } : {}
				}];
				rememberStep(who, daze.name, level, seconds);
				stepFxQueue.push({
					name: daze.name,
					level,
					foe: park ? "kin" : "hare",
					eva: daze.name === "Lethargic Daze" ? lethargicEvasion(level) : daze.evaDown ?? 0,
					defense: daze.name === "Sluggish Daze" ? sluggishDefense(level) : daze.defenseCut ?? 0,
					meva: daze.name === "Weakened Daze" ? weakenedMagicEvasion(level) : daze.mevaDown ?? 0
				});
			}
			if (result.weight) {
				liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Gravity");
				liveEnfeebles = [...liveEnfeebles, {
					name: "Gravity",
					left: 60,
					power: 26,
					evaDown: 10
				}];
			}
			useGame.setState(struckPatch(park));
		} finally {
			if (park) restoreKin(park);
		}
	}
	if (result.chainbound) openChainbound(foeIsKin() ? "kin" : "hare");
	if (result.flourish) {
		const dealt = result.flourish === "violent" && result.strike ? landViolentHit(casterId) : 0;
		flourishFxQueue.push({
			kind: result.flourish,
			who: casterId == null ? "player" : casterId,
			foe: foeIsKin() ? "kin" : "hare",
			hit: result.flourish === "violent" ? result.strike === true : result.flourish === "desperate" ? result.weight === true : result.flourish === "wild" ? result.chainbound === true : true,
			fizzle: result.flourish === "wild" && result.chainbound !== true && result.text === "Wild Flourish. No effect.",
			amount: result.flourish === "reverse" ? result.tpGrant ?? 0 : dealt,
			stun: result.stun === true
		});
	}
}
/** Flourish flashes. The yard draws them and clears the list. */
var flourishFxQueue = [];
export function takeFlourishFx() {
	if (!flourishFxQueue.length) return [];
	const fx = flourishFxQueue;
	flourishFxQueue = [];
	return fx;
}
function landViolentHit(casterId) {
	const state = useGame.getState();
	const self = casterId == null;
	const who = self ? null : liveTrusts[casterId];
	const sub = self ? null : trustSubOf(state.party, casterId);
	const sheet = self ? state.sheet : trustCombat(casterId, sub, trustGearOf(state.party, casterId));
	const buffs = self ? liveBuffs : who?.buffs ?? [];
	const foeRows = foeIsKin() ? kinEnfeebles : liveEnfeebles;
	const foeEva = targetEvasion(HARE.evasion, foeRows, distractPower(foeRows));
	const mods = meleeStats(sheet, buffs, protectPower(buffs), self ? auspiceAccuracy(buffs) : 0, HARE.evasion - foeEva, self && playerBehind);
	const vitDown = foeRows.reduce((n, row) => row.name === "VIT Down" ? n + (row.power ?? 0) : n, 0);
	const defense = Math.max(1, hareLiveDefense(vitDown) * diaDefenseFactor(foeRows));
	const pdif = rollSwordPdif(mods.attack / defense, false, Math.random, mods.pdifCap);
	let dmg = Math.max(0, Math.floor((sheet.dmg + sheet.fstr) * pdif));
	if (self) dmg = state.foldDarkHit(dmg);
	else landSambaHit({
		who: casterId,
		label: trustName(casterId),
		buffs,
		delay: sheet.delay,
		damage: dmg,
		foe: foeIsKin() ? "kin" : "hare"
	});
	const label = self ? "Xanosuke" : trustName(casterId);
	if (dmg > 0) {
		if (self) {
			if (playerFoe() === "kin") {
				creditKinDamage(dmg);
				chipKin(dmg);
			} else {
				const woke = clearSleep();
				const unbound = bindWearsOff(dmg) && clearBind();
				chipHare(dmg);
				if (woke) state.pushLog(`The ${HARE.name} wakes.`, "info");
				if (unbound) state.pushLog(`The ${HARE.name}'s Bind effect wears off.`, "info");
			}
			grantPlayerFoeTp(sheet.tpHit);
			const gain = Math.floor((sheet.tpHit ?? 0) * rolledStoreTp(sheet.storeTp || 1, buffs));
			useGame.setState({ tp: Math.min(3000, useGame.getState().tp + gain) });
		} else if (who) {
			who.tp = Math.min(3000, who.tp + (sheet.tpHit ?? 0));
			const landed = hitFoe(dmg, casterId);
			if (!landed.dead) grantFoeMonsterTp(sheet.tpHit);
			if (landed.woke) state.pushLog(`The ${HARE.name} wakes.`, "info");
			if (landed.unbound) state.pushLog(`The ${HARE.name}'s Bind effect wears off.`, "info");
		}
		useGame.setState({
			dealt: useGame.getState().dealt + dmg,
			...foePatch(),
			...self ? {} : { trustVitals: trustVitalsNow() }
		});
	}
	const points = dmg === 1 ? "point" : "points";
	state.pushLog(`${label} hits the ${HARE.name} for ${dmg} ${points} of damage.`, "hit");
	return dmg;
}
function waltzActor(center, casterId) {
	if (!center || center === "self") return casterId == null ? "player" : casterId;
	return center;
}
function yardsBetween(a, b) {
	if (a === b) return 0;
	if (a === "player") return trustPlaces[b]?.party ?? 99;
	if (b === "player") return trustPlaces[a]?.party ?? 99;
	return yardsFrom(a, b);
}
function vitOf(who) {
	if (who === "player") return useGame.getState().sheet.vit;
	const state = useGame.getState();
	return trustCombat(who, trustSubOf(state.party, who), trustGearOf(state.party, who)).vit;
}
function waltzBodies(center, radius) {
	const party = ["player", ...summonedTrustIds()];
	const ids = [];
	for (const id of party) {
		if (id === "player" && useGame.getState().ko) continue;
		if (radius <= 0) {
			if (id === center) ids.push(id);
		} else if (yardsBetween(center, id) <= radius) ids.push(id);
	}
	return ids;
}
function waltzTier(name) {
	if (name === "Curing Waltz IV") return 4;
	if (name === "Curing Waltz III") return 3;
	if (name === "Curing Waltz II" || name === "Divine Waltz") return 2;
	return 1;
}
function giveWaltzHp(who, amount) {
	const n = Math.max(0, Math.floor(amount));
	if (who === "player") {
		const state = useGame.getState();
		if (state.ko) return 0;
		const room = Math.max(0, hpCap() - state.hp);
		const gain = Math.min(n, room);
		if (gain > 0) useGame.setState({ hp: state.hp + gain });
		return gain;
	}
	const trust = liveTrusts[who];
	if (!trust || trust.ko) return 0;
	const room = Math.max(0, trust.maxHp - trust.hp);
	const gain = Math.min(n, room);
	if (gain > 0) trust.hp += gain;
	return gain;
}
function waltzHpNote(who, amount, gain) {
	if (who === "player") return gain <= 0 ? "Your HP is full." : `You recover ${gain} HP.`;
	const label = trustName(who);
	if (gain <= 0) return `${label}'s HP is full.`;
	return gain < amount ? `${label} recovers ${gain} HP.` : `${label} recovers ${gain} HP.`;
}
function stripWaltzAilment(who) {
	if (who === "player") {
		const idx = liveAilments.findIndex((row) => healingWaltzRemoves(row.name));
		if (idx < 0) return null;
		const gone = liveAilments[idx].name;
		liveAilments = liveAilments.filter((_, i) => i !== idx);
		return gone;
	}
	const trust = liveTrusts[who];
	if (!trust) return null;
	const idx = trust.buffs.findIndex((buff) => healingWaltzRemoves(buff.name));
	if (idx < 0) return null;
	const gone = trust.buffs[idx].name;
	trust.buffs = trust.buffs.filter((_, i) => i !== idx);
	return gone;
}
function landWaltz(result, casterId) {
	const waltz = result.waltz;
	if (!waltz) return;
	const center = waltzActor(waltz.center, casterId);
	const radius = waltz.kind === "divine" ? DIVINE_RADIUS : waltz.kind === "healing" && waltz.aoe ? HEALING_AOE : 0;
	const bodies = waltzBodies(center, radius);
	const casterKey = casterId == null ? "player" : casterId;
	const notes = [];
	let formula = 0;
	let trustTouched = false;
	let ailmentsTouched = false;
	if (waltz.kind === "healing") {
		let cleaned = 0;
		for (const who of bodies) {
			const gone = stripWaltzAilment(who);
			if (!gone) continue;
			cleaned += 1;
			if (who === "player") ailmentsTouched = true;
			else trustTouched = true;
			notes.push(who === "player" ? `${gone} wears off.` : `${trustName(who)}'s ${gone} wears off.`);
			waltzFxQueue.push({ kind: "cleanse", who, gone, tier: 1 });
		}
		if (cleaned === 0) notes.push("No effect.");
		result.hate = { ce: 1, ve: 320 };
	} else {
		const tier = waltzTier(waltz.name);
		for (const who of bodies) {
			const amount = waltzHeal(waltz.name, waltz.chr, vitOf(who), waltz.contradance === true, waltz.main !== false);
			formula += amount;
			const gain = giveWaltzHp(who, amount);
			if (who !== "player" && gain > 0) trustTouched = true;
			const show = waltz.kind === "divine" || who !== casterKey || gain !== amount;
			if (show) notes.push(waltzHpNote(who, amount, gain));
			waltzFxQueue.push({ kind: waltz.kind, who, amount: gain, tier });
		}
		if (bodies.length === 0) notes.push("No effect.");
		if (waltz.name === "Curing Waltz IV") result.hate = { ce: 400, ve: 700 };
		else {
			const hate = cureEnmity(75, formula);
			if (hate.ce || hate.ve) result.hate = hate;
		}
	}
	if (ailmentsTouched || trustTouched) {
		useGame.setState({
			...ailmentsTouched ? { ailments: liveAilments.map((row) => ({ ...row })) } : {},
			...trustTouched ? { trustVitals: trustVitalsNow() } : {}
		});
	}
	if (notes.length) useGame.getState().pushLog(notes.join(" "), "info");
}
function dropNamed(buffs, name) {
	return buffs.filter((buff) => buff.name !== name);
}
function rewriteRoll(buffs, roll) {
	if (roll.remove || roll.bust) return buffs.filter((buff) => buff.name !== roll.name);
	if (roll.keep) return buffs.map((buff) => buff.name === roll.name ? {
		...buff,
		power: roll.power
	} : buff);
	return [...buffs.filter((buff) => buff.name !== roll.name), {
		name: roll.name,
		left: roll.duration,
		power: roll.power
	}];
}
function writeBust(buffs, power) {
	if (power <= 0) return buffs.filter((buff) => buff.name !== "Bust");
	const existing = buffs.find((buff) => buff.name === "Bust");
	return [...buffs.filter((buff) => buff.name !== "Bust"), {
		name: "Bust",
		left: existing?.left ?? 300,
		power
	}];
}
function eachCorsairMate(casterId, radius, paint) {
	if (casterId == null) {
		paint("player");
		for (const id of summonedTrustIds()) {
			const place = trustPlaces[id];
			if (!place || place.party > radius) continue;
			paint(id);
		}
		return;
	}
	paint(casterId);
	for (const id of trustsInRadius(casterId, radius)) {
		if (id === casterId) continue;
		paint(id);
	}
	if (!useGame.getState().ko && (trustPlaces[casterId]?.party ?? 99) <= radius) paint("player");
}
function resetWaiting(book, resetSp) {
	for (const name of Object.keys(book)) {
		if (name === "Wild Card") continue;
		if (!resetSp && ONE_HOURS.has(name)) continue;
		if ((book[name] ?? 0) > 0) book[name] = 0;
	}
}
function fillMp(current, max, frac) {
	return Math.min(max, current + Math.floor(max * frac));
}
/** Phantom Roll, Fold, Snake Eye, Wild Card, and Random Deal. Called after the generic buff lands. */
function settleCorsair(result, casterId) {
	if (!(result.consumeSnake || result.roll || result.fold || result.wildCard || result.randomDeal !== void 0 || result.mpFrac != null)) return;
	if (result.consumeSnake) {
		if (casterId == null) liveBuffs = dropNamed(liveBuffs, "Snake Eye");
		else if (liveTrusts[casterId]) liveTrusts[casterId].buffs = dropNamed(liveTrusts[casterId].buffs, "Snake Eye");
	}
	if (result.roll) {
		const roll = result.roll;
		const face = rollFace(roll.power);
		const row = rollByName(roll.name);
		rollNotes.set(casterId ?? "player", {
			name: roll.name,
			face,
			lucky: !!row && face === row.lucky && !roll.bust,
			unlucky: !!row && face === row.unlucky && !roll.bust,
			bust: roll.bust === true
		});
		eachCorsairMate(casterId, ROLL_RANGE, (who) => {
			if (who === "player") liveBuffs = rewriteRoll(liveBuffs, roll);
			else if (liveTrusts[who]) liveTrusts[who].buffs = rewriteRoll(liveTrusts[who].buffs, roll);
		});
	}
	if (result.fold) {
		const fold = result.fold;
		if (fold.name) eachCorsairMate(casterId, ROLL_RANGE, (who) => {
			if (who === "player") liveBuffs = dropNamed(liveBuffs, fold.name);
			else if (liveTrusts[who]) liveTrusts[who].buffs = dropNamed(liveTrusts[who].buffs, fold.name);
		});
		if (casterId == null) liveBuffs = writeBust(liveBuffs, fold.bustPower);
		else if (liveTrusts[casterId]) liveTrusts[casterId].buffs = writeBust(liveTrusts[casterId].buffs, fold.bustPower);
	}
	if (typeof result.randomDeal === "string") {
		if (casterId == null) liveRecasts[result.randomDeal] = 0;
		else if (liveTrusts[casterId]) liveTrusts[casterId].recasts[result.randomDeal] = 0;
	}
	if (result.wildCard) {
		const resetSp = result.wildCard.resetSp;
		eachCorsairMate(casterId, PARTY_RADIUS, (who) => {
			const caster = casterId == null ? who === "player" : who === casterId;
			if (who === "player") {
				resetWaiting(liveRecasts, resetSp);
				if (!caster && result.tpGrant) {
					const state = useGame.getState();
					const landed = Math.min(result.tpGrant, Math.max(0, 3e3 - state.tp));
					useGame.setState({
						tp: Math.min(3e3, state.tp + result.tpGrant),
						...landed > 0 ? { tpPulse: landed } : {}
					});
				}
				if (result.mpFrac) {
					const state = useGame.getState();
					useGame.setState({ mp: fillMp(state.mp, state.sheet.mp, result.mpFrac) });
				}
			} else {
				const trust = liveTrusts[who];
				if (!trust || trust.ko) return;
				resetWaiting(trust.recasts, resetSp);
				if (!caster && result.tpGrant) trust.tp = Math.min(3e3, trust.tp + result.tpGrant);
				if (result.mpFrac) trust.mp = fillMp(trust.mp, trust.maxMp, result.mpFrac);
			}
		});
	} else if (result.mpFrac) {
		if (casterId == null) {
			const state = useGame.getState();
			useGame.setState({ mp: fillMp(state.mp, state.sheet.mp, result.mpFrac) });
		} else if (liveTrusts[casterId]) {
			const trust = liveTrusts[casterId];
			trust.mp = fillMp(trust.mp, trust.maxMp, result.mpFrac);
		}
	}
	useGame.setState({
		buffs: liveBuffs.map((buff) => ({ ...buff })),
		recasts: { ...liveRecasts },
		trustVitals: trustVitalsNow()
	});
}
/** Quick Draw deepens a debuff that is already on the foe. It does not apply one. */
function settleQuickDraw(result, hold) {
	const shot = result.quickDraw;
	if (!shot) return;
	const park = foeIsKin() ? borrowKin() : null;
	const foe = HARE.name;
	const aimed = park ? "kin" : "hare";
	const effects = [];
	try {
		if (shot.sleep) {
			const current = liveEnfeebles.find((row) => isSleepSpell(row.name));
			const sleeping = current && isSleepSpell(current.name) ? current.name : null;
			if (liveHareHp <= 0 || !sleepCanLand(sleeping, "Sleep")) useGame.getState().pushLog("No effect.", "miss");
			else {
				liveEnfeebles = liveEnfeebles.filter((row) => !isSleepSpell(row.name) && row.name !== "Sheep Song" && row.name !== "Soporific" && row.name !== "Yawn");
				liveEnfeebles = [...liveEnfeebles, {
					name: "Sleep",
					left: 60
				}];
				effects.push("Sleep");
				useGame.getState().pushLog(`Light Shot. The ${foe} falls asleep.`, "hit");
			}
			const dia = liveEnfeebles.find((row) => row.name === "Dia" || row.name === "Dia II" || row.name === "Dia III" || row.name === "Diaga");
			if (dia && (dia.qd ?? 0) < 1) {
				dia.power = Math.max(dia.power ?? 0, diaDefenseNumer(dia.name)) + 28;
				dia.dot = (dia.dot ?? 0) + 1;
				dia.qd = 1;
				effects.push("Dia +28");
				useGame.getState().pushLog("Dia deepens. Defense down +28/1024. Damage over time +1.", "hit");
			}
		}
		if (shot.dispel) useGame.getState().pushLog(`Dark Shot. The ${foe} has no beneficial effect to remove.`, "miss");
		if (shot.element === "dark") {
			const bio = liveEnfeebles.find((row) => row.name === "Bio" || row.name === "Bio II" || row.name === "Bio III");
			if (bio && (bio.qd ?? 0) < 1) {
				bio.power = Math.max(bio.power ?? 0, bioAttackNumer(bio.name)) + 28;
				bio.dot = (bio.dot ?? 0) + 3;
				bio.qd = 1;
				effects.push("Bio +28");
				useGame.getState().pushLog("Bio deepens. Attack down +28/1024. Damage over time +3.", "hit");
			}
			const blind = liveEnfeebles.find((row) => row.name === "Blind" || row.name === "Blind II");
			if (blind && (blind.qd ?? 0) < 2) {
				blind.accDown = (blind.accDown ?? 0) + 10;
				blind.qd = (blind.qd ?? 0) + 1;
				effects.push("Blind −10");
				useGame.getState().pushLog("Blind deepens. Accuracy −10.", "hit");
			}
		}
		if (shot.element === "ice") {
			const para = liveEnfeebles.find((row) => row.name === "Paralyze" || row.name === "Paralyze II");
			if (para && (para.qd ?? 0) < 2) {
				para.power = (para.power ?? 0) + 5;
				para.qd = (para.qd ?? 0) + 1;
				effects.push("Paralyze +5%");
				useGame.getState().pushLog("Paralyze deepens by 5.", "hit");
			}
		}
		if (shot.element === "earth") {
			const slow = liveEnfeebles.find((row) => row.name === "Slow" || row.name === "Slow II");
			if (slow && (slow.qd ?? 0) < 2) {
				slow.power = (slow.power ?? 0) + 102;
				slow.qd = (slow.qd ?? 0) + 1;
				effects.push("Slow +102");
				useGame.getState().pushLog("Slow deepens by 102/1024.", "hit");
			}
		}
		if (shot.debuff) {
			const row = liveHareDebuffs.find((debuff) => debuff.name === shot.debuff);
			const add = row ? quickDrawBonus(row.qd ?? 0) : 0;
			if (row && add > 0) {
				row.down += add;
				row.dot += add;
				row.qd = (row.qd ?? 0) + 1;
				effects.push(`${shot.debuff} +${add}`);
				useGame.getState().pushLog(`${shot.debuff} deepens. The stat down and the damage over time each gain ${add}.`, "hit");
			}
		}
		queueQuickDrawMark(shot, result, effects, hold === true, aimed);
		useGame.setState(struckPatch(park));
	} finally {
		if (park) restoreKin(park);
	}
}
/**
* Offensive trust magic that is not a nuke, Banish, Holy, Dia, or Bio.
* Those four keep the trust damage that was already landing.
* This applies the same status, siphon, and Cura note the player cast uses.
*/
function applyTrustStatus(caster, spell, sheet, pools) {
	const hare = HARE.name;
	const none = {
		dmg: 0,
		hpGain: 0,
		mpGain: 0,
		stunCut: false
	};
	if (spell.flash) {
		const rolled = rollFixed(12, castMagicAccuracy(spell, sheet), "light");
		if (rolled.state === 2) return {
			...none,
			text: `The ${hare} resists the spell.`
		};
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Flash");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Flash",
			left: rolled.left,
			accDown: 300,
			flashFrom: "spell"
		}];
		return {
			...none,
			text: `Flash lowers the ${hare}'s accuracy by 300.${halfNote(rolled.state, rolled.left)}`
		};
	}
	if (spell.repose) {
		const current = liveEnfeebles.find((row) => isSleepSpell(row.name));
		if (!sleepCanLand(current && isSleepSpell(current.name) ? current.name : null, "Repose")) return {
			...none,
			text: "No effect."
		};
		const rolled = rollFixed(sleepSeconds("Repose"), castMagicAccuracy(spell, sheet), "light");
		if (rolled.state === 2) return {
			...none,
			text: `The ${hare} resists the spell.`
		};
		liveEnfeebles = liveEnfeebles.filter((row) => !isSleepSpell(row.name) && row.name !== "Sheep Song" && row.name !== "Soporific" && row.name !== "Yawn");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Repose",
			left: rolled.left
		}];
		return {
			...none,
			text: `Repose.${halfNote(rolled.state, rolled.left)}`
		};
	}
	if (spell.debuff) {
		const potency = elementDebuffPotency(sheet.int);
		const resolved = resolveElementDebuff(liveHareDebuffs.map((row) => row.name), spell.debuff);
		if (!resolved.landed) return {
			...none,
			text: "No effect."
		};
		const label = DEBUFF_STAT_LABEL[DEBUFF_STAT[spell.debuff]];
		liveHareDebuffs = resolved.active.map((name) => {
			if (name !== spell.debuff) {
				const prev = liveHareDebuffs.find((row) => row.name === name);
				if (prev) return prev;
			}
			return {
				name,
				stat: DEBUFF_STAT[name],
				down: potency.stat,
				dot: potency.dot,
				left: 90,
				acc: 0
			};
		});
		const wore = resolved.removed ? ` ${resolved.removed} wears off.` : "";
		return {
			...none,
			text: `${spell.debuff} lowers the ${hare}'s ${label} by ${potency.stat}.${wore}`
		};
	}
	if (spell.siphon) {
		const potency = siphonPotency(spell.siphon, sheet.darkMagic, Math.random(), false);
		const base = siphonTaken(spell.siphon, potency, HARE.mp);
		const burst = spell.siphon === "Drain" ? scaleBurst(base, "dark", sheet.magicBurstBonus) : {
			value: base,
			name: null
		};
		const taken = burst.value;
		const state = elementalResistState(castMagicAccuracy(spell, sheet) - hareMeva("dark"), 100, Math.random);
		const stolen = resistedDamage(taken, state);
		const fraction = state > 0 ? ` ${resistFractionLabel(state)} resist.` : "";
		if (spell.siphon === "Drain") {
			const hpGain = siphonGained(stolen, pools.hp, pools.maxHp);
			const back = hpGain > 0 ? ` ${caster} recovers ${hpGain} HP.` : ` ${caster}'s HP is full.`;
			const lead = burst.name && stolen > 0 ? `${caster} magic bursts Drain. ` : "";
			return {
				...none,
				dmg: stolen,
				hpGain,
				text: `${lead}Drain hits the ${hare} for ${stolen} points of damage.${fraction}${back}`
			};
		}
		if (taken <= 0) return {
			...none,
			text: `The ${hare} has no MP.`
		};
		const mpGain = siphonGained(stolen, pools.mp, pools.maxMp);
		const back = mpGain > 0 ? ` ${caster} recovers ${mpGain} MP.` : ` ${caster}'s MP is full.`;
		return {
			...none,
			mpGain,
			text: `Aspir drains ${stolen} MP from the ${hare}.${fraction}${back}`
		};
	}
	if (spell.cura) return {
		...none,
		text: "The cure amount is not published, so no HP is applied."
	};
	if (!spell.enfeeble || isDiaSpell(spell.enfeeble) || isBioSpell(spell.enfeeble)) return null;
	const name = spell.enfeeble;
	const family = enfeebleFamily(name);
	if (name === "Dispel") return {
		...none,
		text: "No effect."
	};
	if (name === "Stun") {
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Stun");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Stun",
			left: 2
		}];
		let text = `Stun. The ${hare} cannot act for 2 seconds.`;
		const action = useGame.getState().hareAction;
		if (stunCancels(action)) return {
			...none,
			stunCut: true,
			text: `${text} ${stunInterruptLine(action)}`
		};
		return {
			...none,
			text
		};
	}
	if (isPoisonSpell(name)) {
		const skill = combinedSkill("Enfeebling Magic", sheet.job, 75, sheet.sub, sheet.subLevel);
		const dot = name === "Poisonga" ? poisongaPotency(skill) : poisonPotency(skill, name === "Poison II" ? 2 : 1);
		if (!poisonCanLand(liveEnfeebles.find((row) => isPoisonSpell(row.name))?.name ?? null, name)) return {
			...none,
			text: "No effect."
		};
		const rolled = rollFixed(poisonSeconds(name), castMagicAccuracy(spell, sheet), "water");
		if (rolled.state === 2) return {
			...none,
			text: `The ${hare} resists the spell.`
		};
		liveEnfeebles = liveEnfeebles.filter((row) => !isPoisonSpell(row.name));
		liveEnfeebles = [...liveEnfeebles, {
			name,
			left: rolled.left,
			dot,
			acc: 0
		}];
		const area = spell.radius != null ? " Enemies in 10' are poisoned." : "";
		return {
			...none,
			text: `${name}. ${dot} HP slips every 3 seconds.${area}${halfNote(rolled.state, rolled.left)}`
		};
	}
	if (name === "Inundation") {
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Inundation");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Inundation",
			left: 300
		}];
		return {
			...none,
			text: "Inundation. One weapon type does not raise skillchain damage."
		};
	}
	if (name === "Gravity") {
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Gravity");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Gravity",
			left: 120,
			power: 26
		}];
		return {
			...none,
			text: `Gravity weighs the ${hare} down. Movement is 74% of normal.`
		};
	}
	if (name === "Distract" || name === "Frazzle") {
		const down = evasionDownPotency(combinedSkill("Enfeebling Magic", sheet.job, 75, sheet.sub, sheet.subLevel), sheet.mnd - HARE.mnd);
		const base = name === "Distract" ? 300 : 300;
		const element = name === "Distract" ? "ice" : "dark";
		const rolled = rollFixed(base, castMagicAccuracy(spell, sheet), element);
		if (rolled.state === 2) return {
			...none,
			text: `The ${hare} resists the spell.`
		};
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== name);
		liveEnfeebles = [...liveEnfeebles, {
			name,
			left: rolled.left,
			power: down
		}];
		const line = name === "Distract" ? `Distract lowers the ${hare}'s evasion by ${down}.${halfNote(rolled.state, rolled.left)}` : `Frazzle lowers the ${hare}'s magic evasion by ${down}.${halfNote(rolled.state, rolled.left)}`;
		return {
			...none,
			text: line
		};
	}
	if (family) {
		if (!enfeebleCanLand(liveEnfeebles.find((row) => enfeebleFamily(row.name) === family)?.name ?? null, name)) return {
			...none,
			text: "No effect."
		};
		const element = family === "blind" ? "dark" : family === "slow" ? "earth" : "ice";
		const rolled = rollFixed(family === "blind" ? name === "Blind II" ? 180 : 180 : family === "slow" ? name === "Slow II" ? 180 : 180 : name === "Paralyze II" ? 120 : 120, castMagicAccuracy(spell, sheet), element);
		if (rolled.state === 2) return {
			...none,
			text: `The ${hare} resists the spell.`
		};
		liveEnfeebles = liveEnfeebles.filter((row) => enfeebleFamily(row.name) !== family);
		if (family === "blind") {
			const down = name === "Blind II" ? blindTwoPotency(sheet.int - hareInt()) : blindPotency(sheet.int - hareInt());
			liveEnfeebles = [...liveEnfeebles, {
				name,
				left: rolled.left,
				accDown: down,
				...name === "Blind" ? { blindFrom: "spell" } : {}
			}];
			return {
				...none,
				text: `${name} lowers the ${hare}'s accuracy by ${down}.${halfNote(rolled.state, rolled.left)}`
			};
		}
		if (family === "slow") {
			const potency = name === "Slow II" ? slowTwoPotency(sheet.mnd - HARE.mnd) : slowPotency(sheet.mnd - HARE.mnd);
			liveEnfeebles = [...liveEnfeebles, {
				name,
				left: rolled.left,
				power: potency
			}];
			return {
				...none,
				text: `${name}. Auto-attack delay is multiplied by ${1024 + potency}/1024.${halfNote(rolled.state, rolled.left)}`
			};
		}
		const chance = name === "Paralyze II" ? paralyzeTwoChance(sheet.mnd - HARE.mnd) : paralyzeChance(sheet.mnd - HARE.mnd);
		liveEnfeebles = [...liveEnfeebles, {
			name,
			left: rolled.left,
			power: chance
		}];
		return {
			...none,
			text: `${name}. ${chance}% chance to cancel an auto-attack or TP move.${halfNote(rolled.state, rolled.left)}`
		};
	}
	if (name === "Bind") {
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Bind");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Bind",
			left: 60
		}];
		return {
			...none,
			text: "Bind."
		};
	}
	if (name === "Silence") {
		const rolled = rollFixed(120, castMagicAccuracy(spell, sheet), "wind");
		if (rolled.state === 2) return {
			...none,
			text: `The ${hare} resists the spell.`
		};
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Silence");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Silence",
			left: rolled.left,
			silenceFrom: "spell"
		}];
		return {
			...none,
			text: `Silence. The ${hare} does not cast.${halfNote(rolled.state, rolled.left)}`
		};
	}
	if (isSleepSpell(name)) {
		const current = liveEnfeebles.find((row) => isSleepSpell(row.name));
		if (!sleepCanLand(current && isSleepSpell(current.name) ? current.name : null, name)) return {
			...none,
			text: "No effect."
		};
		const rolled = rollFixed(sleepSeconds(name), castMagicAccuracy(spell, sheet), "dark");
		if (rolled.state === 2) return {
			...none,
			text: `The ${hare} resists the spell.`
		};
		liveEnfeebles = liveEnfeebles.filter((row) => !isSleepSpell(row.name) && row.name !== "Lullaby" && row.name !== "Sheep Song" && row.name !== "Soporific" && row.name !== "Yawn" && row.name !== "Charmed");
		liveEnfeebles = [...liveEnfeebles, {
			name,
			left: rolled.left,
			wide: sleepIsWide(name)
		}];
		return {
			...none,
			text: `${name}.${halfNote(rolled.state, rolled.left)}`
		};
	}
	return null;
}
/** Self and single-target enhancing. Area wards are finished by the cast, not here. */
function landTrustEnhancing(casterId, caster, spell, targetId, sheet) {
	const who = enhancingWho(casterId, targetId);
	const onSelf = who === casterId;
	const bold = onSelf && (caster.buffs ?? []).some((buff) => buff.name === "Embolden");
	const label = recipientName(who);
	const miss = !enhancingNear(casterId, who, spell.range ?? PARTY_CAST_RANGE);
	const at = who === "player" ? "player" : "self";
	const cast = `${trustName(casterId)} casts ${spell.name}.`;
	if (miss && (spell.refresh || spell.haste || spell.regen || spell.stoneskin || spell.blink || spell.aquaveil || spell.phalanx || spell.reprisal || spell.enspell || spell.spike || spell.foil || spell.reraise || spell.barrier && !spell.barrier.area)) return {
		text: `${cast} ${label} is out of range.`,
		at
	};
	if (spell.refresh) {
		giveStatus(who, {
			name: "Refresh",
			left: trustComposed(enhancingDuration(150, spell.refresh.effectLevel, 75), caster, onSelf),
			power: 3
		}, (buff) => buff.name === "Refresh", false);
		return {
			text: `${cast} ${label} recovers 3 MP every 3 seconds.`,
			at
		};
	}
	if (spell.haste) {
		const left = trustComposed(enhancingDuration(180, spell.haste.effectLevel, 75), caster, onSelf);
		const woreRefuel = who === "player" && liveBuffs.some((buff) => buff.name === "Haste" && buff.hasteFrom === "refuel");
		giveStatus(who, {
			name: "Haste",
			left,
			power: 150,
			hasteFrom: "spell"
		}, (buff) => buff.name === "Haste", false);
		return {
			text: `${cast} ${label}'s magic haste is 150/1024.${woreRefuel ? " Refueling wears off." : ""}`,
			at
		};
	}
	if (spell.regen) {
		const tier = spell.regen.tier;
		if (!barrierOverwrites(statusTier(who, "Regen"), tier)) return {
			text: `${cast} No effect.`,
			at
		};
		const power = emboldenPotency(bold, REGEN_HP[tier]);
		giveStatus(who, {
			name: "Regen",
			left: emboldenDuration(bold, trustComposed(enhancingDuration(REGEN_SECONDS[tier], spell.regen.effectLevel, 75), caster, onSelf)),
			tier,
			power
		}, (buff) => buff.name === "Regen", true);
		return {
			text: `${cast} ${label} recovers ${power} HP every 3 seconds.`,
			at
		};
	}
	if (spell.stoneskin) {
		const skinNow = (who === "player" ? liveBuffs : liveTrusts[who]?.buffs ?? []).find((buff) => buff.name === "Stoneskin");
		if (!stoneskinCanLand(skinNow ? stoneskinSource(skinNow.skinFrom) : null)) return {
			text: `${cast} No effect.`,
			at
		};
		const power = emboldenPotency(bold, stoneskinPower(sheet.mnd, sheet.enhancing));
		giveStatus(who, {
			name: "Stoneskin",
			left: emboldenDuration(bold, trustComposed(300, caster, onSelf)),
			power,
			skinFrom: "spell"
		}, (buff) => buff.name === "Stoneskin", false);
		return {
			text: `${cast} Stoneskin absorbs ${power} points of damage on ${label}.`,
			at
		};
	}
	if (spell.blink) {
		const shadows = emboldenPotency(bold, 2);
		giveStatus(who, {
			name: "Blink",
			left: emboldenDuration(bold, trustComposed(enhancingDuration(300, spell.blink.effectLevel, 75), caster, onSelf)),
			charges: shadows
		}, (buff) => buff.name === "Blink", false);
		return {
			text: `${cast} ${label} gains ${shadows} shadows.`,
			at
		};
	}
	if (spell.aquaveil) {
		const charges = emboldenPotency(bold, aquaveilCharges(sheet.enhancing));
		giveStatus(who, {
			name: "Aquaveil",
			left: emboldenDuration(bold, trustComposed(enhancingDuration(600, spell.aquaveil.effectLevel, 75), caster, onSelf)),
			charges
		}, (buff) => buff.name === "Aquaveil", false);
		return {
			text: `${cast} ${label} gains Aquaveil (${charges}).`,
			at
		};
	}
	if (spell.phalanx) {
		const cut = emboldenPotency(bold, phalanxPower(sheet.enhancing));
		if (!phalanxOverwrites(statusPower(who, "Phalanx"), cut)) return {
			text: `${cast} No effect.`,
			at
		};
		giveStatus(who, {
			name: "Phalanx",
			left: emboldenDuration(bold, trustComposed(enhancingDuration(180, spell.phalanx.effectLevel, 75), caster, onSelf)),
			power: cut
		}, (buff) => buff.name === "Phalanx", false);
		return {
			text: `${cast} Phalanx reduces each hit on ${label} by ${cut}.`,
			at
		};
	}
	if (spell.reprisal) {
		if ((who === "player" ? liveBuffs : liveTrusts[who]?.buffs ?? []).some((buff) => isSpike(buff.name))) return {
			text: `${cast} No effect.`,
			at
		};
		giveStatus(who, {
			name: "Reprisal",
			left: trustComposed(enhancingDuration(60, spell.reprisal.effectLevel, 75), caster, onSelf),
			power: 33
		}, (buff) => buff.name === "Reprisal", false);
		return {
			text: `${cast} Reprisal covers ${label}.`,
			at
		};
	}
	if (spell.enspell) {
		if (!enspellOverwrites((who === "player" ? liveBuffs : liveTrusts[who]?.buffs ?? []).find((buff) => buff.enspell)?.enspell?.tier ?? null, spell.enspell.tier)) return {
			text: `${cast} No effect.`,
			at
		};
		const base = spell.enspell.tier === 1 ? enspellTwoBase(sheet.enhancing) : 0;
		const left = trustComposed(180, caster, onSelf);
		giveStatus(who, {
			name: spell.name,
			left,
			enspell: {
				tier: spell.enspell.tier,
				element: spell.enspell.element,
				base,
				rounds: 0
			}
		}, (buff) => buff.name === "Auspice" || buff.enspell != null, false);
		return {
			text: `${cast} ${spell.name} covers ${label}.`,
			at
		};
	}
	if (spell.spike) {
		const base = emboldenPotency(bold, spikeBase(spell.spike, sheet.int));
		const left = emboldenDuration(bold, trustComposed(180, caster, onSelf));
		giveStatus(who, {
			name: spell.spike,
			left,
			spikeBase: base
		}, (buff) => isSpike(buff.name) || buff.name === "Reprisal", false);
		return {
			text: `${cast} ${spell.spike} covers ${label}.`,
			at
		};
	}
	if (spell.barrier && !spell.barrier.area) {
		const kind = spell.barrier.kind;
		const tier = spell.barrier.tier;
		const status = kind === "protect" ? "Protect" : "Shell";
		if (!barrierOverwrites(statusTier(who, status), tier)) return {
			text: `${cast} No effect.`,
			at
		};
		const raw = kind === "protect" ? PROTECT_DEF[tier] : SHELL_CUT[tier];
		const power = (kind === "protect" ? emboldenPotency(bold, raw) + shieldBonus(who) : emboldenPotency(bold, raw));
		giveStatus(who, {
			name: status,
			left: emboldenDuration(bold, trustComposed(barrierDuration(spell.barrier.effectLevel, 75), caster, onSelf)),
			tier,
			power
		}, (buff) => buff.name === status, true);
		return {
			text: `${cast} ${kind === "protect" ? `Defense +${power}.` : `Magic damage cut ${power}/256.`} ${label} receives it.`,
			at
		};
	}
	if (spell.reraise) {
		const left = trustComposed(RERAISE_SECONDS, caster, onSelf);
		if (!giveStatus(who, {
			name: spell.reraise,
			left
		}, (buff) => isReraiseSpell(buff.name), false)) return {
			text: `${cast} No effect.`,
			at
		};
		return {
			text: `${cast} ${spell.reraise} covers ${label}.`,
			at
		};
	}
	if (spell.foil) {
		const power = emboldenPotency(bold, 150);
		giveStatus(who, {
			name: "Foil",
			left: emboldenDuration(bold, trustComposed(enhancingDuration(30, spell.foil.effectLevel, 75), caster, onSelf)),
			power,
			acc: 0
		}, (buff) => buff.name === "Foil", false);
		return {
			text: `${cast} ${label}'s Foil starts at ${power} and decays by 3 every 3 seconds.`,
			at
		};
	}
	return null;
}
function healTrust(amount, radius) {
	const ids = summonedTrustIds();
	if (ids.length === 0) return {
		note: "",
		touched: false
	};
	const notes = [];
	let touched = false;
	for (const id of ids) {
		const trust = liveTrusts[id];
		const name = trustName(id);
		const place = trustPlaces[id];
		if (!trust || !place || place.party > radius) {
			notes.push(` ${name} is out of range.`);
			continue;
		}
		const gained = Math.min(Math.max(0, Math.floor(amount)), Math.max(0, trust.maxHp - trust.hp));
		if (gained <= 0) {
			notes.push(` ${name}'s HP is full.`);
			continue;
		}
		trust.hp += gained;
		notes.push(` ${name} recovers ${gained} HP.`);
		touched = true;
	}
	return {
		note: notes.join(""),
		touched
	};
}
/** The player's Engage gambit wants a step toward the hare. Manual movement wins. */
export function gambitClosing() {
	return gambitClose;
}
export function trustEngaged(id = KUPIPI_ID) {
	return liveTrusts[id]?.engaged === true;
}
export function trustSwingClock(id = KUPIPI_ID) {
	const state = useGame.getState();
	const who = trustById(id);
	const sub = state.party.subs[id] ?? null;
	const sheet = trustCombat(id, sub && who && sub !== who.job ? sub : null, trustGearOf(state.party, id));
	const magic = hasteMagic(liveTrusts[id]?.buffs ?? []);
	const rows = foeIsKin() ? kinEnfeebles : liveEnfeebles;
	const samba = rows.some((row) => row.name === "Haste Daze") ? 51 : 0;
	const ranged = sheet.skillName === "Archery" || sheet.skillName === "Marksmanship";
	if ((magic <= 0 && samba <= 0) || ranged) return {
		seconds: sheet.swing.seconds,
		delay: sheet.delay
	};
	const timed = swingTiming(sheet.swing.baseDelay, {
		equipment: 0,
		magic,
		jobAbility: samba,
		dualWield: sheet.dualWield
	});
	return {
		seconds: timed.seconds,
		delay: timed.modifiedDelay
	};
}
/** Spell bar for a trust. Null when that trust is not casting, including an instant cast. */
export function trustCastClock(id = KUPIPI_ID) {
	const cast = liveTrusts[id]?.cast;
	if (!cast || cast.total <= 0) return null;
	return {
		name: cast.name,
		left: Math.max(0, cast.left),
		total: cast.total
	};
}
export function noteBehind(behind) {
	playerBehind = behind;
}
/** Buffs a field swing needs. The mob's nose is applied by the caller. */
export function readThiefQuery() {
	const state = useGame.getState();
	const sheet = state.sheet;
	const buffs = state.buffs || [];
	return {
		hidden: buffs.some((buff) => buff.name === "Hide"),
		sneak: buffs.some((buff) => buff.name === "Sneak Attack"),
		trick: buffs.some((buff) => buff.name === "Trick Attack"),
		partner: trickTarget() != null,
		dex: sheet?.dex ?? 0,
		agi: sheet?.agi ?? 0,
		mainThief: sheet?.job === "THF",
		assassin: !!sheet?.assassin
	};
}
/** The fight target is inside the blue cone. Claw Cyclone and Poison Breath read this. */
export function noteCone(inFan) {
	playerCone = inFan;
}
/** Player and monster positions, in yalms. Trick Attack uses the line between them. */
export function noteStands(player, foe) {
	playerStand = player;
	foeStand = foe;
}
/** Off-hand and extra swings of a Trick Attack round. Null once the animation ends. */
export function peekTrickHand() {
	return trickHand;
}
/** The round is over. Later damage keeps its own enmity. */
export function endTrickRound() {
	trickHateTo = null;
	trickHand = null;
}
export function playerIsBehind() {
	return playerBehind;
}
function ninCastContext(sheet, buffs, main) {
	const copy = buffs.find((buff) => buff.name === "Copy Image");
	const innin = buffs.find((buff) => buff.name === "Innin");
	const blind = liveEnfeebles.find((row) => row.name === "Blind");
	return {
		skill: combinedSkill("Ninjutsu", sheet.job, 75, sheet.sub, sheet.subLevel),
		dInt: sheet.int - HARE.int,
		main,
		yonin: buffs.some((buff) => buff.name === "Yonin"),
		inninPower: innin ? stancePower(innin.left) : 0,
		behind: playerBehind,
		shadows: copy && (copy.charges ?? 0) > 0 ? {
			tier: copy.tier ?? 1,
			charges: copy.charges ?? 0
		} : null,
		blindDown: blind?.accDown ?? 0
	};
}
function keepNinBuffs(buffs, land) {
	if (land.noEffect || !land.give) return buffs;
	const drop = new Set(land.drop);
	return [...buffs.filter((buff) => !drop.has(buff.name)), {
		name: land.give.name,
		left: land.give.left,
		...land.give.power != null ? { power: land.give.power } : {},
		...land.give.charges != null ? { charges: land.give.charges } : {},
		...land.give.tier != null ? { tier: land.give.tier } : {}
	}];
}
/** Shadow CE comes off the attacker that just swung, not the other rarab. */
function shaveStrikerCe(amount) {
	if (amount <= 0) return;
	if (strikeKin) {
		const row = kinHateRows.find((entry) => entry.id === "player");
		if (!row) return;
		const next = foldHate(row, -amount, 0);
		if (!seatRow(row, next.ce, next.ve, actorNear("player", true))) kinHateRows = kinHateRows.filter((entry) => entry.id !== "player");
		return;
	}
	liveHate = foldHate(playerHate(), -amount, 0);
	writePlayerRow(liveHate.ce, liveHate.ve);
}
function publishShadowBuffs() {
	const buffs = liveBuffs.map((buff) => ({ ...buff }));
	if (strikeKin) useGame.setState({
		buffs,
		...kinHateState()
	});
	else useGame.setState({
		buffs,
		...hateNow()
	});
}
function spendPlayerShadows(need) {
	const api = useGame.getState();
	let broke = false;
	for (const name of ["Copy Image", "Blink"]) {
		const row = liveBuffs.find((buff) => buff.name === name);
		const have = row?.charges ?? 0;
		if (!row || have <= 0) continue;
		const label = name === "Copy Image" ? "Utsusemi" : "Blink";
		if (have >= need) {
			const next = have - need;
			if (next <= 0) {
				liveBuffs = liveBuffs.filter((buff) => buff.name !== name);
				api.pushLog(name === "Copy Image" ? "The last shadow absorbs the hit." : "Blink's last shadow absorbs the hit.", "info");
			} else {
				liveBuffs = liveBuffs.map((buff) => buff.name === name ? {
					...buff,
					charges: next
				} : buff);
				api.pushLog(`${label} absorbs the hit. ${next} ${next === 1 ? "shadow remains" : "shadows remain"}.`, "info");
			}
			shaveStrikerCe(25 * need);
			publishShadowBuffs();
			return "ate";
		}
		liveBuffs = liveBuffs.filter((buff) => buff.name !== name);
		shaveStrikerCe(25 * have);
		publishShadowBuffs();
		api.pushLog(`${label} loses ${have} ${have === 1 ? "shadow" : "shadows"}. The hit lands.`, "info");
		broke = true;
	}
	return broke ? "broke" : "none";
}
function playerHate() {
	const row = hateRows.find((entry) => entry.id === "player");
	return row ? {
		ce: row.ce,
		ve: row.ve
	} : {
		ce: 0,
		ve: 0
	};
}
/**
* Battle Dance DEX Down is applied before accuracy and the critical-hit
* DEX. Accuracy is floor((DEX − down) × 0.75) plus the skill already
* baked into the hare, then the other accuracy downs.
*/
function hareSwingStats(accDown) {
	const down = liveEnfeebles.reduce((n, row) => row.name === "DEX Down" ? n + (row.power ?? 0) : n, 0) + statDown("dex", liveHareDebuffs);
	const dex = Math.max(0, HARE.dex - down);
	const skill = HARE.accuracy - Math.floor(HARE.dex * .75);
	return {
		accuracy: Math.max(0, Math.floor(dex * .75) + skill - accDown),
		dex
	};
}
/** Wild Oats lowers VIT. Defense is the rank at that VIT. Zero down keeps the baked defense. */
function foeVitDefense(rows) {
	let down = statDown("vit", debuffsFor(rows));
	for (const row of rows) if (row.name === "VIT Down") down += row.power ?? 0;
	return hareLiveDefense(down);
}
/** One point on the row's own pace. Wild Oats is 6 seconds. Awful Eye is 1. Nine Wild Oats steps empty a fresh −9 in 54 seconds. */
function stepVitDown(row, dt) {
	const left = row.left - dt;
	if (row.steady) return left > 0 ? {
		...row,
		left
	} : null;
	const pace = row.pace ?? 6;
	let power = row.power ?? 0;
	let decay = (row.decay ?? pace) - dt;
	while (decay <= 0 && power > 0) {
		power -= 1;
		decay += pace;
	}
	if (left <= 0 || power <= 0) return null;
	return {
		...row,
		left,
		power,
		decay
	};
}
/** Glittering Ruby adds one attribute. Ecliptic Growl adds both moon groups, except a stat Ruby already holds. */
function glittered(sheet) {
	let next = sheet;
	const ruby = liveBuffs.find((buff) => buff.name === "Glittering Ruby");
	if (ruby?.attr && ruby.power && ruby.power > 0) {
		const key = ruby.attr.toLowerCase();
		next = {
			...next,
			[key]: next[key] + ruby.power
		};
	}
	const growl = liveBuffs.find((buff) => buff.name === "Ecliptic Growl");
	if (!growl) return next;
	const add = (stat, amount) => {
		if (amount <= 0 || stat === growl.skip) return;
		const key = stat.toLowerCase();
		next = {
			...next,
			[key]: next[key] + amount
		};
	};
	add("STR", growl.power ?? 0);
	add("DEX", growl.power ?? 0);
	add("VIT", growl.power ?? 0);
	add("AGI", growl.mind ?? 0);
	add("INT", growl.mind ?? 0);
	add("MND", growl.mind ?? 0);
	add("CHR", growl.mind ?? 0);
	return next;
}
function syncLiveHate() {
	liveHate = playerHate();
}
/** Writes CE and VE. Inside 30 yalms a row that would empty keeps 1 CE. */
function seatRow(row, ce, ve, near) {
	const held = holdClaim(ce, ve, near);
	row.ce = held.ce;
	row.ve = held.ve;
	return row.ce > 0 || row.ve > 0;
}
/** True while that actor is inside 30 yalms of this rarab. An unplaced actor does not hold the fight. */
function actorNear(id, kin) {
	if (!hateOwnerLive(id)) return false;
	if (id === "player") return (kin ? kinYards : yardDistance) <= HATE_NEAR_YARDS;
	if (id === "charm") return true;
	const origin = kin ? kinAt : hareAt;
	let point = null;
	if (id === "avatar") point = avatarAt;
	else if (id === "wyvern") point = wyvernAt;
	else if (id === "jug") point = jugAt;
	else if (id === "automaton") point = automatonAt;
	else if (trustPlaces[id]) {
		if (!kin) return trustPlaces[id].yards <= HATE_NEAR_YARDS;
		point = trustPlaces[id];
	}
	if (!point) return false;
	return Math.hypot((point.x ?? 0) - origin.x, (point.z ?? 0) - origin.z) <= HATE_NEAR_YARDS;
}
/** Past 30 yalms for 25 seconds, the list drops. Walking back in resets the wait. */
function tickHateLeash(dt) {
	const step = (rows, kin, away) => {
		if (rows.length === 0 || rows.some((row) => actorNear(row.id, kin))) return {
			away: 0,
			rows
		};
		const next = away + dt;
		if (next < HATE_DEAGGRO_SECONDS) return {
			away: next,
			rows
		};
		return {
			away: 0,
			rows: []
		};
	};
	const hare = step(hateRows, false, hareAway);
	hareAway = hare.away;
	if (hare.rows !== hateRows) {
		hateRows = hare.rows;
		syncLiveHate();
	}
	const kinStep = step(kinHateRows, true, kinAway);
	kinAway = kinStep.away;
	if (kinStep.rows !== kinHateRows) kinHateRows = kinStep.rows;
}
function writePlayerRow(ce, ve) {
	const row = hateRows.find((entry) => entry.id === "player");
	if (!row) return;
	if (!seatRow(row, ce, ve, actorNear("player", false))) hateRows = hateRows.filter((entry) => entry.id !== "player");
	syncLiveHate();
}
function hateActorName(id) {
	if (id === "player") return "you";
	if (id === "avatar") return avatar?.name ?? "the avatar";
	if (id === "wyvern") return "the wyvern";
	if (id === "jug") return "Courier Carrie";
	if (id === "charm") return `the ${HARE.name}`;
	if (id === "automaton") return "the automaton";
	return trustName(id);
}
/** A pet keeps its row only while it is out. A dead wyvern has already dropped it. */
function hateOwnerLive(owner) {
	if (owner === "player") return !useGame.getState().ko;
	if (owner === "avatar") return avatar != null && (avatar.max <= 0 || avatar.hp > 0);
	if (owner === "wyvern") return wyvern != null && wyvern.hp > 0;
	if (owner === "jug") return jug != null && jug.hp > 0;
	if (owner === "charm") return charm != null && (charm.who === "kin" ? liveKinHp > 0 : liveHareHp > 0);
	if (owner === "automaton") return automaton != null && automaton.hp > 0;
	const trust = liveTrusts[owner];
	return !!trust && !trust.ko;
}
function hateNow() {
	const body = readSwingBody();
	if (body) return {
		...packHateView(body.id),
		...packMarkNow()
	};
	syncLiveHate();
	const face = topHate(hateRows);
	return {
		hate: {
			ce: liveHate.ce,
			ve: liveHate.ve
		},
		hateFace: face ? {
			id: face.id,
			name: hateActorName(face.id),
			ce: face.ce,
			ve: face.ve
		} : null,
		...packMarkNow()
	};
}
function anyHate() {
	return hateRows.some((row) => row.ce > 0 || row.ve > 0);
}
function dropHateRow(id) {
	let packChanged = false;
	for (const [pid, rows] of packHate) {
		const next = rows.filter((row) => row.id !== id);
		if (next.length === rows.length) continue;
		packChanged = true;
		if (next.length) packHate.set(pid, next);
		else packHate.delete(pid);
	}
	if (strikeKin) {
		const had = kinHateRows.some((row) => row.id === id && (row.ce > 0 || row.ve > 0));
		kinHateRows = kinHateRows.filter((row) => row.id !== id);
		useGame.setState(kinHateState());
		return had;
	}
	const had = hateRows.some((row) => row.id === id && (row.ce > 0 || row.ve > 0));
	hateRows = hateRows.filter((row) => row.id !== id);
	syncLiveHate();
	if (packChanged && readSwingBody()) useGame.setState(hateNow());
	return had;
}
/** A Raise that landed on a KO trust. They accept it. Hate is gone, the same as a player raise. */
function acceptRaise(id, spellName) {
	const trust = liveTrusts[id];
	if (!trust) return null;
	if (!trust.ko && trust.hp > 0) return null;
	const prev = trust.buffs.find((buff) => buff.name === "Weakness" && (buff.left ?? 0) > 0);
	const revived = resolveRaise(spellName, {
		ko: true,
		level: 75,
		maxHp: Math.max(1, trust.maxHp || 1),
		weakness: prev ? { left: prev.left, double: (prev.power ?? 1) >= 2 } : null
	});
	if (!revived) return null;
	trust.ko = false;
	trust.hp = Math.max(0, revived.hp);
	trust.engaged = false;
	trust.buffs = trust.buffs.filter((buff) => buff.name !== "Weakness");
	trust.buffs.push({
		name: "Weakness",
		left: revived.weakness.left,
		power: revived.weakness.double ? 2 : 1
	});
	dropHateRow(id);
	return revived;
}
/** The forest rabbit whose blow is resolving. CE loss stays on that body, not the pen. */
var blowPackId = null;
function loseCe(id, amount, onPack) {
	if (amount <= 0) return;
	const packKey = onPack || blowPackId || null;
	let acted = null;
	if (packKey) {
		const body = livePack().find((entry) => entry.id === packKey);
		if (!body || body.hp <= 0 || body.mode === "dead" || body.mode === "leash") return;
		acted = body;
	} else if (!strikeKin) acted = readActedBody();
	if (acted) {
		const rows = packHate.get(acted.id);
		const row = rows?.find((entry) => entry.id === id);
		const body = livePack().find((entry) => entry.id === acted.id);
		if (!row || !rows || !body) return;
		const next = foldHate(row, -amount, 0);
		if (!seatRow(row, next.ce, next.ve, packActorNear(body, id))) rows.splice(rows.indexOf(row), 1);
		if (!rows.length) packHate.delete(acted.id);
		useGame.setState(hateNow());
		return;
	}
	if (strikeKin) {
		const row = kinHateRows.find((entry) => entry.id === id);
		if (!row) return;
		const next = foldHate(row, -amount, 0);
		if (!seatRow(row, next.ce, next.ve, actorNear(id, true))) kinHateRows = kinHateRows.filter((entry) => entry.id !== id);
		useGame.setState(kinHateState());
		return;
	}
	const row = hateRows.find((entry) => entry.id === id);
	if (!row) return;
	const next = foldHate(row, -amount, 0);
	if (!seatRow(row, next.ce, next.ve, actorNear(id, false))) hateRows = hateRows.filter((entry) => entry.id !== id);
	syncLiveHate();
}
/** Hate on one forest rabbit. The training pair keeps hateRows. */
var packHate = /* @__PURE__ */ new Map();
function packHateTotal(id) {
	const rows = packHate.get(id);
	if (!rows) return 0;
	let total = 0;
	for (const row of rows) if ((row.ce ?? 0) > 0 || (row.ve ?? 0) > 0) total += (row.ce ?? 0) + (row.ve ?? 0);
	return total;
}
function packActorNear(body, id) {
	if (!hateOwnerLive(id)) return false;
	if (id === "player") return packYards(body) <= HATE_NEAR_YARDS;
	const place = trustPlaces[id];
	if (!place || place.x == null || place.z == null) return false;
	return Math.hypot(place.x - body.x, place.z - body.z) <= HATE_NEAR_YARDS;
}
function packHateView(id) {
	const rows = packHate.get(id) ?? [];
	const mine = rows.find((row) => row.id === "player");
	const face = topHate(rows);
	return {
		hate: {
			ce: mine?.ce ?? 0,
			ve: mine?.ve ?? 0
		},
		hateFace: face ? {
			id: face.id,
			name: hateActorName(face.id),
			ce: face.ce,
			ve: face.ve
		} : null
	};
}
/** Who this forest rabbit is swinging at. The card reads the same list. Null if nobody has a row. */
export function readPackFace(id) {
	if (!id) return null;
	const face = topHate(packHate.get(id) ?? []);
	if (!face) return null;
	return { id: face.id };
}
/** What the forest target card draws. The pen's hateFace stays the training fight. */
function packMarkNow() {
	const id = readPackPlate().id || readSwingBody()?.id || null;
	if (!id) return { packMark: null };
	const body = livePack().find((row) => row.id === id);
	if (!body || body.hp <= 0 || body.mode === "dead" || body.mode === "leash") return { packMark: null };
	const held = packStatuses.get(id);
	const view = packHateView(id);
	const face = view.hateFace;
	const enfeebles = held ? held.enfeebles.map((row) => ({ ...row })) : [];
	const debuffs = held ? held.debuffs.map((row) => ({ ...row })) : [];
	const yours = !face || face.id === "player";
	const ce = yours ? view.hate.ce : face.ce;
	const ve = yours ? view.hate.ve : face.ve;
	if (!enfeebles.length && !debuffs.length && !(ce > 0) && !(ve > 0)) return { packMark: null };
	return {
		packMark: {
			id,
			enfeebles,
			debuffs,
			ce,
			ve,
			faceId: yours ? null : face.id,
			faceName: yours ? null : face.name
		}
	};
}
function packPlateSignature() {
	let text = "";
	for (const [id, held] of packStatuses) {
		text += `|${id}`;
		for (const row of held.enfeebles) text += `:${row.name}:${Math.ceil(row.left ?? 0)}:${row.accDown ?? ""}:${row.power ?? ""}:${row.dot ?? ""}`;
		for (const row of held.debuffs) text += `:d:${row.name}:${Math.ceil(row.left ?? 0)}`;
	}
	for (const [id, rows] of packHate) {
		text += `|h:${id}`;
		for (const row of rows) text += `:${row.id}:${row.ce}:${Math.floor(row.ve)}`;
	}
	return text;
}
function creditPackHate(id, ce, ve, claims, owner = "player", quiet = false) {
	const body = livePack().find((row) => row.id === id);
	if (!body || body.hp <= 0 || body.mode === "dead" || body.mode === "leash") return;
	if (!hateOwnerLive(owner)) return;
	let rows = packHate.get(id);
	if (!rows) {
		rows = [];
		packHate.set(id, rows);
	}
	const empty = !rows.some((row) => row.ce > 0 || row.ve > 0);
	if (empty && !claims) return;
	if (!empty && ce === 0 && ve === 0) return;
	let addCe = ce;
	let addVe = ve;
	const sentinel = (owner === "player" ? liveBuffs : liveTrusts[owner]?.buffs ?? []).find((buff) => buff.name === "Sentinel");
	if (sentinel && (sentinel.power ?? 0) > 0) {
		addCe = Math.floor(addCe * sentinel.power);
		addVe = Math.floor(addVe * sentinel.power);
	}
	let row = rows.find((entry) => entry.id === owner);
	if (!row) {
		if (!claims && owner !== "avatar" && owner !== "wyvern" && owner !== "jug" && owner !== "charm" && owner !== "automaton") return;
		row = { id: owner, ce: 0, ve: 0, stamp: 0 };
		rows.push(row);
	}
	if (empty && claims && !quiet) {
		addCe += 200;
		addVe += 900;
		useGame.getState().pushLog(`The ${HARE.name} turns on ${hateActorName(owner)}.`, "info");
	} else if (empty && claims) {
		addCe += 200;
		addVe += 900;
	}
	if (addCe === 0 && addVe === 0) return;
	const next = foldHate(row, addCe, addVe);
	if (!seatRow(row, next.ce, next.ve, packActorNear(body, owner))) {
		const at = rows.indexOf(row);
		if (at >= 0) rows.splice(at, 1);
	} else row.stamp = ++hateStamp;
	if (!rows.length) packHate.delete(id);
	useGame.setState({
		...readSwingBody() ? hateNow() : packHateView(id),
		...packMarkNow()
	});
}
function tickPackHate(dt) {
	let dirty = false;
	for (const [id, rows] of [...packHate]) {
		const body = livePack().find((row) => row.id === id);
		if (!body || body.hp <= 0 || body.mode === "dead" || body.mode === "leash") {
			packHate.delete(id);
			dirty = true;
			continue;
		}
		const next = [];
		for (const row of rows) {
			const before = Math.floor(row.ve);
			const ve = Math.max(0, row.ve - 60 * dt);
			if (!seatRow(row, row.ce, ve, packActorNear(body, row.id))) {
				dirty = true;
				continue;
			}
			if (Math.floor(row.ve) !== before) dirty = true;
			next.push(row);
		}
		if (next.length) packHate.set(id, next);
		else {
			packHate.delete(id);
			dirty = true;
		}
	}
	if (dirty && readSwingBody()) useGame.setState(hateNow());
}
/** A forest blow's damage enmity. The claim has to be open first, or this lands on the pen. */
export function creditPackBlow(dmg, owner = "player") {
	creditDamage(dmg, owner);
}
export function dropPackFight(id) {
	packHate.delete(id);
	packStatuses.delete(id);
	clearChain(id);
	useGame.setState(hateNow());
}
function creditHate(ce, ve, claims, owner = "player", quiet = false) {
	if (strikeFieldId) return;
	if (strikePackId) {
		creditPackHate(strikePackId, ce, ve, claims, owner, quiet);
		if (owner === "player" && (claims || ce > 0 || ve > 0)) notePackAct(strikePackId);
		return;
	}
	const acted = readActedBody();
	if (acted) {
		creditPackHate(acted.id, ce, ve, claims, owner, quiet);
		return;
	}
	if (packClaim()) return;
	if (strikeKin) {
		creditKinHate(ce, ve, claims, owner, quiet);
		return;
	}
	if (!hateOwnerLive(owner)) return;
	const empty = !anyHate();
	if (empty && !claims) return;
	if (!empty && ce === 0 && ve === 0) return;
	let addCe = ce;
	let addVe = ve;
	const sentinel = (owner === "player" ? liveBuffs : liveTrusts[owner]?.buffs ?? []).find((buff) => buff.name === "Sentinel");
	if (sentinel && (sentinel.power ?? 0) > 0) {
		addCe = Math.floor(addCe * sentinel.power);
		addVe = Math.floor(addVe * sentinel.power);
	}
	let row = hateRows.find((entry) => entry.id === owner);
	if (!row) {
		if (!claims && owner !== "avatar" && owner !== "wyvern" && owner !== "jug" && owner !== "charm" && owner !== "automaton") return;
		row = {
			id: owner,
			ce: 0,
			ve: 0,
			stamp: 0
		};
		hateRows.push(row);
	}
	if (empty && claims && !quiet) {
		addCe += 200;
		addVe += 900;
		const who = hateActorName(owner);
		useGame.getState().pushLog(`The ${HARE.name} turns on ${who}.`, "info");
	} else if (empty && claims) {
		addCe += 200;
		addVe += 900;
	}
	if (addCe === 0 && addVe === 0) return;
	const next = foldHate(row, addCe, addVe);
	row.ce = next.ce;
	row.ve = next.ve;
	row.stamp = ++hateStamp;
	if (row.ce > 0 || row.ve > 0) pulled = true;
	syncLiveHate();
}
function creditDamage(dmg, owner = "player") {
	if (strikeFieldId) return;
	const who = owner === "player" && trickHateTo ? trickHateTo : owner;
	const gain = damageEnmity(HARE.level, dmg);
	creditHate(gain.ce, gain.ve, true, who);
}
function kinHateState() {
	const row = kinHateRows.find((entry) => entry.id === "player");
	const face = topHate(kinHateRows);
	return {
		kinHate: row ? {
			ce: row.ce,
			ve: row.ve
		} : {
			ce: 0,
			ve: 0
		},
		kinHateFace: face ? {
			id: face.id,
			name: hateActorName(face.id),
			ce: face.ce,
			ve: face.ve
		} : null
	};
}
/** The second Tropical Rarab's list. Same claim, CE, and VE rules as the training dummy. */
function creditKinHate(ce, ve, claims, owner = "player", quiet = false) {
	if (!hateOwnerLive(owner)) return;
	const empty = !kinHateRows.some((row) => row.ce > 0 || row.ve > 0);
	if (empty && !claims) return;
	if (!empty && ce === 0 && ve === 0) return;
	let addCe = ce;
	let addVe = ve;
	const sentinel = (owner === "player" ? liveBuffs : liveTrusts[owner]?.buffs ?? []).find((buff) => buff.name === "Sentinel");
	if (sentinel && (sentinel.power ?? 0) > 0) {
		addCe = Math.floor(addCe * sentinel.power);
		addVe = Math.floor(addVe * sentinel.power);
	}
	let row = kinHateRows.find((entry) => entry.id === owner);
	if (!row) {
		if (!claims && owner !== "avatar" && owner !== "wyvern" && owner !== "jug" && owner !== "charm" && owner !== "automaton") return;
		row = {
			id: owner,
			ce: 0,
			ve: 0,
			stamp: 0
		};
		kinHateRows.push(row);
	}
	if (empty && claims && !quiet) {
		addCe += 200;
		addVe += 900;
		const who = hateActorName(owner);
		useGame.getState().pushLog(`The ${HARE.name} turns on ${who}.`, "info");
	} else if (empty && claims) {
		addCe += 200;
		addVe += 900;
	}
	if (addCe === 0 && addVe === 0) return;
	const next = foldHate(row, addCe, addVe);
	row.ce = next.ce;
	row.ve = next.ve;
	row.stamp = ++kinHateStamp;
	useGame.setState(kinHateState());
}
function creditKinDamage(dmg, owner = "player") {
	const who = owner === "player" && trickHateTo ? trickHateTo : owner;
	const gain = damageEnmity(HARE.level, dmg);
	creditKinHate(gain.ce, gain.ve, true, who);
}
function dropKinHateRow(id) {
	const had = kinHateRows.some((row) => row.id === id && (row.ce > 0 || row.ve > 0));
	kinHateRows = kinHateRows.filter((row) => row.id !== id);
	return had;
}
/** Floor of the target's CE and VE, moved onto the thief. No claim bonus and no Sentinel multiplier. */
function moveEnmity(fromId, toId, rate) {
	const from = hateRows.find((entry) => entry.id === fromId);
	if (!from || fromId === toId) return {
		ce: 0,
		ve: 0
	};
	const takeCe = Math.floor(from.ce * rate);
	const takeVe = Math.floor(from.ve * rate);
	from.ce -= takeCe;
	from.ve -= takeVe;
	if (from.ce <= 0 && from.ve <= 0) hateRows = hateRows.filter((entry) => entry.id !== fromId);
	if (takeCe > 0 || takeVe > 0) {
		let row = hateRows.find((entry) => entry.id === toId);
		if (!row) {
			row = {
				id: toId,
				ce: 0,
				ve: 0,
				stamp: 0
			};
			hateRows.push(row);
		}
		const next = foldHate(row, takeCe, takeVe);
		row.ce = next.ce;
		row.ve = next.ve;
		row.stamp = ++hateStamp;
		pulled = true;
	}
	syncLiveHate();
	return {
		ce: takeCe,
		ve: takeVe
	};
}
/** Living trust standing between you and the monster. Hide does not count. */
function trickTarget() {
	const state = useGame.getState();
	const allies = [];
	for (const id of state.party.summoned) {
		const trust = liveTrusts[id];
		const place = trustPlaces[id];
		if (!trust || trust.ko || !trickAllyPresent(place)) continue;
		allies.push({
			id,
			x: place.x,
			z: place.z
		});
	}
	return partnerOnLine(playerStand.x, playerStand.z, foeStand.x, foeStand.z, allies);
}
function rarabMoveName() {
	const raw = strikerMove ?? useGame.getState().hareAction?.name ?? "attack";
	if (raw === "Foot Kick" || raw === "Whirl Claws" || raw === "Dust Cloud" || raw === "Wild Carrot" || raw === "attack") return raw;
	return "attack";
}
/** A TP move empties the attacker's bar. The other body's TP stays. */
function zeroStrikerTp() {
	if (strikeKin) {
		liveKinTp = 0;
		useGame.setState({ kinTp: 0 });
		return;
	}
	useGame.setState({ hareTp: 0 });
}
/**
* TP added after the caller already decided the amount.
* An auto on a pet is the raw gain. A trust hit already applied that trust's Subtle Blow.
*/
function addStrikerAutoTp(gain) {
	const n = Math.floor(gain);
	if (n <= 0) return;
	if (strikeKin) {
		if (liveHareHp <= 0) return;
		liveKinTp = Math.min(3e3, liveKinTp + n);
		useGame.setState({ kinTp: liveKinTp });
		return;
	}
	useGame.setState({ hareTp: useGame.getState().hareTp + n });
}
/** Wild Carrot restores the attacker. During a borrowed swing that HP is the second rarab. */
function commitCarrot() {
	if (strikeKin) {
		liveKinTp = 0;
		liveKinHp = liveHareHp;
		useGame.setState({
			kinHp: liveHareHp,
			kinTp: 0
		});
		return;
	}
	useGame.setState({
		hareHp: liveHareHp,
		hareTp: 0
	});
}
function publishStrikerBody(extra = {}) {
	if (strikeKin) {
		useGame.setState({
			...kinHateState(),
			kinHp: liveHareHp,
			kinTp: liveKinTp,
			...extra
		});
		return;
	}
	useGame.setState({
		...hateNow(),
		hareHp: liveHareHp,
		...extra
	});
}
function grantOwnerTp(baseTp, owner) {
	if (owner === "player") {
		useGame.getState().grantMonsterTp(baseTp);
		return;
	}
	const trust = liveTrusts[owner];
	if (!trust) return;
	const state = useGame.getState();
	const sheet = trustCombat(owner, trustSubOf(state.party, owner), trustGearOf(state.party, owner));
	const mnk = sheet.job === "MNK" ? 75 : sheet.sub === "MNK" ? sheet.subLevel : 0;
	const gain = monsterTpGain(baseTp, subtleBlow(trust.buffs) + mnkSubtleBlow(mnk) + (sheet.subtleBlow ?? 0));
	if (gain <= 0) return;
	addStrikerAutoTp(gain);
}
/** A rarab swing aimed at a trust. Same strike and taken math as the player. */
function landOnTrust(id, front, forcedMove, packId) {
	const api = useGame.getState();
	const move = forcedMove || rarabMoveName();
	const who = trustById(id);
	const trust = who ? liveTrusts[id] : null;
	const name = who?.name ?? "Trust";
	const physical = move === "attack" || move === "Foot Kick" || move === "Whirl Claws";
	const publish = () => publishStrikerBody({ trustVitals: trustVitalsNow() });
	const spendTp = () => {
		if (packId) return;
		if (move !== "attack") zeroStrikerTp();
	};
	if (move !== "Wild Carrot" && trust?.buffs.some((buff) => buff.song?.family === "mazurka")) {
		trust.buffs = trust.buffs.filter((buff) => buff.song?.family !== "mazurka");
		api.pushLog(`${name}'s Mazurka wears off.`, "info");
	}
	if (move !== "Wild Carrot" && trust) breakActorTravel(id, "hit");
	if (move === "Wild Carrot") {
		spendTp();
		if (liveHareHp <= 0) return {
			tag: "heal",
			name: move,
			damage: 0,
			crit: false,
			hp: 0
		};
		if (harePlagueUp()) {
			api.pushLog(`The ${HARE.name} uses Wild Carrot. Plague prevents the recovery.`, "info");
			return {
				tag: "heal",
				name: move,
				damage: 0,
				crit: false,
				hp: 0
			};
		}
		const strike = rollRarabStrike({
			move,
			weaponDamage: HARE.weaponDamage,
			level: HARE.level,
			attack: 1,
			defense: 1,
			accuracy: 0,
			evasion: 0,
			dLevel: 0,
			dex: HARE.dex,
			targetAgi: 0,
			str: foeStr(),
			targetVit: 0,
			weaponRank: HARE.weaponRank,
			maxHp: HARE.hpNatural,
			hitRoll: 0,
			critRoll: 0,
			pdifRoll: 0
		});
		const gained = Math.min(strike.heal, Math.max(0, HARE.hpNatural - liveHareHp));
		liveHareHp += gained;
		commitCarrot();
		api.pushLog(`The ${HARE.name} uses Wild Carrot. It restores ${gained} HP.`, "info");
		return {
			tag: "heal",
			name: move,
			damage: 0,
			crit: false,
			hp: gained
		};
	}
	if (!trust || trust.ko || !who) return {
		tag: "evade",
		name: move,
		damage: 0,
		crit: false,
		hp: 0
	};
	if (physical && trust.buffs.some((buff) => buff.name === "Perfect Dodge")) {
		spendTp();
		api.pushLog(`${name}: Perfect Dodge.`, "miss");
		return {
			tag: "perfect",
			name: move,
			damage: 0,
			crit: false,
			hp: 0
		};
	}
	if (physical && trust.buffs.some((buff) => buff.name === "Third Eye")) {
		trust.buffs = trust.buffs.filter((buff) => buff.name !== "Third Eye");
		publish();
		spendTp();
		api.pushLog(`${name}: Third Eye.`, "miss");
		return {
			tag: "anticipate",
			name: move,
			damage: 0,
			crit: false,
			hp: 0
		};
	}
	const state = useGame.getState();
	const sub = trustSubOf(state.party, id);
	const gear = trustGearOf(state.party, id);
	const sheet = trustCombat(id, sub, gear);
	const mods = meleeStats(sheet, trust.buffs, protectPower(trust.buffs), 0, 0, false);
	const foeRows = packId ? packStatusRows(packId) : liveEnfeebles;
	const swung = hareSwingStats(foeRows.reduce((n, row) => n + (row.accDown ?? 0), 0));
	const strike = rollRarabStrike({
		move,
		weaponDamage: HARE.weaponDamage,
		level: HARE.level,
		attack: Math.max(1, Math.floor(HARE.attack * bioAttackFactor(foeRows) * attackDownFactor(foeRows))),
		defense: Math.max(1, mods.defense),
		accuracy: swung.accuracy,
		evasion: mods.evasion,
		dLevel: 75 - HARE.level,
		dex: swung.dex,
		targetAgi: sheet.agi,
		str: foeStr(),
		targetVit: sheet.vit,
		weaponRank: HARE.weaponRank,
		maxHp: HARE.hpNatural,
		hitRoll: Math.random() * 100,
		critRoll: Math.random() * 100 + (mods.foeCrit ?? 0),
		pdifRoll: Math.random()
	});
	if (strike.spendTp && !packId) zeroStrikerTp();
	if (!strike.hit) {
		const foe = move === "attack" ? `the ${HARE.name}` : move;
		api.pushLog(`${name} evades ${foe}.`, "miss");
		return {
			tag: "evade",
			name: move,
			damage: 0,
			crit: false,
			hp: 0
		};
	}
	if (strike.shadows > 0) {
		let need = strike.shadows;
		let ate = false;
		let broke = false;
		for (const shadowName of ["Copy Image", "Blink"]) {
			if (need <= 0) break;
			const row = trust.buffs.find((buff) => buff.name === shadowName);
			const have = row?.charges ?? 0;
			if (!row || have <= 0) continue;
			const label = shadowName === "Copy Image" ? "Utsusemi" : "Blink";
			if (have >= need) {
				const next = have - need;
				if (next <= 0) trust.buffs = trust.buffs.filter((buff) => buff.name !== shadowName);
				else trust.buffs = trust.buffs.map((buff) => buff.name === shadowName ? {
					...buff,
					charges: next
				} : buff);
				loseCe(id, 25 * need, packId);
				api.pushLog(next <= 0 ? `${name}'s last shadow absorbs the hit.` : `${name}'s ${label} absorbs the hit. ${next} ${next === 1 ? "shadow remains" : "shadows remain"}.`, "info");
				ate = true;
				need = 0;
			} else {
				trust.buffs = trust.buffs.filter((buff) => buff.name !== shadowName);
				loseCe(id, 25 * have, packId);
				api.pushLog(`${name}'s ${label} loses ${have} ${have === 1 ? "shadow" : "shadows"}. The hit lands.`, "info");
				need -= have;
				broke = true;
			}
		}
		if (ate && !broke) {
			publish();
			return {
				tag: "shadow",
				name: move,
				damage: 0,
				crit: false,
				hp: 0
			};
		}
	}
	const dropTrustHide = () => {
		if (!trust.buffs.some((buff) => buff.name === "Hide")) return;
		trust.buffs = trust.buffs.filter((buff) => buff.name !== "Hide");
		api.pushLog(`${name}'s Hide wears off.`, "info");
	};
	if (strike.physical && trust.buffs.some((buff) => buff.name === "Invincible")) {
		dropTrustHide();
		if (strike.tpGain > 0 && !packId) grantOwnerTp(strike.tpGain, id);
		publish();
		api.pushLog(`The ${HARE.name} cuts ${name} for 0 points of damage.`, "miss");
		return {
			tag: "invincible",
			name: move,
			damage: 0,
			crit: false,
			hp: 0
		};
	}
	const shieldItem = gear.off === "Shield" ? ITEMS$1[trustItemId("Shield")] : null;
	const size = shieldItem?.kind === "Shield" ? shieldSize(shieldItem.id) : 0;
	const reprisal = trust.buffs.some((buff) => buff.name === "Reprisal");
	let raw = dustCloudAfterAddle(strike.raw, strike.magical);
	let magicResist = 0;
	if (strike.magical) {
		const runLevel = sheet.job === "RUN" ? 75 : sheet.sub === "RUN" ? subjobLevel(75) : 0;
		const resisted = dustCloudResisted(raw, trust.buffs, sheet.int, runLevel);
		raw = resisted.damage;
		magicResist = resisted.state;
	}
	let blocked = false;
	let guarded = false;
	if (strike.physical && size > 0 && front) {
		const skill = combinedSkill("Shield", sheet.job, 75, sheet.sub, sheet.subLevel);
		if (Math.random() * 100 < blockRate(size, skill, HARE.combatSkill, reprisal)) blocked = true;
	} else if (strike.physical && sheet.skillName === "Hand-to-Hand" && front && trust.engaged) {
		const skill = combinedSkill("Guard", sheet.job, 75, sheet.sub, sheet.subLevel);
		const mnkLv = monkJobLevel(sheet.job, sheet.sub, sheet.subLevel, 75);
		const dodge = trust.buffs.some((buff) => buff.name === "Dodge") ? dodgeGuard(mnkLv) : 0;
		const rate = guardRate(skill, HARE.level, dodge);
		if (rate > 0 && Math.random() * 100 < rate) {
			guarded = true;
			raw = physicalRaw(move, HARE.weaponDamage, fStr(foeStr() - sheet.vit, HARE.weaponRank), guardedPdif(strike.pdif), HARE.level);
		}
	}
	const sentinel = trust.buffs.find((buff) => buff.name === "Sentinel");
	const shell = trust.buffs.find((buff) => buff.name === "Shell");
	const phalanx = trust.buffs.find((buff) => buff.name === "Phalanx");
	const rampart = trust.buffs.some((buff) => buff.name === "Rampart");
	const sentinelNow = sentinel ? sentinelCut(Math.max(0, 30 - sentinel.left)) : 0;
	let reflect = 0;
	let damage = 0;
	if (blocked && shieldItem) {
		const mitigated = rarabTaken(raw, "physical", {
			rampart,
			sentinel: sentinelNow,
			phalanx: 0,
			shell: 0,
			invincible: false
		});
		const skin = trust.buffs.find((buff) => buff.name === "Stoneskin")?.power ?? 0;
		if (sheet.shieldMastery > 0 && mitigated > skin) trust.tp = Math.min(3e3, trust.tp + sheet.shieldMastery);
		const def = shieldItem.def ?? 0;
		const reflectBase = sentinel ? raw : mitigated;
		if (move === "attack" && reprisal) reflect = reprisalReflect(blockKept(reflectBase, size, def));
		damage = rarabTaken(blockTaken(mitigated, size, def), "physical", {
			rampart: false,
			sentinel: 0,
			phalanx: phalanx?.power ?? 0,
			shell: 0,
			invincible: false
		});
	} else damage = rarabTaken(raw, strike.magical ? "magical" : "physical", {
		rampart,
		sentinel: sentinelNow,
		phalanx: phalanx?.power ?? 0,
		shell: shell?.power ?? 0,
		invincible: false
	});
	let killed = false;
	if (reflect > 0) {
		if (!packId) {
			killed = chipHare(reflect);
			if (!killed) grantOwnerTp(100, id);
		}
		const reflected = reflect === 1 ? "point" : "points";
		api.pushLog(`Reprisal reflects ${reflect} ${reflected} of light damage.`, "hit");
	}
	dropTrustHide();
	let lost = damage;
	const skin = trust.buffs.find((buff) => buff.name === "Stoneskin" && (buff.power ?? 0) > 0);
	if (skin && lost > 0) {
		const absorbed = Math.min(skin.power ?? 0, lost);
		lost -= absorbed;
		const remain = (skin.power ?? 0) - absorbed;
		if (remain <= 0) {
			trust.buffs = trust.buffs.filter((buff) => buff.name !== "Stoneskin");
			api.pushLog(`${name}'s Stoneskin wears off.`, "info");
		} else {
			trust.buffs = trust.buffs.map((buff) => buff.name === "Stoneskin" ? {
				...buff,
				power: remain
			} : buff);
			api.pushLog(`${name}'s Stoneskin absorbs ${absorbed} points of damage.`, "info");
		}
	}
	if (lost > 0) {
		loseCe(id, ceLostOnHit(lost, trust.maxHp), packId);
		trust.hp = Math.max(0, trust.hp - lost);
		if (trust.hp <= 0) {
			trust.hp = 0;
			trust.ko = true;
			trust.engaged = false;
			trust.cast = null;
			const abandoned = dropHateRow(id);
			api.pushLog(`${name} is knocked out.`, "miss");
			const still = strikeKin ? kinHateRows.some((row) => row.ce > 0 || row.ve > 0) : anyHate();
			if (abandoned && !still) api.pushLog(`The ${HARE.name} loses interest.`, "info");
			if (trustPets[id]) dismissTrustPet(id, id === "shikaree-z" ? "The wyvern leaves." : id === "lhu-mhakaracca" ? "Courier Carrie leaves." : id === "nashmeira" ? "The automaton leaves." : "The avatar leaves.");
			if (id === "lhu-mhakaracca") breakLhuCharm("The charm breaks.");
		}
	}
	if (strike.tpGain > 0 && !killed && !packId) grantOwnerTp(strike.tpGain, id);
	if (strike.blind > 0) {
		if (statusResisted(Math.round(sheet.blindResist * 100), false, Math.random())) api.pushLog("Resist!", "info");
		else {
			trust.buffs = trust.buffs.filter((buff) => buff.name !== "Blindness");
			trust.buffs = [...trust.buffs, {
				name: "Blindness",
				left: 120,
				power: strike.blind
			}];
			api.pushLog(`${name} is blinded.`, "info");
		}
	}
	publish();
	const points = damage === 1 ? "point" : "points";
	if (strike.magical) {
		api.pushLog(`The ${HARE.name} uses Dust Cloud. ${name} takes ${damage} ${points} of earth damage.${resistFractionLabel(magicResist) ? ` ${resistFractionLabel(magicResist)} resist.` : ""}`, "hit");
		return {
			tag: "magic",
			name: move,
			damage,
			crit: false,
			hp: 0
		};
	}
	if (blocked) {
		const verb = strike.crit ? "critical hit" : "attack";
		const foe = move === "attack" ? `the ${HARE.name}'s ${verb}` : `${move}${strike.crit ? "'s critical hit" : ""}`;
		api.pushLog(`${name} blocks ${foe} for ${damage} ${points} of damage.`, strike.crit ? "crit" : "hit");
		return {
			tag: "block",
			name: move,
			damage,
			crit: strike.crit,
			hp: 0,
			reflect
		};
	}
	if (guarded) {
		const foe = move === "attack" ? `the ${HARE.name}` : move;
		const blow = strike.crit ? `${foe}'s critical hit` : foe;
		api.pushLog(`${name} guards ${blow} for ${damage} ${points} of damage.`, strike.crit ? "crit" : "hit");
		return {
			tag: "guard",
			name: move,
			damage,
			crit: strike.crit,
			hp: 0
		};
	}
	const verb = strike.crit ? "critically cuts" : "cuts";
	const foe = move === "attack" ? `The ${HARE.name}` : move;
	api.pushLog(`${foe} ${verb} ${name} for ${damage} ${points} of damage.`, strike.crit ? "crit" : "hit");
	return {
		tag: "cut",
		name: move,
		damage,
		crit: strike.crit,
		hp: 0
	};
}
/**
* The hare's bite when a pet holds the hate.
* A wyvern uses the printed defense, evasion, and −40% damage taken.
* VIT is not on that line, so an auto adds no fSTR. AGI is not on it either,
* so only Foot Kick, which always crits, rolls a critical.
* An avatar with a printed job uses that Hume sheet: hit against evasion,
* pDIF against defense, fSTR from VIT, and a crit from AGI.
* Dust Cloud is magical. Carbuncle's Magic Defense Bonus divides it.
* A miss adds no enmity. A hit that leaves the pet standing loses CE.
* Zero HP dismisses it, and that drops the row.
* Dust Cloud's blind is not tracked on a pet.
* Cait Sith, Siren, the spirits, and the astral summons have no printed job,
* so those bites are still not scored.
*/
function landOnPet(id) {
	const api = useGame.getState();
	const move = rarabMoveName();
	const spendTp = () => {
		if (move !== "attack") zeroStrikerTp();
	};
	if (move === "Wild Carrot") {
		spendTp();
		if (liveHareHp <= 0) return {
			tag: "heal",
			name: move,
			damage: 0,
			crit: false,
			hp: 0
		};
		if (harePlagueUp()) {
			api.pushLog(`The ${HARE.name} uses Wild Carrot. Plague prevents the recovery.`, "info");
			return {
				tag: "heal",
				name: move,
				damage: 0,
				crit: false,
				hp: 0
			};
		}
		const strike = rollRarabStrike({
			move,
			weaponDamage: HARE.weaponDamage,
			level: HARE.level,
			attack: 1,
			defense: 1,
			accuracy: 0,
			evasion: 0,
			dLevel: 0,
			dex: HARE.dex,
			targetAgi: 0,
			str: foeStr(),
			targetVit: 0,
			weaponRank: HARE.weaponRank,
			maxHp: HARE.hpNatural,
			hitRoll: 0,
			critRoll: 0,
			pdifRoll: 0
		});
		const gained = Math.min(strike.heal, Math.max(0, HARE.hpNatural - liveHareHp));
		liveHareHp += gained;
		commitCarrot();
		api.pushLog(`The ${HARE.name} uses Wild Carrot. It restores ${gained} HP.`, "info");
		return {
			tag: "heal",
			name: move,
			damage: 0,
			crit: false,
			hp: gained
		};
	}
	if (id === "avatar") {
		if (!avatar) return {
			tag: "cut",
			name: move,
			damage: 0,
			crit: false,
			hp: 0,
			unscored: true
		};
		const who = avatar.name;
		const level = smnLevelNow();
		const sheet = avatarSheet(avatar.id, level);
		if (!sheet || !(avatar.max > 0)) {
			spendTp();
			api.pushLog(move === "attack" ? `The ${HARE.name} attacks ${who}.` : `The ${HARE.name} uses ${move} on ${who}.`, "hit");
			return {
				tag: "cut",
				name: move,
				damage: 0,
				crit: false,
				hp: 0,
				unscored: true
			};
		}
		const swung = hareSwingStats(liveEnfeebles.reduce((n, row) => n + (row.accDown ?? 0), 0));
		const strike = rollRarabStrike({
			move,
			weaponDamage: HARE.weaponDamage,
			level: HARE.level,
			attack: Math.max(1, Math.floor(HARE.attack * bioAttackFactor(liveEnfeebles) * attackDownFactor(liveEnfeebles))),
			defense: sheet.defense,
			accuracy: swung.accuracy,
			evasion: sheet.evasion,
			dLevel: level - HARE.level,
			dex: swung.dex,
			targetAgi: sheet.agi,
			str: foeStr(),
			targetVit: sheet.vit,
			weaponRank: HARE.weaponRank,
			maxHp: HARE.hpNatural,
			hitRoll: Math.random() * 100,
			critRoll: Math.random() * 100,
			pdifRoll: Math.random()
		});
		if (strike.spendTp) zeroStrikerTp();
		if (!strike.hit) {
			const foe = move === "attack" ? `the ${HARE.name}` : move;
			api.pushLog(`${who} evades ${foe}.`, "miss");
			return {
				tag: "evade",
				name: move,
				damage: 0,
				crit: false,
				hp: 0
			};
		}
		const damage = strike.magical ? applyMab(dustCloudAfterAddle(strike.raw, true), 0, sheet.mdb) : Math.max(0, Math.floor(strike.raw));
		const points = damage === 1 ? "point" : "points";
		if (strike.magical) api.pushLog(`The ${HARE.name} uses Dust Cloud. ${who} takes ${damage} ${points} of earth damage.`, "hit");
		else {
			const verb = strike.crit ? "critically cuts" : "cuts";
			const foe = move === "attack" ? `The ${HARE.name}` : move;
			api.pushLog(`${foe} ${verb} ${who} for ${damage} ${points} of damage.`, strike.crit ? "crit" : "hit");
		}
		const before = avatar.hp;
		const max = avatar.max;
		avatar.hp = Math.max(0, avatar.hp - damage);
		if (avatar.hp <= 0) dismissAvatar(`${who} falls.`);
		else {
			if (before > avatar.hp) loseCe("avatar", ceLostOnHit(before - avatar.hp, max));
			if (damage > 0) addPetTp("avatar", strike.magical ? 50 : tpTakenPhysical(HARE.delay));
		}
		if (strike.tpGain > 0) addStrikerAutoTp(strike.tpGain);
		publishPets();
		publishStrikerBody();
		if (strike.magical) return {
			tag: "magic",
			name: move,
			damage,
			crit: false,
			hp: 0
		};
		return {
			tag: "cut",
			name: move,
			damage,
			crit: strike.crit,
			hp: 0
		};
	}
	if (!wyvern || wyvern.hp <= 0) return {
		tag: "cut",
		name: move,
		damage: 0,
		crit: false,
		hp: 0,
		unscored: true
	};
	const swung = hareSwingStats(liveEnfeebles.reduce((n, row) => n + (row.accDown ?? 0), 0));
	const strike = rollRarabStrike({
		move,
		weaponDamage: HARE.weaponDamage,
		level: HARE.level,
		attack: Math.max(1, Math.floor(HARE.attack * bioAttackFactor(liveEnfeebles) * attackDownFactor(liveEnfeebles))),
		defense: wyvernDefense(),
		accuracy: swung.accuracy,
		evasion: 294,
		dLevel: 0,
		dex: swung.dex,
		targetAgi: 0,
		str: foeStr(),
		targetVit: 0,
		weaponRank: HARE.weaponRank,
		maxHp: HARE.hpNatural,
		hitRoll: Math.random() * 100,
		critRoll: 100,
		pdifRoll: Math.random()
	});
	if (strike.spendTp) zeroStrikerTp();
	if (!strike.hit) {
		const foe = move === "attack" ? `the ${HARE.name}` : move;
		api.pushLog(`The wyvern evades ${foe}.`, "miss");
		return {
			tag: "evade",
			name: move,
			damage: 0,
			crit: false,
			hp: 0
		};
	}
	let raw = dustCloudAfterAddle(strike.raw, strike.magical);
	if (move === "attack") raw = physicalRaw("attack", HARE.weaponDamage, 0, strike.pdif, HARE.level);
	const damage = Math.max(0, Math.floor(raw * (1 - WYVERN_DAMAGE_TAKEN)));
	const points = damage === 1 ? "point" : "points";
	if (strike.magical) api.pushLog(`The ${HARE.name} uses Dust Cloud. The wyvern takes ${damage} ${points} of earth damage.`, "hit");
	else {
		const verb = strike.crit ? "critically cuts" : "cuts";
		const foe = move === "attack" ? `The ${HARE.name}` : move;
		api.pushLog(`${foe} ${verb} the wyvern for ${damage} ${points} of damage.`, strike.crit ? "crit" : "hit");
	}
	const before = wyvern.hp;
	const max = wyvern.max;
	shareWyvernHit(damage);
	if (wyvern && before > wyvern.hp) loseCe("wyvern", ceLostOnHit(before - wyvern.hp, max));
	if (wyvern && damage > 0) addPetTp("wyvern", strike.magical ? 50 : tpTakenPhysical(HARE.delay));
	if (strike.tpGain > 0) addStrikerAutoTp(strike.tpGain);
	publishPets();
	publishStrikerBody();
	if (strike.magical) return {
		tag: "magic",
		name: move,
		damage,
		crit: false,
		hp: 0
	};
	return {
		tag: "cut",
		name: move,
		damage,
		crit: strike.crit,
		hp: 0
	};
}
function dustCloudAfterAddle(raw, magical) {
	if (!magical) return raw;
	const addle = liveEnfeebles.find((row) => row.name === "Addle");
	if (!addle) return raw;
	return Math.max(0, Math.floor(raw * (100 - Math.min(30, addle.power ?? 15)) / 100));
}
function dustCloudResisted(raw, buffs, intStat, runLevel) {
	const chart = chartResistance(buffs, runLevel);
	return resistIncomingMagic(raw, { level: HARE.level, int: HARE.int }, {
		level: 75,
		int: intStat + colureStat(buffs, "INT"),
		elementalResistance: chart.earth ?? 0,
		extraEvasion: carolMagicEvasion(buffs, "earth") + colureNamed(buffs, "Attunement")
	}, Math.random, -colureNamed(quarryEnfeebles(), "Vex"));
}
function landOnAutomaton() {
	const api = useGame.getState();
	const move = rarabMoveName();
	if (!automaton || automaton.hp <= 0) return {
		tag: "cut",
		name: move,
		damage: 0,
		crit: false,
		hp: 0,
		unscored: true
	};
	if (move === "Wild Carrot") {
		zeroStrikerTp();
		return {
			tag: "heal",
			name: move,
			damage: 0,
			crit: false,
			hp: 0
		};
	}
	const profile = automatonSwing();
	const swung = hareSwingStats(liveEnfeebles.reduce((n, row) => n + (row.accDown ?? 0), 0));
	const strike = rollRarabStrike({
		move,
		weaponDamage: HARE.weaponDamage,
		level: HARE.level,
		attack: Math.max(1, Math.floor(HARE.attack * bioAttackFactor(liveEnfeebles) * attackDownFactor(liveEnfeebles))),
		defense: 80,
		accuracy: swung.accuracy,
		evasion: 70 + profile.evasion,
		dLevel: 0,
		dex: swung.dex,
		targetAgi: 0,
		str: foeStr(),
		targetVit: 0,
		weaponRank: HARE.weaponRank,
		maxHp: HARE.hpNatural,
		hitRoll: Math.random() * 100,
		critRoll: 100,
		pdifRoll: Math.random()
	});
	if (strike.spendTp) zeroStrikerTp();
	if (!strike.hit) {
		const foe = move === "attack" ? `the ${HARE.name}` : move;
		api.pushLog(`The automaton evades ${foe}.`, "miss");
		return {
			tag: "evade",
			name: move,
			damage: 0,
			crit: false,
			hp: 0
		};
	}
	const raw = dustCloudAfterAddle(strike.magical ? strike.raw : Math.max(0, strike.raw), strike.magical);
	const blocked = !strike.magical && profile.block > 0 && Math.random() * 100 < profile.block;
	if (!strike.magical && automaton.shadows > 0) {
		automaton.shadows -= 1;
		api.pushLog(`A shadow absorbs the hit. ${automaton.shadows} remain.`, "miss");
		publishPets();
		return {
			tag: "evade",
			name: move,
			damage: 0,
			crit: false,
			hp: 0
		};
	}
	if (!strike.magical && profile.counter > 0 && Math.random() < profile.counter && foeLiving()) {
		api.pushLog(`The automaton counters the ${HARE.name}.`, "miss");
		landFoeHit(profile.damage, `Counter. The automaton hits the ${HARE.name} for ${profile.damage} points of damage.`, monsterTpGain(40), "automaton");
		queuePetFloater({
			text: String(profile.damage),
			crit: false,
			at: "foe"
		});
		publishPets();
		return {
			tag: "evade",
			name: move,
			damage: 0,
			crit: false,
			hp: 0
		};
	}
	let taken = strike.magical ? profile.magicTaken : profile.taken * (blocked ? .5 : 1);
	const names = useGame.getState().autoSet;
	if (!strike.magical && names.includes("Analyzer") && move !== "attack" && move === automaton.seen) taken *= .75;
	if (automaton.equalize > 0 && names.includes("Equalizer")) taken *= .8;
	if (automaton.steam > 0 && names.includes("Steam Jacket")) {
		const kind = strike.magical ? "magic" : "phys";
		if (automaton.steamKind === kind) taken *= .85;
	}
	let damage = Math.max(0, Math.floor(raw * taken));
	if (automaton.skin > 0 && damage > 0) {
		const absorbed = Math.min(automaton.skin, damage);
		automaton.skin -= absorbed;
		damage -= absorbed;
		if (absorbed > 0 && damage === 0) api.pushLog("Stoneskin absorbs the hit.", "miss");
	}
	if (!strike.magical && damage >= automaton.hp && names.includes("Schurzen") && automaton.maneuvers.some((row) => row.element === "earth")) {
		dropAutomatonManeuver("earth", 1);
		damage = Math.max(0, automaton.hp - 1);
		api.pushLog("Schurzen spends an Earth Maneuver. The automaton holds at 1 HP.", "info");
	}
	const points = damage === 1 ? "point" : "points";
	if (blocked) api.pushLog(`The automaton blocks the ${HARE.name} for ${damage} ${points} of damage.`, strike.crit ? "crit" : "hit");
	else if (strike.magical) api.pushLog(`The ${HARE.name} uses Dust Cloud. The automaton takes ${damage} ${points} of earth damage.`, "hit");
	else {
		const verb = strike.crit ? "critically cuts" : "cuts";
		const foe = move === "attack" ? `The ${HARE.name}` : move;
		api.pushLog(`${foe} ${verb} the automaton for ${damage} ${points} of damage.`, strike.crit ? "crit" : "hit");
	}
	if (names.includes("Steam Jacket")) {
		automaton.steamKind = strike.magical ? "magic" : "phys";
		automaton.steam = 10;
	}
	if (move !== "attack") automaton.seen = move;
	if (names.includes("Equalizer") && damage > automaton.max * .15) automaton.equalize = 8;
	const before = automaton.hp;
	const max = automaton.max;
	automaton.hp = Math.max(0, automaton.hp - damage);
	if (automaton.hp <= 0) dismissAutomaton("The automaton is destroyed.");
	else {
		if (blocked) {
			if (automaton.anim === "cast") {
				automaton.pending = null;
				automaton.castSchool = null;
				automaton.castElement = null;
			}
			automaton.anim = "block";
			automaton.animLeft = .45;
			if (names.includes("Hammermill") && useGame.getState().autoFrame === "valoredge" && foeLiving()) {
				const earth = maneuverCounts(automaton.maneuvers).earth;
				const bash = 10 + 8 * Math.max(1, earth);
				landFoeHit(bash, `Shield Bash hits the ${HARE.name} for ${bash} points of damage.`, monsterTpGain(40), "automaton");
				queuePetFloater({
					text: String(bash),
					crit: false,
					at: "foe"
				});
				queueAutomatonAct({
					kind: "bash",
					dmg: bash
				});
				if (earth > 0) {
					const slow = landAutomatonEnfeeble("Slow", Math.min(3, earth));
					if (slow !== "resisted") api.pushLog(`Shield Bash. ${slow}`, "info");
				}
			}
		}
		if (!strike.magical && profile.spikes > 0 && foeLiving()) {
			landFoeHit(profile.spikes, `Blaze Spikes. The ${HARE.name} takes ${profile.spikes} points of fire damage.`, 0, "automaton");
			queuePetFloater({
				text: String(profile.spikes),
				crit: false,
				at: "foe"
			});
			queueAutomatonAct({
				kind: "spikes",
				dmg: profile.spikes
			});
			if (automaton.anim === "idle") showAutomatonAbility("ability", .4);
		}
		if (before > automaton.hp) loseCe("automaton", ceLostOnHit(before - automaton.hp, max));
		if (damage > 0) addPetTp("automaton", strike.magical ? 50 : tpTakenPhysical(HARE.delay));
	}
	if (strike.tpGain > 0) addStrikerAutoTp(strike.tpGain);
	publishPets();
	publishStrikerBody();
	if (strike.magical) return {
		tag: "magic",
		name: move,
		damage,
		crit: false,
		hp: 0
	};
	if (blocked) return {
		tag: "block",
		name: move,
		damage,
		crit: strike.crit,
		hp: 0
	};
	return {
		tag: "cut",
		name: move,
		damage,
		crit: strike.crit,
		hp: 0
	};
}
function landOnJug() {
	const api = useGame.getState();
	const move = rarabMoveName();
	if (!jug || jug.hp <= 0) return {
		tag: "cut",
		name: move,
		damage: 0,
		crit: false,
		hp: 0,
		unscored: true
	};
	const spendTp = () => {
		if (move !== "attack") zeroStrikerTp();
	};
	if (move === "Wild Carrot") {
		spendTp();
		return {
			tag: "heal",
			name: move,
			damage: 0,
			crit: false,
			hp: 0
		};
	}
	const swung = hareSwingStats(liveEnfeebles.reduce((n, row) => n + (row.accDown ?? 0), 0));
	const strike = rollRarabStrike({
		move,
		weaponDamage: HARE.weaponDamage,
		level: HARE.level,
		attack: Math.max(1, Math.floor(HARE.attack * bioAttackFactor(liveEnfeebles) * attackDownFactor(liveEnfeebles))),
		defense: carrieDefense(jug.guard),
		accuracy: swung.accuracy,
		evasion: 283,
		dLevel: 0,
		dex: swung.dex,
		targetAgi: 0,
		str: foeStr(),
		targetVit: 0,
		weaponRank: HARE.weaponRank,
		maxHp: HARE.hpNatural,
		hitRoll: Math.random() * 100,
		critRoll: 100,
		pdifRoll: Math.random()
	});
	if (strike.spendTp) zeroStrikerTp();
	if (!strike.hit) {
		const foe = move === "attack" ? `the ${HARE.name}` : move;
		api.pushLog(`Courier Carrie evades ${foe}.`, "miss");
		return {
			tag: "evade",
			name: move,
			damage: 0,
			crit: false,
			hp: 0
		};
	}
	let raw = dustCloudAfterAddle(strike.raw, strike.magical);
	if (move === "attack") raw = physicalRaw("attack", HARE.weaponDamage, 0, strike.pdif, HARE.level);
	if (strike.magical && jug.curtain) raw = Math.max(0, Math.floor(raw * .5));
	let damage = Math.max(0, Math.floor(raw));
	if (jug.skin > 0 && damage > 0) {
		const absorbed = Math.min(jug.skin, damage);
		jug.skin -= absorbed;
		damage -= absorbed;
		api.pushLog(jug.skin <= 0 ? "Courier Carrie's Stoneskin wears off." : `Courier Carrie's Stoneskin absorbs ${absorbed} points of damage.`, "info");
	}
	const points = damage === 1 ? "point" : "points";
	if (strike.magical) api.pushLog(`The ${HARE.name} uses Dust Cloud. Courier Carrie takes ${damage} ${points} of earth damage.`, "hit");
	else {
		const verb = strike.crit ? "critically cuts" : "cuts";
		const foe = move === "attack" ? `The ${HARE.name}` : move;
		api.pushLog(`${foe} ${verb} Courier Carrie for ${damage} ${points} of damage.`, strike.crit ? "crit" : "hit");
	}
	const before = jug.hp;
	const max = jug.max;
	jug.hp = Math.max(0, jug.hp - damage);
	if (jug.hp <= 0) dismissJug("Courier Carrie falls.");
	else {
		if (before > jug.hp) loseCe("jug", ceLostOnHit(before - jug.hp, max));
		if (damage > 0) addPetTp("jug", strike.magical ? 50 : tpTakenPhysical(HARE.delay));
	}
	if (strike.tpGain > 0) addStrikerAutoTp(strike.tpGain);
	publishPets();
	publishStrikerBody();
	if (strike.magical) return {
		tag: "magic",
		name: move,
		damage,
		crit: false,
		hp: 0
	};
	return {
		tag: "cut",
		name: move,
		damage,
		crit: strike.crit,
		hp: 0
	};
}
/** Death deletes that actor's row. A raise does not put it back. */
function dropPlayerHate() {
	return dropHateRow("player");
}
var liveHareHp = HARE.hpNatural;
/** Spells this body readied. A miss counts. Cleared when that body falls or pops. */
var hareReadyBlue = /* @__PURE__ */ new Set();
var kinReadyBlue = /* @__PURE__ */ new Set();
var liveHareRespawn = 0;
/** The second Tropical Rarab. Same card. It is not written into the save. */
var liveKinHp = HARE.hpNatural;
var liveKinTp = 0;
var liveKinRespawn = 0;
function forestFight() {
	const state = useGame.getState();
	if (!state || state.selfTargeted || state.crystalTargeted || state.trustTargeted || state.manualTargeted) return null;
	const field = fieldTarget();
	if (field) return field;
	if (state.targeted) return null;
	return readWsBody();
}
function packClaim() {
	const state = useGame.getState();
	if (!state) return null;
	return readSwingBody();
}
function chasedPack() {
	return livePack().filter((body) => body.hp > 0 && body.mode === "chase");
}
/** The chased rabbit this trust is standing on. Melee and its enmity stay on that body. */
function trustMeleePack(id) {
	const place = trustPlaces[id];
	const chased = chasedPack();
	if (!place || place.x == null || !chased.length) return null;
	let best = null;
	let bestDist = Infinity;
	for (const body of chased) {
		const dist = Math.hypot(place.x - body.x, place.z - body.z);
		if (dist < bestDist) {
			best = body;
			bestDist = dist;
		}
	}
	if (!best || bestDist > 8) return null;
	return best;
}
/** Distance from this trust to each forest rabbit, and to each training rabbit, so Charm range follows that body. */
function foesNearTrust(id) {
	const place = trustPlaces[id];
	return gambitFoes().map((foe) => {
		if (!place || place.x == null || foe.id == null) return foe;
		const yards = trustFoeYards(id, foe.id);
		if (yards == null) return foe;
		return { ...foe, yards };
	});
}
/** Yalms from this trust to one foe. Hare and kin use their own feet. A forest id uses that body. */
function trustFoeYards(id, foeId) {
	const place = trustPlaces[id];
	if (!place || place.x == null || place.z == null || !foeId) return null;
	if (foeId === "hare") return Math.hypot(place.x - hareAt.x, place.z - hareAt.z);
	if (foeId === "kin") return Math.hypot(place.x - kinAt.x, place.z - kinAt.z);
	const body = foeId === "pack" ? packOpened() : livePack().find((row) => row.id === foeId);
	if (!body) return null;
	return Math.hypot(place.x - body.x, place.z - body.z);
}
/** The body a Charm or Tame gambit named. A forest id is not rewritten onto the pen. */
function trustCharmFoe(hit) {
	const foeId = hit?.foeId;
	if (foeId === "hare" || foeId === "kin") return (foeId === "kin" ? liveKinHp : liveHareHp) > 0 ? foeId : null;
	if (foeId && foeId !== "pack") {
		const body = livePack().find((row) => row.id === foeId && row.hp > 0 && row.mode !== "dead" && row.mode !== "leash");
		if (body) return body.id;
	}
	if (!useGame.getState().targeted) {
		const forest = packOpened();
		if (forest) return forest.id;
	}
	return playerFoe();
}
function charmBodyAlive(foeId) {
	if (foeId === "kin") return liveKinHp > 0;
	if (foeId === "hare") return liveHareHp > 0;
	if (!foeId) return false;
	const body = livePack().find((row) => row.id === foeId);
	return !!body && body.hp > 0 && body.mode !== "dead" && body.mode !== "leash";
}
function foeSharedHate(ownerId, foeId) {
	const rows = foeId === "kin" ? kinHateRows : foeId === "hare" || !foeId ? hateRows : packHate.get(foeId) ?? [];
	return rows.some((row) => row.id !== ownerId && ((row.ce ?? 0) > 0 || (row.ve ?? 0) > 0));
}
function packOpened() {
	if (useGame.getState()?.targeted) return null;
	const acted = readActedBody();
	if (acted && acted.mode === "chase") return acted;
	const swing = readSwingBody();
	if (swing && swing.mode === "chase") return swing;
	const chased = chasedPack();
	if (!chased.length) return null;
	const plate = readPackPlate();
	return chased.find((body) => body.id === plate.id) || chased[0];
}
function packBodyFromFoe(foeId) {
	if (!foeId || foeId === "hare" || foeId === "kin") return null;
	if (foeId === "pack") return packOpened();
	const body = livePack().find((row) => row.id === foeId);
	if (!body || body.hp <= 0 || body.mode === "dead" || body.mode === "leash") return null;
	return body;
}
function packSnapshot(body, claimed) {
	const here = readPlace();
	const yards = Math.hypot((here?.x ?? 0) - body.x, (here?.z ?? 0) - body.z);
	return {
		id: body.id,
		present: body.hp > 0,
		hpRatio: body.maxHp > 0 ? Math.max(0, body.hp) / body.maxHp : 0,
		ko: body.hp <= 0,
		undead: false,
		claimed,
		enmity: packHateTotal(body.id) || (claimed ? 1 : 0),
		playerYards: yards,
		debuffs: packStatusNames(body.id),
		resonance: body.hp <= 0 ? [] : readyChains(body.id)
	};
}
/** The field mob on the target plate, in the shape a gambit already understands. */
function fieldSnapshot(body) {
	const yards = Math.hypot(playerStand.x - body.x, playerStand.z - body.z);
	const held = fieldStatusPark(body.id);
	const down = body.hp <= 0 || body.mode === "dead" || body.away;
	return {
		id: body.id,
		present: !down,
		hpRatio: body.maxHp > 0 ? Math.max(0, body.hp) / body.maxHp : 0,
		ko: down,
		undead: fieldCard(body).undead,
		claimed: body.claimed === true,
		enmity: body.claimed ? 1 : 0,
		playerYards: yards,
		debuffs: down ? [] : [...held.enfeebles.map((row) => row.name), ...held.debuffs.map((row) => row.name)],
		resonance: down ? [] : readyChains(body.id)
	};
}
function fightBodies() {
	const pet = charm?.who ?? null;
	const rows = [];
	if (pet !== "hare" && liveHareHp > 0) rows.push("hare");
	if (pet !== "kin" && liveKinHp > 0) rows.push("kin");
	return rows;
}
function hateTotal(rows) {
	let total = 0;
	for (const row of rows) {
		if ((row.ce ?? 0) > 0 || (row.ve ?? 0) > 0) total += (row.ce ?? 0) + (row.ve ?? 0);
	}
	return total;
}
function foeSnapshot(who) {
	const kin = who === "kin";
	const hp = kin ? liveKinHp : liveHareHp;
	const down = hp <= 0;
	const enfeebles = kin ? kinEnfeebles : liveEnfeebles;
	const debuffs = kin ? kinDebuffs : liveHareDebuffs;
	const rows = kin ? kinHateRows : hateRows;
	const enmity = down ? 0 : hateTotal(rows);
	return {
		id: who,
		present: !down,
		hpRatio: HARE.hpNatural > 0 ? Math.max(0, hp) / HARE.hpNatural : 1,
		ko: down,
		undead: HARE.undead,
		claimed: enmity > 0,
		enmity,
		playerYards: kin ? kinYards : yardDistance,
		debuffs: down ? [] : [...enfeebles.map((row) => row.name), ...debuffs.map((row) => row.name)],
		resonance: down ? [] : readyChains(who)
	};
}
function gambitFoes() {
	if (useGame.getState()?.targeted) return fightBodies().map((who) => foeSnapshot(who));
	const chased = chasedPack();
	if (chased.length) return chased.map((body) => packSnapshot(body, true));
	if (packClaim()) return [];
	return fightBodies().map((who) => foeSnapshot(who));
}
/** An enemy gambit lands on the body it chose, the one with the most enmity. */
function aimClaimedFoe(hit) {
	if (!hit || hit.kind !== "act" || hit.aim !== "enemy") return;
	if (hit.foeId !== "hare" && hit.foeId !== "kin") return;
	if ((hit.foeId === "kin" ? liveKinHp : liveHareHp) <= 0) return;
	const s = useGame.getState();
	if (s.manualTargeted || s.crystalTargeted || s.selfTargeted) return;
	if (s.quarry === hit.foeId && s.targeted) return;
	useGame.setState({
		quarry: hit.foeId,
		targeted: true,
		selfTargeted: false,
		crystalTargeted: false,
		trustTargeted: null,
		petTargeted: null,
		manualTargeted: false,
		manualPage: "closed"
	});
}
/** The foe gambits can see. Each living Tropical Rarab is its own body. A corpse is not. */
function gambitFoe() {
	if (!useGame.getState()?.targeted) {
		const opened = packOpened();
		if (opened) return packSnapshot(opened, true);
	}
	if (packClaim()) return {
		present: false,
		hpRatio: 0,
		ko: true,
		undead: false,
		claimed: false,
		playerYards: 999,
		debuffs: []
	};
	const who = playerFoe() ?? fightBodies()[0] ?? null;
	if (!who) return {
		present: false,
		hpRatio: 0,
		ko: true,
		undead: HARE.undead,
		claimed: false,
		playerYards: 999,
		debuffs: []
	};
	return foeSnapshot(who);
}
/** The target window follows a living body. A defeated quarry is not who the next cast hits. */
function keepLivingQuarry() {
	const s = useGame.getState();
	if (!s.targeted && !s.engaged) return;
	const who = s.quarry === "kin" ? "kin" : "hare";
	if ((who === "kin" ? liveKinHp : liveHareHp) > 0) return;
	const other = who === "kin" ? "hare" : "kin";
	if ((other === "kin" ? liveKinHp : liveHareHp) <= 0 || charm?.who === other) return;
	useGame.setState({
		quarry: other,
		targeted: true
	});
}
function tickHareRespawn(dt) {
	if (liveHareRespawn <= 0) return;
	liveHareRespawn = Math.max(0, liveHareRespawn - dt);
	if (liveHareRespawn > 0) {
		const shown = Math.ceil(liveHareRespawn);
		if (useGame.getState().hareRespawn !== shown) useGame.setState({ hareRespawn: shown });
		return;
	}
	liveHareRespawn = 0;
	liveHareHp = HARE.hpNatural;
	hareReadyBlue.clear();
	useGame.setState({
		hareHp: liveHareHp,
		hareRespawn: 0,
		hareTp: 0
	});
	useGame.getState().pushLog(`The ${HARE.name} returns.`, "info");
}
/** The monster readied blue magic this life. Each spell is offered when that body falls. */
function noteBlueReady(who, name) {
	if (!blueSpellByName(name)) return;
	(who === "kin" ? kinReadyBlue : hareReadyBlue).add(name);
}
function finishBlueLearn(who, claimed) {
	const ready = who === "kin" ? kinReadyBlue : hareReadyBlue;
	const names = [...ready];
	ready.clear();
	const state = useGame.getState();
	let learned = state.blueLearned;
	const blueSkill = combinedSkill("Blue Magic", state.mainJob, 75, state.subJob, state.subJob ? subjobLevel(75) : 0);
	for (const name of names) {
		const offered = offerBlueLearn({
			name,
			used: true,
			main: state.mainJob === "BLU",
			alive: !state.ko,
			claimed,
			already: learned.includes(name),
			blueSkill
		});
		if (!offered.learn) continue;
		learned = [...learned, name];
		if (offered.line) useGame.getState().pushLog(offered.line, "info");
	}
	if (learned !== state.blueLearned) useGame.setState({ blueLearned: learned });
}
function tickKinRespawn(dt) {
	if (liveKinRespawn <= 0) return;
	liveKinRespawn = Math.max(0, liveKinRespawn - dt);
	if (liveKinRespawn > 0) {
		const shown = Math.ceil(liveKinRespawn);
		if (useGame.getState().kinRespawn !== shown) useGame.setState({ kinRespawn: shown });
		return;
	}
	liveKinRespawn = 0;
	liveKinHp = HARE.hpNatural;
	liveKinTp = 0;
	kinReadyBlue.clear();
	useGame.setState({
		kinHp: liveKinHp,
		kinRespawn: 0,
		kinTp: 0
	});
	useGame.getState().pushLog(`The ${HARE.name} returns.`, "info");
}
/** The second rarab's HP. Killing it does not clear the training dummy's fight. */
function chipKin(dmg) {
	const n = Math.floor(dmg);
	if (n <= 0) return false;
	if (liveKinHp <= 0) return true;
	if (liveKinHp > n) {
		liveKinHp -= n;
		useGame.setState({ kinHp: liveKinHp });
		publishPets();
		return false;
	}
	liveKinHp = 0;
	liveKinTp = 0;
	liveKinRespawn = 300;
	kinEnfeebles = [];
	kinDebuffs = [];
	clearStepStacks("kin");
	const kinClaimed = kinHateRows.some((row) => row.ce > 0 || row.ve > 0);
	kinHateRows = [];
	kinHateStamp = 0;
	useGame.setState({
		kinHp: 0,
		kinTp: 0,
		kinRespawn: 300,
		kinEnfeebles: [],
		kinDebuffs: [],
		...kinHateState()
	});
	keepLivingQuarry();
	clearEmptyFight();
	useGame.getState().pushLog(`The ${HARE.name} is defeated.`, "hit");
	finishBlueLearn("kin", kinClaimed);
	if (charm?.who === "kin") releaseCharm("The charm breaks.");
	publishPets();
	awardDefeat("kin", null);
	return true;
}
/** Spend the rarab's HP. A killing blow leaves it down until the respawn timer. A second hit does not reset that timer. */
function chipHare(dmg) {
	if (strikeFieldId) {
		const n = Math.floor(dmg);
		if (n <= 0) return false;
		const dead = hurtField(strikeFieldId, n);
		const body = fieldById(strikeFieldId);
		liveHareHp = body && body.hp > 0 ? body.hp : 0;
		return dead;
	}
	if (strikePackId) {
		const n = Math.floor(dmg);
		if (n <= 0) return false;
		notePackAct(strikePackId);
		const dead = strikePack(strikePackId, n);
		const body = livePack().find((row) => row.id === strikePackId);
		liveHareHp = body && body.hp > 0 ? body.hp : 0;
		return dead;
	}
	if (strikeKin) return chipStruck(dmg);
	const n = Math.floor(dmg);
	if (n <= 0) return false;
	if (liveHareHp <= 0) return true;
	if (liveHareHp > n) {
		liveHareHp -= n;
		return false;
	}
	liveHareHp = 0;
	const hareClaimed = hateRows.some((row) => row.ce > 0 || row.ve > 0);
	tamePrimed = false;
	trustTamePrimed = false;
	if (charm?.who === "hare") releaseCharm("The charm breaks.");
	hateRows = [];
	syncLiveHate();
	pulled = false;
	liveEnfeebles = [];
	clearStepStacks("hare");
	liveHareDebuffs = [];
	liveStatDown = null;
	bubbleStr = 0;
	bubbleStrLeft = 0;
	liveBanish = null;
	liveHareRespawn = 300;
	const spareFight = useGame.getState().quarry === "kin" && liveKinHp > 0;
	let trusts = false;
	if (!spareFight) for (const trust of Object.values(liveTrusts)) {
		if (!trust.engaged) continue;
		trust.engaged = false;
		trusts = true;
	}
	useGame.setState({
		hareTp: 0,
		hareHp: 0,
		hareRespawn: 300,
		...spareFight ? {} : { engaged: false },
		...hateNow(),
		hareEnfeebles: [],
		hareDebuffs: [],
		statDown: null,
		banishDown: null,
		hareAction: null,
		...trusts ? { trustVitals: trustVitalsNow() } : {}
	});
	keepLivingQuarry();
	clearEmptyFight();
	useGame.getState().pushLog(`The ${HARE.name} is defeated.`, "hit");
	finishBlueLearn("hare", hareClaimed);
	awardDefeat("hare", null);
	return true;
}
/** Retail kill experience for one defeated body. Trusts do not split it. The chain is this session only. */
export function awardDefeat(where, id) {
	const s = useGame.getState();
	const level = s.jobLevels[s.mainJob] ?? 75;
	const job = s.mainJob;
	const pool = s.expByJob?.[job] ?? s.exp ?? 0;
	const grant = noteDefeat(level, HARE.level, pool);
	const expByJob = { ...(s.expByJob ?? {}), [job]: grant.exp };
	if (grant.exp !== pool || grant.level !== level || s.exp !== grant.exp) {
		useGame.setState({
			exp: grant.exp,
			expByJob,
			...grant.level !== level ? { jobLevels: { ...s.jobLevels, [job]: grant.level } } : {}
		});
	}
	const log = useGame.getState();
	if (grant.gained > 0) log.pushLog(`You receive ${grant.gained} experience ${grant.gained === 1 ? "point" : "points"}.`, "info");
	if (grant.chain > 0) log.pushLog(`EXP chain #${grant.chain}!`, "info");
	if (grant.ding) log.pushLog(`${job} reaches level ${grant.level}!`, "info");
	if (grant.gained > 0 || grant.chain > 0) queueExpMark({ amount: grant.gained, chain: grant.chain, where, id });
	noteSignetKill(grant.gained);
	noteDrops();
}
function noteSignetKill(gained) {
	if (gained <= 0) return;
	if (!liveBuffs.some((buff) => buff.name === "Signet" && buff.left > 0)) return;
	const s = useGame.getState();
	const add = pointsFromExp(gained, s.screen);
	const before = rankFromPoints(s.rankPoints ?? 0);
	const points = Math.min(9999999, (s.rankPoints ?? 0) + add);
	const after = rankFromPoints(points);
	const conquestPoints = Math.min(9999999, (s.conquestPoints ?? 0) + add);
	const crystals = { ...(s.crystals ?? emptyCrystals()) };
	const found = Math.random() < crystalChance(s.loadout?.body);
	if (found) crystals[RARAB_CRYSTAL] = Math.min(9999, (crystals[RARAB_CRYSTAL] ?? 0) + 1);
	useGame.setState({ rankPoints: points, conquestPoints, ...found ? { crystals } : {} });
	if (add > 0) s.pushLog(`You receive ${add} rank points and ${add} conquest points.`, "info");
	if (after > before) s.pushLog(`San d'Oria rank ${after}.`, "info");
	if (found) s.pushLog("You find a fire crystal.", "info");
	saveSettings(false);
}
function noteDrops() {
	const s = useGame.getState();
	const th = Math.max(0, Math.floor(s.sheet?.treasureHunter ?? 0));
	const inventory = { ...(s.inventory ?? {}) };
	let changed = false;
	const lines = [];
	for (const drop of RARAB_DROPS) {
		if (Math.random() >= dropRate(drop.tier, th)) continue;
		const next = { ...inventory, [drop.id]: (inventory[drop.id] ?? 0) + 1 };
		if (bagUsed(next) > BAG_SLOTS) {
			lines.push("You cannot carry any more.");
			break;
		}
		inventory[drop.id] = next[drop.id];
		changed = true;
		lines.push(`You find a ${drop.found} on the ${HARE.name}.`);
	}
	if (changed) useGame.setState({ inventory });
	for (const line of lines) s.pushLog(line, "info");
	if (changed) saveSettings(false);
}
export function noteRegimeCredit(credit) {
	const s = useGame.getState();
	const result = advanceRegime(readFov(s.fov), vanaDayKey(vanadielTime()), credit);
	if (!result.changed) return;
	const level = s.jobLevels?.[s.mainJob] ?? 75;
	const pool = s.expByJob?.[s.mainJob] ?? s.exp ?? 0;
	const room = Math.max(0, expHold(level) - pool);
	const gained = Math.min(room, result.exp);
	const fov = rememberFov(result.fov);
	const banked = gained > 0 ? bankExp(level, pool + gained) : null;
	useGame.setState({
		fov,
		gil: Math.min(999999999, s.gil + result.gil),
		...banked ? {
			exp: banked.exp,
			expByJob: { ...(s.expByJob ?? {}), [s.mainJob]: banked.exp },
			...banked.level !== level ? { jobLevels: { ...s.jobLevels, [s.mainJob]: banked.level } } : {}
		} : {}
	});
	const log = useGame.getState();
	for (const line of result.logs) {
		if (result.exp > 0 && line.includes("experience points") && gained !== result.exp) {
			log.pushLog(gained > 0 ? `You receive ${gained} experience points.` : "Your experience is at its limit.", "info");
		} else log.pushLog(line, "info");
	}
	if (banked && banked.level !== level) log.pushLog(`${s.mainJob} reaches level ${banked.level}!`, "info");
	saveSettings(false);
}
/**
* Player spells and weapon-skill statuses use the training dummy's lists.
* Borrow those lists so the same formulas land on the second Tropical Rarab,
* then put the dummy's lists back. HP and hate go through chipKin.
*/
function borrowKin() {
	const park = {
		enfeebles: liveEnfeebles,
		debuffs: liveHareDebuffs,
		hp: liveHareHp,
		yards: yardDistance
	};
	strikeKin = true;
	liveEnfeebles = kinEnfeebles.map((row) => ({ ...row }));
	liveHareDebuffs = kinDebuffs.map((row) => ({ ...row }));
	liveHareHp = liveKinHp;
	yardDistance = kinYards;
	return park;
}
function restoreKin(park) {
	kinEnfeebles = liveEnfeebles;
	kinDebuffs = liveHareDebuffs;
	liveKinHp = liveHareHp;
	liveEnfeebles = park.enfeebles;
	liveHareDebuffs = park.debuffs;
	liveHareHp = park.hp;
	yardDistance = park.yards;
	strikeKin = false;
}
function splashStamp(row) {
	return `${row.left}|${row.power ?? ""}|${row.dot ?? ""}|${row.accDown ?? ""}|${row.evaDown ?? ""}|${row.down ?? ""}|${row.element ?? ""}`;
}
/** Area magic, and Manifestation, catch the other Tropical Rarab. A pet is not a foe. Helix stays on one body. */
function enemySplashRadius(spell, cast) {
	if (!spell) return 0;
	if (spell.helix || spell.storm || spell.klimaform) return 0;
	if (spell.school === "healing" || spell.school === "enhancing") return 0;
	if (spell.song && !spell.song.hostile) return 0;
	if (spell.na || spell.esuna || spell.sacrifice || spell.raise || spell.reraise || spell.cura || spell.curaga || spell.bar || spell.auspice || spell.barrier) return 0;
	const printed = spell.radius ?? 0;
	const ga = /ga(?:\s|$)/i.test(spell.name) ? 10 : 0;
	return Math.max(printed, ga, cast?.manifestRadius ?? 0);
}
function placeSplashRow(rows, row) {
	let next = rows.filter((held) => held.name !== row.name);
	if (isSleepSpell(row.name) || row.name === "Lullaby" || row.name === "Sheep Song" || row.name === "Soporific" || row.name === "Yawn") {
		next = next.filter((held) => !isSleepSpell(held.name) && held.name !== "Lullaby" && held.name !== "Sheep Song" && held.name !== "Soporific" && held.name !== "Yawn");
	}
	if (isSlipSpell(row.name)) next = next.filter((held) => !isSlipSpell(held.name));
	if (isPoisonSpell(row.name)) next = next.filter((held) => !isPoisonSpell(held.name));
	const family = enfeebleFamily(row.name);
	if (family) next = next.filter((held) => enfeebleFamily(held.name) !== family);
	next.push({ ...row });
	return next;
}
function planFoeSplash(spell, cast, dmg, beforeEnfeebles, beforeDebuffs, kinPark) {
	const radius = enemySplashRadius(spell, cast);
	if (radius <= 0) return null;
	if (strikePackId) {
		const enfeebles = liveEnfeebles.filter((row) => beforeEnfeebles.get(row.name) !== splashStamp(row)).map((row) => ({ ...row }));
		const debuffs = liveHareDebuffs.filter((row) => beforeDebuffs.get(row.name) !== splashStamp(row)).map((row) => ({ ...row }));
		if (dmg <= 0 && enfeebles.length === 0 && debuffs.length === 0) return null;
		return { pack: true, from: strikePackId, dmg, radius, enfeebles, debuffs };
	}
	const other = strikeKin ? "hare" : "kin";
	if (charm?.who === other) return null;
	const hp = other === "hare" ? kinPark ? kinPark.hp : liveHareHp : liveKinHp;
	if (hp <= 0) return null;
	const yards = spell.self ? other === "kin" ? kinYards : kinPark ? kinPark.yards : yardDistance : pairYards();
	if (yards > radius) return null;
	const enfeebles = liveEnfeebles.filter((row) => beforeEnfeebles.get(row.name) !== splashStamp(row)).map((row) => ({ ...row }));
	const debuffs = liveHareDebuffs.filter((row) => beforeDebuffs.get(row.name) !== splashStamp(row)).map((row) => ({ ...row }));
	if (dmg <= 0 && enfeebles.length === 0 && debuffs.length === 0) return null;
	return { other, dmg, enfeebles, debuffs };
}
function applyFoeSplash(plan) {
	if (!plan) return;
	if (plan.pack) {
		const origin = livePack().find((row) => row.id === plan.from);
		if (!origin) return;
		let caught = false;
		for (const body of livePack()) {
			if (body.id === plan.from || body.hp <= 0 || body.mode === "dead" || body.mode === "leash") continue;
			if (Math.hypot(body.x - origin.x, body.z - origin.z) > plan.radius) continue;
			caught = true;
			if (plan.dmg > 0) strikePack(body.id, plan.dmg);
			if (body.hp > 0) pullPack(livePack(), body.id, 75);
		}
		if (caught) useGame.getState().pushLog(`The other ${HARE.name} is caught in the area.`, plan.dmg > 0 ? "hit" : "info");
		return;
	}
	const hate = plan.dmg > 0 ? damageEnmity(HARE.level, plan.dmg) : { ce: 1, ve: 80 };
	if (plan.other === "kin") {
		const dead = plan.dmg > 0 ? chipKin(plan.dmg) : false;
		if (!dead && liveKinHp > 0) {
			for (const row of plan.enfeebles) kinEnfeebles = placeSplashRow(kinEnfeebles, row);
			for (const row of plan.debuffs) kinDebuffs = placeSplashRow(kinDebuffs, row);
			creditKinHate(hate.ce, hate.ve, true, "player", true);
			useGame.setState({
				dealt: useGame.getState().dealt + plan.dmg,
				kinHp: liveKinHp,
				kinEnfeebles: kinEnfeebles.map((row) => ({ ...row })),
				kinDebuffs: kinDebuffs.map((row) => ({ ...row })),
				...kinHateState()
			});
		} else if (plan.dmg > 0) useGame.setState({ dealt: useGame.getState().dealt + plan.dmg });
	} else {
		const dead = plan.dmg > 0 ? chipHare(plan.dmg) : false;
		if (!dead && liveHareHp > 0) {
			for (const row of plan.enfeebles) liveEnfeebles = placeSplashRow(liveEnfeebles, row);
			for (const row of plan.debuffs) liveHareDebuffs = placeSplashRow(liveHareDebuffs, row);
			creditHate(hate.ce, hate.ve, true, "player", true);
			useGame.setState({
				dealt: useGame.getState().dealt + plan.dmg,
				hareHp: liveHareHp,
				hareEnfeebles: liveEnfeebles.map((row) => ({ ...row })),
				hareDebuffs: liveHareDebuffs.map((row) => ({ ...row })),
				...hateNow()
			});
		} else if (plan.dmg > 0) useGame.setState({ dealt: useGame.getState().dealt + plan.dmg });
	}
	useGame.getState().pushLog(`The other ${HARE.name} is caught in the area.`, plan.dmg > 0 ? "hit" : "info");
}
function chipStruck(dmg) {
	if (!strikeKin) return chipHare(dmg);
	const dead = chipKin(dmg);
	liveHareHp = liveKinHp;
	if (dead) {
		liveEnfeebles = [];
		liveHareDebuffs = [];
	}
	return dead;
}
function creditStruck(dmg, owner = "player") {
	if (strikeKin) creditKinDamage(dmg, owner);
	else creditDamage(dmg, owner);
}
function grantStruckMonsterTp(baseTp) {
	if (strikePackId) return;
	if (!strikeKin) {
		useGame.getState().grantMonsterTp(baseTp);
		return;
	}
	grantKinMonsterTp(baseTp);
}
/**
* Both Tropical Rarab take the same hit.
* The quarry is the body the player is fighting. Trusts, avatars, the wyvern,
* the jug, jumps, and weapon skills used to assume the training dummy.
* HP, hate, sleep, and bind now land on that quarry.
* Charm still strikes the other rarab. That pet is not a second ruleset.
*/
function foeIsKin() {
	if (pinnedFoe === "kin" && charm?.who !== "kin") return true;
	if (pinnedFoe === "hare") return false;
	return playerFoe() === "kin";
}
function foeLiving() {
	const who = playerFoe();
	if (who === "kin") return liveKinHp > 0;
	if (who === "hare") return liveHareHp > 0;
	return false;
}
function foeEnfeebleRows() {
	return foeIsKin() ? kinEnfeebles : liveEnfeebles;
}
function chainFoe() {
	if (strikePackId) return strikePackId;
	if (strikeFieldId) return strikeFieldId;
	const state = useGame.getState();
	if (state && !state.selfTargeted && !state.crystalTargeted && !state.trustTargeted && !state.manualTargeted && !state.targeted) {
		const field = fieldTarget();
		if (field) return field.id;
	}
	if (state && !state.engaged) {
		const body = readActedBody() || readSwingBody();
		if (body) return body.id;
	}
	return foeIsKin() ? "kin" : "hare";
}
/**
* The open chain when this element magic bursts it.
* Damage is the pre-bonus number. Magic Attack Bonus and the resist floor stay later.
* Magic Burst Bonus is the caster's Black Mage trait. 0 leaves that step at 1.
*/
function scaleBurst(base, element, bonus = 0) {
	const target = chainFoe();
	const name = element ? magicBurstOf(element, target) : null;
	if (!name) return {
		value: base,
		name: null
	};
	return {
		value: applyMagicBurst(base, burstSteps(target), bonus),
		name
	};
}
function grantKinMonsterTp(baseTp) {
	if (liveKinHp <= 0) return;
	const s = useGame.getState();
	const gain = monsterTpGain(baseTp, subtleBlow(s.buffs) + mnkSubtleBlow(s.sheet.job === "MNK" ? 75 : s.sheet.sub === "MNK" ? s.sheet.subLevel : 0) + (s.sheet.subtleBlow ?? 0) + (jug?.stance === "fight" ? s.sheet.tandemBlow : 0));
	if (gain <= 0) return;
	liveKinTp = Math.min(3e3, liveKinTp + gain);
	useGame.setState({ kinTp: liveKinTp });
}
function grantFoeMonsterTp(baseTp) {
	if (strikeFieldId) {
		const body = fieldById(strikeFieldId);
		if (!body || body.hp <= 0) return;
		const s = useGame.getState();
		const gain = monsterTpGain(baseTp, subtleBlow(s.buffs) + mnkSubtleBlow(s.sheet.job === "MNK" ? 75 : s.sheet.sub === "MNK" ? s.sheet.subLevel : 0) + (s.sheet.subtleBlow ?? 0) + (jug?.stance === "fight" ? s.sheet.tandemBlow : 0));
		if (gain <= 0) return;
		body.tp = Math.min(3000, body.tp + gain);
		return;
	}
	if (strikePackId || packClaim()) return;
	if (foeIsKin() || strikeKin) {
		grantKinMonsterTp(baseTp);
		return;
	}
	useGame.getState().grantMonsterTp(baseTp);
}
function strikePack(id, dmg) {
	if (fieldById(id)) {
		const n = Math.floor(dmg);
		if (n <= 0) return false;
		return hurtField(id, n);
	}
	const dead = hurtPack(id, dmg);
	if (dead) {
		packHate.delete(id);
		packStatuses.delete(id);
		clearChain(id);
		for (const trust of Object.values(liveTrusts)) {
			if (trust.engaged) trust.engaged = false;
		}
		useGame.getState().pushLog(`The ${HARE.name} is defeated.`, "hit");
		awardDefeat("pack", id);
		useGame.setState(hateNow());
	}
	return dead;
}
function hitFoe(dmg, owner = "player") {
	if (strikeFieldId) {
		const n = Math.floor(dmg);
		if (n <= 0) return {
			dead: false,
			woke: false,
			unbound: false
		};
		return {
			dead: chipHare(n),
			woke: false,
			unbound: false
		};
	}
	const pinned = strikePackId ? livePack().find((row) => row.id === strikePackId && row.hp > 0) : null;
	const pack = owner === "player" ? packOpened() || packClaim() : pinned || packOpened();
	if (pack) {
		const n = Math.floor(dmg);
		if (n <= 0) return {
			dead: false,
			woke: false,
			unbound: false
		};
		if (owner === "player") notePackAct(pack.id);
		creditDamage(n, owner);
		const dead = strikePack(pack.id, n);
		return {
			dead,
			woke: false,
			unbound: false
		};
	}
	const n = Math.floor(dmg);
	if (n <= 0) return {
		dead: false,
		woke: false,
		unbound: false
	};
	if (foeIsKin()) {
		creditKinDamage(n, owner);
		const dead = chipKin(n);
		return {
			dead,
			woke: !dead && clearKinSleep(),
			unbound: !dead && clearKinBind(n)
		};
	}
	creditDamage(n, owner);
	const woke = clearSleep();
	const unbound = bindWearsOff(n) && clearBind();
	const dead = chipHare(n);
	return {
		dead,
		woke: !dead && woke,
		unbound: !dead && unbound
	};
}
function foePatch() {
	if (foeIsKin()) return {
		kinHp: liveKinHp,
		...kinHateState(),
		kinEnfeebles: kinEnfeebles.map((row) => ({ ...row })),
		kinDebuffs: kinDebuffs.map((row) => ({ ...row }))
	};
	return {
		hareHp: liveHareHp,
		...hateNow(),
		hareEnfeebles: liveEnfeebles.map((row) => ({ ...row })),
		hareDebuffs: liveHareDebuffs.map((row) => ({ ...row }))
	};
}
/** Publish while the kin's lists are borrowed. The dummy's parked copy stays put. */
function struckPatch(park) {
	if (!park) return foePatch();
	return {
		hareHp: park.hp,
		kinHp: liveHareHp,
		...kinHateState(),
		hareEnfeebles: park.enfeebles.map((row) => ({ ...row })),
		hareDebuffs: park.debuffs.map((row) => ({ ...row })),
		kinEnfeebles: liveEnfeebles.map((row) => ({ ...row })),
		kinDebuffs: liveHareDebuffs.map((row) => ({ ...row }))
	};
}
function clearKinSleep() {
	const next = kinEnfeebles.filter((row) => !isSleepSpell(row.name) && row.name !== "Lullaby" && row.name !== "Sheep Song" && row.name !== "Soporific" && row.name !== "Yawn" && row.name !== "Charmed");
	if (next.length === kinEnfeebles.length) return false;
	kinEnfeebles = next;
	return true;
}
function clearKinBind(dmg) {
	if (!bindWearsOff(dmg) || !kinEnfeebles.some((row) => row.name === "Bind")) return false;
	kinEnfeebles = kinEnfeebles.filter((row) => row.name !== "Bind");
	return true;
}
var wyvern = null;
var wyvernBoot = false;
var jug = null;
/** Set when a trust's pet is installed on the player slot for one tick. The player's own pet leaves this empty. */
var trustPetOwner = null;
/** One pet per trust. The player's pet stays on wyvern, jug, avatar, automaton, and charm. */
var trustPets = {};
function trustWyvern() {
	const slot = trustPets["shikaree-z"];
	return slot?.kind === "wyvern" ? slot.data : null;
}
function trustJug() {
	const slot = trustPets["lhu-mhakaracca"];
	return slot?.kind === "jug" ? slot.data : null;
}
function trustAuto() {
	const slot = trustPets["nashmeira"];
	return slot?.kind === "automaton" ? slot.data : null;
}
function trustAvatarPet() {
	const slot = trustPets["karaha-baruha"];
	return slot?.kind === "avatar" ? slot.data : null;
}
function holdTrustPet(id, fn) {
	const slot = trustPets[id];
	if (!slot) return;
	const savedOwner = trustPetOwner;
	const saved = slot.kind === "wyvern" ? wyvern : slot.kind === "jug" ? jug : slot.kind === "automaton" ? automaton : avatar;
	if (slot.kind === "wyvern") wyvern = slot.data;
	else if (slot.kind === "jug") jug = slot.data;
	else if (slot.kind === "automaton") automaton = slot.data;
	else avatar = slot.data;
	trustPetOwner = id;
	try {
		fn();
	} finally {
		const now = slot.kind === "wyvern" ? wyvern : slot.kind === "jug" ? jug : slot.kind === "automaton" ? automaton : avatar;
		if (trustPets[id] === slot) {
			if (now) slot.data = now;
			else delete trustPets[id];
		}
		if (slot.kind === "wyvern") wyvern = saved;
		else if (slot.kind === "jug") jug = saved;
		else if (slot.kind === "automaton") automaton = saved;
		else avatar = saved;
		trustPetOwner = savedOwner;
	}
}
function dismissTrustPet(id, line) {
	const slot = trustPets[id];
	if (!slot) return;
	delete trustPets[id];
	if (id === "shikaree-z") {
		const trust = liveTrusts["shikaree-z"];
		if (trust?.buffs?.some((buff) => buff.name === "Wyvern")) {
			trust.buffs = trust.buffs.filter((buff) => buff.name !== "Wyvern");
			useGame.setState({ trustVitals: trustVitalsNow() });
		}
	}
	if (line) useGame.getState().pushLog(line, "info");
	publishPets();
}
var automaton = null;
var automatonAt = {
	x: 0,
	z: 0,
	melee: false
};
var automatonActs = [];
function queueAutomatonAct(act) {
	automatonActs.push(act);
}
export function takeAutomatonActs() {
	if (automatonActs.length === 0) return [];
	const rows = automatonActs;
	automatonActs = [];
	return rows;
}
function showAutomatonAbility(kind, seconds) {
	if (!automaton) return;
	if (automaton.anim === "cast" || automaton.anim === "block" || automaton.anim === "ws") return;
	const called = kind === "provoke" || kind === "flash";
	if (!called && automaton.anim !== "idle") return;
	if (called && (automaton.anim === "provoke" || automaton.anim === "flash")) return;
	automaton.anim = kind;
	automaton.animLeft = seconds;
}
function asAutoHead(id) {
	return autoHead(id)?.id ?? "stormwaker";
}
function asAutoFrame(id) {
	return autoFrame(id)?.id ?? "stormwaker";
}
function maneuverCounts(rows) {
	const counts = emptyCapacity();
	for (const row of rows) counts[row.element] += 1;
	return counts;
}
function automatonSwing() {
	const state = useGame.getState();
	return autoAttackProfile({
		frame: asAutoFrame(state.autoFrame),
		head: asAutoHead(state.autoHead),
		attachments: state.autoSet,
		maneuvers: automaton ? maneuverCounts(automaton.maneuvers) : emptyCapacity(),
		overdrive: (automaton?.overdrive ?? 0) > 0,
		fightSec: automaton?.fightSec ?? 0,
		stronger: HARE.level > 75
	});
}
export function peekAutomaton() {
	return automaton ?? trustAuto();
}
export function noteAutomatonPlace(x, z, melee) {
	automatonAt = {
		x,
		z,
		melee
	};
}
export function peekWyvern() {
	return wyvern ?? trustWyvern();
}
/** One luopan. HP is the stand-in maximum. Decay is not damage. */
var luopan = null;
var geoAcc = 0;
export function peekLuopan() {
	if (!luopan) return null;
	return {
		hp: luopan.hp,
		max: luopan.max,
		element: luopan.element,
		spell: luopan.spell ?? "",
		allies: luopan.allies !== false,
		lasting: luopan.lasting === true,
		ecliptic: luopan.ecliptic === true,
		demat: luopan.demat > 0,
		owner: luopan.owner ?? null,
		x: luopan.x ?? null,
		z: luopan.z ?? null
	};
}
function dropSharedGeo() {
	liveBuffs = liveBuffs.filter((buff) => !buff.from);
	for (const trust of Object.values(liveTrusts)) {
		if (!trust?.buffs) continue;
		trust.buffs = trust.buffs.filter((buff) => !buff.from);
	}
}
function dismissLuopan(line) {
	const had = luopan != null;
	luopan = null;
	geoAcc = 0;
	dropSharedGeo();
	liveBuffs = liveBuffs.filter((buff) => !buff.name.startsWith("Geo-"));
	liveEnfeebles = liveEnfeebles.filter((row) => !row.name.startsWith("Geo-"));
	kinEnfeebles = kinEnfeebles.filter((row) => !row.name.startsWith("Geo-"));
	for (const [pid, held] of packStatuses) {
		const next = (held.enfeebles ?? []).filter((row) => !String(row.name).startsWith("Geo-"));
		if (next.length !== (held.enfeebles ?? []).length) keepPackStatuses(pid, next, held.debuffs ?? []);
	}
	if (line && had) useGame.getState().pushLog(line, "info");
}
function placeLuopan(level, mp, element, blaze, spell, allies, owner, point, anchorKind) {
	const max = luopanMaxHp(level);
	luopan = {
		hp: blaze ? Math.floor(max / 2) : max,
		max,
		mp,
		level,
		element,
		spell: spell ?? "",
		allies: allies !== false,
		lasting: false,
		ecliptic: false,
		demat: 0,
		...owner ? {
			owner,
			x: point?.x ?? 0,
			z: point?.z ?? 0,
			anchorKind: anchorKind ?? "hare"
		} : {}
	};
}
function geoSkillNow(state) {
	const bell = ITEMS$1[state.loadout.range ?? ""]?.kind === "Handbell";
	const geomancy = combinedSkill("Geomancy", state.mainJob, 75, state.subJob, state.subJob ? subjobLevel(75) : 0);
	const handbell = bell ? combinedSkill("Handbell", state.mainJob, 75, state.subJob, state.subJob ? subjobLevel(75) : 0) : 0;
	return { geomancy, handbell };
}
function playerOnHate(kin) {
	const rows = kin ? kinHateRows : hateRows;
	return rows.some((row) => row.id === "player" && (row.ce > 0 || row.ve > 0));
}
function colureBodyAlive(who, park) {
	if (who === "kin") return (strikeKin ? liveHareHp : liveKinHp) > 0;
	return (park ? park.hp : liveHareHp) > 0;
}
function colureBodyYards(who, park) {
	if (who === "kin") return kinYards;
	return park ? park.yards : yardDistance;
}
/** Indi is measured from you. Geo is measured from the luopan, which stands on the body the cast was aimed at. */
function colureFitYards(who, side, anchor, park) {
	if (side === "geo" && anchor) return who === anchor ? 0 : pairYards();
	return colureBodyYards(who, park);
}
function colureFits(who, side, anchor, park) {
	if (charm?.who === who || !colureBodyAlive(who, park) || !playerOnHate(who === "kin")) return false;
	return colureReaches(true, colureFitYards(who, side, anchor, park));
}
/**
 * The spell card prints no CE or VE. An empty list takes the usual first claim.
 * A fight that is already open only seats you, so the bubble can see you on the list.
 */
function seatColureClaim() {
	const rows = strikeKin ? kinHateRows : hateRows;
	if (rows.some((row) => row.id === "player" && (row.ce > 0 || row.ve > 0))) return;
	const empty = !rows.some((row) => row.ce > 0 || row.ve > 0);
	creditHate(empty ? 0 : 1, 0, true);
}
function foeColureRow(row) {
	const spell = spellByName(row?.name);
	return Boolean(spell?.colure && !geoAllies(spell.colure.effect));
}
function paintColureRow(rows, source) {
	const prev = rows.find((row) => row.name === source.name);
	const next = {
		name: source.name,
		left: source.left,
		power: source.power,
		charges: source.charges,
		...source.blazeKept ? { blazeKept: true } : {},
		...source.dot != null ? { dot: source.dot, acc: prev?.acc ?? 0 } : {},
		...source.evaDown != null ? { evaDown: source.evaDown } : {},
		...source.accDown != null ? { accDown: source.accDown } : {}
	};
	return [...rows.filter((row) => row.name !== source.name), next];
}
/** Copy a foe colure onto each body that is already tagged and inside 6'. Take it off the rest. */
function syncHostileColures() {
	if (luopan && !luopan.owner && !luopan.aura) {
		const pending = spellByName(luopan.spell);
		if (pending?.colure && !geoAllies(pending.colure.effect)) {
			const held = liveEnfeebles.find((row) => row.name === luopan.spell) || kinEnfeebles.find((row) => row.name === luopan.spell);
			if (held) luopan.aura = { ...held };
		}
	}
	const indi = liveBuffs.find((buff) => foeColureRow(buff)) ?? null;
	const geoSpell = luopan ? spellByName(luopan.spell) : null;
	const geoSource = !luopan?.owner && luopan?.aura && geoSpell?.colure && !geoAllies(geoSpell.colure.effect) ? luopan.aura : null;
	const anchor = luopan?.anchor ?? null;
	const paint = (rows, who) => {
		let next = rows.filter((row) => !foeColureRow(row) || row.name === indi?.name || row.name === geoSource?.name);
		for (const source of [indi, geoSource]) {
			if (!source) continue;
			const side = String(source.name).startsWith("Geo-") ? "geo" : "indi";
			next = next.filter((row) => row.name !== source.name);
			if (colureFits(who, side, side === "geo" ? anchor : null, null)) next = paintColureRow(next, source);
		}
		return next;
	};
	liveEnfeebles = paint(liveEnfeebles, "hare");
	kinEnfeebles = paint(kinEnfeebles, "kin");
	paintTrustFoeColures();
}
function trustHasHate(actor, who, packId) {
	if (who === "pack") {
		const rows = packHate.get(packId) ?? [];
		return rows.some((row) => row.id === actor && ((row.ce ?? 0) > 0 || (row.ve ?? 0) > 0));
	}
	const rows = who === "kin" ? kinHateRows : hateRows;
	return rows.some((row) => row.id === actor && ((row.ce ?? 0) > 0 || (row.ve ?? 0) > 0));
}
function trustFoeColures() {
	const sources = [];
	for (const [id, trust] of Object.entries(liveTrusts)) {
		if (!trust || trust.ko) continue;
		const indi = (trust.buffs ?? []).find((buff) => foeColureRow(buff));
		if (indi) sources.push({ id, row: indi, side: "indi" });
	}
	if (luopan?.owner && luopan.aura && foeColureRow(luopan.aura)) {
		sources.push({
			id: luopan.owner,
			row: luopan.aura,
			side: "geo",
			anchorKind: luopan.anchorKind ?? "hare",
			packId: luopan.packId ?? null
		});
	}
	return sources;
}
function trustColureHits(source, who, packBody) {
	if (source.side === "geo") {
		if (source.anchorKind === "pack") return who === "pack" && packBody?.id === source.packId;
		if (source.anchorKind === "kin") return who === "kin";
		return who === "hare";
	}
	const place = trustPlaces[source.id];
	if (!place) return false;
	let yards = 99;
	if (who === "hare") yards = place.yards ?? 99;
	else if (who === "kin") yards = Math.hypot((place.x ?? 0) - kinAt.x, (place.z ?? 0) - kinAt.z);
	else if (packBody) yards = Math.hypot((place.x ?? 0) - packBody.x, (place.z ?? 0) - packBody.z);
	if (yards > 6) return false;
	return trustHasHate(source.id, who, packBody?.id);
}
function paintTrustFoeColures() {
	const sources = trustFoeColures();
	const playerIndi = liveBuffs.find((buff) => foeColureRow(buff));
	const playerGeo = !luopan?.owner && luopan?.aura && foeColureRow(luopan.aura) ? luopan.aura : null;
	const kept = new Set([playerIndi?.name, playerGeo?.name].filter(Boolean));
	if (!sources.length) {
		for (const body of livePack()) {
			const held = packStatuses.get(body.id);
			if (!held) continue;
			const next = held.enfeebles.filter((row) => !foeColureRow(row) || kept.has(row.name));
			if (next.length !== held.enfeebles.length) keepPackStatuses(body.id, next, held.debuffs ?? []);
		}
		return;
	}
	const names = new Set(sources.map((source) => source.row.name));
	const paint = (rows, who, packBody) => {
		let next = rows.filter((row) => !names.has(row.name) || kept.has(row.name));
		for (const source of sources) {
			if (!trustColureHits(source, who, packBody)) continue;
			if (kept.has(source.row.name) && next.some((row) => row.name === source.row.name)) continue;
			next = paintColureRow(next, source.row);
		}
		return next;
	};
	liveEnfeebles = paint(liveEnfeebles, "hare", null);
	kinEnfeebles = paint(kinEnfeebles, "kin", null);
	for (const body of livePack()) {
		if (!body || body.hp <= 0 || body.mode === "dead") continue;
		const held = packStatuses.get(body.id);
		const next = paint(held?.enfeebles ?? [], "pack", body);
		if (next !== (held?.enfeebles ?? []) || names.size) keepPackStatuses(body.id, next, held?.debuffs ?? []);
	}
}
function nearbyIndi(suffix) {
	const name = `Indi-${suffix}`;
	if (liveBuffs.some((buff) => buff.name === name)) return 0;
	let n = 0;
	for (const [id, trust] of Object.entries(liveTrusts)) {
		if (!trust || trust.ko) continue;
		if ((trustPlaces[id]?.party ?? 99) > 6) continue;
		const row = (trust.buffs ?? []).find((buff) => buff.name === name);
		if (row) n += row.power ?? 0;
	}
	return n;
}
function colurePoint(id, cast) {
	const place = trustPlaces[id];
	if (cast?.packId) {
		const body = livePack().find((row) => row.id === cast.packId);
		if (body) return {
			kind: "pack",
			id: body.id,
			x: body.x,
			z: body.z,
			yards: place ? Math.hypot((place.x ?? 0) - body.x, (place.z ?? 0) - body.z) : 99
		};
	}
	if (cast?.foeId === "kin") return {
		kind: "kin",
		id: "kin",
		x: kinAt.x,
		z: kinAt.z,
		yards: place ? Math.hypot((place.x ?? 0) - kinAt.x, (place.z ?? 0) - kinAt.z) : 99
	};
	return {
		kind: "hare",
		id: "hare",
		x: hareAt.x,
		z: hareAt.z,
		yards: place?.yards ?? 99
	};
}
function seatTrustColure(id, point) {
	if (point.kind === "pack") {
		if (!trustHasHate(id, "pack", point.id)) creditPackHate(point.id, 1, 0, true, id);
		return;
	}
	if (trustHasHate(id, point.kind, null)) return;
	const prev = strikeKin;
	strikeKin = point.kind === "kin";
	creditHate(1, 0, true, id);
	strikeKin = prev;
}
function trustColureRow(name, power, left, effect, bolster) {
	const row = {
		name,
		left,
		power,
		charges: bolster ? 2 : 1,
		...String(name).startsWith("Geo-") ? { hold: true } : {}
	};
	if (effect === "poison") {
		row.dot = power;
		row.acc = 0;
	}
	if (effect === "torpor") row.evaDown = power;
	if (effect === "slip") row.accDown = power;
	return row;
}
function landTrustColure(id, trust, spell, sheet, cast) {
	const effect = spell.colure.effect;
	const side = spell.colure.side;
	const geomancy = combinedSkill("Geomancy", sheet.job, 75, sheet.sub, sheet.subLevel);
	const bolster = (trust.buffs ?? []).some((buff) => buff.name === "Bolster");
	const blaze = side === "geo" && (trust.buffs ?? []).some((buff) => buff.name === "Blaze of Glory");
	const power = colurePower(effect, geomancy, 0, bolster, blaze, false);
	const allies = geoAllies(effect);
	const told = colureLine(effect, power, side);
	let point = colurePoint(id, cast);
	if (side === "geo" && allies && typeof cast?.targetId === "string") {
		const stand = cast.targetId === "player" || cast.targetId === GAMBIT_MEMBER ? playerStand : trustPlaces[cast.targetId];
		if (stand && stand.x != null && stand.z != null) point = {
			kind: "ally",
			id: cast.targetId,
			x: stand.x,
			z: stand.z,
			yards: 0
		};
	}
	const row = trustColureRow(spell.name, power, side === "indi" ? 180 : 1e5, effect, bolster);
	if (side === "indi") trust.buffs = [...(trust.buffs ?? []).filter((buff) => !String(buff.name).startsWith("Indi-")), row];
	else {
		if (blaze) trust.buffs = (trust.buffs ?? []).filter((buff) => buff.name !== "Blaze of Glory");
		dropSharedGeo();
		liveEnfeebles = liveEnfeebles.filter((entry) => !String(entry.name).startsWith("Geo-"));
		kinEnfeebles = kinEnfeebles.filter((entry) => !String(entry.name).startsWith("Geo-"));
		for (const [pid, held] of packStatuses) {
			const next = (held.enfeebles ?? []).filter((entry) => !String(entry.name).startsWith("Geo-"));
			if (next.length !== (held.enfeebles ?? []).length) keepPackStatuses(pid, next, held.debuffs ?? []);
		}
		placeLuopan(sheet.job === "GEO" ? 75 : 0, spell.mp ?? 0, castElement(spell) || "light", blaze, spell.name, allies, id, point, point.kind);
		luopan.packId = point.kind === "pack" ? point.id : null;
		if (allies) luopan.row = row;
		else luopan.aura = row;
	}
	let held = true;
	if (!allies) held = side === "geo" || point.yards <= 6;
	if (!allies && held) seatTrustColure(id, point);
	const placed = side === "geo" ? " The luopan is placed." : "";
	const half = blaze ? " It stands at half HP." : "";
	const miss = !allies && !held ? " No enemy inside 6' is close enough, so it does not take hold yet." : "";
	return {
		text: `${trustName(id)} casts ${spell.name}. ${told}${placed}${half}${miss}`,
		brief: colureBrief(spell.name, power)
	};
}
function syncAllyGeo() {
	const spell = luopan?.owner ? spellByName(luopan.spell) : null;
	const allies = !!(spell?.colure && geoAllies(spell.colure.effect) && luopan.row);
	if (!allies) {
		dropSharedGeo();
		return;
	}
	const row = { ...luopan.row, from: luopan.owner, left: 1e5, hold: true };
	const near = (x, z) => Math.hypot((x ?? 0) - (luopan.x ?? 0), (z ?? 0) - (luopan.z ?? 0)) <= 6;
	const give = (buffs) => [...buffs.filter((buff) => buff.from !== luopan.owner), row];
	const take = (buffs) => buffs.filter((buff) => buff.from !== luopan.owner);
	if (near(playerStand.x, playerStand.z)) liveBuffs = give(liveBuffs);
	else liveBuffs = take(liveBuffs);
	for (const [id, trust] of Object.entries(liveTrusts)) {
		if (!trust) continue;
		const place = trustPlaces[id];
		if (place && near(place.x, place.z)) trust.buffs = give(trust.buffs ?? []);
		else if (trust.buffs) trust.buffs = take(trust.buffs);
	}
}
/** An ally Indi follows its caster. Anyone inside 6' wears that bubble. The caster keeps the original. */
function indiAuraRow(buffs) {
	if (!buffs) return null;
	for (const buff of buffs) {
		if (!buff || buff.indiFrom) continue;
		const name = String(buff.name);
		if (!name.startsWith("Indi-")) continue;
		const spell = spellByName(name);
		if (spell?.colure && geoAllies(spell.colure.effect)) return buff;
	}
	return null;
}
function shareIndi(row, id) {
	return {
		name: row.name,
		left: row.left,
		power: row.power,
		hold: true,
		indiFrom: id,
		...row.charges != null ? { charges: row.charges } : {},
		...row.dot != null ? { dot: row.dot, acc: row.acc ?? 0 } : {},
		...row.evaDown != null ? { evaDown: row.evaDown } : {},
		...row.accDown != null ? { accDown: row.accDown } : {}
	};
}
function syncTrustIndi() {
	const kept = liveBuffs.filter((buff) => {
		const name = String(buff?.name ?? "");
		if (!name.startsWith("Indi-") || buff.indiFrom) return true;
		return buff.hold !== true;
	});
	const droppedIndi = kept.length !== liveBuffs.length;
	liveBuffs = kept;
	const sources = [];
	const mine = indiAuraRow(liveBuffs);
	if (mine) sources.push({ id: "player", row: mine });
	for (const [id, trust] of Object.entries(liveTrusts)) {
		if (!trust || trust.ko) continue;
		const row = indiAuraRow(trust.buffs);
		if (!row || !trustPlaces[id]) continue;
		sources.push({ id, row });
	}
	const nearSource = (who, source) => {
		if (source.id === who) return false;
		if (who === "player") return (trustPlaces[source.id]?.party ?? 99) <= 6;
		if (source.id === "player") return (trustPlaces[who]?.party ?? 99) <= 6;
		return yardsFrom(source.id, who) <= 6;
	};
	const paint = (buffs, who) => {
		const next = (buffs ?? []).filter((buff) => !buff.indiFrom);
		for (const source of sources) {
			if (!nearSource(who, source)) continue;
			if (next.some((buff) => buff.name === source.row.name)) continue;
			next.push(shareIndi(source.row, source.id));
		}
		return next;
	};
	liveBuffs = paint(liveBuffs, "player");
	for (const [id, trust] of Object.entries(liveTrusts)) {
		if (!trust) continue;
		trust.buffs = paint(trust.buffs, id);
	}
	if (droppedIndi) useGame.setState({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
}
/** A poison colure tick is ordinary damage enmity. It does not open a hate list. */
function creditColureTick(name, slip, kin) {
	if (slip <= 0) return;
	if (!String(name).startsWith("Indi-") && !String(name).startsWith("Geo-")) return;
	const gain = damageEnmity(HARE.level, slip);
	if (gain.ce <= 0 && gain.ve <= 0) return;
	const prev = strikeKin;
	strikeKin = kin;
	creditHate(gain.ce, gain.ve, false);
	strikeKin = prev;
}
function geoRow(name, power, left, effect) {
	const bolstered = liveBuffs.some((buff) => buff.name === "Bolster") && (String(name).startsWith("Indi-") || String(name).startsWith("Geo-"));
	const row = {
		name,
		left,
		power,
		charges: bolstered ? 2 : 1,
		...String(name).startsWith("Geo-") ? { hold: true } : {}
	};
	if (bolstered && String(name).startsWith("Geo-") && liveBuffs.some((buff) => buff.name === "Blaze of Glory")) row.blazeKept = true;
	if (effect === "poison") {
		row.dot = power;
		row.acc = 0;
	}
	if (effect === "torpor") row.evaDown = power;
	if (effect === "slip") row.accDown = power;
	return row;
}
function halveBolster(row) {
	const name = String(row.name);
	if (row.charges !== 2 || (!name.startsWith("Indi-") && !name.startsWith("Geo-"))) return row;
	const scale = row.blazeKept ? (n) => Math.floor(n * 3 / 4) : (n) => Math.floor(n / 2);
	const power = scale(row.power ?? 0);
	return {
		...row,
		power,
		charges: 1,
		blazeKept: false,
		...row.dot != null ? { dot: scale(row.dot) } : {},
		...row.evaDown != null ? { evaDown: scale(row.evaDown) } : {},
		...row.accDown != null ? { accDown: scale(row.accDown) } : {}
	};
}
function doubleIndi(row) {
	if (!String(row.name).startsWith("Indi-") || row.charges === 2) return row;
	const power = (row.power ?? 0) * 2;
	return {
		...row,
		power,
		charges: 2,
		...row.dot != null ? { dot: row.dot * 2 } : {},
		...row.evaDown != null ? { evaDown: row.evaDown * 2 } : {},
		...row.accDown != null ? { accDown: row.accDown * 2 } : {}
	};
}
function eclipticRow(row) {
	if (!String(row.name).startsWith("Geo-")) return row;
	const scale = (n) => Math.floor(n * 1.25);
	return {
		...row,
		power: scale(row.power ?? 0),
		...row.dot != null ? { dot: scale(row.dot) } : {},
		...row.evaDown != null ? { evaDown: scale(row.evaDown) } : {},
		...row.accDown != null ? { accDown: scale(row.accDown) } : {}
	};
}
/** Where the wyvern mesh is. Melee is true only while it is in range of a live fight. */
var wyvernAt = {
	x: 0,
	z: 0,
	melee: false
};
export function noteWyvernPlace(x, z, melee) {
	wyvernAt = {
		x,
		z,
		melee
	};
}
export function peekJug() {
	return jug ?? trustJug();
}
/** Where Courier Carrie is. Melee is true only while Fight has her in range. */
var jugAt = {
	x: 0,
	z: 0,
	melee: false
};
export function noteJugPlace(x, z, melee) {
	jugAt = {
		x,
		z,
		melee
	};
}
var charm = null;
var charmFx = null;
var rollNotes = /* @__PURE__ */ new Map();
var charmAct = null;
/** The wild rarab's swing at the pet. Separate from the pet's own Sic clip. */
var wildAct = null;
var wildSwing = 4;
/** The uncharmed rarab is on the pet. Charm does not set this. A connecting hit from the pet does. */
var wildEngaged = false;
export function wildHuntsPet() {
	return wildEngaged && charm != null;
}
/**
* Ready and Sic share one bank. It ticks with or without a jug.
* Three charges, 30 seconds each. Sic needs all three.
* A full bank resets the accumulator when a charge is spent.
*/
var readyBank = {
	charges: 3,
	acc: 0
};
/** A landed Tame. The next Charm on this quarry gets +10, then this clears. */
var tamePrimed = false;
/** Lhu's Tame. It does not spend or feed the player's next Charm. */
var trustTamePrimed = false;
/** Null while the player's Charm owns the quarry. Lhu's Charm sets her id. */
var charmOwner = null;
/** A forest rabbit Lhu charmed. The pen keeps `charm`. This body is not written into `charm.who`. */
var packCharm = null;
/** Where the last Charm was aimed, so the hearts leave her hand. */
var charmAim = null;
/** Reward's regen. 14 HP every 3 seconds, for 3 minutes. Quiet ticks. */
var rewardRegen = null;
/** Repair's mend. 20 HP every 3 seconds, five tics. One Automaton Oil. */
var repairRegen = null;
export function peekRepairLeft() {
	return repairRegen?.left ?? 0;
}
var petFloaters = [];
function queuePetFloater(row) {
	petFloaters.push(row);
}
export function takePetFloaters() {
	if (petFloaters.length === 0) return [];
	const rows = petFloaters;
	petFloaters = [];
	return rows;
}
export function peekCharm() {
	return charm;
}
export function peekPackCharm() {
	return packCharm ? { id: packCharm.id, stance: packCharm.stance, owner: packCharm.owner } : null;
}
export function takeCharmAim() {
	const aim = charmAim;
	charmAim = null;
	return aim;
}
/** True only when the body being struck is the pet. A charmed kin leaves the training dummy fighting. */
export function hareIsCharmed() {
	if (strikePackId || strikeFieldId) return false;
	if (strikeKin) return charm != null && charm.who === "kin";
	return charm != null && charm.who !== "kin";
}
/**
* The body the player is fighting. Never your own pet.
* Targeting the pet keeps the swing on the other living Tropical Rarab.
* A dead quarry is not a target. The other living one is, so a new action
* does not land on the corpse. A spell that already started keeps its own
* body: if that one falls, the cast is interrupted instead.
* Null when both are down, or the only one left is the pet.
*/
export function playerFoe() {
	if (pinnedFoe === "hare" || pinnedFoe === "kin") {
		if (charm?.who !== pinnedFoe) return pinnedFoe;
	}
	const s = useGame.getState();
	const quarry = s.quarry === "kin" ? "kin" : "hare";
	const pet = charm?.who ?? null;
	const alive = (who) => (who === "kin" ? liveKinHp : liveHareHp) > 0;
	if (quarry !== pet && alive(quarry)) return quarry;
	const other = quarry === "kin" ? "hare" : "kin";
	if (quarry === pet && other !== pet && alive(other)) return other;
	if ((s.targeted || s.engaged) && other !== pet && alive(other)) return other;
	return null;
}
/** The foe or ally this cast began on is gone. Do not choose another. */
function castMarkDown(cast) {
	if (!cast) return false;
	const spell = spellByName(cast.name);
	if (spell?.raise) {
		const id = typeof cast.allyId === "string" ? cast.allyId : typeof cast.targetId === "string" ? cast.targetId : null;
		if (!id || id === "player") return false;
		return !liveTrusts[id];
	}
	if (cast.foeId === "pack") {
		const field = fieldById(cast.packId);
		if (field) return field.hp <= 0 || field.mode === "dead" || field.away;
		const body = livePack().find((row) => row.id === cast.packId);
		return !body || body.hp <= 0 || body.mode === "dead";
	}
	if (spellMarkDown(cast.foeId, liveHareHp, liveKinHp)) return true;
	if (typeof cast.allyId === "string") {
		const row = liveTrusts[cast.allyId];
		if (!row || row.ko) return true;
	}
	if (cast.targetId === "player") return useGame.getState().ko;
	if (!cast.foeId && typeof cast.targetId === "string" && cast.targetId !== "player") {
		const row = liveTrusts[cast.targetId];
		if (!row || row.ko) return true;
	}
	return false;
}
function abortTrustCast(id, trust) {
	const cast = trust.cast;
	if (!cast) return;
	const spent = cast.mpSpent ?? 0;
	if (spent > 0) trust.mp = Math.min(trust.maxMp, trust.mp + spent);
	if (cast.name) delete trust.recasts[cast.name];
	trust.cast = null;
	useGame.getState().pushLog(`${trustName(id)}'s ${cast.name} is interrupted.`, "miss");
	useGame.setState({ trustVitals: trustVitalsNow() });
}
/** Both Tropical Rarab are down. Engaged with nothing left is a phantom fight. */
function clearEmptyFight() {
	if (fightBodies().length > 0 || readSwingBody() || chasedPack().length) return;
	let trusts = false;
	for (const trust of Object.values(liveTrusts)) {
		if (!trust.engaged) continue;
		trust.engaged = false;
		trusts = true;
	}
	const engaged = useGame.getState().engaged;
	if (!engaged && !trusts) return;
	useGame.setState({
		engaged: false,
		...trusts ? { trustVitals: trustVitalsNow() } : {}
	});
}
/** Yalms to the body the player is fighting. Spells, weapon skills, and skillchains use this body. */
function packYards(body) {
	const here = readPlace();
	return Math.hypot((here?.x ?? 0) - body.x, (here?.z ?? 0) - body.z);
}
/** Point the training-rabbit card at a West Ronfaure or Ghelsba mob for one strike. */
function beginFieldStrike(id) {
	const body = fieldById(id);
	if (!body || body.hp <= 0 || body.mode === "dead" || body.away) return null;
	const park = {
		enfeebles: liveEnfeebles,
		debuffs: liveHareDebuffs,
		hp: liveHareHp,
		yards: yardDistance,
		statDown: liveStatDown,
		banish: liveBanish,
		bubble: bubbleStr,
		bubbleLeft: bubbleStrLeft
	};
	if (!hareSnap) {
		hareSnap = { ...HARE };
		const card = fieldCard(body);
		HARE.name = card.name;
		HARE.family = card.family;
		HARE.job = card.job;
		HARE.level = card.level;
		HARE.levelMin = card.levelMin;
		HARE.levelMax = card.levelMax;
		HARE.hpNatural = card.hpNatural;
		HARE.mp = card.mp;
		HARE.str = card.str;
		HARE.dex = card.dex;
		HARE.vit = card.vit;
		HARE.agi = card.agi;
		HARE.int = card.int;
		HARE.mnd = card.mnd;
		HARE.chr = card.chr;
		HARE.evasion = card.evasion;
		HARE.defRankBase = card.defRankBase;
		HARE.accuracy = card.accuracy;
		HARE.attack = card.attack;
		HARE.combatSkill = card.combatSkill;
		HARE.weaponDamage = card.weaponDamage;
		HARE.delay = card.delay;
		HARE.weaponRank = card.weaponRank;
		HARE.undead = card.undead;
		HARE.aggressive = card.aggressive;
		setHareDefenseOverride(card.defense);
		const held = fieldStatusPark(id);
		liveEnfeebles = held.enfeebles;
		liveHareDebuffs = held.debuffs;
		liveStatDown = null;
		liveBanish = null;
		bubbleStr = 0;
		bubbleStrLeft = 0;
		liveHareHp = body.hp;
		yardDistance = packYards(body);
	}
	strikeFieldId = id;
	return park;
}
function endFieldStrike(park) {
	if (!park) {
		strikeFieldId = null;
		return;
	}
	if (strikeFieldId) fieldStatusSave(strikeFieldId, liveEnfeebles, liveHareDebuffs);
	if (hareSnap) {
		for (const key of Object.keys(hareSnap)) HARE[key] = hareSnap[key];
		hareSnap = null;
	}
	setHareDefenseOverride(null);
	liveEnfeebles = park.enfeebles;
	liveHareDebuffs = park.debuffs;
	liveHareHp = park.hp;
	yardDistance = park.yards;
	liveStatDown = park.statDown;
	liveBanish = park.banish;
	bubbleStr = park.bubble;
	bubbleStrLeft = park.bubbleLeft;
	strikeFieldId = null;
	useGame.setState({
		hareHp: park.hp,
		hareEnfeebles: park.enfeebles.map((row) => ({ ...row })),
		hareDebuffs: park.debuffs.map((row) => ({ ...row })),
		statDown: park.statDown ? { ...park.statDown } : null,
		banishDown: park.banish ? { ...park.banish } : null
	});
}
var hareSnap = null;
/** Point the training-dummy formulas at one forest rabbit, or one field mob, then put the pen back. */
function beginPackStrike(id) {
	if (fieldById(id)) return beginFieldStrike(id);
	const body = livePack().find((row) => row.id === id);
	if (!body || body.hp <= 0 || body.mode === "dead") return null;
	const park = {
		enfeebles: liveEnfeebles,
		debuffs: liveHareDebuffs,
		hp: liveHareHp,
		yards: yardDistance,
		statDown: liveStatDown,
		banish: liveBanish,
		bubble: bubbleStr,
		bubbleLeft: bubbleStrLeft
	};
	const held = packStatuses.get(id);
	strikePackId = id;
	liveEnfeebles = held ? held.enfeebles.map((row) => ({ ...row })) : [];
	liveHareDebuffs = held ? held.debuffs.map((row) => ({ ...row })) : [];
	liveStatDown = null;
	liveBanish = null;
	bubbleStr = 0;
	bubbleStrLeft = 0;
	liveHareHp = body.hp;
	yardDistance = packYards(body);
	return park;
}
function endPackStrike(park) {
	if (strikeFieldId) {
		endFieldStrike(park);
		return;
	}
	if (strikePackId) keepPackStatuses(strikePackId, liveEnfeebles, liveHareDebuffs);
	liveEnfeebles = park.enfeebles;
	liveHareDebuffs = park.debuffs;
	liveHareHp = park.hp;
	yardDistance = park.yards;
	liveStatDown = park.statDown;
	liveBanish = park.banish;
	bubbleStr = park.bubble;
	bubbleStrLeft = park.bubbleLeft;
	strikePackId = null;
	useGame.setState({
		hareHp: park.hp,
		hareEnfeebles: park.enfeebles.map((row) => ({ ...row })),
		hareDebuffs: park.debuffs.map((row) => ({ ...row })),
		statDown: park.statDown ? { ...park.statDown } : null,
		banishDown: park.banish ? { ...park.banish } : null,
		...packMarkNow()
	});
}
function struckYards() {
	if (strikePackId || strikeFieldId) return yardDistance;
	return playerFoe() === "kin" ? kinYards : yardDistance;
}
/** TP from the player's own hit, onto the body that hit just struck. */
export function grantPlayerFoeTp(baseTp) {
	if (strikeFieldId) {
		const body = fieldById(strikeFieldId);
		if (!body || body.hp <= 0) return;
		const s = useGame.getState();
		const gain = monsterTpGain(baseTp, subtleBlow(s.buffs) + mnkSubtleBlow(s.sheet.job === "MNK" ? 75 : s.sheet.sub === "MNK" ? s.sheet.subLevel : 0) + (s.sheet.subtleBlow ?? 0) + (jug?.stance === "fight" ? s.sheet.tandemBlow : 0));
		if (gain <= 0) return;
		body.tp = Math.min(3000, body.tp + gain);
		return;
	}
	if (strikePackId) return;
	const who = playerFoe();
	if (!who) return;
	const s = useGame.getState();
	const gain = monsterTpGain(baseTp, subtleBlow(s.buffs) + mnkSubtleBlow(s.sheet.job === "MNK" ? 75 : s.sheet.sub === "MNK" ? s.sheet.subLevel : 0) + (s.sheet.subtleBlow ?? 0) + (jug?.stance === "fight" ? s.sheet.tandemBlow : 0));
	if (gain <= 0) return;
	if (who === "kin") {
		if (liveKinHp <= 0) return;
		liveKinTp = Math.min(3e3, liveKinTp + gain);
		useGame.setState({ kinTp: liveKinTp });
		return;
	}
	useGame.setState({ hareTp: useGame.getState().hareTp + gain });
}
export function takeCharmFx() {
	const fx = charmFx;
	charmFx = null;
	return fx;
}
export function takeRollFx(id) {
	const fx = rollNotes.get(id) ?? null;
	if (fx) rollNotes.delete(id);
	return fx;
}
/** Proc flashes queued by a samba daze. The yard draws them and clears the list. */
var sambaFxQueue = [];
export function takeSambaFx() {
	if (!sambaFxQueue.length) return [];
	const fx = sambaFxQueue;
	sambaFxQueue = [];
	return fx;
}
/** Heal and cleanse flashes queued by a waltz. The yard draws them and clears the list. */
var waltzFxQueue = [];
export function takeWaltzFx() {
	if (!waltzFxQueue.length) return [];
	const fx = waltzFxQueue;
	waltzFxQueue = [];
	return fx;
}
/** A feather puff on someone Chocobo Jig II reached. The dancer's own cast covers the caster. */
var jigFxQueue = [];
export function takeJigFx() {
	if (!jigFxQueue.length) return [];
	const fx = jigFxQueue;
	jigFxQueue = [];
	return fx;
}
/** The daze a step just put on a foe. The yard draws it and clears the list. */
var stepFxQueue = [];
export function takeStepFx() {
	if (!stepFxQueue.length) return [];
	const fx = stepFxQueue;
	stepFxQueue = [];
	return fx;
}
function sambaBuffOf(buffs) {
	return (buffs ?? []).find((buff) => sambaDaze(buff.name)) ?? null;
}
function sambaDazeRow(rows) {
	return rows.find((row) => row.name === "Drain Daze" || row.name === "Aspir Daze" || row.name === "Haste Daze") ?? null;
}
/**
 * A connected melee hit. The dancer's samba is only a mode.
 * This swing puts that mode's daze on the foe for 10 seconds, or
 * refreshes it. Party melee does not refresh it. Whoever connected
 * then gets the daze that is on the foe, including the hit that put it there.
 * Drain and Aspir restore from damage already dealt. They do not add any.
 */
function landSambaHit({ who, label, buffs, delay, damage, foe }) {
	const kin = foe === "kin";
	let rows = kin ? kinEnfeebles : liveEnfeebles;
	const samba = sambaBuffOf(buffs);
	let daze = sambaDazeRow(rows);
	let fresh = false;
	if (samba) {
		const name = sambaDaze(samba.name);
		fresh = !daze || daze.name !== name;
		const placed = { name, left: SAMBA_DAZE_SECONDS, samba: samba.name };
		const next = rows.filter((row) => row.name !== "Drain Daze" && row.name !== "Aspir Daze" && row.name !== "Haste Daze");
		next.push(placed);
		if (kin) kinEnfeebles = next;
		else liveEnfeebles = next;
		rows = next;
		daze = placed;
		useGame.setState(kin ? { kinEnfeebles: next.map((row) => ({ ...row })) } : { hareEnfeebles: next.map((row) => ({ ...row })) });
	}
	if (!daze?.samba) return;
	const source = daze.samba;
	const actor = who === "player" ? "You" : label;
	if (daze.name === "Drain Daze") {
		if (HARE.undead) {
			if (fresh) useGame.getState().pushLog(`The ${HARE.name} is undead. Drain Daze restores nothing.`, "info");
			return;
		}
		const back = drainFromHit(source, delay, damage);
		if (back <= 0) return;
		let heal = 0;
		if (who === "player") {
			const room = Math.max(0, hpCap() - useGame.getState().hp);
			heal = Math.min(room, back);
			if (heal > 0) useGame.setState({ hp: useGame.getState().hp + heal });
		} else {
			const trust = liveTrusts[who];
			if (trust) {
				heal = Math.min(Math.max(0, trust.maxHp - trust.hp), back);
				if (heal > 0) trust.hp += heal;
			}
		}
		if (heal > 0) useGame.getState().pushLog(who === "player" ? `${source} restores ${heal} HP.` : `${actor}'s ${source} restores ${heal} HP.`, "info");
		sambaFxQueue.push({ kind: "drain", who, amount: heal, foe });
		return;
	}
	if (daze.name === "Aspir Daze") {
		const back = aspirFromHit(source, delay, damage);
		const pool = Math.max(0, HARE.mp || 0);
		if (pool <= 0 || back <= 0) {
			if (fresh && pool <= 0) useGame.getState().pushLog(`The ${HARE.name} has no MP.`, "info");
			if (back > 0) sambaFxQueue.push({ kind: "aspir-dry", who, amount: 0, foe });
			return;
		}
		let gain = 0;
		const take = Math.min(back, pool);
		if (who === "player") {
			const s = useGame.getState();
			const room = Math.max(0, (s.sheet.mp || 0) - s.mp);
			gain = Math.min(room, take);
			if (gain > 0) useGame.setState({ mp: s.mp + gain });
		} else {
			const trust = liveTrusts[who];
			if (trust) {
				gain = Math.min(Math.max(0, trust.maxMp - trust.mp), take);
				if (gain > 0) trust.mp += gain;
			}
		}
		if (gain > 0) useGame.getState().pushLog(who === "player" ? `${source} restores ${gain} MP.` : `${actor}'s ${source} restores ${gain} MP.`, "info");
		sambaFxQueue.push({ kind: gain > 0 ? "aspir" : "aspir-dry", who, amount: gain, foe });
		return;
	}
	if (daze.name === "Haste Daze") {
		if (fresh) useGame.getState().pushLog(who === "player" ? "Haste Daze. Your melee is hasted while it holds." : `Haste Daze. ${actor}'s melee is hasted while it holds.`, "info");
		sambaFxQueue.push({ kind: "haste", who, amount: 0, foe });
	}
}
function sambaWore(name) {
	if (name === "Drain Daze" || name === "Aspir Daze" || name === "Haste Daze") useGame.getState().pushLog(`${name} wears off.`, "info");
}
export function takeCharmAct() {
	const act = charmAct;
	charmAct = null;
	return act;
}
export function takeWildAct() {
	const act = wildAct;
	wildAct = null;
	return act;
}
function queueCharmAct(move, text) {
	charmAct = {
		move,
		text
	};
}
function sicSecondsLeft() {
	if (readyBank.charges >= 3) return 0;
	return Math.max(0, (3 - readyBank.charges) * 30 - readyBank.acc);
}
/** The Sic button shows the seconds until the bank is full. Ready spends do not start their own timer. */
function syncReadyClock() {
	if (jug) {
		jug.charges = readyBank.charges;
		jug.chargeAcc = readyBank.acc;
	}
	const left = sicSecondsLeft();
	if (left > 0) liveRecasts.Sic = left;
	else delete liveRecasts.Sic;
}
function tickReadyBank(dt) {
	if (readyBank.charges < 3) {
		readyBank.acc += dt;
		let gained = 0;
		while (readyBank.charges < 3 && readyBank.acc >= 30) {
			readyBank.acc -= 30;
			readyBank.charges += 1;
			gained += 1;
		}
		if (readyBank.charges >= 3) readyBank.acc = 0;
		if (gained > 0 && (jug || charm)) useGame.getState().pushLog(`Ready charges: ${readyBank.charges}.`, "info");
	}
	syncReadyClock();
}
function spendReady(n) {
	if (readyBank.charges < n) return false;
	const full = readyBank.charges >= 3;
	readyBank.charges -= n;
	if (full) readyBank.acc = 0;
	syncReadyClock();
	return true;
}
function spendSic() {
	if (readyBank.charges < 3) return false;
	readyBank.charges = 0;
	readyBank.acc = 0;
	syncReadyClock();
	return true;
}
/** A saved Sic timer is the same bank. Old saves never wrote one, so they resume full. */
function bankFromSic(left) {
	const capped = Math.max(0, Math.min(90, left));
	if (capped <= 0) return {
		charges: 3,
		acc: 0
	};
	const missing = Math.ceil(capped / 30);
	const charges = Math.max(0, 3 - missing);
	return {
		charges,
		acc: Math.max(0, (3 - charges) * 30 - capped)
	};
}
function charmTpNow() {
	if (!charm) return 0;
	return charm.who === "kin" ? liveKinTp : useGame.getState().hareTp;
}
function zeroCharmTp() {
	if (!charm) return;
	if (charm.who === "kin") {
		liveKinTp = 0;
		useGame.setState({ kinTp: 0 });
		return;
	}
	useGame.setState({ hareTp: 0 });
}
function addCharmTp(gain) {
	const n = Math.floor(gain);
	if (!charm || n <= 0) return;
	if (charm.who === "kin") {
		liveKinTp = Math.min(3e3, liveKinTp + n);
		useGame.setState({ kinTp: liveKinTp });
		return;
	}
	useGame.setState({ hareTp: Math.min(3e3, useGame.getState().hareTp + n) });
}
function otherRarabAlive() {
	if (!charm) return false;
	return charm.who === "kin" ? liveHareHp > 0 : liveKinHp > 0;
}
function restoreCarrot() {
	const heal = wildCarrotHeal(HARE.hpNatural);
	if (charm?.who === "kin") {
		if (liveKinHp <= 0) return 0;
		const gained = Math.min(heal, Math.max(0, HARE.hpNatural - liveKinHp));
		if (gained <= 0) return 0;
		liveKinHp += gained;
		useGame.setState({ kinHp: liveKinHp });
		return gained;
	}
	if (liveHareHp <= 0) return 0;
	const gained = Math.min(heal, Math.max(0, HARE.hpNatural - liveHareHp));
	if (gained <= 0) return 0;
	liveHareHp += gained;
	if (liveEnfeebles.some((row) => isSleepSpell(row.name) || row.name === "Lullaby" || row.name === "Sheep Song" || row.name === "Soporific" || row.name === "Yawn")) {
		liveEnfeebles = liveEnfeebles.filter((row) => !isSleepSpell(row.name) && row.name !== "Lullaby" && row.name !== "Sheep Song" && row.name !== "Soporific" && row.name !== "Yawn");
		useGame.getState().pushLog(`The ${HARE.name} wakes.`, "info");
	}
	useGame.setState({
		hareHp: liveHareHp,
		hareEnfeebles: liveEnfeebles.map((row) => ({ ...row }))
	});
	return gained;
}
function strikeOther(damage) {
	if (!charm || damage <= 0) return;
	if (!wildEngaged) {
		wildEngaged = true;
		wildSwing = HARE.delay / 60;
		useGame.getState().pushLog(`The ${HARE.name} turns to fight the charmed ${HARE.name}.`, "info");
	}
	if (charm.who === "kin") {
		chipHare(damage);
		const gain = damageEnmity(HARE.level, damage);
		creditHate(gain.ce, gain.ve, true, "charm", true);
		useGame.setState({
			hareHp: liveHareHp,
			...hateNow()
		});
		return;
	}
	chipKin(damage);
	const gain = damageEnmity(HARE.level, damage);
	creditKinHate(gain.ce, gain.ve, true, "charm", true);
}
function fireCharmSic(move) {
	if (!charm) return;
	noteBlueReady(charm.who === "kin" ? "kin" : "hare", move);
	charm.sicQueued = false;
	zeroCharmTp();
	if (move === "Wild Carrot") {
		const gained = restoreCarrot();
		useGame.getState().pushLog(`Wild Carrot restores ${gained} HP. The TP is spent.`, "info");
		queueCharmAct(move, `+${gained}`);
	} else {
		const strike = rarabOnRarab({
			move,
			otherAlive: otherRarabAlive(),
			yards: pairYards(),
			hitRoll: Math.random() * 100,
			critRoll: Math.random() * 100,
			pdifRoll: Math.random()
		});
		if (strike.whiff === "dead") {
			useGame.getState().pushLog(`There is no other foe, so ${move} does not land. The TP is spent.`, "info");
			queueCharmAct(move, "Miss");
		} else if (strike.whiff === "range") {
			useGame.getState().pushLog(`${move} is out of reach, so it does not land. The TP is spent.`, "info");
			queueCharmAct(move, "Miss");
		} else if (!strike.hit) {
			useGame.getState().pushLog(`The charmed ${HARE.name}'s ${move} misses the other ${HARE.name}. The TP is spent.`, "miss");
			queueCharmAct(move, "Miss");
		} else {
			strikeOther(strike.damage);
			const mark = strike.crit ? `${strike.damage}!` : String(strike.damage);
			useGame.getState().pushLog(`The charmed ${HARE.name}'s ${move} hits the other ${HARE.name} for ${strike.damage} points of damage.`, "hit");
			queueCharmAct(move, mark);
		}
	}
	publishPets();
}
/** Fight auto. Delay 240. Damage is the same monster-on-monster roll. Out of reach waits. */
function landCharmAuto() {
	if (!charm || charmAct) return;
	if (!otherRarabAlive()) return;
	const strike = rarabOnRarab({
		move: "attack",
		otherAlive: true,
		yards: pairYards(),
		hitRoll: Math.random() * 100,
		critRoll: Math.random() * 100,
		pdifRoll: Math.random()
	});
	if (strike.whiff === "range" || strike.whiff === "dead") return;
	if (!strike.hit) {
		useGame.getState().pushLog(`The charmed ${HARE.name} misses the other ${HARE.name}.`, "miss");
		queueCharmAct("attack", "Miss");
		return;
	}
	strikeOther(strike.damage);
	if (strike.tpGain > 0) addCharmTp(strike.tpGain);
	useGame.getState().pushLog(`The charmed ${HARE.name} hits the other ${HARE.name} for ${strike.damage} points of damage.`, "hit");
	queueCharmAct("attack", strike.crit ? `${strike.damage}!` : String(strike.damage));
	publishPets();
}
function masterToPet() {
	if (jug) return Math.hypot(playerStand.x - jugAt.x, playerStand.z - jugAt.z);
	if (charm?.who === "kin") return Math.hypot(playerStand.x - kinAt.x, playerStand.z - kinAt.z);
	if (charm) return yardDistance;
	return null;
}
/** The quarry drops the player's hate and the next Charm is 10 more likely. */
function primeTame() {
	tamePrimed = true;
	if (useGame.getState().quarry === "kin") {
		const had = dropKinHateRow("player");
		const empty = !kinHateRows.some((row) => row.ce > 0 || row.ve > 0);
		if (had && empty) useGame.getState().pushLog(`The ${HARE.name} loses interest.`, "info");
		useGame.setState({
			engaged: false,
			...kinHateState()
		});
		return;
	}
	const had = dropHateRow("player");
	if (!anyHate()) pulled = false;
	if (had && !anyHate()) useGame.getState().pushLog(`The ${HARE.name} loses interest.`, "info");
	useGame.setState({
		engaged: false,
		...hateNow()
	});
}
function primeTrustTame(foeId) {
	trustTamePrimed = true;
	const id = "lhu-mhakaracca";
	const trust = liveTrusts[id];
	if (trust) trust.engaged = false;
	const state = useGame.getState();
	if (foeId && foeId !== "hare" && foeId !== "kin") {
		const rows = packHate.get(foeId) ?? [];
		const had = rows.some((row) => row.id === id && ((row.ce ?? 0) > 0 || (row.ve ?? 0) > 0));
		const next = rows.filter((row) => row.id !== id);
		if (next.length) packHate.set(foeId, next);
		else {
			packHate.delete(foeId);
			const body = livePack().find((row) => row.id === foeId);
			if (body && body.mode === "chase") {
				body.mode = "roam";
				body.scent = false;
			}
		}
		if (had && !(packHate.get(foeId)?.length)) state.pushLog(`The ${HARE.name} loses interest.`, "info");
		state.pushLog("Lhu Mhakaracca's Tame lands. The next Charm is 10 more likely.", "info");
		useGame.setState({
			trustVitals: trustVitalsNow(),
			...packHateView(foeId)
		});
		return;
	}
	const kin = foeId === "kin" || (!foeId && state.quarry === "kin");
	if (kin) {
		const had = dropKinHateRow(id);
		const empty = !kinHateRows.some((row) => row.ce > 0 || row.ve > 0);
		if (had && empty) state.pushLog(`The ${HARE.name} loses interest.`, "info");
		useGame.setState({ ...kinHateState() });
	} else {
		const had = dropHateRow(id);
		if (had && !anyHate()) state.pushLog(`The ${HARE.name} loses interest.`, "info");
		useGame.setState({ ...hateNow() });
	}
	state.pushLog("Lhu Mhakaracca's Tame lands. The next Charm is 10 more likely.", "info");
	useGame.setState({ trustVitals: trustVitalsNow() });
}
function keepCharm(seconds, owner = null, who = null) {
	if (charm || packCharm) return false;
	if (owner === "lhu-mhakaracca") {
		if (trustJug()) return false;
	} else if (jug || wyvern || avatar || automaton) return false;
	const body = who === "kin" || who === "hare" ? who : useGame.getState().quarry === "kin" ? "kin" : "hare";
	if ((body === "kin" ? liveKinHp : liveHareHp) <= 0) return false;
	charmOwner = owner;
	charm = {
		left: seconds,
		stance: "heel",
		familiar: false,
		sicQueued: false,
		who: body,
		owner: owner ?? null,
		swing: HARE.delay / 60,
		charges: owner === "lhu-mhakaracca" ? 3 : undefined,
		chargeAcc: 0
	};
	wildSwing = HARE.delay / 60;
	wildAct = null;
	wildEngaged = false;
	const state = useGame.getState();
	if (owner === "lhu-mhakaracca") {
		const trust = liveTrusts[owner];
		if (trust) trust.engaged = false;
		state.pushLog(`Lhu Mhakaracca charms the ${HARE.name} for ${formatCharm(seconds)}.`, "info");
		useGame.setState({ trustVitals: trustVitalsNow() });
	} else {
		state.pushLog(`Duration is floor(1.25 × CHR ${state.sheet.chr} + 150) at an even level. No Charm+ is equipped. The tested chance is capped at 95 and is not a printed cell.`, "info");
		state.pushLog(`The charmed ${HARE.name} comes to you.`, "info");
		if (body === "hare") useGame.setState({
			engaged: false,
			targeted: false,
			hareAction: null
		});
		else useGame.setState({
			engaged: false,
			targeted: false
		});
	}
	publishPets();
	return true;
}
function masterCharmYards(who, owner) {
	if (owner === "lhu-mhakaracca") {
		const place = trustPlaces[owner];
		if (!place || place.x == null) return 999;
		const at = who === "kin" ? kinAt : hareAt;
		return Math.hypot(place.x - at.x, place.z - at.z);
	}
	return who === "kin" ? kinYards : yardDistance;
}
/**
* Charm ended. Inside 30 yalms the quarry attacks. Past that it does not.
* A dead quarry, or a knocked-out master, does not get a fresh claim.
* Lhu's charm measures 30 yalms from her, not from the player.
*/
function releaseCharm(line) {
	if (!charm) return;
	const who = charm.who;
	const owner = charmOwner;
	const dead = who === "kin" ? liveKinHp <= 0 : liveHareHp <= 0;
	const trust = owner === "lhu-mhakaracca" ? liveTrusts[owner] : null;
	const masterDown = owner === "lhu-mhakaracca" ? !trust || trust.ko || !useGame.getState().party.summoned.includes(owner) : useGame.getState().ko;
	const yards = masterCharmYards(who, owner);
	charm = null;
	charmOwner = null;
	charmAct = null;
	wildAct = null;
	wildEngaged = false;
	if (rewardRegen?.on === "charm") rewardRegen = null;
	publishPets();
	if (line) useGame.getState().pushLog(line, "info");
	dropHateRow("charm");
	if (owner === "lhu-mhakaracca") {
		if (dead || masterDown) return;
		if (yards > HATE_NEAR_YARDS) {
			if (who === "kin") {
				kinHateRows = [];
				useGame.setState(kinHateState());
			} else {
				hateRows = [];
				syncLiveHate();
				pulled = false;
				useGame.setState({ ...hateNow() });
			}
			useGame.getState().pushLog(`The ${HARE.name} is past 30 yalms, so it does not attack.`, "info");
			return;
		}
		if (who === "kin") {
			if (!kinHateRows.some((row) => (row.ce ?? 0) > 0 || (row.ve ?? 0) > 0)) creditKinHate(0, 0, true, owner, false);
			else useGame.getState().pushLog(`The ${HARE.name} attacks.`, "info");
			return;
		}
		if (!anyHate()) creditHate(0, 0, true, owner, false);
		else useGame.getState().pushLog(`The ${HARE.name} attacks.`, "info");
		return;
	}
	if (who === "kin") return;
	if (dead || masterDown) return;
	if (yardDistance > HATE_NEAR_YARDS) {
		hateRows = [];
		syncLiveHate();
		pulled = false;
		useGame.setState({ ...hateNow() });
		useGame.getState().pushLog(`The ${HARE.name} is past 30 yalms, so it does not attack.`, "info");
		return;
	}
	if (!anyHate()) creditHate(0, 0, true);
	else useGame.getState().pushLog(`The ${HARE.name} attacks.`, "info");
}
function noteCharmAimFrom(foeId) {
	if (foeId === "kin") charmAim = { x: kinAt.x, z: kinAt.z };
	else if (!foeId || foeId === "hare") charmAim = { x: hareAt.x, z: hareAt.z };
	else {
		const body = livePack().find((row) => row.id === foeId);
		if (body) charmAim = { x: body.x, z: body.z };
	}
}
function keepPackCharm(id, seconds, owner) {
	if (charm || packCharm) return false;
	if (owner === "lhu-mhakaracca" && trustJug()) return false;
	const body = livePack().find((row) => row.id === id);
	if (!body || body.hp <= 0 || body.mode === "dead" || body.mode === "leash") return false;
	body.mode = "roam";
	body.scent = false;
	body.lag = 0;
	packCharm = {
		id,
		left: seconds,
		owner,
		stance: "heel",
		familiar: false,
		sicQueued: false,
		charges: 3,
		chargeAcc: 0
	};
	const trust = liveTrusts[owner];
	if (trust) trust.engaged = false;
	useGame.getState().pushLog(`Lhu Mhakaracca charms the ${HARE.name} for ${formatCharm(seconds)}.`, "info");
	useGame.setState({ trustVitals: trustVitalsNow() });
	publishPets();
	return true;
}
function releasePackCharm(line) {
	if (!packCharm) return;
	const id = packCharm.id;
	const owner = packCharm.owner;
	const body = livePack().find((row) => row.id === id);
	const place = trustPlaces[owner];
	const yards = body && place && place.x != null ? Math.hypot(place.x - body.x, place.z - body.z) : 999;
	const dead = !body || body.hp <= 0 || body.mode === "dead";
	const trust = liveTrusts[owner];
	const masterDown = !trust || trust.ko || !useGame.getState().party.summoned.includes(owner);
	packCharm = null;
	publishPets();
	if (line) useGame.getState().pushLog(line, "info");
	if (dead || masterDown || !body) {
		packHate.delete(id);
		return;
	}
	if (yards > HATE_NEAR_YARDS) {
		packHate.delete(id);
		if (body.mode === "chase") {
			body.mode = "roam";
			body.scent = false;
		}
		useGame.getState().pushLog(`The ${HARE.name} is past 30 yalms, so it does not attack.`, "info");
		return;
	}
	if (body.mode !== "chase") pullPack(livePack(), id, 75);
	if (!packHateTotal(id)) creditPackHate(id, 0, 0, true, owner, false);
	else useGame.getState().pushLog(`The ${HARE.name} attacks.`, "info");
}
function breakLhuCharm(line) {
	if (charmOwner === "lhu-mhakaracca") releaseCharm(line);
	if (packCharm && packCharm.owner === "lhu-mhakaracca") releasePackCharm(line);
}
function tickPackCharm(dt) {
	if (!packCharm) return;
	const body = livePack().find((row) => row.id === packCharm.id);
	const trust = liveTrusts["lhu-mhakaracca"];
	const state = useGame.getState();
	if (!body || body.hp <= 0 || body.mode === "dead" || !trust || trust.ko || !state.party.summoned.includes("lhu-mhakaracca")) {
		releasePackCharm("The charm breaks.");
		return;
	}
	if ((packCharm.charges ?? 0) < 3) {
		packCharm.chargeAcc = (packCharm.chargeAcc ?? 0) + dt;
		while ((packCharm.charges ?? 0) < 3 && packCharm.chargeAcc >= 30) {
			packCharm.chargeAcc -= 30;
			packCharm.charges = (packCharm.charges ?? 0) + 1;
		}
	}
	packCharm.left -= dt;
	if (packCharm.left <= 0) releasePackCharm("Charm wears off.");
}
function creditCharmHate(foeId, result) {
	if (!result?.hate) return;
	const ce = result.hate.ce ?? 0;
	const ve = result.hate.ve ?? 0;
	const claims = result.claims === true;
	const quiet = result.quietClaim === true;
	const id = "lhu-mhakaracca";
	if (!foeId || foeId === "hare") creditHate(ce, ve, claims, id, quiet);
	else if (foeId === "kin") creditKinHate(ce, ve, claims, id, quiet);
	else creditPackHate(foeId, ce, ve, claims, id, quiet);
}
/** Living actor on the second rarab's list, other than the charmed body. That claim owns the swing. */
function kinHateBeatsPet() {
	const face = topHate(kinHateRows);
	if (!face || face.id === "charm" || face.ce <= 0 && face.ve <= 0) return false;
	if (face.id === "player") return !useGame.getState().ko;
	if (face.id === "avatar") return avatar != null && (avatar.max <= 0 || avatar.hp > 0);
	if (face.id === "wyvern") return wyvern != null && wyvern.hp > 0;
	if (face.id === "jug") return jug != null && jug.hp > 0;
	const trust = liveTrusts[face.id];
	return !!trust && !trust.ko;
}
function tickWildOnPet(dt) {
	if (!charm || !wildEngaged) return;
	const petIsKin = charm.who === "kin";
	if (!petIsKin && kinHateBeatsPet()) return;
	if ((petIsKin ? liveHareHp : liveKinHp) <= 0 || (petIsKin ? liveKinHp : liveHareHp) <= 0) return;
	if (pairYards() > HARE_VS_HARE) return;
	wildSwing -= dt;
	if (wildSwing > 0) return;
	wildSwing = HARE.delay / 60;
	if (wildAct) return;
	const strike = rarabOnRarab({
		move: "attack",
		otherAlive: true,
		yards: pairYards(),
		hitRoll: Math.random() * 100,
		critRoll: Math.random() * 100,
		pdifRoll: Math.random()
	});
	if (strike.whiff === "range" || strike.whiff === "dead") return;
	if (!strike.hit) {
		useGame.getState().pushLog(`The ${HARE.name} misses the charmed ${HARE.name}.`, "miss");
		wildAct = { text: "Miss" };
		return;
	}
	if (petIsKin) chipKin(strike.damage);
	else {
		chipHare(strike.damage);
		useGame.setState({
			hareHp: liveHareHp,
			...hateNow()
		});
	}
	if (!charm) return;
	useGame.getState().pushLog(`The ${HARE.name} hits the charmed ${HARE.name} for ${strike.damage} points of damage.`, "hit");
	wildAct = { text: strike.crit ? `${strike.damage}!` : String(strike.damage) };
	publishPets();
}
function tickCharm(dt) {
	if (!charm) return;
	const state = useGame.getState();
	const petHp = charm.who === "kin" ? liveKinHp : liveHareHp;
	const hers = charmOwner === "lhu-mhakaracca";
	const trust = hers ? liveTrusts["lhu-mhakaracca"] : null;
	if (hers) {
		if (petHp <= 0 || !state.party.summoned.includes("lhu-mhakaracca") || !trust || trust.ko) {
			releaseCharm("The charm breaks.");
			return;
		}
		if ((charm.charges ?? 0) < 3) {
			charm.chargeAcc = (charm.chargeAcc ?? 0) + dt;
			while ((charm.charges ?? 0) < 3 && charm.chargeAcc >= 30) {
				charm.chargeAcc -= 30;
				charm.charges = (charm.charges ?? 0) + 1;
			}
		}
	} else if (state.ko || petHp <= 0) {
		releaseCharm("The charm breaks.");
		return;
	} else if (state.mainJob !== "BST" && state.subJob !== "BST") {
		releaseCharm("Charm breaks.");
		return;
	}
	charm.left -= dt;
	if (charm.left <= 0) {
		releaseCharm("Charm wears off.");
		return;
	}
	tickWildOnPet(dt);
	if (!charm) return;
	if (charm.sicQueued && charmTpNow() >= 1e3) {
		fireCharmSic(sicMove(Math.floor(Math.random() * 4)));
		return;
	}
	if (charm.stance === "fight") {
		charm.swing -= dt;
		if (charm.swing <= 0) {
			charm.swing = HARE.delay / 60;
			landCharmAuto();
		}
	}
}
var avatar = null;
var avatarAt = {
	x: 0,
	z: 0,
	melee: false
};
export function peekAvatar() {
	return avatar ?? trustAvatarPet();
}
export function peekSparePets() {
	const rows = [];
	const spareWyvern = trustWyvern();
	if (wyvern && spareWyvern && spareWyvern !== wyvern) rows.push({ id: "wyvern:shikaree-z", type: "wyvern", pet: spareWyvern });
	const spareJug = trustJug();
	if (jug && spareJug && spareJug !== jug) rows.push({ id: "jug:lhu-mhakaracca", type: "jug", pet: spareJug });
	const spareAvatar = trustAvatarPet();
	if (avatar && spareAvatar && spareAvatar !== avatar) rows.push({ id: "avatar:karaha-baruha", type: "avatar", pet: spareAvatar });
	const spareAuto = trustAuto();
	if (automaton && spareAuto && spareAuto !== automaton) rows.push({ id: "automaton:nashmeira", type: "automaton", pet: spareAuto });
	return rows;
}
var spareAt = {};
export function noteSparePlace(id, x, z, melee) {
	spareAt[id] = { x, z, melee };
}
function actorPlace(kind, own) {
	const id = trustPetOwner === "shikaree-z" && kind === "wyvern" ? "wyvern:shikaree-z" : trustPetOwner === "lhu-mhakaracca" && kind === "jug" ? "jug:lhu-mhakaracca" : trustPetOwner === "nashmeira" && kind === "automaton" ? "automaton:nashmeira" : trustPetOwner === "karaha-baruha" && kind === "avatar" ? "avatar:karaha-baruha" : null;
	return id && spareAt[id] ? spareAt[id] : own;
}
export function noteAvatarPlace(x, z, melee) {
	avatarAt = {
		x,
		z,
		melee
	};
}
function smnLevelNow() {
	const state = useGame.getState();
	if (state.mainJob === "SMN") return 75;
	if (state.subJob === "SMN") return subjobLevel(75);
	return 0;
}
function summonAvatar(id) {
	const spec = summonById(id);
	const state = useGame.getState();
	if (!spec) return;
	if (wyvern || avatar || jug || charm || packCharm || automaton) {
		state.pushLog("You already have a pet.", "miss");
		return;
	}
	if (spec.astralGate && !liveBuffs.some((buff) => buff.name === "Astral Flow")) {
		state.pushLog(`${spec.name} can be summoned only during Astral Flow.`, "miss");
		return;
	}
	if (spec.family === "burst" && state.hareHp <= 0) {
		state.pushLog("Atomos needs a foe.", "miss");
		return;
	}
	const sheet = avatarSheet(spec.id, smnLevelNow());
	const burst = spec.family === "burst";
	const release = spec.id === "alexander" || spec.id === "odin";
	const oneshot = burst || release;
	avatar = {
		id: spec.id,
		name: spec.name,
		element: spec.element,
		spirit: spec.family === "spirit",
		astral: spec.astralGate,
		assault: false,
		heel: false,
		instinctNoted: false,
		perp: oneshot ? 0 : perpetuation(spec.id, smnLevelNow()),
		perpAcc: 0,
		swing: 1.2,
		anim: oneshot ? "pact" : "idle",
		animLeft: oneshot ? 1.15 : 0,
		pact: burst ? "Deconstruction" : spec.id === "alexander" ? "Perfect Defense" : spec.id === "odin" ? "Zantetsuken" : null,
		show: 0,
		pactCursor: 0,
		flowShown: false,
		hp: oneshot ? 0 : sheet?.hp ?? 0,
		max: oneshot ? 0 : sheet?.hp ?? 0,
		tp: 0,
		regen: oneshot ? 0 : sheet?.regen ?? 0,
		regenAcc: 0,
		oneshot
	};
	if (burst) {
		state.pushLog("Atomos answers.", "info");
		state.pushLog("Deconstruction. No beneficial effect to absorb.", "miss");
	} else if (spec.id === "alexander") {
		const seconds = perfectDefenseSeconds(state.sheet.summoning ?? 0);
		const jobs = sheet ? `${sheet.jobs}. ` : "";
		liveBuffs = liveBuffs.filter((buff) => buff.name !== "Perfect Defense" && buff.name !== "Astral Flow");
		liveBuffs = [...liveBuffs, {
			name: "Perfect Defense",
			left: seconds
		}];
		useGame.setState({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
		state.pushLog(`Alexander answers. ${jobs}No perpetuation.`, "info");
		state.pushLog(`Alexander uses Perfect Defense for ${seconds} seconds. The page does not print the damage cut or the resist rate, so neither is applied.`, "info");
		state.pushLog("Astral Flow wears off.", "info");
		shareReleaseRecast("Alexander", "Perfect Defense");
	} else if (spec.id === "odin") {
		const jobs = sheet ? `${sheet.jobs}. ` : "";
		liveBuffs = liveBuffs.filter((buff) => buff.name !== "Astral Flow");
		useGame.setState({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
		state.pushLog(`Odin answers. ${jobs}No perpetuation.`, "info");
		if (state.hareHp > 0 && !foeIsKin()) {
			state.pushLog("Zantetsuken.", "hit");
			chipHare(liveHareHp);
		} else if (foeIsKin() && liveKinHp > 0) {
			state.pushLog("Zantetsuken.", "hit");
			chipKin(liveKinHp);
		} else state.pushLog("Zantetsuken. No foe.", "miss");
		state.pushLog("Astral Flow wears off.", "info");
		shareReleaseRecast("Odin", "Zantetsuken");
	} else {
		const sheetNote = sheet ? `${sheet.jobs}. ` : "";
		state.pushLog(spec.astralGate ? `${spec.name} answers. ${sheetNote}No perpetuation.` : `${spec.name} answers. ${sheetNote}${avatar.perp} MP every 3 seconds.`, "info");
	}
	publishPets();
}
/** The summon spell and the pact button share one timer. Copy whatever is left on the spell. */
function shareReleaseRecast(spellName, pactName) {
	const left = liveRecasts[spellName] ?? 0;
	if (left > 0) liveRecasts[pactRecastId(pactName)] = left;
	useGame.setState({ recasts: { ...liveRecasts } });
}
/**
* Zantetsuken and Perfect Defense are the summon, not a command on a pet that stays.
* Astral Flow must be up, and no other pet can be out. The button spends every MP
* the way the spell does (Manafont pays nothing) and does not start Blood Pact recast.
*/
function callAstralRelease(name) {
	const pact = pactByName(name);
	if (!pact) return {
		ok: false,
		text: `${name} is not learned.`
	};
	const state = useGame.getState();
	const level = smnLevelNow();
	if (pact.level > level) return {
		ok: false,
		text: `${name} is not learned.`
	};
	if (state.mainJob !== "SMN") return {
		ok: false,
		text: `${name} requires Summoner as the main job.`
	};
	if (!liveBuffs.some((buff) => buff.name === "Astral Flow")) return {
		ok: false,
		text: `${name} needs Astral Flow.`
	};
	if (wyvern || avatar || jug || charm || packCharm || automaton) return {
		ok: false,
		text: "You already have a pet."
	};
	const summon = name === "Zantetsuken" ? "odin" : "alexander";
	const spellName = name === "Zantetsuken" ? "Odin" : "Alexander";
	const base = spellByName(spellName)?.recast ?? 0;
	if (base <= 0) return {
		ok: false,
		text: `${spellName} has no recast.`
	};
	if ((liveRecasts[spellName] ?? 0) > 0 || (liveRecasts[pactRecastId(name)] ?? 0) > 0) return {
		ok: false,
		text: `${spellName} is not ready.`
	};
	const manafont = liveBuffs.some((buff) => buff.name === "Manafont");
	if (!manafont && state.mp < pactMp(pact, level)) return {
		ok: false,
		text: `Not enough MP for ${name}.`
	};
	const cost = manafont ? 0 : state.mp;
	const chainspell = liveBuffs.some((buff) => buff.name === "Chainspell");
	const composure = liveBuffs.some((buff) => buff.name === "Composure");
	const recast = chainspell ? 0 : composureRecast(fastCastRecast(hastedRecast(base, hasteMagic(liveBuffs)), state.sheet.fastCast), composure);
	if (recast > 0) {
		liveRecasts[spellName] = recast;
		liveRecasts[pactRecastId(name)] = recast;
	}
	useGame.setState({
		mp: state.mp - cost,
		recasts: { ...liveRecasts }
	});
	summonAvatar(summon);
	return { ok: true };
}
function dismissAvatar(line) {
	const name = avatar?.name ?? "The avatar";
	const had = avatar != null;
	const pet = hateRows.find((row) => row.id === "avatar");
	const petCe = pet?.ce ?? 0;
	const petVe = pet?.ve ?? 0;
	avatar = null;
	const abandoned = had ? dropHateRow("avatar") : false;
	if (line && had) useGame.getState().pushLog(line, "info");
	if (petCe > 0 || petVe > 0) {
		const you = hateRows.find((row) => row.id === "player");
		const face = topHate(hateRows);
		const kept = you && (you.ce > 0 || you.ve > 0) ? ` Yours remains. ${you.ce} cumulative, ${you.ve} volatile.` : "";
		const turns = face?.id === "player" ? ` The ${HARE.name} turns on you.` : "";
		useGame.getState().pushLog(`${name}'s hate does not move.${kept}${turns}`, "info");
	}
	if (abandoned && !anyHate()) useGame.getState().pushLog(`The ${HARE.name} loses interest.`, "info");
	if (had) {
		publishPets();
		useGame.setState({ ...hateNow() });
	}
}
function readyAvatarAct(kind, seconds, pact, log) {
	if (!avatar) return;
	avatar.anim = kind;
	avatar.animLeft = seconds;
	avatar.pact = pact;
	if (log) useGame.getState().pushLog(log, "info");
}
function shroudMab(base) {
	return base + (liveBuffs.find((buff) => buff.name === "Dream Shroud")?.power ?? 0) + (liveBuffs.find((buff) => buff.name === "Magic Atk. Boost")?.power ?? 0);
}
/** Raise from a blood pact. A living target is no effect. Experience on the result is discarded. */
function ariseFromPact(spell) {
	const revived = resolveRaise(spell, {
		ko: useGame.getState().ko,
		level: 75,
		maxHp: hpCap(),
		weakness: weaknessForRaise()
	});
	if (!revived) return null;
	liveWeakness = revived.weakness;
	clearFallenWeak();
	livePending = null;
	dropHateRow("player");
	useGame.setState({
		ko: false,
		hp: revived.hp,
		weakness: liveWeakness,
		pendingRaise: null,
		...hateNow()
	});
	return revived.hp;
}
function applyPactWard(kind, seconds, level, summoning) {
	if (!kind) return;
	const left = Math.max(1, seconds);
	const state = useGame.getState();
	if (kind === "favor") {
		const dead = state.ko;
		const prev = liveBuffs.find((buff) => isReraiseSpell(buff.name));
		liveBuffs = liveBuffs.filter((buff) => !isReraiseSpell(buff.name));
		const wore = prev && prev.name !== "Reraise III" ? ` ${prev.name} wears off.` : "";
		if (dead) {
			const hp = ariseFromPact("Raise III");
			liveBuffs = [...liveBuffs, {
				name: "Reraise III",
				left: RERAISE_SECONDS
			}];
			if (hp != null) state.pushLog(`Altana's Favor. Arise. Raise III restores ${hp} HP.`, "info");
			state.pushLog(`Reraise III. One hour.${wore}`, "info");
		} else {
			liveBuffs = [...liveBuffs, {
				name: "Reraise III",
				left: RERAISE_SECONDS,
				hold: true
			}];
			state.pushLog(`Altana's Favor. Reraise III. It has no timer while you are alive.${wore}`, "info");
		}
	} else if (kind === "raise2") {
		const hp = ariseFromPact("Raise II");
		state.pushLog(hp == null ? "Raise II. No effect." : `Raise II restores ${hp} HP.`, hp == null ? "miss" : "info");
	} else if (kind === "reraise2") {
		const prev = liveBuffs.find((buff) => isReraiseSpell(buff.name));
		liveBuffs = liveBuffs.filter((buff) => !isReraiseSpell(buff.name));
		liveBuffs = [...liveBuffs, {
			name: "Reraise II",
			left
		}];
		const wore = prev && prev.name !== "Reraise II" ? ` ${prev.name} wears off.` : "";
		state.pushLog(`Reraise II.${wore} ${left} seconds.`, "info");
	} else if (kind === "glitter") {
		const stat = GLITTER_STATS[Math.floor(Math.random() * GLITTER_STATS.length)] ?? "STR";
		const power = glitteringRuby(level);
		liveBuffs = liveBuffs.filter((buff) => buff.name !== "Glittering Ruby");
		liveBuffs = [...liveBuffs, {
			name: "Glittering Ruby",
			left,
			power,
			attr: stat
		}];
		state.pushLog(`Glittering Ruby. ${stat} +${power} for ${left} seconds.`, "info");
	} else if (kind === "haste") {
		const woreRefuel = liveBuffs.some((buff) => buff.name === "Haste" && buff.hasteFrom === "refuel");
		liveBuffs = liveBuffs.filter((buff) => buff.name !== "Haste");
		liveBuffs = [...liveBuffs, {
			name: "Haste",
			left,
			power: 153,
			hasteFrom: "hastega"
		}];
		state.pushLog(woreRefuel ? `Hastega. Magic haste is 153/1024. Refueling wears off.` : `Hastega. Magic haste is 153/1024.`, "info");
	} else if (kind === "stoneskin") {
		const skin = earthenWardSkin(level);
		liveBuffs = liveBuffs.filter((buff) => buff.name !== "Stoneskin");
		liveBuffs = [...liveBuffs, {
			name: "Stoneskin",
			left,
			skin,
			skinFrom: "spell"
		}];
		state.pushLog(`Earthen Ward. Stoneskin absorbs ${skin} damage for ${left} seconds.`, "info");
	} else if (kind === "phalanx") {
		liveBuffs = liveBuffs.filter((buff) => buff.name !== "Phalanx");
		liveBuffs = [...liveBuffs, {
			name: "Phalanx",
			left,
			power: 13
		}];
		state.pushLog(`Noctoshield. Phalanx cuts 13 from each hit.`, "info");
	} else if (kind === "ice" || kind === "shock") {
		const spike = kind === "ice" ? "Ice Spikes" : "Shock Spikes";
		const base = spikeBase(spike, avatarMnd(level, avatar?.id));
		liveBuffs = liveBuffs.filter((buff) => buff.name !== spike);
		liveBuffs = [...liveBuffs, {
			name: spike,
			left,
			spikeBase: base
		}];
		state.pushLog(`${spike}. A hit returns ${base} damage.`, "info");
	} else if (kind === "howl") {
		const power = crimsonHowlAttack(level);
		liveBuffs = liveBuffs.filter((buff) => buff.name !== "Crimson Howl");
		liveBuffs = [...liveBuffs, {
			name: "Crimson Howl",
			left,
			power
		}];
		state.pushLog(`Crimson Howl. Attack +${power}/256.`, "info");
	} else if (kind === "thunder") {
		const base = enspellTwoBase(summoning);
		liveBuffs = liveBuffs.filter((buff) => !buff.enspell && buff.name !== "Auspice");
		liveBuffs = [...liveBuffs, {
			name: "Enthunder",
			left,
			enspell: {
				tier: 1,
				element: "thunder",
				base,
				rounds: 0
			}
		}];
		state.pushLog(`Rolling Thunder. Enthunder. Added damage starts at ${base}.`, "info");
	} else if (kind === "enaero") {
		const base = enspellTwoBase(summoning);
		liveBuffs = liveBuffs.filter((buff) => !buff.enspell && buff.name !== "Auspice");
		liveBuffs = [...liveBuffs, {
			name: "Enaero",
			left,
			enspell: {
				tier: 1,
				element: "wind",
				base,
				rounds: 0
			}
		}];
		state.pushLog(`Katabatic Blades. Enaero. Added damage starts at ${base}.`, "info");
	} else if (kind === "veil") {
		const charges = aquaveilCharges(summoning);
		liveBuffs = liveBuffs.filter((buff) => buff.name !== "Aquaveil");
		liveBuffs = [...liveBuffs, {
			name: "Aquaveil",
			left,
			charges
		}];
		state.pushLog(`Chinook. Aquaveil. ${charges} ${charges === 1 ? "charge" : "charges"}. A physical hit can break the cast. Each charge stops one of those hits. Moving still breaks a cast.`, "info");
	} else if (kind === "defense") {
		const power = pactWardPower(kind);
		liveBuffs = liveBuffs.filter((buff) => buff.name !== "Shining Ruby");
		liveBuffs = [...liveBuffs, {
			name: "Shining Ruby",
			left,
			power
		}];
		state.pushLog(`Shining Ruby. Defense +${power}/256. Magic damage taken −10/256.`, "info");
	} else if (kind === "blink") {
		const woreMantle = liveBuffs.some((buff) => buff.name === "Blink" && buff.blinkFrom === "mantle");
		liveBuffs = liveBuffs.filter((buff) => buff.name !== "Blink");
		liveBuffs = [...liveBuffs, {
			name: "Blink",
			left,
			charges: 4,
			blinkFrom: "aerial"
		}];
		state.pushLog(woreMantle ? `Aerial Armor. Blink. 4 shadows. Zephyr Mantle wears off.` : `Aerial Armor. Blink. 4 shadows.`, "info");
	} else if (kind === "growl") {
		const cut = eclipticGrowlCut(vanadielMoonIndex());
		const ruby = liveBuffs.find((buff) => buff.name === "Glittering Ruby");
		liveBuffs = liveBuffs.filter((buff) => buff.name !== "Ecliptic Growl");
		liveBuffs = [...liveBuffs, {
			name: "Ecliptic Growl",
			left,
			power: cut.body,
			mind: cut.mind,
			skip: ruby?.attr
		}];
		const held = ruby?.attr ? ` ${ruby.attr} is already glittering, so that one does not rise.` : "";
		state.pushLog(`Ecliptic Growl. STR, DEX, and VIT +${cut.body}. AGI, INT, MND, and CHR +${cut.mind}.${held}`, "info");
	} else if (kind === "shroud") {
		const cut = dreamShroudCut(vanadielTime().hour);
		liveBuffs = liveBuffs.filter((buff) => buff.name !== "Dream Shroud");
		liveBuffs = [...liveBuffs, {
			name: "Dream Shroud",
			left,
			power: cut.mab,
			mind: cut.mdb
		}];
		state.pushLog(`Dream Shroud. Magic attack +${cut.mab}. Magic defense +${cut.mdb}.`, "info");
	} else if (kind === "perfect") {
		const stay = perfectDefenseSeconds(summoning);
		liveBuffs = liveBuffs.filter((buff) => buff.name !== "Perfect Defense");
		liveBuffs = [...liveBuffs, {
			name: "Perfect Defense",
			left: stay
		}];
		state.pushLog(`Perfect Defense for ${stay} seconds. The page does not print the damage cut or the resist rate, so neither is applied.`, "info");
	}
	useGame.setState({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
}
var SPRING_CLEARS = /* @__PURE__ */ new Set([
	"Poison",
	"Paralysis",
	"Blindness",
	"Silence",
	"Petrification",
	"Disease",
	"Plague"
]);
function landPactRider(rider, level, seconds = 180, pactName = "") {
	if (!rider || !foeLiving()) return;
	const api = useGame.getState();
	const id = avatar?.id;
	const dMnd = avatarMnd(level, id) - HARE.mnd;
	const dInt = avatarInt(level, id) - HARE.int;
	if (rider === "poison") {
		const dot = poisonPotency(useGame.getState().sheet.summoning ?? 0, 1);
		liveEnfeebles = liveEnfeebles.filter((row) => !isPoisonSpell(row.name));
		liveEnfeebles = [...liveEnfeebles, {
			name: "Poison",
			left: poisonSeconds("Poison"),
			dot,
			acc: 0
		}];
		api.pushLog(`Poison. ${dot} HP slips every 3 seconds.`, "info");
	} else if (rider === "blind") {
		const down = blindPotency(dInt);
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Blind");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Blind",
			left: 180,
			accDown: down
		}];
		api.pushLog(`Blind lowers the ${HARE.name}'s accuracy by ${down}.`, "info");
	} else if (rider === "paralyze") {
		const chance = paralyzeChance(dMnd);
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Paralyze");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Paralyze",
			left: 120,
			power: chance
		}];
		api.pushLog(`Paralyze. ${chance}% chance to cancel an auto-attack or TP move.`, "info");
	} else if (rider === "slow") {
		const potency = slowPotency(dMnd);
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Slow");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Slow",
			left: 180,
			power: potency
		}];
		api.pushLog(`Slow. Auto-attack delay is multiplied by ${1024 + potency}/1024.`, "info");
	} else if (rider === "bind") {
		const left = pactBindSeconds(pactName) ?? 60;
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Bind");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Bind",
			left
		}];
		api.pushLog(pactName === "Rock Buster" ? `Bind. ${left} seconds.` : "Bind.", "info");
	} else if (rider === "gravity") {
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Gravity");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Gravity",
			left: 120,
			power: 26
		}];
		api.pushLog(`Weight. Movement is 74% of normal.`, "info");
	} else if (rider === "stun") {
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Stun");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Stun",
			left: 2
		}];
		api.pushLog(`Stun. The ${HARE.name} cannot act for 2 seconds.`, "info");
	} else if (rider === "sleepga") {
		const nightmare = pactName === "Nightmare";
		const left = pactName === "Sleepga" ? 90 : nightmare ? 90 : sleepSeconds("Sleepga");
		liveEnfeebles = liveEnfeebles.filter((row) => !isSleepSpell(row.name) && row.name !== "Lullaby" && row.name !== "Nightmare" && row.name !== "Yawn");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Sleepga",
			left,
			wide: true
		}];
		if (nightmare) {
			liveEnfeebles = [...liveEnfeebles, {
				name: "Nightmare",
				left,
				dot: 2,
				acc: 0
			}];
			api.pushLog(`Nightmare. Sleep for ${left} seconds. Bio slips 2 HP every 3 seconds.`, "info");
		} else api.pushLog(pactName === "Sleepga" ? `Sleepga. ${left} seconds.` : "Sleepga.", "info");
	} else if (rider === "lullaby") {
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Lullaby");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Lullaby",
			left: 35,
			wide: true
		}];
		api.pushLog(`Lullaby. 35 seconds.`, "info");
	} else if (rider === "silence") {
		const lunatic = pactName === "Lunatic Voice";
		const left = lunatic ? 90 : 120;
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Silence");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Silence",
			left,
			...lunatic ? { wide: true } : {}
		}];
		api.pushLog(pactName === "Eerie Eye" ? `Eerie Eye. Silence for 120 seconds. Amnesia's length is not printed, so it is not timed.` : lunatic ? `Lunatic Voice. Silence for 90 seconds.` : `Silence. The ${HARE.name} does not cast.`, "info");
	} else if (rider === "dispel") api.pushLog(pactName === "Sonic Buffet" ? "Dispel. No effect." : "Lunar Roar. No effect.", "miss");
	else if (rider === "elegy") {
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Elegy");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Elegy",
			left: seconds,
			power: 512
		}];
		api.pushLog(`Elegy. Attack speed −512/1024.`, "info");
	} else if (rider === "lunar") {
		const cut = lunarCryCut(vanadielMoonIndex());
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Lunar Cry" && row.name !== "Evasion Down");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Lunar Cry",
			left: seconds,
			accDown: cut.acc,
			evaDown: cut.eva
		}];
		api.pushLog(`Lunar Cry. Accuracy −${cut.acc}. Evasion −${cut.eva}.`, "info");
	} else if (rider === "terror") api.pushLog("Ultimate Terror. The page does not print the attribute cuts, so none are applied.", "info");
	useGame.setState(strikeKin ? { kinEnfeebles: liveEnfeebles.map((row) => ({ ...row })) } : { hareEnfeebles: liveEnfeebles.map((row) => ({ ...row })) });
}
function landCommandedPact(name, shortWard, levelOverride = null, hateOwner = "player", summoningOverride = null) {
	if (!avatar) return;
	const level = levelOverride ?? smnLevelNow();
	const summoning = summoningOverride ?? useGame.getState().sheet.summoning ?? 0;
	const pay = pactPayoff(name, level, summoning, HARE.vit, HARE.int, HARE.mnd, avatar.tp);
	readyAvatarAct("pact", name === "Zantetsuken" || pay.magical > 400 ? 1.8 : 1.35, name, `${avatar.name} readies ${name}.`);
	avatar.swing = avatarSwingSeconds();
	if (pactPresses(name)) {
		avatar.assault = true;
		avatar.heel = false;
		avatar.instinctNoted = true;
	}
	creditHate(1, 300, pactPresses(name), hateOwner);
	const hybrid = pay.physical > 0 && pay.magical > 0;
	let magic = pay.magical;
	if (name === "Level ? Holy") {
		const face = 1 + Math.floor(Math.random() * 6);
		const hits = levelHolyHits(HARE.level, face);
		if (!hits) magic = 0;
		useGame.getState().pushLog(hits ? `Level ? Holy. The die shows ${face}.` : `Level ? Holy. The die shows ${face}. No effect.`, hits ? "info" : "miss");
	}
	let dealt = 0;
	let connected = pay.physical <= 0;
	let physicalHit = false;
	if (pay.physical > 0 && foeLiving()) {
		const rate = hitRate(avatarAccuracy(level, avatar.id), targetEvasion(HARE.evasion, foeEnfeebleRows()), HARE.level - level);
		if (Math.random() * 100 >= rate) {
			if (hybrid) magic = 0;
			if (magic <= 0) useGame.getState().pushLog(`${avatar.name}'s ${name} misses the ${HARE.name}.`, "miss");
		} else {
			physicalHit = true;
			connected = true;
			const pdif = rollSwordPdif(avatarAttack(level, avatar.id) / Math.max(1, foeVitDefense(foeEnfeebleRows())), false, Math.random);
			dealt = Math.max(1, Math.floor(pay.physical * pdif));
		}
	}
	if (name === "Zantetsuken" && foeLiving()) {
		useGame.getState().pushLog("Zantetsuken.", "hit");
		if (foeIsKin()) chipKin(liveKinHp);
		else chipHare(liveHareHp);
	}
	const chainFrom = magic + dealt;
	const burstEl = pactBurstElement(name);
	const burstTarget = chainFoe();
	const burstName = burstEl && magic > 0 && foeLiving() ? magicBurstOf(burstEl, burstTarget) : null;
	if (burstName) magic = applyMagicBurst(magic, burstSteps(burstTarget), 0);
	const dmg = magic + dealt;
	if (dmg > 0 && foeLiving()) {
		connected = true;
		landFoeHit(dmg, burstName ? `${avatar.name}'s ${name} magic bursts ${burstName}. The ${HARE.name} takes ${dmg} points of damage.` : `${avatar.name}'s ${name} hits the ${HARE.name} for ${dmg} points of damage.`, 0, "avatar");
	}
	if (physicalHit) {
		const props = pactSkillchain(name);
		if (props.length) {
			const chain = offerWeaponSkill(props, chainFrom, "avatar", burstTarget);
			if (chain) {
				if (chain.damage > 0 && foeLiving()) landFoeHit(chain.damage, `${chain.name} skillchain. ${chain.damage} damage.`, 0, "avatar");
				else useGame.getState().pushLog(`${chain.name} skillchain. ${chain.damage} damage.`, "hit");
			} else {
				const noted = takeChainNote();
				if (noted?.held) useGame.getState().pushLog(`${noted.held} holds. It lands when the window opens.`, "info");
				else if (noted?.resonating?.length) useGame.getState().pushLog(`${noted.resonating.join(" / ")} resonates.`, "info");
			}
		}
		addPetTp("avatar", tpPerHit(240) * pactPhysicalHits(name));
	}
	if (pactSpendsAvatarTp(name)) {
		avatar.tp = 0;
		publishPets();
	}
	const wardSeconds = Math.max(1, Math.round((shortWard ? APOGEE_WARD : 1) * pactWardSeconds(name)));
	if (connected) {
		const park = foeIsKin() ? borrowKin() : null;
		try {
			landPactRider(pay.rider, level, wardSeconds, name);
		} finally {
			if (park) restoreKin(park);
		}
	}
	if (name === "Mewing Lullaby") {
		if (foeIsKin()) {
			liveKinTp = 0;
			useGame.setState({ kinTp: 0 });
		} else useGame.setState({ hareTp: 0 });
		useGame.getState().pushLog("TP is reset. The page does not print a partial cut.", "info");
	}
	if (pay.cure > 0) {
		if (trustPetOwner === "karaha-baruha") {
			const trust = liveTrusts["karaha-baruha"];
			const gained = trust ? Math.min(Math.max(0, trust.maxHp - trust.hp), pay.cure) : 0;
			if (trust && gained > 0) trust.hp += gained;
			useGame.getState().pushLog(gained > 0 ? `${avatar.name}'s ${name} restores ${gained} HP to Karaha-Baruha.` : `${avatar.name}'s ${name} has no effect.`, gained > 0 ? "info" : "miss");
			if (gained > 0) useGame.setState({ trustVitals: trustVitalsNow() });
		} else {
			const state = useGame.getState();
			const gained = Math.min(Math.max(0, hpCap() - state.hp), pay.cure);
			if (gained > 0) useGame.setState({ hp: state.hp + gained });
			state.pushLog(gained > 0 ? `${avatar.name}'s ${name} restores ${gained} HP.` : `${avatar.name}'s ${name} has no effect.`, gained > 0 ? "info" : "miss");
			if (gained > 0) {
				const cured = cureEnmity(75, gained);
				creditHate(cured.ce, cured.ve, false, "avatar");
				useGame.setState({ ...hateNow() });
			}
		}
	}
	if (name === "Spring Water") {
		const had = liveAilments.filter((row) => SPRING_CLEARS.has(row.name));
		if (had.length) {
			liveAilments = liveAilments.filter((row) => !SPRING_CLEARS.has(row.name));
			useGame.setState({ ailments: liveAilments.map((row) => ({ ...row })) });
			useGame.getState().pushLog(`Spring Water removes ${had.map((row) => row.name).join(", ")}.`, "info");
		}
	}
	applyPactWard(pay.ward, wardSeconds, level, summoning);
	if (pay.endsFlow) {
		liveBuffs = liveBuffs.filter((buff) => buff.name !== "Astral Flow");
		useGame.setState({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
		useGame.getState().pushLog("Astral Flow wears off.", "info");
	}
}
/** Spend MP and start the shared rage or ward timer. Apogee skips the timer and is consumed. */
function trySpendPact(name) {
	const pact = pactByName(name);
	if (!pact || !avatar) return {
		ok: false,
		text: "No avatar is out."
	};
	if (pact.merit) return {
		ok: false,
		text: `${name} is not unlocked.`
	};
	if (pact.avatar !== avatar.name) return {
		ok: false,
		text: `${avatar.name} does not know ${name}.`
	};
	const state = useGame.getState();
	const level = smnLevelNow();
	const main = state.mainJob === "SMN";
	if (pact.level > level) return {
		ok: false,
		text: `${name} is not learned.`
	};
	if (!main && (pact.access === "main" || pact.access === "master-sub")) return {
		ok: false,
		text: `${name} requires Summoner as the main job.`
	};
	if (pact.astral && !liveBuffs.some((buff) => buff.name === "Astral Flow")) return {
		ok: false,
		text: `${name} needs Astral Flow.`
	};
	if (pact.kind === "rage" && !foeLiving()) return {
		ok: false,
		text: `${name} needs a foe.`
	};
	const apogee = liveBuffs.some((buff) => buff.name === "Apogee");
	if (!apogee && (liveRecasts[pactRecastId(name)] ?? 0) > 0) return {
		ok: false,
		text: `${pact.kind === "ward" ? "Blood Pact: Ward" : "Blood Pact: Rage"} is not ready.`
	};
	const boon = !pact.astral && Math.random() < bloodBoon(level, main ? "main" : "sub");
	const cost = bloodPactCost(pactMp(pact, level), apogee, boon ? Math.floor(Math.random() * 4) : null);
	if (state.mp < cost) return {
		ok: false,
		text: `Not enough MP for ${name}.`
	};
	if (apogee) liveBuffs = liveBuffs.filter((buff) => buff.name !== "Apogee");
	if (!apogee) {
		for (const row of SMN_PACTS) if (!row.merit && row.kind === pact.kind) liveRecasts[pactRecastId(row.name)] = 60;
	}
	if (pact.astral) avatar.flowShown = true;
	useGame.setState({
		mp: state.mp - cost,
		buffs: liveBuffs.map((buff) => ({ ...buff }))
	});
	if (boon) state.pushLog(`Blood Boon cuts ${name} to ${cost} MP.`, "info");
	if (apogee) state.pushLog("Apogee is consumed.", "info");
	return {
		ok: true,
		short: apogee && pact.kind === "ward"
	};
}
function tickAvatar(dt) {
	const state = useGame.getState();
	const held = state.mainJob === "SMN" || state.subJob === "SMN";
	const trustKeeps = trustPetOwner === "karaha-baruha" && state.party.summoned.includes("karaha-baruha") && liveTrusts["karaha-baruha"] && !liveTrusts["karaha-baruha"].ko;
	if (!trustKeeps && (state.ko || !held)) {
		if (avatar) dismissAvatar("The avatar leaves.");
		return;
	}
	if (!avatar) return;
	if (avatar.oneshot) {
		avatar.assault = false;
		avatar.animLeft = Math.max(0, avatar.animLeft - dt);
		if (avatar.animLeft > 0) return;
		if (avatar.id === "atomos" && avatar.pact === "Deconstruction") {
			readyAvatarAct("pact", 1.15, "Chronoshift", null);
			useGame.getState().pushLog("Chronoshift. Nothing was absorbed, so there is no effect.", "miss");
			return;
		}
		dismissAvatar(avatar.id === "alexander" ? "Alexander returns." : avatar.id === "odin" ? "Odin returns." : "Atomos vanishes.");
		return;
	}
	if (avatar.astral) {
		const flowUp = trustKeeps ? (liveTrusts["karaha-baruha"]?.buffs ?? []).some((buff) => buff.name === "Astral Flow") : liveBuffs.some((buff) => buff.name === "Astral Flow");
		if (!flowUp) {
			dismissAvatar(`${avatar.name} returns.`);
			return;
		}
	}
	if (avatar.perp > 0) {
		avatar.perpAcc += dt;
		const ticks = Math.floor(avatar.perpAcc / 3);
		if (ticks > 0) {
			avatar.perpAcc -= ticks * 3;
			const cost = avatar.perp * ticks;
			if (trustPetOwner === "karaha-baruha") {
				const trust = liveTrusts["karaha-baruha"];
				if (!trust || trust.mp < cost) {
					dismissAvatar(`${avatar.name} leaves. There is not enough MP.`);
					return;
				}
				trust.mp -= cost;
				useGame.setState({ trustVitals: trustVitalsNow() });
			} else {
				const now = useGame.getState();
				if (now.mp < cost) {
					dismissAvatar(`${avatar.name} leaves. There is not enough MP.`);
					return;
				}
				useGame.setState({ mp: now.mp - cost });
			}
		}
	}
	if (avatar.regen > 0 && avatar.max > 0 && avatar.hp > 0 && avatar.hp < avatar.max) {
		avatar.regenAcc += dt;
		const ticks = Math.floor(avatar.regenAcc / 3);
		if (ticks > 0) {
			avatar.regenAcc -= ticks * 3;
			const gained = Math.min(avatar.max - avatar.hp, avatar.regen * ticks);
			if (gained > 0) {
				avatar.hp += gained;
				publishPets();
			}
		}
	} else avatar.regenAcc = 0;
	if (avatar.animLeft > 0) {
		avatar.animLeft = Math.max(0, avatar.animLeft - dt);
		if (avatar.animLeft === 0) {
			avatar.anim = "idle";
			avatar.pact = null;
		}
	}
	const foeUp = foeLiving();
	if (!foeUp) {
		if (!trustKeeps) {
			avatar.assault = false;
			avatar.heel = false;
			avatar.instinctNoted = false;
		}
	}
	if (trustKeeps && foeUp && !avatar.oneshot) avatar.assault = true;
	const flowUp = trustKeeps ? (liveTrusts["karaha-baruha"]?.buffs ?? []).some((buff) => buff.name === "Astral Flow") : liveBuffs.some((buff) => buff.name === "Astral Flow");
	if (!(foeUp && avatar.assault)) {
		if (!flowUp) avatar.flowShown = false;
		return;
	}
	if (!flowUp) avatar.flowShown = false;
	if (avatar.anim !== "idle") return;
	if (!trustKeeps && flowUp && !avatar.flowShown) {
		const name = summonShowPacts(avatar.name, smnLevelNow(), state.mainJob === "SMN", true)[0];
		if (name) {
			avatar.flowShown = true;
			const spent = trySpendPact(name);
			if (!spent.ok) state.pushLog(spent.text, "miss");
			else landCommandedPact(name, spent.short);
			return;
		}
	}
	if (avatar.swing > 0) {
		avatar.swing -= dt;
		return;
	}
	const level = trustKeeps ? 75 : smnLevelNow();
	if (avatar.spirit && (avatar.show + 1) % 4 === 0) {
		avatar.show += 1;
		avatar.swing = avatarSwingSeconds();
		const cast = spiritSpellDamage(avatar.element, level, HARE.int, HARE.mnd, avatar.id);
		readyAvatarAct("cast", 1.15, null, `${avatar.name} casts ${cast.name}.`);
		if (cast.damage > 0) landFoeHit(cast.damage, `${avatar.name}'s ${cast.name} hits the ${HARE.name} for ${cast.damage} points of damage.`, monsterTpGain(100), "avatar");
		return;
	}
	if (actorPlace("avatar", avatarAt).melee) {
		avatar.show += 1;
		avatar.swing = avatarSwingSeconds();
		readyAvatarAct("strike", .85, null, null);
		const rate = hitRate(avatarAccuracy(level, avatar.id), targetEvasion(HARE.evasion, foeEnfeebleRows()), HARE.level - level);
		if (Math.random() * 100 >= rate) state.pushLog(`${avatar.name} misses the ${HARE.name}.`, "miss");
		else {
			const pdif = rollSwordPdif(avatarAttack(level, avatar.id) / Math.max(1, foeVitDefense(foeEnfeebleRows())), false, Math.random);
			const dmg = Math.max(1, Math.floor(avatarMeleeBase(level, HARE.vit, avatar.id) * pdif));
			landFoeHit(dmg, `${avatar.name} hits the ${HARE.name} for ${dmg} points of damage.`, monsterTpGain(tpPerHit(240)), "avatar");
			addPetTp("avatar", tpPerHit(240));
		}
		return;
	}
	if (avatar.spirit) {
		avatar.show += 1;
		avatar.swing = avatarSwingSeconds();
		return;
	}
	avatar.swing = .4;
}
function peekPets() {
	const rows = [];
	if (wyvern) rows.push({
		id: "wyvern",
		name: "Wyvern",
		hp: Math.max(0, Math.ceil(wyvern.hp)),
		max: wyvern.max,
		tp: wyvern.tp,
		line: wyvern.kind === "defensive" ? "Defensive wyvern" : wyvern.kind === "hybrid" ? "Hybrid wyvern" : "Offensive wyvern"
	});
	if (jug) {
		const stance = jug.stance === "fight" ? "Fighting" : jug.stance === "heel" ? "Heeling" : "Staying";
		rows.push({
			id: "jug",
			name: "Courier Carrie",
			hp: Math.max(0, Math.ceil(jug.hp)),
			max: jug.max,
			tp: jug.tp,
			line: `${stance} · Crab · Ready ${jug.charges}`
		});
	}
	if (avatar) {
		const sheet = avatarSheet(avatar.id, smnLevelNow());
		const job = sheet ? `${sheet.jobs} · ` : "";
		rows.push({
			id: "avatar",
			name: avatar.name,
			hp: avatar.max > 0 ? Math.max(0, Math.ceil(avatar.hp)) : 0,
			max: avatar.max,
			tp: avatar.tp,
			line: avatar.id === "atomos" ? "Deconstruction, then Chronoshift" : avatar.id === "alexander" ? `${job}Perfect Defense, then he leaves` : avatar.id === "odin" ? `${job}Zantetsuken, then he leaves` : avatar.astral ? `${job}No perpetuation` : `${job}${avatar.perp} MP every 3 seconds`
		});
	}
	if (charm && (charm.who === "kin" ? liveKinHp > 0 : liveHareHp > 0)) {
		const stance = charm.stance === "fight" ? "Fighting" : charm.stance === "heel" ? "Heeling" : "Staying";
		const left = Math.max(0, Math.ceil(charm.left));
		const clock = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
		const hp = charm.who === "kin" ? liveKinHp : liveHareHp;
		const tp = charm.who === "kin" ? liveKinTp : useGame.getState().hareTp;
		const whose = charm.owner === "lhu-mhakaracca" ? "Lhu Mhakaracca · " : "";
		rows.push({
			id: "charm",
			name: HARE.name,
			hp: Math.max(0, Math.ceil(hp)),
			max: HARE.hpNatural,
			tp,
			line: `${whose}${stance} · Charmed · ${clock}${charm.sicQueued ? " · Sic" : ""}`
		});
	}
	if (packCharm) {
		const body = livePack().find((row) => row.id === packCharm.id);
		if (body && body.hp > 0 && body.mode !== "dead") {
			const stance = packCharm.stance === "fight" ? "Fighting" : packCharm.stance === "heel" ? "Heeling" : "Staying";
			const left = Math.max(0, Math.ceil(packCharm.left));
			const clock = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
			rows.push({
				id: "charm",
				name: HARE.name,
				hp: Math.max(0, Math.ceil(body.hp)),
				max: body.maxHp,
				tp: 0,
				line: `Lhu Mhakaracca · ${stance} · Charmed · ${clock}`
			});
		}
	}
	if (automaton) {
		const state = useGame.getState();
		const head = autoHead(state.autoHead)?.name.replace(" Head", "") ?? "Head";
		const frame = autoFrame(state.autoFrame)?.name.replace(" Frame", "") ?? "Frame";
		const stance = automaton.stance === "fight" ? "Deployed" : "Standby";
		const counts = maneuverCounts(automaton.maneuvers);
		const marks = Object.keys(counts).filter((element) => counts[element] > 0).map((element) => `${AUTO_ELEMENT_LABEL[element]} ${counts[element]}`);
		rows.push({
			id: "automaton",
			name: "Automaton",
			hp: Math.max(0, Math.ceil(automaton.hp)),
			max: automaton.max,
			tp: automaton.tp,
			line: `${stance} · ${head} · ${frame}${marks.length ? ` · ${marks.join(", ")}` : ""}${automaton.overdrive > 0 ? " · Overdrive" : ""}${automaton.overload > 0 ? " · Overload" : ""}${automaton.shadows > 0 ? ` · ${automaton.shadows} shadows` : ""}${automaton.mpMax > 0 ? ` · MP ${Math.ceil(automaton.mp)}` : ""}`
		});
	}
	const partyPet = (id, name, pet, line) => {
		if (!pet || pet === wyvern || pet === jug || pet === avatar || pet === automaton) return;
		rows.push({
			id,
			name,
			hp: Math.max(0, Math.ceil(pet.hp ?? 0)),
			max: pet.max ?? 0,
			tp: pet.tp ?? 0,
			line
		});
	};
	const spareWyvern = trustWyvern();
	if (spareWyvern && spareWyvern !== wyvern) partyPet(wyvern ? "wyvern:shikaree-z" : "wyvern", "Wyvern", spareWyvern, `Shikaree Z · ${spareWyvern.kind === "defensive" ? "Defensive" : spareWyvern.kind === "hybrid" ? "Hybrid" : "Offensive"} wyvern`);
	const spareJug = trustJug();
	if (spareJug && spareJug !== jug) {
		const stance = spareJug.stance === "fight" ? "Fighting" : spareJug.stance === "heel" ? "Heeling" : "Staying";
		partyPet(jug ? "jug:lhu-mhakaracca" : "jug", "Courier Carrie", spareJug, `Lhu Mhakaracca · ${stance}`);
	}
	const spareAvatar = trustAvatarPet();
	if (spareAvatar && spareAvatar !== avatar) partyPet(avatar ? "avatar:karaha-baruha" : "avatar", spareAvatar.name, spareAvatar, `Karaha-Baruha · ${spareAvatar.perp > 0 ? `${spareAvatar.perp} MP every 3 seconds` : spareAvatar.name}`);
	const spareAuto = trustAuto();
	if (spareAuto && spareAuto !== automaton) {
		const stance = spareAuto.stance === "fight" ? "Deployed" : "Standby";
		partyPet(automaton ? "automaton:nashmeira" : "automaton", "Automaton", spareAuto, `Nashmeira · ${stance}`);
	}
	return rows;
}
function peekPet(id) {
	return peekPets().find((pet) => pet.id === id) ?? null;
}
var shownPets = "";
/** A connecting blow. Misses and 0 damage pass 0. The bar stops at 3000. */
function addPetTp(kind, gain) {
	const n = Math.floor(gain);
	if (n <= 0) return;
	const pet = kind === "avatar" ? avatar : kind === "jug" ? jug : kind === "automaton" ? automaton : wyvern;
	if (!pet) return;
	const next = Math.min(3e3, pet.tp + n);
	if (next === pet.tp) return;
	pet.tp = next;
	publishPets();
}
function publishPets() {
	const pets = peekPets();
	const key = pets.map((pet) => `${pet.id}:${pet.hp}:${pet.max}:${pet.tp}:${pet.line}`).join("|");
	const state = useGame.getState();
	const lost = state.petTargeted != null && !pets.some((pet) => pet.id === state.petTargeted);
	if (key === shownPets && !lost) return;
	shownPets = key;
	useGame.setState({
		pets,
		...lost ? { petTargeted: null } : {}
	});
}
function publishWyvernBuffs() {
	useGame.setState({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
}
function makeWyvern(sub) {
	const max = wyvernMaxHp(75);
	return {
		hp: max,
		max,
		kind: wyvernKind(sub),
		anim: "idle",
		animLeft: 0,
		element: "Flame",
		remove: null,
		aimX: 0,
		aimZ: 0,
		swing: wyvernSwingSeconds(),
		queue: [],
		heals: [],
		regen: 0,
		regenLeft: 0,
		regenAcc: 0,
		tp: 0
	};
}
function summonWyvern(owner = null) {
	const state = useGame.getState();
	const forTrust = owner === "shikaree-z";
	if (forTrust) {
		if (trustPets["shikaree-z"]) {
			state.pushLog("Shikaree Z already has a wyvern.", "miss");
			return false;
		}
		const data = makeWyvern(trustSubOf(state.party, "shikaree-z"));
		trustPets["shikaree-z"] = { kind: "wyvern", data };
		const trust = liveTrusts["shikaree-z"];
		if (trust) {
			trust.buffs = trust.buffs.filter((buff) => buff.name !== "Wyvern");
			trust.buffs.push({ name: "Wyvern", left: 1, hold: true });
		}
		useGame.setState({ trustVitals: trustVitalsNow() });
		const called = data.kind === "defensive" ? "A defensive wyvern answers." : data.kind === "hybrid" ? "A hybrid wyvern answers." : "An offensive wyvern answers.";
		state.pushLog(`Shikaree Z calls a wyvern. ${called}`, "info");
		publishPets();
		return true;
	}
	if (wyvern || avatar || jug || charm || packCharm || automaton) {
		state.pushLog("You already have a pet.", "miss");
		return false;
	}
	wyvern = makeWyvern(state.subJob);
	liveBuffs = liveBuffs.filter((buff) => buff.name !== "Wyvern");
	liveBuffs = [...liveBuffs, { name: "Wyvern", left: 1, hold: true }];
	publishWyvernBuffs();
	const called = wyvern.kind === "defensive" ? "A defensive wyvern answers." : wyvern.kind === "hybrid" ? "A hybrid wyvern answers." : "An offensive wyvern answers.";
	state.pushLog(called, "info");
	publishPets();
	return true;
}
function dismissWyvern(line) {
	const had = wyvern != null;
	const owner = trustPetOwner;
	wyvern = null;
	if (owner === "shikaree-z") {
		trustPetOwner = null;
		const trust = liveTrusts["shikaree-z"];
		if (trust?.buffs.some((buff) => buff.name === "Wyvern")) {
			trust.buffs = trust.buffs.filter((buff) => buff.name !== "Wyvern");
			useGame.setState({ trustVitals: trustVitalsNow() });
		}
	}
	const abandoned = had ? dropHateRow("wyvern") : false;
	if (owner !== "shikaree-z" && liveBuffs.some((buff) => buff.name === "Wyvern")) {
		liveBuffs = liveBuffs.filter((buff) => buff.name !== "Wyvern");
		publishWyvernBuffs();
	}
	if (line && had) useGame.getState().pushLog(line, "info");
	if (abandoned && !anyHate()) useGame.getState().pushLog(`The ${HARE.name} loses interest.`, "info");
	if (had) {
		publishPets();
		useGame.setState({ ...hateNow() });
	}
}
function landFoeHit(dmg, text, tp = 0, owner = "player") {
	const state = useGame.getState();
	const hit = hitFoe(dmg, owner);
	useGame.setState({
		dealt: useGame.getState().dealt + dmg,
		...foePatch()
	});
	state.pushLog(text, "hit");
	if (!hit.dead && tp > 0) grantFoeMonsterTp(tp);
	if (hit.woke) state.pushLog(`The ${HARE.name} wakes.`, "info");
	if (hit.unbound) state.pushLog(`The ${HARE.name}'s Bind effect wears off.`, "info");
}
function landWyvernHit(dmg, text, tp = 0) {
	landFoeHit(dmg, text, tp, "wyvern");
}
function summonJug(loyalty) {
	const state = useGame.getState();
	if (state.mainJob !== "BST") {
		state.pushLog("A support job cannot equip a jug.", "miss");
		return;
	}
	if (wyvern || avatar || jug || charm || packCharm || automaton) {
		state.pushLog("You already have a pet.", "miss");
		return;
	}
	const left = state.loadout.ammo === "fish-oil-broth" ? jugCount(state.inventory, FISH_OIL_BROTH) : 0;
	if (left < 1) {
		state.pushLog("Call Beast needs Fish Oil Broth in the ammo slot.", "miss");
		return;
	}
	if (!loyalty) {
		const next = left - 1;
		const inventory = {
			...state.inventory,
			[FISH_OIL_BROTH]: next
		};
		const loadout = next === 0 ? {
			...state.loadout,
			ammo: null
		} : state.loadout;
		if (loadout.ammo !== state.loadout.ammo) writeLoadout(loadout);
		useGame.setState({
			inventory,
			loadout
		});
	}
	jug = {
		hp: CARRIE_HP_STANDIN,
		max: CARRIE_HP_STANDIN,
		tp: 0,
		stance: "stay",
		anim: "idle",
		animLeft: 0,
		swing: carrieSwingSeconds(),
		left: JUG_SECONDS,
		charges: readyBank.charges,
		chargeAcc: readyBank.acc,
		skin: 0,
		guard: false,
		curtain: false,
		familiar: false
	};
	const how = loyalty ? "Bestial Loyalty leaves the jug in the ammo slot." : "Call Beast has used one Fish Oil Broth.";
	state.pushLog(`${how} She does not swing until Fight. The level weights are not printed, so she is called at 75. The HP bar is ${CARRIE_HP_STANDIN}, four times the printed defense. That is not a retail HP.`, "info");
	publishPets();
}
function clearJugBuffs() {
	const drop = /* @__PURE__ */ new Set([
		"Familiar",
		"Scissor Guard",
		"Bubble Curtain"
	]);
	if (!liveBuffs.some((buff) => drop.has(buff.name))) return;
	liveBuffs = liveBuffs.filter((buff) => !drop.has(buff.name));
	useGame.setState({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
}
function dismissJug(line) {
	const had = jug != null;
	jug = null;
	if (trustPetOwner === "lhu-mhakaracca") trustPetOwner = null;
	if (rewardRegen?.on === "jug") rewardRegen = null;
	const abandoned = had ? dropHateRow("jug") : false;
	if (had) clearJugBuffs();
	if (line && had) useGame.getState().pushLog(line, "info");
	if (abandoned && !anyHate()) useGame.getState().pushLog(`The ${HARE.name} loses interest.`, "info");
	if (had) {
		publishPets();
		useGame.setState({ ...hateNow() });
	}
}
function freshAutomatonCd() {
	return {
		strobe: 0,
		flash: 0,
		shock: 0,
		scan: 0,
		erase: 0,
		convert: 0,
		economy: 0,
		heat: 0,
		bash: 0
	};
}
function masterManeuverStat(element) {
	const sheet = useGame.getState().sheet;
	if (element === "fire") return sheet.str;
	if (element === "ice") return sheet.int;
	if (element === "wind") return sheet.agi;
	if (element === "earth") return sheet.vit;
	if (element === "thunder") return sheet.dex;
	if (element === "water") return sheet.mnd;
	if (element === "light") return sheet.chr;
	return sheet.int;
}
function dropAutomatonManeuver(element, n = 1) {
	if (!automaton) return;
	let left = n;
	automaton.maneuvers = automaton.maneuvers.filter((row) => {
		if (left > 0 && row.element === element) {
			left -= 1;
			return false;
		}
		return true;
	});
}
function placeManeuver(element) {
	if (!automaton) return {
		dropped: null,
		overloaded: 0,
		condensed: false,
		blocked: false
	};
	if (automaton.overload > 0) return {
		dropped: null,
		overloaded: 0,
		condensed: false,
		blocked: true
	};
	const state = useGame.getState();
	const frame = autoFrame(state.autoFrame);
	const names = state.autoSet;
	const gain = maneuverBurden(masterManeuverStat(element), frame ? frameAttr(frame, element) : null, element === "fire" && names.includes("Flame Holder"));
	let next = automaton.burden[element] + gain;
	let condensed = false;
	const waterUp = automaton.maneuvers.some((row) => row.element === "water");
	if (next > 30 && names.includes("Condenser") && waterUp) {
		dropAutomatonManeuver("water", 1);
		next = 30;
		condensed = true;
	}
	automaton.burden[element] = next;
	const dropped = automaton.maneuvers.length >= 3 ? automaton.maneuvers[0].element : null;
	if (automaton.maneuvers.length >= 3) automaton.maneuvers.shift();
	const bank = Math.min(240, Math.floor(automaton.deployed));
	automaton.maneuvers.push({
		element,
		left: Math.min(300, 60 + bank)
	});
	let overloaded = 0;
	if (!condensed && next > 30 && Math.random() < overloadChance(next)) {
		overloaded = next - 30;
		automaton.maneuvers = [];
		automaton.overload = overloaded;
		automaton.burden[element] = 30;
	}
	return {
		dropped,
		overloaded,
		condensed,
		blocked: false
	};
}
function publishHareEnfeebles() {
	useGame.setState({ hareEnfeebles: liveEnfeebles.map((row) => ({ ...row })) });
}
function landAutomatonEnfeeble(spell, tier) {
	const hare = HARE.name;
	const macc = automaton ? automatonSwing().macc : 0;
	if (Math.random() < Math.max(0, .12 - macc / 500)) return "resisted";
	if (spell === "Addle") {
		const power = 12 + tier * 4;
		const current = liveEnfeebles.find((row) => row.name === "Addle");
		if (current && (current.power ?? 0) >= power) return `A stronger Addle is already on the ${hare}.`;
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Addle");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Addle",
			left: 30,
			power
		}];
		publishHareEnfeebles();
		return `Addle lowers the ${hare}'s magic attack by ${power}%.`;
	}
	if (spell === "Slow") {
		const current = liveEnfeebles.find((row) => row.name === "Slow" || row.name === "Slow II");
		const power = 150 + tier * 20;
		if (current && !enfeebleCanLand(current.name, "Slow")) return `A stronger slow is already on the ${hare}.`;
		if (current && current.name === "Slow" && (current.power ?? 0) > power) return `A stronger slow is already on the ${hare}.`;
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Slow");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Slow",
			left: 45,
			power
		}];
		publishHareEnfeebles();
		return `Slow. Auto-attack delay is multiplied by ${1024 + power}/1024.`;
	}
	if (spell === "Paralyze") {
		const current = liveEnfeebles.find((row) => row.name === "Paralyze" || row.name === "Paralyze II");
		const power = 12 + tier * 4;
		if (current && !enfeebleCanLand(current.name, "Paralyze")) return `A stronger paralyze is already on the ${hare}.`;
		if (current && current.name === "Paralyze" && (current.power ?? 0) >= power) return `A stronger paralyze is already on the ${hare}.`;
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Paralyze");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Paralyze",
			left: 45,
			power
		}];
		publishHareEnfeebles();
		return `Paralyze. ${power}% chance to cancel an auto-attack or TP move.`;
	}
	if (spell === "Silence") {
		if (liveEnfeebles.some((row) => row.name === "Silence")) return `The ${hare} is already silenced.`;
		liveEnfeebles = [...liveEnfeebles, {
			name: "Silence",
			left: 30,
			silenceFrom: "spell"
		}];
		publishHareEnfeebles();
		return `Silence.`;
	}
	if (spell === "Blind") {
		const current = liveEnfeebles.find((row) => row.name === "Blind" || row.name === "Blind II");
		if (current && !enfeebleCanLand(current.name, "Blind")) return `A stronger blind is already on the ${hare}.`;
		const down = 15 + tier * 5;
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Blind");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Blind",
			left: 45,
			accDown: down,
			blindFrom: "spell"
		}];
		publishHareEnfeebles();
		return `Blind lowers accuracy by ${down}.`;
	}
	if (spell === "Poison") {
		const dot = 2 * tier;
		const current = liveEnfeebles.find((row) => isPoisonSpell(row.name));
		if (current && (current.dot ?? 0) >= dot) return `A stronger poison is already on the ${hare}.`;
		liveEnfeebles = liveEnfeebles.filter((row) => !isPoisonSpell(row.name));
		liveEnfeebles = [...liveEnfeebles, {
			name: "Poison",
			left: 30,
			dot,
			acc: 0
		}];
		publishHareEnfeebles();
		return `Poison slips ${dot} HP every 3 seconds.`;
	}
	if (spell === "Dia") {
		const current = liveEnfeebles.find((row) => isDiaSpell(row.name));
		if (current && current.name !== "Dia") return `A stronger Dia is already on the ${hare}.`;
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Dia");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Dia",
			left: 30,
			dot: 1,
			acc: 0
		}];
		publishHareEnfeebles();
		return `Dia lowers defense.`;
	}
	if (spell === "Bio" || spell === "Bio II" || spell === "Bio III") {
		const rank = spell === "Bio III" ? 3 : spell === "Bio II" ? 2 : 1;
		const current = liveEnfeebles.find((row) => isBioSpell(row.name));
		if ((current?.name === "Bio III" ? 3 : current?.name === "Bio II" ? 2 : current?.name === "Bio" ? 1 : 0) > rank) return `A stronger Bio is already on the ${hare}.`;
		const dot = 2 * rank;
		liveEnfeebles = liveEnfeebles.filter((row) => !isBioSpell(row.name));
		liveEnfeebles = [...liveEnfeebles, {
			name: spell,
			left: 30,
			dot,
			acc: 0
		}];
		publishHareEnfeebles();
		return `${spell} lowers attack and slips ${dot} HP every 3 seconds.`;
	}
	return `${spell}.`;
}
function beginAutomatonCast(pending) {
	if (!automaton || automaton.anim !== "idle") return;
	automaton.pending = pending;
	automaton.anim = "cast";
	automaton.animLeft = pending.kind === "cure" ? 1.05 : 1.2;
	automaton.castSchool = pending.kind === "cure" || pending.spell === "Dia" ? "healing" : "black";
	automaton.castElement = pending.element;
	queueAutomatonAct({
		kind: "spell",
		name: pending.spell
	});
	if (!pending.soul) {
		const counts = maneuverCounts(automaton.maneuvers);
		automaton.spellWait = automatonCastDelay(asAutoHead(useGame.getState().autoHead), counts, automaton.overdrive > 0, useGame.getState().autoSet);
	}
}
function finishAutomatonCast() {
	if (!automaton) return;
	const pending = automaton.pending;
	automaton.pending = null;
	automaton.castSchool = null;
	automaton.castElement = null;
	if (!pending || !automaton) return;
	const state = useGame.getState();
	const cost = automatonPayMp(automatonSpellMp(pending.kind, pending.tier), automatonSwing().cooler);
	if (cost > 0 && automaton.mpMax > 0) {
		if (pending.free) state.pushLog("Mana Conserver. The spell costs no MP.", "info");
		else automaton.mp = Math.max(0, automaton.mp - cost);
	}
	const frame = asAutoFrame(state.autoFrame);
	const head = asAutoHead(state.autoHead);
	const counts = maneuverCounts(automaton.maneuvers);
	const overdrive = automaton.overdrive > 0;
	if (pending.kind === "cure") {
		const amount = pending.soul ? Math.max(1, Math.round(automatonSwing().cure * cureFrameMod(frame))) : automatonCureAmount({
			frame,
			head,
			tier: pending.tier,
			overdrive,
			water: counts.water
		});
		const cap = hpCap();
		const gained = Math.min(Math.max(0, cap - useGame.getState().hp), amount);
		if (gained > 0) {
			useGame.setState({ hp: Math.min(cap, useGame.getState().hp + gained) });
			state.pushLog(`The automaton casts ${pending.spell}. You recover ${gained} HP.`, "info");
			creditHate(0, Math.max(1, Math.floor(gained / 4)), false, "automaton");
		} else if (automaton.hp < automaton.max) {
			const self = Math.min(automaton.max - automaton.hp, amount);
			automaton.hp += self;
			state.pushLog(`The automaton casts ${pending.spell} on itself and recovers ${self} HP.`, "info");
		}
		return;
	}
	if (!foeLiving()) {
		state.pushLog(`The automaton's ${pending.spell} is interrupted.`, "miss");
		return;
	}
	if (pending.kind === "nuke" || pending.kind === "drain") {
		const power = automatonSpellPower({
			frame,
			head,
			attachments: state.autoSet,
			maneuvers: counts,
			overdrive,
			tier: pending.tier,
			nuke: pending.kind === "nuke"
		});
		const dmg = pending.kind === "drain" ? Math.max(1, Math.round(power * .85)) : power;
		const element = AUTO_ELEMENT_LABEL[pending.element].toLowerCase();
		landFoeHit(dmg, `The automaton casts ${pending.spell}. The ${HARE.name} takes ${dmg} points of ${element} damage.`, monsterTpGain(40), "automaton");
		queuePetFloater({
			text: String(dmg),
			crit: false,
			at: "foe"
		});
		if (pending.kind === "drain") {
			const heal = Math.min(Math.max(0, automaton.max - automaton.hp), Math.floor(dmg * .5));
			if (heal > 0) {
				automaton.hp += heal;
				state.pushLog(`Drain restores ${heal} HP to the automaton.`, "info");
			}
		}
		creditHate(0, Math.max(20, Math.floor(dmg / 2)), false, "automaton");
		return;
	}
	const line = landAutomatonEnfeeble(pending.spell, pending.tier);
	if (line === "resisted") {
		state.pushLog(`The automaton casts ${pending.spell}. The ${HARE.name} resists.`, "miss");
		return;
	}
	state.pushLog(`The automaton casts ${pending.spell}. ${line}`, "info");
	if ((pending.spell === "Dia" || pending.spell.startsWith("Bio")) && foeLiving()) {
		const dmg = pending.spell.startsWith("Bio") ? 6 * pending.tier : 5 * pending.tier;
		landFoeHit(dmg, `${pending.spell} hits the ${HARE.name} for ${dmg} points of damage.`, 0, "automaton");
		queuePetFloater({
			text: String(dmg),
			crit: false,
			at: "foe"
		});
	}
}
function freshAutomaton(fraction) {
	const state = useGame.getState();
	const frame = autoFrame(state.autoFrame);
	const max = frame ? automatonHpMax(frame, state.autoSet) : 788;
	const mpMax = frame ? automatonMpMax(frame, state.autoSet) : 0;
	return {
		hp: Math.max(1, Math.min(max, Math.floor(max * fraction))),
		max,
		mp: mpMax,
		mpMax,
		mpAcc: 0,
		tp: 0,
		stance: "heel",
		anim: "idle",
		animLeft: 0,
		swing: automatonSwing().delay,
		overdrive: 0,
		maneuvers: [],
		cureAcc: 0,
		regenAcc: 0,
		deployed: 0,
		deployAcc: 0,
		skin: 0,
		shadows: 0,
		overload: 0,
		burden: emptyCapacity(),
		burdenAcc: 0,
		fightSec: 0,
		equalize: 0,
		steam: 0,
		steamKind: "",
		seen: "",
		cd: freshAutomatonCd(),
		spellWait: 1.5,
		castSchool: null,
		castElement: null,
		pending: null,
		convertMp: 0,
		convertAcc: 0,
		convertChunk: 0
	};
}
function summonAutomaton(fraction) {
	const state = useGame.getState();
	if (automaton || wyvern || avatar || jug || charm) {
		state.pushLog("You already have a pet.", "miss");
		return;
	}
	automaton = freshAutomaton(fraction);
	publishPets();
}
function dismissAutomaton(line) {
	const had = automaton != null;
	automaton = null;
	if (trustPetOwner === "nashmeira") trustPetOwner = null;
	automatonActs = [];
	repairRegen = null;
	const abandoned = had ? dropHateRow("automaton") : false;
	if (line && had) useGame.getState().pushLog(line, "info");
	if (abandoned && !anyHate()) useGame.getState().pushLog(`The ${HARE.name} loses interest.`, "info");
	if (had) {
		publishPets();
		useGame.setState({ ...hateNow() });
	}
}
function brothIsSet(state) {
	return state.loadout.ammo === FISH_OIL_BROTH && jugCount(state.inventory, FISH_OIL_BROTH) >= 1;
}
/** Lhu calls her own Courier Carrie. She does not use your jug or your broth. */
function callTrustCarrie(announceMissing) {
	const state = useGame.getState();
	if (!state.party.summoned.includes("lhu-mhakaracca")) return false;
	if ((charmOwner === "lhu-mhakaracca" && charm) || (packCharm && packCharm.owner === "lhu-mhakaracca")) {
		if (announceMissing !== false) state.pushLog("Lhu Mhakaracca already has a pet.", "miss");
		return false;
	}
	if (trustPets["lhu-mhakaracca"]) return true;
	trustPets["lhu-mhakaracca"] = {
		kind: "jug",
		data: {
			hp: CARRIE_HP_STANDIN,
			max: CARRIE_HP_STANDIN,
			tp: 0,
			stance: "fight",
			anim: "idle",
			animLeft: 0,
			swing: carrieSwingSeconds(),
			left: JUG_SECONDS,
			charges: 3,
			chargeAcc: 0,
			skin: 0,
			guard: false,
			curtain: false,
			familiar: false
		}
	};
	if (announceMissing !== false) state.pushLog("Lhu Mhakaracca calls Courier Carrie.", "info");
	publishPets();
	return true;
}
function summonTrustAutomaton(fraction = 1) {
	if (trustPets["nashmeira"]) return false;
	const data = freshAutomaton(fraction);
	data.stance = "fight";
	trustPets["nashmeira"] = { kind: "automaton", data };
	const state = useGame.getState();
	const head = autoHead(state.autoHead)?.name ?? "head";
	const frame = autoFrame(state.autoFrame)?.name ?? "frame";
	const n = state.autoSet.length;
	state.pushLog(`Nashmeira calls an automaton. ${head}, ${frame}, ${n} attachment${n === 1 ? "" : "s"}.`, "info");
	publishPets();
	return true;
}
/** Nashmeira calls her own automaton. Your pet stays out. */
function callTrustAutomaton() {
	const state = useGame.getState();
	if (!state.party.summoned.includes("nashmeira")) return;
	if (trustPets["nashmeira"]) {
		state.pushLog("Nashmeira's automaton is already out.", "info");
		return;
	}
	summonTrustAutomaton(1);
}
function freshTrustAvatar(summonId) {
	const spec = summonById(summonId);
	if (!spec) return null;
	const sheet = avatarSheet(spec.id, 75);
	const burst = spec.family === "burst";
	const release = spec.id === "alexander" || spec.id === "odin";
	const oneshot = burst || release;
	return {
		id: spec.id,
		name: spec.name,
		element: spec.element,
		spirit: spec.family === "spirit",
		astral: spec.astralGate,
		assault: !oneshot,
		heel: false,
		instinctNoted: false,
		perp: oneshot ? 0 : perpetuation(spec.id, 75),
		perpAcc: 0,
		swing: 1.2,
		anim: oneshot ? "pact" : "idle",
		animLeft: oneshot ? 1.15 : 0,
		pact: burst ? "Deconstruction" : spec.id === "alexander" ? "Perfect Defense" : spec.id === "odin" ? "Zantetsuken" : null,
		show: 0,
		pactCursor: 0,
		flowShown: false,
		hp: oneshot ? 0 : sheet?.hp ?? 0,
		max: oneshot ? 0 : sheet?.hp ?? 0,
		tp: 0,
		regen: oneshot ? 0 : sheet?.regen ?? 0,
		regenAcc: 0,
		oneshot
	};
}
function summonTrustAvatar(summonId) {
	const trust = liveTrusts["karaha-baruha"];
	const spec = summonById(summonId);
	if (!spec) return null;
	if (spec.astralGate && !trust?.buffs.some((buff) => buff.name === "Astral Flow")) {
		useGame.getState().pushLog(`${spec.name} can be summoned only during Astral Flow.`, "miss");
		return null;
	}
	const data = freshTrustAvatar(summonId);
	if (!data) return null;
	trustPets["karaha-baruha"] = { kind: "avatar", data };
	useGame.getState().pushLog(`Karaha-Baruha calls ${spec.name}.`, "info");
	publishPets();
	return data;
}
function callTrustCarbuncle() {
	const state = useGame.getState();
	if (!state.party.summoned.includes("karaha-baruha")) return;
	if (trustPets["karaha-baruha"]) return;
	summonTrustAvatar("carbuncle");
}
function releaseTrustPet(id) {
	if (id === "lhu-mhakaracca") breakLhuCharm("The charm breaks.");
	if (trustPets[id]) {
		const line = id === "shikaree-z" ? "The wyvern leaves with Shikaree Z." : id === "lhu-mhakaracca" ? "Courier Carrie leaves with Lhu Mhakaracca." : id === "nashmeira" ? "The automaton leaves with Nashmeira." : id === "karaha-baruha" ? "The avatar leaves with Karaha-Baruha." : null;
		dismissTrustPet(id, line);
	}
	if (trustPetOwner !== id) return;
	const state = useGame.getState();
	trustPetOwner = null;
	if (id === "lhu-mhakaracca" && state.mainJob !== "BST" && jug) dismissJug("Courier Carrie leaves with Lhu Mhakaracca.");
	if (id === "nashmeira" && state.mainJob !== "PUP" && state.subJob !== "PUP" && automaton) dismissAutomaton("The automaton leaves with Nashmeira.");
}
function refreshLiveBlu() {
	const id = "waoud";
	const trust = liveTrusts[id];
	if (!trust) return;
	const state = useGame.getState();
	if (!state.party.summoned.includes(id)) return;
	const sheet = trustCombat(id, trustSubOf(state.party, id), trustGearOf(state.party, id));
	trust.maxHp = sheet.hp;
	trust.maxMp = sheet.mp;
	trust.hp = Math.min(trust.hp, sheet.hp);
	trust.mp = Math.min(trust.mp, sheet.mp);
	useGame.setState({ trustVitals: trustVitalsNow() });
}
function masterCloserProps() {
	const state = useGame.getState();
	if (state.mainJob !== "PUP" || state.sheet.skillName !== "Hand-to-Hand") return [];
	const ctx = {
		job: "PUP",
		main: true,
		level: 75,
		skill: state.sheet.skill,
		weaponName: state.sheet.weaponName,
		quests: [],
		sub: state.subJob
	};
	return HAND_SKILLS.filter((ws) => pupCanUse(ws, ctx) === null).map((ws) => ws.chains);
}
function tickAutomaton(dt) {
	const state = useGame.getState();
	const pup = state.mainJob === "PUP" || state.subJob === "PUP";
	const trustKeeps = trustPetOwner === "nashmeira" && state.party.summoned.includes("nashmeira");
	if (!trustKeeps && (state.ko || !pup)) {
		if (automaton) dismissAutomaton("The automaton leaves.");
		return;
	}
	if (!automaton) return;
	const frame = autoFrame(state.autoFrame);
	if (frame && automaton.max > 0) {
		const nextMax = automatonHpMax(frame, state.autoSet);
		const nextMp = automatonMpMax(frame, state.autoSet);
		if (nextMax !== automaton.max) {
			const ratio = automaton.hp / automaton.max;
			automaton.max = nextMax;
			automaton.hp = Math.max(1, Math.min(nextMax, Math.round(ratio * nextMax)));
		}
		if (nextMp !== automaton.mpMax) {
			const ratio = automaton.mpMax > 0 ? automaton.mp / automaton.mpMax : 1;
			automaton.mpMax = nextMp;
			automaton.mp = Math.max(0, Math.min(nextMp, Math.round(ratio * nextMp)));
		}
	}
	if (automaton.overdrive > 0) {
		automaton.overdrive = Math.max(0, automaton.overdrive - dt);
		if (automaton.overdrive === 0) state.pushLog("Overdrive wears off.", "info");
	}
	if (automaton.overload > 0) {
		automaton.overload = Math.max(0, automaton.overload - dt);
		if (automaton.overload === 0) state.pushLog("Overload wears off.", "info");
	}
	const fighting = automaton.stance === "fight" && foeLiving();
	if (fighting) automaton.deployed += dt;
	automaton.fightSec = fighting ? automaton.fightSec + dt : 0;
	if (automaton.equalize > 0) automaton.equalize = Math.max(0, automaton.equalize - dt);
	if (automaton.steam > 0) automaton.steam = Math.max(0, automaton.steam - dt);
	for (const key of Object.keys(automaton.cd)) if (automaton.cd[key] > 0) automaton.cd[key] = Math.max(0, automaton.cd[key] - dt);
	if (fighting && automaton.maneuvers.length) {
		automaton.deployAcc += dt;
		if (automaton.deployAcc >= 3) {
			const ticks = Math.floor(automaton.deployAcc / 3);
			automaton.deployAcc -= ticks * 3;
			automaton.maneuvers = automaton.maneuvers.map((row) => ({
				...row,
				left: Math.min(300, row.left + ticks * 3)
			}));
		}
	} else if (automaton.maneuvers.length) {
		automaton.deployAcc = 0;
		automaton.maneuvers = automaton.maneuvers.map((row) => ({
			...row,
			left: row.left - dt
		})).filter((row) => row.left > 0);
	}
	automaton.burdenAcc += dt;
	if (automaton.burdenAcc >= 3) {
		const ticks = Math.floor(automaton.burdenAcc / 3);
		automaton.burdenAcc -= ticks * 3;
		const water = maneuverCounts(automaton.maneuvers).water;
		const drop = burdenDecay(state.autoSet.includes("Heatsink"), water) * ticks;
		for (const element of Object.keys(automaton.burden)) automaton.burden[element] = Math.max(0, automaton.burden[element] - drop);
	}
	if (automaton.animLeft > 0) {
		automaton.animLeft = Math.max(0, automaton.animLeft - dt);
		if (automaton.animLeft === 0) {
			if (automaton.anim === "cast") finishAutomatonCast();
			automaton.anim = "idle";
		}
	}
	const profile = automatonSwing();
	const counts = maneuverCounts(automaton.maneuvers);
	const names = state.autoSet;
	if (profile.regen > 0 && automaton.hp > 0 && automaton.hp < automaton.max) {
		automaton.regenAcc += dt;
		const ticks = Math.floor(automaton.regenAcc / 3);
		if (ticks > 0) {
			automaton.regenAcc -= ticks * 3;
			const gained = Math.min(automaton.max - automaton.hp, profile.regen * ticks);
			if (gained > 0) automaton.hp += gained;
		}
	} else automaton.regenAcc = 0;
	if (profile.refresh > 0 && automaton.mp < automaton.mpMax) {
		automaton.mpAcc += dt;
		const ticks = Math.floor(automaton.mpAcc / 3);
		if (ticks > 0) {
			automaton.mpAcc -= ticks * 3;
			automaton.mp = Math.min(automaton.mpMax, automaton.mp + profile.refresh * ticks);
		}
	} else automaton.mpAcc = 0;
	if (automaton.convertMp > 0) {
		automaton.convertAcc += dt;
		const ticks = Math.floor(automaton.convertAcc / 3);
		if (ticks > 0) {
			automaton.convertAcc -= ticks * 3;
			const gain = Math.min(automaton.convertMp, automaton.convertChunk * ticks, Math.max(0, automaton.mpMax - automaton.mp));
			automaton.mp += gain;
			automaton.convertMp = Math.max(0, automaton.convertMp - gain);
		}
	}
	const dark = counts.dark;
	const convertLine = dark >= 3 ? .65 : dark === 2 ? .6 : dark === 1 ? .4 : 0;
	if (names.includes("Mana Converter") && automaton.mpMax > 0 && convertLine > 0 && automaton.cd.convert <= 0 && automaton.convertMp <= 0 && automaton.mp < automaton.mpMax * convertLine) {
		const spent = Math.floor(automaton.hp / 2);
		if (spent > 0 && spent <= automaton.mpMax && automaton.hp - spent >= 1) {
			const total = Math.min(spent, automaton.mpMax - automaton.mp);
			automaton.hp -= spent;
			automaton.convertMp = total;
			automaton.convertChunk = Math.max(1, Math.ceil(total / 10));
			automaton.convertAcc = 0;
			automaton.cd.convert = 180;
			showAutomatonAbility("ability", .55);
			queueAutomatonAct({
				kind: "convert",
				spent
			});
			state.pushLog(`Mana Converter spends ${spent} HP. ${total} MP returns over ten ticks.`, "info");
		}
	}
	if (profile.heatTp > 0 && automaton.cd.heat <= 0 && fighting && automaton.tp < 3e3) {
		const before = automaton.tp;
		addPetTp("automaton", profile.heatTp);
		automaton.cd.heat = 90;
		const gained = automaton ? automaton.tp - before : 0;
		if (gained > 0) {
			showAutomatonAbility("ability", .45);
			queueAutomatonAct({
				kind: "heat",
				tp: gained
			});
			state.pushLog(`Heat Capacitor. The automaton gains ${gained} TP.`, "info");
		}
	}
	if (state.autoFrame === "valoredge" && fighting && automaton.cd.bash <= 0 && foeLiving()) {
		automaton.cd.bash = 180;
		const earth = names.includes("Hammermill") ? counts.earth : 0;
		const bash = names.includes("Hammermill") ? 10 + 8 * Math.max(1, earth) : 15;
		landFoeHit(bash, `Shield Bash hits the ${HARE.name} for ${bash} points of damage.`, monsterTpGain(40), "automaton");
		queuePetFloater({
			text: String(bash),
			crit: false,
			at: "foe"
		});
		queueAutomatonAct({
			kind: "bash",
			dmg: bash
		});
		if (earth > 0) {
			const slow = landAutomatonEnfeeble("Slow", Math.min(3, earth));
			if (slow !== "resisted") state.pushLog(`Shield Bash. ${slow}`, "info");
		}
	}
	if (names.includes("Economizer") && automaton.mpMax > 0 && automaton.cd.economy <= 0 && counts.dark > 0 && automaton.mp < automaton.mpMax * .25) {
		dropAutomatonManeuver("dark", 1);
		const gained = Math.max(1, Math.floor(automaton.mpMax * .3));
		automaton.mp = Math.min(automaton.mpMax, automaton.mp + gained);
		automaton.cd.economy = 15;
		showAutomatonAbility("ability", .55);
		queueAutomatonAct({
			kind: "economy",
			gained
		});
		state.pushLog(`Economizer spends a Dark Maneuver and restores ${gained} MP.`, "info");
	}
	if (names.includes("Replicator") && automaton.shadows <= 0 && counts.wind > 0 && automaton.max > 0 && automaton.hp / automaton.max <= .5) {
		const shadows = replicatorShadows(counts.wind);
		dropAutomatonManeuver("wind", counts.wind);
		automaton.shadows = shadows;
		showAutomatonAbility("ability", .55);
		queueAutomatonAct({
			kind: "shadows",
			n: shadows
		});
		state.pushLog(`Replicator spends the Wind Maneuvers. ${shadows} shadows.`, "info");
	}
	if (names.includes("Strobe") && counts.fire > 0 && automaton.cd.strobe <= 0 && fighting) {
		automaton.cd.strobe = 20;
		creditHate(1, 1800, false, "automaton");
		showAutomatonAbility("provoke", .7);
		queueAutomatonAct({ kind: "provoke" });
		state.pushLog("The automaton uses Provoke.", "info");
	}
	if (names.includes("Flashbulb") && counts.light > 0 && automaton.cd.flash <= 0 && fighting) {
		automaton.cd.flash = 45;
		const current = liveEnfeebles.find((row) => row.name === "Flash");
		if (!current || (current.accDown ?? 0) < 300) {
			liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Flash");
			liveEnfeebles = [...liveEnfeebles, {
				name: "Flash",
				left: 12,
				accDown: 300,
				flashFrom: "burst"
			}];
			publishHareEnfeebles();
		}
		creditHate(180, 1280, false, "automaton");
		showAutomatonAbility("flash", .55);
		queueAutomatonAct({ kind: "flash" });
		state.pushLog("The automaton uses Flash.", "info");
	}
	if (profile.skinHp > 0 && automaton.skin <= 0 && automaton.cd.shock <= 0) {
		automaton.skin = profile.skinHp;
		automaton.cd.shock = 30;
		showAutomatonAbility("ability", .55);
		queueAutomatonAct({
			kind: "skin",
			hp: profile.skinHp
		});
		state.pushLog(`Shock Absorber. Stoneskin of ${profile.skinHp} HP.`, "info");
	}
	if (names.includes("Scanner") && counts.ice > 0 && automaton.cd.scan <= 0 && fighting) {
		automaton.cd.scan = 40;
		showAutomatonAbility("ability", .5);
		queueAutomatonAct({ kind: "scan" });
		state.pushLog(`Scanner. The ${HARE.name} has evasion ${HARE.evasion}.`, "info");
	}
	if (names.includes("Eraser") && counts.light > 0 && automaton.cd.erase <= 0 && liveAilments.length) {
		const gone = liveAilments[0];
		liveAilments = liveAilments.slice(1);
		automaton.cd.erase = 20;
		useGame.setState({ ailments: liveAilments.map((row) => ({ ...row })) });
		showAutomatonAbility("ability", .5);
		queueAutomatonAct({
			kind: "erase",
			name: gone.name
		});
		state.pushLog(`Eraser removes ${gone.name}.`, "info");
	}
	const cap = hpCap();
	const needCure = profile.cure > 0 && automaton.overload <= 0 && automaton.mpMax > 0 && (state.hp < cap * profile.cureAt || automaton.hp < automaton.max * .55);
	if (needCure) automaton.cureAcc += dt;
	else automaton.cureAcc = 0;
	if (automaton.spellWait > 0) automaton.spellWait = Math.max(0, automaton.spellWait - dt);
	const cureSpell = automatonCureSpell(asAutoFrame(state.autoFrame), asAutoHead(state.autoHead), counts.light) ?? {
		spell: "Cure",
		tier: 1
	};
	const cureCost = automatonPayMp(automatonSpellMp("cure", cureSpell.tier), profile.cooler);
	if (automaton.anim === "idle" && needCure && automaton.cureAcc >= 12 / (1 + .35 * counts.light * (automaton.overdrive > 0 ? 2 : 1))) {
		const cureFree = cureCost > 0 && profile.conserve > 0 && Math.random() < profile.conserve;
		automaton.cureAcc = 0;
		if (cureFree || automaton.mp >= cureCost) beginAutomatonCast({
			kind: "cure",
			element: "light",
			spell: cureSpell.spell,
			tier: cureSpell.tier,
			soul: true,
			free: cureFree
		});
	}
	if (!automaton) return;
	if (fighting) {
		automaton.swing -= dt;
		if (automaton.anim === "idle" && actorPlace("automaton", automatonAt).melee) {
			const plan = automatonPlan({
				frame: asAutoFrame(state.autoFrame),
				head: asAutoHead(state.autoHead),
				maneuvers: counts,
				masterRatio: cap > 0 ? state.hp / cap : 1,
				selfRatio: automaton.max > 0 ? automaton.hp / automaton.max : 1,
				attachments: names
			});
			const cost = automatonPayMp(automatonSpellMp(plan.kind, plan.kind === "melee" ? 1 : plan.tier), profile.cooler);
			if (automaton.overload <= 0 && plan.kind !== "melee" && automaton.spellWait <= 0 && automaton.mpMax > 0) {
				const free = cost > 0 && profile.conserve > 0 && Math.random() < profile.conserve;
				if (free || automaton.mp >= cost) beginAutomatonCast({
					...plan,
					free
				});
				else automaton.spellWait = 2;
			} else if (automaton.swing <= 0) {
				const target = chainFoe();
				const opening = resonanceProps(target) ?? [];
				const picked = chooseAutomatonWs({
					frame: asAutoFrame(state.autoFrame),
					head: asAutoHead(state.autoHead),
					maneuvers: counts,
					opening,
					inhibitor: names.includes("Inhibitor"),
					masterTp: state.tp,
					masterClosers: masterCloserProps()
				});
				const wsReady = automaton.tp >= 1e3 && !picked.hold;
				const rate = hitRate(profile.accuracy, targetEvasion(HARE.evasion, foeEnfeebleRows()), HARE.level - 75);
				const miss = wsReady && picked.ws.sure ? false : Math.random() * 100 >= rate;
				const ws = wsReady && !miss;
				if (wsReady) automaton.tp = 0;
				const crit = !wsReady && !miss && profile.crit > 0 && Math.random() < profile.crit;
				const swingSpan = wsReady ? .9 : state.autoFrame === "sharpshot" ? .7 : state.autoFrame === "valoredge" ? .55 : .48;
				automaton.swing = profile.delay * (automaton.overload > 0 ? 1.5 : 1);
				automaton.anim = wsReady ? "ws" : "swing";
				automaton.animLeft = swingSpan;
				if (miss) {
					const who = wsReady ? picked.ws.name : "The automaton";
					useGame.getState().pushLog(`${who} misses the ${HARE.name}.`, "miss");
					if (wsReady) queueAutomatonAct({
						kind: "ws",
						name: picked.ws.name,
						dmg: 0,
						crit: false
					});
				} else {
					const dmg = Math.max(1, Math.round(profile.damage * (ws ? profile.wsMult : 1) * (crit ? 1.25 : 1)));
					landFoeHit(dmg, `${ws ? picked.ws.name : "The automaton"} ${crit ? "critically hits" : "hits"} the ${HARE.name} for ${dmg} points of damage.`, monsterTpGain(ws ? 120 : 90), "automaton");
					const stp = 1 + profile.stp / 100;
					if (ws) {
						queueAutomatonAct({
							kind: "ws",
							name: picked.ws.name,
							dmg,
							crit: false
						});
						const chain = offerWeaponSkill(picked.ws.props, dmg, "automaton", target);
						if (chain) {
							if (chain.damage > 0 && foeLiving()) landFoeHit(chain.damage, `${chain.name} skillchain. ${chain.damage} damage.`, 0, "automaton");
							else useGame.getState().pushLog(`${chain.name} skillchain. ${chain.damage} damage.`, "hit");
						} else {
							const noted = takeChainNote();
							if (noted?.held) useGame.getState().pushLog(`${noted.held} holds. It lands when the window opens.`, "info");
							else if (noted?.resonating?.length) useGame.getState().pushLog(`${noted.resonating.join(" / ")} resonates.`, "info");
						}
					} else {
						addPetTp("automaton", Math.round(90 * stp));
						queuePetFloater({
							text: String(dmg),
							crit,
							at: "foe"
						});
					}
					if (profile.hate > 20) creditHate(0, profile.hate, false, "automaton");
					if (!ws && profile.da > 0 && Math.random() < profile.da && foeLiving()) {
						landFoeHit(profile.damage, `Double Attack. The automaton hits the ${HARE.name} for ${profile.damage} points of damage.`, monsterTpGain(40), "automaton");
						addPetTp("automaton", Math.round(40 * stp));
						queuePetFloater({
							text: String(profile.damage),
							crit: false,
							at: "foe"
						});
					}
					if (!ws && profile.barrage > 0 && Math.random() < .35 && foeLiving() && automaton) {
						const shots = profile.barrage;
						const extra = profile.damage * shots;
						landFoeHit(extra, `Barrage. ${shots} extra shots hit the ${HARE.name} for ${extra} points of damage.`, monsterTpGain(40), "automaton");
						addPetTp("automaton", Math.round(40 * stp));
						queuePetFloater({
							text: String(extra),
							crit: false,
							at: "foe"
						});
						queueAutomatonAct({
							kind: "barrage",
							shots,
							dmg: extra
						});
						automaton.burden.wind += 10;
					}
				}
			}
		} else if (automaton.swing <= 0) automaton.swing = 0;
	} else if (automaton.anim === "swing" || automaton.anim === "ws") {
		automaton.anim = "idle";
		automaton.animLeft = 0;
	}
}
function settleAutomaton(result) {
	if (result.automatonCall != null) summonAutomaton(result.automatonCall);
	if (result.automatonDismiss) dismissAutomaton(null);
	if (result.automatonOrder && automaton) {
		automaton.stance = result.automatonOrder;
		if (result.automatonOrder === "heel") {
			automaton.anim = "idle";
			automaton.animLeft = 0;
			automaton.pending = null;
			automaton.castSchool = null;
			automaton.castElement = null;
		}
		publishPets();
	}
	if (result.automatonRepair && automaton) spendRepair(result.automatonRepair);
	if (result.automatonOverdrive && automaton) {
		automaton.overdrive = 180;
		publishPets();
	}
	if (result.maneuver && automaton) {
		const placed = placeManeuver(result.maneuver);
		if (placed.blocked) useGame.getState().pushLog("The automaton is overloaded. The maneuver does not take.", "miss");
		else if (placed.overloaded > 0) useGame.getState().pushLog(`Overload. Every maneuver is wiped. The automaton is slowed for ${placed.overloaded} seconds.`, "miss");
		else {
			const count = maneuverCounts(automaton.maneuvers)[result.maneuver];
			const bonus = maneuverStatBonus(75) * count * (automaton.overdrive > 0 ? 2 : 1);
			const stat = MANEUVER_STAT[result.maneuver];
			const what = result.maneuver === "dark" ? "Magic recovers faster." : `${stat} +${bonus}.`;
			const wore = placed.dropped && placed.dropped !== result.maneuver ? ` ${AUTO_ELEMENT_LABEL[placed.dropped]} Maneuver wears off.` : "";
			const note = attachmentNote(result.maneuver, count, useGame.getState().autoSet, automaton.overdrive > 0);
			const gear = note ? ` ${note}.` : "";
			const held = placed.condensed ? " Condenser spends a Water Maneuver." : "";
			useGame.getState().pushLog(`${AUTO_ELEMENT_LABEL[result.maneuver]} Maneuver ×${count}. ${what}${gear}${wore}${held}`, "info");
		}
		publishPets();
	}
}
function spendRepair(repair) {
	const state = useGame.getState();
	if (!automaton || automaton.hp <= 0) return;
	const copy = repair.copy === true;
	let inventory = state.inventory;
	let loadout = state.loadout;
	if (!copy) {
		if (state.loadout.ammo !== "automaton-oil") return;
		const have = oilCount(state.inventory);
		if (have < 1) return;
		const next = have - 1;
		inventory = {
			...state.inventory,
			[AUTOMATON_OIL]: next
		};
		loadout = next === 0 ? {
			...state.loadout,
			ammo: null
		} : state.loadout;
		if (loadout.ammo !== state.loadout.ammo) writeLoadout(loadout);
	}
	const room = Math.max(0, automaton.max - automaton.hp);
	const gained = Math.min(room, repair.instant);
	automaton.hp += gained;
	repairRegen = {
		left: repair.seconds,
		acc: 0,
		regen: repair.regen,
		ticks: Math.round(repair.seconds / 3)
	};
	if (gained > 0) {
		queuePetFloater({
			text: `+${gained}`,
			crit: false,
			at: "automaton",
			color: "#8dffb0"
		});
		if (!copy) state.pushLog(`Repair restores ${gained} HP.`, "info");
	}
	publishPets();
	if (!copy) useGame.setState({
		inventory,
		loadout
	});
}
function tickRepairRegen(dt) {
	if (!repairRegen) return;
	if (!automaton || automaton.hp <= 0) {
		repairRegen = null;
		return;
	}
	repairRegen.acc += dt;
	repairRegen.left -= dt;
	const ready = Math.floor(repairRegen.acc / 3);
	const n = Math.min(ready, repairRegen.ticks);
	if (n > 0) {
		repairRegen.ticks -= n;
		repairRegen.acc -= n * 3;
		const room = automaton.max - automaton.hp;
		const gained = Math.min(room, repairRegen.regen * n);
		if (gained > 0) {
			automaton.hp += gained;
			queuePetFloater({
				text: `+${gained}`,
				crit: false,
				at: "automaton",
				color: "#8dffb0"
			});
			publishPets();
		}
	}
	if (repairRegen.ticks <= 0 || repairRegen.left <= 0) {
		repairRegen = null;
		useGame.getState().pushLog("Automaton Oil's mend wears off.", "info");
	}
}
function landJugHit(dmg, text, tp = 0) {
	landFoeHit(dmg, text, tp, "jug");
	queuePetFloater({
		text: String(dmg),
		crit: false,
		at: "foe"
	});
}
function playCrab(motion) {
	if (!jug) return;
	jug.anim = motion;
	jug.animLeft = crabMotionSeconds(motion);
}
function applyReady(name) {
	if (!jug) return;
	playCrab(name);
	const state = useGame.getState();
	if (name === "Bubble Shower" || name === "Big Scissors") {
		const dmg = carrieMeleeDamage(75);
		if (!foeLiving()) return;
		if (name === "Bubble Shower") {
			bubbleStr = 9;
			bubbleStrLeft = 180;
			landJugHit(dmg, `Bubble Shower hits the ${HARE.name} for ${dmg} points of damage. STR −9 for 3 minutes. The decay and the damage are not printed, so the −9 holds and the hit is the melee stand-in.`);
		} else landJugHit(dmg, `Big Scissors hits the ${HARE.name} for ${dmg} points of damage. Slashing. Skillchain: Scission. The chain is not opened. The damage is the melee stand-in.`);
		return;
	}
	if (name === "Scissor Guard") {
		jug.guard = true;
		state.pushLog("Scissor Guard. Courier Carrie's defense is doubled while she is out.", "info");
		return;
	}
	if (name === "Bubble Curtain") {
		jug.curtain = true;
		state.pushLog("Bubble Curtain. Magic damage taken by Courier Carrie is halved while she is out.", "info");
		return;
	}
	jug.skin = 200;
	const have = liveBuffs.find((buff) => buff.name === "Stoneskin")?.skin ?? 0;
	if (have < 200) {
		liveBuffs = liveBuffs.filter((buff) => buff.name !== "Stoneskin");
		liveBuffs = [...liveBuffs, {
			name: "Stoneskin",
			left: 1,
			hold: true,
			skin: 200
		}];
		useGame.setState({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
		state.pushLog(`Metallic Body. Stoneskin absorbs 200 points of damage on you and on Courier Carrie. It stays until it is spent.`, "info");
	} else state.pushLog(`Metallic Body covers Courier Carrie. Your Stoneskin is already stronger (${have}).`, "info");
}
function tickJug(dt) {
	if (trustPetOwner !== "lhu-mhakaracca" && bubbleStrLeft > 0) {
		bubbleStrLeft = Math.max(0, bubbleStrLeft - dt);
		if (bubbleStrLeft === 0) {
			bubbleStr = 0;
			useGame.getState().pushLog("Bubble Shower's STR down wears off.", "info");
		}
	}
	const state = useGame.getState();
	const trustKeeps = trustPetOwner === "lhu-mhakaracca" && state.party.summoned.includes("lhu-mhakaracca");
	if (!trustKeeps && (state.ko || state.mainJob !== "BST")) {
		if (jug) dismissJug("Courier Carrie leaves.");
		return;
	}
	if (!jug) return;
	jug.left -= dt;
	if (jug.left <= 0) {
		dismissJug("Courier Carrie's jug runs out.");
		return;
	}
	if (jug.animLeft > 0) {
		jug.animLeft = Math.max(0, jug.animLeft - dt);
		if (jug.animLeft === 0) jug.anim = "idle";
	}
	if (trustPetOwner === "lhu-mhakaracca") {
		jug.chargeAcc = (jug.chargeAcc ?? 0) + dt;
		if ((jug.charges ?? 0) < 3 && jug.chargeAcc >= 30) {
			jug.chargeAcc -= 30;
			jug.charges = Math.min(3, (jug.charges ?? 0) + 1);
		}
	} else {
		jug.charges = readyBank.charges;
		jug.chargeAcc = readyBank.acc;
	}
	if (jug.stance === "fight" && foeLiving()) {
		jug.swing -= dt;
		if (jug.swing <= 0 && actorPlace("jug", jugAt).melee && jug.anim === "idle") {
			jug.swing = carrieSwingSeconds();
			playCrab("auto");
			const rate = hitRate(305 + (state.engaged ? state.sheet.tandemAcc : 0), targetEvasion(HARE.evasion, foeEnfeebleRows()), HARE.level - 75);
			if (Math.random() * 100 >= rate) useGame.getState().pushLog(`Courier Carrie misses the ${HARE.name}.`, "miss");
			else {
				const dmg = carrieMeleeDamage(75);
				landJugHit(dmg, `Courier Carrie hits the ${HARE.name} for ${dmg} points of damage.`, monsterTpGain(carrieTpPerHit()));
				addPetTp("jug", carrieTpPerHit());
			}
		} else if (jug.swing <= 0) jug.swing = 0;
	} else if (jug.anim === "auto") {
		jug.anim = "idle";
		jug.animLeft = 0;
	}
}
function feedReward(reward) {
	const state = useGame.getState();
	const id = reward.foodId && ITEMS$1[reward.foodId]?.kind === "Pet Food" ? reward.foodId : PET_FOOD_ZETA;
	const have = petFoodCount(state.inventory, id);
	const copy = reward.copy === true;
	if (!copy && have < 1) return;
	if (reward.on === "jug" && (!jug || jug.hp <= 0)) return;
	if (reward.on === "charm" && !charm) return;
	const inventory = copy ? state.inventory : {
		...state.inventory,
		[id]: have - 1
	};
	let gained = 0;
	if (reward.on === "jug" && jug) {
		const room = Math.max(0, jug.max - jug.hp);
		gained = Math.min(room, reward.heal);
		jug.hp += gained;
		queuePetFloater({
			text: `+${gained}`,
			crit: false,
			at: "jug",
			color: "#7dff9a"
		});
	} else if (charm?.who === "kin") {
		const room = Math.max(0, HARE.hpNatural - liveKinHp);
		gained = Math.min(room, reward.heal);
		if (gained > 0) liveKinHp += gained;
		queuePetFloater({
			text: `+${gained}`,
			crit: false,
			at: "kin",
			color: "#7dff9a"
		});
	} else if (charm) {
		const room = Math.max(0, HARE.hpNatural - liveHareHp);
		gained = Math.min(room, reward.heal);
		if (gained > 0) liveHareHp += gained;
		if (liveEnfeebles.some((row) => isSleepSpell(row.name) || row.name === "Lullaby" || row.name === "Sheep Song" || row.name === "Soporific" || row.name === "Yawn")) {
			liveEnfeebles = liveEnfeebles.filter((row) => !isSleepSpell(row.name) && row.name !== "Lullaby" && row.name !== "Sheep Song" && row.name !== "Soporific" && row.name !== "Yawn");
			useGame.getState().pushLog(`The ${HARE.name} wakes.`, "info");
		}
		queuePetFloater({
			text: `+${gained}`,
			crit: false,
			at: "foe",
			color: "#7dff9a"
		});
	}
	rewardRegen = {
		on: reward.on,
		left: reward.seconds,
		acc: 0,
		regen: reward.regen
	};
	creditHate(0, reward.ve, false, reward.on);
	publishPets();
	useGame.setState({
		inventory,
		...reward.on === "charm" ? charm?.who === "kin" ? { kinHp: liveKinHp } : {
			hareHp: liveHareHp,
			hareEnfeebles: liveEnfeebles.map((row) => ({ ...row }))
		} : {},
		...hateNow()
	});
}
function tickRewardRegen(dt) {
	if (!rewardRegen) return;
	if (rewardRegen.on === "jug" && !jug) {
		rewardRegen = null;
		return;
	}
	if (rewardRegen.on === "charm" && !charm) {
		rewardRegen = null;
		return;
	}
	rewardRegen.left -= dt;
	if (rewardRegen.left <= 0) {
		rewardRegen = null;
		useGame.getState().pushLog("Reward's regen wears off.", "info");
		return;
	}
	rewardRegen.acc += dt;
	const ticks = Math.floor(rewardRegen.acc / 3);
	if (ticks <= 0) return;
	rewardRegen.acc -= ticks * 3;
	const amount = rewardRegen.regen * ticks;
	if (rewardRegen.on === "jug" && jug && jug.hp > 0 && jug.hp < jug.max) {
		const gained = Math.min(jug.max - jug.hp, amount);
		if (gained > 0) {
			jug.hp += gained;
			publishPets();
		}
	} else if (rewardRegen.on === "charm" && charm?.who === "kin" && liveKinHp > 0 && liveKinHp < HARE.hpNatural) {
		const gained = Math.min(HARE.hpNatural - liveKinHp, amount);
		if (gained > 0) {
			liveKinHp += gained;
			useGame.setState({ kinHp: liveKinHp });
			publishPets();
		}
	} else if (rewardRegen.on === "charm" && charm?.who !== "kin" && liveHareHp > 0 && liveHareHp < HARE.hpNatural) {
		const gained = Math.min(HARE.hpNatural - liveHareHp, amount);
		if (gained > 0) {
			liveHareHp += gained;
			useGame.setState({ hareHp: liveHareHp });
			publishPets();
		}
	}
}
function settleBeast(result) {
	if (result.charmFx) {
		charmFx = result.charmFx;
		tamePrimed = false;
	}
	if (result.tameKeep) primeTame();
	if (result.charmKeep && result.charmSeconds && result.charmSeconds > 0 && !jug && !wyvern && !avatar && !automaton) keepCharm(result.charmSeconds);
	if (result.jugCall) summonJug(result.jugCall === "loyalty");
	if (result.jugLeave) {
		if (jug) dismissJug("Leave. Courier Carrie is sent away.");
		if (charm) releaseCharm(null);
	}
	if (result.jugStance && jug) {
		jug.stance = result.jugStance;
		const line = result.jugStance === "fight" ? `Courier Carrie is sent at the ${HARE.name}.` : result.jugStance === "heel" ? "Courier Carrie heels." : "Courier Carrie stays.";
		useGame.getState().pushLog(line, "info");
		publishPets();
	} else if (result.jugStance && charm) {
		charm.stance = result.jugStance;
		const otherUp = charm.who === "kin" ? liveHareHp > 0 : liveKinHp > 0;
		const line = result.jugStance === "fight" ? otherUp ? `The charmed ${HARE.name} is ordered to fight the other ${HARE.name}.` : `The ${HARE.name} is ordered to fight. There is no other foe, so it does not swing.` : result.jugStance === "heel" ? `The charmed ${HARE.name} heels.` : `The charmed ${HARE.name} stays.`;
		if (result.jugStance === "fight") charm.swing = HARE.delay / 60;
		useGame.getState().pushLog(line, "info");
		publishPets();
	}
	if (result.familiar && jug && !jug.familiar) {
		const next = familiarMaxHp(CARRIE_HP_STANDIN);
		const gift = Math.max(0, next - jug.max);
		jug.max = next;
		jug.hp = Math.min(jug.max, jug.hp + gift);
		jug.familiar = true;
		useGame.getState().pushLog(`Familiar raises Courier Carrie to ${Math.ceil(jug.hp)} / ${jug.max} HP. Base attributes +3 are not folded into the checkparam.`, "info");
		publishPets();
	}
	if (result.familiar && charm && !charm.familiar && !jug) {
		charm.familiar = true;
		charm.left += FAMILIAR_CHARM_SECONDS;
		useGame.getState().pushLog("Familiar adds 30 minutes to the remaining charm. The rarab keeps its printed HP.", "info");
		publishPets();
	}
	if (result.jugSnarl && jug) {
		const moved = moveEnmity("player", "jug", .99);
		useGame.getState().pushLog(moved.ce === 0 && moved.ve === 0 ? "Snarl. You had no enmity to move." : `Snarl moves ${moved.ce} cumulative and ${moved.ve} volatile enmity onto Courier Carrie.`, "info");
		useGame.setState({ ...hateNow() });
	}
	if (result.sic) {
		if (!spendSic()) {
			delete liveRecasts.Sic;
			useGame.getState().pushLog("Sic needs 3 Ready charges.", "miss");
		} else if (result.sic.queued && charm) {
			charm.sicQueued = true;
			publishPets();
		} else if (result.sic.move) fireCharmSic(result.sic.move);
	}
	if (result.jugReady && jug) {
		const move = readyByName(result.jugReady);
		if (move && spendReady(move.charges)) {
			applyReady(move.name);
			publishPets();
		}
	}
	if (result.reward) feedReward(result.reward);
}
var BREATH_SECONDS = 1.6;
function beginBreath(element, remove, x, z) {
	if (!wyvern) return;
	wyvern.element = element;
	wyvern.remove = remove;
	wyvern.aimX = x;
	wyvern.aimZ = z;
	wyvern.anim = "breath";
	wyvern.animLeft = BREATH_SECONDS;
}
function spendWyvernTp() {
	if (!wyvern || wyvern.tp === 0) return;
	wyvern.tp = 0;
	publishPets();
}
function breatheOffense() {
	if (!wyvern || !foeLiving()) return;
	const spent = wyvern.tp;
	const element = wyvernBreathChoice(burstElements(chainFoe()));
	const matched = magicBurstOf(breathElement(element), chainFoe());
	beginBreath(element, null, foeStand.x, foeStand.z);
	const chance = Math.min(95, 50 + wyvernStrafe() + elementalBreathAccuracy(spent));
	if (Math.random() * 100 >= chance) {
		useGame.getState().pushLog(`The wyvern's ${element} Breath misses the ${HARE.name}.`, "miss");
		spendWyvernTp();
		return;
	}
	let dmg = wyvernBreathDamage(wyvern.hp);
	landWyvernHit(dmg, matched ? `The wyvern's ${element} Breath magic bursts ${matched}. The ${HARE.name} takes ${dmg} points of damage.` : `The wyvern's ${element} Breath hits the ${HARE.name} for ${dmg} points of damage.`, 0);
	spendWyvernTp();
}
function wyvernStrafe() {
	if (trustPetOwner !== "shikaree-z") return useGame.getState().sheet.strafe;
	const state = useGame.getState();
	return trustCombat("shikaree-z", trustSubOf(state.party, "shikaree-z"), trustGearOf(state.party, "shikaree-z")).strafe ?? 0;
}
function healCandidate(threshold, selfOnly, master = "player") {
	const state = useGame.getState();
	const rows = [];
	const near = (x, z) => Math.hypot(x - wyvernAt.x, z - wyvernAt.z) <= 14;
	const considerPlayer = !selfOnly || master === "player";
	if (considerPlayer && !state.ko && state.hp > 0 && hpCap() > 0) {
		const ratio = state.hp / hpCap();
		if (ratio <= threshold && near(playerStand.x, playerStand.z)) rows.push({
			who: "player",
			x: playerStand.x,
			z: playerStand.z,
			ratio
		});
	}
	if (!selfOnly || master !== "player") for (const id of state.party.summoned) {
		if (selfOnly && id !== master) continue;
		const trust = liveTrusts[id];
		const place = trustPlaces[id];
		if (!trust || trust.ko || trust.hp <= 0 || trust.maxHp <= 0 || !place) continue;
		const ratio = trust.hp / trust.maxHp;
		if (ratio <= threshold && near(place.x, place.z)) rows.push({
			who: id,
			x: place.x,
			z: place.z,
			ratio
		});
	}
	rows.sort((a, b) => a.ratio - b.ratio);
	return rows[0] ?? null;
}
function breatheHeal() {
	if (!wyvern) return;
	const target = wyvern.heals.shift();
	if (!target) return;
	const tier = healingBreathTier(75);
	const amount = healingBreathAmount(wyvern.max, 75, wyvern.tp);
	beginBreath("Heal", null, target.x, target.z);
	let gain = 0;
	let who = "you";
	if (target.who === "player") {
		const state = useGame.getState();
		gain = Math.min(Math.max(0, hpCap() - state.hp), amount);
		if (gain > 0) useGame.setState({ hp: state.hp + gain });
	} else {
		const trust = liveTrusts[target.who];
		if (trust) {
			gain = Math.min(Math.max(0, trust.maxHp - trust.hp), amount);
			if (gain > 0) {
				trust.hp += gain;
				useGame.setState({ trustVitals: trustVitalsNow() });
			}
			who = trustName(target.who);
		}
	}
	const bonded = trustPetOwner === "shikaree-z" ? !!liveTrusts["shikaree-z"]?.buffs.some((buff) => buff.name === "Spirit Bond") : liveBuffs.some((buff) => buff.name === "Spirit Bond");
	let petGain = 0;
	if (bonded) {
		petGain = Math.min(Math.max(0, wyvern.max - wyvern.hp), amount);
		if (petGain > 0) wyvern.hp += petGain;
	}
	const state = useGame.getState();
	if (gain > 0) state.pushLog(target.who === "player" ? `The wyvern's ${tier.name} restores ${gain} HP.` : `The wyvern's ${tier.name} restores ${gain} HP to ${who}.`, "hit");
	if (petGain > 0) state.pushLog(`Spirit Bond restores ${petGain} HP to the wyvern.`, "hit");
	else if (gain <= 0) state.pushLog(`${tier.name} finds nothing to heal.`, "info");
	const healed = gain + petGain;
	if (healed > 0) {
		const cured = cureEnmity(75, healed);
		creditHate(cured.ce, cured.ve, false, "wyvern");
		useGame.setState({ ...hateNow() });
	}
	spendWyvernTp();
}
function breatheRemove() {
	if (!wyvern) return;
	const ownerTrust = trustPetOwner === "shikaree-z" ? liveTrusts["shikaree-z"] : null;
	const names = ownerTrust ? ownerTrust.buffs.map((buff) => buff.name) : liveAilments.map((row) => row.name);
	const breath = removeBreathFor(75, names);
	if (!breath) return;
	const place = ownerTrust ? trustPlaces["shikaree-z"] : null;
	beginBreath("Remove", breath.ailment, place?.x ?? playerStand.x, place?.z ?? playerStand.z);
	if (breath.ailment === "Doom") {
		const state = useGame.getState();
		let skill = 0;
		if (ownerTrust) {
			const sub = trustSubOf(state.party, "shikaree-z");
			const kit = trustKit("shikaree-z", sub, state.jobLevels);
			skill = combinedSkill("Healing Magic", "DRG", 75, sub, sub ? kit.levels[sub] ?? 0 : 0);
		} else skill = combinedSkill("Healing Magic", state.mainJob, 75, state.subJob, state.subJob ? subjobLevel(75) : 0);
		if (!cursnaDoomLands(skill, Math.random())) {
			useGame.getState().pushLog("The wyvern's Remove Curse fails to remove Doom.", "miss");
			spendWyvernTp();
			return;
		}
	}
	if (ownerTrust) {
		ownerTrust.buffs = ownerTrust.buffs.filter((buff) => buff.name !== breath.ailment);
		useGame.setState({ trustVitals: trustVitalsNow() });
	} else {
		liveAilments = liveAilments.filter((row) => row.name !== breath.ailment);
		useGame.setState({ ailments: liveAilments.map((row) => ({ ...row })) });
	}
	useGame.getState().pushLog(`The wyvern's ${breath.name} removes ${breath.ailment}.`, "info");
	spendWyvernTp();
}
function wyvernOf(master) {
	if (master === "shikaree-z") return trustWyvern();
	return wyvern;
}
function noteWyvernSkill(master = "player") {
	const pet = wyvernOf(master);
	if (!pet) return;
	if (master !== "shikaree-z" && useGame.getState().mainJob !== "DRG") return;
	pet.queue.push("ws");
	if (pet.queue.length > 3) pet.queue.shift();
}
/** A finished spell. Summoning magic does not ask for Healing Breath. The check is the HP after the spell. */
function noteWyvernSpell(school, master = "player") {
	const pet = wyvernOf(master);
	if (!pet || school === "summoning") return;
	if (master !== "shikaree-z" && useGame.getState().mainJob !== "DRG") return;
	const threshold = healingThreshold(pet.kind);
	if (threshold == null) return;
	const target = healCandidate(threshold, pet.kind === "hybrid", master);
	if (!target) return;
	pet.heals.push({
		who: target.who,
		x: target.x,
		z: target.z
	});
	pet.queue.push("spell");
	if (pet.queue.length > 3) {
		if (pet.queue.shift() === "spell") pet.heals.shift();
	}
}
function playWyvernOrder(order) {
	if (!wyvern) return;
	if (order === "spell") {
		breatheHeal();
		return;
	}
	if (wyvern.kind === "defensive") breatheRemove();
	else breatheOffense();
}
function tickWyvern(dt) {
	const state = useGame.getState();
	if (!wyvernBoot) {
		wyvernBoot = true;
		if (!wyvern && state.mainJob === "DRG" && !state.ko) summonWyvern();
	}
	if (state.ko || state.mainJob !== "DRG") {
		if (wyvern) dismissWyvern("The wyvern leaves.");
	} else advanceWyvern(dt);
}
function advanceWyvern(dt) {
	const state = useGame.getState();
	const trust = liveTrusts["shikaree-z"];
	if (!wyvern) return;
	if (wyvern.animLeft > 0) {
		wyvern.animLeft = Math.max(0, wyvern.animLeft - dt);
		if (wyvern.animLeft === 0) wyvern.anim = "idle";
	}
	if (wyvern.regenLeft > 0 && wyvern.regen > 0) {
		wyvern.regenLeft = Math.max(0, wyvern.regenLeft - dt);
		wyvern.regenAcc += dt;
		const ticks = Math.floor(wyvern.regenAcc / 3);
		if (ticks > 0) {
			wyvern.regenAcc -= ticks * 3;
			const gained = Math.min(Math.max(0, wyvern.max - wyvern.hp), wyvern.regen * ticks);
			if (gained > 0) wyvern.hp += gained;
		}
		if (wyvern.regenLeft === 0) {
			wyvern.regen = 0;
			useGame.getState().pushLog("The wyvern's Regen wears off.", "info");
		}
	}
	if (wyvern.queue.length > 0 && wyvern.anim === "idle") {
		const order = wyvern.queue.shift();
		if (order) playWyvernOrder(order);
	}
	const onList = foeIsKin() ? state.kinHate.ce > 0 || state.kinHate.ve > 0 : state.hate.ce > 0 || state.hate.ve > 0;
	const trustMaster = trustPetOwner === "shikaree-z";
	const fighting = trustMaster ? foeLiving() && (trust?.engaged === true || state.engaged || anyHate()) : state.engaged && foeLiving() && onList;
	if (fighting) {
		wyvern.swing -= dt;
		if (wyvern.swing <= 0) {
			wyvern.swing = 0;
			if (actorPlace("wyvern", wyvernAt).melee && wyvern.anim === "idle") {
				wyvern.swing = wyvernSwingSeconds();
				wyvern.anim = "bite";
				wyvern.animLeft = .72;
				const rate = hitRate(362, targetEvasion(HARE.evasion, foeEnfeebleRows()), HARE.level - 75);
				if (Math.random() * 100 >= rate) useGame.getState().pushLog(`The wyvern misses the ${HARE.name}.`, "miss");
				else {
					const dmg = wyvernMeleeDamage(75, false);
					landWyvernHit(dmg, `The wyvern hits the ${HARE.name} for ${dmg} points of damage.`, monsterTpGain(tpPerHit(320)));
					addPetTp("wyvern", tpPerHit(320));
				}
			}
		}
	} else if (wyvern.anim === "bite") {
		wyvern.anim = "idle";
		wyvern.animLeft = 0;
	}
}
function tickPartyPets(dt) {
	const state = useGame.getState();
	const run = (id, tick) => {
		if (!trustPets[id]) return;
		const trust = liveTrusts[id];
		if (!state.party.summoned.includes(id) || !trust || trust.ko) {
			const line = id === "shikaree-z" ? "The wyvern leaves." : id === "lhu-mhakaracca" ? "Courier Carrie leaves." : id === "nashmeira" ? "The automaton leaves." : "The avatar leaves.";
			dismissTrustPet(id, line);
			return;
		}
		holdTrustPet(id, tick);
	};
	run("shikaree-z", () => advanceWyvern(dt));
	run("lhu-mhakaracca", () => tickJug(dt));
	run("nashmeira", () => tickAutomaton(dt));
	run("karaha-baruha", () => tickAvatar(dt));
	if (trustPets["shikaree-z"] || trustPets["lhu-mhakaracca"] || trustPets["nashmeira"] || trustPets["karaha-baruha"]) publishPets();
}
function allyBehindDragoon() {
	const dx = playerStand.x - foeStand.x;
	const dz = playerStand.z - foeStand.z;
	const span = Math.hypot(dx, dz);
	if (span < .8) return null;
	const ux = dx / span;
	const uz = dz / span;
	let best = null;
	for (const id of useGame.getState().party.summoned) {
		const trust = liveTrusts[id];
		const place = trustPlaces[id];
		if (!trust || trust.ko || !place) continue;
		const ax = place.x - playerStand.x;
		const az = place.z - playerStand.z;
		if (ax * ux + az * uz < .6) continue;
		if (Math.abs(ax * uz - az * ux) > 1.8) continue;
		const dist = Math.hypot(ax, az);
		if (!best || dist < best.dist) best = {
			id,
			dist
		};
	}
	return best?.id ?? null;
}
/** Even split of damage the wyvern has already taken. The dragoon's half ignores their own damage taken and Phalanx. Stoneskin can absorb it. */
function shareWyvernHit(amount) {
	if (!wyvern || amount <= 0) return;
	const ownerTrust = trustPetOwner === "shikaree-z" ? liveTrusts["shikaree-z"] : null;
	const bonded = ownerTrust ? ownerTrust.buffs.some((buff) => buff.name === "Spirit Bond") : liveBuffs.some((buff) => buff.name === "Spirit Bond");
	if (!bonded) wyvern.hp = Math.max(0, wyvern.hp - amount);
	else {
		const split = spiritBondSplit(amount);
		wyvern.hp = Math.max(0, wyvern.hp - split.pet);
		if (ownerTrust) takeTrustBondShare(ownerTrust, split.master);
		else takeBondShare(split.master);
	}
	if (wyvern && wyvern.hp <= 0) dismissWyvern("The wyvern falls.");
}
function takeTrustBondShare(trust, master) {
	const n = Math.floor(master);
	if (n <= 0 || !trust) return;
	let lost = n;
	const skin = trust.buffs.find((buff) => buff.name === "Stoneskin" && (buff.power ?? 0) > 0);
	if (skin) {
		const absorbed = Math.min(skin.power ?? 0, lost);
		lost -= absorbed;
		const remain = (skin.power ?? 0) - absorbed;
		if (remain <= 0) {
			trust.buffs = trust.buffs.filter((buff) => buff.name !== "Stoneskin");
			useGame.getState().pushLog("Shikaree Z's Stoneskin wears off.", "info");
		} else {
			skin.power = remain;
			useGame.getState().pushLog(`Shikaree Z's Stoneskin absorbs ${absorbed} points of damage.`, "info");
		}
	}
	if (lost > 0) {
		trust.hp = Math.max(0, trust.hp - lost);
		useGame.getState().pushLog(`Shikaree Z takes ${lost} of the wyvern's damage.`, "hit");
		if (trust.hp === 0) {
			trust.ko = true;
			trust.engaged = false;
			trust.cast = null;
			dropHateRow("shikaree-z");
			useGame.getState().pushLog("Shikaree Z is knocked out.", "miss");
			dismissWyvern("The wyvern leaves.");
		}
	}
	useGame.setState({
		trustVitals: trustVitalsNow(),
		...hateNow()
	});
}
function takeBondShare(master) {
	const n = Math.floor(master);
	if (n <= 0) return;
	let lost = n;
	const skin = liveBuffs.find((buff) => buff.name === "Stoneskin" && (buff.skin ?? 0) > 0);
	if (skin?.skin != null) {
		const absorbed = Math.min(skin.skin, lost);
		lost -= absorbed;
		const remain = skin.skin - absorbed;
		if (remain <= 0) {
			liveBuffs = liveBuffs.filter((buff) => buff.name !== "Stoneskin");
			useGame.getState().pushLog("Stoneskin wears off.", "info");
		} else {
			liveBuffs = liveBuffs.map((buff) => buff.name === "Stoneskin" ? {
				...buff,
				skin: remain
			} : buff);
			useGame.getState().pushLog(`Stoneskin absorbs ${absorbed} points of damage.`, "info");
		}
		useGame.setState({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
	}
	if (lost <= 0) return;
	const state = useGame.getState();
	const hp = Math.max(0, state.hp - lost);
	state.pushLog(`You take ${lost} of the wyvern's damage.`, "hit");
	if (hp === 0) {
		const abandoned = dropPlayerHate();
		const ready = liveBuffs.find((buff) => isReraiseSpell(buff.name));
		if (ready && isReraiseSpell(ready.name)) livePending = reraiseOnKo(ready.name, hpCap(), liveWeakness);
		else if (liveBuffs.some((buff) => buff.song?.family === "hymnus")) livePending = hymnusOnKo(hpCap(), liveWeakness);
		else livePending = null;
		statusLostOnDeath();
		useGame.setState({
			hp: 0,
			...hateNow(),
			weakness: liveWeakness,
			pendingRaise: livePending,
			buffs: liveBuffs.map((buff) => ({ ...buff })),
			ailments: liveAilments.map((row) => ({ ...row })),
			ko: true,
			engaged: false,
			targeted: false,
			selfTargeted: false,
			crystalTargeted: false,
			trustTargeted: null,
			petTargeted: null,
			homeAsk: false,
			healPhase: "off",
			engageAfterHeal: false
		});
		dismissWyvern("The wyvern leaves.");
		dismissJug("Courier Carrie leaves.");
		dismissAutomaton("The automaton leaves.");
		if (charmOwner !== "lhu-mhakaracca") releaseCharm("The charm breaks.");
		state.pushLog("You are knocked out.", "miss");
		if (abandoned && !anyHate()) state.pushLog(`The ${HARE.name} loses interest.`, "info");
		return;
	}
	loseCe("player", ceLostOnHit(lost, hpCap()));
	useGame.setState({
		hp,
		...hateNow()
	});
}
function settleDragoon(result) {
	if (result.enmityKeep != null && result.enmityKeep < 1) {
		const row = hateRows.find((entry) => entry.id === "player");
		if (row) writePlayerRow(Math.floor(row.ce * result.enmityKeep), Math.floor(row.ve * result.enmityKeep));
	}
	if (result.ceToOne) {
		const row = hateRows.find((entry) => entry.id === "player");
		if (row && (row.ce > 0 || row.ve > 0)) writePlayerRow(1, row.ve);
	}
	if (result.halveBehind) {
		const state = useGame.getState();
		const behind = allyBehindDragoon();
		if (!behind) state.pushLog("No one is standing behind you.", "info");
		else {
			const row = hateRows.find((entry) => entry.id === behind);
			const who = trustName(behind);
			if (!row) state.pushLog(`${who} is behind you, and had no enmity.`, "info");
			else {
				row.ce = Math.floor(row.ce / 2);
				row.ve = Math.floor(row.ve / 2);
				if (!seatRow(row, row.ce, row.ve, actorNear(behind, false))) hateRows = hateRows.filter((entry) => entry.id !== behind);
				syncLiveHate();
				state.pushLog(`${who} loses half their enmity.`, "info");
			}
		}
	}
	if (result.wyvernCall) {
		if (trustPetOwner === "shikaree-z") {
			useGame.getState().pushLog("That wyvern answers Shikaree Z.", "miss");
			delete liveRecasts["Call Wyvern"];
		} else summonWyvern();
	}
	const hers = trustPetOwner === "shikaree-z";
	if (hers && (result.linkCost != null || result.surgeAbsorb || result.wyvernDismiss)) {
		useGame.getState().pushLog("That wyvern answers Shikaree Z.", "miss");
		if (result.linkCost != null) delete liveRecasts["Spirit Link"];
		if (result.surgeAbsorb) {
			delete liveRecasts["Spirit Surge"];
			if (liveBuffs.some((buff) => buff.name === "Spirit Surge")) liveBuffs = liveBuffs.filter((buff) => buff.name !== "Spirit Surge");
		}
		if (result.wyvernDismiss) delete liveRecasts.Dismiss;
	} else if (result.linkCost != null && result.linkCost > 0 && wyvern) {
		const state = useGame.getState();
		let offer = result.linkCost;
		let absorbed = 0;
		const skin = liveBuffs.find((buff) => buff.name === "Stoneskin" && (buff.skin ?? 0) > 0);
		if (skin?.skin != null && offer > 0) {
			absorbed = Math.min(skin.skin, offer);
			offer -= absorbed;
			const remain = skin.skin - absorbed;
			if (remain <= 0) {
				liveBuffs = liveBuffs.filter((buff) => buff.name !== "Stoneskin");
				state.pushLog("Stoneskin wears off.", "info");
			} else {
				liveBuffs = liveBuffs.map((buff) => buff.name === "Stoneskin" ? {
					...buff,
					skin: remain
				} : buff);
				state.pushLog(`Stoneskin absorbs ${absorbed} points of damage.`, "info");
			}
		}
		const spent = Math.min(offer, Math.max(0, state.hp - 1));
		const healed = Math.min(Math.max(0, wyvern.max - wyvern.hp), spiritLinkHeal(spent, state.sheet.mnd, 75));
		wyvern.hp += healed;
		wyvern.regen = spiritLinkRegen(75);
		wyvern.regenLeft = 90;
		wyvern.regenAcc = 0;
		const dots = new Set(SPIRIT_LINK_DOTS);
		const had = liveAilments.filter((row) => dots.has(row.name));
		if (had.length) liveAilments = liveAilments.filter((row) => !dots.has(row.name));
		useGame.setState({
			hp: state.hp - spent,
			buffs: liveBuffs.map((buff) => ({ ...buff })),
			...had.length ? { ailments: liveAilments.map((row) => ({ ...row })) } : {}
		});
		state.pushLog(`Spirit Link spends ${spent} HP. The wyvern recovers ${healed} HP.`, "info");
		state.pushLog(`The wyvern gains Regen of ${wyvern.regen} for 90 seconds.`, "info");
		if (had.length) state.pushLog(`Spirit Link removes ${had.map((row) => row.name).join(", ")}.`, "info");
		if (state.sheet.empathy) {
			const gift = liveBuffs.find((buff) => buff.name !== "Wyvern" && buff.name !== "Stoneskin");
			if (gift) state.pushLog(`Empathy copies ${gift.name} onto the wyvern.`, "info");
		}
	}
	if (!hers && result.surgeAbsorb) {
		const had = wyvern != null;
		const remain = wyvern ? wyvern.hp : 0;
		const gift = wyvern ? Math.floor(wyvern.max * .25) : 0;
		dismissWyvern(null);
		const state = useGame.getState();
		const max = state.sheet.hp + gift;
		const healed = Math.min(max, state.hp + remain);
		delete liveRecasts.Jump;
		delete liveRecasts["High Jump"];
		delete liveRecasts["Super Jump"];
		useGame.setState({
			hp: healed,
			hpGift: gift
		});
		state.pushLog(had ? `Spirit Surge absorbs the wyvern. Maximum HP rises by ${gift}. ${remain} HP is restored. You have ${healed} / ${max} HP.` : "Spirit Surge. No wyvern was out, so the HP gift is 0.", "info");
	} else if (!hers && result.wyvernDismiss) {
		const fullPet = wyvern != null && wyvern.hp >= wyvern.max;
		dismissWyvern(null);
		if (fullPet || result.callWyvernReady) delete liveRecasts["Call Wyvern"];
	}
	if (result.jumpHit && (result.jumpDmg ?? 0) > 0) {
		const state = useGame.getState();
		const gain = state.sheet.tpHit;
		hitFoe(result.jumpDmg ?? 0);
		useGame.setState({
			tp: Math.min(3e3, state.tp + gain),
			dealt: useGame.getState().dealt + (result.jumpDmg ?? 0),
			...foePatch()
		});
	}
	if (result.defenseDown) {
		const park = foeIsKin() ? borrowKin() : null;
		try {
			const existing = liveEnfeebles.find((row) => row.name === "Defense Down");
			const stronger = existing != null && (existing.power == null || existing.power >= .25);
			if (!existing) {
				liveEnfeebles = [...liveEnfeebles, {
					name: "Defense Down",
					left: 60,
					power: .2
				}];
				useGame.getState().pushLog(`Defense Down lands on the ${HARE.name}. Defense −20% for 60 seconds.`, "info");
			} else if (stronger) useGame.getState().pushLog(`A stronger Defense Down is already on the ${HARE.name}.`, "info");
			else if (existing.left < 60) {
				existing.left = 60;
				existing.power = .2;
				useGame.getState().pushLog(`Defense Down is refreshed to 60 seconds.`, "info");
			}
			useGame.setState(struckPatch(park));
		} finally {
			if (park) restoreKin(park);
		}
	}
	if ((result.tpCut ?? 0) > 0) {
		const state = useGame.getState();
		if (foeIsKin()) {
			liveKinTp = Math.max(0, liveKinTp - (result.tpCut ?? 0));
			useGame.setState({ kinTp: liveKinTp });
		} else {
			const next = Math.max(0, state.hareTp - (result.tpCut ?? 0));
			useGame.setState({ hareTp: next });
		}
		state.pushLog(`High Jump cuts ${result.tpCut} TP from the ${HARE.name}.`, "info");
	}
	if (result.surgeAbsorb || result.wyvernCall || result.wyvernDismiss || result.ceToOne || result.enmityKeep != null || result.halveBehind || result.callWyvernReady) useGame.setState({
		...hateNow(),
		recasts: { ...liveRecasts },
		buffs: liveBuffs.map((buff) => ({ ...buff }))
	});
}
function castTrustPact(id, trust, name) {
	if (id !== "karaha-baruha") return;
	const pet = trustAvatarPet();
	const pact = pactByName(name);
	if (!pet || !pact || pact.merit || pact.avatar !== pet.name) {
		useGame.getState().pushLog(pet ? `${pet.name} does not know ${name}.` : "Karaha-Baruha has no avatar.", "miss");
		delete trust.recasts[pactRecastId(name)];
		return;
	}
	const cost = pactMp(pact, 75);
	if ((trust.recasts[pactRecastId(name)] ?? 0) > 0) return;
	if (trust.mp < cost) {
		useGame.getState().pushLog(`Karaha-Baruha does not have enough MP for ${name}.`, "miss");
		return;
	}
	trust.mp -= cost;
	for (const row of SMN_PACTS) if (!row.merit && row.kind === pact.kind) trust.recasts[pactRecastId(row.name)] = 60;
	const summoning = combinedSkill("Summoning Magic", "SMN", 75, null, 0);
	holdTrustPet(id, () => landCommandedPact(name, false, 75, id, summoning));
	trust.lock = 1;
	useGame.setState({ trustVitals: trustVitalsNow() });
}
function trustCharmYards() {
	const place = trustPlaces["lhu-mhakaracca"];
	if (!place || !charm) return null;
	const at = charm.who === "kin" ? kinAt : hareAt;
	return Math.hypot(place.x - at.x, place.z - at.z);
}
function settleTrustCharm(trust, result, foeId) {
	if (result.charmFx || result.charmKeep) {
		charmFx = result.charmFx ?? (result.charmKeep ? "land" : "miss");
		noteCharmAimFrom(foeId);
		const spentTame = trustTamePrimed;
		trustTamePrimed = false;
		if (result.charmKeep && result.charmSeconds > 0) {
			const pack = foeId && foeId !== "hare" && foeId !== "kin";
			const kept = pack ? keepPackCharm(foeId, result.charmSeconds, "lhu-mhakaracca") : keepCharm(result.charmSeconds, "lhu-mhakaracca", foeId === "kin" ? "kin" : "hare");
			if (!kept) {
				delete trust.recasts.Charm;
				useGame.getState().pushLog("Lhu Mhakaracca cannot charm. A pet is already out.", "miss");
			} else if (spentTame) useGame.getState().pushLog("Tame's 10 was used.", "info");
		} else {
			useGame.getState().pushLog(spentTame ? "Lhu Mhakaracca's Charm fails. Tame's 10 was used." : "Lhu Mhakaracca's Charm fails.", "miss");
			if (foeId && foeId !== "hare" && foeId !== "kin") pullPack(livePack(), foeId, 75);
		}
		creditCharmHate(foeId, result);
		return;
	}
	if (result.tameKeep) {
		primeTrustTame(foeId);
		return;
	}
	useGame.getState().pushLog(result.text && String(result.text).includes("no effect") ? "Tame has no effect. Someone else is on the hate list." : "Lhu Mhakaracca's Tame misses.", "miss");
}
function settleTrustBeast(id, trust, result, actionName, foeId) {
	if (result.jugCall) {
		if (!callTrustCarrie(false)) delete trust.recasts[actionName];
		return;
	}
	if (actionName === "Charm" || result.charmKeep || result.charmFx) {
		settleTrustCharm(trust, result, foeId);
		return;
	}
	if (actionName === "Tame") {
		settleTrustCharm(trust, result, foeId);
		return;
	}
	if (trustJug()) {
		holdTrustPet(id, () => {
			if (result.jugLeave && jug) dismissJug("Leave. Courier Carrie is sent away.");
			if (result.jugStance && jug) {
				jug.stance = result.jugStance;
				const line = result.jugStance === "fight" ? `Courier Carrie is sent at the ${HARE.name}.` : result.jugStance === "heel" ? "Courier Carrie heels." : "Courier Carrie stays.";
				useGame.getState().pushLog(line, "info");
			}
			if (result.jugReady && jug) {
				const move = readyByName(result.jugReady);
				if (move && (jug.charges ?? 0) >= move.charges) {
					jug.charges -= move.charges;
					applyReady(move.name);
				}
			}
			if (result.familiar && jug && !jug.familiar) {
				const next = familiarMaxHp(CARRIE_HP_STANDIN);
				const gift = Math.max(0, next - jug.max);
				jug.max = next;
				jug.hp = Math.min(jug.max, jug.hp + gift);
				jug.familiar = true;
				useGame.getState().pushLog(`Familiar raises Courier Carrie to ${Math.ceil(jug.hp)} / ${jug.max} HP.`, "info");
			}
			publishPets();
		});
		return;
	}
	if (charm && charmOwner === id) {
		if (result.jugLeave) releaseCharm(`Lhu Mhakaracca releases the ${HARE.name}.`);
		else if (result.jugStance) {
			charm.stance = result.jugStance;
			const otherUp = charm.who === "kin" ? liveHareHp > 0 : liveKinHp > 0;
			const line = result.jugStance === "fight" ? otherUp ? `The charmed ${HARE.name} is ordered to fight the other ${HARE.name}.` : `The ${HARE.name} is ordered to fight. There is no other foe, so it does not swing.` : result.jugStance === "heel" ? `The charmed ${HARE.name} heels.` : `The charmed ${HARE.name} stays.`;
			if (result.jugStance === "fight") charm.swing = HARE.delay / 60;
			useGame.getState().pushLog(line, "info");
		} else if (result.familiar && !charm.familiar) {
			charm.familiar = true;
			charm.left += FAMILIAR_CHARM_SECONDS;
			useGame.getState().pushLog("Familiar adds 30 minutes to the remaining charm. The rarab keeps its printed HP.", "info");
		} else if (result.sic) {
			if ((charm.charges ?? 0) < 3) {
				delete trust.recasts.Sic;
				useGame.getState().pushLog("Sic needs 3 Ready charges.", "miss");
			} else {
				charm.charges = 0;
				charm.chargeAcc = 0;
				if (result.sic.queued) charm.sicQueued = true;
				else if (result.sic.move) fireCharmSic(result.sic.move);
			}
		}
		publishPets();
		return;
	}
	if (packCharm && packCharm.owner === id) {
		if (result.jugLeave) releasePackCharm(`Lhu Mhakaracca releases the ${HARE.name}.`);
		else if (result.jugStance) {
			packCharm.stance = result.jugStance;
			const line = result.jugStance === "fight" ? `The charmed ${HARE.name} is ordered to fight. It does not bite while charmed.` : result.jugStance === "heel" ? `The charmed ${HARE.name} heels.` : `The charmed ${HARE.name} stays.`;
			useGame.getState().pushLog(line, "info");
		} else if (result.familiar && !packCharm.familiar) {
			packCharm.familiar = true;
			packCharm.left += FAMILIAR_CHARM_SECONDS;
			useGame.getState().pushLog("Familiar adds 30 minutes to the remaining charm. The rarab keeps its printed HP.", "info");
		} else if (result.sic) {
			if ((packCharm.charges ?? 0) < 3) {
				delete trust.recasts.Sic;
				useGame.getState().pushLog("Sic needs 3 Ready charges.", "miss");
			} else {
				packCharm.charges = 0;
				packCharm.chargeAcc = 0;
				const move = result.sic.move ?? "a move";
				useGame.getState().pushLog(result.sic.queued ? `Sic. The charmed ${HARE.name} will use a move when it reaches 1000 TP.` : `Sic. The charmed ${HARE.name} uses ${move}.`, "info");
			}
		}
		publishPets();
		return;
	}
	if (result.jugLeave || result.jugStance || result.jugReady || result.familiar || result.sic) {
		useGame.getState().pushLog("Lhu Mhakaracca has no pet.", "miss");
		delete trust.recasts[actionName];
	}
}
function settleTrustDragoon(id, trust, result, sheet) {
	if (id !== "shikaree-z") return;
	const owns = trustWyvern() != null;
	if (result.wyvernCall) {
		if (!summonWyvern("shikaree-z")) delete trust.recasts["Call Wyvern"];
		return;
	}
	if (!owns && (result.linkCost != null || result.surgeAbsorb || result.wyvernDismiss)) {
		useGame.getState().pushLog("That wyvern is not Shikaree Z's.", "miss");
		if (result.linkCost != null) delete trust.recasts["Spirit Link"];
		if (result.surgeAbsorb) {
			delete trust.recasts["Spirit Surge"];
			trust.buffs = trust.buffs.filter((buff) => buff.name !== "Spirit Surge");
		}
		if (result.wyvernDismiss) delete trust.recasts.Dismiss;
		return;
	}
	holdTrustPet(id, () => {
	if (result.linkCost != null && result.linkCost > 0 && wyvern) {
		let offer = result.linkCost;
		const skin = trust.buffs.find((buff) => buff.name === "Stoneskin" && (buff.power ?? 0) > 0);
		if (skin && offer > 0) {
			const absorbed = Math.min(skin.power ?? 0, offer);
			offer -= absorbed;
			const remain = (skin.power ?? 0) - absorbed;
			if (remain <= 0) {
				trust.buffs = trust.buffs.filter((buff) => buff.name !== "Stoneskin");
				useGame.getState().pushLog("Shikaree Z's Stoneskin wears off.", "info");
			} else {
				skin.power = remain;
				useGame.getState().pushLog(`Shikaree Z's Stoneskin absorbs ${absorbed} points of damage.`, "info");
			}
		}
		const spent = Math.min(offer, Math.max(0, trust.hp - 1));
		const healed = Math.min(Math.max(0, wyvern.max - wyvern.hp), spiritLinkHeal(spent, sheet?.mnd ?? 0, 75));
		wyvern.hp += healed;
		wyvern.regen = spiritLinkRegen(75);
		wyvern.regenLeft = 90;
		wyvern.regenAcc = 0;
		trust.hp = Math.max(1, trust.hp - spent);
		publishPets();
		useGame.getState().pushLog(`Shikaree Z's Spirit Link spends ${spent} HP. The wyvern recovers ${healed} HP.`, "info");
		useGame.getState().pushLog(`The wyvern gains Regen of ${wyvern.regen} for 90 seconds.`, "info");
	}
	if (result.surgeAbsorb) {
		const had = wyvern != null;
		const remain = wyvern ? wyvern.hp : 0;
		const gift = wyvern ? Math.floor(wyvern.max * .25) : 0;
		dismissWyvern(null);
		trust.surgeGift = gift;
		trust.maxHp += gift;
		trust.hp = Math.min(trust.maxHp, trust.hp + remain);
		delete trust.recasts.Jump;
		delete trust.recasts["High Jump"];
		delete trust.recasts["Super Jump"];
		useGame.getState().pushLog(had ? `Shikaree Z's Spirit Surge absorbs the wyvern. Maximum HP rises by ${gift}. ${remain} HP is restored.` : "Spirit Surge. No wyvern was out, so the HP gift is 0.", "info");
	} else if (result.wyvernDismiss) {
		const fullPet = wyvern != null && wyvern.hp >= wyvern.max;
		dismissWyvern("Shikaree Z dismisses the wyvern.");
		if (fullPet || result.callWyvernReady) delete trust.recasts["Call Wyvern"];
	}
	});
}
function shown(n) {
	return n <= 0 ? 0 : Math.ceil(n);
}
function hareInt() {
	const down = liveHareDebuffs.reduce((n, row) => n + (row.stat === "int" ? row.down : 0), 0);
	const status = liveEnfeebles.reduce((n, row) => n + (row.name === "INT Down" ? row.power ?? 0 : 0), 0);
	return Math.max(0, HARE.int - down - (liveStatDown?.down ?? 0) - status);
}
function hareMeva(element) {
	return Math.max(0, adjustedMagicEvasion(HARE.level, element, liveEnfeebles) - colureNamed(liveEnfeebles, "Languor"));
}
/** Elemental magic only. The bearing is the target's place when the spell lands. */
function geoElementalChant(spell, sheet) {
	const none = { attack: 0, accuracy: 0, burst: 0, crit: 0 };
	if (!spell || spell.school !== "elemental") return none;
	const geoMain = sheet.job === "GEO";
	const geoSub = !geoMain && sheet.sub === "GEO";
	if (!geoMain && !geoSub) return none;
	const angle = cardinalAngle(foeStand.x - playerStand.x, foeStand.z - playerStand.z);
	return cardinalChant(geoMain ? 75 : sheet.subLevel, geoMain ? "main" : "sub", isRaNuke(spell.name), liveBuffs.some((buff) => buff.name === "Collimated Fervor"), angle);
}
function chantLine(chant) {
	const bits = [];
	if (chant.attack) bits.push(`magic attack +${chant.attack}`);
	if (chant.accuracy) bits.push(`magic accuracy +${chant.accuracy}`);
	if (chant.burst) bits.push(`magic burst +${chant.burst}%`);
	if (chant.crit) bits.push(`magic crit +${chant.crit}%`);
	if (!bits.length) return "";
	return ` Cardinal Chant: ${bits.join(", ")}.`;
}
/** Skill plus dSTAT plus the spell's printed magic accuracy. Ninjutsu skips dSTAT. */
function castMagicAccuracy(spell, sheet, songCombined = 0) {
	const element = castElement(spell);
	const gear = sheet?.gearMacc || 0;
	const bonus = (spell.macc ?? 0) + klimaformMacc(element, liveBuffs) + colureNamed(liveBuffs, "Focus") + gear;
	const intel = sheet.int + colureStat(liveBuffs, "INT");
	const mind = sheet.mnd + colureStat(liveBuffs, "MND");
	const chr = sheet.chr + colureStat(liveBuffs, "CHR");
	const skillOf = (name) => grimoireSkill(name, combinedSkill(name, sheet.job, 75, sheet.sub, sheet.subLevel), 75, sheet.job === "SCH" || sheet.sub === "SCH" ? liveBuffs : []);
	if (spell.song) return composedMagicAccuracy(songCombined, chr - HARE.chr, bonus);
	if (spell.nin) return composedMagicAccuracy(skillOf("Ninjutsu"), null, gear);
	if (spell.nuke || spell.debuff || spell.helix) {
		const chant = geoElementalChant(spell, sheet);
		return composedMagicAccuracy(skillOf("Elemental Magic"), intel - hareInt(), bonus + chant.accuracy);
	}
	if (spell.banish || spell.holy || spell.flash || spell.repose) return composedMagicAccuracy(skillOf("Divine Magic"), mind - HARE.mnd, bonus);
	if (spell.siphon || spell.enfeeble && (isBioSpell(spell.enfeeble) || spell.enfeeble === "Stun")) return composedMagicAccuracy(skillOf("Dark Magic"), intel - hareInt(), bonus);
	if (spell.enfeeble && (spell.castGroup === "white" || spell.enfeeble === "Distract" || spell.enfeeble === "Frazzle")) return composedMagicAccuracy(skillOf("Enfeebling Magic"), mind - HARE.mnd, bonus);
	if (spell.enfeeble) return composedMagicAccuracy(skillOf("Enfeebling Magic"), intel - hareInt(), bonus);
	return composedMagicAccuracy(0, null, bonus);
}
function rollFixed(seconds, macc, element) {
	return applyFixedDuration(seconds, macc - hareMeva(element), Math.random);
}
function halfNote(state, left) {
	return state === 1 ? ` 1/2 resist, so ${left} seconds.` : "";
}
/** Plague is on the hare, not on the kin the player may be facing. */
function harePlagueUp() {
	if (playerFoe() === "kin") return useGame.getState().hareEnfeebles.some((row) => row.name === "Plague");
	return liveEnfeebles.some((row) => row.name === "Plague");
}
/** Lowing's Plague. Every 3 seconds, 50 TP. The hare has no MP pool, so the 3 MP is not drained. */
function stepPlague(row, dt, kin) {
	const step = debuffTick(row.left, row.acc ?? 0, dt);
	if (step.ticks > 0) {
		const cut = 50 * step.ticks;
		if (kin) {
			const before = liveKinTp;
			liveKinTp = Math.max(0, liveKinTp - cut);
			const lost = before - liveKinTp;
			if (lost > 0) {
				useGame.setState({ kinTp: liveKinTp });
				useGame.getState().pushLog(`Plague cuts ${lost} TP from the ${HARE.name}.`, "info");
			}
		} else {
			const before = useGame.getState().hareTp;
			const next = Math.max(0, before - cut);
			const lost = before - next;
			if (lost > 0) {
				useGame.setState({ hareTp: next });
				useGame.getState().pushLog(`Plague cuts ${lost} TP from the ${HARE.name}.`, "info");
			}
		}
	}
	if (step.left <= 0) {
		useGame.getState().pushLog("Plague wears off.", "info");
		return null;
	}
	return {
		...row,
		left: step.left,
		acc: step.acc
	};
}
function clearSleep() {
	const next = liveEnfeebles.filter((row) => !isSleepSpell(row.name) && row.name !== "Lullaby" && row.name !== "Sheep Song" && row.name !== "Soporific" && row.name !== "Yawn" && row.name !== "Charmed");
	if (next.length === liveEnfeebles.length) return false;
	liveEnfeebles = next;
	return true;
}
var songOrder = 1;
function singerSkill(job, sub, rangeId) {
	const subLv = sub && sub !== job ? subjobLevel(75) : 0;
	const singing = combinedSkill("Singing", job, 75, sub, subLv);
	const kind = instrumentKind(ITEMS$1[rangeId ?? ""]?.kind);
	return {
		skill: songSkill(singing, kind === "string" ? combinedSkill("String Instrument", job, 75, sub, subLv) : kind === "wind" ? combinedSkill("Wind Instrument", job, 75, sub, subLv) : 0),
		slots: songSlots(kind != null)
	};
}
function songBuff(land) {
	return {
		name: land.spell,
		left: land.left,
		power: land.power,
		song: {
			family: land.family,
			spell: land.spell,
			order: songOrder++
		}
	};
}
function giveSong(buffs, land, slots) {
	return placeSong(buffs, songBuff(land), slots);
}
/** Enemy songs. Finale does not strip the player's own enfeebles. The hare has no buffs of its own. */
function landHostileSong(land, owner, macc) {
	if (land.hook === "dispel") {
		if (land.claims) creditHate(land.ce, land.ve, true, owner);
		return "No effect.";
	}
	const rolled = applyFixedDuration(land.left, macc - hareMeva(land.element), Math.random);
	if (rolled.state === 2) {
		if (land.claims) creditHate(land.ce, land.ve, true, owner);
		return `The ${HARE.name} resists the spell.`;
	}
	const left = rolled.left;
	const note = halfNote(rolled.state, left);
	if (land.hook === "sleep") {
		liveEnfeebles = liveEnfeebles.filter((row) => !isSleepSpell(row.name) && row.name !== "Lullaby" && row.name !== "Charmed" && row.name !== "Soporific" && row.name !== "Yawn");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Lullaby",
			left,
			wide: land.wide
		}];
	} else if (land.hook === "charm") {
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Charmed" && !isSleepSpell(row.name) && row.name !== "Lullaby" && row.name !== "Yawn");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Charmed",
			left
		}];
	} else if (land.hook === "slow") {
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Elegy");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Elegy",
			left,
			power: land.power
		}];
	} else if (land.hook === "dot") {
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Requiem");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Requiem",
			left,
			dot: land.dot ?? land.power,
			acc: 0
		}];
	} else if (land.hook === "maccDown") {
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Threnody");
		const element = threnodyElement(land.spell);
		liveEnfeebles = [...liveEnfeebles, {
			name: "Threnody",
			left,
			power: land.power,
			...element ? { element } : {}
		}];
	}
	if (land.claims) creditHate(land.ce, land.ve, true, owner);
	return `${land.text}${note}`;
}
function splashSongs(land, slots, onlyId) {
	const ids = onlyId ? [onlyId] : summonedTrustIds();
	let hit = false;
	for (const id of ids) {
		const trust = liveTrusts[id];
		const place = trustPlaces[id];
		if (!trust || trust.ko || !place || place.party > 12) continue;
		trust.buffs = giveSong(trust.buffs, land, slots);
		hit = true;
	}
	return hit;
}
function clearBind() {
	if (!liveEnfeebles.some((row) => row.name === "Bind")) return false;
	liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Bind");
	return true;
}
/** Wasp Sting and Viper Bite. A stronger poison already on the hare is left alone. */
function landWsPoison(label, dot, left) {
	const current = liveEnfeebles.find((row) => isPoisonSpell(row.name));
	if (current && (current.dot ?? 0) > dot) return `${label}. A stronger poison is already on the ${HARE.name}.`;
	liveEnfeebles = liveEnfeebles.filter((row) => !isPoisonSpell(row.name));
	liveEnfeebles = [...liveEnfeebles, {
		name: "Poison",
		left,
		dot,
		acc: 0
	}];
	return `${label}. Poison slips ${dot} HP every 3 seconds for ${Math.round(left)} seconds.`;
}
/**
* Sniper Shot lowers INT by 10. The page says the loss decays and does not print a timer,
* so it uses Skullbreaker's 140 seconds, one point every 10 seconds.
* The critical-hit rates are blank, so they are not rolled.
*/
function landMarksmanshipStatus(name, hit) {
	if (!hit || name !== "Sniper Shot") return null;
	liveStatDown = {
		name: "Sniper Shot",
		stat: "int",
		down: 10,
		left: 140,
		decay: 10
	};
	return `Sniper Shot lowers the ${HARE.name}'s INT by 10. It decays.`;
}
/**
* Additional effects printed on the dagger pages.
* Wind skills already deal magical damage. These are the statuses.
* Shadowstitch's chance is not printed, so the bind lands. Duration is the published 15 to 30 seconds.
*/
function landDaggerStatus(name, tp, hit) {
	if (!hit) return null;
	if (name === "Wasp Sting") return landWsPoison(name, 1, ftpAt([
		90,
		105,
		135
	], tp));
	if (name === "Viper Bite") return landWsPoison(name, 3, ftpAt([
		90,
		120,
		180
	], tp));
	if (name === "Shadowstitch") {
		const left = 15 + Math.floor(Math.random() * 16);
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Bind");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Bind",
			left
		}];
		return `Shadowstitch binds the ${HARE.name} for ${left} seconds.`;
	}
	return null;
}
/**
* Additional effects on the great katana pages.
* Hobaku's chance is not printed, so the stun lands. Yukikaze's accuracy down is not printed, so Blind's line is used.
*/
function landGkStatus(name, hit, int, mnd) {
	if (!hit) return null;
	const hare = HARE.name;
	if (name === "Tachi: Hobaku") {
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Stun");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Stun",
			left: 2
		}];
		return `Tachi: Hobaku stuns the ${hare}.`;
	}
	if (name === "Tachi: Yukikaze") {
		const current = liveEnfeebles.find((row) => row.name === "Blind" || row.name === "Blind II");
		if (current && !enfeebleCanLand(current.name, "Blind")) return `Tachi: Yukikaze. A stronger blind is already on the ${hare}.`;
		const accDown = blindPotency(int - hareInt());
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Blind");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Blind",
			left: 60,
			accDown
		}];
		return `Tachi: Yukikaze blinds the ${hare} for 60 seconds. Accuracy −${accDown}.`;
	}
	if (name === "Tachi: Gekko") {
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Silence");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Silence",
			left: 45
		}];
		return `Tachi: Gekko silences the ${hare} for 45 seconds.`;
	}
	if (name === "Tachi: Kasha") {
		const current = liveEnfeebles.find((row) => row.name === "Paralyze" || row.name === "Paralyze II");
		if (current && !enfeebleCanLand(current.name, "Paralyze")) return `Tachi: Kasha. A stronger paralyze is already on the ${hare}.`;
		const power = paralyzeChance(mnd - HARE.mnd);
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Paralyze");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Paralyze",
			left: 60,
			power
		}];
		return `Tachi: Kasha paralyzes the ${hare} for 60 seconds.`;
	}
	if (name === "Tachi: Ageha") {
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Defense Down");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Defense Down",
			left: 180
		}];
		return `Tachi: Ageha lowers the ${hare}'s defense for 180 seconds.`;
	}
	return null;
}
/** Critical hit evasion down from Stardiver. The page prints +5% for 60 seconds. */
function critEvasionDown(rows = liveEnfeebles) {
	return rows.find((row) => row.name === "Crit. Evasion Down")?.power ?? 0;
}
/**
* Additional effects on the polearm pages.
* Leg Sweep's chance is not printed, so a hit stuns. The unresisted duration is up to 10 seconds, not the 2 second spell.
* Stardiver's critical hit evasion down is printed. Vorpal and Skewer rates are not, so they are not rolled here.
*/
function landPolearmStatus(name, hit) {
	if (!hit) return null;
	const hare = HARE.name;
	if (name === "Leg Sweep") {
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Stun");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Stun",
			left: 10
		}];
		let text = `Leg Sweep stuns the ${hare} for 10 seconds.`;
		const action = useGame.getState().hareAction;
		if (stunCancels(action)) {
			text = `${text} ${stunInterruptLine(action)}`;
			useGame.setState({ hareAction: null });
		}
		return text;
	}
	if (name === "Stardiver") {
		liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Crit. Evasion Down");
		liveEnfeebles = [...liveEnfeebles, {
			name: "Crit. Evasion Down",
			left: 60,
			power: 5
		}];
		return `Stardiver lowers the ${hare}'s critical hit evasion. Critical hit rate +5% for 60 seconds.`;
	}
	return null;
}
function isSpike(name) {
	return name === "Blaze Spikes" || name === "Ice Spikes" || name === "Shock Spikes";
}
/** Main-job change cancels Reraise. The buff is not dispelled by anything in this yard. */
function takeReraise() {
	const current = liveBuffs.find((buff) => isReraiseSpell(buff.name));
	if (!current) return null;
	liveBuffs = liveBuffs.filter((buff) => !isReraiseSpell(buff.name));
	return current.name;
}
var regenAcc = 0;
var refreshAcc = 0;
var meditateAcc = 0;
var meditateGained = 0;
function takeMeditate(main, gained, tp, ticks) {
	const landed = meditateGain(main, gained, tp, ticks);
	const done = landed.gain > 0 && landed.gained >= meditateTick(main).cap;
	return {
		...landed,
		text: landed.gain > 0 ? `Meditate grants ${landed.gain} TP.${done ? " That is all of it." : ""}` : ""
	};
}
var shownLocks = {
	action: 0,
	ability: 0
};
function lockState() {
	const clock = lockClock();
	shownLocks = clock;
	return {
		actionLock: clock.action,
		abilityLock: clock.ability
	};
}
function publishCombat(set) {
	set({
		buffs: liveBuffs.map((buff) => ({ ...buff })),
		recasts: { ...liveRecasts },
		...lockState(),
		...hateNow(),
		hareDebuffs: liveHareDebuffs.map((row) => ({ ...row })),
		hareEnfeebles: liveEnfeebles.map((row) => ({ ...row })),
		dotQueue: pendingDots.map((row) => ({ ...row }))
	});
}
var savedJobs = {
	main: "BLM",
	sub: null,
	race: "hume"
};
var liveMagian = emptyMagian();
var initial = fitLoadout({ ...DEFAULT_LOADOUT }, savedJobs.main);
function full(sheet) {
	const gift = useGame.getState().hpGift || 0;
	const painted = applyFieldFood(sheet, liveBuffs, playerLevel());
	return {
		sheet: painted,
		hp: painted.hp + gift,
		mp: painted.mp
	};
}
function playerLevel() {
	const s = useGame.getState();
	return s.jobLevels?.[s.mainJob] ?? 75;
}
function sameGear(a, b) {
	if (!a || !b) return false;
	for (const slot of ["main", "sub", "range", "ammo", "head", "neck", "ear1", "ear2", "body", "hands", "ring1", "ring2", "back", "waist", "legs", "feet"]) {
		if (a[slot] !== b[slot]) return false;
	}
	return true;
}
function desiredGearMode() {
	const s = useGame.getState();
	if (s.cast) return "magic";
	if (liveShot?.ws) return "ws";
	if (s.engaged) return "tp";
	return "idle";
}
/** Wear a set over the base. Empty slots keep the layer underneath. Does not refill HP. */
function wearGear(mode, keepTp = false, engaged) {
	const s = useGame.getState();
	const job = s.mainJob;
	const sub = s.subJob;
	const base = s.gearBase ?? s.loadout;
	const sets = s.equipSets ?? emptyEquipSets();
	const fighting = engaged ?? (mode === "tp" ? true : s.engaged);
	const next = resolveGear(mode, base, sets, job, sub, fighting);
	if (s.gearMode === mode && sameGear(s.loadout, next)) return false;
	const lostTp = !keepTp && s.tp > 0 && tpLostOnWeaponChange(s.loadout, next);
	const painted = applyFieldFood(sheetFor(next, s.race, job, sub, s.blueSet), liveBuffs, playerLevel());
	const gift = s.hpGift || 0;
	useGame.setState({
		loadout: next,
		gearMode: mode,
		sheet: painted,
		hp: Math.min(s.hp, painted.hp + gift),
		mp: Math.min(s.mp, painted.mp),
		...lostTp ? { tp: 0 } : {}
	});
	if (lostTp) useGame.getState().pushLog("TP is lost.", "info");
	return true;
}
function syncGear() {
	const mode = desiredGearMode();
	wearGear(mode, mode === "magic" || mode === "ws");
}
function paintedPools() {
	const s = useGame.getState();
	const raw = sheetFor(s.loadout, s.race, s.mainJob, s.subJob, s.blueSet);
	const sheet = applyFieldFood(raw, liveBuffs, playerLevel());
	const gift = s.hpGift || 0;
	const hpDelta = sheet.hp - s.sheet.hp;
	const mpDelta = sheet.mp - s.sheet.mp;
	return {
		sheet,
		hp: Math.max(0, Math.min(sheet.hp + gift, s.hp + Math.max(0, hpDelta))),
		mp: Math.max(0, Math.min(sheet.mp, s.mp + Math.max(0, mpDelta)))
	};
}
function rememberFov(fov) {
	setExtra({ ...readExtra(), fov });
	return fov;
}
/** Equipped maximum plus Spirit Surge's HP gift. */
function hpCap() {
	const s = useGame.getState();
	return s.sheet.hp + (s.hpGift || 0);
}
function keepHotbar(hotbar, job, sub, sheet, rangeId, blueSet = []) {
	const range = rangedBar(job, sub, rangeId);
	const groups = hotbarGroups(sheet.skillName, sheet.skill, sheet.weaponName, job, sub, range, job === "BLU" ? blueSet : []);
	const allowed = new Set(groups.find((group) => group.title === "Abilities")?.actions.map((action) => action.name) ?? []);
	const pacts = new Set(groups.find((group) => group.title === "Blood Pacts")?.actions.map((action) => action.id) ?? []);
	const spells = new Set(groups.find((group) => group.title === "Spells")?.actions.map((action) => action.name) ?? []);
	return hotbar.map((id) => {
		const action = findAction(id);
		if (!action) return id;
		if (action.kind === "ability" && action.id.startsWith("pact:")) return pacts.has(action.id) ? id : null;
		if (action.kind === "ability") return allowed.has(action.name) ? id : null;
		if (action.kind === "spell") return spells.has(action.name) ? id : null;
		if (action.kind === "weaponskill" && canUse(action, sheet.skillName, sheet.skill, sheet.weaponName, job, range, sub)) return null;
		return id;
	});
}
var initialSheet = sheetFor(initial, savedJobs.race, savedJobs.main, savedJobs.sub);
var initialHotbar = keepHotbar(Array.from({ length: 12 }, () => null), savedJobs.main, savedJobs.sub, initialSheet, initial.range);
var initialGambits = blankBook();
var freshProgress = normalizeProgress({});
function clampPool(value, max) {
	if (value == null || !Number.isFinite(value)) return max;
	return Math.min(max, Math.max(0, Math.floor(value)));
}
function weaponRow(action) {
	const name = action.name;
	if (action.weapon === "Great Axe") return greatAxeByName(name);
	if (action.weapon === "Great Sword") return greatSwordByName(name);
	if (action.weapon === "Hand-to-Hand") return handByName(name);
	if (action.weapon === "Dagger") return daggerByName(name);
	if (action.weapon === "Axe") return axeByName(name);
	if (action.weapon === "Staff") return staffByName(name);
	if (action.weapon === "Club") return clubByName(name);
	if (action.weapon === "Scythe") return scytheByName(name);
	if (action.weapon === "Polearm") return polearmByName(name);
	if (action.weapon === "Katana") return katanaByName(name);
	if (action.weapon === "Great Katana") return greatKatanaByName(name);
	if (action.weapon === "Archery") return archeryByName(name);
	if (action.weapon === "Marksmanship") return marksmanshipByName(name);
	return swordByName(name);
}
var trustFloater = null;
function queueTrustFloater(row) {
	trustFloater = row;
}
export function takeTrustFloater() {
	const row = trustFloater;
	trustFloater = null;
	return row;
}
/** A physical hit that took HP may break the cast. Songs, Manafont, and a Shield Mastery block do not. */
function tryHitInterrupt(blocked) {
	const state = useGame.getState();
	const cast = state.cast;
	if (!cast) return;
	const spell = spellByName(cast.name);
	if (!spell || spell.song || spell.school === "singing") return;
	if (liveBuffs.some((buff) => buff.name === "Manafont")) return;
	if (blocked && state.sheet.shieldMastery > 0) return;
	const skillName = interruptSkill(spell.school);
	if (!skillName) return;
	const cap = combinedSkill(skillName, state.sheet.job, 75, state.sheet.sub, state.sheet.subLevel);
	const chance = spellInterruptChance({
		attackerLevel: HARE.level,
		defenderLevel: 75,
		skill: cap,
		skillCap: cap,
		sirdDown: -choralInterrupt(liveBuffs)
	});
	if (!(chance > 0) || Math.random() >= chance) return;
	const charges = liveBuffs.find((buff) => buff.name === "Aquaveil")?.charges ?? 0;
	if (charges > 0) {
		const left = charges - 1;
		if (left <= 0) {
			liveBuffs = liveBuffs.filter((buff) => buff.name !== "Aquaveil");
			useGame.getState().pushLog("Aquaveil absorbs the interruption and wears off.", "info");
		} else {
			liveBuffs = liveBuffs.map((buff) => buff.name === "Aquaveil" ? {
				...buff,
				charges: left
			} : buff);
			useGame.getState().pushLog(`Aquaveil absorbs the interruption. ${left} ${left === 1 ? "charge" : "charges"} left.`, "info");
		}
		useGame.setState({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
		return;
	}
	state.interruptCast();
}
export var useGame: UseBoundStore<StoreApi<GameState>> = create((set, get) => {
	const landChain = (chain) => {
		const owner = chain.owner ?? "player";
		const packId = chain.target;
		if (packId && packId !== "hare" && packId !== "kin" && livePack().some((row) => row.id === packId)) {
			const body = livePack().find((row) => row.id === packId);
			const living = body && body.hp > 0 && body.mode !== "dead" && body.mode !== "leash";
			if (living && chain.damage > 0) {
				creditDamage(chain.damage, owner);
				strikePack(body.id, chain.damage);
				set((s) => ({
					dealt: s.dealt + chain.damage,
					...hateNow()
				}));
			}
			useGame.getState().pushLog(`${chain.name} skillchain. ${chain.damage} damage.`, "hit");
			return;
		}
		const onKin = chain.target === "kin";
		if (chain.damage > 0) {
			if (onKin) {
				creditKinDamage(chain.damage, owner);
				const dead = chipKin(chain.damage);
				const woke = !dead && clearKinSleep();
				const unbound = !dead && clearKinBind(chain.damage);
				set((s) => ({
					dealt: s.dealt + chain.damage,
					kinHp: liveKinHp,
					...kinHateState(),
					kinEnfeebles: kinEnfeebles.map((row) => ({ ...row })),
					kinDebuffs: kinDebuffs.map((row) => ({ ...row }))
				}));
				if (woke) useGame.getState().pushLog(`The ${HARE.name} wakes.`, "info");
				if (unbound) useGame.getState().pushLog(`The ${HARE.name}'s Bind effect wears off.`, "info");
			} else {
				creditDamage(chain.damage, owner);
				const dead = chipHare(chain.damage);
				const woke = !dead && clearSleep();
				const unbound = !dead && bindWearsOff(chain.damage) && clearBind();
				set((s) => ({
					dealt: s.dealt + chain.damage,
					hareHp: liveHareHp,
					...hateNow(),
					hareEnfeebles: liveEnfeebles.map((row) => ({ ...row })),
					hareDebuffs: liveHareDebuffs.map((row) => ({ ...row })),
					statDown: liveStatDown ? {
						name: liveStatDown.name,
						stat: "int",
						down: liveStatDown.down,
						left: liveStatDown.left
					} : null
				}));
				if (woke) useGame.getState().pushLog(`The ${HARE.name} wakes.`, "info");
				if (unbound) useGame.getState().pushLog(`The ${HARE.name}'s Bind effect wears off.`, "info");
			}
		}
		useGame.getState().pushLog(`${chain.name} skillchain. ${chain.damage} damage.`, "hit");
	};
	const noteChain = () => {
		const noted = takeChainNote();
		if (noted?.held) useGame.getState().pushLog(`${noted.held} holds. It lands when the window opens.`, "info");
		else if (noted?.resonating?.length) useGame.getState().pushLog(`${noted.resonating.join(" / ")} resonates.`, "info");
	};
	const preferChainAction = (action, state) => {
		if (action.kind !== "weaponskill") return action;
		const opening = resonanceProps(playerFoe() ?? "hare");
		if (!opening?.length) return action;
		const chosen = weaponRow(action);
		if (!chosen) return action;
		let best = action;
		let bestRank = chainRank(opening, chosen.chains);
		const range = rangedBar(state.mainJob, state.subJob, useGame.getState().loadout.range);
		const groups = hotbarGroups(state.sheet.skillName, state.sheet.skill, state.sheet.weaponName, state.mainJob, state.subJob, range);
		for (const candidate of groups.find((group) => group.title === "Weapon skills")?.actions ?? []) {
			const row = weaponRow(candidate);
			if (!row?.chains.length) continue;
			const rank = chainRank(opening, row.chains);
			if (rank > bestRank) {
				best = candidate;
				bestRank = rank;
			}
		}
		return best;
	};
	const issueAction = (actionIn, aimAt, flexible = false, allyId = null, foeId = null) => {
		const state = useGame.getState();
		const action = flexible ? preferChainAction(actionIn, state) : actionIn;
		if (action !== actionIn) state.pushLog(`${action.name} closes the skillchain.`, "info");
		if (state.ko) return false;
		if (state.healPhase !== "off") {
			state.pushLog("You cannot use that command while healing.", "miss");
			return false;
		}
		if (state.cast) {
			state.pushLog("You cannot use that command while casting.", "miss");
			return false;
		}
		const locked = blockedByLock(action.kind);
		if (locked) {
			state.pushLog(locked, "miss");
			return false;
		}
		if (action.kind === "weaponskill") {
			let packWs = null;
			const ws = action.weapon === "Great Axe" ? greatAxeByName(action.name) : action.weapon === "Great Sword" ? greatSwordByName(action.name) : action.weapon === "Hand-to-Hand" ? handByName(action.name) : action.weapon === "Dagger" ? daggerByName(action.name) : action.weapon === "Axe" ? axeByName(action.name) : action.weapon === "Staff" ? staffByName(action.name) : action.weapon === "Club" ? clubByName(action.name) : action.weapon === "Scythe" ? scytheByName(action.name) : action.weapon === "Polearm" ? polearmByName(action.name) : action.weapon === "Katana" ? katanaByName(action.name) : action.weapon === "Great Katana" ? greatKatanaByName(action.name) : action.weapon === "Archery" ? archeryByName(action.name) : action.weapon === "Marksmanship" ? marksmanshipByName(action.name) : swordByName(action.name);
			if (!ws || action.weapon !== "Sword" && action.weapon !== "Great Axe" && action.weapon !== "Great Sword" && action.weapon !== "Hand-to-Hand" && action.weapon !== "Dagger" && action.weapon !== "Axe" && action.weapon !== "Staff" && action.weapon !== "Club" && action.weapon !== "Scythe" && action.weapon !== "Polearm" && action.weapon !== "Katana" && action.weapon !== "Great Katana" && action.weapon !== "Archery" && action.weapon !== "Marksmanship") {
				const blocked = canUse(action, state.sheet.skillName, state.sheet.skill, state.sheet.weaponName, state.mainJob, rangedBar(state.mainJob, state.subJob, state.loadout.range), state.subJob);
				state.pushLog(blocked ?? action.name, "info");
				return false;
			}
			const bow = action.weapon === "Archery" ? archeryBar(state.mainJob, state.subJob, state.loadout.range) : action.weapon === "Marksmanship" ? marksmanshipBar(state.mainJob, state.subJob, state.loadout.range) : null;
			if (action.weapon === "Archery" && !bow) {
				state.pushLog(`${action.name} needs a bow.`, "miss");
				return false;
			}
			if (action.weapon === "Marksmanship" && !bow) {
				state.pushLog(`${action.name} needs a gun.`, "miss");
				return false;
			}
			const ctx = {
				job: state.mainJob,
				main: true,
				level: 75,
				skill: bow ? bow.skill : state.sheet.skill,
				weaponName: bow ? bow.weapon : state.sheet.weaponName,
				quests: [],
				sub: state.subJob
			};
			const gate = state.mainJob === "BLM" ? blmCanUse(ws, ctx) : state.mainJob === "WHM" ? whmCanUse(ws, ctx) : state.mainJob === "RDM" ? rdmCanUse(ws, ctx) : state.mainJob === "MNK" ? mnkCanUse(ws, ctx) : state.mainJob === "THF" ? thfCanUse(ws, ctx) : state.mainJob === "SAM" ? samCanUse(ws, ctx) : state.mainJob === "RNG" ? rngCanUse(ws, ctx) : state.mainJob === "PLD" ? pldCanUse(ws, ctx) : state.mainJob === "NIN" ? ninCanUse(ws, ctx) : state.mainJob === "DRK" ? drkCanUse(ws, ctx) : state.mainJob === "DRG" ? drgCanUse(ws, ctx) : state.mainJob === "BST" ? bstCanUse(ws, ctx) : state.mainJob === "BLU" ? bluCanUse(ws, ctx) : state.mainJob === "PUP" ? pupCanUse(ws, ctx) : state.mainJob === "BRD" ? brdCanUse(ws, ctx) : state.mainJob === "SMN" ? smnCanUse(ws, ctx) : state.mainJob === "COR" ? corCanUse(ws, ctx) : state.mainJob === "DNC" ? dncCanUse(ws, ctx) : state.mainJob === "SCH" ? schCanUse(ws, ctx) : state.mainJob === "RUN" ? runCanUse(ws, ctx) : state.mainJob === "GEO" ? geoCanUse(ws, ctx) : action.weapon === "Great Axe" ? warCanUseGreatAxe(ws, ctx) : action.weapon === "Great Sword" ? warCanUseGreatSword(ws, ctx) : action.weapon === "Hand-to-Hand" ? warCanUseHand(ws, ctx) : action.weapon === "Dagger" ? warCanUseDagger(ws, ctx) : action.weapon === "Axe" ? warCanUseAxe(ws, ctx) : action.weapon === "Staff" ? warCanUseStaff(ws, ctx) : action.weapon === "Club" ? warCanUseClub(ws, ctx) : action.weapon === "Scythe" ? warCanUseScythe(ws, ctx) : action.weapon === "Polearm" ? warCanUsePolearm(ws, ctx) : action.weapon === "Katana" ? warCanUseKatana(ws, ctx) : action.weapon === "Great Katana" ? warCanUseGreatKatana(ws, ctx) : action.weapon === "Archery" ? warCanUseArchery(ws, ctx) : action.weapon === "Marksmanship" ? warCanUseMarksmanship(ws, ctx) : warCanUse(ws, ctx);
			if (gate) {
				state.pushLog(gate, "miss");
				return false;
			}
			let pack = null;
			if (aimAt === "self") {
				if (!ws.self) return false;
			} else {
				pack = forestFight();
				if (pack && fieldById(pack.id) && (state.targeted || state.engaged)) set({ targeted: false, engaged: false });
				if (!state.targeted && aimAt !== "enemy" && !pack) {
					state.pushLog(`${ws.name} needs a target.`, "miss");
					return false;
				}
				if (!pack && !state.targeted) set({
					targeted: true,
					selfTargeted: false,
					crystalTargeted: false,
					trustTargeted: null,
					petTargeted: null
				});
				const reach = action.weapon === "Archery" || action.weapon === "Marksmanship" ? autoAttackRange(action.weapon) : state.sheet.reach || autoAttackRange(state.sheet.skillName);
				if (pack) {
					const yards = Math.hypot(playerStand.x - pack.x, playerStand.z - pack.z);
					const wsReach = fieldById(pack.id) && action.weapon !== "Archery" && action.weapon !== "Marksmanship" ? fieldMeleeReach(reach) + 1 : reach;
					if (yards > wsReach) {
						state.pushLog(`${ws.name} is out of range.`, "miss");
						return false;
					}
					packWs = pack;
				} else if (action.weapon === "Archery" || action.weapon === "Marksmanship") {
					if (struckYards() > autoAttackRange(action.weapon)) {
						state.pushLog(`${ws.name} is out of range.`, "miss");
						return false;
					}
				} else if (!state.inRange) {
					state.pushLog(`${ws.name} is out of range.`, "miss");
					return false;
				}
			}
			if (state.tp < 1e3) {
				state.pushLog("Not enough TP.", "miss");
				return false;
			}
			if (action.weapon === "Archery" || action.weapon === "Marksmanship") {
				if (liveShot) {
					state.pushLog("Cannot act yet.", "miss");
					return false;
				}
				wearGear("ws", true);
				const ranged = useGame.getState();
				const paired = pairRanged(ranged.loadout.range, ranged.loadout.ammo);
				const family = action.weapon === "Marksmanship" ? "marksmanship" : "archery";
				if (!paired.ok || paired.shot.family !== family) {
					syncGear();
					state.pushLog(paired.ok ? action.weapon === "Marksmanship" ? "You do not have a gun equipped." : "You do not have a ranged weapon equipped." : paired.reason, "miss");
					return false;
				}
				const meikyo = liveBuffs.some((buff) => buff.name === "Meikyo Shisui");
				const sekkanoki = liveBuffs.some((buff) => buff.name === "Sekkanoki") || state.buffs.some((buff) => buff.name === "Sekkanoki");
				const konzen = liveBuffs.some((buff) => buff.name === "Konzen-ittai");
				const spent = ranged.tp;
				const kept = tpAfterWeaponSkill(ranged.tp, 0, sekkanoki, meikyo);
				if (sekkanoki && !meikyo) {
					liveBuffs = liveBuffs.filter((buff) => buff.name !== "Sekkanoki");
					state.pushLog("Sekkanoki wears off.", "info");
				}
				if (konzen) {
					liveBuffs = liveBuffs.filter((buff) => buff.name !== "Konzen-ittai");
					state.pushLog("Konzen-ittai wears off.", "info");
				}
				if (sekkanoki || konzen) set({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
				state.setTp(kept);
				keepAmmo(ranged.loadout.ammo);
				openRangedShot(paired.shot, { ws: {
					name: ws.name,
					tp: spent,
					grantReturn: !meikyo,
					sekkanoki: sekkanoki && !meikyo,
					konzen
				} });
				publishCombat(set);
				state.pushLog(ws.name, "info");
				return true;
			}
			wearGear("ws", true);
			{
				const swung = useGame.getState();
				state.sheet = swung.sheet;
				state.loadout = swung.loadout;
			}
			const fieldPark = pack && fieldById(pack.id) ? beginPackStrike(pack.id) : null;
			try {
			const foeRows = playerFoe() === "kin" ? kinEnfeebles : liveEnfeebles;
			const foeEva = targetEvasion(HARE.evasion, foeRows, distractPower(foeRows));
			const critExtra = foeRows.reduce((n, row) => row.name === "Crit. Evasion Down" ? n + (row.power ?? 0) : n, 0);
			const mods = meleeStats(state.sheet, state.buffs, protectPower(state.buffs), auspiceAccuracy(state.buffs), HARE.evasion - foeEva, playerBehind);
			const built = liveBuffs.find((buff) => buff.name === "Building Flourish");
			if (built) {
				mods.accuracy += 40;
				if ((built.power ?? 0) >= 2) mods.attack = Math.floor(mods.attack * 1.25);
				if ((built.power ?? 0) >= 3) mods.crit += 10;
				liveBuffs = liveBuffs.filter((buff) => buff.name !== "Building Flourish");
				set({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
				state.pushLog("Building Flourish wears off.", "info");
			}
			const blind = state.ailments.reduce((n, row) => row.name === "Blindness" ? n + (row.power ?? 0) : n, 0);
			const meleeHit = hitRate(Math.max(0, mods.accuracy - blind), foeEva, HARE.level - 75);
			const usedTp = effectiveTp(state.tp, state.sheet.fencerTp);
			const attackMod = ws.attackBonus ? 1 + ftpAt(ws.attackBonus, usedTp) : 1;
			const defenseMod = ws.defenseIgnored ? 1 - ftpAt(ws.defenseIgnored, usedTp) : 1;
			const critAdd = ws.critBonus ? ftpAt(ws.critBonus, usedTp) * 100 : 0;
			const rangedWs = state.sheet.skillName === "Archery" || state.sheet.skillName === "Marksmanship" || state.sheet.skillName === "Throwing";
			endTrickRound();
			const lined = useGame.getState().lineThiefStrike(rangedWs ? "ranged" : ws.kind === "physical" ? "melee" : "magic");
			let firstPdif = true;
			const cast = castSword({
				ws,
				tp: state.tp,
				fencerTp: state.sheet.fencerTp,
				stats: state.sheet,
				hp: hpCap(),
				currentHp: state.hp,
				dmg: state.sheet.dmg,
				fstr: state.sheet.fstr,
				pdif: () => {
					const forced = lined.sure && firstPdif;
					firstPdif = false;
					return rollSwordPdif(mods.attack * attackMod / Math.max(1, foeVitDefense(foeRows) * diaDefenseFactor(foeRows) * defenseMod), forced || Math.random() * 100 < mods.crit + critAdd + critExtra, Math.random, mods.pdifCap);
				},
				hitRoll: Math.random() * 100,
				hitRate: ws.unavoidable ? 100 : meleeHit,
				doubleAttack: fighterDoubleAttack(state.sheet.doubleAttack, liveBuffs),
				delay: state.sheet.delay,
				skill: state.sheet.skill,
				mp: state.mp,
				maxMp: state.sheet.mp,
				maxHp: hpCap(),
				targetMp: HARE.mp,
				targetInt: hareInt(),
				level: 75,
				sneakDex: lined.dex,
				trickAgi: lined.agi,
				sneakVia: lined.via,
				sureHit: lined.sure,
				trickHit: lined.hit && !lined.sure
			});
			const meikyo = liveBuffs.some((buff) => buff.name === "Meikyo Shisui");
			const sekkanoki = liveBuffs.some((buff) => buff.name === "Sekkanoki") || state.buffs.some((buff) => buff.name === "Sekkanoki");
			const stored = rolledStoreTp(state.sheet.storeTp || 1, liveBuffs);
			const returned = cast.kind === "miss" ? 0 : Math.floor(cast.tp * stored);
			const nextTp = tpAfterWeaponSkill(state.tp, returned, sekkanoki, meikyo);
			if (sekkanoki && !meikyo) {
				liveBuffs = liveBuffs.filter((buff) => buff.name !== "Sekkanoki");
				state.pushLog("Sekkanoki wears off.", "info");
			}
			state.setTp(nextTp);
			if (state.mainJob === "DRG") noteWyvernSkill();
			if (action.weapon === "Great Axe" || action.weapon === "Great Sword" || action.weapon === "Hand-to-Hand" || action.weapon === "Dagger" || action.weapon === "Axe" || action.weapon === "Staff" || action.weapon === "Club" || action.weapon === "Scythe" || action.weapon === "Polearm" || action.weapon === "Katana" || action.weapon === "Great Katana" || ws.motion) state.setWsMotion(ws.name);
			state.pushLog(sekkanoki && !meikyo ? cast.text.replace(/used TP \d+/, `fTP from ${Math.floor(state.tp)} TP, spent 1000`) : cast.text, cast.kind === "info" ? "info" : cast.kind);
			const sureCrit = lined.sure || ws.critBonus != null && ftpAt(ws.critBonus, usedTp) >= 1;
			if (packWs) {
				const level = state.jobLevels[state.mainJob] ?? 75;
				let packId = packWs.id;
				if (fieldById(packWs.id)) {
					engageField(packWs.id);
					if (cast.kind !== "miss" && cast.dmg > 0) {
						strikePack(packWs.id, cast.dmg);
						if (ws.kind === "physical") {
							const hits = Math.max(1, ws.hits);
							for (let i = 0; i < hits; i++) grantPlayerFoeTp(state.sheet.tpHit);
						} else grantPlayerFoeTp(100);
					}
				} else {
				if (!readSwingBody() || readSwingBody().id !== packWs.id) claimLive(packWs.id, level);
				const struck = readSwingBody();
				packId = struck && struck.id === packWs.id ? struck.id : packWs.id;
				notePackAct(packId);
				if (cast.kind !== "miss" && cast.dmg > 0) {
					creditDamage(cast.dmg, "player");
					strikePack(packId, cast.dmg);
				}
				}
				if (state.engaged || state.targeted) set({
					engaged: false,
					targeted: false
				});
				set((s) => ({
					last: {
						hit: cast.kind !== "miss" && cast.dmg > 0,
						crit: sureCrit,
						dmg: cast.dmg,
						fstr: state.sheet.fstr,
						base: state.sheet.dmg + state.sheet.fstr,
						ratio: mods.attack / (foeVitDefense(foeRows) * diaDefenseFactor(foeRows)),
						pdif: 0
					},
					swings: s.swings + 1,
					dealt: s.dealt + (cast.kind !== "miss" ? cast.dmg : 0)
				}));
				const fieldStill = fieldById(packId);
				const packStill = fieldStill ? null : livePack().find((row) => row.id === packId);
				const packLiving = fieldStill ? fieldStill.hp > 0 && fieldStill.mode !== "dead" && !fieldStill.away : packStill && packStill.hp > 0 && packStill.mode !== "dead" && packStill.mode !== "leash";
				if (packLiving && cast.kind !== "miss" && ws.chains.length) {
					const konzen = liveBuffs.some((buff) => buff.name === "Konzen-ittai");
					const chain = konzen && !peekChain(ws.chains, packId) ? offerKonzen(ws.chains[0] ?? "", cast.dmg, "player", packId) : offerWeaponSkill(ws.chains, cast.dmg, "player", packId);
					if (konzen) {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Konzen-ittai");
						state.pushLog("Konzen-ittai wears off.", "info");
					}
					if (chain) landChain(chain);
					else noteChain();
				} else if (liveBuffs.some((buff) => buff.name === "Konzen-ittai")) {
					liveBuffs = liveBuffs.filter((buff) => buff.name !== "Konzen-ittai");
					state.pushLog("Konzen-ittai wears off.", "info");
				}
			} else if (cast.dmg > 0) {
				state.recordSwing({
					hit: true,
					crit: sureCrit,
					dmg: cast.dmg,
					fstr: state.sheet.fstr,
					base: state.sheet.dmg + state.sheet.fstr,
					ratio: mods.attack / (foeVitDefense(foeRows) * diaDefenseFactor(foeRows)),
					pdif: 0
				});
			}
			if (!packWs && !ws.self && cast.kind !== "miss") {
				if (ws.kind === "physical") {
					if (cast.dmg > 0) {
						const hits = Math.max(1, ws.hits);
						for (let i = 0; i < hits; i++) grantPlayerFoeTp(state.sheet.tpHit);
					}
				} else if (ws.kind === "magical" || ws.kind === "breath" || cast.dmg > 0) grantPlayerFoeTp(100);
			}
			if (!packWs && !ws.self && cast.kind !== "miss" && ws.chains.length) {
				const konzen = liveBuffs.some((buff) => buff.name === "Konzen-ittai");
				const chainTarget = playerFoe() === "kin" ? "kin" : "hare";
				const chain = konzen && !peekChain(ws.chains, chainTarget) ? offerKonzen(ws.chains[0] ?? "", cast.dmg, "player", chainTarget) : offerWeaponSkill(ws.chains, cast.dmg, "player", chainTarget);
				if (konzen) {
					liveBuffs = liveBuffs.filter((buff) => buff.name !== "Konzen-ittai");
					state.pushLog("Konzen-ittai wears off.", "info");
				}
				if (chain) landChain(chain);
				else noteChain();
			}
			let enspell = 0;
			if (!packWs && !ws.self && ws.kind === "physical") {
				if (cast.kind !== "miss" && cast.dmg > 0) enspell = useGame.getState().applyAuspiceEnspell();
				else if (cast.kind === "miss") useGame.getState().noteAuspiceMiss();
			}
			state.setWsMark({
				name: ws.name,
				dmg: cast.dmg,
				hit: cast.kind !== "miss",
				self: ws.self === true,
				...packWs ? { packId: packWs.id } : {},
				...enspell > 0 ? { enspell } : {},
				...cast.mpGain > 0 ? { mp: cast.mpGain } : {},
				...cast.hpGain > 0 ? { hp: cast.hpGain } : {}
			});
			if (!packWs && ws.name === "Skullbreaker" && cast.kind === "hit") {
				liveStatDown = {
					name: "Skullbreaker",
					stat: "int",
					down: 10,
					left: 140,
					decay: 10
				};
				set({ statDown: {
					name: "Skullbreaker",
					stat: "int",
					down: 10,
					left: 140
				} });
			}
			if (cast.hpGain > 0 || cast.mpGain > 0) set({
				hp: Math.min(hpCap(), state.hp + cast.hpGain),
				mp: Math.min(state.sheet.mp, state.mp + cast.mpGain)
			});
			if (strikeFieldId) {
				const daggerNote = landDaggerStatus(ws.name, usedTp, cast.kind === "hit");
				const gkNote = landGkStatus(ws.name, cast.kind === "hit", state.sheet.int, state.sheet.mnd);
				const poleNote = landPolearmStatus(ws.name, cast.kind === "hit");
				if (daggerNote) state.pushLog(daggerNote, "info");
				if (gkNote) state.pushLog(gkNote, "info");
				if (poleNote) state.pushLog(poleNote, "info");
				if (sekkanoki || liveBuffs.every((buff) => buff.name !== "Konzen-ittai") && state.buffs.some((buff) => buff.name === "Konzen-ittai")) set({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
			} else if (!packWs) {
			const park = !ws.self && foeIsKin() ? borrowKin() : null;
			try {
				const daggerNote = landDaggerStatus(ws.name, usedTp, cast.kind === "hit");
				const gkNote = landGkStatus(ws.name, cast.kind === "hit", state.sheet.int, state.sheet.mnd);
				const poleNote = landPolearmStatus(ws.name, cast.kind === "hit");
				if (daggerNote) {
					state.pushLog(daggerNote, "info");
					set(struckPatch(park));
				}
				if (gkNote) {
					state.pushLog(gkNote, "info");
					set({
						...struckPatch(park),
						buffs: liveBuffs.map((buff) => ({ ...buff }))
					});
				} else if (poleNote) {
					state.pushLog(poleNote, "info");
					set({
						...struckPatch(park),
						...sekkanoki || liveBuffs.every((buff) => buff.name !== "Konzen-ittai") && state.buffs.some((buff) => buff.name === "Konzen-ittai") ? { buffs: liveBuffs.map((buff) => ({ ...buff })) } : {}
					});
				} else if (sekkanoki || liveBuffs.every((buff) => buff.name !== "Konzen-ittai") && state.buffs.some((buff) => buff.name === "Konzen-ittai")) set({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
			} finally {
				if (park) restoreKin(park);
			}
			} else if (sekkanoki || liveBuffs.every((buff) => buff.name !== "Konzen-ittai") && state.buffs.some((buff) => buff.name === "Konzen-ittai")) set({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
			if (!ws.self) {
				breakPlayerMazurka();
				breakPlayerTravel("offense");
			}
			endTrickRound();
			commitLock("weaponskill");
			set(lockState());
			syncGear();
			return true;
			} finally {
				if (fieldPark) endPackStrike(fieldPark);
			}
		}
		if (action.kind === "ranged") {
			if (liveShot) {
				state.pushLog("Cannot act yet.", "miss");
				return false;
			}
			const paired = pairRanged(state.loadout.range, state.loadout.ammo);
			if (!paired.ok) {
				state.pushLog(paired.reason, "miss");
				return false;
			}
			const fieldShot = forestFight();
			if (!state.targeted && aimAt !== "enemy" && !fieldShot) {
				state.pushLog("Ranged Attack needs a target.", "miss");
				return false;
			}
			if (!state.targeted && !fieldShot) set({
				targeted: true,
				selfTargeted: false,
				crystalTargeted: false,
				trustTargeted: null,
				petTargeted: null
			});
			const reach = autoAttackRange(paired.shot.skillName);
			if (fieldShot) {
				if (Math.hypot(playerStand.x - fieldShot.x, playerStand.z - fieldShot.z) > reach) {
					state.pushLog("Ranged Attack is out of range.", "miss");
					return false;
				}
			} else if (struckYards() > reach) {
				state.pushLog("Ranged Attack is out of range.", "miss");
				return false;
			}
			openRangedShot(paired.shot, {});
			publishCombat(set);
			state.pushLog("Ranged Attack.", "info");
			return true;
		}
		if (action.kind === "spell") {
			const spell = spellByName(action.name);
			if (!spell || spell.recast == null || spell.recast <= 0) {
				state.pushLog(`${action.name} has no recast.`, "miss");
				return false;
			}
			if ((liveRecasts[action.name] ?? 0) > 0) {
				state.pushLog(`${action.name} is not ready.`, "miss");
				return false;
			}
			const sealed = addendumHold(spell.name, liveBuffs, state.mainJob, state.subJob);
			if (sealed) {
				state.pushLog(sealed, "miss");
				return false;
			}
			const partyCure = Boolean(spell.cure || spell.blue != null && "cure" in spell.blue);
			const namedAlly = allyId && allyId !== "player" && liveTrusts[allyId] && !liveTrusts[allyId].ko ? allyId : null;
			const geoOnAlly = !!(spell.colure?.side === "geo" && geoAllies(spell.colure.effect) && namedAlly);
			const aimedTrust = partyCure && state.trustTargeted && liveTrusts[state.trustTargeted] && !liveTrusts[state.trustTargeted].ko ? state.trustTargeted : null;
			const songTrust = spell.song && !spell.song.hostile && state.buffs.some((buff) => buff.name === "Pianissimo") && state.trustTargeted && liveTrusts[state.trustTargeted] && !liveTrusts[state.trustTargeted].ko ? state.trustTargeted : null;
			const entrustTrust = spell.colure?.side === "indi" && state.buffs.some((buff) => buff.name === "Entrust") && state.trustTargeted && liveTrusts[state.trustTargeted] && !liveTrusts[state.trustTargeted].ko ? state.trustTargeted : null;
			if (aimedTrust) {
				const place = trustPlaces[aimedTrust];
				const limit = spell.range ?? PARTY_CAST_RANGE;
				if (!place || place.party > limit) {
					state.pushLog(`${action.name} is out of range.`, "miss");
					return false;
				}
			}
			if (songTrust) {
				const place = trustPlaces[songTrust];
				if (!place || place.party > 12) {
					state.pushLog(`${action.name} is out of range.`, "miss");
					return false;
				}
			}
			if (entrustTrust) {
				const place = trustPlaces[entrustTrust];
				if (!place || place.party > 18) {
					state.pushLog(`${action.name} is out of range.`, "miss");
					return false;
				}
			}
			if (spell.colure?.side === "geo") {
				if (state.mainJob !== "GEO") {
					state.pushLog("Geocolure requires Geomancer as the main job.", "miss");
					return false;
				}
				if (luopan) {
					state.pushLog("A luopan is already placed.", "miss");
					return false;
				}
				if (wyvern || avatar || jug || charm || packCharm || automaton) {
					state.pushLog("You already have a pet.", "miss");
					return false;
				}
				if (geoOnAlly) {
					const place = trustPlaces[namedAlly];
					if (!place || place.party > (spell.range ?? 21)) {
						state.pushLog(`${action.name} is out of range.`, "miss");
						return false;
					}
				}
			}
			const raiseTrust = spell.raise && state.trustTargeted && liveTrusts[state.trustTargeted]?.ko ? state.trustTargeted : null;
			if (raiseTrust) {
				const place = trustPlaces[raiseTrust];
				if (!place || place.party > (spell.range ?? 20)) {
					state.pushLog(`${action.name} is out of range.`, "miss");
					return false;
				}
			}
			const packBody = aimedTrust || songTrust || entrustTrust || raiseTrust || geoOnAlly || aimAt === "self" || state.selfTargeted || state.crystalTargeted ? null : forestFight();
			if (packBody && fieldById(packBody.id) && (state.targeted || state.engaged)) set({ targeted: false, engaged: false });
			const aim = raiseTrust || geoOnAlly ? "self" : spellAim(spell, aimedTrust ? "self" : aimAt === "self" ? "self" : aimAt === "enemy" || packBody ? "enemy" : state.targeted ? "enemy" : state.selfTargeted ? "self" : state.crystalTargeted ? "npc" : "none", HARE.undead, state.ko);
			if (aim == null) {
				state.pushLog(spell.raise ? `${action.name} can only be cast on someone who is knocked out.` : "Invalid target.", "miss");
				return false;
			}
			const packMark = packBody && aim === "enemy" ? packBody : null;
			const mark = packMark ? "pack" : foeId === "hare" || foeId === "kin" ? foeId : aim === "enemy" ? playerFoe() : null;
			if ((aim === "enemy" || foeId === "hare" || foeId === "kin") && (!mark || (mark === "pack" ? packMark.hp : mark === "kin" ? liveKinHp : liveHareHp) <= 0)) {
				state.pushLog("Invalid target.", "miss");
				return false;
			}
			if (aim === "enemy" && spell.range != null && (packMark ? packYards(packMark) : struckYards()) > spell.range) {
				state.pushLog(`${action.name} is out of range.`, "miss");
				return false;
			}
			if (aim === "enemy" && !packMark && charm != null && charm.who === playerFoe()) {
				state.pushLog("You cannot cast that on your pet.", "miss");
				return false;
			}
			if (spell.summon) {
				if (wyvern || avatar || jug || charm || packCharm || automaton) {
					state.pushLog("You already have a pet.", "miss");
					return false;
				}
				const summoned = summonByName(action.name);
				if (summoned?.family === "burst") {
					if (!state.targeted || state.hareHp <= 0) {
						state.pushLog("Atomos needs a foe.", "miss");
						return false;
					}
				}
				if (summoned?.astralGate && !state.buffs.some((buff) => buff.name === "Astral Flow")) {
					state.pushLog(`${action.name} can be summoned only during Astral Flow.`, "miss");
					return false;
				}
			}
			const manafont = state.buffs.some((buff) => buff.name === "Manafont");
			const allMp = spell.summon != null && summonCostsAllMp(spell.summon);
			let cost = spell.mp ?? 0;
			const chainspell = state.buffs.some((buff) => buff.name === "Chainspell");
			const composure = state.buffs.some((buff) => buff.name === "Composure");
			wearGear("magic", true);
			const casting = useGame.getState();
			const songBase = spell.song != null && state.buffs.some((buff) => buff.name === "Pianissimo") ? pianissimoCast(spell.cast ?? 0, true) : spell.cast ?? 0;
			let castTime = spell.school === "elemental" ? elementalCastSeconds(songBase, casting.sheet.celerity) : songBase;
			castTime = fastCastSeconds(castTime, casting.sheet.fastCast);
			const recastBase = state.buffs.some((buff) => buff.name === "Majesty") && spell.cure ? spell.recast * MAJESTY_RECAST : spell.recast;
			const recastRolled = chainspell ? 0 : composureRecast(fastCastRecast(hastedRecast(recastBase, hasteMagic(state.buffs)), casting.sheet.fastCast), composure);
			const scholar = scholarCastAdjust(spell, liveBuffs, allMp || manafont ? 0 : cost, castTime, recastRolled, state.mainJob, state.subJob, 75, state.subJob ? subjobLevel(75) : 0);
			if (scholar.block) {
				syncGear();
				state.pushLog(scholar.block, "miss");
				return false;
			}
			cost = allMp ? manafont ? 0 : state.mp : manafont ? 0 : scholar.cost;
			castTime = chainspell ? CHAINSPELL_CAST_SECONDS : scholar.cast;
			if (!allMp && !manafont && cost > 0 && Math.random() < Math.min(1, Math.max(0, casting.sheet.conserveMp + rollCombat(state.buffs).conserve / 100))) cost = conserveMpCost(cost, Math.floor(Math.random() * 4));
			if (state.mp < cost) {
				syncGear();
				state.pushLog("You do not have enough MP.", "miss");
				return false;
			}
			if (scholar.spent.length) {
				const spent = new Set(scholar.spent);
				liveBuffs = liveBuffs.filter((buff) => !spent.has(buff.name));
			}
			liveRecasts[action.name] = scholar.recast;
			commitLock("spell", castTime);
			useGame.getState().dropHide();
			if (castBreaksMazurka(spell)) {
				breakPlayerMazurka();
				breakPlayerTravel("offense");
			} else breakPlayerTravel("spell");
			const foeNow = packMark ? "pack" : foeId === "hare" || foeId === "kin" ? foeId : aim === "enemy" ? playerFoe() : null;
			const cast = {
				id: castSeq++,
				name: action.name,
				elapsed: 0,
				total: castTime,
				mpSpent: cost,
				recastName: action.name,
				cureMul: scholar.cureMul,
				nukeMul: scholar.nukeMul,
				regenHp: scholar.regenHp,
				regenSec: scholar.regenSec,
				...foeNow ? { foeId: foeNow } : {},
				...packMark ? { packId: packMark.id } : {},
				...scholar.spent.includes("Manifestation") ? { manifestRadius: 10 } : {},
				...spell.cure ? { cureUndead: !aimedTrust && aim === "enemy" } : {},
				...partyCure && aimedTrust ? { allyId: aimedTrust } : {},
				...spell.raise && raiseTrust ? { allyId: raiseTrust } : {},
				...songTrust ? { allyId: songTrust } : {},
				...entrustTrust ? { allyId: entrustTrust } : {},
				...spell.barrier && !spell.barrier.area && state.trustTargeted ? { allyId: state.trustTargeted } : {},
				...namedAlly && aim === "self" ? { allyId: namedAlly } : {}
			};
			set({
				mp: state.mp - cost,
				recasts: { ...liveRecasts },
				cast,
				...scholar.spent.length ? { buffs: liveBuffs.map((buff) => ({ ...buff })) } : {},
				...lockState()
			});
			state.pushLog(action.name, "info");
			if (castTime <= 0) useGame.getState().advanceCast(0);
			return true;
		}
		if (action.kind === "item") {
			if ((liveRecasts[action.name] ?? 0) > 0) {
				state.pushLog(`${action.name} is not ready.`, "miss");
				return false;
			}
			if (action.recast == null || action.recast <= 0) {
				state.pushLog(`${action.name} has no recast.`, "miss");
				return false;
			}
			if (action.activate == null || action.activate <= 0) {
				state.pushLog(`${action.name} has no activate time.`, "miss");
				return false;
			}
			liveRecasts[action.name] = action.recast;
			useGame.getState().dropHide();
			commitLock("item", action.activate);
			publishCombat(set);
			state.pushLog(action.name, "info");
			return true;
		}
		if (action.kind !== "ability") {
			state.pushLog(action.name, "info");
			return false;
		}
		if (action.id.startsWith("pact:")) {
			if (action.name === "Zantetsuken" || action.name === "Perfect Defense") {
				const released = callAstralRelease(action.name);
				if (!released.ok) {
					state.pushLog(released.text, "miss");
					return false;
				}
				commitLock("ability");
				state.setAbilityMotion(action.name);
				publishCombat(set);
				return true;
			}
			if (!avatar) {
				state.pushLog("No avatar is out.", "miss");
				return false;
			}
			if (avatar.anim !== "idle") {
				state.pushLog("The avatar is still acting.", "miss");
				return false;
			}
			const spent = trySpendPact(action.name);
			if (!spent.ok) {
				state.pushLog(spent.text, "miss");
				return false;
			}
			landCommandedPact(action.name, spent.short);
			commitLock("ability");
			state.setAbilityMotion(action.name);
			publishCombat(set);
			return true;
		}
		if (action.name === "Eagle Eye Shot" || action.name === "Shadowbind") {
			if (liveShot) {
				state.pushLog("Cannot act yet.", "miss");
				return false;
			}
			const paired = pairRanged(state.loadout.range, state.loadout.ammo);
			if (!paired.ok) {
				state.pushLog(paired.reason, "miss");
				return false;
			}
		}
		const aimingFoe = aimAt === "enemy";
		const forestFoe = forestFight();
		if (forestFoe && fieldById(forestFoe.id) && (state.targeted || state.engaged)) set({ targeted: false, engaged: false });
		if (aimingFoe && !state.targeted && !forestFoe) set({
			targeted: true,
			selfTargeted: false,
			crystalTargeted: false,
			trustTargeted: null,
			petTargeted: null
		});
		const penKin = state.targeted && playerFoe() === "kin";
		const kinTarget = state.quarry === "kin" && (action.name === "Charm" || action.name === "Gauge" || action.name === "Tame");
		const forestYards = forestFoe ? Math.hypot(playerStand.x - forestFoe.x, playerStand.z - forestFoe.z) : null;
		const foeYards = forestYards != null ? forestYards : penKin || kinTarget ? kinYards : aimingFoe || state.targeted ? struckYards() : yardDistance;
		const stealNames = action.name === "Accomplice" || action.name === "Collaborator";
		const asked = allyId && allyId !== "player" && liveTrusts[allyId] && !liveTrusts[allyId].ko ? allyId : null;
		const aimedTrust = state.trustTargeted && liveTrusts[state.trustTargeted] && !liveTrusts[state.trustTargeted].ko ? state.trustTargeted : null;
		const waltzTrust = isWaltz(action.name) && aimedTrust ? aimedTrust : null;
		const stealFrom = stealNames ? asked || aimedTrust : null;
		const gunOn = state.loadout.range === "musketoon";
		const bulletOn = state.loadout.ammo === "bronze-bullet";
		const fieldTake = forestFoe && fieldById(forestFoe.id) && (action.name === "Steal" || action.name === "Mug")
			? peekFieldSteal(forestFoe.id, action.name === "Mug" ? "gil" : "item", state.jobLevels?.[state.mainJob] ?? 75, Math.max(0, Math.floor(state.sheet?.treasureHunter ?? 0)))
			: null;
		const fieldPark = forestFoe && fieldById(forestFoe.id) ? beginPackStrike(forestFoe.id) : null;
		try {
		const result = tryAbility(action.name, {
			recastLeft: liveRecasts[action.name] ?? 0,
			targeted: aimingFoe || state.targeted || forestFoe != null,
			distance: waltzTrust ? trustPlaces[waltzTrust]?.party ?? 99 : foeYards,
			mp: state.mp,
			delay: state.sheet.delay,
			vit: waltzTrust ? vitOf(waltzTrust) : state.sheet.vit,
			mnd: state.sheet.mnd,
			maxHp: hpCap(),
			monkLevel: state.mainJob === "MNK" ? 75 : state.subJob === "MNK" ? subjobLevel(75) : 0,
			monkMain: state.mainJob === "MNK",
			seigan: liveBuffs.some((buff) => buff.name === "Seigan"),
			shield: ITEMS$1[state.loadout.sub ?? ""]?.kind === "Shield" ? shieldSizeBonus(state.loadout.sub) : null,
			pldLevel: state.mainJob === "PLD" ? 75 : state.subJob === "PLD" ? subjobLevel(75) : 0,
			pldMain: state.mainJob === "PLD",
			hp: state.hp,
			ninLevel: state.mainJob === "NIN" ? 75 : state.subJob === "NIN" ? subjobLevel(75) : 0,
			ninMain: state.mainJob === "NIN",
			brdMain: state.mainJob === "BRD",
			drkLevel: state.mainJob === "DRK" ? 75 : state.subJob === "DRK" ? subjobLevel(75) : 0,
			drkMain: state.mainJob === "DRK",
			drgLevel: state.mainJob === "DRG" ? 75 : state.subJob === "DRG" ? subjobLevel(75) : 0,
			drgMain: state.mainJob === "DRG",
			wyvernOut: wyvern != null,
			wyvernFull: wyvern != null && wyvern.hp >= wyvern.max,
			surge: liveBuffs.some((buff) => buff.name === "Spirit Surge"),
			smnLevel: state.mainJob === "SMN" ? 75 : state.subJob === "SMN" ? subjobLevel(75) : 0,
			smnMain: state.mainJob === "SMN",
			avatarOut: avatar != null,
			avatarSpirit: avatar?.spirit === true,
			summoning: state.sheet.summoning,
			bstLevel: state.mainJob === "BST" ? 75 : state.subJob === "BST" ? subjobLevel(75) : 0,
			bstMain: state.mainJob === "BST",
			bluLevel: state.mainJob === "BLU" ? 75 : state.subJob === "BLU" ? subjobLevel(75) : 0,
			bluMain: state.mainJob === "BLU",
			pupLevel: state.mainJob === "PUP" ? 75 : state.subJob === "PUP" ? subjobLevel(75) : 0,
			pupMain: state.mainJob === "PUP",
			animator: state.loadout.range === "animator",
			oilItem: state.loadout.ammo,
			oilLeft: state.loadout.ammo === "automaton-oil" ? oilCount(state.inventory) : 0,
			autoHp: automaton?.hp ?? 0,
			autoMax: automaton?.max ?? 0,
			automatonOut: automaton != null,
			otherPet: wyvern != null || jug != null || avatar != null || charm != null || packCharm != null,
			jugOut: jug != null,
			jugCharges: jug?.charges ?? readyBank.charges,
			jugTp: jug?.tp ?? 0,
			readyCharges: readyBank.charges,
			petDistance: masterToPet(),
			sicRoll: Math.floor(Math.random() * 4),
			jugItem: state.loadout.ammo,
			jugLeft: state.loadout.ammo === "fish-oil-broth" ? jugCount(state.inventory, FISH_OIL_BROTH) : 0,
			foodCounts: petFoodCounts(state.inventory),
			foodId: typeof state.flags.rewardFood === "string" ? state.flags.rewardFood : null,
			petHp: jug ? jug.hp : charm ? charm.who === "kin" ? liveKinHp : liveHareHp : 0,
			petMax: jug ? jug.max : charm ? HARE.hpNatural : 0,
			charmOut: charm != null || packCharm != null,
			charmTp: charm ? charm.who === "kin" ? liveKinTp : state.hareTp : 0,
			playerLevel: 75,
			playerChr: state.sheet.chr,
			playerInt: state.sheet.int,
			targetLevel: HARE.level,
			targetChr: HARE.chr,
			targetInt: HARE.int,
			targetName: fieldTake?.name,
			stealFind: fieldTake && action.name === "Steal" ? fieldTake.item : undefined,
			mugGil: fieldTake && action.name === "Mug" ? fieldTake.gil : undefined,
			charmRoll: 1 + Math.floor(Math.random() * 100),
			tameBonus: tamePrimed ? 10 : 0,
			sharedHate: (state.quarry === "kin" ? kinHateRows : hateRows).some((row) => row.id !== "player" && (row.ce > 0 || row.ve > 0)),
			foeAlive: kinTarget || penKin ? liveKinHp > 0 : forestFoe ? forestFoe.hp > 0 : aimingFoe || state.targeted ? foeLiving() : state.hareHp > 0,
			dmg: state.sheet.dmg,
			fstr: state.sheet.fstr,
			hitChance: meleeStats(state.sheet, liveBuffs, 0, 0, HARE.evasion - targetEvasion(HARE.evasion, liveEnfeebles)).hit,
			twoHand: twoHandKind(state.sheet.skillName),
			thfMain: state.mainJob === "THF",
			allyDistance: stealNames ? stealFrom ? trustPlaces[stealFrom]?.party ?? 99 : null : void 0,
			mobDistance: forestFoe || aimingFoe ? foeYards : yardDistance,
			...corsairCastFields({
				main: state.mainJob,
				sub: state.subJob,
				mainLevel: 75,
				subLevel: state.subJob ? subjobLevel(75) : 0,
				buffs: liveBuffs,
				recasts: liveRecasts,
				gun: gunOn,
				bullet: bulletOn,
				gunDmg: ITEMS$1[state.loadout.range ?? ""]?.dmg ?? 0,
				bulletDmg: ITEMS$1[state.loadout.ammo ?? ""]?.dmg ?? 0,
				agi: state.sheet.agi
			}),
			...dancerCastFields({
				main: state.mainJob,
				sub: state.subJob,
				mainLevel: 75,
				subLevel: state.subJob ? subjobLevel(75) : 0,
				buffs: liveBuffs,
				tp: state.tp,
				chr: state.sheet.chr,
				ability: action.name,
				enfeebles: rowsForStep(),
				waltzAlly: waltzTrust != null,
				waltzCenter: waltzTrust ?? "self",
				chainOpen: chainIsOpen(playerFoe() === "kin" ? "kin" : "hare")
			}),
			...scholarCastFields({
				main: state.mainJob,
				sub: state.subJob,
				mainLevel: 75,
				subLevel: state.subJob ? subjobLevel(75) : 0,
				buffs: liveBuffs,
				enfeebles: playerFoe() === "kin" ? kinEnfeebles : liveEnfeebles,
				maxHp: hpCap()
			}),
			...runeCastFields({
				main: state.mainJob,
				sub: state.subJob,
				mainLevel: 75,
				subLevel: state.subJob ? subjobLevel(75) : 0,
				buffs: liveBuffs,
				skill: state.sheet.skill,
				divine: combinedSkill("Divine Magic", state.mainJob, 75, state.subJob, state.subJob ? subjobLevel(75) : 0),
				str: state.sheet.str,
				dex: state.sheet.dex,
				agi: state.sheet.agi,
				int: state.sheet.int,
				mnd: state.sheet.mnd,
				chr: state.sheet.chr,
				targetHp: playerFoe() === "kin" ? state.kinHp : state.hareHp
			}),
			...geoCastFields({
				main: state.mainJob,
				sub: state.subJob,
				mainLevel: 75,
				subLevel: state.subJob ? subjobLevel(75) : 0,
				buffs: liveBuffs
			})
		});
		state.pushLog(result.text, result.ok ? "info" : "miss");
		if (!result.ok) return false;
		if (result.taken && forestFoe && fieldById(forestFoe.id)) {
			const now = useGame.getState();
			const inventory = { ...now.inventory ?? {} };
			inventory[result.taken.id] = (inventory[result.taken.id] ?? 0) + 1;
			if (bagUsed(inventory) > BAG_SLOTS) state.pushLog("You cannot carry any more.", "miss");
			else {
				set({ inventory });
				keepFieldSteal(forestFoe.id, result.taken.id, false);
			}
		}
		if ((result.takenGil ?? 0) > 0 && forestFoe && fieldById(forestFoe.id)) {
			const now = useGame.getState();
			set({ gil: Math.min(999999999, (now.gil ?? 0) + (result.takenGil ?? 0)) });
			keepFieldSteal(forestFoe.id, null, true);
		}
		if (result.replaces?.length) {
			const replaced = new Set(result.replaces);
			const gone = liveBuffs.filter((buff) => replaced.has(buff.name));
			if (gone.length) {
				liveBuffs = liveBuffs.filter((buff) => !replaced.has(buff.name));
				for (const buff of gone) state.pushLog(`${buff.name} wears off.`, "info");
			}
		}
		if (result.eagle || result.shadowbind) {
			const paired = pairRanged(state.loadout.range, state.loadout.ammo);
			if (!paired.ok) {
				state.pushLog(paired.reason, "miss");
				return false;
			}
			if (result.recast) liveRecasts[action.name] = result.recast;
			openRangedShot(paired.shot, {
				eagle: result.eagle === true,
				bind: result.shadowbind === true
			});
			if (result.hate) creditHate(result.hate.ce, result.hate.ve, result.claims === true);
			publishCombat(set);
			return true;
		}
		if (action.name !== "Sneak Attack" && action.name !== "Trick Attack" && action.name !== "Hide") useGame.getState().dropHide();
		const travelMode = abilityTravelMode(action.name, result);
		if (travelMode) breakPlayerTravel(travelMode);
		if (result.recast != null) liveRecasts[action.name] = result.recast;
		if (result.share) {
			const clock = result.shareRecast != null ? result.shareRecast : result.recast;
			if (clock != null) for (const shared of result.share) liveRecasts[shared] = clock;
		}
		if (result.buff) {
			const valianceBlocked = result.buff.name === "Valiance" && liveBuffs.some((buff) => buff.name === "Vallation");
			const hadFinishing = result.buff.name === "Finishing Move" ? liveBuffs.find((buff) => buff.name === "Finishing Move")?.power ?? 0 : 0;
			const finishingPower = result.buff.name === "Finishing Move" && hadFinishing > (result.buff.power ?? 0) ? hadFinishing : result.buff.power;
			if (valianceBlocked) state.pushLog("No effect.", "miss");
			else {
				const other = result.buff.name === "Afflatus Solace" ? "Afflatus Misery" : result.buff.name === "Afflatus Misery" ? "Afflatus Solace" : result.buff.name === "Hasso" ? "Seigan" : result.buff.name === "Seigan" ? "Hasso" : result.buff.name === "Yonin" ? "Innin" : result.buff.name === "Innin" ? "Yonin" : null;
				if (other === "Afflatus Misery") {
					miseryWound = 0;
					clearAuspiceAccuracy();
				}
				if (result.buff.name === "Meditate") {
					meditateAcc = 0;
					meditateGained = 0;
				}
				const clearingJig = result.buff.name === "Flee" && liveBuffs.some((buff) => buff.name === "Chocobo Jig");
				liveBuffs = liveBuffs.filter((buff) => buff.name !== result.buff.name && buff.name !== other && !(result.buff.name === "Flee" && buff.name === "Chocobo Jig"));
				if (clearingJig) state.pushLog("Chocobo Jig wears off.", "info");
				liveBuffs = [...liveBuffs, {
					name: result.buff.name,
					left: result.buff.duration,
					...result.buff.hold ? { hold: true } : {},
					...finishingPower != null ? { power: finishingPower } : {}
				}];
			}
			const heard = splashPartyAbility(result.buff.name, result.buff.duration, finishingPower, null);
			if (heard.length) state.pushLog(`${heard.join(", ")} receives it.`, "info");
		}
		if (result.fullHeal) set({ hp: hpCap() });
		if (result.heal && !result.waltz) set({ hp: Math.min(hpCap(), state.hp + result.heal) });
		if (result.convert) set({
			hp: Math.min(hpCap(), state.mp),
			mp: Math.min(state.sheet.mp, state.hp)
		});
		if (result.tpGrant) {
			const landed = Math.min(result.tpGrant, Math.max(0, 3e3 - state.tp));
			set({
				tp: Math.min(3e3, state.tp + result.tpGrant),
				...landed > 0 ? { tpPulse: landed } : {}
			});
		}
		if (result.buff?.name === "Meditate") {
			const landed = takeMeditate(state.sheet.job === "SAM", meditateGained, useGame.getState().tp, 1);
			meditateGained = landed.gained;
			if (landed.gain > 0) {
				set({
					tp: landed.tp,
					tpPulse: landed.gain
				});
				useGame.getState().pushLog(landed.text, "info");
			}
		}
		settleDragoon(result);
		settleBeast(result);
		settleAutomaton(result);
		settleCorsair(result, null);
		landDancer(result, null);
		if (result.charges != null || result.spend) {
			let strat = liveBuffs.find((buff) => buff.name === "Stratagem");
			if (!strat) {
				strat = { name: "Stratagem", left: 7200, power: 0, hold: true, acc: 0 };
				liveBuffs = [...liveBuffs, strat];
			}
			if (result.charges != null) {
				strat.power = result.charges;
				strat.acc = 0;
				strat.hold = true;
				strat.left = 7200;
			} else if (result.spend) strat.power = Math.max(0, (strat.power ?? 0) - 1);
		}
		if (result.sublimationMp && result.sublimationMp > 0) {
			const room = Math.max(0, state.sheet.mp - useGame.getState().mp);
			const gained = Math.min(room, result.sublimationMp);
			if (gained > 0) set({ mp: Math.min(state.sheet.mp, useGame.getState().mp + gained) });
		}
		if (result.helixCut) {
			const cut = (row) => row.name === "Helix" ? {
				...row,
				left: row.left / 2,
				power: 1,
				dot: Math.min(HELIX_TOCK_CAP, (row.dot ?? 0) * 2)
			} : row;
			if (playerFoe() === "kin") {
				kinEnfeebles = kinEnfeebles.map(cut);
				set({ kinEnfeebles: kinEnfeebles.map((row) => ({ ...row })) });
			} else liveEnfeebles = liveEnfeebles.map(cut);
		}
		if (result.siphonMp && result.siphonMp > 0) {
			const room = Math.max(0, state.sheet.mp - useGame.getState().mp);
			const gained = Math.min(room, result.siphonMp);
			if (gained > 0) set({ mp: Math.min(state.sheet.mp, useGame.getState().mp + gained) });
		}
		if (result.avatarRelease) dismissAvatar("The avatar leaves.");
		if (result.avatarHeel && avatar) {
			avatar.assault = false;
			avatar.heel = true;
			avatar.instinctNoted = false;
		}
		if (result.avatarAssault && avatar) {
			avatar.assault = state.hareHp > 0;
			avatar.heel = false;
		}
		if (result.hate && !(result.avatarAssault && state.hareHp <= 0)) {
			const packBody = forestFight();
			if (packBody && fieldById(packBody.id)) {
				if (result.claims === true || result.bash != null && result.bash > 0 || result.stun) engageField(packBody.id);
			} else if (packBody) {
				if (result.claims === true || result.bash != null && result.bash > 0 || result.stun) notePackAct(packBody.id);
				if (readActedBody()?.id === packBody.id) creditHate(result.hate.ce, result.hate.ve, result.claims === true, "player", result.quietClaim === true);
			} else if (state.quarry === "kin") creditKinHate(result.hate.ce, result.hate.ve, result.claims === true, "player", result.quietClaim === true);
			else creditHate(result.hate.ce, result.hate.ve, result.claims === true, "player", result.quietClaim === true);
		}
		if (result.steal != null && stealFrom) {
			const moved = moveEnmity(stealFrom, "player", result.steal);
			const who = trustName(stealFrom);
			state.pushLog(moved.ce === 0 && moved.ve === 0 ? `${who} has no enmity to take.` : `${action.name} takes ${moved.ce} cumulative and ${moved.ve} volatile enmity from ${who}.`, "info");
		}
		if (result.buff?.name === "Hide") dropHateRow("player");
		noteRuneFlash(action.name, liveBuffs);
		if (result.runes) liveBuffs = paintRunes(liveBuffs, result.runes);
		if (result.shadowPop && !result.noTp) {
			const popped = popShadow(liveBuffs);
			liveBuffs = popped.buffs;
			if (popped.wore) state.pushLog(`${popped.wore} wears off.`, "info");
		}
		if (result.mpHeal) {
			const now = useGame.getState();
			set({ mp: Math.min(now.sheet.mp, now.mp + result.mpHeal) });
		}
		if (result.fullCircle) dismissLuopan(null);
		if (result.lasting && luopan) luopan.lasting = true;
		if (result.ecliptic && luopan) {
			luopan.ecliptic = true;
			if (luopan.aura) luopan.aura = eclipticRow(luopan.aura);
			liveBuffs = liveBuffs.map(eclipticRow);
			liveEnfeebles = liveEnfeebles.map(eclipticRow);
		}
		if (result.demat && luopan) luopan.demat = result.demat;
		if (result.life && luopan) luopan.hp = Math.min(luopan.max, luopan.hp + result.life);
		if (result.buff?.name === "Bolster") {
			liveBuffs = liveBuffs.map(doubleIndi);
			liveEnfeebles = liveEnfeebles.map(doubleIndi);
		}
		if (result.gambit) {
			const park = playerFoe() === "kin" ? borrowKin() : null;
			try {
				liveEnfeebles = [...liveEnfeebles.filter((row) => row.name !== "Gambit"), {
					name: "Gambit",
					left: result.gambit.left,
					power: result.gambit.power
				}];
			} finally {
				if (park) restoreKin(park);
			}
		}
		if (result.bash != null && result.bash > 0) {
			const packBody = forestFight();
			if (packBody) {
				notePackAct(packBody.id);
				strikePack(packBody.id, result.bash);
				set({ dealt: useGame.getState().dealt + result.bash });
			} else if (playerFoe() === "kin") {
				creditKinDamage(result.bash);
				chipKin(result.bash);
				if (!result.noTp) grantPlayerFoeTp(state.sheet.tpHit);
				set({
					dealt: useGame.getState().dealt + result.bash,
					kinHp: liveKinHp,
					...kinHateState()
				});
			} else {
				const woke = clearSleep();
				const unbound = bindWearsOff(result.bash) && clearBind();
				if (!result.noTp) useGame.getState().grantMonsterTp(state.sheet.tpHit);
				chipHare(result.bash);
				set({
					dealt: useGame.getState().dealt + result.bash,
					hareHp: liveHareHp,
					...hateNow(),
					hareEnfeebles: liveEnfeebles.map((row) => ({ ...row }))
				});
				if (woke) useGame.getState().pushLog(`The ${HARE.name} wakes.`, "info");
				if (unbound) useGame.getState().pushLog(`The ${HARE.name}'s Bind effect wears off.`, "info");
			}
		}
		settleQuickDraw(result, true);
		if (result.stun) {
			if (forestFight()) notePackAct(forestFight().id);
			else {
				const park = foeIsKin() ? borrowKin() : null;
				try {
					liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Stun");
					liveEnfeebles = [...liveEnfeebles, {
						name: "Stun",
						left: result.stunSeconds ?? 2
					}];
					set(struckPatch(park));
				} finally {
					if (park) restoreKin(park);
				}
			}
		}
		if (result.ko) {
			mijinDown = true;
			livePending = null;
			statusLostOnDeath();
			const abandoned = dropPlayerHate();
			if (useGame.getState().cast) useGame.getState().interruptCast();
			set({
				hp: 0,
				ko: true,
				engaged: false,
				targeted: false,
				selfTargeted: false,
				crystalTargeted: false,
				trustTargeted: null,
				petTargeted: null,
				homeAsk: false,
				healPhase: "off",
				engageAfterHeal: false,
				pendingRaise: null,
				weakness: liveWeakness,
				buffs: liveBuffs.map((buff) => ({ ...buff })),
				ailments: liveAilments.map((row) => ({ ...row })),
				hareHp: liveHareHp,
				...hateNow()
			});
			useGame.getState().pushLog("You are knocked out.", "miss");
			if (abandoned) useGame.getState().pushLog(`The ${HARE.name} loses interest.`, "info");
		}
		commitLock("ability");
		state.setAbilityMotion(action.name);
		publishCombat(set);
		return true;
		} finally {
			if (fieldPark) endPackStrike(fieldPark);
		}
	};
	const considerGambits = () => {
		gambitClose = false;
		const state = useGame.getState();
		const board = state.gambits["player"] ?? blankBoard();
		if (!board.on) return;
		if (!state.started || state.ko || state.healPhase !== "off" || state.cast) return;
		const locks = readLocks();
		if (locks.action > 0 || locks.ability > 0) return;
		if (takeGambitYield()) return;
		const allies = [{
			id: GAMBIT_MEMBER,
			hp: state.hp,
			maxHp: hpCap(),
			mp: state.mp,
			maxMp: state.sheet.mp,
			tp: state.tp,
			ko: state.ko,
			caster: true,
			buffs: liveBuffs.map(scanBuff)
		}];
		for (const id of state.party.summoned) {
			const trust = liveTrusts[id];
			if (!trust) continue;
			allies.push({
				id,
				hp: trust.hp,
				maxHp: trust.maxHp,
				mp: trust.mp,
				maxMp: trust.maxMp,
				tp: trust.tp,
				ko: trust.ko,
				caster: false,
				buffs: trust.buffs.map(scanBuff),
				yards: trustPlaces[id]?.party ?? 99
			});
		}
		const fieldBody = !state.selfTargeted && !state.crystalTargeted && !state.trustTargeted && !state.manualTargeted && !state.targeted ? fieldTarget() : null;
		const fieldScan = fieldBody ? fieldSnapshot(fieldBody) : null;
		const fieldYards = fieldScan ? fieldScan.playerYards : 999;
		const hit = scanGambit(board, {
			hp: state.hp,
			maxHp: hpCap(),
			mp: state.mp,
			maxMp: state.sheet.mp,
			tp: state.tp,
			ko: state.ko,
			targeted: fieldScan ? true : state.targeted,
			inRange: fieldScan ? fieldYards <= fieldMeleeReach(state.sheet.reach) + 1 : state.inRange,
			distance: fieldScan ? fieldYards : struckYards(),
			manafont: liveBuffs.some((buff) => buff.name === "Manafont"),
			buffs: liveBuffs,
			recasts: liveRecasts,
			job: state.mainJob,
			sub: state.subJob,
			skillName: state.sheet.skillName,
			skill: state.sheet.skill,
			weaponName: state.sheet.weaponName,
			range: rangedBar(state.mainJob, state.subJob, state.loadout.range),
			delay: state.sheet.delay,
			vit: state.sheet.vit,
			mnd: state.sheet.mnd,
			shield: ITEMS$1[state.loadout.sub ?? ""]?.kind === "Shield" ? shieldSizeBonus(state.loadout.sub) : null,
			pldLevel: state.mainJob === "PLD" ? 75 : state.subJob === "PLD" ? subjobLevel(75) : 0,
			pldMain: state.mainJob === "PLD",
			ninLevel: state.mainJob === "NIN" ? 75 : state.subJob === "NIN" ? subjobLevel(75) : 0,
			ninMain: state.mainJob === "NIN",
			brdMain: state.mainJob === "BRD",
			drkLevel: state.mainJob === "DRK" ? 75 : state.subJob === "DRK" ? subjobLevel(75) : 0,
			drkMain: state.mainJob === "DRK",
			bluLevel: state.mainJob === "BLU" ? 75 : state.subJob === "BLU" ? subjobLevel(75) : 0,
			bluMain: state.mainJob === "BLU",
			pupLevel: state.mainJob === "PUP" ? 75 : state.subJob === "PUP" ? subjobLevel(75) : 0,
			pupMain: state.mainJob === "PUP",
			twoHand: twoHandKind(state.sheet.skillName),
			monkLevel: state.mainJob === "MNK" ? 75 : state.subJob === "MNK" ? subjobLevel(75) : 0,
			monkMain: state.mainJob === "MNK",
			engaged: fieldScan ? fieldBody.claimed === true : state.engaged,
			skillchain: burstChainName(chainFoe()),
			foe: fieldScan ?? gambitFoe(),
			foes: fieldScan ? [fieldScan] : gambitFoes(),
			foeCount: fieldScan ? 1 : chasedPack().length ? chasedPack().length : packClaim() ? 0 : fightBodies().length,
			avatarName: avatar?.name ?? null,
			stepRows: rowsForStep(),
			ability: scanAbilityFields({
				main: state.mainJob,
				sub: state.subJob,
				mainLevel: 75,
				subLevel: state.subJob ? subjobLevel(75) : 0,
				buffs: liveBuffs,
				recasts: liveRecasts,
				tp: state.tp,
				enfeebles: rowsForStep(),
				chainOpen: chainIsOpen(fieldBody ? fieldBody.id : playerFoe() === "kin" ? "kin" : "hare"),
				skill: state.sheet.skill,
				divine: combinedSkill("Divine Magic", state.mainJob, 75, state.subJob, state.subJob ? subjobLevel(75) : 0),
				str: state.sheet.str,
				dex: state.sheet.dex,
				agi: state.sheet.agi,
				int: state.sheet.int,
				mnd: state.sheet.mnd,
				chr: state.sheet.chr,
				dmg: state.sheet.dmg,
				fstr: state.sheet.fstr,
				hit: state.sheet.hit,
				summoning: state.sheet.summoning,
				targetHp: playerFoe() === "kin" ? state.kinHp : state.hareHp,
				ammo: state.loadout.ammo,
				jugLeft: state.loadout.ammo === "fish-oil-broth" ? jugCount(state.inventory, FISH_OIL_BROTH) : 0,
				oilLeft: state.loadout.ammo === "automaton-oil" ? oilCount(state.inventory) : 0,
				foodCounts: petFoodCounts(state.inventory),
				foodId: typeof state.flags.rewardFood === "string" ? state.flags.rewardFood : null,
				gun: state.loadout.range === "musketoon",
				bullet: state.loadout.ammo === "bronze-bullet",
				gunDmg: ITEMS$1[state.loadout.range ?? ""]?.dmg ?? 0,
				bulletDmg: ITEMS$1[state.loadout.ammo ?? ""]?.dmg ?? 0,
				animator: state.loadout.range === "animator"
			}),
			knownSpells: spellsKnown({
				[state.mainJob]: 75,
				...state.subJob && state.subJob !== state.mainJob ? { [state.subJob]: subjobLevel(75) } : {}
			}, void 0, state.mainJob).map((spell) => spell.name)
		}, allies);
		if (!hit || hit.kind === "hold") return;
		aimClaimedFoe(hit);
		if (hit.actionId === "engage") {
			if (fieldBody) {
				if (!fieldBody.claimed) toggleFieldEngage();
				return;
			}
			if (state.manualTargeted || state.crystalTargeted) return;
			gambitClose = !state.inRange;
			const who = playerFoe() ?? fightBodies()[0] ?? null;
			if (!state.engaged || !state.targeted || who != null && state.quarry !== who) set({
				engaged: true,
				targeted: true,
				...who ? { quarry: who } : {},
				selfTargeted: false,
				crystalTargeted: false,
				trustTargeted: null,
				petTargeted: null
			});
			syncGear();
			return;
		}
		if (hit.actionId === "ranged") {
			const paired = pairRanged(state.loadout.range, state.loadout.ammo);
			if (!paired.ok || (fieldScan ? fieldYards : struckYards()) > autoAttackRange(paired.shot.skillName)) return;
			const shot = findAction("ranged:attack");
			if (shot) issueAction(shot, "enemy", true);
			return;
		}
		const action = findAction(hit.actionId);
		if (!action) return;
		if (action.name === "Raise") return;
		issueAction(action, hit.aim, !gambitPinsWeaponSkill(board, hit.actionId), hit.targetId ?? null, hit.foeId ?? null);
	};
	const trustAllies = (id, trust) => {
		const state = useGame.getState();
		const rows = [{
			id: GAMBIT_MEMBER,
			hp: state.hp,
			maxHp: hpCap(),
			mp: state.mp,
			maxMp: state.sheet.mp,
			tp: state.tp,
			ko: state.ko,
			caster: false,
			buffs: liveBuffs.map(scanBuff),
			yards: trustPlaces[id]?.party ?? 99
		}];
		for (const other of state.party.summoned) {
			const row = liveTrusts[other];
			if (!row) continue;
			rows.push({
				id: other,
				hp: row.hp,
				maxHp: row.maxHp,
				mp: row.mp,
				maxMp: row.maxMp,
				tp: row.tp,
				ko: row.ko,
				caster: other === id,
				buffs: row.buffs.map(scanBuff),
				yards: other === id ? 0 : yardsFrom(id, other)
			});
		}
		if (!rows.some((row) => row.id === id)) rows.push({
			id,
			hp: trust.hp,
			maxHp: trust.maxHp,
			mp: trust.mp,
			maxMp: trust.maxMp,
			tp: trust.tp,
			ko: trust.ko,
			caster: true,
			buffs: trust.buffs.map(scanBuff),
			yards: 0
		});
		return rows;
	};
	function putTrustBuff(trust, name, left, power) {
		trust.buffs = trust.buffs.filter((buff) => buff.name !== name);
		trust.buffs.push({
			name,
			left,
			...power != null ? { power } : {}
		});
	}
	/** Waoud lands the set spell. Physical hits, cures, and the stat buffs resolve. Other blue families are named and do not invent a second effect. */
	function landTrustBlue(id, trust, spell, sheet, caster, targetId) {
		const card = blueSpellByName(spell.name);
		const state = useGame.getState();
		let dmg = 0;
		let text = `${caster} casts ${spell.name}.`;
		const yards = trustPlaces[id]?.yards ?? 99;
		if (!card) {
			state.pushLog(text, "info");
			return;
		}
		if (card.kind === "cocoon") {
			putTrustBuff(trust, "Defense Boost", card.seconds ?? 90, 128);
			text = `${caster} casts Cocoon. Defense +50% for 90 seconds.`;
		} else if (card.kind === "feather") {
			putTrustBuff(trust, "Evasion Boost", 30, 25);
			text = `${caster} casts Feather Barrier. Evasion +25 for 30 seconds.`;
		} else if (card.kind === "warmup") {
			putTrustBuff(trust, "Accuracy Boost", 180, 10);
			const evasion = trust.buffs.find((buff) => buff.name === "Evasion Boost");
			if (!evasion || (evasion.power ?? 0) <= 10) {
				putTrustBuff(trust, "Evasion Boost", 180, 10);
				text = `${caster} casts Warm-Up. Accuracy +10. Evasion +10 for 180 seconds.`;
			} else text = `${caster} casts Warm-Up. Accuracy +10. A stronger Evasion Boost stays.`;
		} else if (card.kind === "triumph") {
			putTrustBuff(trust, "Attack Boost", 60, 38);
			text = `${caster} casts Triumphant Roar. Attack +38/256 for 60 seconds.`;
		} else if (card.kind === "memento") {
			putTrustBuff(trust, "Magic Atk. Boost", 60, 20);
			text = `${caster} casts Memento Mori. Magic Attack Bonus +20 for 60 seconds.`;
		} else if (card.kind === "amp") {
			const current = trust.buffs.find((buff) => buff.name === "Magic Atk. Boost");
			if (current == null || (current.power ?? 0) <= 10) putTrustBuff(trust, "Magic Atk. Boost", 90, 10);
			const ward = trust.buffs.find((buff) => buff.name === "Magic Def. Boost");
			if (ward == null || (ward.power ?? 0) <= 10) putTrustBuff(trust, "Magic Def. Boost", 90, 10);
			text = `${caster} casts Amplification. Magic attack +10. Magic defense +10 for 90 seconds.`;
		} else if (card.kind === "cure" || card.kind === "pollen" || card.kind === "breeze") {
			const divine = trust.buffs.some((buff) => buff.name === "Divine Seal");
			if (divine) trust.buffs = trust.buffs.filter((buff) => buff.name !== "Divine Seal");
			const healing = combinedSkill("Healing Magic", sheet.job, 75, sheet.sub, sheet.subLevel);
			const power = wildCarrotPower(sheet.mnd, sheet.vit, healing);
			const amount = card.kind === "pollen" ? cureFinal(pollenBase(power), divine) : card.kind === "breeze" ? cureFinal(healingBreezeBase(healingBreezePower(sheet.mnd, sheet.vit, healing)), divine) : cureFinal(spell.name === "Magic Fruit" ? magicFruitBase(power) : wildCarrotBase(power), divine);
			const onPlayer = targetId === "player" && !state.ko && (trustPlaces[id]?.party ?? 99) <= (card.kind === "cure" ? card.range : 20);
			if (onPlayer) {
				const gain = Math.min(amount, Math.max(0, hpCap() - state.hp));
				if (gain > 0) useGame.setState({ hp: Math.min(hpCap(), state.hp + gain) });
				text = gain > 0 ? `${caster} casts ${spell.name}. Xanosuke recovers ${gain} HP.` : `${caster} casts ${spell.name}. Xanosuke's HP is full.`;
			} else {
				const gain = Math.min(amount, Math.max(0, trust.maxHp - trust.hp));
				trust.hp += gain;
				text = gain > 0 ? `${caster} casts ${spell.name}. ${caster} recovers ${gain} HP.` : `${caster} casts ${spell.name}. ${caster}'s HP is full.`;
			}
		} else if (card.kind === "physical") {
			const chainUp = trust.buffs.some((buff) => buff.name === "Chain Affinity");
			if (chainUp) trust.buffs = trust.buffs.filter((buff) => buff.name !== "Chain Affinity");
			const azure = trust.buffs.some((buff) => buff.name === "Azure Lore");
			const reach = card.range ?? card.radius ?? 25;
			if (liveHareHp <= 0) text = `${caster} casts ${spell.name}. No effect.`;
			else if (yards > reach) text = `${caster} casts ${spell.name}. The ${HARE.name} is out of range.`;
			else {
				const swings = card.hits;
				const rolled = rollPhysicalBlue({
					name: spell.name,
					blueSkill: combinedSkill("Blue Magic", sheet.job, 75, sheet.sub, sheet.subLevel),
					str: sheet.str,
					dex: sheet.dex,
					vit: sheet.vit,
					agi: sheet.agi,
					int: sheet.int,
					chr: sheet.chr,
					mnd: sheet.mnd,
					targetVit: HARE.vit,
					attack: spell.name === "Cannonball" ? Math.max(1, sheet.defense) : sheet.attack,
					attackMult: blueAttackMult(spell.name, trust.tp, chainUp, azure),
					ftp: blueSpellFtp(spell.name, trust.tp, chainUp, azure),
					defense: hareLiveDefense(0),
					accuracy: sheet.accuracy + blueAccBonus(spell.name, trust.tp, chainUp, azure),
					evasion: targetEvasion(HARE.evasion, foeEnfeebleRows(), distractPower(foeEnfeebleRows())),
					dLevel: HARE.level - 75,
					chainAffinity: chainUp,
					crit: chainUp,
					targetName: HARE.name,
					hitRoll: 0,
					pdifRoll: 0,
					hitRolls: Array.from({ length: swings }, () => Math.random() * 100),
					pdifRolls: Array.from({ length: swings }, () => Math.random())
				});
				dmg = rolled.dmg;
				text = `${caster} casts ${spell.name}. ${rolled.text}`;
			}
		} else text = `${caster} casts ${spell.name}.`;
		if (dmg > 0) {
			creditDamage(dmg, id);
			chipHare(dmg);
		}
		const fixed = castEnmity(spell, false);
		creditHate(fixed.ce, fixed.ve, fixed.claims, id);
		queueTrustFloater({
			id,
			name: spell.name,
			amount: dmg > 0 ? String(dmg) : "",
			self: dmg <= 0,
			motion: null,
			spell: spell.name,
			at: dmg > 0 ? "hare" : "self"
		});
		useGame.setState({
			...hateNow(),
			hareHp: liveHareHp,
			hareEnfeebles: liveEnfeebles.map((row) => ({ ...row })),
			trustVitals: trustVitalsNow()
		});
		state.pushLog(text, dmg > 0 ? "hit" : "info");
	}
	const finishTrustCast = (id, trust) => {
		const cast = trust.cast;
		if (!cast) return;
		if (castMarkDown(cast)) {
			abortTrustCast(id, trust);
			return;
		}
		trust.cast = null;
		const prevPin = pinnedFoe;
		const onPack = cast.foeId === "pack" && typeof cast.packId === "string";
		pinnedFoe = onPack ? "hare" : cast.foeId === "hare" || cast.foeId === "kin" ? cast.foeId : null;
		const packPark = onPack ? beginPackStrike(cast.packId) : null;
		if (onPack && !packPark) {
			pinnedFoe = prevPin;
			return;
		}
		let colureLanded = false;
		try {
		const spell = spellByName(cast.name);
		const state = useGame.getState();
		const sub = trustSubOf(state.party, id);
		const who = trustById(id);
		const caster = who?.name ?? "Trust";
		const casterJob = who?.job ?? "WHM";
		if (spell?.summon && id === "karaha-baruha") {
			const called = summonTrustAvatar(spell.summon);
			state.pushLog(called ? `${caster} summons ${called.name}.` : `${caster}'s summon fails.`, called ? "info" : "miss");
			return;
		}
		const sheet = trustCombat(id, sub, trustGearOf(state.party, id));
		const fromYou = trustPlaces[id]?.party ?? 99;
		if (spell?.blue && casterJob === "BLU") {
			landTrustBlue(id, trust, spell, sheet, caster, cast.targetId);
			return;
		}
		if (spell?.colure) {
			const landed = landTrustColure(id, trust, spell, sheet, cast);
			colureLanded = true;
			const allies = geoAllies(spell.colure.effect);
			const onCaster = spell.colure.side === "indi" || allies;
			queueTrustFloater({
				id,
				name: spell.name,
				amount: landed.brief,
				self: onCaster,
				motion: null,
				spell: spell.name,
				at: onCaster ? "self" : "hare"
			});
			state.pushLog(landed.text, "info");
			return;
		}
		if (spell?.song) {
			const sung = singerSkill(casterJob, sub, null);
			const soul = trust.buffs.some((buff) => buff.name === "Soul Voice");
			const piano = trust.buffs.some((buff) => buff.name === "Pianissimo");
			if (piano) trust.buffs = trust.buffs.filter((buff) => buff.name !== "Pianissimo");
			const landed = landSong(spell.name, sung.skill, soul);
			let text = `${caster} casts ${cast.name}.`;
			if (!landed) text = `${text} No effect.`;
			else if (landed.hostile) {
				text = `${caster}'s ${landHostileSong(landed, id, composedMagicAccuracy(sung.skill, sheet.chr - HARE.chr, 0))}`;
				if (trust.buffs.some((buff) => buff.song?.family === "mazurka")) {
					trust.buffs = trust.buffs.filter((buff) => buff.song?.family !== "mazurka");
					text = `${text} Mazurka wears off.`;
				}
			} else if (piano) {
				const target = cast.targetId;
				if (target && target !== id && target !== "player" && liveTrusts[target] && !liveTrusts[target].ko && yardsFrom(id, target) <= 12) {
					liveTrusts[target].buffs = giveSong(liveTrusts[target].buffs, landed, sung.slots);
					text = `${caster}'s ${landed.text}`;
				} else if (target === "player" && !state.ko && fromYou <= 12) {
					liveBuffs = giveSong(liveBuffs, landed, sung.slots);
					text = `${caster}'s ${landed.text} Xanosuke receives it.`;
				} else {
					trust.buffs = giveSong(trust.buffs, landed, sung.slots);
					text = `${caster}'s ${landed.text}`;
				}
			} else {
				trust.buffs = giveSong(trust.buffs, landed, sung.slots);
				const got = [];
				for (const tid of summonedTrustIds()) {
					if (tid === id) continue;
					const row = liveTrusts[tid];
					if (!row || row.ko || yardsFrom(id, tid) > 12) continue;
					row.buffs = giveSong(row.buffs, landed, sung.slots);
					got.push(trustName(tid));
				}
				const near = !state.ko && fromYou <= 12;
				if (near) liveBuffs = giveSong(liveBuffs, landed, sung.slots);
				const others = got.length ? ` ${got.join(", ")} receives it.` : "";
				const you = near ? " Xanosuke receives it." : "";
				text = `${caster}'s ${landed.text}${others}${you}`;
			}
			const single = !!landed && (landed.hostile ? piano : piano || landed.family === "etude" || landed.family === "prelude");
			let songAt = landed?.hostile ? "hare" : "self";
			let songMarkId = null;
			if (landed && !landed.hostile && single) {
				const target = piano ? cast.targetId : id;
				if (target === "player") songAt = "player";
				else if (target && target !== id) songMarkId = target;
			}
			queueTrustFloater({
				id,
				name: cast.name,
				amount: "",
				self: !landed?.hostile,
				motion: null,
				spell: cast.name,
				at: songAt,
				markId: songMarkId,
				songSingle: single,
				party: !!(landed && !landed.hostile && !single)
			});
			set({
				buffs: liveBuffs.map((buff) => ({ ...buff })),
				hareHp: liveHareHp,
				hareEnfeebles: liveEnfeebles.map((row) => ({ ...row })),
				...hateNow(),
				trustVitals: trustVitalsNow()
			});
			state.pushLog(text, "info");
			return;
		}
		if (spell && (spell.barrier?.area || spell.curaga || spell.bar || spell.auspice)) {
			const radius = spell.radius ?? PARTY_RADIUS;
			const near = !state.ko && fromYou <= radius;
			const inside = trustsInRadius(id, radius);
			let text = `${caster} casts ${cast.name}.`;
			let party = false;
			if (spell.curaga) {
				const divine = trust.buffs.some((buff) => buff.name === "Divine Seal");
				if (divine) trust.buffs = trust.buffs.filter((buff) => buff.name !== "Divine Seal");
				const healing = combinedSkill("Healing Magic", casterJob, 75, sub, subjobLevel(75));
				const notes = [];
				for (const tid of inside) {
					const row = liveTrusts[tid];
					if (!row || row.ko) continue;
					const vit = tid === id ? sheet.vit : trustCombat(tid, trustSubOf(state.party, tid), trustGearOf(state.party, tid)).vit;
					const heal = cureFinal(curagaBase(spell.curaga, curagaPower(sheet.mnd, vit, healing)), divine);
					const gain = Math.min(heal, Math.max(0, row.maxHp - row.hp));
					row.hp += gain;
					notes.push(gain > 0 ? `${trustName(tid)} recovers ${gain} HP.` : `${trustName(tid)}'s HP is full.`);
				}
				const healYou = cureFinal(curagaBase(spell.curaga, curagaPower(sheet.mnd, state.sheet.vit, healing)), divine);
				const youGain = near ? Math.min(healYou, Math.max(0, hpCap() - state.hp)) : 0;
				party = near;
				const you = state.ko ? "" : near ? youGain > 0 ? ` Xanosuke recovers ${youGain} HP.` : " Xanosuke's HP is full." : " Xanosuke is out of range.";
				text = `${caster} casts ${cast.name}. ${notes.join(" ")}${you}`;
				set({
					hp: Math.min(hpCap(), state.hp + youGain),
					trustVitals: trustVitalsNow()
				});
			} else if (spell.barrier?.area) {
				const kind = spell.barrier.kind;
				const tier = spell.barrier.tier;
				const status = kind === "protect" ? "Protect" : "Shell";
				const base = kind === "protect" ? PROTECT_DEF[tier] : SHELL_CUT[tier];
				const left = barrierDuration(spell.barrier.effectLevel, 75);
				const drop = (buff) => buff.name === status;
				const got = [];
				const weak = [];
				for (const tid of inside) {
					const row = liveTrusts[tid];
					if (!row || row.ko) continue;
					if (putTrustStatus(row, {
						name: status,
						left,
						tier,
						power: kind === "protect" ? base + shieldBonus(tid) : base
					}, drop, true)) got.push(trustName(tid));
					else weak.push(trustName(tid));
				}
				const youPower = kind === "protect" ? base + shieldBonus(GAMBIT_MEMBER) : base;
				const you = state.ko ? "none" : near ? grantPlayerStatus({
					name: status,
					left,
					tier,
					power: youPower
				}, drop, true) : "far";
				party = you === "hit";
				const line = kind === "protect" ? `Defense +${base}.` : `Magic damage cut ${base}/256.`;
				const weakNote = weak.length ? ` No effect on ${weak.join(", ")}.` : "";
				const youNote = you === "hit" ? " Xanosuke receives it." : you === "weak" ? " No effect on Xanosuke." : you === "far" ? " Xanosuke is out of range." : "";
				text = `${caster} casts ${cast.name}. ${line}${named(got)}${weakNote}${youNote}`;
				set({
					buffs: liveBuffs.map((buff) => ({
						...buff,
						enspell: buff.enspell ? { ...buff.enspell } : void 0
					})),
					trustVitals: trustVitalsNow()
				});
			} else if (spell.bar) {
				const selfBar = spell.radius == null;
				const enhancing = combinedSkill("Enhancing Magic", casterJob, 75, sub, subjobLevel(75));
				const elementBar = spell.bar.kind === "element";
				const resolved = elementBar ? resolveElementBar(enhancing, spell.bar.effectLevel, 75) : resolveStatusBar(spell.bar.effectLevel, 75, selfBar);
				const bold = selfBar && trust.buffs.some((buff) => buff.name === "Embolden");
				const drop = (buff) => elementBar ? isElementBar(buff.name) : isStatusBar(buff.name);
				const next = {
					name: spell.name,
					left: emboldenDuration(bold, resolved.left),
					power: emboldenPotency(bold, resolved.power)
				};
				if (selfBar) {
					if (!trust.ko) putTrustStatus(trust, { ...next }, drop, false);
					text = `${caster} casts ${cast.name}. ${barResistLabel(spell.bar.resists)} resistance +${next.power}.`;
				} else {
					const got = [];
					for (const tid of inside) {
						const row = liveTrusts[tid];
						if (!row || row.ko) continue;
						if (putTrustStatus(row, { ...next }, drop, false)) got.push(trustName(tid));
					}
					const you = state.ko ? "none" : near ? grantPlayerStatus({ ...next }, drop, false) : "far";
					party = you === "hit";
					const youNote = you === "hit" ? " Xanosuke receives it." : you === "weak" ? " No effect on Xanosuke." : you === "far" ? " Xanosuke is out of range." : "";
					text = `${caster} casts ${cast.name}. ${barResistLabel(spell.bar.resists)} resistance +${resolved.power}.${named(got)}${youNote}`;
				}
				set({
					buffs: liveBuffs.map((buff) => ({
						...buff,
						enspell: buff.enspell ? { ...buff.enspell } : void 0
					})),
					trustVitals: trustVitalsNow()
				});
			} else if (spell.auspice) {
				const next = {
					name: "Auspice",
					left: enhancingDuration(180, spell.auspice.effectLevel, 75),
					power: 10
				};
				const drop = (buff) => buff.name === "Auspice";
				const got = [];
				const weak = [];
				for (const tid of inside) {
					const row = liveTrusts[tid];
					if (!row || row.ko) continue;
					if (auspiceBlockedByEnspell(row.buffs.find((buff) => buff.enspell)?.enspell?.tier ?? null)) {
						weak.push(trustName(tid));
						continue;
					}
					row.buffs = row.buffs.filter((buff) => !buff.enspell);
					if (putTrustStatus(row, { ...next }, drop, false)) got.push(trustName(tid));
				}
				const blocked = auspiceBlockedByEnspell(liveBuffs.find((buff) => buff.enspell)?.enspell?.tier ?? null);
				let you = "none";
				if (state.ko) you = "none";
				else if (!near) you = "far";
				else if (blocked) you = "weak";
				else {
					liveBuffs = liveBuffs.filter((buff) => !buff.enspell);
					you = grantPlayerStatus({ ...next }, drop, false);
				}
				party = you === "hit";
				const weakNote = weak.length ? ` No effect on ${weak.join(", ")}.` : "";
				const youNote = you === "hit" ? " Xanosuke receives it." : you === "weak" ? " No effect on Xanosuke." : you === "far" ? " Xanosuke is out of range." : "";
				text = `${caster} casts ${cast.name}. Subtle Blow +10.${named(got)}${weakNote}${youNote}`;
				set({
					buffs: liveBuffs.map((buff) => ({
						...buff,
						enspell: buff.enspell ? { ...buff.enspell } : void 0
					})),
					trustVitals: trustVitalsNow()
				});
			}
			queueTrustFloater({
				id,
				name: cast.name,
				amount: "",
				self: true,
				motion: null,
				spell: cast.name,
				at: "self",
				party
			});
			state.pushLog(text, "info");
			return;
		}
		if (spell) {
			const enhanced = landTrustEnhancing(id, trust, spell, cast.targetId, sheet);
			if (enhanced) {
				queueTrustFloater({
					id,
					name: cast.name,
					amount: "",
					self: true,
					motion: null,
					spell: cast.name,
					at: enhanced.at
				});
				set({
					buffs: liveBuffs.map((buff) => ({
						...buff,
						enspell: buff.enspell ? { ...buff.enspell } : void 0
					})),
					trustVitals: trustVitalsNow()
				});
				state.pushLog(enhanced.text, "info");
				return;
			}
		}
		if (spell?.nin) {
			const landed = landNinjutsu(spell, ninCastContext(sheet, trust.buffs, casterJob === "NIN"));
			if (landed) {
				const park = foeIsKin() && (landed.dmg > 0 || landed.enfeeble) ? borrowKin() : null;
				try {
					trust.buffs = keepNinBuffs(trust.buffs, landed);
					if (landed.enfeeble) {
						const row = landed.enfeeble;
						liveEnfeebles = liveEnfeebles.filter((entry) => entry.name !== row.name);
						liveEnfeebles = [...liveEnfeebles, {
							name: row.name,
							left: row.left,
							...row.accDown != null ? { accDown: row.accDown } : {},
							...row.power != null ? { power: row.power } : {},
							...row.dot != null ? {
								dot: row.dot,
								acc: row.acc ?? 0
							} : {}
						}];
					}
					if (landed.dmg > 0) {
						creditDamage(landed.dmg, id);
						chipHare(landed.dmg);
					}
					if (landed.hate) creditHate(landed.hate.ce, landed.hate.ve, landed.dmg > 0, id);
					if (landed.area && landed.give) {
						const give = landed.give;
						const next = {
							name: give.name,
							left: give.left
						};
						const drop = (buff) => buff.name === give.name;
						for (const otherId of summonedTrustIds()) {
							if (otherId === id) continue;
							const other = liveTrusts[otherId];
							if (!other || other.ko || yardsFrom(id, otherId) > 10) continue;
							putTrustStatus(other, next, drop, false);
						}
						if ((trustPlaces[id]?.party ?? 99) <= 10) grantPlayerStatus(next, drop, false);
					}
					const self = landed.dmg <= 0 && !landed.enfeeble;
					queueTrustFloater({
						id,
						name: cast.name,
						amount: landed.dmg > 0 ? String(landed.dmg) : "",
						self,
						motion: null,
						spell: cast.name,
						at: self ? "self" : "hare"
					});
					set({
						...park ? struckPatch(park) : {
							hareHp: liveHareHp,
							...hateNow(),
							hareEnfeebles: liveEnfeebles.map((row) => ({ ...row }))
						},
						trustVitals: trustVitalsNow(),
						...landed.area ? { buffs: liveBuffs.map((buff) => ({ ...buff })) } : {}
					});
					state.pushLog(`${caster} casts ${landed.text}`, landed.dmg > 0 ? "hit" : "info");
				} finally {
					if (park) restoreKin(park);
				}
				return;
			}
		}
		if (spell?.raise) {
			const ally = typeof cast.targetId === "string" && cast.targetId !== "player" ? cast.targetId : null;
			if (ally) {
				const who = trustName(ally);
				const near = yardsBetween(id, ally) <= (spell.range ?? 20);
				const revived = near ? acceptRaise(ally, spell.raise) : null;
				if (!near) state.pushLog(`${caster} casts ${cast.name}. ${who} is out of range.`, "miss");
				else if (!revived) state.pushLog(`${caster} casts ${cast.name}. No effect.`, "info");
				else {
					set({
						trustVitals: trustVitalsNow(),
						...hateNow()
					});
					state.pushLog(`${who} accepts the raise.`, "info");
				}
				return;
			}
			const revived = cast.targetId === "player" && state.ko ? resolveRaise(spell.raise, {
				ko: true,
				level: 75,
				maxHp: hpCap(),
				weakness: weaknessForRaise()
			}) : null;
			if (!revived) {
				state.pushLog(`${caster} casts ${cast.name}. No effect.`, "info");
				return;
			}
			dropHateRow("player");
			liveWeakness = revived.weakness;
			clearFallenWeak();
			livePending = null;
			set({
				ko: false,
				hp: revived.hp,
				weakness: liveWeakness,
				pendingRaise: null,
				...hateNow(),
				spellMark: {
					text: revived.hp > 0 ? `+${revived.hp}` : "0",
					raise: spell.raise,
					gain: revived.hp
				}
			});
			state.pushLog(`${caster} casts ${cast.name}. You stand where you fell. The ${HARE.name} does not turn on you.`, "info");
			return;
		}
		if (spell && (spell.na || spell.erase || spell.esuna || spell.sacrifice)) {
			const who = enhancingWho(id, cast.targetId);
			const label = recipientName(who);
			let text = `${caster} casts ${cast.name}.`;
			let cleanedPlayer = false;
			const onYou = who === "player" && !state.ko;
			const esunaNear = spell.esuna && !state.ko && fromYou <= (spell.radius ?? 10);
			if (spell.sacrifice) text = `${text} No effect.`;
			else if (spell.esuna) {
				if (!esunaNear) text = `${text} Xanosuke is out of range.`;
				else {
					const healing = combinedSkill("Healing Magic", casterJob, 75, sub, subjobLevel(75));
					const cleaned = resolveCleanse(spell, liveAilments, {
						misery: trust.buffs.some((buff) => buff.name === "Afflatus Misery"),
						solace: trust.buffs.some((buff) => buff.name === "Afflatus Solace"),
						healing,
						roll: Math.random()
					});
					liveAilments = cleaned.ailments;
					cleanedPlayer = true;
					text = `${text} ${cleaned.text}`;
				}
			} else if (!onYou) text = `${text} No effect.`;
			else if (!enhancingNear(id, "player", spell.range ?? PARTY_CAST_RANGE)) text = `${text} ${label} is out of range.`;
			else {
				const healing = combinedSkill("Healing Magic", casterJob, 75, sub, subjobLevel(75));
				const cleaned = resolveCleanse(spell, liveAilments, {
					misery: trust.buffs.some((buff) => buff.name === "Afflatus Misery"),
					solace: trust.buffs.some((buff) => buff.name === "Afflatus Solace"),
					healing,
					roll: Math.random()
				});
				liveAilments = cleaned.ailments;
				cleanedPlayer = true;
				text = `${text} ${cleaned.text}`;
			}
			const fixed = castEnmity(spell, false);
			creditHate(fixed.ce, fixed.ve, fixed.claims, id);
			queueTrustFloater({
				id,
				name: cast.name,
				amount: "",
				self: true,
				motion: null,
				spell: cast.name,
				at: cleanedPlayer ? "player" : "self"
			});
			set({
				ailments: liveAilments.map((row) => ({ ...row })),
				...hateNow(),
				trustVitals: trustVitalsNow()
			});
			state.pushLog(text, "info");
			return;
		}
		if (!spell?.cure) {
			const park = foeIsKin() ? borrowKin() : null;
			try {
				let dmg = 0;
				let hpGain = 0;
				let mpGain = 0;
				let stunCut = false;
				let text = `${caster} casts ${cast.name}.`;
				if (spell?.nuke) {
					const rolled = elementalD(spell.nuke, sheet.int + colureStat(liveBuffs, "INT") - hareInt(), 0);
					if (rolled != null) {
						const element = castElement(spell);
						const burst = scaleBurst(rolled, element, sheet.magicBurstBonus);
						const weathered = weatherAdjusted(applyMab(burst.value, sheet.mab, hareTargetMdb()), element, trust.buffs);
						dmg = cast.nukeMul && cast.nukeMul !== 1 ? Math.floor(weathered.value * cast.nukeMul) : weathered.value;
						text = `${burst.name ? `${caster} magic bursts ${cast.name}. ` : ""}${caster} casts ${cast.name}. The ${HARE.name} takes ${dmg} points of damage.${weathered.note}`;
					}
				} else if (spell?.banish || spell?.holy) {
					const dMnd = sheet.mnd - HARE.mnd;
					const burst = scaleBurst(spell.banish ? banishDamage(spell.banish, dMnd, 0, 0, HARE.undead) : holyDamage(dMnd, 0, 0), "light", sheet.magicBurstBonus);
					const weathered = weatherAdjusted(applyMab(burst.value, sheet.mab, hareTargetMdb()), "light", trust.buffs);
					dmg = weathered.value;
					text = `${burst.name ? `${caster} magic bursts ${cast.name}. ` : ""}${caster} casts ${cast.name}. The ${HARE.name} takes ${dmg} points of damage.${weathered.note}`;
					if (spell.banish) {
						const next = resolveBanishDown(liveBanish, spell.banish, HARE.undead);
						if (next && next !== liveBanish) text = `${text} Its special defense falls.`;
						liveBanish = next;
					}
				} else if (spell?.enfeeble && isDiaSpell(spell.enfeeble)) {
					const hit = applyMab(scaleBurst(DIA_HIT[spell.enfeeble], "light", sheet.magicBurstBonus).value, sheet.mab, hareTargetMdb());
					dmg = hit;
					if (slipCanLand(liveEnfeebles.find((row) => isSlipSpell(row.name))?.name ?? null, spell.enfeeble)) {
						const def = diaDefenseNumer(spell.enfeeble);
						liveEnfeebles = liveEnfeebles.filter((row) => !isSlipSpell(row.name));
						liveEnfeebles = [...liveEnfeebles, {
							name: spell.enfeeble,
							left: DIA_SECONDS[spell.enfeeble],
							power: def,
							dot: DIA_DOT[spell.enfeeble],
							acc: 0
						}];
						text = `${caster} casts ${cast.name}. The light hit is ${hit}.`;
					} else text = `${caster} casts ${cast.name}. The light hit is ${hit}.`;
				} else if (spell?.enfeeble && isBioSpell(spell.enfeeble)) {
					const hit = applyMab(scaleBurst(BIO_HIT[spell.enfeeble], "dark", sheet.magicBurstBonus).value, sheet.mab, hareTargetMdb());
					dmg = hit;
					const dot = bioPotency(combinedSkill("Dark Magic", sheet.job, 75, sheet.sub, sheet.subLevel), spell.enfeeble);
					const atk = bioAttackNumer(spell.enfeeble);
					const current = liveEnfeebles.find((row) => isSlipSpell(row.name));
					text = `${caster} casts ${cast.name}. The dark hit is ${hit}.`;
					if (bioCanLand(current?.name ?? null, spell.enfeeble)) {
						const status = rollFixed(BIO_SECONDS[spell.enfeeble], castMagicAccuracy(spell, sheet), "dark");
						if (status.state !== 2) {
							liveEnfeebles = liveEnfeebles.filter((row) => !isSlipSpell(row.name));
							liveEnfeebles = [...liveEnfeebles, {
								name: spell.enfeeble,
								left: status.left,
								power: atk,
								dot,
								acc: 0
							}];
							text = `${text}${halfNote(status.state, status.left)} ${dot} HP slips every 3 seconds.`;
						}
					}
				} else if (spell) {
					const landed = applyTrustStatus(caster, spell, sheet, {
						hp: trust.hp,
						maxHp: trust.maxHp,
						mp: trust.mp,
						maxMp: trust.maxMp
					});
					if (landed) {
						dmg = landed.dmg;
						hpGain = landed.hpGain;
						mpGain = landed.mpGain;
						stunCut = landed.stunCut;
						text = `${caster} casts ${cast.name}. ${landed.text}`;
					}
				}
				if (hpGain > 0) trust.hp = Math.min(trust.maxHp, trust.hp + hpGain);
				if (mpGain > 0) trust.mp = Math.min(trust.maxMp, trust.mp + mpGain);
				const burst = dmg > 0 && spell ? magicBurstOf(castElement(spell), chainFoe()) : null;
				if (burst && dmg > 0) text = `${caster} magic bursts ${cast.name}. The ${HARE.name} takes ${dmg} points of damage.`;
				const offensive = !!(spell && (spell.nuke || spell.holy || spell.banish || spell.flash || spell.repose || spell.enfeeble || spell.debuff || spell.siphon));
				const at = !spell || offensive ? "hare" : cast.targetId === "player" ? "player" : "self";
				queueTrustFloater({
					id,
					name: cast.name,
					amount: burst && dmg > 0 ? String(dmg) : "",
					self: at !== "hare",
					motion: null,
					spell: cast.name,
					at
				});
				if (dmg > 0) {
					creditDamage(dmg, id);
					const dead = chipHare(dmg);
					if (!dead && clearSleep()) text = `${text} The ${HARE.name} wakes.`;
					if (!dead && bindWearsOff(dmg) && clearBind()) text = `${text} Bind wears off.`;
				}
				if (spell) {
					const fixed = castEnmity(spell, false);
					creditHate(fixed.ce, fixed.ve, fixed.claims, id);
				}
				if (stunCut) set({ hareAction: null });
				set({
					...struckPatch(park),
					banishDown: liveBanish ? { ...liveBanish } : null,
					trustVitals: trustVitalsNow()
				});
				state.pushLog(text, dmg > 0 ? "hit" : "info");
			} finally {
				if (park) restoreKin(park);
			}
			return;
		}
		const onPlayer = cast.targetId === "player" && !state.ko;
		const onSelf = cast.targetId === id && !trust.ko;
		const otherId = cast.targetId && cast.targetId !== id && cast.targetId !== "player" ? cast.targetId : null;
		const other = otherId ? liveTrusts[otherId] : null;
		const onOther = !!other && !other.ko;
		if (!onPlayer && !onSelf && !onOther) {
			queueTrustFloater({
				id,
				name: cast.name,
				amount: "",
				self: true,
				motion: null,
				spell: cast.name,
				at: "self"
			});
			state.pushLog(`${caster} casts ${cast.name}.`, "info");
			return;
		}
		if (onOther && otherId && !enhancingNear(id, otherId, spell.range ?? PARTY_CAST_RANGE)) {
			queueTrustFloater({
				id,
				name: cast.name,
				amount: "",
				self: true,
				motion: null,
				spell: cast.name,
				at: "self"
			});
			state.pushLog(`${caster} casts ${cast.name}. ${trustName(otherId)} is out of range.`, "info");
			return;
		}
		const divine = trust.buffs.some((buff) => buff.name === "Divine Seal");
		const healing = combinedSkill("Healing Magic", casterJob, 75, sub, subjobLevel(75));
		const otherSheet = onOther && otherId ? trustCombat(otherId, trustSubOf(state.party, otherId), trustGearOf(state.party, otherId)) : null;
		const targetVit = onPlayer ? state.sheet.vit : onSelf ? sheet.vit : otherSheet?.vit ?? sheet.vit;
		const targetHp = onPlayer ? state.hp : onSelf ? trust.hp : other?.hp ?? 0;
		const targetMax = onPlayer ? hpCap() : onSelf ? trust.maxHp : other?.maxHp ?? 0;
		const rawCure = cureFinal(cureBase(spell.cure, curePower(sheet.mnd, targetVit, healing)), divine);
		const amount = cast.cureMul && cast.cureMul !== 1 ? Math.floor(rawCure * cast.cureMul) : rawCure;
		if (divine) trust.buffs = trust.buffs.filter((buff) => buff.name !== "Divine Seal");
		const healed = Math.min(Math.max(0, targetMax - targetHp), amount);
		if (onSelf) trust.hp = Math.min(targetMax, targetHp + healed);
		if (onOther && other) other.hp = Math.min(targetMax, targetHp + healed);
		const solace = trust.buffs.some((buff) => buff.name === "Afflatus Solace");
		let coat = 0;
		if (solace) {
			const skinNow = onPlayer ? liveBuffs.find((buff) => buff.name === "Stoneskin") : (onOther && other ? other : trust).buffs.find((buff) => buff.name === "Stoneskin");
			if (stoneskinCanLand(skinNow ? stoneskinSource(skinNow.skinFrom) : null)) {
				coat = solaceSkin(amount);
				if (coat > 0) {
					if (onPlayer) {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Stoneskin");
						liveBuffs = [...liveBuffs, {
							name: "Stoneskin",
							left: 30,
							skin: coat,
							skinFrom: "solace"
						}];
					} else {
						const row = onOther && other ? other : trust;
						row.buffs = row.buffs.filter((buff) => buff.name !== "Stoneskin");
						row.buffs.push({
							name: "Stoneskin",
							left: 30,
							power: coat,
							skinFrom: "solace"
						});
					}
				}
			}
		}
		if (onPlayer && (healed > 0 || coat > 0)) set({
			...healed > 0 ? { hp: Math.min(targetMax, targetHp + healed) } : {},
			...coat > 0 ? { buffs: liveBuffs.map((buff) => ({
				...buff,
				enspell: buff.enspell ? { ...buff.enspell } : void 0
			})) } : {}
		});
		if ((onSelf || onOther) && (healed > 0 || coat > 0)) set({ trustVitals: trustVitalsNow() });
		const whoHealed = onPlayer ? "Xanosuke" : onSelf ? caster : trustName(otherId ?? id);
		queueTrustFloater({
			id,
			name: cast.name,
			amount: healed > 0 ? `+${healed}` : "",
			self: true,
			motion: null,
			spell: cast.name,
			at: onPlayer ? "player" : "self",
			...onOther && otherId ? { markId: otherId } : {}
		});
		const healLine = healed > 0 ? `${whoHealed} recovers ${healed} HP.` : `${whoHealed}'s HP is full.`;
		const skinLine = coat > 0 ? ` Afflatus Solace grants Stoneskin of ${coat}.` : "";
		state.pushLog(`${caster} casts ${cast.name}. ${healLine}${skinLine}`, "info");
		} finally {
			if (id === "shikaree-z" && trustWyvern()) {
				const done = spellByName(cast.name);
				if (done) noteWyvernSpell(done.school, "shikaree-z");
			}
			if (packPark) endPackStrike(packPark);
			if (colureLanded) {
				syncHostileColures();
				syncAllyGeo();
				syncTrustIndi();
				set({
					buffs: liveBuffs.map((buff) => ({ ...buff })),
					hareEnfeebles: liveEnfeebles.map((row) => ({ ...row })),
					kinEnfeebles: kinEnfeebles.map((row) => ({ ...row })),
					...hateNow(),
					trustVitals: trustVitalsNow()
				});
			}
			pinnedFoe = prevPin;
		}
	};
	const actTrust = (id, trust) => {
		const state = useGame.getState();
		const board = state.gambits[id] ?? blankBoard();
		if (!board.on || trust.ko) {
			noteTrustStep(id, null);
			if (!board.on) trust.engaged = false;
			return;
		}
		const sub = trustSubOf(state.party, id);
		const gear = trustGearOf(state.party, id);
		const kit = trustKit(id, sub, state.jobLevels);
		const sheet = trustCombat(id, sub, gear);
		const place = trustPlaces[id] ?? {
			yards: 99,
			melee: false,
			party: 99
		};
		const yards = gambitDistance(place.yards, struckYards());
		const placed = Number.isFinite(place.yards) && place.yards < 90;
		const caster = trustName(id);
		const casterJob = trustById(id)?.job ?? "WHM";
		const actor = {
			hp: trust.hp,
			maxHp: trust.maxHp,
			mp: trust.mp,
			maxMp: trust.maxMp,
			tp: trust.tp,
			ko: trust.ko,
			targeted: trust.engaged || state.targeted,
			inRange: placed ? place.melee : state.inRange,
			distance: yards,
			partyRange: place.party < 90 ? place.party : 0,
			manafont: trust.buffs.some((buff) => buff.name === "Manafont"),
			buffs: trust.buffs.map(scanBuff),
			recasts: trust.recasts,
			job: casterJob,
			sub,
			skillName: gear.main,
			skill: sheet.skill,
			weaponName: sheet.weaponName,
			delay: sheet.delay,
			vit: sheet.vit,
			monkLevel: casterJob === "MNK" ? kit.mainLevel : sub === "MNK" ? kit.levels.MNK ?? 0 : 0,
			monkMain: casterJob === "MNK",
			foe: gambitFoe(),
			foes: foesNearTrust(id),
			foeCount: chasedPack().length ? chasedPack().length : packClaim() ? 0 : fightBodies().length,
			levels: kit.levels,
			cureParty: true,
			knownSpells: kit.spells.map((row) => row.name),
			engaged: trust.engaged,
			skillchain: burstChainName(chainFoe()),
			arms: trustArms(gear, sheet),
			shield: gear.off === "Shield" ? 0 : null,
			pldLevel: casterJob === "PLD" ? kit.mainLevel : sub === "PLD" ? kit.levels.PLD ?? 0 : 0,
			pldMain: casterJob === "PLD",
			ninLevel: casterJob === "NIN" ? kit.mainLevel : sub === "NIN" ? kit.levels.NIN ?? 0 : 0,
			ninMain: casterJob === "NIN",
			brdMain: casterJob === "BRD",
			drkLevel: casterJob === "DRK" ? kit.mainLevel : sub === "DRK" ? kit.levels.DRK ?? 0 : 0,
			drkMain: casterJob === "DRK",
			bluLevel: casterJob === "BLU" ? kit.mainLevel : sub === "BLU" ? kit.levels.BLU ?? 0 : 0,
			bluMain: casterJob === "BLU",
			pupLevel: casterJob === "PUP" ? kit.mainLevel : sub === "PUP" ? kit.levels.PUP ?? 0 : 0,
			pupMain: casterJob === "PUP",
			twoHand: twoHandKind(gear.main),
			avatarName: casterJob === "SMN" ? trustAvatarPet()?.name ?? null : null,
			petCalls: casterJob === "DRG" || casterJob === "BST" || casterJob === "PUP",
			stepRows: rowsForStep(),
			ability: scanAbilityFields({
				trust: true,
				main: casterJob,
				sub,
				mainLevel: kit.mainLevel,
				subLevel: sub ? kit.levels[sub] ?? 0 : 0,
				buffs: trust.buffs,
				recasts: trust.recasts,
				tp: trust.tp,
				enfeebles: rowsForStep(),
				chainOpen: chainIsOpen(foeIsKin() ? "kin" : "hare"),
				skill: sheet.skill,
				divine: combinedSkill("Divine Magic", casterJob, 75, sub, sub ? kit.levels?.[sub] ?? subjobLevel(75) : 0),
				str: sheet.str,
				dex: sheet.dex,
				agi: sheet.agi,
				int: sheet.int,
				mnd: sheet.mnd,
				chr: sheet.chr,
				dmg: sheet.dmg,
				fstr: sheet.fstr,
				hit: sheet.hit,
				targetHp: foeIsKin() ? useGame.getState().kinHp : useGame.getState().hareHp,
				ammo: state.loadout.ammo,
				jugLeft: state.loadout.ammo === "fish-oil-broth" ? jugCount(state.inventory, FISH_OIL_BROTH) : 0,
				oilLeft: state.loadout.ammo === "automaton-oil" ? oilCount(state.inventory) : 0,
				foodCounts: petFoodCounts(state.inventory),
				foodId: typeof state.flags.rewardFood === "string" ? state.flags.rewardFood : null,
				gun: casterJob === "COR" && gear.range === "Marksmanship",
				bullet: casterJob === "COR" && gear.range === "Marksmanship",
				gunDmg: ITEMS$1.musketoon?.dmg ?? 0,
				bulletDmg: ITEMS$1["bronze-bullet"]?.dmg ?? 0,
				animator: casterJob === "PUP" || sub === "PUP"
			})
		};
		const allies = trustAllies(id, trust);
		const approach = gambitApproach(board, actor, allies);
		noteTrustStep(id, approach);
		if (approach) return;
		const hit = scanGambit(board, actor, allies);
		if (!hit || hit.kind === "hold") return;
		aimClaimedFoe(hit);
		if (hit.actionId === "engage") {
			if (!trust.engaged) useGame.getState().pushLog(`${caster} engages the ${HARE.name}.`, "info");
			trust.engaged = true;
			return;
		}
		const action = findAction(hit.actionId);
		if (!action) return;
		if (action.kind === "spell") {
			const spell = spellByName(action.name);
			if (!spell || spell.recast == null || spell.recast <= 0) return;
			const namedPack = packBodyFromFoe(hit.foeId);
			let foeNow = null;
			let packId = null;
			if (hit.foeId === "hare" || hit.foeId === "kin") foeNow = hit.foeId;
			else if (!useGame.getState().targeted && (namedPack || hit.foeId === "pack")) {
				foeNow = "pack";
				packId = namedPack ? namedPack.id : packOpened()?.id ?? null;
			} else if (hit.aim === "enemy") {
				const forest = useGame.getState().targeted ? null : packOpened();
				if (forest) {
					foeNow = "pack";
					packId = forest.id;
				} else if (packClaim()) return;
				else foeNow = playerFoe();
			}
			if (foeNow === "pack" && !packId) return;
			if (foeNow && foeNow !== "pack" && (foeNow === "kin" ? liveKinHp : liveHareHp) <= 0) return;
			if (hit.aim === "enemy" && !foeNow) return;
			const manafont = trust.buffs.some((buff) => buff.name === "Manafont");
			const chainspell = trust.buffs.some((buff) => buff.name === "Chainspell");
			const composure = trust.buffs.some((buff) => buff.name === "Composure");
			const songBase = spell.song && trust.buffs.some((buff) => buff.name === "Pianissimo") ? pianissimoCast(spell.cast ?? 0, true) : spell.cast ?? 0;
			let castTime = fastCastSeconds(spell.school === "elemental" ? elementalCastSeconds(songBase, sheet.celerity || 0) : songBase, sheet.fastCast || 0);
			const recastBase = trust.buffs.some((buff) => buff.name === "Majesty") && spell.cure ? spell.recast * MAJESTY_RECAST : spell.recast;
			const recastRolled = chainspell ? 0 : composureRecast(fastCastRecast(hastedRecast(recastBase, hasteMagic(trust.buffs)), sheet.fastCast || 0), composure);
			const scholar = scholarCastAdjust(spell, trust.buffs, manafont ? 0 : spell.mp ?? 0, castTime, recastRolled, casterJob, sub, kit.mainLevel, sub ? kit.levels[sub] ?? 0 : 0);
			if (scholar.block) return;
			if (scholar.spent.length) {
				const spent = new Set(scholar.spent);
				trust.buffs = trust.buffs.filter((buff) => !spent.has(buff.name));
			}
			castTime = chainspell ? CHAINSPELL_CAST_SECONDS : scholar.cast;
			let cost = manafont ? 0 : scholar.cost;
			if (cost > 0 && Math.random() < Math.min(1, Math.max(0, (sheet.conserveMp || 0) + rollCombat(trust.buffs).conserve / 100))) cost = conserveMpCost(cost, Math.floor(Math.random() * 4));
			if (trust.mp < cost) return;
			trust.mp -= cost;
			breakActorTravel(id, castBreaksMazurka(spell) ? "offense" : "spell");
			trust.recasts[spell.name] = scholar.recast;
			trust.cast = {
				name: spell.name,
				left: castTime,
				total: castTime,
				targetId: hit.targetId ?? null,
				foeId: foeNow,
				packId,
				mpSpent: cost,
				nukeMul: scholar.nukeMul,
				cureMul: scholar.cureMul
			};
			useGame.getState().pushLog(`${caster} casts ${spell.name}.`, "info");
			if (trust.cast.left <= 0) {
				finishTrustCast(id, trust);
				trust.skipScan = true;
			}
			return;
		}
		if (action.kind === "ability") {
			if (action.id.startsWith("pact:")) {
				castTrustPact(id, trust, action.name);
				trust.lock = 1;
				useGame.getState().pushLog(`${caster} uses ${action.name}.`, "info");
				useGame.setState({ trustVitals: trustVitalsNow(), ...hateNow() });
				return;
			}
			const packBody = packBodyFromFoe(hit.foeId);
			const packPark = packBody ? beginPackStrike(packBody.id) : null;
			try {
			const stealNames = action.name === "Accomplice" || action.name === "Collaborator";
			const target = stealNames ? hit.targetId ?? null : null;
			const stealFrom = target && target !== id ? target : null;
			const allyDistance = !stealNames ? void 0 : stealFrom == null ? null : stealFrom === "player" ? trustPlaces[id]?.party ?? 99 : yardsFrom(id, stealFrom);
			const waltzOn = isWaltz(action.name);
			let waltzCenter = "self";
			if (waltzOn && hit.targetId && hit.targetId !== id) {
				const want = hit.targetId;
				if (want === "player" && !state.ko) waltzCenter = "player";
				else if (want !== "player" && liveTrusts[want] && !liveTrusts[want].ko) waltzCenter = want;
			}
			const waltzAlly = waltzOn && waltzCenter !== "self";
			const waltzDistance = waltzAlly ? yardsBetween(id, waltzCenter) : 0;
			const waltzVit = waltzOn ? vitOf(waltzCenter === "self" ? id : waltzCenter) : sheet.vit;
			const openingCharm = id === "lhu-mhakaracca" && (action.name === "Charm" || action.name === "Tame");
			const measuredFoe = id === "lhu-mhakaracca" && (openingCharm || action.name === "Gauge");
			let charmFoe = null;
			let charmDistance = yards;
			if (measuredFoe) {
				charmFoe = trustCharmFoe(hit);
				const measured = trustFoeYards(id, charmFoe);
				if (measured != null) charmDistance = measured;
			}
			const herCharm = (charmOwner === id && charm != null) || (packCharm != null && packCharm.owner === id);
			const result = tryAbility(action.name, {
				...actor.ability,
				recastLeft: trust.recasts[action.name] ?? 0,
				targeted: hit.aim === "enemy" || state.targeted,
				distance: waltzOn ? waltzDistance : measuredFoe ? charmDistance : yards,
				mp: trust.mp,
				delay: sheet.delay,
				vit: sheet.vit,
				mnd: sheet.mnd,
				maxHp: trust.maxHp,
				monkLevel: casterJob === "MNK" ? kit.mainLevel : sub === "MNK" ? kit.levels.MNK ?? 0 : 0,
				monkMain: casterJob === "MNK",
				seigan: trust.buffs.some((buff) => buff.name === "Seigan"),
				shield: gear.off === "Shield" ? 0 : null,
				pldLevel: casterJob === "PLD" ? kit.mainLevel : sub === "PLD" ? kit.levels.PLD ?? 0 : 0,
				pldMain: casterJob === "PLD",
				hp: trust.hp,
				ninLevel: casterJob === "NIN" ? kit.mainLevel : sub === "NIN" ? kit.levels.NIN ?? 0 : 0,
				ninMain: casterJob === "NIN",
				brdMain: casterJob === "BRD",
				drkLevel: casterJob === "DRK" ? kit.mainLevel : sub === "DRK" ? kit.levels.DRK ?? 0 : 0,
				drkMain: casterJob === "DRK",
				bluLevel: casterJob === "BLU" ? kit.mainLevel : sub === "BLU" ? kit.levels.BLU ?? 0 : 0,
				bluMain: casterJob === "BLU",
				pupLevel: casterJob === "PUP" ? kit.mainLevel : sub === "PUP" ? kit.levels.PUP ?? 0 : 0,
				pupMain: casterJob === "PUP",
				automatonOut: automaton != null,
				autoHp: automaton?.hp ?? 0,
				autoMax: automaton?.max ?? 0,
				oilItem: state.loadout.ammo,
				oilLeft: state.loadout.ammo === "automaton-oil" ? oilCount(state.inventory) : 0,
				oilCopy: true,
				bstLevel: casterJob === "BST" ? kit.mainLevel : sub === "BST" ? kit.levels.BST ?? 0 : 0,
				bstMain: casterJob === "BST",
				jugOut: casterJob === "BST" ? trustJug() != null : jug != null,
				charmOut: casterJob === "BST" ? action.name === "Charm" || action.name === "Tame" ? charm != null || packCharm != null : herCharm : false,
				playerLevel: 75,
				playerChr: sheet.chr,
				playerInt: sheet.int,
				targetLevel: HARE.level,
				targetChr: HARE.chr,
				targetInt: HARE.int,
				charmRoll: 1 + Math.floor(Math.random() * 100),
				tameBonus: id === "lhu-mhakaracca" && trustTamePrimed ? 10 : 0,
				sharedHate: openingCharm ? foeSharedHate(id, charmFoe) : (state.quarry === "kin" ? kinHateRows : hateRows).some((row) => row.id !== id && (row.ce > 0 || row.ve > 0)),
				foeAlive: openingCharm || action.name === "Gauge" && id === "lhu-mhakaracca" ? charmBodyAlive(charmFoe) : state.quarry === "kin" ? liveKinHp > 0 : liveHareHp > 0,
				charmTp: charm?.who === "kin" ? liveKinTp : useGame.getState().hareTp,
				readyCharges: casterJob === "BST" ? trustJug()?.charges ?? (charmOwner === id && charm ? charm.charges ?? 0 : packCharm?.owner === id ? packCharm.charges ?? 0 : 3) : readyBank.charges,
				petDistance: casterJob === "BST" && herCharm ? packCharm && packCharm.owner === id ? trustFoeYards(id, packCharm.id) : trustCharmYards() : masterToPet(),
				sicRoll: Math.floor(Math.random() * 4),
				foodCounts: petFoodCounts(state.inventory),
				foodId: typeof state.flags.rewardFood === "string" ? state.flags.rewardFood : null,
				foodCopy: true,
				petHp: jug?.hp ?? 0,
				petMax: jug?.max ?? 0,
				twoHand: twoHandKind(gear.main),
				thfMain: casterJob === "THF",
				allyDistance,
				mobDistance: yards,
				...corsairCastFields({
					main: casterJob,
					sub,
					mainLevel: kit.mainLevel,
					subLevel: sub === "COR" ? kit.levels.COR ?? 0 : 0,
					buffs: trust.buffs,
					recasts: trust.recasts,
					gun: casterJob === "COR" && gear.range === "Marksmanship",
					bullet: casterJob === "COR" && gear.range === "Marksmanship",
					gunDmg: ITEMS$1.musketoon?.dmg ?? 0,
					bulletDmg: ITEMS$1["bronze-bullet"]?.dmg ?? 0,
					agi: sheet.agi
				}),
				...dancerCastFields({
					main: casterJob,
					sub,
					mainLevel: kit.mainLevel,
					subLevel: sub === "DNC" ? kit.levels.DNC ?? 0 : 0,
					buffs: trust.buffs,
					tp: trust.tp,
					chr: sheet.chr,
					ability: action.name,
					enfeebles: rowsForStep(),
					waltzAlly,
					waltzCenter,
					chainOpen: chainIsOpen(foeIsKin() ? "kin" : "hare")
				}),
				...runeCastFields({
					main: casterJob,
					sub,
					mainLevel: kit.mainLevel,
					subLevel: sub === "RUN" ? kit.levels.RUN ?? 0 : 0,
					buffs: trust.buffs,
					skill: sheet.skill,
					divine: combinedSkill("Divine Magic", casterJob, 75, sub, sub ? kit.levels?.[sub] ?? subjobLevel(75) : 0),
					str: sheet.str,
					dex: sheet.dex,
					agi: sheet.agi,
					int: sheet.int,
					mnd: sheet.mnd,
					chr: sheet.chr,
					targetHp: foeIsKin() ? useGame.getState().kinHp : useGame.getState().hareHp
				}),
				...scholarCastFields({
					main: casterJob,
					sub,
					mainLevel: kit.mainLevel,
					subLevel: sub === "SCH" ? kit.levels.SCH ?? 0 : 0,
					buffs: trust.buffs,
					enfeebles: foeEnfeebleRows()
				}),
				...geoCastFields({
					main: casterJob,
					sub,
					mainLevel: kit.mainLevel,
					subLevel: sub === "GEO" ? kit.levels.GEO ?? 0 : 0,
					buffs: trust.buffs
				}),
				hitChance: sheet.hit,
				vit: waltzVit
			});
			if (!result.ok) return;
			const trustTravel = abilityTravelMode(action.name, result);
			if (trustTravel) breakActorTravel(id, trustTravel);
			if (result.recast != null) trust.recasts[action.name] = result.recast;
			if (result.share) {
				const clock = result.shareRecast != null ? result.shareRecast : result.recast;
				if (clock != null) for (const shared of result.share) trust.recasts[shared] = clock;
			}
			if (result.replaces?.length) {
				const replaced = new Set(result.replaces);
				const gone = trust.buffs.filter((buff) => replaced.has(buff.name));
				if (gone.length) {
					trust.buffs = trust.buffs.filter((buff) => !replaced.has(buff.name));
					for (const buff of gone) useGame.getState().pushLog(`${buff.name} wears off.`, "info");
				}
			}
			if (result.fullCircle) dismissLuopan(null);
			if (result.charges != null || result.spend) {
				let strat = trust.buffs.find((buff) => buff.name === "Stratagem");
				if (!strat) {
					strat = { name: "Stratagem", left: 7200, power: 0, hold: true };
					trust.buffs.push(strat);
				}
				if (result.charges != null) {
					strat.power = result.charges;
					strat.hold = true;
					strat.left = 7200;
				} else if (result.spend) strat.power = Math.max(0, (strat.power ?? 0) - 1);
			}
			let heard = [];
			let valianceBlocked = false;
			if (result.buff) {
				valianceBlocked = result.buff.name === "Valiance" && trust.buffs.some((buff) => buff.name === "Vallation");
				const other = result.buff.name === "Afflatus Solace" ? "Afflatus Misery" : result.buff.name === "Afflatus Misery" ? "Afflatus Solace" : result.buff.name === "Hasso" ? "Seigan" : result.buff.name === "Seigan" ? "Hasso" : result.buff.name === "Yonin" ? "Innin" : result.buff.name === "Innin" ? "Yonin" : null;
				if (result.buff.name === "Meditate") {
					trust.meditateAcc = 0;
					trust.meditateGained = 0;
					const landed = takeMeditate(false, 0, trust.tp, 1);
					trust.meditateGained = landed.gained;
					trust.tp = landed.tp;
					if (landed.gain > 0) useGame.getState().pushLog(`${caster}'s ${landed.text}`, "info");
				}
				const clearingJig = result.buff.name === "Flee" && trust.buffs.some((buff) => buff.name === "Chocobo Jig");
				const hadFinishing = result.buff.name === "Finishing Move" ? trust.buffs.find((buff) => buff.name === "Finishing Move")?.power ?? 0 : 0;
				const finishingPower = result.buff.name === "Finishing Move" && hadFinishing > (result.buff.power ?? 0) ? hadFinishing : result.buff.power;
				if (!valianceBlocked) {
					trust.buffs = trust.buffs.filter((buff) => buff.name !== result.buff.name && buff.name !== other && !(result.buff.name === "Flee" && buff.name === "Chocobo Jig"));
					if (clearingJig) useGame.getState().pushLog(`${caster}'s Chocobo Jig wears off.`, "info");
					trust.buffs.push({
						name: result.buff.name,
						left: result.buff.duration,
						...result.buff.hold ? { hold: true } : {},
						...finishingPower != null ? { power: finishingPower } : {}
					});
				}
				heard = splashPartyAbility(result.buff.name, result.buff.duration, finishingPower, id);
			}
			if (result.fullHeal) trust.hp = trust.maxHp;
			if (result.heal && !result.waltz) trust.hp = Math.min(trust.maxHp, trust.hp + result.heal);
			if (result.convert) {
				const nextHp = Math.min(trust.maxHp, trust.mp);
				const nextMp = Math.min(trust.maxMp, trust.hp);
				trust.hp = nextHp;
				trust.mp = nextMp;
			}
			if (result.tpGrant) trust.tp = Math.min(3e3, trust.tp + result.tpGrant);
			settleCorsair(result, id);
			landDancer(result, id);
			if (result.stun) {
				const park = foeIsKin() ? borrowKin() : null;
				try {
					liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Stun");
					liveEnfeebles = [...liveEnfeebles, {
						name: "Stun",
						left: result.stunSeconds ?? 2
					}];
					set(struckPatch(park));
				} finally {
					if (park) restoreKin(park);
				}
			}
			if (result.sublimationMp && result.sublimationMp > 0) {
				const room = Math.max(0, trust.maxMp - trust.mp);
				const gained = Math.min(room, result.sublimationMp);
				if (gained > 0) trust.mp += gained;
			}
			if (result.helixCut) {
				const cut = (row) => row.name === "Helix" ? {
					...row,
					left: row.left / 2,
					power: 1,
					dot: Math.min(HELIX_TOCK_CAP, (row.dot ?? 0) * 2)
				} : row;
				if (foeIsKin()) kinEnfeebles = kinEnfeebles.map(cut);
				else liveEnfeebles = liveEnfeebles.map(cut);
			}
			if (result.jumpHit && (result.jumpDmg ?? 0) > 0) {
				const landed = hitFoe(result.jumpDmg, id);
				trust.tp = Math.min(3000, trust.tp + (sheet.tpHit ?? 0));
				set({
					dealt: useGame.getState().dealt + result.jumpDmg,
					...foePatch()
				});
				if (!landed.dead) grantFoeMonsterTp(sheet.tpHit ?? 0);
			}
			if (id === "lhu-mhakaracca" && (result.jugCall || result.jugLeave || result.jugStance || result.jugReady || result.familiar || result.charmKeep || result.charmFx || result.tameKeep || result.sic || action.name === "Charm" || action.name === "Tame")) settleTrustBeast(id, trust, result, action.name, openingCharm ? charmFoe : packCharm?.id ?? null);
			else {
			if (result.jugStance && jug) {
				jug.stance = result.jugStance;
				publishPets();
			}
			if (result.jugReady && jug) {
				const move = readyByName(result.jugReady);
				if (move && spendReady(move.charges)) {
					applyReady(move.name);
					publishPets();
				}
			}
			if (result.familiar && jug && !jug.familiar) {
				const next = familiarMaxHp(CARRIE_HP_STANDIN);
				const gift = Math.max(0, next - jug.max);
				jug.max = next;
				jug.hp = Math.min(jug.max, jug.hp + gift);
				jug.familiar = true;
				publishPets();
			}
			}
			if (id === "nashmeira" && (result.automatonCall != null || result.automatonDismiss || result.automatonOrder || result.automatonOverdrive || result.maneuver)) {
				if (result.automatonCall != null) {
					if (!summonTrustAutomaton(result.automatonCall)) delete trust.recasts[action.name];
				} else holdTrustPet(id, () => settleAutomaton(result));
			} else if (result.automatonCall != null || result.automatonDismiss || result.automatonOrder || result.automatonOverdrive || result.maneuver) {
				settleAutomaton(result);
			}
			if (result.wyvernCall || result.wyvernDismiss || result.surgeAbsorb || result.linkCost != null) settleTrustDragoon(id, trust, result, sheet);
			if (result.bash != null && result.bash > 0) {
				const landed = hitFoe(result.bash, id);
				set({
					dealt: useGame.getState().dealt + result.bash,
					...foePatch()
				});
				if (!landed.dead && !result.noTp) grantFoeMonsterTp(100);
				if (landed.woke) useGame.getState().pushLog(`The ${HARE.name} wakes.`, "info");
				if (landed.unbound) useGame.getState().pushLog(`The ${HARE.name}'s Bind effect wears off.`, "info");
			}
			settleQuickDraw(result, false);
			if (result.ko) {
				trust.hp = 0;
				trust.ko = true;
				trust.engaged = false;
				dropHateRow(id);
				if (trustPets[id]) dismissTrustPet(id, id === "shikaree-z" ? "The wyvern leaves." : id === "lhu-mhakaracca" ? "Courier Carrie leaves." : id === "nashmeira" ? "The automaton leaves." : "The avatar leaves.");
			if (id === "lhu-mhakaracca") breakLhuCharm("The charm breaks.");
			}
			if (result.hate && !(id === "lhu-mhakaracca" && (action.name === "Charm" || action.name === "Tame"))) creditHate(result.hate.ce, result.hate.ve, result.claims === true, id, result.quietClaim === true);
			if (result.steal != null && stealFrom) {
				const moved = moveEnmity(stealFrom, id, result.steal);
				const who = stealFrom === "player" ? "you" : trustName(stealFrom);
				useGame.getState().pushLog(moved.ce === 0 && moved.ve === 0 ? `${who} has no enmity to take.` : `${caster}'s ${action.name} takes ${moved.ce} cumulative and ${moved.ve} volatile enmity from ${who}.`, "info");
			}
			if (result.buff?.name === "Hide") dropHateRow(id);
			if (result.runes) trust.buffs = paintRunes(trust.buffs, result.runes);
			if (result.shadowPop && !result.noTp) {
				const popped = popShadow(trust.buffs);
				trust.buffs = popped.buffs;
				if (popped.wore) useGame.getState().pushLog(`${caster}'s ${popped.wore} wears off.`, "info");
			}
			if (result.mpHeal) trust.mp = Math.min(trust.maxMp, trust.mp + result.mpHeal);
			if (result.reward?.copy) feedReward(result.reward);
			if (result.automatonRepair?.copy) spendRepair(result.automatonRepair);
			if (result.gambit) {
				const park = foeIsKin() ? borrowKin() : null;
				try {
					liveEnfeebles = [...liveEnfeebles.filter((row) => row.name !== "Gambit"), {
						name: "Gambit",
						left: result.gambit.left,
						power: result.gambit.power
					}];
				} finally {
					if (park) restoreKin(park);
				}
			}
			trust.lock = 1;
			queueTrustFloater({
				id,
				name: action.name,
				amount: "",
				self: true,
				motion: null,
				ability: action.name
			});
			set({
				...hateNow(),
				trustVitals: trustVitalsNow(),
				hareEnfeebles: liveEnfeebles.map((row) => ({ ...row }))
			});
			const copiedUse = result.reward?.copy || result.automatonRepair?.copy ? `${caster}'s ${result.text}` : null;
			useGame.getState().pushLog(copiedUse ?? (heard.length ? `${caster} uses ${action.name}. ${heard.join(", ")} receives it.${valianceBlocked ? " No effect." : ""}` : `${caster} uses ${action.name}.${valianceBlocked ? " No effect." : ""}`), "info");
			return;
			} finally {
				if (packPark) endPackStrike(packPark);
			}
		}
		if (action.kind === "weaponskill") {
			let ws = weaponRow(action);
			if (!ws || trust.tp < 1e3) return;
			if (!ws.self) breakActorTravel(id, "offense");
			const chainTarget = chainFoe();
			const namedChain = gambitPinsWeaponSkill(board, action.id);
			const opening = namedChain ? null : resonanceProps(chainTarget);
			const bound = !namedChain && chainIsOpen(chainTarget) && peekChain(["Liquefaction"], chainTarget) === "Liquefaction" && (resonanceProps(chainTarget)?.length ?? 0) > 1;
			if (bound) {
				const levelOneOf = (row) => row?.chains.find((prop) => chainLevel(prop) === 1) ?? null;
				if (!levelOneOf(ws)) {
					const choices = trustActionGroups(id, sub, state.jobLevels, gear).find((group) => group.title === "Weapon skills")?.actions ?? [];
					for (const choice of choices) {
						const candidate = findAction(choice.id);
						const row = candidate ? weaponRow(candidate) : null;
						if (levelOneOf(row)) {
							useGame.getState().pushLog(`${caster} uses ${row.name} to close the skillchain.`, "info");
							ws = row;
							break;
						}
					}
				}
			} else if (opening?.length) {
				let best = ws;
				let bestRank = chainRank(opening, ws.chains);
				const choices = trustActionGroups(id, sub, state.jobLevels, gear).find((group) => group.title === "Weapon skills")?.actions ?? [];
				for (const choice of choices) {
					const candidate = findAction(choice.id);
					const row = candidate ? weaponRow(candidate) : null;
					if (!row?.chains.length) continue;
					const rank = chainRank(opening, row.chains);
					if (rank > bestRank) {
						best = row;
						bestRank = rank;
					}
				}
				if (best !== ws && bestRank > 0) {
					useGame.getState().pushLog(`${caster} uses ${best.name} to close the skillchain.`, "info");
					ws = best;
				}
			}
			const spentTp = trust.tp;
			const built = trust.buffs.find((buff) => buff.name === "Building Flourish");
			let builtAtk = 1;
			let builtCrit = 0;
			let builtHit = 0;
			if (built) {
				builtHit = 20;
				if ((built.power ?? 0) >= 2) builtAtk = 1.25;
				if ((built.power ?? 0) >= 3) builtCrit = 10;
				trust.buffs = trust.buffs.filter((buff) => buff.name !== "Building Flourish");
				useGame.getState().pushLog("Building Flourish wears off.", "info");
			}
			const cast = castSword({
				ws,
				tp: spentTp,
				fencerTp: 0,
				stats: sheet,
				hp: trust.maxHp,
				currentHp: trust.hp,
				dmg: sheet.dmg,
				fstr: sheet.fstr,
				pdif: () => rollSwordPdif(sheet.attack * builtAtk / foeVitDefense(foeEnfeebleRows()), Math.random() * 100 < sheet.crit + builtCrit + critEvasionDown(foeEnfeebleRows()), Math.random, sheet.pdifCap),
				hitRoll: Math.random() * 100,
				hitRate: ws.unavoidable ? 100 : Math.min(99, sheet.hit + builtHit),
				doubleAttack: fighterDoubleAttack(sheet.doubleAttack, trust.buffs),
				delay: sheet.delay,
				skill: sheet.skill,
				mp: trust.mp,
				maxMp: trust.maxMp,
				maxHp: trust.maxHp,
				targetMp: HARE.mp,
				targetInt: hareInt(),
				level: 75
			});
			const sekkanokiTrust = (trust.buffs ?? []).some((buff) => buff.name === "Sekkanoki");
			const meikyoTrust = (trust.buffs ?? []).some((buff) => buff.name === "Meikyo Shisui");
			if (sekkanokiTrust && !meikyoTrust) {
				trust.buffs = trust.buffs.filter((buff) => buff.name !== "Sekkanoki");
				trust.tp = tpAfterWeaponSkill(spentTp, cast.kind === "miss" ? 0 : cast.tp, true, false);
			} else trust.tp = cast.tp;
			if (cast.hpGain > 0) trust.hp = Math.min(trust.maxHp, trust.hp + cast.hpGain);
			if (cast.mpGain > 0) trust.mp = Math.min(trust.maxMp, trust.mp + cast.mpGain);
			const hit = cast.kind !== "miss";
			if (!ws.self && hit && cast.dmg > 0) {
				const landed = hitFoe(cast.dmg, id);
				set({
					dealt: useGame.getState().dealt + cast.dmg,
					...foePatch()
				});
				if (!landed.dead && ws.kind === "physical") {
					const hits = Math.max(1, ws.hits);
					for (let i = 0; i < hits; i++) grantFoeMonsterTp(sheet.tpHit);
				} else if (!landed.dead) grantFoeMonsterTp(100);
				if (landed.woke) useGame.getState().pushLog(`The ${HARE.name} wakes.`, "info");
				if (landed.unbound) useGame.getState().pushLog(`The ${HARE.name}'s Bind effect wears off.`, "info");
			}
			if (!ws.self && hit && ws.chains.length) {
				const packBody = livePack().find((row) => row.id === chainTarget);
				const packDead = packBody != null && (packBody.hp <= 0 || packBody.mode === "dead" || packBody.mode === "leash");
				if (!packDead) {
					const chain = offerWeaponSkill(ws.chains, cast.dmg, id, chainTarget);
					if (chain) landChain(chain);
					else noteChain();
				}
			}
			const park = !ws.self && foeIsKin() ? borrowKin() : null;
			let daggerNote = null;
			let gkNote = null;
			let poleNote = null;
			let gunNote = null;
			try {
				daggerNote = landDaggerStatus(ws.name, spentTp, hit);
				gkNote = landGkStatus(ws.name, hit, sheet.int, sheet.mnd);
				poleNote = landPolearmStatus(ws.name, hit);
				gunNote = landMarksmanshipStatus(ws.name, hit);
				if (daggerNote || gkNote || poleNote || gunNote) set({
					...struckPatch(park),
					...gunNote ? { statDown: {
						name: "Sniper Shot",
						stat: "int",
						down: 10,
						left: 140
					} } : {}
				});
			} finally {
				if (park) restoreKin(park);
			}
			if (daggerNote) useGame.getState().pushLog(daggerNote, "info");
			if (gkNote) useGame.getState().pushLog(gkNote, "info");
			if (poleNote) useGame.getState().pushLog(poleNote, "info");
			if (gunNote) useGame.getState().pushLog(gunNote, "info");
			const amount = ws.self ? cast.mpGain > 0 ? `+${cast.mpGain} MP` : cast.hpGain > 0 ? `+${cast.hpGain} HP` : "Full" : hit ? String(cast.dmg) : "Miss";
			queueTrustFloater({
				id,
				name: ws.name,
				amount,
				self: ws.self === true,
				motion: ws.name
			});
			trust.lock = 2.5;
			if (id === "shikaree-z") noteWyvernSkill("shikaree-z");
			useGame.getState().pushLog(`${caster}: ${cast.text}`, cast.kind === "info" ? "info" : cast.kind);
		}
	};
	const publishTrusts = () => {
		const next = trustVitalsNow();
		const prev = useGame.getState().trustVitals;
		const keys = Object.keys(next);
		if (!(keys.length === Object.keys(prev).length && keys.every((id) => {
			const left = next[id];
			const right = prev[id];
			return !!right && left.hp === right.hp && left.mp === right.mp && left.maxHp === right.maxHp && left.maxMp === right.maxMp && left.tp === right.tp && left.casting === right.casting && left.engaged === right.engaged && sameTrustBuffs(left.buffs, right.buffs);
		}))) set({ trustVitals: next });
	};
	const tickTrusts = (dt) => {
		syncTrustIndi();
		const state = useGame.getState();
		if (!state.started) return;
		if (!state.engaged && !readActedBody() && !chasedPack().length) {
			for (const trust of Object.values(liveTrusts)) {
				if (trust.engaged) trust.engaged = false;
			}
		}
		for (const id of state.party.summoned) if (trustById(id) && !liveTrusts[id]) liveTrusts[id] = makeLiveTrust(id, trustSubOf(state.party, id), trustGearOf(state.party, id));
		for (const id of Object.keys(liveTrusts)) if (!state.party.summoned.includes(id)) {
			releaseTrustPet(id);
			delete liveTrusts[id];
			dropHateRow(id);
		}
		if (state.trustTargeted && !liveTrusts[state.trustTargeted]) set({
			trustTargeted: null,
			petTargeted: null
		});
		for (const id of Object.keys(liveTrusts)) {
			const trust = liveTrusts[id];
			for (const name of Object.keys(trust.recasts)) {
				const left = trust.recasts[name] - dt;
				if (left > 0) trust.recasts[name] = left;
				else delete trust.recasts[name];
			}
			const hadSpiritSurge = trust.buffs.some((buff) => buff.name === "Spirit Surge");
			trust.buffs = trust.buffs.map((buff) => buff.hold ? buff : {
				...buff,
				left: buff.left - dt
			}).filter((buff) => buff.left > 0 && buff.name !== "Huton");
			if (hadSpiritSurge && !trust.buffs.some((buff) => buff.name === "Spirit Surge")) {
				if ((trust.surgeGift ?? 0) > 0) {
					trust.maxHp = Math.max(1, trust.maxHp - trust.surgeGift);
					trust.hp = Math.min(trust.hp, trust.maxHp);
					trust.surgeGift = 0;
				}
				useGame.getState().pushLog(`${trustName(id)}'s Spirit Surge wears off.`, "info");
			}
			const who = trustById(id);
			const subJob = trustSubOf(state.party, id);
			const schKit = who ? trustKit(id, subJob, state.jobLevels) : null;
			const schLevel = who?.job === "SCH" ? schKit?.mainLevel ?? 0 : subJob === "SCH" ? schKit?.levels.SCH ?? 0 : 0;
			if (schLevel > 0 && !trust.ko) {
				const ticked = tickScholar(trust.buffs, dt, schLevel, who?.job === "SCH", trust.hp, trust.maxHp, trust.maxMp, trust.mp);
				trust.buffs = ticked.buffs;
				trust.hp = ticked.hp;
				trust.mp = ticked.mp;
				for (const line of ticked.logs) useGame.getState().pushLog(`${trustName(id)}: ${line}`, "info");
			}
			const meditating = trust.buffs.some((buff) => buff.name === "Meditate");
			if (!trust.ko && meditating) {
				trust.meditateAcc += dt;
				const ticks = Math.floor(trust.meditateAcc / 3);
				if (ticks > 0) {
					trust.meditateAcc -= ticks * 3;
					const landed = takeMeditate(false, trust.meditateGained, trust.tp, ticks);
					if (landed.gain > 0) {
						trust.meditateGained = landed.gained;
						trust.tp = landed.tp;
						useGame.getState().pushLog(`${trustName(id)}'s ${landed.text}`, "info");
					}
				}
			} else if (!meditating) {
				trust.meditateAcc = 0;
				trust.meditateGained = 0;
			}
			if (!trust.ko) {
				const traitSheet = trustCombat(id, trustSubOf(state.party, id), trustGearOf(state.party, id));
				const traitRegen = traitSheet.autoRegen || 0;
				const colureRegen = (trust.buffs ?? []).reduce((n, buff) => n + (buff.name === "Indi-Regen" || buff.name === "Geo-Regen" ? buff.power ?? 0 : 0), 0);
				const regen = regenPower(trust.buffs) + colureRegen;
				if (traitRegen > 0 || regen !== 0) {
					trust.regenAcc = (trust.regenAcc ?? 0) + dt;
					const ticks = Math.floor(trust.regenAcc / 3);
					if (ticks > 0) {
						trust.regenAcc -= ticks * 3;
						let room = Math.max(0, trust.maxHp - trust.hp);
						const traitHp = Math.min(room, traitRegen * ticks);
						room -= traitHp;
						const spellHp = regen > 0 ? Math.min(room, regen * ticks) : 0;
						const gained = traitHp + spellHp;
						const hurt = regen < 0 ? regen * ticks : 0;
						const next = Math.max(regen < 0 ? 1 : 0, Math.min(trust.maxHp, trust.hp + gained + hurt));
						if (next !== trust.hp) trust.hp = next;
					}
				} else trust.regenAcc = 0;
				const traitRefresh = traitSheet.autoRefresh || 0;
				const colureRefresh = (trust.buffs ?? []).reduce((n, buff) => n + (buff.name === "Indi-Refresh" || buff.name === "Geo-Refresh" ? buff.power ?? 0 : 0), 0);
				const refresh = Math.max(0, refreshPower(trust.buffs) + (rollCombat(trust.buffs).refresh || 0) + colureRefresh);
				if (traitRefresh > 0 || refresh > 0) {
					trust.refreshAcc = (trust.refreshAcc ?? 0) + dt;
					const ticks = Math.floor(trust.refreshAcc / 3);
					if (ticks > 0) {
						trust.refreshAcc -= ticks * 3;
						const room = Math.max(0, trust.maxMp - trust.mp);
						const spellGain = Math.min(room, refresh * ticks);
						const gained = spellGain + Math.min(Math.max(0, room - spellGain), traitRefresh * ticks);
						if (gained > 0) trust.mp = Math.min(trust.maxMp, trust.mp + gained);
					}
				} else trust.refreshAcc = 0;
			}
			if (trust.lock > 0) trust.lock = Math.max(0, trust.lock - dt);
			if (trust.cast) {
				if (castMarkDown(trust.cast)) {
					abortTrustCast(id, trust);
					trust.skipScan = true;
					continue;
				}
				trust.cast.left -= dt;
				if (trust.cast.left > 0) continue;
				finishTrustCast(id, trust);
				trust.skipScan = true;
				continue;
			}
			if (trust.skipScan) {
				trust.skipScan = false;
				continue;
			}
			if (trust.lock > 0 || trust.ko) continue;
			actTrust(id, trust);
		}
		publishTrusts();
	};
	return {
		started: false,
		equipOpen: false,
		screen: "battle",
		hotbar: initialHotbar,
		gambits: initialGambits,
		party: initialParty,
		jobLevels: initialJobLevels,
		trustVitals: initialTrustVitals,
		targeted: false,
		selfTargeted: false,
		trustTargeted: null,
		petTargeted: null,
		pets: [],
		crystalTargeted: false,
		manualTargeted: false,
		manualPage: "closed",
		fov: readFov(boot.extra?.fov),
		homeAt: "spawn",
		gil: 0,
		exp: 0,
		expByJob: {},
		inventory: freshProgress.save.inventory,
		quests: {},
		flags: {},
		blueLearned: freshProgress.save.blueLearned,
		blueSet: freshProgress.save.blueSet,
		autoHead: asAutoHead(freshProgress.save.autoHead),
		autoFrame: asAutoFrame(freshProgress.save.autoFrame),
		autoSet: freshProgress.save.autoSet,
		skills: freshProgress.save.skills,
		homeAsk: false,
		crystalHeal: null,
		regenPulse: null,
		refreshPulse: null,
		tpPulse: null,
		ko: false,
		homeReturn: 0,
		engaged: false,
		inRange: false,
		hp: initialSheet.hp,
		hpGift: 0,
		mp: initialSheet.mp,
		healPhase: "off",
		engageAfterHeal: false,
		loadout: initial,
		gearBase: initial,
		equipSets: emptyEquipSets(),
		gearMode: "idle",
		crystals: emptyCrystals(),
		magian: emptyMagian(),
		craftSkill: emptyCraftSkill(),
		craftStock: {},
		rankPoints: 0,
		conquestPoints: 0,
		afkFarm: null,
		race: savedJobs.race,
		mainJob: savedJobs.main,
		subJob: savedJobs.sub,
		selectedId: null,
		sheet: initialSheet,
		tp: 0,
		hareTp: 0,
		hareHp: HARE.hpNatural,
		hareRespawn: 0,
		quarry: "hare",
		kinHp: HARE.hpNatural,
		kinTp: 0,
		kinRespawn: 0,
		log: [],
		dealt: 0,
		swings: 0,
		last: null,
		buffs: [],
		recasts: {},
		actionLock: 0,
		abilityLock: 0,
		hate: {
			ce: 0,
			ve: 0
		},
		hateFace: null,
		packMark: null,
		kinHate: {
			ce: 0,
			ve: 0
		},
		kinHateFace: null,
		wsMotion: null,
		abilityMotion: null,
		wsMark: null,
		cast: null,
		spellMark: null,
		spikeMark: null,
		hareDebuffs: [],
		statDown: null,
		hareEnfeebles: [],
		kinEnfeebles: [],
		kinDebuffs: [],
		hareAction: null,
		ailments: [],
		weakness: null,
		pendingRaise: null,
		banishDown: null,
		dotQueue: [],
		start: () => set({ started: true }),
		setScreen: (screen) => set({
			screen,
			equipOpen: screen !== "battle"
		}),
		setEquipOpen: (open) => set({
			screen: open ? "equipment" : "battle",
			equipOpen: open
		}),
		toggleEquip: () => {
			const next = useGame.getState().screen === "equipment" ? "battle" : "equipment";
			set({
				screen: next,
				equipOpen: next !== "battle"
			});
		},
		setHotbar: (index, actionId) => {
			if (index < 0 || index >= 12) return;
			const hotbar = useGame.getState().hotbar.slice();
			hotbar[index] = actionId;
			writeHotbar(hotbar);
			set({ hotbar });
		},
		setGambitEnabled: (memberId, on) => {
			set((s) => {
				const current = s.gambits[memberId] ?? blankBoard();
				const gambits = {
					...s.gambits,
					[memberId]: {
						on,
						slots: current.slots.map((slot) => ({ ...slot }))
					}
				};
				saveGambitBook(gambits);
				return { gambits };
			});
		},
		setGambitSlot: (memberId, index, patch) => {
			if (index < 0 || index >= 8) return;
			set((s) => {
				const current = s.gambits[memberId] ?? blankBoard();
				const slots = current.slots.map((slot, i) => i === index ? {
					...slot,
					...patch
				} : { ...slot });
				const gambits = {
					...s.gambits,
					[memberId]: {
						...current,
						slots
					}
				};
				saveGambitBook(gambits);
				return { gambits };
			});
		},
		setGambitSlots: (memberId, slots) => {
			if (slots.length !== 8) return;
			set((s) => {
				const current = s.gambits[memberId] ?? blankBoard();
				const gambits = {
					...s.gambits,
					[memberId]: {
						...current,
						slots: slots.map((slot) => ({
							target: slot.target,
							condition: slot.condition,
							action: slot.action,
							...slot.hpPct != null ? { hpPct: slot.hpPct } : {},
							...slot.buff ? { buff: slot.buff } : {}
						}))
					}
				};
				saveGambitBook(gambits);
				return { gambits };
			});
		},
		callTrust: (id) => {
			const who = trustById(id);
			if (!who) return;
			const state = useGame.getState();
			if (state.party.summoned.includes(id)) return;
			if (state.party.summoned.length >= trustSeats(state.party.players, state.party.mode)) return;
			const party = {
				...state.party,
				summoned: [...state.party.summoned, id]
			};
			saveParty(party);
			liveTrusts[id] = makeLiveTrust(id, trustSubOf(party, id), trustGearOf(party, id));
			set({
				party,
				trustVitals: trustVitalsNow()
			});
			useGame.getState().pushLog(who.line, "info");
			if (who.job === "BST") callTrustCarrie(true);
			if (who.job === "PUP") callTrustAutomaton();
			if (who.job === "SMN") callTrustCarbuncle();
		},
		dismissTrust: (id) => {
			const who = trustById(id);
			const state = useGame.getState();
			if (!who || !state.party.summoned.includes(id)) return;
			releaseTrustPet(id);
			const party = {
				...state.party,
				summoned: state.party.summoned.filter((row) => row !== id)
			};
			saveParty(party);
			delete liveTrusts[id];
			clearTrustPlace(id);
			dropHateRow(id);
			set({
				party,
				trustVitals: trustVitalsNow(),
				...hateNow(),
				...state.trustTargeted === id ? {
					trustTargeted: null,
					petTargeted: null
				} : {}
			});
			useGame.getState().pushLog(who.dismiss, "info");
		},
		setTrustSub: (id, sub) => {
			const who = trustById(id);
			if (!who) return;
			const state = useGame.getState();
			if (sub !== null && (sub === who.job || !PLAYABLE.includes(sub) || (state.jobLevels[sub] ?? 0) <= 0)) return;
			const party = {
				...state.party,
				subs: {
					...state.party.subs,
					[id]: sub
				}
			};
			saveParty(party);
			const trust = liveTrusts[id];
			if (trust) {
				const sheet = trustCombat(id, sub, trustGearOf(party, id));
				trust.maxHp = sheet.hp + (trust.surgeGift || 0);
				trust.maxMp = sheet.mp;
				trust.hp = Math.min(trust.hp, trust.maxHp);
				trust.mp = Math.min(trust.mp, sheet.mp);
			}
			set({
				party,
				...trust ? { trustVitals: trustVitalsNow() } : {}
			});
		},
		setTrustGear: (id, slot, value) => {
			if (!trustById(id)) return;
			const state = useGame.getState();
			const gear = { ...trustGearOf(state.party, id) };
			if (slot === "main") {
				if (![
					"Sword",
					"Club",
					"Staff",
					"Dagger",
					"Hand-to-Hand",
					"Great Sword",
					"Axe",
					"Great Axe",
					"Scythe",
					"Polearm",
					"Katana",
					"Great Katana"
				].includes(value)) return;
				gear.main = value;
			} else if (slot === "off") gear.off = value === "Shield" ? "Shield" : "";
			else gear.range = value === "Archery" || value === "Marksmanship" || value === "Throwing" ? value : "";
			if (gear.main === "Staff" || gear.main === "Great Sword" || gear.main === "Great Axe" || gear.main === "Scythe" || gear.main === "Polearm" || gear.main === "Great Katana" || gear.main === "Hand-to-Hand") gear.off = "";
			const party = {
				...state.party,
				gear: {
					...state.party.gear ?? {},
					[id]: gear
				}
			};
			saveParty(party);
			const trust = liveTrusts[id];
			if (trust) {
				const sheet = trustCombat(id, trustSubOf(party, id), gear);
				trust.maxHp = sheet.hp;
				trust.maxMp = sheet.mp;
				trust.hp = Math.min(trust.hp, sheet.hp);
				trust.mp = Math.min(trust.mp, sheet.mp);
			}
			set({
				party,
				...trust ? { trustVitals: trustVitalsNow() } : {}
			});
		},
		landTrustSwing: (id) => {
			const who = trustById(id);
			const state = useGame.getState();
			const trust = who ? liveTrusts[id] : null;
			const place = trustPlaces[id];
			if (!who || !trust || !state.party.summoned.includes(id) || !trust.engaged || trust.ko || trust.cast || trust.lock > 0 || !place?.melee || !state.targeted && packClaim() && !packOpened() || !state.targeted && !foeLiving() && !packOpened() || state.targeted && !foeLiving()) return false;
			const meleePack = trustMeleePack(id);
			const meleePark = meleePack ? beginPackStrike(meleePack.id) : null;
			try {
			if (trust.buffs.some((buff) => buff.song?.family === "mazurka")) {
				trust.buffs = trust.buffs.filter((buff) => buff.song?.family !== "mazurka");
				state.pushLog(`${who.name}'s Mazurka wears off.`, "info");
				set({ trustVitals: trustVitalsNow() });
			}
			breakActorTravel(id, "offense");
			const sheet = trustCombat(id, trustSubOf(state.party, id), trustGearOf(state.party, id));
			const protect = trust.buffs.find((buff) => buff.name === "Protect")?.power ?? 0;
			const rows = foeEnfeebleRows();
			const foeEva = targetEvasion(HARE.evasion, rows, distractPower(rows));
			const mods = meleeStats(sheet, trust.buffs, protect, 0, HARE.evasion - foeEva);
			const blindCut = trust.buffs.reduce((n, buff) => buff.name === "Blindness" ? n + (buff.power ?? 0) : n, 0);
			const chanceOf = (fallback, accuracy) => blindCut > 0 ? hitRate(Math.max(0, accuracy - blindCut), foeEva, HARE.level - 75) : fallback;
			const hareDef = foeVitDefense(rows);
			const ratio = mods.attack / hareDef;
			const gear = trustGearOf(state.party, id);
			const offId = trustLoadout(who.job, gear).sub;
			const offItem = sheet.dualWield > 0 && offId ? ITEMS$1[offId] : null;
			const offWeapon = offItem && offItem.kind !== "Shield" ? offItem : null;
			let dead = false;
			const consumeAdd = () => {
				if (!trust.buffs.some((buff) => buff.name === "Consume Mana")) return 0;
				const add = consumeManaAdd(trust.mp);
				trust.mp = 0;
				trust.buffs = trust.buffs.filter((buff) => buff.name !== "Consume Mana");
				state.pushLog(`${who.name}'s Consume Mana adds ${add}. MP is gone.`, "info");
				return add;
			};
			const eatTrust = (dealt) => {
				let next = dealt;
				if (trust.buffs.some((buff) => buff.name === "Souleater")) {
					const strike = souleaterStrike(trust.hp, who.job === "DRK", sheet.stalwart);
					trust.hp = Math.max(1, trust.hp - strike.cost);
					next += strike.bonus;
					if (strike.bonus > 0 || strike.cost > 0) state.pushLog(`${who.name}'s Souleater adds ${strike.bonus} and spends ${strike.cost} HP.`, "info");
				}
				if (trust.buffs.some((buff) => buff.name === "Blood Weapon") && next > 0) {
					const heal = Math.min(Math.max(0, trust.maxHp - trust.hp), next);
					if (heal > 0) {
						trust.hp += heal;
						state.pushLog(`${who.name}'s Blood Weapon restores ${heal} HP.`, "info");
					}
				}
				landSambaHit({
					who: id,
					label: who.name,
					buffs: trust.buffs,
					delay: sheet.delay,
					damage: next,
					foe: foeIsKin() ? "kin" : "hare"
				});
				return next;
			};
			if (Math.random() * 100 >= chanceOf(mods.hit, mods.accuracy)) state.pushLog(`${who.name} misses the ${HARE.name}.`, "miss");
			else {
				const crit = Math.random() * 100 < mods.crit + critEvasionDown(rows);
				const pdif = rollSwordPdif(ratio, crit, Math.random, mods.pdifCap);
				const add = consumeAdd();
				let dmg = Math.max(0, Math.floor((sheet.dmg + sheet.fstr + add) * pdif));
				dmg = eatTrust(dmg);
				let extra = 0;
				const enspell = trust.buffs.find((buff) => buff.enspell);
				if (enspell?.enspell && dmg > 0) {
					let raw = enspell.enspell.base;
					if (enspell.enspell.tier === 2) {
						raw = enspellTwoDamage(sheet.enhancing, enspell.enspell.rounds);
						enspell.enspell.rounds += 1;
					}
					extra = composureEnspell(raw, trust.buffs.some((buff) => buff.name === "Composure"));
				}
				const total = dmg + extra;
				trust.tp = Math.min(3e3, trust.tp + sheet.tpHit);
				const landed = hitFoe(total, id);
				dead = landed.dead;
				set({
					dealt: useGame.getState().dealt + total,
					...foePatch(),
					trustVitals: trustVitalsNow()
				});
				if (!dead) grantFoeMonsterTp(sheet.tpHit);
				if (landed.woke) state.pushLog(`The ${HARE.name} wakes.`, "info");
				if (landed.unbound) state.pushLog(`The ${HARE.name}'s Bind effect wears off.`, "info");
				const verb = crit ? "critically hits" : "hits";
				const points = dmg === 1 ? "point" : "points";
				const added = extra > 0 ? ` Additional effect: ${extra}.` : "";
				state.pushLog(`${who.name} ${verb} the ${HARE.name} for ${dmg} ${points} of damage.${added}`, crit ? "crit" : "hit");
			}
			if (!dead && offWeapon) {
				const off = sheet.offhand;
				const offMods = off ? meleeStats({
					...sheet,
					accuracy: off.accuracy,
					attackFlat: off.attackFlat,
					skillName: off.skillName
				}, trust.buffs, protect, 0, HARE.evasion - foeEva) : mods;
				const offRatio = offMods.attack / hareDef;
				if (Math.random() * 100 >= chanceOf(offMods.hit, offMods.accuracy)) state.pushLog(`${who.name} misses the ${HARE.name}.`, "miss");
				else {
					const crit = Math.random() * 100 < offMods.crit + critEvasionDown(rows);
					const pdif = rollSwordPdif(offRatio, crit, Math.random, offMods.pdifCap);
					const add = consumeAdd();
					let dmg = Math.max(0, Math.floor(((off?.dmg ?? offWeapon.dmg ?? 0) + (off?.fstr ?? sheet.fstr) + add) * pdif));
					dmg = eatTrust(dmg);
					trust.tp = Math.min(3e3, trust.tp + sheet.tpHit);
					const landed = hitFoe(dmg, id);
					dead = landed.dead;
					set({
						dealt: useGame.getState().dealt + dmg,
						...foePatch(),
						trustVitals: trustVitalsNow()
					});
					if (!dead) grantFoeMonsterTp(sheet.tpHit);
					if (landed.woke) state.pushLog(`The ${HARE.name} wakes.`, "info");
					if (landed.unbound) state.pushLog(`The ${HARE.name}'s Bind effect wears off.`, "info");
					const verb = crit ? "critically hits" : "hits";
					const points = dmg === 1 ? "point" : "points";
					state.pushLog(`${who.name} ${verb} the ${HARE.name} for ${dmg} ${points} of damage.`, crit ? "crit" : "hit");
				}
			}
			return true;
			} finally {
				if (meleePark) endPackStrike(meleePark);
			}
		},
		select: (selectedId) => set({ selectedId }),
		setRace: (race) => {
			const state = useGame.getState();
			if (state.cast) state.interruptCast();
			writeJobs(state.mainJob, state.subJob, race);
			set({
				race,
				...full(sheetFor(state.loadout, race, state.mainJob, state.subJob, state.blueSet))
			});
		},
		setMainJob: (job) => {
			if (!PLAYABLE.includes(job)) return;
			const state = useGame.getState();
			if (state.cast) state.interruptCast();
			const sub = state.subJob === job ? null : state.subJob;
			const loadout = fitLoadout(state.gearBase ?? state.loadout, job, sub);
			const handed = job === "DRG" && state.mainJob !== "DRG" && ITEMS$1[loadout.main ?? ""]?.kind !== "Polearm" ? {
				...loadout,
				main: "harpoon",
				sub: null
			} : job === "BST" && state.mainJob !== "BST" && ITEMS$1[loadout.main ?? ""]?.kind !== "Axe" ? {
				...loadout,
				main: "bronze-axe"
			} : loadout;
			const sheet = sheetFor(handed, state.race, job, sub, state.blueSet);
			const hotbar = keepHotbar(state.hotbar, job, sub, sheet, handed.range, state.blueSet);
			writeLoadout(handed);
			writeJobs(job, sub, state.race);
			writeHotbar(hotbar);
			const dropped = job === state.mainJob ? null : takeReraise();
			const lostTp = state.tp > 0 && tpLostOnWeaponChange(state.loadout, handed);
			if (job !== "DRG" && trustPetOwner !== "shikaree-z") dismissWyvern(job === state.mainJob ? null : "The wyvern leaves.");
			if (job !== "BST") dismissJug(job === state.mainJob ? null : "Courier Carrie leaves.");
			if (job !== "BST" && sub !== "BST" && charmOwner !== "lhu-mhakaracca") releaseCharm("Charm breaks.");
			if (job !== "SMN" && sub !== "SMN") dismissAvatar(job === state.mainJob ? null : "The avatar leaves.");
			if (job !== "GEO") dismissLuopan(job === state.mainJob ? null : "The luopan leaves.");
			const sameJob = job === state.mainJob;
			let exp = state.exp;
			let expByJob = state.expByJob;
			let jobLevels = state.jobLevels;
			let ding = 0;
			if (!sameJob) {
				const bag = { ...(state.expByJob ?? {}) };
				bag[state.mainJob] = state.exp;
				const held = bankExp(state.jobLevels?.[job] ?? 75, bag[job] ?? 0);
				bag[job] = held.exp;
				exp = held.exp;
				expByJob = bag;
				if (held.level !== (state.jobLevels?.[job] ?? 75)) {
					jobLevels = { ...state.jobLevels, [job]: held.level };
					ding = held.level;
				}
			}
			const sets = legalizeEquipSets(state.equipSets ?? emptyEquipSets(), job, sub);
			set({
				mainJob: job,
				subJob: sub,
				gearBase: handed,
				equipSets: sets,
				loadout: handed,
				hotbar,
				selectedId: null,
				buffs: liveBuffs.map((buff) => ({ ...buff })),
				...lostTp ? { tp: 0 } : {},
				...full(sheet),
				exp,
				expByJob,
				jobLevels
			});
			if (ding) useGame.getState().pushLog(`${job} reaches level ${ding}!`, "info");
			if (job === "DRG" && state.mainJob !== job && !wyvern) summonWyvern();
			if (dropped) useGame.getState().pushLog(`${dropped} wears off.`, "info");
			if (lostTp) useGame.getState().pushLog("TP is lost.", "info");
			syncGear();
		},
		setSubJob: (sub) => {
			const state = useGame.getState();
			const next = sub === state.mainJob ? null : sub;
			if (next !== null && !PLAYABLE.includes(next)) return;
			if (state.cast) state.interruptCast();
			const loadout = fitLoadout(state.gearBase ?? state.loadout, state.mainJob, next);
			const sheet = sheetFor(loadout, state.race, state.mainJob, next, state.blueSet);
			const hotbar = keepHotbar(state.hotbar, state.mainJob, next, sheet, loadout.range, state.blueSet);
			writeJobs(state.mainJob, next, state.race);
			writeHotbar(hotbar);
			const lostTp = state.tp > 0 && tpLostOnWeaponChange(state.loadout, loadout);
			const sets = legalizeEquipSets(state.equipSets ?? emptyEquipSets(), state.mainJob, next);
			writeLoadout(loadout);
			set({
				subJob: next,
				gearBase: loadout,
				equipSets: sets,
				loadout,
				hotbar,
				...lostTp ? { tp: 0 } : {},
				...full(sheet)
			});
			if (lostTp) useGame.getState().pushLog("TP is lost.", "info");
			if (state.mainJob !== "BST" && next !== "BST" && charmOwner !== "lhu-mhakaracca") releaseCharm("Charm breaks.");
			if (state.mainJob !== "SMN" && next !== "SMN") dismissAvatar("The avatar leaves.");
			if (state.mainJob === "DRG" && wyvern) {
				const kind = wyvernKind(next);
				if (wyvern.kind !== kind) {
					wyvern.kind = kind;
					wyvern.queue = [];
					wyvern.heals = [];
					const turned = kind === "defensive" ? "The wyvern turns defensive." : kind === "hybrid" ? "The wyvern turns hybrid." : "The wyvern turns offensive.";
					useGame.getState().pushLog(turned, "info");
					publishPets();
				}
			}
			syncGear();
		},
		equip: (id, slot, mode) => {
			const item = ITEMS$1[id];
			const state = useGame.getState();
			const which = mode === "tp" || mode === "ws" || mode === "magic" || mode === "idle" ? mode : null;
			if (!item || !canWear(item, state.mainJob, state.subJob)) return;
			const into = slot ?? item.slot;
			if (!which) return;
			const sets = state.equipSets ?? emptyEquipSets();
			const row = { ...sets[which] };
			const under = underGear(which, state.gearBase ?? state.loadout, sets, state.mainJob, state.subJob, which === "ws" || which === "tp" || (which === "magic" && state.engaged));
			const mainId = into === "main" ? id : row.main ?? under.main;
			const main = mainId ? ITEMS$1[mainId] : null;
			if (into === "sub") {
				if (!canEquipInSub(item, state.mainJob, state.subJob, main)) return;
			} else if (into !== item.slot) return;
			if (row[into] === id) return;
			for (const key of Object.keys(row)) {
				if (row[key] === id) row[key] = null;
			}
			row[into] = id;
			if (into === "main" && item.grip === "two") row.sub = null;
			const nextSets = { ...sets, [which]: legalizeSet(row, state.mainJob, state.subJob) };
			if (state.cast && which === state.gearMode) state.interruptCast();
			set({ equipSets: nextSets });
			syncGear();
			saveSettings(false);
			if (useGame.getState().loadout.ammo === FISH_OIL_BROTH) callTrustCarrie(false);
		},
		unequip: (slot, mode) => {
			const which = mode === "tp" || mode === "ws" || mode === "magic" || mode === "idle" ? mode : null;
			if (!which || !slot) return;
			const state = useGame.getState();
			const sets = state.equipSets ?? emptyEquipSets();
			if (!sets[which][slot]) return;
			const row = { ...sets[which], [slot]: null };
			set({ equipSets: { ...sets, [which]: row } });
			syncGear();
			saveSettings(false);
		},
		buyConquest: (id) => {
			const offer = CONQUEST_SHOP.find((row) => row.id === id);
			if (!offer) return;
			const state = useGame.getState();
			const rank = rankFromPoints(state.rankPoints ?? 0);
			if (rank < offer.rank) {
				state.pushLog(`${offer.name} requires San d'Oria rank ${offer.rank}.`, "info");
				return;
			}
			if ((state.conquestPoints ?? 0) < offer.cost) {
				state.pushLog("You do not have enough conquest points.", "info");
				return;
			}
			const inventory = { ...state.inventory, [offer.id]: (state.inventory?.[offer.id] ?? 0) + 1 };
			if (bagUsed(inventory) > BAG_SLOTS) {
				state.pushLog("Your inventory is full.", "info");
				return;
			}
			set({ conquestPoints: (state.conquestPoints ?? 0) - offer.cost, inventory });
			state.pushLog(`You buy the ${offer.name}.`, "info");
			saveSettings(false);
		},
		startAfk: (groupId, mode) => {
			const state = useGame.getState();
			if (state.afkFarm?.active) return;
			if (state.ko) {
				state.pushLog("You cannot make camp while unconscious.", "info");
				return;
			}
			const here = readPlace();
			const camp = campHere(state.screen, here.x, here.z);
			if (!camp) {
				state.pushLog(campRefusal(state.screen, here.x, here.z), "info");
				return;
			}
			const want: CampMode = mode === "nm" ? "nm" : "exp";
			const board = state.gambits?.[state.mainJob];
			const shape = gambitShape(board);
			const help = partyHelps(state.party?.summoned);
			const level = state.jobLevels?.[state.mainJob] ?? 75;
			const signet = state.buffs.find((buff) => buff.name === "Signet" && buff.left > 0);
			const fov = readFov(state.fov);
			const measure = (prey: { level: number; hpNatural: number; weaponDamage: number; delay: number; name: string }) => measureFarm({
				dmg: state.sheet?.dmg ?? 0,
				fstr: state.sheet?.fstr ?? 0,
				hit: state.sheet?.hit ?? 50,
				delay: state.sheet?.swing?.modifiedDelay ?? state.sheet?.delay ?? 240,
				hp: state.hp,
				defense: state.sheet?.defense ?? 0,
				level,
				zoneId: camp.id,
				gambitOn: shape.on,
				hasWeaponskill: shape.weaponskill,
				hasHeal: shape.heal,
				party: help.party,
				healer: help.healer,
				preyLevel: prey.level,
				preyHp: prey.hpNatural,
				preyWeapon: prey.weaponDamage,
				preyDelay: prey.delay,
				preyName: prey.name,
			});
			if (want === "nm") {
				const nms = zoneNms(here.x, here.z);
				const chosen = (typeof groupId === "string" ? nms.find((row) => row.id === groupId) : null) ?? nearestNm(here.x, here.z);
				const model = chosen ? nmCampModel(chosen.id) : null;
				if (!chosen || !model) {
					state.pushLog(NO_NM, "info");
					return;
				}
				const filler = nmFiller(chosen.id, here.x, here.z);
				if (!filler) {
					state.pushLog(NO_NM, "info");
					return;
				}
				const fillerPace = measure(filler);
				const nmPaceNow = measure(chosen);
				const canKill = !nmPaceNow.dies;
				const session: AfkFarmSave = {
					active: true,
					startTimestamp: Date.now(),
					zoneId: camp.id,
					mode: "nm",
					groupId: chosen.id,
					groupName: chosen.name,
					groupFamily: chosen.family,
					farmingEfficiency: fillerPace.kpm,
					level,
					exp: state.expByJob?.[state.mainJob] ?? state.exp ?? 0,
					job: state.mainJob,
					treasureHunter: state.sheet?.treasureHunter ?? 0,
					signetLeft: signet ? signet.left : 0,
					crystalBonus: state.loadout?.body === "kingdom-aketon",
					dies: fillerPace.dies,
					sustainMinutes: fillerPace.sustainMinutes,
					note: canKill ? fillerPace.note : `The ${chosen.name} was too strong.`,
					fovActive: fov.active,
					fovPage: fov.page,
					fovBook: fov.book,
					fovCounts: [...fov.counts ?? []],
					fovRepeat: fov.repeat,
					fovPaidDays: { ...fov.paidDays ?? {} },
					fovTabs: fov.tabs,
					preyLevel: filler.level,
					preyHp: filler.hpNatural,
					preyWeapon: filler.weaponDamage,
					preyDelay: filler.delay,
					preyDrops: filler.drops.map((drop) => ({ ...drop })),
					fillerId: filler.id,
					fillerName: filler.name,
					nmCanKill: canKill,
					nmPerHour: nmPace(fillerPace.kpm, nmPaceNow.kpm, model, canKill),
				};
				set({ afkFarm: session });
				state.pushLog(`You make camp on ${chosen.name}.`, "info");
				saveSettings(false);
				return;
			}
			const groups = zoneGroups(here.x, here.z);
			const chosen = (typeof groupId === "string" ? groups.find((group) => group.id === groupId) : null) ?? nearestGroup(here.x, here.z);
			if (!chosen) {
				state.pushLog("Nothing hunts here.", "info");
				return;
			}
			const measured = measure(chosen);
			const session: AfkFarmSave = {
				active: true,
				startTimestamp: Date.now(),
				zoneId: camp.id,
				mode: "exp",
				groupId: chosen.id,
				groupName: chosen.name,
				groupFamily: chosen.family,
				farmingEfficiency: expKpm(chosen.id, measured.kpm),
				level,
				exp: state.expByJob?.[state.mainJob] ?? state.exp ?? 0,
				job: state.mainJob,
				treasureHunter: state.sheet?.treasureHunter ?? 0,
				signetLeft: signet ? signet.left : 0,
				crystalBonus: state.loadout?.body === "kingdom-aketon",
				dies: measured.dies,
				sustainMinutes: measured.sustainMinutes,
				note: measured.note,
				fovActive: fov.active,
				fovPage: fov.page,
				fovBook: fov.book,
				fovCounts: [...fov.counts ?? []],
				fovRepeat: fov.repeat,
				fovPaidDays: { ...fov.paidDays ?? {} },
				fovTabs: fov.tabs,
				preyLevel: chosen.level,
				preyHp: chosen.hpNatural,
				preyWeapon: chosen.weaponDamage,
				preyDelay: chosen.delay,
				preyDrops: chosen.drops.map((drop) => ({ ...drop })),
			};
			set({ afkFarm: session });
			state.pushLog(`You make camp on ${chosen.name}.`, "info");
			saveSettings(false);
		},
		stopAfk: () => {
			const state = useGame.getState();
			if (!state.afkFarm) return;
			set({ afkFarm: null });
			state.pushLog("You break camp. Nothing was claimed.", "info");
			saveSettings(false);
		},
		claimAfk: () => {
			const state = useGame.getState();
			const session = state.afkFarm;
			if (!session?.active) return;
			const bag = previewAfk(session, Date.now(), readPlace());
			const job = state.mainJob;
			const level = state.jobLevels?.[job] ?? 75;
			const pool = state.expByJob?.[job] ?? state.exp ?? 0;
			const sameBar = job === session.job && level === session.level && pool === session.exp;
			const nextPool = sameBar ? bag.pool : bankExp(level, pool + bag.exp).exp;
			const nextLevel = sameBar ? bag.level : bankExp(level, pool + bag.exp).level;
			const inventory = { ...(state.inventory ?? {}) };
			const kept = [];
			let overflow = 0;
			const grant = (id: string, qty: number) => {
				let left = qty;
				while (left > 0) {
					const next = { ...inventory, [id]: (inventory[id] ?? 0) + 1 };
					if (bagUsed(next) > BAG_SLOTS) {
						overflow += left;
						left = 0;
						break;
					}
					inventory[id] = next[id];
					left -= 1;
				}
				if ((inventory[id] ?? 0) > (state.inventory?.[id] ?? 0)) kept.push(id);
			};
			for (const [id, qty] of Object.entries(bag.items)) grant(id, qty);
			for (const [id, qty] of Object.entries(bag.nmItems)) grant(id, qty);
			const crystals = { ...(state.crystals ?? emptyCrystals()) };
			if (bag.crystals > 0) crystals[RARAB_CRYSTAL] = Math.min(9999, (crystals[RARAB_CRYSTAL] ?? 0) + bag.crystals);
			const liveFov = readFov(state.fov);
			const campBook = session.fovBook === "east" ? "east" : "west";
			const fovSame = liveFov.active === session.fovActive
				&& liveFov.page === (session.fovPage ?? 0)
				&& (liveFov.book ?? "west") === campBook
				&& JSON.stringify(liveFov.counts) === JSON.stringify(session.fovCounts ?? []);
			set({
				afkFarm: null,
				exp: nextPool,
				expByJob: { ...(state.expByJob ?? {}), [job]: nextPool },
				jobLevels: { ...state.jobLevels, [job]: nextLevel },
				gil: Math.min(999999999, state.gil + bag.gil),
				inventory,
				crystals,
				rankPoints: Math.min(9999999, (state.rankPoints ?? 0) + bag.rankPoints),
				conquestPoints: Math.min(9999999, (state.conquestPoints ?? 0) + bag.conquestPoints),
				...fovSame && bag.fov ? { fov: bag.fov } : {},
			});
			const log = useGame.getState();
			log.pushLog(`Camp yields ${bag.kills} ${bag.kills === 1 ? "kill" : "kills"}.`, "info");
			if (bag.exp > 0) log.pushLog(`You receive ${bag.exp} experience points.`, "info");
			if (nextLevel > level) log.pushLog(`${job} reaches level ${nextLevel}!`, "info");
			if (bag.gil > 0) log.pushLog(`You receive ${bag.gil} gil.`, "info");
			if (bag.crystals > 0) log.pushLog(`You find ${bag.crystals} fire ${bag.crystals === 1 ? "crystal" : "crystals"}.`, "info");
			if (bag.rankPoints > 0) log.pushLog(`You receive ${bag.rankPoints} rank points and ${bag.rankPoints} conquest points.`, "info");
			if (overflow > 0) log.pushLog(`${overflow} could not fit in your inventory.`, "info");
			saveSettings(false);
		},
		castSignet: () => {
			const state = useGame.getState();
			const rank = rankFromPoints(state.rankPoints ?? 0);
			const hours = signetHours(rank);
			liveBuffs = liveBuffs.filter((buff) => buff.name !== "Signet");
			liveBuffs.push({ name: "Signet", left: hours * 3600 });
			set({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
			state.pushLog(`You receive the effect of Signet for ${hours} hours.`, "info");
			saveSettings(false);
		},
		synthesize: (recipeId) => {
			const recipe = recipeById(recipeId);
			if (!recipe) return "";
			const state = useGame.getState();
			const skills = state.craftSkill ?? emptyCraftSkill();
			const skill = skills[recipe.craft] ?? 0;
			if (recipe.level > attemptLimit(skill)) {
				state.pushLog("Your skill is too low for that recipe.", "info");
				return "";
			}
			const crystals = { ...(state.crystals ?? emptyCrystals()) };
			if ((crystals[recipe.crystal] ?? 0) < 1) {
				state.pushLog("You do not have that crystal.", "info");
				return "";
			}
			const stock = { ...(state.craftStock ?? {}) };
			const inventory = { ...(state.inventory ?? {}) };
			for (const mat of recipe.materials) {
				if (materialOnHand(mat.name, inventory, stock) < mat.qty) {
					state.pushLog(`You need ${mat.name}.`, "info");
					return "";
				}
			}
			const gearId = gearIdForResult(recipe.result);
			if (gearId) {
				const next = { ...inventory, [gearId]: (inventory[gearId] ?? 0) + recipe.qty };
				if (bagUsed(next) > BAG_SLOTS) {
					state.pushLog("Your inventory is full.", "info");
					return "";
				}
			}
			crystals[recipe.crystal] -= 1;
			const skillNow = skill / 10;
			const broke = recipe.level > skillNow && Math.random() < (recipe.level - skillNow) * 0.12;
			if (broke) {
				set({ crystals });
				state.pushLog("The crystal breaks.", "info");
				saveSettings(false);
				return "";
			}
			for (const mat of recipe.materials) {
				let left = mat.qty;
				const id = gearIdForResult(mat.name);
				if (id) {
					const take = Math.min(inventory[id] ?? 0, left);
					if (take > 0) {
						inventory[id] = (inventory[id] ?? 0) - take;
						if (inventory[id] <= 0) delete inventory[id];
						left -= take;
					}
				}
				if (left > 0) {
					stock[mat.name] = (stock[mat.name] ?? 0) - left;
					if (stock[mat.name] <= 0) delete stock[mat.name];
				}
			}
			let nextInventory = inventory;
			if (gearId) nextInventory = { ...inventory, [gearId]: (inventory[gearId] ?? 0) + recipe.qty };
			else stock[recipe.result] = (stock[recipe.result] ?? 0) + recipe.qty;
			const nextSkill = skillAfterSuccess(skill, recipe.level);
			const rise = nextSkill - skill;
			const craftSkill = { ...skills, [recipe.craft]: nextSkill };
			set({ crystals, craftStock: stock, craftSkill, inventory: nextInventory });
			const count = recipe.qty > 1 ? `${recipe.qty} ` : "";
			state.pushLog(`You synthesize ${count}${recipe.result}.`, "info");
			saveSettings(false);
			if (rise <= 0) return "";
			const name = CRAFTS.find((row) => row.id === recipe.craft)?.name ?? "Craft";
			const note = craftSkillLine(name, rise);
			state.pushLog(`${note}.`, "info");
			return note;
		},
		inscribeTrial: (itemId, trialId) => {
			const state = useGame.getState();
			const result = openMagianTrial(state.magian ?? emptyMagian(), itemId, trialId);
			if (result.error) {
				state.pushLog(result.error, "info");
				return;
			}
			if (!result.log) return;
			liveMagian = result.book;
			set({ magian: result.book });
			state.pushLog(result.log, "info");
			saveSettings(false);
		},
		abandonTrial: (itemId) => {
			const state = useGame.getState();
			const result = dropMagianTrial(state.magian ?? emptyMagian(), itemId);
			if (result.error) {
				state.pushLog(result.error, "info");
				return;
			}
			liveMagian = result.book;
			set({ magian: result.book });
			if (result.log) state.pushLog(result.log, "info");
			saveSettings(false);
		},
		completeTrial: (itemId) => {
			const state = useGame.getState();
			const result = finishMagianTrial(state.magian ?? emptyMagian(), itemId, state.crystals ?? emptyCrystals());
			if (result.error) {
				state.pushLog(result.error, "info");
				return;
			}
			liveMagian = result.book;
			set({
				magian: result.book,
				crystals: result.crystals,
				...paintedPools()
			});
			if (result.log) state.pushLog(result.log, "info");
			saveSettings(false);
		},
		clearEnchant: (itemId) => {
			const state = useGame.getState();
			const result = liftMagianEnchant(state.magian ?? emptyMagian(), itemId);
			if (result.error) {
				state.pushLog(result.error, "info");
				return;
			}
			liveMagian = result.book;
			set({
				magian: result.book,
				...paintedPools()
			});
			if (result.log) state.pushLog(result.log, "info");
			saveSettings(false);
		},
		buyRemovalStone: () => {
			const state = useGame.getState();
			const gil = state.gil ?? 0;
			if (gil < REMOVAL_STONE_GIL) {
				state.pushLog(`A Removal Stone costs ${REMOVAL_STONE_GIL} gil.`, "info");
				return;
			}
			const book = state.magian ?? emptyMagian();
			if (book.stones >= 99) {
				state.pushLog("You cannot carry another Removal Stone.", "info");
				return;
			}
			const magian = { ...book, augments: { ...book.augments }, stones: book.stones + 1 };
			liveMagian = magian;
			set({ gil: gil - REMOVAL_STONE_GIL, magian });
			state.pushLog("You buy a Removal Stone.", "info");
			saveSettings(false);
		},
		toggleBlueSpell: (name) => {
			const state = useGame.getState();
			const next = nextBlueSet({
				name,
				main: state.mainJob === "BLU",
				learned: state.blueLearned,
				set: state.blueSet,
				level: 75
			});
			if (!next.ok) {
				state.pushLog(next.reason, "miss");
				return;
			}
			const sheet = sheetFor(state.loadout, state.race, state.mainJob, state.subJob, next.set);
			const painted = applyFieldFood(sheet, liveBuffs, playerLevel());
			const hotbar = keepHotbar(state.hotbar, state.mainJob, state.subJob, sheet, state.loadout.range, next.set);
			set({
				blueSet: next.set,
				hotbar,
				sheet: painted,
				hp: Math.min(state.hp, painted.hp + (state.hpGift || 0)),
				mp: Math.min(state.mp, painted.mp)
			});
			noteTrustBlue(next.set, state.jobLevels.BLU ?? 0);
			refreshLiveBlu();
		},
		setAutoHead: (id) => {
			if (!autoHead(id)) return;
			const state = useGame.getState();
			const next = attachmentsThatFit(state.autoFrame, id, state.autoSet);
			const dropped = state.autoSet.filter((name) => !next.includes(name));
			set({
				autoHead: id,
				autoSet: next
			});
			if (dropped.length) useGame.getState().pushLog(`${dropped.join(", ")} no longer fit the ${autoHead(id)?.name ?? "head"}.`, "info");
		},
		setAutoFrame: (id) => {
			const frame = autoFrame(id);
			if (!frame) return;
			const state = useGame.getState();
			const next = attachmentsThatFit(frame.id, state.autoHead, state.autoSet);
			const dropped = state.autoSet.filter((name) => !next.includes(name));
			set({
				autoFrame: frame.id,
				autoSet: next
			});
			if (dropped.length) useGame.getState().pushLog(`${dropped.join(", ")} no longer fit the ${frame.name}.`, "info");
		},
		toggleAutoAttachment: (name) => {
			const state = useGame.getState();
			if (state.autoSet.includes(name)) {
				set({ autoSet: state.autoSet.filter((row) => row !== name) });
				return;
			}
			const gate = canAddAttachment(state.autoFrame, state.autoHead, state.autoSet, name);
			if (!gate.ok) {
				state.pushLog(gate.reason, "miss");
				return;
			}
			set({ autoSet: [...state.autoSet, name] });
		},
		setRewardFood: (id) => {
			const flags = { ...useGame.getState().flags };
			if (id && ITEMS$1[id]?.kind === "Pet Food") flags.rewardFood = id;
			else delete flags.rewardFood;
			set({ flags });
		},
		setCombat: (patch) => set({
			...patch,
			...patch.targeted ? {
				crystalTargeted: false,
				selfTargeted: false,
				trustTargeted: null,
				petTargeted: null,
				manualTargeted: false,
				manualPage: "closed"
			} : {}
		}),
		setQuarry: (who) => set({ quarry: who === "kin" ? "kin" : "hare" }),
		toggleEngage: () => {
			const s = useGame.getState();
			if (!s.started || s.equipOpen) return;
			const field = readFieldPlate();
			if (field.id && field.hp > 0 && !s.crystalTargeted && !s.manualTargeted && !s.selfTargeted) {
				const verb = toggleFieldEngage();
				if (verb) {
					if (s.targeted || s.engaged) set({ targeted: false, engaged: false });
					if (verb === "claim") s.pushLog(`You engage the ${field.name}.`, "info");
					else if (verb === "release") s.pushLog(`You disengage from the ${field.name}.`, "info");
					else s.pushLog("Target is out of range.", "miss");
					return;
				}
			}
			if (s.healPhase !== "off") {
				if (!s.targeted || s.engaged) return;
				set({
					healPhase: "up",
					engageAfterHeal: true
				});
				return;
			}
			const packKey = togglePackEngage(HARE.level, s.ko);
			if (packKey) {
				set({
					...packKey === "claim" && (s.engaged || s.targeted) ? { engaged: false, targeted: false } : {},
					...hateNow()
				});
				syncGear();
				return;
			}
			if (!s.targeted) return;
			if (!s.engaged) {
				const pet = peekCharm()?.who ?? null;
				if (pet && s.quarry === pet) {
					const other = pet === "kin" ? "hare" : "kin";
					if ((other === "kin" ? s.kinHp : s.hareHp) <= 0) {
						s.pushLog("That one is your pet.", "miss");
						return;
					}
					set({
						quarry: other,
						engaged: true
					});
					syncGear();
					return;
				}
			}
			set({ engaged: !s.engaged });
			syncGear();
		},
		toggleHeal: () => {
			const s = useGame.getState();
			if (!s.started || s.ko) return;
			if (s.cast) {
				s.pushLog("You cannot use that command while casting.", "miss");
				return;
			}
			if (liveShot) {
				s.pushLog("You cannot use that command yet.", "miss");
				return;
			}
			if (s.healPhase === "down" || s.healPhase === "loop") {
				set({
					healPhase: "up",
					engageAfterHeal: false
				});
				return;
			}
			if (s.healPhase === "up") {
				set({
					healPhase: "down",
					engageAfterHeal: false
				});
				return;
			}
			if (s.engaged) {
				s.pushLog("You cannot rest while engaged.", "miss");
				return;
			}
			set({
				healPhase: "down",
				engageAfterHeal: false
			});
		},
		setHealPhase: (healPhase) => set({ healPhase }),
		finishStand: () => {
			const s = useGame.getState();
			if (s.engageAfterHeal && s.targeted && !s.engaged) {
				set({
					healPhase: "off",
					engageAfterHeal: false,
					engaged: true
				});
				syncGear();
				return;
			}
			set({
				healPhase: "off",
				engageAfterHeal: false
			});
		},
		checkTarget: () => {
			const s = useGame.getState();
			if (s.healPhase !== "off") {
				s.pushLog("You cannot use that command while healing.", "miss");
				return;
			}
			const level = s.jobLevels[s.mainJob] ?? 75;
			const field = readFieldPlate();
			if (field.id && field.hp > 0 && !s.crystalTargeted && !s.manualTargeted && !s.selfTargeted) {
				const line = checkLine(field.name, level, field.level, field.nm);
				s.pushLog(line, "info");
				queueCheckMark({ text: line, where: "field", id: field.id });
				return;
			}
			const pack = readPackPlate();
			if (pack.id && pack.hp > 0) {
				const line = checkLine(HARE.name, level, HARE.level);
				s.pushLog(line, "info");
				queueCheckMark({ text: line, where: "pack", id: pack.id });
				return;
			}
			if (!s.targeted) return;
			const line = checkLine(HARE.name, level, HARE.level);
			s.pushLog(line, "info");
			queueCheckMark({ text: line, where: s.quarry === "kin" ? "kin" : "hare", id: null });
		},
		recoverRest: (tickIndex) => {
			const s = useGame.getState();
			const tick = restTick(s.sheet.clearMind, tickIndex);
			const hpGain = Math.min(tick.hp, Math.max(0, hpCap() - s.hp));
			const mpGain = Math.min(tick.mp, Math.max(0, s.sheet.mp - s.mp));
			set({
				hp: s.hp + hpGain,
				mp: s.mp + mpGain,
				tp: Math.max(0, s.tp - 10)
			});
			if (hpGain > 0) useGame.getState().pushLog(`You recover ${hpGain} HP.`, "info");
			if (mpGain > 0) useGame.getState().pushLog(`You recover ${mpGain} MP.`, "info");
			return {
				hp: hpGain,
				mp: mpGain
			};
		},
		breakMazurka: () => {
			breakPlayerMazurka();
			breakPlayerTravel("offense");
		},
		sufferHit: (hpLost) => {
			const raw = Math.floor(hpLost);
			if (raw <= 0) return 0;
			breakPlayerTravel("hit");
			if (useGame.getState().perfectDodge()) return 0;
			const s = useGame.getState();
			if (s.ko) return 0;
			let lost = raw;
			const skin = liveBuffs.find((buff) => buff.name === "Stoneskin" && (buff.skin ?? 0) > 0);
			if (skin?.skin != null) {
				const absorbed = Math.min(skin.skin, lost);
				lost -= absorbed;
				const remain = skin.skin - absorbed;
				if (remain <= 0) {
					liveBuffs = liveBuffs.filter((buff) => buff.name !== "Stoneskin");
					useGame.getState().pushLog("Stoneskin wears off.", "info");
				} else {
					liveBuffs = liveBuffs.map((buff) => buff.name === "Stoneskin" ? {
						...buff,
						skin: remain
					} : buff);
					useGame.getState().pushLog(`Stoneskin absorbs ${absorbed} points of damage.`, "info");
				}
				set({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
			}
			if (!restBreaksOnDamage(lost)) return 0;
			miseryWound = nextMiseryWound(miseryWound, lost, liveBuffs.some((buff) => buff.name === "Afflatus Misery"));
			const resting = s.healPhase === "down" || s.healPhase === "loop";
			const hp = Math.max(0, s.hp - lost);
			const ko = hp === 0;
			const abandoned = ko ? dropPlayerHate() : false;
			if (!ko) loseCe("player", ceLostOnHit(lost, hpCap()));
			if (ko) {
				const ready = liveBuffs.find((buff) => isReraiseSpell(buff.name));
				if (ready && isReraiseSpell(ready.name)) livePending = reraiseOnKo(ready.name, hpCap(), liveWeakness);
				else if (liveBuffs.some((buff) => buff.song?.family === "hymnus")) livePending = hymnusOnKo(hpCap(), liveWeakness);
				else livePending = null;
				statusLostOnDeath();
			}
			set({
				hp,
				...hateNow(),
				weakness: liveWeakness,
				pendingRaise: livePending,
				...ko ? {
					ko: true,
					engaged: false,
					targeted: false,
					selfTargeted: false,
					crystalTargeted: false,
					trustTargeted: null,
					petTargeted: null,
					homeAsk: false,
					healPhase: "off",
					engageAfterHeal: false,
					buffs: liveBuffs.map((buff) => ({ ...buff })),
					ailments: liveAilments.map((row) => ({ ...row }))
				} : resting ? {
					healPhase: "up",
					engageAfterHeal: false
				} : {}
			});
			if (ko) {
				if (trustPetOwner !== "shikaree-z") dismissWyvern("The wyvern leaves.");
				dismissJug("Courier Carrie leaves.");
				if (charmOwner !== "lhu-mhakaracca") releaseCharm("The charm breaks.");
				if (useGame.getState().cast) useGame.getState().interruptCast();
				useGame.getState().pushLog("You are knocked out.", "miss");
				if (abandoned) useGame.getState().pushLog(`The ${HARE.name} loses interest.`, "info");
				if (livePending) useGame.getState().pushLog(`${livePending.via ?? livePending.spell} is ready.`, "info");
			}
			return lost;
		},
		perfectDodge: () => {
			if (!liveBuffs.some((buff) => buff.name === "Perfect Dodge")) return false;
			useGame.getState().pushLog("Perfect Dodge.", "miss");
			return true;
		},
		anticipate: () => {
			if (!liveBuffs.some((buff) => buff.name === "Third Eye")) return false;
			const seigan = liveBuffs.some((buff) => buff.name === "Seigan");
			const two = twoHandKind(useGame.getState().sheet.skillName);
			liveBuffs = liveBuffs.filter((buff) => buff.name !== "Third Eye");
			useGame.getState().pushLog("Third Eye.", "miss");
			set({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
			if (seigan && two && Math.random() < .25) return "counter";
			return "dodge";
		},
		dropHide: () => {
			if (!liveBuffs.some((buff) => buff.name === "Hide")) return;
			liveBuffs = liveBuffs.filter((buff) => buff.name !== "Hide");
			useGame.getState().pushLog("Hide wears off.", "info");
			set({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
		},
		primeConsumeMana: () => {
			if (!liveBuffs.some((buff) => buff.name === "Consume Mana")) return 0;
			const add = consumeManaAdd(useGame.getState().mp);
			liveBuffs = liveBuffs.filter((buff) => buff.name !== "Consume Mana");
			set({
				mp: 0,
				buffs: liveBuffs.map((buff) => ({ ...buff }))
			});
			useGame.getState().pushLog(`Consume Mana adds ${add}. MP is gone.`, "info");
			return add;
		},
		foldDarkHit: (dealt) => {
			const state = useGame.getState();
			let next = dealt;
			const notes = [];
			if (liveBuffs.some((buff) => buff.name === "Souleater")) {
				const strike = souleaterStrike(state.hp, state.sheet.job === "DRK", state.sheet.stalwart);
				if (strike.cost > 0 || strike.bonus > 0) {
					set({ hp: Math.max(1, state.hp - strike.cost) });
					next += strike.bonus;
					notes.push(`Souleater adds ${strike.bonus} and spends ${strike.cost} HP`);
				}
			}
			if (liveBuffs.some((buff) => buff.name === "Blood Weapon") && next > 0) {
				const room = Math.max(0, hpCap() - useGame.getState().hp);
				const heal = Math.min(room, next);
				if (heal > 0) {
					set({ hp: useGame.getState().hp + heal });
					notes.push(`Blood Weapon restores ${heal} HP`);
				}
			}
			const foe = playerFoe();
			if (foe) landSambaHit({
				who: "player",
				label: "You",
				buffs: liveBuffs,
				delay: state.sheet.delay,
				damage: next,
				foe
			});
			const note = notes.join(". ");
			if (note) useGame.getState().pushLog(`${note}.`, "info");
			return {
				dealt: next,
				note
			};
		},
		lineThiefStrike: (kind) => {
			const sheet = useGame.getState().sheet;
			const partner = trickTarget();
			const lined = thiefStrike({
				kind,
				behind: playerBehind,
				hidden: liveBuffs.some((buff) => buff.name === "Hide"),
				sneak: liveBuffs.some((buff) => buff.name === "Sneak Attack"),
				trick: liveBuffs.some((buff) => buff.name === "Trick Attack"),
				partner: partner != null,
				dex: sheet.dex,
				agi: sheet.agi,
				mainThief: sheet.job === "THF",
				assassin: sheet.assassin
			});
			return useGame.getState().commitThiefLine(lined);
		},
		commitThiefLine: (lined) => {
			const partner = trickTarget();
			if (lined.spendTa && partner) {
				trickHateTo = partner;
				trickHand = {
					hit: true,
					agi: lined.agi,
					crit: useGame.getState().sheet.assassin
				};
				useGame.getState().pushLog(`Trick Attack. ${trustName(partner)} takes the enmity.`, "info");
			}
			if (lined.tell) {
				let fresh = false;
				liveBuffs = liveBuffs.map((buff) => {
					const sa = buff.name === "Sneak Attack" && (lined.tell === "sa" || lined.tell === "both");
					const ta = buff.name === "Trick Attack" && (lined.tell === "ta" || lined.tell === "both");
					if ((sa || ta) && !buff.told) {
						fresh = true;
						return {
							...buff,
							told: true
						};
					}
					return buff;
				});
				if (fresh) {
					if (lined.tell === "sa" || lined.tell === "both") useGame.getState().pushLog("Sneak Attack only lands from behind, or while Hide is up.", "info");
					if (lined.tell === "ta" || lined.tell === "both") useGame.getState().pushLog("Trick Attack needs a party member between you and the target.", "info");
					set({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
				}
			}
			if (!lined.spendSa && !lined.spendTa && !lined.dropHide) return {
				dex: 0,
				agi: 0,
				sure: false,
				hit: false,
				via: ""
			};
			liveBuffs = liveBuffs.filter((buff) => {
				if (lined.spendSa && buff.name === "Sneak Attack") return false;
				if (lined.spendTa && buff.name === "Trick Attack") return false;
				if (lined.dropHide && buff.name === "Hide") return false;
				return true;
			});
			if (lined.dropHide) useGame.getState().pushLog("Hide wears off.", "info");
			set({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
			return {
				dex: lined.dex,
				agi: lined.agi,
				sure: lined.sure,
				hit: lined.hit,
				via: lined.via
			};
		},
		setTp: (tp) => set({ tp }),
		grantMonsterTp: (baseTp) => {
			if (strikeKin) {
				grantKinMonsterTp(baseTp);
				return;
			}
			const gain = monsterTpGain(baseTp, subtleBlow(useGame.getState().buffs) + mnkSubtleBlow(useGame.getState().sheet.job === "MNK" ? 75 : useGame.getState().sheet.sub === "MNK" ? useGame.getState().sheet.subLevel : 0) + (useGame.getState().sheet.subtleBlow ?? 0) + (jug?.stance === "fight" ? useGame.getState().sheet.tandemBlow : 0));
			if (gain <= 0) return;
			set({ hareTp: useGame.getState().hareTp + gain });
		},
		applyAuspiceEnspell: () => {
			if (!(liveBuffs.some((buff) => buff.name === "Auspice") && liveBuffs.some((buff) => buff.name === "Afflatus Misery"))) return 0;
			const dmg = composureEnspell(enspellTwoDamage(useGame.getState().sheet.enhancing, auspiceRamp), liveBuffs.some((buff) => buff.name === "Composure"));
			auspiceRamp += 1;
			if (dmg <= 0) return 0;
			if (playerFoe() === "kin") {
				creditKinDamage(dmg);
				chipKin(dmg);
			} else {
				creditDamage(dmg);
				chipHare(dmg);
			}
			set({
				dealt: useGame.getState().dealt + dmg,
				hareHp: liveHareHp,
				kinHp: liveKinHp,
				...hateNow(),
				...kinHateState()
			});
			useGame.getState().pushLog(`Enlight II hits the ${HARE.name} for ${dmg} ${dmg === 1 ? "point" : "points"} of light damage.`, "hit");
			return dmg;
		},
		applyRdmEnspell: (first) => {
			const row = liveBuffs.find((buff) => buff.enspell);
			if (!row?.enspell) return null;
			const skillName = useGame.getState().sheet.skillName;
			if (skillName === "Archery" || skillName === "Marksmanship" || skillName === "Throwing") return null;
			if (row.enspell.tier === 2 && !first) return null;
			let raw = row.enspell.base;
			if (row.enspell.tier === 2) {
				raw = enspellTwoDamage(useGame.getState().sheet.enhancing, row.enspell.rounds);
				const rounds = row.enspell.rounds + 1;
				liveBuffs = liveBuffs.map((buff) => buff.enspell ? {
					...buff,
					enspell: {
						...buff.enspell,
						rounds
					}
				} : buff);
			}
			const dmg = composureEnspell(raw, liveBuffs.some((buff) => buff.name === "Composure"));
			const element = row.enspell.element;
			if (dmg > 0) {
				if (playerFoe() === "kin") {
					creditKinDamage(dmg);
					chipKin(dmg);
				} else {
					creditDamage(dmg);
					chipHare(dmg);
				}
			}
			set({
				dealt: useGame.getState().dealt + dmg,
				hareHp: liveHareHp,
				kinHp: liveKinHp,
				...hateNow(),
				...kinHateState(),
				buffs: liveBuffs.map((buff) => ({
					...buff,
					enspell: buff.enspell ? { ...buff.enspell } : void 0
				}))
			});
			if (dmg <= 0) return null;
			const word = element === "thunder" ? "lightning" : element;
			useGame.getState().pushLog(`Additional effect: ${dmg} ${dmg === 1 ? "point" : "points"} of ${word} damage.`, "hit");
			return {
				dmg,
				element
			};
		},
		applyRuneEnhancement: () => {
			const state = useGame.getState();
			const sheet = state.sheet;
			if (sheet.skillName === "Archery" || sheet.skillName === "Marksmanship" || sheet.skillName === "Throwing") return null;
			const strike = runeOffensive(liveBuffs);
			if (!strike) return null;
			const item = ITEMS$1[state.loadout.main ?? ""];
			const kind = sheet.skillName === "Hand-to-Hand" ? "h2h" : sheet.offhand ? "dual" : "weapon";
			const dps = runeEnhancementDps(item?.dmg ?? sheet.dmg, item?.delay ?? sheet.delay, kind);
			const weathered = weatherAdjusted(runeEnhancementDamage(dps, strike.copies, Math.random()), strike.element, liveBuffs);
			const dmg = weathered.value;
			if (dmg > 0) {
				if (playerFoe() === "kin") {
					creditKinDamage(dmg);
					chipKin(dmg);
				} else {
					creditDamage(dmg);
					chipHare(dmg);
				}
			}
			set({
				dealt: useGame.getState().dealt + dmg,
				hareHp: liveHareHp,
				kinHp: liveKinHp,
				...hateNow(),
				...kinHateState()
			});
			if (dmg <= 0) return null;
			const word = strike.element === "thunder" ? "lightning" : strike.element;
			useGame.getState().pushLog(`Additional effect: ${dmg} ${dmg === 1 ? "point" : "points"} of ${word} damage.${weathered.note}`, "hit");
			return {
				dmg,
				element: strike.element
			};
		},
		noteAuspiceMiss: () => {
			const misery = liveBuffs.some((buff) => buff.name === "Afflatus Misery");
			const auspice = liveBuffs.find((buff) => buff.name === "Auspice");
			if (!misery || !auspice) return false;
			const current = Math.max(0, auspice.acc ?? 0);
			if (current >= 30) return false;
			const next = Math.min(30, current + 10);
			if (next === current) return false;
			liveBuffs = liveBuffs.map((buff) => buff.name === "Auspice" ? {
				...buff,
				acc: next
			} : buff);
			set({ buffs: liveBuffs.map((buff) => ({ ...buff })) });
			useGame.getState().pushLog(`Auspice accuracy +10.`, "info");
			return true;
		},
		setWsMotion: (wsMotion) => set({ wsMotion }),
		setAbilityMotion: (abilityMotion) => set({ abilityMotion }),
		setWsMark: (wsMark) => set({ wsMark }),
		setSpellMark: (spellMark) => set({ spellMark }),
		setSpikeMark: (spikeMark) => set({ spikeMark }),
		setDotQueue: (queue) => {
			pendingDots = queue.map((row) => ({ ...row }));
			set({ dotQueue: pendingDots.map((row) => ({ ...row })) });
		},
		hareStruck: () => {
			const spike = liveBuffs.find((buff) => buff.spikeBase != null);
			if (!spike || spike.spikeBase == null || !isSpike(spike.name)) return;
			const dmg = spikeDamage(spike.spikeBase, shroudMab(useGame.getState().sheet.mab));
			const dealt = useGame.getState().dealt + dmg;
			let woke = dmg > 0 && clearSleep();
			let unbound = bindWearsOff(dmg) && clearBind();
			if (dmg > 0) {
				creditDamage(dmg);
				if (chipHare(dmg)) {
					woke = false;
					unbound = false;
				}
				useGame.getState().grantMonsterTp(100);
			}
			if (strikeKin) set({
				dealt,
				kinHp: liveHareHp,
				kinTp: liveKinTp,
				...kinHateState(),
				spikeMark: {
					name: spike.name,
					dmg
				},
				kinEnfeebles: liveEnfeebles.map((row) => ({ ...row }))
			});
			else set({
				dealt,
				hareHp: liveHareHp,
				...hateNow(),
				spikeMark: {
					name: spike.name,
					dmg
				},
				hareEnfeebles: liveEnfeebles.map((row) => ({ ...row }))
			});
			useGame.getState().pushLog(`${spike.name} hits the ${HARE.name} for ${dmg} ${dmg === 1 ? "point" : "points"} of damage.`, "hit");
			if (woke) useGame.getState().pushLog(`The ${HARE.name} wakes.`, "info");
			if (unbound) useGame.getState().pushLog(`The ${HARE.name}'s Bind effect wears off.`, "info");
		},
		landRarabBlow: (front, targetId, packStrike, packId) => {
			if (targetId === "jug") return landOnJug();
			if (targetId === "automaton") return landOnAutomaton();
			if (targetId === "avatar" || targetId === "wyvern") return landOnPet(targetId);
			if (packStrike && targetId && targetId !== "player") return landOnTrust(targetId, front, "attack", packId);
			if (targetId && targetId !== "player") return landOnTrust(targetId, front);
			const move = packStrike ? "attack" : rarabMoveName();
			const physical = move === "attack" || move === "Foot Kick" || move === "Whirl Claws";
			if (move !== "Wild Carrot") {
				breakPlayerMazurka();
				breakPlayerTravel("hit");
			}
			const spendTp = () => {
				if (move !== "attack") zeroStrikerTp();
			};
			if (physical && useGame.getState().perfectDodge()) {
				spendTp();
				return {
					tag: "perfect",
					name: move,
					damage: 0,
					crit: false,
					hp: 0
				};
			}
			if (physical) {
				const eye = useGame.getState().anticipate();
				if (eye === "dodge") {
					spendTp();
					return {
						tag: "anticipate",
						name: move,
						damage: 0,
						crit: false,
						hp: 0
					};
				}
				if (eye === "counter") {
					spendTp();
					return {
						tag: "counter",
						name: move,
						damage: 0,
						crit: false,
						hp: 0
					};
				}
			}
			const sheet = glittered(useGame.getState().sheet);
			if (physical && sheet.beastIntimidate > 0 && Math.random() < sheet.beastIntimidate) {
				spendTp();
				useGame.getState().pushLog(`The ${HARE.name} is intimidated.`, "miss");
				return {
					tag: "evade",
					name: move,
					damage: 0,
					crit: false,
					hp: 0
				};
			}
			const mods = meleeStats(sheet, liveBuffs, protectPower(liveBuffs), 0, 0, playerBehind);
			const foeRows = packStrike ? packStatusRows(packId) : liveEnfeebles;
			const swung = hareSwingStats(foeRows.reduce((n, row) => n + (row.accDown ?? 0), 0));
			const strike = rollRarabStrike({
				move,
				weaponDamage: HARE.weaponDamage,
				level: HARE.level,
				attack: Math.max(1, Math.floor(HARE.attack * bioAttackFactor(foeRows) * attackDownFactor(foeRows))),
				defense: Math.max(1, mods.defense * (liveBuffs.some((buff) => buff.name === "Scissor Guard") ? 2 : 1)),
				accuracy: swung.accuracy,
				evasion: mods.evasion,
				dLevel: 75 - HARE.level,
				dex: swung.dex,
				targetAgi: sheet.agi,
				str: foeStr(),
				targetVit: sheet.vit,
				weaponRank: HARE.weaponRank,
				maxHp: HARE.hpNatural,
				hitRoll: Math.random() * 100,
				critRoll: Math.random() * 100 + (mods.foeCrit ?? 0),
				pdifRoll: Math.random()
			});
			if (strike.spendTp && !packStrike) zeroStrikerTp();
			if (strike.heal > 0) {
				if (liveHareHp <= 0) {
					spendTp();
					return {
						tag: "heal",
						name: move,
						damage: 0,
						crit: false,
						hp: 0
					};
				}
				if (harePlagueUp()) {
					spendTp();
					useGame.getState().pushLog(`The ${HARE.name} uses Wild Carrot. Plague prevents the recovery.`, "info");
					return {
						tag: "heal",
						name: move,
						damage: 0,
						crit: false,
						hp: 0
					};
				}
				const gained = Math.min(strike.heal, Math.max(0, HARE.hpNatural - liveHareHp));
				liveHareHp += gained;
				commitCarrot();
				useGame.getState().pushLog(`The ${HARE.name} uses Wild Carrot. It restores ${gained} HP.`, "info");
				return {
					tag: "heal",
					name: move,
					damage: 0,
					crit: false,
					hp: gained
				};
			}
			if (!strike.hit) {
				const who = move === "attack" ? `the ${HARE.name}` : move;
				useGame.getState().pushLog(`You evade ${who}.`, "miss");
				return {
					tag: "evade",
					name: move,
					damage: 0,
					crit: false,
					hp: 0
				};
			}
			if (strike.shadows > 0) {
				if (spendPlayerShadows(strike.shadows) === "ate") return {
					tag: "shadow",
					name: move,
					damage: 0,
					crit: false,
					hp: 0
				};
			}
			if (strike.physical && liveBuffs.some((buff) => buff.name === "Invincible")) {
				useGame.getState().dropHide();
				if (strike.tpGain > 0 && !packStrike) useGame.getState().grantMonsterTp(strike.tpGain);
				useGame.getState().pushLog(`The ${HARE.name} cuts you for 0 points of damage.`, "miss");
				return {
					tag: "invincible",
					name: move,
					damage: 0,
					crit: false,
					hp: 0
				};
			}
			const shieldItem = ITEMS$1[useGame.getState().loadout.sub ?? ""];
			const size = shieldItem?.kind === "Shield" ? shieldSize(shieldItem.id) : 0;
			const reprisal = liveBuffs.some((buff) => buff.name === "Reprisal");
			let raw = dustCloudAfterAddle(strike.raw, strike.magical);
			let magicResist = 0;
			let blocked = false;
			let guarded = false;
			if (strike.physical && size > 0 && front) {
				const skill = combinedSkill("Shield", sheet.job, 75, sheet.sub, sheet.subLevel);
				if (Math.random() * 100 < blockRate(size, skill, HARE.combatSkill, reprisal)) blocked = true;
			} else if (strike.physical && sheet.skillName === "Hand-to-Hand" && front && useGame.getState().engaged) {
				const skill = combinedSkill("Guard", sheet.job, 75, sheet.sub, sheet.subLevel);
				const mnkLv = monkJobLevel(sheet.job, sheet.sub, sheet.subLevel, 75);
				const dodge = liveBuffs.some((buff) => buff.name === "Dodge") ? dodgeGuard(mnkLv) : 0;
				const rate = guardRate(skill, HARE.level, dodge);
				if (rate > 0 && Math.random() * 100 < rate) {
					guarded = true;
					raw = physicalRaw(move, HARE.weaponDamage, fStr(foeStr() - sheet.vit, HARE.weaponRank), guardedPdif(strike.pdif), HARE.level);
				}
			}
			if (strike.magical) {
				const stateNow = useGame.getState();
				const runLevel = stateNow.mainJob === "RUN" ? 75 : stateNow.subJob === "RUN" ? subjobLevel(75) : 0;
				const resisted = dustCloudResisted(raw, liveBuffs, sheet.int, runLevel);
				raw = resisted.damage;
				magicResist = resisted.state;
				const mdb = (sheet.mdb || 0) + (liveBuffs.find((buff) => buff.name === "Dream Shroud")?.mind ?? 0) + (liveBuffs.find((buff) => buff.name === "Magic Def. Boost")?.power ?? 0) + colureNamed(liveBuffs, "Fend");
				if (mdb > 0) raw = applyMab(raw, 0, mdb);
				if (sheet.beastSpecialCut > 0) raw = Math.max(0, Math.floor(raw * (1 - sheet.beastSpecialCut)));
				if (liveBuffs.some((buff) => buff.name === "Bubble Curtain")) raw = Math.max(0, Math.floor(raw * .5));
			}
			const sentinel = liveBuffs.find((buff) => buff.name === "Sentinel");
			const shell = liveBuffs.find((buff) => buff.name === "Shell");
			const ruby = liveBuffs.find((buff) => buff.name === "Shining Ruby");
			const shellCut = (shell?.power ?? 0) + (strike.magical && ruby ? 10 : 0);
			const phalanx = liveBuffs.find((buff) => buff.name === "Phalanx");
			const rampart = liveBuffs.some((buff) => buff.name === "Rampart");
			const perfect = liveBuffs.find((buff) => buff.name === "Perfect Defense")?.power ?? 0;
			const sentinelNow = sentinel ? sentinelCut(Math.max(0, 30 - sentinel.left)) : 0;
			let reflect = 0;
			let damage = 0;
			if (blocked && shieldItem) {
				const mitigated = rarabTaken(raw, "physical", {
					rampart,
					sentinel: sentinelNow,
					phalanx: 0,
					shell: 0,
					invincible: false,
					perfect
				});
				const skin = liveBuffs.find((buff) => buff.name === "Stoneskin")?.skin ?? 0;
				if (sheet.shieldMastery > 0 && mitigated > skin) {
					const gain = sheet.shieldMastery;
					set({
						tp: Math.min(3e3, useGame.getState().tp + gain),
						tpPulse: gain
					});
				}
				const def = shieldItem.def ?? 0;
				const reflectBase = sentinel ? raw : mitigated;
				if (move === "attack" && reprisal) reflect = reprisalReflect(blockKept(reflectBase, size, def));
				damage = rarabTaken(blockTaken(mitigated, size, def), "physical", {
					rampart: false,
					sentinel: 0,
					phalanx: phalanx?.power ?? 0,
					shell: 0,
					invincible: false
				});
			} else damage = rarabTaken(raw, strike.magical ? "magical" : "physical", {
				rampart,
				sentinel: sentinelNow,
				phalanx: phalanx?.power ?? 0,
				shell: shellCut,
				invincible: false,
				perfect
			});
			let killed = false;
			if (reflect > 0) {
				if (!packStrike) {
					killed = chipHare(reflect);
					if (!killed) useGame.getState().grantMonsterTp(100);
				}
				const reflected = reflect === 1 ? "point" : "points";
				useGame.getState().pushLog(`Reprisal reflects ${reflect} ${reflected} of light damage.`, "hit");
			}
			useGame.getState().dropHide();
			let lostHp = 0;
			if (damage > 0) {
				blowPackId = packStrike ? packId ?? null : null;
				try {
					lostHp = useGame.getState().sufferHit(damage) || 0;
				} finally {
					blowPackId = null;
				}
			}
			if (strike.physical && !killed && !packStrike) useGame.getState().hareStruck();
			if (strike.tpGain > 0 && !killed && !packStrike) useGame.getState().grantMonsterTp(strike.tpGain);
			if (strike.blind > 0) {
				if (statusResisted(Math.round(sheet.blindResist * 100), false, Math.random())) useGame.getState().pushLog("Resist!", "info");
				else {
					liveAilments = liveAilments.filter((row) => row.name !== "Blindness");
					liveAilments = [...liveAilments, {
						name: "Blindness",
						left: 120,
						power: strike.blind
					}];
					set({ ailments: liveAilments.map((row) => ({ ...row })) });
					useGame.getState().pushLog("You are blinded.", "info");
				}
			}
			const points = damage === 1 ? "point" : "points";
			if (strike.magical) {
				useGame.getState().pushLog(`The ${HARE.name} uses Dust Cloud. You take ${damage} ${points} of earth damage.${resistFractionLabel(magicResist) ? ` ${resistFractionLabel(magicResist)} resist.` : ""}`, "hit");
				return {
					tag: "magic",
					name: move,
					damage,
					crit: false,
					hp: 0
				};
			}
			if (blocked) {
				const verb = strike.crit ? "critical hit" : "attack";
				const who = move === "attack" ? `the ${HARE.name}'s ${verb}` : `${move}${strike.crit ? "'s critical hit" : ""}`;
				useGame.getState().pushLog(`You block ${who} for ${damage} ${points} of damage.`, strike.crit ? "crit" : "hit");
				if (lostHp > 0 && !useGame.getState().ko) tryHitInterrupt(blocked);
				return {
					tag: "block",
					name: move,
					damage,
					crit: strike.crit,
					hp: 0,
					reflect
				};
			}
			if (guarded) {
				const who = move === "attack" ? `the ${HARE.name}` : move;
				const blow = strike.crit ? `${who}'s critical hit` : who;
				useGame.getState().pushLog(`You guard ${blow} for ${damage} ${points} of damage.`, strike.crit ? "crit" : "hit");
				if (lostHp > 0 && !useGame.getState().ko) tryHitInterrupt(blocked);
				return {
					tag: "guard",
					name: move,
					damage,
					crit: strike.crit,
					hp: 0
				};
			}
			const verb = strike.crit ? "critically cuts" : "cuts";
			const who = move === "attack" ? `The ${HARE.name}` : move;
			useGame.getState().pushLog(`${who} ${verb} you for ${damage} ${points} of damage.`, strike.crit ? "crit" : "hit");
			if (lostHp > 0 && !useGame.getState().ko) tryHitInterrupt(blocked);
			return {
				tag: "cut",
				name: move,
				damage,
				crit: strike.crit,
				hp: 0
			};
		},
		landKinBlow: (front, targetId, move) => {
			const park = borrowKin();
			const savedTp = useGame.getState().hareTp;
			const savedAction = useGame.getState().hareAction;
			strikerMove = move;
			try {
				return useGame.getState().landRarabBlow(front, targetId);
			} finally {
				strikerMove = null;
				restoreKin(park);
				set({
					hareHp: liveHareHp,
					hareTp: savedTp,
					hareAction: savedAction,
					hareEnfeebles: liveEnfeebles.map((row) => ({ ...row })),
					hareDebuffs: liveHareDebuffs.map((row) => ({ ...row })),
					...hateNow(),
					kinHp: liveKinHp,
					kinTp: liveKinTp,
					kinEnfeebles: kinEnfeebles.map((row) => ({ ...row })),
					kinDebuffs: kinDebuffs.map((row) => ({ ...row })),
					...kinHateState()
				});
			}
		},
		absorbBlink: () => {
			return spendPlayerShadows(1) === "ate";
		},
		advanceCast: (dt) => {
			const raw = useGame.getState();
			const s = {
				...raw,
				sheet: glittered(raw.sheet)
			};
			const cast = s.cast;
			if (!cast) return;
			if (castMarkDown(cast)) {
				raw.interruptCast();
				return;
			}
			const elapsed = cast.elapsed + dt;
			if (cast.total > 0 && elapsed < cast.total) {
				set({ cast: {
					...cast,
					elapsed
				} });
				return;
			}
			const spell = spellByName(cast.name);
			let dmg = 0;
			let areaDmg = 0;
			let raOutside = false;
			let helixLanded = false;
			let hpGain = 0;
			let allyHeal = 0;
			let mpGain = 0;
			let stolen = 0;
			let gainText = null;
			let text = null;
			let divine = false;
			let skinPower = 0;
			let veilCharges = 0;
			let phalanxCut = 0;
			let phalanxLanded = false;
			let reprisalLanded = false;
			let barrierLanded = false;
			let barrierArea = false;
			let partyWard = false;
			let partyTouched = false;
			let regenLanded = false;
			let stunCut = false;
			let barLanded = null;
			let solaceCoat = 0;
			let solaceNote = null;
			let curagaAt = false;
			let raised = false;
			let ninMark = null;
			let songMark = null;
			let colureMark = null;
			let fullResist = false;
			let blueMiss = false;
			let blueChain = false;
			let blueHits = 0;
			let blueSpent = false;
			let burstSpent = false;
			let actinicNear = false;
			let chaoticNear = false;
			let sheepNear = false;
			let soporificNear = false;
			let danceNear = false;
			let mindNear = false;
			let mindPara = false;
			let sandNear = false;
			let sandAcc = false;
			let blueSlow = false;
			let blueVit = false;
			let bluePoison = false;
			let blueStun = false;
			let blueKnock = false;
			let bluePara = false;
			let blueCrit = false;
			let blueBind = false;
			let blueBindLeft = 0;
			let blueInt = false;
			let blueSleep = false;
			let blueSleepLeft = 0;
			let soundNear = false;
			let rayNear = false;
			let digestNear = false;
			let kissNear = false;
			let boltNear = false;
			let gasNear = false;
			let orbNear = false;
			let breathNear = false;
			let cloudWeight = false;
			let blankNear = false;
			let mysteryNear = false;
			let mysteryWeight = false;
			let venomNear = false;
			let maelNear = false;
			let eyesNear = false;
			let needlesNear = false;
			let blueAtk = false;
			let geistNear = false;
			let awfulNear = false;
			let saberNear = false;
			let jettaNear = false;
			let iceNear = false;
			let destructNear = false;
			let roarNear = false;
			let coldNear = false;
			let holdNear = false;
			let blueStr = false;
			let blueTerror = false;
			let blueFrost = false;
			let blueDef = false;
			let blueBlind = false;
			let blueSilence = false;
			let penanceNear = false;
			let tickleNear = false;
			let yawnNear = false;
			let trunkNear = false;
			let infraNear = false;
			let blueEva = false;
			let sprayNear = false;
			let oozeNear = false;
			let enervNear = false;
			let lowingNear = false;
			let shiftNear = false;
			let hammerNear = false;
			let blueErased = false;
			let spitNear = false;
			let gorgeNear = false;
			let blueMdb = false;
			let sacrificed = false;
			let metalSkin = 0;
			let hideSkin = 0;
			let blueBurstName = null;
			const onPack = cast.foeId === "pack" && typeof cast.packId === "string";
			const prevPin = pinnedFoe;
			pinnedFoe = onPack ? "hare" : cast.foeId === "hare" || cast.foeId === "kin" ? cast.foeId : null;
			const packPark = onPack ? beginPackStrike(cast.packId) : null;
			if (onPack && !packPark) {
				pinnedFoe = prevPin;
				raw.interruptCast();
				return;
			}
			const kinPark = !onPack && playerFoe() === "kin" ? borrowKin() : null;
			const splashBeforeEnfeebles = new Map(liveEnfeebles.map((row) => [row.name, splashStamp(row)]));
			const splashBeforeDebuffs = new Map(liveHareDebuffs.map((row) => [row.name, splashStamp(row)]));
			let pendingSplash = null;
			try {
				const namedAllyBuff = typeof cast.allyId === "string" && cast.allyId !== "player" && liveTrusts[cast.allyId] && spell && !spell.song && !spell.colure && !spell.cure && !spell.curaga && !spell.barrier ? landTrustEnhancing("player", { buffs: liveBuffs }, spell, cast.allyId, s.sheet) : null;
				if (namedAllyBuff) {
					text = namedAllyBuff.text;
					partyTouched = true;
				} else if (spell?.song) {
					const sung = singerSkill(s.sheet.job, s.sheet.sub, s.loadout.range);
					const soul = liveBuffs.some((buff) => buff.name === "Soul Voice");
					const piano = liveBuffs.some((buff) => buff.name === "Pianissimo");
					if (piano) liveBuffs = liveBuffs.filter((buff) => buff.name !== "Pianissimo");
					const landed = landSong(spell.name, sung.skill, soul);
					if (!landed) text = "No effect.";
					else if (landed.hostile) {
						text = landHostileSong(landed, "player", composedMagicAccuracy(sung.skill, s.sheet.chr - HARE.chr, s.sheet.gearMacc || 0));
						songMark = {
							text,
							hostile: true,
							element: landed.element,
							wide: landed.wide && !piano,
							family: landed.family,
							spell: landed.spell,
							allyId: null
						};
					} else {
						const only = piano ? cast.allyId ?? null : null;
						const trustHit = only != null && splashSongs(landed, sung.slots, only);
						if (piano && trustHit) text = landed.text;
						else {
							liveBuffs = giveSong(liveBuffs, landed, sung.slots);
							if (!piano && splashSongs(landed, sung.slots, null)) partyTouched = true;
							text = landed.text;
						}
						if (trustHit) partyTouched = true;
						const single = piano || landed.family === "etude" || landed.family === "prelude";
						songMark = {
							text: landed.text,
							hostile: false,
							element: landed.element,
							wide: !single,
							family: landed.family,
							spell: landed.spell,
							allyId: single ? cast.allyId ?? null : null
						};
					}
				} else if (spell?.colure) {
					const effect = spell.colure.effect;
					const side = spell.colure.side;
					const skills = geoSkillNow(s);
					const bolster = liveBuffs.some((buff) => buff.name === "Bolster");
					const blaze = side === "geo" && liveBuffs.some((buff) => buff.name === "Blaze of Glory");
					const entrusted = side === "indi" && cast.allyId && liveTrusts[cast.allyId];
					const power = colurePower(effect, skills.geomancy, skills.handbell, Boolean(bolster && !entrusted), blaze, false);
					const allies = geoAllies(effect);
					const element = castElement(spell);
					const row = geoRow(cast.name, power, side === "indi" ? 180 : 1e5, effect);
					const told = colureLine(effect, power, side);
					if (side === "geo") {
						const geoPlace = allies && cast.allyId && liveTrusts[cast.allyId] ? trustPlaces[cast.allyId] : null;
						if (geoPlace && geoPlace.x != null && geoPlace.z != null) placeLuopan(s.mainJob === "GEO" ? 75 : 0, spell.mp ?? 0, element, blaze, cast.name, allies, "player", { x: geoPlace.x, z: geoPlace.z }, "ally");
						else placeLuopan(s.mainJob === "GEO" ? 75 : 0, spell.mp ?? 0, element, blaze, cast.name, allies);
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Blaze of Glory" && !buff.name.startsWith("Geo-"));
						liveEnfeebles = liveEnfeebles.filter((buff) => !buff.name.startsWith("Geo-"));
					}
					if (side === "indi") liveBuffs = liveBuffs.filter((buff) => buff.name !== "Entrust");
					if (side === "indi" && !entrusted) {
						liveBuffs = liveBuffs.filter((buff) => !buff.name.startsWith("Indi-"));
						liveEnfeebles = liveEnfeebles.filter((buff) => !buff.name.startsWith("Indi-"));
					}
					if (allies && entrusted) {
						const trust = liveTrusts[cast.allyId];
						trust.buffs = [...(trust.buffs ?? []).filter((buff) => !String(buff.name).startsWith("Indi-")), { name: cast.name, left: 180, power }];
						text = `${cast.name} is entrusted. ${told}`;
					} else if (allies && luopan?.owner === "player" && cast.allyId && liveTrusts[cast.allyId]) {
						luopan.row = row;
						syncAllyGeo();
						partyTouched = true;
						text = `${cast.name}. ${told} The luopan is placed on ${trustName(cast.allyId)}${blaze ? " at half HP" : ""}.`;
					} else if (allies) {
						liveBuffs = [...liveBuffs.filter((buff) => buff.name !== cast.name), row];
						text = side === "geo" ? `${cast.name}. ${told} The luopan is placed${blaze ? " at half HP" : ""}.` : `${cast.name}. ${told}`;
					} else {
						if (side === "indi") liveBuffs = [...liveBuffs.filter((buff) => buff.name !== cast.name), row];
						if (side === "geo" && luopan) {
							luopan.aura = row;
							luopan.anchor = strikeKin ? "kin" : "hare";
							const aimed = luopan.anchor;
							if (charm?.who !== aimed && colureBodyAlive(aimed, kinPark)) seatColureClaim();
						}
						const anchor = side === "geo" ? strikeKin ? "kin" : "hare" : null;
						const held = ["hare", "kin"].filter((who) => colureFits(who, side, anchor, kinPark));
						text = side === "geo" ? `${cast.name}. ${told} The luopan is placed${blaze ? " at half HP" : ""}.` : `${cast.name}. ${told}`;
						if (held.length === 0) text += " No enemy inside 6' is on your hate list, so it does not take hold yet.";
					}
					colureMark = {
						name: cast.name,
						element: element || "light",
						side,
						allies,
						allyId: entrusted ? cast.allyId : null
					};
				} else if (spell?.nuke) {
					const ra = spell.self === true && (spell.radius ?? 0) > 0;
					const d = elementalD(spell.nuke, s.sheet.int + colureStat(liveBuffs, "INT") - hareInt(), 0);
					if (d == null) text = `${cast.name}'s damage is not numbered for a negative dINT.`;
					else {
						const element = castElement(spell);
						const chant = geoElementalChant(spell, s.sheet);
						const crit = chant.crit > 0 && Math.random() * 100 < chant.crit;
						const burst = scaleBurst(d, element, s.sheet.magicBurstBonus + chant.burst / 100);
						const raw = applyMab(burst.value, shroudMab(s.sheet.mab + acumenBonus(liveBuffs) + chant.attack + (crit ? 10 : 0)), hareTargetMdb());
						const ebullience = cast.nukeMul && cast.nukeMul !== 1 ? Math.floor(raw * cast.nukeMul) : raw;
						const weathered = weatherAdjusted(ebullience, element, liveBuffs);
						const klima = klimaformMacc(element, liveBuffs);
						const state = elementalResistState(castMagicAccuracy(spell, s.sheet) - hareMeva(element), 100, Math.random);
						dmg = resistedDamage(weathered.value, state);
						areaDmg = dmg;
						const fraction = state > 0 ? ` ${resistFractionLabel(state)} resist.` : "";
						const klimaNote = klima > 0 ? ` Klimaform adds ${klima} magic accuracy.` : "";
						const critNote = crit ? " Magic critical hit." : "";
						text = `${burst.name && dmg > 0 ? `${cast.name} magic bursts ${burst.name}. ` : ""}The ${HARE.name} takes ${dmg} points of damage.${fraction}${weathered.note}${klimaNote}${chantLine(chant)}${critNote}`;
						if (ra && liveHareHp <= 0) {
							raOutside = true;
							dmg = 0;
							text = "No effect.";
						} else if (ra && yardDistance > (spell.radius ?? 0)) {
							raOutside = true;
							dmg = 0;
							text = `The ${HARE.name} is outside the 10' area.`;
						}
					}
				} else if (spell?.helix) {
					const schLevel = s.mainJob === "SCH" ? 75 : s.subJob === "SCH" ? subjobLevel(75) : 0;
					const base = helixD(s.sheet.int + colureStat(liveBuffs, "INT") - hareInt(), 0);
					if (base == null) text = `${cast.name}'s damage is not numbered for a negative dINT.`;
					else {
						const left = helixSeconds(schLevel);
						const element = helixElement(cast.name);
						const word = helixWord(cast.name);
						const property = helixProperty(cast.name);
						const arts = s.mainJob === "SCH" && liveBuffs.some((buff) => buff.name === "Dark Arts") ? darkArtsHelixBonus(schLevel, true) : 0;
						const chant = geoElementalChant(spell, s.sheet);
						const crit = chant.crit > 0 && Math.random() * 100 < chant.crit;
						const burst = scaleBurst(base + arts, element, s.sheet.magicBurstBonus + chant.burst / 100);
						const raw = applyMab(burst.value, shroudMab(s.sheet.mab + chant.attack + (crit ? 10 : 0)), hareTargetMdb());
						const ebullience = cast.nukeMul && cast.nukeMul !== 1 ? Math.floor(raw * cast.nukeMul) : raw;
						const weathered = weatherAdjusted(ebullience, element, liveBuffs);
						const klima = klimaformMacc(element, liveBuffs);
						const resist = elementalResistState(castMagicAccuracy(spell, s.sheet) - hareMeva(element), 100, Math.random);
						dmg = resistedDamage(weathered.value, resist);
						const tock = Math.min(HELIX_TOCK_CAP, dmg);
						const first = helixFirstTock(1 + Math.floor(Math.random() * 10));
						helixLanded = true;
						if (dmg > 0) {
							liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Helix");
							liveEnfeebles = [...liveEnfeebles, {
								name: "Helix",
								left,
								dot: tock,
								acc: first,
								element,
								power: 0
							}];
						}
						const fraction = resist > 0 ? ` ${resistFractionLabel(resist)} resist.` : "";
						const burstName = burst.name && dmg > 0 ? `${cast.name} magic bursts ${burst.name}. ` : "";
						const artsNote = arts > 0 ? ` Dark Arts adds ${arts} before the multipliers.` : "";
						const ebulNote = cast.nukeMul && cast.nukeMul !== 1 ? " Ebullience adds 20%." : "";
						const klimaNote = klima > 0 ? ` Klimaform adds ${klima} magic accuracy.` : "";
						const weatherLine = weathered.note || (activeStorm(liveBuffs) ? "" : " Day and weather are not up.");
						const follow = dmg > 0 ? ` ${word}. ${left} seconds. The same hit tocks for ${tock} in ${first} seconds, then every 10. A tock cannot pass 9999.` : " The helix does not take hold.";
						const critNote = crit ? " Magic critical hit." : "";
						text = `${burstName}The ${HARE.name} takes ${dmg} points of damage.${fraction}${follow}${artsNote}${ebulNote}${klimaNote}${weatherLine} ${property}.${chantLine(chant)}${critNote}`;
					}
				} else if (spell?.nin) {
					const landed = landNinjutsu(spell, ninCastContext(s.sheet, liveBuffs, s.mainJob === "NIN"));
					if (!landed) text = "No effect.";
					else {
						dmg = landed.dmg;
						text = landed.text;
						liveBuffs = keepNinBuffs(liveBuffs, landed);
						if (landed.give?.name === "Copy Image") {
							if (liveBuffs.some((buff) => buff.name === "Blink" && buff.blinkFrom === "mantle")) {
								liveBuffs = liveBuffs.filter((buff) => !(buff.name === "Blink" && buff.blinkFrom === "mantle"));
								if (text) text = `${text} Zephyr Mantle wears off.`;
							}
						}
						const kind = spell.nin.kind;
						const element = spell.nin.element === "lightning" ? "thunder" : spell.nin.element ?? null;
						if ((kind === "nuke" || kind === "huton") && landed.dmg > 0) {
							const burst = scaleBurst(landed.dmg, element, s.sheet.magicBurstBonus);
							const state = elementalResistState(castMagicAccuracy(spell, s.sheet) - hareMeva(element), 100, Math.random);
							dmg = resistedDamage(burst.value, state);
							if (text && (dmg !== landed.dmg || state > 0)) {
								text = text.replace(`${landed.dmg} points`, `${dmg} points`);
								if (state > 0) text = `${text} ${resistFractionLabel(state)} resist.`;
							}
							if (burst.name && dmg > 0 && text) text = `${spell.name} magic bursts ${burst.name}. ${text}`;
						}
						let row = landed.enfeeble;
						if (row && (kind === "blind" || kind === "poison" || kind === "paralyze")) {
							const rolled = rollFixed(row.left, castMagicAccuracy(spell, s.sheet), element);
							if (rolled.state === 2) {
								row = void 0;
								fullResist = true;
								text = `The ${HARE.name} resists the spell.`;
							} else {
								row = {
									...row,
									left: rolled.left
								};
								if (rolled.state === 1 && text) text = `${text}${halfNote(1, rolled.left)}`;
							}
						}
						if (row) {
							liveEnfeebles = liveEnfeebles.filter((entry) => entry.name !== row.name);
							liveEnfeebles = [...liveEnfeebles, {
								name: row.name,
								left: row.left,
								...row.accDown != null ? { accDown: row.accDown } : {},
								...row.power != null ? { power: row.power } : {},
								...row.dot != null ? {
									dot: row.dot,
									acc: row.acc ?? 0
								} : {}
							}];
						}
						if (landed.hate) creditHate(landed.hate.ce, landed.hate.ve, landed.dmg > 0);
						if (landed.area && landed.give) {
							const hit = splashTrust(10, {
								name: landed.area,
								left: landed.give.left
							}, (buff) => buff.name === landed.area, false);
							if (hit === "hit") {
								partyTouched = true;
								text = `${text}${partyNote(hit)}`;
							}
						}
						ninMark = {
							kind,
							element: element ?? void 0,
							self: dmg <= 0 && !row,
							dmg,
							tier: spell.nin.tier,
							shadows: landed.give?.name === "Copy Image" ? landed.give.charges : void 0,
							area: landed.area != null
						};
					}
				} else if (spell?.spike) {
					const bold = liveBuffs.some((buff) => buff.name === "Embolden");
					const base = emboldenPotency(bold, spikeBase(spell.spike, s.sheet.int));
					const woreReprisal = liveBuffs.some((buff) => buff.name === "Reprisal");
					liveBuffs = liveBuffs.filter((buff) => !isSpike(buff.name) && buff.name !== "Reprisal");
					liveBuffs = [...liveBuffs, {
						name: spell.spike,
						left: emboldenDuration(bold, composeEnhancing(180, spell.radius != null)),
						spikeBase: base
					}];
					text = woreReprisal ? `${spell.spike}. Reprisal wears off.` : `${spell.spike}.`;
				} else if (spell?.debuff) {
					const potency = elementDebuffPotency(s.sheet.int);
					const resolved = resolveElementDebuff(liveHareDebuffs.map((row) => row.name), spell.debuff);
					if (!resolved.landed) text = "No effect.";
					else {
						const label = DEBUFF_STAT_LABEL[DEBUFF_STAT[spell.debuff]];
						liveHareDebuffs = resolved.active.map((name) => {
							if (name !== spell.debuff) {
								const prev = liveHareDebuffs.find((row) => row.name === name);
								if (prev) return prev;
							}
							return {
								name,
								stat: DEBUFF_STAT[name],
								down: potency.stat,
								dot: potency.dot,
								left: 90,
								acc: 0
							};
						});
						const wore = resolved.removed ? ` ${resolved.removed} wears off.` : "";
						text = `${spell.debuff} lowers the ${HARE.name}'s ${label} by ${potency.stat}.${wore}`;
					}
				} else if (spell?.enfeeble) {
					const family = enfeebleFamily(spell.enfeeble);
					if (spell.enfeeble === "Dispel") text = "No effect.";
					else if (isDiaSpell(spell.enfeeble)) {
						if (!slipCanLand(liveEnfeebles.find((row) => isSlipSpell(row.name))?.name ?? null, spell.enfeeble)) text = "No effect.";
						else {
							const burst = scaleBurst(DIA_HIT[spell.enfeeble], "light", s.sheet.magicBurstBonus);
							const rawHit = applyMab(burst.value, shroudMab(s.sheet.mab), hareTargetMdb());
							const hit = cast.cureMul && cast.cureMul !== 1 ? Math.floor(rawHit * cast.cureMul) : rawHit;
							dmg = hit;
							const def = diaDefenseNumer(spell.enfeeble);
							const slip = DIA_DOT[spell.enfeeble];
							const dot = cast.cureMul && cast.cureMul !== 1 ? Math.floor(slip * cast.cureMul) : slip;
							liveEnfeebles = liveEnfeebles.filter((row) => !isSlipSpell(row.name));
							liveEnfeebles = [...liveEnfeebles, {
								name: spell.enfeeble,
								left: DIA_SECONDS[spell.enfeeble],
								power: def,
								dot,
								acc: 0
							}];
							text = `${burst.name && hit > 0 ? `${spell.enfeeble} magic bursts ${burst.name}. ` : ""}${spell.enfeeble} lowers the ${HARE.name}'s defense by ${def}/1024. The light hit is ${hit}. ${dot} HP slips every 3 seconds.`;
						}
					} else if (isBioSpell(spell.enfeeble)) {
						const rawDot = bioPotency(combinedSkill("Dark Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), spell.enfeeble);
						const dot = cast.nukeMul && cast.nukeMul !== 1 ? Math.floor(rawDot * cast.nukeMul) : rawDot;
						const atk = bioAttackNumer(spell.enfeeble);
						const burst = scaleBurst(BIO_HIT[spell.enfeeble], "dark", s.sheet.magicBurstBonus);
						const rawHit = applyMab(burst.value, shroudMab(s.sheet.mab), hareTargetMdb());
						const boosted = cast.nukeMul && cast.nukeMul !== 1 ? Math.floor(rawHit * cast.nukeMul) : rawHit;
						const macc = castMagicAccuracy(spell, s.sheet);
						const state = elementalResistState(macc - hareMeva("dark"), 100, Math.random);
						const hit = resistedDamage(boosted, state);
						dmg = hit;
						const cut = state > 0 ? ` ${resistFractionLabel(state)} resist.` : "";
						const current = liveEnfeebles.find((row) => isSlipSpell(row.name));
						const lead = burst.name && hit > 0 ? `${spell.enfeeble} magic bursts ${burst.name}. ` : "";
						if (!bioCanLand(current?.name ?? null, spell.enfeeble)) text = `${lead}${spell.enfeeble} does not replace ${current?.name}. The dark hit is ${hit}.${cut}`;
						else {
							const status = rollFixed(BIO_SECONDS[spell.enfeeble], macc, "dark");
							if (status.state === 2) text = `${lead}${spell.enfeeble} resists. The dark hit is ${hit}.${cut}`;
							else {
								liveEnfeebles = liveEnfeebles.filter((row) => !isSlipSpell(row.name));
								liveEnfeebles = [...liveEnfeebles, {
									name: spell.enfeeble,
									left: status.left,
									power: atk,
									dot,
									acc: 0
								}];
								text = `${lead}${spell.enfeeble} lowers the ${HARE.name}'s attack by ${atk}/1024. The dark hit is ${hit}.${cut}${halfNote(status.state, status.left)} ${dot} HP slips every 3 seconds.`;
							}
						}
					} else if (spell.enfeeble === "Stun") {
						liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Stun");
						liveEnfeebles = [...liveEnfeebles, {
							name: "Stun",
							left: 2
						}];
						text = `Stun. The ${HARE.name} cannot act for 2 seconds.`;
						if (stunCancels(s.hareAction)) {
							text = `${text} ${stunInterruptLine(s.hareAction)}`;
							stunCut = true;
						}
					} else if (isPoisonSpell(spell.enfeeble)) {
						const skill = combinedSkill("Enfeebling Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel);
						const dot = spell.enfeeble === "Poisonga" ? poisongaPotency(skill) : poisonPotency(skill, spell.enfeeble === "Poison II" ? 2 : 1);
						if (!poisonCanLand(liveEnfeebles.find((row) => isPoisonSpell(row.name))?.name ?? null, spell.enfeeble)) text = "No effect.";
						else {
							const rolled = rollFixed(poisonSeconds(spell.enfeeble), castMagicAccuracy(spell, s.sheet), "water");
							if (rolled.state === 2) {
								fullResist = true;
								text = `The ${HARE.name} resists the spell.`;
							} else {
								liveEnfeebles = liveEnfeebles.filter((row) => !isPoisonSpell(row.name));
								liveEnfeebles = [...liveEnfeebles, {
									name: spell.enfeeble,
									left: rolled.left,
									dot,
									acc: 0
								}];
								const area = spell.radius != null ? " Enemies in 10' are poisoned." : "";
								text = `${spell.enfeeble}. ${dot} HP slips every 3 seconds.${area}${halfNote(rolled.state, rolled.left)}`;
							}
						}
					} else if (spell.enfeeble === "Inundation") {
						liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Inundation");
						liveEnfeebles = [...liveEnfeebles, {
							name: "Inundation",
							left: 300
						}];
						text = `Inundation. One weapon type does not raise skillchain damage.`;
					} else if (spell.enfeeble === "Gravity") {
						liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Gravity");
						liveEnfeebles = [...liveEnfeebles, {
							name: "Gravity",
							left: 120,
							power: 26
						}];
						text = `Gravity weighs the ${HARE.name} down. Movement is 74% of normal.`;
					} else if (spell.enfeeble === "Distract" || spell.enfeeble === "Frazzle") {
						const down = evasionDownPotency(combinedSkill("Enfeebling Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.mnd - HARE.mnd);
						const base = spell.enfeeble === "Distract" ? 300 : 300;
						const element = spell.enfeeble === "Distract" ? "ice" : "dark";
						const rolled = rollFixed(base, castMagicAccuracy(spell, s.sheet), element);
						if (rolled.state === 2) {
							fullResist = true;
							text = `The ${HARE.name} resists the spell.`;
						} else {
							liveEnfeebles = liveEnfeebles.filter((row) => row.name !== spell.enfeeble);
							liveEnfeebles = [...liveEnfeebles, {
								name: spell.enfeeble,
								left: rolled.left,
								power: down
							}];
							text = spell.enfeeble === "Distract" ? `Distract lowers the ${HARE.name}'s evasion by ${down}.${halfNote(rolled.state, rolled.left)}` : `Frazzle lowers the ${HARE.name}'s magic evasion by ${down}.${halfNote(rolled.state, rolled.left)}`;
						}
					} else if (family) {
						if (!enfeebleCanLand(liveEnfeebles.find((row) => enfeebleFamily(row.name) === family)?.name ?? null, spell.enfeeble)) text = "No effect.";
						else {
							const element = family === "blind" ? "dark" : family === "slow" ? "earth" : "ice";
							const rolled = rollFixed(family === "blind" ? spell.enfeeble === "Blind II" ? 180 : 180 : family === "slow" ? spell.enfeeble === "Slow II" ? 180 : 180 : spell.enfeeble === "Paralyze II" ? 120 : 120, castMagicAccuracy(spell, s.sheet), element);
							if (rolled.state === 2) {
								fullResist = true;
								text = `The ${HARE.name} resists the spell.`;
							} else {
								liveEnfeebles = liveEnfeebles.filter((row) => enfeebleFamily(row.name) !== family);
								if (family === "blind") {
									const down = spell.enfeeble === "Blind II" ? blindTwoPotency(s.sheet.int - hareInt()) : blindPotency(s.sheet.int - hareInt());
									liveEnfeebles = [...liveEnfeebles, {
										name: spell.enfeeble,
										left: rolled.left,
										accDown: down,
										...spell.enfeeble === "Blind" ? { blindFrom: "spell" } : {}
									}];
									text = `${spell.enfeeble} lowers the ${HARE.name}'s accuracy by ${down}.${halfNote(rolled.state, rolled.left)}`;
								} else if (family === "slow") {
									const potency = spell.enfeeble === "Slow II" ? slowTwoPotency(s.sheet.mnd - HARE.mnd) : slowPotency(s.sheet.mnd - HARE.mnd);
									liveEnfeebles = [...liveEnfeebles, {
										name: spell.enfeeble,
										left: rolled.left,
										power: potency
									}];
									text = `${spell.enfeeble}. Auto-attack delay is multiplied by ${1024 + potency}/1024.${halfNote(rolled.state, rolled.left)}`;
								} else {
									const chance = spell.enfeeble === "Paralyze II" ? paralyzeTwoChance(s.sheet.mnd - HARE.mnd) : paralyzeChance(s.sheet.mnd - HARE.mnd);
									liveEnfeebles = [...liveEnfeebles, {
										name: spell.enfeeble,
										left: rolled.left,
										power: chance
									}];
									text = `${spell.enfeeble}. ${chance}% chance to cancel an auto-attack or TP move.${halfNote(rolled.state, rolled.left)}`;
								}
							}
						}
					} else if (spell.enfeeble === "Bind") {
						liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Bind");
						liveEnfeebles = [...liveEnfeebles, {
							name: "Bind",
							left: 60
						}];
						text = `Bind.`;
					} else if (spell.enfeeble === "Silence") {
						const rolled = rollFixed(120, castMagicAccuracy(spell, s.sheet), "wind");
						if (rolled.state === 2) {
							fullResist = true;
							text = `The ${HARE.name} resists the spell.`;
						} else {
							liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Silence");
							liveEnfeebles = [...liveEnfeebles, {
								name: "Silence",
								left: rolled.left,
								silenceFrom: "spell"
							}];
							text = `Silence. The ${HARE.name} does not cast.${halfNote(rolled.state, rolled.left)}`;
						}
					} else if (isSleepSpell(spell.enfeeble)) {
						const current = liveEnfeebles.find((row) => isSleepSpell(row.name));
						if (!sleepCanLand(current && isSleepSpell(current.name) ? current.name : null, spell.enfeeble)) text = "No effect.";
						else {
							const rolled = rollFixed(sleepSeconds(spell.enfeeble), castMagicAccuracy(spell, s.sheet), "dark");
							if (rolled.state === 2) {
								fullResist = true;
								text = `The ${HARE.name} resists the spell.`;
							} else {
								liveEnfeebles = liveEnfeebles.filter((row) => !isSleepSpell(row.name) && row.name !== "Lullaby" && row.name !== "Sheep Song" && row.name !== "Soporific" && row.name !== "Yawn" && row.name !== "Charmed");
								liveEnfeebles = [...liveEnfeebles, {
									name: spell.enfeeble,
									left: rolled.left,
									wide: sleepIsWide(spell.enfeeble)
								}];
								text = `${spell.enfeeble}.${halfNote(rolled.state, rolled.left)}`;
							}
						}
					}
				} else if (spell?.siphon) {
					const potency = siphonPotency(spell.siphon, s.sheet.darkMagic, Math.random(), false);
					const base = siphonTaken(spell.siphon, potency, HARE.mp);
					const burst = spell.siphon === "Drain" ? scaleBurst(base, "dark", s.sheet.magicBurstBonus) : {
						value: base,
						name: null
					};
					const takenRaw = burst.value;
					const taken = cast.nukeMul && cast.nukeMul !== 1 ? Math.floor(takenRaw * cast.nukeMul) : takenRaw;
					const state = elementalResistState(castMagicAccuracy(spell, s.sheet) - hareMeva("dark"), 100, Math.random);
					stolen = resistedDamage(taken, state);
					const fraction = state > 0 && stolen !== taken ? ` ${resistFractionLabel(state)} resist.` : state > 0 ? ` ${resistFractionLabel(state)} resist.` : "";
					if (spell.siphon === "Drain") {
						dmg = stolen;
						hpGain = siphonGained(stolen, s.hp, hpCap());
						text = `${burst.name && dmg > 0 ? `Drain magic bursts ${burst.name}. ` : ""}Drain hits the ${HARE.name} for ${dmg} points of damage.${fraction}`;
						gainText = hpGain > 0 ? `You recover ${hpGain} HP.` : "Your HP is full.";
					} else if (taken <= 0) {
						stolen = 0;
						text = `The ${HARE.name} has no MP.`;
					} else {
						mpGain = siphonGained(stolen, s.mp, s.sheet.mp);
						text = `Aspir drains ${stolen} MP from the ${HARE.name}.${fraction}`;
						gainText = mpGain > 0 ? `You recover ${mpGain} MP.` : "Your MP is full.";
					}
				} else if (spell?.warp) text = spell.warp === "Warp II" ? "Warp II returns you to your home point." : "Warp returns you to your home point.";
				else if (spell?.cure) {
					divine = liveBuffs.some((buff) => buff.name === "Divine Seal");
					if (divine) liveBuffs = liveBuffs.filter((buff) => buff.name !== "Divine Seal");
					if (cast.cureUndead) {
						const d = cureUndeadD(spell.cure, s.sheet.mnd - HARE.mnd);
						if (d == null) text = spell.cure === "Cure" ? `${cast.name} strikes the ${HARE.name}. That damage is not published.` : `${cast.name}'s damage is not numbered for a negative dMND.`;
						else {
							dmg = applyMab(d, shroudMab(s.sheet.mab), hareTargetMdb());
							if (cast.cureMul && cast.cureMul !== 1) dmg = Math.floor(dmg * cast.cureMul);
							text = `${cast.name} hits the ${HARE.name} for ${dmg} points of damage.`;
						}
					} else if (typeof cast.allyId === "string" && liveTrusts[cast.allyId]) {
						const who = trustById(cast.allyId);
						const row = liveTrusts[cast.allyId];
						const place = trustPlaces[cast.allyId];
						const limit = spell.range ?? PARTY_CAST_RANGE;
						if (!who || !row || row.ko) text = `${cast.name}. There is no one to receive it.`;
						else if (!place || place.party > limit) text = `${cast.name} is out of range.`;
						else {
							const healing = grimoireSkill("Healing Magic", combinedSkill("Healing Magic", s.mainJob, 75, s.subJob, s.subJob ? subjobLevel(75) : 0), 75, liveBuffs);
							const majesty = liveBuffs.some((buff) => buff.name === "Majesty");
							const their = trustCombat(cast.allyId, trustSubOf(s.party, cast.allyId), trustGearOf(s.party, cast.allyId));
							const cured = cureFinal(cureBase(spell.cure, curePower(s.sheet.mnd, their.vit, healing)), divine);
							const potency = cast.cureMul && cast.cureMul !== 1 ? Math.floor(cured * cast.cureMul) : cured;
							const heal = majesty ? Math.floor(potency * MAJESTY_CURE) : potency;
							const gained = Math.min(heal, Math.max(0, row.maxHp - row.hp));
							row.hp += gained;
							allyHeal = gained;
							partyTouched = true;
							text = gained > 0 ? `${who.name} recovers ${gained} HP.` : `${who.name}'s HP is full.`;
							queueTrustFloater({
								id: cast.allyId,
								name: cast.name,
								amount: gained > 0 ? `+${gained}` : "",
								self: true,
								motion: null
							});
							const solace = liveBuffs.some((buff) => buff.name === "Afflatus Solace");
							const skinNow = row.buffs.find((buff) => buff.name === "Stoneskin");
							const skinKind = skinNow ? stoneskinSource(skinNow.skinFrom) : null;
							if (solace && stoneskinCanLand(skinKind)) {
								const coat = solaceSkin(heal);
								if (coat > 0) {
									row.buffs = row.buffs.filter((buff) => buff.name !== "Stoneskin");
									row.buffs.push({
										name: "Stoneskin",
										left: 30,
										power: coat,
										skinFrom: "solace"
									});
									solaceCoat = coat;
									solaceNote = `Afflatus Solace grants Stoneskin of ${coat}.`;
								}
							}
						}
					} else {
						const healing = grimoireSkill("Healing Magic", combinedSkill("Healing Magic", s.mainJob, 75, s.subJob, s.subJob ? subjobLevel(75) : 0), 75, liveBuffs);
						const majesty = liveBuffs.some((buff) => buff.name === "Majesty");
						const cured = cureFinal(cureBase(spell.cure, curePower(s.sheet.mnd, s.sheet.vit, healing)), divine);
						const potency = cast.cureMul && cast.cureMul !== 1 ? Math.floor(cured * cast.cureMul) : cured;
						const heal = majesty ? Math.floor(potency * MAJESTY_CURE) : potency;
						hpGain = siphonGained(heal, s.hp, hpCap());
						text = hpGain > 0 ? `${cast.name} restores ${hpGain} HP.` : `${cast.name}. Your HP is full.`;
						if (majesty) {
							const splash = healTrust(heal, PARTY_RADIUS);
							if (splash.touched) partyTouched = true;
							text += splash.note;
						}
						const solace = liveBuffs.some((buff) => buff.name === "Afflatus Solace");
						const skinNow = liveBuffs.find((buff) => buff.name === "Stoneskin");
						const skinKind = skinNow ? stoneskinSource(skinNow.skinFrom) : null;
						if (solace && stoneskinCanLand(skinKind)) {
							const coat = solaceSkin(heal);
							if (coat > 0) {
								liveBuffs = liveBuffs.filter((buff) => buff.name !== "Stoneskin");
								liveBuffs = [...liveBuffs, {
									name: "Stoneskin",
									left: 30,
									skin: coat,
									skinFrom: "solace"
								}];
								solaceCoat = coat;
								solaceNote = `Afflatus Solace grants Stoneskin of ${coat}.`;
							}
						}
					}
				} else if (spell?.curaga) {
					divine = liveBuffs.some((buff) => buff.name === "Divine Seal");
					if (divine) liveBuffs = liveBuffs.filter((buff) => buff.name !== "Divine Seal");
					curagaAt = cast.curagaTarget === true;
					if (!(!curagaAt || yardDistance <= (spell.radius ?? 15))) text = `${cast.name}. You are outside the area.`;
					else {
						const healing = grimoireSkill("Healing Magic", combinedSkill("Healing Magic", s.mainJob, 75, s.subJob, s.subJob ? subjobLevel(75) : 0), 75, liveBuffs);
						const healBase = cureFinal(curagaBase(spell.curaga, curagaPower(s.sheet.mnd, s.sheet.vit, healing)), divine);
						const heal = cast.cureMul && cast.cureMul !== 1 ? Math.floor(healBase * cast.cureMul) : healBase;
						hpGain = siphonGained(heal, s.hp, hpCap());
						const splash = healTrust(heal, spell.radius ?? 15);
						if (splash.touched) partyTouched = true;
						text = `${hpGain > 0 ? `${cast.name} restores ${hpGain} HP.` : `${cast.name}. Your HP is full.`}${splash.note}`;
					}
				} else if (spell?.cura) {
					const misery = liveBuffs.some((buff) => buff.name === "Afflatus Misery");
					const divineUp = liveBuffs.some((buff) => buff.name === "Divine Seal");
					const recorded = misery ? miseryWound : 0;
					if (misery) miseryWound = 0;
					text = `Cura. The cure amount is not published, so no HP is applied.${misery && recorded > 0 ? ` Afflatus Misery had recorded ${recorded} damage. That bonus is not published, so it is not added, and the record is spent.` : misery ? " Afflatus Misery is up. No damage is recorded, and its bonus is not published." : ""}${divineUp ? " Divine Seal stays, because the doubled amount is not published." : ""}`;
				} else if (spell?.stoneskin) {
					const skinNow = liveBuffs.find((buff) => buff.name === "Stoneskin");
					if (!stoneskinCanLand(skinNow ? stoneskinSource(skinNow.skinFrom) : null)) text = "No effect.";
					else {
						const bold = liveBuffs.some((buff) => buff.name === "Embolden");
						const enhancing = grimoireSkill("Enhancing Magic", combinedSkill("Enhancing Magic", s.mainJob, 75, s.subJob, s.subJob ? subjobLevel(75) : 0), 75, liveBuffs);
						skinPower = emboldenPotency(bold, stoneskinPower(s.sheet.mnd, enhancing));
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Stoneskin");
						liveBuffs = [...liveBuffs, {
							name: "Stoneskin",
							left: emboldenDuration(bold, composeEnhancing(300, false)),
							skin: skinPower,
							skinFrom: "spell"
						}];
						text = `Stoneskin absorbs ${skinPower} points of damage.`;
					}
				} else if (spell?.barrier) {
					const kind = spell.barrier.kind;
					const tier = spell.barrier.tier;
					const status = kind === "protect" ? "Protect" : "Shell";
					const currentTier = liveBuffs.find((buff) => buff.name === status)?.tier ?? null;
					const majesty = kind === "protect" && liveBuffs.some((buff) => buff.name === "Majesty");
					const area = spell.barrier.area === true;
					const splash = area || majesty;
					const bold = liveBuffs.some((buff) => buff.name === "Embolden");
					barrierArea = splash;
					const basePower = kind === "protect" ? PROTECT_DEF[tier] : SHELL_CUT[tier];
					const partyPower = basePower + (kind === "protect" ? s.sheet.shieldBarrier : 0);
					const selfPower = emboldenPotency(bold, basePower) + (kind === "protect" ? s.sheet.shieldBarrier : 0);
					const baseLeft = composeEnhancing(barrierDuration(spell.barrier.effectLevel, 75), splash);
					const selfLeft = emboldenDuration(bold, baseLeft);
					const ward = {
						name: status,
						left: baseLeft,
						tier,
						power: partyPower
					};
					const drop = (buff) => buff.name === status;
					const aimed = !area && typeof cast.allyId === "string" ? cast.allyId : null;
					const aimedWho = aimed ? trustById(aimed) : null;
					const replaced = currentTier != null && currentTier < tier ? ` The weaker ${status} wears off.` : "";
					const selfLine = kind === "protect" ? `raises defense by ${selfPower}` : `cuts magic damage by ${selfPower}/256`;
					const partyLine = kind === "protect" ? `raises defense by ${partyPower}` : `cuts magic damage by ${partyPower}/256`;
					if (aimedWho && aimed) {
						const trust = liveTrusts[aimed];
						const place = trustPlaces[aimed];
						if (!trust || trust.ko) text = `${cast.name}. There is no one to receive it.`;
						else if (!place || place.party > PARTY_CAST_RANGE) text = `${cast.name} is out of range.`;
						else {
							const landed = putTrustStatus(trust, ward, drop, true);
							if (landed) {
								partyWard = true;
								partyTouched = true;
							}
							text = landed ? `${cast.name} ${partyLine} on ${aimedWho.name}.` : "No effect.";
							if (majesty && place.party <= PARTY_RADIUS && barrierOverwrites(currentTier, tier)) {
								liveBuffs = liveBuffs.filter((buff) => buff.name !== status);
								liveBuffs = [...liveBuffs, {
									name: status,
									left: selfLeft,
									tier,
									power: selfPower
								}];
								barrierLanded = true;
								text += " You are within 10' and receive it.";
							}
						}
					} else if (!barrierOverwrites(currentTier, tier)) {
						if (splash) {
							const hit = splashTrust(PARTY_RADIUS, ward, drop, true);
							if (hit === "hit") {
								partyWard = true;
								partyTouched = true;
							}
							text = `No effect on you.${partyNote(hit)}`;
						} else text = "No effect.";
					} else {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== status);
						liveBuffs = [...liveBuffs, {
							name: status,
							left: selfLeft,
							tier,
							power: selfPower
						}];
						barrierLanded = true;
						if (splash) {
							const hit = splashTrust(PARTY_RADIUS, ward, drop, true);
							if (hit === "hit") {
								partyWard = true;
								partyTouched = true;
							}
							text = `${cast.name} ${selfLine} for party members within 10'.${partyNote(hit)}${replaced}`;
						} else text = `${cast.name} ${selfLine}.${replaced}`;
					}
				} else if (spell?.regen) {
					const tier = spell.regen.tier;
					const currentTier = liveBuffs.find((buff) => buff.name === "Regen")?.tier ?? null;
					if (!barrierOverwrites(currentTier, tier)) text = "No effect.";
					else {
						const bold = liveBuffs.some((buff) => buff.name === "Embolden");
						const power = emboldenPotency(bold, REGEN_HP[tier]) + (cast.regenHp ?? 0);
						const left = emboldenDuration(bold, composeEnhancing(enhancingDuration(REGEN_SECONDS[tier], spell.regen.effectLevel, 75), false)) + (cast.regenSec ?? 0);
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Regen");
						liveBuffs = [...liveBuffs, {
							name: "Regen",
							left,
							tier,
							power
						}];
						regenLanded = true;
						const replaced = currentTier != null && currentTier < tier ? " The weaker Regen wears off." : "";
						const grimoire = cast.regenHp ? ` Grimoire adds ${cast.regenHp} HP a tick and ${cast.regenSec} seconds.` : "";
						text = `${cast.name} restores ${power} HP every 3 seconds.${grimoire}${replaced}`;
					}
				} else if (spell?.haste) {
					const power = 150;
					const left = composeEnhancing(enhancingDuration(180, spell.haste.effectLevel, 75), false);
					const woreRefuel = liveBuffs.some((buff) => buff.name === "Haste" && buff.hasteFrom === "refuel");
					liveBuffs = liveBuffs.filter((buff) => buff.name !== "Haste");
					liveBuffs = [...liveBuffs, {
						name: "Haste",
						left,
						power,
						hasteFrom: "spell"
					}];
					const baseDelay = s.sheet.swing.baseDelay;
					const ranged = s.sheet.skillName === "Archery" || s.sheet.skillName === "Marksmanship";
					const modified = swingTiming(baseDelay, {
						equipment: 0,
						magic: hasteMagic(liveBuffs),
						jobAbility: 0,
						dualWield: s.sheet.dualWield
					}).modifiedDelay;
					if (!liveBuffs.some((buff) => buff.name === "Chainspell")) {
						const nextRecast = composureRecast(fastCastRecast(hastedRecast(spell.recast ?? 0, power), s.sheet.fastCast), liveBuffs.some((buff) => buff.name === "Composure"));
						liveRecasts[cast.recastName] = Math.max(0, nextRecast - cast.elapsed);
					}
					text = ranged ? `${cast.name}. Magic haste is ${power}/1024. This ${s.sheet.skillName.toLowerCase()} delay is not shortened. Cast time is not shortened.` : `${cast.name}. This weapon's delay ${baseDelay} becomes ${modified}. Cast time is not shortened.`;
					if (woreRefuel) text = `${text} Refueling wears off.`;
				} else if (spell?.refresh) {
					if (liveBuffs.some((buff) => buff.name === "Sublimation" || buff.name === "Sublimation: Complete")) {
						text = "No effect. Sublimation is already storing MP.";
					} else {
					const power = 3;
					const left = composeEnhancing(enhancingDuration(150, spell.refresh.effectLevel, 75), false);
					liveBuffs = liveBuffs.filter((buff) => buff.name !== "Refresh");
					liveBuffs = [...liveBuffs, {
						name: "Refresh",
						left,
						power
					}];
					text = `${cast.name} restores ${power} MP every 3 seconds.`;
					}
				} else if (spell?.storm) {
					const prev = liveBuffs.find((buff) => stormByName(buff.name));
					const left = composeEnhancing(enhancingDuration(STORM_SECONDS, spell.level, 75), false);
					liveBuffs = liveBuffs.filter((buff) => !stormByName(buff.name));
					liveBuffs = [...liveBuffs, {
						name: spell.name,
						left,
						element: spell.storm.element
					}];
					const wore = prev && prev.name !== spell.name ? ` ${prev.name} wears off.` : prev ? " It is refreshed." : "";
					const row = stormByName(spell.name);
					const locked = row?.stat === "all"
						? "Stormsurge is not unlocked, so no attribute is added. Voidstorm would be half of that bonus, and floored."
						: `Stormsurge is not unlocked, so no ${row?.stat ?? "attribute"} is added.`;
					text = `${spell.name}. The weather around you is ${spell.storm.sky}. It is single weather for ${Math.round(left)} seconds.${wore} ${locked} A matching elemental hit is 10% higher, and the opposed element is 10% lower. Cumulative enmity 1, volatile enmity 300.`;
				} else if (spell?.klimaform) {
					const composed = liveBuffs.some((buff) => buff.name === "Composure");
					const left = composureDuration(KLIMAFORM_SECONDS, composed);
					liveBuffs = liveBuffs.filter((buff) => buff.name !== "Klimaform");
					liveBuffs = [...liveBuffs, {
						name: "Klimaform",
						left,
						power: KLIMAFORM_MACC
					}];
					const storm = activeStorm(liveBuffs);
					const word = storm ? storm.element === "thunder" ? "lightning" : storm.element : "";
					const weather = storm ? ` ${storm.name} is ${storm.sky}, so ${word} spells gain ${KLIMAFORM_MACC} magic accuracy.` : " No weather is up, so the bonus is waiting.";
					const tripled = composed ? " Composure triples the 5:00." : "";
					const area = cast.manifestRadius ? " Manifestation would share it inside 10'. You are the only party member." : "";
					text = `Klimaform.${weather}${tripled}${area} Enhancing duration gear does not lengthen it. Cumulative enmity 300, volatile enmity 1.`;
				} else if (spell?.aquaveil) {
					const bold = liveBuffs.some((buff) => buff.name === "Embolden");
					veilCharges = emboldenPotency(bold, aquaveilCharges(combinedSkill("Enhancing Magic", s.mainJob, 75, s.subJob, s.subJob ? subjobLevel(75) : 0)));
					const left = emboldenDuration(bold, composeEnhancing(enhancingDuration(600, spell.aquaveil.effectLevel, 75), spell.radius != null));
					liveBuffs = liveBuffs.filter((buff) => buff.name !== "Aquaveil");
					liveBuffs = [...liveBuffs, {
						name: "Aquaveil",
						left,
						charges: veilCharges
					}];
					text = `Aquaveil. ${veilCharges} ${veilCharges === 1 ? "charge" : "charges"}. A physical hit can break the cast. Each charge stops one of those hits. Moving still breaks a cast.`;
				} else if (spell?.blink) {
					const bold = liveBuffs.some((buff) => buff.name === "Embolden");
					const shadows = emboldenPotency(bold, 2);
					const left = emboldenDuration(bold, composeEnhancing(enhancingDuration(300, spell.blink.effectLevel, 75), spell.radius != null));
					const woreMantle = liveBuffs.some((buff) => buff.name === "Blink" && buff.blinkFrom === "mantle");
					liveBuffs = liveBuffs.filter((buff) => buff.name !== "Blink");
					liveBuffs = [...liveBuffs, {
						name: "Blink",
						left,
						charges: shadows,
						blinkFrom: "spell"
					}];
					text = `Blink. ${shadows} shadows. An auto-attack or Foot Kick removes one. Whirl Claws needs three, and fewer than that still lets the cut land. Dust Cloud ignores shadows. Spikes do not answer an absorbed hit.`;
					if (woreMantle) text = `${text} Zephyr Mantle wears off.`;
				} else if (spell?.foil) {
					const bold = liveBuffs.some((buff) => buff.name === "Embolden");
					const power = emboldenPotency(bold, 150);
					const left = emboldenDuration(bold, composeEnhancing(enhancingDuration(30, spell.foil.effectLevel, 75), false));
					liveBuffs = liveBuffs.filter((buff) => buff.name !== "Foil");
					liveBuffs = [...liveBuffs, {
						name: "Foil",
						left,
						power,
						acc: 0
					}];
					text = `Foil. Evasion against special attacks +${power}. It decays by 3 every 3 seconds. Cumulative enmity 320, volatile enmity 880.`;
				} else if (spell?.phalanx) {
					const bold = liveBuffs.some((buff) => buff.name === "Embolden");
					const cut = emboldenPotency(bold, phalanxPower(combinedSkill("Enhancing Magic", s.mainJob, 75, s.subJob, s.subJob ? subjobLevel(75) : 0)));
					if (!phalanxOverwrites(liveBuffs.find((buff) => buff.name === "Phalanx")?.power ?? null, cut)) text = "No effect.";
					else {
						const left = emboldenDuration(bold, composeEnhancing(enhancingDuration(180, spell.phalanx.effectLevel, 75), false));
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Phalanx");
						liveBuffs = [...liveBuffs, {
							name: "Phalanx",
							left,
							power: cut
						}];
						phalanxCut = cut;
						phalanxLanded = true;
						text = `Phalanx reduces each hit by ${cut}. A cut from the ${HARE.name} loses that many points, then Stoneskin.`;
					}
				} else if (spell?.reprisal) {
					if (liveBuffs.some((buff) => isSpike(buff.name))) text = "No effect.";
					else {
						const left = composeEnhancing(enhancingDuration(60, spell.reprisal.effectLevel, 75), false);
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Reprisal");
						liveBuffs = [...liveBuffs, {
							name: "Reprisal",
							left,
							power: 33
						}];
						reprisalLanded = true;
						text = `Reprisal. Shield skill is read live and multiplied by ${REPRISAL_SKILL}. Block rate is multiplied by ${REPRISAL_BLOCK}. A block reflects 33% of the damage the shield kept, as light magic, before Phalanx, Stoneskin, Sentinel, and Invincible. A blocked weaponskill is not reflected. Shield Mastery adds its TP when the hit would have passed Stoneskin before the shield's percent. Spikes overwrite this.`;
					}
				} else if (spell?.enspell) {
					const current = liveBuffs.find((buff) => buff.enspell);
					if (!enspellOverwrites(current?.enspell?.tier ?? null, spell.enspell.tier)) text = "No effect.";
					else {
						const enhancing = grimoireSkill("Enhancing Magic", combinedSkill("Enhancing Magic", s.mainJob, 75, s.subJob, s.subJob ? subjobLevel(75) : 0), 75, liveBuffs);
						const base = spell.enspell.tier === 1 ? enspellTwoBase(enhancing) : 0;
						const hadAuspice = liveBuffs.some((buff) => buff.name === "Auspice");
						if (hadAuspice) auspiceRamp = 0;
						liveBuffs = liveBuffs.filter((buff) => !buff.enspell && buff.name !== "Auspice");
						const left = composeEnhancing(180, false);
						liveBuffs = [...liveBuffs, {
							name: spell.name,
							left,
							enspell: {
								tier: spell.enspell.tier,
								element: spell.enspell.element,
								base,
								rounds: 0
							}
						}];
						const wore = current && current.name !== spell.name ? ` ${current.name} wears off.` : "";
						const auspiceWore = hadAuspice ? " Auspice wears off." : "";
						text = spell.enspell.tier === 1 ? `${spell.name}. Additional effect ${base} on every connecting melee hit.${wore}${auspiceWore}` : `${spell.name}. The first hit of a connecting round deals additional effect, starting at ${enspellTwoBase(enhancing)}.${wore}${auspiceWore}`;
					}
				} else if (spell?.auspice) {
					const blocked = auspiceBlockedByEnspell(liveBuffs.find((buff) => buff.enspell)?.enspell?.tier ?? null);
					const left = composeEnhancing(enhancingDuration(180, spell.auspice.effectLevel, 75), spell.radius != null);
					if (blocked) text = "No effect.";
					else {
						const removedEnspell = liveBuffs.find((buff) => buff.enspell);
						if (removedEnspell) liveBuffs = liveBuffs.filter((buff) => !buff.enspell);
						const acc = liveBuffs.find((buff) => buff.name === "Auspice")?.acc ?? 0;
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Auspice");
						liveBuffs = [...liveBuffs, {
							name: "Auspice",
							left,
							power: 10,
							...acc > 0 ? { acc } : {}
						}];
						auspiceRamp = 0;
						text = acc > 0 ? `Auspice. Subtle Blow +10. The light-damage count starts over. Accuracy +${acc} stays.` : `Auspice. Subtle Blow +10. The ${HARE.name} gains less TP from a hit that connects. With Afflatus Misery, a connecting first swing deals Enspell II light damage, and a missed round adds accuracy.`;
						if (removedEnspell) text = `${text} ${removedEnspell.name} wears off.`;
					}
					const hit = splashTrust(spell.radius ?? PARTY_RADIUS, {
						name: "Auspice",
						left,
						power: 10
					}, (buff) => buff.name === "Auspice", false);
					if (hit === "hit") {
						partyWard = true;
						partyTouched = true;
					}
					text = blocked ? hit === "hit" ? `No effect on you.${partyNote(hit)}` : "No effect." : `${text}${partyNote(hit)}`;
				} else if (spell?.bar) {
					const bold = liveBuffs.some((buff) => buff.name === "Embolden");
					const enhancing = grimoireSkill("Enhancing Magic", combinedSkill("Enhancing Magic", s.mainJob, 75, s.subJob, s.subJob ? subjobLevel(75) : 0), 75, liveBuffs);
					const elementBar = spell.bar.kind === "element";
					const selfBar = spell.radius == null;
					const resolved = elementBar ? resolveElementBar(enhancing, spell.bar.effectLevel, 75) : resolveStatusBar(spell.bar.effectLevel, 75, selfBar);
					const selfPower = emboldenPotency(bold, resolved.power);
					const selfLeft = emboldenDuration(bold, resolved.left);
					const previous = liveBuffs.find((buff) => elementBar ? isElementBar(buff.name) : isStatusBar(buff.name));
					liveBuffs = liveBuffs.filter((buff) => elementBar ? !isElementBar(buff.name) : !isStatusBar(buff.name));
					liveBuffs = [...liveBuffs, {
						name: spell.name,
						left: selfLeft,
						power: selfPower
					}];
					const wore = previous && previous.name !== spell.name ? ` ${previous.name} wears off.` : "";
					const label = barResistLabel(spell.bar.resists);
					let hit = "none";
					if (!selfBar) {
						hit = splashTrust(spell.radius ?? PARTY_RADIUS, {
							name: spell.name,
							left: resolved.left,
							power: resolved.power
						}, (buff) => elementBar ? isElementBar(buff.name) : isStatusBar(buff.name), false);
						if (hit === "hit") {
							partyWard = true;
							partyTouched = true;
						}
					}
					text = selfBar ? `${spell.name}. ${label} resistance +${selfPower}.${wore}` : `${spell.name}. ${label} resistance +${selfPower} for party members within 10'.${partyNote(hit)}${wore}`;
					barLanded = {
						element: spell.bar.element,
						resisted: elementBar ? elementResisted(spell.name) : null,
						status: elementBar ? null : statusResisted$1(spell.name),
						power: selfPower,
						party: partyWard
					};
				} else if (spell?.na || spell?.esuna || spell?.sacrifice) {
					const healing = grimoireSkill("Healing Magic", combinedSkill("Healing Magic", s.mainJob, 75, s.subJob, s.subJob ? subjobLevel(75) : 0), 75, liveBuffs);
					const cleaned = resolveCleanse(spell, liveAilments, {
						misery: liveBuffs.some((buff) => buff.name === "Afflatus Misery"),
						solace: liveBuffs.some((buff) => buff.name === "Afflatus Solace"),
						healing,
						roll: Math.random()
					});
					liveAilments = cleaned.ailments;
					text = cleaned.text;
				} else if (spell?.erase) {
					const cleaned = resolveCleanse(spell, liveAilments, {
						misery: false,
						solace: false,
						healing: 0,
						roll: 0
					});
					liveAilments = cleaned.ailments;
					text = cleaned.text;
				} else if (spell?.raise) {
					const raiseId = typeof cast.allyId === "string" && cast.allyId !== "player" ? cast.allyId : null;
					if (raiseId) {
						const near = (trustPlaces[raiseId]?.party ?? 99) <= (spell.range ?? 20);
						const revived = near ? acceptRaise(raiseId, spell.raise) : null;
						if (!near) text = `${trustName(raiseId)} is out of range.`;
						else if (!revived) text = "No effect.";
						else {
							partyTouched = true;
							text = `${cast.name} restores ${revived.hp} HP. ${trustName(raiseId)} accepts the raise.`;
						}
					} else if (mijinDown && s.ko) {
						const back = mijinRaiseHp(hpCap());
						mijinDown = false;
						clearFallenWeak();
						raised = true;
						hpGain = Math.max(0, back - s.hp);
						livePending = null;
						dropHateRow("player");
						text = `${cast.name} restores ${back} HP. The ${HARE.name} does not turn on you.`;
					} else {
						const revived = resolveRaise(spell.raise, {
							ko: s.ko,
							level: 75,
							maxHp: hpCap(),
							weakness: weaknessForRaise()
						});
						if (!revived) text = "No effect.";
						else {
							raised = true;
							hpGain = Math.max(0, revived.hp - s.hp);
							liveWeakness = revived.weakness;
							clearFallenWeak();
							livePending = null;
							dropHateRow("player");
							text = `${cast.name} restores ${revived.hp} HP. The ${HARE.name} does not turn on you.`;
						}
					}
				} else if (spell?.reraise) {
					const prev = liveBuffs.find((buff) => isReraiseSpell(buff.name));
					liveBuffs = liveBuffs.filter((buff) => !isReraiseSpell(buff.name));
					liveBuffs = [...liveBuffs, {
						name: spell.reraise,
						left: RERAISE_SECONDS
					}];
					const enmity = " Cumulative enmity 1, volatile enmity 80.";
					text = prev && prev.name !== spell.reraise ? `${spell.reraise}. ${prev.name} wears off.${enmity}` : `${spell.reraise}.${enmity}`;
				} else if (spell?.banish || spell?.holy) {
					const dMnd = s.sheet.mnd - HARE.mnd;
					const burst = scaleBurst(spell.banish ? banishDamage(spell.banish, dMnd, 0, 0, HARE.undead) : holyDamage(dMnd, 0, 0), "light", s.sheet.magicBurstBonus);
					const hit = applyMab(burst.value, shroudMab(s.sheet.mab), hareTargetMdb());
					const raptured = cast.cureMul && cast.cureMul !== 1 ? Math.floor(hit * cast.cureMul) : hit;
					const weathered = weatherAdjusted(raptured, "light", liveBuffs);
					const klima = klimaformMacc("light", liveBuffs);
					const state = elementalResistState(castMagicAccuracy(spell, s.sheet) - hareMeva("light"), 100, Math.random);
					dmg = resistedDamage(weathered.value, state);
					const fraction = state > 0 ? ` ${resistFractionLabel(state)} resist.` : "";
					const klimaNote = klima > 0 ? ` Klimaform adds ${klima} magic accuracy.` : "";
					text = `${burst.name && dmg > 0 ? `${cast.name} magic bursts ${burst.name}. ` : ""}${cast.name} hits the ${HARE.name} for ${dmg} points of damage.${fraction}${weathered.note}${klimaNote}`;
					if (spell.banish) {
						const next = resolveBanishDown(liveBanish, spell.banish, HARE.undead);
						if (next && next !== liveBanish) text = `${text} Its special defense falls.`;
						liveBanish = next;
					}
				} else if (spell?.flash) {
					const rolled = rollFixed(12, castMagicAccuracy(spell, s.sheet), "light");
					if (rolled.state === 2) {
						fullResist = true;
						text = `The ${HARE.name} resists the spell.`;
					} else {
						liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Flash");
						liveEnfeebles = [...liveEnfeebles, {
							name: "Flash",
							left: rolled.left,
							accDown: 300,
							flashFrom: "spell"
						}];
						text = `Flash lowers the ${HARE.name}'s accuracy by 300.${halfNote(rolled.state, rolled.left)}`;
					}
				} else if (spell?.repose) {
					const current = liveEnfeebles.find((row) => isSleepSpell(row.name));
					if (!sleepCanLand(current && isSleepSpell(current.name) ? current.name : null, "Repose")) text = "No effect.";
					else {
						const rolled = rollFixed(sleepSeconds("Repose"), castMagicAccuracy(spell, s.sheet), "light");
						if (rolled.state === 2) {
							fullResist = true;
							text = `The ${HARE.name} resists the spell.`;
						} else {
							liveEnfeebles = liveEnfeebles.filter((row) => !isSleepSpell(row.name) && row.name !== "Sheep Song" && row.name !== "Soporific" && row.name !== "Yawn");
							liveEnfeebles = [...liveEnfeebles, {
								name: "Repose",
								left: rolled.left
							}];
							text = `Repose.${halfNote(rolled.state, rolled.left)}`;
						}
					}
				} else if (spell?.blue != null && "silence" in spell.blue) {
					const current = liveEnfeebles.find((row) => row.name === "Silence");
					const facing = !playerIsBehind();
					chaoticNear = yardDistance <= 21 && liveHareHp > 0 && !hareIsCharmed() && facing;
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (yardDistance > 21) text = `The ${HARE.name} is outside Chaotic Eye.`;
					else if (!facing) text = `The ${HARE.name} is not facing you.`;
					else if (!chaoticCanReplace(current)) text = "No effect.";
					else {
						const rolled = rollFixed(120, chaoticMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.mnd - HARE.mnd), "wind");
						if (rolled.state === 2) {
							fullResist = true;
							text = `The ${HARE.name} resists the spell.`;
						} else {
							liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Silence");
							liveEnfeebles = [...liveEnfeebles, {
								name: "Silence",
								left: rolled.left,
								silenceFrom: "eye"
							}];
							text = `Chaotic Eye. The ${HARE.name} does not cast.${halfNote(rolled.state, rolled.left)}`;
						}
					}
				} else if (spell?.blue != null && "flash" in spell.blue) {
					const current = liveEnfeebles.find((row) => row.name === "Flash");
					actinicNear = yardDistance <= 10 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!actinicNear) text = `The ${HARE.name} is outside Actinic Burst.`;
					else if (!actinicCanReplace(current)) text = "No effect.";
					else {
						const rolled = rollFixed(15, actinicMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.mnd - HARE.mnd), "light");
						if (rolled.state === 2) {
							fullResist = true;
							text = `The ${HARE.name} resists the spell.`;
						} else {
							liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Flash");
							liveEnfeebles = [...liveEnfeebles, {
								name: "Flash",
								left: rolled.left,
								accDown: 300,
								flashFrom: "burst"
							}];
							text = `Actinic Burst lowers the ${HARE.name}'s accuracy by 300.${halfNote(rolled.state, rolled.left)}`;
						}
					}
				} else if (spell?.blue != null && "spikes" in spell.blue) {
					const base = spikeBase("Shock Spikes", s.sheet.int);
					const wore = liveBuffs.find((buff) => isSpike(buff.name) || buff.name === "Reprisal");
					liveBuffs = liveBuffs.filter((buff) => !isSpike(buff.name) && buff.name !== "Reprisal");
					liveBuffs = [...liveBuffs, {
						name: "Shock Spikes",
						left: 720,
						spikeBase: base
					}];
					text = wore ? `Plasma Charge. ${wore.name} wears off.` : "Plasma Charge.";
				} else if (spell?.blue != null && "mantle" in spell.blue) {
					if (!mantleCanReplace(liveBuffs)) text = "No effect.";
					else {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Blink");
						liveBuffs = [...liveBuffs, {
							name: "Blink",
							left: 300,
							charges: 4,
							blinkFrom: "mantle"
						}];
						text = `Zephyr Mantle. 4 shadows. An auto-attack or Foot Kick removes one. Whirl Claws needs three, and fewer than that still lets the cut land. Dust Cloud ignores shadows.`;
					}
				} else if (spell?.blue != null && "cocoon" in spell.blue) {
					liveBuffs = liveBuffs.filter((buff) => buff.name !== "Defense Boost");
					liveBuffs = [...liveBuffs, {
						name: "Defense Boost",
						left: 90,
						power: 128
					}];
					text = `Cocoon. Defense +50% for 90 seconds.`;
				} else if (spell?.blue != null && "feather" in spell.blue) {
					liveBuffs = liveBuffs.filter((buff) => buff.name !== "Evasion Boost");
					liveBuffs = [...liveBuffs, {
						name: "Evasion Boost",
						left: 30,
						power: 25
					}];
					text = `Feather Barrier. Evasion +25 for 30 seconds.`;
				} else if (spell?.blue != null && "warmup" in spell.blue) {
					liveBuffs = liveBuffs.filter((buff) => buff.name !== "Accuracy Boost");
					liveBuffs = [...liveBuffs, {
						name: "Accuracy Boost",
						left: 180,
						power: 10
					}];
					const evasion = liveBuffs.find((buff) => buff.name === "Evasion Boost");
					if (!evasion || (evasion.power ?? 0) <= 10) {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Evasion Boost");
						liveBuffs = [...liveBuffs, {
							name: "Evasion Boost",
							left: 180,
							power: 10
						}];
						text = `Warm-Up. Accuracy +10. Evasion +10 for 180 seconds.`;
					} else text = `Warm-Up. Accuracy +10. A stronger Evasion Boost stays.`;
				} else if (spell?.blue != null && "amp" in spell.blue) {
					const current = liveBuffs.find((buff) => buff.name === "Magic Atk. Boost");
					const keepMab = current != null && (current.power ?? 0) > 10;
					if (!keepMab) {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Magic Atk. Boost");
						liveBuffs = [...liveBuffs, {
							name: "Magic Atk. Boost",
							left: 90,
							power: 10
						}];
					}
					const currentMdb = liveBuffs.find((buff) => buff.name === "Magic Def. Boost");
					const keepMdb = currentMdb != null && (currentMdb.power ?? 0) > 10;
					if (!keepMdb) {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Magic Def. Boost");
						liveBuffs = [...liveBuffs, {
							name: "Magic Def. Boost",
							left: 90,
							power: 10
						}];
					}
					text = `Amplification. ${keepMab ? "A stronger Magic Atk. Boost stays." : `Magic attack +10.`} ${keepMdb ? "A stronger Magic Def. Boost stays." : `Magic defense +10 for 90 seconds.`}`;
				} else if (spell?.blue != null && "triumph" in spell.blue) {
					liveBuffs = liveBuffs.filter((buff) => buff.name !== "Attack Boost");
					liveBuffs = [...liveBuffs, {
						name: "Attack Boost",
						left: 60,
						power: 38
					}];
					text = `Triumphant Roar. Attack +38/256 for 60 seconds.`;
				} else if (spell?.blue != null && "saline" in spell.blue) {
					liveBuffs = liveBuffs.filter((buff) => buff.name !== "Magic Def. Boost");
					liveBuffs = [...liveBuffs, {
						name: "Magic Def. Boost",
						left: 180,
						power: 50,
						decay: 4
					}];
					text = `Saline Coat. Magic defense +50 for 180 seconds. It falls by 1 every 4 seconds.`;
				} else if (spell?.blue != null && "metal" in spell.blue) {
					const skinNow = liveBuffs.find((buff) => buff.name === "Stoneskin");
					if (!metallicCanLand(skinNow ? stoneskinSource(skinNow.skinFrom) : null)) text = "No effect.";
					else {
						metalSkin = metallicBodyPower(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel));
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Stoneskin");
						liveBuffs = [...liveBuffs, {
							name: "Stoneskin",
							left: 300,
							skin: metalSkin,
							skinFrom: "metal"
						}];
						text = `Metallic Body. Stoneskin ${metalSkin} for 300 seconds.`;
					}
				} else if (spell?.blue != null && "refuel" in spell.blue) {
					if (!refuelCanReplace(liveBuffs)) text = "No effect.";
					else {
						const power = 102;
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Haste");
						liveBuffs = [...liveBuffs, {
							name: "Haste",
							left: 300,
							power,
							hasteFrom: "refuel"
						}];
						const baseDelay = s.sheet.swing.baseDelay;
						const ranged = s.sheet.skillName === "Archery" || s.sheet.skillName === "Marksmanship";
						const modified = swingTiming(baseDelay, {
							equipment: 0,
							magic: hasteMagic(liveBuffs),
							jobAbility: 0,
							dualWield: s.sheet.dualWield
						}).modifiedDelay;
						if (!liveBuffs.some((buff) => buff.name === "Chainspell")) {
							const nextRecast = composureRecast(fastCastRecast(hastedRecast(spell.recast ?? 0, power), s.sheet.fastCast), liveBuffs.some((buff) => buff.name === "Composure"));
							liveRecasts[cast.recastName] = Math.max(0, nextRecast - cast.elapsed);
						}
						text = ranged ? `Refueling. Magic haste is ${power}/1024. This ${s.sheet.skillName.toLowerCase()} delay is not shortened. Cast time is not shortened.` : `Refueling. Magic haste is ${power}/1024. This weapon's delay ${baseDelay} becomes ${modified}. Cast time is not shortened.`;
					}
				} else if (spell?.blue != null && "cure" in spell.blue) {
					divine = liveBuffs.some((buff) => buff.name === "Divine Seal");
					if (divine) liveBuffs = liveBuffs.filter((buff) => buff.name !== "Divine Seal");
					const healing = grimoireSkill("Healing Magic", combinedSkill("Healing Magic", s.mainJob, 75, s.subJob, s.subJob ? subjobLevel(75) : 0), 75, liveBuffs);
					const power = wildCarrotPower(s.sheet.mnd, s.sheet.vit, healing);
					const cured = cureFinal(spell.name === "Magic Fruit" ? magicFruitBase(power) : wildCarrotBase(power), divine);
					if (typeof cast.allyId === "string" && liveTrusts[cast.allyId]) {
						const who = trustById(cast.allyId);
						const row = liveTrusts[cast.allyId];
						const place = trustPlaces[cast.allyId];
						const limit = spell.range ?? 20;
						if (!who || !row || row.ko) text = `${cast.name}. There is no one to receive it.`;
						else if (!place || place.party > limit) text = `${cast.name} is out of range.`;
						else {
							const gained = Math.min(cured, Math.max(0, row.maxHp - row.hp));
							row.hp += gained;
							allyHeal = gained;
							partyTouched = true;
							text = gained > 0 ? `${who.name} recovers ${gained} HP.` : `${who.name}'s HP is full.`;
						}
					} else {
						hpGain = siphonGained(cured, s.hp, hpCap());
						text = hpGain > 0 ? `${cast.name} restores ${hpGain} HP.` : "Your HP is full.";
					}
				} else if (spell?.blue != null && "gaze" in spell.blue) {
					const facing = !playerIsBehind();
					blankNear = yardDistance <= 14 && liveHareHp > 0 && !hareIsCharmed() && facing;
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (yardDistance > 14) text = `The ${HARE.name} is outside Blank Gaze.`;
					else if (!facing) text = `The ${HARE.name} is not facing you.`;
					else if (rollFixed(1, chaoticMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt()), "light").state === 2) {
						fullResist = true;
						text = `The ${HARE.name} resists the spell.`;
					} else text = `Blank Gaze. The ${HARE.name} has no beneficial effect to remove.`;
				} else if (spell?.blue != null && "mystery" in spell.blue) {
					const burstUp = liveBuffs.some((buff) => buff.name === "Burst Affinity");
					if (burstUp) {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Burst Affinity");
						burstSpent = true;
					}
					mysteryNear = yardDistance <= 6 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!mysteryNear) text = `The ${HARE.name} is outside Mysterious Light.`;
					else {
						const raw = mysteriousLightRaw({
							level: 75,
							chr: s.sheet.chr,
							targetChr: HARE.chr,
							burstAffinity: burstUp
						});
						const macc = composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.chr - HARE.chr, s.sheet.gearMacc || 0);
						const burstTarget = chainFoe();
						const matched = burstUp ? magicBurstOf("wind", burstTarget) : null;
						const scaled = matched ? applyMagicBurst(raw, burstSteps(burstTarget), s.sheet.magicBurstBonus) : raw;
						const state = elementalResistState(macc - hareMeva("wind"), 100, Math.random);
						dmg = applyMab(resistedDamage(scaled, state), shroudMab(s.sheet.mab), hareTargetMdb());
						const fraction = state > 0 ? ` ${resistFractionLabel(state)} resist.` : "";
						const burstName = dmg > 0 ? matched : null;
						blueBurstName = burstName;
						text = `The ${HARE.name} takes ${dmg} points of damage.${fraction}`;
						if (burstName) text = `Mysterious Light magic bursts ${burstName}. ${text}`;
						else if (burstUp && dmg > 0) {
							const openName = burstChainName(burstTarget);
							text = openName ? `${text} It does not magic burst ${openName}. Wind matches Detonation, Fragmentation, Light, and Radiance.` : `${text} No skillchain is open, so it does not magic burst.`;
						}
						if (dmg > 0) {
							const rolled = rollFixed(60, macc, "wind");
							if (rolled.state !== 2) {
								liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Gravity");
								liveEnfeebles = [...liveEnfeebles, {
									name: "Gravity",
									left: rolled.left,
									power: 26,
									wide: true
								}];
								mysteryWeight = true;
								text = `${text} Weight. Movement is 74% of normal.${halfNote(rolled.state, rolled.left)}`;
							}
						}
					}
				} else if (spell?.blue != null && "venom" in spell.blue) {
					venomNear = yardDistance <= 6 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!venomNear) text = `The ${HARE.name} is outside Venom Shell.`;
					else {
						const status = rollFixed(45, composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.mnd - HARE.mnd, s.sheet.gearMacc || 0), "water");
						if (status.state === 2) {
							fullResist = true;
							text = `The ${HARE.name} resists the spell.`;
						} else {
							const extra = landWsPoison(spell.name, 6, status.left);
							const rest = extra.startsWith(`${spell.name}. `) ? extra.slice(spell.name.length + 2) : extra;
							if (!extra.includes("stronger poison")) bluePoison = true;
							text = `${spell.name}. ${rest}${bluePoison ? halfNote(status.state, status.left) : ""}`;
						}
					}
				} else if (spell?.blue != null && "mael" in spell.blue) {
					const burstUp = liveBuffs.some((buff) => buff.name === "Burst Affinity");
					if (burstUp) {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Burst Affinity");
						burstSpent = true;
					}
					maelNear = yardDistance <= 5 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!maelNear) text = `The ${HARE.name} is outside Maelstrom.`;
					else {
						const raw = maelRaw({
							level: 75,
							int: s.sheet.int,
							mnd: s.sheet.mnd,
							targetInt: hareInt(),
							burstAffinity: burstUp
						});
						const macc = composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0);
						const burstTarget = chainFoe();
						const matched = burstUp ? magicBurstOf("water", burstTarget) : null;
						const scaled = matched ? applyMagicBurst(raw, burstSteps(burstTarget), s.sheet.magicBurstBonus) : raw;
						const state = elementalResistState(macc - hareMeva("water"), 100, Math.random);
						dmg = applyMab(resistedDamage(scaled, state), shroudMab(s.sheet.mab), hareTargetMdb());
						const fraction = state > 0 ? ` ${resistFractionLabel(state)} resist.` : "";
						const burstName = dmg > 0 ? matched : null;
						blueBurstName = burstName;
						text = `The ${HARE.name} takes ${dmg} points of damage.${fraction}`;
						if (burstName) text = `Maelstrom magic bursts ${burstName}. ${text}`;
						else if (burstUp && dmg > 0) {
							const openName = burstChainName(burstTarget);
							text = openName ? `${text} It does not magic burst ${openName}. Water matches Reverberation, Distortion, Darkness, and Umbra.` : `${text} No skillchain is open, so it does not magic burst.`;
						}
						if (dmg > 0) {
							const current = liveEnfeebles.find((row) => row.name === "STR Down");
							if (current != null && (current.power ?? 0) > 20) text = `${text} A stronger STR Down is already on the ${HARE.name}.`;
							else {
								const rolled = rollFixed(60, macc, "water");
								if (rolled.state !== 2) {
									liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "STR Down");
									liveEnfeebles = [...liveEnfeebles, {
										name: "STR Down",
										left: rolled.left,
										power: 20,
										steady: true
									}];
									blueStr = true;
									text = `${text} STR falls by 20.${halfNote(rolled.state, rolled.left)}`;
								}
							}
						}
					}
				} else if (spell?.blue != null && "eyes" in spell.blue) {
					const burstUp = liveBuffs.some((buff) => buff.name === "Burst Affinity");
					if (burstUp) {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Burst Affinity");
						burstSpent = true;
					}
					const azure = liveBuffs.some((buff) => buff.name === "Azure Lore");
					eyesNear = yardDistance <= 13 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!eyesNear) text = `The ${HARE.name} is outside Eyes On Me.`;
					else {
						const raw = eyesRaw({
							level: 75,
							chr: s.sheet.chr,
							targetChr: HARE.chr,
							burstAffinity: burstUp,
							azureLore: azure
						});
						const macc = composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.chr - HARE.chr, s.sheet.gearMacc || 0);
						const burstTarget = chainFoe();
						const matched = burstUp ? magicBurstOf("dark", burstTarget) : null;
						const scaled = matched ? applyMagicBurst(raw, burstSteps(burstTarget), s.sheet.magicBurstBonus) : raw;
						const state = elementalResistState(macc - hareMeva("dark"), 100, Math.random);
						dmg = applyMab(resistedDamage(scaled, state), shroudMab(s.sheet.mab), hareTargetMdb());
						const fraction = state > 0 ? ` ${resistFractionLabel(state)} resist.` : "";
						const burstName = dmg > 0 ? matched : null;
						blueBurstName = burstName;
						text = `The ${HARE.name} takes ${dmg} points of damage.${fraction}`;
						if (burstName) text = `Eyes On Me magic bursts ${burstName}. ${text}`;
						else if (burstUp && dmg > 0) {
							const openName = burstChainName(burstTarget);
							text = openName ? `${text} It does not magic burst ${openName}. Dark matches Compression, Gravitation, Darkness, and Umbra.` : `${text} No skillchain is open, so it does not magic burst.`;
						}
					}
				} else if (spell?.blue != null && "needles" in spell.blue) {
					needlesNear = yardDistance <= 10 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!needlesNear) text = `The ${HARE.name} is outside 1000 Needles.`;
					else if (elementalResistState(composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), -50 + (s.sheet.gearMacc || 0)) - hareMeva("light"), 100, Math.random) !== 0) {
						fullResist = true;
						text = `The ${HARE.name} resists the spell.`;
					} else {
						dmg = needlesSplit(1);
						text = `The ${HARE.name} takes ${dmg} points of damage.`;
					}
				} else if (spell?.blue != null && "physical" in spell.blue) {
					const chainUp = liveBuffs.some((buff) => buff.name === "Chain Affinity");
					if (chainUp) {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Chain Affinity");
						blueSpent = true;
					}
					const area = spell.self === true;
					const radius = spell.radius ?? 0;
					const coneCard = blueSpellByName(spell.name);
					const cone = coneCard?.kind === "physical" && coneCard.cone === true;
					const coneRange = coneCard?.kind === "physical" ? coneCard.range ?? 0 : 0;
					danceNear = area && yardDistance <= radius && liveHareHp > 0 && !hareIsCharmed();
					const coneNear = cone && yardDistance <= coneRange && playerCone && liveHareHp > 0 && !hareIsCharmed();
					if (area && (liveHareHp <= 0 || hareIsCharmed() || !danceNear) || cone && !coneNear) {
						blueMiss = true;
						text = liveHareHp <= 0 ? "No effect." : hareIsCharmed() ? `The ${HARE.name} is your pet.` : `The ${HARE.name} is outside ${spell.name}.`;
					} else {
						const azure = liveBuffs.some((buff) => buff.name === "Azure Lore");
						const tpNow = useGame.getState().tp;
						const card = blueSpellByName(spell.name);
						const swings = card && card.kind === "physical" ? card.hits : 1;
						const vitDown = liveEnfeebles.reduce((n, row) => row.name === "VIT Down" ? n + (row.power ?? 0) : n, 0);
						const azureCrit = spell.name === "Power Attack" ? POWER_ATTACK_AZURE_CRIT : spell.name === "Screwdriver" ? SCREWDRIVER_AZURE_CRIT : spell.name === "Sickle Slash" ? SICKLE_AZURE_CRIT : 0;
						const forcedCrit = chainUp || azure && azureCrit > 0 && Math.random() < azureCrit;
						const hitRolls = Array.from({ length: swings }, () => Math.random() * 100);
						const pdifRolls = Array.from({ length: swings }, () => Math.random());
						const seedCut = spell.name === "Seedspray";
						const physicalDefense = (rows) => {
							const bare = hareLiveDefense(vitDown);
							return seedCut ? Math.max(1, bare * diaDefenseFactor(rows)) : bare;
						};
						const rolled = rollPhysicalBlue({
							name: spell.name,
							blueSkill: combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel),
							str: s.sheet.str,
							dex: s.sheet.dex,
							vit: s.sheet.vit,
							agi: s.sheet.agi,
							int: s.sheet.int,
							chr: s.sheet.chr,
							mnd: s.sheet.mnd,
							targetVit: Math.max(0, HARE.vit - vitDown),
							attack: spell.name === "Cannonball" ? Math.max(1, s.sheet.defense) : s.sheet.attack,
							attackMult: blueAttackMult(spell.name, tpNow, chainUp, azure),
							ftp: blueSpellFtp(spell.name, tpNow, chainUp, azure),
							defense: physicalDefense(liveEnfeebles),
							accuracy: s.sheet.accuracy + blueAccBonus(spell.name, tpNow, chainUp, azure),
							evasion: targetEvasion(HARE.evasion, liveEnfeebles, distractPower(liveEnfeebles)),
							dLevel: HARE.level - 75,
							chainAffinity: chainUp,
							crit: forcedCrit,
							targetName: HARE.name,
							hitRoll: 0,
							pdifRoll: 0,
							hitRolls,
							pdifRolls
						});
						dmg = rolled.dmg;
						text = rolled.text;
						blueMiss = !rolled.hit;
						blueHits = rolled.hits;
						blueChain = chainUp && rolled.hit;
						if (rolled.hit && rolled.crit && spell.name === "Sickle Slash") blueCrit = true;
						if (rolled.hit && spell.name === "Battle Dance") {
							const seconds = battleDanceSeconds(tpNow, chainUp, azure);
							liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "DEX Down");
							liveEnfeebles = [...liveEnfeebles, {
								name: "DEX Down",
								left: seconds,
								power: 9
							}];
							text = `${text} DEX falls by 9.`;
						}
						if (rolled.hit && spell.name === "Disseverment") {
							const extra = landWsPoison(spell.name, dissevermentPoison(75), 180);
							const rest = extra.startsWith(`${spell.name}. `) ? extra.slice(spell.name.length + 2) : extra;
							text = `${text} ${rest}`;
						}
						if (rolled.hit && spell.name === "Sprout Smack") {
							const current = liveEnfeebles.find((row) => row.name === "Slow" || row.name === "Slow II");
							if (current != null && (current.name === "Slow II" || (current.power ?? 0) > 150) || current != null && !enfeebleCanLand(current.name, "Slow")) text = `${text} A stronger slow is already on the ${HARE.name}.`;
							else {
								const seconds = plantEffectSeconds(tpNow, chainUp, azure);
								liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Slow");
								liveEnfeebles = [...liveEnfeebles, {
									name: "Slow",
									left: seconds,
									power: 150
								}];
								blueSlow = true;
								text = `${text} Slow. 150/1024.`;
							}
						}
						if (rolled.hit && spell.name === "Wild Oats") {
							const seconds = plantEffectSeconds(tpNow, chainUp, azure);
							liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "VIT Down");
							liveEnfeebles = [...liveEnfeebles, {
								name: "VIT Down",
								left: seconds,
								power: 9,
								decay: 6
							}];
							blueVit = true;
							text = `${text} VIT falls by 9.`;
						}
						if (rolled.hit && (spell.name === "Queasyshroom" || spell.name === "Feather Storm")) {
							const queasy = spell.name === "Queasyshroom";
							const seconds = queasy ? queasySeconds(tpNow, chainUp, azure) : plantEffectSeconds(tpNow, chainUp, azure);
							const dot = queasy ? 3 : 1;
							const status = rollFixed(seconds, composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0), null);
							if (status.state !== 2) {
								const extra = landWsPoison(spell.name, dot, status.left);
								const rest = extra.startsWith(`${spell.name}. `) ? extra.slice(spell.name.length + 2) : extra;
								if (!extra.includes("stronger poison")) bluePoison = true;
								text = `${text} ${rest}${bluePoison ? halfNote(status.state, status.left) : ""}`;
							}
						}
						if (rolled.hit && (spell.name === "Head Butt" || spell.name === "Helldive")) {
							blueKnock = true;
							const action = s.hareAction;
							if (action && action.kind === "spell" && !action.resolved) {
								text = `${text} ${stunInterruptLine(action)}`;
								stunCut = true;
							}
						}
						if (rolled.hit && spell.name === "Head Butt") {
							const status = rollFixed(headButtStunSeconds(Math.random()), composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0), "thunder");
							if (status.state !== 2) {
								liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Stun");
								liveEnfeebles = [...liveEnfeebles, {
									name: "Stun",
									left: status.left
								}];
								blueStun = true;
								text = `${text} Stun.${halfNote(status.state, status.left)}`;
								if (!stunCut && stunCancels(s.hareAction)) {
									text = `${text} ${stunInterruptLine(s.hareAction)}`;
									stunCut = true;
								}
							}
						}
						if (rolled.hit && spell.name === "Frypan") {
							const action = s.hareAction;
							if (action && action.kind === "spell" && !action.resolved) {
								text = `${text} ${stunInterruptLine(action)}`;
								stunCut = true;
							}
							const status = rollFixed(5, composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0), null);
							if (status.state !== 2) {
								liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Stun");
								liveEnfeebles = [...liveEnfeebles, {
									name: "Stun",
									left: status.left
								}];
								blueStun = true;
								text = `${text} Stun.${halfNote(status.state, status.left)}`;
								if (!stunCut && stunCancels(s.hareAction)) {
									text = `${text} ${stunInterruptLine(s.hareAction)}`;
									stunCut = true;
								}
							}
						}
						if (rolled.hit && spell.name === "Tail Slap") {
							const action = s.hareAction;
							if (action && action.kind === "spell" && !action.resolved) {
								text = `${text} ${stunInterruptLine(action)}`;
								stunCut = true;
							}
							const status = rollFixed(5, composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0), null);
							if (status.state !== 2) {
								liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Stun");
								liveEnfeebles = [...liveEnfeebles, {
									name: "Stun",
									left: status.left
								}];
								blueStun = true;
								text = `${text} Stun.${halfNote(status.state, status.left)}`;
								if (!stunCut && stunCancels(s.hareAction)) {
									text = `${text} ${stunInterruptLine(s.hareAction)}`;
									stunCut = true;
								}
							}
						}
						if (rolled.hit && spell.name === "Sub-zero Smash") {
							if (liveEnfeebles.find((row) => row.name === "Paralyze" || row.name === "Paralyze II")) text = `${text} A paralyze is already on the ${HARE.name}.`;
							else {
								const status = rollFixed(180, composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0), null);
								if (status.state !== 2) {
									liveEnfeebles = [...liveEnfeebles, {
										name: "Paralyze",
										left: status.left,
										power: 10
									}];
									bluePara = true;
									text = `${text} Paralyze. 10%.${halfNote(status.state, status.left)}`;
								}
							}
						}
						if (rolled.hit && spell.name === "Ram Charge") {
							blueKnock = true;
							text = `${text} Knockback.`;
							const action = s.hareAction;
							if (action && action.kind === "spell" && !action.resolved) {
								text = `${text} ${stunInterruptLine(action)}`;
								stunCut = true;
							}
						}
						if (rolled.hit && spell.name === "Terror Touch") {
							const status = rollFixed(60, composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0), null);
							if (status.state !== 2) {
								liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Attack Down");
								liveEnfeebles = [...liveEnfeebles, {
									name: "Attack Down",
									left: status.left,
									power: 38
								}];
								blueAtk = true;
								text = `${text} Attack falls by 38/256.${halfNote(status.state, status.left)}`;
							}
						}
						if (rolled.hit && spell.name === "Pinecone Bomb") {
							const action = s.hareAction;
							if (action && action.kind === "spell" && !action.resolved) {
								text = `${text} ${stunInterruptLine(action)}`;
								stunCut = true;
							}
							const status = rollFixed(pineconeSeconds(tpNow, chainUp, azure), composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0), null);
							if (status.state !== 2) {
								blueSleep = true;
								blueSleepLeft = status.left;
								text = `${text} Sleep.${halfNote(status.state, status.left)}`;
							}
						}
						if (rolled.hit && spell.name === "Spiral Spin") {
							const status = rollFixed(60, composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0), null);
							if (status.state !== 2) {
								const current = liveEnfeebles.find((row) => row.name === "Accuracy Down");
								if (current != null && (current.accDown ?? 0) > 15) text = `${text} A stronger accuracy down is already on the ${HARE.name}.`;
								else {
									liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Accuracy Down");
									liveEnfeebles = [...liveEnfeebles, {
										name: "Accuracy Down",
										left: status.left,
										accDown: 15
									}];
									sandAcc = true;
									text = `${text} Accuracy −15.${halfNote(status.state, status.left)}`;
								}
							}
						}
						if (rolled.hit && seedCut) {
							const status = rollFixed(120, composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0), null);
							if (status.state !== 2) {
								const existing = liveEnfeebles.find((row) => row.name === "Defense Down");
								const existingCut = existing == null ? 0 : existing.power != null && existing.power > 0 && existing.power < 1 ? existing.power : .25;
								if (existing && existingCut > .078125) text = `${text} A stronger Defense Down is already on the ${HARE.name}.`;
								else {
									liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Defense Down");
									liveEnfeebles = [...liveEnfeebles, {
										name: "Defense Down",
										left: status.left,
										power: SEED_DEF
									}];
									blueDef = true;
									text = `${text} Defense −20/256.${halfNote(status.state, status.left)}`;
								}
							}
						}
					}
				} else if (spell?.blue != null && "song" in spell.blue) {
					const soporific = spell.name === "Soporific";
					const near = yardDistance <= (soporific ? 6 : 6) && liveHareHp > 0 && !hareIsCharmed();
					if (soporific) soporificNear = near;
					else sheepNear = near;
					const blocked = liveEnfeebles.some((row) => isSleepSpell(row.name) || row.name === "Yawn" || (soporific ? row.name === "Lullaby" : row.name === "Soporific"));
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!near) text = `The ${HARE.name} is outside ${spell.name}.`;
					else if (blocked) text = "No effect.";
					else {
						const seconds = soporific ? 90 : sheepSongSeconds(Math.random());
						const stat = soporific ? s.sheet.int - hareInt() : s.sheet.mnd - HARE.mnd;
						const element = soporific ? "dark" : "light";
						const rolled = rollFixed(seconds, chaoticMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), stat), element);
						if (rolled.state === 2) {
							fullResist = true;
							text = `The ${HARE.name} resists the spell.`;
						} else {
							liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Sheep Song" && row.name !== "Soporific");
							liveEnfeebles = [...liveEnfeebles, {
								name: soporific ? "Soporific" : "Sheep Song",
								left: rolled.left,
								wide: true
							}];
							text = `${soporific ? "Soporific" : "Sheep Song"}.${halfNote(rolled.state, rolled.left)}`;
						}
					}
				} else if (spell?.blue != null && "breeze" in spell.blue) {
					divine = liveBuffs.some((buff) => buff.name === "Divine Seal");
					if (divine) liveBuffs = liveBuffs.filter((buff) => buff.name !== "Divine Seal");
					const healing = grimoireSkill("Healing Magic", combinedSkill("Healing Magic", s.mainJob, 75, s.subJob, s.subJob ? subjobLevel(75) : 0), 75, liveBuffs);
					const cured = cureFinal(healingBreezeBase(healingBreezePower(s.sheet.mnd, s.sheet.vit, healing)), divine);
					hpGain = siphonGained(cured, s.hp, hpCap());
					const splash = healTrust(cured, 10);
					if (splash.touched) partyTouched = true;
					text = `${hpGain > 0 ? `${cast.name} restores ${hpGain} HP.` : `${cast.name}. Your HP is full.`}${splash.note}`;
				} else if (spell?.blue != null && "memento" in spell.blue) {
					liveBuffs = liveBuffs.filter((buff) => buff.name !== "Magic Atk. Boost");
					liveBuffs = [...liveBuffs, {
						name: "Magic Atk. Boost",
						left: 60,
						power: 20
					}];
					text = `Memento Mori. Magic Attack Bonus +20 for 60 seconds.`;
				} else if (spell?.blue != null && "sand" in spell.blue) {
					const burstUp = liveBuffs.some((buff) => buff.name === "Burst Affinity");
					if (burstUp) {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Burst Affinity");
						burstSpent = true;
					}
					sandNear = yardDistance <= 6 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!sandNear) text = `The ${HARE.name} is outside Sandspin.`;
					else {
						const raw = sandspinRaw({
							level: 75,
							int: s.sheet.int,
							targetInt: hareInt(),
							burstAffinity: burstUp
						});
						const macc = composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0);
						const burstTarget = chainFoe();
						const matched = burstUp ? magicBurstOf("earth", burstTarget) : null;
						const scaled = matched ? applyMagicBurst(raw, burstSteps(burstTarget), s.sheet.magicBurstBonus) : raw;
						const state = elementalResistState(macc - hareMeva("earth"), 100, Math.random);
						dmg = applyMab(resistedDamage(scaled, state), shroudMab(s.sheet.mab), hareTargetMdb());
						const fraction = state > 0 ? ` ${resistFractionLabel(state)} resist.` : "";
						const burstName = dmg > 0 ? matched : null;
						blueBurstName = burstName;
						text = `The ${HARE.name} takes ${dmg} points of damage.${fraction}`;
						if (burstName) text = `Sandspin magic bursts ${burstName}. ${text}`;
						else if (burstUp && dmg > 0) {
							const openName = burstChainName(burstTarget);
							text = openName ? `${text} It does not magic burst ${openName}. Earth matches Scission, Gravitation, Darkness, and Umbra.` : `${text} No skillchain is open, so it does not magic burst.`;
						}
						if (dmg > 0) {
							const rolled = rollFixed(180, macc, "earth");
							if (rolled.state !== 2) {
								liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Accuracy Down");
								liveEnfeebles = [...liveEnfeebles, {
									name: "Accuracy Down",
									left: rolled.left,
									accDown: 25,
									wide: true
								}];
								sandAcc = true;
								text = `${text} Accuracy −25.${halfNote(rolled.state, rolled.left)}`;
							}
						}
					}
				} else if (spell?.blue != null && "pollen" in spell.blue) {
					divine = liveBuffs.some((buff) => buff.name === "Divine Seal");
					if (divine) liveBuffs = liveBuffs.filter((buff) => buff.name !== "Divine Seal");
					const healing = grimoireSkill("Healing Magic", combinedSkill("Healing Magic", s.mainJob, 75, s.subJob, s.subJob ? subjobLevel(75) : 0), 75, liveBuffs);
					hpGain = siphonGained(cureFinal(pollenBase(wildCarrotPower(s.sheet.mnd, s.sheet.vit, healing)), divine), s.hp, hpCap());
					text = hpGain > 0 ? `${cast.name} restores ${hpGain} HP.` : "Your HP is full.";
				} else if (spell?.blue != null && "magical" in spell.blue) {
					const burstUp = liveBuffs.some((buff) => buff.name === "Burst Affinity");
					if (burstUp) {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Burst Affinity");
						burstSpent = true;
					}
					const azure = liveBuffs.some((buff) => buff.name === "Azure Lore");
					mindNear = yardDistance <= 10 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!mindNear) text = `The ${HARE.name} is outside Mind Blast.`;
					else {
						const raw = mindBlastRaw({
							level: 75,
							mnd: s.sheet.mnd,
							targetMnd: HARE.mnd,
							burstAffinity: burstUp,
							azureLore: azure
						});
						const macc = composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.mnd - HARE.mnd, s.sheet.gearMacc || 0);
						const burstTarget = chainFoe();
						const matched = burstUp ? magicBurstOf("thunder", burstTarget) : null;
						const scaled = matched ? applyMagicBurst(raw, burstSteps(burstTarget), s.sheet.magicBurstBonus) : raw;
						const state = elementalResistState(macc - hareMeva("thunder"), 100, Math.random);
						dmg = applyMab(resistedDamage(scaled, state), shroudMab(s.sheet.mab), hareTargetMdb());
						const fraction = state > 0 ? ` ${resistFractionLabel(state)} resist.` : "";
						const burstName = dmg > 0 ? matched : null;
						blueBurstName = burstName;
						text = `The ${HARE.name} takes ${dmg} points of damage.${fraction}`;
						if (burstName) text = `Mind Blast magic bursts ${burstName}. ${text}`;
						else if (burstUp && dmg > 0) {
							const openName = burstChainName(burstTarget);
							text = openName ? `${text} It does not magic burst ${openName}. Lightning matches Impaction, Fragmentation, Light, and Radiance.` : `${text} No skillchain is open, so it does not magic burst.`;
						}
						if (dmg > 0) {
							const current = liveEnfeebles.find((row) => row.name === "Paralyze" || row.name === "Paralyze II");
							if (current && !enfeebleCanLand(current.name, "Paralyze")) text = `${text} A stronger paralyze is already on the ${HARE.name}.`;
							else {
								const rolled = rollFixed(90, macc, "thunder");
								if (rolled.state !== 2) {
									liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Paralyze");
									liveEnfeebles = [...liveEnfeebles, {
										name: "Paralyze",
										left: rolled.left,
										power: 20
									}];
									mindPara = true;
									text = `${text} Paralyze. 20% chance to cancel an auto-attack or TP move.${halfNote(rolled.state, rolled.left)}`;
								}
							}
						}
					}
				} else if (spell?.blue != null && ("orb" in spell.blue || "breath" in spell.blue)) {
					const card = blueSpellByName(spell.name);
					const noBurst = card?.kind === "breath" && card.noBurst === true;
					const radial = card?.kind === "breath" && card.radial === true;
					const burstUp = !noBurst && liveBuffs.some((buff) => buff.name === "Burst Affinity");
					if (burstUp) {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Burst Affinity");
						burstSpent = true;
					}
					const reach = card && (card.kind === "orb" || card.kind === "breath") ? card.range : 0;
					const breath = spell.blue != null && "breath" in spell.blue;
					const near = yardDistance <= reach && (breath && !radial ? playerCone : true) && liveHareHp > 0 && !hareIsCharmed();
					if (breath) breathNear = near;
					else orbNear = near;
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!near) text = `The ${HARE.name} is outside ${spell.name}.`;
					else if (card && (card.kind === "orb" || card.kind === "breath")) {
						const element = card.element;
						const blueSkill = combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel);
						const dStat = card.kind === "orb" ? s.sheet.int - hareInt() : 0;
						const raw = card.kind === "orb" ? blueOrbRaw({
							name: spell.name,
							level: 75,
							int: s.sheet.int,
							targetInt: hareInt(),
							burstAffinity: burstUp
						}) : spell.name === "Magnetite Cloud" ? magnetiteCloudRaw(s.hp, 75) : spell.name === "Hecatomb Wave" ? hecatombWaveRaw(s.hp, 75) : spell.name === "Radiant Breath" ? radiantBreathRaw(s.hp, 75) : spell.name === "Flying Hip Press" ? hipPressRaw(s.hp) : spell.name === "Bad Breath" ? badBreathRaw(s.hp, 75) : spell.name === "Frost Breath" ? frostBreathRaw(s.hp, 75) : spell.name === "Heat Breath" ? heatBreathRaw(s.hp) : poisonBreathRaw(s.hp, 75);
						const macc = composedMagicAccuracy(blueSkill, dStat, s.sheet.gearMacc || 0);
						const burstTarget = chainFoe();
						const matched = burstUp ? magicBurstOf(element, burstTarget) : null;
						const scaled = matched ? applyMagicBurst(raw, burstSteps(burstTarget), s.sheet.magicBurstBonus) : raw;
						const state = elementalResistState(macc - hareMeva(element), 100, Math.random);
						const cut = resistedDamage(scaled, state);
						dmg = card.kind === "breath" ? cut : applyMab(cut, shroudMab(s.sheet.mab), hareTargetMdb());
						const fraction = state > 0 ? ` ${resistFractionLabel(state)} resist.` : "";
						const burstName = dmg > 0 ? matched : null;
						blueBurstName = burstName;
						const matchedLine = element === "fire" ? "Fire matches Liquefaction, Fusion, Light, and Radiance." : element === "earth" ? "Earth matches Scission, Gravitation, Darkness, and Umbra." : element === "wind" ? "Wind matches Detonation, Fragmentation, Light, and Radiance." : element === "light" ? "Light matches Transfixion, Fusion, Light, and Radiance." : element === "ice" ? "Ice matches Induration, Distortion, Darkness, and Umbra." : "Water matches Reverberation, Distortion, Darkness, and Umbra.";
						text = `The ${HARE.name} takes ${dmg} points of damage.${fraction}`;
						if (burstName) text = `${spell.name} magic bursts ${burstName}. ${text}`;
						else if (burstUp && dmg > 0) {
							const openName = burstChainName(burstTarget);
							text = openName ? `${text} It does not magic burst ${openName}. ${matchedLine}` : `${text} No skillchain is open, so it does not magic burst.`;
						}
						if (dmg > 0 && card.kind === "orb" && card.bind != null) {
							const rolled = rollFixed(card.bind, macc, element);
							if (rolled.state !== 2) {
								blueBind = true;
								blueBindLeft = rolled.left;
								text = `${text} Bind.${halfNote(rolled.state, rolled.left)}`;
							}
						}
						if (dmg > 0 && card.kind === "breath" && card.poison != null && card.poisonSeconds != null) {
							const status = rollFixed(card.poisonSeconds, macc, element);
							if (status.state !== 2) {
								const extra = landWsPoison(spell.name, card.poison, status.left);
								const rest = extra.startsWith(`${spell.name}. `) ? extra.slice(spell.name.length + 2) : extra;
								if (!extra.includes("stronger poison")) bluePoison = true;
								text = `${text} ${rest}${bluePoison ? halfNote(status.state, status.left) : ""}`;
							}
						}
						if (dmg > 0 && card.kind === "breath" && card.weight != null && card.weightSeconds != null) {
							const rolled = rollFixed(card.weightSeconds, macc, element);
							if (rolled.state !== 2) {
								liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Gravity");
								liveEnfeebles = [...liveEnfeebles, {
									name: "Gravity",
									left: rolled.left,
									power: card.weight,
									wide: true
								}];
								cloudWeight = true;
								text = `${text} Weight. Movement is ${100 - card.weight}% of normal.${halfNote(rolled.state, rolled.left)}`;
							}
						}
						if (dmg > 0 && card.kind === "breath" && card.blind != null && card.blindSeconds != null) {
							const rolled = rollFixed(card.blindSeconds, macc, element);
							if (rolled.state !== 2) {
								const current = liveEnfeebles.find((row) => row.name === "Blind" || row.name === "Blind II");
								if (current != null && (current.name === "Blind II" || (current.accDown ?? 0) > card.blind || !enfeebleCanLand(current.name, "Blind"))) text = `${text} A stronger blind is already on the ${HARE.name}.`;
								else {
									liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Blind");
									liveEnfeebles = [...liveEnfeebles, {
										name: "Blind",
										left: rolled.left,
										accDown: card.blind,
										blindFrom: "breath"
									}];
									blueBlind = true;
									text = `${text} Blind. Accuracy −${card.blind}.${halfNote(rolled.state, rolled.left)}`;
								}
							}
						}
						if (dmg > 0 && card.kind === "breath" && card.slow != null && card.slowSeconds != null) {
							const rolled = rollFixed(card.slowSeconds, macc, element);
							if (rolled.state !== 2) {
								const current = liveEnfeebles.find((row) => row.name === "Slow" || row.name === "Slow II");
								if (current != null && (current.name === "Slow II" || (current.power ?? 0) > card.slow || !enfeebleCanLand(current.name, "Slow"))) text = `${text} A stronger slow is already on the ${HARE.name}.`;
								else {
									liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Slow");
									liveEnfeebles = [...liveEnfeebles, {
										name: "Slow",
										left: rolled.left,
										power: card.slow
									}];
									blueSlow = true;
									text = `${text} Slow. ${card.slow}/1024.${halfNote(rolled.state, rolled.left)}`;
								}
							}
						}
						if (dmg > 0 && card.kind === "breath" && card.silenceSeconds != null) {
							const rolled = rollFixed(card.silenceSeconds, macc, element);
							if (rolled.state !== 2) {
								const current = liveEnfeebles.find((row) => row.name === "Silence");
								if (current != null && current.silenceFrom !== "eye" && current.silenceFrom !== "breath") text = `${text} A stronger silence is already on the ${HARE.name}.`;
								else {
									liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Silence");
									liveEnfeebles = [...liveEnfeebles, {
										name: "Silence",
										left: rolled.left,
										silenceFrom: "breath"
									}];
									blueSilence = true;
									text = `${text} Silence.${halfNote(rolled.state, rolled.left)}`;
								}
							}
						}
						if (dmg > 0 && card.kind === "breath" && card.paralyze != null && card.paralyzeSeconds != null) {
							const current = liveEnfeebles.find((row) => row.name === "Paralyze" || row.name === "Paralyze II");
							if (current && !enfeebleCanLand(current.name, "Paralyze")) text = `${text} A stronger paralyze is already on the ${HARE.name}.`;
							else {
								const rolled = rollFixed(card.paralyzeSeconds, macc, element);
								if (rolled.state !== 2) {
									if (current != null && current.name === "Paralyze" && (current.power ?? 0) > card.paralyze) text = `${text} A stronger paralyze is already on the ${HARE.name}.`;
									else {
										liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Paralyze");
										liveEnfeebles = [...liveEnfeebles, {
											name: "Paralyze",
											left: rolled.left,
											power: card.paralyze
										}];
										mindPara = true;
										text = `${text} Paralyze. ${card.paralyze}% chance to cancel an auto-attack or TP move.${halfNote(rolled.state, rolled.left)}`;
									}
								}
							}
						}
						if (dmg > 0 && card.kind === "breath" && card.bindSeconds != null) {
							const rolled = rollFixed(card.bindSeconds, macc, element);
							if (rolled.state !== 2) {
								blueBind = true;
								blueBindLeft = rolled.left;
								text = `${text} Bind.${halfNote(rolled.state, rolled.left)}`;
							}
						}
					}
				} else if (spell?.blue != null && "sound" in spell.blue) {
					soundNear = yardDistance <= 6 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!soundNear) text = `The ${HARE.name} is outside Sound Blast.`;
					else {
						const rolled = rollFixed(30, composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0), "fire");
						if (rolled.state === 2) {
							fullResist = true;
							text = `The ${HARE.name} resists the spell.`;
						} else {
							liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "INT Down");
							liveEnfeebles = [...liveEnfeebles, {
								name: "INT Down",
								left: rolled.left,
								power: 9,
								wide: true
							}];
							blueInt = true;
							text = `Sound Blast. INT falls by 9.${halfNote(rolled.state, rolled.left)}`;
						}
					}
				} else if (spell?.blue != null && "ray" in spell.blue) {
					const burstUp = liveBuffs.some((buff) => buff.name === "Burst Affinity");
					if (burstUp) {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Burst Affinity");
						burstSpent = true;
					}
					const azure = liveBuffs.some((buff) => buff.name === "Azure Lore");
					rayNear = yardDistance <= 12 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!rayNear) text = `The ${HARE.name} is outside Death Ray.`;
					else {
						const raw = deathRayRaw({
							level: 75,
							int: s.sheet.int,
							mnd: s.sheet.mnd,
							targetInt: hareInt(),
							burstAffinity: burstUp,
							azureLore: azure
						});
						const macc = composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0);
						const burstTarget = chainFoe();
						const matched = burstUp ? magicBurstOf("dark", burstTarget) : null;
						const scaled = matched ? applyMagicBurst(raw, burstSteps(burstTarget), s.sheet.magicBurstBonus) : raw;
						const state = elementalResistState(macc - hareMeva("dark"), 100, Math.random);
						dmg = applyMab(resistedDamage(scaled, state), shroudMab(s.sheet.mab), hareTargetMdb());
						const fraction = state > 0 ? ` ${resistFractionLabel(state)} resist.` : "";
						const burstName = dmg > 0 ? matched : null;
						blueBurstName = burstName;
						text = `The ${HARE.name} takes ${dmg} points of damage.${fraction}`;
						if (burstName) text = `Death Ray magic bursts ${burstName}. ${text}`;
						else if (burstUp && dmg > 0) {
							const openName = burstChainName(burstTarget);
							text = openName ? `${text} It does not magic burst ${openName}. Dark matches Compression, Gravitation, Darkness, and Umbra.` : `${text} No skillchain is open, so it does not magic burst.`;
						}
					}
				} else if (spell?.blue != null && "digest" in spell.blue) {
					const burstUp = liveBuffs.some((buff) => buff.name === "Burst Affinity");
					if (burstUp) {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Burst Affinity");
						burstSpent = true;
					}
					digestNear = yardDistance <= 3 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!digestNear) text = `The ${HARE.name} is outside Digest.`;
					else if (HARE.undead) text = "No effect.";
					else {
						const blueSkill = combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel);
						const raw = digestRaw(blueSkill);
						const macc = composedMagicAccuracy(blueSkill, null, s.sheet.gearMacc || 0);
						const burstTarget = chainFoe();
						const matched = burstUp ? magicBurstOf("dark", burstTarget) : null;
						const scaled = matched ? applyMagicBurst(raw, burstSteps(burstTarget), s.sheet.magicBurstBonus) : raw;
						const state = elementalResistState(macc - hareMeva("dark"), 100, Math.random);
						dmg = applyMab(resistedDamage(scaled, state), shroudMab(s.sheet.mab), hareTargetMdb());
						hpGain = siphonGained(Math.min(dmg, Math.max(0, liveHareHp)), s.hp, hpCap());
						const fraction = state > 0 ? ` ${resistFractionLabel(state)} resist.` : "";
						const burstName = dmg > 0 ? matched : null;
						blueBurstName = burstName;
						text = `Digest hits the ${HARE.name} for ${dmg} points of damage.${fraction}`;
						if (burstName) text = `Digest magic bursts ${burstName}. ${text}`;
						else if (burstUp && dmg > 0) {
							const openName = burstChainName(burstTarget);
							text = openName ? `${text} It does not magic burst ${openName}. Dark matches Compression, Gravitation, Darkness, and Umbra.` : `${text} No skillchain is open, so it does not magic burst.`;
						}
						gainText = dmg > 0 ? hpGain > 0 ? `You recover ${hpGain} HP.` : "Your HP is full." : null;
					}
				} else if (spell?.blue != null && "kiss" in spell.blue) {
					const burstUp = liveBuffs.some((buff) => buff.name === "Burst Affinity");
					if (burstUp) {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Burst Affinity");
						burstSpent = true;
					}
					kissNear = yardDistance <= 3 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!kissNear) text = `The ${HARE.name} is outside MP Drainkiss.`;
					else if (HARE.undead) text = "No effect.";
					else if (HARE.mp <= 0) text = `The ${HARE.name} has no MP.`;
					else {
						const blueSkill = combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel);
						const raw = kissRaw(blueSkill);
						const macc = composedMagicAccuracy(blueSkill, null, s.sheet.gearMacc || 0);
						const burstTarget = chainFoe();
						const matched = burstUp ? magicBurstOf("dark", burstTarget) : null;
						const scaled = matched ? applyMagicBurst(raw, burstSteps(burstTarget), s.sheet.magicBurstBonus) : raw;
						const state = elementalResistState(macc - hareMeva("dark"), 100, Math.random);
						const drained = resistedDamage(scaled, state);
						stolen = Math.min(drained, Math.max(0, HARE.mp));
						mpGain = siphonGained(stolen, s.mp, s.sheet.mp);
						const fraction = state > 0 ? ` ${resistFractionLabel(state)} resist.` : "";
						const burstName = stolen > 0 ? matched : null;
						blueBurstName = burstName;
						text = `MP Drainkiss drains ${stolen} MP from the ${HARE.name}.${fraction}`;
						if (burstName) text = `MP Drainkiss magic bursts ${burstName}. ${text}`;
						else if (burstUp && stolen > 0) {
							const openName = burstChainName(burstTarget);
							text = openName ? `${text} It does not magic burst ${openName}. Dark matches Compression, Gravitation, Darkness, and Umbra.` : `${text} No skillchain is open, so it does not magic burst.`;
						}
						gainText = stolen > 0 ? mpGain > 0 ? `You recover ${mpGain} MP.` : "Your MP is full." : null;
					}
				} else if (spell?.blue != null && "blitz" in spell.blue) {
					const burstUp = liveBuffs.some((buff) => buff.name === "Burst Affinity");
					if (burstUp) {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Burst Affinity");
						burstSpent = true;
					}
					boltNear = yardDistance <= 12 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!boltNear) text = `The ${HARE.name} is outside Blitzstrahl.`;
					else {
						const raw = blitzRaw({
							level: 75,
							int: s.sheet.int,
							mnd: s.sheet.mnd,
							targetInt: hareInt(),
							burstAffinity: burstUp
						});
						const macc = composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0);
						const burstTarget = chainFoe();
						const matched = burstUp ? magicBurstOf("thunder", burstTarget) : null;
						const scaled = matched ? applyMagicBurst(raw, burstSteps(burstTarget), s.sheet.magicBurstBonus) : raw;
						const state = elementalResistState(macc - hareMeva("thunder"), 100, Math.random);
						dmg = applyMab(resistedDamage(scaled, state), shroudMab(s.sheet.mab), hareTargetMdb());
						const fraction = state > 0 ? ` ${resistFractionLabel(state)} resist.` : "";
						const burstName = dmg > 0 ? matched : null;
						blueBurstName = burstName;
						text = `The ${HARE.name} takes ${dmg} points of damage.${fraction}`;
						if (burstName) text = `Blitzstrahl magic bursts ${burstName}. ${text}`;
						else if (burstUp && dmg > 0) {
							const openName = burstChainName(burstTarget);
							text = openName ? `${text} It does not magic burst ${openName}. Lightning matches Impaction, Fragmentation, Light, and Radiance.` : `${text} No skillchain is open, so it does not magic burst.`;
						}
						if (dmg > 0) {
							const action = s.hareAction;
							if (action && action.kind === "spell" && !action.resolved) {
								text = `${text} ${stunInterruptLine(action)}`;
								stunCut = true;
							}
							const rolled = rollFixed(5, macc, "thunder");
							if (rolled.state !== 2) {
								liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Stun");
								liveEnfeebles = [...liveEnfeebles, {
									name: "Stun",
									left: rolled.left
								}];
								blueStun = true;
								text = `${text} Stun.${halfNote(rolled.state, rolled.left)}`;
								if (!stunCut && stunCancels(s.hareAction)) {
									text = `${text} ${stunInterruptLine(s.hareAction)}`;
									stunCut = true;
								}
							}
						}
					}
				} else if (spell?.blue != null && "gas" in spell.blue) {
					gasNear = yardDistance <= 6 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!gasNear) text = `The ${HARE.name} is outside Stinking Gas.`;
					else {
						const rolled = rollFixed(60, composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0), "wind");
						if (rolled.state === 2) {
							fullResist = true;
							text = `The ${HARE.name} resists the spell.`;
						} else {
							liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "VIT Down");
							liveEnfeebles = [...liveEnfeebles, {
								name: "VIT Down",
								left: rolled.left,
								power: 10,
								steady: true
							}];
							blueVit = true;
							text = `Stinking Gas. VIT falls by 10.${halfNote(rolled.state, rolled.left)}`;
						}
					}
				} else if (spell?.blue != null && "geist" in spell.blue) {
					geistNear = yardDistance <= 6 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!geistNear) text = `The ${HARE.name} is outside Geist Wall.`;
					else if (rollFixed(1, composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0), "dark").state === 2) {
						fullResist = true;
						text = `The ${HARE.name} resists the spell.`;
					} else text = `Geist Wall. The ${HARE.name} has no beneficial effect to remove.`;
				} else if (spell?.blue != null && "awful" in spell.blue) {
					const facing = !playerIsBehind();
					awfulNear = yardDistance <= 10 && playerCone && facing && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (yardDistance > 10 || !playerCone) text = `The ${HARE.name} is outside Awful Eye.`;
					else if (!facing) text = `The ${HARE.name} is not facing you.`;
					else {
						const rolled = rollFixed(30, composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.mnd - HARE.mnd, s.sheet.gearMacc || 0), "water");
						if (rolled.state === 2) {
							fullResist = true;
							text = `The ${HARE.name} resists the spell.`;
						} else {
							liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "STR Down");
							liveEnfeebles = [...liveEnfeebles, {
								name: "STR Down",
								left: rolled.left,
								power: 30,
								decay: 1,
								pace: 1
							}];
							blueStr = true;
							text = `Awful Eye. STR falls by 30.${halfNote(rolled.state, rolled.left)}`;
						}
					}
				} else if (spell?.blue != null && "saber" in spell.blue) {
					const burstUp = liveBuffs.some((buff) => buff.name === "Burst Affinity");
					if (burstUp) {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Burst Affinity");
						burstSpent = true;
					}
					saberNear = yardDistance <= 6 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!saberNear) text = `The ${HARE.name} is outside Blood Saber.`;
					else if (HARE.undead) text = "No effect.";
					else {
						const blueSkill = combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel);
						const raw = saberRaw(blueSkill);
						const macc = composedMagicAccuracy(blueSkill, null, s.sheet.gearMacc || 0);
						const burstTarget = chainFoe();
						const matched = burstUp ? magicBurstOf("dark", burstTarget) : null;
						const scaled = matched ? applyMagicBurst(raw, burstSteps(burstTarget), s.sheet.magicBurstBonus) : raw;
						const state = elementalResistState(macc - hareMeva("dark"), 100, Math.random);
						dmg = applyMab(resistedDamage(scaled, state), shroudMab(s.sheet.mab), hareTargetMdb());
						hpGain = siphonGained(Math.min(dmg, Math.max(0, liveHareHp)), s.hp, hpCap());
						const fraction = state > 0 ? ` ${resistFractionLabel(state)} resist.` : "";
						const burstName = dmg > 0 ? matched : null;
						blueBurstName = burstName;
						text = `Blood Saber hits the ${HARE.name} for ${dmg} points of damage.${fraction}`;
						if (burstName) text = `Blood Saber magic bursts ${burstName}. ${text}`;
						else if (burstUp && dmg > 0) {
							const openName = burstChainName(burstTarget);
							text = openName ? `${text} It does not magic burst ${openName}. Dark matches Compression, Gravitation, Darkness, and Umbra.` : `${text} No skillchain is open, so it does not magic burst.`;
						}
						gainText = dmg > 0 ? hpGain > 0 ? `You recover ${hpGain} HP.` : "Your HP is full." : null;
					}
				} else if (spell?.blue != null && "jetta" in spell.blue) {
					const facing = !playerIsBehind();
					jettaNear = yardDistance <= 9 && playerCone && facing && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (yardDistance > 9 || !playerCone) text = `The ${HARE.name} is outside Jettatura.`;
					else if (!facing) text = `The ${HARE.name} is not facing you.`;
					else {
						const rolled = rollFixed(2, composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0), "dark");
						if (rolled.state === 2) {
							fullResist = true;
							text = `The ${HARE.name} resists the spell.`;
						} else {
							liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Terror");
							liveEnfeebles = [...liveEnfeebles, {
								name: "Terror",
								left: rolled.left
							}];
							blueTerror = true;
							text = `Jettatura. Terror.${halfNote(rolled.state, rolled.left)}`;
							if (stunCancels(s.hareAction)) {
								text = `${text} ${stunInterruptLine(s.hareAction)}`;
								stunCut = true;
							}
						}
					}
				} else if (spell?.blue != null && "ice" in spell.blue) {
					const burstUp = liveBuffs.some((buff) => buff.name === "Burst Affinity");
					if (burstUp) {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Burst Affinity");
						burstSpent = true;
					}
					iceNear = yardDistance <= 6 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!iceNear) text = `The ${HARE.name} is outside Ice Break.`;
					else {
						const raw = iceBreakRaw({
							level: 75,
							int: s.sheet.int,
							targetInt: hareInt(),
							burstAffinity: burstUp
						});
						const macc = composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0);
						const burstTarget = chainFoe();
						const matched = burstUp ? magicBurstOf("ice", burstTarget) : null;
						const scaled = matched ? applyMagicBurst(raw, burstSteps(burstTarget), s.sheet.magicBurstBonus) : raw;
						const state = elementalResistState(macc - hareMeva("ice"), 100, Math.random);
						dmg = applyMab(resistedDamage(scaled, state), shroudMab(s.sheet.mab), hareTargetMdb());
						const fraction = state > 0 ? ` ${resistFractionLabel(state)} resist.` : "";
						const burstName = dmg > 0 ? matched : null;
						blueBurstName = burstName;
						text = `The ${HARE.name} takes ${dmg} points of damage.${fraction}`;
						if (burstName) text = `Ice Break magic bursts ${burstName}. ${text}`;
						else if (burstUp && dmg > 0) {
							const openName = burstChainName(burstTarget);
							text = openName ? `${text} It does not magic burst ${openName}. Ice matches Induration, Distortion, Darkness, and Umbra.` : `${text} No skillchain is open, so it does not magic burst.`;
						}
						if (dmg > 0) {
							const card = blueSpellByName(spell.name);
							const rolled = rollFixed(card && card.kind === "ice" ? card.bind : 0, macc, "ice");
							if (rolled.state !== 2) {
								blueBind = true;
								blueBindLeft = rolled.left;
								text = `${text} Bind.${halfNote(rolled.state, rolled.left)}`;
							}
						}
					}
				} else if (spell?.blue != null && "destruct" in spell.blue) {
					const burstUp = liveBuffs.some((buff) => buff.name === "Burst Affinity");
					if (burstUp) {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Burst Affinity");
						burstSpent = true;
					}
					const raw = selfDestructRaw(s.hp);
					if (raw > 0) {
						sacrificed = true;
						liveWeakness = {
							left: 300,
							double: false
						};
					}
					destructNear = yardDistance <= 6 && liveHareHp > 0 && !hareIsCharmed();
					const spent = "You are left with 1 HP. Weakness.";
					if (!sacrificed) text = "No effect.";
					else if (liveHareHp <= 0) text = `Self-Destruct leaves you with 1 HP. Weakness. No effect.`;
					else if (hareIsCharmed()) text = `Self-Destruct leaves you with 1 HP. Weakness. The ${HARE.name} is your pet.`;
					else if (!destructNear) text = `Self-Destruct leaves you with 1 HP. Weakness. The ${HARE.name} is outside Self-Destruct.`;
					else {
						const macc = composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0);
						const burstTarget = chainFoe();
						const matched = burstUp ? magicBurstOf("fire", burstTarget) : null;
						const scaled = matched ? applyMagicBurst(raw, burstSteps(burstTarget), s.sheet.magicBurstBonus) : raw;
						const state = elementalResistState(macc - hareMeva("fire"), 100, Math.random);
						dmg = resistedDamage(scaled, state);
						const fraction = state > 0 ? ` ${resistFractionLabel(state)} resist.` : "";
						const burstName = dmg > 0 ? matched : null;
						blueBurstName = burstName;
						text = `The ${HARE.name} takes ${dmg} points of damage.${fraction} ${spent}`;
						if (burstName) text = `Self-Destruct magic bursts ${burstName}. ${text}`;
						else if (burstUp && dmg > 0) {
							const openName = burstChainName(burstTarget);
							text = openName ? `${text} It does not magic burst ${openName}. Fire matches Liquefaction, Fusion, Light, and Radiance.` : `${text} No skillchain is open, so it does not magic burst.`;
						}
					}
				} else if (spell?.blue != null && "roar" in spell.blue) {
					roarNear = yardDistance <= 6 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!roarNear) text = `The ${HARE.name} is outside Frightful Roar.`;
					else {
						const rolled = rollFixed(180, composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0), "wind");
						if (rolled.state === 2) {
							fullResist = true;
							text = `The ${HARE.name} resists the spell.`;
						} else {
							const existing = liveEnfeebles.find((row) => row.name === "Defense Down");
							const existingCut = existing == null ? 0 : existing.power != null && existing.power > 0 && existing.power < 1 ? existing.power : .25;
							if (existing && existingCut > .1015625) text = `A stronger Defense Down is already on the ${HARE.name}.`;
							else {
								liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Defense Down");
								liveEnfeebles = [...liveEnfeebles, {
									name: "Defense Down",
									left: rolled.left,
									power: FRIGHTFUL_DEF
								}];
								blueDef = true;
								text = `Frightful Roar. Defense −26/256.${halfNote(rolled.state, rolled.left)}`;
							}
						}
					}
				} else if (spell?.blue != null && "cold" in spell.blue) {
					coldNear = yardDistance <= 6 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!coldNear) text = `The ${HARE.name} is outside Cold Wave.`;
					else if (liveEnfeebles.some((row) => row.name === "Burn")) text = `Burn is already on the ${HARE.name}.`;
					else {
						const rolled = rollFixed(60, composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0), "ice");
						const choked = liveEnfeebles.some((row) => row.name === "Choke");
						liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Choke");
						if (rolled.state === 2) {
							fullResist = true;
							text = `The ${HARE.name} resists the spell.`;
							if (choked) text = `${text} Choke wears off.`;
						} else {
							const frost = coldWaveFrost(75);
							liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Frost");
							liveEnfeebles = [...liveEnfeebles, {
								name: "Frost",
								left: rolled.left,
								power: frost.agi,
								dot: frost.dot,
								acc: 0
							}];
							blueFrost = true;
							text = `Cold Wave. Frost. AGI −${frost.agi}. ${frost.dot} HP every 3 seconds.${halfNote(rolled.state, rolled.left)}`;
							if (choked) text = `${text} Choke wears off.`;
						}
					}
				} else if (spell?.blue != null && "hold" in spell.blue) {
					holdNear = yardDistance <= 9 && playerCone && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!holdNear) text = `The ${HARE.name} is outside Filamented Hold.`;
					else {
						const rolled = rollFixed(90, composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0), "earth");
						if (rolled.state === 2) {
							fullResist = true;
							text = `The ${HARE.name} resists the spell.`;
						} else {
							const current = liveEnfeebles.find((row) => row.name === "Slow" || row.name === "Slow II");
							if (current != null && (current.name === "Slow II" || (current.power ?? 0) > 250 || !enfeebleCanLand(current.name, "Slow"))) text = `A stronger slow is already on the ${HARE.name}.`;
							else {
								liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Slow");
								liveEnfeebles = [...liveEnfeebles, {
									name: "Slow",
									left: rolled.left,
									power: 250
								}];
								blueSlow = true;
								text = `Filamented Hold. Slow. 250/1024.${halfNote(rolled.state, rolled.left)}`;
							}
						}
					}
				} else if (spell?.blue != null && "penance" in spell.blue) {
					const facing = !playerIsBehind();
					penanceNear = yardDistance <= 15 && liveHareHp > 0 && !hareIsCharmed() && facing;
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (yardDistance > 15) text = `The ${HARE.name} is outside Light of Penance.`;
					else if (!facing) text = `The ${HARE.name} is not facing you.`;
					else {
						const rolled = rollFixed(30, composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0), "light");
						if (rolled.state === 2) {
							fullResist = true;
							text = `The ${HARE.name} resists the spell.`;
						} else {
							const before = strikeKin ? liveKinTp : useGame.getState().hareTp;
							const next = Math.max(0, before - 100);
							if (strikeKin) liveKinTp = next;
							else set({ hareTp: next });
							text = `Light of Penance. TP −${before - next}.`;
							const current = liveEnfeebles.find((row) => row.name === "Blind" || row.name === "Blind II");
							if (current != null && (current.name === "Blind II" || (current.accDown ?? 0) > 100 || !enfeebleCanLand(current.name, "Blind"))) text = `${text} A stronger blind is already on the ${HARE.name}.`;
							else {
								liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Blind");
								liveEnfeebles = [...liveEnfeebles, {
									name: "Blind",
									left: rolled.left,
									accDown: 100
								}];
								blueBlind = true;
								text = `${text} Blind. Accuracy −100.${halfNote(rolled.state, rolled.left)}`;
							}
							blueBind = true;
							blueBindLeft = rolled.left;
							text = `${text} Bind.${halfNote(rolled.state, rolled.left)}`;
						}
					}
				} else if (spell?.blue != null && "tickle" in spell.blue) {
					tickleNear = yardDistance <= 11 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!tickleNear) text = `The ${HARE.name} is outside Feather Tickle.`;
					else {
						const rolled = rollFixed(1, chaoticMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt()), "wind");
						if (rolled.state === 2) {
							fullResist = true;
							text = `The ${HARE.name} resists the spell.`;
						} else {
							const before = strikeKin ? liveKinTp : useGame.getState().hareTp;
							if (before <= 0) text = "No effect.";
							else {
								const cut = FEATHER_TICKLE_TP * (rolled.state === 1 ? .5 : 1);
								const next = Math.max(0, before - cut);
								if (strikeKin) liveKinTp = next;
								else set({ hareTp: next });
								text = `Feather Tickle. TP −${before - next}.${rolled.state === 1 ? " 1/2 resist." : ""}`;
							}
						}
					}
				} else if (spell?.blue != null && "yawn" in spell.blue) {
					const facing = !playerIsBehind();
					yawnNear = yardDistance <= 10 && liveHareHp > 0 && !hareIsCharmed() && facing;
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (yardDistance > 10) text = `The ${HARE.name} is outside Yawn.`;
					else if (!facing) text = `The ${HARE.name} is not facing you.`;
					else if (liveEnfeebles.some((row) => isSleepSpell(row.name) || row.name === "Lullaby" || row.name === "Sheep Song" || row.name === "Soporific")) text = "No effect.";
					else {
						const rolled = rollFixed(90, chaoticMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.mnd - HARE.mnd), "light");
						if (rolled.state === 2) {
							fullResist = true;
							text = `The ${HARE.name} resists the spell.`;
						} else {
							liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Yawn");
							liveEnfeebles = [...liveEnfeebles, {
								name: "Yawn",
								left: rolled.left,
								wide: true
							}];
							text = `Yawn.${halfNote(rolled.state, rolled.left)}`;
							if (stunCancels(s.hareAction)) {
								text = `${text} ${stunInterruptLine(s.hareAction)}`;
								stunCut = true;
							}
						}
					}
				} else if (spell?.blue != null && "trunk" in spell.blue) {
					trunkNear = yardDistance <= 6 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!trunkNear) text = `The ${HARE.name} is outside Voracious Trunk.`;
					else if (rollFixed(1, chaoticMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt()), "wind").state === 2) {
						fullResist = true;
						text = `The ${HARE.name} resists the spell.`;
					} else text = `Voracious Trunk. The ${HARE.name} has no beneficial effect to steal.`;
				} else if (spell?.blue != null && "infra" in spell.blue) {
					infraNear = yardDistance <= 10 && playerCone && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!infraNear) text = `The ${HARE.name} is outside Infrasonics.`;
					else if (liveEnfeebles.some((row) => row.name === "Lunar Cry" || row.name === "Feint")) text = "No effect.";
					else {
						const rolled = rollFixed(60, chaoticMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt()), "ice");
						if (rolled.state === 2) {
							fullResist = true;
							text = `The ${HARE.name} resists the spell.`;
						} else {
							liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Evasion Down");
							liveEnfeebles = [...liveEnfeebles, {
								name: "Evasion Down",
								left: rolled.left,
								evaDown: 20
							}];
							blueEva = true;
							text = `Infrasonics. Evasion −20.${halfNote(rolled.state, rolled.left)}`;
						}
					}
				} else if (spell?.blue != null && "spray" in spell.blue) {
					sprayNear = yardDistance <= 6.5 && playerCone && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!sprayNear) text = `The ${HARE.name} is outside Sandspray.`;
					else if (!sandsprayCanReplace(liveEnfeebles.find((row) => row.name === "Blind" || row.name === "Blind II"))) text = `A stronger blind is already on the ${HARE.name}.`;
					else {
						const rolled = rollFixed(120, chaoticMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt()), "dark");
						if (rolled.state === 2) {
							fullResist = true;
							text = `The ${HARE.name} resists the spell.`;
						} else {
							liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Blind");
							liveEnfeebles = [...liveEnfeebles, {
								name: "Blind",
								left: rolled.left,
								accDown: 25,
								blindFrom: "spray"
							}];
							blueBlind = true;
							text = `Sandspray. Blind. Accuracy −25.${halfNote(rolled.state, rolled.left)}`;
						}
					}
				} else if (spell?.blue != null && "ooze" in spell.blue) {
					const burstUp = liveBuffs.some((buff) => buff.name === "Burst Affinity");
					if (burstUp) {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Burst Affinity");
						burstSpent = true;
					}
					const azure = liveBuffs.some((buff) => buff.name === "Azure Lore");
					oozeNear = yardDistance <= 11 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!oozeNear) text = `The ${HARE.name} is outside Corrosive Ooze.`;
					else {
						const raw = corrosiveOozeRaw({
							level: 75,
							int: s.sheet.int,
							targetInt: hareInt(),
							burstAffinity: burstUp,
							azureLore: azure
						});
						const macc = composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0);
						const burstTarget = chainFoe();
						const matched = burstUp ? magicBurstOf("water", burstTarget) : null;
						const scaled = matched ? applyMagicBurst(raw, burstSteps(burstTarget), s.sheet.magicBurstBonus) : raw;
						const state = elementalResistState(macc - hareMeva("water"), 100, Math.random);
						dmg = applyMab(resistedDamage(scaled, state), shroudMab(s.sheet.mab), hareTargetMdb());
						const fraction = state > 0 ? ` ${resistFractionLabel(state)} resist.` : "";
						const burstName = dmg > 0 ? matched : null;
						blueBurstName = burstName;
						text = `The ${HARE.name} takes ${dmg} points of damage.${fraction}`;
						if (burstName) text = `Corrosive Ooze magic bursts ${burstName}. ${text}`;
						else if (burstUp && dmg > 0) {
							const openName = burstChainName(burstTarget);
							text = openName ? `${text} It does not magic burst ${openName}. Water matches Reverberation, Distortion, Darkness, and Umbra.` : `${text} No skillchain is open, so it does not magic burst.`;
						}
						if (dmg > 0) {
							const rolled = rollFixed(90, macc, "water");
							if (rolled.state !== 2) {
								const defCut = 13 / 256;
								const existing = liveEnfeebles.find((row) => row.name === "Defense Down");
								const existingCut = existing == null ? 0 : existing.power != null && existing.power > 0 && existing.power < 1 ? existing.power : .25;
								const atk = liveEnfeebles.find((row) => row.name === "Attack Down");
								const atkNumer = atk == null ? 0 : atk.power ?? 38;
								if (!(existing && existingCut > defCut)) {
									liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Defense Down");
									liveEnfeebles = [...liveEnfeebles, {
										name: "Defense Down",
										left: rolled.left,
										power: defCut
									}];
									blueDef = true;
								}
								if (!(atk && atkNumer > 13)) {
									liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Attack Down");
									liveEnfeebles = [...liveEnfeebles, {
										name: "Attack Down",
										left: rolled.left,
										power: 13
									}];
									blueAtk = true;
								}
								text = `${text} ${[blueDef ? `Defense −13/256` : "A stronger Defense Down stays", blueAtk ? `Attack −13/256` : "a stronger Attack Down stays"].join(". ")}.${halfNote(rolled.state, rolled.left)}`;
							}
						}
					}
				} else if (spell?.blue != null && "hide" in spell.blue) {
					const power = diamondhidePower(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel));
					const skinNow = liveBuffs.find((buff) => buff.name === "Stoneskin");
					if (diamondhideCanLand(skinNow ? stoneskinSource(skinNow.skinFrom) : null)) {
						hideSkin = power;
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Stoneskin");
						liveBuffs = [...liveBuffs, {
							name: "Stoneskin",
							left: 900,
							skin: power,
							skinFrom: "hide"
						}];
					}
					const sheltered = [];
					for (const id of summonedTrustIds()) {
						const trust = liveTrusts[id];
						const place = trustPlaces[id];
						if (!trust || trust.ko || !place || place.party > 10) continue;
						const current = trust.buffs.find((buff) => buff.name === "Stoneskin");
						if (!diamondhideCanLand(current ? stoneskinSource(current.skinFrom) : null)) continue;
						trust.buffs = trust.buffs.filter((buff) => buff.name !== "Stoneskin");
						trust.buffs = [...trust.buffs, {
							name: "Stoneskin",
							left: 900,
							power,
							skinFrom: "hide"
						}];
						sheltered.push(trustName(id));
						partyTouched = true;
					}
					const who = sheltered.length === 0 ? "" : ` ${sheltered.join(", ")} ${sheltered.length === 1 ? "receives" : "receive"} it.`;
					text = hideSkin > 0 ? `Diamondhide. Stoneskin ${power} for 900 seconds.${who}` : sheltered.length > 0 ? `No effect.${who}` : "No effect.";
				} else if (spell?.blue != null && "enerv" in spell.blue) {
					enervNear = yardDistance <= 11.5 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!enervNear) text = `The ${HARE.name} is outside Enervation.`;
					else {
						const rolled = rollFixed(30, chaoticMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt()), "dark");
						if (rolled.state === 2) {
							fullResist = true;
							text = `The ${HARE.name} resists the spell.`;
						} else {
							const existing = liveEnfeebles.find((row) => row.name === "Defense Down");
							const existingCut = existing == null ? 0 : existing.power != null && existing.power > 0 && existing.power < 1 ? existing.power : .25;
							if (!(existing && existingCut > .1015625)) {
								liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Defense Down");
								liveEnfeebles = [...liveEnfeebles, {
									name: "Defense Down",
									left: rolled.left,
									power: ENERV_DEF
								}];
								blueDef = true;
							}
							liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Magic Defense Down");
							liveEnfeebles = [...liveEnfeebles, {
								name: "Magic Defense Down",
								left: rolled.left,
								power: 8
							}];
							blueMdb = true;
							text = `Enervation. ${blueDef ? `Defense −26/256` : "A stronger Defense Down stays"}. Magic Defense −8.${halfNote(rolled.state, rolled.left)}`;
						}
					}
				} else if (spell?.blue != null && "lowing" in spell.blue) {
					lowingNear = yardDistance <= 10 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!lowingNear) text = `The ${HARE.name} is outside Lowing.`;
					else {
						const rolled = rollFixed(60, composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0), "fire");
						if (rolled.state === 2) {
							fullResist = true;
							text = `The ${HARE.name} resists the spell.`;
						} else {
							liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Plague");
							liveEnfeebles = [...liveEnfeebles, {
								name: "Plague",
								left: rolled.left,
								acc: 0
							}];
							text = `Lowing. Plague. −50 TP every 3 seconds.${halfNote(rolled.state, rolled.left)} The ${HARE.name} has no MP, so the −3 MP is not drained.`;
						}
					}
				} else if (spell?.blue != null && "shift" in spell.blue) {
					shiftNear = yardDistance <= 10 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!shiftNear) text = `The ${HARE.name} is outside Temporal Shift.`;
					else {
						const rolled = rollFixed(5, composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0), "thunder");
						if (rolled.state === 2) {
							fullResist = true;
							text = `The ${HARE.name} resists the spell.`;
						} else {
							liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Stun");
							liveEnfeebles = [...liveEnfeebles, {
								name: "Stun",
								left: rolled.left
							}];
							blueStun = true;
							text = `Temporal Shift. Stun.${halfNote(rolled.state, rolled.left)}`;
							if (stunCancels(s.hareAction)) {
								text = `${text} ${stunInterruptLine(s.hareAction)}`;
								stunCut = true;
							}
						}
					}
				} else if (spell?.blue != null && "spit" in spell.blue) {
					const burstUp = liveBuffs.some((buff) => buff.name === "Burst Affinity");
					if (burstUp) {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Burst Affinity");
						burstSpent = true;
					}
					const azure = liveBuffs.some((buff) => buff.name === "Azure Lore");
					spitNear = yardDistance <= 20 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!spitNear) text = `The ${HARE.name} is outside Firespit.`;
					else {
						const raw = firespitRaw({
							level: 75,
							int: s.sheet.int,
							mnd: s.sheet.mnd,
							targetInt: hareInt(),
							burstAffinity: burstUp,
							azureLore: azure
						});
						const macc = composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0);
						const burstTarget = chainFoe();
						const matched = burstUp ? magicBurstOf("fire", burstTarget) : null;
						const scaled = matched ? applyMagicBurst(raw, burstSteps(burstTarget), s.sheet.magicBurstBonus) : raw;
						const state = elementalResistState(macc - hareMeva("fire"), 100, Math.random);
						dmg = applyMab(resistedDamage(scaled, state), shroudMab(s.sheet.mab), hareTargetMdb());
						const fraction = state > 0 ? ` ${resistFractionLabel(state)} resist.` : "";
						const burstName = dmg > 0 ? matched : null;
						blueBurstName = burstName;
						text = `The ${HARE.name} takes ${dmg} points of damage.${fraction}`;
						if (burstName) text = `Firespit magic bursts ${burstName}. ${text}`;
						else if (burstUp && dmg > 0) {
							const openName = burstChainName(burstTarget);
							text = openName ? `${text} It does not magic burst ${openName}. Fire matches Liquefaction, Fusion, Light, and Radiance.` : `${text} No skillchain is open, so it does not magic burst.`;
						}
					}
				} else if (spell?.blue != null && "gorge" in spell.blue) {
					const burstUp = liveBuffs.some((buff) => buff.name === "Burst Affinity");
					if (burstUp) {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Burst Affinity");
						burstSpent = true;
					}
					const azure = liveBuffs.some((buff) => buff.name === "Azure Lore");
					gorgeNear = yardDistance <= 21 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!gorgeNear) text = `The ${HARE.name} is outside Regurgitation.`;
					else {
						const raw = regurgitationRaw({
							level: 75,
							int: s.sheet.int,
							mnd: s.sheet.mnd,
							targetInt: hareInt(),
							burstAffinity: burstUp,
							azureLore: azure
						});
						const macc = composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.int - hareInt(), s.sheet.gearMacc || 0);
						const burstTarget = chainFoe();
						const matched = burstUp ? magicBurstOf("water", burstTarget) : null;
						const scaled = matched ? applyMagicBurst(raw, burstSteps(burstTarget), s.sheet.magicBurstBonus) : raw;
						const state = elementalResistState(macc - hareMeva("water"), 100, Math.random);
						dmg = applyMab(resistedDamage(scaled, state), shroudMab(s.sheet.mab), hareTargetMdb());
						if (dmg > 0 && playerIsBehind()) dmg = Math.floor(dmg * REGURG_BEHIND);
						const fraction = state > 0 ? ` ${resistFractionLabel(state)} resist.` : "";
						const burstName = dmg > 0 ? matched : null;
						blueBurstName = burstName;
						text = `The ${HARE.name} takes ${dmg} points of damage.${fraction}`;
						if (burstName) text = `Regurgitation magic bursts ${burstName}. ${text}`;
						else if (burstUp && dmg > 0) {
							const openName = burstChainName(burstTarget);
							text = openName ? `${text} It does not magic burst ${openName}. Water matches Reverberation, Distortion, Darkness, and Umbra.` : `${text} No skillchain is open, so it does not magic burst.`;
						}
						if (dmg > 0) {
							const rolled = rollFixed(30, macc, "water");
							if (rolled.state !== 2) {
								blueBind = true;
								blueBindLeft = rolled.left;
								text = `${text} Bind.${halfNote(rolled.state, rolled.left)}`;
							}
						}
					}
				} else if (spell?.blue != null && "hammer" in spell.blue) {
					const burstUp = liveBuffs.some((buff) => buff.name === "Burst Affinity");
					if (burstUp) {
						liveBuffs = liveBuffs.filter((buff) => buff.name !== "Burst Affinity");
						burstSpent = true;
					}
					const azure = liveBuffs.some((buff) => buff.name === "Azure Lore");
					hammerNear = yardDistance <= 12 && liveHareHp > 0 && !hareIsCharmed();
					if (liveHareHp <= 0) text = "No effect.";
					else if (hareIsCharmed()) text = `The ${HARE.name} is your pet.`;
					else if (!hammerNear) text = `The ${HARE.name} is outside Magic Hammer.`;
					else if (HARE.undead) text = "No effect.";
					else {
						const raw = magicHammerRaw({
							level: 75,
							mnd: s.sheet.mnd,
							targetMnd: HARE.mnd,
							burstAffinity: burstUp,
							azureLore: azure
						});
						const macc = composedMagicAccuracy(combinedSkill("Blue Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.mnd - HARE.mnd, s.sheet.gearMacc || 0);
						const burstTarget = chainFoe();
						const matched = burstUp ? magicBurstOf("light", burstTarget) : null;
						const scaled = matched ? applyMagicBurst(raw, burstSteps(burstTarget), s.sheet.magicBurstBonus) : raw;
						const state = elementalResistState(macc - hareMeva("light"), 100, Math.random);
						dmg = applyMab(resistedDamage(scaled, state), shroudMab(s.sheet.mab), hareTargetMdb());
						const fraction = state > 0 ? ` ${resistFractionLabel(state)} resist.` : "";
						const burstName = dmg > 0 ? matched : null;
						blueBurstName = burstName;
						text = `Magic Hammer hits the ${HARE.name} for ${dmg} points of damage.${fraction}`;
						if (burstName) text = `Magic Hammer magic bursts ${burstName}. ${text}`;
						else if (burstUp && dmg > 0) {
							const openName = burstChainName(burstTarget);
							text = openName ? `${text} It does not magic burst ${openName}. Light matches Transfixion, Fusion, Light, and Radiance.` : `${text} No skillchain is open, so it does not magic burst.`;
						}
						if (dmg > 0) {
							const room = Math.max(0, s.sheet.mp - s.mp);
							stolen = Math.min(dmg, Math.max(0, HARE.mp), room);
							mpGain = siphonGained(stolen, s.mp, s.sheet.mp);
							if (stolen > 0) gainText = mpGain > 0 ? `You recover ${mpGain} MP.` : "Your MP is full.";
							else if (HARE.mp <= 0) text = `${text} The ${HARE.name} has no MP.`;
							else text = `${text} Your MP is full.`;
						}
					}
				} else if (spell?.blue != null && "reactor" in spell.blue) {
					const woreDef = liveBuffs.find((buff) => buff.name === "Defense Boost");
					const woreSpike = liveBuffs.find((buff) => isSpike(buff.name));
					liveBuffs = liveBuffs.filter((buff) => buff.name !== "Defense Boost" && !isSpike(buff.name));
					liveBuffs = [
						...liveBuffs,
						{
							name: "Defense Boost",
							left: 120,
							power: 31
						},
						{
							name: "Ice Spikes",
							left: 120,
							spikeBase: 5
						}
					];
					const wore = [woreDef ? woreDef.power === 128 ? "Cocoon's Defense Boost wears off." : "Defense Boost wears off." : "", woreSpike ? `${woreSpike.name} wears off.` : ""].filter(Boolean).join(" ");
					text = wore ? `Reactor Cool. Defense +12% and Ice Spikes for 120 seconds. ${wore}` : `Reactor Cool. Defense +12% and Ice Spikes for 120 seconds.`;
				} else if (spell?.blue != null && "exuv" in spell.blue) {
					divine = liveBuffs.some((buff) => buff.name === "Divine Seal");
					if (divine) liveBuffs = liveBuffs.filter((buff) => buff.name !== "Divine Seal");
					const healing = grimoireSkill("Healing Magic", combinedSkill("Healing Magic", s.mainJob, 75, s.subJob, s.subJob ? subjobLevel(75) : 0), 75, liveBuffs);
					hpGain = siphonGained(cureFinal(exuviationBase(wildCarrotPower(s.sheet.mnd, s.sheet.vit, healing)), divine), s.hp, hpCap());
					const cleared = takeAilments(liveAilments, ERASE_NAMED, 1);
					liveAilments = cleared.kept;
					const removed = cleared.taken[0];
					if (removed) blueErased = true;
					const heal = hpGain > 0 ? `Exuviation restores ${hpGain} HP.` : "Your HP is full.";
					text = removed ? `${heal} Erase removes ${removed.name}.` : `${heal} Nothing to remove.`;
				}
				if (dmg > 0) creditStruck(dmg);
				if (spell) {
					if (spell.blue != null && "flash" in spell.blue) {
						if (actinicNear) creditHate(180, ACTINIC_VE, true);
					} else if (spell.blue != null && "silence" in spell.blue) {
						if (chaoticNear) creditHate(1, 320, true);
					} else if (spell.blue != null && "song" in spell.blue) {
						if (sheepNear || soporificNear) creditHate(320, 320, true);
					} else if (spell.blue != null && "breeze" in spell.blue) {
						if (hpGain > 0) {
							const cured = cureEnmity(75, hpGain);
							creditHate(cured.ce, cured.ve, false);
						}
					} else if (spell.blue != null && "spikes" in spell.blue) creditHate(1, 480, false);
					else if (spell.blue != null && "mantle" in spell.blue) creditHate(320, 320, false);
					else if (spell.blue != null && "cocoon" in spell.blue) creditHate(1, 80, false);
					else if (spell.blue != null && "feather" in spell.blue) creditHate(1, 300, false);
					else if (spell.blue != null && "warmup" in spell.blue) creditHate(1, 300, false);
					else if (spell.blue != null && "amp" in spell.blue) creditHate(320, 320, false);
					else if (spell.blue != null && "triumph" in spell.blue) creditHate(320, 320, false);
					else if (spell.blue != null && "saline" in spell.blue) creditHate(1, 480, false);
					else if (spell.blue != null && "metal" in spell.blue) creditHate(1, 300, false);
					else if (spell.blue != null && "refuel" in spell.blue) creditHate(1, 300, false);
					else if (spell.blue != null && "memento" in spell.blue) creditHate(320, 320, false);
					else if (spell.blue != null && "sand" in spell.blue) {
						if (sandNear) creditHate(0, 0, true);
					} else if (spell.blue != null && "pollen" in spell.blue) {
						if (hpGain > 0) {
							const cured = cureEnmity(75, hpGain);
							creditHate(cured.ce, cured.ve, false);
						}
					} else if (spell.blue != null && "magical" in spell.blue) {
						if (mindNear) creditHate(0, 0, true);
					} else if (spell.blue != null && ("orb" in spell.blue || "breath" in spell.blue)) {
						if (orbNear || breathNear) creditHate(0, 0, true);
					} else if (spell.blue != null && "sound" in spell.blue) {
						if (soundNear) creditHate(1, 320, true);
					} else if (spell.blue != null && "digest" in spell.blue) {
						if (digestNear) creditHate(320, 0, true);
					} else if (spell.blue != null && "kiss" in spell.blue) {
						if (kissNear) creditHate(320, 0, true);
					} else if (spell.blue != null && "blitz" in spell.blue) {
						if (boltNear) creditHate(0, 0, true);
					} else if (spell.blue != null && "gas" in spell.blue) {
						if (gasNear) creditHate(320, 320, true);
					} else if (spell.blue != null && "gaze" in spell.blue) {
						if (blankNear) creditHate(320, 320, true);
					} else if (spell.blue != null && "mystery" in spell.blue) {
						if (mysteryNear) creditHate(0, 0, true);
					} else if (spell.blue != null && "venom" in spell.blue) {
						if (venomNear) creditHate(1, 320, true);
					} else if (spell.blue != null && "geist" in spell.blue) {
						if (geistNear) creditHate(320, 320, true);
					} else if (spell.blue != null && "awful" in spell.blue) {
						if (awfulNear) creditHate(1, 180, true);
					} else if (spell.blue != null && "saber" in spell.blue) {
						if (saberNear) creditHate(320, 0, true);
					} else if (spell.blue != null && "jetta" in spell.blue) {
						if (jettaNear) creditHate(180, JETTA_VE, true);
					} else if (spell.blue != null && "ice" in spell.blue) {
						if (iceNear) creditHate(0, 0, true);
					} else if (spell.blue != null && "destruct" in spell.blue) {
						if (destructNear) creditHate(0, 0, true);
					} else if (spell.blue != null && "roar" in spell.blue) {
						if (roarNear) creditHate(1, 320, true);
					} else if (spell.blue != null && "cold" in spell.blue) {
						if (coldNear) creditHate(0, 0, true);
					} else if (spell.blue != null && "hold" in spell.blue) {
						if (holdNear) creditHate(1, 320, true);
					} else if (spell.blue != null && "penance" in spell.blue) {
						if (penanceNear) creditHate(1, 640, true);
					} else if (spell.blue != null && "mael" in spell.blue) {
						if (maelNear) creditHate(0, 0, true);
					} else if (spell.blue != null && "eyes" in spell.blue) {
						if (eyesNear) creditHate(0, 0, true);
					} else if (spell.blue != null && "needles" in spell.blue) {
						if (needlesNear) creditHate(0, 0, true);
					} else if (spell.blue != null && "tickle" in spell.blue) {
						if (tickleNear) creditHate(1, 320, true);
					} else if (spell.blue != null && "yawn" in spell.blue) {
						if (yawnNear) creditHate(320, 320, true);
					} else if (spell.blue != null && "trunk" in spell.blue) {
						if (trunkNear) creditHate(320, 640, true);
					} else if (spell.blue != null && "infra" in spell.blue) {
						if (infraNear) creditHate(1, 320, true);
					} else if (spell.blue != null && "spray" in spell.blue) {
						if (sprayNear) creditHate(1, 640, true);
					} else if (spell.blue != null && "ooze" in spell.blue) {
						if (oozeNear) creditHate(1, 0, true);
					} else if (spell.blue != null && "hide" in spell.blue) creditHate(1, 300, false);
					else if (spell.blue != null && "enerv" in spell.blue) {
						if (enervNear) creditHate(1, 320, true);
					} else if (spell.blue != null && "lowing" in spell.blue) {
						if (lowingNear) creditHate(1, 320, true);
					} else if (spell.blue != null && "shift" in spell.blue) {
						if (shiftNear) creditHate(180, SHIFT_VE, true);
					} else if (spell.blue != null && "hammer" in spell.blue) {
						if (hammerNear) creditHate(0, 0, true);
					} else if (spell.blue != null && "reactor" in spell.blue) creditHate(1, 480, false);
					else if (spell.blue != null && "exuv" in spell.blue) {
						creditHate(640, 640, false);
						if (hpGain > 0) {
							const cured = cureEnmity(75, hpGain);
							creditHate(cured.ce, cured.ve, false);
						}
					} else if (spell.blue != null && "gorge" in spell.blue) {
						if (gorgeNear) creditHate(1, 640, true);
					} else if (spell.blue != null && "physical" in spell.blue && spell.self === true) {
						if (danceNear) {
							const fixed = castEnmity(spell, cast.cureUndead === true);
							creditHate(fixed.ce, fixed.ve, fixed.claims);
						}
					} else if (raOutside) {
					} else {
						const fixed = castEnmity(spell, cast.cureUndead === true);
						creditHate(fixed.ce, fixed.ve, fixed.claims);
						if ((spell.cure != null || spell.curaga != null || spell.blue != null && "cure" in spell.blue) && cast.cureUndead !== true && (hpGain > 0 || allyHeal > 0)) {
							const cured = cureEnmity(75, hpGain > 0 ? hpGain : allyHeal);
							creditHate(cured.ce, cured.ve, false);
						}
						if (!fullResist && (spell.school === "elemental" || spell.school === "dark") && s.sheet.occultAcumen > 0) {
							const gain = occultTp(s.sheet.occultAcumen, spell.mp ?? 0, rolledStoreTp(s.sheet.storeTp || 1, liveBuffs));
							if (gain > 0) {
								const room = Math.max(0, 3e3 - useGame.getState().tp);
								const landed = Math.min(gain, room);
								set({
									tp: Math.min(3e3, useGame.getState().tp + gain),
									...landed > 0 ? { tpPulse: landed } : {}
								});
								if (landed > 0) useGame.getState().pushLog(`Occult Acumen +${landed}.`, "info");
							}
						}
					}
				}
				let woke = dmg > 0 && clearSleep();
				let unbound = bindWearsOff(dmg) && clearBind();
				if (dmg > 0 && chipStruck(dmg)) {
					woke = false;
					unbound = false;
				}
				if (blueBind && liveHareHp > 0) {
					liveEnfeebles = liveEnfeebles.filter((row) => row.name !== "Bind");
					liveEnfeebles = [...liveEnfeebles, {
						name: "Bind",
						left: blueBindLeft
					}];
					unbound = false;
				}
				if (blueSleep && liveHareHp > 0) {
					liveEnfeebles = liveEnfeebles.filter((row) => !isSleepSpell(row.name) && row.name !== "Lullaby" && row.name !== "Sheep Song" && row.name !== "Soporific" && row.name !== "Yawn" && row.name !== "Charmed");
					liveEnfeebles = [...liveEnfeebles, {
						name: "Sleep",
						left: blueSleepLeft
					}];
					woke = false;
				}
				const debuffLanded = spell?.debuff != null && text !== "No effect." && text != null;
				const enfeebleLanded = !fullResist && spell?.enfeeble != null && text != null && (text !== "No effect." || spell.enfeeble === "Dispel");
				const sealed = Boolean(spell) && liveBuffs.some((buff) => buff.name === "Elemental Seal");
				if (sealed) liveBuffs = liveBuffs.filter((buff) => buff.name !== "Elemental Seal");
				let mark = spell?.spike ? {
					text: spell.spike,
					spike: spell.spike
				} : spell?.debuff ? debuffLanded ? {
					text: `-${elementDebuffPotency(s.sheet.int).stat} ${DEBUFF_STAT_LABEL[DEBUFF_STAT[spell.debuff]]}`,
					debuff: spell.debuff
				} : {
					text: "",
					release: true
				} : spell?.enfeeble ? enfeebleLanded ? {
					text: spell.enfeeble === "Dispel" ? "No effect." : spell.enfeeble === "Blind" ? `-${blindPotency(s.sheet.int - hareInt())}` : spell.enfeeble === "Blind II" ? `-${blindTwoPotency(s.sheet.int - hareInt())}` : spell.enfeeble === "Slow" ? `${slowPotency(s.sheet.mnd - HARE.mnd)}/1024` : spell.enfeeble === "Slow II" ? `${slowTwoPotency(s.sheet.mnd - HARE.mnd)}/1024` : spell.enfeeble === "Paralyze" ? `${paralyzeChance(s.sheet.mnd - HARE.mnd)}%` : spell.enfeeble === "Paralyze II" ? `${paralyzeTwoChance(s.sheet.mnd - HARE.mnd)}%` : spell.enfeeble === "Gravity" ? `-26%` : spell.enfeeble === "Distract" || spell.enfeeble === "Frazzle" ? `-${evasionDownPotency(combinedSkill("Enfeebling Magic", s.sheet.job, 75, s.sheet.sub, s.sheet.subLevel), s.sheet.mnd - HARE.mnd)}` : isBioSpell(spell.enfeeble) ? String(dmg) : spell.enfeeble === "Stun" ? "Stun" : isDiaSpell(spell.enfeeble) ? dmg > 0 ? String(dmg) : `-${diaDefenseNumer(spell.enfeeble)}/1024` : isPoisonSpell(spell.enfeeble) ? `-${liveEnfeebles.find((row) => row.name === spell.enfeeble)?.dot ?? 0}/tick` : spell.enfeeble,
					enfeeble: spell.enfeeble,
					wide: isSleepSpell(spell.enfeeble) ? sleepIsWide(spell.enfeeble) : spell.radius != null
				} : {
					text: "",
					release: true
				} : spell?.siphon ? {
					text: String(stolen),
					siphon: spell.siphon,
					gain: spell.siphon === "Drain" ? hpGain : mpGain
				} : spell?.warp ? {
					text: "",
					warp: spell.warp
				} : spell?.cure ? cast.allyId && !cast.cureUndead ? {
					text: "",
					release: true
				} : {
					text: cast.cureUndead ? dmg > 0 ? String(dmg) : "" : hpGain > 0 ? `+${hpGain}` : "Full",
					cure: spell.cure,
					undead: cast.cureUndead === true,
					gain: cast.cureUndead ? void 0 : hpGain,
					...solaceCoat > 0 ? { solace: solaceCoat } : {},
					...divine && !cast.cureUndead ? { divineSeal: true } : {}
				} : spell?.curaga ? {
					text: text?.includes("outside") ? "" : hpGain > 0 ? `+${hpGain}` : "Full",
					curaga: spell.curaga,
					gain: text?.includes("outside") ? void 0 : hpGain,
					atTarget: curagaAt,
					...divine && !text?.includes("outside") ? { divineSeal: true } : {}
				} : spell?.cura ? {
					text: "Cura",
					cura: true
				} : spell?.stoneskin ? {
					text: skinPower > 0 ? String(skinPower) : "",
					stoneskin: true,
					gain: text === "No effect." ? void 0 : skinPower
				} : spell?.barrier ? {
					text: barrierLanded || partyWard ? spell.barrier.kind === "protect" ? `+${PROTECT_DEF[spell.barrier.tier]}` : `${SHELL_CUT[spell.barrier.tier]}/256` : text?.includes("out of range") ? "Out of range." : "No effect.",
					barrier: {
						kind: spell.barrier.kind,
						tier: spell.barrier.tier,
						area: barrierArea,
						landed: barrierLanded,
						party: partyWard
					}
				} : spell?.regen ? {
					text: text === "No effect." ? "No effect." : `+${REGEN_HP[spell.regen.tier]}`,
					regen: {
						tier: spell.regen.tier,
						landed: regenLanded
					}
				} : spell?.haste ? {
					text: `150/1024`,
					haste: true
				} : spell?.refresh ? {
					text: `+3`,
					refresh: true
				} : spell?.storm ? {
					text: spell.storm.sky,
					storm: spell.storm.element
				} : spell?.klimaform ? {
					text: `+${KLIMAFORM_MACC}`,
					klimaform: true
				} : spell?.aquaveil ? {
					text: String(veilCharges),
					aquaveil: true
				} : spell?.blink ? {
					text: String(2),
					blink: true
				} : spell?.phalanx ? {
					text: phalanxLanded ? `-${phalanxCut}` : "No effect.",
					phalanx: true
				} : spell?.reprisal ? {
					text: reprisalLanded ? `33%` : "No effect.",
					reprisal: true
				} : spell?.enspell ? {
					text: text === "No effect." ? "No effect." : spell.name,
					enspell: {
						element: spell.enspell.element,
						landed: text !== "No effect."
					}
				} : spell?.auspice ? {
					text: text === "No effect." ? "No effect." : `+10`,
					auspice: true,
					party: partyWard
				} : spell?.bar && barLanded ? {
					text: `+${barLanded.power}`,
					bar: barLanded
				} : spell?.na || spell?.esuna || spell?.sacrifice ? {
					text: text ?? "",
					cleanse: spell.na ?? (spell.esuna ? "Esuna" : "Sacrifice")
				} : spell?.erase ? {
					text: text ?? "",
					erase: true
				} : spell?.raise ? raised ? {
					text: hpGain > 0 ? `+${hpGain}` : "0",
					raise: spell.raise,
					gain: hpGain
				} : {
					text: "",
					release: true
				} : spell?.reraise ? {
					text: spell.reraise,
					reraise: spell.reraise
				} : spell?.banish ? {
					text: String(dmg),
					divine: spell.banish,
					wide: spell.radius != null
				} : spell?.holy ? {
					text: String(dmg),
					divine: "Holy"
				} : spell?.flash ? fullResist ? {
					text: "Resist",
					release: true,
					divine: "Flash"
				} : {
					text: `-300`,
					divine: "Flash"
				} : spell?.repose ? text === "No effect." || fullResist ? {
					text: fullResist ? "Resist" : "",
					release: true,
					divine: "Repose"
				} : {
					text: "Repose",
					divine: "Repose"
				} : spell?.blue != null && "silence" in spell.blue ? {
					text: fullResist ? "Resist" : text?.includes("outside") ? "Out of range." : text?.includes("not facing") || text === "No effect." || text?.includes("your pet") ? "No effect." : "Silence",
					blue: spell.name
				} : spell?.blue != null && "flash" in spell.blue ? {
					text: fullResist ? "Resist" : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : `-300`,
					blue: spell.name,
					wide: true
				} : spell?.blue != null && "spikes" in spell.blue ? {
					text: "Plasma Charge",
					blue: spell.name
				} : spell?.blue != null && "mantle" in spell.blue ? {
					text: text === "No effect." ? "No effect." : String(4),
					blue: spell.name
				} : spell?.blue != null && "cocoon" in spell.blue ? {
					text: "+50%",
					blue: spell.name
				} : spell?.blue != null && "metal" in spell.blue ? {
					text: text === "No effect." ? "No effect." : String(metalSkin),
					blue: spell.name
				} : spell?.blue != null && "refuel" in spell.blue ? {
					text: text === "No effect." ? "No effect." : `102/1024`,
					blue: spell.name
				} : spell?.blue != null && "memento" in spell.blue ? {
					text: `+20`,
					blue: spell.name
				} : spell?.blue != null && "sand" in spell.blue ? {
					text: dmg > 0 ? String(dmg) : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : "Resist",
					blue: spell.name,
					wide: true,
					...sandAcc ? { blueAcc: true } : {},
					...blueBurstName ? { blueBurst: blueBurstName } : {}
				} : spell?.blue != null && "pollen" in spell.blue ? {
					text: hpGain > 0 ? `+${hpGain}` : "Full",
					blue: spell.name,
					...divine ? { divineSeal: true } : {}
				} : spell?.blue != null && "magical" in spell.blue ? {
					text: dmg > 0 ? String(dmg) : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : "Resist",
					blue: spell.name,
					...mindPara ? { bluePara: true } : {},
					...blueBurstName ? { blueBurst: blueBurstName } : {}
				} : spell?.blue != null && "song" in spell.blue ? {
					text: fullResist ? "Resist" : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : spell.name,
					blue: spell.name,
					wide: true
				} : spell?.blue != null && "breeze" in spell.blue ? {
					text: hpGain > 0 ? `+${hpGain}` : "Full",
					blue: spell.name,
					...divine ? { divineSeal: true } : {}
				} : spell?.blue != null && "cure" in spell.blue ? {
					text: hpGain > 0 ? `+${hpGain}` : allyHeal > 0 ? `+${allyHeal}` : text?.includes("out of range") ? "Out of range." : text?.includes("no one") ? "No effect." : "Full",
					blue: spell.name,
					...typeof cast.allyId === "string" ? { blueAlly: cast.allyId } : {}
				} : spell?.blue != null && ("orb" in spell.blue || "breath" in spell.blue) ? {
					text: dmg > 0 ? String(dmg) : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : "Resist",
					blue: spell.name,
					...bluePoison ? { bluePoison: true } : {},
					...blueBind ? { blueBind: true } : {},
					...cloudWeight ? { blueWeight: true } : {},
					...blueBlind ? { blueBlind: true } : {},
					...blueSlow ? { blueSlow: true } : {},
					...blueSilence ? { blueSilence: true } : {},
					...mindPara ? { bluePara: true } : {},
					...blueBurstName ? { blueBurst: blueBurstName } : {}
				} : spell?.blue != null && "sound" in spell.blue ? {
					text: fullResist ? "Resist" : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : `INT−9`,
					blue: spell.name,
					wide: true,
					...blueInt ? { blueInt: true } : {}
				} : spell?.blue != null && "ray" in spell.blue ? {
					text: dmg > 0 ? String(dmg) : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : "Resist",
					blue: spell.name,
					...blueBurstName ? { blueBurst: blueBurstName } : {}
				} : spell?.blue != null && "digest" in spell.blue ? {
					text: dmg > 0 ? String(dmg) : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : "Resist",
					blue: spell.name,
					...hpGain > 0 ? { gain: hpGain } : {},
					...blueBurstName ? { blueBurst: blueBurstName } : {}
				} : spell?.blue != null && "kiss" in spell.blue ? {
					text: stolen > 0 ? String(stolen) : text?.includes("outside") ? "Out of range." : text?.includes("no MP") ? "No MP" : text === "No effect." || text?.includes("your pet") ? "No effect." : "Resist",
					blue: spell.name,
					...mpGain > 0 ? { gain: mpGain } : {},
					...blueBurstName ? { blueBurst: blueBurstName } : {}
				} : spell?.blue != null && "blitz" in spell.blue ? {
					text: dmg > 0 ? String(dmg) : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : "Resist",
					blue: spell.name,
					...blueStun ? { blueStun: true } : {},
					...blueBurstName ? { blueBurst: blueBurstName } : {}
				} : spell?.blue != null && "gas" in spell.blue ? {
					text: fullResist ? "Resist" : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : `VIT−10`,
					blue: spell.name,
					wide: true,
					...blueVit ? { blueVit: true } : {}
				} : spell?.blue != null && "gaze" in spell.blue ? {
					text: fullResist ? "Resist" : text?.includes("outside") ? "Out of range." : "No effect.",
					blue: spell.name
				} : spell?.blue != null && "mystery" in spell.blue ? {
					text: dmg > 0 ? String(dmg) : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : "Resist",
					blue: spell.name,
					wide: true,
					...mysteryWeight ? { blueWeight: true } : {},
					...blueBurstName ? { blueBurst: blueBurstName } : {}
				} : spell?.blue != null && "venom" in spell.blue ? {
					text: fullResist ? "Resist" : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : bluePoison ? `-6/tick` : "No effect.",
					blue: spell.name,
					wide: true,
					...bluePoison ? { bluePoison: true } : {}
				} : spell?.blue != null && "geist" in spell.blue ? {
					text: fullResist ? "Resist" : text?.includes("outside") ? "Out of range." : "No effect.",
					blue: spell.name,
					wide: true
				} : spell?.blue != null && "awful" in spell.blue ? {
					text: fullResist ? "Resist" : text?.includes("outside") ? "Out of range." : text?.includes("not facing") || text === "No effect." || text?.includes("your pet") ? "No effect." : `STR−30`,
					blue: spell.name,
					...blueStr ? { blueStr: true } : {}
				} : spell?.blue != null && "saber" in spell.blue ? {
					text: dmg > 0 ? String(dmg) : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : "Resist",
					blue: spell.name,
					wide: true,
					...hpGain > 0 ? { gain: hpGain } : {},
					...blueBurstName ? { blueBurst: blueBurstName } : {}
				} : spell?.blue != null && "jetta" in spell.blue ? {
					text: fullResist ? "Resist" : text?.includes("outside") ? "Out of range." : text?.includes("not facing") || text === "No effect." || text?.includes("your pet") ? "No effect." : "Terror",
					blue: spell.name,
					...blueTerror ? { blueTerror: true } : {}
				} : spell?.blue != null && "ice" in spell.blue ? {
					text: dmg > 0 ? String(dmg) : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : "Resist",
					blue: spell.name,
					wide: true,
					...blueBind ? { blueBind: true } : {},
					...blueBurstName ? { blueBurst: blueBurstName } : {}
				} : spell?.blue != null && "destruct" in spell.blue ? {
					text: dmg > 0 ? String(dmg) : text?.includes("outside") ? "Out of range." : sacrificed ? text?.includes("resist") ? "Resist" : "1 HP" : "No effect.",
					blue: spell.name,
					wide: true,
					...blueBurstName ? { blueBurst: blueBurstName } : {}
				} : spell?.blue != null && "roar" in spell.blue ? {
					text: fullResist ? "Resist" : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : blueDef ? "DEF−26/256" : "No effect.",
					blue: spell.name,
					wide: true,
					...blueDef ? { blueDef: true } : {}
				} : spell?.blue != null && "cold" in spell.blue ? {
					text: fullResist ? "Resist" : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") || text?.includes("Burn") ? "No effect." : blueFrost ? `AGI−${coldWaveFrost(75).agi}` : "No effect.",
					blue: spell.name,
					wide: true,
					...blueFrost ? { blueFrost: true } : {}
				} : spell?.blue != null && "hold" in spell.blue ? {
					text: fullResist ? "Resist" : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") || text?.includes("stronger") ? "No effect." : blueSlow ? `250/1024` : "No effect.",
					blue: spell.name,
					...blueSlow ? { blueSlow: true } : {}
				} : spell?.blue != null && "feather" in spell.blue ? {
					text: `+25`,
					blue: spell.name
				} : spell?.blue != null && "warmup" in spell.blue ? {
					text: text?.includes("stronger") ? `ACC+10` : `ACC+10 EVA+10`,
					blue: spell.name
				} : spell?.blue != null && "amp" in spell.blue ? {
					text: text?.includes("Magic Atk. Boost stays") && text?.includes("Magic Def. Boost stays") ? "No change" : text?.includes("Magic Atk. Boost stays") ? `MDB+10` : text?.includes("Magic Def. Boost stays") ? `MAB+10` : `MAB+10 MDB+10`,
					blue: spell.name
				} : spell?.blue != null && "triumph" in spell.blue ? {
					text: `ATK+38/256`,
					blue: spell.name
				} : spell?.blue != null && "saline" in spell.blue ? {
					text: `MDB+50`,
					blue: spell.name
				} : spell?.blue != null && "penance" in spell.blue ? {
					text: fullResist ? "Resist" : text?.includes("outside") ? "Out of range." : text?.includes("not facing") || text === "No effect." || text?.includes("your pet") ? "No effect." : `TP−100`,
					blue: spell.name,
					...blueBlind ? { blueBlind: true } : {},
					...blueBind ? { blueBind: true } : {}
				} : spell?.blue != null && "mael" in spell.blue ? {
					text: dmg > 0 ? String(dmg) : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : "Resist",
					blue: spell.name,
					wide: true,
					...blueStr ? { blueStr: true } : {},
					...blueBurstName ? { blueBurst: blueBurstName } : {}
				} : spell?.blue != null && "eyes" in spell.blue ? {
					text: dmg > 0 ? String(dmg) : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : "Resist",
					blue: spell.name,
					...blueBurstName ? { blueBurst: blueBurstName } : {}
				} : spell?.blue != null && "needles" in spell.blue ? {
					text: dmg > 0 ? String(dmg) : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : "Resist",
					blue: spell.name,
					wide: true
				} : spell?.blue != null && "tickle" in spell.blue ? {
					text: fullResist ? "Resist" : text?.includes("outside") ? "Out of range." : text?.includes("TP −") ? `TP−${text.match(/TP −(\d+)/)?.[1] ?? "0"}` : "No effect.",
					blue: spell.name
				} : spell?.blue != null && "yawn" in spell.blue ? {
					text: fullResist ? "Resist" : text?.includes("outside") ? "Out of range." : text?.includes("not facing") || text === "No effect." || text?.includes("your pet") ? "No effect." : "Yawn",
					blue: spell.name,
					wide: true
				} : spell?.blue != null && "trunk" in spell.blue ? {
					text: fullResist ? "Resist" : text?.includes("outside") ? "Out of range." : "No effect.",
					blue: spell.name
				} : spell?.blue != null && "infra" in spell.blue ? {
					text: fullResist ? "Resist" : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : `EVA−20`,
					blue: spell.name,
					wide: true,
					...blueEva ? { blueEva: true } : {}
				} : spell?.blue != null && "spray" in spell.blue ? {
					text: fullResist ? "Resist" : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") || text?.includes("stronger") ? "No effect." : blueBlind ? `ACC−25` : "No effect.",
					blue: spell.name,
					...blueBlind ? { blueBlind: true } : {}
				} : spell?.blue != null && "ooze" in spell.blue ? {
					text: dmg > 0 ? String(dmg) : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : "Resist",
					blue: spell.name,
					...blueAtk ? { blueAtk: true } : {},
					...blueDef ? { blueDef: true } : {},
					...blueBurstName ? { blueBurst: blueBurstName } : {}
				} : spell?.blue != null && "hide" in spell.blue ? {
					text: hideSkin > 0 ? String(hideSkin) : "No effect.",
					blue: spell.name
				} : spell?.blue != null && "enerv" in spell.blue ? {
					text: fullResist ? "Resist" : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : blueDef ? "DEF−26/256" : blueMdb ? `MDB−8` : "No effect.",
					blue: spell.name,
					wide: true,
					...blueDef ? { blueDef: true } : {},
					...blueMdb ? { blueMdb: true } : {}
				} : spell?.blue != null && "lowing" in spell.blue ? {
					text: fullResist ? "Resist" : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : "Plague",
					blue: spell.name,
					wide: true
				} : spell?.blue != null && "shift" in spell.blue ? {
					text: fullResist ? "Resist" : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : "Stun",
					blue: spell.name,
					wide: true,
					...blueStun ? { blueStun: true } : {}
				} : spell?.blue != null && "spit" in spell.blue ? {
					text: dmg > 0 ? String(dmg) : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : "Resist",
					blue: spell.name,
					...blueBurstName ? { blueBurst: blueBurstName } : {}
				} : spell?.blue != null && "gorge" in spell.blue ? {
					text: dmg > 0 ? String(dmg) : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : "Resist",
					blue: spell.name,
					...blueBind ? { blueBind: true } : {},
					...blueBurstName ? { blueBurst: blueBurstName } : {}
				} : spell?.blue != null && "hammer" in spell.blue ? {
					text: dmg > 0 ? String(dmg) : text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : "Resist",
					blue: spell.name,
					...blueBurstName ? { blueBurst: blueBurstName } : {}
				} : spell?.blue != null && "reactor" in spell.blue ? {
					text: "DEF+12%",
					blue: spell.name
				} : spell?.blue != null && "exuv" in spell.blue ? {
					text: hpGain > 0 ? `+${hpGain}` : "Full",
					blue: spell.name,
					...divine ? { divineSeal: true } : {},
					...blueErased ? { blueErase: true } : {}
				} : spell?.blue != null && "physical" in spell.blue ? {
					text: blueMiss ? text?.includes("outside") ? "Out of range." : text === "No effect." || text?.includes("your pet") ? "No effect." : "Miss" : String(dmg),
					blue: spell.name,
					...spell.self ? { wide: true } : {},
					...blueSlow ? { blueSlow: true } : {},
					...blueVit ? { blueVit: true } : {},
					...bluePoison ? { bluePoison: true } : {},
					...blueStun ? { blueStun: true } : {},
					...blueKnock ? { blueKnock: true } : {},
					...bluePara ? { bluePara: true } : {},
					...blueCrit ? { blueCrit: true } : {},
					...blueSleep ? { blueSleep: true } : {},
					...blueAtk ? { blueAtk: true } : {},
					...sandAcc ? { blueAcc: true } : {},
					...blueDef ? { blueDef: true } : {}
				} : colureMark ? {
					text: colureMark.name,
					colure: colureMark
				} : songMark ? {
					text: songMark.text,
					song: {
						hostile: songMark.hostile,
						element: songMark.element,
						wide: songMark.wide,
						family: songMark.family,
						spell: songMark.spell,
						allyId: songMark.allyId
					}
				} : ninMark ? {
					text: ninMark.self ? ninMark.shadows != null ? String(ninMark.shadows) : spell?.name ?? "" : String(ninMark.dmg),
					nin: ninMark
				} : spell?.helix && helixLanded ? {
					text: dmg > 0 ? String(dmg) : "Resist",
					helix: helixElement(spell.name)
				} : spell?.nuke && spell.self === true ? {
					text: dmg > 0 ? String(dmg) : "",
					ra: castElement(spell) ?? "earth",
					heavy: spell.name.endsWith(" II")
				} : dmg > 0 ? {
					text: String(dmg),
					wide: /ga(?:\s|$)/i.test(spell?.name ?? ""),
					ancient: /^(?:Freeze|Tornado|Quake|Burst|Flood|Flare)$/.test(spell?.name ?? "") ? spell?.name : void 0
				} : null;
				if (spell?.summon) {
					const summoned = summonByName(spell.name);
					if (!text) text = spell.name;
					mark = {
						text: spell.name,
						summon: {
							name: spell.name,
							element: summoned?.element ?? "light"
						}
					};
				}
				if (mark) {
					if (packPark) {
						mark.foe = "pack";
						mark.packId = cast.packId;
					} else mark.foe = kinPark ? "kin" : "hare";
				}
				pendingSplash = planFoeSplash(spell, cast, spell?.nuke && spell.self === true ? areaDmg : dmg, splashBeforeEnfeebles, splashBeforeDebuffs, kinPark);
				const splashFx = pendingSplash && !pendingSplash.pack ? {
					foe: pendingSplash.other,
					dmg: pendingSplash.dmg,
					spell: spell?.name ?? "",
					element: pendingSplash.enfeebles.find((row) => row.element)?.element ?? null,
					enfeebles: pendingSplash.enfeebles.map((row) => row.name),
					debuffs: pendingSplash.debuffs.map((row) => row.name)
				} : null;
				if (splashFx) {
					if (mark) mark.splash = splashFx;
					else mark = {
						text: "",
						foe: kinPark ? "kin" : "hare",
						splash: splashFx,
						splashOnly: true
					};
				}
				if (sealed && mark) mark.seal = true;
				set({
					cast: null,
					...blueSpent ? { tp: 0 } : {},
					dealt: s.dealt + dmg,
					hareHp: packPark ? packPark.hp : kinPark ? kinPark.hp : liveHareHp,
					kinHp: kinPark ? liveHareHp : liveKinHp,
					hp: sacrificed ? 1 : Math.min(hpCap(), s.hp + hpGain),
					mp: Math.min(s.sheet.mp, s.mp + mpGain),
					buffs: liveBuffs.map((buff) => ({ ...buff })),
					hareDebuffs: (packPark ? packPark.debuffs : kinPark ? kinPark.debuffs : liveHareDebuffs).map((row) => ({ ...row })),
					hareEnfeebles: (packPark ? packPark.enfeebles : kinPark ? kinPark.enfeebles : liveEnfeebles).map((row) => ({ ...row })),
					kinDebuffs: (kinPark ? liveHareDebuffs : kinDebuffs).map((row) => ({ ...row })),
					kinEnfeebles: (kinPark ? liveEnfeebles : kinEnfeebles).map((row) => ({ ...row })),
					...stunCut ? { hareAction: null } : {},
					ailments: liveAilments.map((row) => ({ ...row })),
					weakness: liveWeakness,
					pendingRaise: livePending,
					banishDown: liveBanish ? { ...liveBanish } : null,
					...kinPark ? kinHateState() : hateNow(),
					recasts: { ...liveRecasts },
					spellMark: sealed && !mark ? {
						text: "",
						release: true,
						seal: true
					} : mark,
					...partyTouched ? { trustVitals: trustVitalsNow() } : {},
					...raised ? { ko: false } : {},
					...spell?.warp ? {
						homeReturn: s.homeReturn + 1,
						engaged: false,
						targeted: false,
						selfTargeted: false,
						trustTargeted: null,
						petTargeted: null
					} : {}
				});
				if (text) useGame.getState().pushLog(text, blueMiss ? "miss" : dmg > 0 ? "hit" : "info");
				if (solaceNote) useGame.getState().pushLog(solaceNote, "info");
				if (gainText) useGame.getState().pushLog(gainText, hpGain > 0 || mpGain > 0 ? "hit" : "info");
				if (woke) useGame.getState().pushLog(`The ${HARE.name} wakes.`, "info");
				if (unbound) useGame.getState().pushLog(`The ${HARE.name}'s Bind effect wears off.`, "info");
				if (sealed) useGame.getState().pushLog("Elemental Seal wears off.", "info");
				if (divine) useGame.getState().pushLog("Divine Seal wears off.", "info");
				if (blueSpent) useGame.getState().pushLog("Chain Affinity wears off.", "info");
				if (burstSpent) useGame.getState().pushLog("Burst Affinity wears off.", "info");
				if (blueChain && liveHareHp > 0 && spell) {
					const chain = offerWeaponSkill(blueChainProps(spell.name), dmg, "player", chainFoe());
					if (chain) {
						if (chain.damage > 0) {
							creditStruck(chain.damage);
							const dead = chipStruck(chain.damage);
							const chainWoke = !dead && clearSleep();
							const chainUnbound = !dead && bindWearsOff(chain.damage) && clearBind();
							set({
								dealt: useGame.getState().dealt + chain.damage,
								hareHp: packPark ? packPark.hp : strikeKin && kinPark ? kinPark.hp : liveHareHp,
								kinHp: strikeKin ? liveHareHp : liveKinHp,
								...strikeKin ? kinHateState() : hateNow(),
								hareEnfeebles: (packPark ? packPark.enfeebles : strikeKin && kinPark ? kinPark.enfeebles : liveEnfeebles).map((row) => ({ ...row })),
								hareDebuffs: (packPark ? packPark.debuffs : strikeKin && kinPark ? kinPark.debuffs : liveHareDebuffs).map((row) => ({ ...row })),
								kinEnfeebles: (strikeKin ? liveEnfeebles : kinEnfeebles).map((row) => ({ ...row })),
								kinDebuffs: (strikeKin ? liveHareDebuffs : kinDebuffs).map((row) => ({ ...row })),
								statDown: liveStatDown ? {
									name: liveStatDown.name,
									stat: "int",
									down: liveStatDown.down,
									left: liveStatDown.left
								} : null
							});
							if (chainWoke) useGame.getState().pushLog(`The ${HARE.name} wakes.`, "info");
							if (chainUnbound) useGame.getState().pushLog(`The ${HARE.name}'s Bind effect wears off.`, "info");
						}
						useGame.getState().pushLog(`${chain.name} skillchain. ${chain.damage} damage.`, "hit");
					} else {
						const noted = takeChainNote();
						if (noted?.held) useGame.getState().pushLog(`${noted.held} holds. It lands when the window opens.`, "info");
						else if (noted?.resonating?.length) useGame.getState().pushLog(`${noted.resonating.join(" / ")} resonates.`, "info");
					}
				}
				if (dmg > 0) {
					const feeds = Math.max(1, blueHits);
					for (let i = 0; i < feeds; i++) grantStruckMonsterTp(100);
				}
				if (spell && useGame.getState().mainJob === "DRG") noteWyvernSpell(spell.school);
				if (spell?.summon) summonAvatar(spell.summon);
			} finally {
				if (kinPark) restoreKin(kinPark);
				if (packPark) endPackStrike(packPark);
				pinnedFoe = prevPin;
			}
			applyFoeSplash(pendingSplash);
			if (spell?.colure && !geoAllies(spell.colure.effect)) {
				syncHostileColures();
				set({
					buffs: liveBuffs.map((buff) => ({ ...buff })),
					hareEnfeebles: liveEnfeebles.map((row) => ({ ...row })),
					kinEnfeebles: kinEnfeebles.map((row) => ({ ...row })),
					...hateNow(),
					...kinHateState()
				});
			}
			syncGear();
		},
		interruptCast: () => {
			const s = useGame.getState();
			const cast = s.cast;
			if (!cast) return;
			delete liveRecasts[cast.recastName];
			clearActionLocks();
			set({
				cast: null,
				mp: Math.min(s.sheet.mp, s.mp + cast.mpSpent),
				recasts: { ...liveRecasts },
				...lockState()
			});
			useGame.getState().pushLog("Spell interrupted.", "miss");
			syncGear();
		},
		beginHareAction: (action) => {
			noteBlueReady("hare", action.name);
			set({ hareAction: {
				kind: action.kind,
				name: action.name,
				resolved: false
			} });
		},
		noteKinReady: (name) => {
			noteBlueReady("kin", name);
		},
		resolveHareAction: () => {
			const current = useGame.getState().hareAction;
			if (!current || current.resolved) return;
			set({ hareAction: {
				...current,
				resolved: true
			} });
		},
		clearHareAction: () => {
			if (!useGame.getState().hareAction) return;
			set({ hareAction: null });
		},
		setCrystalTarget: (on) => set({
			crystalTargeted: on,
			...on ? {
				targeted: false,
				selfTargeted: false,
				trustTargeted: null,
				petTargeted: null,
				manualTargeted: false,
				manualPage: "closed"
			} : {}
		}),
		setSelfTarget: (on) => set({
			selfTargeted: on,
			...on ? {
				targeted: false,
				crystalTargeted: false,
				trustTargeted: null,
				petTargeted: null,
				manualTargeted: false,
				manualPage: "closed",
				homeAsk: false
			} : {}
		}),
		setTrustTarget: (id) => {
			const s = useGame.getState();
			if (id && !s.party.summoned.includes(id)) return;
			if (!id) {
				if (s.trustTargeted) set({
					trustTargeted: null,
					petTargeted: null
				});
				return;
			}
			set({
				trustTargeted: id,
				petTargeted: null,
				selfTargeted: false,
				crystalTargeted: false,
				manualTargeted: false,
				manualPage: "closed",
				homeAsk: false,
				...s.engaged ? {} : { targeted: false }
			});
		},
		setPetTarget: (id) => {
			const s = useGame.getState();
			if (id && !peekPet(id)) return;
			if (!id) {
				if (s.petTargeted) set({ petTargeted: null });
				return;
			}
			set({
				petTargeted: id,
				trustTargeted: null,
				selfTargeted: false,
				crystalTargeted: false,
				homeAsk: false,
				...s.engaged ? {} : { targeted: false }
			});
		},
		setManualTarget: (on) => {
			if (on) clearPackSelection();
			set({
				manualTargeted: on,
				manualPage: on ? useGame.getState().manualPage : "closed",
				...on ? {
					targeted: false,
					selfTargeted: false,
					crystalTargeted: false,
					trustTargeted: null,
					petTargeted: null,
					homeAsk: false
				} : {}
			});
		},
		openManual: () => {
			const s = useGame.getState();
			if (!s.manualTargeted || s.ko || s.engaged) return;
			if (!nearFieldManual(readPlace().x, readPlace().z)) {
				s.pushLog("Too far away.", "info");
				return;
			}
			set({ manualPage: "root" });
		},
		setManualPage: (page) => set({ manualPage: page }),
		closeManual: () => set({ manualPage: "closed" }),
		acceptRegime: (repeat) => {
			const s = useGame.getState();
			if (s.manualPage === "closed" || s.ko || s.engaged) return;
			if (!nearFieldManual(readPlace().x, readPlace().z)) {
				set({ manualPage: "closed" });
				s.pushLog("Too far away.", "info");
				return;
			}
			const prev = readFov(s.fov);
			const zone = manualBookAt(readPlace().x, readPlace().z);
			const picked = Number(String(s.manualPage).split(":")[1]);
			const regime = zone ? regimeByPage(picked, zone) : null;
			if (!zone || !regime) return;
			const same = prev.active && prev.book === zone && prev.page === regime.page;
			const fov = rememberFov({
				...prev,
				active: true,
				book: zone,
				page: regime.page,
				counts: same ? prev.counts : regime.goals.map(() => 0),
				repeat: repeat === true
			});
			set({ fov, manualPage: "train" });
			s.pushLog(same
				? repeat ? "This regime will repeat." : "This regime will not repeat."
				: repeat ? `Regime accepted. It will repeat. ${regime.title}.` : `Regime accepted. ${regime.title}.`, "info");
			saveSettings(false);
		},
		cancelRegime: () => {
			const s = useGame.getState();
			const prev = readFov(s.fov);
			if (!prev.active) return;
			const fov = rememberFov({ ...prev, active: false, page: 0, counts: [], repeat: false });
			set({ fov, manualPage: "root" });
			s.pushLog("You cancel the regime.", "info");
			saveSettings(false);
		},
		buyFieldSupport: (id, where) => {
			const s = useGame.getState();
			const town = where === "town";
			if (s.ko) return;
			if (!town) {
				if (s.manualPage === "closed" || s.engaged) return;
				if (!nearFieldManual(readPlace().x, readPlace().z)) {
					set({ manualPage: "closed" });
					s.pushLog("Too far away.", "info");
					return;
				}
			}
			const row = supportCatalog(playerLevel()).find((entry) => entry.id === id);
			if (!row) return;
			const fov = readFov(s.fov);
			if (fov.tabs < row.tabs) {
				s.pushLog("You do not have enough tabs.", "info");
				return;
			}
			if (row.kind === "regen") {
				const current = liveBuffs.find((buff) => buff.name === "Regen");
				if (current && (current.power ?? 0) > 1) {
					s.pushLog("A stronger Regen is already in effect.", "info");
					return;
				}
			}
			if (row.kind === "refresh") {
				if (liveBuffs.some((buff) => buff.name === "Sublimation" || buff.name === "Sublimation: Complete")) {
					s.pushLog("Sublimation prevents Refresh.", "info");
					return;
				}
				const current = liveBuffs.find((buff) => buff.name === "Refresh");
				if (current && (current.power ?? 0) > 1) {
					s.pushLog("A stronger Refresh is already in effect.", "info");
					return;
				}
			}
			if (row.kind === "reraise") {
				const current = liveBuffs.find((buff) => isReraiseSpell(buff.name));
				if (current && current.name !== "Reraise") {
					s.pushLog(`${current.name} stays.`, "info");
					return;
				}
			}
			if (row.kind === "protect" || row.kind === "shell") {
				const tier = fovBarrierTier(row.kind, playerLevel());
				if (!tier) {
					s.pushLog(row.effect, "info");
					return;
				}
				const power = row.kind === "protect" ? PROTECT_DEF[tier] : SHELL_CUT[tier];
				const status = row.kind === "protect" ? "Protect" : "Shell";
				const landed = grantPlayerStatus({ name: status, left: 1800, tier, power }, (buff) => buff.name === status, true);
				if (landed !== "hit") {
					s.pushLog("No effect.", "info");
					return;
				}
			} else if (row.kind === "reraise") {
				grantPlayerStatus({ name: "Reraise", left: 7200 }, (buff) => isReraiseSpell(buff.name), false);
			} else if (row.kind === "regen") {
				grantPlayerStatus({ name: "Regen", left: 3600, power: 1 }, (buff) => buff.name === "Regen", false);
			} else if (row.kind === "refresh") {
				grantPlayerStatus({ name: "Refresh", left: 3600, power: 1 }, (buff) => buff.name === "Refresh", false);
			} else if (row.kind === "food") {
				grantPlayerStatus({ name: row.name, left: 1800 }, (buff) => isFieldFood(buff.name), false);
			}
			const next = rememberFov({ ...fov, tabs: fov.tabs - row.tabs });
			const pools = row.kind === "food" ? paintedPools() : {};
			if (row.kind === "warp") {
				if (s.cast) {
					delete liveRecasts[s.cast.recastName];
					clearActionLocks();
				}
				dropHateRow("player");
				pulled = false;
				for (const trust of Object.values(liveTrusts)) trust.engaged = false;
				const stand = homeStand("crystal");
				writePlace(stand.x, stand.z, true);
				set({
					fov: next,
					engaged: false,
					targeted: false,
					selfTargeted: false,
					crystalTargeted: false,
					trustTargeted: null,
					petTargeted: null,
					manualTargeted: false,
					manualPage: "closed",
					healPhase: "off",
					engageAfterHeal: false,
					cast: null,
					buffs: liveBuffs.map((buff) => ({ ...buff })),
					...hateNow(),
					...lockState()
				});
				useGame.getState().pushLog(`Repatriation. You pay ${row.tabs} tabs. The crystal is ahead.`, "info");
				saveSettings(false);
				return;
			}
			set({
				fov: next,
				buffs: liveBuffs.map((buff) => ({ ...buff })),
				...pools
			});
			const detail = row.effect;
			useGame.getState().pushLog(`${row.name}. You pay ${row.tabs} tabs. ${detail}`, "info");
			saveSettings(false);
		},
		askHome: () => {
			const s = useGame.getState();
			if (!s.crystalTargeted || s.ko || s.engaged) return;
			const here = readPlace();
			if (!nearHomeCrystal(here.x, here.z)) {
				useGame.getState().pushLog("Too far away.", "info");
				return;
			}
			set({ homeAsk: true });
		},
		closeHomeAsk: () => set({ homeAsk: false }),
		closeRivalry: () => set({ rivalryAsk: null }),
		acceptRivalry: () => {
			const s = useGame.getState();
			const who = s.rivalryAsk;
			if (who !== "gallijaux" && who !== "joulet") return;
			if (s.quests?.rivalry === "gallijaux" || s.quests?.rivalry === "joulet") {
				set({ rivalryAsk: null });
				return;
			}
			const inv = { ...(s.inventory ?? {}) };
			const gaveGear = (inv["bamboo-fishing-rod"] ?? 0) < 1 || (inv["little-worm"] ?? 0) < 1;
			if ((inv["bamboo-fishing-rod"] ?? 0) < 1) inv["bamboo-fishing-rod"] = 1;
			if ((inv["little-worm"] ?? 0) < 1) inv["little-worm"] = 12;
			set({
				inventory: inv,
				rivalryAsk: null,
				quests: { ...(s.quests ?? {}), rivalry: who, carpGiven: Math.max(0, Math.floor(Number(s.quests?.carpGiven) || 0)) }
			});
			const name = who === "gallijaux" ? "Gallijaux" : "Joulet";
			s.pushLog(who === "gallijaux" ? "Gallijaux: I knew you were the type! Bring me moat carp. Don't let me catch you helping me brother." : "Joulet: Indeed? Splendid! Bring me moat carp. I wouldn't want to lose to my brother.", "info");
			if (gaveGear) s.pushLog(`${name}: Bamboo rod, and a dozen little worms. Equip the rod in ranged and the worms in ammo.`, "info");
		},
		setHomePoint: () => {
			const s = useGame.getState();
			if (!s.homeAsk) return;
			const here = readPlace();
			const spot = homeHere(here.x, here.z);
			if (!spot) {
				set({ homeAsk: false });
				useGame.getState().pushLog("Too far away.", "info");
				return;
			}
			writeHome(spot);
			set({
				homeAt: spot,
				homeAsk: false
			});
			useGame.getState().pushLog(spot === "port" ? "Your home point has been set to Port San d'Oria." : "Your home point has been set to the San d'Oria crystal.", "info");
		},
		healAtCrystal: () => {
			const s = useGame.getState();
			if (!s.homeAsk || s.ko) return;
			const here = readPlace();
			if (!nearHomeCrystal(here.x, here.z)) {
				set({ homeAsk: false });
				useGame.getState().pushLog("Too far away.", "info");
				return;
			}
			if (s.cast) {
				delete liveRecasts[s.cast.recastName];
				clearActionLocks();
			}
			const cap = hpCap();
			const hp = Math.max(0, cap - s.hp);
			const mp = Math.max(0, s.sheet.mp - s.mp);
			set({
				hp: cap,
				mp: s.sheet.mp,
				homeAsk: false,
				cast: null,
				healPhase: "off",
				engageAfterHeal: false,
				crystalHeal: {
					hp,
					mp
				},
				...lockState()
			});
			useGame.getState().pushLog(hp > 0 || mp > 0 ? "The crystal restores your HP and MP." : "You are already fully healed.", "info");
		},
		setCrystalHeal: (mark) => set({ crystalHeal: mark }),
		setRegenPulse: (hp) => set({ regenPulse: hp }),
		setRefreshPulse: (mp) => set({ refreshPulse: mp }),
		setTpPulse: (tp) => set({ tpPulse: tp }),
		returnToHomePoint: (source) => {
			const s = useGame.getState();
			liveShot = null;
			if (s.cast) {
				delete liveRecasts[s.cast.recastName];
				clearActionLocks();
			}
			const where = s.homeAt === "spawn" ? "where you began" : "your home point";
			const lead = source === "warp" ? "Warp returns you" : source === "scroll" ? "The warp scroll returns you" : "You return";
			if (source === "death") {
				dropHateRow("player");
				clearFallenWeak();
				liveWeakness = null;
				mijinDown = false;
			}
			set({
				hp: hpCap(),
				...source === "death" ? { mp: s.sheet.mp } : {},
				ko: false,
				engaged: false,
				targeted: false,
				selfTargeted: false,
				crystalTargeted: false,
				trustTargeted: null,
				petTargeted: null,
				homeAsk: false,
				healPhase: "off",
				engageAfterHeal: false,
				cast: null,
				homeReturn: s.homeReturn + 1,
				pendingRaise: null,
				...source === "death" ? { weakness: null } : {},
				...hateNow(),
				...lockState()
			});
			livePending = null;
			writePlace(homeStand(s.homeAt).x, homeStand(s.homeAt).z, false);
			useGame.getState().pushLog(source === "death" ? `${lead} to ${where}. HP and MP are full.` : `${lead} to ${where}.`, "info");
			saveSettings();
		},
		acceptRaise: () => {
			const s = useGame.getState();
			const pending = livePending;
			if (!s.ko || !pending) return;
			const asRaise = pending.via ? "Raise III" : pending.spell === "Reraise II" ? "Raise II" : pending.spell === "Reraise III" ? "Raise III" : "Raise";
			liveBuffs = pending.via ? liveBuffs.filter((buff) => buff.song?.family !== "hymnus") : liveBuffs.filter((buff) => !isReraiseSpell(buff.name));
			liveWeakness = pending.weakness;
			clearFallenWeak();
			livePending = null;
			dropHateRow("player");
			set({
				ko: false,
				hp: pending.hp,
				weakness: liveWeakness,
				pendingRaise: null,
				buffs: liveBuffs.map((buff) => ({ ...buff })),
				...hateNow(),
				spellMark: {
					text: pending.hp > 0 ? `+${pending.hp}` : "0",
					raise: asRaise,
					gain: pending.hp
				}
			});
			useGame.getState().pushLog(`${pending.via ?? pending.spell}. You stand where you fell. The ${HARE.name} does not turn on you.`, "info");
		},
		settleHare: () => {
			if (anyHate() || !pulled || liveHareHp <= 0) return;
			pulled = false;
			const dirty = liveHareHp !== HARE.hpNatural || useGame.getState().hareTp > 0 || liveEnfeebles.length > 0 || liveHareDebuffs.length > 0 || liveStatDown != null || liveBanish != null;
			liveHareHp = HARE.hpNatural;
			liveEnfeebles = [];
			clearStepStacks("hare");
			liveHareDebuffs = [];
			liveStatDown = null;
			bubbleStr = 0;
			bubbleStrLeft = 0;
			liveBanish = null;
			set({
				hareHp: liveHareHp,
				hareTp: 0,
				hareEnfeebles: [],
				hareDebuffs: [],
				statDown: null,
				banishDown: null,
				hareAction: null,
				...hateNow()
			});
			if (dirty) useGame.getState().pushLog(`The ${HARE.name} returns.`, "info");
		},
		pushLog: (text, kind) => set((s) => ({ log: [...s.log.slice(-39), {
			id: logSeq++,
			text,
			kind
		}] })),
		recordSwing: (last) => {
			const who = playerFoe();
			if (who === "kin") {
				let woke = false;
				let unbound = false;
				if (last.hit && last.dmg > 0) {
					creditKinDamage(last.dmg);
					if (!chipKin(last.dmg)) {
						woke = strikeKin ? clearSleep() : clearKinSleep();
						unbound = strikeKin ? bindWearsOff(last.dmg) && clearBind() : clearKinBind(last.dmg);
					}
				}
				set((s) => ({
					last,
					swings: s.swings + 1,
					dealt: s.dealt + (last.hit ? last.dmg : 0),
					kinHp: liveKinHp,
					kinTp: liveKinTp,
					...kinHateState(),
					kinEnfeebles: (strikeKin ? liveEnfeebles : kinEnfeebles).map((row) => ({ ...row })),
					kinDebuffs: (strikeKin ? liveHareDebuffs : kinDebuffs).map((row) => ({ ...row }))
				}));
				if (woke) useGame.getState().pushLog(`The ${HARE.name} wakes.`, "info");
				if (unbound) useGame.getState().pushLog(`The ${HARE.name}'s Bind effect wears off.`, "info");
				return;
			}
			if (who !== "hare") {
				set((s) => ({
					last,
					swings: s.swings + 1
				}));
				return;
			}
			let woke = last.hit && last.dmg > 0 && clearSleep();
			let unbound = last.hit && bindWearsOff(last.dmg) && clearBind();
			if (last.hit && last.dmg > 0) {
				creditDamage(last.dmg);
				if (chipHare(last.dmg)) woke = false;
			}
			set((s) => ({
				last,
				swings: s.swings + 1,
				dealt: s.dealt + (last.hit ? last.dmg : 0),
				hareHp: liveHareHp,
				...hateNow(),
				hareEnfeebles: liveEnfeebles.map((row) => ({ ...row })),
				hareDebuffs: liveHareDebuffs.map((row) => ({ ...row })),
				statDown: liveStatDown ? {
					name: liveStatDown.name,
					stat: "int",
					down: liveStatDown.down,
					left: liveStatDown.left
				} : null
			}));
			if (woke) useGame.getState().pushLog(`The ${HARE.name} wakes.`, "info");
			if (unbound) useGame.getState().pushLog(`The ${HARE.name}'s Bind effect wears off.`, "info");
		},
		tickCombat: (dt) => {
			keepLivingQuarry();
			tickHareRespawn(dt);
			tickKinRespawn(dt);
			const delayed = tickSkillchain(dt);
			if (delayed) landChain(delayed);
			tickWyvern(dt);
			tickJug(dt);
			tickAutomaton(dt);
			tickCharm(dt);
			tickPackCharm(dt);
			tickRewardRegen(dt);
			tickRepairRegen(dt);
			tickAvatar(dt);
			tickPartyPets(dt);
			publishPets();
			tickTrusts(dt);
			clearEmptyFight();
			tickActionLocks(dt);
			advanceRangedShot(dt);
			syncGear();
			const clock = lockClock();
			if (clock.action !== shownLocks.action || clock.ability !== shownLocks.ability) {
				shownLocks = clock;
				set({
					actionLock: clock.action,
					abilityLock: clock.ability
				});
			}
			const trait = useGame.getState().ko ? 0 : useGame.getState().sheet.autoRegen;
			const spellRegen = useGame.getState().ko ? 0 : regenPower(liveBuffs);
			if (trait > 0 || spellRegen !== 0) {
				regenAcc += dt;
				const ticks = Math.floor(regenAcc / 3);
				if (ticks > 0) {
					regenAcc -= ticks * 3;
					const s = useGame.getState();
					const cap = hpCap();
					let room = cap - s.hp;
					const traitHp = Math.min(room, trait * ticks);
					room -= traitHp;
					const spellHp = spellRegen > 0 ? Math.min(room, spellRegen * ticks) : 0;
					const gained = traitHp + spellHp;
					const hurt = spellRegen < 0 ? spellRegen * ticks : 0;
					const next = Math.max(1, Math.min(cap, s.hp + gained + hurt));
					if (next !== s.hp || spellHp > 0) set({
						...next !== s.hp ? { hp: next } : {},
						...spellHp > 0 ? { regenPulse: spellHp } : {}
					});
				}
			} else regenAcc = 0;
			const traitRefresh = useGame.getState().ko ? 0 : useGame.getState().sheet.autoRefresh;
			const spellRefresh = useGame.getState().ko ? 0 : Math.max(0, refreshPower(liveBuffs) + rollCombat(liveBuffs).refresh);
			if (spellRefresh > 0 || traitRefresh > 0) {
				refreshAcc += dt;
				const ticks = Math.floor(refreshAcc / 3);
				if (ticks > 0) {
					refreshAcc -= ticks * 3;
					const s = useGame.getState();
					const room = s.sheet.mp - s.mp;
					const spellGain = Math.min(room, spellRefresh * ticks);
					const gained = spellGain + Math.min(Math.max(0, room - spellGain), traitRefresh * ticks);
					if (gained > 0) set({
						mp: Math.min(s.sheet.mp, s.mp + gained),
						...spellGain > 0 ? { refreshPulse: spellGain } : {}
					});
				}
			} else refreshAcc = 0;
			const meditating = liveBuffs.some((buff) => buff.name === "Meditate");
			if (!useGame.getState().ko && meditating) {
				meditateAcc += dt;
				const ticks = Math.floor(meditateAcc / 3);
				if (ticks > 0) {
					meditateAcc -= ticks * 3;
					const s = useGame.getState();
					const landed = takeMeditate(s.sheet.job === "SAM", meditateGained, s.tp, ticks);
					if (landed.gain > 0) {
						meditateGained = landed.gained;
						set({
							tp: landed.tp,
							tpPulse: landed.gain
						});
						s.pushLog(landed.text, "info");
					}
				}
			} else if (!meditating) {
				meditateAcc = 0;
				meditateGained = 0;
			}
			if (liveBuffs.length === 0 && Object.keys(liveRecasts).length === 0 && !hateRows.some((row) => row.ve > 0) && !kinHateRows.some((row) => row.ve > 0) && liveHareDebuffs.length === 0 && liveEnfeebles.length === 0 && kinDebuffs.length === 0 && kinEnfeebles.length === 0 && liveAilments.length === 0 && liveBanish == null && liveStatDown == null && liveWeakness == null && packStatuses.size === 0 && packHate.size === 0 && useGame.getState().mainJob !== "SCH" && useGame.getState().subJob !== "SCH" && luopan == null && useGame.getState().mainJob !== "GEO" && useGame.getState().subJob !== "GEO" && !Object.values(liveTrusts).some((trust) => trust?.buffs?.some((buff) => String(buff.name).startsWith("Indi-") || String(buff.name).startsWith("Geo-")))) {
				considerGambits();
				return;
			}
			const signature = () => liveBuffs.map((buff) => `${buff.name}:${shown(buff.left)}:${buff.power ?? ""}`).join() + Object.values(liveRecasts).map(shown).join() + hateRows.map((row) => `${row.id}:${row.ce}:${Math.floor(row.ve / 10)}`).join("|") + kinHateRows.map((row) => `${row.id}:${row.ce}:${Math.floor(row.ve / 10)}`).join("|") + liveHareDebuffs.map((row) => `${row.name}:${shown(row.left)}`).join() + liveEnfeebles.map((row) => `${row.name}:${shown(row.left)}:${row.power ?? 0}`).join() + kinDebuffs.map((row) => `${row.name}:${shown(row.left)}`).join() + kinEnfeebles.map((row) => `${row.name}:${shown(row.left)}:${row.power ?? 0}`).join() + liveAilments.map((row) => `${row.name}:${shown(row.left)}`).join() + (liveBanish ? `${liveBanish.name}:${shown(liveBanish.left)}` : "") + (liveStatDown ? `skull:${liveStatDown.down}:${shown(liveStatDown.left)}` : "") + (liveWeakness ? `weak:${shown(liveWeakness.left)}` : "") + packPlateSignature();
			const before = signature();
			const scholarNow = useGame.getState();
			const scholarLevel = scholarNow.mainJob === "SCH" ? 75 : scholarNow.subJob === "SCH" ? subjobLevel(75) : 0;
			if (scholarLevel > 0 || liveBuffs.some((buff) => buff.name === "Stratagem" || buff.name === "Light Arts" || buff.name === "Dark Arts" || buff.name === "Sublimation" || buff.name === "Tabula Rasa")) {
				const scholarTick = tickScholar(liveBuffs, dt, scholarLevel, scholarNow.mainJob === "SCH", scholarNow.hp, hpCap(), scholarNow.sheet.mp, scholarNow.mp);
				liveBuffs = scholarTick.buffs;
				if (scholarTick.hp !== scholarNow.hp || scholarTick.mp !== scholarNow.mp) set({ hp: scholarTick.hp, mp: scholarTick.mp });
				for (const line of scholarTick.logs) scholarNow.pushLog(line, "info");
			}
			if (!liveBuffs.some((buff) => buff.name === "Bolster")) {
				liveBuffs = liveBuffs.map(halveBolster);
				liveEnfeebles = liveEnfeebles.map(halveBolster);
				kinEnfeebles = kinEnfeebles.map(halveBolster);
				if (luopan?.aura) luopan.aura = halveBolster(luopan.aura);
			}
			syncHostileColures();
			syncAllyGeo();
			syncTrustIndi();
			if (luopan && luopan.demat > 0) luopan.demat = Math.max(0, luopan.demat - dt);
			if (luopan || nearbyIndi("Regen") > 0 || nearbyIndi("Refresh") > 0 || liveBuffs.some((buff) => buff.name === "Indi-Regen" || buff.name === "Geo-Regen" || buff.name === "Indi-Refresh" || buff.name === "Geo-Refresh")) {
				geoAcc += dt;
				const ticks = Math.floor(geoAcc / 3);
				if (ticks > 0) {
					geoAcc -= ticks * 3;
					if (luopan) {
						const decay = luopanDecay(luopan.level, luopan.lasting, luopan.ecliptic) * ticks;
						luopan.hp -= decay;
						if (luopan.hp <= 0) dismissLuopan("The luopan fades.");
					}
					const regen = liveBuffs.reduce((n, buff) => n + (buff.name === "Indi-Regen" || buff.name === "Geo-Regen" ? buff.power ?? 0 : 0), 0) + nearbyIndi("Regen");
					const refresh = liveBuffs.reduce((n, buff) => n + (buff.name === "Indi-Refresh" || buff.name === "Geo-Refresh" ? buff.power ?? 0 : 0), 0) + nearbyIndi("Refresh");
					const now = useGame.getState();
					if (!now.ko && (regen > 0 || refresh > 0)) {
						const hpGain = Math.min(Math.max(0, hpCap() - now.hp), regen * ticks);
						const mpGain = Math.min(Math.max(0, now.sheet.mp - now.mp), refresh * ticks);
						if (hpGain > 0 || mpGain > 0) set({
							...hpGain > 0 ? { hp: Math.min(hpCap(), now.hp + hpGain), regenPulse: hpGain } : {},
							...mpGain > 0 ? { mp: Math.min(now.sheet.mp, now.mp + mpGain), refreshPulse: mpGain } : {}
						});
					}
				}
			} else geoAcc = 0;
			if (liveBuffs.some((buff) => buff.name === "Swordplay" || buff.name === "Foil")) {
				liveBuffs = stepRuneBuffs(liveBuffs, dt).buffs;
			}
			for (const trust of Object.values(liveTrusts)) {
				if (trust?.buffs?.some((buff) => buff.name === "Swordplay" || buff.name === "Foil")) trust.buffs = stepRuneBuffs(trust.buffs, dt).buffs;
			}
			let dotDmg = 0;
			const nextDebuffs = [];
			for (const debuff of liveHareDebuffs) {
				const step = debuffTick(debuff.left, debuff.acc, dt);
				if (step.ticks > 0) {
					const dmg = debuff.dot * step.ticks;
					dotDmg += dmg;
					pendingDots.push({
						name: debuff.name,
						dmg
					});
					useGame.getState().pushLog(`The ${HARE.name} takes ${dmg} points of damage.`, "hit");
				}
				if (step.left > 0) nextDebuffs.push({
					...debuff,
					left: step.left,
					acc: step.acc
				});
			}
			liveHareDebuffs = nextDebuffs;
			const nextEnfeebles = [];
			for (const row of liveEnfeebles) if (row.name === "VIT Down" || row.name === "STR Down") {
				const next = stepVitDown(row, dt);
				if (next) nextEnfeebles.push(next);
				else useGame.getState().pushLog(`${row.name} wears off.`, "info");
			} else if (row.name === "Plague") {
				const next = stepPlague(row, dt, false);
				if (next) nextEnfeebles.push(next);
			} else if (row.name === "Helix") {
				const stepped = stepHelix(row, dt);
				const slip = stepped.ticks.reduce((n, hit) => n + hit, 0);
				if (slip > 0) {
					dotDmg += slip;
					pendingDots.push({
						name: "Helix",
						dmg: slip,
						element: row.element
					});
					useGame.getState().pushLog(`The ${HARE.name} takes ${slip} points of damage.`, "hit");
				}
				if (stepped.row) nextEnfeebles.push(stepped.row);
				else useGame.getState().pushLog("Helix wears off.", "info");
			} else if (row.dot != null && row.dot > 0) {
				const step = debuffTick(row.left, row.acc ?? 0, dt);
				if (step.ticks > 0) {
					const slip = row.dot * step.ticks;
					dotDmg += slip;
					pendingDots.push({
						name: row.name,
						dmg: slip
					});
					useGame.getState().pushLog(`The ${HARE.name} takes ${slip} points of damage.`, "hit");
					creditColureTick(row.name, slip, false);
				}
				if (step.left > 0) nextEnfeebles.push({
					...row,
					left: step.left,
					acc: step.acc
				});
			} else {
				const left = row.left - dt;
				if (left > 0) nextEnfeebles.push({
					...row,
					left
				});
				else sambaWore(row.name);
			}
			holdStepStacks("hare", liveEnfeebles, nextEnfeebles, dt);
			liveEnfeebles = nextEnfeebles;
			if (liveStatDown) {
				let down = liveStatDown.down;
				let left = liveStatDown.left - dt;
				let decay = liveStatDown.decay - dt;
				const wornName = liveStatDown.name;
				while (decay <= 0 && down > 0) {
					down -= 1;
					decay += 10;
				}
				if (left <= 0 || down <= 0) {
					liveStatDown = null;
					useGame.getState().pushLog(`${wornName} wears off.`, "info");
				} else liveStatDown = {
					name: wornName,
					stat: "int",
					down,
					left,
					decay
				};
			}
			if (liveBanish) {
				const left = liveBanish.left - dt;
				if (left > 0) liveBanish = {
					...liveBanish,
					left
				};
				else {
					const worn = liveBanish.name;
					liveBanish = null;
					useGame.getState().pushLog(`${worn} wears off.`, "info");
				}
			}
			const worn = [];
			const nextAilments = [];
			for (const row of liveAilments) {
				const left = row.left - dt;
				if (left > 0) nextAilments.push({
					...row,
					left
				});
				else worn.push(row.name);
			}
			liveAilments = nextAilments;
			for (const name of worn) useGame.getState().pushLog(`${name} wears off.`, "info");
			if (liveWeakness) {
				const left = liveWeakness.left - dt;
				if (left > 0) liveWeakness = {
					...liveWeakness,
					left
				};
				else {
					liveWeakness = null;
					useGame.getState().pushLog("Weakness wears off.", "info");
				}
			}
			const hadSkin = liveBuffs.some((buff) => buff.name === "Stoneskin");
			const hadMisery = liveBuffs.some((buff) => buff.name === "Afflatus Misery");
			const hadAuspice = liveBuffs.some((buff) => buff.name === "Auspice");
			const hadEnspell = liveBuffs.filter((buff) => buff.enspell).map((buff) => buff.name);
			const hadReraise = liveBuffs.filter((buff) => isReraiseSpell(buff.name)).map((buff) => buff.name);
			const hadSurge = liveBuffs.some((buff) => buff.name === "Spirit Surge");
			const hadFamiliar = liveBuffs.some((buff) => buff.name === "Familiar");
			const hadFood = liveBuffs.find((buff) => isFieldFood(buff.name))?.name ?? "";
			liveBuffs = liveBuffs.map((buff) => {
				if (buff.hold) return buff;
				const next = {
					...buff,
					left: buff.left - dt
				};
				if (next.name !== "Magic Def. Boost" || next.decay == null || next.decay <= 0 || (next.power ?? 0) <= 0) return next;
				let clock = (next.acc ?? 0) + dt;
				let power = next.power ?? 0;
				while (clock >= next.decay && power > 0) {
					clock -= next.decay;
					power -= 1;
				}
				return {
					...next,
					power,
					acc: power > 0 ? clock : 0
				};
			}).filter((buff) => buff.left > 0 && buff.name !== "Huton");
			if (hadSurge && !liveBuffs.some((buff) => buff.name === "Spirit Surge")) {
				const s = useGame.getState();
				set({
					hpGift: 0,
					hp: Math.min(s.hp, s.sheet.hp)
				});
				useGame.getState().pushLog("Spirit Surge wears off.", "info");
			}
			if (hadFamiliar && !liveBuffs.some((buff) => buff.name === "Familiar") && jug?.familiar) {
				jug.max = CARRIE_HP_STANDIN;
				jug.hp = Math.min(jug.hp, jug.max);
				jug.familiar = false;
				useGame.getState().pushLog("Familiar wears off.", "info");
				publishPets();
			}
			if (hadMisery && !liveBuffs.some((buff) => buff.name === "Afflatus Misery")) {
				miseryWound = 0;
				clearAuspiceAccuracy();
			}
			if (hadAuspice && !liveBuffs.some((buff) => buff.name === "Auspice")) auspiceRamp = 0;
			for (const name of hadEnspell) if (!liveBuffs.some((buff) => buff.name === name)) useGame.getState().pushLog(`${name} wears off.`, "info");
			if (hadSkin && !liveBuffs.some((buff) => buff.name === "Stoneskin")) useGame.getState().pushLog("Stoneskin wears off.", "info");
			for (const name of hadReraise) if (!liveBuffs.some((buff) => buff.name === name)) useGame.getState().pushLog(`${name} wears off.`, "info");
			if (hadFood && !liveBuffs.some((buff) => buff.name === hadFood)) useGame.getState().pushLog(`${hadFood} wears off.`, "info");
			for (const name of Object.keys(liveRecasts)) {
				if (name === "Sic") continue;
				const next = liveRecasts[name] - dt;
				if (next > 0) liveRecasts[name] = next;
				else delete liveRecasts[name];
			}
			tickReadyBank(dt);
			const keepHate = (rows, kin) => {
				const next = [];
				for (const row of rows) {
					const ve = Math.max(0, row.ve - 60 * dt);
					if (seatRow(row, row.ce, ve, actorNear(row.id, kin))) next.push(row);
				}
				return next;
			};
			hateRows = keepHate(hateRows, false);
			kinHateRows = keepHate(kinHateRows, true);
			tickHateLeash(dt);
			syncLiveHate();
			let kinDot = 0;
			const nextKinDebuffs = [];
			for (const debuff of kinDebuffs) {
				const step = debuffTick(debuff.left, debuff.acc, dt);
				if (step.ticks > 0) {
					const dmg = debuff.dot * step.ticks;
					kinDot += dmg;
					pendingDots.push({
						name: debuff.name,
						dmg,
						at: "kin"
					});
					useGame.getState().pushLog(`The ${HARE.name} takes ${dmg} points of damage.`, "hit");
				}
				if (step.left > 0) nextKinDebuffs.push({
					...debuff,
					left: step.left,
					acc: step.acc
				});
			}
			kinDebuffs = nextKinDebuffs;
			const nextKinEnfeebles = [];
			for (const row of kinEnfeebles) if (row.name === "VIT Down" || row.name === "STR Down") {
				const next = stepVitDown(row, dt);
				if (next) nextKinEnfeebles.push(next);
				else useGame.getState().pushLog(`${row.name} wears off.`, "info");
			} else if (row.name === "Plague") {
				const next = stepPlague(row, dt, true);
				if (next) nextKinEnfeebles.push(next);
			} else if (row.name === "Helix") {
				const stepped = stepHelix(row, dt);
				const slip = stepped.ticks.reduce((n, hit) => n + hit, 0);
				if (slip > 0) {
					kinDot += slip;
					pendingDots.push({
						name: "Helix",
						dmg: slip,
						element: row.element,
						at: "kin"
					});
					useGame.getState().pushLog(`The ${HARE.name} takes ${slip} points of damage.`, "hit");
				}
				if (stepped.row) nextKinEnfeebles.push(stepped.row);
				else useGame.getState().pushLog("Helix wears off.", "info");
			} else if (row.dot != null && row.dot > 0) {
				const step = debuffTick(row.left, row.acc ?? 0, dt);
				if (step.ticks > 0) {
					const slip = row.dot * step.ticks;
					kinDot += slip;
					pendingDots.push({
						name: row.name,
						dmg: slip,
						at: "kin"
					});
					useGame.getState().pushLog(`The ${HARE.name} takes ${slip} points of damage.`, "hit");
					creditColureTick(row.name, slip, true);
				}
				if (step.left > 0) nextKinEnfeebles.push({
					...row,
					left: step.left,
					acc: step.acc
				});
			} else {
				const left = row.left - dt;
				if (left > 0) nextKinEnfeebles.push({
					...row,
					left
				});
				else sambaWore(row.name);
			}
			holdStepStacks("kin", kinEnfeebles, nextKinEnfeebles, dt);
			kinEnfeebles = nextKinEnfeebles;
			tickPackStatuses(dt);
			tickPackHate(dt);
			if (dotDmg > 0) chipHare(dotDmg);
			if (kinDot > 0) chipKin(kinDot);
			if (before !== signature() || dotDmg > 0 || kinDot > 0) set({
				buffs: liveBuffs.map((buff) => ({ ...buff })),
				recasts: { ...liveRecasts },
				...hadFood && !liveBuffs.some((buff) => buff.name === hadFood) ? paintedPools() : {},
				...hateNow(),
				...kinHateState(),
				hareDebuffs: liveHareDebuffs.map((row) => ({ ...row })),
				statDown: liveStatDown ? {
					name: liveStatDown.name,
					stat: "int",
					down: liveStatDown.down,
					left: liveStatDown.left
				} : null,
				hareEnfeebles: liveEnfeebles.map((row) => ({ ...row })),
				kinDebuffs: kinDebuffs.map((row) => ({ ...row })),
				kinEnfeebles: kinEnfeebles.map((row) => ({ ...row })),
				ailments: liveAilments.map((row) => ({ ...row })),
				banishDown: liveBanish ? { ...liveBanish } : null,
				weakness: liveWeakness,
				dotQueue: pendingDots.map((row) => ({ ...row })),
				dealt: useGame.getState().dealt + dotDmg + kinDot,
				hareHp: liveHareHp,
				kinHp: liveKinHp
			});
			considerGambits();
		},
		useHotbar: (index) => {
			const action = findAction(useGame.getState().hotbar[index] ?? null);
			if (!action) return;
			if (issueAction(action, null)) armGambitYield();
		}
	};
});
/** Writes the versioned blob and the older first-swing keys. Never replaces a corrupt blob with a blank one. A fresh unstarted Black Mage does not count, and must not overwrite a game. `mirror` posts the server copy. The play heartbeat keeps that off so a file write cannot reload the yard. */
export function saveSettings(mirror = true) {
	if (applyingSave) return;
	const state = useGame.getState();
	if (!isRealProgress(state)) return;
	if (typeof window !== "undefined" && !serverKnown) wroteDuringHydrate = true;
	writeJobs(state.mainJob, state.subJob, state.race);
	writeLoadout(state.gearBase ?? state.loadout);
	writeHotbar(state.hotbar);
	saveParty(state.party);
	saveGambitBook(state.gambits);
	saveJobLevels(state.jobLevels);
	writeHome(state.homeAt);
	const level = state.jobLevels[state.mainJob] ?? 75;
	const expByJob = { ...(state.expByJob ?? {}) };
	expByJob[state.mainJob] = Math.max(0, Math.floor(state.exp || 0));
	const packed = normalizeProgress({
		...readExtra(),
		version: 1,
		savedAt: Date.now(),
		revision: nextRevision(),
		started: state.started,
		level,
		exp: expByJob[state.mainJob],
		expByJob,
		race: state.race,
		mainJob: state.mainJob,
		subJob: state.subJob,
		jobLevels: state.jobLevels,
		skills: state.skills,
		gil: state.gil,
		inventory: state.inventory,
		loadout: state.gearBase ?? state.loadout,
		gearBase: state.gearBase ?? state.loadout,
		equipSets: state.equipSets ?? emptyEquipSets(),
		hotbar: state.hotbar,
		party: state.party,
		gambits: state.gambits,
		homeAt: state.homeAt,
		zone: state.screen,
		position: readPlace(),
		quests: state.quests,
		flags: state.flags,
		afk: {
			dealt: state.dealt,
			swings: state.swings,
			seconds: readAfkSeconds()
		},
		hp: state.hp,
		mp: state.mp,
		tp: state.tp,
		engaged: state.engaged,
		ko: state.ko,
		buffs: state.buffs,
		recasts: state.recasts,
		hate: state.hate,
		hareHp: liveHareHp,
		hareTp: state.hareTp,
		skillchain: skillchainSnapshot(),
		log: state.log.map((line) => ({
			text: line.text,
			kind: line.kind
		})),
		blueLearned: state.blueLearned,
		blueSet: state.blueSet,
		autoHead: state.autoHead,
		autoFrame: state.autoFrame,
		autoSet: state.autoSet,
		crystals: state.crystals ?? emptyCrystals(),
		magian: state.magian ?? emptyMagian(),
		craftSkill: state.craftSkill ?? emptyCraftSkill(),
		craftStock: state.craftStock ?? {},
		rankPoints: state.rankPoints ?? 0,
		conquestPoints: state.conquestPoints ?? 0,
		afkFarm: state.afkFarm ?? null
	});
	setExtra(packed.extra);
	const text = serializeProgress(packed.save, packed.extra);
	writeSerialized(text);
	if (mirror) mirrorYard(text);
}
var serverKnown = false;
var applyingSave = false;
var yardCustomized = false;
var wroteDuringHydrate = false;
var yardClosed = false;
var yardPending = null;
var yardTimer = null;
var earlyYardRead = null;
function mirrorYard(text) {
	if (typeof window === "undefined" || yardClosed || applyingSave) return;
	yardPending = text;
	if (!serverKnown) return;
	if (yardTimer != null) clearTimeout(yardTimer);
	yardTimer = setTimeout(() => flushYardMirror(), 250);
}
/** Send the queued yard blob now. Page hide and Save now call this. */
export function flushYardMirror() {
	if (yardTimer != null) {
		clearTimeout(yardTimer);
		yardTimer = null;
	}
	const text = yardPending;
	if (!text || typeof window === "undefined" || yardClosed || applyingSave || !serverKnown) return;
	yardPending = null;
	const keepalive = text.length < 6e4;
	writeYardSave({
		data: { blob: text },
		fetch: (input, init) => fetch(input, {
			...init,
			keepalive
		})
	}).catch(() => {});
}
async function readRemoteYard() {
	const pull = async () => {
		try {
			const row = await readYardSave();
			return row?.blob && row.blob.length >= 2 ? row.blob : null;
		} catch {
			return null;
		}
	};
	let text = null;
	if (earlyYardRead) {
		const first = await earlyYardRead;
		earlyYardRead = null;
		if (first.ok && first.blob && first.blob.length >= 2) text = first.blob;
	}
	if (!text) text = await pull();
	if (!text || !progressFromText(text)) {
		await new Promise((resolve) => setTimeout(resolve, 400));
		const again = await pull();
		if (again) text = again;
	}
	return text;
}
/** Pull the server yard after hydration. A fresh BLM boot must not overwrite it. */
export function hydrateYardSave() {
	if (typeof window === "undefined") return Promise.resolve();
	return hydrateOnce ??= hydrateYardBody();
}
/** True once the server snapshot has been read. Heartbeats wait for this so a blank tab cannot beat it. */
export function yardReady() {
	return serverKnown;
}
var hydrateOnce = null;
async function hydrateYardBody() {
	const remoteText = await readRemoteYard();
	if (yardClosed) return;
	const remote = progressFromText(remoteText);
	const local = readStoredSave(browserStorage());
	const bootAt = boot.kind === "fresh" ? 0 : boot.save.savedAt;
	const localReal = !!local && isRealProgress(local.save);
	const remoteReal = !!remote && isRealProgress(remote.save);
	const localAt = wroteDuringHydrate && !localReal ? bootAt : local?.save.savedAt ?? 0;
	let choice = chooseYardSource(localAt, remote?.save.savedAt ?? 0, yardCustomized, wroteDuringHydrate, localReal, remoteReal);
	if (remote && local && remoteReal && localReal && remote.save.revision !== local.save.revision) {
		choice = remote.save.revision > local.save.revision ? "remote" : "local";
	}
	const sameBoot = boot.kind !== "fresh" && remote != null && boot.save.savedAt === remote.save.savedAt && !yardCustomized && !wroteDuringHydrate;
	if (choice === "remote" && remote && remoteText && !sameBoot) {
		applyingSave = true;
		try {
			applyLoaded(remote.save, remote.extra);
			writeSerialized(remoteText);
		} finally {
			applyingSave = false;
		}
	}
	if (yardClosed) return;
	serverKnown = true;
	if (choice === "remote") yardPending = null;
	if (choice === "local") {
		const text = browserStorage()?.getItem(PROGRESS_KEY);
		const parsed = progressFromText(text ?? null);
		if (text && parsed && isRealProgress(parsed.save)) mirrorYard(text);
	} else if (choice === "memory") saveSettings();
	else if (yardPending) flushYardMirror();
}
noteTrustBlue(useGame.getState().blueSet ?? [], useGame.getState().jobLevels?.BLU ?? 75);
useGame.subscribe((state, prev) => {
	if (state.blueSet !== prev.blueSet || state.jobLevels?.BLU !== prev.jobLevels?.BLU) {
		noteTrustBlue(state.blueSet ?? [], state.jobLevels?.BLU ?? 0);
		refreshLiveBlu();
	}
	if (!(state.started !== prev.started || state.screen !== prev.screen || state.race !== prev.race || state.mainJob !== prev.mainJob || state.subJob !== prev.subJob || state.loadout !== prev.loadout || state.hotbar !== prev.hotbar || state.party !== prev.party || state.gambits !== prev.gambits || state.jobLevels !== prev.jobLevels || state.homeAt !== prev.homeAt || state.exp !== prev.exp || state.expByJob !== prev.expByJob || state.gil !== prev.gil || state.inventory !== prev.inventory || state.quests !== prev.quests || state.flags !== prev.flags || state.blueLearned !== prev.blueLearned || state.blueSet !== prev.blueSet || state.autoHead !== prev.autoHead || state.autoFrame !== prev.autoFrame || state.autoSet !== prev.autoSet)) return;
	if (!applyingSave) {
		if (state.race !== prev.race || state.mainJob !== prev.mainJob || state.subJob !== prev.subJob || state.loadout !== prev.loadout || state.hotbar !== prev.hotbar || state.party !== prev.party || state.gambits !== prev.gambits || state.jobLevels !== prev.jobLevels || state.homeAt !== prev.homeAt || state.exp !== prev.exp || state.expByJob !== prev.expByJob || state.gil !== prev.gil || state.inventory !== prev.inventory || state.quests !== prev.quests || state.flags !== prev.flags || state.blueLearned !== prev.blueLearned || state.blueSet !== prev.blueSet || state.autoHead !== prev.autoHead || state.autoFrame !== prev.autoFrame || state.autoSet !== prev.autoSet) yardCustomized = true;
	}
	// A kill only moves experience (and, below 75, the job level). Keep that on the device.
	// A server write reloads the yard and would wipe the chain and the popup.
	const killOnly = state.exp !== prev.exp && !(state.started !== prev.started || state.screen !== prev.screen || state.race !== prev.race || state.mainJob !== prev.mainJob || state.subJob !== prev.subJob || state.loadout !== prev.loadout || state.hotbar !== prev.hotbar || state.party !== prev.party || state.gambits !== prev.gambits || state.homeAt !== prev.homeAt || state.gil !== prev.gil || state.inventory !== prev.inventory || state.quests !== prev.quests || state.flags !== prev.flags || state.blueLearned !== prev.blueLearned || state.blueSet !== prev.blueSet || state.autoHead !== prev.autoHead || state.autoFrame !== prev.autoFrame || state.autoSet !== prev.autoSet);
	saveSettings(!killOnly);
});
if (bootShouldPersist()) {
	writeJobs(boot.save.mainJob, boot.save.subJob, boot.save.race);
	writeLoadout(boot.save.loadout);
	writeHotbar(boot.save.hotbar);
	saveParty(boot.save.party);
	saveGambitBook(boot.save.gambits);
	saveJobLevels(boot.save.jobLevels);
	writeHome(boot.save.homeAt);
	writeSerialized(serializeProgress(boot.save, boot.extra));
}
var resumed = false;
/** Apply the save that was read at startup. Once per page load, before paint. */
export function resumeSavedGame() {
	if (resumed) return;
	resumed = true;
	if (boot.kind === "fresh") return;
	applyingSave = true;
	try {
		applyLoaded(boot.save, boot.extra);
	} finally {
		applyingSave = false;
	}
}
function applyLoaded(save, carried) {
	adoptRevision(save.revision || 0);
	const gearBase = fitLoadout(save.gearBase ?? save.loadout, save.mainJob, save.subJob);
	const equipSets = legalizeEquipSets(save.equipSets ?? emptyEquipSets(), save.mainJob, save.subJob);
	const loadout = resolveGear(save.engaged && !save.ko ? "tp" : "idle", gearBase, equipSets, save.mainJob, save.subJob, save.engaged && !save.ko);
	liveMagian = sanitizeMagian(save.magian);
	const rawSheet = sheetFor(loadout, save.race, save.mainJob, save.subJob, save.blueSet);
	const hotbar = keepHotbar(save.hotbar, save.mainJob, save.subJob, rawSheet, loadout.range, save.blueSet);
	liveBuffs = save.buffs.map((buff) => ({ ...buff })).filter((buff) => buff.name !== "Huton" && !(String(buff.name).startsWith("Indi-") && buff.hold) && !(String(buff.name).startsWith("Geo-") && (buff.hold || buff.from || buff.indiFrom)));
	const sheet = applyFieldFood(rawSheet, liveBuffs, save.jobLevels?.[save.mainJob] ?? 75);
	liveRecasts = { ...save.recasts };
	readyBank = bankFromSic(liveRecasts.Sic ?? 0);
	syncReadyClock();
	hateRows = [];
	hateStamp = 0;
	if (!save.ko && (save.hate.ce > 0 || save.hate.ve > 0)) {
		hateStamp = 1;
		hateRows = [{
			id: "player",
			ce: save.hate.ce,
			ve: save.hate.ve,
			stamp: 1
		}];
	}
	syncLiveHate();
	pulled = !save.ko && anyHate();
	liveHareHp = save.hareHp;
	liveHareRespawn = 0;
	liveKinHp = HARE.hpNatural;
	liveKinTp = 0;
	liveKinRespawn = 0;
	kinHateRows = [];
	kinHateStamp = 0;
	liveHareDebuffs = [];
	liveStatDown = null;
	bubbleStr = 0;
	bubbleStrLeft = 0;
	liveEnfeebles = [];
	clearStepStacks("hare");
	clearStepStacks("kin");
	liveAilments = [];
	liveWeakness = null;
	livePending = null;
	liveBanish = null;
	pendingDots = [];
	miseryWound = 0;
	auspiceRamp = 0;
	liveShot = null;
	clearActionLocks();
	restoreSkillchain(save.skillchain);
	setExtra(carried);
	setAfkSeconds(save.afk.seconds);
	writePlace(save.position.x, save.position.z, true);
	for (const id of Object.keys(liveTrusts)) {
		delete liveTrusts[id];
		clearTrustPlace(id);
	}
	noteTrustBlue(save.blueSet ?? [], save.jobLevels?.BLU ?? 0);
	for (const id of save.party.summoned) {
		if (!trustById(id)) continue;
		liveTrusts[id] = makeLiveTrust(id, trustSubOf(save.party, id), trustGearOf(save.party, id));
	}
	useGame.setState({
		started: save.started,
		screen: save.zone,
		equipOpen: save.zone !== "battle",
		hotbar,
		gambits: save.gambits,
		party: save.party,
		jobLevels: save.jobLevels,
		trustVitals: trustVitalsNow(),
		targeted: save.engaged && !save.ko,
		selfTargeted: false,
		trustTargeted: null,
		petTargeted: null,
		pets: [],
		crystalTargeted: false,
		manualTargeted: false,
		manualPage: "closed",
		fov: readFov(carried?.fov),
		homeAt: save.homeAt,
		gil: save.gil,
		exp: save.exp,
		expByJob: save.expByJob,
		inventory: save.inventory,
		quests: save.quests,
		flags: save.flags,
		blueLearned: save.blueLearned,
		blueSet: save.blueSet,
		autoHead: asAutoHead(save.autoHead),
		autoFrame: asAutoFrame(save.autoFrame),
		autoSet: save.autoSet,
		crystals: save.crystals ?? emptyCrystals(),
		magian: liveMagian,
		craftSkill: save.craftSkill ?? emptyCraftSkill(),
		craftStock: save.craftStock ?? {},
		rankPoints: save.rankPoints ?? 0,
		conquestPoints: save.conquestPoints ?? 0,
		afkFarm: save.afkFarm ?? null,
		skills: save.skills,
		homeAsk: false,
		crystalHeal: null,
		regenPulse: null,
		refreshPulse: null,
		tpPulse: null,
		ko: save.ko,
		engaged: save.engaged && !save.ko,
		hp: clampPool(save.hp, sheet.hp),
		hpGift: 0,
		mp: clampPool(save.mp, sheet.mp),
		healPhase: "off",
		engageAfterHeal: false,
		loadout,
		gearBase,
		equipSets,
		gearMode: save.engaged && !save.ko ? "tp" : "idle",
		race: save.race,
		mainJob: save.mainJob,
		subJob: save.subJob,
		selectedId: null,
		sheet,
		tp: save.tp,
		hareTp: save.hareTp,
		hareHp: liveHareHp,
		hareRespawn: 0,
		quarry: "hare",
		kinHp: liveKinHp,
		kinTp: 0,
		kinRespawn: 0,
		...kinHateState(),
		dealt: save.afk.dealt,
		swings: save.afk.swings,
		buffs: liveBuffs.map((buff) => ({ ...buff })),
		recasts: { ...liveRecasts },
		...hateNow(),
		ailments: [],
		weakness: null,
		pendingRaise: null,
		banishDown: null,
		hareDebuffs: [],
		statDown: null,
		hareEnfeebles: [],
		hareAction: null,
		cast: null,
		wsMotion: null,
		abilityMotion: null,
		wsMark: null,
		spellMark: null,
		spikeMark: null,
		dotQueue: [],
		log: save.log.map((line) => ({
			id: logSeq++,
			text: line.text,
			kind: line.kind
		})),
		...lockState()
	});
}
/** Local blob or the server yard, whichever was written later. */
export async function loadNewestSave() {
	await hydrateYardSave();
	if (yardClosed) return false;
	const remoteText = await readRemoteYard();
	const remote = progressFromText(remoteText);
	const local = readStoredSave(browserStorage());
	const remoteAt = remote?.save.savedAt ?? 0;
	const localAt = local?.save.savedAt ?? 0;
	const remoteReal = !!remote && isRealProgress(remote.save);
	const localReal = !!local && isRealProgress(local.save);
	if (remote && local && remoteReal && localReal && remote.save.revision !== local.save.revision) {
		const newer = remote.save.revision > local.save.revision ? remote : local;
		const newerText = newer === remote ? remoteText : null;
		applyingSave = true;
		try {
			applyLoaded(newer.save, newer.extra);
			if (newerText) writeSerialized(newerText);
		} finally {
			applyingSave = false;
		}
		return true;
	}
	if (remote && remoteText && remoteReal && !localReal) {
		applyingSave = true;
		try {
			applyLoaded(remote.save, remote.extra);
			writeSerialized(remoteText);
		} finally {
			applyingSave = false;
		}
		return true;
	}
	if (local && localReal && !remoteReal) {
		applyingSave = true;
		try {
			applyLoaded(local.save, local.extra);
		} finally {
			applyingSave = false;
		}
		return true;
	}
	if (remote && remoteText && remoteAt >= localAt && remoteAt > 0) {
		applyingSave = true;
		try {
			applyLoaded(remote.save, remote.extra);
			writeSerialized(remoteText);
		} finally {
			applyingSave = false;
		}
		return true;
	}
	if (local) {
		applyingSave = true;
		try {
			applyLoaded(local.save, local.extra);
		} finally {
			applyingSave = false;
		}
		return true;
	}
	return false;
}
/** Copy of the blob just written. */
export function exportSaveText() {
	saveSettings();
	return browserStorage()?.getItem("aetherfold-idle-save") ?? "";
}
/** Forget every stored blob and the older keys, then reload into a new game. */
export function resetProgress() {
	yardClosed = true;
	yardPending = null;
	if (yardTimer != null) {
		clearTimeout(yardTimer);
		yardTimer = null;
	}
	resetStored();
	const stamp = Date.now() + 1;
	(async () => {
		try {
			await clearYardSave({ data: { stamp } });
		} catch {
			try {
				await clearYardSave({ data: { stamp } });
			} catch {}
		}
		if (typeof location !== "undefined") location.reload();
	})();
}
if (typeof window !== "undefined") try {
	earlyYardRead = readYardSave().then((row) => ({
		ok: true,
		blob: row?.blob ?? null
	}), () => ({
		ok: false,
		blob: null
	}));
} catch {
	earlyYardRead = Promise.resolve({
		ok: false,
		blob: null
	});
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    try {
      // Device copy only. Posting here rewrites the yard file while the page is going away.
      saveSettings(false);
    } catch {
      /* the module is already going away */
    }
  });
}
