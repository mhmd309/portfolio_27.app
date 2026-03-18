import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

function withTimeout<T>(p: Promise<T>, ms: number, label: string) {
  let t: NodeJS.Timeout;
  const timer = new Promise<never>((_, reject) => {
    t = setTimeout(() => reject(new Error(label)), ms);
  });
  return Promise.race([p, timer]).finally(() => clearTimeout(t!));
}

type Body = {
  name?: string;
  email?: string;
  message?: string;
  company?: string; // honeypot
};

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  let data: Body;
  try {
    data = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const company = typeof data.company === "string" ? data.company.trim() : "";
  if (company) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ ok: false, error: "Invalid name" }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }
  if (message.length < 10 || message.length > 2000) {
    return NextResponse.json({ ok: false, error: "Invalid message" }, { status: 400 });
  }

  const { RESEND_API_KEY, RESEND_FROM_EMAIL, CONTACT_TO_EMAIL } = process.env as Record<
    string,
    string | undefined
  >;
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
    return NextResponse.json({ ok: false, error: "Server email is not configured" }, { status: 500 });
  }

  const resend = new Resend(RESEND_API_KEY);
  const from = /</.test(RESEND_FROM_EMAIL)
    ? RESEND_FROM_EMAIL
    : `Portfolio Contact <${RESEND_FROM_EMAIL}>`;
  const to = CONTACT_TO_EMAIL || "m.elzero33@gmail.com";
  const subject = `New contact form: ${name}`;
  const text = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; line-height:1.5">
      <h2 style="margin:0 0 8px 0">New contact message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p style="white-space: pre-wrap"><strong>Message:</strong> ${message}</p>
    </div>
  `;

  try {
    const result = await withTimeout(
      resend.emails.send({
        from,
        to,
        replyTo: email,
        subject,
        text,
        html,
      }),
      20000,
      "RESEND_TIMEOUT"
    );
    const r = result as { error?: { name?: string; message?: string } | null };
    if (r?.error) {
      console.error("Resend send error:", { name: r.error.name, message: r.error.message });
      return NextResponse.json({ ok: false, error: "Email service error" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "RESEND_TIMEOUT") {
      console.error("Resend timeout");
      return NextResponse.json({ ok: false, error: "Email service timed out" }, { status: 504 });
    }
    console.error("Contact API error:", err);
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}
