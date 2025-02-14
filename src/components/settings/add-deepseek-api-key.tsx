import { reloadSession } from "@/util/reload-session";
import { useState } from "react";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function AddDeepSeekKey({
	id,
	deepseek_api_key,
	apiKey,
	setApiKey,
}: {
	id: number;
	deepseek_api_key: string;
	apiKey: string;
	setApiKey: React.Dispatch<React.SetStateAction<string>>;
}) {
	const [isLoading, setIsLoading] = useState(false);
	const handleSubmitOpenaiKey = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await fetch(`/api/account/${id}/openai-key`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					deepseek_api_key: apiKey,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to update API key");
			}

			setApiKey("");
		} catch (error) {
			console.error("Error updating API key:", error);
			alert("Failed to update API key");
		} finally {
			setIsLoading(false);
			reloadSession();
			setApiKey("");
		}
	};

	return (
		<CardContent>
			<form onSubmit={handleSubmitOpenaiKey} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="apiKey">Deepseek API Key</Label>
					<Input
						id="apiKey"
						type="password"
						value={apiKey}
						onChange={(e) => setApiKey(e.target.value)}
						placeholder={
							deepseek_api_key != null && deepseek_api_key != ""
								? `${String(deepseek_api_key).slice(
										0,
										3
								  )}...${String(deepseek_api_key).slice(-3)}`
								: "sk-..."
						}
						required
					/>
				</div>
				<div className="flex justify-center">
					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			</form>
		</CardContent>
	);
}
