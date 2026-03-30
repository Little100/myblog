import type { CalloutTitleSpec, DocumentSegment, ZigzagItem } from '../markdown/segmentTypes'

export type CustomBlockKind = 'callout' | 'zigzag' | 'meme'

export type CustomBlockSpec = {
  kind: CustomBlockKind
  pattern: RegExp
}

export const CUSTOM_BLOCK_SPECS: CustomBlockSpec[] = [
  {
    kind: 'meme',
    pattern: /(?<=(?:^|\n))[^\S\r\n]*<meme\s[\s\S]*?^<\/meme>/gm,
  },
  {
    kind: 'zigzag',
    pattern: /(?<=(?:^|\n))[^\S\r\n]*<zigzag>[\s\S]*?^<\/zigzag>/gm,
  },
  {
    kind: 'callout',
    pattern: /(?<=(?:^|\n))[^\S\r\n]*<(?!zigzag>)(?!span(?:[\s/>]|$))\w[\w-]*[^\n>]*>[\s\S]*?^<\/\w[\w-]*>/gm,
  },
]

function parseCalloutOpenTag(openTag: string): {
  icon: string
  collapsible: boolean
  defaultOpen: boolean
  title: CalloutTitleSpec
} {
  const trimmed = openTag.trim()
  const m = trimmed.match(/^<(\w[\w-]*)\s*(.*?)\s*>$/s)
  if (!m) {
    return {
      icon: 'circle-question',
      collapsible: false,
      defaultOpen: true,
      title: { mode: 'default' },
    }
  }

  const icon = m[1]
  let inner = (m[2] ?? '').trim()

  let title: CalloutTitleSpec = { mode: 'default' }
  const titleIdx = inner.indexOf('title:')
  if (titleIdx >= 0) {
    title = { mode: 'explicit', text: inner.slice(titleIdx + 'title:'.length).trim() }
    inner = inner.slice(0, titleIdx).trim()
  }

  let collapsible = false
  let defaultOpen = true
  const collapsibleRe = /\bcollapsible(?::(open|close))?\b/g
  let cm: RegExpExecArray | null
  while ((cm = collapsibleRe.exec(inner)) !== null) {
    collapsible = true
    if (cm[1] === 'close') defaultOpen = false
    else defaultOpen = true
  }

  return { icon, collapsible, defaultOpen, title }
}

function extractBody(fullMatch: string, tagName: string): string {
  const openTagEnd = fullMatch.indexOf('>')
  const closeTagStart = fullMatch.lastIndexOf(`</${tagName}>`)
  if (openTagEnd === -1 || closeTagStart === -1) {
    return fullMatch.slice(openTagEnd + 1).trimEnd()
  }
  return fullMatch.slice(openTagEnd + 1, closeTagStart).trimEnd()
}

