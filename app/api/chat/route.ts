import { openai } from "@ai-sdk/openai";
import { frontendTools } from "@assistant-ui/react-ai-sdk";
import { streamText, StreamingTextResponse } from "ai";
import { ReadableStream } from "stream/web";

// export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  console.log("Checking for OPENAI_API_KEY...");
  if (!process.env.OPENAI_API_KEY) {
    console.log("OPENAI_API_KEY not found. Serving mock response.");
    // If OPENAI_API_KEY is not set, return a mock response
    const textEncoder = new TextEncoder();
    const mockStream = new ReadableStream({
      async start(controller) {
        console.log("Mock stream started.");
        const chunks = [
          "Hello",
          ", ",
          "this ",
          "is ",
          "a ",
          "mock ",
          "response.",
        ];
        for (const chunk of chunks) {
          console.log(`Mock stream enqueuing chunk: "${chunk}"`);
          controller.enqueue(textEncoder.encode(chunk));
          await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate delay
        }
        controller.close();
        console.log("Mock stream closed.");
      },
    });
    return new StreamingTextResponse(mockStream);
  } else {
    console.log("OPENAI_API_KEY found. Proceeding with OpenAI API call.");
  }

  const { messages, system, tools } = await req.json();

  console.log("Preparing to call OpenAI API.");
  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    // forward system prompt and tools from the frontend
    toolCallStreaming: true,
    system,
    tools: {
      ...frontendTools(tools),
    },
    onError: console.log,
  });

  return result.toDataStreamResponse();
}
