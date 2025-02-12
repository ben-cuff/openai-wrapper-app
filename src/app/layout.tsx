import ClientProviders from "@/components/client-providers";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="min-h-screen bg-background font-sans antialiased overflow-hidden">
				<SpeedInsights />
				<Analytics />
				<ClientProviders>
					<main className="h-[calc(100vh-3.5rem)] mt-14">
						{children}
					</main>
				</ClientProviders>
			</body>
		</html>
	);
}
