import { Router } from 'express';
import { healthz } from '../controllers/healthzController';

const router = Router();

// Health check route
router.get('/', healthz);

export default router; 