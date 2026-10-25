/**
 * Transforms a Google Drive sharing URL into a direct image-link URL
 * that can be used in <img src="..."> tags.
 *
 * Handles these Drive URL formats:
 *   https://drive.google.com/file/d/<ID>/view?usp=sharing
 *   https://drive.google.com/file/d/<ID>/view
 *   https://drive.google.com/open?id=<ID>
 *   https://drive.google.com/uc?id=<ID>
 *   https://drive.google.com/thumbnail?id=<ID>&sz=w1000
 *   https://docs.google.com/document/d/<ID>/...
 *
 * If the URL is a direct image link (.jpg, .png, .webp, .gif, .jpeg),
 * it passes through unchanged.
 *
 * Returns the original string if it doesn't match any known pattern.
 */
export function normalizeDriveUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  // Direct image URL — pass through unchanged
  if (/\.(jpg|jpeg|png|webp|gif|avif|svg)(\?|$)/i.test(trimmed)) {
    return trimmed;
  }

  // Pattern 1: /file/d/<ID>/...
  const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w1000`;
  }

  // Pattern 2: open?id=<ID>
  const openMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch && trimmed.includes('drive.google.com')) {
    return `https://drive.google.com/thumbnail?id=${openMatch[1]}&sz=w1000`;
  }

  // Pattern 3: uc?id=<ID> or thumbnail?id=<ID> — normalize to thumbnail with sz
  const ucMatch = trimmed.match(/drive\.google\.com\/(?:uc|thumbnail)\?(?:[^&]*&)?id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) {
    return `https://drive.google.com/thumbnail?id=${ucMatch[1]}&sz=w1000`;
  }

  // Pattern 4: docs.google.com/document/d/<ID>/...
  const docsMatch = trimmed.match(/docs\.google\.com\/\w+\/d\/([a-zA-Z0-9_-]+)/);
  if (docsMatch) {
    return `https://drive.google.com/thumbnail?id=${docsMatch[1]}&sz=w1000`;
  }

  // Not a Drive link — return as-is
  return trimmed;
}
