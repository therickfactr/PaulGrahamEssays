import { Request, Response } from 'express';
import { SupabaseService } from '../services/supabaseService';
import { Document } from 'langchain/document';

export class DocumentController {
  constructor(private supabaseService: SupabaseService) {}

  getAllDocuments = async (req: Request, res: Response) => {
    try {
      const documents = await this.supabaseService.getAllDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch documents' });
    }
  };

  getDocumentById = async (req: Request, res: Response) => {
    try {
      const document = await this.supabaseService.getDocumentById(req.params.id);
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch document' });
    }
  };

  createDocument = async (req: Request, res: Response) => {
    try {
      const document = new Document({
        pageContent: req.body.content,
        metadata: req.body.metadata || {},
      });
      const createdDocument = await this.supabaseService.createDocument(document);
      res.status(201).json(createdDocument);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create document' });
    }
  };

  updateDocument = async (req: Request, res: Response) => {
    try {
      const document = new Document({
        pageContent: req.body.content,
        metadata: req.body.metadata || {},
      });
      const updatedDocument = await this.supabaseService.updateDocument(
        req.params.id,
        document
      );
      if (!updatedDocument) {
        return res.status(404).json({ error: 'Document not found' });
      }
      res.json(updatedDocument);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update document' });
    }
  };

  deleteDocument = async (req: Request, res: Response) => {
    try {
      await this.supabaseService.deleteDocument(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete document' });
    }
  };

  matchDocuments = async (req: Request, res: Response) => {
    try {
      const { query, k } = req.body;
      if (!query) {
        return res.status(400).json({ error: 'Query is required' });
      }
      const matches = await this.supabaseService.matchDocuments(
        query,
        k || 5
      );
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: 'Failed to match documents' });
    }
  };
} 