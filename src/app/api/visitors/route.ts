import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

type Store = { total: number; ids: string[] };

function storePath() {
  const root = process.cwd();
  const dir = path.join(root, ".data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, "visitors.json");
}

function readStore(): Store {
  try {
    const p = storePath();
    if (!fs.existsSync(p)) return { total: 0, ids: [] };
    const raw = fs.readFileSync(p, "utf8");
    const v = JSON.parse(raw) as Partial<Store>;
    const total = typeof v.total === "number" && Number.isFinite(v.total) ? v.total : 0;
    const ids = Array.isArray(v.ids) ? v.ids.filter((x) => typeof x === "string") : [];
    return { total, ids };
  } catch {
    return { total: 0, ids: [] };
  }
}

function writeStore(s: Store) {
  try {
    const p = storePath();
    fs.writeFileSync(p, JSON.stringify(s));
  } catch {
    // noop
  }
}

function randomId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export async function GET() {
  const s = readStore();
  return NextResponse.json({ ok: true, total: s.total });
}

export async function POST(req: NextRequest) {
  try {
    let currentId = req.cookies.get("cv_visitor")?.value || "";
    if (!currentId) currentId = randomId();
    const s = readStore();
    if (!s.ids.includes(currentId)) {
      s.ids.push(currentId);
      s.total += 1;
      writeStore(s);
    }
    const res = NextResponse.json({ ok: true, total: s.total });
    res.cookies.set("cv_visitor", currentId, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    return res;
  } catch {
    return NextResponse.json({ ok: false, total: 0 }, { status: 500 });
  }
}
