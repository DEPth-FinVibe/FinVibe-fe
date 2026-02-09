const DEFAULT_EXPIRY_BUFFER_MS = 60_000;

export function parseExpiresAtToMs(expiresAt?: string | null): number | null {
  if (!expiresAt) return null;

  const parsed = Date.parse(expiresAt);
  if (Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
}

export function isTokenExpiredOrExpiring(
  expiresAt?: string | null,
  bufferMs: number = DEFAULT_EXPIRY_BUFFER_MS,
): boolean {
  const expiresAtMs = parseExpiresAtToMs(expiresAt);
  if (expiresAtMs == null) return false;

  return expiresAtMs - Date.now() <= bufferMs;
}

export { DEFAULT_EXPIRY_BUFFER_MS };
