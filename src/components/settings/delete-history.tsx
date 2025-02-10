import { useState } from "react";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";

export default function DeleteHistory({ id }: { id: number }) {
	const [isLoading, setIsLoading] = useState(false);

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
			const response = await fetch(`/api/account/${id}/message`, {
				method: "DELETE",
			});
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

	return (
		<CardContent>
			<form onSubmit={handleSubmitDeleteHistory} className="space-y-4">
				<Button
					type="submit"
					variant="destructive"
					disabled={isLoading}
				>
					{isLoading ? "Deleting..." : "Delete All Message History"}
				</Button>
			</form>
		</CardContent>
	);
}
