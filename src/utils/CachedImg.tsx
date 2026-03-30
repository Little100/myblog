import { useCallback, useEffect, useReducer, type ImgHTMLAttributes } from 'react'
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

// --- State machine ---------------------------------------------------

type State = {
  settled: boolean
  /** The latest blob/object URL to display; undefined means use src prop directly. */
  cachedSrc: string | undefined
}

type Action =
  | { type: 'SETTLE' }
  | { type: 'SETTLE_CACHED'; cachedSrc: string }
  | { type: 'RESET' }

function reducer(_prev: State, action: Action): State {
  switch (action.type) {
    case 'SETTLE':
      return { settled: true, cachedSrc: undefined }
    case 'SETTLE_CACHED':
      return { settled: true, cachedSrc: action.cachedSrc }
    case 'RESET':
      return { settled: false, cachedSrc: undefined }
    default:
      return _prev
  }
}

// --- Component -------------------------------------------------------

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
  const [{ settled, cachedSrc }, dispatch] = useReducer(reducer, {
    settled: true,
    cachedSrc: undefined,
  })

  const shouldCache =
    skipCache !== undefined
      ? !skipCache
      : src != null &&
        !src.startsWith('data:') &&
        !src.startsWith('blob:') &&
        !src.startsWith(window.location.origin + '/')

  // The final URL: use cached object URL if available, otherwise fall back to the original src
  const finalSrc = cachedSrc ?? src

  useEffect(() => {
    if (!shouldCache || src == null) {
      dispatch({ type: 'SETTLE' })
      return
    }

    dispatch({ type: 'RESET' })

    let activeObjectUrl: string | null = null
    let cancelled = false

    async function load() {
      try {
        const [newObjectUrl] = await getOrCacheImage(src!)
        if (cancelled) {
          revokeObjectUrl(newObjectUrl)
          return
        }
        activeObjectUrl = newObjectUrl
        dispatch({ type: 'SETTLE_CACHED', cachedSrc: newObjectUrl })
      } catch {
        if (cancelled) return
        dispatch({ type: 'SETTLE' })
      }
    }

    load()

    return () => {
      cancelled = true
      if (activeObjectUrl) {
        revokeObjectUrl(activeObjectUrl)
      }
    }
  }, [src, shouldCache])

  const showSkeleton = !settled && shouldCache

  const handleLoad = useCallback(() => dispatch({ type: 'SETTLE' }), [])
  const handleError = useCallback(() => dispatch({ type: 'SETTLE' }), [])

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
        src={finalSrc}
        alt={alt}
        className={className}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        style={{ display: showSkeleton ? 'none' : undefined, ...rest.style }}
      />
    </>
  )
}
