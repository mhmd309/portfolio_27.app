import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

export const runtime = "nodejs";

type Quote = {
  id: string;
  name: string;
  email: string;
  book: string;
  text: string;
  createdAt: string;
};

type Body = {
  name?: string;
  email?: string;
  book?: string;
  text?: string;
};

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function storePath() {
  const fromEnv = process.env.QUOTES_STORE_PATH;
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL) return path.join(os.tmpdir(), "cv2027", "quotes.json");
  return path.join(process.cwd(), "data", "quotes.json");
}

async function readAll(): Promise<Quote[]> {
  const p = storePath();
  try {
    const raw = await fs.readFile(p, "utf8");
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter(Boolean) as Quote[];
  } catch {
    return [];
  }
}

async function writeAll(quotes: Quote[]) {
  const p = storePath();
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, JSON.stringify(quotes, null, 2), "utf8");
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") || "1") || 1);
    const pageSize = Math.min(20, Math.max(1, Number(url.searchParams.get("pageSize") || "8") || 8));

    const all = await readAll();
    const sorted = [...all].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    const total = sorted.length;
    const start = (page - 1) * pageSize;
    const items = sorted.slice(start, start + pageSize);

    return NextResponse.json({ ok: true, page, pageSize, total, items });
  } catch (err: unknown) {
    console.error("Quotes API GET error:", err);
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    let data: Body;
    try {
      data = (await req.json()) as Body;
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
    }

    const name = typeof data.name === "string" ? data.name.trim() : "";
    const email = typeof data.email === "string" ? data.email.trim() : "";
    const book = typeof data.book === "string" ? data.book.trim() : "";
    const text = typeof data.text === "string" ? data.text.trim() : "";

    if (name.length < 2 || name.length > 80) {
      return NextResponse.json({ ok: false, error: "Invalid name" }, { status: 400 });
    }
    if (!isEmail(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }
    if (book.length < 2 || book.length > 160) {
      return NextResponse.json({ ok: false, error: "Invalid book" }, { status: 400 });
    }
    if (text.length < 3 || text.length > 1200) {
      return NextResponse.json({ ok: false, error: "Invalid text" }, { status: 400 });
    }

    const all = await readAll();
    const q: Quote = {
      id: crypto.randomUUID(),
      name,
      email,
      book,
      text,
      createdAt: new Date().toISOString(),
    };

    await writeAll([q, ...all]);
    return NextResponse.json({ ok: true, item: q }, { status: 201 });
  } catch (err: unknown) {
    console.error("Quotes API POST error:", err);
    const code = err && typeof err === "object" && "code" in err ? String((err as { code?: unknown }).code) : "";
    if (code === "EROFS" || code === "EPERM" || code === "EACCES") {
      return NextResponse.json({ ok: false, error: "Server storage is not writable" }, { status: 500 });
    }
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}
