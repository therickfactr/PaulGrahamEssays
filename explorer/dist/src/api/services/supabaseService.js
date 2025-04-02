"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseService = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_1 = require("@langchain/community/vectorstores/supabase");
const openai_1 = require("@langchain/openai");
class SupabaseService {
    constructor() {
        // Create OpenAI embeddings object
        this.openAIEmbeddings = new openai_1.OpenAIEmbeddings({
            modelName: process.env.OPENAI_MODEL || 'text-embedding-3-small'
        });
        // Create Supabase client
        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
            throw new Error('SUPABASE_URL and SUPABASE_KEY must be set');
        }
        this.supabaseClient = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
        // Create Supabase vector store
        this.vectorStore = new supabase_1.SupabaseVectorStore(this.openAIEmbeddings, {
            client: this.supabaseClient,
            tableName: 'documents',
            queryName: 'match_documents',
        });
    }
    async getAllDocuments() {
        const { data, error } = await this.supabaseClient
            .from('documents')
            .select('*');
        if (error)
            throw error;
        return data;
    }
    async getDocumentById(id) {
        const { data, error } = await this.supabaseClient
            .from('documents')
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            throw error;
        return data;
    }
    async createDocument(document) {
        const { data, error } = await this.supabaseClient
            .from('documents')
            .insert([document])
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async updateDocument(id, document) {
        const { data, error } = await this.supabaseClient
            .from('documents')
            .update(document)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async deleteDocument(id) {
        const { error } = await this.supabaseClient
            .from('documents')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
    }
    async matchDocuments(query, k = 5) {
        const results = await this.vectorStore.similaritySearch(query, k);
        return results;
    }
}
exports.SupabaseService = SupabaseService;
//# sourceMappingURL=supabaseService.js.map