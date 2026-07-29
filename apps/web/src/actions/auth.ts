"use server";

import { getUserProfile, type Result, type UserProfile } from "@daisy/entry-api";
import { env } from "cloudflare:workers";
import { unstable_getRequest } from "waku/router/server";

const VALID_MINUTES = 10;

export async function createVerificationSession(
  entryId: string,
): Promise<Result<UserProfile & { code: string; expiry: number }>> {
  const ip = unstable_getRequest().headers.get("cf-connecting-ip");
  if (!ip) return { success: false, error: "IP 주소를 확인할 수 없어요." };

  const res = await getUserProfile(entryId);
  if (!res.success) return res;

  const existingSession = await env.daisy.get<{ entryId: string; code: string; expiry: number }>(
    `verification-session:${ip}`,
    { type: "json" },
  );
  if (existingSession?.entryId === entryId)
    return { success: true, data: { ...res.data, code: existingSession.code, expiry: existingSession.expiry } };

  const code = crypto.randomUUID();
  const expiry = Date.now() + VALID_MINUTES * 60 * 1000;
  await env.daisy.put(`verification-session:${ip}`, JSON.stringify({ entryId, code, expiry }), {
    expirationTtl: VALID_MINUTES * 60 + 10,
  });

  return { success: true, data: { ...res.data, code, expiry } };
}
