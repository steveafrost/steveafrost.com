import { readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';

export const landscapeImage = {
  src: '/river-assets/river-full-bleed.png',
  alt: 'An illustrated river winding past wooded banks, an arched bridge, and an Ann Arbor inspired skyline.',
};

/** Read crawler-compatible raster dimensions from the existing public asset. */
function rasterMetadata(bytes) {
  if (bytes.length >= 24 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), type: 'image/png' };
  }
  if (bytes.length >= 10 && /^GIF8[79]a$/.test(bytes.toString('ascii', 0, 6))) {
    return { width: bytes.readUInt16LE(6), height: bytes.readUInt16LE(8), type: 'image/gif' };
  }
  if (bytes[0] === 255 && bytes[1] === 216) {
    let offset = 2;
    while (offset + 4 < bytes.length) {
      if (bytes[offset++] !== 255) break;
      while (bytes[offset] === 255) offset++;
      const marker = bytes[offset++];
      if (marker === 217 || marker === 218) break;
      if (marker === 1 || (marker >= 208 && marker <= 215)) continue;
      const length = bytes.readUInt16BE(offset);
      if (length < 2 || offset + length > bytes.length) break;
      if ([192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 206, 207].includes(marker) && length >= 8) {
        return { height: bytes.readUInt16BE(offset + 3), width: bytes.readUInt16BE(offset + 5), type: 'image/jpeg' };
      }
      offset += length;
    }
  }
  return null;
}

/** Resolve only existing public images; reject broken paths and external URLs. */
export function resolveSocialImage(src, alt, site, publicDirectory = resolve('public')) {
  try {
    const url = new URL(src, site);
    if (url.origin !== new URL(site).origin || url.protocol !== 'https:') return null;
    const root = resolve(publicDirectory);
    const file = resolve(root, '.' + decodeURIComponent(url.pathname));
    if (!file.startsWith(root + sep)) return null;
    const metadata = rasterMetadata(readFileSync(file));
    if (!metadata?.width || !metadata?.height) return null;
    return { src: url.href, alt, ...metadata };
  } catch { return null; }
}

export function articleSocialImage(article, site, publicDirectory = resolve('public')) {
  const candidates = [];
  if (article.data.image) candidates.push({ src: article.data.image, alt: article.data.imageAlt || article.data.title });
  for (const match of (article.body || '').matchAll(/!\[([^\]]*)\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+["'][^"']*["'])?\s*\)/g)) {
    candidates.push({ src: match[2] || match[3], alt: match[1] || article.data.title });
  }
  for (const candidate of candidates) {
    const image = resolveSocialImage(candidate.src, candidate.alt, site, publicDirectory);
    if (image) return image;
  }
  return null;
}
