"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ScrollArea } from "./ui/scroll-area";
import { Loader2, Send } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Streamdown } from "streamdown";
import "streamdown/styles.css";

interface ChatInterfaceProps {
  workspaceId: string;
}

export function ChatInterface({ workspaceId }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { workspaceId },
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    await sendMessage({ text: inputValue });
    setInputValue("");
  };

  return (
    <div className="flex h-[600px] flex-col rounded-lg border shadow-sm">
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 && (
          <div className="mt-20 text-center text-gray-400">Ask a question about your documents</div>
        )}

        <div className="space-y-4">
          {messages.map((m) => {
            return (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${m.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}
                >
                  <div className="text-sm whitespace-pre-wrap">
                    {m.parts.map((part, i) => {
                      if (part.type === "text")
                        return (
                          <Streamdown key={i} animated isAnimating={status === "streaming"}>
                            {part.text}
                          </Streamdown>
                        );
                      return null;
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center rounded-lg bg-gray-100 p-3">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="rounded-b-lg border-t bg-gray-50 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask something..."
            disabled={isLoading}
            className="bg-white"
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4"></Send>
          </Button>
        </form>
      </div>
    </div>
  );
}
