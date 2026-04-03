import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MEME_MANIFEST } from 'virtual:meme-manifest'
import { useI18n } from '../../i18n/I18nContext'
import { giscusMemeMarkdownSnippet, memeAssetPath } from '../../utils/memeUrl'

async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      /* fall through */
    }
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.cssText = 'position:fixed;left:-9999px'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

type Props = {
  /** Callback after a meme was selected (markdown is already on clipboard). */
  onMemeSelected?: (key: string) => void
}

export function GiscusInlineMemePanel({ onMemeSelected }: Props) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [panelPos, setPanelPos] = useState({ top: 0, right: 0 })
  const panelRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  const updatePanelPos = useCallback(() => {
    const el = btnRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPanelPos({ top: r.bottom + 8, right: window.innerWidth - r.right })
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    updatePanelPos()
    window.addEventListener('scroll', updatePanelPos, true)
    window.addEventListener('resize', updatePanelPos)
    return () => {
      window.removeEventListener('scroll', updatePanelPos, true)
      window.removeEventListener('resize', updatePanelPos)
    }
  }, [open, updatePanelPos])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !btnRef.current?.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    // Delay so the click that opens doesn't immediately close
    const tid = window.setTimeout(() => document.addEventListener('mousedown', handler), 50)
    return () => {
      window.clearTimeout(tid)
      document.removeEventListener('mousedown', handler)
    }
  }, [open])

  const handlePick = async (key: string) => {
    const entry = MEME_MANIFEST[key]
    if (!entry?.src) return
    const md = giscusMemeMarkdownSnippet(key, entry.src)
    const ok = await copyText(md)
    if (ok) {
      setCopiedKey(key)
      setTimeout(() => {
        setCopiedKey(null)
        setOpen(false)
      }, 400)
      onMemeSelected?.(key)
    }
  }

  const entries = Object.entries(MEME_MANIFEST)

  const toggleOpen = () => {
    setOpen((prev) => {
      const next = !prev
      if (next && btnRef.current) {
        const r = btnRef.current.getBoundingClientRect()
        setPanelPos({ top: r.bottom + 8, right: window.innerWidth - r.right })
      }
      return next
    })
  }

  const panel =
    typeof document !== 'undefined'
      ? createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={panelRef}
                className="giscus-inline-meme-panel"
                style={{ top: panelPos.top, right: panelPos.right }}
                initial={{ opacity: 0, scale: 0.92, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -4 }}
                transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                role="dialog"
                aria-label={t('meme.inlineMeme.panelTitle')}
              >
                <div className="giscus-inline-meme-panel__header">
                  <span className="giscus-inline-meme-panel__title">
                    <i className="fas fa-images" />
                    {t('meme.inlineMeme.panelTitle')}
                  </span>
                  <span className="giscus-inline-meme-panel__hint">{t('meme.inlineMeme.hint')}</span>
                </div>
                <div className="giscus-inline-meme-panel__grid">
                  {entries.map(([key, entry]) => (
                    <button
                      key={key}
                      type="button"
                      className={`giscus-inline-meme-panel__item${copiedKey === key ? ' giscus-inline-meme-panel__item--copied' : ''}`}
                      onClick={() => void handlePick(key)}
                      title={entry.caption ?? key}
                      aria-label={key}
                    >
                      <img
                        src={memeAssetPath(entry.src)}
                        alt={key}
                        className="giscus-inline-meme-panel__img"
                        loading="lazy"
                      />
                      {copiedKey === key && (
                        <span className="giscus-inline-meme-panel__copied-badge">
                          <i className="fas fa-check" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )
      : null

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="giscus-inline-meme-btn"
        onClick={toggleOpen}
        title={t('meme.inlineMeme.title')}
        aria-label={t('meme.inlineMeme.title')}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <i className="fas fa-images" />
        <span>{t('meme.inlineMeme.label')}</span>
      </button>

      {panel}
    </>
  )
}
