"use client";

import NavBar from "@/components/navbar/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="min-h-screen bg-background font-sans antialiased overflow-hidden">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<SessionProvider>
						<NavBar />
						<main className="h-[calc(100vh-3.5rem)] mt-14">
							{children}
						</main>
					</SessionProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
