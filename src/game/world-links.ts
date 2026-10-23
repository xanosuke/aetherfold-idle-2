/**
 * Retail zone lines. The report compares this table to the gates that exist today.
 * Report mode never throws and never moves a gate. Step A2 is what makes exits match.
 */
import { inEast } from "./east-ronfaure";
import { fortSquare, ghelsbaSquare, orcZoneAt, yughottSquare } from "./ghelsba";
import { glacierSquare, inGlacier } from "./glacier";
import { inPass, passSquare } from "./pass";
import { inTomb, tombSquare } from "./tomb";
import { parseSquare, squareOf, ZONE_GRIDS } from "./zone-grid";
import { inNorthCity, inPort, inRonfaure, inSouthCity, zoneArrival, ZONE_GATES, type ZoneGate, type ZoneId } from "./world";

export type LinkEnd = { zone: string; square: string };
export type WorldLink = { a: LinkEnd; b: LinkEnd; oneWay?: "a->b"; closed?: boolean; note?: string };

export const WORLD_LINKS: WorldLink[] = [
  { a: { zone: "ronfaure-south", square: "I-6" }, b: { zone: "sandoria-south", square: "F-10" } },
  { a: { zone: "ronfaure-north", square: "I-5" }, b: { zone: "sandoria-north", square: "C-8" } },
  { a: { zone: "ronfaure-north", square: "I-5" }, b: { zone: "sandoria-north", square: "D-7" }, note: "second gate, not built yet" },
  { a: { zone: "ronfaure-south", square: "J-7" }, b: { zone: "east-ronfaure", square: "F-7" } },
  { a: { zone: "ronfaure-south", square: "J-9" }, b: { zone: "east-ronfaure", square: "F-9" } },
  { a: { zone: "ronfaure-south", square: "E-4" }, b: { zone: "ghelsba", square: "J-11" } },
  { a: { zone: "ronfaure-south", square: "F-12" }, b: { zone: "la-theine", square: "C-3" }, closed: true },
  { a: { zone: "east-ronfaure", square: "G-4" }, b: { zone: "sandoria-south", square: "L-10" }, note: "BG-Wiki ER page says L-4 on the city side" },
  { a: { zone: "east-ronfaure", square: "K-4" }, b: { zone: "ranguemont", square: "G-12" } },
  { a: { zone: "east-ronfaure", square: "H-11" }, b: { zone: "ranperre", square: "G-5" } },
  { a: { zone: "ranperre", square: "I-5" }, b: { zone: "east-ronfaure", square: "J-11" }, oneWay: "a->b" },
  { a: { zone: "ranperre", square: "K-5" }, b: { zone: "jugner", square: "F-5" }, oneWay: "a->b", closed: true },
  { a: { zone: "east-ronfaure", square: "H-5" }, b: { zone: "east-ronfaure-s", square: "H-5" }, closed: true },
  { a: { zone: "ranguemont", square: "L-4" }, b: { zone: "beaucedine", square: "E-11" }, note: "atlas L-4; BG-Wiki table I-4" },
  { a: { zone: "beaucedine", square: "H-11" }, b: { zone: "batallia", square: "E-5" }, closed: true },
  { a: { zone: "beaucedine", square: "F-6" }, b: { zone: "xarcabard", square: "K-9" }, closed: true },
  { a: { zone: "beaucedine", square: "J-4" }, b: { zone: "feiyin", square: "F-11" }, closed: true },
  { a: { zone: "ghelsba", square: "H-8" }, b: { zone: "fort-ghelsba", square: "E-8" }, note: "accept H-8 or I-8 on the Outpost side" },
  { a: { zone: "ghelsba", square: "I-11" }, b: { zone: "yughott", square: "E-9" } },
  { a: { zone: "fort-ghelsba", square: "G-9" }, b: { zone: "yughott", square: "H-8" } },
  { a: { zone: "fort-ghelsba", square: "J-7" }, b: { zone: "yughott", square: "K-5" }, note: "Yughott map 2" },
  { a: { zone: "fort-ghelsba", square: "J-8" }, b: { zone: "yughott", square: "F-7" } },
  { a: { zone: "yughott", square: "K-6" }, b: { zone: "horlais", square: "?" }, note: "Yughott map 2" },
  { a: { zone: "yughott", square: "J-9" }, b: { zone: "horlais", square: "?" }, note: "Yughott map 2" },
  { a: { zone: "sandoria-south", square: "I-7" }, b: { zone: "sandoria-north", square: "I-10" } },
  { a: { zone: "sandoria-north", square: "F-3" }, b: { zone: "sandoria-port", square: "F-10" } },
];

