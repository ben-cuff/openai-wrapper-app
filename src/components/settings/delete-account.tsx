import { useState } from "react";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";

export default function DeleteAccount({ id }: { id: number }) {
	const [isLoading, setIsLoading] = useState(false);

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
			const response = await fetch(`/api/account/${id}}`, {
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

	return (
		<CardContent>
			<form onSubmit={handleSubmitDeleteAccount} className="space-y-4">
				<Button
					type="submit"
					variant="destructive"
					disabled={isLoading}
				>
					{isLoading ? "Deleting..." : "Delete Account"}
				</Button>
			</form>
		</CardContent>
	);
}
