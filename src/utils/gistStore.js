/**
 * 统一 Gist 存储层
 *
 * 所有持久化数据统一存储在同一个 Gist 文件中：
 * - 页面阅读量（键 = slug）
 * - 修仙数据（_cultivation_*）
 *
 * 未配置 Gist 时自动降级到 localStorage。
 */

const GIST_ID = import.meta.env.VITE_GIST_ID || ''
const GIST_TOKEN = import.meta.env.VITE_GIST_TOKEN || ''
const GIST_API = `https://api.github.com/gists/${GIST_ID}`
const AUTH_HEADER = { Authorization: `token ${GIST_TOKEN}` }

const LS_KEY = 'xjdoc_gist_cache'

let gistFilename = null

function isConfigured() {
  return !!(GIST_ID && GIST_TOKEN)
}

// ===== 底层 Gist 读写 =====

async function getFilename() {
  if (gistFilename) return gistFilename
  const res = await fetch(GIST_API, { headers: AUTH_HEADER })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  gistFilename = Object.keys(data.files)[0]
  return gistFilename
}

/** 从 Gist 读取全部数据 */
async function fetchAllData() {
  const res = await fetch(GIST_API, { headers: AUTH_HEADER })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  const filename = Object.keys(data.files)[0]
  return JSON.parse(data.files[filename]?.content || '{}')
}

/** 写入完整数据到 Gist */
async function saveAllData(allData) {
  const filename = await getFilename()
  const res = await fetch(GIST_API, {
    method: 'PATCH',
    headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      files: { [filename]: { content: JSON.stringify(allData, null, 2) } },
    }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

// ===== localStorage 降级 =====

function lsRead() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}') } catch { return {} }
}

function lsWrite(data) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)) } catch { /* 静默 */ }
}

// ===== 通用读写 API =====

/**
 * 读取完整 Gist 数据（自动降级到 localStorage）
 */
export async function loadAllGistData() {
  if (!isConfigured()) return lsRead()
  try {
    return await fetchAllData()
  } catch {
    return lsRead()
  }
}

/**
 * 保存完整 Gist 数据
 */
export async function saveAllGistData(data) {
  lsWrite(data)
  if (!isConfigured()) return
  try {
    await saveAllData(data)
  } catch {
    // 静默失败
  }
}

/**
 * 读取 Gist 中指定键的值
 */
export async function loadGistKey(key, defaultValue = null) {
  const all = await loadAllGistData()
  return all[key] !== undefined ? all[key] : defaultValue
}

/**
 * 设置 Gist 中指定键的值
 */
export async function saveGistKey(key, value) {
  const all = await loadAllGistData()
  all[key] = value
  await saveAllGistData(all)
}

// ===== 页面阅读量 API =====

/**
 * 获取所有页面的阅读量
 */
export async function getPageViewsMap() {
  const all = await loadAllGistData()
  const views = {}
  for (const [k, v] of Object.entries(all)) {
    if (!k.startsWith('_') && typeof v === 'number') {
      views[k] = v
    }
  }
  return views
}

/**
 * 为指定 slug 增加阅读量
 */
export async function addPageView(slug, step = 1) {
  if (!slug) return 0
  const all = await loadAllGistData()
  const current = (all[slug] || 0) + step
  all[slug] = current
  await saveAllGistData(all)
  return current
}

// ===== 检查 Gist 配置状态 =====

export function isGistConfigured() {
  return isConfigured()
}
