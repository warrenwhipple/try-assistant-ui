import { auth } from "@clerk/nextjs/server";
import { VercelKVThreadStorage } from "@/lib/thread-storage";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const storage = new VercelKVThreadStorage(userId);
  const threads = await storage.listThreads();

  return Response.json({ threads });
}