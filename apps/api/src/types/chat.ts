import { DocumentMatchResponse } from './document';

export interface ChatRequest {
  query: string;
  limit: number;
}

export interface ChatResponse {
  answer: string;
  essays: DocumentMatchResponse[];
}