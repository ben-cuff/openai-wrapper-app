import { openai } from "@/lib/openai";

export const runtime = "edge";

import { ChatCompletionChunk } from "openai/resources/index.mjs";

async function OpenAIStream(response: AsyncIterable<ChatCompletionChunk>) {
	const stream = new ReadableStream({
		async start(controller) {
			try {
				for await (const chunk of response) {
					const content = chunk.choices[0].delta.content || "";
					if (content) {
						controller.enqueue(content);
					}
				}
			} catch (error) {
				console.error("Error processing stream:", error);
				controller.error(error);
			} finally {
				controller.close();
			}
		},
	});

	return stream;
}

class StreamingTextResponse extends Response {
	constructor(stream: ReadableStream) {
		super(stream, {
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
				"Cache-Control": "no-cache",
				Connection: "keep-alive",
			},
		});
	}
}

export async function POST(req: Request) {
	try {
		const { messages } = await req.json();

		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			stream: true,
			messages: messages.map((message: any) => ({
				content: message.content,
				role: message.role,
			})),
		});

		console.log(response);
		const stream = await OpenAIStream(response);
		return new StreamingTextResponse(stream);
	} catch (error) {
		console.error("Error:", error);
		return new Response(
			JSON.stringify({ error: "Failed to generate response" }),
			{ status: 500 }
		);
	}
}
