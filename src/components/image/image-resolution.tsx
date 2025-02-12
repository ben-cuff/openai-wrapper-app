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

const dimensionOptions = {
	"dall-e-2": [
		{ width: 256, height: 256, label: "256x256" },
		{ width: 512, height: 512, label: "512x512" },
		{ width: 1024, height: 1024, label: "1024x1024" },
	],
	"dall-e-3": [
		{ width: 1024, height: 1024, label: "1024x1024" },
		{ width: 1024, height: 1792, label: "1024x1792" },
		{ width: 1792, height: 1024, label: "1792x1024" },
	],
};

export default function ImageResolutionDropdown({
	width,
	height,
	setWidth,
	setHeight,
	selectedModel,
}: {
	width: number;
	height: number;
	setWidth: React.Dispatch<React.SetStateAction<number>>;
	setHeight: React.Dispatch<React.SetStateAction<number>>;
	selectedModel: string;
}) {
	const availableDimensions =
		dimensionOptions[selectedModel as keyof typeof dimensionOptions] || [];

	const handleDimensionSelect = (width: number, height: number) => {
		setWidth(width);
		setHeight(height);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className="w-[150px] flex justify-between items-center gap-2"
				>
					{`${width}x${height}`}
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
						/>
					</svg>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Dimensions</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{availableDimensions.map((dim) => (
					<DropdownMenuItem
						key={dim.label}
						onClick={() =>
							handleDimensionSelect(dim.width, dim.height)
						}
						className="flex items-center justify-between"
					>
						{dim.label}
						{width === dim.width && height === dim.height && (
							<Check className="h-4 w-4" />
						)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
