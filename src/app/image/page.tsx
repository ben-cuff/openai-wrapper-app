"use client";

import ImageChatContent from "@/components/image/image-chat-area";
import ImageResolutionDropdown from "@/components/image/image-resolution";
import AIImageModelDropdown from "@/components/image/model-selection";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useRef, useState } from "react";

export interface image {
	url: string;
}

export default function ImagePage() {
	const [prompts, setPrompts] = useState<string[]>([]);
	const [newPrompt, setNewPrompt] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { data: session } = useSession();
	const [images, setImages] = useState<image[]>([]);
	const scrollAreaRef = useRef<HTMLDivElement>(
		null
	) as React.RefObject<HTMLDivElement>;
	const [height, setHeight] = useState(1024);
	const [width, setWidth] = useState(1024);
	const [AIModel, setAIModel] = useState("dall-e-2");

	const handleSubmit = async (promptText: string) => {
		if (!promptText.trim() || isLoading) return;
		scrollToBottom();

		setIsLoading(true);
		setPrompts((currentPrompts) => [...currentPrompts, promptText.trim()]);

		try {
			const response = await fetch("/api/image", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					prompt: promptText.trim(),
					model: AIModel,
					openai_api_key: session?.user?.openai_api_key,
					url: "https://api.openai.com/v1",
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				alert(errorData.error || "Failed to fetch response");
				throw new Error(errorData.error || "Failed to fetch response");
			}

			const result = await response.json();

			setImages((currentImages) => [
				...currentImages,
				{ url: result.data[0].url },
			]);
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setIsLoading(false);
			scrollToBottom();
		}
	};

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

	return (
		<main className="container h-[calc(100vh-3.5rem)] flex flex-col gap-4 p-4 md:p-6">
			<ImageChatContent
				prompts={prompts}
				images={images}
				isLoading={isLoading}
				height={height}
				width={width}
				scrollAreaRef={scrollAreaRef}
			/>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					if (newPrompt.trim()) {
						handleSubmit(newPrompt);
						setNewPrompt("");
					}
				}}
				className="flex gap-2"
			>
				<Textarea
					placeholder="Type your message here..."
					value={newPrompt}
					onChange={(e) => setNewPrompt(e.target.value)}
					className="flex-1"
					disabled={isLoading}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							if (newPrompt.trim() && !isLoading) {
								handleSubmit(newPrompt);
								setNewPrompt("");
							}
						}
					}}
				/>
				<AIImageModelDropdown
					AIModel={AIModel}
					setAIModel={setAIModel}
					setHeight={setHeight}
					setWidth={setWidth}
				/>
				<ImageResolutionDropdown
					height={height}
					width={width}
					setHeight={setHeight}
					setWidth={setWidth}
					selectedModel={AIModel}
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
