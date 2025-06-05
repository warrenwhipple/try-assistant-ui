import { openai } from "@ai-sdk/openai";
import { frontendTools } from "@assistant-ui/react-ai-sdk";
import { streamText } from "ai";
import { createMockResponse } from "./mock-handler";

// export const runtime = "edge";
export const maxDuration = 30;

// Declare process.env type to avoid TypeScript errors
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_API_KEY?: string;
    }
  }
}

export async function POST(req: Request) {
  const { messages, system, tools } = await req.json();
  
  // Check if OpenAI API key exists
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    // Use mock responses when no API key is available
    console.log("No OpenAI API key found, using mock responses");
    return createMockResponse(messages);
  }
  
  // Use OpenAI when API key is available
  console.log("OpenAI API key found, using real AI responses");
  
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
