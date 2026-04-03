export type ImageRenderSrc =
  | { variant: 'single'; src: string }
  | { variant: 'http-upgrade-fallback'; httpSrc: string; httpsSrc: string }

/**
 * Same path rules as {@link publicAssetUrl}, but keeps `http://` for `<img>` so we can
 * try `https://` first and fall back when the host has no TLS (e.g. plain HTTP on an IP).
 */
export function resolveImageRenderSrc(path: string): ImageRenderSrc | null {
  const t = path.trim()
  if (!t) return null
  if (t.startsWith('http://')) {
    return { variant: 'http-upgrade-fallback', httpSrc: t, httpsSrc: `https://${t.slice(7)}` }
  }
  if (t.startsWith('https://') || t.startsWith('data:') || t.startsWith('blob:')) {
    return { variant: 'single', src: t }
  }
  // Protocol-relative URLs (//host/...) must not be prefixed with BASE_URL
  if (t.startsWith('//')) {
    return { variant: 'single', src: t }
  }
  // Root-relative: avoids breaking <img> on deep routes (e.g. /post/slug + public/foo.png → wrong path)
  const rootRelative = t.startsWith('/') ? t : `/${t.replace(/^\.\//, '')}`
  const base = import.meta.env.BASE_URL
  const trimmed = rootRelative.startsWith('/') ? rootRelative.slice(1) : rootRelative
  return { variant: 'single', src: `${base}${trimmed}` }
}

/**
 * Resolves URLs for files served from Vite `public/` (e.g. `/content/...`, `/version.json`).
 * Uses `import.meta.env.BASE_URL` so GitHub Pages project sites (`/repo/`) load correctly.
 */
export function publicAssetUrl(path: string): string {
  const t = path.trim()
  if (t.startsWith('http://')) {
    return 'https://' + t.slice(7)
  }
  if (t.startsWith('https://') || t.startsWith('data:') || t.startsWith('blob:')) {
    return path
  }
  if (t.startsWith('//')) {
    return t
  }
  const rootRelative = t.startsWith('/') ? t : `/${t.replace(/^\.\//, '')}`
  const base = import.meta.env.BASE_URL
  const trimmed = rootRelative.startsWith('/') ? rootRelative.slice(1) : rootRelative
  return `${base}${trimmed}`
}
