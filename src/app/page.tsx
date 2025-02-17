import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export default function HomePage() {
	return (
		<ScrollArea className="h-full">
			<main className="flex min-h-screen flex-col">
				{/* Hero Section */}
				<section className="flex flex-col items-center justify-center space-y-8 px-4 py-24 text-center">
					<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
						Welcome to{" "}
						<span className="text-primary">
							Not a ChatGPT Clone
						</span>
					</h1>
					<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
						Interact with one of OpenAis LLM models using your own
						API Key
					</p>
					<div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
						<Link href="/register">
							<Button size="lg">Get Started</Button>
						</Link>
						<Link href={"/guide"}>
							<Button variant="outline" size="lg">
								Learn More
							</Button>
						</Link>
					</div>
				</section>

				{/* Features Section */}
				<section className="bg-muted/50 px-4 py-16">
					<div className="mx-auto max-w-6xl">
						<h2 className="mb-12 text-center text-3xl font-bold">
							Key Features
						</h2>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{features.map((feature, index) => (
								<Card key={index}>
									<CardHeader>
										<CardTitle>{feature.title}</CardTitle>
										<CardDescription>
											{feature.description}
										</CardDescription>
									</CardHeader>
								</Card>
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="bg-primary px-4 py-16 text-primary-foreground">
					<div className="mx-auto max-w-6xl text-center">
						<h2 className="mb-4 text-3xl font-bold">
							Ready to Get Started?
						</h2>
						<Link href={"/register"}>
							<Button
								variant="secondary"
								size="lg"
								className="font-semibold"
							>
								Sign Up Now
							</Button>
						</Link>
					</div>
				</section>
			</main>
		</ScrollArea>
	);
}

const features = [
	{
		title: "Lightning Fast",
		description:
			"Built with performance in mind, ensuring your experience is smooth and efficient.",
	},
	{
		title: "Pay Per Use",
		description:
			"Since you are using your own api key, you only pay for what you use.",
	},
	{
		title: "Customizable",
		description:
			"Tailor the platform to your needs by selecting the model you want",
	},
];
