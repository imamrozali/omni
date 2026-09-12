import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { apiClient } from '@/services/api/client';

describe('Console App Integration & UI Test', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders overview dashboard and triggers health refresh on button click', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValue({
      success: true,
      data: {
        status: 'ok',
        timestamp: '2026-09-13T02:00:00.000Z',
        uptime: 120,
        environment: 'development',
      },
    });

    await act(async () => {
      render(<App />);
    });

    expect(screen.getByRole('heading', { name: /system overview & health/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('120s')).toBeInTheDocument();
    });

    const refreshBtn = screen.getByRole('button', { name: /refresh status/i });

    await act(async () => {
      fireEvent.click(refreshBtn);
    });

    expect(apiClient.get).toHaveBeenCalledWith('/health');
  });
});
