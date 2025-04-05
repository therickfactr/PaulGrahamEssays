import { Router } from 'express';

const router = Router();

// Define your API endpoints here
router.get('/documents', (req, res) => {
    res.send('List of documents');
});

router.post('/documents', (req, res) => {
    res.send('Create a new document');
});

export default router;
