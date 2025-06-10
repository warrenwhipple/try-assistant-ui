import { auth } from "@clerk/nextjs/server";
import { VercelKVThreadStorage } from "@/lib/thread-storage";

export async function GET(
  req: Request,
  { params }: { params: { threadId: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const storage = new VercelKVThreadStorage(userId);
  const messages = await storage.getMessages(params.threadId);

  return Response.json({ messages });
}