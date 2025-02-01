import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
	interface User {
		id?: number;
		name?: string | null;
		username?: string | null;
	}

	interface Session {
		user: {
			id?: number;
			name?: string | null;
			username?: string | null;
		};
	}
}

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Username", type: "username" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.name = user.name;
				token.username = user.username ;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as number;
				session.user.name = token.name;
				session.user.username = token.username as string | null | undefined;
			}
			return session;
		},
	},
};
