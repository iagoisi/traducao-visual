"use client";

export type MetaEventData = Record<string, string | number | boolean | null | undefined>;

type ReactPixelModule = typeof import("react-facebook-pixel");
type ReactPixelType =
ReactPixelModule extends { default: infer T } ? T : ReactPixelModule;
let initialized = false;
let ReactPixel: ReactPixelType | null = null;

async function getReactPixel() {
if (typeof window === "undefined") return null;
if (!ReactPixel) {
const mod = await import("react-facebook-pixel");
ReactPixel =
((mod as { default?: ReactPixelType }).default ??
(mod as unknown as ReactPixelType));
}
return ReactPixel;
}

function getPixelId() {
return process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
}

function getCookie(name: string) {
if (typeof document === "undefined") return undefined;
const target = document.cookie
.split("; ")
.find((row) => row.startsWith(name + "="));
if (!target) return undefined;
return decodeURIComponent(target.split("=")[1] || "");
}

export async function initMetaPixel() {
if (typeof window === "undefined") return false;
if (initialized) return true;

const pixelId = getPixelId();
if (!pixelId) {
console.warn("NEXT_PUBLIC_META_PIXEL_ID nao definido.");
return false;
}

const pixel = await getReactPixel();
if (!pixel) return false;

pixel.init(pixelId, undefined, {
autoConfig: true,
debug: false,
});

initialized = true;
return true;
}

export async function trackPageView() {
const pixel = await getReactPixel();
const eventId = createEventId();
if (pixel && (await initMetaPixel())) {
pixel.fbq("track", "PageView", undefined, {
eventID: eventId,
});
}

try {
await sendToConversionsApi("PageView", eventId);
} catch (error) {
console.error("Falha ao enviar PageView para CAPI", error);
}
}

export function createEventId() {
if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
return crypto.randomUUID();
}
return String(Date.now()) + "-" + Math.random().toString(16).slice(2);
}

async function sendToConversionsApi(
eventName: string,
eventId: string,
eventData?: MetaEventData
) {
await fetch("/api/meta/events", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
eventName,
eventId,
eventData: eventData || {},
eventSourceUrl: typeof window !== "undefined" ? window.location.href : "",
fbp: getCookie("_fbp"),
fbc: getCookie("_fbc"),
}),
keepalive: true,
});
}

export async function trackMetaEvent(
eventName: string,
eventData: MetaEventData = {}
) {
const pixel = await getReactPixel();
const eventId = createEventId();

if (pixel && (await initMetaPixel())) {
pixel.fbq("track", eventName, eventData, {
eventID: eventId,
});
}

try {
await sendToConversionsApi(eventName, eventId, eventData);
} catch (error) {
console.error("Falha ao enviar evento para CAPI", error);
}
}

export async function trackInitiateContact(eventData: MetaEventData = {}) {
await trackMetaEvent("InitiateContact", {
content_name: "Falar com a Ana no WhatsApp",
content_category: "WhatsApp",
...eventData,
});
}

export async function trackInitiateContactSupport(eventData: MetaEventData = {}) {
await trackMetaEvent("InitiateContactSupport", {
content_name: "Falar com o suporte no WhatsApp",
content_category: "Support WhatsApp",
...eventData,
});
}
