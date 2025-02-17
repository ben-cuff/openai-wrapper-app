import { prismaLib } from "@/lib/prisma";

export async function GET(req: Request) {
	const url = new URL(req.url);
	const segments = url.pathname.split("/");
	const id = Number(segments[segments.length - 2]);

	if (!id) {
		return new Response(
			JSON.stringify({ message: "User ID is missing from path" }),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			}
		);
	}

	const apiKey = req.headers.get("x-api-key");

	if (!apiKey) {
		return new Response(
			JSON.stringify({ message: "API key missing from request headers" }),
			{
				status: 401,
				headers: { "Content-Type": "application/json" },
			}
		);
	}

	if (apiKey != process.env.X_API_KEY) {
		return new Response(
			JSON.stringify({ message: "API key is incorrect" }),
			{
				status: 401,
				headers: { "Content-Type": "application/json" },
			}
		);
	}

	const user = await prismaLib.account.findFirst({
		where: { id },
	});

	if (!user) {
		return new Response(JSON.stringify({ message: "Account not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	return new Response(
		JSON.stringify({ deepseek_api_key: user.deepseek_api_key }),
		{
			status: 200,
			headers: { "Content-Type": "application/json" },
		}
	);
}

export async function PATCH(req: Request) {
	try {
		const url = new URL(req.url);
		const segments = url.pathname.split("/");
		const id = Number(segments[segments.length - 2]);

		if (!id) {
			return new Response(
				JSON.stringify({ message: "User ID is missing from path" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		const { deepseek_api_key } = await req.json();

		if (!deepseek_api_key) {
			return new Response(
				JSON.stringify({
					message: "Deepseek api key is missing from body",
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		const updatedUser = await prismaLib.account.update({
			where: { id },
			data: { deepseek_api_key },
		});

		if (!updatedUser) {
			return new Response(JSON.stringify({ message: "User not found" }), {
				status: 404,
				headers: { "Content-Type": "application/json" },
			});
		}

		return new Response(
			JSON.stringify({
				message: "Deepseek API Key successfully added to account",
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		);
	} catch (error) {
		console.error("Error retrieving user, ", error);
		return new Response(
			JSON.stringify({ message: "Internal server error" }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}
