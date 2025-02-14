import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
	interface Session {
		user: {
			id?: number;
			username?: string | null;
			openai_api_key?: string | null;
			deepseek_api_key?: string | null;
			name?: string | null;
			image?: string | null;
		};
	}
	interface User {
		id: number;
		username: string;
		openai_api_key: string;
		deepseek_api_key: string;
		name?: string | null;
		image?: string | null;
	}
}

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				username: { label: "Username", type: "username" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const res = await fetch(
					`${process.env.base_url}/api/auth/login`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(credentials),
					}
				);

				const user = await res.json();

				if (res.ok && user) {
					return user.user;
				} else {
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.username = user.username;
				token.openai_api_key = user.openai_api_key;
				token.deepseek_api_key = user.deepseek_api_key;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as number;
				session.user.username = token.username as string;

				const [openai_api_key, deepseek_api_key] = await Promise.all([
					getOpenaiApiKey(session.user.id),
					getDeepSeekApiKey(session.user.id),
				]);

				session.user.openai_api_key = openai_api_key;
				session.user.deepseek_api_key = deepseek_api_key;
			}
			return session;
		},
	},
	pages: {
		signIn: "/signin",
	},
};

async function getOpenaiApiKey(id: number) {
	try {
		const response = await fetch(
			`${process.env.base_url}/api/account/${id}/openai-key`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-api-key": `${process.env.X_API_KEY}`,
				},
			}
		);

		const res = await response.json();
		return res.openai_api_key;
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function getDeepSeekApiKey(id: number) {
	try {
		const response = await fetch(
			`${process.env.base_url}/api/account/${id}/deepseek-key`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-api-key": `${process.env.X_API_KEY}`,
				},
			}
		);

		const res = await response.json();
		return res.deepseek_api_key;
	} catch (error) {
		console.error(error);
		return null;
	}
}
