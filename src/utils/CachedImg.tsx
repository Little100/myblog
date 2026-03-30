import { useEffect, useRef, useState, type ImgHTMLAttributes } from 'react'
import { getOrCacheImage, revokeObjectUrl } from './imageCache'

interface CachedImgProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /** The original image URL. */
  src?: string
  /**
   * Whether to skip the IndexedDB cache for this image.
   * - `true`: use the original URL directly (browser HTTP cache handles it).
   * - `false`: always try IndexedDB cache first.
   * - `undefined` (default): auto-detect — skip for same-origin / data: / blob: URLs.
   */
  skipCache?: boolean
  /** CSS class for the skeleton placeholder shown while loading. */
  skeletonClassName?: string
}

/**
 * Image component with IndexedDB client-side caching for cross-origin images.
 *
 * - Same-origin / relative / data: / blob: URLs → served directly (browser HTTP cache handles it).
 * - External https:// URLs → fetched once, stored as Blob in IndexedDB,
 *   then served via object URL. Subsequent loads are instant (no network).
 *
 * Object URLs are automatically revoked when the component unmounts or the src changes.
 */
export function CachedImg({
  src,
  skipCache,
  skeletonClassName,
  className,
  alt,
  loading = 'lazy',
  ...rest
}: CachedImgProps) {
  const [displaySrc, setDisplaySrc] = useState<string | undefined>(src)
  const [loaded, setLoaded] = useState(false)
  const objectUrlRef = useRef<string | null>(null)
  const mountedRef = useRef(true)

  const shouldCache =
    skipCache !== undefined
      ? !skipCache
      : src != null &&
        !src.startsWith('data:') &&
        !src.startsWith('blob:') &&
        !src.startsWith(window.location.origin + '/')

  useEffect(() => {
    mountedRef.current = true

    if (!shouldCache || src == null) {
      setDisplaySrc(src)
      setLoaded(true)
      return
    }

    const urlToFetch = src
    setLoaded(false)

    async function load() {
      try {
        const [objectUrl] = await getOrCacheImage(urlToFetch)
        if (!mountedRef.current) {
          revokeObjectUrl(objectUrl)
          return
        }
        const prev = objectUrlRef.current
        if (prev) revokeObjectUrl(prev)
        objectUrlRef.current = objectUrl
        setDisplaySrc(objectUrl)
      } catch {
        if (!mountedRef.current) return
        setDisplaySrc(urlToFetch)
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
  }, [src, shouldCache])

  const showSkeleton = !loaded && shouldCache && displaySrc !== src

  return (
    <>
      {showSkeleton && (
        <div
          className={skeletonClassName ?? 'bg-[var(--pill-bg)] animate-pulse rounded'}
          aria-hidden
          style={{ width: rest.width, height: rest.height }}
        />
      )}
      <img
        {...rest}
        src={displaySrc}
        alt={alt}
        className={className}
        loading={loading}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        style={{ display: showSkeleton ? 'none' : undefined, ...rest.style }}
      />
    </>
  )
}
