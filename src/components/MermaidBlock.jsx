import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

// 全局初始化（只执行一次）
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  suppressErrors: true,
})

/**
 * Mermaid / Sequence 图表渲染组件
 */
export default function MermaidBlock({ chart, language }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const ref = useRef(null)
  const [error, setError] = useState(null)
  const idRef = useRef(
    `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  )

  useEffect(() => {
    if (!chart) return

    const id = idRef.current
    let mermaidCode = chart

    // sequence 自动补全
    if (language === 'sequence' && !chart.trim().startsWith('sequenceDiagram')) {
      mermaidCode = `sequenceDiagram\n${chart}`
    }

    setError(null)

    const timer = setTimeout(() => {
      if (!ref.current) return
      mermaid
        .render(id, mermaidCode)
        .then(({ svg }) => {
          if (ref.current) {
            ref.current.innerHTML = svg
          }
        })
        .catch((err) => {
          console.error('Mermaid 渲染失败:', err)
          setError(err.message)
        })
    }, 50) // 延迟执行确保 DOM 已挂载

    return () => clearTimeout(timer)
  }, [chart, language])

  if (!mounted) return <div className="mermaid-wrapper" style={{ minHeight: 60 }} />

  if (error) {
    return (
      <div className="mermaid-wrapper" style={{ color: '#e74c3c', fontSize: 13 }}>
        Mermaid 渲染失败: {error}
      </div>
    )
  }

  return <div className="mermaid-wrapper" ref={ref} />
}
