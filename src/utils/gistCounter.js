/**
 * GitHub Gist 阅读量计数器
 *
 * 数据存储在 GitHub Gist 中，通过 Gist API 读写。
 * Token 仅有 gist 权限，通过 Vite 环境变量注入，不写入源码。
 *
 * 本地开发：创建 .env 文件，参考 .env.example
 * 生产部署：在 GitHub Repo Secrets 中设置 VITE_GIST_ID 和 VITE_GIST_TOKEN
 */

const GIST_ID = import.meta.env.VITE_GIST_ID || ''
const GIST_TOKEN = import.meta.env.VITE_GIST_TOKEN || ''

// 调试日志：确认环境变量是否被正确注入
if (import.meta.env.DEV) {
  console.log('[GistCounter] GIST_ID:', GIST_ID ? '已设置' : '未设置')
  console.log('[GistCounter] GIST_TOKEN:', GIST_TOKEN ? '已设置' : '未设置')
}

const GIST_API = `https://api.github.com/gists/${GIST_ID}`

async function fetchCounts() {
  const res = await fetch(GIST_API, {
    headers: { Authorization: `token ${GIST_TOKEN}` },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  const filename = Object.keys(data.files)[0]
  return JSON.parse(data.files[filename]?.content || '{}')
}

async function saveCounts(counts) {
  const data = await fetch(GIST_API).then((r) => r.json())
  const filename = Object.keys(data.files)[0]
  const res = await fetch(GIST_API, {
    method: 'PATCH',
    headers: {
      Authorization: `token ${GIST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: { [filename]: { content: JSON.stringify(counts, null, 2) } },
    }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return true
}

export function isCounterConfigured() {
  return !!(GIST_ID && GIST_TOKEN)
}

/**
 * 获取当前计数并递增
 * @param {string} slug  文档唯一标识
 * @param {number} step  每次递增步长（默认 4）
 */
export async function addPageView(slug, step = 4) {
  if (!slug || !isCounterConfigured()) return 0

  try {
    const counts = await fetchCounts()
    const current = (counts[slug] || 0) + step
    counts[slug] = current
    await saveCounts(counts)
    return current
  } catch (err) {
    console.warn('[GistCounter] 操作失败:', err)
    return 0
  }
}
