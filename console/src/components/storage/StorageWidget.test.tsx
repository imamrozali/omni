import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StorageWidget } from './StorageWidget.js';

describe('StorageWidget (Console)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches and displays storage used space and free space in B, KB, MB, GB format', async () => {
    const mockStats = {
      totalBytes: 107374182400,
      freeBytes: 96636764160,
      usedBytes: 10737418240,
      storageUsedBytes: 524288000,
      usedPercentage: 10,
      used: { bytes: 10737418240, b: '10737418240 B', kb: '10485760.00 KB', mb: '10240.00 MB', gb: '10.00 GB', tb: '0.01 TB', human: '10 GB' },
      free: { bytes: 96636764160, b: '96636764160 B', kb: '94371840.00 KB', mb: '92160.00 MB', gb: '90.00 GB', tb: '0.09 TB', human: '90 GB' },
      storageUsed: { bytes: 524288000, b: '524288000 B', kb: '512000.00 KB', mb: '500.00 MB', gb: '0.49 GB', tb: '0.00 TB', human: '500 MB' },
      total: { bytes: 107374182400, b: '107374182400 B', kb: '104857600.00 KB', mb: '102400.00 MB', gb: '100.00 GB', tb: '0.10 TB', human: '100 GB' },
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockStats }),
    } as Response);

    render(<StorageWidget serverUrl="http://localhost:4000" />);

    expect(screen.getByTestId('storage-widget')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Disk Terpakai (Used)')).toBeInTheDocument();
      expect(screen.getByText('Space Kosong (Free)')).toBeInTheDocument();
    });

    expect(screen.getByText('10 GB')).toBeInTheDocument();
    expect(screen.getByText('90 GB')).toBeInTheDocument();

    // Switch unit to GB
    const gbButton = screen.getByRole('button', { name: /gb/i });
    fireEvent.click(gbButton);

    expect(screen.getByText('10.00 GB')).toBeInTheDocument();
    expect(screen.getByText('90.00 GB')).toBeInTheDocument();
  });
});
