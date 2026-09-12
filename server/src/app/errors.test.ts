import { describe, it, expect } from 'vitest';
import {
  AppError,
  ValidationError,
  NotFoundError,
  formatSuccessResponse,
  formatErrorResponse,
} from './errors.js';

describe('AppError & Response Formatters', () => {
  it('should construct AppError correctly', () => {
    const err = new AppError('Test error', 400, 'TEST_CODE');
    expect(err.message).toBe('Test error');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('TEST_CODE');
  });

  it('should construct ValidationError with 400 status', () => {
    const err = new ValidationError('Invalid payload');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('VALIDATION_ERROR');
  });

  it('should construct NotFoundError with 404 status', () => {
    const err = new NotFoundError('User not found');
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe('RESOURCE_NOT_FOUND');
  });

  it('should format success response correctly', () => {
    const response = formatSuccessResponse({ id: 123 });
    expect(response).toEqual({
      success: true,
      data: { id: 123 },
    });
  });

  it('should format error response correctly', () => {
    const response = formatErrorResponse('ERR_CODE', 'Custom error message');
    expect(response).toEqual({
      success: false,
      error: {
        code: 'ERR_CODE',
        message: 'Custom error message',
      },
    });
  });
});
