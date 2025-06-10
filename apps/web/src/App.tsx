import SignIn from "@/components/sign-in";
import Chat from "@/components/chat";
import {
  useCurrentUser,
  setCurrentUser,
  clearCurrentUser,
} from "./store/userStore";
import { Button } from "@/components/ui/button";
import "./App.css";

function App() {
  const currentUser = useCurrentUser();

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
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
        <Button size="sm" onClick={clearCurrentUser}>
          Log out
        </Button>
      </div>
      <Chat />
    </div>
  );
}

export default App;
