"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import LoadingImage from "./loading";

interface image {
	url: string;
}

export default function ImagePage() {
	const [prompts, setPrompts] = useState<string[]>([]);
	const [newPrompt, setNewPrompt] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { data: session } = useSession();
	const [images, setImages] = useState<image[]>([]);

	const handleSubmit = async () => {
		setIsLoading(true);

		try {
			const response = await fetch("/api/image", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					prompt: prompts.join(" "),
					model: "dall-e-2",
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

			setImages([...images, { url: result.data[0].url }]);
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="p-4">
			<div className="flex flex-col gap-4">
				<div className="border rounded p-4 space-y-4">
					{prompts.map((prompt, index) => (
						<div key={index} className="space-y-2">
							<div className="bg-gray-100 p-2 rounded">
								{prompt}
							</div>
							<div className="flex justify-center">
								{index === prompts.length - 1 && isLoading ? (
									<LoadingImage />
								) : (
									images[index] && (
										<Image
											src={images[index].url}
											alt={`Generated image for: ${prompt}`}
											width={384}
											height={384}
											className="max-w-sm rounded shadow-lg"
										/>
									)
								)}
							</div>
						</div>
					))}
				</div>
				<div className="flex gap-2">
					<input
						type="text"
						value={newPrompt}
						onChange={(e) => setNewPrompt(e.target.value)}
						className="flex-1 border rounded p-2"
						placeholder="Type your prompt here..."
					/>
					<button
						onClick={() => {
							if (newPrompt.trim()) {
								setPrompts([...prompts, newPrompt]);
								setNewPrompt("");
							}
							handleSubmit();
						}}
						className="px-4 py-2 bg-blue-500 text-white rounded"
					>
						Send
					</button>
				</div>
			</div>
		</div>
	);
}
