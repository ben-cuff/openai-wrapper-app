import { prismaLib } from "@/lib/prisma";

export async function DELETE(req: Request) {
	try {
		const url = new URL(req.url);
		const segments = url.pathname.split("/");
		const id = Number(segments[segments.length - 1]);

		const deletedAccount = await prismaLib.$transaction(async (prisma) => {
			await prisma.conversation.deleteMany({
				where: { userId: id },
			});
			return await prisma.account.delete({
				where: { id },
			});
		});

		if (!deletedAccount) {
			return new Response(JSON.stringify({ error: "User not found" }), {
				status: 404,
			});
		}

		return new Response(JSON.stringify(deletedAccount), { status: 200 });
	} catch (error) {
		console.error("Error deleting account:", error);
		return new Response(
			JSON.stringify({ error: "Failed to delete account" }),
			{ status: 500 }
		);
	}
}
