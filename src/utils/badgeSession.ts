const BADGE_TOKEN_KEY = 'BadgeToken';

export const readBadgeToken = (): string | null => {
  const value = localStorage.getItem(BADGE_TOKEN_KEY);
  return value?.trim() || null;
};

export const saveBadgeToken = (token: string) => {
  const trimmed = token.trim();
  if (trimmed) {
    localStorage.setItem(BADGE_TOKEN_KEY, trimmed);
  }
};

export const clearBadgeToken = () => {
  localStorage.removeItem(BADGE_TOKEN_KEY);
};

export const badgePath = (): string => {
  const token = readBadgeToken();
  return token ? `/pase/${token}` : '/pase';
};
