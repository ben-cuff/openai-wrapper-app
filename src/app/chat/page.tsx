"use client";

import AIModelDropdown from "@/components/chat/ai-model-dropdown";
import ChatMessages from "@/components/chat/chat-area";
import ChatSidebar from "@/components/chat/chat-sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { aiModels } from "@/models/ai-models";
import { AIModel } from "@/types/AIModel";
import { Conversation } from "@/types/conversation";
import { Message } from "@/types/message";
import { Loader2 } from "lucide-react";
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
	const [AIModel, setAIModel] = useState<AIModel>(
		aiModels[aiModels.length - 1]
	);
	const { data: session } = useSession();
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [updateMessage, setUpdateMessage] = useState(false);
	const [textareaHeight, setTextareaHeight] = useState(40);

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
					model: AIModel.id,
					openai_api_key: session?.user?.openai_api_key,
					url: AIModel.url,
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
		<main className="container h-[calc(100vh-3.5rem)] flex flex-row gap-4 p-4 md:p-6">
			<ChatSidebar
				conversations={conversations}
				conversationId={conversationId}
				setConversationId={setConversationId}
				setMessages={setMessages}
				session={session!}
				setUpdateMessage={setUpdateMessage}
				updateMessage={updateMessage}
			/>
			<div className="flex-1 flex flex-col h-full">
				<div className="flex-1">
					<ChatMessages
						messages={messages}
						scrollAreaRef={scrollAreaRef}
						textareaHeight={textareaHeight}
					/>
				</div>
				<form onSubmit={handleSubmit} className="flex gap-2 mt-2">
					<Textarea
						placeholder="Type your message here..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
						className="flex-1"
						disabled={isLoading}
						onHeightChange={(height) => setTextareaHeight(height)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								if (input.trim() && !isLoading) {
									handleSubmit(e);
								}
							}
						}}
					/>
					<AIModelDropdown
						AIModel={AIModel.label}
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
				</form>
			</div>
		</main>
	);
}
