import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Request, Response } from 'express';
import { healthCheck } from '../controllers/healthController';

describe('Health Controller', () => {
    let mockReq: Partial<Request>;
    let mockRes: { json: jest.Mock; status: jest.Mock };
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

    describe('healthCheck', () => {
        it('should return health status', async () => {
            mockReq = {};
            await healthCheck(mockReq as Request, mockRes as unknown as Response);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                status: 'ok'
            });
        });
    });
}); 