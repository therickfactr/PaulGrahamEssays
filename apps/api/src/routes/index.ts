import { Router } from 'express';
import documentsRouter from './documents';
import healthzRouter from './healthz';

const router = Router();

// Health check route
router.use('/healthz', healthzRouter);
// Document routes
router.use('/documents', documentsRouter);

export default router; 