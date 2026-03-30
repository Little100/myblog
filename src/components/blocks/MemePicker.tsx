import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MEME_MANIFEST, type MemeEntry } from 'virtual:meme-manifest'
import { useI18n } from '../../i18n/I18nContext'
import { memeAssetPath } from '../../utils/memeUrl'

type MemePickerProps = {
  onSelect: (name: string, entry: MemeEntry) => void
  onClose: () => void
}

type TagFilter = 'all' | string

export function MemePicker({ onSelect, onClose }: MemePickerProps) {
  const { t } = useI18n()
  const [filter, setFilter] = useState<TagFilter>('all')
  const [search, setSearch] = useState('')

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    for (const entry of Object.values(MEME_MANIFEST)) {
      for (const tag of entry.tags ?? []) {
        tags.add(tag)
      }
    }
    return Array.from(tags).sort()
  }, [])

  const filtered = useMemo(() => {
    return Object.entries(MEME_MANIFEST).filter(([name, entry]) => {
      const matchSearch = !search || name.includes(search) || (entry.caption ?? '').toLowerCase().includes(search.toLowerCase())
      const matchTag = filter === 'all' || (entry.tags ?? []).includes(filter)
      return matchSearch && matchTag
    })
  }, [search, filter])

  return (
    <AnimatePresence>
      <motion.div
        className="meme-picker-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        role="dialog"
        aria-modal
        aria-label={t('meme.picker.title')}
      >
        <motion.div
          className="meme-picker"
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="meme-picker__header">
            <h3 className="meme-picker__title">
              <i className="fas fa-images" />
              {t('meme.picker.title')}
            </h3>
            <button type="button" className="meme-picker__close" onClick={onClose} aria-label={t('meme.picker.close')}>
              <i className="fas fa-times" />
            </button>
          </div>

          <div className="meme-picker__controls">
            <div className="meme-picker__search-wrap">
              <i className="fas fa-search meme-picker__search-icon" />
              <input
                type="text"
                className="meme-picker__search"
                placeholder={t('meme.picker.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  className="meme-picker__search-clear"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                >
                  <i className="fas fa-times-circle" />
                </button>
              )}
            </div>
          </div>

          <div className="meme-picker__tags">
            <button
              type="button"
              className={`meme-picker__tag${filter === 'all' ? ' meme-picker__tag--active' : ''}`}
              onClick={() => setFilter('all')}
            >
              {t('meme.picker.tagAll')}
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`meme-picker__tag${filter === tag ? ' meme-picker__tag--active' : ''}`}
                onClick={() => setFilter(filter === tag ? 'all' : tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="meme-picker__empty">
              <i className="fas fa-frown-open" />
              <p>{t('meme.picker.empty')}</p>
            </div>
          ) : (
            <div className="meme-picker__grid">
              {filtered.map(([name, entry]) => (
                <motion.button
                  key={name}
                  type="button"
                  className="meme-picker__item"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelect(name, entry)}
                  title={entry.caption ?? name}
                >
                  <div className="meme-picker__item-img-wrap">
                    <img
                      className="meme-picker__item-img"
                      src={memeAssetPath(entry.src)}
                      alt={entry.alt ?? entry.caption ?? name}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  {entry.caption && (
                    <span className="meme-picker__item-caption">{entry.caption}</span>
                  )}
                  <span className="meme-picker__item-name">!meme[{name}]</span>
                </motion.button>
              ))}
            </div>
          )}

          <div className="meme-picker__footer">
            <code className="meme-picker__syntax-hint">
              !meme[name] &nbsp;·&nbsp; &lt;meme name="name"&gt;Caption&lt;/meme&gt;
            </code>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/** Renders a compact inline meme selector button (no overlay, just shows a button to insert). */
export function MemeInsertButton({ onInsert }: { onInsert: (syntax: string) => void }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="meme-insert-btn"
        onClick={() => setOpen((v) => !v)}
        title={t('meme.insert.title')}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <i className="fas fa-images" />
        <span>{t('meme.insert.label')}</span>
      </button>

      {open && (
        <MemePicker
          onSelect={(name) => {
            onInsert(`!meme[${name}]`)
            setOpen(false)
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
