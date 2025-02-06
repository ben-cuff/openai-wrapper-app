"use client";

import AIModelDropdown from "@/components/chat/ai-model-dropdown";
import ChatMessages from "@/components/chat/chat-area";
import ConversationItem from "@/components/chat/conversation-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarSeparator,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";
import { Conversation } from "@/types/conversation";
import { Message } from "@/types/message";
import { Loader2 } from "lucide-react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ChatPage() {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "initial",
			role: "assistant",
			content: "Hello! How can I help you today?",
		},
	]);
	const [conversationId, setConversationId] = useState<string>(
		crypto.randomUUID()
	);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const [AIModel, setAIModel] = useState("gpt-4o-mini");
	const { data: session } = useSession();
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [updateMessage, setUpdateMessage] = useState(false);
	const sidebar = useSidebar();

	useEffect(() => {
		const fetchConversations = async () => {
			if (session?.user?.id) {
				const response = await fetch(
					`/api/account/${session.user.id}/message`
				);
				if (response.ok) {
					const data = await response.json();
					setConversations(data);
				}
			}
		};

		fetchConversations();
	}, [session?.user?.id, isLoading, updateMessage]);

	const scrollToBottom = useCallback(() => {
		if (scrollAreaRef.current) {
			const scrollContainer = scrollAreaRef.current.querySelector(
				"[data-radix-scroll-area-viewport]"
			);
			if (scrollContainer) {
				scrollContainer.scrollTop = scrollContainer.scrollHeight;
			}
		}
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages, scrollToBottom]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!input.trim() || isLoading) return;

		const userMessage: Message = {
			id: crypto.randomUUID(),
			role: "user",
			content: input.trim(),
		};
		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		// Create a temporary message for streaming
		const tempMessageId = crypto.randomUUID();
		setMessages((prev) => [
			...prev,
			{
				id: tempMessageId,
				role: "assistant",
				content: "",
			},
		]);

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					messages: [...messages, userMessage].map(
						({ role, content }) => ({
							role,
							content,
						})
					),
					model: AIModel,
					openai_api_key: session?.user?.openai_api_key,
					url: "https://api.openai.com/v1",
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				alert(errorData.error || "Failed to fetch response");
				throw new Error(
					errorData.message || "Failed to fetch response"
				);
			}

			if (!response.body) {
				throw new Error("No response body");
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let content = "";

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value);
				content += chunk;

				// Update the temporary message with the accumulated content
				setMessages((prev) =>
					prev.map((message) =>
						message.id === tempMessageId
							? { ...message, content }
							: message
					)
				);
			}

			const completeMessages = {
				conversationId: conversationId,
				userId: session?.user.id,
				messages: [
					...messages,
					userMessage,
					{
						id: tempMessageId,
						role: "assistant",
						content: content,
					},
				],
			};

			if (completeMessages.messages.length > 1) {
				await fetch(`/api/account/${session?.user.id}/message`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						conversationId: conversationId,
						messages: completeMessages,
					}),
				});
			}
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main className="container flex h-auto flex-row gap-4 p-4 md:p-6 overflow-hidden">
			<div className="h-auto overflow-y-auto">
				<Sidebar>
					<SidebarHeader className="w-full mt-14 text-xl">
						<span className="w-full flex">
							Conversations
							<SidebarTrigger className="ml-auto" />
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
										session={
											session && session.user?.id
												? session
												: ({} as Session)
										}
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
			<div className="flex-1 h-auto">
				<ChatMessages
					messages={messages}
					scrollAreaRef={scrollAreaRef}
				/>
				<form onSubmit={handleSubmit} className="flex gap-2">
					<Input
						placeholder="Type your message here..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
						className="flex-1"
						disabled={isLoading}
					/>
					<AIModelDropdown
						AIModel={AIModel}
						setAIModel={setAIModel}
					/>
					<Button type="submit" disabled={isLoading}>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Sending
							</>
						) : (
							"Send"
						)}
					</Button>
					{messages.length > 1 && (
						<Button
							variant="secondary"
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
					)}
				</form>
			</div>
		</main>
	);
}
