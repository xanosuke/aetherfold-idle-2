/**
 * Retail magic terms that are fully published. No merits and no job points.
 *
 * Magic accuracy from the stat difference is the BG-Wiki Magic Accuracy
 * table. Black magic uses INT, white magic uses MND, songs use CHR, Quick
 * Draw uses AGI, and ninjutsu uses no dSTAT. The difference caps at ±30.
 *
 * Elemental D is the BG-Wiki Magic Damage table. D = mDMG + V + (adjusted
 * dINT × M), then floored. The band's V already includes the INT below
 * that band, so only the INT inside the band is multiplied. A negative
 * dINT uses a reduced M that the page does not number, so that damage is
 * left unknown instead of invented.
 *
 * Stone: V 10 M 2 from 0, V 110 M 1 from 50, V 160 M 0 from 100. Cap 160.
 * Stone II: V 100 M 3, V 250 M 2 from 50, V 350 M 1 from 100, V 450 M 0
 * from 200. Cap 450. Stone III: V 200 M 4, V 400 M 3 from 50, V 550 M 2
 * from 100, V 750 M 1 from 200, V 850 M 0 from 300. Cap 850. Stone IV:
 * V 400 M 5, V 650 M 4 from 50, V 850 M 3 from 100, V 1150 M 2 from 200,
 * V 1350 M 1 from 300, V 1450 M 0 from 400. Cap 1450. The last band's M of
 * 0 freezes D at that cap. No band is invented past it.
 *
 * Water: V 25 M 1.8 from 0, V 115 M 1 from 50, V 165 M 0 from 100. Cap 165.
 * Water II: V 120 M 2.8, V 260 M 1.9 from 50, V 355 M 1 from 100, V 455 M 0
 * from 200. Cap 455. Water III: V 230 M 3.7, V 415 M 2.9 from 50, V 560 M 1.95
 * from 100, V 755 M 1 from 200, V 855 M 0 from 300. Cap 855. Water IV:
 * V 440 M 4.7, V 675 M 3.9 from 50, V 870 M 2.95 from 100, V 1165 M 1.99
 * from 200, V 1364 M 1 from 300, V 1464 M 0 from 400. Cap 1464.
 *
 * Aero: V 40 M 1.6 from 0, V 120 M 1 from 50, V 170 M 0 from 100. Cap 170.
 * Aero II: V 140 M 2.6, V 270 M 1.8 from 50, V 360 M 1 from 100, V 460 M 0
 * from 200. Cap 460. Aero III: V 260 M 3.4, V 430 M 2.8 from 50, V 570 M 1.9
 * from 100, V 760 M 1 from 200, V 860 M 0 from 300. Cap 860. Aero IV:
 * V 480 M 4.4, V 700 M 3.8 from 50, V 890 M 2.9 from 100, V 1180 M 1.98
 * from 200, V 1378 M 1 from 300, V 1478 M 0 from 400. Cap 1478.
 *
 * Fire: V 55 M 1.4 from 0, V 125 M 1 from 50, V 175 M 0 from 100. Cap 175.
 * Fire II: V 160 M 2.4, V 280 M 1.7 from 50, V 365 M 1 from 100, V 465 M 0
 * from 200. Cap 465. Fire III: V 290 M 3.1, V 445 M 2.7 from 50, V 580 M 1.85
 * from 100, V 765 M 1 from 200, V 865 M 0 from 300. Cap 865. Fire IV:
 * V 520 M 4.2, V 730 M 3.7 from 50, V 915 M 2.85 from 100, V 1195 M 1.97
 * from 200, V 1397 M 1 from 300, V 1497 M 0 from 400. Cap 1497. The 200
 * and 300 bands use those published V values. They are not the number the
 * previous multiplier would have reached.
 *
 * Blizzard: V 70 M 1.2 from 0, V 130 M 1 from 50, V 180 M 0 from 100. Cap 180.
 * Blizzard II: V 180 M 2.2, V 290 M 1.6 from 50, V 370 M 1 from 100, V 470 M 0
 * from 200. Cap 470. Blizzard III: V 320 M 2.8, V 460 M 2.6 from 50, V 590 M 1.8
 * from 100, V 770 M 1 from 200, V 870 M 0 from 300. Cap 870. Blizzard IV:
 * V 560 M 3.9, V 755 M 3.6 from 50, V 935 M 2.8 from 100, V 1210 M 1.96
 * from 200, V 1411 M 1 from 300, V 1511 M 0 from 400. Cap 1511. The 200
 * and 300 bands use those published V values. They are not the number the
 * previous multiplier would have reached.
 *
 * Thunder: V 85 M 1 from 0, V 135 M 1 from 50, V 185 M 0 from 100. Cap 185.
 * Thunder II: V 200 M 2, V 300 M 1.5 from 50, V 375 M 1 from 100, V 475 M 0
 * from 200. Cap 475. Thunder III: V 350 M 2.5, V 475 M 2.5 from 50, V 600 M 1.75
 * from 100, V 775 M 1 from 200, V 875 M 0 from 300. Cap 875. Thunder IV:
 * V 600 M 3.6, V 780 M 3.5 from 50, V 955 M 2.75 from 100, V 1225 M 1.95
 * from 200, V 1425 M 1 from 300, V 1525 M 0 from 400. Cap 1525. The 200
 * and 300 bands use those published V values. They are not the number the
 * previous multiplier would have reached.
 *
 * Stonega is area earth, not a single-target tier. V 60 M 3 from 0, V 210
 * M 2 from 50, V 310 M 1 from 100, V 410 M 0 from 200. Cap 410. Stonega II:
 * V 250 M 4, V 450 M 3 from 50, V 600 M 2 from 100, V 800 M 1 from 200,
 * V 900 M 0 from 300. Cap 900. Stonega III: V 500 M 5, V 750 M 4 from 50,
 * V 950 M 3 from 100, V 1250 M 2 from 200, V 1450 M 1 from 300, V 1550 M 0
 * from 400. Cap 1550. The last band's M of 0 freezes D at that cap.
 *
 * Blizzaga is area ice, not a single-target tier. V 160 M 2.2 from 0,
 * V 270 M 1.6 from 50, V 350 M 1 from 100, V 450 M 0 from 200. Cap 450.
 * Blizzaga II: V 370 M 2.8, V 510 M 2.6 from 50, V 640 M 1.8 from 100,
 * V 820 M 1 from 200, V 920 M 0 from 300. Cap 920. Blizzaga III: V 660 M 3.9,
 * V 855 M 3.6 from 50, V 1035 M 2.8 from 100, V 1310 M 1.96 from 200,
 * V 1511 M 1 from 300, V 1611 M 0 from 400. Cap 1611. The 200 and 300 bands
 * use those published V values. They are not the number the previous
 * multiplier would have reached.
 *
 * Aeroga is area wind, not a single-target tier. V 100 M 2.6 from 0,
 * V 230 M 1.8 from 50, V 320 M 1 from 100, V 420 M 0 from 200. Cap 420.
 * Aeroga II: V 310 M 3.4, V 480 M 2.8 from 50, V 620 M 1.9 from 100,
 * V 810 M 1 from 200, V 910 M 0 from 300. Cap 910. Aeroga III: V 580 M 4.4,
 * V 800 M 3.8 from 50, V 990 M 2.9 from 100, V 1280 M 1.98 from 200,
 * V 1478 M 1 from 300, V 1578 M 0 from 400. Cap 1578.
 *
 * Firaga is area fire, not a single-target tier. V 120 M 2.4 from 0,
 * V 240 M 1.7 from 50, V 325 M 1 from 100, V 425 M 0 from 200. Cap 425.
 * Firaga II: V 340 M 3.1, V 495 M 2.7 from 50, V 630 M 1.85 from 100,
 * V 815 M 1 from 200, V 915 M 0 from 300. Cap 915. Firaga III: V 620 M 4.2,
 * V 830 M 3.7 from 50, V 1015 M 2.85 from 100, V 1295 M 1.97 from 200,
 * V 1497 M 1 from 300, V 1597 M 0 from 400. Cap 1597. The 200 and 300 bands
 * use those published V values. They are not the number the previous
 * multiplier would have reached.
 *
 * Waterga is area water, not a single-target tier. V 80 M 2.8 from 0,
 * V 220 M 1.9 from 50, V 315 M 1 from 100, V 415 M 0 from 200. Cap 415.
 * Waterga II: V 280 M 3.7, V 465 M 2.9 from 50, V 610 M 1.95 from 100,
 * V 805 M 1 from 200, V 905 M 0 from 300. Cap 905. Waterga III: V 540 M 4.7,
 * V 775 M 3.9 from 50, V 970 M 2.95 from 100, V 1265 M 1.99 from 200,
 * V 1464 M 1 from 300, V 1564 M 0 from 400. Cap 1564.
 *
 * Thundaga is area lightning, not a single-target tier. V 200 M 2 from 0,
 * V 300 M 1.5 from 50, V 375 M 1 from 100, V 475 M 0 from 200. Cap 475.
 * Thundaga II: V 400 M 2.5, V 525 M 2.5 from 50, V 650 M 1.75 from 100,
 * V 825 M 1 from 200, V 925 M 0 from 300. Cap 925. Thundaga III: V 700 M 3.6,
 * V 880 M 3.5 from 50, V 1055 M 2.75 from 100, V 1325 M 1.95 from 200,
 * V 1525 M 1 from 300, V 1625 M 0 from 400. Cap 1625. The 200 and 300 bands
 * use those published V values. They are not the number the previous
 * multiplier would have reached.
 *
 * Ancient magic is one shared row for Freeze, Tornado, Quake, Burst, Flood,
 * and Flare. It is not six different tables, and it is not a merit tier.
 * V 700 M 2 from 0, V 800 M 2 from 50, V 900 M 2 from 100, V 1100 M 2 from
 * 200, V 1300 M 2 from 300, V 1500 M 2 from 400, V 1700 M 2 from 500, and
 * V 1900 M 0 from 600. Cap 1900. M stays 2 until that last band.
 *
 * Geomancer -ra is area elemental magic centered on the caster, 10'.
 * The Magic Damage table names the wind spell Aerora. The spell page and
 * the client call it Aera. These rows use Aera.
 * Stonera: V 150 M 3 from 0, V 300 M 2 from 50, V 400 M 1 from 100,
 * V 500 M 0 from 200. Cap 500. Watera: V 180 M 2.8, V 320 M 1.9 from 50,
 * V 415 M 1 from 100, V 515 M 0 from 200. Cap 515. Aera: V 210 M 2.6,
 * V 340 M 1.8 from 50, V 430 M 1 from 100, V 530 M 0 from 200. Cap 530.
 * Fira: V 240 M 2.4, V 360 M 1.7 from 50, V 445 M 1 from 100, V 545 M 0
 * from 200. Cap 545. The Fira spell page prints 140 at dINT 0. That does
 * not meet 360 at dINT 50 with M 2.4. The Magic Damage row, 240, does.
 * Blizzara: V 270 M 2.2, V 380 M 1.6 from 50, V 460 M 1 from 100, V 560 M 0
 * from 200. Cap 560. Thundara: V 300 M 2, V 400 M 1.5 from 50, V 475 M 1
 * from 100, V 575 M 0 from 200. Cap 575.
 * Stonera II: V 350 M 4, V 550 M 3 from 50, V 700 M 2 from 100, V 900 M 0
 * from 200. Cap 900. Watera II: V 390 M 3.7, V 575 M 2.9 from 50, V 720
 * M 1.95 from 100, V 915 M 0 from 200. Cap 915. The page prints no dINT 200
 * row, so the next step is M 0, the same shape as a tier-1 -ga. Aera II is
 * 80 and Fira II is 85. They are not in this kit.
 *
 * Magic Attack Bonus divides by Magic Defense Bonus after D.
 * (100 + MAB) / (100 + MDB), and the target's MDB factor is at least 0.5.
 * The result of that multiplication is floored. Day, weather, staff
 * element, affinity, resist, and magic burst are separate multipliers and
 * stay at 1 unless a later system sets them. An ash staff is not an
 * elemental staff, so it is not the 0.9 staff case.
 *
 * Elemental Celerity shortens elemental casting time only. It does not
 * change recast. There is no published minimum cast to invent.
 */

import { rollCombat } from "./cor";

export type MagicSchool = "black" | "white" | "song" | "quickdraw" | "ninjutsu";

export type NukeName = "Stone" | "Water" | "Aero" | "Fire" | "Blizzard" | "Thunder";

/** Tier-1 nukes, the published single-target tiers, the area lines, and ancient magic. */
export type ElementalSpell =
  | NukeName
  | "Stone II"
  | "Stone III"
  | "Stone IV"
  | "Water II"
  | "Water III"
  | "Water IV"
  | "Aero II"
  | "Aero III"
  | "Aero IV"
  | "Fire II"
  | "Fire III"
  | "Fire IV"
  | "Blizzard II"
  | "Blizzard III"
  | "Blizzard IV"
  | "Thunder II"
  | "Thunder III"
  | "Thunder IV"
  | "Stonega"
  | "Stonega II"
  | "Stonega III"
  | "Blizzaga"
  | "Blizzaga II"
  | "Blizzaga III"
  | "Aeroga"
  | "Aeroga II"
  | "Aeroga III"
  | "Firaga"
  | "Firaga II"
  | "Firaga III"
  | "Waterga"
  | "Waterga II"
  | "Waterga III"
  | "Thundaga"
  | "Thundaga II"
  | "Thundaga III"
  | "Freeze"
  | "Tornado"
  | "Quake"
  | "Burst"
  | "Flood"
  | "Flare"
  | "Stonera"
  | "Stonera II"
  | "Watera"
  | "Watera II"
  | "Aera"
  | "Fira"
  | "Blizzara"
  | "Thundara";

type Band = { at: number; v: number; m: number };

/** Freeze through Flare. The Magic Damage page prints this once, as Ancient Magic. */
const ANCIENT_BANDS: readonly Band[] = [
  { at: 0, v: 700, m: 2 },
  { at: 50, v: 800, m: 2 },
  { at: 100, v: 900, m: 2 },
  { at: 200, v: 1100, m: 2 },
  { at: 300, v: 1300, m: 2 },
  { at: 400, v: 1500, m: 2 },
  { at: 500, v: 1700, m: 2 },
  { at: 600, v: 1900, m: 0 },
];

/** Elemental nukes whose INT bands are published. The -ga lines are the area spells. Ancient magic shares one row. */
const NUKES: Record<ElementalSpell, readonly Band[]> = {
  Stone: [
    { at: 0, v: 10, m: 2 },
    { at: 50, v: 110, m: 1 },
    { at: 100, v: 160, m: 0 },
  ],
  "Stone II": [
    { at: 0, v: 100, m: 3 },
    { at: 50, v: 250, m: 2 },
    { at: 100, v: 350, m: 1 },
    { at: 200, v: 450, m: 0 },
  ],
  "Stone III": [
    { at: 0, v: 200, m: 4 },
    { at: 50, v: 400, m: 3 },
    { at: 100, v: 550, m: 2 },
    { at: 200, v: 750, m: 1 },
    { at: 300, v: 850, m: 0 },
  ],
  "Stone IV": [
    { at: 0, v: 400, m: 5 },
    { at: 50, v: 650, m: 4 },
    { at: 100, v: 850, m: 3 },
    { at: 200, v: 1150, m: 2 },
    { at: 300, v: 1350, m: 1 },
    { at: 400, v: 1450, m: 0 },
  ],
  Water: [
    { at: 0, v: 25, m: 1.8 },
    { at: 50, v: 115, m: 1 },
    { at: 100, v: 165, m: 0 },
  ],
  "Water II": [
    { at: 0, v: 120, m: 2.8 },
    { at: 50, v: 260, m: 1.9 },
    { at: 100, v: 355, m: 1 },
    { at: 200, v: 455, m: 0 },
  ],
  "Water III": [
    { at: 0, v: 230, m: 3.7 },
    { at: 50, v: 415, m: 2.9 },
    { at: 100, v: 560, m: 1.95 },
    { at: 200, v: 755, m: 1 },
    { at: 300, v: 855, m: 0 },
  ],
  "Water IV": [
    { at: 0, v: 440, m: 4.7 },
    { at: 50, v: 675, m: 3.9 },
    { at: 100, v: 870, m: 2.95 },
    { at: 200, v: 1165, m: 1.99 },
    { at: 300, v: 1364, m: 1 },
    { at: 400, v: 1464, m: 0 },
  ],
  Aero: [
    { at: 0, v: 40, m: 1.6 },
    { at: 50, v: 120, m: 1 },
    { at: 100, v: 170, m: 0 },
  ],
  "Aero II": [
    { at: 0, v: 140, m: 2.6 },
    { at: 50, v: 270, m: 1.8 },
    { at: 100, v: 360, m: 1 },
    { at: 200, v: 460, m: 0 },
  ],
  "Aero III": [
    { at: 0, v: 260, m: 3.4 },
    { at: 50, v: 430, m: 2.8 },
    { at: 100, v: 570, m: 1.9 },
    { at: 200, v: 760, m: 1 },
    { at: 300, v: 860, m: 0 },
  ],
  "Aero IV": [
    { at: 0, v: 480, m: 4.4 },
    { at: 50, v: 700, m: 3.8 },
    { at: 100, v: 890, m: 2.9 },
    { at: 200, v: 1180, m: 1.98 },
    { at: 300, v: 1378, m: 1 },
    { at: 400, v: 1478, m: 0 },
  ],
  Fire: [
    { at: 0, v: 55, m: 1.4 },
    { at: 50, v: 125, m: 1 },
    { at: 100, v: 175, m: 0 },
  ],
  "Fire II": [
    { at: 0, v: 160, m: 2.4 },
    { at: 50, v: 280, m: 1.7 },
    { at: 100, v: 365, m: 1 },
    { at: 200, v: 465, m: 0 },
  ],
  "Fire III": [
    { at: 0, v: 290, m: 3.1 },
    { at: 50, v: 445, m: 2.7 },
    { at: 100, v: 580, m: 1.85 },
    { at: 200, v: 765, m: 1 },
    { at: 300, v: 865, m: 0 },
  ],
  "Fire IV": [
    { at: 0, v: 520, m: 4.2 },
    { at: 50, v: 730, m: 3.7 },
    { at: 100, v: 915, m: 2.85 },
    { at: 200, v: 1195, m: 1.97 },
    { at: 300, v: 1397, m: 1 },
    { at: 400, v: 1497, m: 0 },
  ],
  Blizzard: [
    { at: 0, v: 70, m: 1.2 },
    { at: 50, v: 130, m: 1 },
    { at: 100, v: 180, m: 0 },
  ],
  "Blizzard II": [
    { at: 0, v: 180, m: 2.2 },
    { at: 50, v: 290, m: 1.6 },
    { at: 100, v: 370, m: 1 },
    { at: 200, v: 470, m: 0 },
  ],
  "Blizzard III": [
    { at: 0, v: 320, m: 2.8 },
    { at: 50, v: 460, m: 2.6 },
    { at: 100, v: 590, m: 1.8 },
    { at: 200, v: 770, m: 1 },
    { at: 300, v: 870, m: 0 },
  ],
  "Blizzard IV": [
    { at: 0, v: 560, m: 3.9 },
    { at: 50, v: 755, m: 3.6 },
    { at: 100, v: 935, m: 2.8 },
    { at: 200, v: 1210, m: 1.96 },
    { at: 300, v: 1411, m: 1 },
    { at: 400, v: 1511, m: 0 },
  ],
  Thunder: [
    { at: 0, v: 85, m: 1 },
    { at: 50, v: 135, m: 1 },
    { at: 100, v: 185, m: 0 },
  ],
  "Thunder II": [
    { at: 0, v: 200, m: 2 },
    { at: 50, v: 300, m: 1.5 },
    { at: 100, v: 375, m: 1 },
    { at: 200, v: 475, m: 0 },
  ],
  "Thunder III": [
    { at: 0, v: 350, m: 2.5 },
    { at: 50, v: 475, m: 2.5 },
    { at: 100, v: 600, m: 1.75 },
    { at: 200, v: 775, m: 1 },
    { at: 300, v: 875, m: 0 },
  ],
  "Thunder IV": [
    { at: 0, v: 600, m: 3.6 },
    { at: 50, v: 780, m: 3.5 },
    { at: 100, v: 955, m: 2.75 },
    { at: 200, v: 1225, m: 1.95 },
    { at: 300, v: 1425, m: 1 },
    { at: 400, v: 1525, m: 0 },
  ],
  Stonega: [
    { at: 0, v: 60, m: 3 },
    { at: 50, v: 210, m: 2 },
    { at: 100, v: 310, m: 1 },
    { at: 200, v: 410, m: 0 },
  ],
  "Stonega II": [
    { at: 0, v: 250, m: 4 },
    { at: 50, v: 450, m: 3 },
    { at: 100, v: 600, m: 2 },
    { at: 200, v: 800, m: 1 },
    { at: 300, v: 900, m: 0 },
  ],
  "Stonega III": [
    { at: 0, v: 500, m: 5 },
    { at: 50, v: 750, m: 4 },
    { at: 100, v: 950, m: 3 },
    { at: 200, v: 1250, m: 2 },
    { at: 300, v: 1450, m: 1 },
    { at: 400, v: 1550, m: 0 },
  ],
  Blizzaga: [
    { at: 0, v: 160, m: 2.2 },
    { at: 50, v: 270, m: 1.6 },
    { at: 100, v: 350, m: 1 },
    { at: 200, v: 450, m: 0 },
  ],
  "Blizzaga II": [
    { at: 0, v: 370, m: 2.8 },
    { at: 50, v: 510, m: 2.6 },
    { at: 100, v: 640, m: 1.8 },
    { at: 200, v: 820, m: 1 },
    { at: 300, v: 920, m: 0 },
  ],
  "Blizzaga III": [
    { at: 0, v: 660, m: 3.9 },
    { at: 50, v: 855, m: 3.6 },
    { at: 100, v: 1035, m: 2.8 },
    { at: 200, v: 1310, m: 1.96 },
    { at: 300, v: 1511, m: 1 },
    { at: 400, v: 1611, m: 0 },
  ],
  Aeroga: [
    { at: 0, v: 100, m: 2.6 },
    { at: 50, v: 230, m: 1.8 },
    { at: 100, v: 320, m: 1 },
    { at: 200, v: 420, m: 0 },
  ],
  "Aeroga II": [
    { at: 0, v: 310, m: 3.4 },
    { at: 50, v: 480, m: 2.8 },
    { at: 100, v: 620, m: 1.9 },
    { at: 200, v: 810, m: 1 },
    { at: 300, v: 910, m: 0 },
  ],
  "Aeroga III": [
    { at: 0, v: 580, m: 4.4 },
    { at: 50, v: 800, m: 3.8 },
    { at: 100, v: 990, m: 2.9 },
    { at: 200, v: 1280, m: 1.98 },
    { at: 300, v: 1478, m: 1 },
    { at: 400, v: 1578, m: 0 },
  ],
  Firaga: [
    { at: 0, v: 120, m: 2.4 },
    { at: 50, v: 240, m: 1.7 },
    { at: 100, v: 325, m: 1 },
    { at: 200, v: 425, m: 0 },
  ],
  "Firaga II": [
    { at: 0, v: 340, m: 3.1 },
    { at: 50, v: 495, m: 2.7 },
    { at: 100, v: 630, m: 1.85 },
    { at: 200, v: 815, m: 1 },
    { at: 300, v: 915, m: 0 },
  ],
  "Firaga III": [
    { at: 0, v: 620, m: 4.2 },
    { at: 50, v: 830, m: 3.7 },
    { at: 100, v: 1015, m: 2.85 },
    { at: 200, v: 1295, m: 1.97 },
    { at: 300, v: 1497, m: 1 },
    { at: 400, v: 1597, m: 0 },
  ],
  Waterga: [
    { at: 0, v: 80, m: 2.8 },
    { at: 50, v: 220, m: 1.9 },
    { at: 100, v: 315, m: 1 },
    { at: 200, v: 415, m: 0 },
  ],
  "Waterga II": [
    { at: 0, v: 280, m: 3.7 },
    { at: 50, v: 465, m: 2.9 },
    { at: 100, v: 610, m: 1.95 },
    { at: 200, v: 805, m: 1 },
    { at: 300, v: 905, m: 0 },
  ],
  "Waterga III": [
    { at: 0, v: 540, m: 4.7 },
    { at: 50, v: 775, m: 3.9 },
    { at: 100, v: 970, m: 2.95 },
    { at: 200, v: 1265, m: 1.99 },
    { at: 300, v: 1464, m: 1 },
    { at: 400, v: 1564, m: 0 },
  ],
  Thundaga: [
    { at: 0, v: 200, m: 2 },
    { at: 50, v: 300, m: 1.5 },
    { at: 100, v: 375, m: 1 },
    { at: 200, v: 475, m: 0 },
  ],
  "Thundaga II": [
    { at: 0, v: 400, m: 2.5 },
    { at: 50, v: 525, m: 2.5 },
    { at: 100, v: 650, m: 1.75 },
    { at: 200, v: 825, m: 1 },
    { at: 300, v: 925, m: 0 },
  ],
  "Thundaga III": [
    { at: 0, v: 700, m: 3.6 },
    { at: 50, v: 880, m: 3.5 },
    { at: 100, v: 1055, m: 2.75 },
    { at: 200, v: 1325, m: 1.95 },
    { at: 300, v: 1525, m: 1 },
    { at: 400, v: 1625, m: 0 },
  ],
  Freeze: ANCIENT_BANDS,
  Tornado: ANCIENT_BANDS,
  Quake: ANCIENT_BANDS,
  Burst: ANCIENT_BANDS,
  Flood: ANCIENT_BANDS,
  Flare: ANCIENT_BANDS,
  Stonera: [
    { at: 0, v: 150, m: 3 },
    { at: 50, v: 300, m: 2 },
    { at: 100, v: 400, m: 1 },
    { at: 200, v: 500, m: 0 },
  ],
  "Stonera II": [
    { at: 0, v: 350, m: 4 },
    { at: 50, v: 550, m: 3 },
    { at: 100, v: 700, m: 2 },
    { at: 200, v: 900, m: 0 },
  ],
  Watera: [
    { at: 0, v: 180, m: 2.8 },
    { at: 50, v: 320, m: 1.9 },
    { at: 100, v: 415, m: 1 },
    { at: 200, v: 515, m: 0 },
  ],
  "Watera II": [
    { at: 0, v: 390, m: 3.7 },
    { at: 50, v: 575, m: 2.9 },
    { at: 100, v: 720, m: 1.95 },
    { at: 200, v: 915, m: 0 },
  ],
  Aera: [
    { at: 0, v: 210, m: 2.6 },
    { at: 50, v: 340, m: 1.8 },
    { at: 100, v: 430, m: 1 },
    { at: 200, v: 530, m: 0 },
  ],
  Fira: [
    { at: 0, v: 240, m: 2.4 },
    { at: 50, v: 360, m: 1.7 },
    { at: 100, v: 445, m: 1 },
    { at: 200, v: 545, m: 0 },
  ],
  Blizzara: [
    { at: 0, v: 270, m: 2.2 },
    { at: 50, v: 380, m: 1.6 },
    { at: 100, v: 460, m: 1 },
    { at: 200, v: 560, m: 0 },
  ],
  Thundara: [
    { at: 0, v: 300, m: 2 },
    { at: 50, v: 400, m: 1.5 },
    { at: 100, v: 475, m: 1 },
    { at: 200, v: 575, m: 0 },
  ],
};

