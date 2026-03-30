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
  if (t.startsWith('https://') || t.startsWith('data:')) {
    return { variant: 'single', src: t }
  }
  if (!t.startsWith('/')) {
    return { variant: 'single', src: path }
  }
  const base = import.meta.env.BASE_URL
  const trimmed = t.startsWith('/') ? t.slice(1) : t
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
  if (t.startsWith('https://') || t.startsWith('data:')) {
    return path
  }
  if (!t.startsWith('/')) {
    return path
  }
  const base = import.meta.env.BASE_URL
  const trimmed = t.startsWith('/') ? t.slice(1) : t
  return `${base}${trimmed}`
}
