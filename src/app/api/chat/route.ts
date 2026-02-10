import { createClient } from "@/lib/supabase/server";
import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";

interface Response {
  messages: UIMessage[];
  workspaceId: string;
}

export async function POST(req: Request) {
  const { messages, workspaceId }: Response = await req.json();
  const lastMessage = messages[messages.length - 1];
  const lastMessageText = lastMessage.parts.find((p: any) => p.type === "text")?.text || "";
  console.log(lastMessageText);

  const supabase = await createClient();

  const { embeddings } = await google.embedding("gemini-embedding-001").doEmbed({
    values: [lastMessageText],
    providerOptions: {
      google: {
        outputDimensionality: 1536,
      },
    },
  });

  const { data: documents } = await supabase.rpc("match_documents", {
    query_embedding: embeddings[0] as any,
    match_threshold: 0.3,
    match_count: 5,
    filter_workspace_id: workspaceId,
  });

  const context =
    documents?.map((docs) => docs.content).join("\n\n") || "No relevant content found";
  const prompt = `
    You are an AI assistant for a document knowledge base.
    Use the following context to answer the user's question.
    If the answer is not in the context, say you don't know.

    CONTEXT:
    ${context}
  `;

  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: await convertToModelMessages(messages),
    system: prompt,
  });

  return result.toUIMessageStreamResponse();
}
