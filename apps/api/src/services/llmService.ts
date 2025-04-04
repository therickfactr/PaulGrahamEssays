import { ChatOpenAI } from '@langchain/openai';
import { DocumentMatch } from '../types/document';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key');
}
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('Missing Supabase URL or service key');
}

let supabase: SupabaseClient | undefined = undefined;

const getSupabase = () => {
  if (!supabase) {
    supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
  }
  return supabase;
}

const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: process.env.OPENAI_CHATMODEL,
  temperature: 0,
});

const getEssayContent = async (url: string): Promise<string> => {
  const client = getSupabase();
  const { data, error } = await client
    .from('essays')
    .select('content')
    .eq('url', url);

  if (error) {
    console.error('Error fetching essay content:', error);
  }

  return data?.[0]?.content ?? '';
}

export async function generateResponse(query: string, documents: DocumentMatch[]): Promise<string> {
  try {
    console.log(JSON.stringify(documents, null, 2));
    // Create a prompt that includes the relevant documents
    const context = documents
      .map((doc: DocumentMatch) => `Title: ${doc.metadata.title}\nURL: ${doc.metadata.source}\nContent: ${getEssayContent(doc.metadata.source)}`)
      .join('\n\n');

    const prompt = `You are an AI assistant helping users explore Paul Graham's essays. 
    Use the following context from relevant essays to answer the user's question.
    If the context doesn't contain enough information to answer the question, say so.

    Your answer should be in markdown in the following format:
    Numbered Item 1 should be titled "Relevant Essay Links" and should include an indented bulletedlist of 
    hyperlinked titles (e.g., [title](url)) for the relevant essays.
    Numbered Item 2 should containe your answer. Please add numbered footnotes (e.g., [^1], [^2], [^3], etc.)
    indicating references to specific essays from the list in Item 1. Define the footnotes
    (e.g., [^1]: title of referenced essay) as a list at the end of your answer. 
    answer with numbered footnotes to specific essays. 

    Context:
    ${context}
    
    Question: ${query}
    
    Answer:`;

    // Generate the response
    const response = await llm.invoke(prompt);
    const answer = typeof response.content === 'string' ? response.content : JSON.stringify(response.content);

    return answer;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
} 