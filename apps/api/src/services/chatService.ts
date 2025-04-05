import { Request } from 'express';
import { ChatRequest, ChatResponse } from '../types/chat';
import { matchDocuments } from './documentService';
import { generateResponse } from './llmService';

export async function processChatRequest(query: string, limit: number): Promise<ChatResponse> {
  // Search for relevant documents
  const matches = await matchDocuments(query, limit * 3);

  // Generate response using the search results
  const { answer, essays } = await generateResponse(query, matches, limit);
  
  return {
    answer,
    essays
  };

} 