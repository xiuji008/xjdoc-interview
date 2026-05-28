/**
 * GitHub Gist 修仙历程持久化（向后兼容）
 *
 * 委托到统一 gistStore 模块，所有数据存储在同一个 Gist 文件中。
 * 未配置 Gist 时自动降级到 localStorage。
 */

import { loadGistKey, saveGistKey, isGistConfigured } from './gistStore'

const LS_SCORE_KEY = 'xjdoc_cultivation_previous_score'
const LS_HISTORY_KEY = 'xjdoc_cultivation_history'

/** 读取上次修为值 */
export async function loadPreviousScore() {
  // 先尝试从 gistStore 读取
  const val = await loadGistKey('_cultivation_previousScore', null)
  if (val !== null) return val
  // 降级：从 localStorage 读取
  try { return Number(localStorage.getItem(LS_SCORE_KEY)) || 0 } catch { return 0 }
}

/** 保存当前修为值 */
export async function saveCurrentScore(score) {
  try { localStorage.setItem(LS_SCORE_KEY, String(score)) } catch { /* 静默 */ }
  await saveGistKey('_cultivation_previousScore', score)
}

/** 清空所有修仙数据（本地 + Gist） */
export async function resetCultivationData() {
  try { localStorage.removeItem(LS_SCORE_KEY) } catch { /* 静默 */ }
  try { localStorage.removeItem(LS_HISTORY_KEY) } catch { /* 静默 */ }
  const all = await (await import('./gistStore')).loadAllGistData()
  delete all._cultivation_previousScore
  delete all._cultivation_history
  await (await import('./gistStore')).saveAllGistData(all)
}

/** 读取突破历史 */
export async function loadHistory() {
  const val = await loadGistKey('_cultivation_history', null)
  if (val !== null) return val
  try { return JSON.parse(localStorage.getItem(LS_HISTORY_KEY) || '[]') } catch { return [] }
}

/** 保存突破历史 */
export async function saveHistory(history) {
  try { localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(history)) } catch { /* 静默 */ }
  await saveGistKey('_cultivation_history', history)
}