/** Which base stat a spell's dSTAT uses. Ninjutsu is unaffected. */
export function accuracyStat(school: MagicSchool): "int" | "mnd" | "chr" | "agi" | null {
  if (school === "black") return "int";
  if (school === "white") return "mnd";
  if (school === "song") return "chr";
  if (school === "quickdraw") return "agi";
  return null;
}

/**
 * Magic accuracy added by dSTAT. Caps at ±30 once |dSTAT| reaches 70.
 * Inside ±10 the rate is 1:1. From 10 to 30 it is 1 per 2. From 30 to 70
 * it is 1 per 4. The negative side mirrors that.
 */
export function dStatMagicAccuracy(dStat: number): number {
  if (dStat > 70) return 30;
  if (dStat >= 30) return 20 + Math.floor((dStat - 30) / 4);
  if (dStat >= 10) return 10 + Math.floor((dStat - 10) / 2);
  if (dStat >= -10) return dStat;
  if (dStat >= -30) return -10 + Math.floor((dStat + 10) / 2);
  if (dStat >= -70) return -20 + Math.floor((dStat + 30) / 4);
  return -30;
}

/**
 * INT-adjusted base damage for a published nuke. Null when dINT is negative.
 * mDMG is the Magic Damage stat from gear. Naked is 0. The last band with
 * M 0 is the cap: extra dINT does not add another step.
 */
export function elementalD(spell: ElementalSpell, dInt: number, mDmg = 0): number | null {
  if (dInt < 0) return null;
  let band: Band = NUKES[spell][0];
  for (const row of NUKES[spell]) if (dInt >= row.at) band = row;
  return Math.floor(mDmg + band.v + (dInt - band.at) * band.m);
}

/**
 * Helix I on the Magic Damage page. The bands are not the 50-wide nuke bands.
 * 0–77 is V 25 and M 1. 78–234 is V 103 and M 0.5. 235 and up is V 181 and M 0.
 * dINT 38 is 63 and dINT 58 is 83, which is the talk page's no-MAB check.
 * Negative dINT is not printed for this row. Magic Damage gear is mDMG. Naked is 0.
 */
const HELIX_BANDS: readonly Band[] = [
  { at: 0, v: 25, m: 1 },
  { at: 78, v: 103, m: 0.5 },
  { at: 235, v: 181, m: 0 },
];

export function helixD(dInt: number, mDmg = 0): number | null {
  if (dInt < 0) return null;
  let band: Band = HELIX_BANDS[0];
  for (const row of HELIX_BANDS) if (dInt >= row.at) band = row;
  return Math.floor(mDmg + band.v + (dInt - band.at) * band.m);
}

/**
 * Base cast multiplied by (1 − Elemental Celerity). Recast is not passed
 * through here. No floor is applied; the page does not publish one.
 */
export function elementalCastSeconds(base: number, celerityFraction: number): number {
  return base * (1 - celerityFraction);
}

/** (100 + MAB) / (100 + MDB), with the defender's factor floored at 0.5. */
export function mabRatio(mab: number, mdb = 0): number {
  const caster = 1 + mab / 100;
  const target = Math.max(0.5, 1 + mdb / 100);
  return caster / target;
}

/** One floored multiplication of D by the MAB/MDB ratio. */
export function applyMab(d: number, mab: number, mdb = 0): number {
  return Math.floor(d * mabRatio(mab, mdb));
}

export type SpikeSpell = "Blaze Spikes" | "Ice Spikes" | "Shock Spikes";

/** Three minutes. The same for all three. */
export const SPIKE_SECONDS = 180;

const SPIKE_DIV: Record<SpikeSpell, number> = {
  "Blaze Spikes": 12,
  "Ice Spikes": 20,
  "Shock Spikes": 20,
};

const SPIKE_CAP: Record<SpikeSpell, number> = {
  "Blaze Spikes": 25,
  "Ice Spikes": 15,
  "Shock Spikes": 15,
};

/**
 * Base spike damage from INT at the moment of the cast.
 * floor((INT + 50) / 12) for Blaze, cap 25. floor((INT + 50) / 20) for Ice and Shock, cap 15.
 * Magic Attack Bonus is not in this step.
 */
export function spikeBase(spell: SpikeSpell, int: number): number {
  const raw = Math.floor((int + 50) / SPIKE_DIV[spell]);
  return Math.min(SPIKE_CAP[spell], Math.max(0, raw));
}

/**
 * Damage when a melee hit connects. floor(base × (1 + MAB/100)).
 * MAB is the gear on at the hit, not at the cast. Day, weather, and affinity stay 1.
 * This is not the nuke MAB/MDB ratio.
 */
export function spikeDamage(base: number, mab: number): number {
  return Math.floor(base * (1 + mab / 100));
}

export type ElementDebuff = "Burn" | "Frost" | "Choke" | "Rasp" | "Shock" | "Drown";

export type DebuffStat = "str" | "dex" | "vit" | "agi" | "int" | "mnd";

/** The stat each spell lowers. Fire lowers INT, ice AGI, wind VIT, earth DEX, thunder MND, water STR. */
export const DEBUFF_STAT: Record<ElementDebuff, DebuffStat> = {
  Burn: "int",
  Frost: "agi",
  Choke: "vit",
  Rasp: "dex",
  Shock: "mnd",
  Drown: "str",
};

export const DEBUFF_STAT_LABEL: Record<DebuffStat, string> = {
  str: "STR",
  dex: "DEX",
  vit: "VIT",
  agi: "AGI",
  int: "INT",
  mnd: "MND",
};

/**
 * Each spell overwrites the element it is strong against.
 * Burn overwrites Frost, Frost overwrites Choke, Choke overwrites Rasp,
 * Rasp overwrites Shock, Shock overwrites Drown, Drown overwrites Burn.
 */
export const DEBUFF_OVERWRITES: Record<ElementDebuff, ElementDebuff> = {
  Burn: "Frost",
  Frost: "Choke",
  Choke: "Rasp",
  Rasp: "Shock",
  Shock: "Drown",
  Drown: "Burn",
};

/** 1.5 minutes. Merits are not added. */
export const DEBUFF_SECONDS = 90;
/** Damage over time lands on this interval. */
export const DEBUFF_TICK = 3;

/**
 * Stat down and HP per tick from the caster's INT.
 * 1–39: −5 and 1. 40–69: −7 and 2. 70–99: −9 and 3.
 * 100–149: −11 and 4. Above 150: −13 and 5.
 * No merit potency. The target's INT is not in this table.
 */
export function elementDebuffPotency(int: number): { stat: number; dot: number } {
  if (int > 150) return { stat: 13, dot: 5 };
  if (int >= 100) return { stat: 11, dot: 4 };
  if (int >= 70) return { stat: 9, dot: 3 };
  if (int >= 40) return { stat: 7, dot: 2 };
  return { stat: 5, dot: 1 };
}

/**
 * Apply one elemental debuff to the names already on the target.
 * The spell removes the element it beats. If one that beats it is already there, nothing changes.
 */
export function resolveElementDebuff(
  active: readonly ElementDebuff[],
  next: ElementDebuff,
): { active: ElementDebuff[]; landed: boolean; removed: ElementDebuff | null; blockedBy: ElementDebuff | null } {
  const beats = DEBUFF_OVERWRITES[next];
  const blockedBy = active.find((name) => DEBUFF_OVERWRITES[name] === next) ?? null;
  if (blockedBy) return { active: [...active], landed: false, removed: null, blockedBy };
  const removed = active.includes(beats) ? beats : null;
  const kept = active.filter((name) => name !== beats && name !== next);
  return { active: [...kept, next], landed: true, removed, blockedBy: null };
}

/**
 * Advance one debuff by dt seconds. A tick lands each 3 seconds, including the one on the last second.
 * 90 seconds is 30 ticks.
 */
export function debuffTick(left: number, acc: number, dt: number): { left: number; acc: number; ticks: number } {
  let ticks = 0;
  let time = dt;
  while (time > 1e-9 && left > 1e-9) {
    const toTick = Math.max(0, DEBUFF_TICK - acc);
    const step = Math.min(time, toTick, left);
    acc += step;
    left -= step;
    time -= step;
    if (acc >= DEBUFF_TICK - 1e-6) {
      acc -= DEBUFF_TICK;
      ticks += 1;
    }
  }
  return { left: left > 1e-6 ? left : 0, acc, ticks };
}

export type EnfeebleSpell =
  | "Blind"
  | "Blind II"
  | "Bind"
  | "Sleep"
  | "Sleep II"
  | "Sleepga"
  | "Sleepga II"
  | "Paralyze"
  | "Paralyze II"
  | "Silence"
  | "Slow"
  | "Slow II"
  | "Gravity"
  | "Dispel"
  | "Inundation"
  | "Distract"
  | "Frazzle"
  | "Dia"
  | "Dia II"
  | "Dia III"
  | "Diaga"
  | "Poison"
  | "Poison II"
  | "Poisonga"
  | "Bio"
  | "Bio II"
  | "Bio III"
  | "Stun";
/** Repose is light sleep. It is not a tier of the dark Sleep line. */
export type SleepSpell = "Sleep" | "Sleep II" | "Sleepga" | "Sleepga II" | "Repose";

export const BLIND_SECONDS = 180;
/** The page prints 0–60. 60 is the full duration. A partial resist is not rolled. */
export const BIND_SECONDS = 60;
/** Client spell row. Cumulative 1, volatile 165. The BG card leaves volatile blank. */
export const BIND_CE = 1;
export const BIND_VE = 165;

/**
 * Direct damage removes Bind. A slip tick does not.
 * The page says Bind wears off once damage is taken from a non-slip source, and not always before that.
 * The percent is not published. INT is only said to maybe lower it, with no formula, so it is not applied.
 * A miss and a hit for 0 do not count.
 */
export function bindWearsOff(directDamage: number): boolean {
  return directDamage > 0;
}

/**
 * Slow, Paralyze, and Silence. White magic, enfeebling skill.
 * The client spell group is 6, so the cast is the white-magic chant, not cabk.
 * Magic accuracy is stored and not rolled. Resist tiers are not applied.
 * Durations are the BG cards. The client does not print a level scale for these three.
 *
 * Slow's amount is in 1024ths. dMND above 0 uses 2×dMND + 150.
 * dMND at or below 0 uses dMND + 150. The two bands meet at 150 when dMND is 0.
 * The result is floored, then clamped to 75..300.
 * −75 dMND is 75/1024, about 7.3%. +75 dMND is 300/1024, about 29.3%.
 * Delay is multiplied by (1024 + amount) / 1024. 1024 would double it.
 * The same ratio lengthens spell recast. Cast time is not lengthened.
 * Magic accuracy +10. Cumulative enmity 1, volatile 176. The BG card's 320 is stale.
 *
 * Paralyze's chance is the straight line between the two published ends.
 * −40 dMND is 5%. +40 dMND is 25%. The step is (dMND + 40) / 4, then floored, then clamped.
 * Magic accuracy −10. Cumulative enmity 1, volatile 176.
 *
 * Silence stops spells. Its magic accuracy is not printed, so it is 0.
 * The notorious-monster resist counter is approximate and is not applied to the hare.
 * Cumulative enmity 1, volatile 176. The BG card leaves volatile blank.
 */
export const SLOW_SECONDS = 180;
export const SLOW_MIN = 75;
export const SLOW_MAX = 300;
export const SLOW_MACC = 10;
export const SLOW_CE = 1;
export const SLOW_VE = 176;

export const PARALYZE_SECONDS = 120;
export const PARALYZE_MACC = -10;
export const PARALYZE_CE = 1;
export const PARALYZE_VE = 176;

export const SILENCE_SECONDS = 120;
export const SILENCE_CE = 1;
export const SILENCE_VE = 176;

export function slowPotency(dMnd: number): number {
  const raw = dMnd > 0 ? 2 * dMnd + 150 : dMnd + 150;
  return Math.min(SLOW_MAX, Math.max(SLOW_MIN, Math.floor(raw)));
}

/** 1 is unchanged. 300/1024 slow multiplies delay by 1324/1024. */
export function slowDelayFactor(potency: number): number {
  return (1024 + Math.max(0, Math.floor(potency))) / 1024;
}

export function paralyzeChance(dMnd: number): number {
  const raw = 5 + (dMnd + 40) / 4;
  return Math.min(25, Math.max(5, Math.floor(raw)));
}

/**
 * Blind II, Paralyze II, and Slow II are Red Mage 75 merit spells.
 * The August 2019 change folded five merit points into the base.
 * Further ranks are not a second step. The spells are castable at 75.
 *
 * Blind II is the straight line between the two printed ends, floored.
 * −80 dINT is 19. +120 dINT is 94. Outside that band it stays on the end.
 * Magic accuracy +10. Client volatile enmity is 165. The BG card's 300 is stale.
 *
 * Paralyze II is the same kind of line. −40 dMND is 14%. +40 dMND is 34%.
 * Magic accuracy +10. Client volatile enmity is 176. The BG card's 320 is stale.
 *
 * Slow II's page prints "about 16.5%" and "about 39.1%" and no 1024 formula.
 * 169/1024 is 16.504%. 400/1024 is 39.063%. Those are the nearest 1024ths.
 * The line runs from −75 dMND to +75 dMND and is floored. Outside that it clamps.
 * Magic accuracy +10. Client volatile enmity is 176. The BG card's 320 is stale.
 * It uses the same delay ratio as Slow. It does not lengthen cast time.
 */
export const BLIND_II_SECONDS = 180;
export const BLIND_II_MACC = 10;
export const BLIND_II_CE = 1;
export const BLIND_II_VE = 165;

export const PARALYZE_II_SECONDS = 120;
export const PARALYZE_II_MACC = 10;
export const PARALYZE_II_CE = 1;
export const PARALYZE_II_VE = 176;

export const SLOW_II_SECONDS = 180;
export const SLOW_II_MACC = 10;
export const SLOW_II_CE = 1;
export const SLOW_II_VE = 176;
export const SLOW_II_LOW = 169;
export const SLOW_II_HIGH = 400;

export function blindTwoPotency(dInt: number): number {
  const raw = 19 + ((dInt + 80) * 75) / 200;
  return Math.min(94, Math.max(19, Math.floor(raw)));
}

export function paralyzeTwoChance(dMnd: number): number {
  const raw = 14 + (dMnd + 40) / 4;
  return Math.min(34, Math.max(14, Math.floor(raw)));
}

export function slowTwoPotency(dMnd: number): number {
  const clamped = Math.min(75, Math.max(-75, dMnd));
  const t = (clamped + 75) / 150;
  return Math.floor(SLOW_II_LOW + t * (SLOW_II_HIGH - SLOW_II_LOW));
}

export type EnfeebleFamily = "blind" | "slow" | "paralyze";

export function enfeebleFamily(name: string): EnfeebleFamily | null {
  if (name === "Blind" || name === "Blind II") return "blind";
  if (name === "Slow" || name === "Slow II") return "slow";
  if (name === "Paralyze" || name === "Paralyze II") return "paralyze";
  return null;
}

export function enfeebleTier(name: string): 1 | 2 {
  return name === "Blind II" || name === "Slow II" || name === "Paralyze II" ? 2 : 1;
}

/**
 * Tier 2 replaces tier 1 of the same status. Tier 1 does not land over tier 2.
 * The same tier refreshes. A different status is not blocked.
 */
export function enfeebleCanLand(current: string | null, next: string): boolean {
  const family = enfeebleFamily(next);
  if (!family || current == null || enfeebleFamily(current) !== family) return true;
  return enfeebleTier(current) <= enfeebleTier(next);
}

/**
 * Dia, Dia II, Dia III, and Diaga. White magic, light, enfeebling.
 * The cast is the white-magic chant. Red Mage learns Dia at 1, Diaga at 15,
 * Dia II at 31, and Dia III at 75. White Mage learns Dia at 3, Diaga at 18,
 * and Dia II at 36. Dia III is not a White Mage spell.
 *
 * Defense down is the tested 1024ths, not the script's round percent:
 * Dia and Diaga are −104/1024, Dia II is −156/1024, Dia III is −208/1024.
 * The light damage over time is 1, 2, and 3 HP, on a 3-second tick.
 * Diaga matches Dia. Durations are 60, 60, 120, and 180 seconds.
 * The effect cannot be resisted except by full immunity, which is not rolled.
 * Magic accuracy is not printed. Enmity is not printed.
 *
 * The shared tiers are Dia and Diaga 1, Bio 2, Dia II 3, Bio II 4,
 * Dia III 5, Bio III 6. A lower tier does not land.
 * The same tier refreshes. Dia and Diaga refresh each other.
 * Bio and Dia do not stack. A landing Bio removes the Dia it beat,
 * and a landing Dia removes the Bio it beat.
 *
 * The opening light hit is the damage-table V. Every M column is 0, so
 * mind does not add. Dia is 1, Diaga is 2, Dia II is 4, Dia III is 16.
 * Magic Attack Bonus still multiplies that V. Day, weather, and resist stay 1.
 * That hit is direct damage. The later ticks are not, so they do not wake or unbind.
 * Enfeebling-effect gear would add to the tick only. None is equipped.
 * Light Shot is a Corsair ability and is not here.
 * The land is 2 seconds. Dia, Dia II, and Dia III are a gold shaft.
 * Diaga is animation 33: a ground ring of daylight and pillars around it, not that shaft.
 */
export const DIA_DEF: Record<"Dia" | "Dia II" | "Dia III" | "Diaga", number> = {
  Dia: 104,
  Diaga: 104,
  "Dia II": 156,
  "Dia III": 208,
};
export const DIA_DOT: Record<"Dia" | "Dia II" | "Dia III" | "Diaga", number> = {
  Dia: 1,
  Diaga: 1,
  "Dia II": 2,
  "Dia III": 3,
};
export const DIA_SECONDS: Record<"Dia" | "Dia II" | "Dia III" | "Diaga", number> = {
  Dia: 60,
  Diaga: 60,
  "Dia II": 120,
  "Dia III": 180,
};
/** Damage-table V. The M columns are all 0. */
export const DIA_HIT: Record<"Dia" | "Dia II" | "Dia III" | "Diaga", number> = {
  Dia: 1,
  Diaga: 2,
  "Dia II": 4,
  "Dia III": 16,
};

export type DiaSpell = "Dia" | "Dia II" | "Dia III" | "Diaga";

export function isDiaSpell(name: string): name is DiaSpell {
  return name === "Dia" || name === "Dia II" || name === "Dia III" || name === "Diaga";
}

