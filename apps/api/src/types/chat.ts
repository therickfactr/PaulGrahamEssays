import { DocumentMatch } from './document';

export interface ChatRequest {
  query: string;
}

export interface ChatResponse {
  answer: string;
  matches: DocumentMatch[];
}