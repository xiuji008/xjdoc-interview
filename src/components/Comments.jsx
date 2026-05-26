/**
 * Giscus 评论组件（基于 GitHub Discussions）
 */

import { useEffect, useRef } from 'react'

// ===== Giscus 配置 =====
const GISCUS_CONFIG = {
  repo: 'xiuji008/xjdoc-interview',
  repoId: 'R_kgDOSoPcRg',
  category: 'Announcements',
  categoryId: 'DIC_kwDOSoPcRs4C94wU',
}
// =======================

export default function Comments({ slug }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!slug || !containerRef.current) return

    containerRef.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', GISCUS_CONFIG.repo)
    script.setAttribute('data-repo-id', GISCUS_CONFIG.repoId)
    script.setAttribute('data-category', GISCUS_CONFIG.category)
    script.setAttribute('data-category-id', GISCUS_CONFIG.categoryId)
    script.setAttribute('data-mapping', 'specific')
    script.setAttribute('data-term', slug)
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'bottom')
    script.setAttribute('data-theme', 'preferred_color_scheme')
    script.setAttribute('data-lang', 'zh-CN')
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true

    containerRef.current.appendChild(script)
  }, [slug])

  return <div className="article-comments giscus" ref={containerRef} />
}
