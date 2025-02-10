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
						className="px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-200 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400"
					>
						Chat
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink
						href="/image"
						className="px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-200 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400"
					>
						Images
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink
						href="/guide"
						className="px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-200 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400"
					>
						Guide
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
