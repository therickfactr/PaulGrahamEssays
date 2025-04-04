export interface DocumentMatch {
  pageContent: string;
  metadata: Record<string, any>;
  similarity: number;
}
