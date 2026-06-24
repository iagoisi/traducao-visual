"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initMetaPixel, trackPageView } from "@/src/services/Meta/metaPixel";

export function MetaPixelBootstrap() {
const pathname = usePathname();
const searchParams = useSearchParams();

useEffect(() => {
void initMetaPixel();
}, []);

useEffect(() => {
void trackPageView();
}, [pathname, searchParams]);

return null;
}