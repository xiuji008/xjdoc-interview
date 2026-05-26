import { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

/**
 * 左侧文档树组件
 */
export default function Sidebar({ tree }) {
  const [search, setSearch] = useState('')

  const filteredTree = useMemo(() => {
    if (!tree || !search.trim()) return tree
    return filterTree(tree, search.toLowerCase())
  }, [tree, search])

  return (
    <div className="sidebar-tree">
      <input
        className="sidebar-search"
        type="text"
        placeholder="🔍 搜索文档..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <TreeNodes nodes={filteredTree?.children} depth={0} search={search} />
    </div>
  )
}

function TreeNodes({ nodes, depth, search }) {
  if (!nodes || nodes.length === 0) {
    if (search) return <div className="tree-empty" style={{ padding: '16px 12px', color: 'var(--text-muted)', fontSize: 13 }}>没有匹配的文档</div>
    return null
  }

  return nodes.map((node) => (
    <TreeNode key={node.name + node.type + depth} node={node} depth={depth} />
  ))
}

function TreeNode({ node, depth }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [expanded, setExpanded] = useState(depth < 2)

  const isDirectory = node.type === 'directory'
  const isActive =
    !isDirectory &&
    location.pathname === `/docs/${encodeURIComponent(node.slug)}`

  const handleClick = () => {
    if (isDirectory) {
      setExpanded(!expanded)
    } else {
      navigate(`/docs/${encodeURIComponent(node.slug)}`)
    }
  }

  const getIcon = () => {
    if (isDirectory) return '📁'
    return node.emoji || '📄'
  }

  return (
    <div className="tree-node">
      <div
        className={`tree-node-header ${isActive ? 'active' : ''}`}
        onClick={handleClick}
        title={node.title || node.name}
      >
        {isDirectory && (
          <span className={`expand-icon ${expanded ? 'expanded' : ''}`}>
            ▶
          </span>
        )}
        {!isDirectory && <span className="expand-icon" style={{ visibility: 'hidden' }}>▶</span>}
        <span className="node-icon">{getIcon()}</span>
        <span className="node-name">{node.title || node.name}</span>
      </div>
      {isDirectory && expanded && (
        <div className="tree-children">
          <TreeNodes nodes={node.children} depth={depth + 1} />
        </div>
      )}
    </div>
  )
}

/**
 * 递归过滤树节点（按标题/标签匹配）
 */
function filterTree(node, query) {
  if (node.type === 'file') {
    const titleMatch = node.title?.toLowerCase().includes(query)
    const tagMatch = (node.tags || []).some((t) => t.toLowerCase().includes(query))
    const slugMatch = node.slug?.toLowerCase().includes(query)
    return titleMatch || tagMatch || slugMatch ? { ...node } : null
  }

  const filteredChildren = (node.children || [])
    .map((child) => filterTree(child, query))
    .filter(Boolean)

  if (filteredChildren.length > 0) {
    return { ...node, children: filteredChildren }
  }

  return null
}
