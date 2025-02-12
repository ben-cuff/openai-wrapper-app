"use client";

import NavBar from "@/components/navbar/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";

export default function ClientProviders({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<SessionProvider>
				<NavBar />
				{children}
			</SessionProvider>
		</ThemeProvider>
	);
}