/** Bio sits between these. Dia and Diaga are 1. Bio is 2. */
export function diaTier(name: string): number {
  return isDiaSpell(name) ? slipTier(name) : 0;
}

/** Dia and Bio share one ladder. A lower tier does not land. The same tier refreshes. */
export function slipTier(name: string): number {
  if (name === "Dia" || name === "Diaga") return 1;
  if (name === "Bio") return 2;
  if (name === "Dia II") return 3;
  if (name === "Bio II") return 4;
  if (name === "Dia III") return 5;
  if (name === "Bio III") return 6;
  return 0;
}

export function isSlipSpell(name: string): boolean {
  return slipTier(name) > 0;
}

export function slipCanLand(current: string | null, next: string): boolean {
  const nextTier = slipTier(next);
  if (nextTier === 0) return false;
  if (current == null || slipTier(current) === 0) return true;
  return slipTier(current) <= nextTier;
}

export function diaCanLand(current: string | null, next: string): boolean {
  if (!isDiaSpell(next)) return false;
  return slipCanLand(current, next);
}

export function diaDefenseNumer(name: string): number {
  return isDiaSpell(name) ? DIA_DEF[name] : 0;
}

/** 1 is full defense. Dia multiplies defense by (1024 − numer) / 1024. Defense Down is 25% unless a power in (0, 1) names the cut. Jump's is 0.2. */
export function diaDefenseFactor(rows: readonly { name: string; power?: number }[]): number {
  const row = rows.find((entry) => diaDefenseNumer(entry.name) > 0);
  const table = row ? diaDefenseNumer(row.name) : 0;
  const numer = row ? Math.max(table, row.power ?? 0) : 0;
  let factor = numer > 0 ? (1024 - numer) / 1024 : 1;
  const down = rows.find((entry) => entry.name === "Defense Down");
  if (down) {
    const cut = down.power != null && down.power > 0 && down.power < 1 ? down.power : 0.25;
    factor *= 1 - cut;
  }
  const sluggish = rows.find((entry) => entry.name === "Sluggish Daze");
  if (sluggish && sluggish.power != null && sluggish.power > 0) {
    const stack = sluggish.power;
    const cut = stack < 1 ? stack : 0.05 + 0.02 * (Math.floor(stack) - 1);
    if (cut > 0 && cut < 1) factor *= 1 - cut;
  }
  return factor;
}

/**
 * Poison, Poison II, and Poisonga. Black magic, water, enfeebling.
 * The cast is the hands-at-the-face loop. The cloud that lands is the
 * purple-green poison, not the water gather.
 * Poison is Black Mage 3, Red Mage 5, Dark Knight 6.
 * Poison II is Black Mage 43, Red Mage 46, Dark Knight 46.
 * Poisonga is Black Mage 24 and Dark Knight 26. Red Mage does not learn it.
 * Poisonga II is not a player spell. The card's job rows are unused,
 * and the page says it is not available, so it is not learned here.
 *
 * The tick is 3 seconds. Durations are 90, 120, and 90.
 * Poisonga's card still prints 30. That is the pre-2015 number.
 * The March 2015 change, and the current script, use 90.
 * A partial resist would halve the duration. It is not rolled.
 *
 * Potency is Enfeebling Magic, floored. INT is not used.
 * Poison and the uncapped Poisonga line: max(skill / 25, 1).
 * Above 400 skill that becomes min((skill − 225) / 5, 55).
 * Poison II: max(skill / 20, 4). Above 400 skill that becomes
 * skill × 49 / 183 − 55. The minimum 4 still holds.
 * Poisonga uses the Poison line and then stops at 3 HP per tick.
 * Saboteur is a merit and is not applied.
 *
 * Poison II overwrites Poison and Poisonga. Poison overwrites Poisonga.
 * Poisonga does not overwrite any other form. The same spell refreshes
 * and reads skill again. Poison II's magic accuracy +30 is stored and not rolled.
 * Cumulative enmity is 1 and volatile is 176. The BG card's 320 is stale.
 * The cast credits it.
 */
export const POISON_SECONDS = 90;
export const POISON_II_SECONDS = 120;
export const POISONGA_SECONDS = 90;
export const POISON_II_MACC = 30;
export const POISON_CE = 1;
export const POISON_VE = 176;
export const POISONGA_CAP = 3;

export type PoisonSpell = "Poison" | "Poison II" | "Poisonga";

export function isPoisonSpell(name: string): name is PoisonSpell {
  return name === "Poison" || name === "Poison II" || name === "Poisonga";
}

export function poisonSeconds(name: PoisonSpell): number {
  if (name === "Poison II") return POISON_II_SECONDS;
  if (name === "Poisonga") return POISONGA_SECONDS;
  return POISON_SECONDS;
}

export function poisonPotency(skill: number, tier: 1 | 2): number {
  const s = Math.max(0, skill);
  if (tier === 1) {
    const low = Math.max(s / 25, 1);
    const potency = s > 400 ? Math.min((s - 225) / 5, 55) : low;
    return Math.floor(potency);
  }
  const low = Math.max(s / 20, 4);
  const potency = s > 400 ? (s * 49) / 183 - 55 : low;
  return Math.max(4, Math.floor(potency));
}

export function poisongaPotency(skill: number): number {
  return Math.min(POISONGA_CAP, poisonPotency(skill, 1));
}

export function poisonCanLand(current: string | null, next: PoisonSpell): boolean {
  if (current == null || !isPoisonSpell(current)) return true;
  if (current === next) return true;
  if (next === "Poisonga") return false;
  if (next === "Poison II") return true;
  return current === "Poisonga";
}

/**
 * Bio, Bio II, and Bio III. Black magic, dark, dark magic skill.
 * The cast is the hands-at-the-face loop, dark in the hands. Not the white chant.
 * Animation 230, 231, and 232 each play for 2 seconds.
 * Black Mage learns Bio at 10 and Bio II at 35. Red Mage learns them at 10 and 36.
 * Dark Knight learns them at 15 and 40. Bio III is Red Mage 75 only.
 * It used to be a merit. This kit has no merits, and the current row is the level 75 spell.
 * Bio IV and Bio V are not here. Puppetmaster's automaton is not a job here.
 *
 * The opening dark hit is the damage-table vPC. Every M column is 0, so
 * INT does not add. Bio is 10, Bio II is 50, Bio III is 100.
 * Magic Attack Bonus still multiplies that number. The Magic Damage stat does not.
 * Day, weather, and resist stay 1. That hit is direct damage, so it wakes and unbinds.
 * It still lands when a stronger Dia or Bio keeps the status from changing.
 * The later ticks are not direct, so they do not wake or unbind.
 *
 * Attack down is the tested 1024ths from the 2019 change, the same numerators as Dia's defense:
 * Bio −104/1024, Bio II −156/1024, Bio III −208/1024.
 * The script's subPower 10, 15, and 20 is the older round percent and is not used.
 * Dark Shot is a Corsair ability and is not here.
 *
 * The tick is 3 seconds. Durations are 60, 120, and 180.
 * Windower still prints 30 for Bio III. That is the pre-conversion merit base.
 * The current card and the script are 180. A partial resist is not rolled.
 *
 * DoT is Dark Magic, not INT. The lines are the ffo.jp script:
 * Bio is ceil(skill / 40), clamped to 1..3.
 * Bio II is floor((skill + 29) / 40), clamped to 3..8.
 * Bio III is 5 + floor((skill − 106) / 35) at 246 and below,
 * 9 + floor((skill − 246) / 11) from 247 through 291,
 * and 13 + floor((skill − 291) / 27) above that, clamped to 5..17.
 * The effect cannot be fully resisted except by immunity, which is not rolled.
 * Magic accuracy +10 is stored and not rolled.
 * Cumulative enmity is 1 and volatile is 180. The BG card's 320 is stale.
 * The cast credits it. The client spell_range column is 200, printed here as 21'.
 */
export type BioSpell = "Bio" | "Bio II" | "Bio III";

export const BIO_SECONDS: Record<BioSpell, number> = {
  Bio: 60,
  "Bio II": 120,
  "Bio III": 180,
};
/** Attack down, in 1024ths. Static. Skill does not change it. */
export const BIO_ATK: Record<BioSpell, number> = {
  Bio: 104,
  "Bio II": 156,
  "Bio III": 208,
};
/** Damage-table vPC. The M columns are all 0. */
export const BIO_HIT: Record<BioSpell, number> = {
  Bio: 10,
  "Bio II": 50,
  "Bio III": 100,
};
export const BIO_MACC = 10;
export const BIO_CE = 1;
export const BIO_VE = 180;

export function isBioSpell(name: string): name is BioSpell {
  return name === "Bio" || name === "Bio II" || name === "Bio III";
}

export function bioPotency(skill: number, name: BioSpell): number {
  const s = Math.max(0, skill);
  if (name === "Bio") return Math.min(3, Math.max(1, Math.ceil(s / 40)));
  if (name === "Bio II") return Math.min(8, Math.max(3, Math.floor((s + 29) / 40)));
  const power = s > 291
    ? 13 + Math.floor((s - 291) / 27)
    : s > 246
      ? 9 + Math.floor((s - 246) / 11)
      : 5 + Math.floor((s - 106) / 35);
  return Math.min(17, Math.max(5, power));
}

export function bioAttackNumer(name: string): number {
  return isBioSpell(name) ? BIO_ATK[name] : 0;
}

/** 1 is full attack. Bio multiplies attack by (1024 − numer) / 1024. A Quick Draw can raise the numer above the spell table. */
export function bioAttackFactor(rows: readonly { name: string; power?: number }[]): number {
  const row = rows.find((entry) => bioAttackNumer(entry.name) > 0);
  if (!row) return 1;
  const numer = Math.max(bioAttackNumer(row.name), row.power ?? 0);
  return (1024 - numer) / 1024;
}

export function bioCanLand(current: string | null, next: string): boolean {
  if (!isBioSpell(next)) return false;
  return slipCanLand(current, next);
}

/**
 * Stun. Black magic, lightning, dark magic skill.
 * The cast is the hands-at-the-face loop, and it is only half a second.
 * Animation 252 plays for 2 seconds: two thunder circles crossed into an X.
 * Not a lightning bolt, and not Flat Blade's slap.
 * Black Mage learns it at 45. Dark Knight learns it at 37.
 * Red Mage does not. A Red Mage subjob is 37, which is still short of 45.
 *
 * The card prints 0.5–2 seconds. That spread is the resist states.
 * A partial resist is not rolled, so the full 2 seconds is kept.
 * The script's random 2–8 is longer than the card and is not used.
 * The target cannot act while it is up. It refreshes itself.
 * It does not remove Sleep, and Sleep does not remove it.
 *
 * On the land, an unfinished spell, job ability, or weaponskill is interrupted.
 * A melee round that has not connected is interrupted. A hit that already
 * connected is not undone. Nothing in progress is not an error, and it adds no line.
 * The Tropical Rarab's auto-attack and TP moves use this path.
 *
 * Magic accuracy +200 is stored and not rolled.
 * Cumulative enmity is 180 and volatile is 1280. The cast credits it.
 * The client spell_range column is 200, printed here as 21'.
 */
export const STUN_SECONDS = 2;
export const STUN_MACC = 200;
export const STUN_CE = 180;
export const STUN_VE = 1280;

/** Something the hare has started and not finished. Stun reads this on the land. */
export type HareAction = {
  kind: "spell" | "ability" | "weaponskill" | "melee";
  name: string;
  /** True once the spell, ability, weaponskill, or swing has already connected. */
  resolved: boolean;
};

/** True only for an action that has started and not resolved. A finished hit stays. */
export function stunCancels(action: HareAction | null | undefined): action is HareAction {
  return action != null && !action.resolved;
}

/** One log line. Melee names a swing. The other kinds name the action itself. */
export function stunInterruptLine(action: HareAction): string {
  if (action.kind === "melee") return `The ${action.name} is interrupted.`;
  return `${action.name} is interrupted.`;
}

/**
 * Gravity. Black magic, wind, enfeebling. Red Mage 21.
 * The page says movement is about −26%. Stats, skill, and Saboteur are not applied.
 * Enfeebling effect gear is not equipped. The old evasion down left with Distract.
 * The page prints 30–120 seconds. A partial resist is not rolled, so the full 120 is kept.
 * It does not change attack delay. That is Slow.
 * Client cumulative and volatile enmity are both 0. Magic accuracy is not printed, so it is 0.
 */
export const GRAVITY_SECONDS = 120;
export const GRAVITY_MOVE = 26;

export function gravityMoveFactor(power = GRAVITY_MOVE): number {
  return (100 - power) / 100;
}

/**
 * Dispel. Black magic, dark, enfeebling. Red Mage 32.
 * Removes one beneficial effect. The Tropical Rarab has none, so the log is no effect.
 * Animation 487 still plays for 2 seconds.
 * Magic accuracy +175 is stored and not rolled.
 * Client volatile enmity is 165. The BG card's 160 is stale.
 * Scholar 32 under Addendum: Black is not a job here.
 */
export const DISPEL_MACC = 175;
export const DISPEL_CE = 1;
export const DISPEL_VE = 165;

/**
 * Inundation. White magic, enfeebling. Red Mage 64.
 * The client spell row is still a comment, so the card is the BG page:
 * 48 MP, 3 second cast, 20 second recast, 5 minutes, 21'.
 * It cannot be resisted except by full magic immunity, which is not rolled.
 * One weapon type adds nothing. Each further type from a different attacker
 * multiplies skillchain damage by 1.2. Fifteen types is the cap.
 * The same attacker using a second weapon does not count.
 * This yard has one attacker, so the multiplier stays 1.
 * It refreshes itself. Enmity is not printed.
 */
export const INUNDATION_SECONDS = 300;
export const INUNDATION_STEP = 1.2;

export function inundationTypes(steps: readonly { actor: string; weapon: string }[]): number {
  const byActor = new Map<string, string>();
  for (const step of steps) {
    if (!byActor.has(step.actor)) byActor.set(step.actor, step.weapon);
  }
  return new Set(byActor.values()).size;
}

export function inundationMultiplier(weaponTypes: number): number {
  const n = Math.max(0, Math.min(15, Math.floor(weaponTypes)));
  if (n <= 1) return 1;
  return INUNDATION_STEP ** (n - 1);
}

/**
 * Distract and Frazzle. Black magic, enfeebling, spell group 2.
 * The cast is the hands-at-the-face loop. Distract is ice, animation 933, 2 seconds.
 * Frazzle is dark, animation 935, 4 seconds.
 * Red Mage learns Distract at 35 and Frazzle at 42.
 * Distract II is 85 and Frazzle II is 92. The III spells are job-point gifts.
 * None of those are in this kit.
 *
 * Both use the same potency line from the enfeebling script:
 * floor(clamp(skill / 5, 0, 25) + clamp(dMND / 5, 0, 10)).
 * Skill 125 already fills the 25. A negative dMND adds nothing.
 * The two steps together stop at 35. Saboteur is a merit and is not applied.
 * Enfeebling-effect gear is not equipped.
 *
 * Distract lowers evasion. Frazzle lowers magic evasion by that same number.
 * They are different statuses, so each can be up. Recasting one refreshes it
 * and reads skill and dMND again. It does not remove the other.
 *
 * Duration is 300 seconds before a resist. One miss halves it. A second miss does not land it.
 * Frazzle's magic evasion down is subtracted on a later spell. Composure does not lengthen enfeebling magic.
 * Magic accuracy is Enfeebling Magic plus dMND plus 150. The accuracy stat is dMND, not dINT.
 * Cumulative enmity is 1 and volatile is 320. The card leaves both blank.
 * The client spell_range column is 200, printed here as 21'.
 */
export const DISTRACT_SECONDS = 300;
export const FRAZZLE_SECONDS = 300;
export const DISTRACT_MACC = 150;
export const FRAZZLE_MACC = 150;
export const DISTRACT_CE = 1;
export const DISTRACT_VE = 320;
export const FRAZZLE_CE = 1;
export const FRAZZLE_VE = 320;

export function evasionDownPotency(skill: number, dMnd: number): number {
  const fromSkill = Math.min(25, Math.max(0, skill / 5));
  const fromMnd = Math.min(10, Math.max(0, dMnd / 5));
  return Math.floor(fromSkill + fromMnd);
}

/** Evasion Distract is currently cutting. 0 when it is not up. */
export function distractPower(rows: readonly { name: string; power?: number }[]): number {
  const row = rows.find((item) => item.name === "Distract");
  return row?.power ?? 0;
}

/**
 * Aquaveil and Blink. Enhancing, from the client spell table and the
 * enhancing power table. Aquaveil's table level is 1 and its base duration
 * is 600 seconds. Gamer Escape's 9 second cast and 5 minute cap are stale.
 * The client cast is 5 seconds. Charges follow enhancing skill, not MND.
 * 300 and below is 1. 301 through 500 is 2. 501 and above is 3.
 * Aquaveil+ gear is not equipped. The spell overwrites itself.
 * It stops a damage interrupt, one charge at a time. Moving still breaks the cast.
 * Spell interruption down is not a flat subtract. See spellInterruptChance.
 * A charge is spent only when that roll would have broken the cast.
 *
 * Blink's base duration is 300 seconds. It grants 2 shadows and overwrites
 * itself, including a cast that still has a shadow. A shadow absorbs one
 * single-target physical hit. A multi-hit weaponskill that procs is absorbed
 * whole. An area attack still removes shadows. The proc rate is not a
 * published percent, so this yard removes one shadow on each connecting bite.
 * The last shadow ending removes the status. Cumulative enmity on the client
 * is 0 and volatile is 165. The BG card's 1 and 300 are stale.
 */
export const AQUAVEIL_SECONDS = 600;
export const AQUAVEIL_LEVEL = 1;
export const AQUAVEIL_CE = 0;
export const AQUAVEIL_VE = 165;

export const BLINK_SECONDS = 300;
export const BLINK_SHADOWS = 2;
export const BLINK_CE = 0;
export const BLINK_VE = 165;

/**
 * Phalanx. Enhancing, light, spell level 33. Client cast is 3 seconds,
 * recast 10, 21 MP. The power table lasts 180 seconds. Gamer Escape's
 * element line matches. The BG card's cumulative enmity 0 and volatile 160
 * are stale. The client row is 1 and 165.
 *
 * Damage removed per hit, after damage-taken gear:
 * at 300 skill and below, floor(skill / 10) − 2, and not below 0.
 * Above 300, 28 + floor((skill − 300.5) / 28.5), and not above 35.
 * 500 skill is −35. Phalanx+ gear is not equipped.
 * An equal or stronger Phalanx replaces the one that is up.
 * A weaker one is no effect. Phalanx II is a different spell and is not here.
 */
export const PHALANX_SECONDS = 180;
export const PHALANX_LEVEL = 33;
export const PHALANX_CE = 1;
export const PHALANX_VE = 165;
export const PHALANX_CAP = 35;

export function phalanxPower(enhancing: number): number {
  const skill = Math.max(0, Math.floor(enhancing));
  if (skill > 300) {
    const high = 28 + Math.floor((skill - 300.5) / 28.5);
    return Math.min(PHALANX_CAP, Math.max(28, high));
  }
  return Math.max(0, Math.floor(skill / 10) - 2);
}

/** Equal or greater damage reduction refreshes. A weaker Phalanx does not land. */
export function phalanxOverwrites(current: number | null, next: number): boolean {
  return current == null || next >= current;
}

/** Damage after Phalanx. The cut is flat, and it cannot heal. */
export function phalanxTaken(damage: number, cut: number): number {
  return Math.max(0, Math.floor(damage) - Math.max(0, Math.floor(cut)));
}

/**
 * Reprisal. Enhancing, light, spell level 1, so the 60 seconds do not shrink.
 * Client cast is 1 second. Gamer Escape's 0.5 is stale. Recast is 3 minutes.
 * 24 MP. Cumulative enmity is 1 and volatile is 640. The BG card's 0 is stale.
 * Paladin 61 only.
 *
 * Shield skill is read live and multiplied by 1.15. It is not snapshotted.
 * Block rate is multiplied by 1.5. 30% becomes 45%. Priwen and Adamas are
 * not equipped, so they do not triple that rate.
 * A successful block reflects 33% of the damage the shield removed.
 * That is the enhancing table's power. The damage is light magic.
 * It is figured before Phalanx, Stoneskin, Sentinel, and Invincible.
 * It does not reflect a blocked weaponskill. The May 2021 update removed
 * the old cap of twice maximum HP, so only the minute ends it.
 * Spikes overwrite Reprisal. Reprisal does not overwrite spikes.
 */
export const REPRISAL_SECONDS = 60;
export const REPRISAL_LEVEL = 1;
export const REPRISAL_CE = 1;
export const REPRISAL_VE = 640;
export const REPRISAL_REFLECT = 33;
export const REPRISAL_SKILL = 1.15;
export const REPRISAL_BLOCK = 1.5;

export function reprisalShieldSkill(skill: number): number {
  return (Math.max(0, skill) * 115) / 100;
}

/** Block rate in percent. 30 becomes 45. No cap is applied here. */
export function reprisalBlockRate(percent: number): number {
  return Math.max(0, percent) * REPRISAL_BLOCK;
}

/** Light damage sent back from the damage a block kept. */
export function reprisalReflect(blocked: number): number {
  return Math.floor((Math.max(0, blocked) * REPRISAL_REFLECT) / 100);
}

export function aquaveilCharges(enhancing: number): number {
  const skill = Math.max(0, Math.floor(enhancing));
  if (skill > 500) return 3;
  if (skill > 300) return 2;
  return 1;
}

/**
 * One displayed percent of spell interruption down is 10/1024.
 * 100% is 1000/1024, so a hit can still break the cast.
 * 102% is the tested immunity line. 103% is the same cap, 1024/1024.
 * Gear tooltips round, which is why 101% sometimes already reaches it.
 * This yard has no such piece. Choral Roll passes its real percent.
 */
export const SIRD_UNIT = 10;
export const SIRD_CAP = 1024;
export const SIRD_IMMUNE = 102;

const INTERRUPT_SKILL: Record<string, string> = {
  healing: "Healing Magic",
  divine: "Divine Magic",
  enhancing: "Enhancing Magic",
  enfeebling: "Enfeebling Magic",
  elemental: "Elemental Magic",
  dark: "Dark Magic",
  summoning: "Summoning Magic",
  ninjutsu: "Ninjutsu",
  blue: "Blue Magic",
  geomancy: "Geomancy",
};

/** The magic skill a hit checks. A song has none. Singing is not in this map. */
export function interruptSkill(school: string): string | null {
  return INTERRUPT_SKILL[school] ?? null;
}

