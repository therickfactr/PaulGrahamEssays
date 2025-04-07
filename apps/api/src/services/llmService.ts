import { ChatOpenAI } from '@langchain/openai';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DocumentMatchResponse } from '../types';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key');
}
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('Missing Supabase URL or service key');
}

let supabase: SupabaseClient | undefined = undefined;

const getSupabaseClient = () => {
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
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('essays')
    .select('content')
    .eq('url', url);

  if (error) {
    console.error('Error fetching essay content:', error);
  }

  return data?.[0]?.content ?? '';
}

export async function generateResponse(
  query: string,
  documents: DocumentMatchResponse[],
  limit: number
): Promise<{ answer: string, essays: DocumentMatchResponse[] }> {
  try {
    // Remove duplicate documents based on URL
    const uniqueDocuments = documents.reduce((acc: DocumentMatchResponse[], currentDoc) => {
      const isDuplicate = acc.some(doc => doc.metadata.source === currentDoc.metadata.source);
      if (!isDuplicate) {
        acc.push(currentDoc);
      }
      return acc;
    }, [])
      .slice(0, limit);

    // uniqueDocuments.forEach((doc, i) => {
    //   console.log(`Unique Document ${i}: ${doc.metadata.source} - ${doc.metadata.title}`);
    // });

    // Create a prompt that includes the relevant documents
    const context = uniqueDocuments
      .sort((a, b) => a.metadata.title.localeCompare(b.metadata.title))
      .map((doc: DocumentMatchResponse) => `Essay Title: ${doc.metadata.title}\nEssay URL: ${doc.metadata.source}\nEssay Content: ${getEssayContent(doc.metadata.source)}`)
      .join('\n\n');

    const essayList = uniqueDocuments
      .map((doc: DocumentMatchResponse) => `  * [${doc.metadata.title}](${doc.metadata.source})`)
      .join('\n');

    const prompt = `You are an AI assistant helping users explore Paul Graham's essays. 
    Use the following context from relevant essays to answer the user's question.
    If the context doesn't contain enough information to answer the question, say so.

    If you don't have enough information to answer the question, say so.

    If you do have enough information to answer the question, your answer should be 
    limited to 200 words and should be formatted as markdown as a series of paragraphs 
    with the following content.

    Begin with the level 2 heading "Answer".
    
    Beginning on the next line, provide your answer including footnote references (e.g., [^1], 
    [^2], [^3], etc.) to specific essays in the context. 

    Add the list of footnotes, each formatted as '[^1]: [title](url)'.

    Context:
    ${context}

    Question: ${query}

    Answer:`;


    // Generate the response
    const response = await llm.invoke(prompt);
    const answer = typeof response.content === 'string' ? response.content : JSON.stringify(response.content);

    return {
      answer: `## Relevant Essays\n${essayList}\n${answer}\n`,
      essays: uniqueDocuments
    };
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
} 