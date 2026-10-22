const STORAGE_KEY = 'dfs_favorites';

export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

export function toggleFavorite(id: string): boolean {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx >= 0) {
    favs.splice(idx, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
    return false;
  }
  favs.push(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
  return true;
}
