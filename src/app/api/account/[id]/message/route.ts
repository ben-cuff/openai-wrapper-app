import { prismaLib } from "@/lib/prisma";

export async function GET(req: Request) {
	try {
		const url = new URL(req.url);
		const segments = url.pathname.split("/");
		const userId = Number(segments[segments.length - 2]);

		const conversations = await prismaLib.conversation.findMany({
			where: {
				userId: userId,
			},
		});

		return new Response(JSON.stringify(conversations), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}

export async function POST(req: Request) {
	try {
		const { conversationId, messages } = await req.json();

		if (!conversationId || !messages) {
			return new Response("Missing required fields", { status: 400 });
		}

		const url = new URL(req.url);
		const segments = url.pathname.split("/");
		const userId = Number(segments[segments.length - 2]);

		console.log(conversationId);
		console.log(JSON.stringify(messages, null, 2));

		let conversation = await prismaLib.conversation.findUnique({
			where: {
				id: conversationId,
				userId: userId,
			},
		});

		if (!conversation) {
			conversation = await prismaLib.conversation.create({
				data: {
					id: conversationId,
					userId: userId,
					messages: messages,
				},
			});
		} else {
			conversation = await prismaLib.conversation.update({
				where: {
					id: conversationId,
				},
				data: {
					messages: messages,
				},
			});
		}

		return new Response(JSON.stringify(conversation), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		return new Response("Invalid request", { status: 400 });
	}
}
