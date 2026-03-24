import { NextResponse } from "next/server";
import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

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
const fallbackAdminToken = "Mohamedelseedi88$";
function normalizeEnv(v: string) {
  const s = v.trim();
  const pairs: Array<[string, string]> = [
    ["`", "`"],
    ['"', '"'],
    ["'", "'"],
  ];
  for (const [open, close] of pairs) {
    if (s.length >= 2 && s.startsWith(open) && s.endsWith(close)) return s.slice(1, -1).trim();
  }
  return s;
}

const supabaseUrlRaw = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKeyRaw = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseUrl = normalizeEnv(supabaseUrlRaw);
const supabaseServiceKey = normalizeEnv(supabaseServiceKeyRaw);

function asString(v: unknown) {
  return typeof v === "string" ? v : "";
}

function safeEqual(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function isAdminRequest(req: Request) {
  const required = process.env.ADMIN_TOKEN ?? fallbackAdminToken;
  const provided = req.headers.get("x-admin-token") || "";
  return safeEqual(provided, required);
}

type QuotesRow = {
  id: string | null;
  name: string | null;
  email: string | null;
  book_name: string | null;
  quote: string | null;
  created_at: string | null;
};

function getSupabase() {
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
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
    const validate = (url.searchParams.get("validate") || "").trim() === "1";
    if (validate) {
      if (!isAdminRequest(req)) {
        return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 403 });
      }
      return NextResponse.json({ ok: true });
    }

    const page = Math.max(1, Number(url.searchParams.get("page") || "1") || 1);
    const pageSize = Math.min(20, Math.max(1, Number(url.searchParams.get("pageSize") || "8") || 8));
    const bookQuery = (url.searchParams.get("book") || "").trim();
    const q = bookQuery.toLocaleLowerCase();

    const start = (page - 1) * pageSize;
    const supabase = getSupabase();
    if (supabase) {
      let query = supabase
        .from("quotes")
        .select("id,name,email,book_name,quote,created_at", { count: "exact" })
        .order("created_at", { ascending: false });

      if (q) query = query.ilike("book_name", `%${q}%`);
      const { data, error, count } = await query.range(start, start + pageSize - 1);
      if (error) {
        console.error("Supabase quotes GET error:", error);
        const msg =
          error.message.includes("schema cache") || error.message.includes("Could not find the table")
            ? "Missing database table: public.quotes"
            : error.message;
        return NextResponse.json({ ok: false, error: msg }, { status: 500 });
      }

      const items = (data as QuotesRow[] | null) || [];
      return NextResponse.json({
        ok: true,
        page,
        pageSize,
        total: count ?? 0,
        items: items.map((row) => ({
          id: asString(row.id),
          name: asString(row.name),
          email: asString(row.email),
          book: asString(row.book_name),
          text: asString(row.quote),
          createdAt: asString(row.created_at),
        })),
      });
    }

    const allRaw = await readAllQuotes();
    const all = q ? allRaw.filter((x) => (x.book || "").trim().toLocaleLowerCase().includes(q)) : allRaw;
    all.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    const total = all.length;
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

    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from("quotes").insert([
        {
          name,
          email,
          book_name: book,
          quote: text,
        },
      ]);
      if (error) {
        console.error("Supabase quotes POST error:", error);
        const msg =
          error.message.includes("schema cache") || error.message.includes("Could not find the table")
            ? "Missing database table: public.quotes"
            : error.message;
        return NextResponse.json({ ok: false, error: msg }, { status: 500 });
      }
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    const q: Quote = { id: crypto.randomUUID(), name, email, book, text, createdAt: new Date().toISOString() };
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
    if (!isAdminRequest(req)) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const id = (url.searchParams.get("id") || "").trim();
    if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });

    let data: Body;
    try {
      data = (await req.json()) as Body;
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
    }

    const supabase = getSupabase();
    if (supabase) {
      const name = typeof data.name === "string" ? data.name.trim() : undefined;
      const email = typeof data.email === "string" ? data.email.trim() : undefined;
      const book = typeof data.book === "string" ? data.book.trim() : undefined;
      const text = typeof data.text === "string" ? data.text.trim() : undefined;

      const nextName = name ?? "";
      const nextEmail = email ?? "";
      const nextBook = book ?? "";
      const nextText = text ?? "";

      if (name !== undefined && (nextName.length < 2 || nextName.length > 80)) {
        return NextResponse.json({ ok: false, error: "Invalid name" }, { status: 400 });
      }
      if (email !== undefined && !isEmail(nextEmail)) {
        return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
      }
      if (book !== undefined && (nextBook.length < 2 || nextBook.length > 160)) {
        return NextResponse.json({ ok: false, error: "Invalid book" }, { status: 400 });
      }
      if (text !== undefined && (nextText.length < 3 || nextText.length > 1200)) {
        return NextResponse.json({ ok: false, error: "Invalid text" }, { status: 400 });
      }

      const update: Record<string, string> = {};
      if (name !== undefined) update["name"] = nextName;
      if (email !== undefined) update["email"] = nextEmail;
      if (book !== undefined) update["book_name"] = nextBook;
      if (text !== undefined) update["quote"] = nextText;

      const { data: updated, error } = await supabase.from("quotes").update(update).eq("id", id).select("id");
      if (error) {
        console.error("Supabase quotes PATCH error:", error);
        const msg =
          error.message.includes("schema cache") || error.message.includes("Could not find the table")
            ? "Missing database table: public.quotes"
            : error.message;
        return NextResponse.json({ ok: false, error: msg }, { status: 500 });
      }
      if (!updated || updated.length === 0) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
      return NextResponse.json({ ok: true });
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
    if (!isAdminRequest(req)) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const id = (url.searchParams.get("id") || "").trim();
    if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });

    const supabase = getSupabase();
    if (supabase) {
      const { data: removed, error } = await supabase.from("quotes").delete().eq("id", id).select("id");
      if (error) {
        console.error("Supabase quotes DELETE error:", error);
        const msg =
          error.message.includes("schema cache") || error.message.includes("Could not find the table")
            ? "Missing database table: public.quotes"
            : error.message;
        return NextResponse.json({ ok: false, error: msg }, { status: 500 });
      }
      if (!removed || removed.length === 0) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
      return NextResponse.json({ ok: true });
    }

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
