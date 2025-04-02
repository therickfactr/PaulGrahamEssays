import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DocumentController } from './controllers/documentController';
import { SupabaseService } from './services/supabaseService';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Request logging middleware
const requestLogger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const start = Date.now();
  const { method, url, ip } = req;
  
  // Log request start
  console.log(`[${new Date().toISOString()}] ${method} ${url} from ${ip}`);
  
  // Log request body if present
  if (Object.keys(req.body).length > 0) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  
  // Log request query parameters if present
  if (Object.keys(req.query).length > 0) {
    console.log('Query parameters:', JSON.stringify(req.query, null, 2));
  }
  
  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${method} ${url} - ${res.statusCode} ${duration}ms`);
  });
  
  next();
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Initialize services
const supabaseService = new SupabaseService();
const documentController = new DocumentController(supabaseService);

// Routes
app.get('/', (req, res) => {
  res.send(`Welcome to the Document API at ${req.url}. The current time is ${new Date().toISOString()}`);
});

app.get('/documents', documentController.getAllDocuments);
app.get('/documents/:id', documentController.getDocumentById);
app.post('/documents', documentController.createDocument);
app.put('/documents/:id', documentController.updateDocument);
app.delete('/documents/:id', documentController.deleteDocument);
app.post('/documents/match', documentController.matchDocuments);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handle server errors
server.on('error', (error: Error) => {
  console.error('Server error:', error);
}); 