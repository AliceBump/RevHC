import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, ArrowLeftRight, MoreHorizontal } from "lucide-react";

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: typeof SpeechRecognition
  webkitSpeechRecognition?: typeof SpeechRecognition
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

interface ChatFolder {
  id: number;
  title: string;
  chats: Chat[];
  expanded?: boolean;
}

type ChatItem = Chat | ChatFolder;

const isFolder = (item: ChatItem): item is ChatFolder =>
  (item as ChatFolder).chats !== undefined;

export default function Chat({
  expanded,
  mobileSidebarOpen,
  setMobileSidebarOpen,
}: {
  expanded: boolean;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const initialId = Date.now();
  const [chats, setChats] = useState<ChatItem[]>([
    { id: initialId, title: "New Chat", messages: [] },
  ]);
  const [currentChatId, setCurrentChatId] = useState<number>(initialId);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [sidebarRight, setSidebarRight] = useState(false);
  const [contextChatId, setContextChatId] = useState<number | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const findChatById = (items: ChatItem[], id: number): Chat | undefined => {
    for (const item of items) {
      if (isFolder(item)) {
        const found = item.chats.find((c) => c.id === id);
        if (found) return found;
      } else if (item.id === id) {
        return item;
      }
    }
  };

  const currentChat = findChatById(chats, currentChatId)!;

  const startNewChat = () => {
    const id = Date.now();
    setChats((chs) => [...chs, { id, title: "New Chat", messages: [] }]);
    setCurrentChatId(id);
  };

  const updateChat = (
    items: ChatItem[],
    id: number,
    updater: (c: Chat) => Chat
  ): ChatItem[] => {
    return items.map((item) => {
      if (isFolder(item)) {
        const idx = item.chats.findIndex((c) => c.id === id);
        if (idx !== -1) {
          const newChats = [...item.chats];
          newChats[idx] = updater(item.chats[idx]);
          return { ...item, chats: newChats };
        }
        return item;
      }
      if (item.id === id) {
        return updater(item);
      }
      return item;
    });
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
      const transcript = Array.from(e.results as SpeechRecognitionResultList)
        .map((r) => (r as SpeechRecognitionResult)[0].transcript)
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

  const handleDragOver = (id: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedId === null) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const overIndex = chats.findIndex((c) => c.id === id);
    const before = e.clientY < rect.top + rect.height / 2;
    setDropIndex(before ? overIndex : overIndex + 1);
  };

  const removeChatById = (
    items: ChatItem[],
    id: number
  ): [Chat | null, ChatItem[]] => {
    const result: ChatItem[] = [];
    let removed: Chat | null = null;
    for (const item of items) {
      if (isFolder(item)) {
        const idx = item.chats.findIndex((c) => c.id === id);
        if (idx !== -1) {
          removed = item.chats[idx];
          const newFolder = {
            ...item,
            chats: item.chats.filter((c) => c.id !== id),
          };
          result.push(newFolder);
        } else {
          result.push(item);
        }
      } else if (item.id === id) {
        removed = item;
      } else {
        result.push(item);
      }
    }
    return [removed, result];
  };

  const addChatToTarget = (
    items: ChatItem[],
    targetId: number,
    chat: Chat
  ): ChatItem[] => {
    return items.map((item) => {
      if (isFolder(item)) {
        if (item.id === targetId) {
          return { ...item, chats: [...item.chats, chat] };
        }
        return item;
      }
      if (item.id === targetId) {
        const folder: ChatFolder = {
          id: Date.now(),
          title: "Group",
          chats: [item, chat],
          expanded: true,
        };
        return folder;
      }
      return item;
    });
  };

  const handleDropOnItem = (targetId: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedId === null) return;
    if (draggedId === targetId) {
      setDraggedId(null);
      setDropIndex(null);
      return;
    }
    setChats((chs) => {
      const [dragged, without] = removeChatById(chs, draggedId);
      if (!dragged) return chs;
      return addChatToTarget(without, targetId, dragged);
    });
    setDraggedId(null);
    setDropIndex(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedId === null || dropIndex === null) return;
    setChats((chs) => {
      const from = chs.findIndex((c) => c.id === draggedId);
      if (from === -1) return chs;
      const updated = [...chs];
      const [removed] = updated.splice(from, 1);
      let target = dropIndex;
      if (from < target) target -= 1;
      updated.splice(target, 0, removed);
      return updated;
    });
    setDraggedId(null);
    setDropIndex(null);
  };

  const handleContainerDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedId === null) return;
    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    if (e.clientY > rect.bottom) {
      setDropIndex(chats.length);
    }
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDropIndex(null);
  };

  const toggleContext = (id: number) => {
    setContextChatId((c) => (c === id ? null : id));
  }
  
  const toggleFolder = (id: number) => {
    setChats((chs) =>
      chs.map((item) =>
        isFolder(item) && item.id === id
          ? { ...item, expanded: !item.expanded }
          : item
      )
    );
  };

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
      updateChat(chs, currentChatId, (c) => ({
        ...c,
        messages: [...c.messages, userMessage],
        title: c.title === "New Chat" ? truncateTitle(input) : c.title,
      }))
    );

    const reply: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: `You said: ${input}`,
    };
    setTimeout(() => {
      setChats((chs) =>
        updateChat(chs, currentChatId, (c) => ({
          ...c,
          messages: [...c.messages, reply],
        }))
      );
    }, 300);
    setInput("");
  };

  const sidebar = (
    <div
      className={cn(
        "w-48 p-2 flex flex-col bg-background h-full",
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
        <div
          className="flex-1 overflow-auto space-y-1"
          onDragOver={handleContainerDragOver}
          onDrop={handleDrop}
        >
          {chats.map((item, index) => (
            <React.Fragment key={item.id}>
              {dropIndex === index && (
                <div className="h-0.5 bg-primary rounded" />
              )}
              {isFolder(item) ? (
                <div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start font-semibold"
                    draggable
                    onDragStart={handleDragStart(item.id)}
                    onDragOver={handleDragOver(item.id)}
                    onDragEnd={handleDragEnd}
                    onDrop={handleDropOnItem(item.id)}
                    onClick={() => toggleFolder(item.id)}
                  >
                    <span className="truncate">{item.title}</span>
                  </Button>
                  {item.expanded && (
                    <div className="pl-4 space-y-1">
                      {item.chats.map((c) => (
                        <Button
                          key={c.id}
                          variant={
                            c.id === currentChatId ? "secondary" : "ghost"
                          }
                          className="w-full justify-start"
                          onDrop={handleDropOnItem(item.id)}
                          onClick={() => setCurrentChatId(c.id)}
                        >
                          <span className="truncate">{c.title}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <Button
                    variant={item.id === currentChatId ? "secondary" : "ghost"}
                    className="w-full justify-start pr-8 group"
                    draggable
                    onDragStart={handleDragStart(item.id)}
                    onDragOver={handleDragOver(item.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => setCurrentChatId(item.id)}
                  >
                    <span className="truncate">{item.title}</span>
                    <span
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleContext(item.id);
                      }}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </span>
                  </Button>
                  {contextChatId === item.id && (
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-popover text-popover-foreground border rounded-md shadow p-2 z-10">
                      <p className="text-sm">Chat options</p>
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
          {dropIndex === chats.length && (
            <div className="h-0.5 bg-primary rounded" />
          )}
        </div>
      </div>
  );

  return (
    <div
      className={cn(
        "flex h-screen md:h-full w-full relative",
        sidebarRight ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className="hidden md:flex">{sidebar}</div>
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div
            className={cn(
              "absolute top-0 bottom-0",
              sidebarRight ? "right-0" : "left-0"
            )}
          >
            {sidebar}
          </div>
        </div>
      )}
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
