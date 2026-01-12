// src/utlis/image.ts
export function imagePathFromApi(imagePath: string): string {
  if (!imagePath) return "";

  // Already absolute
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Make sure it starts with /
  const normalized = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

  // Backend base (default to localhost:3000)
  const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

  return `${baseUrl}${normalized}`;
}
