import { useState } from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import ArticleView from './components/ArticleView'
import EmojiPicker from './components/EmojiPicker'
import AboutModal from './components/AboutModal'
import { useDocManifest } from './hooks/useDocManifest'

export default function App() {
  const { manifest, loading, error } = useDocManifest()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <p>加载知识库中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-error">
        <h2>加载失败</h2>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? '收起侧栏' : '展开侧栏'}
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>
        <img className="app-logo" src="avatar.png" alt="Logo" />
        <h1 className="app-title">面试知识库</h1>
        <div className="header-actions">
          <button
            className="header-btn"
            onClick={() => setEmojiOpen(true)}
            title="常用 Emoji"
          >
            😊 <span className="header-btn-label">Emoji</span>
          </button>
          <a
            className="header-btn header-link"
            href="https://github.com/xiuji008/xjdoc-interview"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub 仓库"
          >
            <svg className="header-icon" viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span className="header-btn-label">GitHub</span>
          </a>
          <button
            className="header-btn"
            onClick={() => setAboutOpen(true)}
            title="关于作者"
          >
            <img className="header-btn-icon" src="logos/blog-xj.svg" alt="" />
            <span className="header-btn-label">关于作者</span>
          </button>
        </div>
      </header>
      <EmojiPicker isOpen={emojiOpen} onClose={() => setEmojiOpen(false)} />
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />

      <div className="app-body">
        <aside className={`app-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <Sidebar tree={manifest?.tree} />
        </aside>

        <main className="app-content">
          <Routes>
            <Route
              path="/"
              element={
                <div className="welcome-page">
                  <h1>📖 面试知识库</h1>
                  <p>从左侧文档树选择一篇文章开始阅读</p>
                  <div className="welcome-stats">
                    <p>📁 总计 {countAllFiles(manifest?.tree)} 篇文档</p>
                    <p>💡 左侧边栏可按关键字搜索</p>
                  </div>
                </div>
              }
            />
            <Route path="/docs/:slug" element={<ArticleViewWrapper manifest={manifest} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function ArticleViewWrapper({ manifest }) {
  const { slug } = useParams()
  return <ArticleView slug={slug} tree={manifest?.tree} />
}

function countAllFiles(tree) {
  if (!tree?.children) return 0
  let count = 0
  for (const node of tree.children) {
    if (node.type === 'file') count++
    else if (node.children) count += countAllFiles(node)
  }
  return count
}
