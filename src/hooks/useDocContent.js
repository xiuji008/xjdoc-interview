import { useState, useEffect } from 'react'

/**
 * 轻量级 YAML Front Matter 解析器（纯浏览器端，无 Node 依赖）
 */
function parseFrontMatter(text) {
  const match = text.match(/^---\s*\n([\s\S]*?)\n(?:---|\.\.\.)\s*\n/)
  if (!match) return { data: {}, content: text }

  const yamlStr = match[1]
  const content = text.slice(match[0].length)
  const data = {}

  for (const line of yamlStr.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const kvMatch = trimmed.match(/^(\w[\w-]*):\s*(.*)$/)
    if (!kvMatch) continue

    let value = kvMatch[2].trim()

    // 解析数组: [item1, item2, ...]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    } else {
      // 去除引号
      value = value.replace(/^["']|["']$/g, '')
    }

    data[kvMatch[1]] = value
  }

  return { data, content }
}

/**
 * 根据 slug 加载对应的 .md 文件，并解析 Front Matter
 */
export function useDocContent(slug) {
  const [content, setContent] = useState('')
  const [frontMatter, setFrontMatter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      setError('未指定文档路径')
      return
    }

    setLoading(true)
    setError(null)

    const mdPath = `./docs/${slug}.md`

    fetch(mdPath)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })
      .then((text) => {
        const parsed = parseFrontMatter(text)
        setFrontMatter(parsed.data)
        setContent(parsed.content)
        setLoading(false)
      })
      .catch((err) => {
        console.error(`加载文档失败 [${slug}]:`, err)
        setError(`文档加载失败: ${err.message}`)
        setLoading(false)
      })
  }, [slug])

  return { content, frontMatter, loading, error }
}
