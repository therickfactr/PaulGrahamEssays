import getVectorStore from '../lib/vectorStore';
import { DocumentMatch } from '../types/document';

export async function matchDocuments(query: string, limit: number = 5): Promise<DocumentMatch[]> {
  // Search for relevant documents using the vector store
  const vectorStore = await getVectorStore();
  const results = await vectorStore.similaritySearchWithScore(query, limit);
  
  // Transform the results into our expected format
  return results.map(([doc, score]) => ({
    pageContent: doc.pageContent,
    metadata: doc.metadata,
    similarity: score
  }));
} 