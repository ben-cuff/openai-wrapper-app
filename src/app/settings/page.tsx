"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { reloadSession } from "@/util/reload-session";
import { Check, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function SettingsPage() {
	const { data: session } = useSession();
	const [apiKey, setApiKey] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const hasApiKey = Boolean(session?.user?.openai_api_key);

	const handleSubmitOpenaiKey = async (e: React.FormEvent) => {
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

	const handleSubmitDeleteHistory = async (e: React.FormEvent) => {
		e.preventDefault();
		if (
			!confirm(
				"Are you sure you want to delete all message history? This action is irreversible."
			)
		) {
			return;
		}
		setIsLoading(true);
		try {
			const response = await fetch(
				`/api/account/${session?.user?.id}/message`,
				{
					method: "DELETE",
				}
			);
			if (!response.ok) {
				throw new Error("Failed to delete message history.");
			}
		} catch (error) {
			console.error("Error deleting message history:", error);
			alert("Failed to delete message history");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmitDeleteAccount = async (e: React.FormEvent) => {
		e.preventDefault();
		if (
			!confirm(
				"Are you sure you want to delete your account? This action is irreversible"
			)
		) {
			return;
		}
		setIsLoading(true);
		try {
			const response = await fetch(`/api/account/${session?.user?.id}`, {
				method: "DELETE",
			});
			if (!response.ok) {
				throw new Error("Failed to delete account.");
			}
		} catch (error) {
			console.error("Error deleting account", error);
			alert("Failed to delete account");
		} finally {
			setIsLoading(false);
			window.location.href = "/";
		}
	};

	{
		/* Place this new code inside your component, above the return statement */
	}
	const [old_password, setOldPassword] = useState("");
	const [new_password, setNewPassword] = useState("");

	const handleSubmitChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			if (new_password.length < 8) {
				alert("New password must be at least 8 characters long");
				return;
			}

			const response = await fetch(
				`/api/account/${session?.user?.id}/password`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ old_password, new_password }),
				}
			);
			if (!response.ok) {
				throw new Error("Failed to change password");
			}
			alert("Password changed successfully!");
			setOldPassword("");
			setNewPassword("");
		} catch (error) {
			console.error("Error changing password:", error);
			alert("Failed to change password");
		} finally {
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
					<form
						onSubmit={handleSubmitOpenaiKey}
						className="space-y-4"
					>
						<div className="space-y-2">
							<Label htmlFor="apiKey">OpenAI API Key</Label>
							<Input
								id="apiKey"
								type="password"
								value={apiKey}
								onChange={(e) => setApiKey(e.target.value)}
								placeholder={
									session?.user?.openai_api_key != null &&
									session?.user?.openai_api_key != ""
										? `${String(
												session?.user?.openai_api_key
										  ).slice(0, 3)}...${String(
												session?.user?.openai_api_key
										  ).slice(-3)}`
										: "sk-..."
								}
								required
							/>
						</div>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Saving..." : "Save Changes"}
						</Button>
					</form>
				</CardContent>
				<CardContent>
					<form
						onSubmit={handleSubmitDeleteHistory}
						className="space-y-4"
					>
						<Button
							type="submit"
							variant="destructive"
							disabled={isLoading}
						>
							{isLoading
								? "Deleting..."
								: "Delete All Message History"}
						</Button>
					</form>
				</CardContent>
				<CardContent>
					<form
						onSubmit={handleSubmitDeleteAccount}
						className="space-y-4"
					>
						<Button
							type="submit"
							variant="destructive"
							disabled={isLoading}
						>
							{isLoading ? "Deleting..." : "Delete Account"}
						</Button>
					</form>
				</CardContent>
				<CardContent>
					<form
						onSubmit={handleSubmitChangePassword}
						className="space-y-4"
					>
						<div className="space-y-2">
							<Label htmlFor="oldPassword">Old Password</Label>
							<Input
								id="oldPassword"
								type="password"
								value={old_password}
								onChange={(e) => setOldPassword(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="newPassword">New Password</Label>
							<Input
								id="newPassword"
								type="password"
								value={new_password}
								onChange={(e) => setNewPassword(e.target.value)}
								required
							/>
						</div>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Updating..." : "Change Password"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</main>
	);
}
