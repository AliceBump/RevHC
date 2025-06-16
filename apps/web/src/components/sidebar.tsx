import { useState } from "react";
import { Home, Stethoscope, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Sidebar({
  mobileOpen,
  setMobileOpen,
  onHome,
}: {
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onHome: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const content = (
    <div
      className={cn(
        "h-dvh md:h-full bg-background border-r flex flex-col transition-all",
        collapsed ? "w-14" : "w-48"
      )}
    >
      <div className="flex items-center justify-between p-2 border-b">
        {!collapsed && <span className="font-semibold">RevHC</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed((c) => !c)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => {
            onHome();
            setMobileOpen(false);
          }}
        >
          <Home className="h-4 w-4" />
          {!collapsed && <span>Dashboard</span>}
        </Button>
        <Button asChild variant="ghost" className="w-full justify-start gap-2">
          <a href="/doctor">
            <Stethoscope className="h-4 w-4" />
            {!collapsed && <span>Doctor</span>}
          </a>
        </Button>
      </nav>
      <div className="p-2 border-t">
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Settings className="h-4 w-4" />
          {!collapsed && <span>Settings</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:flex">{content}</div>
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0">{content}</div>
        </div>
      )}
    </>
  );
}
