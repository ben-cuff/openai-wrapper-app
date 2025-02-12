import { determineImageSize, ImageSize } from "@/util/image-sizing";
import OpenAI from "openai";

export async function POST(req: Request) {
	try {
		const { openai_api_key, model, url, prompt, height, width, mock } =
			await req.json();

		const size = determineImageSize(height, width);

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

		if (!prompt) {
			return new Response(
				JSON.stringify({ error: "Missing 'prompt' field" }),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			);
		}

		if (!openai_api_key) {
			return new Response(
				JSON.stringify({
					error: "OpenAI API key is required, please add this to your account. Use the guide page if needed.",
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

		if (!mock) {
			const image = await openai.images.generate({
				size: size as ImageSize,
				prompt: prompt,
				model: model,
			});

			return new Response(JSON.stringify(image), { status: 201 });
		}
		const mockResponse = {
			created: 1739306820,
			data: [
				{
					url: "https://oaidalleapiprodscus.blob.core.windows.net/private/org-spaKF5uDfWDUJCuHo9fe8BJo/user-3DoxZMyRVFHAJfmTcyXvDOEy/img-81pk3sSbUaT8wk2VvWBwudc2.png?st=2025-02-12T15%3A40%3A39Z&se=2025-02-12T17%3A40%3A39Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-02-12T01%3A40%3A39Z&ske=2025-02-13T01%3A40%3A39Z&sks=b&skv=2024-08-04&sig=9gD/j9h66IqQPZV5KcJg9BRoTqw2KXo195zZ4wQPmNI%3D",
				},
			],
		};
		return new Response(JSON.stringify(mockResponse), { status: 201 });
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
