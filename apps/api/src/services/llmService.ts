import { ChatOpenAI } from '@langchain/openai';
import { DocumentMatch } from '../types/document';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key');
}
if (!process.env.OPENAI_MODEL) {
  throw new Error('Missing OpenAI model name');
}

const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: process.env.OPENAI_MODEL,
  temperature: 0.7,
});

export async function generateResponse(query: string, documents: DocumentMatch[]): Promise<string> {
  try {
    // Create a prompt that includes the relevant documents
    const context = documents
      .map(doc => `Title: ${doc.metadata['title']}\nContent: ${doc.pageContent}`)
      .join('\n\n');

    const prompt = `You are an AI assistant helping users explore Paul Graham's essays. 
    Use the following context from relevant essays to answer the user's question.
    If the context doesn't contain enough information to answer the question, say so.
    
    Context:
    ${context}
    
    Question: ${query}
    
    Answer:`;

    // Generate the response
    const response = await llm.invoke(prompt);
    return typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
} 