/**
 * 标签分布统计
 *
 * 从 manifest tree 动态计算当前所有文档的标签分布，
 * 结合 Gist 中的阅读量数据展示每标签的文档数和总阅读量。
 */
import { useState, useEffect, useMemo } from 'react'
import { getPageViewsMap } from '../utils/gistStore'

export default function TagStats({ tree }) {
  const [viewsMap, setViewsMap] = useState({})

  useEffect(() => {
    getPageViewsMap().then(setViewsMap).catch(() => {})
  }, [])

  // 提取当前文档标签映射
  const currentTagMap = useMemo(() => {
    const map = {}
    const docs = []
    function walk(n) {
      if (n.type === 'file') {
        docs.push({ slug: n.slug, tags: n.tags || [] })
        for (const t of n.tags || []) {
          if (!map[t]) map[t] = []
          map[t].push(n.slug)
        }
      } else if (n.children) {
        n.children.forEach(walk)
      }
    }
    if (tree?.children) tree.children.forEach(walk)
    return { map, docs }
  }, [tree])

  // 标签分布（按文档数降序，同文档数按阅读量降序）
  const tagDistribution = useMemo(() => {
    const entries = Object.entries(currentTagMap.map)
      .map(([tag, slugs]) => ({
        tag,
        count: slugs.length,
        docs: slugs,
        totalViews: slugs.reduce((s, slug) => s + (viewsMap[slug] || 0), 0),
      }))
      .sort((a, b) => b.count - a.count || b.totalViews - a.totalViews)
    return entries
  }, [currentTagMap, viewsMap])

  const maxCount = tagDistribution[0]?.count || 1

  return (
    <div className="tag-stats">
      <h2 className="tag-stats-title">📊 标签道统</h2>
      <p className="tag-stats-subtitle">
        当前标签分布 · 共 {tagDistribution.length} 个标签 · {currentTagMap.docs.length} 篇文档
      </p>

      {tagDistribution.length === 0 ? (
        <div className="tag-stats-empty">暂无标签数据</div>
      ) : (
        <div className="tag-dist-grid">
          {tagDistribution.map((item) => {
            const pct = Math.round((item.count / maxCount) * 100)
            return (
              <div key={item.tag} className="tag-dist-item">
                <div className="tag-dist-header">
                  <span className="tag-dist-tag">{item.tag}</span>
                  <span className="tag-dist-count">{item.count} 篇</span>
                </div>
                <div className="tag-dist-bar-bg">
                  <div
                    className="tag-dist-bar"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="tag-dist-footer">
                  <span className="tag-dist-views" title="阅读量总和">👁️ {item.totalViews}</span>
                  <span className="tag-dist-slugs" title="包含文档">{item.docs.join('、')}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
