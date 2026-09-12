import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Card } from '../ui/card.js';
import { Badge } from '../ui/badge.js';
import { Button } from '../ui/button.js';

export interface FormattedByteUnits {
  bytes: number;
  b: string;
  kb: string;
  mb: string;
  gb: string;
  tb: string;
  human: string;
}

export interface StorageStatsData {
  totalBytes: number;
  freeBytes: number;
  usedBytes: number;
  storageUsedBytes: number;
  usedPercentage: number;
  used: FormattedByteUnits;
  free: FormattedByteUnits;
  storageUsed?: FormattedByteUnits;
  total: FormattedByteUnits;
}

interface StorageWidgetProps {
  serverUrl?: string;
}

export const StorageWidget: React.FC<StorageWidgetProps> = ({ serverUrl = 'http://localhost:4000' }) => {
  const [stats, setStats] = useState<StorageStatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<'human' | 'gb' | 'mb' | 'kb' | 'b'>('human');
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchStats = useCallback(async () => {
    if (!isMountedRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${serverUrl}/api/v1/storage/stats`);
      if (!res.ok) {
        throw new Error(`Failed to load storage stats (${res.status})`);
      }
      const payload = (await res.json()) as { success?: boolean; data?: StorageStatsData };
      if (isMountedRef.current) {
        if (payload.success && payload.data) {
          setStats(payload.data);
        } else {
          throw new Error('Invalid storage response format');
        }
      }
    } catch (err: unknown) {
      if (isMountedRef.current) {
        const message = err instanceof Error ? err.message : 'Storage error';
        setError(message);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [serverUrl]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const getValue = (units: FormattedByteUnits | undefined) => {
    if (!units) return '0 B';
    if (selectedUnit === 'gb') return units.gb;
    if (selectedUnit === 'mb') return units.mb;
    if (selectedUnit === 'kb') return units.kb;
    if (selectedUnit === 'b') return units.b;
    return units.human;
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 75) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <Card className="p-4 bg-[#161b22] border border-[#30363d] text-[#c9d1d9] shadow-md rounded-lg" data-testid="storage-widget">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white tracking-wide">Storage Capacity & Usage</h3>
          <Badge variant={stats && stats.usedPercentage > 90 ? 'destructive' : 'secondary'}>
            {stats ? `${stats.usedPercentage}% Used` : 'Loading'}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <div className="inline-flex text-xs rounded border border-[#30363d] overflow-hidden bg-[#0d1117]">
            {(['human', 'gb', 'mb', 'kb', 'b'] as const).map((unit) => (
              <button
                key={unit}
                onClick={() => setSelectedUnit(unit)}
                className={`px-2 py-0.5 uppercase text-[10px] font-mono transition-colors ${
                  selectedUnit === unit ? 'bg-[#21262d] text-white font-bold' : 'text-[#8b949e] hover:text-[#c9d1d9]'
                }`}
              >
                {unit}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={fetchStats} disabled={loading} aria-label="Refresh Storage Stats">
            ↻
          </Button>
        </div>
      </div>

      {loading && <div className="text-xs text-[#8b949e] py-2">Reading storage stats...</div>}
      {error && <div className="text-xs text-red-400 py-2">Error: {error}</div>}

      {stats && !loading && (
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="w-full bg-[#21262d] h-2.5 rounded-full overflow-hidden border border-[#30363d]">
            <div
              className={`h-full transition-all duration-500 ${getProgressColor(stats.usedPercentage)}`}
              style={{ width: `${Math.min(100, Math.max(0, stats.usedPercentage))}%` }}
              role="progressbar"
              aria-valuenow={stats.usedPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Space Kosong Tersisa */}
            <div className="p-2.5 rounded bg-[#0d1117] border border-[#21262d]">
              <span className="text-[11px] text-[#8b949e] block font-medium">Space Kosong (Free)</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">{getValue(stats.free)}</span>
              <span className="text-[10px] text-[#8b949e] block mt-0.5 font-mono">{stats.free.b}</span>
            </div>

            {/* Ruang Terpakai (Total Disk) */}
            <div className="p-2.5 rounded bg-[#0d1117] border border-[#21262d]">
              <span className="text-[11px] text-[#8b949e] block font-medium">Disk Terpakai (Used)</span>
              <span className="text-sm font-bold text-amber-400 font-mono">{getValue(stats.used)}</span>
              <span className="text-[10px] text-[#8b949e] block mt-0.5 font-mono">{stats.used.b}</span>
            </div>

            {/* Omni Storage Media Folder Size */}
            <div className="p-2.5 rounded bg-[#0d1117] border border-[#21262d]">
              <span className="text-[11px] text-[#8b949e] block font-medium">Penyimpanan Media Omni</span>
              <span className="text-sm font-bold text-white font-mono">{getValue(stats.storageUsed || stats.used)}</span>
              <span className="text-[10px] text-[#8b949e] block mt-0.5 font-mono">
                Total Disk: {getValue(stats.total)}
              </span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
