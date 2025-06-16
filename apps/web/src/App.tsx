import SignIn from "@/components/sign-in";
import Chat from "@/components/chat";
import HomeDashboard, { type Concern } from "@/components/home-dashboard";
import ThemeToggle from "@/components/theme-toggle";
import Avatar from "@/components/avatar";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
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
  const [selectedConcern, setSelectedConcern] = useState<Concern | null>(null);

  const handleSelectConcern = (c: Concern) => {
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
      <SidebarProvider>
        <div className="flex min-h-dvh">
          <AppSidebar />
          <SidebarInset>
          <div className="p-2 border-b flex justify-between items-center">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden -ml-1">
                <Menu className="h-4 w-4" />
              </SidebarTrigger>
              <Separator orientation="vertical" className="mr-2 h-4" />
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
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
}

export default App;

