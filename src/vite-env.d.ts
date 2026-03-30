/// <reference types="vite/client" />

declare module 'virtual:post-index' {
  export const POST_INDEX_RAW: Record<string, string>
}

declare module 'virtual:meme-manifest' {
  export type MemeEntry = {
    src: string
    type: 'image/gif' | 'image/webp' | 'image/png' | 'image/jpeg'
    caption?: string
    alt?: string
    tags?: string[]
    addedAt?: string
  }
  export type MemeManifest = Record<string, MemeEntry>
  export const MEME_MANIFEST: MemeManifest
  export const MEME_BASE: string
}

declare module 'virtual:meme-types' {
  export type MemeEntry = {
    src: string
    type: 'image/gif' | 'image/webp' | 'image/png' | 'image/jpeg'
    caption?: string
    alt?: string
    tags?: string[]
    addedAt?: string
  }
  export type MemeManifest = Record<string, MemeEntry>
}
