import { prismaLib } from "@/lib/prisma";
import crypto from "crypto";

export async function PATCH(req: Request) {
	try {
		const { old_password, new_password } = await req.json();

		const url = new URL(req.url);
		const segments = url.pathname.split("/");
		const id = Number(segments[segments.length - 2]);

		if (!old_password || !new_password) {
			return new Response(
				JSON.stringify({
					message: "Old or new password is missing from body",
				}),
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
			return new Response(JSON.stringify({ error: "User not Found" }), {
				status: 404,
				headers: { "Content-Type": "application/json" },
			});
		}

		const hash = crypto
			.createHash("sha256")
			.update(old_password)
			.digest("hex");

		if (hash !== user.hashed_password) {
			return new Response(
				JSON.stringify({ error: "Password incorrect" }),
				{
					status: 401,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		const hashed_password = crypto
			.createHash("sha256")
			.update(new_password)
			.digest("hex");

		await prismaLib.account.update({
			where: { id },
			data: { hashed_password },
		});

		return new Response(
			JSON.stringify({ message: "Password updated successfully" }),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		);
	} catch (error) {
		return new Response(JSON.stringify({ error: error }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
