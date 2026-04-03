import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MEME_MANIFEST } from 'virtual:meme-manifest'
import { useI18n } from '../../i18n/I18nContext'
import { siteConfig } from '../../config/site'
import { giscusMemeMarkdownSnippet, memeAssetPath } from '../../utils/memeUrl'

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

const PLACEHOLDER_REPOS = ['your-username/your-repo', '']

const DEFAULT_REACTIONS = [
  { emoji: '👍', label: 'Like' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '😂', label: 'Haha' },
  { emoji: '😮', label: 'Wow' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '🚀', label: 'Rocket' },
  { emoji: '🎉', label: 'Celebrate' },
  { emoji: '🔥', label: 'Fire' },
]

type ReactionCount = {
  emoji: string
  count: number
  reacted: boolean
}

type Props = {
  /** Canonical path used for the giscus discussion */
  discussionPath: string
  /** When false, hide reactions bar (e.g. Giscus embed failed). */
  giscusAvailable?: boolean
}

async function addGitHubReaction(subjectId: string, content: string): Promise<boolean> {
  const token = sessionStorage.getItem('giscus-token')
  if (!token) return false

  const mutation = `
    mutation AddReaction($subjectId: ID!, $content: ReactionContent!) {
      addReaction(input: { subjectId: $subjectId, content: $content }) {
        reaction { content }
      }
    }
  `

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: mutation, variables: { subjectId, content } }),
    })
    return response.ok
  } catch {
    return false
  }
}

function getReactionContent(emoji: string): string {
  const map: Record<string, string> = {
    '👍': 'THUMBS_UP',
    '👎': 'THUMBS_DOWN',
    '😄': 'LAUGH',
    '🎉': 'HOORAY',
    '😕': 'CONFUSED',
    '❤️': 'HEART',
    '🚀': 'ROCKET',
    '👀': 'EYES',
  }
  return map[emoji] ?? 'THUMBS_UP'
}

