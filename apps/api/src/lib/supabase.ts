import { createClient } from '@supabase/supabase-js';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Document } from '@langchain/core/documents';
import "dotenv/config";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

let vectorStore: SupabaseVectorStore | null = null;

export const initVectorStore = async () => {
  if (!vectorStore) {
    vectorStore = await SupabaseVectorStore.fromExistingIndex(
      new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: process.env.OPENAI_EMBEDDINGS_MODEL || 'text-embedding-3-small',
      }),
      {
        client: supabase,
        tableName: 'documents',
        queryName: 'match_documents'
      }
    );
  }
  return vectorStore;
};

export const getVectorStore = () => {
  if (!vectorStore) {
    throw new Error('Vector store not initialized. Call initVectorStore() first.');
  }
  return vectorStore;
}; 