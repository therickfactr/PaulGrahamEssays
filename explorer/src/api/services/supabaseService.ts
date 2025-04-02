import { createClient } from '@supabase/supabase-js';
import { Document } from '@langchain/core/documents';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { OpenAIEmbeddings } from '@langchain/openai';

export class SupabaseService {
  private openAIEmbeddings: OpenAIEmbeddings;
  private supabaseClient;
  private vectorStore: SupabaseVectorStore;

  constructor() {
    // Create OpenAI embeddings object
    this.openAIEmbeddings = new OpenAIEmbeddings({
      modelName: process.env.OPENAI_MODEL || 'text-embedding-3-small'
    });

    // Create Supabase client
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      throw new Error('SUPABASE_URL and SUPABASE_KEY must be set');
    }
    this.supabaseClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    // Create Supabase vector store
    this.vectorStore = new SupabaseVectorStore(this.openAIEmbeddings,
      {
        client: this.supabaseClient,
        tableName: 'documents',
        queryName: 'match_documents',
      }
    );
  }

  async getAllDocuments() {
    const { data, error } = await this.supabaseClient
      .from('documents')
      .select('*');
    
    if (error) throw error;
    return data;
  }

  async getDocumentById(id: string) {
    const { data, error } = await this.supabaseClient
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async createDocument(document: Document) {
    const { data, error } = await this.supabaseClient
      .from('documents')
      .insert([document])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateDocument(id: string, document: Document) {
    const { data, error } = await this.supabaseClient
      .from('documents')
      .update(document)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteDocument(id: string) {
    const { error } = await this.supabaseClient
      .from('documents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async matchDocuments(query: string, k: number = 5) {
    const results = await this.vectorStore.similaritySearch(query, k);
    return results;
  }
} 