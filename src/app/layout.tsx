import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Your Amazing Platform",
	description: "Transform your workflow with our powerful tools",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="min-h-screen bg-background font-sans antialiased">
				{children}
			</body>
		</html>
	);
}
