/** Use the compressed WebP sibling for local catalog JPGs. */
export function catalogSrc(url: string | null | undefined): string {
  if (!url) return "";

  if (url.startsWith("/images/") && /\.jpe?g$/i.test(url)) {
    return url.replace(/\.jpe?g$/i, ".webp");
  }

  try {
    if (url.includes("images.unsplash.com")) {
      const parsed = new URL(url);
      parsed.searchParams.set("w", "480");
      parsed.searchParams.set("h", "480");
      parsed.searchParams.set("q", "70");
      parsed.searchParams.set("auto", "format");
      return parsed.toString();
    }
    if (url.includes("images.pexels.com")) {
      return url
        .replace(/([?&])w=\d+/g, "$1w=480")
        .replace(/([?&])h=\d+/g, "$1h=480");
    }
  } catch {
    return url;
  }

  return url;
}
