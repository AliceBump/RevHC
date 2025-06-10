import SignIn from "@/components/sign-in";
import Chat from "@/components/chat";
import ThemeToggle from "@/components/theme-toggle";
import { Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";
import {
  useCurrentUser,
  setCurrentUser,
  clearCurrentUser,
} from "./store/userStore";
import { Button } from "@/components/ui/button";

function App() {
  const currentUser = useCurrentUser();
  const [expanded, setExpanded] = useState(false);

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <SignIn />
        <Button
          onClick={() =>
            setCurrentUser({ id: "1", name: "Demo User", role: "patient" })
          }
        >
          Demo Login
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="p-2 border-b flex justify-between items-center">
        <p className="text-sm">Logged in as {currentUser.name}</p>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex"
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button size="sm" onClick={clearCurrentUser}>
            Log out
          </Button>
        </div>
      </div>
      <Chat expanded={expanded} />
    </div>
  );
}

export default App;
