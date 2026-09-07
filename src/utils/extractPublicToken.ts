const UUID_RE =
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;

export const extractPublicToken = (raw: string): string | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (UUID_RE.test(trimmed) && trimmed.length === 36) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const match = url.pathname.match(/\/pase\/([^/]+)/i);
    if (match?.[1] && UUID_RE.test(match[1])) {
      return match[1];
    }
  } catch {
    const match = trimmed.match(/\/pase\/([^/?#]+)/i);
    if (match?.[1] && UUID_RE.test(match[1])) {
      return match[1];
    }
  }

  const found = trimmed.match(UUID_RE);
  return found ? found[0] : null;
};
