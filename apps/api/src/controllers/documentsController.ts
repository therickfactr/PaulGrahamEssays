import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import type { Request, Response } from 'express';
import { getSupabaseClient, getSupabaseVectorStore } from '../lib';
import type {
  DocumentCreateRequest,
  DocumentMatchRequest
} from '../types';

export const listDocuments = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await getSupabaseClient()
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch documents',
      details: error
    });
  }
};

export const createDocument = async (req: Request<{}, {}, DocumentCreateRequest>, res: Response) => {
  let id: string;
  let vectorStore: SupabaseVectorStore;

  try {
    // get vector store
    vectorStore = await getSupabaseVectorStore();
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to get vector store',
      details: error
    });
  }

  try {
    // add document to vector store
    [id] = await vectorStore.addDocuments([req.body])
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to add document to vector store',
      details: error
    });
  }

  try {
    const { data, error } = await getSupabaseClient()
      .from('documents')
      .select('*')
      .eq('id', id)
    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error('Document not found');
    }
    return res.status(201).json(data[0]);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to retrieve document (2)',
      details: error
    });
  }
};

export const getDocument = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { data, error } = await getSupabaseClient()
      .from('documents')
      .select('*')
      .eq('id', req.params.id);

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    return res.status(200).json(data[0]);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch document',
      details: error
    });
  }
};

export const deleteDocument = async (req: Request<{ id: string }>, res: Response) => {
  try {
    // delete from vector store
    const vectorStore = await getSupabaseVectorStore();
    await vectorStore.delete({ ids: [req.params.id] });
    return res.status(200).json({ id: req.params.id });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to delete document',
      details: error
    });
  }
};

export const matchDocuments = async (req: Request<{}, {}, DocumentMatchRequest>, res: Response) => {
  try {
    const { query, limit = 5 } = req.body;
    const vectorStore = await getSupabaseVectorStore();
    const results = await vectorStore.similaritySearch(query, limit);
    return res.json({ matches: results });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to match documents',
      details: error
    });
  }
}; 