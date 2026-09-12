import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card, CardHeader, CardTitle, CardContent } from './card';

describe('Agent Card UI Primitive Unit Tests', () => {
  it('renders card container with title accessibly', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Native Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Active</p>
        </CardContent>
      </Card>,
    );

    expect(screen.getByRole('heading', { name: /native status/i })).toBeInTheDocument();
  });
});
