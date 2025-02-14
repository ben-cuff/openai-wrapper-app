import { Check, X } from "lucide-react";
import { CardHeader, CardTitle } from "../ui/card";

export default function ApiKeyStatus({
	hasApiKey,
	apiName,
}: {
	hasApiKey: boolean;
	apiName: string;
}) {
	return (
		<CardHeader>
			<CardTitle className="flex items-center justify-between">
				Settings
				<div className="flex items-center gap-2 text-sm font-normal">
					{apiName} API Key Status:
					{hasApiKey ? (
						<span className="flex items-center text-green-500">
							<Check className="h-4 w-4 mr-1" />
							Connected
						</span>
					) : (
						<span className="flex items-center text-red-500">
							<X className="h-4 w-4 mr-1" />
							Not Connected
						</span>
					)}
				</div>
			</CardTitle>
		</CardHeader>
	);
}
