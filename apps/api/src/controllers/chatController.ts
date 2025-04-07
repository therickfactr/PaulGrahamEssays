import { Request, Response } from 'express';
import { processChatRequest } from '../services/chatService';
import { ChatRequest } from '../types';

export async function chat(req: Request<{}, {}, ChatRequest>, res: Response) {
  try {
    let { query, limit } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    if (!limit) {
      limit = 5;
    }

    const response = await processChatRequest(query, limit);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      details: error
    });
  }
} 