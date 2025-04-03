import { 
  type DocumentInput as LCDocumentInput
} from '@langchain/core/documents';

export interface DocumentFields {
  content: string;
  metadata?: DocumentMetadata;
}

export type DocumentMetadata = LCDocumentInput['metadata'] & {
  source?: string;
  title?: string;
  language?: string;
  author?: string;
  summary?: string;
};

export interface Document extends DocumentFields {
  id: string;
  embedding?: Array<number>;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentCreate extends DocumentFields {}

export interface DocumentUpdate extends Partial<DocumentFields> {}

export interface ChatRequest {
  message: string;
  history?: Array<{ role: string; content: string }>;
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