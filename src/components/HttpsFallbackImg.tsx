import { useState, useCallback, type ImgHTMLAttributes, type SyntheticEvent } from 'react'
import { resolveImageRenderSrc } from '../utils/publicAssetUrl'
import { CachedImg } from '../utils/CachedImg'

/** URLs whose HTTPS variant failed, keyed by the original URL string. */
const httpsFailedCache = new Map<string, true>()

function tryDowngradeToHttp(url: string): string {
  if (url.startsWith('http://')) return url
  if (!url.startsWith('https://')) return url
  return `http://${url.slice(8)}`
}

interface HttpsFallbackImgProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string
  /** Pre-upgraded URL (already https://). If it matches a known-failed URL, starts as http://. */
  srcHttps: string
}

export function HttpsFallbackImg({
  src,
  srcHttps,
  alt = '',
  className,
  loading = 'lazy',
  onError: userOnError,
  ...rest
}: HttpsFallbackImgProps) {
  const [imgSrc, setImgSrc] = useState(() =>
    httpsFailedCache.has(src) ? tryDowngradeToHttp(src) : srcHttps,
  )

  const handleError = useCallback(
    (e: SyntheticEvent<HTMLImageElement>) => {
      if (imgSrc.startsWith('https://') && !httpsFailedCache.has(src)) {
        httpsFailedCache.set(src, true)
        setImgSrc(tryDowngradeToHttp(imgSrc))
      }
      userOnError?.(e)
    },
    [imgSrc, src, userOnError],
  )

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
      {...rest}
    />
  )
}

type SafeImgProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { src: string }

/** Resolves `public/` paths and upgrades external `http://` images with HTTPS→HTTP fallback. */
export function SafeImg({ src, alt = '', className, loading = 'lazy', ...rest }: SafeImgProps) {
  const resolved = resolveImageRenderSrc(src)
  if (!resolved) {
    return null
  }
  if (resolved.variant === 'http-upgrade-fallback') {
    return (
      <HttpsFallbackImg
        src={resolved.httpSrc}
        srcHttps={resolved.httpsSrc}
        alt={alt}
        className={className}
        loading={loading}
        {...rest}
      />
    )
  }
  // Cross-origin images (https:// from other origins) → use IndexedDB cache
  if (resolved.src.startsWith('https://') && !resolved.src.startsWith(window.location.origin)) {
    return (
      <CachedImg
        src={resolved.src}
        alt={alt}
        className={className}
        loading={loading}
        {...rest}
      />
    )
  }
  // Same-origin / relative / data: URLs → served directly (browser HTTP cache)
  return (
    <img src={resolved.src} alt={alt} className={className} loading={loading} {...rest} />
  )
}
