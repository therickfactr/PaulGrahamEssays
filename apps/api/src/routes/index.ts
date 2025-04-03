import { Router } from 'express';
import {
  listDocuments,
  createDocument,
  getDocument,
  deleteDocument,
  matchDocuments,
} from '../controllers/documentController';
import chatRoutes from './chat';

const router = Router();

// Health check route
router.get('/api/health', (req, res) => {
  res.json({ 
      message: 'Welcome to the Paul Graham Essays API',
      version: '1.0.0',
      timestamp: new Date().toISOString() 
  });
});
// Document routes
router.get('/api/documents', listDocuments);
router.post('/api/documents', createDocument);
router.get('/api/documents/:id', getDocument);
router.delete('/api/documents/:id', deleteDocument);
router.post('/api/documents/match', matchDocuments);

// Chat routes
router.use('/api', chatRoutes);

export default router; 