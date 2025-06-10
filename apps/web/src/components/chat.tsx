import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input,
    };
    setMessages((m) => [...m, userMessage]);
    const reply: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: `You said: ${input}`,
    };
    setTimeout(() => {
      setMessages((m) => [...m, reply]);
    }, 300);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={
              msg.role === "user" ? "flex justify-end" : "flex justify-start"
            }
          >
            <Card className="max-w-md">
              <CardContent className="p-2">
                <p>{msg.content}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      <div className="p-4 flex gap-2 border-t">
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
