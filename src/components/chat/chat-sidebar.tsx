import { Conversation } from "@/types/conversation";
import { Message } from "@/types/message";
import { Session } from "next-auth";
import { Button } from "../ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarSeparator,
	SidebarTrigger,
	useSidebar,
} from "../ui/sidebar";
import ConversationItem from "./conversation-item";

export default function ChatSidebar({
	conversations,
	conversationId,
	setConversationId,
	setMessages,
	session,
	setUpdateMessage,
	updateMessage,
}: {
	conversations: Conversation[];
	conversationId: string;
	setConversationId: React.Dispatch<React.SetStateAction<string>>;
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
	session: Session;
	setUpdateMessage: React.Dispatch<React.SetStateAction<boolean>>;
	updateMessage: boolean;
}) {
	const sidebar = useSidebar();

	return (
		<>
			<div className="overflow-hidden">
				<Sidebar>
					<SidebarHeader className="w-full text-xl mt-14">
						<span className="w-full flex flex-col gap-2">
							<div className="flex">
								Conversations
								<SidebarTrigger className="ml-auto" />
							</div>
							<Button
								variant="outline"
								className="w-full"
								onClick={() => {
									setMessages([
										{
											id: "initial",
											role: "assistant",
											content:
												"Hello! How can I help you today?",
										},
									]);
									setConversationId(crypto.randomUUID());
								}}
							>
								New Chat
							</Button>
						</span>
					</SidebarHeader>
					<SidebarSeparator className="mb-2" />
					<SidebarContent className="w-full">
						<div className="flex flex-col gap-2 w-full">
							{conversations
								.sort(
									(a, b) =>
										new Date(b.updatedAt).getTime() -
										new Date(a.updatedAt).getTime()
								)
								.map((conversation) => (
									<ConversationItem
										key={conversation.id}
										conversation={conversation}
										conversationId={conversationId}
										setConversationId={setConversationId}
										setMessages={setMessages}
										session={session}
										setUpdateMessage={setUpdateMessage}
										updateMessage={updateMessage}
									/>
								))}
						</div>
					</SidebarContent>
				</Sidebar>
			</div>
			<div className="flex-shrink-0">
				{!sidebar.open && <SidebarTrigger />}
			</div>
		</>
	);
}
