import { getEnv } from "@daisy/env";
import { createAuthClient } from "better-auth/solid";

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
  baseURL: getEnv("AUTH_URL"),
});