/**
 * Chance that one physical hit breaks the cast, before Aquaveil spends a charge.
 * 0 cannot break it. Above 1 always does.
 *
 * The product is the level rate, times cap/skill, times whatever 1024 the
 * spell interruption down has not covered. The down is not subtracted from
 * the percent. A product that is still over 100% stays certain, so a small
 * amount of spell interruption down does nothing until it pulls that product under 100%.
 *
 * Retail prints the 102% immunity line and not the rate under it.
 * At the skill cap the rate is 50% when the attacker and the caster are the same level.
 * That 50 is not a wiki cell. Each level the attacker is above the caster adds 1.
 * Each level under subtracts 1, and it does not fall under 5%.
 * Under the skill cap the rate is multiplied by cap / skill. No skill at all, with a cap above 0, is ×10.
 */
export function spellInterruptChance(q: {
  attackerLevel: number;
  defenderLevel: number;
  skill: number;
  skillCap: number;
  /** Positive is spell interruption down. 102 or more is immune. A bust can be negative. */
  sirdDown: number;
}): number {
  if (q.sirdDown >= SIRD_IMMUNE) return 0;
  const points = Math.floor(q.sirdDown * SIRD_UNIT);
  const remain = (SIRD_CAP - points) / SIRD_CAP;
  if (remain <= 0) return 0;
  let base = 50 + Math.floor(q.attackerLevel) - Math.floor(q.defenderLevel);
  if (base < 5) base = 5;
  const skill = Math.max(0, Math.floor(q.skill));
  const cap = Math.max(0, Math.floor(q.skillCap));
  const ratio = skill <= 0 ? (cap <= 0 ? 1 : 10) : cap / skill;
  return (base / 100) * ratio * remain;
}

/** Erase. Enhancing, light. Client cast is 2.5s. The BG card's 3s is stale. */
export const ERASE_CE = 1;
export const ERASE_VE = 264;

export type SiphonSpell = "Drain" | "Aspir";

/**
 * Maximum unresisted potency from Dark Magic skill.
 * At 300 the low and high bands meet. Above 300 the high band is used.
 * Drain: skill + 20, or skill × 5/8 + 132.5.
 * Aspir: skill / 3 + 20, or skill × 0.4. Potency gear is not in this kit, so that ×(1+0) stays 1.
 */
export function siphonMax(spell: SiphonSpell, darkSkill: number): number {
  const skill = Math.max(0, darkSkill);
  const max = spell === "Drain"
    ? skill <= 300 ? skill + 20 : skill * (5 / 8) + 132.5
    : skill <= 300 ? skill / 3 + 20 : skill * 0.4;
  return Math.floor(max);
}

/** Half the maximum, floored. The unresisted roll lands on this through the maximum. */
export function siphonMin(max: number): number {
  return Math.floor(Math.max(0, max) * 0.5);
}

/**
 * Unresisted potency. `roll` is 0..1: 0 is the minimum, just under 1 is the maximum.
 * Magic Attack Bonus is not applied. Day, weather, affinity, Nether Void, and potency gear stay 1.
 * INT is only magic accuracy. That resist is not rolled. Undead takes nothing.
 */
export function siphonPotency(spell: SiphonSpell, darkSkill: number, roll: number, undead = false): number {
  if (undead) return 0;
  const max = siphonMax(spell, darkSkill);
  const min = siphonMin(max);
  const t = Math.min(0.999999, Math.max(0, roll));
  return min + Math.floor(t * (max - min + 1));
}

/** What leaves the target. Aspir cannot take more MP than the target has. Drain is not capped by a missing MP pool. */
export function siphonTaken(spell: SiphonSpell, potency: number, targetMp: number): number {
  if (potency <= 0) return 0;
  if (spell === "Aspir") return Math.min(potency, Math.max(0, Math.floor(targetMp)));
  return potency;
}

/** What the caster's bar gains. The full hit can be larger when the bar has little room. */
export function siphonGained(taken: number, current: number, max: number): number {
  return Math.min(Math.max(0, taken), Math.max(0, max - current));
}

export function isSleepSpell(name: string): name is SleepSpell {
  return name === "Sleep" || name === "Sleep II" || name === "Sleepga" || name === "Sleepga II" || name === "Repose";
}

/** Dark sleep only. Repose is not tier 1 and must not fall through this compare. */
export function sleepTier(name: Exclude<SleepSpell, "Repose">): 1 | 2 {
  return name === "Sleep II" || name === "Sleepga II" ? 2 : 1;
}

export function sleepSeconds(name: SleepSpell): number {
  if (name === "Repose") return REPOSE_SECONDS;
  return sleepTier(name) === 1 ? 60 : 90;
}

export function sleepIsWide(name: SleepSpell): boolean {
  return name === "Sleepga" || name === "Sleepga II";
}

/**
 * Tier 2 replaces tier 1. Tier 1 does not land over tier 2.
 * The same tier refreshes. Sleep and Sleepga share tier 1. Sleep II and Sleepga II share tier 2.
 * Repose overrides Sleep and Sleepga, and it refreshes itself.
 * It does not cancel Sleep II or Sleepga II, and they do not cancel Repose.
 */
export function sleepCanLand(current: SleepSpell | null, next: SleepSpell): boolean {
  if (next === "Repose") return current == null || current === "Repose" || current === "Sleep" || current === "Sleepga";
  if (current === "Repose") return false;
  return current == null || sleepTier(current) <= sleepTier(next);
}

/**
 * Accuracy down from dINT. The page's two bands, floored, then clamped to 5..50.
 * dINT -39 uses the first band. dINT -40 uses the second. The page left those two points split.
 */
export function blindPotency(dInt: number): number {
  const raw = dInt >= -39 ? (dInt + 80) / 4 : (dInt + 120) / 8;
  return Math.min(50, Math.max(5, Math.floor(raw)));
}

export type CureSpell = "Cure" | "Cure II" | "Cure III" | "Cure IV" | "Cure V";

type CureBand = { at: number; rate: number; hp: number };

/**
 * Single-target Cure. Power is floor(MND / 2) + floor(VIT / 4) + Healing Magic.
 * The highest band at or below that power sets the base. The last row is the hard cap.
 * Cure potency gear, Cure potency received, day, and weather stay 1. Job points stay 0.
 * Divine Seal doubles the heal after that. It does not change undead damage.
 */
const CURE_TABLE: Record<CureSpell, { bands: readonly CureBand[]; capAt: number; cap: number }> = {
  Cure: {
    capAt: 600,
    cap: 65,
    bands: [
      { at: 0, rate: 4, hp: 10 },
      { at: 20, rate: 1.33, hp: 15 },
      { at: 40, rate: 8.5, hp: 30 },
      { at: 125, rate: 15, hp: 40 },
      { at: 200, rate: 20, hp: 45 },
    ],
  },
  "Cure II": {
    capAt: 700,
    cap: 145,
    bands: [
      { at: 40, rate: 1, hp: 60 },
      { at: 70, rate: 5.5, hp: 90 },
      { at: 125, rate: 7.5, hp: 100 },
      { at: 200, rate: 10, hp: 110 },
      { at: 400, rate: 20, hp: 130 },
    ],
  },
  "Cure III": {
    capAt: 700,
    cap: 340,
    bands: [
      { at: 70, rate: 2.2, hp: 130 },
      { at: 125, rate: 1.15, hp: 155 },
      { at: 200, rate: 2.5, hp: 220 },
      { at: 300, rate: 5, hp: 260 },
    ],
  },
  "Cure IV": {
    capAt: 700,
    cap: 640,
    bands: [
      { at: 70, rate: 1, hp: 270 },
      { at: 200, rate: 2, hp: 400 },
      { at: 300, rate: 1.43, hp: 450 },
      { at: 400, rate: 2.5, hp: 520 },
    ],
  },
  "Cure V": {
    capAt: 700,
    cap: 780,
    bands: [
      { at: 80, rate: 0.7, hp: 450 },
      { at: 150, rate: 1.25, hp: 550 },
      { at: 190, rate: 1.84, hp: 582 },
      { at: 260, rate: 2, hp: 620 },
      { at: 300, rate: 2.5, hp: 640 },
      { at: 500, rate: 3.33, hp: 720 },
    ],
  },
};

/**
 * Undead damage uses the spell page's base value and multiplier, then dMND.
 * Cure prints neither, so it is not numbered. A negative dMND is not numbered.
 * Cure potency does not apply. Magic Attack Bonus is a later step.
 */
const CURE_UNDEAD: Partial<Record<CureSpell, { v: number; m: number }>> = {
  "Cure II": { v: 35, m: 1 },
  "Cure III": { v: 70, m: 1 },
  "Cure IV": { v: 140, m: 1.5 },
  "Cure V": { v: 210, m: 1.5 },
};

export function curePower(mnd: number, vit: number, healing: number): number {
  return Math.floor(mnd / 2) + Math.floor(vit / 4) + Math.max(0, healing);
}

export function cureBase(spell: CureSpell, power: number): number {
  const row = CURE_TABLE[spell];
  if (power >= row.capAt) return row.cap;
  let band = row.bands[0];
  for (const next of row.bands) if (power >= next.at) band = next;
  const base = Math.floor((power - band.at) / band.rate + 1e-9) + band.hp;
  return Math.min(row.cap, Math.max(row.bands[0].hp, base));
}

/** Divine Seal doubles the heal. Potency gear and weather are not in this step. */
export function cureFinal(base: number, divineSeal: boolean): number {
  return divineSeal ? base * 2 : base;
}

export function cureUndeadD(spell: CureSpell, dMnd: number): number | null {
  const row = CURE_UNDEAD[spell];
  if (!row || dMnd < 0) return null;
  return Math.floor(row.v + dMnd * row.m);
}

export type CuragaSpell = "Curaga" | "Curaga II" | "Curaga III" | "Curaga IV";

type CuragaBand = { hp: number | null; rate: number; c: number };

/**
 * Area cures. Power is not the single-target Cure power.
 * Power = 3×MND + VIT + 3×floor(Healing Magic / 5).
 * Base = floor(Power / 2) / Rate + Const.
 * The soft-cap column is an HP amount. When the band in use reaches it,
 * the next Rate and Const replace it and are applied to the full half-power.
 * The result is clamped to the printed minimum and maximum, then floored.
 * Cure potency, day, weather, and job points stay out. Divine Seal doubles after the cap.
 * Curaga V is White Mage 91 and is not in this kit.
 */
const CURAGA_TABLE: Record<CuragaSpell, { min: number; max: number; bands: readonly CuragaBand[] }> = {
  Curaga: {
    min: 60,
    max: 105,
    bands: [
      { hp: null, rate: 1, c: 20 },
      { hp: 75, rate: 2, c: 47.5 },
      { hp: 90, rate: 35.66, c: 87.62 },
    ],
  },
  "Curaga II": {
    min: 130,
    max: 220,
    bands: [
      { hp: null, rate: 1, c: 70 },
      { hp: 160, rate: 2, c: 115 },
      { hp: 190, rate: 15.66, c: 180.43 },
    ],
  },
  "Curaga III": {
    min: 270,
    max: 450,
    bands: [
      { hp: null, rate: 0.6666, c: 165 },
      { hp: 330, rate: 2, c: 275 },
      { hp: 390, rate: 6.5, c: 354.66 },
    ],
  },
  "Curaga IV": {
    min: 450,
    max: 810,
    bands: [
      { hp: null, rate: 0.6666, c: 330 },
      { hp: 570, rate: 1, c: 410 },
      { hp: 690, rate: 2.833, c: 591.2 },
    ],
  },
};

export function curagaPower(mnd: number, vit: number, healing: number): number {
  return 3 * mnd + vit + 3 * Math.floor(Math.max(0, healing) / 5);
}

export function curagaBase(spell: CuragaSpell, power: number): number {
  const row = CURAGA_TABLE[spell];
  let rate = row.bands[0].rate;
  let c = row.bands[0].c;
  const half = Math.floor(Math.max(0, power) / 2);
  for (const band of row.bands) {
    if (band.hp == null) continue;
    if (half / rate + c >= band.hp) {
      rate = band.rate;
      c = band.c;
    } else break;
  }
  const raw = half / rate + c;
  return Math.floor(Math.min(row.max, Math.max(row.min, raw)));
}

/**
 * Cura's heal.
 * The Cure Formula page does not list Cura. The client row stores base 0 and multiplier 1,
 * the same empty pair Curaga uses, so those columns are not an HP amount.
 * A level-75 anecdote near 36 HP, a soft ceiling near 175, and "about Curaga II after 200 damage"
 * are observations. The private-server Cure I table plus one HP per misery point is labeled guesswork.
 * Null means this yard does not apply a number.
 */
export function curaHp(): null {
  return null;
}

/**
 * Most recent HP actually lost while Afflatus Misery is up.
 * A 0-damage hit does not replace the record. Stoneskin never reaches this with a remainder of 0.
 * The Cura bonus that would read it is not a published curve.
 */
export function nextMiseryWound(current: number, hpLost: number, misery: boolean): number {
  if (!misery || hpLost <= 0) return current;
  return Math.floor(hpLost);
}

/** Five minutes, or until the absorbed damage is spent. */
export const STONESKIN_SECONDS = 300;

/** Naked cap. Stoneskin gear can go past this. None of that gear is equipped here. */
export const STONESKIN_CAP = 350;

/**
 * Stoneskin HP. X is Enhancing Magic / 3 + MND.
 * Under 80, the strength is X. From 80 through 130 it is 2X − 60.
 * At 130 and above it is Enhancing Magic + 3×MND − 190.
 * The page notes the first band does not meet the second. That jump is left as published.
 * The result is floored, then capped at 350.
 */
export function stoneskinPower(mnd: number, enhancing: number): number {
  const x = enhancing / 3 + mnd;
  const raw = x < 80 ? x : x <= 130 ? 2 * x - 60 : enhancing + 3 * mnd - 190;
  return Math.min(STONESKIN_CAP, Math.max(0, Math.floor(raw)));
}

/** Naked cap. Orison and Ebers can go past this. That gear is not equipped. */
export const SOLACE_SKIN_CAP = 300;

/**
 * How long this yard keeps a solace shell.
 * BG-Wiki and the 2009 notes only say "a short duration" and print no seconds.
 * FF Wiki says about 30 seconds. 30 is that yard choice, not a printed exact.
 */
export const SOLACE_SKIN_SECONDS = 30;

/**
 * Afflatus Solace stoneskin. 25% of the cure before the HP bar is floored, then capped at 300.
 * A cure that only fills part of the bar still uses the full cure. Divine Seal's double is included.
 * Undead damage is not a cure, so it grants nothing. Merit ranks are not unlocked.
 */
export function solaceSkin(curePotential: number): number {
  if (curePotential <= 0) return 0;
  return Math.min(SOLACE_SKIN_CAP, Math.floor(curePotential * 0.25));
}

/** A shell with no source is the Stoneskin spell. Metallic Body and Diamondhide keep their own source so the spell can replace them. */
export function stoneskinSource(from: "spell" | "solace" | "metal" | "hide" | undefined): "spell" | "solace" | "metal" | "hide" {
  if (from === "solace") return "solace";
  if (from === "metal") return "metal";
  if (from === "hide") return "hide";
  return "spell";
}

/** The spell and a new solace shell replace a solace shell, Metallic Body, and Diamondhide. Neither replaces the spell. */
export function stoneskinCanLand(existing: "spell" | "solace" | "metal" | "hide" | null): boolean {
  return existing !== "spell";
}

export type RaiseSpell = "Raise" | "Raise II" | "Raise III";
export type ReraiseSpell = "Reraise" | "Reraise II" | "Reraise III";

/**
 * Weakness after a raise. Five minutes.
 * Max HP and max MP are reduced by 75%, so a quarter of each pool remains.
 * 100% Slow doubles attack delay. The page does not add a second recast penalty.
 * Gear is not split out of the pool here, so the 75% is taken off the whole maximum.
 * The longer base-then-gear equation is not used.
 */
export const WEAKNESS_SECONDS = 300;
export const WEAKNESS_REMAIN = 0.25;
export const WEAKNESS_DELAY = 2;

/** One hour. The buff is spent only when a later KO accepts it. */
export const RERAISE_SECONDS = 3600;

export type Weakness = {
  left: number;
  /** A KO while Weakness was already up. Further KOs do not add another tier. */
  double: boolean;
};

/** What a Reraise buff would do on KO. HP is not written until dead status accepts it. */
export type PendingRaise = {
  spell: ReraiseSpell;
  hp: number;
  weakness: Weakness;
  /** Set when a song paid this raise. The spell field stays the HP tier's reraise name. */
  via?: string;
};

const RAISE_HP: Record<RaiseSpell, number> = {
  Raise: 0.1,
  "Raise II": 0.25,
  "Raise III": 0.5,
};

/** Stored only. Nothing in this yard spends experience. */
const RAISE_EXP: Record<RaiseSpell, number> = {
  Raise: 0.5,
  "Raise II": 0.75,
  "Raise III": 0.9,
};

export function isReraiseSpell(name: string): name is ReraiseSpell {
  return name === "Reraise" || name === "Reraise II" || name === "Reraise III";
}

/** The raise a reraise buff pays out. Reraise is Raise, not a separate formula. */
export function raiseFromReraise(spell: ReraiseSpell): RaiseSpell {
  if (spell === "Reraise II") return "Raise II";
  if (spell === "Reraise III") return "Raise III";
  return "Raise";
}

/** Maximum HP or MP once Weakness has reduced it by 75%. */
export function weakenedPool(max: number): number {
  return Math.max(0, Math.floor(max * WEAKNESS_REMAIN));
}

/**
 * HP the body stands up with. A percent of the reduced maximum, then floored.
 * Below level 50 the higher tiers still use their own HP. Only experience drops to Raise's rate.
 * The pages do not print a minimum of 1.
 */
export function raiseHpRestored(spell: RaiseSpell, maxHp: number): number {
  return Math.floor(weakenedPool(maxHp) * RAISE_HP[spell]);
}

/**
 * Fraction of lost experience the spell would return. Not applied.
 * Raise II and Raise III on a target under 50 use Raise's 50%.
 */
export function raiseExpFraction(spell: RaiseSpell, targetLevel: number): number {
  if (targetLevel < 50) return RAISE_EXP.Raise;
  return RAISE_EXP[spell];
}

/** A raise while Weakness remains becomes double weakness and starts the five minutes over. */
export function applyWeakness(prev: Weakness | null): Weakness {
  if (prev && prev.left > 0) return { left: WEAKNESS_SECONDS, double: true };
  return { left: WEAKNESS_SECONDS, double: false };
}

/** 100% Slow while Weakness remains. 1 means the delay is unchanged. */
export function weaknessDelayFactor(weakness: Weakness | null): number {
  if (!weakness || weakness.left <= 0) return 1;
  return WEAKNESS_DELAY;
}

/**
 * Magic damage dealt under double weakness. Null means no change.
 * Enfeebling still lands. That roll is not in this number.
 */
export function weaknessMagicDealt(weakness: Weakness | null): number | null {
  if (!weakness || weakness.left <= 0 || !weakness.double) return null;
  return 0;
}

/** Ranged accuracy and ranged attack under double weakness. Null means no change. */
export function weaknessRanged(weakness: Weakness | null): { acc: number; atk: number } | null {
  if (!weakness || weakness.left <= 0 || !weakness.double) return null;
  return { acc: 1, atk: 1 };
}

export type RaiseTarget = {
  ko: boolean;
  level: number;
  maxHp: number;
  weakness: Weakness | null;
};

/**
 * Raise on a KO'd player. A living target is no effect.
 * Experience is calculated and discarded.
 */
export function resolveRaise(
  spell: RaiseSpell,
  target: RaiseTarget,
): { hp: number; weakness: Weakness; expFraction: number } | null {
  if (!target.ko) return null;
  return {
    hp: raiseHpRestored(spell, target.maxHp),
    weakness: applyWeakness(target.weakness),
    expFraction: raiseExpFraction(spell, target.level),
  };
}

/**
 * Reraise does not stand you up by itself.
 * On KO it records the matching Raise. Dead status has to accept that later.
 * Any tier replaces any other. The buff is a death effect, so the icon leaves with the rest.
 */
export function reraiseOnKo(spell: ReraiseSpell | null, maxHp: number, weakness: Weakness | null): PendingRaise | null {
  if (!spell) return null;
  const asRaise = raiseFromReraise(spell);
  return { spell, hp: raiseHpRestored(asRaise, maxHp), weakness: applyWeakness(weakness) };
}

/**
 * Goddess's Hymnus. Experience is Reraise I. The HP is 50% of the weakened maximum, the same as Reraise III.
 * A Reraise spell is checked first. This does not replace that spell.
 */
export function hymnusOnKo(maxHp: number, weakness: Weakness | null): PendingRaise {
  return {
    spell: "Reraise",
    hp: raiseHpRestored("Raise III", maxHp),
    weakness: applyWeakness(weakness),
    via: "Goddess's Hymnus",
  };
}

export type BanishSpell = "Banish" | "Banish II" | "Banish III" | "Banishga" | "Banishga II";

/**
 * One published V and M. D = max(0, floor(V + dMND × M)).
 * Divine Magic skill does not change nuke damage. Day, weather, staff, and resist stay 1.
 * A negative result is 0. It does not heal.
 * Banish's undead bonus is a later ×1.5. Holy does not get that bonus.
 */
const BANISH_VM: Record<BanishSpell, { v: number; m: number }> = {
  Banish: { v: 14, m: 1 },
  "Banish II": { v: 85, m: 1 },
  "Banish III": { v: 198, m: 1.5 },
  Banishga: { v: 50, m: 1 },
  "Banishga II": { v: 180, m: 1 },
};

const HOLY_V = 125;
const HOLY_M = 1;

function divineBase(v: number, m: number, dMnd: number): number {
  return Math.max(0, Math.floor(v + dMnd * m));
}

/**
 * Banish damage after Magic Attack Bonus.
 * Undead take 50% more. A living target does not.
 * Afflatus Misery's potency note is unnumbered, so it is not applied.
 */
export function banishDamage(spell: BanishSpell, dMnd: number, mab: number, mdb = 0, undead = false): number {
  const row = BANISH_VM[spell];
  const hit = applyMab(divineBase(row.v, row.m, dMnd), mab, mdb);
  return undead ? Math.floor(hit * 1.5) : hit;
}

/**
 * Holy damage after Magic Attack Bonus.
 * No undead damage bonus and no special-defense reduction.
 * Afflatus Solace's potency note is unnumbered, so it is not applied.
 */
export function holyDamage(dMnd: number, mab: number, mdb = 0): number {
  return applyMab(divineBase(HOLY_V, HOLY_M, dMnd), mab, mdb);
}

/**
 * Special-defense reduction on undead only. The category table, not the Banish III page.
 * That page prints 97% (62/64). The category table prints 230/256, about 90%.
 * The formula is labeled assumed, so the fraction is stored and not turned into a defense stat.
 * Merit duration is not unlocked. An equal or higher tier replaces. A lower tier does not.
 * Damage still lands either way. Tomahawk is not in this kit, so it does not stack here.
 */
export const BANISH_DOWN: Record<BanishSpell, { seconds: number; num: number }> = {
  Banish: { seconds: 15, num: 128 },
  "Banish II": { seconds: 30, num: 179 },
  "Banish III": { seconds: 45, num: 230 },
  Banishga: { seconds: 15, num: 128 },
  "Banishga II": { seconds: 30, num: 179 },
};

