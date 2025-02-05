import { Check } from "lucide-react";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function AIModelDropdown({
	AIModel,
	setAIModel,
}: {
	AIModel: string;
	setAIModel: React.Dispatch<React.SetStateAction<string>>;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className="w-[150px] flex justify-between items-center gap-2"
				>
					{AIModel}
					<svg
						width="15"
						height="15"
						viewBox="0 0 15 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="h-4 w-4 rotate-180"
					>
						<path
							d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61933 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z"
							fill="currentColor"
							fillRule="evenodd"
							clipRule="evenodd"
						></path>
					</svg>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>AI Models</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{[
					{ id: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
					{ id: "gpt-4", label: "GPT-4" },
					{ id: "o1-mini", label: "o1-mini" },
					{ id: "gpt-4o", label: "GPT-4o" },
					{ id: "gpt-4o-mini", label: "GPT-4o-mini" },
				].map((model) => (
					<DropdownMenuItem
						key={model.id}
						onClick={() => setAIModel(model.id)}
						className="flex items-center justify-between"
					>
						{model.label}
						{AIModel === model.id && <Check className="h-4 w-4" />}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
