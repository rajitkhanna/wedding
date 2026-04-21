const ZONE = process.env.NEXT_PUBLIC_CLOUDFLARE_ZONE ?? "meghanarajit.com";

export function cld(
  imageUrl: string,
  options?: { width?: number; height?: number; quality?: number },
): string {
  if (!ZONE) return imageUrl;

  const parts: string[] = [];
  if (options?.width) parts.push(`width=${options.width}`);
  if (options?.height) parts.push(`height=${options.height}`);
  if (options?.quality) parts.push(`quality=${options.quality}`);
  const opts = parts.length ? parts.join(",") : "format=auto";

  return `https://${ZONE}/cdn-cgi/image/${opts}/${imageUrl}`;
}
