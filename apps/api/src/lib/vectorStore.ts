import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { OpenAIEmbeddings } from '@langchain/openai';
import getSupabase from './supabase';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key');
}

let _vectorStore: SupabaseVectorStore | undefined;

const getVectorStore = async () => {
  if (!_vectorStore) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('Missing OpenAI API key');
    }
    if (!process.env.OPENAI_EMBEDDINGS_MODEL) {
      throw new Error('Missing OpenAI embeddings model');
    }
    _vectorStore = await new SupabaseVectorStore(
      new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: process.env.OPENAI_EMBEDDINGS_MODEL,
      }),
      {
        client: getSupabase(),
        tableName: 'documents',
        queryName: 'match_documents'
      }
    );
  }
  return _vectorStore;
};

export default getVectorStore;