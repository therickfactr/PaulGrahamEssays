jest.mock('@supabase/postgrest-js');
jest.mock('@supabase/supabase-js');
jest.mock('@langchain/community/vectorstores/supabase');

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Request, Response } from 'express';
import {
    createDocument,
    deleteDocument,
    getDocument,
    listDocuments,
    matchDocuments
} from '../controllers/documentsController';

import { getSupabaseClient, getSupabaseVectorStore } from '../lib';

// Mock types
type MockResponse = {
    json: jest.Mock;
    status: jest.Mock;
};

// // Mock Vector Store
// jest.mock('../lib/vectorStore', () => {
//     const mockAddDocuments = jest.fn().mockResolvedValue(['1'] as never);
//     const mockDelete = jest.fn().mockResolvedValue(true as never);
//     const mockSimilaritySearch = jest.fn().mockResolvedValue([{ pageContent: 'Test Document', metadata: {} }] as never);

//     return {
//         __esModule: true,
//         default: jest.fn().mockReturnValue({
//             addDocuments: mockAddDocuments,
//             delete: mockDelete,
//             similaritySearch: mockSimilaritySearch
//         })
//     };
// });

describe('Document Controller', () => {
    let mockReq: Partial<Request>;
    let mockRes: MockResponse;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnThis();
        mockRes = {
            json: mockJson,
            status: mockStatus
        };
        jest.clearAllMocks();
    });

    describe('listDocuments', () => {
        it.only('should return a list of documents', async () => {
            mockReq = mockReq as Request;

            const mockOrder = jest.spyOn(getSupabaseClient().from('documents').select('*'), 'order');
            const mockSelect = jest.spyOn(getSupabaseClient().from('documents'), 'select');
            const mockFrom = jest.spyOn(getSupabaseClient(), 'from');

            await listDocuments(mockReq as Request, mockRes as unknown as Response);

            expect(mockFrom).toHaveBeenCalledWith('documents');
            expect(mockSelect).toHaveBeenCalledWith('*');
            expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
            expect(mockJson).toHaveBeenCalledWith([{
                id: '1',
                content: 'Test Document'
            }]);
        });
    });

    describe('getDocument', () => {
        it.skip('should return a document by id', async () => {
            mockReq = {
                params: { id: '1' }
            };

            const mockSingle = jest.spyOn(getSupabaseClient().from('documents').select('*').eq('id', '1'), 'single');
            const mockEq = jest.spyOn(getSupabaseClient().from('documents').select('*'), 'eq');
            const mockSelect = jest.spyOn(getSupabaseClient().from('documents'), 'select');
            const mockFrom = jest.spyOn(getSupabaseClient(), 'from');

            await getDocument(mockReq as Request<{ id: string }>, mockRes as unknown as Response);

            expect(mockFrom).toHaveBeenCalledWith('documents');
            expect(mockSelect).toHaveBeenCalledWith('*');
            expect(mockEq).toHaveBeenCalledWith('id', '1');
            expect(mockSingle).toHaveBeenCalled();
            expect(mockJson).toHaveBeenCalledWith({
                data: {
                    id: '1',
                    content: 'Test Document'
                },
                error: null
            });
        });

        it.skip('should return 404 for non-existent document', async () => {
            mockReq = { params: { id: '999' } };

            await getDocument(mockReq as Request<{ id: string }>, mockRes as unknown as Response);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Document not found' });
        });
    });

    describe('createDocument', () => {
        it.skip('should create a new document', async () => {
            mockReq = {
                body: {
                    content: 'New Document'
                }
            };

            const mockInsert = jest.spyOn(getSupabaseClient().from('documents'), 'insert');
            const mockFrom = jest.spyOn(getSupabaseClient(), 'from');

            await createDocument(mockReq as Request, mockRes as unknown as Response);

            expect(mockFrom).toHaveBeenCalledWith('documents');
            expect(mockInsert).toHaveBeenCalledWith([{ content: 'New Document' }]);

            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith({
                data: {
                    id: '1',
                    content: 'Test Document'
                },
                error: null
            });
        });
    });

    describe('deleteDocument', () => {
        it('should delete a document', async () => {
            mockReq = {
                params: { id: '1' }
            };
            await deleteDocument(mockReq as Request<{ id: string }>, mockRes as unknown as Response);

            const mockFrom = getSupabaseClient().from;
            const mockDelete = getSupabaseClient().from('documents').delete;
            const mockEq = mockDelete().eq;

            expect(mockFrom).toHaveBeenCalledWith('documents');
            expect(mockDelete).toHaveBeenCalled();
            expect(mockEq).toHaveBeenCalledWith('id', '1');
            expect(mockJson).toHaveBeenCalledWith({ id: '1' });
        });
    });

    describe('matchDocuments', () => {
        it('should return matching documents', async () => {
            mockReq = {
                body: {
                    query: 'test query',
                    limit: 5
                }
            };
            await matchDocuments(mockReq as Request, mockRes as unknown as Response);

            const mockVectorStore = await getSupabaseVectorStore();
            expect(mockVectorStore.similaritySearch).toHaveBeenCalledWith('test query', 5);
            expect(mockJson).toHaveBeenCalledWith({
                matches: [{ pageContent: 'Test Document', metadata: {} }]
            });
        });
    });
}); 