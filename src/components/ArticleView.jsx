import { useState, useEffect } from 'react'
import { useDocContent } from '../hooks/useDocContent'
import ArticleHeader from './ArticleHeader'
import MarkdownRenderer from './MarkdownRenderer'
import Comments from './Comments'
import ErrorBoundary from './ErrorBoundary'

/**
 * 文章详情页
 */
export default function ArticleView({ slug, tree }) {
  const { content, frontMatter, loading, error } = useDocContent(slug)
  const [ready, setReady] = useState(false)

  // 延迟一帧渲染，确保 DOM 完全就绪后再让子组件做 DOM 测量
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  if (loading) {
    return (
      <div className="article-not-found">
        <div className="loading-spinner" />
        <p>加载中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="article-not-found">
        <h2>📄 文档未找到</h2>
        <p>{error}</p>
        <p style={{ marginTop: 8, fontSize: 13, color: 'var(--text-muted)' }}>
          请确认文档路径正确，或从左侧边栏选择其他文档
        </p>
      </div>
    )
  }

  if (!ready) {
    return (
      <article className="article-container">
        {frontMatter && Object.keys(frontMatter).length > 0 && (
          <ArticleHeader frontMatter={frontMatter} slug={slug} />
        )}
        <div className="article-not-found">
          <div className="loading-spinner" />
          <p>渲染中...</p>
        </div>
      </article>
    )
  }

  const title = frontMatter?.title || ''

  return (
    <article className="article-container">
      {frontMatter && Object.keys(frontMatter).length > 0 && (
        <ArticleHeader frontMatter={frontMatter} slug={slug} />
      )}

      <ErrorBoundary>
        <div className="markdown-content">
          <MarkdownRenderer content={content} />
        </div>
      </ErrorBoundary>

      <div className="article-footer" />

      <Comments slug={slug} title={title} />
    </article>
  )
}
