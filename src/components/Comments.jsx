/**
 * Giscus 评论组件
 *
 * 使用前需要：
 * 1. 仓库 Settings → 启用 Discussions
 * 2. 访问 https://github.com/apps/giscus → 安装到本仓库
 * 3. 将下方 repoId 和 categoryId 填入配置
 *    （访问 https://giscus.app/zh-CN 填入仓库信息自动获取）
 */

import { useEffect, useRef } from 'react'

// ===== 请修改这里的配置 =====
const GISCUS_CONFIG = {
  repo: 'xiuji008/xjdoc-interview',
  repoId: 'YOUR_REPO_ID',
  category: 'General',
  categoryId: 'YOUR_CATEGORY_ID',
}
// ==========================

export default function Comments({ slug, title }) {
  const containerRef = useRef(null)

  const configured = GISCUS_CONFIG.repoId !== 'YOUR_REPO_ID'

  useEffect(() => {
    if (!configured || !slug || !containerRef.current) return

    // 清除旧内容
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
  }, [configured, slug])

  if (!configured) {
    return (
      <div className="article-comments">
        <div className="comments-placeholder">
          <h3>💬 评论区</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.8 }}>
            配置 Giscus 后启用评论功能
          </p>
          <details style={{ marginTop: 8 }}>
            <summary style={{ fontSize: 12, color: 'var(--accent-color)', cursor: 'pointer' }}>
              查看配置步骤
            </summary>
            <ol style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8, paddingLeft: 20, lineHeight: 2 }}>
              <li>仓库 Settings → 勾选 <strong>Discussions</strong></li>
              <li>访问 <a href="https://github.com/apps/giscus" target="_blank" rel="noopener noreferrer">giscus GitHub App</a> 安装到本仓库</li>
              <li>访问 <a href="https://giscus.app/zh-CN" target="_blank" rel="noopener noreferrer">giscus.app</a> 填入仓库信息获取 repoId 和 categoryId</li>
              <li>在 <code>src/components/Comments.jsx</code> 中填入</li>
            </ol>
          </details>
        </div>
      </div>
    )
  }

  return <div className="article-comments giscus" ref={containerRef} />
}
