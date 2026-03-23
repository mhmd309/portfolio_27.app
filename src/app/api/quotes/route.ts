import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { Timestamp, getFirestore } from "firebase-admin/firestore";

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

type StorageInfo = { mode: "firestore"; persistent: true };

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isFirestoreApiDisabledError(err: unknown) {
  if (!err || typeof err !== "object") return false;
  const e = err as {
    code?: unknown;
    details?: unknown;
    reason?: unknown;
    message?: unknown;
  };
  const code = typeof e.code === "number" ? e.code : undefined;
  const details = typeof e.details === "string" ? e.details : "";
  const reason = typeof e.reason === "string" ? e.reason : "";
  const message = typeof e.message === "string" ? e.message : "";
  const text = `${details}\n${message}`;
  return code === 7 && (reason === "SERVICE_DISABLED" || text.includes("firestore.googleapis.com"));
}

function storageInfo(): StorageInfo {
  return { mode: "firestore", persistent: true };
}

function isFirebaseConfigured() {
  const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (svc && svc.trim()) return true;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  return Boolean(projectId && clientEmail && privateKey);
}

function firebaseApp() {
  if (getApps().length) return getApps()[0]!;

  const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (svc && svc.trim()) {
    let creds: { project_id?: string; client_email?: string; private_key?: string };
    try {
      creds = JSON.parse(svc) as { project_id?: string; client_email?: string; private_key?: string };
    } catch {
      throw new Error("FIREBASE_NOT_CONFIGURED");
    }
    const projectId = creds.project_id || "";
    const clientEmail = creds.client_email || "";
    const privateKey = (creds.private_key || "").replace(/\\n/g, "\n");
    if (!projectId || !clientEmail || !privateKey) throw new Error("FIREBASE_NOT_CONFIGURED");
    try {
      return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
    } catch {
      throw new Error("FIREBASE_NOT_CONFIGURED");
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || "";
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || "";
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) throw new Error("FIREBASE_NOT_CONFIGURED");
  try {
    return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  } catch {
    throw new Error("FIREBASE_NOT_CONFIGURED");
  }
}

function quotesCollection() {
  const app = firebaseApp();
  const db = getFirestore(app);
  const name = process.env.FIREBASE_QUOTES_COLLECTION || "quotes";
  return db.collection(name);
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") || "1") || 1);
    const pageSize = Math.min(20, Math.max(1, Number(url.searchParams.get("pageSize") || "8") || 8));

    if (!isFirebaseConfigured()) {
      return NextResponse.json({ ok: false, error: "Firebase is not configured" }, { status: 503 });
    }

    const col = quotesCollection();
    const totalSnap = await col.count().get();
    const total = Number(totalSnap.data().count || 0) || 0;
    const start = (page - 1) * pageSize;
    const snap = await col.orderBy("createdAt", "desc").offset(start).limit(pageSize).get();
    const items: Quote[] = snap.docs.map((d) => {
      const data = d.data() as {
        name?: unknown;
        email?: unknown;
        book?: unknown;
        text?: unknown;
        createdAt?: unknown;
      };
      const rawCreatedAt = data.createdAt;
      const createdAt =
        rawCreatedAt instanceof Timestamp
          ? rawCreatedAt.toDate().toISOString()
          : typeof rawCreatedAt === "string"
            ? rawCreatedAt
            : "";
      return {
        id: d.id,
        name: typeof data.name === "string" ? data.name : "",
        email: typeof data.email === "string" ? data.email : "",
        book: typeof data.book === "string" ? data.book : "",
        text: typeof data.text === "string" ? data.text : "",
        createdAt,
      };
    });

    return NextResponse.json({ ok: true, page, pageSize, total, items, storage: storageInfo() });
  } catch (err: unknown) {
    console.error("Quotes API GET error:", err);
    const msg = err instanceof Error ? err.message : "";
    if (msg === "FIREBASE_NOT_CONFIGURED") {
      return NextResponse.json({ ok: false, error: "Firebase admin credentials are missing or invalid" }, { status: 503 });
    }
    if (isFirestoreApiDisabledError(err)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Cloud Firestore API is disabled for this project",
          hint: "Enable Firestore API (firestore.googleapis.com) for your GCP project, then retry.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json({ ok: false, error: "Firebase is not configured" }, { status: 503 });
    }

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

    const createdAt = Timestamp.now();
    const q: Quote = {
      id: crypto.randomUUID(),
      name,
      email,
      book,
      text,
      createdAt: createdAt.toDate().toISOString(),
    };

    const col = quotesCollection();
    await col.doc(q.id).set({
      name: q.name,
      email: q.email,
      book: q.book,
      text: q.text,
      createdAt,
    });
    return NextResponse.json({ ok: true, item: q }, { status: 201 });
  } catch (err: unknown) {
    console.error("Quotes API POST error:", err);
    const msg = err instanceof Error ? err.message : "";
    if (msg === "FIREBASE_NOT_CONFIGURED") {
      return NextResponse.json({ ok: false, error: "Firebase admin credentials are missing or invalid" }, { status: 503 });
    }
    if (isFirestoreApiDisabledError(err)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Cloud Firestore API is disabled for this project",
          hint: "Enable Firestore API (firestore.googleapis.com) for your GCP project, then retry.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}
