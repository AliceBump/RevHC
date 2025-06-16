import SignIn from "@/components/sign-in";
import Chat from "@/components/chat";
import HomeDashboard, { type Concern } from "@/components/home-dashboard";
import ThemeToggle from "@/components/theme-toggle";
import Avatar from "@/components/avatar";
import Sidebar from "@/components/sidebar";
import { Home, Maximize2, Minimize2, Menu } from "lucide-react";
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedConcern, setSelectedConcern] = useState<Concern | null>(null);

  const handleSelectConcern = (c: Concern) => {
    setMobileSidebarOpen(false);
    setSelectedConcern(c);
  };

  if (!currentUser) {
      return (
        <div className="flex flex-col items-center justify-center min-h-dvh gap-4">
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
      <div className="h-dvh flex">
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
          onHome={() => setSelectedConcern(null)}
        />
        <div className="flex-1 flex flex-col">
      <div className="p-2 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Avatar name={currentUser.name} />
          {selectedConcern && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedConcern(null)}
            >
              <Home className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {selectedConcern && (
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
          )}
          <Button size="sm" onClick={clearCurrentUser}>
            Log out
          </Button>
        </div>
      </div>
      {selectedConcern ? (
        <Chat expanded={expanded} />
      ) : (
        <HomeDashboard onSelectConcern={handleSelectConcern} />
      )}
    </div>
    </div>
  );
}

export default App;
