/**
 * 标签筛选 + 按阅读量排序 + 文档列表
 *
 * 功能：
 * 1. 展示所有标签，点击筛选文档
 * 2. 展示文档列表，含标题、标签、阅读量
 * 3. 支持按阅读量升序/降序排序
 */
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPageViewsMap } from '../utils/gistStore'

export default function TagExplorer({ tree }) {
  const navigate = useNavigate()
  const [selectedTag, setSelectedTag] = useState(null)
  const [sortBy, setSortBy] = useState('default') // 'default' | 'views-asc' | 'views-desc'
  const [viewsMap, setViewsMap] = useState({})

  // 提取所有文档和标签
  const { allDocs, allTags } = useMemo(() => {
    const docs = []
    const tagSet = new Set()
    function walk(n) {
      if (n.type === 'file') {
        docs.push({ slug: n.slug, title: n.title, emoji: n.emoji, tags: n.tags || [] })
        for (const t of n.tags || []) tagSet.add(t)
      } else if (n.children) {
        n.children.forEach(walk)
      }
    }
    if (tree?.children) tree.children.forEach(walk)
    return { allDocs: docs, allTags: [...tagSet].sort() }
  }, [tree])

  // 加载阅读量
  useEffect(() => {
    getPageViewsMap().then(setViewsMap).catch(() => {})
  }, [])

  // 筛选 + 排序
  const filteredDocs = useMemo(() => {
    let list = selectedTag
      ? allDocs.filter((d) => d.tags.includes(selectedTag))
      : [...allDocs]

    if (sortBy === 'views-asc') {
      list.sort((a, b) => (viewsMap[a.slug] || 0) - (viewsMap[b.slug] || 0))
    } else if (sortBy === 'views-desc') {
      list.sort((a, b) => (viewsMap[b.slug] || 0) - (viewsMap[a.slug] || 0))
    }
    return list
  }, [allDocs, selectedTag, sortBy, viewsMap])

  return (
    <div className="tag-explorer">
      <h2 className="tag-explorer-title">🏷️ 标签道藏</h2>
      <p className="tag-explorer-subtitle">
        点击标签筛选文档，筛选结果可按阅读量排序
      </p>

      {/* 标签云 */}
      <div className="tag-cloud">
        <button
          className={`tag-cloud-btn ${selectedTag === null ? 'active' : ''}`}
          onClick={() => setSelectedTag(null)}
        >
          全部 ({allDocs.length})
        </button>
        {allTags.map((tag) => {
          const count = allDocs.filter((d) => d.tags.includes(tag)).length
          return (
            <button
              key={tag}
              className={`tag-cloud-btn ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
            >
              {tag} ({count})
            </button>
          )
        })}
      </div>

      {/* 排序控件 */}
      <div className="tag-sort-bar">
        <span className="tag-sort-label">排序：</span>
        <select
          className="tag-sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">默认顺序</option>
          <option value="views-desc">阅读量 ↓ 最高</option>
          <option value="views-asc">阅读量 ↑ 最低</option>
        </select>
        <span className="tag-result-count">
          共 {filteredDocs.length} 篇文档
        </span>
      </div>

      {/* 文档列表 */}
      <div className="tag-doc-list">
        {filteredDocs.length === 0 && (
          <div className="tag-doc-empty">暂无匹配文档</div>
        )}
        {filteredDocs.map((doc) => (
          <div
            key={doc.slug}
            className="tag-doc-card"
            onClick={() => navigate(`/docs/${encodeURIComponent(doc.slug)}`)}
          >
            <div className="tag-doc-info">
              <span className="tag-doc-emoji">{doc.emoji || '📄'}</span>
              <span className="tag-doc-title">{doc.title}</span>
            </div>
            <div className="tag-doc-meta">
              <div className="tag-doc-tags">
                {doc.tags.map((t) => (
                  <span
                    key={t}
                    className={`tag-doc-tag ${t === selectedTag ? 'highlight' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedTag(t)
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <span className="tag-doc-views" title="阅读量">
                👁️ {viewsMap[doc.slug] || 0}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
