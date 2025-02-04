"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Custom signin page for next-auth
export default function SignInPage() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// form validation for length of password
		if (password.length < 8) {
			alert("Password must be at least 8 characters long");
			return;
		}

		// password and passwordCopy must be the same
		if (password !== password2) {
			alert("Make sure the passwords are the same");
			return;
		}

		// attempts to register the user with the api
		const response = await fetch(`/api/auth/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: username,
				password: password,
			}),
		});

		// if the registration fails, alert the user to the error
		if (!response.ok) {
			const errorData = await response.json();
			alert(`Error: ${errorData.detail}`);
			return;
		}

		// if all passes, send the user to the sign in page
		router.push("/signin");
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<Card className="w-full max-w-sm">
				<form onSubmit={handleSubmit}>
					<CardContent>
						<div className="mb-4">
							<Label htmlFor="username">Username:</Label>
							<Input
								type="text"
								id="username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
						</div>
						<div className="mb-6">
							<Label htmlFor="password">Password:</Label>
							<Input
								type="password"
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<div className="mb-6">
							<Label htmlFor="password">Confirm Password:</Label>
							<Input
								type="password"
								id="password"
								value={password2}
								onChange={(e) => setPassword2(e.target.value)}
								required
							/>
						</div>
					</CardContent>
					<CardFooter>
						<Button type="submit" className="w-full">
							Sign In
						</Button>
					</CardFooter>
				</form>
			</Card>
			<Link
				href="/signin"
				className="mt-4 inline-block text-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				Sign In
			</Link>
		</div>
	);
}
