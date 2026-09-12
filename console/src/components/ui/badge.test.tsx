import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './badge';

describe('Badge UI Primitive Unit Tests', () => {
  it('renders badge text content correctly', () => {
    render(<Badge variant="success">Active</Badge>);
    const badgeElement = screen.getByText(/active/i);
    expect(badgeElement).toBeInTheDocument();
  });
});
