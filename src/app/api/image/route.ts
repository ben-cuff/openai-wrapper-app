import OpenAI from "openai";

export async function POST(req: Request) {
	try {
		const { openai_api_key, model, url, prompt } = await req.json();

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

		// const image = await openai.images.generate({
		// 	model: model,
		// 	prompt: prompt,
		// 	size: "256x256",
		// });

		// console.log(JSON.stringify(image, null, 2));

		// return new Response(JSON.stringify(image), { status: 201 });
		const mockResponse = {
			created: 1739306820,
			data: [
				{
					url: "https://oaidalleapiprodscus.blob.core.windows.net/private/org-spaKF5uDfWDUJCuHo9fe8BJo/user-3DoxZMyRVFHAJfmTcyXvDOEy/img-2xr0mymTyIKxuvRa86xdj9bu.png?st=2025-02-11T19%3A47%3A00Z&se=2025-02-11T21%3A47%3A00Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-02-11T17%3A35%3A37Z&ske=2025-02-12T17%3A35%3A37Z&sks=b&skv=2024-08-04&sig=CfFX7oHJbeRYFQ889RY4f0knZpYzNg5wmNXHEOByHJU%3D",
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
