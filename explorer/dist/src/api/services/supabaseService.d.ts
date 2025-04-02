import { Document } from '@langchain/core/documents';
export declare class SupabaseService {
    private openAIEmbeddings;
    private supabaseClient;
    private vectorStore;
    constructor();
    getAllDocuments(): Promise<any[]>;
    getDocumentById(id: string): Promise<any>;
    createDocument(document: Document): Promise<any>;
    updateDocument(id: string, document: Document): Promise<any>;
    deleteDocument(id: string): Promise<void>;
    matchDocuments(query: string, k?: number): Promise<import("@langchain/core/documents").DocumentInterface<Record<string, any>>[]>;
}
