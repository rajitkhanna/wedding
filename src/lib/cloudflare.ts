const ZONE = process.env.NEXT_PUBLIC_CLOUDFLARE_ZONE;

/**
 * Build a Cloudflare Image Transformation URL.
 * Cloudflare fetches from source, optimizes (AVIF/WebP), and caches.
 *
 * @param imageUrl  Full URL to the source image (from InstantDB, S3, etc.)
 * @param options   Transform options
 */
export function cld(
  imageUrl: string,
  options?: { width?: number; height?: number; quality?: number },
): string {
  if (!ZONE) {
    console.warn("NEXT_PUBLIC_CLOUDFLARE_ZONE is not set");
    return imageUrl;
  }

  const params = new URLSearchParams();
  if (options?.width) params.set("width", String(options.width));
  if (options?.height) params.set("height", String(options.height));
  if (options?.quality) params.set("quality", String(options.quality));

  const encoded = encodeURIComponent(imageUrl);
  return `https://imagedelivery.net/${ZONE}/${encoded}${params.toString() ? `?${params}` : ""}`;
}
