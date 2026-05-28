import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import ArticleView from './components/ArticleView'
import EmojiPicker from './components/EmojiPicker'
import AboutModal from './components/AboutModal'
import CultivationPanel from './components/CultivationPanel'
import CultivationManual from './components/CultivationManual'
import TagExplorer from './components/TagExplorer'
import TagStats from './components/TagStats'
import GistManager from './components/GistManager'
import MarkdownRenderer from './components/MarkdownRenderer'
import { useDocManifest } from './hooks/useDocManifest'

export default function App() {
  const navigate = useNavigate()
  const { manifest, loading, error } = useDocManifest()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [manualOpen, setManualOpen] = useState(false)
  const [gistManagerOpen, setGistManagerOpen] = useState(false)
  const [changelogOpen, setChangelogOpen] = useState(false)

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <p>汲取天地灵气中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-error">
        <h2>灵气暴乱，加载失败</h2>
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
        <img className="app-logo" src="avatar.png" alt="Logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
        <h1 className="app-title" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="title-icon">⚡</span>
          全栈成神之路
          <span className="title-subtitle">· 面试知识库</span>
        </h1>
        <div className="header-actions">
          <button
            className="header-btn"
            onClick={() => navigate('/tags')}
            title="标签道藏"
          >
            🏷️ <span className="header-btn-label">标签道藏</span>
          </button>
          <button
            className="header-btn"
            onClick={() => navigate('/tag-stats')}
            title="标签道统"
          >
            📊 <span className="header-btn-label">标签道统</span>
          </button>
          <button
            className="header-btn"
            onClick={() => setManualOpen(true)}
            title="修炼说明书"
          >
            📜 <span className="header-btn-label">修炼指南</span>
          </button>
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
            title="更新记录"
            onClick={() => setChangelogOpen(true)}
          >
            📋 <span className="header-btn-label">更新记录</span>
          </button>
          <button
            className="header-btn"
            title="Gist 数据管理"
            onClick={() => setGistManagerOpen(true)}
          >
            ⚙️ <span className="header-btn-label">灵蕴天碑</span>
          </button>
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
      <CultivationManual isOpen={manualOpen} onClose={() => setManualOpen(false)} />
      {gistManagerOpen && <GistManagerModal onClose={() => setGistManagerOpen(false)} />}
      {changelogOpen && <ChangelogModal onClose={() => setChangelogOpen(false)} />}

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
                  <div className="welcome-cultivation">
                    <CultivationPanel tree={manifest?.tree} />
                  </div>
                  <div className="welcome-info">
                    <h1 className="welcome-title">📖 全栈成神之路</h1>
                    <p className="welcome-subtitle">从左侧文档树选择一篇文章，汲取知识灵力</p>
                    <div className="welcome-stats">
                      <div className="welcome-stat-card">
                        <span className="welcome-stat-icon">📄</span>
                        <span className="welcome-stat-value">{countAllFiles(manifest?.tree)}</span>
                        <span className="welcome-stat-label">典籍</span>
                      </div>
                      <div className="welcome-stat-card">
                        <span className="welcome-stat-icon">💡</span>
                        <span className="welcome-stat-value">搜索</span>
                        <span className="welcome-stat-label">检索功法</span>
                      </div>
                      <div className="welcome-stat-card">
                        <span className="welcome-stat-icon">🚀</span>
                        <span className="welcome-stat-value">修炼</span>
                        <span className="welcome-stat-label">不断精进</span>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
            <Route path="/docs/:slug" element={<ArticleViewWrapper manifest={manifest} />} />
            <Route
              path="/tags"
              element={
                <div className="welcome-page">
                  <TagExplorer tree={manifest?.tree} />
                </div>
              }
            />
            <Route
              path="/tag-stats"
              element={
                <div className="welcome-page">
                  <TagStats tree={manifest?.tree} />
                </div>
              }
            />
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

function ChangelogModal({ onClose }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('./CHANGELOG.md')
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text() })
      .then((text) => { setContent(text); setLoading(false) })
      .catch((e) => { setError(e.message); setLoading(false) })
  }, [])

  return (
    <div className="changelog-overlay" onClick={onClose}>
      <div className="changelog-modal" onClick={(e) => e.stopPropagation()}>
        <div className="changelog-header">
          <span>📋 系统更新记录</span>
          <button className="changelog-close" onClick={onClose}>✕</button>
        </div>
        <div className="changelog-body">
          {loading && <div className="changelog-loading"><div className="loading-spinner" /><p>加载中...</p></div>}
          {error && <div className="changelog-error"><p>加载失败: {error}</p></div>}
          {content && <div className="changelog-content"><MarkdownRenderer content={content} /></div>}
        </div>
      </div>
    </div>
  )
}

function GistManagerModal({ onClose }) {
  return (
    <div className="gist-overlay" onClick={onClose}>
      <div className="gist-modal" onClick={(e) => e.stopPropagation()}>
        <div className="gist-modal-header">
          <span>⚙️ 灵蕴天碑·Gist 数据管理</span>
          <button className="gist-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="gist-modal-body">
          <GistManager />
        </div>
      </div>
    </div>
  )
}
