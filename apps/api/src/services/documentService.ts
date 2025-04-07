import { getSupabaseVectorStore } from '../lib';
import { DocumentMatchResponse } from '../types';

export async function matchDocuments(query: string, limit: number = 5): Promise<DocumentMatchResponse[]> {
  // Search for relevant documents using the vector store
  const vectorStore = await getSupabaseVectorStore();
  const results = await vectorStore.similaritySearchWithScore(query, limit);

  // Transform the results into our expected format
  return results.map(([doc, score]) => ({
    pageContent: doc.pageContent,
    metadata: doc.metadata,
    similarity: score
  }));
} 