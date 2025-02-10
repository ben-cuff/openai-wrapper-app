"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import AvatarContainer from "./avatar-container";
import MenuContainer from "./menu-container";

export default function NavBar() {
	return (
		<header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
			<div className="container flex h-14 items-center">
				<Link
					href="/"
					className="group mr-4 font-bold text-xl ml-2 transition-colors hover:text-primary"
				>
					Not A{" "}
					<span className="text-primary transition-colors group-hover:text-secondary-foreground">
						ChatGPT Clone
					</span>
				</Link>
				<div className="flex items-center">
					<MenuContainer></MenuContainer>
				</div>

				<div className="flex flex-1 justify-end items-center">
					<AvatarContainer></AvatarContainer>
					<div className="mr-2">
						<ThemeToggle />
					</div>
				</div>
			</div>
		</header>
	);
}
