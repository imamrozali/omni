import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('Agent cn Utility Unit Tests', () => {
  it('should merge class names correctly using clsx and tailwind-merge', () => {
    const result = cn('flex flex-col', 'p-4', { 'hidden': false });
    expect(result).toContain('flex-col');
    expect(result).toContain('p-4');
  });
});
