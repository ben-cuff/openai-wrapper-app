import { prismaLib } from "@/lib/prisma";

export async function GET(req: Request) {
	try {
		const url = new URL(req.url);
		const segments = url.pathname.split("/");
		const id = Number(segments.pop());

		if (!id) {
			return new Response(
				JSON.stringify({ message: "User id is missing" }),
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
			return new Response(
				JSON.stringify({ message: "User does not exist" }),
				{
					status: 404,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		const { openai_api_key, ...userWithoutApiKey } = user;

		return new Response(JSON.stringify(userWithoutApiKey), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
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
