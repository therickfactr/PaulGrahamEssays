import { ChatRequest, ChatResponse } from '../types/chat';
import { matchDocuments } from './documentService';
import { generateResponse } from './llmService';

export async function processChatRequest(request: ChatRequest): Promise<ChatResponse> {
  try {
    // Search for relevant documents
    const matches = await matchDocuments(request.query);
    
    // Generate response using the search results
    const answer = await generateResponse(request.query, matches);

    return {
      answer,
      matches
    };
  } catch (error) {
    console.error('Error processing chat request:', error);
    throw error;
  }
} 