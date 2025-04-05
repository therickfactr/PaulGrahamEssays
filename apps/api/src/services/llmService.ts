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
    console.log('Query:', query);
    console.log('Documents:', JSON.stringify(documents, null, 2));
    // Create a prompt that includes the relevant documents
    const context = documents
      .map((doc: DocumentMatch) => `Essay Title: ${doc.metadata.title}\nEssay URL: ${doc.metadata.source}\nEssay Content: ${getEssayContent(doc.pageContent)}`)
      .join('\n\n');

    const essayList = documents
      .map((doc: DocumentMatch) => `  * [${doc.metadata.title}](${doc.metadata.source})`)
      .join('\n');
    console.log('Context:', context);

    const prompt = `You are an AI assistant helping users explore Paul Graham's essays. 
    Use the following context from relevant essays to answer the user's question.
    If the context doesn't contain enough information to answer the question, say so.

    Your answer should be in markdown as a series of paragraphs with the following content.

    Begin with the level 2 heading "Answer".
    
    Beginning on the next line, provide your complete answer including footnote references 
    (e.g., [^1], [^2], [^3], etc.) to specific essays in the context.

    Finally, after a horizontal line, add the list of footnotes, each formatted as '[^1]: [title](url)'.

    Context:
    ${context}

    Question: ${query}

    Answer:`;

    console.log('Prompt:', prompt);

    // Generate the response
    const response = await llm.invoke(prompt);
    const answer = typeof response.content === 'string' ? response.content : JSON.stringify(response.content);

    return `## Relevant Essays\n${essayList}\n${answer}\n`;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
} 