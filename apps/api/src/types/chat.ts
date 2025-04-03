export interface ChatRequest {
  query: string;
}

export interface DocumentMatch {
  id: string;
  title: string;
  content: string;
  similarity: number;
}

export interface ChatResponse {
  answer: string;
  matches: DocumentMatch[];
}