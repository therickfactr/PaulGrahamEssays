import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import routes from './routes';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3081;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  return res.status(500).json({
    error: 'Something went wrong!',
    details: err
  });
});

app.listen(port, () => {
  console.info(`Server is running on port ${port}`);
}); 