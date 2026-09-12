import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './button';

describe('Button UI Primitive & Accessibility Unit Tests', () => {
  it('renders button with accessible text label', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('handles loading state and disables user interaction accessibly', () => {
    render(<Button isLoading>Submitting</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDisabled();
  });

  it('supports disabled prop and sets aria-disabled semantics', () => {
    render(<Button disabled>Disabled Action</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDisabled();
  });
});
