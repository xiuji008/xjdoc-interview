import { useState, useEffect } from 'react'

/**
 * 加载 docs-manifest.json（文档清单）
 */
export function useDocManifest() {
  const [manifest, setManifest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('./docs-manifest.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setManifest(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('加载文档清单失败:', err)
        setError(`无法加载文档清单: ${err.message}`)
        setLoading(false)
      })
  }, [])

  return { manifest, loading, error }
}
