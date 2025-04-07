import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Request, Response } from 'express';
import { chat } from '../controllers/chatController';
import { processChatRequest } from '../services/chatService';

// Mock types
type MockResponse = {
    json: jest.Mock;
    status: jest.Mock;
};

// Mock chat service
jest.mock('../services/chatService', () => ({
    processChatRequest: jest.fn()
}));

describe('Chat Controller', () => {
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
    });

    describe('chat', () => {
        it('should process a chat request successfully', async () => {
            const mockResponse = { answer: 'Test response', sources: [] };
            const mockChatService = jest.spyOn(require('../services/chatService'), 'processChatRequest');
            mockChatService.mockResolvedValue(mockResponse);

            mockReq = {
                body: {
                    query: 'test query',
                    limit: 5
                }
            };

            await chat(mockReq as Request, mockRes as unknown as Response);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(mockResponse);
        });

        it('should handle missing query parameter', async () => {
            mockReq = {
                body: {
                    limit: 5
                }
            };

            await chat(mockReq as Request, mockRes as unknown as Response);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Query is required' });
        });

        it('should use default limit if not provided', async () => {
            const mockResponse = { answer: 'Test response', sources: [] };
            const mockChatService = jest.spyOn(require('../services/chatService'), 'processChatRequest');
            mockChatService.mockResolvedValue(mockResponse);

            mockReq = {
                body: {
                    query: 'test query'
                }
            };

            await chat(mockReq as Request, mockRes as unknown as Response);
            expect(processChatRequest).toHaveBeenCalledWith('test query', 5);
        });

        it('should handle errors', async () => {
            const mockError = new Error('Chat processing failed');
            const mockChatService = jest.spyOn(require('../services/chatService'), 'processChatRequest');
            mockChatService.mockRejectedValue(mockError);

            mockReq = {
                body: {
                    query: 'test query',
                    limit: 5
                }
            };

            await chat(mockReq as Request, mockRes as unknown as Response);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Internal server error',
                details: mockError
            });
        });
    });
}); 