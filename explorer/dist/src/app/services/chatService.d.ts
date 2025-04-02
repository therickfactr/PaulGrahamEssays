import { ChatRequest, ChatResponse } from "@/shared/types/chat";
export declare const chatService: {
    sendMessage(request: ChatRequest): Promise<ChatResponse>;
};
