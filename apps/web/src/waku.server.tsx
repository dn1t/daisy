import { fsRouter } from "waku";
import adapter from "waku/adapters/cloudflare";
import authMiddleware from "./middleware/auth";

export default adapter(fsRouter(import.meta.glob("./pages/**/*.{tsx,ts}")), {
  middlewareFns: [authMiddleware],
});
