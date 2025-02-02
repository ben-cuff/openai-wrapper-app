import { ThemeToggle } from "@/components/theme-toggle";
import AvatarContainer from "./avatar-container";

export default function NavBar() {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
			<div className="container flex h-14 items-center justify-end">
				<AvatarContainer></AvatarContainer>
				<div className="mr-2">
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
