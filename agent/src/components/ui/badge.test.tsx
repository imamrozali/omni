import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './badge';

describe('Agent Badge UI Primitive Unit Tests', () => {
  it('renders badge text content', () => {
    render(<Badge variant="success">WS Online</Badge>);
    expect(screen.getByText(/ws online/i)).toBeInTheDocument();
  });
});
