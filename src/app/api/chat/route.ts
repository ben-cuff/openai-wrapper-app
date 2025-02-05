// export const runtime = "edge";

import { Message } from "@/app/chat/page";
import OpenAI from "openai";
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
		const { messages, openai_api_key, model, url } = await req.json();

		if (!messages || !Array.isArray(messages)) {
			return new Response(
				JSON.stringify({
					error: "Invalid or missing 'messages' field",
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			);
		}

		if (!model) {
			return new Response(
				JSON.stringify({ error: "Missing 'model' field" }),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			);
		}

		if (!url) {
			return new Response(
				JSON.stringify({ error: "Missing 'url' field" }),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			);
		}

		if (!openai_api_key) {
			return new Response(
				JSON.stringify({
					error: "OpenAI API key is required, please add this to your account",
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		const openai = new OpenAI({
			apiKey: openai_api_key,
			baseURL: url,
		});

		const response = await openai.chat.completions.create({
			model: model,
			stream: true,
			messages: messages.map((message: Message) => ({
				content: message.content,
				role: message.role,
			})),
		});

		const stream = await OpenAIStream(response);
		return new StreamingTextResponse(stream);
	} catch (error) {
		console.error("Error:", error);
		return new Response(
			JSON.stringify({
				error: "Failed to generate response, it is likely that your API key is broken or out of credit",
			}),
			{ status: 500 }
		);
	}
}
