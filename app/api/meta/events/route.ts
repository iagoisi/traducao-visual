import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";

export const runtime = "nodejs";

type IncomingBody = {
  eventName?: string;
  eventId?: string;
  eventData?: Record<string, unknown>;
  eventSourceUrl?: string;
  fbp?: string;
  fbc?: string;
  userData?: {
    email?: string;
    phone?: string;
  };
};

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeEmail(email?: string) {
  if (!email) return undefined;
  return email.trim().toLowerCase();
}

function normalizePhone(phone?: string) {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, "");
  return digits || undefined;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as IncomingBody;
    const eventName = body.eventName;
    const eventId = body.eventId;

    if (!eventName || !eventId) {
      return NextResponse.json(
        { ok: false, error: "eventName e eventId sao obrigatorios" },
        { status: 400 }
      );
    }

    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;
    const testEventCode = process.env.META_TEST_EVENT_CODE;

    if (!pixelId || !accessToken) {
      return NextResponse.json(
        { ok: false, error: "META_PIXEL_ID ou META_ACCESS_TOKEN ausente" },
        { status: 500 }
      );
    }

    const forwardedFor = req.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : undefined;
    const userAgent = req.headers.get("user-agent") || undefined;

    const userData: Record<string, unknown> = {};

    if (clientIp) userData.client_ip_address = clientIp;
    if (userAgent) userData.client_user_agent = userAgent;
    if (body.fbp) userData.fbp = body.fbp;
    if (body.fbc) userData.fbc = body.fbc;

    const normalizedEmail = normalizeEmail(body.userData?.email);
    if (normalizedEmail) userData.em = [sha256(normalizedEmail)];

    const normalizedPhone = normalizePhone(body.userData?.phone);
    if (normalizedPhone) userData.ph = [sha256(normalizedPhone)];

    const payload: Record<string, unknown> = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_id: eventId,
          event_source_url: body.eventSourceUrl || undefined,
          user_data: userData,
          custom_data: body.eventData || {},
        },
      ],
    };

    if (testEventCode && process.env.NODE_ENV !== "production") {
      payload.test_event_code = testEventCode;
      }

    const endpoint =
  "https://graph.facebook.com/v19.0/" + pixelId + "/events";

    const metaResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const metaJson = await metaResponse.json();

    if (!metaResponse.ok) {
      return NextResponse.json(
        { ok: false, metaError: metaJson },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, meta: metaJson });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Falha interna na rota de eventos", detail: String(error) },
      { status: 500 }
    );
  }
}