import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'

// import.meta.url is this file (src/vite-plugin/meme.ts), not repo root — go up to project root
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const MEME_DIR = path.join(projectRoot, 'public', 'meme')

// Virtual module IDs
//  - 'virtual:meme-manifest' → runtime values (used by React components)
//  - 'virtual:meme-types'    → type declarations (for IDE support)
const VIRTUAL_MANIFEST = 'virtual:meme-manifest'
const VIRTUAL_TYPES = 'virtual:meme-types'

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp'])

type MemeEntryObj = {
  src: string
  type: string
  caption?: string
  alt?: string
  tags?: string[]
  addedAt?: string
}

function extToMime(ext: string): string {
  const e = ext.toLowerCase()
  if (e === '.gif') return 'image/gif'
  if (e === '.webp') return 'image/webp'
  if (e === '.png') return 'image/png'
  return 'image/jpeg'
}

/**
 * Merge manifest.json (explicit keys / aliases) with image files in public/meme/.
 * - Drops keys starting with `_` (docs-only fields in manifest).
 * - Manifest entries win over auto-discovered keys with the same name.
 * - Auto key = filename without extension, so `大哭.jpg` → !meme[大哭]
 */
export function buildMergedMemeManifest(): Record<string, MemeEntryObj> {
  const out: Record<string, MemeEntryObj> = {}
  const manifestPath = path.join(MEME_DIR, 'manifest.json')

  if (fs.existsSync(manifestPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as Record<string, unknown>
      for (const [k, v] of Object.entries(parsed)) {
        if (k.startsWith('_')) continue
        if (
          v &&
          typeof v === 'object' &&
          v !== null &&
          'src' in v &&
          typeof (v as { src: unknown }).src === 'string'
        ) {
          out[k] = v as MemeEntryObj
        }
      }
    } catch {
      /* keep out empty, filesystem may still populate */
    }
  }

  if (!fs.existsSync(MEME_DIR)) return out

  for (const name of fs.readdirSync(MEME_DIR)) {
    const ext = path.extname(name)
    if (!IMAGE_EXT.has(ext.toLowerCase())) continue
    const stem = path.basename(name, ext)
    if (out[stem]) continue
    out[stem] = { src: name, type: extToMime(ext) }
  }

  return out
}

/**
 * Loads public/meme/manifest.json as a virtual module so components can
 * reference memes by name without hardcoding URLs.
 *
 * Also copies the public/meme/ folder to dist/ with a _headers file for
 * GitHub Pages cache-control headers (1-year cache on immutable assets).
 */
export function memePlugin(): Plugin {
  function buildMemeModule(): string {
    const merged = buildMergedMemeManifest()
    return `export const MEME_MANIFEST = ${JSON.stringify(merged)};\nexport const MEME_BASE = '/meme/';`
  }

  function buildTypesModule(): string {
    return `export type MemeEntry = {
  src: string;
  type: 'image/gif' | 'image/webp' | 'image/png' | 'image/jpeg';
  caption?: string;
  alt?: string;
  tags?: string[];
  addedAt?: string;
};
export type MemeManifest = Record<string, MemeEntry>;
export const MEME_MANIFEST: MemeManifest;
export const MEME_BASE: string;
`
  }

  return {
    name: 'meme-plugin',

    resolveId(id) {
      if (id === VIRTUAL_MANIFEST || id === VIRTUAL_TYPES) {
        return id
      }
    },

    load(id) {
      if (id === VIRTUAL_MANIFEST) return buildMemeModule()
      if (id === VIRTUAL_TYPES) return buildTypesModule()
    },

    configureServer(server) {
      server.watcher.add(MEME_DIR)
      server.watcher.on('change', (file) => {
        if (String(file).startsWith(MEME_DIR)) {
          server.ws.send({ type: 'full-reload', path: '*' })
        }
      })
    },

    closeBundle() {
      const srcDir = MEME_DIR
      const outDir = path.join(projectRoot, 'dist', 'meme')

      if (!fs.existsSync(srcDir)) return
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

      // Copy all files from public/meme/ to dist/meme/
      const entries = fs.readdirSync(srcDir)
      for (const entry of entries) {
        // Skip manifest files and private folders
        if (entry.startsWith('_') || entry === 'manifest.json' || entry.endsWith('.schema.json')) {
          continue
        }
        const srcPath = path.join(srcDir, entry)
        const dstPath = path.join(outDir, entry)
        const stat = fs.statSync(srcPath)
        if (stat.isDirectory()) {
          if (!fs.existsSync(dstPath)) fs.mkdirSync(dstPath, { recursive: true })
          copyDir(srcPath, dstPath)
        } else {
          fs.copyFileSync(srcPath, dstPath)
        }
      }

      // Write immutable cache headers for GitHub Pages / Netlify
      const headersContent = [
        '/*',
        '  Access-Control-Allow-Origin: *',
        '  Cache-Control: public, max-age=31536000, immutable',
        '',
        '/*.*',
        '  Access-Control-Allow-Origin: *',
        '  Cache-Control: public, max-age=31536000, immutable',
      ].join('\n')
      fs.writeFileSync(path.join(outDir, '_headers'), headersContent, 'utf8')

      // Write a root-level _headers for Netlify/Vercel/Cloudflare Pages
      // GitHub Pages serves from repo root, so put _headers in dist/ root
      const rootHeadersContent = [
        '/assets/*',
        '  Cache-Control: public, max-age=31536000, immutable',
        '  Access-Control-Allow-Origin: *',
        '',
        '/meme/*',
        '  Cache-Control: public, max-age=31536000, immutable',
        '  Access-Control-Allow-Origin: *',
        '',
        '/*.js',
        '  Cache-Control: public, max-age=31536000, immutable',
        '',
        '/*.css',
        '  Cache-Control: public, max-age=31536000, immutable',
        '',
        '/*.woff2',
        '  Cache-Control: public, max-age=31536000, immutable',
        '  Access-Control-Allow-Origin: *',
        '',
        '/favicon.ico',
        '  Cache-Control: public, max-age=86400',
        '',
        '/avatar.png',
        '  Cache-Control: public, max-age=86400',
      ].join('\n')
      fs.writeFileSync(path.join(projectRoot, 'dist', '_headers'), rootHeadersContent, 'utf8')

      if (process.env.BLOG_BUILD_VERBOSE === '1') {
        console.log(`[meme-plugin] wrote _headers for dist/ and dist/meme/`)
      }

      // ── Generate giscus-emoji CSS ──────────────────────────────────────────
      const merged = buildMergedMemeManifest()
      writeGiscusEmojiCss(merged, projectRoot)
    },
  }
}

