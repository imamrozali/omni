import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('Console cn Utility Unit Tests', () => {
  it('should merge class names correctly using clsx and tailwind-merge', () => {
    const result = cn('px-2 py-1', 'bg-red-500', { 'text-white': true, 'hidden': false });
    expect(result).toContain('px-2');
    expect(result).toContain('bg-red-500');
    expect(result).toContain('text-white');
    expect(result).not.toContain('hidden');
  });

  it('should override conflicting tailwind utility classes', () => {
    const result = cn('px-2 px-4', 'bg-red-500 bg-blue-500');
    expect(result).toBe('px-4 bg-blue-500');
  });
});
