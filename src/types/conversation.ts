import { Message } from "./message";

export interface Conversation {
	id: string;
	messages: { messages: Message[] };
	updatedAt: string;
}
