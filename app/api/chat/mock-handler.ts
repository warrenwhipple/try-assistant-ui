// Mock responses for when no API key is available
const mockResponses = [
  "I'm a mock AI assistant! I can help you with various tasks.",
  "That's an interesting question! Let me think about it...",
  "Based on my mock knowledge, I'd say that's a great idea!",
  "I understand what you're asking. Here's my mock response:",
  "As a mock assistant, I can provide you with this helpful information:",
  "That's a thoughtful question. From my mock perspective, I'd suggest:",
  "I'm here to help! This is a simulated response while running without an API key.",
  "Great question! As a mock assistant, I'd recommend considering all your options.",
];

export function createMockResponse(messages: any[]): Response {
  const lastMessage = messages[messages.length - 1];
  
  // Debug logging to understand message structure
  console.log("Last message structure:", JSON.stringify(lastMessage, null, 2));
  
  // Extract text content from the message
  let userQuery = "";
  if (lastMessage?.content) {
    if (typeof lastMessage.content === 'string') {
      userQuery = lastMessage.content;
    } else if (Array.isArray(lastMessage.content)) {
      // Handle array of content parts
      userQuery = lastMessage.content
        .filter((part: any) => part.type === 'text')
        .map((part: any) => part.text || '')
        .join(' ');
    } else if (typeof lastMessage.content === 'object' && lastMessage.content.text) {
      userQuery = lastMessage.content.text;
    }
  }
  
  // Ensure userQuery is a string
  userQuery = String(userQuery || "");
  
  // Select a response based on the query
  let response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
  
  // Add some contextual responses based on keywords
  const queryLower = userQuery.toLowerCase();
  if (queryLower.includes("hello") || queryLower.includes("hi")) {
    response = "Hello! I'm your mock AI assistant. How can I help you today?";
  } else if (queryLower.includes("how are you")) {
    response = "I'm doing great, thank you for asking! As a mock AI, I'm always ready to help.";
  } else if (queryLower.includes("what can you do")) {
    response = "As a mock AI assistant, I can simulate conversations and provide example responses. In a real deployment with an API key, I would have full AI capabilities!";
  } else if (queryLower.includes("test")) {
    response = "This is a test response from the mock AI. Everything seems to be working correctly!";
  } else if (queryLower.includes("help")) {
    response = "I'm here to help! While I'm running in mock mode, I can still demonstrate how the chat interface works. With an API key, I'd provide more sophisticated assistance.";
  }
  
  // Create a readable stream that mimics the AI SDK format
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Simulate streaming with chunks
        const words = response.split(' ');
        
        for (let i = 0; i < words.length; i++) {
          const chunk = (i === 0 ? '' : ' ') + words[i];
          
          // Format as Vercel AI SDK text stream
          const data = `0:"${chunk}"`;
          controller.enqueue(encoder.encode(data + '\n'));
          
          // Add a small delay to simulate streaming
          await new Promise(resolve => setTimeout(resolve, 30));
        }
        
        controller.close();
      } catch (error) {
        console.error("Error in mock stream:", error);
        controller.error(error);
      }
    },
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}