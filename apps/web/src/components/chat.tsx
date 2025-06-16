import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: typeof SpeechRecognition;
  webkitSpeechRecognition?: typeof SpeechRecognition;
}

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export default function Chat({ expanded }: { expanded: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

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

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input,
    };
    setMessages((ms) => [...ms, userMessage]);
    const reply: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: `You said: ${input}`,
    };
    setTimeout(() => {
      setMessages((ms) => [...ms, reply]);
    }, 300);
    setInput("");
  };

  return (
    <div className="flex h-dvh md:h-full w-full">
      <div
        className={cn(
          "flex-1 flex flex-col",
          expanded ? "" : "md:max-w-4xl md:mx-auto w-full"
        )}
      >
        <div className="flex-1 overflow-auto p-4 space-y-2">
          {messages.map((msg) => (
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
