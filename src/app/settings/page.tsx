"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

export default function SettingsPage() {
	const { data: session } = useSession();
	const [apiKey, setApiKey] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const hasApiKey = Boolean(session?.user?.openai_api_key);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await fetch(
				`/api/account/${session?.user?.id}/openai-key`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						openai_api_key: apiKey,
					}),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to update API key");
			}

			// Sign out to force a complete session refresh
			await signOut({ redirect: false });
			
			// Reload the page which will trigger a new sign-in
			window.location.href = '/signin';

		} catch (error) {
			console.error("Error updating API key:", error);
			alert("Failed to update API key");
			setIsLoading(false);
		}
	};

	return (
		<main className="container max-w-2xl py-8">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						Settings
						<div className="flex items-center gap-2 text-sm font-normal">
							API Key Status:
							{hasApiKey ? (
								<span className="flex items-center text-green-500">
									<Check className="h-4 w-4 mr-1" />
									Connected
								</span>
							) : (
								<span className="flex items-center text-red-500">
									<X className="h-4 w-4 mr-1" />
									Not Connected
								</span>
							)}
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="apiKey">OpenAI API Key</Label>
							<Input
								id="apiKey"
								type="password"
								value={apiKey}
								onChange={(e) => setApiKey(e.target.value)}
								placeholder="sk-..."
								required
							/>
						</div>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Saving..." : "Save Changes"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</main>
	);
}
