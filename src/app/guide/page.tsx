import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export default function GuidePage() {
	return (
		<ScrollArea className="h-screen w-full">
			<main className="flex h-full flex-col items-center justify-center px-4 py-24">
				<Card className="w-full max-w-2xl">
					<CardHeader className="space-y-2 text-center">
						<CardTitle className="text-4xl font-bold">
							Guide: How to Get an OpenAI Key
						</CardTitle>
						<CardDescription className="text-lg text-muted-foreground">
							Follow these steps to obtain your OpenAI API key:
						</CardDescription>
					</CardHeader>
					<div className="px-6 py-4">
						<ol className="list-decimal space-y-2 pl-5">
							<li>
								Visit the{" "}
								<Link
									href="https://platform.openai.com/signup"
									target="_blank"
									rel="noopener noreferrer"
									className="font-semibold text-primary underline"
								>
									OpenAI Sign Up page
								</Link>
								.
							</li>
							<li>
								Create an account or log in to your existing
								account.
							</li>
							<li>
								Navigate to the API keys section in your account
								dashboard.
							</li>
							<li>
								Click on the "Create new secret key" button to
								generate a new API key.
							</li>
							<li>
								Copy the API key and store it in a secure
								location.
							</li>
							<li>
								Now that you have your own API key, navigate to
								the{" "}
								<Link
									href="/settings"
									className="font-semibold text-primary underline"
								>
									settings page
								</Link>{" "}
								and paste it in the corresponding box.
							</li>
						</ol>
						<p className="mt-4 text-muted-foreground">
							Remember to keep your API key confidential and do
							not share it publicly.
						</p>
					</div>
				</Card>
			</main>
		</ScrollArea>
	);
}
