/**
 * Meme type definitions — imported by React components.
 * The actual runtime values (MEME_MANIFEST, MEME_BASE) are injected by the
 * virtual meme plugin at build time via `import 'virtual:meme-manifest'`.
 */

export type MemeEntry = {
  src: string
  type: 'image/gif' | 'image/webp' | 'image/png' | 'image/jpeg'
  caption?: string
  alt?: string
  tags?: string[]
  addedAt?: string
}

export type MemeManifest = Record<string, MemeEntry>

/** Injected at runtime by the virtual meme plugin — declared here for TypeScript. */
declare const MEME_MANIFEST: MemeManifest
/** Injected at runtime by the virtual meme plugin. */
declare const MEME_BASE: string

export { MEME_MANIFEST, MEME_BASE }