const UNBUILT = new Set(["la-theine", "jugner", "batallia", "xarcabard", "feiyin", "east-ronfaure-s", "horlais"]);
const CITY = new Set(["sandoria-south", "sandoria-north", "sandoria-port"]);

export type LinkRow = { link: string; a: string; b: string };

function hasGrid(zone: string): boolean {
  if (UNBUILT.has(zone) || CITY.has(zone)) return false;
  return ZONE_GRIDS.some((g) => g.zone === zone);
}

function homes(gate: ZoneGate): string[] {
  const id = gate.id;
  if (id.startsWith("ron-")) return ["ronfaure-south", "ronfaure-north"];
  if (id.startsWith("city-")) return ["sandoria-south"];
  if (id.startsWith("north-")) return ["sandoria-north"];
  if (id.startsWith("port-")) return ["sandoria-port"];
  if (id.startsWith("east-")) return ["east-ronfaure"];
  if (id.startsWith("tomb-")) return ["ranperre"];
  if (id.startsWith("pass-")) return ["ranguemont"];
  if (id.startsWith("glacier-")) return ["beaucedine"];
  if (id.startsWith("ghelsba-")) return ["ghelsba"];
  if (id.startsWith("fort-")) return ["fort-ghelsba"];
  if (id.startsWith("yug-")) return ["yughott"];
  if (id.startsWith("horlais-")) return ["horlais"];
  return [];
}

function destOk(gate: ZoneGate, dest: string, closed: boolean): boolean {
  if (gate.to === dest) return true;
  return closed && gate.to === "closed";
}

function squareAt(zone: string, x: number, z: number): string | null {
  if (zone === "ronfaure-south" || zone === "ronfaure-north") {
    const grid = ZONE_GRIDS.find((g) => g.zone === "ronfaure-south");
    return grid ? squareOf(grid, x, z) : null;
  }
  if (zone === "east-ronfaure") {
    const grid = ZONE_GRIDS.find((g) => g.zone === "east-ronfaure");
    return grid ? squareOf(grid, x, z) : null;
  }
  if (zone === "ranguemont") return passSquare(x, z);
  if (zone === "beaucedine") return glacierSquare(x, z);
  if (zone === "ranperre") return tombSquare(x, z);
  if (zone === "ghelsba") return ghelsbaSquare(x, z);
  if (zone === "fort-ghelsba") return fortSquare(x, z);
  if (zone === "yughott") return yughottSquare(x, z);
  return null;
}

function shownSquare(zone: string, x: number, z: number): string {
  return squareAt(zone, x, z) ?? "?";
}

function labelDist(a: string, b: string): number | null {
  const left = parseSquare(a);
  const right = parseSquare(b);
  if (!left || !right) return null;
  return Math.max(Math.abs(left.col - right.col), Math.abs(left.row - right.row));
}

function accepts(actual: string | null, expected: string, zone: string, note?: string): boolean {
  if (!actual) return false;
  if (actual === expected) return true;
  return zone === "ghelsba" && !!note?.includes("accept H-8 or I-8") && (actual === "H-8" || actual === "I-8");
}

function inZone(x: number, z: number, zone: string): boolean {
  if (zone === "sandoria-south") return inSouthCity(x, z);
  if (zone === "sandoria-north") return inNorthCity(x, z);
  if (zone === "sandoria-port") return inPort(x, z);
  if (zone === "ronfaure-south" || zone === "ronfaure-north") return inRonfaure(x, z);
  if (zone === "east-ronfaure") return inEast(x, z);
  if (zone === "ranperre") return inTomb(x, z);
  if (zone === "ranguemont") return inPass(x, z);
  if (zone === "beaucedine") return inGlacier(x, z);
  if (zone === "ghelsba" || zone === "fort-ghelsba" || zone === "yughott" || zone === "horlais") return orcZoneAt(x, z)?.id === zone;
  return false;
}

