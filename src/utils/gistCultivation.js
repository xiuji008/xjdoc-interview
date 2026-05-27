/**
 * GitHub Gist 修仙历程持久化
 *
 * 复用已有的 Gist 配置（VITE_GIST_ID / VITE_GIST_TOKEN），
 * 在同一个 Gist 文件中用 _cultivation_ 前缀键存储修仙数据。
 * 未配置 Gist 时自动降级到 localStorage。
 */

const GIST_ID = import.meta.env.VITE_GIST_ID || ''
const GIST_TOKEN = import.meta.env.VITE_GIST_TOKEN || ''

// localStorage 降级键
const LS_SCORE_KEY = 'xjdoc_cultivation_previous_score'
const LS_HISTORY_KEY = 'xjdoc_cultivation_history'

const GIST_API = `https://api.github.com/gists/${GIST_ID}`
const AUTH_HEADER = { Authorization: `token ${GIST_TOKEN}` }

function isGistConfigured() {
  return !!(GIST_ID && GIST_TOKEN)
}

let gistFilename = null

async function getGistFilename() {
  if (gistFilename) return gistFilename
  const res = await fetch(GIST_API, { headers: AUTH_HEADER })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  gistFilename = Object.keys(data.files)[0]
  return gistFilename
}

/** 从 Gist 读取全部数据（含页面计数和修仙数据） */
async function fetchAllData() {
  const res = await fetch(GIST_API, { headers: AUTH_HEADER })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  const filename = Object.keys(data.files)[0]
  return JSON.parse(data.files[filename]?.content || '{}')
}

/** 写入 Gist */
async function saveAllData(allData) {
  const filename = await getGistFilename()
  const res = await fetch(GIST_API, {
    method: 'PATCH',
    headers: {
      ...AUTH_HEADER,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: { [filename]: { content: JSON.stringify(allData, null, 2) } },
    }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

// ===== localStorage 降级读写 =====
function lsRead(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') } catch { return null }
}
function lsWrite(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch { /* 静默 */ }
}

// ===== 公开 API =====

/** 读取上次修为值 */
export async function loadPreviousScore() {
  if (!isGistConfigured()) {
    try { return Number(localStorage.getItem(LS_SCORE_KEY)) || 0 } catch { return 0 }
  }
  try {
    const all = await fetchAllData()
    return all._cultivation_previousScore || 0
  } catch {
    // Gist 读取失败，回退 localStorage
    try { return Number(localStorage.getItem(LS_SCORE_KEY)) || 0 } catch { return 0 }
  }
}

/** 保存当前修为值 */
export async function saveCurrentScore(score) {
  // 本地始终保存一份
  try { localStorage.setItem(LS_SCORE_KEY, String(score)) } catch { /* 静默 */ }

  if (!isGistConfigured()) return

  try {
    const all = await fetchAllData()
    all._cultivation_previousScore = score
    await saveAllData(all)
  } catch {
    // 静默失败
  }
}

/** 清空所有修仙数据（本地 + Gist） */
export async function resetCultivationData() {
  // 清空本地
  try { localStorage.removeItem(LS_SCORE_KEY) } catch { /* 静默 */ }
  try { localStorage.removeItem(LS_HISTORY_KEY) } catch { /* 静默 */ }

  // 清空 Gist
  if (!isGistConfigured()) return
  try {
    const all = await fetchAllData()
    delete all._cultivation_previousScore
    delete all._cultivation_history
    await saveAllData(all)
  } catch {
    /* 静默 */
  }
}

/** 读取突破历史 */
export async function loadHistory() {
  if (!isGistConfigured()) {
    try { return JSON.parse(localStorage.getItem(LS_HISTORY_KEY) || '[]') } catch { return [] }
  }
  try {
    const all = await fetchAllData()
    return all._cultivation_history || []
  } catch {
    try { return JSON.parse(localStorage.getItem(LS_HISTORY_KEY) || '[]') } catch { return [] }
  }
}

/** 保存突破历史 */
export async function saveHistory(history) {
  // 本地始终备份
  try { localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(history)) } catch { /* 静默 */ }

  if (!isGistConfigured()) return

  try {
    const all = await fetchAllData()
    all._cultivation_history = history
    await saveAllData(all)
  } catch {
    // 静默失败
  }
}
