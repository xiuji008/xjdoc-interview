import { useEffect, useState } from 'react'

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

export default function LevelUpAnimation({ entry, onClose }) {
  const [phase, setPhase] = useState('enter')
  const [particles, setParticles] = useState([])

  useEffect(() => {
    setTimeout(() => setPhase('active'), 100)

    const p = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 2,
      delay: Math.random() * 2.5,
      duration: Math.random() * 2.5 + 1,
      driftX: (Math.random() - 0.5) * 300,
      driftY: (Math.random() - 0.5) * 300 - 120,
      color: [REALM_COLORS[entry.newRealmId], '#FFD700', '#fff'][Math.floor(Math.random() * 3)],
    }))
    setParticles(p)

    const timer = setTimeout(() => {
      setPhase('exit')
      setTimeout(onClose, 800)
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  const isBreakthrough = entry.isRealmBreakthrough
  const color = REALM_COLORS[entry.newRealmId] || '#FFD700'

  return (
    <div className={`levelup-overlay ${phase}`} onClick={onClose} style={{ '--anim-color': color }}>
      {/* 粒子 */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="levelup-particle"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: `${p.size}px`, height: `${p.size}px`,
            background: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift-x': `${p.driftX}px`,
            '--drift-y': `${p.driftY}px`,
          }}
        />
      ))}

      {/* 光环 */}
      <div className="levelup-halo" style={{ background: `radial-gradient(circle, ${color}30 0%, transparent 70%)` }} />
      <div className="levelup-halo-2" style={{ background: `radial-gradient(circle, ${color}15 0%, transparent 60%)` }} />

      {/* 主内容 */}
      <div className="levelup-content">
        {isBreakthrough ? (
          <>
            <div className="levelup-badge" style={{ color }}>✦ 突 破 ✦</div>
            <div className="levelup-lightburst" style={{ borderColor: color }} />
            <div className="levelup-old-realm">{entry.prevRealm} · {entry.prevStage}</div>
            <div className="levelup-new-realm" style={{ color }}>{entry.newRealm}</div>
            <div className="levelup-stage-name">{entry.newStage}</div>
            <div className="levelup-subtitle" style={{ color }}>大境界突破！修为暴涨！</div>
          </>
        ) : (
          <>
            <div className="levelup-badge" style={{ color }}>◇ 精 进 ◇</div>
            <div className="levelup-new-realm" style={{ color }}>{entry.newRealm}</div>
            <div className="levelup-stage-name">{entry.newStage}</div>
            <div className="levelup-subtitle">修为精进，小层级提升</div>
          </>
        )}
        <div className="levelup-score">
          修为值: {entry.prevScore} → <strong style={{ color }}>{entry.newScore}</strong>
          <span className="levelup-gain"> (+{entry.newScore - entry.prevScore})</span>
        </div>
      </div>

      {/* 底部光柱 */}
      <div className="levelup-beam" style={{ background: `linear-gradient(transparent, ${color}20)` }} />
    </div>
  )
}
