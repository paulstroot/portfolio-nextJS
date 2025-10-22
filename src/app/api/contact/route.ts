import { NextResponse } from "next/server";
import SMTP2GOApi from "smtp2go-nodejs";

// Read API key from environment for security
const apikey = process.env.SMTP2GO_API_KEY;

export async function POST(req: Request) {
  try {
    const { to, from, subject, text, html } = await req.json();

    if (!apikey) {
      return NextResponse.json(
        { error: "Missing SMTP2GO_API_KEY environment variable" },
        { status: 500 }
      );
    }

    const api = SMTP2GOApi(apikey);

    const mailService = api
      .mail()
      .to(to)
      .from(from)
      .subject(subject)
      .text(text);

    if (html) {
      mailService.html(html);
    }

    const result = await api.client().consume(mailService);

    return NextResponse.json({ ok: true, result }, { status: 200 });
  } catch (err: unknown) {
    console.error("/api/contact error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
