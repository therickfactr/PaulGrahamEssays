import { Request, Response } from 'express';
import { SupabaseService } from '../services/supabaseService';
export declare class DocumentController {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    getAllDocuments: (req: Request, res: Response) => Promise<void>;
    getDocumentById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    createDocument: (req: Request, res: Response) => Promise<void>;
    updateDocument: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    deleteDocument: (req: Request, res: Response) => Promise<void>;
    matchDocuments: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
}