function matchGate(
  zone: string,
  dest: string,
  square: string,
  closed: boolean,
  note: string | undefined,
  used: Set<string>,
): { text: string; gate: ZoneGate | null } {
  const pool = ZONE_GATES.filter((gate) => !used.has(gate.id) && homes(gate).includes(zone) && destOk(gate, dest, closed));
  const exact = pool.find((gate) => accepts(squareAt(zone, gate.x, gate.z), square, zone, note));
  if (exact) {
    used.add(exact.id);
    const actual = shownSquare(zone, exact.x, exact.z);
    return { text: actual === square ? "OK" : `OK (${actual})`, gate: exact };
  }
  if (!pool.length) return { text: "WRONG (none)", gate: null };
  const nearest = pool.slice().sort((a, b) => {
    const da = labelDist(shownSquare(zone, a.x, a.z), square) ?? 99;
    const db = labelDist(shownSquare(zone, b.x, b.z), square) ?? 99;
    return da - db;
  })[0];
  return { text: `WRONG (${shownSquare(zone, nearest.x, nearest.z)})`, gate: null };
}

function arrivalText(gate: ZoneGate | null, link: WorldLink): string {
  if (!gate) return "WRONG (none)";
  if (!hasGrid(link.b.zone)) return "NO GRID";
  const land = gate.arrive ?? zoneArrival(gate.to as ZoneId);
  if (!inZone(land.x, land.z, link.b.zone)) return "WRONG (arrive off zone)";
  const actual = squareAt(link.b.zone, land.x, land.z);
  if (!actual || actual === "?") return `WRONG (arrive ${actual ?? "?"})`;
  const dist = labelDist(actual, link.b.square);
  if (dist == null || dist > 1) return `WRONG (arrive ${actual})`;
  return "OK";
}

function linkLabel(link: WorldLink): string {
  const arrow = link.oneWay ? "->" : "<->";
  const flag = link.closed ? " closed" : "";
  const note = link.note ? ` (${link.note})` : "";
  return `${link.a.zone} ${link.a.square} ${arrow} ${link.b.zone} ${link.b.square}${flag}${note}`;
}

function reportRows(): LinkRow[] {
  const used = new Set<string>();
  return WORLD_LINKS.map((link) => {
    const aSkip = UNBUILT.has(link.a.zone);
    const bSkip = UNBUILT.has(link.b.zone) || !!link.closed;
    let aText = "WRONG (none)";
    let aGate: ZoneGate | null = null;
    if (aSkip) aText = "skip";
    else if (!hasGrid(link.a.zone)) aText = "NO GRID";
    else {
      const found = matchGate(link.a.zone, link.b.zone, link.a.square, !!link.closed, link.note, used);
      aText = found.text;
      aGate = found.gate;
    }
    let bText = "WRONG (none)";
    if (bSkip) bText = "skip";
    else if (link.oneWay) bText = arrivalText(aGate, link);
    else if (!hasGrid(link.b.zone)) bText = "NO GRID";
    else {
      const found = matchGate(link.b.zone, link.a.zone, link.b.square, false, link.note, used);
      if (!found.text.startsWith("OK") || !aGate) bText = found.text;
      else {
        const arrive = arrivalText(aGate, link);
        if (arrive === "OK") bText = found.text;
        else {
          const where = found.gate ? shownSquare(link.b.zone, found.gate.x, found.gate.z) : link.b.square;
          const why = arrive.replace(/^WRONG \(/, "").replace(/\)$/, "");
          bText = `WRONG (gate ${where}, ${why})`;
        }
      }
    }
    return { link: linkLabel(link), a: aText, b: bText };
  });
}

function printRows(rows: LinkRow[]): void {
  const linkW = Math.max(4, ...rows.map((row) => row.link.length));
  const aW = Math.max(1, ...rows.map((row) => row.a.length));
  console.log(`${"link".padEnd(linkW)}  ${"a".padEnd(aW)}  b`);
  for (const row of rows) console.log(`${row.link.padEnd(linkW)}  ${row.a.padEnd(aW)}  ${row.b}`);
}

/** Report mode (default) prints the table and never throws. Pass false once exits are being fixed. */
export function assertWorldLinks(report = true): LinkRow[] {
  try {
    const rows = reportRows();
    if (report) {
      printRows(rows);
      return rows;
    }
    const bad = rows.filter((row, index) => {
      const link = WORLD_LINKS[index];
      if (link.note?.includes("second gate, not built yet")) return false;
      if (!hasGrid(link.a.zone) || !hasGrid(link.b.zone)) return false;
      return row.a.startsWith("WRONG") || row.b.startsWith("WRONG");
    });
    if (bad.length) throw new Error(bad.map((row) => `${row.link}: ${row.a} | ${row.b}`).join("; "));
    return rows;
  } catch (err) {
    if (!report) throw err;
    console.error(err);
    return [];
  }
}
