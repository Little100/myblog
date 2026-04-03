import { siteConfig } from '../config/site'
import { publicAssetUrl } from './publicAssetUrl'

/**
 * Public origin for meme links in GitHub Discussions / Giscus.
 * Prefer `config.json` `seo.siteUrl` so pasted markdown works after deploy (not localhost).
 */
function canonicalSiteOrigin(): string {
  const raw = siteConfig.seo?.siteUrl?.trim() ?? ''
  if (raw) {
    try {
      return new URL(raw).origin
    } catch {
      /* fall through */
    }
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return ''
}

/**
 * Build a fetch-safe URL for files under `/meme/` (Unicode filenames, subfolders).
 * Accepts either a bare filename (`次呱呱.jpg`) or a path already prefixed with `/meme/`.
 */
export function memeAssetPath(relativeFile: string): string {
  let s = relativeFile.trim().replace(/^\/+/, '')
  if (s.toLowerCase().startsWith('meme/')) {
    s = s.slice('meme/'.length)
  }
  if (!s) return publicAssetUrl('/meme/')
  const segments = s.split('/').map((seg) => encodeURIComponent(seg))
  return publicAssetUrl(`/meme/${segments.join('/')}`)
}

/**
 * Absolute image URL for GitHub Discussions / Giscus markdown (relative paths are not resolved server-side).
 */
export function memeAbsoluteUrlForGiscusComment(relativeFile: string): string {
  const path = memeAssetPath(relativeFile)
  if (/^https?:\/\//i.test(path)) return path
  const origin = canonicalSiteOrigin()
  if (!origin) return path
  try {
    return new URL(path, `${origin}/`).href
  } catch {
    return path
  }
}

/**
 * Markdown that Giscus renders as a custom "emoji" image (`class="gsc-emoji"`), e.g. `![:name:](https://…/meme/x.gif)`.
 */
export function giscusMemeMarkdownSnippet(memeKey: string, relativeSrc: string, caption?: string): string {
  const url = memeAbsoluteUrlForGiscusComment(relativeSrc)
  const line = `![:${memeKey}:](${url})`
  const cap = caption?.trim()
  return cap ? `${line}\n\n${cap}` : line
}
