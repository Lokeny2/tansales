import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import OpenAI from "openai";

// Use Node.js runtime (not Edge) to fully support the MCP SDK
export const runtime = "nodejs";

// Read secrets from .env.local
const MCP_SERVER_URL = "https://code-mcp-server.lokenymoses2.workers.dev/mcp";
const MCP_API_KEY = process.env.MCP_API_KEY || "";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";

const deepseek = new OpenAI({
  apiKey: DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

export async function POST(req: Request) {
  const { messages } = await req.json(); // array of { role, content }

  // --- Connect to your MCP server with the secret handshake ---
  const transport = new StreamableHTTPClientTransport(new URL(MCP_SERVER_URL), {
    requestInit: {
      headers: {
        "x-api-key": MCP_API_KEY,
      },
    },
  });

  const client = new Client({ name: "tansales-nextjs", version: "1.0.0" });
  await client.connect(transport);

  // --- Fetch the tools that the file clerk can perform ---
  const { tools } = await client.listTools();
  const openaiTools = tools.map((tool) => ({
    type: "function" as const,
    function: {
      name: tool.name,
      description: tool.description || tool.name,
      parameters: tool.inputSchema,
    },
  }));

  // --- Conversation loop (AI may call tools multiple times) ---
  let conversation = [...messages];

  while (true) {
    const response = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: conversation,
      tools: openaiTools,
    });

    const assistantMsg = response.choices[0].message;
    conversation.push(assistantMsg);

    if (assistantMsg.tool_calls) {
      // Process each tool call
      for (const toolCall of assistantMsg.tool_calls) {
        console.log(`Calling tool: ${toolCall.function.name}`);
        const toolResult = await client.callTool({
          name: toolCall.function.name,
          arguments: JSON.parse(toolCall.function.arguments),
        });

        const resultText = toolResult.content
          .map((c: any) => (c.type === "text" ? c.text : ""))
          .join("\n");

        conversation.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: resultText,
        });
      }
    } else {
      // No more tool calls -> final answer
      await client.close();
      return new Response(assistantMsg.content, {
        headers: { "Content-Type": "text/plain" },
      });
    }
  }
}