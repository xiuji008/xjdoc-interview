/**
 * 构建时文档清单生成脚本
 *
 * 递归扫描 docs/ 目录，提取每个 .md 文件的 YAML Front Matter，
 * 生成 docs-manifest.json 并写入 public/ 目录。
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const DOCS_DIR = path.resolve('docs')
const PUBLIC_DIR = path.resolve('public')

/**
 * 递归遍历目录，生成树结构
 */
function walkDir(dirPath, relativePath = '') {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  const children = []

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)
    const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name

    if (entry.isDirectory()) {
      const sub = walkDir(fullPath, relPath)
      if (sub.children.length > 0) {
        children.push({
          name: entry.name,
          type: 'directory',
          children: sub.children,
        })
      }
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf-8')
      let frontMatter = {}
      try {
        const parsed = matter(content)
        frontMatter = parsed.data || {}
      } catch {
        // 解析失败时使用空对象
      }

      const slug = relPath.replace(/\.md$/, '').replace(/\\/g, '/')

      children.push({
        name: entry.name.replace(/\.md$/, ''),
        type: 'file',
        slug,
        title: frontMatter.title || entry.name.replace(/\.md$/, ''),
        emoji: frontMatter.emoji || '',
        tags: frontMatter.tags || [],
        category: frontMatter.category || '',
        description: frontMatter.description || '',
        created: frontMatter.created || '',
        updated: frontMatter.updated || '',
        // 保留所有原始 frontMatter 字段
        ...frontMatter,
      })
    }
  }

  // 文件排在前面，目录排在后面，各自按名称排序
  children.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'file' ? -1 : 1
    return a.name.localeCompare(b.name, 'zh-CN')
  })

  return { name: path.basename(dirPath), type: 'directory', children }
}

/**
 * 构建文档清单
 */
export function buildManifest() {
  if (!fs.existsSync(DOCS_DIR)) {
    console.warn('[build-manifest] docs/ 目录不存在，跳过')
    return
  }

  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true })
  }

  const tree = walkDir(DOCS_DIR)
  const manifest = { tree }

  const outputPath = path.join(PUBLIC_DIR, 'docs-manifest.json')
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2), 'utf-8')

  console.log(`[build-manifest] 已生成: ${outputPath}`)
  console.log(`[build-manifest] 共扫描 ${countFiles(tree)} 个文档`)

  return manifest
}

function countFiles(node) {
  if (!node) return 0
  if (node.type === 'file') return 1
  return (node.children || []).reduce((sum, c) => sum + countFiles(c), 0)
}

// 直接运行时执行
buildManifest()
