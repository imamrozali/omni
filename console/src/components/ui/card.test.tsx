import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card, CardHeader, CardTitle, CardContent } from './card';

describe('Card UI Primitive & Accessibility Unit Tests', () => {
  it('renders card container with heading and content accessibly', () => {
    render(
      <Card>,
        <CardHeader>
          <CardTitle>System Diagnostics</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Running normally</p>
        </CardContent>
      </Card>,
    );

    const titleElement = screen.getByRole('heading', { name: /system diagnostics/i, level: 3 });
    expect(titleElement).toBeInTheDocument();
    expect(screen.getByText(/running normally/i)).toBeInTheDocument();
  });
});
