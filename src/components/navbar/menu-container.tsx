import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "../ui/navigation-menu";

export default function MenuContainer() {
	return (
		<NavigationMenu className="max-w-screen-xl mx-auto px-4">
			<NavigationMenuList className="flex space-x-4">
				<NavigationMenuItem>
					<NavigationMenuLink
						href="/chat"
						className="px-4 py-2 text-sm font-medium text-gray-200 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
					>
						Chat
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink
						href="/image"
						className="px-4 py-2 text-sm font-medium text-gray-200 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
					>
						Images
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
