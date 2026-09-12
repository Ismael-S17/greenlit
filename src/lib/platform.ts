import type { Platform } from "../types";

export function detectPlatform(url: string): Platform | null {
  if (!url) return null;
  let hostname = "";
  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
  if (hostname.includes("linkedin.com")) return "LinkedIn";
  if (hostname.includes("indeed.com")) return "Indeed";
  if (hostname.includes("joinhandshake.com") || hostname.includes("handshake.com"))
    return "Handshake";
  if (hostname.includes("scholarship") || hostname.includes("fastweb.com")) return "Scholarship Portal";
  return "Company Site";
}
