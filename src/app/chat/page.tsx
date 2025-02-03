"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Copy, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

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
	const [copiedCode, setCopiedCode] = useState<string | null>(null);
	const [AIModel, setAIModel] = useState("gpt-4o");
	const { data: session } = useSession();

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
		} catch (error) {
			console.error("Error:", error);
			// Handle error - maybe show a toast notification
		} finally {
			setIsLoading(false);
		}
	};

	const handleCopyCode = (code: string) => {
		navigator.clipboard.writeText(code);
		setCopiedCode(code);
		setTimeout(() => setCopiedCode(null), 2000);
	};

	const MarkdownComponents = {
		p({ children }) {
			return <span className="mb-2 last:mb-0 block">{children}</span>;
		},
		code({ node, inline, className, children, ...props }) {
			const match = /language-(\w+)/.exec(className || "");
			const code = String(children).replace(/\n$/, "");
			const lang = match ? match[1] : "";

			if (inline) {
				return (
					<code
						className="bg-black/10 dark:bg-white/10 rounded-md px-1 text-[16px]"
						{...props}
					>
						{children}
					</code>
				);
			}

			return (
				<div className="relative group my-4">
					{lang && (
						<div className="absolute top-0 right-0 bg-black/10 dark:bg-white/10 rounded-tr-md rounded-bl-md px-2 py-1 text-xs font-mono">
							{lang}
						</div>
					)}
					<button
						onClick={() => handleCopyCode(code)}
						className="absolute right-2 top-10 opacity-0 group-hover:opacity-100 transition-opacity"
					>
						{copiedCode === code ? (
							<Check className="h-4 w-4" />
						) : (
							<Copy className="h-4 w-4" />
						)}
					</button>
					<div className="rounded-md overflow-hidden">
						<SyntaxHighlighter
							language={lang || "text"}
							style={oneDark}
							customStyle={{
								margin: 0,
								fontSize: "16px",
								padding: "1rem",
								paddingTop: "2rem",
								background: "#1a1b26",
							}}
							showLineNumbers={true}
							wrapLines={true}
						>
							{code}
						</SyntaxHighlighter>
					</div>
				</div>
			);
		},
		ul({ children }) {
			return <ul className="list-disc list-inside my-2">{children}</ul>;
		},
		ol({ children }) {
			return (
				<ol className="list-decimal list-inside my-2">{children}</ol>
			);
		},
		a({ href, children }) {
			return (
				<a
					href={href}
					className="text-blue-500 hover:underline"
					target="_blank"
					rel="noopener noreferrer"
				>
					{children}
				</a>
			);
		},
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
												? "bg-muted prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 max-w-none"
												: "bg-primary text-primary-foreground"
										}`}
									>
										{message.role === "assistant" ? (
											<ReactMarkdown
												remarkPlugins={[remarkGfm]}
												components={MarkdownComponents}
											>
												{message.content}
											</ReactMarkdown>
										) : (
											<p className="text-sm whitespace-pre-wrap">
												{message.content}
											</p>
										)}
									</div>
								</div>
							))}
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
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="w-[150px] flex justify-between items-center gap-2"
						>
							{AIModel}
							<svg
								width="15"
								height="15"
								viewBox="0 0 15 15"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 rotate-180"
							>
								<path
									d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61933 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z"
									fill="currentColor"
									fillRule="evenodd"
									clipRule="evenodd"
								></path>
							</svg>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>AI Models</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => setAIModel("gpt-3.5-turbo")}
							className="flex items-center justify-between"
						>
							GPT-3.5 Turbo
							{AIModel === "gpt-3.5-turbo" && (
								<Check className="h-4 w-4" />
							)}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => setAIModel("gpt-4")}
							className="flex items-center justify-between"
						>
							GPT-4
							{AIModel === "gpt-4" && (
								<Check className="h-4 w-4" />
							)}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => setAIModel("o1-mini")}
							className="flex items-center justify-between"
						>
							o1-mini
							{AIModel === "o1-mini" && (
								<Check className="h-4 w-4" />
							)}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => setAIModel("gpt-4o")}
							className="flex items-center justify-between"
						>
							GPT-4o
							{AIModel === "gpt-4o" && (
								<Check className="h-4 w-4" />
							)}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
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
