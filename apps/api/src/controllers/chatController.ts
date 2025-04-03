import { Request, Response } from 'express';
import { ChatRequest } from '../types/chat';
import { processChatRequest } from '../services/chatService';

export async function chat(req: Request, res: Response) {
  try {
    const request: ChatRequest = req.body;
    
    if (!request.query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const response = await processChatRequest(request);
    res.json(response);
  } catch (error) {
    console.error('Error in chat controller:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 