import LoadingImage from "@/app/image/loading";
import { image } from "@/app/image/page";
import Image from "next/image";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

export default function ImageChatContent({
	prompts,
	images,
	isLoading,
	height,
	width,
	scrollAreaRef,
}: {
	prompts: string[];
	images: image[];
	isLoading: boolean;
	height: number;
	width: number;
	scrollAreaRef: React.RefObject<HTMLDivElement>;
}) {
	return (
		<Card className="flex-1 flex flex-col overflow-hidden">
			<ScrollArea className="flex-1" ref={scrollAreaRef}>
				<CardContent className="p-6">
					<div className="flex flex-col gap-4">
						{prompts.map((prompt, index) => (
							<div key={index} className="flex flex-col gap-4">
								<div className="flex gap-4">
									<Avatar>
										<AvatarFallback>ME</AvatarFallback>
									</Avatar>
									<div
										className={
											"rounded-lg px-4 py-2 max-w-[80%] bg-primary text-primary-foreground"
										}
									>
										{prompt}
									</div>
								</div>
								<div className="flex justify-center">
									<div
										className={`rounded-lg px-4 py-2 max-w-[80%]`}
									>
										{index === prompts.length - 1 &&
										isLoading ? (
											<LoadingImage
												height={height}
												width={width}
											/>
										) : (
											images[index] && (
												<Image
													src={images[index].url}
													alt={`Generated image for: ${prompt}`}
													width={height}
													height={width}
												/>
											)
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</ScrollArea>
		</Card>
	);
}
