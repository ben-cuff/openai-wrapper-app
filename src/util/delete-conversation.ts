export async function deleteConversation(
    userId: number,
    conversationId: string
): Promise<boolean> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_base_url}/api/account/${userId}/message/${conversationId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            console.error(`Failed to delete conversation: ${response.statusText}`);
            return false;
        }

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
