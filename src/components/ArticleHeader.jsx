/**
 * 文章头部的 Front Matter 展示卡片
 */
export default function ArticleHeader({ frontMatter }) {
  const { title, emoji, category, tags, description, created, updated } =
    frontMatter

  return (
    <div className="article-header">
      <div className="article-header-title">
        {emoji && <span>{emoji}</span>}
        <span>{title || '无标题'}</span>
      </div>

      <div className="article-header-meta">
        {category && (
          <span className="article-header-meta-item">
            📂 {category}
          </span>
        )}
        {created && (
          <span className="article-header-meta-item">
            📅 {created}
          </span>
        )}
        {updated && (
          <span className="article-header-meta-item">
            ✏️ {updated}
          </span>
        )}
      </div>

      {tags && tags.length > 0 && (
        <div className="article-header-tags">
          {tags.map((tag) => (
            <span key={tag} className="article-header-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      {description && (
        <p style={{ marginTop: 12, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {description}
        </p>
      )}

      {/* 渲染其他非标准字段 */}
      {Object.entries(frontMatter)
        .filter(
          ([key]) =>
            !['title', 'emoji', 'category', 'tags', 'description', 'created', 'updated', 'slug'].includes(key)
        )
        .map(([key, value]) => (
          <div key={key} className="article-header-meta-item" style={{ marginTop: 8 }}>
            <strong>{key}:</strong>&nbsp;
            {Array.isArray(value) ? value.join(', ') : String(value)}
          </div>
        ))}
    </div>
  )
}
