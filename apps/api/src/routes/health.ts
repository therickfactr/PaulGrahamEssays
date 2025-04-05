import { Router } from 'express';

const router = Router();

// Health check route
router.get('/', (req, res) => {
  return res.status(200).json({ 
    status: 'ok',
    message: 'Welcome to the Paul Graham Essays API',
    version: '1.0.0',
    timestamp: new Date().toISOString() 
  });
});

export default router; 