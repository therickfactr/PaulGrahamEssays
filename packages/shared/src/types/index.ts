export interface Document {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentCreate {
  title: string;
  content: string;
}

export interface DocumentUpdate {
  title?: string;
  content?: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  response: string;
}

export interface MatchRequest {
  query: string;
  limit?: number;
}

export interface MatchResponse {
  matches: Document[];
} 