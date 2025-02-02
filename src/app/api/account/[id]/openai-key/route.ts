import { prismaLib } from "@/lib/prisma";

export async function PATCH(req: Request) {
	try {
		const url = new URL(req.url);
		const segments = url.pathname.split("/");
		const id = Number(segments[segments.length - 2]);

		if (!id) {
			return new Response(
				JSON.stringify({ message: "User id is missing" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		const { openai_api_key } = await req.json();

		if (!openai_api_key) {
			return new Response(
				JSON.stringify({ message: "Open API key is missing" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		const user = await prismaLib.account.findFirst({
			where: { id },
		});

		if (!user) {
			return new Response(JSON.stringify({ message: "User not found" }), {
				status: 404,
				headers: { "Content-Type": "application/json" },
			});
		}

		await prismaLib.account.update({
			where: { id },
			data: { openai_api_key },
		});

		return new Response(
			JSON.stringify({ message: "Open API key updated successfully" }),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		);
	} catch (error) {
		console.error("Error retrieving user:", error);
		return new Response(
			JSON.stringify({ message: "Internal Server Error" }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}
