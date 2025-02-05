import { prismaLib } from "@/lib/prisma";
import { createHash } from "crypto";

export async function POST(req: Request) {
	const { username, password } = await req.json();
	const hashed_password = createHash("sha256").update(password).digest("hex");

	if (!username || !password) {
		return new Response(
			JSON.stringify({
				success: false,
				error: "Missing username or password",
			}),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			}
		);
	}

	let user;
	try {
		user = await prismaLib.account.create({
			data: {
				username: username,
				hashed_password: hashed_password,
			},
		});
	} catch {
		return new Response(
			JSON.stringify({ success: false, error: "User already exists" }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}

	return new Response(JSON.stringify({ success: true, user }), {
		status: 201,
		headers: { "Content-Type": "application/json" },
	});
}
