import { Conversation } from "@/types/conversation";
import { Message } from "@/types/message";
import { deleteConversation } from "@/util/delete-conversation";
import { Session } from "next-auth";
import { Button } from "../ui/button";
import { SidebarMenuButton } from "../ui/sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";

export default function ConversationItem({
	conversation,
	conversationId,
	setConversationId,
	setMessages,
	session,
	setUpdateMessage,
	updateMessage,
}: {
	conversation: Conversation;
	conversationId: string;
	setConversationId: React.Dispatch<React.SetStateAction<string>>;
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
	session: Session;
	setUpdateMessage: React.Dispatch<React.SetStateAction<boolean>>;
	updateMessage: boolean;
}) {
	return (
		<TooltipProvider>
			<SidebarMenuButton
				asChild
				className={`group justify-between transition-colors border-gray-400 border ${
					conversation.id === conversationId
						? "bg-gray-100 dark:bg-gray-700"
						: "hover:bg-gray-50 dark:hover:bg-gray-800"
				}`}
			>
				<div
					onClick={() => {
						setConversationId(conversation.id);
						setMessages(conversation.messages.messages);
					}}
					className="cursor-pointer w-full min-h-10"
				>
					<div className="flex items-center justify-between w-full">
						<div className="flex-1 min-w-0 pr-2">
							<p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
								{conversation.messages.messages[
									conversation.messages.messages.length - 1
								].content
									.split(" ")
									.slice(0, 6)
									.join(" ")}
								...
							</p>
							<div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400">
								<span>
									{conversation.messages.messages.length} msgs
								</span>
								<Tooltip>
									<TooltipTrigger asChild>
										<span>
											{formatDate(conversation.updatedAt)}
										</span>
									</TooltipTrigger>
									<TooltipContent>
										<span>
											{new Date(
												conversation.updatedAt
											).toLocaleString()}
										</span>
									</TooltipContent>
								</Tooltip>
							</div>
						</div>
						<Button
							variant="ghost"
							size="sm"
							className="px-1.5 text-red-600 dark:text-red-400 cursor-pointer shrink-0 mb-[2px] hover:bg-transparent"
							onClick={async (e) => {
								e.stopPropagation();
								await deleteConversation(
									session?.user.id || 0,
									conversation.id
								);
								setMessages([
									{
										id: "initial",
										role: "assistant",
										content:
											"Hello! How can I help you today?",
									},
								]);
								setConversationId(crypto.randomUUID());
								setUpdateMessage(!updateMessage);
							}}
						>
							×
						</Button>
					</div>
				</div>
			</SidebarMenuButton>
		</TooltipProvider>
	);
}

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	const now = new Date();

	const isToday =
		date.getDate() === now.getDate() &&
		date.getMonth() === now.getMonth() &&
		date.getFullYear() === now.getFullYear();

	return isToday
		? date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
		  })
		: date.toLocaleDateString();
};
