/**
 * GitHub Gist 阅读量计数器（向后兼容）
 *
 * 委托到统一 gistStore 模块。
 * 不建议在新代码中直接使用此文件，请使用 src/utils/gistStore.js。
 */

import { addPageView as storeAddPageView, isGistConfigured } from './gistStore'

/** 检查 Gist 是否已配置 */
export function isCounterConfigured() {
  return isGistConfigured()
}

/**
 * 获取当前计数并递增（委托到 gistStore）
 */
export async function addPageView(slug, step = 4) {
  return storeAddPageView(slug, step)
}
