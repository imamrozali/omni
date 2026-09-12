export interface FormattedByteUnits {
  bytes: number;
  b: string;
  kb: string;
  mb: string;
  gb: string;
  tb: string;
  human: string;
}

/**
 * Formats a byte number into detailed units (B, KB, MB, GB, TB) and a human-readable string.
 */
export function formatBytes(bytes: number, decimals = 2): FormattedByteUnits {
  const safeBytes = Math.max(0, bytes);
  const dm = decimals < 0 ? 0 : decimals;

  const b = `${safeBytes} B`;
  const kb = `${(safeBytes / 1024).toFixed(dm)} KB`;
  const mb = `${(safeBytes / (1024 * 1024)).toFixed(dm)} MB`;
  const gb = `${(safeBytes / (1024 * 1024 * 1024)).toFixed(dm)} GB`;
  const tb = `${(safeBytes / (1024 * 1024 * 1024 * 1024)).toFixed(dm)} TB`;

  if (safeBytes === 0) {
    return { bytes: 0, b, kb, mb, gb, tb, human: '0 B' };
  }

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(safeBytes) / Math.log(k));
  const index = Math.min(i, sizes.length - 1);
  const humanValue = parseFloat((safeBytes / Math.pow(k, index)).toFixed(dm));
  const human = `${humanValue} ${sizes[index]}`;

  return {
    bytes: safeBytes,
    b,
    kb,
    mb,
    gb,
    tb,
    human,
  };
}
