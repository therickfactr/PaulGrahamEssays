import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { OpenAIEmbeddings } from '@langchain/openai';
import { getSupabaseClient } from './getSupabaseClient';

let _supabaseVectorStore: SupabaseVectorStore | undefined;

export const getSupabaseVectorStore = async () => {
  if (!_supabaseVectorStore) {
    const _supabaseClient = getSupabaseClient();
    console.log('getSupabaseVectorStore -> _supabaseClient', _supabaseClient);
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('Missing OpenAI API key');
    }
    console.log('getSupabaseVectorStore -> process.env.OPENAI_API_KEY', process.env.OPENAI_API_KEY);
    if (!process.env.OPENAI_EMBEDDINGS_MODEL) {
      throw new Error('Missing OpenAI embeddings model');
    }
    console.log('getSupabaseVectorStore -> process.env.OPENAI_EMBEDDINGS_MODEL', process.env.OPENAI_EMBEDDINGS_MODEL);
    const _openAIEmbeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: process.env.OPENAI_EMBEDDINGS_MODEL,
    });
    console.log('getSupabaseVectorStore -> _openAIEmbeddings', _openAIEmbeddings);
    _supabaseVectorStore = new SupabaseVectorStore(_openAIEmbeddings, {
      client: _supabaseClient,
      tableName: 'documents',
      queryName: 'match_documents',
    });
    console.log('getSupabaseVectorStore -> _supabaseVectorStore', _supabaseVectorStore);
  }
  return _supabaseVectorStore;
};