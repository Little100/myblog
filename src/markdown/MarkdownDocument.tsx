import { Fragment } from 'react'
import { SafeImg } from '../components/HttpsFallbackImg'
import { splitByCustomBlocks } from '../extensions/customBlockSpecs'
import type { DocumentSegment, ZigzagItem, MemeSegment } from './segmentTypes'
import { MarkdownFlow } from './MarkdownFlow'
import { CalloutBlock } from '../components/blocks/CalloutBlock'
import { MemeBlock } from '../components/blocks/MemeBlock'
import type { CalloutSegment, ZigzagSegment } from './segmentTypes'
import { preprocessInlineMemes } from '../utils/memeInlineHtml'

function ZigzagBlock({ items }: { items: ZigzagItem[] }) {
  return (
    <div className="md-zigzag-block">
      {items.map((item, idx) => (
        <div key={idx} className={`md-zigzag-item md-zigzag-item--${item.direction}`}>
          <div className="md-zigzag-item__image">
            <ImageFromMarkdown src={item.image} />
          </div>
          <div className="md-zigzag-item__text">
            <MarkdownFlow content={preprocessInlineMemes(item.text)} />
          </div>
        </div>
      ))}
    </div>
  )
}

function ImageFromMarkdown({ src: markdownImg }: { src: string }) {
  const match = markdownImg.match(/!\[(.*?)\]\(([^)\s]+)\)/)
  if (!match) return null
  const [, alt, src] = match
  return <SafeImg className="md-img" src={src} alt={alt} loading="lazy" />
}

function renderSegment(seg: DocumentSegment, index: number, enableMediaZigzag?: boolean) {
  if (seg.kind === 'markdown') {
    const processed = preprocessInlineMemes(seg.body)
    return <MarkdownFlow key={`md-${index}`} content={processed} enableMediaZigzag={enableMediaZigzag} />
  }
  if (seg.kind === 'zigzag') {
    return <ZigzagBlock key={`zigzag-${index}`} items={(seg as ZigzagSegment).items} />
  }
  if (seg.kind === 'meme') {
    const ms = seg as MemeSegment
    return (
      <MemeBlock
        key={`meme-${index}`}
        name={ms.name}
        url={ms.url}
        caption={ms.caption}
      />
    )
  }
  const cs = seg as CalloutSegment
  return (
    <CalloutBlock
      key={`callout-${index}`}
      body={cs.body}
      icon={cs.icon}
      collapsible={cs.collapsible}
      defaultOpen={cs.defaultOpen}
      collapsibleTitle={cs.collapsibleTitle}
    />
  )
}

type Props = {
  source: string
  enableMediaZigzag?: boolean
}

export function MarkdownDocument({ source, enableMediaZigzag }: Props) {
  const segments = splitByCustomBlocks(source)

  return (
    <div className="md-document">
      {segments.map((seg, i) => (
        <Fragment key={i}>{renderSegment(seg, i, enableMediaZigzag)}</Fragment>
      ))}
    </div>
  )
}
