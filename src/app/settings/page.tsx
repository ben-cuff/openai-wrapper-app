"use client";

import AddOpenAiKey from "@/components/settings/add-openai-api-key";
import ApiKeyStatus from "@/components/settings/api-key-status";
import ChangePassword from "@/components/settings/change-password";
import DeleteAccount from "@/components/settings/delete-account";
import DeleteHistory from "@/components/settings/delete-history";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function SettingsPage() {
	const { data: session } = useSession();
	const [apiKey, setApiKey] = useState("");

	const hasApiKey = Boolean(session?.user?.openai_api_key);

	return (
		<main className="container max-w-2xl py-8">
			<Card>
				<ApiKeyStatus hasApiKey={hasApiKey} />
				<AddOpenAiKey
					id={session?.user.id as number}
					openai_api_key={session?.user.openai_api_key as string}
					apiKey={apiKey as string}
					setApiKey={
						setApiKey as React.Dispatch<
							React.SetStateAction<string>
						>
					}
				/>
				<div className="flex justify-center">
					<DeleteAccount id={session?.user.id as number} />
					<DeleteHistory id={session?.user.id as number} />
				</div>
				<ChangePassword id={session?.user.id as number} />
			</Card>
		</main>
	);
}
