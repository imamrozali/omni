import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppShell } from './AppShell';

describe('AppShell Layout Unit & Accessibility Tests', () => {
  it('renders header, title, and navigation accessibly', () => {
    render(
      <AppShell>
        <div>Content Body</div>
      </AppShell>,
    );

    expect(screen.getByText('omni')).toBeInTheDocument();
    expect(screen.getByText('console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /overview & health/i })).toBeInTheDocument();
    expect(screen.getByText('Content Body')).toBeInTheDocument();
  });
});
