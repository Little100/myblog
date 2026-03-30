import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { siteConfig } from '../config/site'

const PLACEHOLDER_REPOS = ['your-username/your-repo', '']

/** Strips the locale prefix from a pathname to produce a stable canonical path shared by all language variants. */
function canonicalPath(pathname: string): string {
  return '/' + pathname.split('/').slice(2).join('/') || '/'
}

type Props = {
  /** Called when embed fails (e.g. app not installed on repo) or loads successfully. */
  onAvailabilityChange?: (available: boolean) => void
}

export function Giscus({ onAvailabilityChange }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    const cfg = siteConfig.giscus
    if (!cfg?.enabled || PLACEHOLDER_REPOS.includes(cfg.repo)) return

    // Clear previous iframe so Giscus re-initializes on route change
    if (ref.current) {
      ref.current.innerHTML = ''
    }

    const term = canonicalPath(pathname)

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', cfg.repo)
    script.setAttribute('data-repo-id', cfg.repoId)
    script.setAttribute('data-category', cfg.category)
    script.setAttribute('data-category-id', cfg.categoryId)
    script.setAttribute('data-mapping', 'specific')
    script.setAttribute('data-term', term)
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', cfg.reactionsEnabled)
    script.setAttribute('data-emit-metadata', cfg.emitMetadata)
    script.setAttribute('data-input-position', cfg.inputPosition)
    script.setAttribute('data-theme', 'preferred_color_scheme')
    script.setAttribute('data-lang', cfg.lang)
    script.setAttribute('data-loading', 'lazy')
    script.crossOrigin = 'anonymous'
    script.async = true

    ref.current?.appendChild(script)
  }, [pathname])

  useEffect(() => {
    if (!onAvailabilityChange) return

    const onMsg = (e: MessageEvent) => {
      if (e.origin !== 'https://giscus.app') return
      const d = e.data
      if (typeof d !== 'object' || d === null || !('giscus' in d)) return
      const g = (d as { giscus: unknown }).giscus
      if (typeof g !== 'object' || g === null) return
      const rec = g as Record<string, unknown>
      if ('error' in rec && rec.error) {
        onAvailabilityChange(false)
        return
      }
      if ('discussion' in rec && rec.discussion != null) {
        onAvailabilityChange(true)
      }
    }

    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [pathname, onAvailabilityChange])

  useEffect(() => {
    if (!onAvailabilityChange) return
    const root = ref.current
    if (!root) return

    const looksBroken = (text: string) =>
      /giscus\s+is\s+not\s+installed|not\s+installed\s+on\s+this\s+repository|无法加载评论|评论加载失败|安装\s*giscus/i.test(
        text,
      )

    const check = () => {
      const text = root.innerText ?? ''
      if (looksBroken(text)) onAvailabilityChange(false)
    }

    const obs = new MutationObserver(() => check())
    obs.observe(root, { subtree: true, childList: true, characterData: true })
    const interval = window.setInterval(check, 500)
    const stop = window.setTimeout(() => {
      window.clearInterval(interval)
    }, 20000)

    return () => {
      obs.disconnect()
      window.clearInterval(interval)
      window.clearTimeout(stop)
    }
  }, [pathname, onAvailabilityChange])

  return (
    <div className="giscus-container">
      <div ref={ref} className="giscus" />
    </div>
  )
}
