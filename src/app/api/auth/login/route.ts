import { prismaLib } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
	try {
		const { username, password } = await req.json();

		const user = await prismaLib.account.findFirst({
			where: { username },
		});

		if (!user) {
			return new Response(
				JSON.stringify({ message: "Username or password incorrect" }),
				{
					status: 404,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		const hash = crypto.createHash("sha256").update(password).digest("hex");

		if (hash === user.hashed_password) {
			return new Response(
				JSON.stringify({ message: "Login successful", user }),
				{
					status: 200,
					headers: { "Content-Type": "application/json" },
				}
			);
		} else {
			return new Response(
				JSON.stringify({ message: "Username or password incorrect" }),
				{
					status: 401,
					headers: { "Content-Type": "application/json" },
				}
			);
		}
	} catch (error) {
		console.error("Error during login:", error);
		return new Response(
			JSON.stringify({ message: "Internal Server Error" }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}
