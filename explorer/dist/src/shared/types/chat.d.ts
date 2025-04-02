export interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
}
export interface ChatResponse {
    message: string;
    sources?: {
        title: string;
        content: string;
        similarity: number;
    }[];
}
export interface ChatRequest {
    message: string;
    history?: Message[];
}
