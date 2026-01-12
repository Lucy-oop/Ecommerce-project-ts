// src/utlis/image.ts
export function imagePathFromApi(path: string): string {
  if (!path) return "";

  // Keep absolute URLs
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  // If backend returns "/images/..." keep it
  if (path.startsWith("/images/")) return path;

  // If backend returns "images/..." convert to "/images/..."
  if (path.startsWith("images/")) return `/${path}`;

  // Fallback
  return path;
}

