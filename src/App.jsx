import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import ArticleView from './components/ArticleView'
import { useDocManifest } from './hooks/useDocManifest'

export default function App() {
  const { manifest, loading, error } = useDocManifest()
  const [sidebarOpen, setSidebarOpen] = useState(true)

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
      </header>

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
