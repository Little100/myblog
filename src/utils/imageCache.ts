/**
 * IndexedDB-based image cache.
 * Fetches images, stores them as Blobs, and returns object URLs for reuse.
 * Automatic cleanup when total size exceeds MAX_CACHE_SIZE.
 */

const DB_NAME = 'img-cache-v1'
const STORE_NAME = 'images'
const DB_VERSION = 1
/** Max cache size: 100 MB */
const MAX_CACHE_SIZE = 100 * 1024 * 1024
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 days TTL

interface CacheEntry {
  url: string
  blob: Blob
  cachedAt: number
  size: number
}

let _db: IDBDatabase | null = null
let _dbInit: Promise<IDBDatabase> | null = null

async function openDb(): Promise<IDBDatabase> {
  if (_db) return _db
  if (_dbInit) return _dbInit

  _dbInit = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)

    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'url' })
      }
    }

    req.onsuccess = () => {
      _db = req.result
      resolve(_db)
    }

    req.onerror = () => reject(req.error)
  })

  return _dbInit
}

/** Store a blob entry in IndexedDB, replacing any existing entry for the same URL. */
async function putEntry(entry: CacheEntry): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(entry)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

/** Retrieve an entry by URL, or null if not found. */
async function getEntry(url: string): Promise<CacheEntry | null> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).get(url)
    req.onsuccess = () => resolve(req.result ?? null)
    req.onerror = () => reject(req.error)
  })
}

/** Delete an entry by URL. */
async function deleteEntry(url: string): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(url)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

/** Get all entries (used for cleanup / size calculation). */
async function getAllEntries(): Promise<CacheEntry[]> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).getAll()
    req.onsuccess = () => resolve(req.result ?? [])
    req.onerror = () => reject(req.error)
  })
}

/** Total bytes currently stored. */
async function totalSize(): Promise<number> {
  const entries = await getAllEntries()
  return entries.reduce((sum, e) => sum + e.size, 0)
}

/**
 * Evict oldest entries until total size is under MAX_CACHE_SIZE,
 * and remove anything older than MAX_AGE_MS.
 */
async function evictIfNeeded(): Promise<void> {
  let entries = await getAllEntries()
  const now = Date.now()

  // Remove expired entries first
  const expired = entries.filter((e) => now - e.cachedAt > MAX_AGE_MS)
  await Promise.all(expired.map((e) => deleteEntry(e.url)))
  entries = entries.filter((e) => now - e.cachedAt <= MAX_AGE_MS)

  // Remove oldest entries until under limit
  let size = entries.reduce((sum, e) => sum + e.size, 0)
  if (size <= MAX_CACHE_SIZE) return

  // Sort oldest first
  entries.sort((a, b) => a.cachedAt - b.cachedAt)

  while (size > MAX_CACHE_SIZE && entries.length > 0) {
    const victim = entries.shift()!
    await deleteEntry(victim.url)
    size -= victim.size
  }
}

/** Revoke an object URL to free memory. Call this when the image is no longer displayed. */
export function revokeObjectUrl(objectUrl: string): void {
  URL.revokeObjectURL(objectUrl)
}

/**
 * Get a cached image as an object URL.
 * Returns null if the image has never been cached.
 * The returned object URL is valid until revokeObjectUrl() is called.
 */
export async function getCachedBlobUrl(url: string): Promise<string | null> {
  const entry = await getEntry(url)
  if (!entry) return null
  if (Date.now() - entry.cachedAt > MAX_AGE_MS) {
    await deleteEntry(url)
    return null
  }
  return URL.createObjectURL(entry.blob)
}

/**
 * Fetch an image and store it in the cache.
 * Returns the new object URL.
 */
export async function cacheImage(url: string): Promise<string> {
  const resp = await fetch(url)
  if (!resp.ok) throw new Error(`Failed to fetch image: ${resp.status} ${resp.statusText} for ${url}`)
  const blob = await resp.blob()

  const entry: CacheEntry = {
    url,
    blob,
    cachedAt: Date.now(),
    size: blob.size,
  }

  await putEntry(entry)
  await evictIfNeeded()

  return URL.createObjectURL(blob)
}

/**
 * Try to get a cached version; if not cached, fetch and cache it.
 * Returns a tuple: [objectUrl, fromCache].
 * Caller must call revokeObjectUrl(result[0]) when the image is no longer displayed.
 */
export async function getOrCacheImage(url: string): Promise<[objectUrl: string, fromCache: boolean]> {
  const cached = await getCachedBlobUrl(url)
  if (cached) return [cached, true]

  try {
    const objectUrl = await cacheImage(url)
    return [objectUrl, false]
  } catch {
    // Network failure — try to return a stale cache even if expired
    const stale = await getEntry(url)
    if (stale) {
      return [URL.createObjectURL(stale.blob), false]
    }
    throw new Error(`Cannot load image: ${url}`)
  }
}

/** Delete every cached entry and free all object URLs. */
export async function clearImageCache(): Promise<void> {
  const entries = await getAllEntries()
  await Promise.all(entries.map((e) => deleteEntry(e.url)))
}

/** Return how many bytes are currently cached. */
export async function getCacheSizeBytes(): Promise<number> {
  return totalSize()
}

/** Return how many images are currently cached. */
export async function getCacheCount(): Promise<number> {
  const entries = await getAllEntries()
  return entries.length
}
