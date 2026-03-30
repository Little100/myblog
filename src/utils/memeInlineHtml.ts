import { resolveMeme } from '../components/blocks/MemeBlock'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function memeSpanHtml(name: string, soloLine: boolean): string {
  const safeName = escapeHtml(name)
  const resolved = resolveMeme({ name })
  const cls = soloLine ? 'meme-inline meme-inline--solo-line' : 'meme-inline meme-inline--compact'
  if (!resolved) {
    return `<span class="meme-inline-error" data-meme-name="${safeName}">Meme not found: ${safeName}</span>`
  }
  const safeAlt = escapeHtml(resolved.alt)
  const safeSrc = escapeHtml(resolved.src)
  return `<span class="${cls}" data-meme-name="${safeName}"><img src="${safeSrc}" alt="${safeAlt}" loading="lazy" class="meme-inline__img" /></span>`
}

/**
 * Inline `!meme[name]` → HTML. Paragraphs that contain only a meme (markdown blocks separated by `\n\n`) keep full visual size (`meme-inline--solo-line`).
 */
export function preprocessInlineMemes(body: string): string {
  const parts = body.split(/(\n{2,})/)
  return parts
    .map((part) => {
      if (/^\n{2,}$/.test(part)) return part
      const trimmed = part.trim()
      if (/^!meme\[([^\]]+)\]$/.test(trimmed)) {
        const m = trimmed.match(/^!meme\[([^\]]+)\]$/)!
        return memeSpanHtml(m[1], true)
      }
      return part.replace(/!meme\[([^\]]+)\]/g, (_, name: string) => memeSpanHtml(name, false))
    })
    .join('')
}

/**
 * Annotation anchor text: escape plain text but expand `!meme[name]` like body markdown.
 */
export function formatAnnotationAnchorHtml(anchorText: string): string {
  const trimmed = anchorText.trim()
  if (/^!meme\[([^\]]+)\]$/.test(trimmed)) {
    const m = trimmed.match(/^!meme\[([^\]]+)\]$/)!
    return memeSpanHtml(m[1], true)
  }
  let out = ''
  let last = 0
  let m: RegExpExecArray | null
  const re = /!meme\[([^\]]+)\]/g
  while ((m = re.exec(anchorText)) !== null) {
    out += escapeHtml(anchorText.slice(last, m.index))
    out += memeSpanHtml(m[1]!, false)
    last = m.index + m[0].length
  }
  out += escapeHtml(anchorText.slice(last))
  return out
}
