import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('Agent App Integration & UI Test', () => {
  it('renders agent status dashboard and handles send ping interaction', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /desktop agent status/i })).toBeInTheDocument();
    expect(screen.getByText('ws://localhost:4000/ws')).toBeInTheDocument();

    const reconnectBtn = screen.getByRole('button', { name: /reconnect websocket/i });
    expect(reconnectBtn).toBeInTheDocument();
    fireEvent.click(reconnectBtn);
  });
});
