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
			<body className="min-h-screen bg-background font-sans antialiased">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<SessionProvider>
						<div className="relative flex min-h-screen flex-col">
							<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
								<NavBar />
							</header>
							<main className="flex-1">{children}</main>
						</div>
					</SessionProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
