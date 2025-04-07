import type { Request, Response } from 'express';

export const healthz = async (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
}; 