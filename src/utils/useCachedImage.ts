import { useEffect, useRef, useState } from 'react'
import {
  getOrCacheImage,
  revokeObjectUrl,
  clearImageCache,
  getCacheSizeBytes,
  getCacheCount,
} from './imageCache'

export interface CachedImageState {
  /** The URL to use as the img src — either an object URL or the original. */
  src: string
  /** Whether the image has finished loading (success or failure). */
  loaded: boolean
  /** Whether we are currently fetching from the network. */
  loading: boolean
}

/**
 * Load an image with IndexedDB caching.
 *
 * - External images (cross-origin) → cached in IndexedDB, served via object URL.
 * - Same-origin / public assets → served directly (browser HTTP cache handles it).
 *
 * The object URL is automatically revoked when the component unmounts or the URL changes.
 */
export function useCachedImage(url: string): CachedImageState {
  const [src, setSrc] = useState<string>(url)
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)

  /** Latest stable URL to avoid stale closures in async cleanup */
  const urlRef = useRef(url)
  /** Object URL currently active (so we can revoke it) */
  const objectUrlRef = useRef<string | null>(null)
  /** Mount guard: true while the component is still mounted */
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    urlRef.current = url
    setSrc(url)
    setLoaded(false)
    setLoading(false)
    objectUrlRef.current = null

    // If it's a same-origin or protocol-relative URL, let the browser handle it
    const isSameOrigin =
      !url.startsWith('http://') &&
      !url.startsWith('https://') &&
      !url.startsWith('data:')

    if (isSameOrigin) {
      setLoaded(true)
      return
    }

    async function load() {
      setLoading(true)
      try {
        const [objectUrl] = await getOrCacheImage(url)
        if (!mountedRef.current || urlRef.current !== url) {
          revokeObjectUrl(objectUrl)
          return
        }
        objectUrlRef.current = objectUrl
        setSrc(objectUrl)
      } catch {
        if (!mountedRef.current) return
        // Fallback to original URL on error
        setSrc(url)
      } finally {
        if (mountedRef.current && urlRef.current === url) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      mountedRef.current = false
      const cur = objectUrlRef.current
      if (cur) {
        revokeObjectUrl(cur)
        objectUrlRef.current = null
      }
    }
  }, [url])

  // Handle img onLoad / onError at the component level
  const handleLoad = () => {
    setLoaded(true)
    setLoading(false)
  }

  void handleLoad // exposed for CachedImg component below

  return { src, loaded, loading }
}

/** Expose cache management utilities */
export const imageCache = {
  clear: clearImageCache,
  getSize: getCacheSizeBytes,
  getCount: getCacheCount,
}
