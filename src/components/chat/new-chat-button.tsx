import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function NewChatButton({
  onNewChat
}: {
  onNewChat: () => void;
}) {
  return (
    <Button 
      onClick={onNewChat}
      className="w-full flex items-center gap-2"
      variant="outline"
    >
      <PlusCircle className="h-4 w-4" />
      New Chat
    </Button>
  );
} 