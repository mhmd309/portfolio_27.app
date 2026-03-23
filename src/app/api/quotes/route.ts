import { NextResponse } from "next/server";
import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";

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

const quotesJsonPath = path.join(process.cwd(), "data", "quotes.json");

function asString(v: unknown) {
  return typeof v === "string" ? v : "";
}

async function readAllQuotes(): Promise<Quote[]> {
  try {
    const raw = await fs.readFile(quotesJsonPath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((q) => ({
      id: asString((q as { id?: unknown }).id),
      name: asString((q as { name?: unknown }).name),
      email: asString((q as { email?: unknown }).email),
      book: asString((q as { book?: unknown }).book),
      text: asString((q as { text?: unknown }).text),
      createdAt: asString((q as { createdAt?: unknown }).createdAt),
    }));
  } catch (err: unknown) {
    const e = err as { code?: unknown };
    if (e && e.code === "ENOENT") return [];
    throw err;
  }
}

async function writeAllQuotes(quotes: Quote[]) {
  await fs.mkdir(path.dirname(quotesJsonPath), { recursive: true });
  const json = JSON.stringify(quotes, null, 2) + "\n";
  await fs.writeFile(quotesJsonPath, json, "utf8");
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") || "1") || 1);
    const pageSize = Math.min(20, Math.max(1, Number(url.searchParams.get("pageSize") || "8") || 8));
    const bookQuery = (url.searchParams.get("book") || "").trim();
    const q = bookQuery.toLocaleLowerCase();

    const allRaw = await readAllQuotes();
    const all = q ? allRaw.filter((x) => (x.book || "").trim().toLocaleLowerCase().includes(q)) : allRaw;
    all.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    const total = all.length;
    const start = (page - 1) * pageSize;
    const items = all.slice(start, start + pageSize);

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

    const q: Quote = {
      id: crypto.randomUUID(),
      name,
      email,
      book,
      text,
      createdAt: new Date().toISOString(),
    };

    const all = await readAllQuotes();
    await writeAllQuotes([q, ...all]);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err: unknown) {
    console.error("Quotes API POST error:", err);
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const url = new URL(req.url);
    const id = (url.searchParams.get("id") || "").trim();
    if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });

    let data: Body;
    try {
      data = (await req.json()) as Body;
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
    }

    const all = await readAllQuotes();
    const idx = all.findIndex((q) => q.id === id);
    if (idx < 0) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

    const prev = all[idx];
    const name = typeof data.name === "string" ? data.name.trim() : prev.name;
    const email = typeof data.email === "string" ? data.email.trim() : prev.email;
    const book = typeof data.book === "string" ? data.book.trim() : prev.book;
    const text = typeof data.text === "string" ? data.text.trim() : prev.text;

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

    all[idx] = { ...prev, name, email, book, text };
    await writeAllQuotes(all);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("Quotes API PATCH error:", err);
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = (url.searchParams.get("id") || "").trim();
    if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });

    const all = await readAllQuotes();
    const next = all.filter((q) => q.id !== id);
    if (next.length === all.length) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    await writeAllQuotes(next);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("Quotes API DELETE error:", err);
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}
