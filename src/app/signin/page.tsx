"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Custom signin page for next-auth
export default function SignInPage() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// uses credentials from next-auth
		const result = await signIn("credentials", {
			username: username,
			password: password,
			redirect: false,
		});

		if (result?.ok) {
			router.push("/"); // if successful, sends them to the home page
		} else {
			console.error("Login failed.");
			alert(
				"Login failed. Make sure you entered the correct username, email, and password"
			);
		}
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
					</CardContent>
					<CardFooter>
						<Button type="submit" className="w-full">
							Sign In
						</Button>
					</CardFooter>
				</form>
			</Card>
			<Link
				href="/register"
				className="mt-4 inline-block text-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				Register
			</Link>
		</div>
	);
}
