import { cn } from "@/lib/utils";
import * as React from "react";
import TextareaAutosize from "react-textarea-autosize";

const Textarea = React.forwardRef<
	HTMLTextAreaElement,
	React.ComponentPropsWithoutRef<typeof TextareaAutosize> & {
		onHeightChange?: (height: number) => void;
	}
>(({ className, onHeightChange, ...props }, ref) => {
	return (
		<TextareaAutosize
			className={cn(
				"flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
				className
			)}
			ref={ref}
			minRows={1}
			maxRows={3}
			onHeightChange={(height) => onHeightChange?.(height)}
			{...props}
		/>
	);
});
Textarea.displayName = "Textarea";

export { Textarea };