function writeGiscusEmojiCss(
  manifest: Record<string, MemeEntryObj>,
  projectRoot: string,
) {
  const configPath = path.join(projectRoot, 'config.json')
  let siteUrl = ''
  try {
    const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'))
    siteUrl = (cfg?.seo?.siteUrl ?? '').replace(/\/$/, '')
  } catch {
    siteUrl = ''
  }

  if (!siteUrl) {
    console.warn('[meme-plugin] Could not read seo.siteUrl from config.json — giscus-emoji CSS will use relative URLs (may not work inside Giscus iframe)')
  }

  const base = siteUrl ? `${siteUrl}/meme` : '/meme'

  function cssEntry(key: string, entry: MemeEntryObj): string {
    let src = entry.src.trim()
    if (src.toLowerCase().startsWith('meme/')) src = src.slice(5)
    const url = `${base}/${encodeURIComponent(src)}`
    const caption = entry.caption ?? key
    // Use ::before so content: url() works in all browsers (plain img { content } is ignored).
    // Hide the original <img> so it takes no space, then ::before renders the replacement.
    return [
      `/* ${caption} */`,
      `.gsc-emoji img[alt=":${key}:"],`,
      `.gsc-emoji img[alt=":${key} "] {`,
      `  opacity: 0;`,
      `  width: 0 !important;`,
      `  height: 0 !important;`,
      `  border: none !important;`,
      `  box-shadow: none !important;`,
      `  padding: 0 !important;`,
      `  margin: 0 !important;`,
      `}`,
      `.gsc-emoji img[alt=":${key}:"] + br,`,
      `.gsc-emoji img[alt=":${key} "] + br {`,
      `  display: none;`,
      `}`,
      `.gsc-emoji img[alt=":${key}:"]::before,`,
      `.gsc-emoji img[alt=":${key} "]::before {`,
      `  content: url('${url}');`,
      `  display: block;`,
      `  width: 48px;`,
      `  height: 48px;`,
      `  object-fit: contain;`,
      `}`,
    ].join('\n')
  }

  const lightRules = Object.entries(manifest)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => cssEntry(k, v))
    .join('\n\n')

  const lightCss = [
    `/* Giscus emoji → local meme replacement (light theme) */`,
    `/* Auto-generated by meme-plugin — do not edit manually */`,
    lightRules,
  ].join('\n')

  const darkCss = lightCss // same rules for dark, only comments differ
    .replace('(light theme)', '(dark theme)')
    .replace('(light)', '(dark)')

  const outDir = path.join(projectRoot, 'public')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  fs.writeFileSync(path.join(outDir, 'giscus-emoji-light.css'), lightCss, 'utf8')
  fs.writeFileSync(path.join(outDir, 'giscus-emoji-dark.css'), darkCss, 'utf8')

  console.log(
    `[meme-plugin] wrote giscus-emoji-light.css (${Object.keys(manifest).length} rules) and giscus-emoji-dark.css`,
  )
}

function copyDir(src: string, dst: string) {
  if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true })
  for (const entry of fs.readdirSync(src)) {
    const srcPath = path.join(src, entry)
    const dstPath = path.join(dst, entry)
    const stat = fs.statSync(srcPath)
    if (stat.isDirectory()) {
      copyDir(srcPath, dstPath)
    } else {
      fs.copyFileSync(srcPath, dstPath)
    }
  }
}

