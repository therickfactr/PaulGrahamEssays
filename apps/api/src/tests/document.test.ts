// @ts-nocheck
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Request, Response } from 'express';
import {
    createDocument,
    deleteDocument,
    getDocument,
    listDocuments,
    matchDocuments
} from '../controllers/documentController';
import getSupabase from '../lib/supabase';
import getVectorStore from '../lib/vectorStore';

// Mock types
type MockResponse = {
    json: jest.Mock;
    status: jest.Mock;
};

interface Document {
    id: string;
    content: string;
}

type SupabaseResponse<T> = {
    data: T;
    error: null | Error;
};

// Mock Supabase client
jest.mock('../lib/supabase', () => {
    const mockOrder = jest.fn().mockResolvedValue({
        data: [{
            id: '1',
            content: 'Test Document'
        }],
        error: null
    } as never);
    const mockSingle = jest.fn().mockResolvedValue({
        data: {
            id: '1',
            content: 'Test Document'
        },
        error: null
    } as never);
    const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = jest.fn().mockReturnValue({ order: mockOrder, eq: mockEq });
    const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({
            data: {
                id: '1',
                content: 'Test Document'
            },
            error: null
        } as never)
    });
    const mockDelete = jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue({ data: null, error: null } as never) });
    const mockFrom = jest.fn().mockReturnValue({ select: mockSelect, insert: mockInsert, delete: mockDelete });

    return {
        __esModule: true,
        default: jest.fn().mockReturnValue({ from: mockFrom })
    };
});

// Mock Vector Store
jest.mock('../lib/vectorStore', () => {
    const mockAddDocuments = jest.fn().mockResolvedValue(['1'] as never);
    const mockDelete = jest.fn().mockResolvedValue(true as never);
    const mockSimilaritySearch = jest.fn().mockResolvedValue([{ pageContent: 'Test Document', metadata: {} }] as never);

    return {
        __esModule: true,
        default: jest.fn().mockReturnValue({
            addDocuments: mockAddDocuments,
            delete: mockDelete,
            similaritySearch: mockSimilaritySearch
        })
    };
});

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
        it('should return a list of documents', async () => {
            mockReq = {};
            await listDocuments(mockReq as Request, mockRes as unknown as Response);

            const mockFrom = getSupabase().from;
            const mockSelect = mockFrom().select;
            const mockOrder = mockSelect().order;

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
            await getDocument(mockReq as Request<{ id: string }>, mockRes as unknown as Response);

            const mockFrom = getSupabase().from;
            const mockSelect = mockFrom().select;
            const mockEq = mockSelect().eq;
            const mockSingle = mockEq().single;

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

        it('should return 404 for non-existent document', async () => {
            const mockErrorResponse: SupabaseResponse<Document> = {
                data: null as any,
                error: new Error('Not found')
            };

            const mockFrom = getSupabase().from;
            const mockSelect = mockFrom().select;
            const mockEq = mockSelect().eq;
            mockEq().single.mockResolvedValueOnce(mockErrorResponse as never);

            mockReq = {
                params: { id: '999' }
            };
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
            await createDocument(mockReq as Request, mockRes as unknown as Response);

            const mockFrom = getSupabase().from;
            const mockInsert = mockFrom().insert;

            expect(mockFrom).toHaveBeenCalledWith('documents');
            //expect(mockInsert).toHaveBeenCalledWith([{ content: 'New Document' }]);
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
        it.skip('should delete a document', async () => {
            mockReq = {
                params: { id: '1' }
            };
            await deleteDocument(mockReq as Request<{ id: string }>, mockRes as unknown as Response);

            const mockFrom = getSupabase().from;
            const mockDelete = mockFrom().delete;

            expect(mockFrom).toHaveBeenCalledWith('documents');
            expect(mockDelete).toHaveBeenCalled();
            expect(mockDelete().eq).toHaveBeenCalledWith('id', '1');
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

            const mockVectorStore = getVectorStore();
            expect(mockVectorStore.similaritySearch).toHaveBeenCalledWith('test query', 5);
            expect(mockJson).toHaveBeenCalledWith({
                matches: [{ pageContent: 'Test Document', metadata: {} }]
            });
        });
    });
}); 