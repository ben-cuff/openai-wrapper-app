import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import AvatarContainer from "./avatar-container";
import MenuContainer from "./menu-container";

export default function NavBar() {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
			<div className="container flex h-14 items-center">
				<Link
					href="/"
					className="mr-4 font-bold text-xl ml-2 hover:text-primary transition-colors"
				>
					Not A ChatGPT Clone
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
