import { Router } from "express";
import { createDocument, deleteDocument, getDocument, listDocuments, matchDocuments } from "../controllers/documentController";
import { chat } from "../controllers/chatController";

const router = Router();

router.get('/', listDocuments);
router.post('/', createDocument);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);
router.post('/match', matchDocuments);
router.post('/chat', chat);
export default router;