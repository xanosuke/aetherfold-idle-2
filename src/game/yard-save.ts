import { createServerFn } from "@tanstack/react-start";

const MAX_BLOB = 1_500_000;

function asBlob(input: unknown): { blob: string } {
  if (!input || typeof input !== "object") throw new Error("Yard save was empty.");
  const blob = (input as { blob?: unknown }).blob;
  if (typeof blob !== "string" || blob.length < 2 || blob.length > MAX_BLOB || blob[0] !== "{") {
    throw new Error("Yard save was empty.");
  }
  return { blob };
}

function asStamp(input: unknown): { stamp: number } {
  if (!input || typeof input !== "object") throw new Error("Reset stamp was empty.");
  const stamp = (input as { stamp?: unknown }).stamp;
  if (typeof stamp !== "number" || !Number.isFinite(stamp) || stamp < 0 || stamp > 8.64e15) {
    throw new Error("Reset stamp was empty.");
  }
  return { stamp: Math.floor(stamp) };
}

function salvageBlob(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const text = raw.trim();
  const take = (value: string): string | null => {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
      return value;
    } catch {
      return null;
    }
  };
  const direct = take(text);
  if (direct) return direct;
  // A trailing brace used to rank the whole yard as empty, so a blank boot replaced it.
  const start = text.indexOf("{");
  if (start < 0) return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === "\"") inString = false;
      continue;
    }
    if (ch === "\"") inString = true;
    else if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return take(text.slice(start, i + 1));
    }
  }
  return null;
}

function looseRow(blob: string): Record<string, unknown> | null {
  const clean = salvageBlob(blob);
  if (!clean) return null;
  try {
    return JSON.parse(clean) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function savedAtOf(blob: string): number {
  const parsed = looseRow(blob);
  if (parsed && typeof parsed.savedAt === "number" && Number.isFinite(parsed.savedAt) && parsed.savedAt > 0) {
    return Math.floor(parsed.savedAt);
  }
  return 0;
}

/** 2 is a game someone played. 1 is the unstarted Black Mage boot. 0 is empty. */
function progressRank(blob: string): number {
  if (!blob || blob.length < 2 || blob[0] !== "{") return 0;
  const row = looseRow(blob);
  if (!row) return 0;
  if (row.started === true || row.engaged === true || row.ko === true) return 2;
  if (typeof row.exp === "number" && row.exp > 0) return 2;
  if (typeof row.gil === "number" && row.gil > 0) return 2;
  if (typeof row.tp === "number" && row.tp > 0) return 2;
  if (typeof row.subJob === "string") return 2;
  if (typeof row.mainJob === "string" && row.mainJob !== "BLM") return 2;
  if (Array.isArray(row.buffs) && row.buffs.length > 0) return 2;
  if (Array.isArray(row.log) && row.log.length > 0) return 2;
  return 1;
}

function revisionOf(blob: string): number {
  const value = looseRow(blob)?.revision;
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return Math.floor(value);
  return 0;
}

function betterBlob(left: string | null, right: string | null): string | null {
  if (!left) return right;
  if (!right) return left;
  return preferLeft(left, right) ? left : right;
}

/** Higher rank, then higher revision, then the later stamp. Equal copies keep the left one. */
function preferLeft(left: string, right: string): boolean {
  const leftRank = progressRank(left);
  const rightRank = progressRank(right);
  if (leftRank !== rightRank) return leftRank > rightRank;
  const leftRevision = revisionOf(left);
  const rightRevision = revisionOf(right);
  if (leftRevision !== rightRevision) return leftRevision > rightRevision;
  return savedAtOf(left) >= savedAtOf(right);
}

async function yardPath(): Promise<string> {
  const { join } = await import("node:path");
  return join(process.cwd(), "data", "yard-save.json");
}

async function readFileBlob(): Promise<string | null> {
  try {
    const { readFile } = await import("node:fs/promises");
    const text = await readFile(await yardPath(), "utf8");
    return salvageBlob(text);
  } catch {
    return null;
  }
}

async function writeFileBlob(blob: string): Promise<void> {
  const { mkdir, writeFile } = await import("node:fs/promises");
  const { dirname } = await import("node:path");
  const path = await yardPath();
  await mkdir(dirname(path), { recursive: true });
  const clean = salvageBlob(blob);
  if (!clean) return;
  const current = await readFileBlob();
  if (current && !preferLeft(clean, current)) return;
  await writeFile(path, clean);
}

async function clearFileBlob(): Promise<void> {
  try {
    const { rm } = await import("node:fs/promises");
    await rm(await yardPath(), { force: true });
  } catch {
    /* the file was already gone */
  }
}

/** The one yard blob, or null when the slot is empty. The file copy wins when the database was wiped. */
export const readYardSave = createServerFn({ method: "GET" }).handler(async () => {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql<{ blob: string }>`select blob from yard_save where id = 1`;
  const stored = rows[0]?.blob;
  const dbBlob = typeof stored === "string" ? salvageBlob(stored) : null;
  const blob = betterBlob(dbBlob, await readFileBlob());
  if (!blob) return null;
  return { blob };
});

/** Keep the newer stamp. A blank boot must not replace a game that was already stored. */
export const writeYardSave = createServerFn({ method: "POST" })
  .validator(asBlob)
  .handler(async ({ data }) => {
    const clean = salvageBlob(data.blob);
    const at = clean ? savedAtOf(clean) : 0;
    if (!clean || at <= 0) return { ok: false as const };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<{ blob: string }>`select blob from yard_save where id = 1`;
    const currentBlob = typeof rows[0]?.blob === "string" ? salvageBlob(rows[0].blob) : null;
    if (currentBlob && !preferLeft(clean, currentBlob)) return { ok: false as const };
    await sql`
      insert into yard_save (id, blob, client_saved_at, saved_at)
      values (1, ${clean}, ${at}, now())
      on conflict (id) do update
      set blob = excluded.blob,
          client_saved_at = excluded.client_saved_at,
          saved_at = now()
    `;
    await writeFileBlob(clean);
    return { ok: true as const };
  });

/** Empty the slot with a stamp newer than any save already in flight. */
export const clearYardSave = createServerFn({ method: "POST" })
  .validator(asStamp)
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`
      insert into yard_save (id, blob, client_saved_at, saved_at)
      values (1, '', ${data.stamp}, now())
      on conflict (id) do update
      set blob = '',
          client_saved_at = excluded.client_saved_at,
          saved_at = now()
      where yard_save.client_saved_at <= excluded.client_saved_at
    `;
    await clearFileBlob();
    return { ok: true as const };
  });
