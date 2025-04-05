import { Router } from 'express';
import documentRouter from './documents';
import healthRouter from './health';

const router = Router();

// Health check route
router.use('/health', healthRouter);
// Document routes
router.use('/documents', documentRouter);

export default router; 