export function splitByCustomBlocks(raw: string): DocumentSegment[] {
  type MatchInfo = {
    index: number
    end: number
    kind: CustomBlockKind
    body: string
    icon: string
    collapsible: boolean
    defaultOpen: boolean
    collapsibleTitle: CalloutTitleSpec
    zigzagItems?: ZigzagItem[]
    memeName?: string
    memeUrl?: string
    memeCaption?: string
  }

  const segments: DocumentSegment[] = []
  let cursor = 0
  const len = raw.length

  while (cursor < len) {
    let next: MatchInfo | null = null

    for (const spec of CUSTOM_BLOCK_SPECS) {
      spec.pattern.lastIndex = cursor
      const m = spec.pattern.exec(raw)
      if (!m || m.index < cursor) continue
      if (!next || m.index < next.index) {
        const fullMatch = m[0]
        const openLine = fullMatch.split('\n')[0]
        const gt = openLine.indexOf('>')
        const openTag = gt === -1 ? openLine : openLine.slice(0, gt + 1)

        if (spec.kind === 'zigzag') {
          const body = extractBody(fullMatch, 'zigzag')
          next = {
            index: m.index,
            end: spec.pattern.lastIndex,
            kind: 'zigzag',
            body,
            icon: '',
            collapsible: false,
            defaultOpen: true,
            collapsibleTitle: { mode: 'default' },
            zigzagItems: parseZigzagBody(body),
          }
        } else if (spec.kind === 'meme') {
          const { name, url, caption } = parseMemeOpenTag(openTag)
          const body = extractBody(fullMatch, 'meme')
          next = {
            index: m.index,
            end: spec.pattern.lastIndex,
            kind: 'meme',
            body,
            icon: '',
            collapsible: false,
            defaultOpen: true,
            collapsibleTitle: { mode: 'default' },
            memeName: name,
            memeUrl: url,
            memeCaption: caption,
          }
        } else {
          const { icon, collapsible, defaultOpen, title: collapsibleTitle } = parseCalloutOpenTag(openTag)
          const body = extractBody(fullMatch, icon)
          next = {
            index: m.index,
            end: spec.pattern.lastIndex,
            kind: spec.kind,
            body,
            icon,
            collapsible,
            defaultOpen,
            collapsibleTitle,
          }
        }
      }
    }

    if (!next) {
      const tail = raw.slice(cursor)
      if (tail) segments.push({ kind: 'markdown', body: tail })
      break
    }

    if (next.index > cursor) {
      segments.push({ kind: 'markdown', body: raw.slice(cursor, next.index) })
    }

    if (next.kind === 'zigzag' && next.zigzagItems) {
      segments.push({ kind: 'zigzag', items: next.zigzagItems })
    } else if (next.kind === 'meme') {
      segments.push({
        kind: 'meme',
        name: next.memeName,
        url: next.memeUrl,
        caption: next.memeCaption,
      })
    } else {
      segments.push({
        kind: 'callout',
        body: next.body,
        icon: next.icon,
        collapsible: next.collapsible,
        defaultOpen: next.defaultOpen,
        collapsibleTitle: next.collapsibleTitle,
      })
    }
    cursor = next.end
  }

  if (segments.length === 0) {
    segments.push({ kind: 'markdown', body: raw })
  }

  return segments
}

function parseZigzagBody(body: string): ZigzagItem[] {
  const items: ZigzagItem[] = []
  for (const line of body.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const imgLeft = trimmed.match(/^!\[.*?\]\([^)]+\)\|(.+)$/s)
    if (imgLeft) {
      items.push({
        direction: 'img-left',
        image: imgLeft[0].replace(/\|.+$/, ''),
        text: imgLeft[1].trim(),
      })
      continue
    }

    const imgRight = trimmed.match(/^(.+)\|!\[.*?\]\([^)]+\)$/s)
    if (imgRight) {
      items.push({
        direction: 'img-right',
        image: imgRight[0].replace(/^.+\|/, ''),
        text: imgRight[1].trim(),
      })
      continue
    }

    const last = items[items.length - 1]
    if (last) {
      last.text = last.text ? `${last.text}\n\n${trimmed}` : trimmed
    }
  }
  return items
}

/**
 * Parse <meme name="xxx"> or <meme url="..."> or <meme name="xxx" caption="...">
 * The caption is taken from the body content, not the attribute.
 * Returns { name, url } — caption comes from the block body.
 */
function parseMemeOpenTag(openTag: string): { name?: string; url?: string; caption?: string } {
  const trimmed = openTag.trim()
  const m = trimmed.match(/^<meme\s([^>]*?)>/s)
  if (!m) return {}

  const attrs = m[1] ?? ''
  const nameMatch = attrs.match(/\bname\s*=\s*["']([^"']*)["']/)
  const urlMatch = attrs.match(/\burl\s*=\s*["']([^"']*)["']/)
  const captionMatch = attrs.match(/\bcaption\s*=\s*["']([^"']*)["']/)

  return {
    name: nameMatch ? nameMatch[1] : undefined,
    url: urlMatch ? urlMatch[1] : undefined,
    caption: captionMatch ? captionMatch[1] : undefined,
  }
}
