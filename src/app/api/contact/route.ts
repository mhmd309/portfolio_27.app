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
  try {
    const data = (await req.json()) as Body;

    // Honeypot to deter bots
    if (data.company) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const name = (data.name ?? "").trim();
    const email = (data.email ?? "").trim();
    const message = (data.message ?? "").trim();

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
    if (!RESEND_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "Server email is not configured" },
        { status: 500 }
      );
    }
    const resend = new Resend(RESEND_API_KEY);
    const rawFrom = RESEND_FROM_EMAIL || (process.env.NODE_ENV !== "production" ? "onboarding@resend.dev" : "");
    if (!rawFrom) {
      return NextResponse.json(
        { ok: false, error: "Server email is not configured" },
        { status: 500 }
      );
    }
    const from = /</.test(rawFrom) ? rawFrom : `Portfolio Contact <${rawFrom}>`;
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
    const sendPromise = resend.emails.send({
      from,
      to,
      replyTo: email,
      subject,
      text,
      html,
    });
    const result = await withTimeout(sendPromise, 20000, "RESEND_TIMEOUT").catch((e) => {
      throw e;
    });
    interface ResendSendResult {
      error?: { name?: string; message?: string } | null;
    }
    const r = result as ResendSendResult;
    if (r?.error) {
      const err = r.error;
      throw new Error(`${err.name || "RESEND_ERROR"}: ${err.message || "Unknown error"}`);
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const isDev = process.env.NODE_ENV !== "production";
    if (isDev) {
      const e = err as {
        message?: string;
        name?: string;
      };
      const reason = e.message ?? "Unknown error";
      let friendly = "حدث خطأ غير متوقع أثناء إرسال البريد";
      if (/RESEND_TIMEOUT/i.test(reason)) {
        friendly = "انتهت مهلة الاتصال بخدمة البريد.";
      } else if (/api key/i.test(reason) || /unauthorized/i.test(reason)) {
        friendly = "مفتاح Resend غير صحيح أو مفقود.";
      } else if (/domain/i.test(reason) || /from address/i.test(reason)) {
        friendly = "بريد الإرسال غير مفعل على Resend (تحقق من domain).";
      } 
      return NextResponse.json(
        { ok: false, error: friendly },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}
