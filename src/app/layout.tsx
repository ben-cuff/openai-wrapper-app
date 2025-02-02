import { ThemeProvider } from "@/components/theme-provider";
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
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<div className="relative flex min-h-screen flex-col">
						<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
							<div className="container flex h-14 items-center justify-end">
								<Avatar className="mr-2">
									<AvatarImage src="https://github.com/shadcn.png" />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
								<div className="mr-2">
									<ThemeToggle />
								</div>
							</div>
						</header>
						<main className="flex-1">{children}</main>
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
