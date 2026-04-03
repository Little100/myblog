import { useState, useMemo, useCallback } from 'react'
import { MEME_MANIFEST } from 'virtual:meme-manifest'
import { giscusMemeMarkdownSnippet, memeAssetPath } from '../utils/memeUrl'
import { useI18n } from '../i18n/I18nContext'
import { SeoHead } from '../components/seo/SeoHead'

async function copyTextToClipboard(text: string): Promise<boolean> {
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
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

export function MemeGalleryPage() {
  const { t } = useI18n()
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [copyFailed, setCopyFailed] = useState(false)

  const copyMemeMarkdown = useCallback(async (key: string) => {
    setCopyFailed(false)
    const entry = MEME_MANIFEST[key]
    if (!entry?.src) return
    const md = giscusMemeMarkdownSnippet(key, entry.src)
    const ok = await copyTextToClipboard(md)
    if (!ok) {
      setCopyFailed(true)
      return
    }
    setCopiedKey(key)
    window.setTimeout(() => setCopiedKey(null), 1600)
  }, [])

  const entries = useMemo(() => Object.entries(MEME_MANIFEST), [])

  const allTags = useMemo(() => {
    const set = new Set<string>()
    for (const [, entry] of entries) {
      for (const tag of entry.tags ?? []) set.add(tag)
    }
    return Array.from(set).sort()
  }, [entries])

  const filtered = useMemo(() => {
    return entries.filter(([key, entry]) => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        key.toLowerCase().includes(q) ||
        (entry.caption ?? '').toLowerCase().includes(q) ||
        (entry.alt ?? '').toLowerCase().includes(q) ||
        (entry.tags ?? []).some((tag) => tag.toLowerCase().includes(q))
      const matchTag = !activeTag || (entry.tags ?? []).includes(activeTag)
      return matchSearch && matchTag
    })
  }, [entries, search, activeTag])

  return (
    <>
      <SeoHead title={t('meme.gallery.pageTitle')} />
      <div className="page page--meme-gallery">
        <div className="meme-gallery">
          <header className="meme-gallery__header">
            <h1 className="meme-gallery__title">{t('meme.gallery.title')}</h1>
            <p className="meme-gallery__lead">{t('meme.gallery.lead')}</p>
            {copyFailed && (
              <p className="meme-gallery__copy-error" role="alert">
                {t('meme.reactions.copyFailed')}
              </p>
            )}
          </header>

          <div className="meme-gallery__controls">
            <div className="meme-gallery__search-wrap">
              <i className="fas fa-search meme-gallery__search-icon" />
              <input
                type="search"
                className="meme-gallery__search"
                placeholder={t('meme.gallery.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label={t('meme.gallery.searchPlaceholder')}
              />
            </div>
            {allTags.length > 0 && (
              <div className="meme-gallery__tags" role="group" aria-label={t('meme.gallery.filterByTag')}>
                <button
                  type="button"
                  className={`meme-gallery__tag${activeTag === null ? ' meme-gallery__tag--active' : ''}`}
                  onClick={() => setActiveTag(null)}
                >
                  {t('meme.gallery.all')}
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`meme-gallery__tag${activeTag === tag ? ' meme-gallery__tag--active' : ''}`}
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="meme-gallery__empty">
              <i className="fas fa-images" />
              <p>{t('meme.gallery.empty')}</p>
            </div>
          ) : (
            <div className="meme-gallery__grid">
              {filtered.map(([key, entry]) => (
                <div key={key} className="meme-gallery__item">
                  <div className="meme-gallery__img-wrap">
                    <img
                      src={memeAssetPath(entry.src)}
                      alt={entry.alt ?? entry.caption ?? key}
                      className="meme-gallery__img"
                      loading="lazy"
                    />
                  </div>
                  <div className="meme-gallery__info">
                    <span className="meme-gallery__name">{key}</span>
                    {entry.caption && (
                      <span className="meme-gallery__caption">{entry.caption}</span>
                    )}
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="meme-gallery__item-tags">
                        {entry.tags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            className="meme-gallery__item-tag"
                            onClick={() => { setActiveTag(tag); setSearch('') }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                    <button
                      type="button"
                      className={`meme-gallery__copy${copiedKey === key ? ' meme-gallery__copy--done' : ''}`}
                      onClick={() => void copyMemeMarkdown(key)}
                    >
                      <i className="fas fa-copy" aria-hidden />
                      {copiedKey === key ? t('meme.gallery.copied') : t('meme.gallery.copyMarkdown')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
