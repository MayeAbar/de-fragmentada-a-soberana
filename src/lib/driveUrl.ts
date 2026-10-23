/**
 * Transforms a Google Drive sharing URL into a direct image-link URL
 * that can be used in <img src="..."> tags.
 *
 * Handles:
 *   https://drive.google.com/file/d/<ID>/view?usp=sharing
 *   https://drive.google.com/open?id=<ID>
 *   https://drive.google.com/uc?id=<ID>
 *
 * Returns the original string if it doesn't look like a Drive link.
 */
export function normalizeDriveUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  // Pattern 1: /file/d/<ID>/...
  const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w1000`;
  }

  // Pattern 2: open?id=<ID>
  const openMatch = trimmed.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (openMatch) {
    return `https://drive.google.com/thumbnail?id=${openMatch[1]}&sz=w1000`;
  }

  // Pattern 3: uc?id=<ID> — already usable, just ensure sz param
  const ucMatch = trimmed.match(/drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) {
    return `https://drive.google.com/thumbnail?id=${ucMatch[1]}&sz=w1000`;
  }

  // Not a Drive link — return as-is
  return trimmed;
}
