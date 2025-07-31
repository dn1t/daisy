import { createAuthClient } from "better-auth/solid";
import { config } from "dotenv";

// @ts-expect-error
if (!globalThis.Deno) {
  config({ path: "../../.env" });
}

export const {
  $ERROR_CODES,
  $Infer,
  $fetch,
  accountInfo,
  changeEmail,
  changePassword,
  deleteUser,
  forgetPassword,
  getAccessToken,
  getSession,
  linkSocial,
  listAccounts,
  listSessions,
  refreshToken,
  requestPasswordReset,
  resetPassword,
  revokeOtherSessions,
  revokeSession,
  revokeSessions,
  signIn,
  sendVerificationEmail,
  signOut,
  signUp,
  unlinkAccount,
  verifyEmail,
  updateUser,
  useSession,
} = createAuthClient({
  baseURL: process.env.AUTH_URL,
});
