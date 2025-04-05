import type { Request, Response } from 'express';
import getVectorStore from '../lib/vectorStore';
import getSupabase from '../lib/supabase';

import type { 
  DocumentCreate, 
  MatchRequest, 
} from '../types';

export const listDocuments = async (req: Request, res: Response) => {
  try {
    const { data, error } = await getSupabase()
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

export const createDocument = async (req: Request<{}, {}, DocumentCreate>, res: Response) => {
  try {
    // Add to vector store
    const vectorStore = await getVectorStore();
    const [ id ] = await vectorStore.addDocuments([
      {
        pageContent: req.body.content,
        metadata: req.body.metadata as Record<string, any>,
      },
    ]);

    const { data, error } = await getSupabase()
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;

    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to create document', 
      details: JSON.parse(JSON.stringify(error)) 
    });
  }
};

export const getDocument = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { data, error } = await getSupabase()
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
    const vectorStore = await getVectorStore();
    await vectorStore.delete({ ids: [req.params.id]});
    return res.status(200).json({ id: req.params.id });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to delete document',
      details: error 
    });
  }
};

export const matchDocuments = async (req: Request<{}, {}, MatchRequest>, res: Response) => {
  try {
    const { query, limit = 5 } = req.body;
    const vectorStore = await getVectorStore();
    const results = await vectorStore.similaritySearch(query, limit);
    return res.json({ matches: results });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to match documents',
      details: error 
    });
  }
}; 