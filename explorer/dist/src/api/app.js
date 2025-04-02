"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const documentController_1 = require("./controllers/documentController");
const supabaseService_1 = require("./services/supabaseService");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Request logging middleware
const requestLogger = (req, res, next) => {
    const start = Date.now();
    const { method, url, ip } = req;
    // Log request start
    console.log(`[${new Date().toISOString()}] ${method} ${url} from ${ip}`);
    // Log request body if present
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Request body:', JSON.stringify(req.body, null, 2));
    }
    // Log request query parameters if present
    if (req.query && Object.keys(req.query).length > 0) {
        console.log('Query parameters:', JSON.stringify(req.query, null, 2));
    }
    // Log response
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${method} ${url} - ${res.statusCode} ${duration}ms`);
    });
    next();
};
// Check if API_URL is set
if (!process.env.API_URL) {
    throw new Error('API_URL is not set');
}
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(requestLogger);
// Initialize services
const supabaseService = new supabaseService_1.SupabaseService();
const documentController = new documentController_1.DocumentController(supabaseService);
// Routes
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the Document API',
        apiUrl: process.env.API_URL,
        time: new Date().toISOString()
    });
});
app.get('/documents', documentController.getAllDocuments);
app.get('/documents/:id', documentController.getDocumentById);
app.post('/documents', documentController.createDocument);
app.put('/documents/:id', documentController.updateDocument);
app.delete('/documents/:id', documentController.deleteDocument);
app.post('/documents/match', documentController.matchDocuments);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});
// Start server
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error);
});
//# sourceMappingURL=app.js.map