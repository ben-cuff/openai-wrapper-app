import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "../ui/navigation-menu";

import Link from "next/link";

export default function MenuContainer() {
	return (
		<NavigationMenu className="max-w-screen-xl mx-auto px-4">
			<NavigationMenuList className="flex space-x-4">
				<NavigationMenuItem>
					<Link href="/chat" className="no-underline">
						<NavigationMenuLink className="px-4 py-2 text-sm font-medium text-gray-200 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
							Chat
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<Link href="/image" className="no-underline">
						<NavigationMenuLink className="px-4 py-2 text-sm font-medium text-gray-200 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
							Images
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
