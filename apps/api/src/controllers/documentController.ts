import type { Request, Response } from 'express';
import { initVectorStore, supabaseClient } from '../lib/supabase';
import type { 
  Document, 
  DocumentCreate, 
  DocumentUpdate, 
  MatchRequest, 
} from '../types';
import { OpenAIEmbeddings } from '@langchain/openai';

export const listDocuments = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseClient
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

export const createDocument = async (req: Request<{}, {}, DocumentCreate>, res: Response) => {
  try {
    // Add to vector store
    const vectorStore = await initVectorStore();
    const [ id ] = await vectorStore.addDocuments([
      {
        pageContent: req.body.content,
        metadata: req.body.metadata as Record<string, any>,
      },
    ]);

    const { data, error } = await supabaseClient
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create document', details: JSON.parse(JSON.stringify(error)) });
  }
};

export const getDocument = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { data, error } = await supabaseClient
      .from('documents')
      .select('*')
      .eq('id', req.params.id);

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch document' });
  }
};

export const updateDocument = async (
  req: Request<{ id: string }, {}, DocumentUpdate>,
  res: Response
) => {
  if (!req.body || (!req.body.content && !req.body.metadata)) {
    return res.status(400).json({ error: 'Content or metadata for update is required' });
  }

  let originalDocument: Document;

  try {
    // Get original document
    let { data:originalData, error: originalError } = await supabaseClient
      .from('documents')
      .select()
      .eq('id', req.params.id);

    if (originalError) throw originalError;
    if (!originalData || originalData.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    originalDocument = originalData[0];

    // delete original document from vector store
    const { error: deleteError } = await supabaseClient
      .from('documents')
      .delete()
      .eq('id', req.params.id);

    if (deleteError) throw deleteError;
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve original document', details: JSON.parse(JSON.stringify(error)) });
  }

  const updatedDocument = {
    id: req.params.id,
    pageContent: req.body.content?? originalDocument!.content,
    metadata: {
      ...originalDocument!.metadata,
      ...req.body.metadata
    },
  }

  try {
    // add updated document to vector store
    const vectorStore = await initVectorStore();
    await vectorStore.addDocuments([updatedDocument]);

  } catch (error) {
    res.status(500).json({ error: 'Failed to add updated document to vector store', details: JSON.parse(JSON.stringify(error)) });
  }

  try {
    // retrieve updated document from supabase
    const { data, error } = await supabaseClient
      .from('documents')
      .select()
      .eq('id', req.params.id);

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(500).json({ error: 'Cannot find updated document' });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve the updated document', details: JSON.parse(JSON.stringify(error)) });
  }
};

export const deleteDocument = async (req: Request<{ id: string }>, res: Response) => {
  try {
    // delete from vector store and supabase
    const vectorStore = await initVectorStore();
    await vectorStore.delete({ ids: [req.params.id]});
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
};

export const matchDocuments = async (req: Request<{}, {}, MatchRequest>, res: Response) => {
  try {
    const { query, limit = 5 } = req.body;
    const vectorStore = await initVectorStore();
    const results = await vectorStore.similaritySearch(query, limit);
    res.json({ matches: results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to match documents', details: JSON.stringify(error) });
  }
}; 