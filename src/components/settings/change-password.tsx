import { useState } from "react";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function ChangePassword({ id }: { id: number }) {
	const [old_password, setOldPassword] = useState("");
	const [new_password, setNewPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmitChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			if (new_password.length < 8) {
				alert("New password must be at least 8 characters long");
				return;
			}

			const response = await fetch(`/api/account/${id}/password`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ old_password, new_password }),
			});
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
		<CardContent>
			<form onSubmit={handleSubmitChangePassword} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="old_password">Old Password</Label>
					<Input
						id="old_password"
						type="password"
						value={old_password}
						onChange={(e) => setOldPassword(e.target.value)}
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="new_password">New Password</Label>
					<Input
						id="new_password"
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
	);
}
