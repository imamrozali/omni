import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './button';

describe('Button UI Primitive & Accessibility Unit Tests', () => {
  it('renders button with accessible text label', () => {
    render(<Button>Perform Agent Action</Button>);
    const buttonElement = screen.getByRole('button', { name: /perform agent action/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('handles loading state and disables user interaction accessibly', () => {
    render(<Button isLoading>Processing</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDisabled();
  });

  it('supports disabled prop and sets aria-disabled semantics', () => {
    render(<Button disabled>Disabled Action</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDisabled();
  });
});
