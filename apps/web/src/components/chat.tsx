import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, ArrowLeftRight } from "lucide-react";

interface WindowWithSpeechRecognition extends Window {
  webkitSpeechRecognition?: typeof SpeechRecognition;
}

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

interface Chat {
  id: number;
  title: string;
  messages: Message[];
}

export default function Chat({ expanded }: { expanded: boolean }) {
  const initialId = Date.now();
  const [chats, setChats] = useState<Chat[]>([
    { id: initialId, title: "New Chat", messages: [] },
  ]);
  const [currentChatId, setCurrentChatId] = useState<number>(initialId);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [sidebarRight, setSidebarRight] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const currentChat = chats.find((c) => c.id === currentChatId)!;

  const startNewChat = () => {
    const id = Date.now();
    setChats((chs) => [...chs, { id, title: "New Chat", messages: [] }]);
    setCurrentChatId(id);
  };

  useEffect(() => {
    const SpeechRecognitionClass =
      (window as WindowWithSpeechRecognition).SpeechRecognition ||
      (window as WindowWithSpeechRecognition).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) return;
    const recognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join("");
      setInput(transcript);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      setListening(true);
      recognition.start();
    }
  };

  const handleDragStart = (id: number) => (e: React.DragEvent) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (id: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedId === null || draggedId === id) return;
    setChats((chs) => {
      const draggedIndex = chs.findIndex((c) => c.id === draggedId);
      const dropIndex = chs.findIndex((c) => c.id === id);
      if (draggedIndex === -1 || dropIndex === -1) return chs;
      const updated = [...chs];
      const [removed] = updated.splice(draggedIndex, 1);
      updated.splice(dropIndex, 0, removed);
      return updated;
    });
    setDraggedId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnd = () => setDraggedId(null);

  const truncateTitle = (text: string, words = 4) => {
    const parts = text.trim().split(/\s+/);
    const snippet = parts.slice(0, words).join(" ");
    return parts.length > words ? `${snippet}...` : snippet || "New Chat";
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input,
    };

    setChats((chs) =>
      chs.map((c) => {
        if (c.id !== currentChatId) return c;
        const updated = {
          ...c,
          messages: [...c.messages, userMessage],
          title:
            c.title === "New Chat" ? truncateTitle(input) : c.title,
        };
        return updated;
      })
    );

    const reply: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: `You said: ${input}`,
    };
    setTimeout(() => {
      setChats((chs) =>
        chs.map((c) =>
          c.id === currentChatId
            ? { ...c, messages: [...c.messages, reply] }
            : c
        )
      );
    }, 300);
    setInput("");
  };

  return (
    <div
      className={cn(
        "flex h-screen md:h-full w-full",
        sidebarRight ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "w-48 p-2 flex flex-col",
          sidebarRight ? "border-l" : "border-r"
        )}
      >
        <div className="flex items-center justify-between mb-2 pb-2 border-b">
          <Button size="sm" onClick={startNewChat}>
            + New Chat
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarRight((r) => !r)}
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto space-y-1">
          {chats.map((chat) => (
            <Button
              key={chat.id}
              variant={
                chat.id === currentChatId ? "secondary" : "ghost"
              }
              className="w-full justify-start"
              draggable
              onDragStart={handleDragStart(chat.id)}
              onDrop={handleDrop(chat.id)}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onClick={() => setCurrentChatId(chat.id)}
            >
              <span className="truncate">{chat.title}</span>
            </Button>
          ))}
        </div>
      </div>
      <div
        className={cn(
          "flex-1 flex flex-col",
          expanded ? "" : "md:max-w-4xl md:mx-auto w-full"
        )}
      >
        <div className="flex-1 overflow-auto p-4 space-y-2">
          {currentChat.messages.map((msg) => (
            <div
              key={msg.id}
              className={
                msg.role === "user" ? "flex justify-end" : "flex justify-start"
              }
            >
              <Card className="max-w-lg">
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
          <Button variant="ghost" size="icon" onClick={toggleListening}>
            {listening ? <MicOff size={20} /> : <Mic size={20} />}
          </Button>
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
}
