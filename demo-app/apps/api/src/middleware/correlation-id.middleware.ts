import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export const CORRELATION_ID_HEADER = 'x-correlation-id';

// Correlation ID validation: alphanumeric, dashes, underscores, max 128 chars
const CORRELATION_ID_REGEX = /^[\w-]{1,128}$/;

// Extend Express Request to include correlationId
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      correlationId?: string;
    }
  }
}

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const headerValue = req.headers[CORRELATION_ID_HEADER] as string;

    // Validate correlation ID format to prevent log injection
    const isValid = headerValue && CORRELATION_ID_REGEX.test(headerValue);
    const correlationId = isValid ? headerValue : randomUUID();

    // Set on request for downstream use
    req.correlationId = correlationId;

    // Return in response header
    res.setHeader(CORRELATION_ID_HEADER, correlationId);

    next();
  }
}
