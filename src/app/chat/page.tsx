"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";

interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
}

export default function ChatPage() {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "initial",
			role: "assistant",
			content: "Hello! How can I help you today?",
		},
	]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const scrollAreaRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = useCallback(() => {
		if (scrollAreaRef.current) {
			scrollAreaRef.current.scrollTop =
				scrollAreaRef.current.scrollHeight;
		}
	}, []);

	// Scroll to bottom when messages change
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
		setMessages(prev => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					messages: [...messages, userMessage].map(({ role, content }) => ({
						role,
						content,
					})),
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to fetch response');
			}

			const data = await response.json();
			
			const assistantMessage: Message = {
				id: crypto.randomUUID(),
				role: "assistant",
				content: data.content,
			};
			
			setMessages(prev => [...prev, assistantMessage]);
		} catch (error) {
			console.error('Error:', error);
			// Handle error - maybe show a toast notification
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main className="container flex h-screen flex-col gap-4 p-4 md:p-6">
			<Card className="flex-1">
				<ScrollArea
					className="h-[calc(100vh-8rem)]"
					ref={scrollAreaRef}
				>
					<CardContent className="p-6">
						<div className="flex flex-col gap-4">
							{messages.map((message) => (
								<div
									key={message.id}
									className={`flex gap-3 ${
										message.role === "assistant"
											? ""
											: "flex-row-reverse"
									}`}
								>
									<Avatar>
										<AvatarImage
											src={
												message.role === "assistant"
													? "/bot-avatar.png"
													: "/user-avatar.png"
											}
										/>
										<AvatarFallback>
											{message.role === "assistant"
												? "AI"
												: "ME"}
										</AvatarFallback>
									</Avatar>
									<div
										className={`rounded-lg px-4 py-2 max-w-[80%] ${
											message.role === "assistant"
												? "bg-muted"
												: "bg-primary text-primary-foreground"
										}`}
									>
										<p className="text-sm">
											{message.content}
										</p>
									</div>
								</div>
							))}
							{isLoading && (
								<div className="flex gap-3">
									<Avatar>
										<AvatarImage src="/bot-avatar.png" />
										<AvatarFallback>AI</AvatarFallback>
									</Avatar>
									<div className="rounded-lg px-4 py-2 bg-muted">
										<Loader2 className="h-4 w-4 animate-spin" />
									</div>
								</div>
							)}
						</div>
					</CardContent>
				</ScrollArea>
			</Card>
			<form onSubmit={handleSubmit} className="flex gap-2">
				<Input
					placeholder="Type your message here..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
					className="flex-1"
					disabled={isLoading}
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
		</main>
	);
}

