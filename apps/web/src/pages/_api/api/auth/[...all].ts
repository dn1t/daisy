import { auth } from "@daisy/auth";

export const GET = async (req: Request): Promise<Response> => auth.handler(req);
export const POST = async (req: Request): Promise<Response> => auth.handler(req);
