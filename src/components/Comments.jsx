/**
 * Gitalk 评论组件
 *
 * 使用前需要在 GitHub 上创建 OAuth App：
 * 1. 访问 https://github.com/settings/developers → New OAuth App
 * 2. Homepage URL 填 GitHub Pages 地址 (如 https://xj.github.io/xjdoc-interview/)
 * 3. Authorization callback URL 同上
 * 4. 获取 Client ID 和 Client Secret
 * 5. 将值填入下方 repoConfig 中
 */

import { useEffect, useRef, useState } from 'react'

// ===== 请修改这里的配置 =====
const GITALK_CONFIG = {
  clientID: 'YOUR_GITHUB_CLIENT_ID',
  clientSecret: 'YOUR_GITHUB_CLIENT_SECRET',
  repo: 'xjdoc-interview',
  owner: 'YOUR_GITHUB_USERNAME',
  admin: ['YOUR_GITHUB_USERNAME'],
}
// ==========================

export default function Comments({ slug, title }) {
  const containerRef = useRef(null)
  const [configured, setConfigured] = useState(false)

  useEffect(() => {
    if (GITALK_CONFIG.clientID !== 'YOUR_GITHUB_CLIENT_ID') {
      setConfigured(true)
    }
  }, [])

  useEffect(() => {
    if (!configured || !slug || !containerRef.current) return

    import('gitalk/dist/gitalk.css')
    import('gitalk').then(({ default: Gitalk }) => {
      const gitalk = new Gitalk({
        clientID: GITALK_CONFIG.clientID,
        clientSecret: GITALK_CONFIG.clientSecret,
        repo: GITALK_CONFIG.repo,
        owner: GITALK_CONFIG.owner,
        admin: GITALK_CONFIG.admin,
        id: slug.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 50),
        title: title || slug,
        labels: ['comment'],
        distractionFreeMode: false,
      })

      containerRef.current.innerHTML = ''
      gitalk.render(containerRef.current)
    })
  }, [configured, slug, title])

  if (!configured) {
    return (
      <div className="article-comments">
        <div className="comments-placeholder">
          <h3>💬 评论区</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.8 }}>
            配置 Gitalk 后启用评论功能<br />
            <code>src/components/Comments.jsx</code> → 填写 clientID / clientSecret / owner / admin
          </p>
          <details style={{ marginTop: 8 }}>
            <summary style={{ fontSize: 12, color: 'var(--accent-color)', cursor: 'pointer' }}>
              查看配置步骤
            </summary>
            <ol style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8, paddingLeft: 20, lineHeight: 2 }}>
              <li>访问 <a href="https://github.com/settings/developers" target="_blank" rel="noopener noreferrer">GitHub Developer Settings</a></li>
              <li>点击 <strong>New OAuth App</strong></li>
              <li>Homepage URL 填你的 GitHub Pages 地址</li>
              <li>Authorization callback URL 填同样的地址</li>
              <li>获取 Client ID 和 Client Secret</li>
              <li>在 <code>src/components/Comments.jsx</code> 中填入</li>
            </ol>
          </details>
        </div>
      </div>
    )
  }

  return <div className="article-comments" ref={containerRef} />
}
