import { useRef, useEffect, useState } from 'react'

const REALM_COLORS = {
  lianqi: '#4FC3F7',
  zhuji: '#66BB6A',
  jindan: '#FFD700',
  yuanying: '#AB47BC',
  huashen: '#FF7043',
  lianxu: '#78909C',
  heti: '#EC407A',
  dacheng: '#FFA726',
  dujie: '#EF5350',
  god: '#00E5FF',
}

export default function CultivationTimeline({ history, currentRealm, currentStage, currentScore, onClose, onReplay }) {
  const listRef = useRef(null)
  const [hoveredId, setHoveredId] = useState(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [])

  const allEntries = [...history]
  const totalEntries = allEntries.length

  return (
    <div className="timeline-overlay" onClick={onClose}>
      <div className="timeline-modal" onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div className="timeline-header">
          <div className="timeline-title">📜 成神之路</div>
          <div className="timeline-subtitle">
            当前：{currentRealm.name}{currentStage ? ` · ${currentStage.name}` : ''}（修为 {currentScore}）
          </div>
          <div className="timeline-summary">
            共 <strong>{totalEntries}</strong> 次突破
            · 大境界突破 <strong>{allEntries.filter((e) => e.isRealmBreakthrough).length}</strong> 次
          </div>
          <button className="timeline-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* 时间轴 */}
        <div className="timeline-body" ref={listRef}>
          <div className="timeline-line" />

          {allEntries.length === 0 && (
            <div className="timeline-empty">
              <span className="timeline-empty-icon">🌱</span>
              <p>尚未有突破记录</p>
              <p className="timeline-empty-hint">添加文档开始修炼之路</p>
            </div>
          )}

          {allEntries.map((entry, i) => {
            const date = new Date(entry.timestamp)
            const color = REALM_COLORS[entry.newRealmId] || '#888'
            const isLast = i === allEntries.length - 1
            const isBreakthrough = entry.isRealmBreakthrough
            const key = entry.timestamp + i

            return (
              <div
                key={key}
                className={`timeline-node ${isBreakthrough ? 'breakthrough' : ''}`}
                style={{ '--node-color': color }}
                onMouseEnter={() => setHoveredId(key)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* 节点圆 */}
                <div className="timeline-dot" style={{ borderColor: color, background: isBreakthrough ? color : 'transparent' }}>
                  {isBreakthrough ? '⚡' : '·'}
                </div>

                {/* 内容卡片 - 点击回放动画 */}
                <div
                  className="timeline-card"
                  style={{
                    borderColor: hoveredId === key ? color : 'transparent',
                    boxShadow: hoveredId === key ? `0 0 20px ${color}40` : 'none',
                  }}
                  onClick={() => onReplay(entry)}
                  title="点击回放突破动画"
                >
                  <div className="timeline-card-top">
                    <span className="timeline-date">
                      {date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                      {' '}
                      {date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isBreakthrough && <span className="timeline-badge" style={{ background: color }}>突破</span>}
                  </div>
                  <div className="timeline-card-main">
                    <span className="timeline-old" style={isBreakthrough ? { color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' } : {}}>
                      {entry.prevRealm}
                      {entry.prevStage ? ` · ${entry.prevStage}` : ''}
                    </span>
                    <span className="timeline-arrow">→</span>
                    <span className="timeline-new" style={{ color }}>
                      {entry.newRealm}
                      {entry.newStage ? ` · ${entry.newStage}` : ''}
                    </span>
                  </div>
                  <div className="timeline-score">
                    修为 {entry.prevScore} → {entry.newScore}
                    <span className="timeline-gain">(+{entry.newScore - entry.prevScore})</span>
                  </div>

                  {/* hover 播放提示 */}
                  <div className="timeline-replay-hint" style={{ color }}>
                    ▶ 点击回放
                  </div>
                </div>
              </div>
            )
          })}

          {/* 当前节点 */}
          <div className="timeline-node current" style={{ '--node-color': currentRealm.color }}>
            <div className="timeline-dot" style={{ borderColor: currentRealm.color, background: currentRealm.color, boxShadow: `0 0 12px ${currentRealm.color}` }}>
              ✦
            </div>
            <div className="timeline-card current-card">
              <div className="timeline-card-main">
                <span className="timeline-new" style={{ color: currentRealm.color }}>当前 · {currentRealm.name}{currentStage ? ` · ${currentStage.name}` : ''}</span>
              </div>
              <div className="timeline-score">修为 {currentScore}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
