"use client";

import { usePublicRoute } from "@/hooks/useRouteGuard";

export default function LandingRouteGuard() {
  usePublicRoute();
  return null;
}