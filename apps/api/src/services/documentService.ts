import { vectorStore } from '../lib/vectorStore';
import { DocumentMatch } from '../types/document';

export async function matchDocuments(query: string): Promise<DocumentMatch[]> {
  try {
    // Search for relevant documents using the vector store
    const results = await vectorStore.similaritySearchWithScore(query, 5);
    
    // Transform the results into our expected format
    return results.map(([doc, score]) => ({
      pageContent: doc.pageContent,
      metadata: doc.metadata,
      similarity: score
    }));
  } catch (error) {
    console.error('Error searching documents:', error);
    throw error;
  }
} 