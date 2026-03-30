import { publicAssetUrl } from './publicAssetUrl'

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
