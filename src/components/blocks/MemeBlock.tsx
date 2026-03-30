import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MEME_MANIFEST, type MemeEntry } from 'virtual:meme-manifest'
import { memeAssetPath } from '../../utils/memeUrl'
import { CachedImg } from '../../utils/CachedImg'

type MemeBlockProps = {
  /** Key in the meme manifest, e.g. "fist-pump" */
  name?: string
  /** Direct URL to an image (overrides name) */
  url?: string
  /** Caption displayed below the meme */
  caption?: string
  /** Alt text (falls back to caption or name) */
  alt?: string
  /** Show lightbox on click */
  lightbox?: boolean
  /** CSS class for the wrapper */
  className?: string
}

export type ResolvedMeme = {
  src: string
  alt: string
  caption: string
  type: string
  entry?: MemeEntry
}

/** Resolve a meme by name from the manifest or by direct URL. */
export function resolveMeme(props: Pick<MemeBlockProps, 'name' | 'url' | 'caption' | 'alt'>): ResolvedMeme | null {
  if (props.name) {
    const entry = MEME_MANIFEST[props.name]
    if (!entry) return null
    return {
      src: memeAssetPath(entry.src),
      alt: props.alt ?? entry.alt ?? entry.caption ?? props.name,
      caption: props.caption ?? entry.caption ?? '',
      type: entry.type,
      entry,
    }
  }

  if (props.url) {
    return {
      src: props.url,
      alt: props.alt ?? props.url,
      caption: props.caption ?? '',
      type: '',
    }
  }

  return null
}

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        className="meme-lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
        role="dialog"
        aria-modal
        aria-label={alt}
      >
        <motion.div
          className="meme-lightbox__inner"
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="meme-lightbox__close"
            onClick={onClose}
            aria-label="Close lightbox"
          >
            <i className="fas fa-times" />
          </button>
          <CachedImg
            className="meme-lightbox__img"
            src={src}
            alt={alt}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export function MemeBlock({
  name,
  url,
  caption,
  alt,
  lightbox = true,
  className = '',
}: MemeBlockProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const resolved = resolveMeme({ name, url, caption, alt })

  const openLightbox = useCallback(() => {
    if (lightbox) setLightboxOpen(true)
  }, [lightbox])

  const closeLightbox = useCallback(() => setLightboxOpen(false), [])

  if (!resolved) {
    if (!name) return null
    return (
      <div className={`meme-block meme-block--error ${className}`} role="alert">
        <span className="meme-block__error-icon">
          <i className="fas fa-exclamation-triangle" />
        </span>
        <span className="meme-block__error-text">Meme not found: <code>{name}</code></span>
      </div>
    )
  }

  const wrapperClass = [
    'meme-block',
    lightbox ? 'meme-block--clickable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <figure className={wrapperClass} onClick={openLightbox} role={lightbox ? 'button' : undefined} tabIndex={lightbox ? 0 : undefined} onKeyDown={lightbox ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox() } } : undefined} aria-label={resolved.alt}>
        <div className="meme-block__img-wrap">
          <CachedImg
            className="meme-block__img"
            src={resolved.src}
            alt={resolved.alt}
            decoding="async"
          />
          {lightbox && (
            <div className="meme-block__zoom-hint" aria-hidden>
              <i className="fas fa-expand" />
            </div>
          )}
        </div>
        {resolved.caption && (
          <figcaption className="meme-block__caption">{resolved.caption}</figcaption>
        )}
      </figure>

      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox src={resolved.src} alt={resolved.alt} onClose={closeLightbox} />
        )}
      </AnimatePresence>
    </>
  )
}
