import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import documentRoutes from './routes/document';
import chatRoutes from './routes/chat';
import healthRoutes from './routes/health';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(routes);
app.use('/api/documents', documentRoutes);
app.use('/api/documents', chatRoutes);
app.use('/api', healthRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 