export type BanishDown = { name: BanishSpell; left: number; sdr: number };

export function banishTier(spell: BanishSpell): 1 | 2 | 3 {
  if (spell === "Banish III") return 3;
  if (spell === "Banish II" || spell === "Banishga II") return 2;
  return 1;
}

export function banishCanReplace(current: BanishSpell | null, next: BanishSpell): boolean {
  return current == null || banishTier(next) >= banishTier(current);
}

/** Undead only. A living target keeps whatever is already on it, including nothing. */
export function resolveBanishDown(current: BanishDown | null, spell: BanishSpell, undead: boolean): BanishDown | null {
  if (!undead) return current;
  if (current && !banishCanReplace(current.name, spell)) return current;
  const row = BANISH_DOWN[spell];
  return { name: spell, left: row.seconds, sdr: row.num / 256 };
}

/** Accuracy −300 for 12 seconds. No decay curve is published, so it holds for the full duration. */
export const FLASH_SECONDS = 12;
export const FLASH_ACC = 300;
/** Numbered hate. Cumulative 180, volatile 1280. */
export const FLASH_CE = 180;
export const FLASH_VE = 1280;

/**
 * Light sleep, 90 seconds, on any enemy. The light element is why it can sleep undead.
 * +175 magic accuracy is stored on the spell and not rolled.
 * Client cumulative enmity is 1 and volatile is 165.
 */
export const REPOSE_SECONDS = 90;
export const REPOSE_MACC = 175;

/**
 * Protect and Shell. Current retail, from the client spell table and the
 * enhancing-spell power table. Enhancing Magic skill does not change the
 * number. There is no Protect I or Shell I; tier 1 is the unnumbered spell.
 * Protect V and Shell V are level 76 and are not in this kit.
 * Protectra V and Shellra V are level 75 and are.
 *
 * Protect is a flat defense bonus. The same number is on Protect and Protectra
 * of that tier. They share one status. A higher tier replaces a lower one.
 * The same tier refreshes the 30 minutes. A lower tier is no effect.
 * Shell is not Magic Defense Bonus. It cuts magic damage by N/256.
 * 27, 42, 56, 67, and 75 are the published cuts. The server stores those as
 * 1055, 1641, 2188, 2617, and 2930, which is the percent × 100.
 * Protect and Shell are separate. Both can be up.
 * Duration is 1800 seconds. A target under the spell's level keeps
 * 1800 × their level / the spell's level, with no floor. That spell level
 * is the enhancing table's level. It matches the earliest job, except
 * Shell and Shellra, which use 18 rather than the job level 17.
 */
export type BarrierTier = 1 | 2 | 3 | 4 | 5;
export type BarrierKind = "protect" | "shell";

export const BARRIER_SECONDS = 1800;

export const PROTECT_DEF: Record<BarrierTier, number> = {
  1: 20,
  2: 50,
  3: 90,
  4: 140,
  5: 220,
};

/** Magic damage removed, in 256ths. Not a Magic Defense Bonus trait. */
export const SHELL_CUT: Record<BarrierTier, number> = {
  1: 27,
  2: 42,
  3: 56,
  4: 67,
  5: 75,
};

/** Single-target volatile enmity is 80. The area spells use 100. Cumulative is 1 either way. */
export const BARRIER_CE = 1;
export const BARRIER_VE = 80;
export const BARRIER_AREA_VE = 100;

/** Duration shrinks when the target is under the spell's level. No floor. */
export function enhancingDuration(baseSeconds: number, spellLevel: number, targetLevel: number): number {
  if (spellLevel <= 0 || targetLevel >= spellLevel) return baseSeconds;
  return (baseSeconds * targetLevel) / spellLevel;
}

export function barrierDuration(spellLevel: number, targetLevel: number): number {
  return enhancingDuration(BARRIER_SECONDS, spellLevel, targetLevel);
}

/** A weaker ward does not replace a stronger one. The same tier refreshes. */
export function barrierOverwrites(current: number | null, next: number): boolean {
  return current == null || next >= current;
}

/**
 * Magic damage after Shell. Physical hits are not cut.
 * 100 with Shell I (27/256) is 89.
 */
export function shellTaken(damage: number, cut: number): number {
  const n = Math.max(0, Math.min(255, Math.floor(cut)));
  return Math.floor((Math.max(0, damage) * (256 - n)) / 256);
}

export function protectPower(buffs: readonly { name: string; power?: number }[]): number {
  for (const buff of buffs) {
    if (buff.name === "Protect" && buff.power != null && buff.power > 0) return buff.power;
  }
  return 0;
}

/**
 * Regen, Haste, and Auspice. Current retail, from the client spell table
 * and the enhancing-spell power table. Enhancing Magic skill does not
 * change them. There is no Regen I. Regen IV, Regen V, Haste II, and
 * Hastega are past this kit.
 *
 * Regen restores HP every 3 seconds. The tiers share one status.
 * A higher tier replaces a lower one. The same tier refreshes.
 * A lower tier is no effect. Auto Regen is a separate trait and stacks.
 * Merits, Light Arts, Tabula Rasa, Composure, and Regen+ gear are not here.
 * The client volatile enmity is 165. A BG card for Regen III prints 300.
 * The cast credits it only when you are already on the hate list.
 *
 * Haste's table power is 1465, which is 14.65% on the 10000 scale.
 * The delay formula wants 1024ths: round(1465 / 10000 × 1024) = 150.
 * Haste II would be 307 and Hastega 153. Neither is in this kit.
 * Magic haste caps at 448/1024. It shortens melee delay and spell recast.
 * It does not shorten cast time, raise movement speed, or change TP.
 * Archery and Marksmanship delay are not shortened.
 * The BG card's 6 second cast is stale. The client cast is 3 seconds.
 *
 * Auspice is Subtle Blow +10, toward the +50 Subtle Blow I cap.
 * The table duration is 180 seconds. Gamer Escape's 2:30 is stale.
 * The BG card's 7 second cast and 30 MP are stale. The client is 3s and 48 MP.
 * The hare's TP is not tracked, so the reduction is not applied.
 *
 * Refresh restores 3 MP every 3 seconds for 150 seconds. Red Mage 41 only.
 * Refresh II and Refresh III are past 75 and are not here. Enhancing Magic
 * skill does not change the amount. Recasting overwrites it. Composure
 * triples the duration on yourself and stops at 30:00. The tick stays 3.
 * Cumulative enmity is 1 and volatile enmity is 165. The BG card's 300 is stale.
 * The cast credits it only when you are already on the hate list.
 */
export type RegenTier = 1 | 2 | 3;

export const REGEN_TICK = 3;
export const REGEN_HP: Record<RegenTier, number> = { 1: 5, 2: 12, 3: 20 };
export const REGEN_SECONDS: Record<RegenTier, number> = { 1: 75, 2: 60, 3: 60 };
export const REGEN_CE = 1;
export const REGEN_VE = 165;

/** 3 MP every 3 seconds. Base duration 150 seconds. Red Mage 41. */
export const REFRESH_TICK = 3;
export const REFRESH_MP = 3;
export const REFRESH_SECONDS = 150;
export const REFRESH_CE = 1;
export const REFRESH_VE = 165;

/** 14.65% on the 10000 scale, stored as haste /1024. */
export const HASTE_PERCENT = 1465;
export const HASTE_NUMER = 150;
export const HASTE_SECONDS = 180;
export const HASTE_CE = 1;
export const HASTE_VE = 165;
export const HASTE_MAGIC_CAP = 448;

export const AUSPICE_SUBTLE_BLOW = 10;
export const AUSPICE_SECONDS = 180;
export const AUSPICE_CE = 1;
export const AUSPICE_VE = 165;
/** BG calls the miss step approximate. This yard uses the printed +10, cap +30. */
export const AUSPICE_MISS_ACC = 10;
export const AUSPICE_MISS_ACC_CAP = 30;

/** 1465 → 150, 2998 → 307, 1494 → 153. */
export function hasteFromPercent(percentTimes100: number): number {
  return Math.round((percentTimes100 / 10000) * 1024);
}

/** Magic haste from the Haste spell, plus March. Huton is wind damage, not haste, so a leftover Huton buff does not count. Marches add. The cap is still 448. */
export function hasteMagic(buffs: readonly { name: string; power?: number; song?: { family: string } }[]): number {
  let best = 0;
  let march = 0;
  for (const buff of buffs) {
    if (buff.name === "Haste" && buff.power != null && buff.power > 0) best = Math.max(best, buff.power);
    if (buff.song?.family === "march" && buff.power != null && buff.power > 0) march += buff.power;
  }
  return Math.min(HASTE_MAGIC_CAP, best + march);
}

/** Spell recast only. Cast time and ability recast are not passed here. */
export function hastedRecast(baseSeconds: number, magicNumer: number): number {
  const magic = Math.max(0, Math.min(HASTE_MAGIC_CAP, Math.floor(magicNumer)));
  return (baseSeconds * (1024 - magic)) / 1024;
}

export function regenPower(buffs: readonly { name: string; power?: number; song?: { family: string } }[]): number {
  let regen = 0;
  let paeon = 0;
  for (const buff of buffs) {
    if (buff.name === "Regen" && buff.power != null && buff.power > 0 && regen === 0) regen = buff.power;
    if (buff.song?.family === "paeon" && buff.power != null && buff.power > 0) paeon += buff.power;
  }
  return regen + paeon + rollCombat(buffs).regen;
}

export function refreshPower(buffs: readonly { name: string; power?: number; song?: { family: string } }[]): number {
  let refresh = 0;
  let ballad = 0;
  for (const buff of buffs) {
    if (buff.name === "Refresh" && buff.power != null && buff.power > 0 && refresh === 0) refresh = buff.power;
    if (buff.song?.family === "ballad" && buff.power != null && buff.power > 0) ballad += buff.power;
  }
  return refresh + ballad;
}

/** Subtle Blow from buffs. The 50% and 75% caps are applied when TP is granted. Monk's Roll is included. */
export function subtleBlow(buffs: readonly { name: string; power?: number }[]): number {
  let total = 0;
  for (const buff of buffs) {
    if (buff.name === "Auspice" && buff.power != null && buff.power > 0) total += buff.power;
  }
  return total + rollCombat(buffs).subtle;
}

/**
 * White Mage bar spells through level 75. Baramnesra is 78 and is not here.
 * Red Mage's self-only bars are not here. No merits, job points, or bar gear.
 *
 * Both kinds last 8 minutes before duration gear. Enhancing skill does not
 * change that. A target under the spell's level keeps base × level / spell level.
 * Only one bar-element and one bar-status can be up. A new one of that kind
 * always replaces the old one, even when it is weaker. They do not replace
 * each other. Self-target bars would overwrite these and not the other way
 * around. This kit has no self-target bar.
 *
 * Elemental potency is magic evasion against that element:
 * 40 + floor(skill / 5) through 300 skill, then 25 + floor(skill / 4).
 * It caps at +150 when skill reaches 500. Merits would add resistance and
 * Magic Defense Bonus. They are not ranked here, so neither is added.
 * Afflatus Solace does not add Magic Defense Bonus by itself. That bonus is
 * on gear this yard does not have.
 *
 * An area status bar is a flat +20 against that status. It does not read
 * Enhancing Magic. A self-target status bar would be +20 more. This kit has
 * none. Paralysis is ice, so Barparalyzra and an ice bar both count.
 * The other pairings are not printed on the barspell page and are not guessed.
 * Cumulative enmity is 1. Volatile enmity is 80 on every area bar except
 * Barpoisonra, which is 300. The cast credits it only when you are already listed.
 */
export const BAR_SECONDS = 480;
export const BAR_CE = 1;
/** Area bar volatile enmity. Barpoisonra is the exception. */
export const BAR_AREA_VE = 80;
export const BARPOISONRA_VE = 300;
export const STATUS_BAR_RESIST = 20;

export type BarElement = "fire" | "ice" | "wind" | "earth" | "thunder" | "water";

export type BarStatus = "Sleep" | "Poison" | "Paralysis" | "Blindness" | "Silence" | "Plague" | "Petrification";

export type BarSpellName =
  | "Barstonra"
  | "Barwatera"
  | "Baraera"
  | "Barfira"
  | "Barblizzara"
  | "Barthundra"
  | "Barsleepra"
  | "Barpoisonra"
  | "Barparalyzra"
  | "Barblindra"
  | "Barsilencera"
  | "Barvira"
  | "Barpetra"
  | "Barstone"
  | "Barwater"
  | "Baraero"
  | "Barfire"
  | "Barblizzard"
  | "Barthunder"
  | "Barsleep"
  | "Barpoison"
  | "Barparalyze"
  | "Barblind"
  | "Barsilence"
  | "Barvirus"
  | "Barpetrify";

const ELEMENT_BAR: Record<string, BarElement> = {
  Barstonra: "earth",
  Barwatera: "water",
  Baraera: "wind",
  Barfira: "fire",
  Barblizzara: "ice",
  Barthundra: "thunder",
  Barstone: "earth",
  Barwater: "water",
  Baraero: "wind",
  Barfire: "fire",
  Barblizzard: "ice",
  Barthunder: "thunder",
};

const STATUS_BAR: Record<string, BarStatus> = {
  Barsleepra: "Sleep",
  Barpoisonra: "Poison",
  Barparalyzra: "Paralysis",
  Barblindra: "Blindness",
  Barsilencera: "Silence",
  Barvira: "Plague",
  Barpetra: "Petrification",
  Barsleep: "Sleep",
  Barpoison: "Poison",
  Barparalyze: "Paralysis",
  Barblind: "Blindness",
  Barsilence: "Silence",
  Barvirus: "Plague",
  Barpetrify: "Petrification",
};

/** Paralysis is the pairing the barspell page prints. */
const STATUS_ELEMENT: Partial<Record<BarStatus, BarElement>> = {
  Paralysis: "ice",
};

export function isElementBar(name: string): boolean {
  return Object.prototype.hasOwnProperty.call(ELEMENT_BAR, name);
}

export function isStatusBar(name: string): boolean {
  return Object.prototype.hasOwnProperty.call(STATUS_BAR, name);
}

export function elementResisted(name: string): BarElement | null {
  return ELEMENT_BAR[name] ?? null;
}

export function statusResisted(name: string): BarStatus | null {
  return STATUS_BAR[name] ?? null;
}

/** Magic evasion an elemental bar adds. Caps at 150. */
export function elementalBarResistance(enhancing: number): number {
  const skill = Math.max(0, Math.floor(enhancing));
  const raw = skill <= 300 ? 40 + Math.floor(skill / 5) : 25 + Math.floor(skill / 4);
  return Math.min(150, raw);
}

export function resolveElementBar(enhancing: number, spellLevel: number, targetLevel: number): { power: number; left: number } {
  return { power: elementalBarResistance(enhancing), left: enhancingDuration(BAR_SECONDS, spellLevel, targetLevel) };
}

export function resolveStatusBar(spellLevel: number, targetLevel: number, self = false): { power: number; left: number } {
  return { power: self ? STATUS_BAR_RESIST + 20 : STATUS_BAR_RESIST, left: enhancingDuration(BAR_SECONDS, spellLevel, targetLevel) };
}

export function barResistLabel(resists: string): string {
  if (resists === "fire") return "Fire";
  if (resists === "ice") return "Ice";
  if (resists === "wind") return "Wind";
  if (resists === "earth") return "Earth";
  if (resists === "thunder") return "Lightning";
  if (resists === "water") return "Water";
  return resists;
}

/**
 * Magic evasion from the bars that match this element or status.
 * Paralysis also reads an ice bar. Other status elements are not assumed.
 */
export function barEvasion(
  buffs: readonly { name: string; power?: number }[],
  target: { element?: BarElement; status?: BarStatus },
): number {
  let total = 0;
  for (const buff of buffs) {
    if (buff.power == null || buff.power <= 0) continue;
    if (target.element && elementResisted(buff.name) === target.element) total += buff.power;
    if (target.status && statusResisted(buff.name) === target.status) total += buff.power;
  }
  if (target.status && !target.element) {
    const paired = STATUS_ELEMENT[target.status];
    if (paired) total += barEvasion(buffs, { element: paired });
  }
  return total;
}

/** Tier I cannot replace tier II. Tier II replaces either tier. Empty replaces with either. */
export function enspellOverwrites(current: 1 | 2 | null, next: 1 | 2): boolean {
  return !(current === 2 && next === 1);
}

/** Tier II blocks Auspice. Tier I and Auspice replace each other. */
export function auspiceBlockedByEnspell(tier: 1 | 2 | null): boolean {
  return tier === 2;
}

/**
 * Enspell II base from Enhancing Magic.
 * Below 180: floor(skill / 9) + 5. At 180 and above: floor((skill − 180) / 8) + 25.
 * Both forms are 25 at 180. Tier I snapshots this. Tier II reads it again each round.
 * No day, weather, staff, or resist term.
 */
export function enspellTwoBase(enhancing: number): number {
  const skill = Math.max(0, Math.floor(enhancing));
  if (skill < 180) return Math.floor(skill / 9) + 5;
  return Math.floor((skill - 180) / 8) + 25;
}

/** Base plus one per earlier connecting round, capped at double the current base. */
export function enspellTwoDamage(enhancing: number, earlierRounds: number): number {
  const base = enspellTwoBase(enhancing);
  const extra = Math.max(0, Math.floor(earlierRounds));
  return Math.min(base * 2, base + extra);
}

/** Accuracy stored on Auspice. It does nothing unless Afflatus Misery is also up. */
export function auspiceAccuracy(buffs: readonly { name: string; acc?: number }[]): number {
  if (!buffs.some((buff) => buff.name === "Afflatus Misery")) return 0;
  const row = buffs.find((buff) => buff.name === "Auspice");
  if (!row || row.acc == null || row.acc <= 0) return 0;
  return Math.min(AUSPICE_MISS_ACC_CAP, Math.floor(row.acc));
}

/** Enough of a spell to read its client enmity row. */
export type CastHateSpell = {
  name: string;
  nuke?: unknown;
  helix?: boolean;
  spike?: unknown;
  debuff?: unknown;
  enfeeble?: string;
  siphon?: string;
  warp?: string;
  storm?: unknown;
  klimaform?: boolean;
  cure?: unknown;
  curaga?: unknown;
  cura?: boolean;
  stoneskin?: boolean;
  barrier?: { area?: boolean };
  regen?: unknown;
  haste?: unknown;
  refresh?: unknown;
  auspice?: unknown;
  aquaveil?: unknown;
  blink?: unknown;
  phalanx?: unknown;
  reprisal?: unknown;
  foil?: unknown;
  enspell?: { tier: number };
  erase?: boolean;
  bar?: unknown;
  /** Absent on a self bar. Area bars set it. */
  radius?: number | null;
  na?: unknown;
  esuna?: boolean;
  sacrifice?: boolean;
  raise?: unknown;
  reraise?: unknown;
  banish?: unknown;
  holy?: boolean;
  flash?: boolean;
  repose?: boolean;
  blue?: { physical?: boolean; cure?: boolean; flash?: boolean; spikes?: boolean; silence?: boolean; mantle?: boolean; song?: boolean; breeze?: boolean; cocoon?: boolean; metal?: boolean; refuel?: boolean; memento?: boolean; magical?: boolean; sand?: boolean; pollen?: boolean; orb?: boolean; breath?: boolean; sound?: boolean; ray?: boolean; digest?: boolean; kiss?: boolean; blitz?: boolean; gas?: boolean; gaze?: boolean; mystery?: boolean; venom?: boolean; geist?: boolean; awful?: boolean; saber?: boolean; jetta?: boolean; ice?: boolean; destruct?: boolean; roar?: boolean; cold?: boolean; hold?: boolean; feather?: boolean; penance?: boolean; mael?: boolean; eyes?: boolean; needles?: boolean; tickle?: boolean; yawn?: boolean; trunk?: boolean; infra?: boolean; spray?: boolean; ooze?: boolean; hide?: boolean; enerv?: boolean; warmup?: boolean; spit?: boolean; gorge?: boolean; amp?: boolean; lowing?: boolean; triumph?: boolean; saline?: boolean; shift?: boolean; hammer?: boolean; reactor?: boolean; exuv?: boolean };
};

/**
 * Client spell-list CE and VE for one completed cast.
 * A hostile spell claims even when the row is 0. Gravity is 0 and 0,
 * and the claim is still the first offensive action.
 * A spell on yourself does not claim. Its volatile sticks only if
 * the hare already turned.
 * Damage enmity and cure enmity are separate and are not in this pair.
 * A slip tick is not a cast.
 */
export function castEnmity(spell: CastHateSpell, undeadCure: boolean): { ce: number; ve: number; claims: boolean } {
  const hostile =
    spell.nuke != null ||
    spell.helix === true ||
    spell.debuff != null ||
    spell.enfeeble != null ||
    spell.siphon != null ||
    spell.banish != null ||
    spell.holy === true ||
    spell.flash === true ||
    spell.repose === true ||
    spell.blue?.physical === true ||
    spell.blue?.magical === true ||
    spell.blue?.ray === true ||
    spell.blue?.kiss === true ||
    spell.blue?.blitz === true ||
    spell.blue?.gas === true ||
    spell.blue?.geist === true ||
    spell.blue?.awful === true ||
    spell.blue?.saber === true ||
    spell.blue?.jetta === true ||
    spell.blue?.ice === true ||
    spell.blue?.destruct === true ||
    spell.blue?.roar === true ||
    spell.blue?.cold === true ||
    spell.blue?.hold === true ||
    spell.blue?.penance === true ||
    spell.blue?.mael === true ||
    spell.blue?.eyes === true ||
    spell.blue?.needles === true ||
    spell.blue?.spit === true ||
    (spell.cure != null && undeadCure);
  return { ...fixedSpellHate(spell), claims: hostile };
}

