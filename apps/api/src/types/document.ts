import { type Document as _langchainDocument } from '@langchain/core/documents';

type Simplify<T> = {
  [KeyType in keyof T]: T[KeyType];
};

type LangchainDocument<T extends Record<string, any>> = Simplify<_langchainDocument<T>>;

export interface Metadata {
  source?: string;
  title?: string;
  language?: string;
  author?: string;
  summary?: string;
};

export type Document = Simplify<LangchainDocument<Metadata>> & {
  embedding?: Array<number>;
  created_at?: string;
  updated_at?: string;
}

export type DocumentCreateRequest = Simplify<LangchainDocument<Metadata>>

export type DocumentReadRequest = Simplify<Pick<LangchainDocument<Metadata>, 'id'>>

export interface DocumentMatchRequest {
  query: string;
  limit?: number;
}

export type DocumentMatchResponse = LangchainDocument<Metadata> & {
  similarity: number;
}
