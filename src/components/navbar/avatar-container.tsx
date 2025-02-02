"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AvatarContainer() {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return (
			<Avatar className="mr-2">
				<AvatarFallback>...</AvatarFallback>
			</Avatar>
		);
	}

	if (!session) {
		return (
			<button onClick={() => signIn()}>
				<Avatar className="mr-2">
					<AvatarFallback>?</AvatarFallback>
				</Avatar>
			</button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button>
					<Avatar className="mr-2">
						<AvatarImage
							src={session.user?.image ?? "https://github.com/shadcn.png"}
						/>
						<AvatarFallback>
							{session.user?.name?.[0]?.toUpperCase() ?? "U"}
						</AvatarFallback>
					</Avatar>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuItem asChild>
					<a href="/settings">Settings</a>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => signOut()}>
					Sign Out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
