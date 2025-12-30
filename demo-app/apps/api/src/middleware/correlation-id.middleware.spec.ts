import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import {
  CorrelationIdMiddleware,
  CORRELATION_ID_HEADER,
} from './correlation-id.middleware';

describe('CorrelationIdMiddleware', () => {
  let middleware: CorrelationIdMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    middleware = new CorrelationIdMiddleware();
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      setHeader: vi.fn(),
    };
    nextFunction = vi.fn();
  });

  it('should generate UUID if no correlation ID header present', () => {
    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockRequest.correlationId).toBeDefined();
    expect(mockRequest.correlationId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should use existing valid correlation ID from request header', () => {
    const existingId = 'existing-correlation-id-123';
    mockRequest.headers = { [CORRELATION_ID_HEADER]: existingId };

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockRequest.correlationId).toBe(existingId);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should reject and replace correlation ID with invalid characters', () => {
    const maliciousId = 'malicious<script>alert(1)</script>';
    mockRequest.headers = { [CORRELATION_ID_HEADER]: maliciousId };

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockRequest.correlationId).not.toBe(maliciousId);
    expect(mockRequest.correlationId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });

  it('should reject and replace correlation ID that is too long', () => {
    const longId = 'a'.repeat(129);
    mockRequest.headers = { [CORRELATION_ID_HEADER]: longId };

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockRequest.correlationId).not.toBe(longId);
    expect(mockRequest.correlationId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });

  it('should accept valid UUID as correlation ID', () => {
    const validUuid = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    mockRequest.headers = { [CORRELATION_ID_HEADER]: validUuid };

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockRequest.correlationId).toBe(validUuid);
  });

  it('should set correlation ID on response header', () => {
    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockResponse.setHeader).toHaveBeenCalledWith(
      CORRELATION_ID_HEADER,
      mockRequest.correlationId,
    );
  });

  it('should call next function', () => {
    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(nextFunction).toHaveBeenCalledTimes(1);
  });
});
