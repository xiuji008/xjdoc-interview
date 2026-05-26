/**
 * 阅读量统计组件
 *
 * 基于 GitHub Gist API 实现跨浏览器/跨设备持久化计数。
 * 未配置 Gist 时不显示计数。
 */

import { useState, useEffect, useRef } from 'react'
import { addPageView, isCounterConfigured } from '../utils/gistCounter'

const STEP = 1

export default function PageViews({ slug }) {
  const [count, setCount] = useState(null)
  const countedRef = useRef(false)

  useEffect(() => {
    if (!slug || countedRef.current) return
    countedRef.current = true

    if (isCounterConfigured()) {
      addPageView(slug, STEP)
        .then((val) => {
          if (val > 0) setCount(val)
        })
        .catch(() => {})
    }
  }, [slug])

  if (count === null) return null

  return (
    <span className="page-views" title="阅读次数">
      👁️ {count}
    </span>
  )
}