function fixedSpellHate(spell: CastHateSpell): { ce: number; ve: number } {
  if (spell.enfeeble) return enfeebleHate(spell.enfeeble);
  if (spell.debuff) return { ce: 1, ve: 165 };
  if (spell.nuke || spell.helix || spell.banish || spell.holy || spell.cure || spell.curaga || spell.cura || spell.raise) return { ce: 0, ve: 0 };
  if (spell.siphon === "Aspir") return { ce: 320, ve: 0 };
  if (spell.siphon) return { ce: 0, ve: 0 };
  if (spell.flash) return { ce: FLASH_CE, ve: FLASH_VE };
  if (spell.repose) return { ce: 1, ve: 165 };
  if (spell.spike) return { ce: 1, ve: 264 };
  if (spell.stoneskin || spell.aquaveil || spell.blink) return { ce: 0, ve: 165 };
  if (spell.phalanx) return { ce: PHALANX_CE, ve: PHALANX_VE };
  if (spell.reprisal) return { ce: REPRISAL_CE, ve: REPRISAL_VE };
  if (spell.foil) return { ce: 320, ve: 880 };
  if (spell.barrier) return { ce: BARRIER_CE, ve: spell.barrier.area ? BARRIER_AREA_VE : BARRIER_VE };
  if (spell.regen) return { ce: REGEN_CE, ve: REGEN_VE };
  if (spell.haste) return { ce: HASTE_CE, ve: HASTE_VE };
  if (spell.refresh) return { ce: REFRESH_CE, ve: REFRESH_VE };
  if (spell.auspice) return { ce: AUSPICE_CE, ve: AUSPICE_VE };
  if (spell.enspell) return spell.enspell.tier >= 2 ? { ce: 44, ve: 132 } : { ce: 1, ve: 165 };
  if (spell.erase) return { ce: ERASE_CE, ve: ERASE_VE };
  if (spell.bar) return { ce: BAR_CE, ve: spell.name === "Barpoisonra" || !spell.name.endsWith("ra") ? BARPOISONRA_VE : BAR_AREA_VE };
  if (spell.na || spell.esuna || spell.sacrifice) return { ce: 1, ve: 165 };
  if (spell.reraise) return { ce: 1, ve: 80 };
  if (spell.warp === "Warp II") return { ce: 1, ve: 300 };
  if (spell.storm) return { ce: 1, ve: 300 };
  if (spell.klimaform) return { ce: 300, ve: 1 };
  return { ce: 0, ve: 0 };
}

function enfeebleHate(name: string): { ce: number; ve: number } {
  switch (name) {
    case "Bind":
      return { ce: BIND_CE, ve: BIND_VE };
    case "Poison":
    case "Poison II":
    case "Poisonga":
      return { ce: POISON_CE, ve: POISON_VE };
    case "Blind":
      return { ce: 1, ve: 165 };
    case "Blind II":
      return { ce: BLIND_II_CE, ve: BLIND_II_VE };
    case "Sleep":
    case "Sleep II":
      return { ce: 1, ve: 176 };
    case "Sleepga":
    case "Sleepga II":
      return { ce: 180, ve: 0 };
    case "Slow":
      return { ce: SLOW_CE, ve: SLOW_VE };
    case "Slow II":
      return { ce: SLOW_II_CE, ve: SLOW_II_VE };
    case "Paralyze":
      return { ce: PARALYZE_CE, ve: PARALYZE_VE };
    case "Paralyze II":
      return { ce: PARALYZE_II_CE, ve: PARALYZE_II_VE };
    case "Silence":
      return { ce: SILENCE_CE, ve: SILENCE_VE };
    case "Gravity":
    case "Dia":
    case "Dia II":
    case "Dia III":
    case "Diaga":
    case "Inundation":
      return { ce: 0, ve: 0 };
    case "Dispel":
      return { ce: DISPEL_CE, ve: DISPEL_VE };
    case "Stun":
      return { ce: STUN_CE, ve: STUN_VE };
    case "Bio":
    case "Bio II":
    case "Bio III":
      return { ce: BIO_CE, ve: BIO_VE };
    case "Distract":
      return { ce: DISTRACT_CE, ve: DISTRACT_VE };
    case "Frazzle":
      return { ce: FRAZZLE_CE, ve: FRAZZLE_VE };
    default:
      return { ce: 0, ve: 0 };
  }
}

