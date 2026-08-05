import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { passkey } from "@better-auth/passkey";
import { db } from "@daisy/db";
import * as schema from "@daisy/db/schema";
import { BASE_ERROR_CODES } from "better-auth";
import { betterAuth } from "better-auth/minimal";
import { wakuCookies } from "./cookies";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite", schema }),
  user: {
    additionalFields: {
      entryId: { type: "string", required: true },
    },
  },
  emailAndPassword: { enabled: true },
  plugins: [passkey(), wakuCookies()],
});

const ERROR_MESSAGES: { [key in (typeof BASE_ERROR_CODES)[keyof typeof BASE_ERROR_CODES]["code"]]: string } = {
  USER_NOT_FOUND: "계정을 찾을 수 없어요.",
  FAILED_TO_CREATE_USER: "계정 생성에 실패했어요.",
  FAILED_TO_CREATE_SESSION: "세션 생성에 실패했어요.",
  FAILED_TO_UPDATE_USER: "계정 정보 업데이트에 실패했어요.",
  FAILED_TO_GET_SESSION: "세션 정보를 가져오는데 실패했어요.",
  INVALID_PASSWORD: "비밀번호가 올바르지 않아요.",
  INVALID_EMAIL: "이메일 형식이 올바르지 않아요.",
  INVALID_EMAIL_OR_PASSWORD: "이메일 또는 비밀번호가 올바르지 않아요.",
  INVALID_USER: "잘못된 사용자 정보예요.",
  SOCIAL_ACCOUNT_ALREADY_LINKED: "이미 연결된 소셜 계정이에요.",
  PROVIDER_NOT_FOUND: "제공자를 찾을 수 없어요.",
  INVALID_TOKEN: "토큰이 유효하지 않아요.",
  TOKEN_EXPIRED: "토큰이 만료되었어요.",
  ID_TOKEN_NOT_SUPPORTED: "ID 토큰은 지원되지 않아요.",
  FAILED_TO_GET_USER_INFO: "사용자 정보를 가져오는데 실패했어요.",
  USER_EMAIL_NOT_FOUND: "사용자 이메일을 찾을 수 없어요.",
  EMAIL_NOT_VERIFIED: "이메일 인증이 필요해요.",
  PASSWORD_TOO_SHORT: "비밀번호가 너무 짧아요.",
  PASSWORD_TOO_LONG: "비밀번호가 너무 길어요.",
  USER_ALREADY_EXISTS: "이미 존재하는 계정이에요.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "이미 존재하는 계정이에요. 다른 이메일을 사용해주세요.",
  EMAIL_CAN_NOT_BE_UPDATED: "이메일은 수정할 수 없어요.",
  CHANGE_EMAIL_DISABLED: "이메일 변경이 비활성화되어 있어요.",
  CREDENTIAL_ACCOUNT_NOT_FOUND: "자격 증명 계정을 찾을 수 없어요.",
  ACCOUNT_NOT_FOUND: "계정을 찾을 수 없어요.",
  SESSION_EXPIRED: "세션이 만료되었어요.",
  FAILED_TO_UNLINK_LAST_ACCOUNT: "마지막 계정 연결 해제에 실패했어요.",
  USER_ALREADY_HAS_PASSWORD: "이미 비밀번호가 설정되어 있어요.",
  CROSS_SITE_NAVIGATION_LOGIN_BLOCKED: "크로스 사이트 탐색 로그인이 차단되었어요.",
  VERIFICATION_EMAIL_NOT_ENABLED: "인증 이메일이 활성화되어 있지 않아요.",
  EMAIL_ALREADY_VERIFIED: "이메일이 이미 인증되었어요.",
  EMAIL_MISMATCH: "이메일이 일치하지 않아요.",
  SESSION_NOT_FRESH: "세션이 최신 상태가 아니에요.",
  LINKED_ACCOUNT_ALREADY_EXISTS: "이미 연결된 계정이에요.",
  INVALID_ORIGIN: "잘못된 원본 주소예요.",
  INVALID_CALLBACK_URL: "잘못된 콜백 URL이에요.",
  INVALID_REDIRECT_URL: "잘못된 리디렉션 URL이에요.",
  INVALID_ERROR_CALLBACK_URL: "잘못된 에러 콜백 URL이에요.",
  INVALID_NEW_USER_CALLBACK_URL: "잘못된 새로운 사용자 콜백 URL이에요.",
  MISSING_OR_NULL_ORIGIN: "원본 주소를 찾을 수 없어요.",
  CALLBACK_URL_REQUIRED: "콜백 URL이 필요해요.",
  FAILED_TO_CREATE_VERIFICATION: "인증 생성에 실패했어요.",
  FIELD_NOT_ALLOWED: "허용되지 않은 필드예요.",
  ASYNC_VALIDATION_NOT_SUPPORTED: "비동기 유효성 검사는 지원되지 않아요.",
  VALIDATION_ERROR: "유효성 검사 오류가 발생했어요.",
  MISSING_FIELD: "필수 필드가 누락되었어요.",
  METHOD_NOT_ALLOWED_DEFER_SESSION_REQUIRED: "허용되지 않은 메서드예요. 세션이 필요해요.",
  BODY_MUST_BE_AN_OBJECT: "바디는 객체여야 해요.",
  PASSWORD_ALREADY_SET: "비밀번호가 이미 설정되어 있어요.",
};

export function getErrorMessage(code: string) {
  if (code in ERROR_MESSAGES) return (ERROR_MESSAGES as Record<string, string>)[code] as string;
  return "알 수 없는 오류가 발생했어요.";
}

export { APIError, isAPIError } from "better-auth/api";
export { getSessionCookie } from "better-auth/cookies";
export { getContextData, runWithWakuCookiesContext } from "./cookies";
export { BASE_ERROR_CODES };
