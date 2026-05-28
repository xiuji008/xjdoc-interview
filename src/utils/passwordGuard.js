/**
 * 密码保护工具
 *
 * 破坏性操作（清空数据等）需密码确认。
 * 密码以 SHA-256 哈希形式存储在代码中，不存明文。
 */

// "xj2026" 的 SHA-256 哈希
const PASSWORD_HASH = 'a48b9144a72047f32341fe177b1240fbb2f189cb2b80c1b9bf4725d296ea0513'

/**
 * 验证密码是否正确
 * @param {string} input 用户输入的密码
 * @returns {boolean}
 */
export async function verifyPassword(input) {
  const hash = await sha256(input)
  return hash === PASSWORD_HASH
}

/**
 * SHA-256 哈希计算
 */
async function sha256(str) {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}