export function assertMagic(): void {
  const m = dStatMagicAccuracy;
  if (m(0) !== 0 || m(10) !== 10 || m(12) !== 11 || m(30) !== 20 || m(67) !== 29 || m(70) !== 30 || m(71) !== 30) {
    throw new Error("magic accuracy");
  }
  if (m(-10) !== -10 || m(-30) !== -20 || m(-67) !== -30 || m(-70) !== -30 || m(-71) !== -30) {
    throw new Error("negative magic accuracy");
  }
  if (accuracyStat("black") !== "int" || accuracyStat("white") !== "mnd" || accuracyStat("ninjutsu") !== null) {
    throw new Error("accuracy stat");
  }
  if (elementalD("Stone", 0) !== 10 || elementalD("Stone", 49) !== 108 || elementalD("Stone", 50) !== 110) {
    throw new Error("Stone low");
  }
  if (elementalD("Stone", 67) !== 127 || elementalD("Stone", 100) !== 160 || elementalD("Stone", 150) !== 160) {
    throw new Error("Stone high");
  }
  if (elementalD("Stone", -1) !== null || elementalD("Stone IV", -1) !== null) throw new Error("negative dINT is not numbered");
  if (helixD(0) !== 25 || helixD(38) !== 63 || helixD(58) !== 83 || helixD(77) !== 102) throw new Error("helix low");
  if (helixD(78) !== 103 || helixD(234) !== 181 || helixD(235) !== 181 || helixD(400) !== 181 || helixD(-1) !== null) {
    throw new Error("helix cap");
  }
  if (elementalD("Thunder", 0) !== 85 || elementalD("Water", 1) !== 26) throw new Error("spell bands");
  if (elementalD("Stone II", 0) !== 100 || elementalD("Stone II", 49) !== 247 || elementalD("Stone II", 50) !== 250) {
    throw new Error("Stone II low");
  }
  if (elementalD("Stone II", 67) !== 284 || elementalD("Stone II", 200) !== 450 || elementalD("Stone II", 400) !== 450) {
    throw new Error("Stone II cap");
  }
  if (elementalD("Stone III", 67) !== 451 || elementalD("Stone III", 300) !== 850 || elementalD("Stone III", 400) !== 850) {
    throw new Error("Stone III cap");
  }
  if (elementalD("Stone IV", 67) !== 718 || elementalD("Stone IV", 400) !== 1450 || elementalD("Stone IV", 500) !== 1450) {
    throw new Error("Stone IV cap");
  }
  if (elementalD("Water", 0) !== 25 || elementalD("Water", 49) !== 113 || elementalD("Water", 50) !== 115 || elementalD("Water", 150) !== 165) {
    throw new Error("Water bands");
  }
  if (elementalD("Water II", 0) !== 120 || elementalD("Water II", 49) !== 257 || elementalD("Water II", 200) !== 455 || elementalD("Water II", 400) !== 455) {
    throw new Error("Water II cap");
  }
  if (elementalD("Water III", 67) !== 464 || elementalD("Water III", 300) !== 855 || elementalD("Water III", 400) !== 855) {
    throw new Error("Water III cap");
  }
  if (elementalD("Water IV", 67) !== 741 || elementalD("Water IV", 200) !== 1165 || elementalD("Water IV", 300) !== 1364) {
    throw new Error("Water IV bands");
  }
  if (elementalD("Water IV", 400) !== 1464 || elementalD("Water IV", 500) !== 1464 || elementalD("Water IV", -1) !== null) {
    throw new Error("Water IV cap");
  }
  if (elementalD("Aero", 0) !== 40 || elementalD("Aero", 49) !== 118 || elementalD("Aero", 50) !== 120 || elementalD("Aero", 150) !== 170) {
    throw new Error("Aero bands");
  }
  if (elementalD("Aero II", 0) !== 140 || elementalD("Aero II", 49) !== 267 || elementalD("Aero II", 200) !== 460 || elementalD("Aero II", 400) !== 460) {
    throw new Error("Aero II cap");
  }
  if (elementalD("Aero III", 67) !== 477 || elementalD("Aero III", 300) !== 860 || elementalD("Aero III", 400) !== 860) {
    throw new Error("Aero III cap");
  }
  if (elementalD("Aero IV", 67) !== 764 || elementalD("Aero IV", 200) !== 1180 || elementalD("Aero IV", 300) !== 1378) {
    throw new Error("Aero IV bands");
  }
  if (elementalD("Aero IV", 400) !== 1478 || elementalD("Aero IV", 500) !== 1478 || elementalD("Aero IV", -1) !== null) {
    throw new Error("Aero IV cap");
  }
  if (elementalD("Fire", 0) !== 55 || elementalD("Fire", 49) !== 123 || elementalD("Fire", 50) !== 125 || elementalD("Fire", 150) !== 175) {
    throw new Error("Fire bands");
  }
  if (elementalD("Fire II", 0) !== 160 || elementalD("Fire II", 49) !== 277 || elementalD("Fire II", 200) !== 465 || elementalD("Fire II", 400) !== 465) {
    throw new Error("Fire II cap");
  }
  if (elementalD("Fire III", 67) !== 490 || elementalD("Fire III", 300) !== 865 || elementalD("Fire III", 400) !== 865) {
    throw new Error("Fire III cap");
  }
  if (elementalD("Fire IV", 67) !== 792 || elementalD("Fire IV", 200) !== 1195 || elementalD("Fire IV", 300) !== 1397) {
    throw new Error("Fire IV bands");
  }
  if (elementalD("Fire IV", 400) !== 1497 || elementalD("Fire IV", 500) !== 1497 || elementalD("Fire IV", -1) !== null) {
    throw new Error("Fire IV cap");
  }
  if (elementalD("Blizzard", 0) !== 70 || elementalD("Blizzard", 49) !== 128 || elementalD("Blizzard", 50) !== 130 || elementalD("Blizzard", 150) !== 180) {
    throw new Error("Blizzard bands");
  }
  if (elementalD("Blizzard II", 0) !== 180 || elementalD("Blizzard II", 49) !== 287 || elementalD("Blizzard II", 200) !== 470 || elementalD("Blizzard II", 400) !== 470) {
    throw new Error("Blizzard II cap");
  }
  if (elementalD("Blizzard III", 67) !== 504 || elementalD("Blizzard III", 300) !== 870 || elementalD("Blizzard III", 400) !== 870) {
    throw new Error("Blizzard III cap");
  }
  if (elementalD("Blizzard IV", 67) !== 816 || elementalD("Blizzard IV", 200) !== 1210 || elementalD("Blizzard IV", 300) !== 1411) {
    throw new Error("Blizzard IV bands");
  }
  if (elementalD("Blizzard IV", 400) !== 1511 || elementalD("Blizzard IV", 500) !== 1511 || elementalD("Blizzard IV", -1) !== null) {
    throw new Error("Blizzard IV cap");
  }
  if (elementalD("Thunder", 0) !== 85 || elementalD("Thunder", 49) !== 134 || elementalD("Thunder", 50) !== 135 || elementalD("Thunder", 150) !== 185) {
    throw new Error("Thunder bands");
  }
  if (elementalD("Thunder II", 0) !== 200 || elementalD("Thunder II", 49) !== 298 || elementalD("Thunder II", 200) !== 475 || elementalD("Thunder II", 400) !== 475) {
    throw new Error("Thunder II cap");
  }
  if (elementalD("Thunder III", 67) !== 517 || elementalD("Thunder III", 300) !== 875 || elementalD("Thunder III", 400) !== 875) {
    throw new Error("Thunder III cap");
  }
  if (elementalD("Thunder IV", 67) !== 839 || elementalD("Thunder IV", 200) !== 1225 || elementalD("Thunder IV", 300) !== 1425) {
    throw new Error("Thunder IV bands");
  }
  if (elementalD("Thunder IV", 400) !== 1525 || elementalD("Thunder IV", 500) !== 1525 || elementalD("Thunder IV", -1) !== null) {
    throw new Error("Thunder IV cap");
  }
  if (elementalD("Stonega", 0) !== 60 || elementalD("Stonega", 49) !== 207 || elementalD("Stonega", 50) !== 210 || elementalD("Stonega", 67) !== 244) {
    throw new Error("Stonega bands");
  }
  if (elementalD("Stonega", 200) !== 410 || elementalD("Stonega", 300) !== 410 || elementalD("Stonega", -1) !== null) {
    throw new Error("Stonega cap");
  }
  if (elementalD("Stonega II", 0) !== 250 || elementalD("Stonega II", 49) !== 446 || elementalD("Stonega II", 67) !== 501) {
    throw new Error("Stonega II bands");
  }
  if (elementalD("Stonega II", 300) !== 900 || elementalD("Stonega II", 400) !== 900 || elementalD("Stonega II", -1) !== null) {
    throw new Error("Stonega II cap");
  }
  if (elementalD("Stonega III", 67) !== 818 || elementalD("Stonega III", 200) !== 1250 || elementalD("Stonega III", 300) !== 1450) {
    throw new Error("Stonega III bands");
  }
  if (elementalD("Stonega III", 400) !== 1550 || elementalD("Stonega III", 500) !== 1550 || elementalD("Stonega III", -1) !== null) {
    throw new Error("Stonega III cap");
  }
  if (applyMab(244, 32, 0) !== 322 || applyMab(501, 32, 0) !== 661 || applyMab(818, 32, 0) !== 1079) {
    throw new Error("Stonega MAB");
  }
  if (elementalD("Blizzaga", 0) !== 160 || elementalD("Blizzaga", 49) !== 267 || elementalD("Blizzaga", 50) !== 270 || elementalD("Blizzaga", 67) !== 297) {
    throw new Error("Blizzaga bands");
  }
  if (elementalD("Blizzaga", 200) !== 450 || elementalD("Blizzaga", 300) !== 450 || elementalD("Blizzaga", -1) !== null) {
    throw new Error("Blizzaga cap");
  }
  if (elementalD("Blizzaga II", 0) !== 370 || elementalD("Blizzaga II", 49) !== 507 || elementalD("Blizzaga II", 67) !== 554) {
    throw new Error("Blizzaga II bands");
  }
  if (elementalD("Blizzaga II", 200) !== 820 || elementalD("Blizzaga II", 300) !== 920 || elementalD("Blizzaga II", 400) !== 920 || elementalD("Blizzaga II", -1) !== null) {
    throw new Error("Blizzaga II cap");
  }
  if (elementalD("Blizzaga III", 67) !== 916 || elementalD("Blizzaga III", 200) !== 1310 || elementalD("Blizzaga III", 300) !== 1511) {
    throw new Error("Blizzaga III bands");
  }
  if (elementalD("Blizzaga III", 400) !== 1611 || elementalD("Blizzaga III", 500) !== 1611 || elementalD("Blizzaga III", -1) !== null) {
    throw new Error("Blizzaga III cap");
  }
  if (applyMab(297, 32, 0) !== 392 || applyMab(554, 32, 0) !== 731 || applyMab(916, 32, 0) !== 1209) {
    throw new Error("Blizzaga MAB");
  }
  if (elementalD("Aeroga", 0) !== 100 || elementalD("Aeroga", 49) !== 227 || elementalD("Aeroga", 50) !== 230 || elementalD("Aeroga", 67) !== 260) {
    throw new Error("Aeroga bands");
  }
  if (elementalD("Aeroga", 200) !== 420 || elementalD("Aeroga", 300) !== 420 || elementalD("Aeroga", -1) !== null) {
    throw new Error("Aeroga cap");
  }
  if (elementalD("Aeroga II", 0) !== 310 || elementalD("Aeroga II", 49) !== 476 || elementalD("Aeroga II", 67) !== 527) {
    throw new Error("Aeroga II bands");
  }
  if (elementalD("Aeroga II", 200) !== 810 || elementalD("Aeroga II", 300) !== 910 || elementalD("Aeroga II", 400) !== 910 || elementalD("Aeroga II", -1) !== null) {
    throw new Error("Aeroga II cap");
  }
  if (elementalD("Aeroga III", 67) !== 864 || elementalD("Aeroga III", 200) !== 1280 || elementalD("Aeroga III", 300) !== 1478) {
    throw new Error("Aeroga III bands");
  }
  if (elementalD("Aeroga III", 400) !== 1578 || elementalD("Aeroga III", 500) !== 1578 || elementalD("Aeroga III", -1) !== null) {
    throw new Error("Aeroga III cap");
  }
  if (applyMab(260, 32, 0) !== 343 || applyMab(527, 32, 0) !== 695 || applyMab(864, 32, 0) !== 1140) {
    throw new Error("Aeroga MAB");
  }
  if (elementalD("Firaga", 0) !== 120 || elementalD("Firaga", 49) !== 237 || elementalD("Firaga", 50) !== 240 || elementalD("Firaga", 67) !== 268) {
    throw new Error("Firaga bands");
  }
  if (elementalD("Firaga", 200) !== 425 || elementalD("Firaga", 300) !== 425 || elementalD("Firaga", -1) !== null) {
    throw new Error("Firaga cap");
  }
  if (elementalD("Firaga II", 0) !== 340 || elementalD("Firaga II", 49) !== 491 || elementalD("Firaga II", 67) !== 540) {
    throw new Error("Firaga II bands");
  }
  if (elementalD("Firaga II", 200) !== 815 || elementalD("Firaga II", 300) !== 915 || elementalD("Firaga II", 400) !== 915 || elementalD("Firaga II", -1) !== null) {
    throw new Error("Firaga II cap");
  }
  if (elementalD("Firaga III", 67) !== 892 || elementalD("Firaga III", 200) !== 1295 || elementalD("Firaga III", 300) !== 1497) {
    throw new Error("Firaga III bands");
  }
  if (elementalD("Firaga III", 400) !== 1597 || elementalD("Firaga III", 500) !== 1597 || elementalD("Firaga III", -1) !== null) {
    throw new Error("Firaga III cap");
  }
  if (applyMab(268, 32, 0) !== 353 || applyMab(540, 32, 0) !== 712 || applyMab(892, 32, 0) !== 1177) {
    throw new Error("Firaga MAB");
  }
  if (elementalD("Waterga", 0) !== 80 || elementalD("Waterga", 49) !== 217 || elementalD("Waterga", 50) !== 220 || elementalD("Waterga", 67) !== 252) {
    throw new Error("Waterga bands");
  }
  if (elementalD("Waterga", 200) !== 415 || elementalD("Waterga", 300) !== 415 || elementalD("Waterga", -1) !== null) {
    throw new Error("Waterga cap");
  }
  if (elementalD("Waterga II", 0) !== 280 || elementalD("Waterga II", 49) !== 461 || elementalD("Waterga II", 67) !== 514) {
    throw new Error("Waterga II bands");
  }
  if (elementalD("Waterga II", 200) !== 805 || elementalD("Waterga II", 300) !== 905 || elementalD("Waterga II", 400) !== 905 || elementalD("Waterga II", -1) !== null) {
    throw new Error("Waterga II cap");
  }
  if (elementalD("Waterga III", 67) !== 841 || elementalD("Waterga III", 200) !== 1265 || elementalD("Waterga III", 300) !== 1464) {
    throw new Error("Waterga III bands");
  }
  if (elementalD("Waterga III", 400) !== 1564 || elementalD("Waterga III", 500) !== 1564 || elementalD("Waterga III", -1) !== null) {
    throw new Error("Waterga III cap");
  }
  if (applyMab(252, 32, 0) !== 332 || applyMab(514, 32, 0) !== 678 || applyMab(841, 32, 0) !== 1110) {
    throw new Error("Waterga MAB");
  }
  if (elementalD("Thundaga", 0) !== 200 || elementalD("Thundaga", 49) !== 298 || elementalD("Thundaga", 50) !== 300 || elementalD("Thundaga", 67) !== 325) {
    throw new Error("Thundaga bands");
  }
  if (elementalD("Thundaga", 200) !== 475 || elementalD("Thundaga", 300) !== 475 || elementalD("Thundaga", -1) !== null) {
    throw new Error("Thundaga cap");
  }
  if (elementalD("Thundaga II", 0) !== 400 || elementalD("Thundaga II", 49) !== 522 || elementalD("Thundaga II", 67) !== 567) {
    throw new Error("Thundaga II bands");
  }
  if (elementalD("Thundaga II", 200) !== 825 || elementalD("Thundaga II", 300) !== 925 || elementalD("Thundaga II", 400) !== 925 || elementalD("Thundaga II", -1) !== null) {
    throw new Error("Thundaga II cap");
  }
  if (elementalD("Thundaga III", 67) !== 939 || elementalD("Thundaga III", 200) !== 1325 || elementalD("Thundaga III", 300) !== 1525) {
    throw new Error("Thundaga III bands");
  }
  if (elementalD("Thundaga III", 400) !== 1625 || elementalD("Thundaga III", 500) !== 1625 || elementalD("Thundaga III", -1) !== null) {
    throw new Error("Thundaga III cap");
  }
  if (applyMab(325, 32, 0) !== 429 || applyMab(567, 32, 0) !== 748 || applyMab(939, 32, 0) !== 1239) {
    throw new Error("Thundaga MAB");
  }
  if (elementalD("Stonera", 0) !== 150 || elementalD("Stonera", 49) !== 297 || elementalD("Stonera", 50) !== 300 || elementalD("Stonera", 100) !== 400 || elementalD("Stonera", 200) !== 500 || elementalD("Stonera", 300) !== 500) {
    throw new Error("Stonera bands");
  }
  if (elementalD("Stonera II", 0) !== 350 || elementalD("Stonera II", 100) !== 700 || elementalD("Stonera II", 200) !== 900 || elementalD("Stonera II", 400) !== 900) {
    throw new Error("Stonera II cap");
  }
  if (elementalD("Watera", 0) !== 180 || elementalD("Watera", 50) !== 320 || elementalD("Watera", 100) !== 415 || elementalD("Watera", 200) !== 515) {
    throw new Error("Watera bands");
  }
  if (elementalD("Watera II", 0) !== 390 || elementalD("Watera II", 50) !== 575 || elementalD("Watera II", 100) !== 720 || elementalD("Watera II", 200) !== 915 || elementalD("Watera II", 400) !== 915) {
    throw new Error("Watera II cap");
  }
  if (elementalD("Aera", 0) !== 210 || elementalD("Aera", 49) !== 337 || elementalD("Aera", 50) !== 340 || elementalD("Aera", 100) !== 430 || elementalD("Aera", 200) !== 530) {
    throw new Error("Aera bands");
  }
  if (elementalD("Fira", 0) !== 240 || elementalD("Fira", 49) !== 357 || elementalD("Fira", 50) !== 360 || elementalD("Fira", 100) !== 445 || elementalD("Fira", 199) !== 544 || elementalD("Fira", 200) !== 545 || elementalD("Fira", 300) !== 545) {
    throw new Error("Fira bands");
  }
  if (elementalD("Blizzara", 0) !== 270 || elementalD("Blizzara", 50) !== 380 || elementalD("Blizzara", 100) !== 460 || elementalD("Blizzara", 200) !== 560) {
    throw new Error("Blizzara bands");
  }
  if (elementalD("Thundara", 0) !== 300 || elementalD("Thundara", 50) !== 400 || elementalD("Thundara", 100) !== 475 || elementalD("Thundara", 200) !== 575) {
    throw new Error("Thundara bands");
  }
  const ancient: ElementalSpell[] = ["Freeze", "Tornado", "Quake", "Burst", "Flood", "Flare"];
  for (const name of ancient) {
    if (elementalD(name, 0) !== 700 || elementalD(name, 49) !== 798 || elementalD(name, 50) !== 800 || elementalD(name, 67) !== 834) {
      throw new Error(`${name} bands`);
    }
    if (elementalD(name, 200) !== 1100 || elementalD(name, 500) !== 1700 || elementalD(name, 599) !== 1898) {
      throw new Error(`${name} high bands`);
    }
    if (elementalD(name, 600) !== 1900 || elementalD(name, 700) !== 1900 || elementalD(name, -1) !== null) {
      throw new Error(`${name} cap`);
    }
  }
  if (applyMab(834, 32, 0) !== 1100) throw new Error("ancient MAB");
  if (applyMab(127, 32, 0) !== 167 || applyMab(284, 32, 0) !== 374 || applyMab(451, 32, 0) !== 595 || applyMab(718, 32, 0) !== 947) {
    throw new Error("MAB ratio");
  }
  if (applyMab(565, 150, 0) !== 1412) throw new Error("MAB ratio");
  const near = (got: number, want: number) => Math.abs(got - want) < 1e-9;
  if (!near(elementalCastSeconds(0.5, 0.2), 0.4) || !near(elementalCastSeconds(1.5, 0.2), 1.2)) throw new Error("celerity cast");
  if (!near(elementalCastSeconds(3, 0.2), 2.4) || !near(elementalCastSeconds(5, 0.2), 4) || elementalCastSeconds(5, 0) !== 5) {
    throw new Error("celerity cast");
  }
  if (!near(elementalCastSeconds(8.5, 0.2), 6.8)) throw new Error("ancient celerity");
  if (!near(elementalCastSeconds(2.5, 0.2), 2)) throw new Error("debuff celerity");
  if (spikeBase("Blaze Spikes", 0) !== 4 || spikeBase("Blaze Spikes", 70) !== 10 || spikeBase("Blaze Spikes", 250) !== 25) {
    throw new Error("Blaze Spikes base");
  }
  if (spikeBase("Blaze Spikes", 262) !== 25 || spikeBase("Ice Spikes", 70) !== 6 || spikeBase("Ice Spikes", 250) !== 15) {
    throw new Error("spike caps");
  }
  if (spikeBase("Shock Spikes", 70) !== 6 || spikeBase("Shock Spikes", 251) !== 15 || spikeBase("Shock Spikes", -51) !== 0) {
    throw new Error("Shock Spikes base");
  }
  if (spikeDamage(25, 100) !== 50 || spikeDamage(10, 32) !== 13 || spikeDamage(6, 32) !== 7 || spikeDamage(10, 0) !== 10) {
    throw new Error("spike damage");
  }
  const band = elementDebuffPotency;
  if (band(1).stat !== 5 || band(1).dot !== 1 || band(39).dot !== 1 || band(40).stat !== 7 || band(69).dot !== 2) {
    throw new Error("debuff low INT");
  }
  if (band(70).stat !== 9 || band(70).dot !== 3 || band(99).dot !== 3 || band(100).stat !== 11 || band(149).dot !== 4) {
    throw new Error("debuff mid INT");
  }
  if (band(150).stat !== 11 || band(150).dot !== 4 || band(151).stat !== 13 || band(151).dot !== 5) {
    throw new Error("debuff high INT");
  }
  const shock = resolveElementDebuff(["Drown"], "Shock");
  if (!shock.landed || shock.removed !== "Drown" || shock.active.join() !== "Shock") throw new Error("Shock overwrites Drown");
  const rasp = resolveElementDebuff(["Rasp"], "Shock");
  if (rasp.landed || rasp.blockedBy !== "Rasp" || rasp.active.join() !== "Rasp") throw new Error("Rasp overwrites Shock");
  const burn = resolveElementDebuff(["Drown", "Frost"], "Burn");
  if (burn.landed || burn.removed !== null || burn.blockedBy !== "Drown" || burn.active.join() !== "Drown,Frost") {
    throw new Error("Burn loses to Drown");
  }
  const stack = resolveElementDebuff(["Rasp", "Drown"], "Frost");
  if (!stack.landed || stack.active.join() !== "Rasp,Drown,Frost") throw new Error("Rasp Drown Frost stack");
  const refresh = resolveElementDebuff(["Shock", "Burn", "Choke"], "Shock");
  if (!refresh.landed || refresh.active.join() !== "Burn,Choke,Shock") throw new Error("Shock refreshes");
  let left = 90;
  let acc = 0;
  let ticks = 0;
  for (let i = 0; i < 180; i++) {
    const step = debuffTick(left, acc, 0.5);
    left = step.left;
    acc = step.acc;
    ticks += step.ticks;
  }
  if (ticks !== 30 || left !== 0) throw new Error(`debuff ticks ${ticks} ${left}`);
  const one = debuffTick(90, 0, 3);
  if (one.ticks !== 1 || one.left !== 87) throw new Error("one debuff tick");
  if (blindPotency(67) !== 36 || blindPotency(0) !== 20 || blindPotency(-39) !== 10 || blindPotency(-40) !== 10) {
    throw new Error("Blind potency");
  }
  if (blindPotency(120) !== 50 || blindPotency(200) !== 50 || blindPotency(-80) !== 5 || blindPotency(-200) !== 5) {
    throw new Error("Blind clamp");
  }
  if (slowPotency(0) !== 150 || slowPotency(1) !== 152 || slowPotency(-1) !== 149 || slowPotency(75) !== 300 || slowPotency(76) !== 300) {
    throw new Error("Slow potency");
  }
  if (slowPotency(-75) !== 75 || slowPotency(-76) !== 75 || slowDelayFactor(0) !== 1 || slowDelayFactor(300) !== 1324 / 1024) {
    throw new Error("Slow clamp");
  }
  if (paralyzeChance(-40) !== 5 || paralyzeChance(0) !== 15 || paralyzeChance(4) !== 16 || paralyzeChance(40) !== 25 || paralyzeChance(80) !== 25 || paralyzeChance(-80) !== 5) {
    throw new Error("Paralyze chance");
  }
  if (blindTwoPotency(-80) !== 19 || blindTwoPotency(0) !== 49 || blindTwoPotency(120) !== 94 || blindTwoPotency(-200) !== 19 || blindTwoPotency(200) !== 94) {
    throw new Error("Blind II potency");
  }
  if (paralyzeTwoChance(-40) !== 14 || paralyzeTwoChance(0) !== 24 || paralyzeTwoChance(40) !== 34 || paralyzeTwoChance(4) !== 25 || paralyzeTwoChance(80) !== 34) {
    throw new Error("Paralyze II chance");
  }
  if (slowTwoPotency(-75) !== 169 || slowTwoPotency(75) !== 400 || slowTwoPotency(0) !== 284 || slowTwoPotency(-76) !== 169 || slowTwoPotency(76) !== 400) {
    throw new Error("Slow II potency");
  }
  if (enfeebleCanLand(null, "Blind") !== true || enfeebleCanLand("Blind", "Blind II") !== true || enfeebleCanLand("Blind II", "Blind") !== false || enfeebleCanLand("Blind", "Blind") !== true) {
    throw new Error("Blind overwrite");
  }
  if (enfeebleCanLand("Slow II", "Slow") !== false || enfeebleCanLand("Paralyze", "Slow") !== true || enfeebleCanLand("Paralyze", "Paralyze II") !== true) {
    throw new Error("enfeeble overwrite");
  }
  if (gravityMoveFactor() !== 0.74 || GRAVITY_SECONDS !== 120 || GRAVITY_MOVE !== 26) throw new Error("Gravity");
  if (inundationTypes([{ actor: "a", weapon: "Sword" }]) !== 1) throw new Error("Inundation one");
  if (inundationTypes([{ actor: "a", weapon: "Sword" }, { actor: "a", weapon: "Scythe" }]) !== 1) throw new Error("Inundation same actor");
  if (inundationTypes([{ actor: "a", weapon: "Sword" }, { actor: "b", weapon: "Sword" }]) !== 1) throw new Error("Inundation same weapon");
  if (inundationTypes([{ actor: "a", weapon: "Sword" }, { actor: "b", weapon: "Scythe" }, { actor: "c", weapon: "Polearm" }]) !== 3) {
    throw new Error("Inundation types");
  }
  if (inundationMultiplier(1) !== 1 || inundationMultiplier(2) !== 1.2 || Math.abs(inundationMultiplier(15) - 1.2 ** 14) > 1e-9) {
    throw new Error("Inundation multiplier");
  }
  if (evasionDownPotency(0, 0) !== 0 || evasionDownPotency(125, 0) !== 25 || evasionDownPotency(124, 0) !== 24) {
    throw new Error("evasion down skill");
  }
  if (evasionDownPotency(276, 0) !== 25 || evasionDownPotency(125, 50) !== 35 || evasionDownPotency(125, 49) !== 34) {
    throw new Error("evasion down cap");
  }
  if (evasionDownPotency(125, 5) !== 26 || evasionDownPotency(125, 4) !== 25 || evasionDownPotency(125, -20) !== 25) {
    throw new Error("evasion down mind");
  }
  if (evasionDownPotency(10, 3) !== 2 || evasionDownPotency(276, 100) !== 35 || distractPower([]) !== 0) {
    throw new Error("evasion down low");
  }
  if (distractPower([{ name: "Frazzle", power: 35 }, { name: "Distract", power: 31 }]) !== 31) {
    throw new Error("Distract power");
  }
  if (aquaveilCharges(0) !== 1 || aquaveilCharges(300) !== 1 || aquaveilCharges(301) !== 2 || aquaveilCharges(500) !== 2 || aquaveilCharges(501) !== 3) {
    throw new Error("Aquaveil charges");
  }
  const bare = { attackerLevel: 75, defenderLevel: 75, skill: 256, skillCap: 256, sirdDown: 0 };
  if (spellInterruptChance(bare) !== 0.5) throw new Error("interrupt bare");
  if (spellInterruptChance({ ...bare, sirdDown: 102 }) !== 0 || spellInterruptChance({ ...bare, sirdDown: 103 }) !== 0) {
    throw new Error("interrupt immune");
  }
  if (Math.abs(spellInterruptChance({ ...bare, sirdDown: 100 }) - 0.5 * 24 / 1024) > 1e-9) throw new Error("interrupt 100");
  if (Math.abs(spellInterruptChance({ ...bare, sirdDown: 50 }) - 0.5 * 524 / 1024) > 1e-9) throw new Error("interrupt 50");
  if (spellInterruptChance({ ...bare, attackerLevel: 1 }) !== 0.05) throw new Error("interrupt low");
  if (spellInterruptChance({ ...bare, skill: 128 }) !== 1) throw new Error("interrupt skill");
  if (spellInterruptChance({ ...bare, skill: 0, skillCap: 200 }) !== 5) throw new Error("interrupt no skill");
  if (interruptSkill("singing") !== null || interruptSkill("elemental") !== "Elemental Magic" || interruptSkill("geomancy") !== "Geomancy") {
    throw new Error("interrupt skill name");
  }
  if (phalanxPower(0) !== 0 || phalanxPower(29) !== 0 || phalanxPower(30) !== 1 || phalanxPower(100) !== 8 || phalanxPower(250) !== 23 || phalanxPower(300) !== 28) {
    throw new Error("Phalanx low band");
  }
  if (phalanxPower(301) !== 28 || phalanxPower(329) !== 29 || phalanxPower(358) !== 30 || phalanxPower(386) !== 31 || phalanxPower(415) !== 32 || phalanxPower(443) !== 33 || phalanxPower(472) !== 34 || phalanxPower(500) !== 35 || phalanxPower(600) !== 35) {
    throw new Error("Phalanx high band");
  }
  if (!phalanxOverwrites(null, 0) || !phalanxOverwrites(8, 8) || phalanxOverwrites(8, 7) || phalanxTaken(100, 20) !== 80 || phalanxTaken(5, 20) !== 0) {
    throw new Error("Phalanx overwrite");
  }
  if (reprisalShieldSkill(200) !== 230 || reprisalShieldSkill(0) !== 0 || reprisalBlockRate(30) !== 45 || reprisalReflect(100) !== 33 || reprisalReflect(2) !== 0) {
    throw new Error("Reprisal");
  }
  if (PHALANX_SECONDS !== 180 || PHALANX_CE !== 1 || PHALANX_VE !== 165 || REPRISAL_SECONDS !== 60 || REPRISAL_CE !== 1 || REPRISAL_VE !== 640 || REPRISAL_REFLECT !== 33) {
    throw new Error("Phalanx or Reprisal card");
  }
  if (bindWearsOff(0) || bindWearsOff(-1) || !bindWearsOff(1) || !bindWearsOff(12)) throw new Error("Bind wears on direct damage");
  if (siphonMax("Drain", 0) !== 20 || siphonMax("Drain", 269) !== 289 || siphonMax("Drain", 300) !== 320) throw new Error("Drain max");
  if (siphonMax("Drain", 301) !== 320 || siphonMax("Aspir", 0) !== 20 || siphonMax("Aspir", 269) !== 109 || siphonMax("Aspir", 300) !== 120) {
    throw new Error("siphon bands");
  }
  if (siphonMax("Aspir", 301) !== 120 || siphonMin(289) !== 144 || siphonMin(109) !== 54 || siphonMin(320) !== 160) throw new Error("siphon floor");
  if (siphonPotency("Drain", 269, 0) !== 144 || siphonPotency("Drain", 269, 0.999999) !== 289) throw new Error("Drain roll");
  if (siphonPotency("Aspir", 269, 0) !== 54 || siphonPotency("Aspir", 269, 0.999999) !== 109) throw new Error("Aspir roll");
  if (siphonPotency("Drain", 269, 0.5, true) !== 0 || siphonPotency("Aspir", 269, 1, true) !== 0) throw new Error("undead siphon");
  if (siphonTaken("Aspir", 109, 0) !== 0 || siphonTaken("Aspir", 109, 12) !== 12 || siphonTaken("Aspir", 40, 80) !== 40) throw new Error("Aspir pool");
  if (siphonTaken("Drain", 289, 0) !== 289 || siphonGained(289, 800, 897) !== 97 || siphonGained(289, 897, 897) !== 0 || siphonGained(0, 10, 100) !== 0) {
    throw new Error("siphon gain");
  }
  if (sleepSeconds("Sleep") !== 60 || sleepSeconds("Sleepga") !== 60 || sleepSeconds("Sleep II") !== 90 || sleepSeconds("Sleepga II") !== 90) {
    throw new Error("sleep duration");
  }
  if (sleepCanLand("Sleep II", "Sleep") || sleepCanLand("Sleepga II", "Sleepga") || !sleepCanLand("Sleep", "Sleep II") || !sleepCanLand("Sleepga", "Sleep")) {
    throw new Error("sleep overwrite");
  }
  if (curePower(70, 56, 276) !== 325 || curePower(0, 0, 0) !== 0) throw new Error("cure power");
  if (cureBase("Cure", 0) !== 10 || cureBase("Cure", 325) !== 51 || cureBase("Cure", 600) !== 65 || cureBase("Cure", 800) !== 65) {
    throw new Error("Cure bands");
  }
  if (cureBase("Cure II", 0) !== 60 || cureBase("Cure II", 325) !== 122 || cureBase("Cure II", 700) !== 145) throw new Error("Cure II bands");
  if (cureBase("Cure III", 325) !== 265 || cureBase("Cure III", 700) !== 340) throw new Error("Cure III bands");
  if (cureBase("Cure IV", 325) !== 467 || cureBase("Cure IV", 700) !== 640) throw new Error("Cure IV bands");
  if (cureBase("Cure V", 325) !== 650 || cureBase("Cure V", 700) !== 780 || cureBase("Cure V", 0) !== 450) throw new Error("Cure V bands");
  if (cureFinal(51, false) !== 51 || cureFinal(51, true) !== 102) throw new Error("Divine Seal cure");
  if (cureUndeadD("Cure", 20) !== null || cureUndeadD("Cure II", -1) !== null) throw new Error("cure undead unpublished");
  if (cureUndeadD("Cure II", 0) !== 35 || cureUndeadD("Cure III", 4) !== 74 || cureUndeadD("Cure IV", 10) !== 155 || cureUndeadD("Cure V", 0) !== 210) {
    throw new Error("cure undead damage");
  }
  if (curagaPower(70, 56, 276) !== 431 || curagaPower(0, 0, 0) !== 0 || curagaPower(1, 0, 4) !== 3) throw new Error("Curaga power");
  if (curagaBase("Curaga", 0) !== 60 || curagaBase("Curaga", 109) !== 74 || curagaBase("Curaga", 110) !== 75) throw new Error("Curaga low");
  if (curagaBase("Curaga", 169) !== 89 || curagaBase("Curaga", 170) !== 90 || curagaBase("Curaga", 431) !== 93 || curagaBase("Curaga", 5000) !== 105) {
    throw new Error("Curaga bands");
  }
  if (curagaBase("Curaga II", 0) !== 130 || curagaBase("Curaga II", 431) !== 194 || curagaBase("Curaga II", 5000) !== 220) throw new Error("Curaga II");
  if (curagaBase("Curaga III", 0) !== 270 || curagaBase("Curaga III", 219) !== 328 || curagaBase("Curaga III", 220) !== 330 || curagaBase("Curaga III", 431) !== 382 || curagaBase("Curaga III", 5000) !== 450) {
    throw new Error("Curaga III");
  }
  if (curagaBase("Curaga IV", 0) !== 450 || curagaBase("Curaga IV", 319) !== 568 || curagaBase("Curaga IV", 320) !== 570 || curagaBase("Curaga IV", 431) !== 625 || curagaBase("Curaga IV", 5000) !== 810) {
    throw new Error("Curaga IV");
  }
  if (cureFinal(curagaBase("Curaga", 431), true) !== 186) throw new Error("Divine Seal Curaga");
  if (curaHp() !== null) throw new Error("Cura HP unpublished");
  if (nextMiseryWound(40, 0, true) !== 40 || nextMiseryWound(40, 12, false) !== 40 || nextMiseryWound(40, 12.9, true) !== 12 || nextMiseryWound(0, 7, true) !== 7) {
    throw new Error("misery wound");
  }
  if (stoneskinPower(0, 0) !== 0 || stoneskinPower(50, 0) !== 50 || stoneskinPower(79, 0) !== 79 || stoneskinPower(80, 0) !== 100) {
    throw new Error("Stoneskin low band");
  }
  if (stoneskinPower(70, 180) !== 200 || stoneskinPower(70, 230) !== 250) throw new Error("Stoneskin bands");
  if (stoneskinPower(0, 539) !== 349 || stoneskinPower(0, 540) !== 350 || stoneskinPower(0, 600) !== 350 || stoneskinPower(200, 300) !== 350) {
    throw new Error("Stoneskin cap");
  }
  if (solaceSkin(0) !== 0 || solaceSkin(51) !== 12 || solaceSkin(100) !== 25 || solaceSkin(102) !== 25 || solaceSkin(122) !== 30) {
    throw new Error("solace skin");
  }
  if (solaceSkin(1200) !== 300 || solaceSkin(1300) !== 300 || SOLACE_SKIN_CAP !== 300 || SOLACE_SKIN_SECONDS !== 30) {
    throw new Error("solace cap");
  }
  if (stoneskinSource(undefined) !== "spell" || stoneskinSource("spell") !== "spell" || stoneskinSource("solace") !== "solace" || stoneskinSource("metal") !== "metal" || stoneskinSource("hide") !== "hide") {
    throw new Error("stoneskin source");
  }
  if (!stoneskinCanLand(null) || !stoneskinCanLand("solace") || !stoneskinCanLand("metal") || !stoneskinCanLand("hide") || stoneskinCanLand("spell")) throw new Error("stoneskin overwrite");
  if (WEAKNESS_SECONDS !== 300 || RERAISE_SECONDS !== 3600 || WEAKNESS_REMAIN !== 0.25 || WEAKNESS_DELAY !== 2) {
    throw new Error("raise durations");
  }
  if (weakenedPool(971) !== 242 || raiseHpRestored("Raise", 971) !== 24 || raiseHpRestored("Raise II", 971) !== 60 || raiseHpRestored("Raise III", 971) !== 121) {
    throw new Error("raise HP");
  }
  if (raiseHpRestored("Raise", 1) !== 0 || weakenedPool(1) !== 0) throw new Error("raise HP has no invented minimum");
  if (raiseExpFraction("Raise", 1) !== 0.5 || raiseExpFraction("Raise II", 49) !== 0.5 || raiseExpFraction("Raise III", 49) !== 0.5) {
    throw new Error("raise exp under 50");
  }
  if (raiseExpFraction("Raise II", 50) !== 0.75 || raiseExpFraction("Raise III", 50) !== 0.9 || raiseExpFraction("Raise", 75) !== 0.5) {
    throw new Error("raise exp");
  }
  const fresh = applyWeakness(null);
  const doubled = applyWeakness({ left: 12, double: false });
  const still = applyWeakness(doubled);
  if (fresh.left !== 300 || fresh.double || !doubled.double || doubled.left !== 300 || !still.double) throw new Error("weakness");
  if (applyWeakness({ left: 0, double: true }).double) throw new Error("expired weakness is not double");
  if (weaknessDelayFactor(null) !== 1 || weaknessDelayFactor(fresh) !== 2 || weaknessMagicDealt(fresh) !== null || weaknessMagicDealt(doubled) !== 0) {
    throw new Error("weakness hooks");
  }
  if (weaknessRanged(fresh) !== null || weaknessRanged(doubled)?.acc !== 1 || weaknessRanged(doubled)?.atk !== 1) throw new Error("double weakness ranged");
  const raised = resolveRaise("Raise III", { ko: true, level: 49, maxHp: 971, weakness: null });
  if (!raised || raised.hp !== 121 || raised.expFraction !== 0.5 || raised.weakness.double) throw new Error("Raise III under 50");
  if (resolveRaise("Raise", { ko: false, level: 75, maxHp: 971, weakness: null }) !== null) throw new Error("Raise on the living");
  const ready = reraiseOnKo("Reraise", 971, { left: 20, double: false });
  if (!ready || ready.spell !== "Reraise" || ready.hp !== 24 || !ready.weakness.double || ready.via != null || reraiseOnKo(null, 971, null) !== null) {
    throw new Error("reraise on KO");
  }
  const hymn = hymnusOnKo(971, null);
  if (hymn.via !== "Goddess's Hymnus" || hymn.hp !== raiseHpRestored("Raise III", 971) || hymn.hp === raiseHpRestored("Raise", 971) || hymn.weakness.double) throw new Error("Hymnus on KO");
  if (!isReraiseSpell("Reraise II") || isReraiseSpell("Raise II") || raiseFromReraise("Reraise III") !== "Raise III") {
    throw new Error("reraise names");
  }
  if (banishDamage("Banish", 67, 0) !== 81 || banishDamage("Banish", 67, 0, 0, true) !== 121 || banishDamage("Banish", -20, 0) !== 0) {
    throw new Error("Banish damage");
  }
  if (banishDamage("Banish II", 67, 0) !== 152 || banishDamage("Banish III", 67, 0) !== 298) throw new Error("Banish II and III");
  if (banishDamage("Banishga", 67, 0) !== 117 || banishDamage("Banishga II", 67, 0) !== 247) throw new Error("Banishga damage");
  if (holyDamage(67, 0) !== 192 || holyDamage(0, 0) !== 125 || holyDamage(-200, 0) !== 0) throw new Error("Holy damage");
  if (banishDamage("Banish", 67, 50) !== 121 || banishDamage("Banish", 67, 50, 0, true) !== 181) throw new Error("Banish MAB");
  if (FLASH_SECONDS !== 12 || FLASH_ACC !== 300 || FLASH_CE !== 180 || FLASH_VE !== 1280) throw new Error("Flash card");
  if (BIND_CE !== 1 || BIND_VE !== 165 || POISON_CE !== 1 || POISON_VE !== 176) throw new Error("Bind or Poison enmity");
  const poison = castEnmity({ name: "Poison", enfeeble: "Poison" }, false);
  if (!poison.claims || poison.ce !== 1 || poison.ve !== 176) throw new Error("Poison claims");
  const bind = castEnmity({ name: "Bind", enfeeble: "Bind" }, false);
  if (!bind.claims || bind.ce !== 1 || bind.ve !== 165) throw new Error("Bind claims");
  const gravity = castEnmity({ name: "Gravity", enfeeble: "Gravity" }, false);
  if (!gravity.claims || gravity.ce !== 0 || gravity.ve !== 0) throw new Error("Gravity still claims");
  const sleepga = castEnmity({ name: "Sleepga", enfeeble: "Sleepga" }, false);
  if (!sleepga.claims || sleepga.ce !== 180 || sleepga.ve !== 0) throw new Error("Sleepga enmity");
  const aspir = castEnmity({ name: "Aspir", siphon: "Aspir" }, false);
  if (!aspir.claims || aspir.ce !== 320 || aspir.ve !== 0) throw new Error("Aspir enmity");
  const drain = castEnmity({ name: "Drain", siphon: "Drain" }, false);
  if (!drain.claims || drain.ce !== 0 || drain.ve !== 0) throw new Error("Drain row is damage only");
  const stone = castEnmity({ name: "Stone", nuke: "Stone" }, false);
  if (!stone.claims || stone.ce !== 0 || stone.ve !== 0) throw new Error("nuke row is damage only");
  const haste = castEnmity({ name: "Haste", haste: { effectLevel: 48 } }, false);
  if (haste.claims || haste.ce !== 1 || haste.ve !== 165) throw new Error("Haste does not claim");
  const bars = castEnmity({ name: "Barfira", bar: { kind: "element" } }, false);
  if (bars.claims || bars.ce !== 1 || bars.ve !== 80) throw new Error("area bar enmity");
  const poisonBar = castEnmity({ name: "Barpoisonra", bar: { kind: "status" } }, false);
  if (poisonBar.ve !== 300) throw new Error("Barpoisonra enmity");
  const spikes = castEnmity({ name: "Blaze Spikes", spike: "Blaze Spikes" }, false);
  if (spikes.claims || spikes.ce !== 1 || spikes.ve !== 264) throw new Error("spikes do not claim");
  const phalanx = castEnmity({ name: "Phalanx", phalanx: { effectLevel: 33 } }, false);
  if (phalanx.claims || phalanx.ce !== 1 || phalanx.ve !== 165) throw new Error("Phalanx does not claim");
  const reprisal = castEnmity({ name: "Reprisal", reprisal: { effectLevel: 1 } }, false);
  if (reprisal.claims || reprisal.ce !== 1 || reprisal.ve !== 640) throw new Error("Reprisal does not claim");
  const en2 = castEnmity({ name: "Enfire II", enspell: { tier: 2 } }, false);
  if (en2.claims || en2.ce !== 44 || en2.ve !== 132) throw new Error("Enspell II enmity");
  const cure = castEnmity({ name: "Cure", cure: "Cure" }, false);
  if (cure.claims || cure.ce !== 0) throw new Error("Cure on yourself does not claim");
  const undead = castEnmity({ name: "Cure", cure: "Cure" }, true);
  if (!undead.claims) throw new Error("Cure on undead claims");
  const kickHate = castEnmity({ name: "Foot Kick", blue: { physical: true } }, false);
  if (!kickHate.claims || kickHate.ce !== 0 || kickHate.ve !== 0) throw new Error("Foot Kick claims");
  const maelHate = castEnmity({ name: "Maelstrom", blue: { mael: true } }, false);
  const eyesHate = castEnmity({ name: "Eyes On Me", blue: { eyes: true } }, false);
  if (!maelHate.claims || maelHate.ce !== 0 || maelHate.ve !== 0 || !eyesHate.claims || eyesHate.ce !== 0 || eyesHate.ve !== 0) throw new Error("Maelstrom or Eyes On Me claims");
  const danceHate = castEnmity({ name: "Battle Dance", blue: { physical: true } }, false);
  const upperHate = castEnmity({ name: "Uppercut", blue: { physical: true } }, false);
  if (!danceHate.claims || danceHate.ce !== 0 || danceHate.ve !== 0 || !upperHate.claims || upperHate.ce !== 0 || upperHate.ve !== 0) throw new Error("brawler claims");
  const carrotHate = castEnmity({ name: "Wild Carrot", blue: { cure: true } }, false);
  if (carrotHate.claims || carrotHate.ce !== 0 || carrotHate.ve !== 0) throw new Error("Wild Carrot does not claim");
  const repose = castEnmity({ name: "Repose", repose: true }, false);
  if (!repose.claims || repose.ce !== 1 || repose.ve !== 165) throw new Error("Repose enmity");
  if (REPOSE_SECONDS !== 90 || REPOSE_MACC !== 175 || sleepSeconds("Repose") !== 90 || sleepIsWide("Repose") || !isSleepSpell("Repose")) {
    throw new Error("Repose card");
  }
  if (!sleepCanLand(null, "Repose") || !sleepCanLand("Sleep", "Repose") || !sleepCanLand("Sleepga", "Repose") || !sleepCanLand("Repose", "Repose")) {
    throw new Error("Repose lands");
  }
  if (sleepCanLand("Sleep II", "Repose") || sleepCanLand("Sleepga II", "Repose")) throw new Error("Repose loses to Sleep II");
  if (sleepCanLand("Repose", "Sleep") || sleepCanLand("Repose", "Sleep II") || sleepCanLand("Repose", "Sleepga") || sleepCanLand("Repose", "Sleepga II")) {
    throw new Error("sleep loses to Repose");
  }
  const down = resolveBanishDown(null, "Banish", true);
  if (!down || down.left !== 15 || down.sdr !== 128 / 256 || down.name !== "Banish") throw new Error("Banish defense");
  const higher = resolveBanishDown(down, "Banish II", true);
  if (!higher || higher.name !== "Banish II" || higher.left !== 30 || higher.sdr !== 179 / 256) throw new Error("Banish II replaces");
  if (resolveBanishDown(higher, "Banishga", true) !== higher) throw new Error("lower Banish does not replace");
  const third = resolveBanishDown(higher, "Banish III", true);
  if (!third || third.sdr !== 230 / 256 || third.left !== 45 || BANISH_DOWN["Banishga II"].num !== 179) throw new Error("Banish III defense");
  if (resolveBanishDown(down, "Banish", false) !== down || resolveBanishDown(null, "Banishga II", false) !== null) {
    throw new Error("living Banish has no defense down");
  }
  if (PROTECT_DEF[1] !== 20 || PROTECT_DEF[2] !== 50 || PROTECT_DEF[3] !== 90 || PROTECT_DEF[4] !== 140 || PROTECT_DEF[5] !== 220) {
    throw new Error("Protect defense");
  }
  if (SHELL_CUT[1] !== 27 || SHELL_CUT[2] !== 42 || SHELL_CUT[3] !== 56 || SHELL_CUT[4] !== 67 || SHELL_CUT[5] !== 75) {
    throw new Error("Shell cut");
  }
  if (barrierDuration(7, 75) !== 1800 || barrierDuration(63, 63) !== 1800 || barrierDuration(63, 31) !== (1800 * 31) / 63) {
    throw new Error("barrier duration");
  }
  if (!barrierOverwrites(null, 1) || !barrierOverwrites(1, 1) || !barrierOverwrites(2, 4) || barrierOverwrites(4, 2)) {
    throw new Error("barrier overwrite");
  }
  if (shellTaken(100, 27) !== 89 || shellTaken(256, 27) !== 229 || shellTaken(100, 0) !== 100 || shellTaken(40, 75) !== 28) {
    throw new Error("Shell damage");
  }
  if (protectPower([]) !== 0 || protectPower([{ name: "Shell", power: 27 }, { name: "Protect", power: 50 }]) !== 50) {
    throw new Error("Protect power");
  }
  if (enhancingDuration(75, 21, 75) !== 75 || enhancingDuration(180, 40, 75) !== 180 || enhancingDuration(75, 21, 10) !== (75 * 10) / 21) {
    throw new Error("enhancing duration");
  }
  if (REGEN_HP[1] !== 5 || REGEN_HP[2] !== 12 || REGEN_HP[3] !== 20) throw new Error("Regen power");
  if (REGEN_SECONDS[1] !== 75 || REGEN_SECONDS[2] !== 60 || REGEN_SECONDS[3] !== 60 || REGEN_TICK !== 3) throw new Error("Regen duration");
  if (REGEN_CE !== 1 || REGEN_VE !== 165) throw new Error("Regen enmity");
  if (hasteFromPercent(1465) !== 150 || hasteFromPercent(HASTE_PERCENT) !== HASTE_NUMER || hasteFromPercent(2998) !== 307 || hasteFromPercent(1494) !== 153) {
    throw new Error("haste percent");
  }
  if (HASTE_NUMER !== 150 || HASTE_SECONDS !== 180 || AUSPICE_SUBTLE_BLOW !== 10 || AUSPICE_SECONDS !== 180) throw new Error("haste card");
  if (hastedRecast(20, 150) !== (20 * 874) / 1024 || hastedRecast(12, 0) !== 12 || hastedRecast(20, 900) !== (20 * (1024 - 448)) / 1024) {
    throw new Error("hasted recast");
  }
  if (hasteMagic([]) !== 0 || hasteMagic([{ name: "Regen", power: 5 }, { name: "Haste", power: 150 }]) !== 150 || hasteMagic([{ name: "Haste", power: 900 }]) !== 448 || hasteMagic([{ name: "Haste", power: 150 }, { name: "Huton", power: 212 }]) !== 150) {
    throw new Error("magic haste");
  }
  if (hasteMagic([{ name: "Haste", power: 150 }, { name: "Advancing March", power: 108, song: { family: "march" } }]) !== 258) throw new Error("march haste");
  if (hasteMagic([{ name: "Haste", power: 150 }, { name: "Advancing March", power: 108, song: { family: "march" } }, { name: "Victory March", power: 163, song: { family: "march" } }]) !== 421) {
    throw new Error("two marches");
  }
  if (hasteMagic([{ name: "Haste", power: 400 }, { name: "Advancing March", power: 108, song: { family: "march" } }]) !== 448) throw new Error("march cap");
  if (regenPower([]) !== 0 || regenPower([{ name: "Haste", power: 150 }, { name: "Regen", power: 12 }]) !== 12) throw new Error("regen power");
  if (regenPower([{ name: "Dancer's Roll", power: 3 }]) !== 12) throw new Error("dancer regen");
  if (regenPower([{ name: "Regen", power: 12 }, { name: "Dancer's Roll", power: 3 }]) !== 24) throw new Error("dancer plus regen");
  if (regenPower([{ name: "Regen", power: 12 }, { name: "Army's Paeon", power: 2, song: { family: "paeon" } }]) !== 14) throw new Error("paeon regen");
  if (REFRESH_MP !== 3 || REFRESH_SECONDS !== 150 || REFRESH_TICK !== 3 || REFRESH_CE !== 1 || REFRESH_VE !== 165) throw new Error("Refresh card");
  if (refreshPower([]) !== 0 || refreshPower([{ name: "Regen", power: 5 }, { name: "Refresh", power: 3 }]) !== 3) throw new Error("refresh power");
  if (refreshPower([{ name: "Refresh", power: 3 }, { name: "Mage's Ballad", power: 1, song: { family: "ballad" } }]) !== 4) throw new Error("ballad refresh");
  if (enhancingDuration(REFRESH_SECONDS, 41, 75) !== 150 || enhancingDuration(REFRESH_SECONDS, 41, 20) !== (150 * 20) / 41) throw new Error("Refresh duration");
  if (subtleBlow([]) !== 0 || subtleBlow([{ name: "Haste", power: 150 }, { name: "Auspice", power: 10 }]) !== 10) throw new Error("subtle blow");
  if (enspellTwoBase(0) !== 5 || enspellTwoBase(179) !== 24 || enspellTwoBase(180) !== 25 || enspellTwoBase(230) !== 31 || enspellTwoBase(500) !== 65) {
    throw new Error("enspell II base");
  }
  if (enspellTwoDamage(230, 0) !== 31 || enspellTwoDamage(230, 1) !== 32 || enspellTwoDamage(230, 31) !== 62 || enspellTwoDamage(230, 40) !== 62) {
    throw new Error("enspell II ramp");
  }
  if (enspellOverwrites(2, 1) || !enspellOverwrites(null, 1) || !enspellOverwrites(1, 1) || !enspellOverwrites(1, 2) || !enspellOverwrites(2, 2)) {
    throw new Error("enspell overwrite");
  }
  if (!auspiceBlockedByEnspell(2) || auspiceBlockedByEnspell(1) || auspiceBlockedByEnspell(null)) throw new Error("auspice enspell");
  if (auspiceAccuracy([]) !== 0 || auspiceAccuracy([{ name: "Auspice", acc: 10 }]) !== 0) throw new Error("auspice accuracy needs misery");
  if (auspiceAccuracy([{ name: "Auspice", acc: 10 }, { name: "Afflatus Misery" }]) !== 10) throw new Error("auspice accuracy");
  if (auspiceAccuracy([{ name: "Auspice", acc: 40 }, { name: "Afflatus Misery" }]) !== 30) throw new Error("auspice accuracy cap");
  if (AUSPICE_MISS_ACC !== 10 || AUSPICE_MISS_ACC_CAP !== 30) throw new Error("auspice miss step");
  if (elementalBarResistance(0) !== 40 || elementalBarResistance(230) !== 86 || elementalBarResistance(300) !== 100) {
    throw new Error("elemental bar under 300");
  }
  if (elementalBarResistance(301) !== 100 || elementalBarResistance(500) !== 150 || elementalBarResistance(800) !== 150) {
    throw new Error("elemental bar over 300");
  }
  if (STATUS_BAR_RESIST !== 20 || BAR_SECONDS !== 480 || resolveStatusBar(7, 75).power !== 20 || resolveStatusBar(7, 75).left !== 480) {
    throw new Error("status bar");
  }
  if (resolveElementBar(230, 17, 75).power !== 86 || resolveElementBar(230, 17, 75).left !== 480) throw new Error("Barfira at 75");
  if (resolveElementBar(230, 43, 10).left !== (480 * 10) / 43) throw new Error("bar duration under level");
  const both = [{ name: "Barparalyzra", power: 20 }, { name: "Barblizzara", power: 86 }, { name: "Barfira", power: 86 }];
  if (barEvasion(both, { element: "fire" }) !== 86 || barEvasion(both, { element: "ice" }) !== 86) throw new Error("element bar read");
  if (barEvasion(both, { status: "Paralysis" }) !== 106 || barEvasion(both, { status: "Sleep" }) !== 0) throw new Error("status bar read");
  if (barEvasion([{ name: "Barsleepra", power: 20 }], { status: "Sleep" }) !== 20) throw new Error("sleep bar");
  if (elementResisted("Barfira") !== "fire" || elementResisted("Barthundra") !== "thunder" || statusResisted("Barvira") !== "Plague") {
    throw new Error("bar resist map");
  }
  if (diaTier("Dia") !== 1 || diaTier("Diaga") !== 1 || diaTier("Dia II") !== 3 || diaTier("Dia III") !== 5) throw new Error("Dia tier");
  if (!diaCanLand(null, "Dia") || !diaCanLand("Dia", "Diaga") || !diaCanLand("Dia", "Dia II") || !diaCanLand("Dia II", "Dia III")) {
    throw new Error("Dia overwrite");
  }
  if (diaCanLand("Dia II", "Dia") || diaCanLand("Dia III", "Dia II") || diaCanLand("Dia II", "Diaga")) throw new Error("Dia does not fall back");
  if (diaCanLand("Bio", "Dia") || diaCanLand("Bio II", "Dia II") || slipCanLand("Dia III", "Bio II")) throw new Error("slip does not fall back");
  if (!slipCanLand("Bio", "Dia II") || !slipCanLand("Dia III", "Bio III") || !slipCanLand("Bio", "Bio") || !bioCanLand("Dia", "Bio")) {
    throw new Error("slip overwrite");
  }
  if (slipTier("Bio") !== 2 || slipTier("Bio II") !== 4 || slipTier("Bio III") !== 6 || slipTier("Stun") !== 0) throw new Error("Bio tier");
  if (BIO_ATK.Bio !== 104 || BIO_ATK["Bio II"] !== 156 || BIO_ATK["Bio III"] !== 208) throw new Error("Bio attack");
  if (BIO_HIT.Bio !== 10 || BIO_HIT["Bio II"] !== 50 || BIO_HIT["Bio III"] !== 100) throw new Error("Bio hit");
  if (BIO_SECONDS.Bio !== 60 || BIO_SECONDS["Bio II"] !== 120 || BIO_SECONDS["Bio III"] !== 180) throw new Error("Bio duration");
  if (bioPotency(0, "Bio") !== 1 || bioPotency(40, "Bio") !== 1 || bioPotency(41, "Bio") !== 2 || bioPotency(81, "Bio") !== 3 || bioPotency(269, "Bio") !== 3) {
    throw new Error("Bio potency");
  }
  if (bioPotency(0, "Bio II") !== 3 || bioPotency(200, "Bio II") !== 5 || bioPotency(211, "Bio II") !== 6 || bioPotency(269, "Bio II") !== 7 || bioPotency(291, "Bio II") !== 8 || bioPotency(400, "Bio II") !== 8) {
    throw new Error("Bio II potency");
  }
  if (bioPotency(0, "Bio III") !== 5 || bioPotency(200, "Bio III") !== 7 || bioPotency(246, "Bio III") !== 9 || bioPotency(247, "Bio III") !== 9 || bioPotency(269, "Bio III") !== 11 || bioPotency(291, "Bio III") !== 13 || bioPotency(292, "Bio III") !== 13 || bioPotency(426, "Bio III") !== 17) {
    throw new Error("Bio III potency");
  }
  if (bioAttackFactor([]) !== 1 || bioAttackFactor([{ name: "Bio" }]) !== (1024 - 104) / 1024) throw new Error("Bio attack factor");
  if (STUN_SECONDS !== 2 || STUN_MACC !== 200 || STUN_CE !== 180 || STUN_VE !== 1280) throw new Error("Stun card");
  const openSpell = { kind: "spell" as const, name: "Stonega", resolved: false };
  const openAbility = { kind: "ability" as const, name: "Provoke", resolved: false };
  const openWs = { kind: "weaponskill" as const, name: "Foot Kick", resolved: false };
  const openBite = { kind: "melee" as const, name: "attack", resolved: false };
  const doneBite = { kind: "melee" as const, name: "attack", resolved: true };
  if (!stunCancels(openSpell) || !stunCancels(openAbility) || !stunCancels(openWs) || !stunCancels(openBite)) {
    throw new Error("Stun interrupt");
  }
  if (stunCancels(doneBite) || stunCancels(null)) throw new Error("Stun leaves a finished action");
  if (stunInterruptLine(openSpell) !== "Stonega is interrupted.") throw new Error("Stun spell line");
  if (stunInterruptLine(openAbility) !== "Provoke is interrupted.") throw new Error("Stun ability line");
  if (stunInterruptLine(openWs) !== "Foot Kick is interrupted.") throw new Error("Stun weaponskill line");
  if (stunInterruptLine(openBite) !== "The attack is interrupted.") throw new Error("Stun melee line");
  if (DIA_DEF.Dia !== 104 || DIA_DEF["Dia II"] !== 156 || DIA_DEF["Dia III"] !== 208 || DIA_DOT.Dia !== 1 || DIA_DOT["Dia III"] !== 3) {
    throw new Error("Dia card");
  }
  if (DIA_HIT.Dia !== 1 || DIA_HIT.Diaga !== 2 || DIA_HIT["Dia II"] !== 4 || DIA_HIT["Dia III"] !== 16) throw new Error("Dia hit");
  if (DIA_SECONDS.Dia !== 60 || DIA_SECONDS["Dia II"] !== 120 || DIA_SECONDS["Dia III"] !== 180) throw new Error("Dia duration");
  if (diaDefenseFactor([]) !== 1 || diaDefenseFactor([{ name: "Dia" }]) !== (1024 - 104) / 1024) throw new Error("Dia defense");
  if (diaDefenseFactor([{ name: "Blind" }, { name: "Dia III" }]) !== (1024 - 208) / 1024) throw new Error("Dia III defense");
  if (diaDefenseFactor([{ name: "Defense Down" }]) !== 0.75) throw new Error("Defense Down");
  if (Math.abs(diaDefenseFactor([{ name: "Defense Down", power: 0.2 }]) - 0.8) > 1e-9) throw new Error("Jump Defense Down");
  if (Math.abs(diaDefenseFactor([{ name: "Sluggish Daze", power: 0.23 }]) - 0.77) > 1e-9) throw new Error("Sluggish Daze");
  if (poisonPotency(0, 1) !== 1 || poisonPotency(25, 1) !== 1 || poisonPotency(230, 1) !== 9 || poisonPotency(276, 1) !== 11) {
    throw new Error("Poison potency");
  }
  if (poisonPotency(400, 1) !== 16 || poisonPotency(401, 1) !== 35 || poisonPotency(500, 1) !== 55) throw new Error("Poison high skill");
  if (poisonPotency(0, 2) !== 4 || poisonPotency(80, 2) !== 4 || poisonPotency(276, 2) !== 13 || poisonPotency(400, 2) !== 20) {
    throw new Error("Poison II potency");
  }
  if (poisonPotency(401, 2) !== 52) throw new Error("Poison II high skill");
  if (poisongaPotency(0) !== 1 || poisongaPotency(24) !== 1 || poisongaPotency(230) !== 3 || poisongaPotency(276) !== 3) {
    throw new Error("Poisonga cap");
  }
  if (!poisonCanLand(null, "Poisonga") || !poisonCanLand("Poisonga", "Poison") || !poisonCanLand("Poison", "Poison II") || !poisonCanLand("Poisonga", "Poisonga")) {
    throw new Error("Poison overwrite");
  }
  if (poisonCanLand("Poison", "Poisonga") || poisonCanLand("Poison II", "Poison") || poisonCanLand("Poison II", "Poisonga")) {
    throw new Error("Poison does not fall back");
  }
  if (POISON_SECONDS !== 90 || POISON_II_SECONDS !== 120 || POISONGA_SECONDS !== 90 || POISON_II_MACC !== 30) throw new Error("Poison card");
}
