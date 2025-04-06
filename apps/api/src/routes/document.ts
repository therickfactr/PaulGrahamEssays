import { Router } from 'express';

const router = Router();

// Define your API endpoints here
router.get('/documents', (_req, res) => {
    res.send('List of documents');
});

router.post('/documents', (_req, res) => {
    res.send('Create a new document');
});

export default router;
