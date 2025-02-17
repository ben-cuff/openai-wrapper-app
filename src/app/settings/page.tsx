"use client";

import AddDeepSeekKey from "@/components/settings/add-deepseek-api-key";
import AddOpenAiKey from "@/components/settings/add-openai-api-key";
import ApiKeyStatus from "@/components/settings/api-key-status";
import ChangePassword from "@/components/settings/change-password";
import DeleteAccount from "@/components/settings/delete-account";
import DeleteHistory from "@/components/settings/delete-history";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function SettingsPage() {
	const { data: session } = useSession();
	const [openaiApiKey, setOpenaiApiKey] = useState("");
	const [deepseekApiKey, setDeepseekApiKey] = useState("");

	const hasOpenaiApiKey = Boolean(session?.user?.openai_api_key);
	const hasDeepseekApiKey = Boolean(session?.user?.deepseek_api_key);

	return (
		<main className="h-[calc(100vh-3.5rem)] overflow-auto flex mt-auto mb-auto justify-center">
			<div className="max-w-2xl w-full px-4">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							Settings
							<div className="flex flex-col">
								<ApiKeyStatus
									apiName="Openai "
									hasApiKey={hasOpenaiApiKey}
								/>
								<ApiKeyStatus
									apiName="Deepseek "
									hasApiKey={hasDeepseekApiKey}
								/>
							</div>
						</CardTitle>
					</CardHeader>

					<AddOpenAiKey
						id={session?.user.id as number}
						openai_api_key={session?.user.openai_api_key as string}
						apiKey={openaiApiKey as string}
						setApiKey={
							setOpenaiApiKey as React.Dispatch<
								React.SetStateAction<string>
							>
						}
					/>
					<AddDeepSeekKey
						id={session?.user.id as number}
						deepseek_api_key={
							session?.user.deepseek_api_key as string
						}
						apiKey={deepseekApiKey as string}
						setApiKey={
							setDeepseekApiKey as React.Dispatch<
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
			</div>
		</main>
	);
}
