/**
 * Cloudflare Worker — 阅读量计数器
 *
 * 部署方式：
 * 1. 注册 Cloudflare（免费）→ Workers & Pages
 * 2. 创建 Worker → 粘贴本文件代码
 * 3. 将 WORKER_URL 填入前端 src/utils/gistCounter.js
 *
 * 本 Worker 使用 Cloudflare KV 存储计数（需要绑定 KV namespace）。
 * 如不使用 KV，也可以直接用 Worker 自带的缓存（但重启会丢失）。
 */

// ===== 如不使用 KV，注释掉下面这行即可使用内存缓存 =====
// const COUNTERS = {}

export default {
  async fetch(request) {
    const url = new URL(request.url)
    const action = url.searchParams.get('action') || ''

    // 优先使用 KV（需在 Cloudflare Dashboard 绑定）
    // 创建 KV: Workers → KV → 创建命名空间 "COUNTERS"
    // 绑定: Worker 设置 → KV 命名空间绑定 → 变量名 COUNTERS

    try {
      if (request.method === 'GET' && action === 'get') {
        // 读取数据
        const raw = typeof COUNTERS !== 'undefined'
          ? await COUNTERS.get('counts', 'text')
          : null
        return new Response(raw || '{}', {
          headers: { 'Content-Type': 'application/json' },
        })
      }

      if (request.method === 'POST' && action === 'set') {
        const { data } = await request.json()

        if (typeof COUNTERS !== 'undefined') {
          await COUNTERS.put('counts', JSON.stringify(data))
        }

        return new Response(JSON.stringify({ ok: true }), {
          headers: { 'Content-Type': 'application/json' },
        })
      }

      return new Response('Not Found', { status: 404 })
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 })
    }
  },
}
