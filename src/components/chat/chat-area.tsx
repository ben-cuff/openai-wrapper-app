import { Message } from "@/types/message";
import { RefObject } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

export default function ChatMessages({
	messages,
	scrollAreaRef,
	textareaHeight,
}: {
	messages: Message[];
	scrollAreaRef: RefObject<HTMLDivElement | null>;
	textareaHeight: number;
}) {
	return (
		<Card className="flex flex-col h-full overflow-hidden">
			<ScrollArea className="flex-1" ref={scrollAreaRef}>
				<CardContent className="p-6">
					<div className="flex flex-col gap-4">
						{messages.map((message) => (
							<div
								key={message.id}
								className={`flex gap-3 ${
									message.role === "assistant"
										? ""
										: "flex-row-reverse"
								}`}
							>
								<Avatar>
									<AvatarFallback>
										{message.role === "assistant"
											? "AI"
											: "ME"}
									</AvatarFallback>
								</Avatar>
								<div
									className={`rounded-lg px-4 py-2 max-w-[80%] ${
										message.role === "assistant"
											? "bg-muted prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 max-w-none"
											: "bg-primary text-primary-foreground"
									}`}
								>
									<p className="text-sm whitespace-pre-wrap">
										{message.content}
									</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</ScrollArea>
		</Card>
	);
}
