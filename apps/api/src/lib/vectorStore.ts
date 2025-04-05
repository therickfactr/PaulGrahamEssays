import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { OpenAIEmbeddings } from '@langchain/openai';
import getSupabase from './supabase';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key');
}

const _embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

let _vectorStore: SupabaseVectorStore | undefined;

const getVectorStore = async () => {
  if (!_vectorStore) {
    _vectorStore = await new SupabaseVectorStore(
      new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: process.env.OPENAI_EMBEDDINGS_MODEL || 'text-embedding-3-small',
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