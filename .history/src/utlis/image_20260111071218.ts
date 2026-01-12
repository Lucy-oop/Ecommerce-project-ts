// src/utils/image.ts
export function imagePathFromApi(path: string): string {
  // If backend already returns "/images/...." or "http://...." keep it
  if (path.startsWith("http")) return path;
  if (path.startsWith("/images")) return path;

  // If backend returns "images/...." make it "/images/...."
  if (path.startsWith("images/")) return `/${path}`;

  // fallback
  return path;
}
