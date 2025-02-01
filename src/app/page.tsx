import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
	return (
		<ScrollArea className="h-full">
			<main className="flex min-h-screen flex-col">
				{/* Hero Section */}
				<section className="flex flex-col items-center justify-center space-y-8 px-4 py-24 text-center">
					<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
						Welcome to{" "}
						<span className="text-primary">Your Amazing Platform</span>
					</h1>
					<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
						Transform your workflow with our powerful tools and intuitive
						interface. Built for developers, designed for everyone.
					</p>
					<div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
						<Button size="lg">Get Started</Button>
						<Button variant="outline" size="lg">
							Learn More
						</Button>
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

				{/* Testimonials Section */}
				<section className="px-4 py-16">
					<div className="mx-auto max-w-6xl">
						<h2 className="mb-12 text-center text-3xl font-bold">
							What Our Users Say
						</h2>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{testimonials.map((testimonial, index) => (
								<Card key={index}>
									<CardContent className="pt-6">
										<div className="flex items-center gap-4">
											<Avatar>
												<AvatarImage
													src={testimonial.avatar}
													alt={testimonial.name}
												/>
												<AvatarFallback>
													{testimonial.name
														.split(" ")
														.map((n) => n[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="font-semibold">
													{testimonial.name}
												</p>
												<p className="text-sm text-muted-foreground">
													{testimonial.title}
												</p>
											</div>
										</div>
										<p className="mt-4 text-muted-foreground">
											"{testimonial.quote}"
										</p>
									</CardContent>
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
						<p className="mb-8 text-lg">
							Join thousands of satisfied users today.
						</p>
						<Button
							variant="secondary"
							size="lg"
							className="font-semibold"
						>
							Sign Up Now
						</Button>
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
		title: "Highly Secure",
		description:
			"Enterprise-grade security features to keep your data safe and protected.",
	},
	{
		title: "Easy Integration",
		description:
			"Seamlessly integrate with your existing tools and workflows.",
	},
	{
		title: "Real-time Updates",
		description: "Stay in sync with instant updates and live collaboration.",
	},
	{
		title: "24/7 Support",
		description:
			"Our dedicated team is always here to help you succeed.",
	},
	{
		title: "Customizable",
		description:
			"Tailor the platform to your needs with powerful customization options.",
	},
];

const testimonials = [
	{
		name: "Sarah Johnson",
		title: "Lead Developer",
		quote: "This platform has completely transformed how our team works. The efficiency gains are remarkable.",
		avatar: "https://i.pravatar.cc/150?u=sarah",
	},
	{
		name: "Michael Chen",
		title: "Product Manager",
		quote: "The intuitive interface and powerful features make this a must-have tool for any serious team.",
		avatar: "https://i.pravatar.cc/150?u=michael",
	},
	{
		name: "Emma Davis",
		title: "CTO",
		quote: "We've seen a 40% increase in productivity since implementing this solution. Highly recommended!",
		avatar: "https://i.pravatar.cc/150?u=emma",
	},
];
