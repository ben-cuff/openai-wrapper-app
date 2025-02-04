import { prismaLib } from "@/lib/prisma";

export async function GET(req: Request) {
	try {
		const url = new URL(req.url);
		const segments = url.pathname.split("/");
		const userId = Number(segments[segments.length - 3]);
		const conversationId = segments[segments.length - 1];

		const conversation = await prismaLib.conversation.findUnique({
			where: {
				id: conversationId,
				userId: userId,
			},
		});

		if (!conversation) {
			return new Response(
				JSON.stringify({ error: "Conversation not found" }),
				{
					status: 404,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		return new Response(JSON.stringify(conversation), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
