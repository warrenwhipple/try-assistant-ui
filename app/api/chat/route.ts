import { openai } from "@ai-sdk/openai";
import { frontendTools } from "@assistant-ui/react-ai-sdk";
import { createDataStreamResponse, streamText } from "ai";
import { formatDataStreamPart } from "@ai-sdk/ui-utils";

// export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, system, tools } = await req.json();

  if (!process.env.OPENAI_API_KEY) {
    return createDataStreamResponse({
      async execute(writer) {
        writer.write(
          formatDataStreamPart(
            "text",
            "This is a mock response because no OPENAI_API_KEY was provided."
          )
        );
        writer.write(
          formatDataStreamPart("finish_message", { finishReason: "stop" })
        );
      },
      onError: console.error,
    });
  }

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
