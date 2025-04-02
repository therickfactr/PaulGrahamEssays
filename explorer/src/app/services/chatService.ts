import { ChatRequest, ChatResponse } from "@/shared/types/chat";

export const chatService = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(process.env.API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  },
}; 