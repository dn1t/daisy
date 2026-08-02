"use server";

import { getComments, getUserProfile, type Result, type UserProfile } from "@daisy/entry-api";
import { env } from "cloudflare:workers";
import { unstable_getRequest } from "waku/router/server";

export async function createVerificationSession(
  entryId: string,
): Promise<Result<UserProfile & { code: string; expiry: number }>> {
  try {
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
    const expiry = Date.now() + 10 * 60 * 1000;
    await env.daisy.put(`verification-session:${ip}`, JSON.stringify({ entryId, code, expiry }), {
      expirationTtl: 10 * 60 + 10,
    });

    return { success: true, data: { ...res.data, code, expiry } };
  } catch (error) {
    console.error(error);
    return { success: false, error: "알 수 없는 오류가 발생했어요." };
  }
}

export async function checkVerificationSession(entryId: string): Promise<Result<string>> {
  try {
    const ip = unstable_getRequest().headers.get("cf-connecting-ip");
    if (!ip) return { success: false, error: "IP 주소를 확인할 수 없어요." };

    const existingSession = await env.daisy.get<{ entryId: string; code: string }>(`verification-session:${ip}`, {
      type: "json",
    });
    if (existingSession?.entryId !== entryId) return { success: false, error: "인증 세션이 존재하지 않아요." };

    const commentsRes = await getComments(process.env.ENTRY_VERIFY_POST_ID ?? "60c6c9e116c381168ecdb779");
    if (!commentsRes.success) return { success: false, error: "댓글을 불러오는 중 오류가 발생했어요." };

    const comment = commentsRes.data.find((comment) => comment.content.trim() === existingSession.code);
    if (comment?.user.id !== entryId) return { success: false, error: "인증 댓글을 찾지 못했어요." };

    const code = crypto.randomUUID();
    const expiry = Date.now() + 20 * 60 * 1000;
    await Promise.all([
      env.daisy.delete(`verification-session:${ip}`),
      env.daisy.put(`verified-session:${ip}`, JSON.stringify({ entryId, code, expiry }), {
        expirationTtl: 20 * 60 + 10,
      }),
    ]);

    return { success: true, data: code };
  } catch (error) {
    console.error(error);
    return { success: false, error: "알 수 없는 오류가 발생했어요." };
  }
}