export function GiscusMemeReactions({
  discussionPath: _discussionPath,
  giscusAvailable = true,
}: Props) {
  const { t } = useI18n()
  const cfg = siteConfig.giscus
  const [counts, setCounts] = useState<ReactionCount[]>([])
  const [showMemePanel, setShowMemePanel] = useState(false)
  const [panelMeme, setPanelMeme] = useState<string | null>(null)
  const [panelCaption, setPanelCaption] = useState('')
  const [copyFailed, setCopyFailed] = useState(false)

  const toggleReaction = useCallback(
    async (emoji: string) => {
      const token = sessionStorage.getItem('giscus-token')
      if (!token) {
        setCounts((prev) =>
          prev.map((r) =>
            r.emoji === emoji ? { ...r, count: r.count + (r.reacted ? -1 : 1), reacted: !r.reacted } : r,
          ),
        )
        return
      }
      setCounts((prev) =>
        prev.map((r) =>
          r.emoji === emoji ? { ...r, count: r.count + (r.reacted ? -1 : 1), reacted: !r.reacted } : r,
        ),
      )
      void addGitHubReaction('', getReactionContent(emoji))
    },
    [],
  )

  const closeMemePanel = useCallback(() => {
    setShowMemePanel(false)
    setPanelMeme(null)
    setPanelCaption('')
    setCopyFailed(false)
  }, [])

  const copyMemeMarkdown = useCallback(async () => {
    if (!panelMeme) return
    setCopyFailed(false)
    const entry = MEME_MANIFEST[panelMeme]
    if (!entry?.src) return

    const markdown = giscusMemeMarkdownSnippet(panelMeme, entry.src, panelCaption)
    const ok = await copyTextToClipboard(markdown)
    if (!ok) {
      setCopyFailed(true)
      return
    }
    closeMemePanel()
  }, [panelMeme, panelCaption, closeMemePanel])

  if (!cfg?.enabled || PLACEHOLDER_REPOS.includes(cfg.repo) || !giscusAvailable) return null

  return (
    <>
      <div className="giscus-meme-reactions">
        <div className="giscus-meme-reactions__bar">
          <span className="giscus-meme-reactions__label">
            <i className="fas fa-face-smile" />
            {t('meme.reactions.label')}
          </span>
          <div className="giscus-meme-reactions__buttons">
            {DEFAULT_REACTIONS.map((r) => {
              const count = counts.find((c) => c.emoji === r.emoji)
              return (
                <motion.button
                  key={r.emoji}
                  type="button"
                  className={`giscus-meme-reactions__btn${count?.reacted ? ' giscus-meme-reactions__btn--active' : ''}`}
                  onClick={() => toggleReaction(r.emoji)}
                  title={r.label}
                  whileTap={{ scale: 0.88 }}
                  aria-label={`${r.label}${count?.count ? ` (${count.count})` : ''}`}
                  aria-pressed={count?.reacted}
                >
                  <span className="giscus-meme-reactions__emoji">{r.emoji}</span>
                  {count && count.count > 0 && (
                    <span className="giscus-meme-reactions__count">{count.count}</span>
                  )}
                </motion.button>
              )
            })}

            <motion.button
              type="button"
              className="giscus-meme-reactions__btn giscus-meme-reactions__btn--meme"
              onClick={() => {
                setCopyFailed(false)
                setShowMemePanel(true)
              }}
              title={t('meme.reactions.sendMeme')}
              whileTap={{ scale: 0.88 }}
              aria-label={t('meme.reactions.sendMeme')}
            >
              <i className="fas fa-images" />
              <span className="giscus-meme-reactions__emoji-label">{t('meme.reactions.meme')}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Meme reaction panel */}
      <AnimatePresence>
        {showMemePanel && (
          <motion.div
            className="meme-reaction-panel-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeMemePanel}
            role="dialog"
            aria-modal
            aria-label={t('meme.reactions.panelTitle')}
          >
            <motion.div
              className="meme-reaction-panel"
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="meme-reaction-panel__header">
                <h3 className="meme-reaction-panel__title">
                  <i className="fas fa-images" />
                  {t('meme.reactions.panelTitle')}
                </h3>
                <button
                  type="button"
                  className="meme-reaction-panel__close"
                  onClick={closeMemePanel}
                  aria-label={t('meme.reactions.close')}
                >
                  <i className="fas fa-times" />
                </button>
              </div>

              {/* Preview */}
              <div className="meme-reaction-panel__preview">
                {panelMeme ? (
                  <div className="meme-reaction-panel__preview-img-wrap">
                    <img
                      src={memeAssetPath((MEME_MANIFEST[panelMeme] ?? Object.values(MEME_MANIFEST)[0] ?? { src: '' }).src)}
                      alt={panelMeme}
                      className="meme-reaction-panel__preview-img"
                    />
                  </div>
                ) : (
                  <div className="meme-reaction-panel__preview-placeholder">
                    <i className="fas fa-image" />
                    <span>{t('meme.reactions.selectHint')}</span>
                  </div>
                )}
                {panelCaption && (
                  <p className="meme-reaction-panel__preview-caption">{panelCaption}</p>
                )}
              </div>

              {/* Meme grid */}
              <div className="meme-reaction-panel__grid">
                {Object.entries(MEME_MANIFEST).map(([key, entry]) => (
                  <motion.button
                    key={key}
                    type="button"
                    className={`meme-reaction-panel__item${panelMeme === key ? ' meme-reaction-panel__item--selected' : ''}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPanelMeme(key)}
                    title={entry.caption ?? key}
                    aria-pressed={panelMeme === key}
                  >
                    <img
                      src={memeAssetPath(entry.src)}
                      alt={entry.alt ?? entry.caption ?? key}
                      className="meme-reaction-panel__item-img"
                      loading="lazy"
                    />
                    {entry.caption && (
                      <span className="meme-reaction-panel__item-caption">{entry.caption}</span>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <div className="meme-reaction-panel__footer">
                <input
                  type="text"
                  className="meme-reaction-panel__caption-input"
                  placeholder={t('meme.reactions.captionPlaceholder')}
                  value={panelCaption}
                  onChange={(e) => setPanelCaption(e.target.value)}
                  maxLength={200}
                />
                <button
                  type="button"
                  className={`meme-reaction-panel__submit${!panelMeme ? ' meme-reaction-panel__submit--disabled' : ''}`}
                  onClick={() => void copyMemeMarkdown()}
                  disabled={!panelMeme}
                >
                  <i className="fas fa-copy" /> {t('meme.reactions.post')}
                </button>
              </div>

              {copyFailed && (
                <p className="meme-reaction-panel__copy-error" role="alert">
                  {t('meme.reactions.copyFailed')}
                </p>
              )}

              <p className="meme-reaction-panel__note">
                <i className="fas fa-info-circle" />
                {t('meme.reactions.note')}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
