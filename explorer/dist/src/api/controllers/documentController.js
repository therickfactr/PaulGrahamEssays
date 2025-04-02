"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentController = void 0;
const document_1 = require("langchain/document");
class DocumentController {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
        this.getAllDocuments = async (req, res) => {
            try {
                const documents = await this.supabaseService.getAllDocuments();
                res.json(documents);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch documents' });
            }
        };
        this.getDocumentById = async (req, res) => {
            try {
                const document = await this.supabaseService.getDocumentById(req.params.id);
                if (!document) {
                    return res.status(404).json({ error: 'Document not found' });
                }
                res.json(document);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch document' });
            }
        };
        this.createDocument = async (req, res) => {
            try {
                const document = new document_1.Document({
                    pageContent: req.body.content,
                    metadata: req.body.metadata || {},
                });
                const createdDocument = await this.supabaseService.createDocument(document);
                res.status(201).json(createdDocument);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to create document' });
            }
        };
        this.updateDocument = async (req, res) => {
            try {
                const document = new document_1.Document({
                    pageContent: req.body.content,
                    metadata: req.body.metadata || {},
                });
                const updatedDocument = await this.supabaseService.updateDocument(req.params.id, document);
                if (!updatedDocument) {
                    return res.status(404).json({ error: 'Document not found' });
                }
                res.json(updatedDocument);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to update document' });
            }
        };
        this.deleteDocument = async (req, res) => {
            try {
                await this.supabaseService.deleteDocument(req.params.id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to delete document' });
            }
        };
        this.matchDocuments = async (req, res) => {
            try {
                const { query, k } = req.body;
                if (!query) {
                    return res.status(400).json({ error: 'Query is required' });
                }
                const matches = await this.supabaseService.matchDocuments(query, k || 5);
                res.json(matches);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to match documents' });
            }
        };
    }
}
exports.DocumentController = DocumentController;
//# sourceMappingURL=documentController.js.map