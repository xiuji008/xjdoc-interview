/**
 * GitHub Gist 阅读量计数器
 *
 * 数据存储在 GitHub Gist 中，通过 Gist API 读写。
 * Token 仅有 gist 权限，不通向代码仓库，风险可控。
 *
 * 配置步骤：
 * 1. 打开 https://gist.github.com → 新建 Secret Gist
 *    文件名：counts.json，内容：{}
 *    创建后复制 URL 中的 GIST_ID（https://gist.github.com/xxx/{GIST_ID}）
 *
 * 2. 打开 https://github.com/settings/tokens
 *    → Generate new token (classic) → 仅勾选 gist 权限 → 生成并复制 Token
 *
 * 3. 将 GIST_ID 和 Token 填入下方
 */

const GIST_ID = ''
const GIST_TOKEN = ''

const GIST_API = `https://api.github.com/gists/${GIST_ID}`

async function fetchCounts() {
  const res = await fetch(GIST_API)
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
