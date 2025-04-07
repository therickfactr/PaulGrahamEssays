import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { OpenAIEmbeddings } from '@langchain/openai';
import { getSupabaseClient } from './getSupabaseClient';

let _supabaseVectorStore: SupabaseVectorStore | undefined;

export const getSupabaseVectorStore = async () => {
  if (!_supabaseVectorStore) {
    const _supabaseClient = getSupabaseClient();
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('Missing OpenAI API key');
    }
    if (!process.env.OPENAI_EMBEDDINGS_MODEL) {
      throw new Error('Missing OpenAI embeddings model');
    }
    const _openAIEmbeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: process.env.OPENAI_EMBEDDINGS_MODEL,
    });
    _supabaseVectorStore = new SupabaseVectorStore(_openAIEmbeddings, {
      client: _supabaseClient,
      tableName: 'documents',
      queryName: 'match_documents',
    });
  }
  return _supabaseVectorStore;
};